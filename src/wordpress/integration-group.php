<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\YoastSEO\WordPress;
 */

namespace Yoast\YoastSEO\WordPress;

/**
 * Manage integrations and registers hooks at the required moment.
 */
class Integration_Group implements Integration {
	/** @var Integration[] List of integrations. */
	protected $integrations = array();

	/**
	 * Integration_Group constructor.
	 *
	 * @param Integration[] $integrations List of integrations to load.
	 *
	 * @return void
	 */
	public function __construct( array $integrations = array() ) {
		$this->integrations = $this->ensure_integration( $integrations );
	}

	/**
	 * Adds an integration to the group.
	 *
	 * @param Integration $integration The integration to add.
	 *
	 * @return void
	 */
	public function add_integration( Integration $integration ) {
		$this->integrations[] = $integration;
	}

	/**
	 * Initializes all registered integrations.
	 *
	 * @return void
	 */
	public function register_hooks() {
		array_map(
			function( Integration $integration ) {
				$integration->register_hooks();
			},
			$this->integrations
		);
	}

	/**
	 * Ensures the list of Integrations are loaded.
	 *
	 * @param array $integrations List of Integrations to load.
	 *
	 * @return array List of Integrations.
	 */
	protected function ensure_integration( array $integrations ) {
		return array_filter( $integrations, function( $integration ) {
			return $integration instanceof Integration;
		} );
	}
}
