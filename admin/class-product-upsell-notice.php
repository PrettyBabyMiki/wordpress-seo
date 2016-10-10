<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the upsell notice.
 */
class WPSEO_Product_Upsell_Notice {

	const USER_META_DISMISSED = 'wpseo-remove-upsell-notice';

	const OPTION_NAME = 'wpseo';

	/** @var array */
	protected $options;

	/**
	 * Sets the options, because they always have to be there on instance.
	 */
	public function __construct() {
		$this->options = $this->get_options();
	}

	/**
	 * Checks if the notice should be added or removed.
	 */
	public function initialize() {

		$features = new WPSEO_Features();
		if ( $features->is_premium() || $this->is_notice_dismissed() ) {
			$this->remove_notification();

			return;
		}

		if ( $this->should_add_notification() ) {
			$this->add_notification();
		}
	}

	/**
	 * Sets the upgrade notice.
	 */
	public function set_upgrade_notice() {

		if ( $this->has_first_activated_on() ) {
			return;
		}

		$this->set_first_activated_on();
		$this->add_notification();
	}

	/**
	 * Listener for the upsell notice.
	 */
	public function dismiss_notice_listener() {
		if ( filter_input( INPUT_GET, 'yoast_dismiss' ) !== 'upsell' ) {
			return;
		}

		$this->dismiss_notice();

		wp_redirect( admin_url( 'admin.php?page=wpseo_dashboard' ) );
		exit;
	}

	/**
	 * When the notice should be shown.
	 *
	 * @return bool
	 */
	protected function should_add_notification() {
		return ( $this->options['first_activated_on'] < strtotime( '-2weeks' ) );
	}

	/**
	 * Checks if the options has a first activated on date value.
	 */
	protected function has_first_activated_on() {
		return $this->options['first_activated_on'] !== false;
	}

	/**
	 * Sets the first activated on.
	 */
	protected function set_first_activated_on() {
		$this->options['first_activated_on'] = strtotime( '-2weeks' );

		$this->save_options();
	}

	/**
	 * Adds a notification to the notification center.
	 */
	protected function add_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->add_notification( $this->get_notification() );
	}

	/**
	 * Adds a notification to the notification center.
	 */
	protected function remove_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification( $this->get_notification() );
	}

	/**
	 * Gets the notification value.
	 *
	 * @return Yoast_Notification
	 */
	protected function get_notification() {
		/* translators: %1$s expands anchor to plugin page on WordPress.org, %2$s expands anchor to the bugreport guidelines on the knowledge base, %3$s expands anchor to premium plugin page, %4$a expands to the notice dismissal anchor, %5$s expands to </a>  */
		$message = sprintf(
			__( "We've noticed you've been using Yoast SEO for some time now; we hope you love it!
			
			We'd be thrilled if you could %1\$sgive us a good rating on WordPress.org%5\$s! If you are experiencing issues, %2\$splease file a bug report%5\$s and we'll do our best to help you out.
			
			By the way, did you know we also have a %3\$sPremium plugin%5\$s? It offers advanced features, like a redirect manager and support for multiple keywords. It also comes with 24/7 personal support.

			%4\$sPlease don't show me this notification anymore%5\$s", 'wordpress-seo' ),
			"<a href='https://yoa.st/rate-yoast-seo'>",
			"<a href='https://yoa.st/bugreport'>",
			"<a href='https://yoa.st/premium-notification'>",
			"<a class='button' href=' " . admin_url( '?page=' .  WPSEO_Admin::PAGE_IDENTIFIER . '&yoast_dismiss=upsell' ) . " '>",
			"</a>"
		);

		$notification = new Yoast_Notification(
			$message,
			array(
				'type'         => Yoast_Notification::WARNING,
				'id'           => 'wpseo-upsell-notice',
				'capabilities' => 'manage_options',
				'priority'     => 0.8,
			)
		);

		return $notification;
	}

	/**
	 * Dismisses the notice.
	 *
	 * @return string
	 */
	protected function is_notice_dismissed() {
		return get_user_meta( get_current_user_id(), self::USER_META_DISMISSED, true ) === '1';
	}

	/**
	 * Dismisses the notice.
	 */
	protected function dismiss_notice() {
		update_user_meta( get_current_user_id(), self::USER_META_DISMISSED, true );
	}

	/**
	 * Returns the set options
	 *
	 * @return mixed|void
	 */
	protected function get_options() {
		return get_option( self::OPTION_NAME );
	}

	/**
	 * Saves the options to the database.
	 */
	protected function save_options() {
		update_option( self::OPTION_NAME, $this->options );
	}
}
