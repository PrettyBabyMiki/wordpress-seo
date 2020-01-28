<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Schema utility functions.
 *
 * @since 11.6
 */
class WPSEO_Schema_Utils {

	/**
	 * Retrieves a user's Schema ID.
	 *
	 * @param int                  $user_id The ID of the User you need a Schema ID for.
	 * @param WPSEO_Schema_Context $context A value object with context variables.
	 *
	 * @return string The user's schema ID.
	 */
	public static function get_user_schema_id( $user_id, $context ) {
		$user = get_userdata( $user_id );

		if ( is_object( $user ) && isset( $user->user_login ) ) {
			return $context->site_url . WPSEO_Schema_IDs::PERSON_HASH . wp_hash( $user->user_login . $user_id );
		}
		return $context->site_url . WPSEO_Schema_IDs::PERSON_HASH;
	}

	/**
	 * Retrieves the language for the Schema pieces.
	 *
	 * Must use one of the language codes from the IETF BCP 47 standard. The
	 * language tag syntax is made of one or more subtags separated by a hyphen
	 * e.g. "en", "en-US", "zh-Hant-CN".
	 *
	 * @return string The Schema pieces language.
	 */
	public static function get_schema_piece_language() {
		/**
		 * Filter: 'wpseo_schema_piece_language' - Allow changing the Schema pieces language.
		 *
		 * @api string $type The Schema pieces language.
		 */
		return apply_filters( 'wpseo_schema_piece_language', get_bloginfo( 'language' ) );
	}
}
