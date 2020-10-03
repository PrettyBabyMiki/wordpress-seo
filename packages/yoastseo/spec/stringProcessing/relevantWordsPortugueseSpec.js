import WordCombination from "../../src/values/WordCombination";
import relevantWords from "../../src/stringProcessing/helpers/_todo/relevantWords";
import portugueseFunctionWordsFactory from "../../src/languages/legacy/researches/portuguese/functionWords.js";

const getRelevantWords = relevantWords.getRelevantWords;
const portugueseFunctionWords = portugueseFunctionWordsFactory().all;

describe( "gets Portuguese word combinations", function() {
	it( "returns word combinations", function() {
		const input = "Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. " +
			"Os números oficiais sugerem que o crime está em baixa, mas as autoridades " +
			"dizem que muitas vítimas pararam de denunciar incidentes. ";
		const expected = [
			new WordCombination( [ "vítimas", "pararam", "de", "denunciar", "incidentes" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "pararam", "de", "denunciar", "incidentes" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "vítimas", "pararam", "de", "denunciar" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "números", "oficiais", "sugerem" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "pararam", "de", "denunciar" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "números", "oficiais" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "denunciar", "incidentes" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "vítimas", "pararam" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "oficiais", "sugerem" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "oficiais" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "incidentes" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "denunciar" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "pararam" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "vítimas" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "autoridades" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "crime" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "sugerem" ], 8, portugueseFunctionWords ),
			new WordCombination( [ "números" ], 8, portugueseFunctionWords ),
		];

		// Make sure our words aren't filtered by density.
		spyOn( WordCombination.prototype, "getDensity" ).and.returnValue( 0.01 );

		const words = getRelevantWords( input, "pt_PT" );

		words.forEach( function( word ) {
			delete( word._relevantWords );
		} );

		expect( words ).toEqual( expected );
	} );
} );
