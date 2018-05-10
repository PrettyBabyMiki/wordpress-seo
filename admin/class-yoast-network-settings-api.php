<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Network
 */

/**
 * Implements a network settings API for the plugin's multisite settings.
 */
class Yoast_Network_Settings_API {

	/** Action identifier for updating plugin network options. */
	const UPDATE_ACTION = 'yoast_handle_network_options';

	/** @var array Registered network settings. */
	private $registered_settings = array();

	/** @var array Options whitelist, keyed by option group. */
	private $whitelist_options = array();

	/** @var array Sanitize callbacks for each network option. */
	private $sanitize_callbacks = array();

	/** @var bool Internal flag for whether the necessary hooks have been added. */
	private $hooks_registered = false;

	/** @var Yoast_Network_Settings_API The singleton instance of this class. */
	private static $instance = null;

	/**
	 * Outputs nonce, action and option group fields for a network settings page in the plugin.
	 *
	 * @param string $option_group Option group name for the current page.
	 */
	public function settings_fields( $option_group ) {
		?>
		<input type="hidden" name="network_option_group" value="<?php echo esc_attr( $option_group ); ?>" />
		<input type="hidden" name="action" value="<?php echo esc_attr( self::UPDATE_ACTION ); ?>" />
		<?php
		wp_nonce_field( "$option_group-network-options" );
	}

	/**
	 * Registers a network setting and its data.
	 *
	 * @param string $option_group The group the network option is part of.
	 * @param string $option_name  The name of the network option to sanitize and save.
	 * @param array  $args         {
	 *     Optional. Data used to describe the network setting when registered.
	 *
	 *     @type callable $sanitize_callback A callback function that sanitizes the network option's value.
	 *     @type mixed    $default           Default value when calling `get_network_option()`.
	 * }
	 */
	public function register_setting( $option_group, $option_name, $args = array() ) {

		$args = wp_parse_args( $args, array(
			'group'             => $option_group,
			'sanitize_callback' => null,
		) );

		if ( ! isset( $this->whitelist_options[ $option_group ] ) ) {
			$this->whitelist_options[ $option_group ] = array();
		}

		$this->whitelist_options[ $option_group ][] = $option_name;

		if ( ! empty( $args['sanitize_callback'] ) ) {
			add_filter( "sanitize_option_{$option_name}", $this->wrap_sanitize_callback( $option_name, $args['sanitize_callback'] ), 10, 2 );
		}
		if ( array_key_exists( 'default', $args ) ) {
			add_filter( "default_site_option_{$option_name}", array( $this, 'filter_default_option' ), 10, 2 );
		}

		$this->registered_settings[ $option_name ] = $args;
	}

	/**
	 * Handles a request in which plugin network options should be updated.
	 *
	 * This method works similar to how option updates are handled in `wp-admin/options.php` and
	 * `wp-admin/network/settings.php`.
	 */
	public function handle_update_options_request() {
		$option_group = filter_input( INPUT_POST, 'network_option_group', FILTER_SANITIZE_STRING );

		check_admin_referer( "$option_group-network-options" );

		if ( ! isset( $this->whitelist_options[ $option_group ] ) ) {
			wp_die( __( 'Sorry, you are not allowed to modify unregistered network settings.', 'wordpress-seo' ), '', 403 );
		}

		foreach ( $this->whitelist_options[ $option_group ] as $option_name ) {
			$value = isset( $_POST[ $option_name ] ) ? $_POST[ $option_name ] : null;
			$value = wp_unslash( $value );

			WPSEO_Options::update_site_option( $option_name, $value );
		}

		$settings_errors = get_settings_errors();
		if ( empty( $settings_errors ) ) {
			add_settings_error( $option_group, 'settings_updated', __( 'Settings Updated.', 'wordpress-seo' ), 'updated' );
		}

		// Use a regular transient here, since it is automatically cleared right after the redirect.
		// A network transient would be cleaner, but would require a lot of copied code from core for
		// just a minor adjustment when displaying settings errors.
		set_transient( 'settings_errors', get_settings_errors(), 30 );

		$sendback = add_query_arg( 'settings-updated', 'true', wp_get_referer() );
		wp_safe_redirect( $sendback );
		exit;
	}

	/**
	 * Wraps a network setting sanitization callback so that it only executes in the network admin.
	 *
	 * This callback can be added as a filter to `sanitize_option_{$option}` instead of the actual callback.
	 *
	 * @see Yoast_Network_Settings_API::filter_sanitize_option()
	 *
	 * @param string   $option            The option name.
	 * @param callable $sanitize_callback The sanitize callback for the option.
	 *
	 * @return callable Wrapped sanitize callback.
	 */
	public function wrap_sanitize_callback( $option, $sanitize_callback ) {

		$this->sanitize_callbacks[ $option ] = $sanitize_callback;

		return array( $this, 'filter_sanitize_option' );
	}

	/**
	 * Sanitization callback to use instead of the actual callback to the `register_setting()` method.
	 *
	 * This callback will ensure validation only happens in the network admin, to prevent conflicts.
	 *
	 * @param string $value  The sanitized option value.
	 * @param string $option The option name.
	 *
	 * @return string The filtered sanitized option value.
	 */
	public function filter_sanitize_option( $value, $option ) {

		if ( empty( $this->sanitize_callbacks[ $option ] ) ) {
			return $value;
		}

		$sanitize_callback = $this->sanitize_callbacks[ $option ];

		// Only run network option sanitization if in the network admin to prevent conflicts.
		if ( empty( $sanitize_callback ) || ! is_network_admin() ) {
			return $value;
		}

		return call_user_func( $sanitize_callback, $value );
	}

	/**
	 * Filters the default value for a network option.
	 *
	 * This function is added as a filter to `default_site_option_{$option}` for network options that
	 * are registered with a default.
	 *
	 * @param mixed  $default Existing default value to return.
	 * @param string $option  The option name.
	 *
	 * @return mixed The filtered default value.
	 */
	public function filter_default_option( $default, $option ) {

		// If a default value was manually passed to the function, allow it to override.
		if ( $default !== false ) {
			return $default;
		}

		if ( empty( $this->registered_settings[ $option ] ) ) {
			return $default;
		}

		return $this->registered_settings[ $option ]['default'];
	}

	/**
	 * Hooks in the necessary actions and filters.
	 */
	public function register_hooks() {

		if ( $this->hooks_registered ) {
			return;
		}

		$this->hooks_registered = true;

		add_action( 'admin_action_' . self::UPDATE_ACTION, array( $this, 'handle_update_options_request' ) );
	}

	/**
	 * Gets the singleton instance of this class.
	 *
	 * @return Yoast_Network_Settings_API The singleton instance.
	 */
	public static function get() {

		if ( self::$instance === null ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Checks the requirements for this class to be used.
	 *
	 * If these requirements are not met, this class should not be initialized.
	 *
	 * @return bool True if requirements are met, false otherwise.
	 */
	public static function check_requirements() {
		return is_multisite() && is_network_admin();
	}
}
