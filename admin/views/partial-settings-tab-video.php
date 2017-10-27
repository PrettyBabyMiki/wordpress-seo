<?php
/**
 * @package WPSEO\Admin\Views
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

if ( ! empty( $tab_video_url ) ) :

	$id = uniqid( 'video-tab-' );

	?>
	<div class="wpseo-tab-video-container">
		<button type="button" class="wpseo-tab-video-container__handle" aria-controls="<?php echo esc_attr( $id ); ?>" aria-expanded="false">
			<span class="dashicons-before dashicons-editor-help"><?php esc_html_e( 'Help center', 'wordpress-seo' ); ?></span>
			<span class="dashicons dashicons-arrow-down toggle__arrow"></span>
		</button>
		<div id="<?php echo esc_attr( $id ); ?>" class="wpseo-tab-video-slideout hidden">
			<?php include WPSEO_PATH . 'admin/views/partial-help-center-video.php'; ?>
		</div>
	</div>
	<?php

endif;
