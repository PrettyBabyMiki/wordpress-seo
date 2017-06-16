let WordCombination = require( "../../js/values/WordCombination" );
let relevantWords = require( "../../js/stringProcessing/relevantWords" );
let getRelevantWords = relevantWords.getRelevantWords;
let spanishFunctionWords = require( "../../js/researches/spanish/functionWords.js" )().all;

describe( "gets Spanish word combinations", function() {
	it( "returns word combinations", function() {
		let input = "No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una " +
			"tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque " +
			"hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar " +
			"porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a " +
			"trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos " +
			"ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. " +
			"No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta de " +
			"nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta " +
			"de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta " +
			"de nieve. No pudimos ir a trabajar porque hubo una tormenta de nieve. No pudimos ir a trabajar porque hubo una tormenta " +
			"de nieve.";
		let expected = [
			new WordCombination( [ 'trabajar', 'porque', 'hubo', 'una', 'tormenta' ], 19, spanishFunctionWords ),
			new WordCombination( [ 'tormenta', 'de', 'nieve' ], 19, spanishFunctionWords ),
			new WordCombination( [ 'no', 'pudimos', 'ir', 'a', 'trabajar' ], 19, spanishFunctionWords ),
			new WordCombination( [ 'trabajar', 'porque', 'hubo' ], 19, spanishFunctionWords ),
			new WordCombination( [ "trabajar" ], 19, spanishFunctionWords ),
			new WordCombination( [ "tormenta" ], 19, spanishFunctionWords ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		let words = getRelevantWords( input, "es_ES" );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		});

		expect( words ).toEqual( expected );
	});
});
