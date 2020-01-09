<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Renders XML output for sitemaps.
 */
class WPSEO_Sitemaps_Renderer {

	/**
	 * XSL stylesheet for styling a sitemap for web browsers.
	 *
	 * @var string
	 */
	protected $stylesheet = '';

	/**
	 * Holds the get_bloginfo( 'charset' ) value to reuse for performance.
	 *
	 * @var string
	 */
	protected $charset = 'UTF-8';

	/**
	 * Holds charset of output, might be converted.
	 *
	 * @var string
	 */
	protected $output_charset = 'UTF-8';

	/**
	 * If data encoding needs to be converted for output.
	 *
	 * @var bool
	 */
	protected $needs_conversion = false;

	/**
	 * The date helper.
	 *
	 * @var WPSEO_Date_Helper
	 */
	protected $date;

	/**
	 * Set up object properties.
	 */
	public function __construct() {
		$stylesheet_url       = preg_replace( '/(^http[s]?:)/', '', $this->get_xsl_url() );
		$this->stylesheet     = '<?xml-stylesheet type="text/xsl" href="' . esc_url( $stylesheet_url ) . '"?>';
		$this->charset        = get_bloginfo( 'charset' );
		$this->output_charset = $this->charset;
		$this->date           = new WPSEO_Date_Helper();

		if (
			'UTF-8' !== $this->charset
			&& function_exists( 'mb_list_encodings' )
			&& in_array( $this->charset, mb_list_encodings(), true )
		) {
			$this->output_charset = 'UTF-8';
		}

		$this->needs_conversion = $this->output_charset !== $this->charset;
	}

	/**
	 * Builds the sitemap index.
	 *
	 * @param array $links Set of sitemaps index links.
	 *
	 * @return string
	 */
	public function get_index( $links ) {

		$xml = '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

		foreach ( $links as $link ) {
			$xml .= $this->sitemap_index_url( $link );
		}

		/**
		 * Filter to append sitemaps to the index.
		 *
		 * @param string $index String to append to sitemaps index, defaults to empty.
		 */
		$xml .= apply_filters( 'wpseo_sitemap_index', '' );
		$xml .= '</sitemapindex>';

		return $xml;
	}

	/**
	 * Builds the sitemap.
	 *
	 * @param array  $links        Set of sitemap links.
	 * @param string $type         Sitemap type.
	 * @param int    $current_page Current sitemap page number.
	 *
	 * @return string
	 */
	public function get_sitemap( $links, $type, $current_page ) {

		$urlset = '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" '
			. 'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd '
			. 'http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" '
			. 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";

		/**
		 * Filters the `urlset` for a sitemap by type.
		 *
		 * @api string $urlset The output for the sitemap's `urlset`.
		 */
		$xml = apply_filters( "wpseo_sitemap_{$type}_urlset", $urlset );

		foreach ( $links as $url ) {
			$xml .= $this->sitemap_url( $url );
		}

		/**
		 * Filter to add extra URLs to the XML sitemap by type.
		 *
		 * Only runs for the first page, not on all.
		 *
		 * @param string $content String content to add, defaults to empty.
		 */
		if ( $current_page === 1 ) {
			$xml .= apply_filters( "wpseo_sitemap_{$type}_content", '' );
		}

		$xml .= '</urlset>';

		return $xml;
	}

	/**
	 * Produce final XML output with debug information.
	 *
	 * @param string  $sitemap   Sitemap XML.
	 * @param boolean $transient Transient cache flag.
	 *
	 * @return string
	 */
	public function get_output( $sitemap, $transient ) {

		$output = '<?xml version="1.0" encoding="' . esc_attr( $this->output_charset ) . '"?>';

		if ( $this->stylesheet ) {
			/**
			 * Filter the stylesheet URL for the XML sitemap.
			 *
			 * @param string $stylesheet Stylesheet URL.
			 */
			$output .= apply_filters( 'wpseo_stylesheet_url', $this->stylesheet ) . "\n";
		}

		$output .= $sitemap;
		$output .= "\n<!-- XML Sitemap generated by Yoast SEO -->";
		$output .= $this->get_debug( $transient );

		return $output;
	}

	/**
	 * Get charset for the output.
	 *
	 * @return string
	 */
	public function get_output_charset() {
		return $this->output_charset;
	}

	/**
	 * Set a custom stylesheet for this sitemap. Set to empty to just remove the default stylesheet.
	 *
	 * @param string $stylesheet Full XML-stylesheet declaration.
	 */
	public function set_stylesheet( $stylesheet ) {
		$this->stylesheet = $stylesheet;
	}

	/**
	 * Build the `<sitemap>` tag for a given URL.
	 *
	 * @param array $url Array of parts that make up this entry.
	 *
	 * @return string
	 */
	protected function sitemap_index_url( $url ) {

		$date = null;

		if ( ! empty( $url['lastmod'] ) ) {
			$date = $this->date->format( $url['lastmod'] );
		}

		$url['loc'] = htmlspecialchars( $url['loc'], ENT_COMPAT, $this->output_charset, false );

		$output  = "\t<sitemap>\n";
		$output .= "\t\t<loc>" . $url['loc'] . "</loc>\n";
		$output .= empty( $date ) ? '' : "\t\t<lastmod>" . htmlspecialchars( $date, ENT_COMPAT, $this->output_charset, false ) . "</lastmod>\n";
		$output .= "\t</sitemap>\n";

		return $output;
	}

