<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class registers all the necessary styles and scripts. Also has methods for the enqueing of scripts and styles. It automatically adds a prefix to the handle.
 */
class WPSEO_Admin_Asset_Manager {

	/**
	 *  Prefix for naming the assets.
	 */
	const PREFIX = 'yoast-seo-';

	/**
	 * Enqueues scripts.
	 *
	 * @param string $script The name of the script to enqueue.
	 */
	public function enqueue_script( $script ) {
		wp_enqueue_script( self::PREFIX . $script );
	}

	/**
	 * Enqueues styles.
	 *
	 * @param string $style The name of the style to enqueue.
	 */
	public function enqueue_style( $style ) {
		wp_enqueue_style( self::PREFIX . $style );
	}

	/**
	 * Registers scripts based on it's parameters.
	 *
	 * @param WPSEO_Admin_Asset $script The script to register.
	 */
	public function register_script( WPSEO_Admin_Asset $script ) {
		wp_register_script(
			self::PREFIX . $script->get_name(),
			plugins_url( 'js/' . $script->get_src() . WPSEO_CSSJS_SUFFIX . '.js', WPSEO_FILE ),
			$script->get_deps(),
			$script->get_version(),
			$script->is_in_footer()
		);
	}

	/**
	 * Registers styles based on it's parameters.
	 *
	 * @param WPSEO_Admin_Asset $style The style to register.
	 */
	public function register_style( WPSEO_Admin_Asset $style ) {
		wp_register_style(
			self::PREFIX . $style->get_name(),
			plugins_url( 'css/' . $style->get_src() . WPSEO_CSSJS_SUFFIX . '.css', WPSEO_FILE ),
			$style->get_deps(),
			$style->get_version(),
			$style->get_media()
		);
	}

	/**
	 * Calls the functions that register scripts and styles with the scripts and styles to be registered as arguments.
	 */
	public function register_assets() {
		$this->register_scripts( $this->scripts_to_be_registered() );
		$this->register_styles( $this->styles_to_be_registered() );
	}

	/**
	 * Registers all the scripts passed to it.
	 *
	 * @param array $scripts The scripts passed to it.
	 */
	public function register_scripts( $scripts ) {
		foreach ( $scripts as $script ) {
			$script = new WPSEO_Admin_Asset( $script );
			$this->register_script( $script );
		}
	}

	/**
	 * Registers all the styles it recieves.
	 *
	 * @param array $styles Styles that need to be registerd.
	 */
	public function register_styles( $styles ) {
		foreach ( $styles as $style ) {
			$style = new WPSEO_Admin_Asset( $style );
			$this->register_style( $style );
		}
	}

	/**
	 * Returns the scripts that need to be registered.
	 *
	 * @return array scripts that need to be registered.
	 */
	private function scripts_to_be_registered() {
		return array(
			array(
				'name' => 'admin-script',
				'src'  => 'wp-seo-admin-306',
				'deps' => array(
					'jquery',
					'jquery-ui-core',
					'jquery-ui-progressbar',
				),
			),
			array(
				'name' => 'admin-media',
				'src'  => 'wp-seo-admin-media-302',
				'deps' => array(
					'jquery',
					'jquery-ui-core',
				),
			),
			array(
				'name' => 'bulk-editor',
				'src'  => 'wp-seo-bulk-editor',
				'deps' => array( 'jquery' ),
			),
			array(
				'name' => 'export',
				'src'  => 'wp-seo-export-302',
				'deps' => array( 'jquery' ),
			),
			array(
				'name' => 'dismissible',
				'src'  => 'wp-seo-dismissible',
				'deps' => array( 'jquery' ),
			),
			array(
				'name' => 'admin-global-script',
				'src'  => 'wp-seo-admin-global-302',
				'deps' => array( 'jquery' ),
			),
			array(
				'name' => 'jquery-qtip',
				'src'  => 'jquery.qtip',
				'deps' => array( 'jquery' ),
				'ver'  => '2.2.1',
			),
			array(
				'name' => 'metabox',
				'src'  => 'wp-seo-metabox-302',
				'deps' => array(
					'jquery',
					'jquery-ui-core',
					self::PREFIX . 'jquery-qtip',
				),
				'inf' => false,
			),
			array(
				'name' => 'featured-image',
				'src'  => 'wp-seo-featured-image-302',
				'deps' => array(
					'jquery',
					self::PREFIX . 'yoast-seo',
				),
			),
			array(
				'name' => 'metabox-taxonomypage',
				'src'  => 'wp-seo-metabox-302',
				'deps' => array(
					'jquery',
					'jquery-ui-core',
					'jquery-ui-autocomplete',
				),
			),
			array(
				'name' => 'admin-gsc',
				'src'  => 'wp-seo-admin-gsc-302',
				'deps' => array( 'jquery' ),
				'ver'  => WPSEO_VERSION,
				'inf'  => false,
			),
			array(
				'name' => 'yoast-seo',
				'src'  => 'dist/yoast-seo/yoast-seo-307',
			),
			array(
				'name' => 'post-scraper',
				'src'  => 'wp-seo-post-scraper-305',
				'deps' => array(
					self::PREFIX . 'yoast-seo',
					self::PREFIX . 'replacevar-plugin',
					self::PREFIX . 'shortcode-plugin',
				),
			),
			array(
				'name' => 'term-scraper',
				'src'  => 'wp-seo-term-scraper-305',
				'deps' => array(
					self::PREFIX . 'yoast-seo',
					self::PREFIX . 'replacevar-plugin',
				),
			),
			array(
				'name' => 'replacevar-plugin',
				'src'  => 'wp-seo-replacevar-plugin-302',
				'deps' => array(
					self::PREFIX . 'yoast-seo',
				),
			),
			array(
				'name' => 'shortcode-plugin',
				'src'  => 'wp-seo-shortcode-plugin-305',
				'deps' => array(
					self::PREFIX . 'yoast-seo',
				),
			),
		);
	}

	/**
	 * Returns the styles that need to be registered.
	 *
	 * @return array styles that need to be registered.
	 */
	private function styles_to_be_registered() {
		return array(
			array(
				'name' => 'admin-css',
				'src'  => 'yst_plugin_tools-302',
			),
			array(
				'name' => 'rtl',
				'src'  => 'wpseo-rtl',
			),
			array(
				'name' => 'dismissible',
				'src'  => 'wpseo-dismissible',
			),
			array(
				'name' => 'edit-page',
				'src'  => 'edit-page-302',
			),
			array(
				'name' => 'featured-image',
				'src'  => 'featured-image',
			),
			array(
				'name' => 'jquery-qtip.js',
				'src'  => 'jquery.qtip',
				'ver'  => '2.2.1',
			),
			array(
				'name' => 'metabox-css',
				'src'  => 'metabox-302',
			),
			array(
				'name' => 'wp-dashboard',
				'src'  => 'dashboard-305',
			),
			array(
				'name' => 'scoring',
				'src'  => 'yst_seo_score-302',
			),
			array(
				'name' => 'snippet',
				'src'  => 'snippet-307',
			),
			array(
				'name' => 'yoast-seo',
				'src'  => 'dist/yoast-seo/yoast-seo-307',
			),
			array(
				'name' => 'adminbar',
				'src'  => 'adminbar-302',
			),
		);
	}
}
