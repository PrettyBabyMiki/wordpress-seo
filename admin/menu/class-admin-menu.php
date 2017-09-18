<?php
/**
 * @package WPSEO\Admin\Menu
 */

/**
 * Registers the admin menu on the left of the admin area.
 */
class WPSEO_Admin_Menu implements WPSEO_WordPress_Integration {
	/** @var WPSEO_Menu Menu */
	protected $menu;

	/**
	 * Constructs the Admin Menu
	 *
	 * @param WPSEO_Menu $menu Menu to use.
	 */
	public function __construct( WPSEO_Menu $menu ) {
		$this->menu = $menu;
	}

	/**
	 * Registers all hooks to WordPress
	 *
	 * @return void
	 */
	public function register_hooks() {
		// Needs the lower than default priority so other plugins can hook underneath it without issue.
		add_action( 'admin_menu', array( $this, 'register_settings_page' ), 5 );
	}

	/**
	 * Registers the menu item submenus.
	 */
	public function register_settings_page() {
		$can_manage_options = WPSEO_Capability_Utils::current_user_can( $this->get_manage_options_cap() );

		/*
		 * If the current user has the capability to control anything.
		 * This means that all submenus and dashboard can be shown.
		 */
		if ( $can_manage_options ) {
			global $admin_page_hooks;

			add_menu_page(
				'Yoast SEO: ' . __( 'Dashboard', 'wordpress-seo' ),
				__( 'SEO', 'wordpress-seo' ) . ' ' . $this->get_notification_counter(),
				$this->get_manage_options_cap(),
				$this->menu->get_page_identifier(),
				$this->get_admin_page_callback(),
				WPSEO_Utils::get_icon_svg(),
				'99.31337'
			);

			$admin_page_hooks[ $this->menu->get_page_identifier() ] = 'seo'; // Wipe notification bits from hooks. R.
		}

		// Get all submenu pages.
		$submenu_pages = $this->get_submenu_pages();

		// Add submenu items to the main menu if possible.
		if ( $can_manage_options ) {
			$this->register_submenu_pages( $submenu_pages );
		}

		/*
		 * If the user does not have the general manage options capability,
		 * we need to make sure the desired sub-item can be reached.
		 */
		if ( ! $can_manage_options ) {
			$this->register_menu_pages( $submenu_pages );
		}
	}

	/**
	 * Registers submenu pages as menu pages.
	 *
	 * @param array $submenu_pages List of submenu pages.
	 */
	protected function register_menu_pages( $submenu_pages ) {
		if ( ! is_array( $submenu_pages ) || $submenu_pages === array() ) {
			return;
		}

		// Loop through submenu pages and add them.
		foreach ( $submenu_pages as $submenu_page ) {
			if ( $submenu_page[3] === $this->get_manage_options_cap() ) {
				continue;
			}

			// Register submenu as menu page.
			add_menu_page(
				'Yoast SEO: ' . $submenu_page[2],
				$submenu_page[2],
				$submenu_page[3],
				$submenu_page[4],
				$this->get_admin_page_callback(),
				WPSEO_Utils::get_icon_svg(),
				'99.31337'
			);
		}
	}

	/**
	 * Returns the list of registered submenu pages.
	 *
	 * @return array List of registered submenu pages.
	 */
	protected function get_submenu_pages() {
		global $wpseo_admin;

		/** WPSEO_Admin $wpseo_admin */
		$admin_features = $wpseo_admin->get_admin_features();

		// Sub menu pages.
		$submenu_pages = array(
			$this->get_submenu_page( __( 'General', 'wordpress-seo' ), $this->menu->get_page_identifier() ),
			$this->get_submenu_page( __( 'Titles &amp; Metas', 'wordpress-seo' ), 'wpseo_titles' ),
			$this->get_submenu_page( __( 'Social', 'wordpress-seo' ), 'wpseo_social' ),
			$this->get_submenu_page( __( 'XML Sitemaps', 'wordpress-seo' ), 'wpseo_xml' ),
			$this->get_submenu_page( __( 'Advanced', 'wordpress-seo' ), 'wpseo_advanced' ),
			$this->get_submenu_page( __( 'Tools', 'wordpress-seo' ), 'wpseo_tools' ),
			$this->get_submenu_page(
				__( 'Search Console', 'wordpress-seo' ),
				'wpseo_search_console',
				array( $admin_features['google_search_console'], 'display' ),
				array( array( $admin_features['google_search_console'], 'set_help' ) )
			),
			$this->get_submenu_page( $this->get_license_page_title(), 'wpseo_licenses' ),
		);

		/**
		 * Filter: 'wpseo_submenu_pages' - Collects all submenus that need to be shown.
		 *
		 * @api array $submenu_pages List with all submenu pages.
		 */
		return (array) apply_filters( 'wpseo_submenu_pages', $submenu_pages );
	}

