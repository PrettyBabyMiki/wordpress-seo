<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

class WPSEO_Config_Field_Multiple_Authors extends WPSEO_Config_Field_Choice {
	public function __construct() {
		parent::__construct( 'multipleAuthors' );

		// @todo apply i18n
		$this->set_property( 'label', "Does your site have multiple authors?" );

		$this->add_choice( 'yes', 'Yes' );
		$this->add_choice( 'no', 'No' );
	}
}
