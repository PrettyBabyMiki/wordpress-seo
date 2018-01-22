<?php

namespace Yoast\YoastSEO\Config;

use Yoast\YoastSEO\Migration_Null_Logger;
use Yoast\YoastSEO\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_FrameworkRunner;

class Database_Migration {
	/** @var \wpdb WPDB instance */
	protected $wpdb;

	/** @var Dependency_Management */
	protected $dependency_management;

	/**
	 * Migrations constructor.
	 *
	 * @param \wpdb                 $wpdb
	 * @param Dependency_Management $dependency_management
	 */
	public function __construct( $wpdb, Dependency_Management $dependency_management ) {
		$this->wpdb = $wpdb;
		$this->dependency_management = $dependency_management;
	}

	/**
	 * Initializes the migrations.
	 *
	 * @return bool
	 */
	public function initialize() {
		if ( get_transient( 'yoast_migration_problem' ) === '1' ) {
			return false;
		}

		// If the defines could not be set, we do not want to run.
		if ( ! $this->set_defines( Yoast_Model::get_table_name( 'migrations' ) ) ) {
			$this->set_failed_state( 'Defines could not be set.' );

			return false;
		}

		$main = new Ruckusing_FrameworkRunner(
			$this->get_configuration(),
			array(
				'db:migrate',
				'env=production'
			),
			new Migration_Null_Logger()
		);

		/*
		 * As the Ruckusing_FrameworkRunner is setting its own error and exception handlers,
		 * we need to restore the defaults.
		 */
		restore_error_handler();
		restore_exception_handler();

		try {
			$main->execute();
			$this->set_success_state();
		} catch ( \Exception $exception ) {
			// Something went wrong...
			// Disable functionality?
			$this->set_failed_state( $exception->getMessage() );

			return false;
		}

		return true;
	}

	/**
	 * Retrieves the migration configuration.
	 *
	 * @return array List of configuration elements.
	 */
	protected function get_configuration() {
		return array(
			'db'             => array(
				'production' => array(
					'type'      => 'mysql',
					'host'      => DB_HOST,
					'port'      => 3306,
					'database'  => DB_NAME,
					'user'      => DB_USER,
					'password'  => DB_PASSWORD,
					'charset'   => $this->get_charset(),
					'directory' => '', // This needs to be set, to use the migrations folder as base folder.
				),
			),
			'migrations_dir' => array( 'default' => WPSEO_PATH . 'migrations' ),
			// This needs to be set but is not used.
			'db_dir'         => true,
			// This needs to be set but is not used.
			'log_dir'        => true,
			// This needs to be set but is not used.
		);
	}

	/**
	 * Retrieves the database charset.
	 *
	 * @return string Charset configured for the database.
	 */
	protected function get_charset() {
		return $this->wpdb->charset;
	}

	/**
	 * @param $table_name
	 *
	 * @return bool
	 */
	protected function set_defines( $table_name ) {
		if ( $this->dependency_management->prefixed_available() ) {
			define( YOAST_VENDOR_DEFINE_PREFIX . 'RUCKUSING_BASE', WPSEO_PATH . YOAST_VENDOR_PREFIX_DIRECTORY . '/ruckusing' );
			define( YOAST_VENDOR_DEFINE_PREFIX . 'RUCKUSING_TS_SCHEMA_TBL_NAME', $table_name );

			return true;
		}

		if ( ! defined( 'RUCKUSING_BASE' ) ) {
			define( 'RUCKUSING_BASE', WPSEO_PATH . 'vendor/ruckusing/ruckusing-migrations' );
			define( 'RUCKUSING_TS_SCHEMA_TBL_NAME', $table_name );

			return true;
		}

		return false;
	}

	/**
	 * Handles state persistence for a failed migration environment.
	 *
	 * @param string $message Message explaining the reason for the failed state.
	 *
	 * @return void
	 */
	protected function set_failed_state( $message ) {
		// @todo do something with the message.
		\set_transient( 'yoast_migration_problem', 1, DAY_IN_SECONDS );
	}

	/**
	 * Removes the problem state from the system.
	 */
	protected function set_success_state() {
		\delete_transient( 'yoast_migration_problem' );
	}
}
