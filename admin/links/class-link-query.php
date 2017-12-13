<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Database helper class.
 */
class WPSEO_Link_Query {

	const VERSION_NUMBER = 1;
	const POST_META_NAME = '_yst_internal_linking_version';

	/**
	 * Determine if there are any unprocessed public posts.
	 *
	 * @param array $post_types List of post types to check with.
	 *
	 * @return bool True if unprocessed posts are found, false if none are found.
	 */
	public static function has_unprocessed_posts( array $post_types ) {
		global $wpdb;

		if ( empty( $post_types ) ) {
			return false;
		}

		$post_types  = self::format_post_types( $post_types );
		$count_table = self::get_count_table_name();

		// Get any object which has not got the processed meta key.
		$query = '
			SELECT ID
			  FROM ' . $wpdb->posts . ' AS posts
		 LEFT JOIN ' . $count_table . ' AS yoast_meta
				ON yoast_meta.object_id = posts.ID
			 WHERE posts.post_status = "publish"
			   AND posts.post_type IN ( ' . $post_types . ' )
			   AND yoast_meta.internal_link_count IS NULL
			 LIMIT 1';

		// If anything is found, we have unprocessed posts.
		$results = $wpdb->get_var( $query );

		return ! empty( $results );
	}

	/**
	 * Filter out posts that have not been processed yet.
	 *
	 * @param array $post_ids Post IDs to filter.
	 *
	 * @return array
	 */
	public static function filter_unprocessed_posts( array $post_ids ) {
		global $wpdb;

		$post_ids = array_filter( $post_ids );
		if ( empty( $post_ids ) || array() === $post_ids ) {
			return $post_ids;
		}

		$count_table = self::get_count_table_name();

		$query = '
			SELECT object_id
			  FROM ' . $count_table . '
			 WHERE object_id IN ( ' . implode( ',', $post_ids ) . ' )
			';

		$results = $wpdb->get_results( $query, ARRAY_A );

		return array_map( 'intval', wp_list_pluck( $results, 'object_id' ) );
	}

	/**
	 * Returns a limited set of unindexed posts.
	 *
	 * @param array $post_types The post type.
	 * @param int   $limit      The limit for the resultset.
	 *
	 * @return array|null|object The set of unindexed posts.
	 */
	public static function get_unprocessed_posts( array $post_types, $limit = 5 ) {
		global $wpdb;

		$count_table = self::get_count_table_name();
		$post_types  = self::format_post_types( $post_types );

		// @codingStandardsIgnoreStart
		$query = 'SELECT posts.ID, posts.post_content
				  FROM ' . $wpdb->posts . ' AS posts
			 LEFT JOIN ' . $count_table . ' AS yoast_meta
			 		ON yoast_meta.object_id = posts.ID
				 WHERE posts.post_status = "publish"
				   AND posts.post_type IN ( ' . $post_types . ' )
	   ';

		$query .= sprintf( ' AND ( %s ) ', self::get_non_indexed_posts() );
		$query .= ' LIMIT %d';
		// @codingStandardsIgnoreEnd

		return $wpdb->get_results(
			$wpdb->prepare( $query, $limit )
		);
	}

	/**
	 * Returns the total amount of unindexed posts for given post type.
	 *
	 * @param array $post_types The post types.
	 *
	 * @return int The total of unindexed posts.
	 */
	public static function get_unprocessed_count( array $post_types ) {
		global $wpdb;

		if ( empty( $post_types ) ) {
			return 0;
		}

		$count_table = self::get_count_table_name();
		$post_types  = self::format_post_types( $post_types );

		// @codingStandardsIgnoreStart
		$query = '
			SELECT COUNT( posts.ID )
			  FROM ' . $wpdb->posts . ' AS posts
		 LEFT JOIN ' . $count_table . ' AS yoast_meta
				ON yoast_meta.object_id = posts.ID
			 WHERE posts.post_status = "publish"
			   AND posts.post_type IN ( ' . $post_types . ' )';

		$query .= sprintf( ' AND ( %s ) ', self::get_non_indexed_posts() );
		// @codingStandardsIgnoreEnd

		return (int) $wpdb->get_var( $query );
	}

	/**
	 * Returns the subquery for selecting the non indexed posts.
	 *
	 * @return string The subquery.
	 */
	protected static function get_non_indexed_posts() {
		global $wpdb;

		$query = 'yoast_meta.internal_link_count IS NULL';

		if ( self::requires_indexing() ) {
			$query .= sprintf(
				" OR posts.ID NOT IN( SELECT post_id FROM %s WHERE meta_key = '%s' AND meta_value = '%s' )",
				$wpdb->postmeta,
				esc_sql( self::POST_META_NAME ),
				esc_sql( self::VERSION_NUMBER )
			);
		}

		return $query;
	}

	/**
	 * Checks if indexing is required.
	 *
	 * @return bool True when indexing is required.
	 */
	protected static function requires_indexing() {
		// Version 1 is the situation where the site_url isn't equal to the site url.
		return self::VERSION_NUMBER === 1 && site_url() !== home_url();
	}

	/**
	 * Returns the table name where the counts are stored.
	 *
	 * @return string
	 */
	protected static function get_count_table_name() {
		$storage     = new WPSEO_Meta_Storage();
		$count_table = $storage->get_table_name();

		return $count_table;
	}

	/**
	 * Formats an array with post types as an SQL string.
	 *
	 * @param array $post_types The post types to format.
	 *
	 * @return array|string
	 */
	protected static function format_post_types( array $post_types ) {
		$sanitized_post_types = array_map( 'esc_sql', $post_types );
		$post_types           = sprintf( '"%s"', implode( '", "', $sanitized_post_types ) );

		return $post_types;
	}
}
