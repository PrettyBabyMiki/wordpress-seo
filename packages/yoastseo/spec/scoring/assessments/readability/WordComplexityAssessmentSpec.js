import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";
import WordComplexityAssessment from "../../../../src/scoring/assessments/readability/WordComplexityAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import factory from "../../../specHelpers/factory.js";

const assessment = new WordComplexityAssessment();

describe( "a test for an assessment that checks complex words in a text", function() {
	it( "runs a test with an empty text", function() {
		const mockPaper = new Paper( "" );
		const result = assessment.getResult( mockPaper, factory.buildMockResearcher( [] ) );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "0% of the words contain <a href='https://yoa.st/difficult-words' target='_blank'>" +
			"over 3 syllables</a>, which is less than or equal to the recommended maximum of 5%." );
		expect( result.hasMarks() ).toBe( false );
	} );

	it( "runs a test with 30% too many syllables", function() {
		const mockPaper = new Paper( "" );
		const result = assessment.getResult( mockPaper, factory.buildMockResearcher(
			[ { sentence: "", words: [
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 4 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 4 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 10 } ],
			} ]
		) );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "30% of the words contain <a href='https://yoa.st/difficult-words' target='_blank'>over 3 syllables</a>, " +
			"which is more than the recommended maximum of 5%." );
		expect( result.hasMarks() ).toBe( true );
	} );

	it( "runs a test with exactly 5.3% too many syllables", function() {
		const mockPaper = new Paper( "" );
		const result = assessment.getResult( mockPaper, factory.buildMockResearcher( [
			{ sentence: "", words: [
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 10 },
			] } ]
		) );
		expect( result.getScore() ).toBe( 6.8 );
		expect( result.getText() ).toBe( "5.3% of the words contain <a href='https://yoa.st/difficult-words' target='_blank'>over 3 syllables</a>, " +
			"which is more than the recommended maximum of 5%." );
		expect( result.hasMarks() ).toBe( true );
	} );

	it( "runs a test with exactly 5% too many syllables", function() {
		const mockPaper = new Paper( "" );
		const result = assessment.getResult( mockPaper, factory.buildMockResearcher( [
			{ sentence: "", words: [
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 10 } ] },
		]
		) );
		expect( result.getScore() ).toBe( 7 );
		expect( result.getText() ).toBe( "5% of the words contain <a href='https://yoa.st/difficult-words' target='_blank'>over 3 syllables</a>, " +
			"which is less than or equal to the recommended maximum of 5%." );
		expect( result.hasMarks() ).toBe( true );
	} );

	it( "runs a test with 2.94% too many syllables", function() {
		const mockPaper = new Paper( "" );
		const result = assessment.getResult( mockPaper, factory.buildMockResearcher( [
			{ sentence: "", words: [
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 10 } ],
			} ]
		) );
		expect( result.getScore() ).toBe( 8.3 );
		expect( result.getText() ).toBe( "2.9% of the words contain <a href='https://yoa.st/difficult-words' target='_blank'>over 3 syllables</a>, " +
			"which is less than or equal to the recommended maximum of 5%." );
		expect( result.hasMarks() ).toBe( true );
	} );

	it( "runs a test with 0% too many syllables", function() {
		const mockPaper = new Paper( "" );
		const result = assessment.getResult( mockPaper, factory.buildMockResearcher( [
			{ sentence: "", words: [
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 3 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 2 },
				{ word: "", complexity: 1 },
				{ word: "", complexity: 1 } ],
			} ]
		) );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "0% of the words contain <a href='https://yoa.st/difficult-words' target='_blank'>over 3 syllables</a>, " +
			"which is less than or equal to the recommended maximum of 5%." );
		expect( result.hasMarks() ).toBe( false );
	} );
} );

describe( "tests for the assessment applicability", function() {
	// Currently always returns false because the assessment is disabled.
	it( "returns false if there is no text available.", function() {
		const paper = new Paper( "" );
		expect( assessment.isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( false );
	} );

	it( "returns false if the text is too short", function() {
		const paper = new Paper( "hallo" );
		expect( assessment.isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

	it( "should return false for isApplicable for a paper with only an image.", function() {
		const paper = new Paper( "<img src='https://example.com/image.png' alt='test'>" );
		expect( assessment.isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

	it( "should return false for isApplicable for a paper with only spaces.", function() {
		const paper = new Paper( "        " );
		expect( assessment.isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );
} );

