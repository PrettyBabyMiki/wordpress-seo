<?php
/**
 * @package WPSEO\Suggested_Plugins
 */

/**
 * Class WPSEO_Suggested_Plugins
 */
class WPSEO_Suggested_Plugins implements WPSEO_WordPress_Integration {

	/**
	 * @var WPSEO_Plugin_Availability
	 */
	private $availability_checker;

	/**
	 * WPSEO_Suggested_Plugins constructor.
	 */
	public function __construct() {
		$this->availability_checker = new WPSEO_Plugin_Availability();
	}

	/**
	 * Adds notifications (when necessary).
	 *
	 * @return void
	 */
	public function add_notifications() {
		$checker = $this->availability_checker;
		$notification_center = Yoast_Notification_Center::get();

		// Get all Yoast plugins that have dependencies.
		$plugins = $checker->get_plugins_with_dependencies();

		foreach ( $plugins as $plugin_name => $plugin ) {
			if ( ! $checker->dependencies_are_satisfied( $plugin ) ) {
				continue;
			}

			$dependency_names = $checker->get_dependency_names( $plugin );
			$notification = $this->get_yoast_seo_suggested_plugins_notification( $plugin_name, $plugin, $dependency_names[0] );

			if ( ! $checker->is_installed( $plugin ) || ! $checker->is_active( $plugin['slug'] ) ) {
				$notification_center->add_notification( $notification );

				continue;
			}

			$notification_center->remove_notification( $notification );
		}
	}

	/**
	 * Build Yoast SEO suggested plugins notification.
	 *
	 * @param string $name   The plugin name to use for the unique ID.
	 * @param array  $plugin The plugin to retrieve the data from.
	 * @param string $dependency_name The name of the dependency.
	 *
	 * @return Yoast_Notification The notification containing the suggested plugin.
	 */
	private function get_yoast_seo_suggested_plugins_notification( $name, $plugin, $dependency_name ) {
		$message = $this->create_install_suggested_plugin_message( $plugin, $dependency_name );

		if ( $this->availability_checker->is_installed( $plugin ) && ! $this->availability_checker->is_active( $plugin['slug'] ) ) {
			$message = $this->create_activate_suggested_plugin_message( $plugin, $dependency_name );
		}

		return new Yoast_Notification(
			$message,
			array(
				'id'   => 'wpseo-suggested-plugin-' . $name,
				'type' => Yoast_Notification::WARNING,
				'capabilities' => array( 'install_plugins' ),
			)
		);
	}

	/**
	 * Creates a message to suggest the installation of a particular plugin.
	 *
	 * @param array $suggested_plugin The suggested plugin.
	 * @param array $third_party_plugin The third party plugin that we have a suggested plugin for.
	 *
	 * @return string The install suggested plugin message.
	 */
	private function create_install_suggested_plugin_message( $suggested_plugin, $third_party_plugin ) {
		/* translators: %1$s expands to Yoast SEO, %2$s expands to the dependency name, %3$s expands to the install link, %4$s expands to the more info link. */
		$message = __( '%1$s and %2$s can work together a lot better by adding a helper plugin. Please install %3$s to make your life better. %4$s.', 'wordpress-seo' );
		$install_url = WPSEO_Utils::get_install_url( $suggested_plugin['slug'] );

		return sprintf(
			$message,
			'Yoast SEO',
			$third_party_plugin['title'],
			sprintf( '<a href="%s">%s</a>', $install_url, $suggested_plugin['title'] ),
			$this->create_more_information_link( $suggested_plugin['url'], $suggested_plugin['title'] )
		);
	}

	/**
	 * Creates a more information link that directs the user to WordPress.org Plugin repository.
	 *
	 * @param string $url The URL to the plugin's page.
	 * @param string $name The name of the plugin.
	 *
	 * @return string The more information link.
	 */
	private function create_more_information_link( $url, $name ) {
		return sprintf(
			'<a href="%s" aria-label="%s" target="_blank" rel="noopener noreferrer">%s</a>',
			$url,
			/* translators: %1$s expands to the dependency name. */
			sprintf( __( 'More information about %1$s', 'wordpress-seo' ), $name ),
			__( 'More information', 'wordpress-seo' )
		);
	}

	/**
	 * Creates a message to suggest the activation of a particular plugin.
	 *
	 * @param array $suggested_plugin The suggested plugin.
	 * @param array $third_party_plugin The third party plugin that we have a suggested plugin for.
	 *
	 * @return string The activate suggested plugin message.
	 */
	private function create_activate_suggested_plugin_message( $suggested_plugin, $third_party_plugin ) {
		/* translators: %1$s expands to Yoast SEO, %2$s expands to the dependency name, %3$s expands to activation link. */
		$message = __( '%1$s and %2$s can work together a lot better by adding a helper plugin. Please activate %3$s to make your life better.', 'wordpress-seo' );
		$activation_url = WPSEO_Utils::get_activation_url( $suggested_plugin['slug'] );

		return sprintf(
			$message,
			'Yoast SEO',
			$third_party_plugin['title'],
			sprintf( '<a href="%s">%s</a>', $activation_url, $suggested_plugin['title'] )
		);
	}

	/**
	 * Registers all hooks to WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'admin_init', array( $this->availability_checker, 'register' ) );
		add_action( 'admin_init', array( $this, 'add_notifications' ) );
	}
}
