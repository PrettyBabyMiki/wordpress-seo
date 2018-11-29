/* External dependencies */
import { isArray } from "lodash";

/**
 * Builds a URL based on a string that has parts marked with % characters, like so:
 *
 * https://www.example.com/%category%/%postname%/
 *
 * The marked parts should correspond to a key in the urlParts object. The marked part is then
 * replaced by the url part's content.
 *
 * urlParts: { category: [ "transportation", "flying" ], postname: "the-cost-of-flying" }
 * urlStructure = "https://www.example.com/%category%/%postname%"/
 *
 * Outputs: https://www.example.com/transportation/flying/the-cost-of-flying
 *
 * @param {string} urlStructure The URL structure.
 * @param {object} urlParts     The URL parts.
 *
 * @returns {string} The structured URL.
 */
export default function buildStructuredUrl( urlStructure, urlParts = {} ) {
	/*
	 * [ "category", "postname" ]
	 */
	const partIds = Object.keys( urlParts );

	let url = urlStructure;

	partIds.forEach( partId => {
		const part = urlParts[ partId ];

		const replacement = isArray( part ) ? part.join( "/" ) : part;

		const marker = `%${ partId }%`;

		url = url.replace( new RegExp( marker, "g" ), replacement );
	} );

	return url;
}
