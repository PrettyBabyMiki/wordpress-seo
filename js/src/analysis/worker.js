// External dependencies.
import get from "lodash/get";
import isUndefined from "lodash/isUndefined";
import merge from "lodash/merge";
import { AnalysisWorkerWrapper, createWorker } from "yoastseo";
import { __, sprintf } from "@wordpress/i18n";
import interpolateComponents from "interpolate-components";

// Internal dependencies.
import getContentLocale from "./getContentLocale";
import getDefaultQueryParams from "./getDefaultQueryParams";
import getTranslations from "./getTranslations";
import isContentAnalysisActive from "./isContentAnalysisActive";
import isKeywordAnalysisActive from "./isKeywordAnalysisActive";
import { setWarningMessage } from "../redux/actions/warning";
import getL10nObject from "./getL10nObject";

/**
 * Instantiates an analysis worker (wrapper).
 *
 * @param {Function} dispatch Function that dispatches an action.
 *
 * @returns {AnalysisWorkerWrapper} The analysis worker.
 */
export function createAnalysisWorker( dispatch ) {
	try {
		const url = get( window, [ "wpseoAnalysisWorkerL10n", "url" ], "wp-seo-analysis-worker.js" );
		return new AnalysisWorkerWrapper( createWorker( url ) );
	} catch( error ) {
		const isRecalibrationBetaActive = getL10nObject().recalibrationBetaActive;

		let message = [];
		if ( isRecalibrationBetaActive ) {
			message = [
				interpolateComponents( {
					/* Translators: {{link}} resolves to the link to SEO/Features, {{/link}} resolves to the link closing tag. */
					mixedString: __( "Sorry! Something went wrong while loading the recalibrated analysis beta! {{link}}Please deactivate the recalibration beta in your features.{{/link}}", "wordpress-seo" ),
					components: {
						link: <a href='/wp-admin/admin.php?page=wpseo_dashboard#top#features' target='_blank' />,
					},
				} ),
			];
		} else {
			message.push( "Sorry! Something went wrong while loading the analysis! If the problem persists please inform us about this error -copy-error-link-."  );
		}
		dispatch( setWarningMessage( message ) );
	}
}

/**
 * Retrieves the analysis configuration for the worker.
 *
 * @param {Object} [customConfiguration] The custom configuration to use.
 *
 * @returns {Object} The analysis configuration.
 */
export function getAnalysisConfiguration( customConfiguration = {} ) {
	let configuration = {
		locale: getContentLocale(),
		contentAnalysisActive: isContentAnalysisActive(),
		keywordAnalysisActive: isKeywordAnalysisActive(),
		defaultQueryParams: getDefaultQueryParams(),
		logLevel: get( window, [ "wpseoAnalysisWorkerL10n", "log_level" ], "ERROR" ),
	};

	configuration = merge( configuration, customConfiguration );

	const translations = getTranslations();
	if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
		configuration.translations = translations;
	}

	return configuration;
}
