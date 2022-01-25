<?php

namespace Yoast\WP\SEO\Services\Importing;

/**
 * Provides AISOEO social images settings.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Aioseo_Social_Images_Provider_Service {

	/**
	 * Retrieves the global default social image if there is any.
	 *
	 * @param string $social_setting The social settings we're working with, eg. open-graph or twitter.
	 *
	 * @return string|null The global default social image, null if the source is not selected as Default Image.
	 */
	public function get_default_social_image( $social_setting ) {
		$aioseo_settings = \json_decode( \get_option( 'aioseo_options', [] ), true );

		if ( $social_setting === 'og' ) {
			$social_setting = 'facebook';
		}

		if ( empty( $aioseo_settings ) || ! isset( $aioseo_settings['social'][ $social_setting ]['general']['defaultImageSourcePosts'] ) || ! isset( $aioseo_settings['social'][ $social_setting ]['general']['defaultImagePosts'] ) ) {
			return null;
		}

		if ( $aioseo_settings['social'][ $social_setting ]['general']['defaultImageSourcePosts'] !== 'default' ) {
			return null;
		}

		if ( empty( $aioseo_settings['social'][ $social_setting ]['general']['defaultImagePosts'] ) ) {
			return null;
		}

		return $aioseo_settings['social'][ $social_setting ]['general']['defaultImagePosts'];
	}
}
