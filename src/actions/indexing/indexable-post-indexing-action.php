<?php
/**
 * Reindexation action for indexables
 *
 * @package Yoast\WP\SEO\Actions\Indexing
 */

namespace Yoast\WP\SEO\Actions\Indexing;

use wpdb;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\ORM\Yoast_Model;

/**
 * Indexable_Reindex_Action class
 */
class Indexable_Post_Indexing_Action implements Indexing_Action_Interface {

	/**
	 * The post type helper
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * The indexable builder.
	 *
	 * @var Indexable_Builder
	 */
	protected $builder;

	/**
	 * The wpdb instance.
	 *
	 * @var wpdb
	 */
	private $wpdb;

	/**
	 * Indexable_Post_Indexing_Action constructor
	 *
	 * @param Post_Type_Helper  $post_type_helper The post type helper.
	 * @param Indexable_Builder $builder       The indexable builder.
	 * @param wpdb              $wpdb             The wpdb instance.
	 */
	public function __construct( Post_Type_Helper $post_type_helper, Indexable_Builder $builder, wpdb $wpdb ) {
		$this->post_type_helper = $post_type_helper;
		$this->builder          = $builder;
		$this->wpdb             = $wpdb;
	}

	/**
	 * The total number of unindexed posts.
	 *
	 * @return int The amount of unindexed posts.
	 */
	public function count() {
		$query = $this->get_query( true );

		return $this->wpdb->get_var( $query );
	}

	/**
	 * Creates indexables for unindexed posts.
	 *
	 * @return Indexable[] The created indexables.
	 */
	public function index() {
		/**
		 * Filter 'wpseo_post_indexing_limit' - Allow filtering the amount of posts indexed during each indexing pass.
		 *
		 * @api int The maximum number of posts indexed.
		 */
		$limit = \apply_filters( 'wpseo_post_indexing_limit', 25 );

		if ( ! \is_int( $limit ) || $limit < 1 ) {
			$limit = 25;
		}

		$query    = $this->get_query( false, $limit );
		$post_ids = $this->wpdb->get_col( $query );

		$indexables = [];
		foreach ( $post_ids as $post_id ) {
			$indexables[] = $this->builder->build_for_id_and_type( $post_id, 'post' );
		}
		return $indexables;
	}

	/**
	 * Queries the database for unindexed post IDs.
	 *
	 * @param bool $count Whether or not it should be a count query.
	 * @param int  $limit The maximum amount of post IDs to return.
	 *
	 * @return string The query.
	 */
	protected function get_query( $count, $limit = 1 ) {
		$public_post_types = $this->post_type_helper->get_public_post_types();
		$placeholders      = \implode( ', ', \array_fill( 0, \count( $public_post_types ), '%s' ) );
		$indexable_table   = Yoast_Model::get_table_name( 'Indexable' );
		$replacements      = $public_post_types;

		$select = 'posts.id';
		if ( $count ) {
			$select = 'COUNT(posts.id)';
		}
		$limit = '';
		if ( ! $count ) {
			$limit = 'LIMIT %d';
			$replacements[] = $limit;
		}

		return $this->wpdb->prepare( "SELECT $select FROM {$this->wpdb->posts} AS post
            WHERE posts.id NOT IN (SELECT object_id FROM $indexable_table WHERE object_type = 'post') AND posts.post_type IN ($placeholders)
            $limit", $replacements );
	}
}
