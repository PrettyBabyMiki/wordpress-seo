<?php
/*
Plugin Name: WordPress SEO
Version: 1.5.0-beta
Plugin URI: http://yoast.com/wordpress/seo/#utm_source=wpadmin&utm_medium=plugin&utm_campaign=wpseoplugin
Description: The first true all-in-one SEO solution for WordPress, including on-page content analysis, XML sitemaps and much more.
Author: Joost de Valk
Author URI: http://yoast.com/
Text Domain: wordpress-seo
Domain Path: /languages/
License: GPL v3

WordPress SEO Plugin
Copyright (C) 2008-2014, Joost de Valk - joost@yoast.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @package Main
 */

if ( ! defined( 'DB_NAME' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}

if ( ! defined( 'WPSEO_PATH' ) )
	define( 'WPSEO_PATH', plugin_dir_path( __FILE__ ) );
if ( ! defined( 'WPSEO_BASENAME' ) )
	define( 'WPSEO_BASENAME', plugin_basename( __FILE__ ) );

define( 'WPSEO_FILE', __FILE__ );

function wpseo_load_textdomain() {
	load_plugin_textdomain( 'wordpress-seo', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );
}
add_filter( 'init', 'wpseo_load_textdomain', 1 );


if ( version_compare( PHP_VERSION, '5.2', '<' ) ) {
	if ( is_admin() && ( ! defined( 'DOING_AJAX' ) || ! DOING_AJAX ) ) {
		require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		deactivate_plugins( __FILE__ );
		wp_die( sprintf( __( 'WordPress SEO requires PHP 5.2 or higher, as does WordPress 3.2 and higher. The plugin has now disabled itself. For more info, %s$1see this post%s$2.', 'wordpress-seo' ), '<a href="http://yoast.com/requires-php-52/">', '</a>' ) );
	}
	else {
		return;
	}
}

define( 'WPSEO_VERSION', '1.5.0-beta' );

/**
 * Auto load our class files
 *
 * @todo add all classes and remove includes, but make sure that they are all initiated when needed
 * either through a static call or a new instance
 *
 * @param   string  $class  Class name
 * @return    void
 */
function wpseo_auto_load( $class ) {
	static $classes = null;

	if ( $classes === null ) {
		$classes = array(
			'wpseo_admin'                        => WPSEO_PATH . 'admin/class-admin.php',
			'wpseo_bulk_title_editor_list_table' => WPSEO_PATH . 'admin/class-bulk-title-editor-list-table.php', //done
			'wpseo_bulk_description_list_table'  => WPSEO_PATH . 'admin/class-bulk-description-editor-list-table.php', //done
			'wpseo_admin_pages'                  => WPSEO_PATH . 'admin/class-config.php',
			'wpseo_metabox'                      => WPSEO_PATH . 'admin/class-metabox.php',
			'wpseo_social_admin'                 => WPSEO_PATH . 'admin/class-opengraph-admin.php',
			'wpseo_pointers'                     => WPSEO_PATH . 'admin/class-pointers.php', //done
			'wpseo_sitemaps_admin'               => WPSEO_PATH . 'admin/class-sitemaps-admin.php',
			'wpseo_taxonomy'                     => WPSEO_PATH . 'admin/class-taxonomy.php',
			'yoast_tracking'                     => WPSEO_PATH . 'admin/class-tracking.php', //done
			'yoast_textstatistics'               => WPSEO_PATH . 'admin/TextStatistics.php', //done
			'wpseo_breadcrumbs'                  => WPSEO_PATH . 'frontend/class-breadcrumbs.php', //done
			'wpseo_frontend'                     => WPSEO_PATH . 'frontend/class-frontend.php',
			'wpseo_opengraph'                    => WPSEO_PATH . 'frontend/class-opengraph.php',
			'wpseo_twitter'                      => WPSEO_PATH . 'frontend/class-twitter.php',
			'wpseo_rewrite'                      => WPSEO_PATH . 'inc/class-rewrite.php',
			'wpseo_sitemaps'                     => WPSEO_PATH . 'inc/class-sitemaps.php',
			'sitemap_walker'                     => WPSEO_PATH . 'inc/class-sitemap-walker.php',
			'wpseo_options'                      => WPSEO_PATH . 'inc/class-wpseo-options.php',
			'wpseo_meta'                         => WPSEO_PATH . 'inc/class-wpseo-meta.php',

			'wp_list_table'                      => ABSPATH . 'wp-admin/includes/class-wp-list-table.php', //done
		);
	}

	$cn = strtolower( $class );

	if ( isset( $classes[$cn] ) ) {
		require_once( $classes[$cn] );
	}
}
spl_autoload_register( 'wpseo_auto_load' );





function wpseo_init() {
	require_once( WPSEO_PATH . 'inc/wpseo-functions.php' );

	$options = WPSEO_Options::get_all();

	if ( $options['stripcategorybase'] === true )
		require_once( WPSEO_PATH . 'inc/class-rewrite.php' );

	if ( $options['enablexmlsitemap'] === true )
		require_once( WPSEO_PATH . 'inc/class-sitemaps.php' );
}

/**
 * Used to load the required files on the plugins_loaded hook, instead of immediately.
 */
function wpseo_frontend_init() {
	$options = WPSEO_Options::get_all();
	require_once( WPSEO_PATH . 'frontend/class-frontend.php' );

	if ( $options['breadcrumbs-enable'] === true ) {
		$GLOBALS['wpseo_bc'] = new WPSEO_Breadcrumbs();
	}
	if ( $options['twitter'] === true ) {
		require_once( WPSEO_PATH . 'frontend/class-twitter.php' );
	}
	if ( $options['opengraph'] === true ) {
		require_once( WPSEO_PATH . 'frontend/class-opengraph.php' );
	}
}

/**
 * Used to load the required files on the plugins_loaded hook, instead of immediately.
 */
function wpseo_admin_init() {
	$options = WPSEO_Options::get_all();
	if ( isset( $_GET['wpseo_restart_tour'] ) ) {
		$options['ignore_tour'] = false;
		update_option( 'wpseo', $options );
	}

	if ( $options['yoast_tracking'] === true ) {
		/**
		 * @internal this is not a proper lean loading implementation (method_exist will autoload the class),
		 * but it can't be helped as there are other plugins out there which also use versions
		 * of the Yoast Tracking class and we need to take that into account unfortunately
		 */
		if ( method_exists( 'Yoast_Tracking', 'get_instance' ) ) {
			add_action( 'yoast_tracking', array( 'Yoast_Tracking', 'get_instance' ) );
		}
		else {
			$yoast_tracking = new Yoast_Tracking;
		}
	}

	require_once( WPSEO_PATH . 'admin/class-admin.php' );

	global $pagenow;
	if ( in_array( $pagenow, array( 'edit.php', 'post.php', 'post-new.php' ) ) ) {
		require_once( WPSEO_PATH . 'admin/class-metabox.php' );
		if ( $options['opengraph'] === true )
			require_once( WPSEO_PATH . 'admin/class-opengraph-admin.php' );
	}

	if ( in_array( $pagenow, array( 'edit-tags.php' ) ) )
		require_once( WPSEO_PATH . 'admin/class-taxonomy.php' );

	if ( in_array( $pagenow, array( 'admin.php' ) ) )
		require_once( WPSEO_PATH . 'admin/class-config.php' );

	if ( ( version_compare( $GLOBALS['wp_version'], '3.4', '>=' ) && current_user_can( 'manage_options' ) ) && ( $options['tracking_popup_done'] === false || $options['ignore_tour'] === false ) ) {
		add_action( 'admin_enqueue_scripts', array( 'WPSEO_Pointers', 'get_instance' ) );
	}

	if ( $options['enablexmlsitemap'] === true )
		require_once( WPSEO_PATH . 'admin/class-sitemaps-admin.php' );
}

add_action( 'plugins_loaded', 'wpseo_init', 14 );

if ( ! defined( 'DOING_AJAX' ) || ! DOING_AJAX )
	require_once( WPSEO_PATH . 'inc/wpseo-non-ajax-functions.php' );

if ( is_admin() ) {
	if ( defined( 'DOING_AJAX' ) && DOING_AJAX ) {
		require_once( WPSEO_PATH . 'admin/ajax.php' );
	}
	else {
		add_action( 'plugins_loaded', 'wpseo_admin_init', 15 );
	}

	register_activation_hook( __FILE__, 'wpseo_activate' );
	register_deactivation_hook( __FILE__, 'wpseo_deactivate' );
}
else {
	add_action( 'plugins_loaded', 'wpseo_frontend_init', 15 );
}
unset( $options );
