var replaceString = require( "../stringProcessing/replaceString.js" );
var removalWords = require( "../config/removalWords.js" )();
var matchTextWithTransliteration = require( "../stringProcessing/matchTextWithTransliteration.js" );

/**
 * Matches the keyword in an array of strings
 *
 * @param {Array} matches The array with the matched headings.
 * @param {String} keyword The keyword to match
 * @param {string} locale The locale used for transliteration.
 * @returns {number} The number of occurrences of the keyword in the headings.
 */
module.exports = function( matches, keyword, locale ) {
	var foundInHeader;
	if ( matches === null ) {
		foundInHeader = -1;
	} else {
		foundInHeader = 0;
		for ( var i = 0; i < matches.length; i++ ) {

			// TODO: This replaceString call seemingly doesn't work, as no replacement value is being sent to the .replace method in replaceString
			var formattedHeaders = replaceString(
				matches[ i ], removalWords
			);
			if (
				matchTextWithTransliteration( formattedHeaders, keyword, locale ).length > 0 ||
				matchTextWithTransliteration( matches[ i ], keyword, locale ).length > 0
			) {
				foundInHeader++;
			}
		}
	}
	return foundInHeader;
};
