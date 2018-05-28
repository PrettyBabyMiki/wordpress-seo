<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

$yform = Yoast_Form::get_instance();
$yform->admin_header( true, 'wpseo_ms' );

/* {@internal Important: Make sure the options added to the array here are in line with the options set in the WPSEO_Option_MS::$allowed_access_options property.}} */
$yform->select(
	'access',
	/* translators: %1$s expands to Yoast SEO */
	sprintf( __( 'Who should have access to the %1$s settings', 'wordpress-seo' ), 'Yoast SEO' ),
	array(
		'admin'      => __( 'Site Admins (default)', 'wordpress-seo' ),
		'superadmin' => __( 'Super Admins only', 'wordpress-seo' ),
	),
	'wpseo_ms'
);

if ( get_blog_count() <= 100 ) {
	$yform->select(
		'defaultblog',
		__( 'New sites in the network inherit their SEO settings from this site', 'wordpress-seo' ),
		Yoast_Network_Admin::get()->get_site_choices( true ),
		'wpseo_ms'
	);
	echo '<p>' . esc_html__( 'Choose the site whose settings you want to use as default for all sites that are added to your network. If you choose \'None\', the normal plugin defaults will be used.', 'wordpress-seo' ) . '</p>';
}
else {
	$yform->textinput( 'defaultblog', __( 'New sites in the network inherit their SEO settings from this site', 'wordpress-seo' ), 'wpseo_ms' );
	echo '<p>';
	printf(
		/* translators: 1: link open tag; 2: link close tag. */
		esc_html__( 'Enter the %1$sSite ID%2$s for the site whose settings you want to use as default for all sites that are added to your network. Leave empty for none (i.e. the normal plugin defaults will be used).', 'wordpress-seo' ),
		'<a href="' . esc_url( network_admin_url( 'sites.php' ) ) . '">',
		'</a>'
	);
	echo '</p>';
}

echo '<p><strong>' . esc_html__( 'Take note:', 'wordpress-seo' ) . '</strong> ' . esc_html__( 'Privacy sensitive (FB admins and such), theme specific (title rewrite) and a few very site specific settings will not be imported to new blogs.', 'wordpress-seo' ) . '</p>';

$yform->admin_footer( true );
