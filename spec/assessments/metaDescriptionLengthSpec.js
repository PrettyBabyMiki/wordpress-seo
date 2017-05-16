var MetaDescriptionLengthAssessment = require( "../../js/assessments/seo/metaDescriptionLengthAssessment.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

let descriptionLengthAssessment = new MetaDescriptionLengthAssessment();

describe( "An descriptionLength assessment", function(){
	it( "assesses an empty description", function(){
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 0 ), i18n );

		expect( assessment.getScore() ).toEqual( 1 );
		expect( assessment.getText() ).toEqual ( "No meta description has been specified. Search engines will display copy from the page instead." );
	} );

	it( "assesses a short description", function(){
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 20 ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual ( "The meta description is under 120 characters long. However, up to 156 characters are available." );
	} );

	it( "assesses a too long description", function(){
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 200 ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual ( "The meta description is over 156 characters. Reducing the length will ensure the entire description will be visible." );
	} );

	it( "assesses a good description", function(){
		var mockPaper = new Paper();
		var assessment = descriptionLengthAssessment.getResult( mockPaper, Factory.buildMockResearcher( 140 ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual ( "The length of the meta description is sufficient." );
	} );
} );
