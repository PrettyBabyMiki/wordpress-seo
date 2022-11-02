<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Metabox
 */

/**
 * Represents the inclusive language analysis.
 */
class WPSEO_Metabox_Analysis_Inclusive_Language implements WPSEO_Metabox_Analysis {

	/**
	 * Whether this analysis is enabled.
	 *
	 * @return bool Whether or not this analysis is enabled.
	 */
	public function is_enabled() {
		return $this->is_globally_enabled() && $this->is_user_enabled() && $this->is_current_version_supported()
				&& YoastSEO()->helpers->language->has_inclusive_language_support( \WPSEO_Language_Utils::get_language( \get_locale() ) );
	}

	/**
	 * Whether or not this analysis is enabled by the user.
	 *
	 * @return bool Whether or not this analysis is enabled by the user.
	 */
	public function is_user_enabled() {
		return ! get_the_author_meta( 'wpseo_inclusive_language_analysis_disable', get_current_user_id() );
	}

	/**
	 * Whether or not this analysis is enabled globally.
	 *
	 * @return bool Whether or not this analysis is enabled globally.
	 */
	public function is_globally_enabled() {
		return WPSEO_Options::get( 'inclusive_language_analysis_active', false );
	}

	private function is_current_version_supported() {
		$is_premium      = YoastSEO()->helpers->product->is_premium();
		$premium_version = YoastSEO()->helpers->product->get_premium_version();

		/*
		 * In Premium version 19.7, inclusive language analysis is moved from Premium to Free. If the user has an older
		 * version of Premium, inclusive language should not be loaded in Free, since it is already loaded in Premium.
		 * An exception is if the user has the Premium version 19.2.
		 */
		return ! $is_premium || \version_compare( $premium_version, '19.7', '>=' ) ||
			\version_compare( $premium_version, '19.2', '==' ) ;
	}
}
