<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Statistics
 */

/**
 * Represents an implementation of the WPSEO_Endpoint interface to register one or multiple endpoints.
 */
class WPSEO_Endpoint_Statistics implements WPSEO_Endpoint {

	const REST_NAMESPACE = 'yoast/v1';
	const ENDPOINT_RETRIEVE = 'statistics';

	const CAPABILITY_RETRIEVE = 'read';

	/** @var WPSEO_Statistics_Service Service to use */
	protected $service;

	/**
	 * Constructs the WPSEO_Endpoint_Statistics class and sets the service to use.
	 *
	 * @param WPSEO_Statistics_Service $service Service to use.
	 */
	public function __construct( WPSEO_Statistics_Service $service ) {
		$this->service = $service;
	}

	/**
	 * Registers the REST routes that are available on the endpoint.
	 */
	public function register() {
		// Register fetch config.
		register_rest_route( self::REST_NAMESPACE, self::ENDPOINT_RETRIEVE, array(
			'methods'             => 'GET',
			'callback'            => array(
				$this->service,
				'get_statistics',
			),
			'permission_callback' => array(
				$this,
				'can_retrieve_data',
			),
		) );
	}

	/**
	 * Determines whether or not data can be retrieved for the registered endpoints.
	 *
	 * @return bool Whether or not data can be retrieved.
	 */
	public function can_retrieve_data() {
		return current_user_can( self::CAPABILITY_RETRIEVE );
	}
}
