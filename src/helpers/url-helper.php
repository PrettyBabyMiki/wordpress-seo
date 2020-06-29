<?php
/**
 * A helper object for urls.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Utils;
use Yoast\WP\SEO\Models\SEO_Links;

/**
 * Class Url_Helper
 */
class Url_Helper {

	/**
	 * Retrieve home URL with proper trailing slash.
	 *
	 * @param string      $path   Path relative to home URL.
	 * @param string|null $scheme Scheme to apply.
	 *
	 * @codeCoverageIgnore - We have to write test when this method contains own code.
	 *
	 * @return string Home URL with optional path, appropriately slashed if not.
	 */
	public function home( $path = '', $scheme = null ) {
		return WPSEO_Utils::home_url( $path, $scheme );
	}

	/**
	 * Check whether a url is relative.
	 *
	 * @param string $url URL string to check.
	 *
	 * @codeCoverageIgnore - We have to write test when this method contains own code.
	 *
	 * @return bool True when url is relative.
	 */
	public function is_relative( $url ) {
		return WPSEO_Utils::is_url_relative( $url );
	}

	/**
	 * Gets the path from the passed URL.
	 *
	 * @param string $url The URL to get the path from.
	 *
	 * @codeCoverageIgnore It only wraps a WordPress function.
	 *
	 * @return string The path of the URL. Returns an empty string if URL parsing fails.
	 */
	public function get_url_path( $url ) {
		return (string) \wp_parse_url( $url, \PHP_URL_PATH );
	}

	/**
	 * Determines the file extension of the given url.
	 *
	 * @param string $url The URL.
	 *
	 * @return string The extension.
	 */
	public function get_extension_from_url( $url ) {
		$path = $this->get_url_path( $url );

		if ( $path === '' ) {
			return '';
		}

		$parts = \explode( '.', $path );
		if ( empty( $parts ) || \count( $parts ) === 1 ) {
			return '';
		}

		return \end( $parts );
	}

	/**
	 * Ensures that the given url is an absolute url.
	 *
	 * @param string $url The url that needs to be absolute.
	 *
	 * @return string The absolute url.
	 */
	public function ensure_absolute_url( $url ) {
		if ( ! \is_string( $url ) || $url === '' ) {
			return $url;
		}

		if ( $this->is_relative( $url ) === true ) {
			return $this->build_absolute_url( $url );
		}

		return $url;
	}

	/**
	 * Parse the home URL setting to find the base URL for relative URLs.
	 *
	 * @param string $path Optional path string.
	 *
	 * @return string
	 */
	public function build_absolute_url( $path = null ) {
		$path      = \wp_parse_url( $path, \PHP_URL_PATH );
		$url_parts = \wp_parse_url( \home_url() );

		$base_url = \trailingslashit( $url_parts['scheme'] . '://' . $url_parts['host'] );

		if ( ! \is_null( $path ) ) {
			$base_url .= \ltrim( $path, '/' );
		}

		return $base_url;
	}

	/**
	 * Returns the link type.
	 *
	 * @param array $url      The URL, as parsed by wp_parse_url.
	 * @param array $home_url Optional. The home URL, as parsed by wp_parse_url. Used to avoid reparsing the home_url.
	 * @param bool  $is_image Whether or not the link is an image.
	 *
	 * @return string The link type.
	 */
	public function get_link_type( $url, $home_url = null, $is_image = false ) {
		// If there is no scheme the link is always internal.
		if ( empty( $url['scheme'] ) ) {
			return ( $is_image ) ? SEO_Links::TYPE_INTERNAL_IMAGE : SEO_Links::TYPE_INTERNAL;
		}

		// If there is a scheme but it's not https? then the link is always external.
		if ( ! in_array( $url['scheme'], [ 'http', 'https' ], true ) ) {
			return ( $is_image ) ? SEO_Links::TYPE_EXTERNAL_IMAGE : SEO_Links::TYPE_EXTERNAL;
		}

		if ( \is_null( $home_url ) ) {
			$home_url = \wp_parse_url( \home_url() );
		}

		// When the base host is equal to the host.
		if ( isset( $url['host'] ) && $url['host'] !== $home_url['host'] ) {
			return ( $is_image ) ? SEO_Links::TYPE_EXTERNAL_IMAGE : SEO_Links::TYPE_EXTERNAL;
		}

		// There is no base path and thus all URLs of the same domain are internal.
		if ( empty( $home_url['path'] ) ) {
			return ( $is_image ) ? SEO_Links::TYPE_INTERNAL_IMAGE : SEO_Links::TYPE_INTERNAL;
		}

		// When there is a path and it matches the start of the url.
		if ( isset( $url['path'] ) && strpos( $url['path'], $home_url['path'] ) !== 0 ) {
			return ( $is_image ) ? SEO_Links::TYPE_INTERNAL_IMAGE : SEO_Links::TYPE_INTERNAL;
		}

		return ( $is_image ) ? SEO_Links::TYPE_EXTERNAL_IMAGE : SEO_Links::TYPE_EXTERNAL;
	}
}
