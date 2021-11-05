<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Represents the presenter class for Yoast-styled WordPress admin notices.
 */
class Notice_Presenter extends Abstract_Presenter {

	/**
	 * The title of the admin notice.
	 *
	 * @var string
	 */
	private $title;

	/**
	 * The content of the admin notice.
	 *
	 * @var string
	 */
	private $content;

	/**
	 * The filename of the image for the notice. Should be a file in the 'images' folder.
	 *
	 * @var string
	 */
	private $image_filename;

	/**
	 * Whether the notice should be dismissible.
	 *
	 * @var bool
	 */
	private $is_dismissible;

	/**
	 * An instance of the WPSEO_Admin_Asset_Manager class.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Notice_Presenter constructor.
	 *
	 * @param string $title          Title of the admin notice.
	 * @param string $content        Content of the admin notice.
	 * @param string $image_filename Optional. The filename of the image of the admin notice, should be inside the 'images' folder.
	 * @param bool   $is_dismissible Optional. Whether the admin notice should be dismissible.
	 */
	public function __construct( $title, $content, $image_filename = null, $is_dismissible = false ) {
		$this->title          = $title;
		$this->content        = $content;
		$this->image_filename = $image_filename;
		$this->is_dismissible = $is_dismissible;

		if ( ! $this->asset_manager ) {
			$this->asset_manager = new WPSEO_Admin_Asset_Manager();
		}

		$this->asset_manager->enqueue_style( 'notifications' );
	}

	/**
	 * Presents the Notice.
	 *
	 * @return string The styled Notice.
	 */
	public function present() {
		$dismissible = ( $this->is_dismissible ) ? ' is-dismissible' : '';

		// WordPress admin notice.
		$out  = '<div class="notice notice-yoast' . $dismissible . '">';
		$out .= '<div class="notice-yoast__container">';

		// Header.
		$out .= '<div class="notice-yoast__header">';
		$out .= '<span class="yoast-icon"></span>';
		$out .= \sprintf(
			'<h1 class="notice-yoast__header-heading">%s</h1>',
			\esc_html( $this->title )
		);
		$out .= '</div>';

		// Content.
		$out .= '<div class="notice-yoast__content">';
		$out .= '<p>' . $this->content . '</p>';
		if ( ! \is_null( $this->image_filename ) ) {
			$out .= '<img src="' . \esc_url( plugin_dir_url( WPSEO_FILE ) . 'images/' . $this->image_filename ) . '" alt="" />';
		}
		$out .= '</div>';

		$out .= '</div>';
		$out .= '</div>';

		return $out;
	}
}