	/**
	 * Creates a submenu formatted array.
	 *
	 * @param string     $page_title Page title to use.
	 * @param string     $page_slug  Page slug to use.
	 * @param callable   $callback   Optional. Callback which handles the page request.
	 * @param callable[] $hook       Optional. Hook to trigger when the page is registered.
	 *
	 * @return array Formatted submenu.
	 */
	protected function get_submenu_page( $page_title, $page_slug, $callback = null, $hook = null ) {
		$callback = ( $callback === null ) ? $this->get_admin_page_callback() : $callback;

		return array(
			$this->menu->get_page_identifier(),
			'',
			$page_title,
			$this->get_manage_options_cap(),
			$page_slug,
			$callback,
			$hook,
		);
	}

	/**
	 * Registers the submenu pages.
	 *
	 * @param array $submenu_pages List of submenu pages to register.
	 *
	 * @return void
	 */
	protected function register_submenu_pages( $submenu_pages ) {
		if ( ! is_array( $submenu_pages ) || $submenu_pages === array() ) {
			return;
		}

		// Loop through submenu pages and add them.
		foreach ( $submenu_pages as $submenu_page ) {
			$page_title = $submenu_page[2];

			// We cannot use $submenu_page[1] because add-ons define that, so hard-code this value.
			if ( 'wpseo_licenses' === $submenu_page[4] ) {
				$page_title = $this->get_license_page_title();
			}

			$page_title .= ' - Yoast SEO';

			// Add submenu page.
			$admin_page = add_submenu_page( $submenu_page[0], $page_title, $submenu_page[2], $submenu_page[3], $submenu_page[4], $submenu_page[5] );

			// Check if we need to hook.
			if ( isset( $submenu_page[6] ) && ( is_array( $submenu_page[6] ) && $submenu_page[6] !== array() ) ) {
				foreach ( $submenu_page[6] as $submenu_page_action ) {
					add_action( 'load-' . $admin_page, $submenu_page_action );
				}
			}
		}

		global $submenu;
		if ( isset( $submenu[ $this->menu->get_page_identifier() ] ) && WPSEO_Capability_Utils::current_user_can( $this->get_manage_options_cap() ) ) {
			$submenu[ $this->menu->get_page_identifier() ][0][0] = __( 'Dashboard', 'wordpress-seo' );
		}
	}

	/**
	 * Returns the notification count in HTML format.
	 *
	 * @return string The notification count in HTML format.
	 */
	protected function get_notification_counter() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_count  = $notification_center->get_notification_count();

		// Add main page.
		/* translators: %s: number of notifications */
		$notifications = sprintf( _n( '%s notification', '%s notifications', $notification_count, 'wordpress-seo' ), number_format_i18n( $notification_count ) );

		$counter = sprintf( '<span class="update-plugins count-%1$d"><span class="plugin-count" aria-hidden="true">%1$d</span><span class="screen-reader-text">%2$s</span></span>', $notification_count, $notifications );

		return $counter;
	}

	/**
	 * Converts any `manage_options` to `wpseo_manage_options`.
	 *
	 * This is needed as the module plugins are not updated with the new capabilities directly,
	 * but they should not be shown as main menu items.
	 *
	 * @param array $submenu_pages List of subpages to convert.
	 *
	 * @return array Converted subpages.
	 */
	protected function ensure_wpseo_capability( $submenu_pages ) {
		foreach ( $submenu_pages as $index => $submenu_page ) {
			if ( $submenu_page[3] === 'manage_options' ) {
				$submenu_pages[ $index ][3] = 'wpseo_manage_options';
			}
		}

		return $submenu_pages;
	}

	/**
	 * Returns the capability that is required to manage all options.
	 *
	 * @return string Capability to check against.
	 */
	protected function get_manage_options_cap() {
		/**
		 * Filter: 'wpseo_manage_options_capability' - Allow changing the capability users need to view the settings pages
		 *
		 * @api string unsigned The capability
		 */
		return (string) apply_filters( 'wpseo_manage_options_capability', 'wpseo_manage_options' );
	}

	/**
	 * Returns the page handler callback.
	 *
	 * @return array Callback page handler.
	 */
	protected function get_admin_page_callback() {
		return array( $this->menu, 'load_page' );
	}

	/**
	 * Returns the page title to use for the licenses page.
	 *
	 * @return string The title for the license page.
	 */
	protected function get_license_page_title() {
		static $title = null;

		if ( $title === null ) {
			$title = __( 'Premium', 'wordpress-seo' );
		}

		return $title;
	}
}
