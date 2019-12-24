<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

// Mark this file as deprecated.
_deprecated_file( __FILE__, 'WPSEO 12.xx' );

/**
 * This class will fetch a new status from Ryte and if it's necessary it will
 * notify the site admin by email and remove the current meta value to hide the
 * notice for all admin users.
 *
 * @deprecated 12.xx
 * @codeCoverageIgnore
 */
class WPSEO_OnPage_Request extends WPSEO_Ryte_Request {

	/**
	 * Setting the request object.
	 *
	 * @deprecated 12.xx
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 12.xx', WPSEO_Ryte_Option::class );
	}
}
