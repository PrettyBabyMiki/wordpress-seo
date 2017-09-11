/** @module analyses/findKeywordInFirstParagraph */

var matchParagraphs = require( "../stringProcessing/matchParagraphs.js" );
var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

var escapeRegExp = require( "lodash/escapeRegExp" );
var reject = require( "lodash/reject" );
var isEmpty = require( "lodash/isEmpty" );

/**
 * Counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * if there is no paragraph tag or 0 hits, it checks for 2 newlines, otherwise returns the keyword
 * count of the complete text.
 *
 * @param {Paper} paper The text to check for paragraphs.
 * @returns {number} The number of occurrences of the keyword in the first paragraph.
 */
module.exports = function( paper ) {
	var paragraphs = matchParagraphs( paper.getText() );
	var keyword = escapeRegExp( paper.getKeyword().toLocaleLowerCase() );
	var paragraph = reject( paragraphs, isEmpty )[ 0 ] || "";
	return wordMatch( paragraph, keyword, paper.getLocale() );
};
