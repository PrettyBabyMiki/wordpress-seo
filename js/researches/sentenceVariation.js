var getSentences = require( "../stringProcessing/getSentences.js" );
var sentencesLength = require( "../stringProcessing/sentencesLength.js" );
var sum = require( "lodash/sum" );

module.exports = function( paper ){
	var text = paper.getText();
	var sentences = getSentences( text );
	var wordCountPerSentence = sentencesLength( sentences );
	var totalSentences = sentences.length;
	var totalWords = sum( wordCountPerSentence );
	var average = totalWords / totalSentences;
	var variation;
	sentences.map( function( sentence ){
		variation = wordCountPerSentence - average;
		 return Math.pow( variation , 2 );
	} );

	var totalOfSquares = sum( sentences );
	var dividedSquares = totalOfSquares / ( totalSentences - 1 );

	return Math.sqrt( dividedSquares );
};
