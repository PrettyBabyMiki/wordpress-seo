<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Profile_URL_Twitter
 */
class WPSEO_Config_Field_Profile_URL_Twitter extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Profile_URL_Twitter constructor.
	 */
	public function __construct() {
		parent::__construct( 'profileUrlTwitter', 'Input' );

		$this->set_property( 'label', __( 'Twitter URL', 'wordpress-seo' ) );
		$this->set_property( 'pattern', '^https:\/\/twitter\.com\/([^/]+)$' );
	}

	/**
	 * Set adapter
	 *
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to register lookup on.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$adapter->add_yoast_lookup( $this->get_identifier(), 'wpseo_social', 'twitter_site' );
	}
}
