/** @module stringProcessing/findKeywordInUrl */

var matchTextWithTransliteration = require( "./matchTextWithTransliteration.js" );

/**
 * Matches the keyword in the URL.
 *
 * @param {string} url The url to check for keyword
 * @param {string} keyword The keyword to check if it is in the URL
 * @returns {boolean} If a keyword is found, returns true
 */
module.exports = function( url, keyword ) {
	var keywordFound = false;
	var formatUrl = url.match( />(.*)/ig );

	if ( formatUrl !== null ) {
		formatUrl = formatUrl[ 0 ].replace( /<.*?>\s?/ig, "" );
		if ( matchTextWithTransliteration( formatUrl, keyword ).length > 0 ) {
			keywordFound = true;
		}
	}

	return keywordFound;
};
