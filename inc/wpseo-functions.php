<?php
/**
 * @package WPSEO\Internals
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! function_exists( 'initialize_wpseo_front' ) ) {
	/**
	 * Wraps frontend class.
	 */
	function initialize_wpseo_front() {
		WPSEO_Frontend::get_instance();
	}
}


if ( ! function_exists( 'yoast_breadcrumb' ) ) {
	/**
	 * Template tag for breadcrumbs.
	 *
	 * @param string $before  What to show before the breadcrumb.
	 * @param string $after   What to show after the breadcrumb.
	 * @param bool   $display Whether to display the breadcrumb (true) or return it (false).
	 *
	 * @return string
	 */
	function yoast_breadcrumb( $before = '', $after = '', $display = true ) {
		$breadcrumbs_enabled = current_theme_supports( 'yoast-seo-breadcrumbs' );
		if ( ! $breadcrumbs_enabled ) {
			$options             = get_option( 'wpseo_internallinks' );
			$breadcrumbs_enabled = ( $options['breadcrumbs-enable'] === true );
		}

		if ( $breadcrumbs_enabled ) {
			return WPSEO_Breadcrumbs::breadcrumb( $before, $after, $display );
		}
	}
}

/**
 * Add the bulk edit capability to the proper default roles.
 */
function wpseo_add_capabilities() {
	$roles = array(
		'administrator',
		'editor',
	);

	$roles = apply_filters( 'wpseo_bulk_edit_roles', $roles );

	foreach ( $roles as $role ) {
		$r = get_role( $role );
		if ( $r ) {
			$r->add_cap( 'wpseo_bulk_edit' );
		}
	}
}


/**
 * Remove the bulk edit capability from the proper default roles.
 *
 * Contributor is still removed for legacy reasons.
 */
function wpseo_remove_capabilities() {
	$roles = array(
		'administrator',
		'editor',
		'author',
		'contributor',
	);

	$roles = apply_filters( 'wpseo_bulk_edit_roles', $roles );

	foreach ( $roles as $role ) {
		$r = get_role( $role );
		if ( $r ) {
			$r->remove_cap( 'wpseo_bulk_edit' );
		}
	}
}


/**
 * Replace `%%variable_placeholders%%` with their real value based on the current requested page/post/cpt
 *
 * @param string $string the string to replace the variables in.
 * @param object $args   the object some of the replacement values might come from, could be a post, taxonomy or term.
 * @param array  $omit   variables that should not be replaced by this function.
 *
 * @return string
 */
function wpseo_replace_vars( $string, $args, $omit = array() ) {
	$replacer = new WPSEO_Replace_Vars;

	return $replacer->replace( $string, $args, $omit );
}

/**
 * Register a new variable replacement
 *
 * This function is for use by other plugins/themes to easily add their own additional variables to replace.
 * This function should be called from a function on the 'wpseo_register_extra_replacements' action hook.
 * The use of this function is preferred over the older 'wpseo_replacements' filter as a way to add new replacements.
 * The 'wpseo_replacements' filter should still be used to adjust standard WPSEO replacement values.
 * The function can not be used to replace standard WPSEO replacement value functions and will thrown a warning
 * if you accidently try.
 * To avoid conflicts with variables registered by WPSEO and other themes/plugins, try and make the
 * name of your variable unique. Variable names also can not start with "%%cf_" or "%%ct_" as these are reserved
 * for the standard WPSEO variable variables 'cf_<custom-field-name>', 'ct_<custom-tax-name>' and
 * 'ct_desc_<custom-tax-name>'.
 * The replacement function will be passed the undelimited name (i.e. stripped of the %%) of the variable
 * to replace in case you need it.
 *
 * Example code:
 * <code>
 * <?php
 * function retrieve_var1_replacement( $var1 ) {
 *        return 'your replacement value';
 * }
 *
 * function register_my_plugin_extra_replacements() {
 *        wpseo_register_var_replacement( '%%myvar1%%', 'retrieve_var1_replacement', 'advanced', 'this is a help text for myvar1' );
 *        wpseo_register_var_replacement( 'myvar2', array( 'class', 'method_name' ), 'basic', 'this is a help text for myvar2' );
 * }
 * add_action( 'wpseo_register_extra_replacements', 'register_my_plugin_extra_replacements' );
 * ?>
 * </code>
 *
 * @since 1.5.4
 *
 * @param  string $var              The name of the variable to replace, i.e. '%%var%%'
 *                                  - the surrounding %% are optional, name can only contain [A-Za-z0-9_-].
 * @param  mixed  $replace_function Function or method to call to retrieve the replacement value for the variable
 *                                  Uses the same format as add_filter/add_action function parameter and
 *                                  should *return* the replacement value. DON'T echo it.
 * @param  string $type             Type of variable: 'basic' or 'advanced', defaults to 'advanced'.
 * @param  string $help_text        Help text to be added to the help tab for this variable.
 *
 * @return bool  Whether the replacement function was succesfully registered
 */
