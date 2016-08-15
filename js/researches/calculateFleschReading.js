/** @module analyses/calculateFleschReading */

var stripNumbers = require( "../stringProcessing/stripNumbers.js" );
var countSentences = require( "../stringProcessing/countSentences.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var countSyllables = require( "../stringProcessing/syllables/count.js" );
var formatNumber = require( "../helpers/formatNumber.js" );

var getLanguage = require( "../helpers/getLanguage.js" );

/**
 * Calculates an average from a total and an amount
 *
 * @param {number} total The total.
 * @param {number} amount The amount.
 * @returns {number} The average from the total and the amount.
 */
var getAverage = function( total, amount ) {
	return total / amount;
};

/**
 * This calculates the fleschreadingscore for a given text
 * The formula used:
 * 206.835 - 1.015 (total words / total sentences) - 84.6 ( total syllables / total words);
 *
 * @param {object} paper The paper containing the text
 * @returns {number} the score of the fleschreading test
 */
module.exports = function( paper ) {
	var score;
	var text = paper.getText();
	var locale = paper.getLocale();
	var language = getLanguage( locale );
	if ( text === "" ) {
		return 0;
	}

	text = stripNumbers( text );

	var numberOfSentences = countSentences( text );

	var numberOfWords = countWords( text );

	// Prevent division by zero errors.
	if ( numberOfSentences === 0 || numberOfWords === 0 ) {
		return 0;
	}

	var numberOfSyllables = countSyllables( text, locale );
	var averageWordsPerSentence = getAverage( numberOfWords, numberOfSentences );
	switch( language ) {
		case "nl":
			var syllablesPer100Words = numberOfSyllables * ( 100 / numberOfWords );
			score = 206.84 - ( 0.77 * syllablesPer100Words ) - ( 0.93 * ( averageWordsPerSentence  ) );
			break;
		case "en":
		default:
			score = 206.835 - ( 1.015 * ( averageWordsPerSentence ) ) - ( 84.6 * ( numberOfSyllables / numberOfWords ) );
			break;
	}


	return formatNumber( score );
};
