<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use wpdb;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Reindexing action for term indexables.
 */
class Indexable_Term_Indexation_Action implements Indexation_Action_Interface {

	/**
	 * The transient cache key.
	 */
	const TRANSIENT_CACHE_KEY = 'wpseo_total_unindexed_terms';

	/**
	 * The transient cache key for limited counts.
	 */
	const TRANSIENT_CACHE_KEY_LIMITED = 'wpseo_limited_unindexed_terms_count';

	/**
	 * The post type helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	private $wpdb;

	/**
	 * Indexable_Term_Indexation_Action constructor
	 *
	 * @param Taxonomy_Helper      $taxonomy   The taxonomy helper.
	 * @param Indexable_Repository $repository The indexable repository.
	 * @param wpdb                 $wpdb       The WordPress database instance.
	 */
	public function __construct( Taxonomy_Helper $taxonomy, Indexable_Repository $repository, wpdb $wpdb ) {
		$this->taxonomy   = $taxonomy;
		$this->repository = $repository;
		$this->wpdb       = $wpdb;
	}

	/**
	 * Returns the total number of unindexed terms.
	 *
	 * @param int|false $limit Limit the number of unindexed posts that are counted.
	 *
	 * @return int|false The number of unindexed terms. False if the query fails.
	 */
	public function get_total_unindexed( $limit = false ) {
		if ( $limit !== false ) {
			return $this->get_limited_unindexed_count( $limit );
		}

		$transient = \get_transient( static::TRANSIENT_CACHE_KEY );
		if ( $transient !== false ) {
			return (int) $transient;
		}

		$query = $this->get_count_query();

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Function get_count_query returns a prepared query.
		$count = $this->wpdb->get_var( $query );

		if ( \is_null( $count ) ) {
			return false;
		}

		// Limited queries have their own transient caching.
		if ( $limit === false ) {
			\set_transient( static::TRANSIENT_CACHE_KEY, $count, \DAY_IN_SECONDS );
		}

		return (int) $count;
	}

	/**
	 * Creates indexables for unindexed terms.
	 *
	 * @return Indexable[] The created indexables.
	 */
	public function index() {
		$query    = $this->get_select_query( $this->get_limit() );
		$term_ids = $this->wpdb->get_col( $query );

		$indexables = [];
		foreach ( $term_ids as $term_id ) {
			$indexables[] = $this->repository->find_by_id_and_type( (int) $term_id, 'term' );
		}

		\delete_transient( static::TRANSIENT_CACHE_KEY );

		return $indexables;
	}

	/**
	 * Returns the number of terms that will be indexed in a single indexing pass.
	 *
	 * @return int The limit.
	 */
	public function get_limit() {
		/**
		 * Filter 'wpseo_term_indexation_limit' - Allow filtering the number of terms indexed during each indexing pass.
		 *
		 * @api int The maximum number of terms indexed.
		 */
		$limit = \apply_filters( 'wpseo_term_indexation_limit', 25 );

		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = 25;
		}

		return $limit;
	}

	/**
	 * Builds a query for counting the number of unindexed terms.
	 *
	 * @param bool $limit The maximum amount of unindexed terms that should be counted.
	 *
	 * @return string The prepared query string.
	 */
	protected function get_count_query() {
		$indexable_table   = Model::get_table_name( 'Indexable' );
		$public_taxonomies = $this->taxonomy->get_public_taxonomies();

		// Warning: If this query is changed, makes sure to update the query in get_count_query as well.
		return $this->wpdb->prepare(
			"
			SELECT COUNT(term_id)
			FROM {$this->wpdb->term_taxonomy} AS T
			LEFT JOIN $indexable_table AS I
				ON T.term_id = I.object_id
				AND I.object_type = 'term'
				AND I.permalink_hash IS NOT NULL
			WHERE I.object_id IS NULL
				AND taxonomy IN (" . \implode( ', ', \array_fill( 0, \count( $public_taxonomies ), '%s' ) ) . ')',
			$public_taxonomies
		);
	}

	/**
	 * Returns a limited number of unindexed posts.
	 *
	 * @param int $limit Limit the maximum number of unindexed posts that are counted.
	 *
	 * @return int|false The limited number of unindexed posts. False if the query fails.
	 */
	protected function get_limited_unindexed_count( $limit ) {
		$transient = \get_transient( static::TRANSIENT_CACHE_KEY_LIMITED );
		if ( $transient !== false ) {
			return (int) $transient;
		}

		$query = $this->get_select_query( $limit );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Function get_select_query returns a prepared query.
		$unindexed_object_ids = $this->wpdb->get_col( $query );

		if ( \is_null( $unindexed_object_ids ) ) {
			return false;
		}

		$count = (int) count( $unindexed_object_ids );

		\set_transient( static::TRANSIENT_CACHE_KEY_LIMITED, $count, ( \MINUTE_IN_SECONDS * 15 ) );

		return $count;
	}

	/**
	 * Builds a query for selecting the ID's of unindexed terms.
	 *
	 * @param bool $limit The maximum number of term IDs to return.
	 *
	 * @return string The prepared query string.
	 */
	protected function get_select_query( $limit = false ) {
		$public_taxonomies = $this->taxonomy->get_public_taxonomies();
		$indexable_table   = Model::get_table_name( 'Indexable' );
		$replacements      = $public_taxonomies;

		$limit_query = '';
		if ( $limit ) {
			$limit_query    = 'LIMIT %d';
			$replacements[] = $limit;
		}

		// Warning: If this query is changed, makes sure to update the query in get_count_query as well.
		return $this->wpdb->prepare(
			"
			SELECT term_id
			FROM {$this->wpdb->term_taxonomy} AS T
			LEFT JOIN $indexable_table AS I
				ON T.term_id = I.object_id
				AND I.object_type = 'term'
				AND I.permalink_hash IS NOT NULL
			WHERE I.object_id IS NULL
				AND taxonomy IN (" . \implode( ', ', \array_fill( 0, \count( $public_taxonomies ), '%s' ) ) . ")
			$limit_query",
			$replacements
		);
	}
}
