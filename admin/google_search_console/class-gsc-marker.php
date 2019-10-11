<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Google_Search_Console
 */

/**
 * Class WPSEO_GSC_Marker.
 *
 * @deprecated 11.4
 *
 * @codeCoverageIgnore
 */
class WPSEO_GSC_Marker {

	/**
	 * Setting up the needed API libs and return the result.
	 *
	 * If param URL is given, the request is performed by a bulk action.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $url Optional URL.
	 */
	public function __construct( $url = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );
	}

	/**
	 * Getting the response for the AJAX request.
	 *
	 * @deprecated 11.4
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string
	 */
	public function get_response() {
		_deprecated_function( __METHOD__, 'WPSEO 11.4' );

		return '';
	}
}
