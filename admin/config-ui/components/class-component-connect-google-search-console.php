<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Component_Connect_Google_Search_Console.
 *
 * @deprecated 11.4
 *
 * @codeCoverageIgnore
 */
class WPSEO_Config_Component_Connect_Google_Search_Console implements WPSEO_Config_Component {

	/**
	 * Option identifier where the GSC token is stored.
	 *
	 * @var string
	 */
	const OPTION_ACCESS_TOKEN = 'wpseo-gsc-access_token';

	/**
	 * Option identifier where the GSC refresh token is stored.
	 *
	 * @var string
	 */
	const OPTION_REFRESH_TOKEN = 'wpseo-gsc-refresh_token';

	/**
	 * Service to use.
	 *
	 * @var WPSEO_GSC_Service
	 */
	protected $gsc_service;

	/**
	 * WPSEO_Config_Component_Connect_Google_Search_Console constructor.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * Set the Google Search Console service.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @param mixed $service Set service to use.
	 */
	public function set_gsc_service( $service ) {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * Gets the component identifier.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_identifier() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return 'ConnectGoogleSearchConsole';
	}

	/**
	 * Gets the field.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @return null
	 */
	public function get_field() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return null;
	}

	/**
	 * Get the data for the field.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @return mixed
	 */
	public function get_data() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return array();
	}

	/**
	 * Save data.
	 *
	 * @param array $data Data containing changes.
	 *
	 * @return mixed
	 */
	public function set_data( $data ) {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return array();
	}
}
