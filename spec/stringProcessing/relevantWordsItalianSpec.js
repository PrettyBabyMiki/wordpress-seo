let WordCombination = require( "../../js/values/WordCombination" );
let relevantWords = require( "../../js/stringProcessing/relevantWords" );
let getRelevantWords = relevantWords.getRelevantWords;
let italianFunctionWords = require( "../../js/researches/italian/functionWords.js" )().all;

describe( "gets Italian word combinations", function() {
	it( "returns word combinations", function() {
		let input = "Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta." +
			" Le ultime elezioni sono oggetto dell’inchiesta della procura di Caltanissetta.";
		let expected = [
			new WordCombination( [ "dell'inchiesta", "della", "procura", "di", "caltanissetta" ], 11, italianFunctionWords ),
			new WordCombination( [ "sono", "oggetto", "dell'inchiesta", "della", "procura" ], 11, italianFunctionWords ),
			new WordCombination( [ "ultime", "elezioni", "sono", "oggetto", "dell'inchiesta" ], 11, italianFunctionWords ),
			new WordCombination( [ "oggetto", "dell'inchiesta", "della", "procura" ], 11, italianFunctionWords ),
			new WordCombination( [ "elezioni", "sono", "oggetto", "dell'inchiesta" ], 11, italianFunctionWords ),
			new WordCombination( [ "dell'inchiesta", "della", "procura" ], 11, italianFunctionWords ),
			new WordCombination( [ "procura", "di", "caltanissetta" ], 11, italianFunctionWords ),
			new WordCombination( [ "ultime", "elezioni", "sono", "oggetto" ], 11, italianFunctionWords ),
			new WordCombination( [ "sono", "oggetto", "dell'inchiesta" ], 11, italianFunctionWords ),
			new WordCombination( [ "elezioni", "sono", "oggetto" ], 11, italianFunctionWords ),
			new WordCombination( [ "oggetto", "dell'inchiesta" ], 11, italianFunctionWords ),
			new WordCombination( [ "ultime", "elezioni" ], 11, italianFunctionWords ),
			new WordCombination( [ "dell'inchiesta" ], 11, italianFunctionWords ),
			new WordCombination( [ "caltanissetta" ], 11, italianFunctionWords ),
			new WordCombination( [ "procura" ], 11, italianFunctionWords ),
			new WordCombination( [ "elezioni" ], 11, italianFunctionWords ),

		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		let words = getRelevantWords( input, "it_IT" );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		});

		expect( words ).toEqual( expected );
	});
});

