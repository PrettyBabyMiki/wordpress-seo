<?php

namespace Yoast\WP\SEO\Actions\Indexing;

use wpdb;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Reindexing action for link indexables.
 */
abstract class Abstract_Link_Indexing_Action implements Indexation_Action_Interface {

	/**
	 * The transient name.
	 *
	 * @var string
	 */
	const UNINDEXED_COUNT_TRANSIENT = null;

	/**
	 * The transient cache key for limited counts.
	 *
	 * @var string
	 */
	const UNINDEXED_LIMITED_COUNT_TRANSIENT = self::UNINDEXED_COUNT_TRANSIENT . '_LIMITED';

	/**
	 * The link builder.
	 *
	 * @var Indexable_Link_Builder
	 */
	protected $link_builder;

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
	protected $wpdb;

	/**
	 * Indexable_Post_Indexing_Action constructor
	 *
	 * @param Indexable_Link_Builder $link_builder The indexable link builder.
	 * @param Indexable_Repository   $repository   The indexable repository.
	 * @param wpdb                   $wpdb         The WordPress database instance.
	 */
	public function __construct(
		Indexable_Link_Builder $link_builder,
		Indexable_Repository $repository,
		wpdb $wpdb
	) {
		$this->link_builder = $link_builder;
		$this->repository   = $repository;
		$this->wpdb         = $wpdb;
	}

	/**
	 * Returns the total number of unindexed links.
	 *
	 * @param int|false $limit Limit the number of unindexed posts that are counted.
	 *
	 * @return int|false The total number of unindexed links or `false` when there are no unindexed links.
	 */
	public function get_total_unindexed( $limit = false ) {
		// Limited queries are use to determine whether background indexing should occur, the exact number is irrelevant.
		if ( $limit !== false ) {
			return $this->get_limited_unindexed_count( $limit );
		}

		$transient = \get_transient( static::UNINDEXED_COUNT_TRANSIENT );
		if ( $transient !== false ) {
			return (int) $transient;
		}

		$query = $this->get_count_query();

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Function get_count_query returns a prepared query.
		$result = $this->wpdb->get_var( $query );
		if ( \is_null( $result ) ) {
			return false;
		}

		\set_transient( static::UNINDEXED_COUNT_TRANSIENT, $result, \DAY_IN_SECONDS );

		return (int) $result;
	}

	/**
	 * Returns a limited number of unindexed posts.
	 *
	 * @param int $limit Limit the maximum number of unindexed posts that are counted.
	 *
	 * @return int|false The limited number of unindexed posts. False if the query fails.
	 */
	protected function get_limited_unindexed_count( $limit ) {
		$transient = \get_transient( static::UNINDEXED_LIMITED_COUNT_TRANSIENT );
		if ( $transient !== false ) {
			return (int) $transient;
		}

		$query = $this->get_select_query( $limit );

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared -- Function get_select_query returns a prepared query.
		$post_ids = $this->wpdb->get_col( $query );

		if ( \is_null( $post_ids ) ) {
			return false;
		}

		$count = (int) count( $post_ids );

		\set_transient( static::UNINDEXED_LIMITED_COUNT_TRANSIENT, $count, ( \MINUTE_IN_SECONDS * 15 ) );

		return $count;
	}

	/**
	 * Builds links for indexables which haven't had their links indexed yet.
	 *
	 * @return SEO_Links[] The created SEO links.
	 */
	public function index() {
		$objects = $this->get_objects();

		$indexables = [];
		foreach ( $objects as $object ) {
			$indexable = $this->repository->find_by_id_and_type( $object->id, $object->type );
			$this->link_builder->build( $indexable, $object->content );
			$indexable->save();

			$indexables[] = $indexable;
		}

		\delete_transient( static::UNINDEXED_COUNT_TRANSIENT );

		return $indexables;
	}

	/**
	 * Returns the number of texts that will be indexed in a single link indexing pass.
	 *
	 * @return int The limit.
	 */
	public function get_limit() {
		/**
		 * Filter 'wpseo_link_indexing_limit' - Allow filtering the number of texts indexed during each link indexing pass.
		 *
		 * @api int The maximum number of texts indexed.
		 */
		return \apply_filters( 'wpseo_link_indexing_limit', 5 );
	}

	/**
	 * Returns objects to be indexed.
	 *
	 * @return array Objects to be indexed, should be an array of objects with object_id, object_type and content.
	 */
	abstract protected function get_objects();

	/**
	 * Builds a query for counting the number of unindexed links.
	 *
	 * @return string The prepared query string.
	 */
	abstract protected function get_count_query();

	/**
	 * Builds a query for selecting the ID's of unindexed links.
	 *
	 * @param bool $limit The maximum number of link IDs to return.
	 *
	 * @return string The prepared query string.
	 */
	abstract protected function get_select_query( $limit = false );
}
