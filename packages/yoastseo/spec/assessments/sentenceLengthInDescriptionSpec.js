import sentenceLengthInDescriptionAssessment from "../../src/languages/legacy/assessments/readability/sentenceLengthInDescriptionAssessment";
import Paper from "../../src/values/Paper.js";
import Factory from "../specHelpers/factory.js";
const i18n = Factory.buildJed();

describe( "An assessment for sentence length", function() {
	let mockPaper, assessment;

	it( "returns the score for all short sentences", function() {
		mockPaper = new Paper();
		assessment = sentenceLengthInDescriptionAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "The meta description contains no sentences " +
			"<a href='https://yoa.st/short-sentences' target='_blank'>over 20 words</a>." );
	} );

	it( "returns the score for 25% long sentences", function() {
		mockPaper = new Paper();
		assessment = sentenceLengthInDescriptionAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
			{ sentence: "", sentenceLength: 1 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "The meta description contains 1 sentence" +
			" <a href='https://yoa.st/short-sentences' target='_blank'>over 20 words</a>. Try to shorten this sentence." );
	} );

	it( "returns the score for 50% long sentences", function() {
		mockPaper = new Paper();
		assessment = sentenceLengthInDescriptionAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 1 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "The meta description contains 1 sentence" +
			" <a href='https://yoa.st/short-sentences' target='_blank'>over 20 words</a>. Try to shorten this sentence." );
	} );

	it( "returns the score for 100% long sentences", function() {
		mockPaper = new Paper();
		assessment = sentenceLengthInDescriptionAssessment.getResult( mockPaper, Factory.buildMockResearcher( [
			{ sentence: "", sentenceLength: 30 },
			{ sentence: "", sentenceLength: 30 },
		] ), i18n );

		expect( assessment.hasScore() ).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "The meta description contains 2 sentences " +
			"<a href='https://yoa.st/short-sentences' target='_blank'>over 20 words</a>. Try to shorten these sentences." );
	} );

	it( "is not applicable for empty papers", function() {
		mockPaper = new Paper();
		assessment = sentenceLengthInDescriptionAssessment.isApplicable( mockPaper );
		expect( assessment ).toBe( false );
	} );

	it( "is not applicable for papers without metadescription", function() {
		mockPaper = new Paper( "", { description: "" } );
		assessment = sentenceLengthInDescriptionAssessment.isApplicable( mockPaper );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for papers with a metadescription", function() {
		mockPaper = new Paper( "", { description: "some meta description" } );
		assessment = sentenceLengthInDescriptionAssessment.isApplicable( mockPaper );
		expect( assessment ).toBe( true );
	} );
} );
