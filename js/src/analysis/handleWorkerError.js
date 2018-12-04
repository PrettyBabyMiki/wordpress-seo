import React from "react";
import { __ } from "@wordpress/i18n";
import interpolateComponents from "interpolate-components";
import { setWarningMessage } from "../redux/actions/warning";
import getL10nObject from "./getL10nObject";

/**
 * Dispatches a warning message if analysis fails.
 *
 * @returns {void}.
 */
export default function handleWorkerError() {
	const isRecalibrationBetaActive = getL10nObject().recalibrationBetaActive;

	let message = [];
	if ( isRecalibrationBetaActive ) {
		// Disable reason: the anchor has content, as the component uses interpolateComponents.
		/* eslint-disable jsx-a11y/anchor-has-content */
		message = interpolateComponents( {
			/* Translators:
			 * {{link}} resolves to the link to SEO/Features,
			 * {{/link}} resolves to the link closing tag,
			 * {{bold}} resolves to a bold opening tag (<b>),
			 * {{/bold}} resolves to a bold closing tag.
			 */
			mixedString: __(
				"We're sorry! Unfortunately, the recalibrated analysis beta doesn't work as intended with your current " +
				"setup {{bold}}yet{{/bold}}. " +
				"Please {{link}}deactivate the recalibration beta in your features{{/link}} and please try again later. " +
				"We value your input!",
				"wordpress-seo"
			),
			components: {
				bold: <b />,
				link: <a href="/wp-admin/admin.php?page=wpseo_dashboard#top#features" target="_blank" rel="noopener noreferrer" />,
			},
		} );
		/* eslint-enable jsx-a11y/anchor-has-content */
		window.YoastSEO.store.dispatch( setWarningMessage( message ) );
	}
}
