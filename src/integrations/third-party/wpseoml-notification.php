<?php

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Third_Party\WPSEOML_Conditional;
use Yoast\WP\SEO\Conditionals\WPML_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Notification;
use Yoast_Notification_Center;

/**
 * Adds a notification to the dashboard if the WPML plugin is installed,
 * but the Yoast SEO Multilingual plugin (a glue plugin to make Yoast SEO and WPML work nicely together)
 * is not.
 */
class WPSEOML_Notification implements Integration_Interface {

	/**
	 * The notification center.
	 *
	 * @var Yoast_Notification_Center
	 */
	protected $notification_center;

	/**
	 * The WPSEOML conditional.
	 *
	 * @var WPSEOML_Conditional
	 */
	protected $wpseoml_conditional;

	const NOTIFICATION_ID = 'wpseoml-not-installed';

	/**
	 * WPSEOML constructor.
	 *
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 * @param WPSEOML_Conditional       $wpseoml_conditional The WPSEOML conditional.
	 */
	public function __construct(
		Yoast_Notification_Center $notification_center,
		WPSEOML_Conditional $wpseoml_conditional
	) {
		$this->notification_center = $notification_center;
		$this->wpseoml_conditional = $wpseoml_conditional;
	}

	/**
	 * Initializes the integration.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_notices', [ $this, 'notify_not_installed' ] );
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * This integration should only be active when WPML is installed and activated.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ WPML_Conditional::class ];
	}

	/**
	 * Notify the user that the Yoast SEO Multilingual plugin is not installed
	 * (when the WPML plugin is installed).
	 *
	 * Remove the notification again when it is installed.
	 */
	public function notify_not_installed() {
		if ( ! $this->wpseoml_conditional->is_met() ) {
			$this->notification_center->add_notification( $this->notification() );
		}
		else {
			$this->notification_center->remove_notification_by_id( self::NOTIFICATION_ID );
		}
	}

	/**
	 * Generates the notification to show to the user when WPML is installed,
	 * but the Yoast SEO Multilingual plugin is not.
	 *
	 * @return Yoast_Notification The notification.
	 */
	protected function notification() {
		return new Yoast_Notification(
			'We notice that you have installed WPML. To make sure your canonical URLs are set correctly, install and activate the Yoast SEO Multilingual add-on as well!',
			[
				'id' => self::NOTIFICATION_ID,
			]
		);
	}
}
