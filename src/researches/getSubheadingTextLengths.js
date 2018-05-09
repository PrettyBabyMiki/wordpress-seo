const getSubheadingTexts = require( "../stringProcessing/getSubheadingTexts" );
const getIntroParagraphOutsideSubheadings = require( "../stringProcessing/getIntroParagraphOutsideSubheadings" );
const countWords = require( "../stringProcessing/countWords" );
const forEach = require( "lodash/forEach" );

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the length of each subheading.
 */
module.exports = function( paper ) {
	const text = paper.getText();
	let matches = getSubheadingTexts( text );
	const introText = getIntroParagraphOutsideSubheadings( text );

	if ( introText.length > 0 ) {
		matches.unshift( introText );
	}

	let subHeadingTexts = [];
	forEach( matches, function( subHeading ) {
		subHeadingTexts.push( {
			text: subHeading,
			wordCount: countWords( subHeading ),
		} );
	} );
	return subHeadingTexts;
};
