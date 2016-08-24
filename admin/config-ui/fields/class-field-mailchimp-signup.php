<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

class WPSEO_Config_Field_Mailchimp_Signup extends WPSEO_Config_Field {

	public function __construct() {
		parent::__construct( "mailchimpSignup", "MailchimpSignup" );

		$current_user = wp_get_current_user();
		$user_email = ( $current_user->ID > 0 ) ? $current_user->user_email : '';

		// @todo apply i18n
		$this->set_property( "label", "If you would like us to keep you up-to-date regarding Yoast SEO and other plugins by Yoast, subscribe to our newsletter:" );
		$this->set_property( "mailchimpActionUrl", "http://yoast.us1.list-manage1.com/subscribe/post?u=ffa93edfe21752c921f860358&amp;id=972f1c9122" );
		$this->set_property( "currentUserEmail", $user_email );
	}
}