function wpseo_register_var_replacement( $var, $replace_function, $type = 'advanced', $help_text = '' ) {
	return WPSEO_Replace_Vars::register_replacement( $var, $replace_function, $type, $help_text );
}

/**
 * Create base URL for the sitemaps and applies filters
 *
 * @since 1.5.7
 *
 * @param string $page page to append to the base URL.
 *
 * @return string base URL (incl page) for the sitemaps
 */
function wpseo_xml_sitemaps_base_url( $page ) {
	$base = $GLOBALS['wp_rewrite']->using_index_permalinks() ? 'index.php/' : '/';

	/**
	 * Filter: 'wpseo_sitemaps_base_url' - Allow developer to change the base URL of the sitemaps
	 *
	 * @api string $base The string that should be added to home_url() to make the full base URL.
	 */
	$base = apply_filters( 'wpseo_sitemaps_base_url', $base );

	// Get the scheme from the configured home url instead of letting WordPress determine the scheme based on the requested URI.
	return home_url( $base . $page, parse_url( get_option( 'home' ), PHP_URL_SCHEME ) );
}

/**
 * Notify search engines of the updated sitemap.
 *
 * @param string|null $sitemapurl Optional URL to make the ping for.
 */
function wpseo_ping_search_engines( $sitemapurl = null ) {
	// Don't ping if blog is not public.
	if ( '0' == get_option( 'blog_public' ) ) {
		return;
	}

	if ( $sitemapurl == null ) {
		$sitemapurl = urlencode( wpseo_xml_sitemaps_base_url( 'sitemap_index.xml' ) );
	}

	// Ping Google and Bing.
	wp_remote_get( 'http://www.google.com/webmasters/tools/ping?sitemap=' . $sitemapurl, array( 'blocking' => false ) );
	wp_remote_get( 'http://www.bing.com/ping?sitemap=' . $sitemapurl, array( 'blocking' => false ) );
}

add_action( 'wpseo_ping_search_engines', 'wpseo_ping_search_engines' );

/**
 * WPML plugin support: Set titles for custom types / taxonomies as translatable.
 * It adds new keys to a wpml-config.xml file for a custom post type title, metadesc, title-ptarchive and metadesc-ptarchive fields translation.
 * Documentation: http://wpml.org/documentation/support/language-configuration-files/
 *
 * @global      $sitepress
 *
 * @param array $config WPML configuration data to filter.
 *
 * @return array
 */
