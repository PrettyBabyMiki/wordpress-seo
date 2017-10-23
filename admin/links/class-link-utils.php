<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the utils for the links module.
 */
class WPSEO_Link_Utils {

	/**
	 * Returns all the supported public post types.
	 *
	 * @return array The supported public post types.
	 */
	public static function get_public_post_types() {
		$public_post_types = get_post_types( array( 'public' => true ) );

		return array_filter( $public_post_types, array( __CLASS__, 'filter_post_types' ) );
	}

	/**
	 * Returns the value that is part of the given url.
	 *
	 * @param string $url  The url to parse.
	 * @param string $part The url part to use.
	 *
	 * @return string The value of the url part.
	 */
	public static function get_url_part( $url, $part ) {
		$url_parts = wp_parse_url( $url );

		if ( isset( $url_parts[ $part ] ) ) {
			return $url_parts[ $part ];
		}

		return '';
	}

	/**
	 * Filters the post types to remove unwanted items.
	 *
	 * @param string $public_post_type The post type to filter.
	 *
	 * @return bool Returns true if it is kept, false if removed.
	 */
	protected static function filter_post_types( $public_post_type ) {
		return ! ( $public_post_type === 'attachment' );
	}
}
