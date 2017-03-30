<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Field_Mailchimp_Signup
 */
class WPSEO_Config_Field_Mailchimp_Signup extends WPSEO_Config_Field {

	/**
	 * WPSEO_Config_Field_Mailchimp_Signup constructor.
	 */
	public function __construct() {
		parent::__construct( 'mailchimpSignup', 'MailchimpSignup' );

		$current_user = wp_get_current_user();
		$user_email = ( $current_user->ID > 0 ) ? $current_user->user_email : '';

		$this->set_property( 'title' , __( 'Stay up-to-date', 'wordpress-seo' ) );
		$this->set_property(
			'label',
			sprintf(
				/* translators: %s expands to Yoast SEO. */
				__( 'Your %1$s plugin is now set up. SEO, however, is subject to constant change. Sign up for our newsletter if you would like to keep up-to-date regarding %1$s, other plugins by Yoast and important news in the world of SEO.', 'wordpress-seo' ),
				'Yoast SEO'
			)
		);

		$this->set_property( 'decoration', plugin_dir_url( WPSEO_FILE ) . 'images/newsletter-collage.png' );

		$this->set_property( 'mailchimpActionUrl', 'https://yoast.us1.list-manage.com/subscribe/post-json?u=ffa93edfe21752c921f860358&id=972f1c9122' );
		$this->set_property( 'currentUserEmail', $user_email );
		$this->set_property( 'userName', trim( $current_user->user_firstname . ' ' . $current_user->user_lastname ) );
	}

	/**
	 * Get the data
	 *
	 * @return array
	 */
	public function get_data() {
		return array(
			'hasSignup' => $this->has_mailchimp_signup(),
		);

	}

	/**
	 * Checks if the user has entered his email for mailchimp already.
	 *
	 * @return bool
	 */
	protected function has_mailchimp_signup() {
		$user_meta = get_user_meta( get_current_user_id(), WPSEO_Config_Component_Mailchimp_Signup::META_NAME, true );
		return ( ! empty( $user_meta ) );
	}
}
