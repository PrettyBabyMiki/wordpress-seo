import Researcher from "../../../../src/languageProcessing/languages/ja/Researcher.js";
import Paper from "../../../../src/values/Paper.js";
import functionWords from "../../../../src/languageProcessing/languages/ja/config/functionWords";

import getMorphologyData from "../../../specHelpers/getMorphologyData";

const morphologyDataJA = getMorphologyData( "ja" );

describe( "a test for Japanese Researcher", function() {
	const researcher = new Researcher( new Paper( "" ) );

	it( "returns true if the Japanese Researcher has a specific research", function() {
		expect( researcher.hasResearch( "getParagraphLength" ) ).toBe( true );
	} );

	it( "returns false if the default research is deleted in the Japanese Researcher", function() {
		expect( researcher.getResearch( "getFleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Japanese Researcher doesn't have a certain helper", function() {
		expect( researcher.getHelper( "fleschReadingScore" ) ).toBe( false );
	} );

	it( "returns false if the Japanese Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "sentenceLength" ) ).toBe( false );
	} );

	it( "returns false if the Japanese Researcher doesn't have a certain config", function() {
		expect( researcher.getConfig( "functionWords" ) ).toEqual( functionWords );
	} );

	it( "checks whether there is an exact match of a multiword keyphrase in title", function() {
		expect( researcher.getHelper( "findMultiWordKeyphraseInPageTitle" )( "東海道新幹線", "さらに東海道新幹線の駅構内および列車内に広告を掲出することを。",
			functionWords ) ).toEqual( {
			exactMatchFound: true,
			allWordsFound: true,
			position: 0,
		} );
	} );

	it( "creates the word forms when the Japanese morphology data is available", function() {
		researcher.addResearchData( "morphology", morphologyDataJA );
		expect( researcher.getHelper( "getStemmer" )( researcher )( "日帰り" ) ).toEqual(
			[ "日帰る", "日帰り", "日帰ら", "日帰れ", "日帰ろ", "日帰っ", "日帰れる", "日帰らせ",
				"日帰らせる", "日帰られ", "日帰られる", "日帰ろう" ]
		);
	} );
} );
