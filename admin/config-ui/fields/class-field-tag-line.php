<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Tag_Line
 */
class WPSEO_Config_Field_Tag_Line extends WPSEO_Config_Field {
	/**
	 * WPSEO_Config_Field_Tag_Line constructor.
	 */
	public function __construct() {
		parent::__construct( 'tagLine', 'Input' );

		// @todo apply i18n
		$this->set_property( 'label', 'Enter the tag line you want to use for your website. Using the default tag line is not recommended.' );
	}
}
