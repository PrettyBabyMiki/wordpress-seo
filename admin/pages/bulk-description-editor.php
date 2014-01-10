<?php
/**
 * @package Admin
 */

if ( !defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}
global $wpseo_admin_pages;

$options = get_option( 'wpseo' );

if( ! class_exists( 'WPSEO_Bulk_Description_List_Table' ) ) {
	require WPSEO_PATH . 'admin/class-bulk-description-editor-list-table.php';
}

$wpseo_description_table = new WPSEO_Bulk_Description_List_Table();

if ( ! empty($_REQUEST['_wp_http_referer']) ) {
	wp_redirect( remove_query_arg( array('_wp_http_referer', '_wpnonce'), stripslashes($_SERVER['REQUEST_URI']) ) );
	exit;
}

$wpseo_description_table->prepare_items();
?>

<div class="wrap wpseo_table_page">

	<a href="http://yoast.com/">
		<div id="top yoast-icon" style="background: url('<?php echo plugins_url( 'images/wordpress-SEO-32x32.png', dirname( __DIR__ ) ); ?>') no-repeat;"
			 class="icon32"><br/></div>
	</a>

	<h2 id="wpseo-title"><?php _e( "Yoast WordPress SEO: Bulk Description Editor", 'wordpress-seo' ); ?></h2>

	<?php $wpseo_description_table->views(); ?>

	<?php $wpseo_description_table->display(); ?>

</div>