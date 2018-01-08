<?php

namespace Yoast\YoastSEO\Config;

use Yoast\YoastSEO\Prefix_Dependencies;
use Yoast\YoastSEO\WordPress\Integration;
use Yoast\YoastSEO\WordPress\Integration_Group;
use YoastSEO_Vendor\Model;
use YoastSEO_Vendor\ORM;

class Plugin implements Integration {
	/** @var array List of integrations. */
	protected $integrations = array();

	/** @var bool Flag to allow booting or not. */
	protected $initialize_success = false;

	/**
	 * Adds an integration to the stack
	 *
	 * @param Integration $integration Integration to add.
	 */
	public function add_integration( Integration $integration ) {
		$this->integrations[] = $integration;
	}

	/**
	 * Initializes the plugin.
	 */
	public function initialize() {

		$prefix = new Prefix_Dependencies( YOAST_VENDOR_PREFIX );
		$orm_classes = new ClassAliases\ORM();
		$prefix->prefix( $orm_classes->get_classes() );

		ORM::configure( 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME );
		ORM::configure( 'username', DB_USER );
		ORM::configure( 'password', DB_PASSWORD );

		Model::$auto_prefix_models = '\\Yoast\\YoastSEO\\Models\\';

		$migration = new Database_Migration( $GLOBALS['wpdb'] );
		$this->initialize_success = $migration->initialize();
	}

	/**
	 * Registers the hooks for all registered integrations.
	 */
	public function register_hooks() {
		if ( ! $this->initialize_success ) {
			return;
		}

		if ( is_admin() ) {
			$this->add_integration( new Admin() );
		}

		if ( ! is_admin() ) {
			$this->add_integration( new Frontend() );
		}

		do_action( 'wpseo_load_integrations', $this );

		$integration_group = new Integration_Group( $this->integrations );
		$integration_group->register_hooks();
	}
}