	/**
	 * Build the `<url>` tag for a given URL.
	 *
	 * Public access for backwards compatibility reasons.
	 *
	 * @param array $url Array of parts that make up this entry.
	 *
	 * @return string
	 */
	public function sitemap_url( $url ) {

		$date = null;


		if ( ! empty( $url['mod'] ) ) {
			// Create a DateTime object date in the correct timezone.
			$date = $this->date->format( $url['mod'] );
		}

		$url['loc'] = htmlspecialchars( $url['loc'], ENT_COMPAT, $this->output_charset, false );

		$output  = "\t<url>\n";
		$output .= "\t\t<loc>" . $this->encode_url_rfc3986( $url['loc'] ) . "</loc>\n";
		$output .= empty( $date ) ? '' : "\t\t<lastmod>" . htmlspecialchars( $date, ENT_COMPAT, $this->output_charset, false ) . "</lastmod>\n";

		if ( empty( $url['images'] ) ) {
			$url['images'] = [];
		}

		foreach ( $url['images'] as $img ) {

			if ( empty( $img['src'] ) ) {
				continue;
			}

			$output .= "\t\t<image:image>\n";
			$output .= "\t\t\t<image:loc>" . esc_html( $this->encode_url_rfc3986( $img['src'] ) ) . "</image:loc>\n";

			if ( ! empty( $img['title'] ) ) {

				$title = $img['title'];

				if ( $this->needs_conversion ) {
					$title = mb_convert_encoding( $title, $this->output_charset, $this->charset );
				}

				$title   = _wp_specialchars( html_entity_decode( $title, ENT_QUOTES, $this->output_charset ) );
				$output .= "\t\t\t<image:title><![CDATA[{$title}]]></image:title>\n";
			}

			if ( ! empty( $img['alt'] ) ) {

				$alt = $img['alt'];

				if ( $this->needs_conversion ) {
					$alt = mb_convert_encoding( $alt, $this->output_charset, $this->charset );
				}

				$alt     = _wp_specialchars( html_entity_decode( $alt, ENT_QUOTES, $this->output_charset ) );
				$output .= "\t\t\t<image:caption><![CDATA[{$alt}]]></image:caption>\n";
			}

			$output .= "\t\t</image:image>\n";
		}
		unset( $img, $title, $alt );

		$output .= "\t</url>\n";

		/**
		 * Filters the output for the sitemap URL tag.
		 *
		 * @api   string $output The output for the sitemap url tag.
		 *
		 * @param array $url The sitemap URL array on which the output is based.
		 */
		return apply_filters( 'wpseo_sitemap_url', $output, $url );
	}

	/**
	 * Apply some best effort conversion to comply with RFC3986.
	 *
	 * @param string $url URL to encode.
	 *
	 * @return string
	 */
	protected function encode_url_rfc3986( $url ) {

		if ( filter_var( $url, FILTER_VALIDATE_URL ) ) {
			return $url;
		}

		$path = wp_parse_url( $url, PHP_URL_PATH );

		if ( ! empty( $path ) && '/' !== $path ) {
			$encoded_path = explode( '/', $path );

			// First decode the path, to prevent double encoding.
			$encoded_path = array_map( 'rawurldecode', $encoded_path );

			$encoded_path = array_map( 'rawurlencode', $encoded_path );
			$encoded_path = implode( '/', $encoded_path );

			$url = str_replace( $path, $encoded_path, $url );
		}

		$query = wp_parse_url( $url, PHP_URL_QUERY );

		if ( ! empty( $query ) ) {

			parse_str( $query, $parsed_query );

			$parsed_query = http_build_query( $parsed_query, null, '&amp;', PHP_QUERY_RFC3986 );

			$url = str_replace( $query, $parsed_query, $url );
		}

		return $url;
	}

	/**
	 * Retrieves the XSL URL that should be used in the current environment
	 *
	 * When home_url and site_url are not the same, the home_url should be used.
	 * This is because the XSL needs to be served from the same domain, protocol and port
	 * as the XML file that is loading it.
	 *
	 * @return string The XSL URL that needs to be used.
	 */
	protected function get_xsl_url() {
		if ( home_url() !== site_url() ) {
			return home_url( 'main-sitemap.xsl' );
		}

		/*
		 * Fallback to circumvent a cross-domain security problem when the XLS file is
		 * loaded from a different (sub)domain.
		 */
		if ( strpos( plugins_url(), home_url() ) !== 0 ) {
			return home_url( 'main-sitemap.xsl' );
		}

		return plugin_dir_url( WPSEO_FILE ) . 'css/main-sitemap.xsl';
	}

	/**
	 * Adds debugging information to the output.
	 *
	 * @param bool $transient Transient cache was used or not.
	 *
	 * @return string Information about the functionality used to build the sitemap.
	 */
	protected function get_debug( $transient ) {
		$debug = defined( 'YOAST_SEO_DEBUG_SITEMAPS' ) && YOAST_SEO_DEBUG_SITEMAPS === true;
		if ( ! $debug ) {
			return '';
		}

		$memory_used = number_format( ( memory_get_peak_usage() / 1048576 ), 2 );
		$queries_run = ( $transient ) ? 'Served from transient cache' : 'Queries executed ' . absint( $GLOBALS['wpdb']->num_queries );

		$output = "\n<!-- {$memory_used}MB | {$queries_run} -->";

		if ( defined( 'SAVEQUERIES' ) && SAVEQUERIES ) {
			$queries = print_r( $GLOBALS['wpdb']->queries, true );
			$output .= "\n<!-- {$queries} -->";
		}

		return $output;
	}
}
