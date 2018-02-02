<?php
/**
 * @package WPSEO\Admin\XML Sitemaps
 */

/**
 * Class that handles the Admin side of XML sitemaps
 */
class WPSEO_Sitemaps_Admin {

	/**
	 * @var array Post_types that are being imported.
	 */
	private $importing_post_types = array();

	/**
	 * Class constructor
	 */
	public function __construct() {
		add_action( 'transition_post_status', array( $this, 'status_transition' ), 10, 3 );
		add_action( 'admin_footer', array( $this, 'status_transition_bulk_finished' ) );

		WPSEO_Sitemaps_Cache::register_clear_on_option_update( 'wpseo_titles', '' );
		WPSEO_Sitemaps_Cache::register_clear_on_option_update( 'wpseo', '' );
	}

	/**
	 * Hooked into transition_post_status. Will initiate search engine pings
	 * if the post is being published, is a post type that a sitemap is built for
	 * and is a post that is included in sitemaps.
	 *
	 * @param string   $new_status New post status.
	 * @param string   $old_status Old post status.
	 * @param \WP_Post $post       Post object.
	 */
	public function status_transition( $new_status, $old_status, $post ) {
		if ( $new_status !== 'publish' ) {
			return;
		}

		if ( defined( 'WP_IMPORTING' ) ) {
			$this->status_transition_bulk( $new_status, $old_status, $post );

			return;
		}

		$post_type = get_post_type( $post );

		wp_cache_delete( 'lastpostmodified:gmt:' . $post_type, 'timeinfo' ); // #17455.

		// None of our interest..
		if ( 'nav_menu_item' === $post_type ) {
			return;
		}

		$options = WPSEO_Options::get_option( 'wpseo_titles' );

		// If the post type is excluded in options, we can stop.
		if ( $options[ 'noindex-' . $post_type ] === true ) {
			return;
		}

		if ( WP_CACHE ) {
			wp_schedule_single_event( ( time() + 300 ), 'wpseo_hit_sitemap_index' );
		}

		/**
		 * Filter: 'wpseo_allow_xml_sitemap_ping' - Check if pinging is not allowed (allowed by default)
		 *
		 * @api boolean $allow_ping The boolean that is set to true by default.
		 */
		if ( apply_filters( 'wpseo_allow_xml_sitemap_ping', true ) === false ) {
			return;
		}

		// Allow the pinging to happen slightly after the hit sitemap index so the sitemap is fully regenerated when the ping happens.
		$excluded_posts = explode( ',', $options['excluded-posts'] );

		if ( ! in_array( $post->ID, $excluded_posts ) ) {

			if ( defined( 'YOAST_SEO_PING_IMMEDIATELY' ) && YOAST_SEO_PING_IMMEDIATELY ) {
				WPSEO_Sitemaps::ping_search_engines();
			}
			elseif ( ! wp_next_scheduled( 'wpseo_ping_search_engines' ) ) {
				wp_schedule_single_event( ( time() + 300 ), 'wpseo_ping_search_engines' );
			}
		}
	}

	/**
	 * While bulk importing, just save unique post_types
	 *
	 * When importing is done, if we have a post_type that is saved in the sitemap
	 * try to ping the search engines
	 *
	 * @param string   $new_status New post status.
	 * @param string   $old_status Old post status.
	 * @param \WP_Post $post       Post object.
	 */
	private function status_transition_bulk( $new_status, $old_status, $post ) {
		$this->importing_post_types[] = get_post_type( $post );
		$this->importing_post_types   = array_unique( $this->importing_post_types );
	}

	/**
	 * After import finished, walk through imported post_types and update info.
	 */
	public function status_transition_bulk_finished() {
		if ( ! defined( 'WP_IMPORTING' ) ) {
			return;
		}

		if ( empty( $this->importing_post_types ) ) {
			return;
		}

		$options = WPSEO_Options::get_option( 'wpseo_titles' );

		$ping_search_engines = false;

		foreach ( $this->importing_post_types as $post_type ) {
			wp_cache_delete( 'lastpostmodified:gmt:' . $post_type, 'timeinfo' ); // #17455.

			// Just have the cache deleted for nav_menu_item.
			if ( 'nav_menu_item' === $post_type ) {
				continue;
			}

			if ( $options[ 'noindex-' . $post_type ] === false ) {
				$ping_search_engines = true;
			}
		}

		// Nothing to do.
		if ( false === $ping_search_engines ) {
			return;
		}

		if ( WP_CACHE ) {
			do_action( 'wpseo_hit_sitemap_index' );
		}

		WPSEO_Sitemaps::ping_search_engines();
	}

	// @codeCoverageIgnoreStart
	/**
	 * Find sitemaps residing on disk as they will block our rewrite.
	 *
	 * @deprecated 6.4
gi	 */
	public function delete_sitemaps() {
		_deprecated_function( 'WPSEO_Sitemaps_Admin::delete_sitemaps', '6.4', null );
	}

	/**
	 * Find sitemaps residing on disk as they will block our rewrite.
	 *
	 * @deprecated since 6.4
	 */
	public function detect_blocking_filesystem_sitemaps() {
		_deprecated_function( 'WPSEO_Sitemaps_Admin::delete_sitemaps', '6.4', null );
	}
	// @codeCoverageIgnoreEnd
} /* End of class */
