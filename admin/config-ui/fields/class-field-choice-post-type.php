<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Choice_Post_Type
 */
class WPSEO_Config_Field_Choice_Post_Type extends WPSEO_Config_Field_Choice {

	/** @var string Post type */
	protected $post_type;

	/**
	 * WPSEO_Config_Field_Choice_Post_Type constructor.
	 *
	 * @param string $post_type The post type to add.
	 * @param string $label     Label to show (translated post type).
	 */
	public function __construct( $post_type, $label ) {
		parent::__construct( 'postType' . ucfirst( $post_type ) );

		$this->post_type = $post_type;

		$this->set_property( 'label', $label );

		$this->add_choice( 'true', 'Visible' );
		$this->add_choice( 'false', 'Hidden' );
	}

	/**
	 * Set adapter
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_custom_lookup(
			$this->get_identifier(),
			array( $this, 'get_data' ),
			array( $this, 'set_data' )
		);
	}

	/**
	 * @return bool
	 */
	public function get_data() {
		$option = WPSEO_Options::get_option( 'wpseo_xml' );

		$key = 'post_types-' . $this->post_type . '-not_in_sitemap';

		return ( ! isset( $option[ $key ] ) || false === $option[ $key ] );
	}

	/**
	 * Set new data
	 *
	 * @param string $visible Visible (true) or hidden (false).
	 *
	 * @return bool
	 */
	public function set_data( $visible ) {
		$post_type = $this->post_type;

		$option = WPSEO_Options::get_option( 'wpseo_xml' );

		$option[ 'post_types-' . $post_type . '-not_in_sitemap' ] = ( $visible !== 'false' );

		update_option( 'wpseo_xml', $option );

		// Check if everything got saved properly.
		$saved_option = WPSEO_Options::get_option( 'wpseo_xml' );

		return ( ( $visible !== 'false' ) && $saved_option[ 'post_types-' . $post_type . '-not_in_sitemap' ] === true );
	}
}
