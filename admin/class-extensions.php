<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the class that contains the list of possible extensions for Yoast SEO.
 */
class WPSEO_Extensions {

	/** @var array Array with the Yoast extensions */
	protected $extensions = array(
		'Yoast SEO Premium'     => array(
			'slug'       => 'yoast-seo-premium',
			'identifier' => 'wordpress-seo-premium',
			'classname'  => 'WPSEO_Premium',
		),
		'News SEO'              => array(
			'slug'       => 'news-seo',
			'identifier' => 'wordpress-seo-news',
			'classname'  => 'WPSEO_News',
		),
		'Yoast WooCommerce SEO' => array(
			'slug'       => 'woocommerce-yoast-seo',
			'identifier' => 'yoast-woo-seo',
			'classname'  => 'Yoast_WooCommerce_SEO',
		),
		'Video SEO'             => array(
			'slug'       => 'video-seo-for-wordpress',
			'identifier' => 'yoast-video-seo',
			'classname'  => 'WPSEO_Video_Sitemap',
		),
		'Local SEO'             => array(
			'slug'       => 'local-seo-for-wordpress',
			'identifier' => 'yoast-local-seo',
			'classname'  => 'WPSEO_Local_Core',
		),
	);

	/**
	 * Returns the set extensions.
	 *
	 * @return array All the extension names.
	 */
	public function get() {
		return array_keys( $this->extensions );
	}

	/**
	 * Checks if the extension is valid.
	 *
	 * @param string $extension The extension to get the name for.
	 *
	 * @return bool Returns true when valid.
	 */
	public function is_valid( $extension ) {
		$extensions = new WPSEO_Extension_Manager();
		return $extensions->is_activated( $this->extensions[ $extension ]['identifier'] );
	}

	/**
	 * Invalidates the extension by removing its option.
	 *
	 * @param string $extension The extension to invalidate.
	 */
	public function invalidate( $extension ) {
		delete_option( $this->get_option_name( $extension ) );
	}

	/**
	 * Checks if the plugin has been installed.
	 *
	 * @param string $extension The name of the plugin to check.
	 *
	 * @return bool Returns true when installed.
	 */
	public function is_installed( $extension ) {
		return class_exists( $this->extensions[ $extension ]['classname'] );
	}

	/**
	 * Converts the extension to the required option name.
	 *
	 * @param string $extension The extension name to convert.
	 *
	 * @return string Returns the option name.
	 */
	protected function get_option_name( $extension ) {
		return sanitize_title_with_dashes( $this->extensions[ $extension ]['slug'] . '_', null, 'save' ) . 'license';
	}
}
