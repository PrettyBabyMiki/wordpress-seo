import Researcher from "../../../../src/languageProcessing/languages/sv/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import functionWords from "../../../../src/languageProcessing/languages/sv/config/functionWords";
import firstWordExceptions from "../../../../src/languageProcessing/languages/sv/config/firstWordExceptions";
import transitionWords from "../../../../src/languageProcessing/languages/sv/config/transitionWords";
import twoPartTransitionWords from "../../../../src/languageProcessing/languages/sv/config/twoPartTransitionWords";

describe( "a test for the Swedish Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the inherited Abstract Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns true if the Swedish Researcher has a specific research", function() {
		expect( researcher.hasResearch( "functionWordsInKeyphrase" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Swedish Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Swedish Researcher doesn't have a certain helper", function() {
		expect( researcher.getHelper( "fleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Swedish Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "stopWords" ) ).toBe( false );
	} );

	it( "returns Swedish function words", function() {
		expect( researcher.getConfig( "functionWords" ).all ).toEqual( functionWords.all );
	} );

	it( "returns Swedish first word exceptions", function() {
		expect( researcher.getConfig( "firstWordExceptions" ) ).toEqual( firstWordExceptions );
	} );

	it( "returns Swedish transition words", function() {
		expect( researcher.getConfig( "transitionWords" ).allWords ).toEqual( transitionWords.allWords );
	} );

	it( "returns Swedish two-part transition words", function() {
		expect( researcher.getConfig( "twoPartTransitionWords" ) ).toEqual( twoPartTransitionWords );
	} );

	it( "returns the Swedish locale", function() {
		expect( researcher.getConfig( "language" ) ).toEqual( "sv" );
	} );

	it( "returns the Swedish passive construction type", function() {
		expect( researcher.getConfig( "isPeriphrastic" ) ).toEqual( false );
	} );

	it( "checks if a Swedish sentence is passive or not", function() {
		expect( researcher.getHelper( "isPassiveSentence" )( "Katterna älskas." ) ).toEqual( true );
		expect( researcher.getHelper( "isPassiveSentence" )( "Flickan älskar sina katter." ) ).toEqual( false );
	} );
} );
