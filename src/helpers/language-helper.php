<?php

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Language_Utils;
use Yoast\WP\SEO\Conditionals\Slovak_Support_Conditional;
use Yoast\WP\SEO\Config\Researcher_Languages;

/**
 * A helper object for language features.
 */
class Language_Helper {
	/**
	 * Language_Helper constructor.
	 *
	 * @param Slovak_Support_Conditional $slovak_conditional The Slovak support conditional.
	 */
	public function __construct(
		Slovak_Support_Conditional  $slovak_conditional
	) {
		$this->slovak_conditional = $slovak_conditional;
	}

	/**
	 * Checks whether word form recognition is active for the used language.
	 *
	 * @param string $language The used language.
	 *
	 * @return bool Whether word form recognition is active for the used language.
	 */
	public function is_word_form_recognition_active( $language ) {
		$supported_languages = [ 'de', 'en', 'es', 'fr', 'it', 'nl', 'ru', 'id', 'pt', 'pl', 'ar', 'sv', 'he', 'hu', 'nb', 'tr', 'cs' ];

		// If SLOVAK_SUPPORT feature is enabled, push Slovak to the array of the supported languages
		if ( $this->slovak_conditional->is_met() ) {
			array_push( $supported_languages, 'sk' );
		}

		return \in_array( $language, $supported_languages, true );
	}

	/**
	 * Checks whether the given language has function word support.
	 * (E.g. function words are used or filtered out for this language when doing some SEO and readability assessments).
	 *
	 * @param string $language The language to check.
	 *
	 * @return bool Whether the language has function word support.
	 */
	public function has_function_word_support( $language ) {
		$supported_languages = [ 'en', 'de', 'nl', 'fr', 'es', 'it', 'pt', 'ru', 'pl', 'sv', 'id', 'he', 'ar', 'hu', 'nb', 'tr', 'cs' ];

		// If SLOVAK_SUPPORT feature is enabled, push Slovak to the array of the supported languages
		if ( $this->slovak_conditional->is_met() ) {
			array_push( $supported_languages, 'sk' );
		}

		return \in_array( $language, $supported_languages, true );
	}

	/**
	 * Checks whether we have a specific researcher for the current locale and returns that language.
	 * If there is no researcher for the current locale, returns default as the researcher.
	 *
	 * @return string The language to use to select a researcher.
	 */
	public function get_researcher_language() {
		$researcher_language = WPSEO_Language_Utils::get_language( get_locale() );
		$supported_languages = Researcher_Languages::SUPPORTED_LANGUAGES;

		// If SLOVAK_SUPPORT feature is enabled, push Slovak to the array of the supported languages
		if ( $this->slovak_conditional->is_met() ) {
			array_push( $supported_languages, 'sk' );
		}

		if ( ! \in_array( $researcher_language, $supported_languages, true ) ) {
			$researcher_language = 'default';
		}

		return $researcher_language;
	}
}
