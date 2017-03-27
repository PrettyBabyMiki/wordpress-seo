<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Represents the configuration choices component.
 */
class WPSEO_Config_Component_Configuration_Choices implements WPSEO_Config_Component {

	/**
	 * Gets the component identifier.
	 *
	 * @return string
	 */
	public function get_identifier() {
		return 'ConfigurationChoices';
	}

	/**
	 * Gets the field.
	 *
	 * @return WPSEO_Config_Field
	 */
	public function get_field() {
		$field = new WPSEO_Config_Field_Configuration_Choices();

		/* translators: %s resolves to Yoast SEO */
		$field->set_property( 'label', sprintf( __( 'Please choose the %s configuration of your liking:', 'wordpress-seo' ), 'Yoast SEO' ) );

		$field->add_choice(
			__( 'Configure Yoast SEO in a few steps', 'wordpress-seo' ),
			sprintf( __( 'Welcome to the %1$s configuration wizard. In a few simple steps we\'ll help you configure your SEO settings to match your website\'s needs! %1$s will take care of all the technical optimizations your site needs.', 'wordpress-seo' ), 'Yoast SEO' ),
			array(
				'type'   => 'primary',
				'text'   => __( 'Start your configuration', 'wordpress-seo' ),
				'action' => 'nextStep',
			),
			plugin_dir_url( WPSEO_FILE ) . '/images/Yoast_SEO_Icon.svg'
		);
		$field->add_choice(
			__( 'Let us set up Yoast SEO for you', 'wordpress-seo' ),
			sprintf(
				__( 'While we strive to make setting up %1$s as easy as possible, but we understand it can still be daunting. If you would rather have us set up %1$s for you (and get a copy of %2$s in the process), order a %1$s configuration service and sit back while we configure your site.', 'wordpress-seo' ),
				'Yoast SEO',
				'Yoast SEO Premium'
			),
			array(
				'type'   => 'secondary',
				'text'   => __( 'Configuration service', 'wordpress-seo' ),
				'action' => 'followURL',
				'url'    => 'https://yoa.st/configuration_service',
			),
			plugin_dir_url( WPSEO_FILE ) . 'images/yoast-configuration-icon.svg'
		);

		return $field;
	}

	/**
	 * Get the data for the field.
	 *
	 * @return mixed
	 */
	public function get_data() {
		return array();
	}

	/**
	 * Save data
	 *
	 * @param array $data Data containing changes.
	 *
	 * @return mixed
	 */
	public function set_data( $data ) {
		return true;
	}
}
