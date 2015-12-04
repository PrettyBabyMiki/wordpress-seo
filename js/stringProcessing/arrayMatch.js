var arrayToRegex = require("../stringProcessing/arrayToRegex.js");
var removeSpaces = require("../stringProcessing/removeNonWordCharacters.js");

/**
 * Matches strings from an array against a given text.
 *
 * @param {String} text The text to match
 * @param {Array} array The array with strings to match
 * @returns {Array} array An array with all matches of the text.
 */
module.exports = function( text, array ) {
	var matches = text.match( arrayToRegex( array ) );
	matches = matches.map( function( string ) {
		return removeSpaces ( string );
	}.bind( this ) );

	return matches;
};

/*
YoastSEO.StringHelper.prototype.matchString = function( textString, stringsToMatch ) {
	return textString.match( this.stringToRegex( stringsToMatch, false ) );
};
*/

