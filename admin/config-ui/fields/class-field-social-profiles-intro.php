<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Social_Profiles_Intro
 */
class WPSEO_Config_Field_Social_Profiles_Intro extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Social_Profiles_Intro constructor.
	 */
	public function __construct() {
		parent::__construct( 'socialProfilesIntro', 'HTML' );

		$intro_text = sprintf(
			/* translators: %1$s is the plugin name, %2$s is a link opening tag, %3$s is a link closing tag. */
			__( '%1$s can tell search engines about your social media profiles. These will be used in Google\'s Knowledge Graph. There are additional sharing options in the %1$s Social settings. %2$sRead more%3$s about these options.', 'wordpress-seo' ),
			'Yoast SEO',
			'<a target="_blank" rel="noopener noreferrer" href="' . WPSEO_Shortlinker::get( 'https://yoa.st/1ey' ) . '">',
			'</a>'
		);

		$html = '<p>' . $intro_text . '</p>';

		$this->set_property( 'html', $html );
	}
}
