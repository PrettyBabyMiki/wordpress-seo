<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Represents the presenter class for "Premium" badges.
 */
class Premium_Badge_Presenter extends Abstract_Presenter {

	/**
	 * Identifier of the badge.
	 *
	 * @var string
	 */
	private $id;

	/**
	 * Optional link of the badge.
	 *
	 * @var string
	 */
	private $link;

	/**
	 * An instance of the WPSEO_Admin_Asset_Manager class.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Premium_Badge_Presenter constructor.
	 *
	 * @param string $id   Id of the badge.
	 * @param string $link Optional link of the badge.
	 */
	public function __construct( $id, $link = '' ) {
		$this->id   = $id;
		$this->link = $link;

		if ( ! $this->asset_manager ) {
			$this->asset_manager = new WPSEO_Admin_Asset_Manager();
		}

		$this->asset_manager->enqueue_style( 'badge' );
	}

	/**
	 * Presents the Premium Badge. If a link has been passed, the badge is presented with the link.
	 * Otherwise a static badge is presented.
	 *
	 * @return string The styled Premium Badge.
	 */
	public function present() {
		if ( $this->link !== '' ) {
			return \sprintf(
				'<a class="yoast-badge yoast-badge__is-link yoast-premium-badge" id="%1$s-premium-badge" href="%2$s">%3$s</a>',
				\esc_attr( $this->id ),
				\esc_url( $this->link ),
				'Premium' // We don't want this string to be translatable.
			);
		}

		return \sprintf(
			'<span class="yoast-badge yoast-premium-badge" id="%1$s-premium-badge">%2$s</span>',
			\esc_attr( $this->id ),
			'Premium' // We don't want this string to be translatable.
		);
	}
}