function wpseo_wpml_config( $config ) {
	global $sitepress;

	if ( ( is_array( $config ) && isset( $config['wpml-config']['admin-texts']['key'] ) ) && ( is_array( $config['wpml-config']['admin-texts']['key'] ) && $config['wpml-config']['admin-texts']['key'] !== array() ) ) {
		$admin_texts = $config['wpml-config']['admin-texts']['key'];
		foreach ( $admin_texts as $k => $val ) {
			if ( $val['attr']['name'] === 'wpseo_titles' ) {
				$translate_cp = array_keys( $sitepress->get_translatable_documents() );
				if ( is_array( $translate_cp ) && $translate_cp !== array() ) {
					foreach ( $translate_cp as $post_type ) {
						$admin_texts[ $k ]['key'][]['attr']['name'] = 'title-' . $post_type;
						$admin_texts[ $k ]['key'][]['attr']['name'] = 'metadesc-' . $post_type;
						$admin_texts[ $k ]['key'][]['attr']['name'] = 'metakey-' . $post_type;
						$admin_texts[ $k ]['key'][]['attr']['name'] = 'title-ptarchive-' . $post_type;
						$admin_texts[ $k ]['key'][]['attr']['name'] = 'metadesc-ptarchive-' . $post_type;
						$admin_texts[ $k ]['key'][]['attr']['name'] = 'metakey-ptarchive-' . $post_type;

						$translate_tax = $sitepress->get_translatable_taxonomies( false, $post_type );
						if ( is_array( $translate_tax ) && $translate_tax !== array() ) {
							foreach ( $translate_tax as $taxonomy ) {
								$admin_texts[ $k ]['key'][]['attr']['name'] = 'title-tax-' . $taxonomy;
								$admin_texts[ $k ]['key'][]['attr']['name'] = 'metadesc-tax-' . $taxonomy;
								$admin_texts[ $k ]['key'][]['attr']['name'] = 'metakey-tax-' . $taxonomy;
							}
						}
					}
				}
				break;
			}
		}
		$config['wpml-config']['admin-texts']['key'] = $admin_texts;
	}

	return $config;
}

add_filter( 'icl_wpml_config_array', 'wpseo_wpml_config' );

/**
 * Yoast SEO breadcrumb shortcode
 * [wpseo_breadcrumb]
 *
 * @return string
 */
function wpseo_shortcode_yoast_breadcrumb() {
	return yoast_breadcrumb( '', '', false );
}

add_shortcode( 'wpseo_breadcrumb', 'wpseo_shortcode_yoast_breadcrumb' );


/**
 * This invalidates our XML Sitemaps cache.
 *
 * @param string $type Type of sitemap to invalidate.
 */
function wpseo_invalidate_sitemap_cache( $type ) {
	// Always delete the main index sitemaps cache, as that's always invalidated by any other change.
	delete_transient( 'wpseo_sitemap_cache_1' );
	delete_transient( 'wpseo_sitemap_cache_' . $type );

	WPSEO_Sitemaps_Cache::clear( array( $type ) );
}

add_action( 'deleted_term_relationships', 'wpseo_invalidate_sitemap_cache' );

/**
 * Invalidate XML sitemap cache for taxonomy / term actions
 *
 * @param int    $unused Unused term ID value.
 * @param string $type   Taxonomy to invalidate.
 */
function wpseo_invalidate_sitemap_cache_terms( $unused, $type ) {
	wpseo_invalidate_sitemap_cache( $type );
}

add_action( 'edited_terms', 'wpseo_invalidate_sitemap_cache_terms', 10, 2 );
add_action( 'clean_term_cache', 'wpseo_invalidate_sitemap_cache_terms', 10, 2 );
add_action( 'clean_object_term_cache', 'wpseo_invalidate_sitemap_cache_terms', 10, 2 );

/**
 * Invalidate the XML sitemap cache for a post type when publishing or updating a post
 *
 * @param int $post_id Post ID to determine post type for invalidation.
 */
function wpseo_invalidate_sitemap_cache_on_save_post( $post_id ) {

	// If this is just a revision, don't invalidate the sitemap cache yet.
	if ( wp_is_post_revision( $post_id ) ) {
		return;
	}

	wpseo_invalidate_sitemap_cache( get_post_type( $post_id ) );
}

add_action( 'save_post', 'wpseo_invalidate_sitemap_cache_on_save_post' );

/**
 * Emulate PHP native ctype_digit() function for when the ctype extension would be disabled *sigh*
 * Only emulates the behaviour for when the input is a string, does not handle integer input as ascii value
 *
 * @param    string $string
 *
 * @return    bool
 */
if ( ! extension_loaded( 'ctype' ) || ! function_exists( 'ctype_digit' ) ) {

	/**
	 * @param string $string String input to validate.
	 *
	 * @return bool
	 */
	function ctype_digit( $string ) {
		$return = false;
		if ( ( is_string( $string ) && $string !== '' ) && preg_match( '`^\d+$`', $string ) === 1 ) {
			$return = true;
		}

		return $return;
	}
}
