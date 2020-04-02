<?php
/**
 * Presenter class for the schema object.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

/**
 * Class Schema_Presenter
 */
class Schema_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the schema output.
	 *
	 * @param bool $output_tag Optional. Whether or not to output the HTML tag. Defaults to true.
	 *
	 * @return string The schema tag.
	 */
	public function present( $output_tag = true ) {
		if ( ! $output_tag ) {
			return $this->presentation->schema;
		}

		$deprecated_data = [
			'_deprecated' => 'Please use the "wpseo_schema_*" filters to extend the Yoast SEO schema data - see the WPSEO_Schema class.',
		];

		/**
		 * Filter: 'wpseo_json_ld_output' - Allows disabling Yoast's schema output entirely.
		 *
		 * @api mixed If false or an empty array is returned, disable our output.
		 */
		$return = \apply_filters( 'wpseo_json_ld_output', $deprecated_data, '' );
		if ( $return === [] || $return === false ) {
			return '';
		}

		/**
		 * Action: 'wpseo_json_ld' - Output Schema before the main schema from Yoast SEO is output.
		 */
		\do_action( 'wpseo_json_ld' );

		if ( is_array( $this->presentation->schema ) ) {
			$output = \WPSEO_Utils::format_json_encode( $this->presentation->schema );
			$output = \str_replace( "\n", PHP_EOL . "\t", $output );
			return '<script type="application/ld+json" class="yoast-schema-graph">' . $output . '</script>';
		}

		return '';
	}
}
