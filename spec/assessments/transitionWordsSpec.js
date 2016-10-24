var transitionWordsAssessment = require( "../../js/assessments/transitionWordsAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "An assessment for transition word percentage", function(){
	let mockPaper, assessment;

	it( "returns the score for 10.0% of the sentences with transition words", function(){
		var mockPaper = new Paper();
		var assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual ( "10% of the sentences contain a <a href='https://yoa.st/transition-words' target='_blank'>transition word</a> " +
			"or phrase, which is less than the recommended minimum of 30%." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 20.0% of the sentences with transition words", function(){
		var mockPaper = new Paper();
		var assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 5,
			transitionWordSentences: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual ( "20% of the sentences contain a <a href='https://yoa.st/transition-words' target='_blank'>transition word</a> " +
			"or phrase, which is less than the recommended minimum of 30%." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 25.0% of the sentences with transition words", function(){
		var mockPaper = new Paper();
		var assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 4,
			transitionWordSentences: 1 } ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual ( "25% of the sentences contain a <a href='https://yoa.st/transition-words' target='_blank'>transition word</a> " +
			"or phrase, which is less than the recommended minimum of 30%." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 35.0% of the sentences with transition words", function(){
		mockPaper = new Paper();
		assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 20,
			transitionWordSentences: 7 } ), i18n );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "35% of the sentences contain a <a href='https://yoa.st/transition-words' target='_blank'>transition word</a> " +
			"or phrase, which is great." );
		expect( assessment.hasMarks() ).toBe( true );
	} );
	it( "returns the score for 40% sentences with transition words", function(){
		mockPaper = new Paper();
		assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 10,
			transitionWordSentences: 4 } ), i18n );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "40% of the sentences contain a <a href='https://yoa.st/transition-words' target='_blank'>transition word</a> " +
			"or phrase, which is great." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 47% sentences with transition words", function(){
		mockPaper = new Paper();
		assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 100,
			transitionWordSentences: 47 } ), i18n );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "47% of the sentences contain a <a href='https://yoa.st/transition-words' target='_blank'>transition word</a> " +
			"or phrase, which is great.");
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "returns the score for 66.7% of the sentences with transition words", function(){
		mockPaper = new Paper();
		assessment = transitionWordsAssessment.getResult( mockPaper, Factory.buildMockResearcher( { totalSentences: 3,
			transitionWordSentences: 2 } ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "66.7% of the sentences contain a <a href='https://yoa.st/transition-words' target='_blank'>transition word</a> " +
			"or phrase, which is great." );
		expect( assessment.hasMarks() ).toBe( true );
	} );

	it( "is not applicable for empty papers", function(){
		mockPaper = new Paper();
		assessment = transitionWordsAssessment.isApplicable( mockPaper );
		expect( assessment ).toBe( false );
	} );

	it( "is applicable for supported locales, en_US in this case", function(){
		mockPaper = new Paper( "This is a string", { locale: "en_US" } );
		assessment = transitionWordsAssessment.isApplicable( mockPaper );
		expect( assessment ).toBe( true );
	} );

	it( "is not applicable for unsupported locales, nl_NL in this case", function(){
		mockPaper = new Paper( "This is a string", { locale: "nl_NL" } );
		assessment = transitionWordsAssessment.isApplicable( mockPaper );
		expect( assessment ).toBe( false );
	} );
} );
