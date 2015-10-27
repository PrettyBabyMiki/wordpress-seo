<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Taxonomy_Social_Tab
 *
 * This class parses all the values for the social tab in the Yoast SEO settings metabox
 */
class WPSEO_Taxonomy_Social_Fields extends WPSEO_Taxonomy_Fields {

	/**
	 * Setting the class properties
	 *
	 * @param stdClass $term    The current taxonomy.
	 * @param array    $options The options.
	 */
	public function __construct( $term, array $options = array() ) {
		parent::__construct( $term, $options );
		$this->networks = $this->get_social_networks();
	}

	/**
	 * When this method returns false, the social tab in the meta box will be hidden
	 *
	 * @return bool
	 */
	public function show_social() {
		return ( $this->options['opengraph'] === true || $this->options['twitter'] === true || $this->options['googleplus'] === true );
	}

	/**
	 * Gets the social meta fields by social network for the taxonomy.
	 *
	 * @param string $network The social network for which to fetch the fields.
	 *
	 * @return array
	 */
	public function get_by_network( $network ) {
		$settings = $this->networks[ $network ];

		return array(
			$settings['network'] . '-title'       => $this->get_field_config(
				/* translators: %s expands to the social network name */
				sprintf( __( '%s Title', 'wordpress-seo' ), $settings['label'] ),
				/* translators: %1$s expands to the social network name */
				sprintf( esc_html__( 'If you don\'t want to use the title for sharing on %1$s but instead want another title there, write it here.', 'wordpress-seo' ), $settings['label'] ),
				'text',
				array( 'class' => 'large-text' )
			),
			$settings['network'] . '-description' => $this->get_field_config(
				/* translators: %s expands to the social network name */
				sprintf( __( '%s Description', 'wordpress-seo' ), $settings['label'] ),
				/* translators: %1$s expands to the social network name */
				sprintf( esc_html__( 'If you don\'t want to use the meta description for sharing on %1$s but want another description there, write it here.', 'wordpress-seo' ), $settings['label'] ),
				'textarea'
			),
			$settings['network'] . '-image'       => $this->get_field_config(
				/* translators: %s expands to the social network name */
				sprintf( __( '%s Image', 'wordpress-seo' ), $settings['label'] ),
				/* translators: %1$s expands to the social network name */
				sprintf( esc_html__( 'If you want to use an image for sharing on %1$s, you can upload / choose an image or add the image URL here.', 'wordpress-seo' ), $settings['label'] ) . '<br />' .
				/* translators: %1$s expands to the social network name, %2$s expands to the image size */
				sprintf( __( 'The recommended image size for %1$s is %2$spx.', 'wordpress-seo' ), $settings['label'], $settings['size'] ),
				'upload'
			),
		);
	}

	/**
	 * Returning the fields for the social media tab
	 *
	 * @return array
	 */
	public function get() {
		$fields = array();
		foreach ( $this->networks as $option => $settings ) {
			$fields_to_push = $this->get_by_network( $option );

			$fields = array_merge( $fields, $fields_to_push );
		}

		return $this->filter_hidden_fields( $fields );
	}

	/**
	 * Getting array with the social networks
	 *
	 * @return array
	 */
	private function get_social_networks() {
		$social_networks = array(
			'opengraph'  => $this->social_network( 'opengraph', __( 'Facebook', 'wordpress-seo' ), '1200 x 628' ),
			'twitter'    => $this->social_network( 'twitter', __( 'Twitter', 'wordpress-seo' ), '1024 x 512' ),
			'googleplus' => $this->social_network( 'google-plus', __( 'Google+', 'wordpress-seo' ), '800 x 1200' ),
		);

		$social_networks = $this->filter_social_networks( $social_networks );

		return $social_networks;
	}

	/**
	 * Returns array with the config fields for the social network
	 *
	 * @param string $network    The name of the social network.
	 * @param string $label		 The label for the social network.
	 * @param string $image_size The image dimensions.
	 *
	 * @return array
	 */
	private function social_network( $network, $label, $image_size ) {
		return array(
			'network' => $network,
			'label'   => $label,
			'size'    => $image_size,
		);
	}

	/**
	 * Filter the social networks which are disabled in the configuration
	 *
	 * @param array $social_networks Array with the social networks that has to be filtered.
	 *
	 * @return array
	 */
	private function filter_social_networks( array $social_networks ) {
		foreach ( $social_networks as $social_network => $settings ) {
			if ( empty( $this->options[ $social_network ] ) ) {
				unset( $social_networks[ $social_network ] );
			}
		}

		return $social_networks;
	}

}
