/* eslint-disable max-len */
import ParagraphTooLongAssessment from "../../../../src/scoring/assessments/readability/ParagraphTooLongAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import factory from "../../../specHelpers/factory";
import Factory from "../../../specHelpers/factory.js";
import Mark from "../../../../src/values/Mark.js";
import Researcher from "../../../../src/languageProcessing/languages/en/Researcher";

const paragraphTooLongAssessment = new ParagraphTooLongAssessment();

describe( "An assessment for scoring too long paragraphs.", function() {
	const paper = new Paper();
	it( "scores 1 paragraph with ok length", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs" +
			" are too long. Great job!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "scores 1 slightly too long paragraph", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 160, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 1 extremely long paragraph", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 6000, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 3 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 3 paragraphs with ok length", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, text: "" },
			{ wordCount: 71, text: "" }, { wordCount: 83, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 9 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs" +
			" are too long. Great job!" );
		expect( assessment.hasMarks() ).toBe( false );
	} );
	it( "scores 3 paragraphs, one of which is too long", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, text: "" },
			{ wordCount: 71, text: "" }, { wordCount: 183, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 1 of the paragraphs" +
			" contains more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "scores 3 paragraphs, two of which are too long", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ { wordCount: 60, text: "" },
			{ wordCount: 191, text: "" }, { wordCount: 183, text: "" } ] ) );
		expect( assessment.getScore() ).toBe( 6 );
		expect( assessment.getText() ).toBe( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 2 of the paragraphs" +
			" contain more than the recommended maximum of 150 words." +
			" <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns an empty assessment result for a paper without paragraphs.", function() {
		const assessment = paragraphTooLongAssessment.getResult( paper, Factory.buildMockResearcher( [ ] ) );
		expect( assessment.getScore() ).toBe( 0 );
		expect( assessment.getText() ).toBe( "" );
	} );
} );

describe( "Applicability of the assessment.", function() {
	it( "returns true for isApplicable on a paper with text.", function() {
		const paper = new Paper( "This is a very interesting paper.", { locale: "en_US" } );
		const researcher = new Researcher( paper );
		paragraphTooLongAssessment.getResult( paper, researcher );
		expect( paragraphTooLongAssessment.isApplicable( paper, researcher ) ).toBe( true );
	} );
	it( "returns false for isApplicable on a paper without text.", function() {
		const paper = new Paper( "", { locale: "en_US" } );
		const researcher = new Researcher( paper );
		paragraphTooLongAssessment.getResult( paper, researcher );
		expect( paragraphTooLongAssessment.isApplicable( paper, researcher ) ).toBe( false );
	} );
} );

describe( "A test for marking the sentences", function() {
	it( "returns markers", function() {
		const paper = new Paper( "This is a very interesting paper." );
		const paragraphTooLong = Factory.buildMockResearcher( [ { wordCount: 210, text: "This is a very interesting paper." } ] );
		const expected = [
			new Mark( { original: "This is a very interesting paper.", marked: "<yoastmark class='yoast-text-mark'>This is" +
					" a very interesting paper.</yoastmark>" } ),
		];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );

	it( "returns no markers", function() {
		const paper = new Paper( "This is a very interesting paper." );
		const paragraphTooLong = Factory.buildMockResearcher( [ { wordCount: 60, text: "" }, { wordCount: 11, text: "" },
			{ wordCount: 13, text: "" } ] );
		const expected = [];
		expect( paragraphTooLongAssessment.getMarks( paper, paragraphTooLong ) ).toEqual( expected );
	} );
} );

describe( "test for paragraph too long assessment when is used in product page analysis", function() {
	it( "assesses a paper from product page with paragraphs that contain less than 70 words", function() {
		const paper = new Paper( "" );
		const config = {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		};
		const result = new ParagraphTooLongAssessment( config ).getResult( paper, factory.buildMockResearcher( [ { wordCount: 60, text: "" }, { wordCount: 11, text: "" },
			{ wordCount: 13, text: "" } ] ), i18n );
		expect( result.getScore() ).toEqual( 9 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: None of the paragraphs are too long. Great job!" );
	} );
	it( "assesses a paper from product page with paragraphs that contain more than 100 words", function() {
		const paper = new Paper( "" );
		const config = {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		};
		const result = new ParagraphTooLongAssessment( config ).getResult( paper, factory.buildMockResearcher( [ { wordCount: 110, text: "" }, { wordCount: 150, text: "" },
			{ wordCount: 150, text: "" } ] ), i18n );
		expect( result.getScore() ).toEqual( 3 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain more than the recommended maximum of 70 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
	} );
	it( "assesses a paper from product page with paragraphs that contain between 70 and 100 words", function() {
		const paper = new Paper( "" );
		const config = {
			parameters: {
				recommendedLength: 70,
				maximumRecommendedLength: 100,
			},
		};
		const result = new ParagraphTooLongAssessment( config ).getResult( paper, factory.buildMockResearcher( [ { wordCount: 90, text: "" }, { wordCount: 75, text: "" },
			{ wordCount: 80, text: "" } ] ), i18n );
		expect( result.getScore() ).toEqual( 6 );
		expect( result.getText() ).toEqual( "<a href='https://yoa.st/35d' target='_blank'>Paragraph length</a>: 3 of the paragraphs contain more than the recommended maximum of 70 words. <a href='https://yoa.st/35e' target='_blank'>Shorten your paragraphs</a>!" );
	} );
} );
