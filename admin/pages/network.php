<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

global $wpseo_admin_pages;

$options = get_site_option( 'wpseo_ms' );

if ( isset( $_POST['wpseo_submit'] ) ) {
	check_admin_referer( 'wpseo-network-settings' );

	foreach ( array( 'access', 'defaultblog' ) as $opt ) {
		$options[ $opt ] = $_POST['wpseo_ms'][ $opt ];
	}
	WPSEO_Options::update_site_option( 'wpseo_ms', $options );
	add_settings_error( 'wpseo_ms', 'settings_updated', __( 'Settings Updated.', 'wordpress-seo' ), 'updated' );
}

if ( isset( $_POST['wpseo_restore_blog'] ) ) {
	check_admin_referer( 'wpseo-network-restore' );
	if ( isset( $_POST['wpseo_ms']['restoreblog'] ) && is_numeric( $_POST['wpseo_ms']['restoreblog'] ) ) {
		$restoreblog = (int) WPSEO_Utils::validate_int( $_POST['wpseo_ms']['restoreblog'] );
		$blog        = get_blog_details( $restoreblog );

		if ( $blog ) {
			WPSEO_Options::reset_ms_blog( $restoreblog );
			add_settings_error( 'wpseo_ms', 'settings_updated', sprintf( __( '%s restored to default SEO settings.', 'wordpress-seo' ), esc_html( $blog->blogname ) ), 'updated' );
		}
		else {
			add_settings_error( 'wpseo_ms', 'settings_updated', sprintf( __( 'Blog %s not found.', 'wordpress-seo' ), esc_html( $restoreblog ) ), 'error' );
		}
		unset( $restoreblog );
	}
}

/* Set up selectbox dropdowns for smaller networks (usability) */
$use_dropdown = true;
if ( get_blog_count() > 100 ) {
	$use_dropdown = false;
}
else {
	$sites = wp_get_sites( array( 'deleted' => 0 ) );
	if ( is_array( $sites ) && $sites !== array() ) {
		$dropdown_input = array(
			'-' => __( 'None', 'wordpress-seo' ),
		);

		foreach ( $sites as $site ) {
			$dropdown_input[ $site['blog_id'] ] = $site['blog_id'] . ': ' . $site['domain'];

			$blog_states = array();
			if ( $site['public'] === '1' ) {
				$blog_states[] = __( 'public', 'wordpress-seo' );
			}
			if ( $site['archived'] === '1' ) {
				$blog_states[] = __( 'archived', 'wordpress-seo' );
			}
			if ( $site['mature'] === '1' ) {
				$blog_states[] = __( 'mature', 'wordpress-seo' );
			}
			if ( $site['spam'] === '1' ) {
				$blog_states[] = __( 'spam', 'wordpress-seo' );
			}
			if ( $blog_states !== array() ) {
				$dropdown_input[ $site['blog_id'] ] .= ' [' . implode( ', ', $blog_states ) . ']';
			}
		}
		unset( $site, $blog_states );
	}
	else {
		$use_dropdown = false;
	}
	unset( $sites );
}



$wpseo_admin_pages->admin_header( false, 'wpseo-network-settings', 'wpseo_ms' );

$content  = '<form method="post" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
$content .= wp_nonce_field( 'wpseo-network-settings', '_wpnonce', true, false );

/* @internal Important: Make sure the options added to the array here are in line with the options set in the WPSEO_Option_MS::$allowed_access_options property */
$content .= $wpseo_admin_pages->select(
	'access',
	__( 'Who should have access to the WordPress SEO settings', 'wordpress-seo' ),
	array(
		'admin'      => __( 'Site Admins (default)', 'wordpress-seo' ),
		'superadmin' => __( 'Super Admins only', 'wordpress-seo' )
	),
	'wpseo_ms'
);

if ( $use_dropdown === true ) {
	$content .= $wpseo_admin_pages->select(
		'defaultblog',
		__( 'New sites in the network inherit their SEO settings from this site', 'wordpress-seo' ),
		$dropdown_input,
		'wpseo_ms'
	);
	$content .= '<p>' . __( 'Choose the site whose settings you want to use as default for all sites that are added to your network. If you choose \'None\', the normal plugin defaults will be used.', 'wordpress-seo' ) . '</p>';
}
else {
	$content .= $wpseo_admin_pages->textinput( 'defaultblog', __( 'New sites in the network get the SEO settings from this site', 'wordpress-seo' ), 'wpseo_ms' );
	$content .= '<p>' . sprintf( __( 'Enter the %sSite ID%s for the site whose settings you want to use as default for all sites that are added to your network. Leave empty for none (i.e. the normal plugin defaults will be used).', 'wordpress-seo' ), '<a href="' . esc_url( network_admin_url( 'sites.php' ) ) . '">', '</a>' ) . '</p>';
}
	$content .= '<p><strong>' . __( 'Take note :', 'wordpress-seo' ) . '</strong> ' . __( 'Privacy sensitive (FB admins and such), theme specific (title rewrite) and a few very site specific settings will not be imported to new blogs.', 'wordpress-seo' ) . '</p>';


$content .= '<input type="submit" name="wpseo_submit" class="button-primary" value="' . __( 'Save MultiSite Settings', 'wordpress-seo' ) . '"/>';
$content .= '</form>';

$wpseo_admin_pages->postbox( 'wpseo_network_settings', __( 'MultiSite Settings', 'wordpress-seo' ), $content );


$content  = '<form method="post" accept-charset="' . esc_attr( get_bloginfo( 'charset' ) ) . '">';
$content .= wp_nonce_field( 'wpseo-network-restore', '_wpnonce', true, false );
$content .= '<p>' . __( 'Using this form you can reset a site to the default SEO settings.', 'wordpress-seo' ) . '</p>';

if ( $use_dropdown === true ) {
	unset( $dropdown_input['-'] );
	$content .= $wpseo_admin_pages->select(
		'restoreblog',
		__( 'Site ID', 'wordpress-seo' ),
		$dropdown_input,
		'wpseo_ms'
	);
}
else {
	$content .= $wpseo_admin_pages->textinput( 'restoreblog', __( 'Blog ID', 'wordpress-seo' ), 'wpseo_ms' );
}

$content .= '<input type="submit" name="wpseo_restore_blog" value="' . __( 'Restore site to defaults', 'wordpress-seo' ) . '" class="button"/>';
$content .= '</form>';

$wpseo_admin_pages->postbox( 'wpseo-network-restore', __( 'Restore site to default settings', 'wordpress-seo' ), $content );

$wpseo_admin_pages->admin_footer( false );
