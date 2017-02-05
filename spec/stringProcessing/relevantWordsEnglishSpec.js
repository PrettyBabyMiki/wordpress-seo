let WordCombination = require( "../../js/values/WordCombination" );
let relevantWords = require( "../../js/stringProcessing/relevantWords" );
let getRelevantWords = relevantWords.getRelevantWords;
let getWordCombinations = relevantWords.getWordCombinations;
let englishFunctionWords = require( "../../js/researches/english/functionWords.js" )().all;

describe( "gets English word combinations", function() {
	it( "returns word combinations", function() {
		let input = "Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables. Here are a ton of syllables." +
			" Here are a ton of syllables. Here are a ton of syllables. ";
		let expected = [
			new WordCombination( [ "ton", "of", "syllables" ], 37, englishFunctionWords ),
			new WordCombination( [ "here", "are", "a", "ton" ], 37, englishFunctionWords ),
			new WordCombination( [ "syllables" ], 37, englishFunctionWords ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		let words = getRelevantWords( input, "en_US" );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		});

		expect( words ).toEqual( expected );
	});
});

