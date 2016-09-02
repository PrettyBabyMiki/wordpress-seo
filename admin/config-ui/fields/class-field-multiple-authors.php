<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Multiple_Authors
 */
class WPSEO_Config_Field_Multiple_Authors extends WPSEO_Config_Field_Choice {
	/**
	 * WPSEO_Config_Field_Multiple_Authors constructor.
	 */
	public function __construct() {
		parent::__construct( 'multipleAuthors' );

		$this->set_property( 'label', __( 'Does your site have multiple authors?', 'wordpress-seo' ) );

		$this->add_choice( 'yes', __( 'Yes', 'wordpress-seo' ) );
		$this->add_choice( 'no', __( 'No', 'wordpress-seo' ) );
	}

	/**
	 * Set adapter.
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
	 * Get the data from the stored options.
	 *
	 * @return null|string
	 */
	public function get_data() {

		$option = WPSEO_Options::get_option( 'wpseo' );
		if ( isset( $option[ 'has_multiple_authors' ] ) ) {
			$value = $option[ 'has_multiple_authors' ];
		}

		if ( ! isset( $value ) || is_null( $value ) ) {
			// If there are more than one users with level > 1 default to multiple authors.
			$users = get_users( array(
				'fields' => 'IDs',
				'who'    => 'authors',
			) );

			$value = count( $users ) > 1;
		}

		return ( $value ) ? 'yes' : 'no';
	}

	/**
	 * Set the data in the options.
	 *
	 * @param {string} $data The data to set for the field.
	 *
	 * @return bool Returns true or false for successful storing the data.
	 */
	public function set_data( $data ) {
		$value = ( $data === 'yes' );

		$option                           = WPSEO_Options::get_option( 'wpseo' );
		$option[ 'has_multiple_authors' ] = $value;

		update_option( 'wpseo', $option );

		// Check if everything got saved properly.
		$saved_option = WPSEO_Options::get_option( 'wpseo' );

		return ( $saved_option[ 'has_multiple_authors' ] === $option[ 'has_multiple_authors' ] );
	}
}
