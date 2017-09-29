<?php
/**
 * @package WPSEO\Admin\Capabilities
 */

/**
 * Capabilities registration class.
 */
class WPSEO_Register_Capabilities implements WPSEO_WordPress_Integration {
	/**
	 * Registers the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_action( 'wpseo_register_capabilities', array( $this, 'register' ) );
		add_filter( 'members_get_capabilities', array( $this, 'get_capabilities' ) );
	}

	/**
	 * Registers the capabilities.
	 *
	 * @return void
	 */
	public function register() {
		$manager = WPSEO_Capability_Manager_Factory::get();

		$manager->register( 'wpseo_bulk_edit', array( 'editor', 'wpseo_editor', 'wpseo_manager' ) );
		$manager->register( 'wpseo_edit_advanced_metadata', array( 'wpseo_editor', 'wpseo_manager' ) );

		$manager->register( 'wpseo_manage_options', array( 'wpseo_manager' ) );

		/*
		 * Respect MultiSite 'access' setting if set to 'super admins only'.
		 * This means that local admins do not get the `wpseo_manage_options` capability.
		 */
		$ms_options = WPSEO_Options::get_option( 'ms' );
		if ( $ms_options['access'] !== 'superadmins' ) {
			$manager->register( 'wpseo_manage_options', array( 'administrator' ) );
		}
	}

	/**
	 * Get the Yoast SEO capabilities.
	 * Optionally append them to an existing array.
	 *
	 * @param  array $caps
	 * @return array
	 */
	public function get_capabilities( $caps = array() ) {
		if ( ! did_action( 'wpseo_register_capabilities' ) ) {
			do_action( 'wpseo_register_capabilities' );
		}

		$manager = WPSEO_Capability_Manager_Factory::get();

		return array_merge( $caps, $manager->get_capabilities() );
	}
}
