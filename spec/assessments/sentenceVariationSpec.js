var sentenceVariationAssessment = require( "../../js/assessments/sentenceVariationAssessment" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "An assessment for sentence variation", function() {

	//Add 2 sentences to the paper, so the assessment will return a valid result.
	var mockPaper = new Paper( "Sentence. Sentence." );

	it( "returns the score when deviation 4 ", function() {
		var assessment = sentenceVariationAssessment.getResult( mockPaper, Factory.buildMockResearcher( 4 ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "The <a href='https://yoa.st/mix-it-up' target='_blank'>sentence length variation</a> score is 4, " +
			"which is more than or equal to the recommended minimum of 3. The text contains a nice combination of long and short sentences." );
	} );

	it( "returns the score when deviation is 2 ", function() {
		var assessment = sentenceVariationAssessment.getResult( mockPaper, Factory.buildMockResearcher( 2 ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual ( "The <a href='https://yoa.st/mix-it-up' target='_blank'>sentence length variation</a> score is 2, " +
			"which is less than the recommended minimum of 3. Try to alternate more between long and short sentences." );
	} );

	it( "returns the score when deviation is zero ", function() {
		var assessment = sentenceVariationAssessment.getResult( mockPaper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual ( "The <a href='https://yoa.st/mix-it-up' target='_blank'>sentence length variation</a> score is 0, " +
			"which is less than the recommended minimum of 3. Try to alternate more between long and short sentences." );
	} );

	it( "returns the score when deviation is 20 ", function() {
		var assessment = sentenceVariationAssessment.getResult( mockPaper, Factory.buildMockResearcher( 20 ), i18n );

		expect( assessment.hasScore()).toBe( true );
		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "The <a href='https://yoa.st/mix-it-up' target='_blank'>sentence length variation</a> score is 20, " +
			"which is more than or equal to the recommended minimum of 3. The text contains a nice combination of long and short sentences." );
	} );

	it( "returns no score when there is only 1 sentence", function() {
		mockPaper = new Paper( "This is one sentence." );
		expect( sentenceVariationAssessment.isApplicable( mockPaper ) ).toBe( false );
	} );

	it( "returns no score when there is only HTMLtags ", function() {
		mockPaper = new Paper( "<iframe src='framesource'>" );
		expect( sentenceVariationAssessment.isApplicable( mockPaper ) ).toBe( false );
	} );

	it( "returns no score when there is only HTMLtags and 1 sentence", function() {
		mockPaper = new Paper( "<iframe src='framesource'> One sentence." );
		expect( sentenceVariationAssessment.isApplicable( mockPaper ) ).toBe( false );
	} );
} );
