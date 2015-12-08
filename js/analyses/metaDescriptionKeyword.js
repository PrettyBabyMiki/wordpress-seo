var wordMatch = require( "../stringProcessing/wordMatch.js" );
/**
 * Counts the occurrences of the keyword in the metadescription, returns 0 if metadescription is
 * empty or not set. Default is -1, if the meta is empty, this way we can score for empty meta.
 *
 * @param {String} text The text to match for a keyword.
 * @param {String} keyword The keyword to match.
 * @returns {*}
 */
module.exports = function( text, keyword ) {
	var matches = -1;
	if ( text !== "" ) {
		matches = wordMatch( text, keyword );
	}
	return matches;
};
