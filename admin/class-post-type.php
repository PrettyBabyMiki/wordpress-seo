<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the post type utils.
 */
class WPSEO_Post_Type {

	/**
	 * Returns an array with the accessible post types.
	 *
	 * An accessible post type is a post type that is public and isn't set as no-index (robots)
	 *
	 * @return array
	 */
	public static function get_accessible_post_types() {
		$post_types = get_post_types( array( 'public' => true ) );
		$post_types = array_filter( $post_types, [ 'self', 'is_post_type_indexable' ] );

		/**
		 * Filter: 'wpseo_accessible_post_types' - Allow changing the accessible post types.
		 *
		 * @api array $post_types The public post types.
		 */
		$post_types = apply_filters( 'wpseo_accessible_post_types', $post_types );

		// When the array gets messed up somewhere.
		if ( ! is_array( $post_types ) ) {
			return array();
		}

		return $post_types;
	}

	/**
	 * Checks if the request post type is public indexable.
	 *
	 * @param string $post_type_name The name of the post type to lookup.
	 *
	 * @return bool True when post type is set to index.
	 */
	public static function is_post_type_indexable( $post_type_name ) {
		$option = WPSEO_Options::get_option( 'wpseo_titles' );

		if ( ! array_key_exists( 'noindex-' . $post_type_name, $option ) ) {
			return false;
		}

		return empty( $option[ 'noindex-' . $post_type_name ] );
	}
}
