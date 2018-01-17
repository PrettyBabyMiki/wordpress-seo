<?php
/**
 * @package WPSEO|Admin
 */

/**
 * Represents a way to determine an assets location.
 */
interface WPSEO_Admin_Asset_Location {

	/**
	 * Should determine the URL of an asset.
	 *
	 * @param WPSEO_Admin_Asset $asset The asset to determine the URL for.
	 * @param string            $type  The type of asset. Usually JS or CSS.
	 *
	 * @return string The URL of the asset.
	 */
	public function get_url( WPSEO_Admin_Asset $asset, $type );
}
