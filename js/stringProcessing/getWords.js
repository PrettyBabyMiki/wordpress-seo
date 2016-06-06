/** @module stringProcessing/countWords */

var stripTags = require( "./stripHTMLTags.js" );
var stripSpaces = require( "./stripSpaces.js" );
var removeSentenceTerminators = require( "./removeSentenceTerminators.js" );
var map = require( "lodash/map" );
var filter = require( "lodash/filter" );

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @returns {Array} The array with all words.
 */
module.exports = function( text ) {
	text = stripSpaces( stripTags( text ) );
	if ( text === "" ) {
		return [];
	}

	var words = map( text.split( /\s/g ), removeSentenceTerminators );

	return filter( words, function( word ) {
		return word.trim() !== "";
	} );
};

