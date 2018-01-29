let wordCountInText = require( "./wordCountInText.js" );
let imageCount = require( "./imageCountInText.js" );

module.exports = function( paper ) {
	let numberOfWords = wordCountInText( paper );
	let numberOfImages = imageCount( paper );

	let readingTime = Math.ceil( ( numberOfWords / 200 ) + ( numberOfImages * 0.2 ) );

	return readingTime;
};

