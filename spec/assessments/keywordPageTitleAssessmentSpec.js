var pageTitleKeywordAssessment = require( "../../js/assessments/pagetitleKeyword.js" );
var Paper = require( "../../js/values/Paper.js" );
var Factory = require( "../helpers/factory.js" );
var i18n = Factory.buildJed();

describe( "an assessment to check if the keyword is in the pageTitle", function(){
	it( "returns an assementresult with keyword not found", function(){
		var paper = new Paper( "", {
			keyword: "keyword",
			title: "this is a title"
		} );
		var assessment = pageTitleKeywordAssessment( paper, Factory.buildMockResearcher( {matches: 0} ), i18n );

		expect( assessment.getScore() ).toBe(2);
		expect( assessment.getText() ).toBe( "The focus keyword 'keyword' does not appear in the page title.");

	} );

	it( "returns an assementresult with keyword found at start", function(){
		var paper = new Paper( "", {
			keyword: "keyword",
			title: "keyword this is a title"
		} );
		var assessment = pageTitleKeywordAssessment( paper, Factory.buildMockResearcher( {matches: 1, position: 1} ), i18n );

		expect( assessment.getScore() ).toBe(9);
		expect( assessment.getText() ).toBe( "The page title contains the focus keyword, at the beginning which is considered to improve rankings." );

	} );

	it( "returns an assementresult with keyword found at start", function(){
		var paper = new Paper( "", {
			keyword: "keyword",
			title: "keyword this is a title"
		} );
		var assessment = pageTitleKeywordAssessment( paper, Factory.buildMockResearcher( {matches: 1, position: 2} ), i18n );

		expect( assessment.getScore() ).toBe(6);
		expect( assessment.getText() ).toBe( "The page title contains the focus keyword, but it does not appear at the beginning; try and move it to the beginning." );

	} );
} );