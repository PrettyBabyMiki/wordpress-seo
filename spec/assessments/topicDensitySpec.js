/* global describe it expect */
const topicDensityAssessment = require( "../../js/assessments/seo/topicDensityAssessment.js" );
const Paper = require( "../../js/values/Paper.js" );
const Mark = require( "../../src/values/Mark.js" );
const factory = require( "../helpers/factory.js" );
const i18n = factory.buildJed();

describe( "An assessment for the topicDensity", function() {
	it( "runs the topicDensity on the paper with only keyword specified", function() {
		let paper = new Paper( "string without the key", { keyword: "keyword" } );
		let result = topicDensityAssessment.getResult( paper, factory.buildMockResearcher( {
			getTopicDensity: 0,
			topicCount: {
				count: 0,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 4 );
		expect( result.getText() ).toBe( "The topic density is 0%, which is too low; the focus keyword and its synonyms were found 0 times." );

		paper = new Paper( "string with the keyword", { keyword: "keyword" } );
		result = topicDensityAssessment.getResult( paper, factory.buildMockResearcher( {
			getTopicDensity: 10,
			topicCount: {
				count: 50,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( -50 );
		expect( result.getText() ).toBe( "The topic density is 10%, which is way over the advised 3% maximum; the focus keyword and its synonyms were found 50 times." );

		paper = new Paper( "string with the keyword", { keyword: "keyword" } );
		result = topicDensityAssessment.getResult( paper, factory.buildMockResearcher( {
			getTopicDensity: 2,
			topicCount: {
				count: 1,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The topic density is 2%, which is great; the focus keyword and its synonyms were found 1 times." );

		paper = new Paper( "string with the keyword and keyword ", { keyword: "keyword" } );
		result = topicDensityAssessment.getResult( paper, factory.buildMockResearcher( {
			getTopicDensity: 3.5,
			topicCount: {
				count: 2,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( -10 );
		expect( result.getText() ).toBe( "The topic density is 3.5%, which is over the advised 3% maximum; the focus keyword and its synonyms were found 2 times." );

		paper = new Paper( "string with the keyword and keyword ", { keyword: "keyword" } );
		result = topicDensityAssessment.getResult( paper, factory.buildMockResearcher( {
			getTopicDensity: 0.5,
			topicCount: {
				count: 2,
			},
		}, true ), i18n );
		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "The topic density is 0.5%, which is great; the focus keyword and its synonyms were found 2 times." );
	} );
} );

describe( "A test for marking the keyword and its synonyms", function() {
	it( "returns markers", function() {
		const paper = new Paper( "This is a very interesting paper with a keyword and other keywords.", { keyword: "keyword, other keywords" }  );
		const expected = [
			new Mark( { original: "keyword", marked: "<yoastmark class='yoast-text-mark'>keyword</yoastmark>" } ),
			new Mark( { original: "other keywords", marked: "<yoastmark class='yoast-text-mark'>other keywords</yoastmark>" } ),
		];
		expect( topicDensityAssessment.getMarks( paper ) ).toEqual( expected );
	} );

	it( "returns no markers", function() {
		const paper = new Paper( "This is a very interesting paper with a keyword and other keywords.", { keyword: "seaside" }  );
		const expected = [];
		expect( topicDensityAssessment.getMarks( paper ) ).toEqual( expected );
	} );
} );

