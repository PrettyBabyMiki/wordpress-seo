<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Class WPSEO_Schema
 *
 * Outputs schema code specific for Google's JSON LD stuff.
 *
 * @since 1.8
 */
class WPSEO_Schema implements WPSEO_WordPress_Integration {
	/**
	 * Registers the hooks.
	 */
	public function register_hooks() {
		add_action( 'wpseo_head', array( $this, 'json_ld' ), 91 );
		add_action( 'wpseo_json_ld', array( $this, 'output' ), 1 );
	}

	/**
	 * JSON LD output function that the functions for specific code can hook into.
	 *
	 * @since 1.8
	 */
	public function json_ld() {
		do_action( 'wpseo_json_ld' );
	}

	/**
	 * Outputs the JSON LD code in a valid JSON+LD wrapper.
	 *
	 * @since 10.2
	 *
	 * @return void
	 */
	public function output() {
		$graph = array();

		foreach ( $this->get_graph_pieces() as $piece ) {
			if ( ! $piece->is_needed() ) {
				continue;
			}

			$graph_piece = $piece->generate();

			/**
			 * Filter: 'wpseo_schema_<class name>' - Allows changing graph piece output.
			 *
			 * @api array $graph_piece The graph piece to filter.
			 */
			$class       = str_replace( 'wpseo_schema_', '', strtolower( get_class( $piece ) ) );
			$graph_piece = apply_filters( 'wpseo_schema_' . $class, $graph_piece );
			if ( is_array( $graph_piece ) ) {
				$graph[] = $graph_piece;
			}
		}

		if ( is_array( $graph ) && ! empty( $graph ) ) {
			$output = array(
				'@context' => 'https://schema.org',
				'@graph'   => $graph,
			);

			echo "<script type='application/ld+json' class='yoast-schema-graph yoast-schema-graph--main'>", WPSEO_Utils::format_json_encode( $output ), '</script>', "\n";
		}
	}

	/**
	 * Gets all the graph pieces we need.
	 *
	 * @return array A filtered array of graph pieces.
	 */
	private function get_graph_pieces() {
		$context = new WPSEO_Schema_Context();

		$pieces = array(
			new WPSEO_Schema_Organization( $context ),
			new WPSEO_Schema_Person( $context ),
			new WPSEO_Schema_Website( $context ),
			new WPSEO_Schema_WebPage( $context ),
			new WPSEO_Schema_Breadcrumb( $context ),
			new WPSEO_Schema_Article( $context ),
			new WPSEO_Schema_Author( $context ),
		);

		/**
		 * Filter: 'wpseo_schema_graph_pieces' - Allows adding pieces to the graph.
		 *
		 * @param WPSEO_Schema_Context $context An object with context variables.
		 *
		 * @api array $pieces The schema pieces.
		 */
		return apply_filters( 'wpseo_schema_graph_pieces', $pieces, $context );
	}
}
