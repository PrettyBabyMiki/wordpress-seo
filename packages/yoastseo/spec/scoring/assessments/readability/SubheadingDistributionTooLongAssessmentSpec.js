import SubheadingDistributionTooLong from "../../../../src/scoring/assessments/readability/SubheadingDistributionTooLongAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
import Mark from "../../../../src/values/Mark.js";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher.js";
import JapaneseResearcher from "../../../../src/languageProcessing/languages/ja/Researcher";
import subheadingsTooLong from "../../../../src/languageProcessing/languages/ja/config/subheadingsTooLong.js";

import { enableFeatures } from "@yoast/feature-flag";
enableFeatures( [ "JAPANESE_SUPPORT" ] );

const subheadingDistributionTooLong = new SubheadingDistributionTooLong();

const shortText = "a ".repeat( 200 );
const longText = "a ".repeat( 330 );
const veryLongText = "a ".repeat( 360 );
const shortTextJapanese = "熱".repeat( 599 );
const longTextJapanese = "熱".repeat( 601 );
const subheading = "<h2> some subheading </h2>";

describe( "An assessment for scoring too long text fragments without a subheading.", function() {
	it( "Scores a short text (<300 words), which does not have subheadings.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText ),
			Factory.buildMockResearcher( [ { text: "", countLength: 200 } ] )
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, but your text is short enough and probably doesn't need them." );
	} );

	it( "Scores a short text (<300 words), which has subheadings.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( "a " + subheading + shortText ),
			Factory.buildMockResearcher( [ { text: "", countLength: 1 }, { text: "", countLength: 200 } ] )
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!" );
	} );

	it( "Scores a long text (>300 words), which does not have subheadings.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( longText ),
			Factory.buildMockResearcher( [ { text: "", countLength: 330 } ] )
		);
		expect( assessment.getScore() ).toBe( 2 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, although your text is rather long. <a href='https://yoa.st/34y' target='_blank'>" +
			"Try and add some subheadings</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText + subheading + shortText ),
			Factory.buildMockResearcher( [ { text: "", countLength: 200 }, { text: "", countLength: 200 } ] )
		);
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!" );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words, except for one, " +
		"which is between 300 and 350 words long.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText + subheading + longText + subheading + shortText ),
			Factory.buildMockResearcher( [ { text: "", countLength: 200 }, { text: "", countLength: 330 }, { text: "", countLength: 200 } ] )
		);
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"1 section of your text is longer than 300 words and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words, except for two, " +
		"which are between 300 and 350 words long.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText + subheading + longText + subheading + longText ),
			Factory.buildMockResearcher( [ { text: "", countLength: 200 }, { text: "", countLength: 330 }, { text: "", countLength: 330 } ] )
		);
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than 300 words and are not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and all sections of the text are <300 words, except for one, " +
		"which is above 350 words long.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText + subheading + veryLongText + subheading + shortText ),
			Factory.buildMockResearcher( [ { text: "", countLength: 200 }, { text: "", countLength: 360 }, { text: "", countLength: 200 } ] )
		);
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"1 section of your text is longer than 300 words and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a long text (>300 words), which has subheadings and some sections of the text are above 350 words long.", function() {
		const assessment = subheadingDistributionTooLong.getResult(
			new Paper( shortText + subheading + longText + subheading + longText ),
			Factory.buildMockResearcher( [ { text: "", countLength: 200 }, { text: "", countLength: 360 }, { text: "", countLength: 330 } ] )
		);
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than 300 words and are not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );
	const shortTextJA = "a ".repeat( 200 );
	const longTextJA = "a ".repeat( 320 );
	const veryLongTextJA = "a ".repeat( 400 );
	const subheadingJA = "<h2> some subheading </h2>";
	it( "Scores a short text in Japanese (<600 characters), which does not have subheadings.", function() {
		const paper = new Paper( shortTextJA );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
		const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
		expect( results.getScore() ).toBe( 9 );
		expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, but your text is short enough and probably doesn't need them." );
	} );

	it( "Scores a short text in Japanese (<600 characters), which has subheadings.", function() {
		const paper = new Paper( "定冠詞 " + subheadingJA + shortTextJA );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
		const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
		expect( results.getScore() ).toBe( 9 );
		expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!" );
	} );

	it( "Scores a long text in Japanese (>600 characters), which does not have subheadings.", function() {
		const paper = new Paper( longTextJA );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
		const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
		expect( results.getScore() ).toBe( 2 );
		expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"You are not using any subheadings, although your text is rather long. <a href='https://yoa.st/34y' target='_blank'>" +
			"Try and add some subheadings</a>." );
	} );

	it( "Scores a long text in Japanese (>600 characters), which has subheadings and all sections of the text are <600 characters.", function() {
		const paper = new Paper( shortTextJA + subheadingJA + shortTextJA );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
		const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
		expect( results.getScore() ).toBe( 9 );
		expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: Great job!" );
	} );

	it( "Scores a long text in Japanese (>600 characters), which has subheadings and all sections of the text are <600 characters, except for one, " +
		"which is between 650 and 700 characters long.", function() {
		const paper = new Paper( shortTextJA + subheadingJA + longTextJA + subheadingJA + shortTextJA  );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
		const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
		expect( results.getScore() ).toBe( 6 );
		expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"1 section of your text is longer than 600 words and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );
	it( "Scores a long text in Japanese (>600 characters), which has subheadings and all sections of the text are <600 characters, except for two, " +
		"which are between 650 and 700 characters long.", function() {
		const paper = new  Paper( shortTextJA + subheadingJA + longTextJA + subheadingJA + longTextJA );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
		const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
		expect( results.getScore() ).toBe( 6 );
		expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than 600 words and are not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a long text in Japanese (>600 characters), which has subheadings and some sections of the text are above 700 characters long.", function() {
		const paper = new  Paper( shortTextJA + subheadingJA + veryLongTextJA + subheadingJA + veryLongTextJA );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
		const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
		expect( results.getScore() ).toBe( 3 );
		expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than 600 words and are not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a long text in Japanese (>600 characters), which has subheadings and all sections of the text are <600 characters, except for one, " +
		"which is above 700 words long.", function() {
		const paper = new  Paper( shortTextJA + subheadingJA + veryLongTextJA + subheadingJA + shortTextJA );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
		const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
		expect( results.getScore() ).toBe( 3 );
		expect( results.getText() ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"1 section of your text is longer than 600 words and is not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	it( "Scores a long text (>600 characters), which has subheadings and some sections of the text are above 700 characters long.", function() {
		const paper = new Paper( shortTextJA + subheadingJA + veryLongTextJA + subheadingJA + veryLongTextJA );
		const japaneseResearcher = new JapaneseResearcher( paper );
		const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
		const results = subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
		expect( results.getScore( paper, japaneseResearcher ) ).toBe( 3 );
		expect( results.getText( paper, japaneseResearcher ) ).toBe( "<a href='https://yoa.st/34x' target='_blank'>Subheading distribution</a>: " +
			"2 sections of your text are longer than 600 words and are not separated by any subheadings." +
			" <a href='https://yoa.st/34y' target='_blank'>Add subheadings to improve readability</a>." );
	} );

	describe( "Language-specific configuration for specific types of content is used", function() {
		const paper = new  Paper( shortTextJA + subheadingJA + veryLongTextJA );
		const japaneseResearcher = new JapaneseResearcher( paper );
		it( "checks whether language-specific cornerstone configuration is used", function() {
			const subheadingDistributionTooLongJA = new SubheadingDistributionTooLong();
			const results = new SubheadingDistributionTooLong( { cornerstoneContent: true } );
			// Running getResult will apply language-specific configuration.
			subheadingDistributionTooLongJA.getResult( paper, japaneseResearcher );
			expect( results._config.recommendedMaximumWordCount ).toEqual( subheadingsTooLong.cornerstoneParameters.recommendedMaximumWordCount );
			expect( results._config.slightlyTooMany ).toEqual( subheadingsTooLong.cornerstoneParameters.slightlyTooMany );
			expect( results._config.farTooMany ).toEqual( subheadingsTooLong.cornerstoneParameters.farTooMany );
		} );
	} );
	it( "Returns false from isApplicable to the paper without text", function() {
		const paper = new Paper( "" );
		const assessment = subheadingDistributionTooLong.isApplicable( paper );
		expect( assessment ).toBe( false );
	} );

	it( "Returns true from isApplicable to the paper with text", function() {
		const paper = new Paper( shortText );
		const assessment = subheadingDistributionTooLong.isApplicable( paper );
		expect( assessment ).toBe( true );
	} );

	it( "Returns false from hasSubheadings to the paper without text", function() {
		const paper =  new Paper( shortText );
		const assessment = subheadingDistributionTooLong.hasSubheadings( paper );
		expect( assessment ).toBe( false );
	} );

	it( "Returns true from hasSubheadings to the paper with text", function() {
		const assessment = subheadingDistributionTooLong.hasSubheadings( new Paper( shortText + subheading + longText ) );
		expect( assessment ).toBe( true );
	} );

	it( "Returns false when the assessment shouldn't appear in short text analysis and the text contains less than 300 words", function() {
		const paper = new Paper( shortText );
		const assessment = new SubheadingDistributionTooLong( { shouldNotAppearInShortText: true } ).isApplicable( paper, new DefaultResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "Returns false when the assessment shouldn't appear in short text analysis and the paper is empty", function() {
		const paper = new Paper( "" );
		const assessment = new SubheadingDistributionTooLong( { shouldNotAppearInShortText: true } ).isApplicable( paper, new DefaultResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "Returns true when the assessment shouldn't appear in short text analysis but the text contains more than 300 words", function() {
		const paper = new Paper( longText );
		const assessment = new SubheadingDistributionTooLong( { shouldNotAppearInShortText: true } ).isApplicable( paper, new DefaultResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );

	it( "Returns false when the assessment shouldn't appear in short text analysis and the text contains less than 600 characters in Japanese", function() {
		const paper = new Paper( shortTextJapanese );
		const assessment = new SubheadingDistributionTooLong( { shouldNotAppearInShortText: true } ).isApplicable( paper, new JapaneseResearcher( paper ) );
		expect( assessment ).toBe( false );
	} );

	it( "Returns true when the assessment shouldn't appear in short text analysis but the text contains more than 600 characters in Japanese", function() {
		const paper = new Paper( longTextJapanese );
		const assessment = new SubheadingDistributionTooLong( { shouldNotAppearInShortText: true } ).isApplicable( paper, new JapaneseResearcher( paper ) );
		expect( assessment ).toBe( true );
	} );
} );

describe.skip( "A test for marking too long text segments not separated by a subheading", function() {
	it( "returns markers for too long text segments", function() {
		const paper = new Paper( longText + subheading + veryLongText );
		const textFragment = Factory.buildMockResearcher( [ { text: "This is a too long fragment. It contains 330 words.",
			countLength: 330 }, { text: "This is another too long fragment. It contains 360 words.", countLength: 360 } ] );
		const expected = [
			new Mark( {
				original: "This is another too long fragment. It contains 360 words.",
				marked: "<yoastmark class='yoast-text-mark'>This is another too long fragment. It contains 360 words.</yoastmark>",
			} ),
			new Mark( {
				original: "This is a too long fragment. It contains 330 words.",
				marked: "<yoastmark class='yoast-text-mark'>This is a too long fragment. It contains 330 words.</yoastmark>",
			} ),
		];
		expect( subheadingDistributionTooLong.getResult( paper, textFragment )._marker ).toEqual( expected );
	} );

	it( "returns no markers if no text segments is too long", function() {
		const paper = new Paper( shortText );
		const textFragment = Factory.buildMockResearcher( [ { text: "This is a short segment.", countLength: 200 } ] );
		expect( subheadingDistributionTooLong.getResult( paper, textFragment )._hasMarks ).toEqual( false );
	} );
} );
