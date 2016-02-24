<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Cache Data interface
 */
interface WPSEO_Sitemap_Cache_Data_Interface {
	/**
	 * Set the content of the sitemap
	 *
	 * @param string $sitemap The XML content of the sitemap.
	 *
	 * @return void
	 */
	public function set_sitemap( $sitemap );

	/**
	 * Set the status of the sitemap
	 *
	 * @param bool|string $usable True/False or 'ok'/'error' for status.
	 *
	 * @return void
	 */
	public function set_status( $usable );

	/**
	 * @return string The XML content of the sitemap.
	 */
	public function get_sitemap();

	/**
	 * Get the status of this sitemap
	 *
	 * @return string Status 'ok', 'error' or 'unknown'.
	 */
	public function get_status();

	/**
	 * Is the sitemap content usable
	 *
	 * @return bool True if the sitemap is usable, False if not.
	 */
	public function is_usable();
}
