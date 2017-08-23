import { UPDATE_SEO_RESULT, UPDATE_READABILITY_RESULT, REMOVE_KEYWORD, SET_SEO_RESULTS, SET_READABILITY_RESULTS,
	updateSeoResult, updateReadabilityResult, replaceKeyword, setSeoResults, removeKeyword, setReadabilityResults } from "../contentAnalysis";
import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";

describe( "updateSeoResult action creator", function() {
	it( "creates the updateSeoResult action", function() {
		let result = { id: "result", score: 9, description: "This is a great score!", markingIsActive: true };
		let keyword = "keyword";

		const expected = {
			type: UPDATE_SEO_RESULT,
			keyword: keyword,
			result: result,
		};
		const actual = updateSeoResult( "keyword", result );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "updateReadabilityResult action creator", function() {
	it( "creates the readabilitySeoResult action", function() {
		let result = { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false };

		const expected = {
			type: UPDATE_READABILITY_RESULT,
			result: result,
		};
		const actual = updateReadabilityResult( result );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "the replaceKeyword action creator", function() {
	it( "creates the replaceKeyword action", function() {
		const middlewares = [ thunk ];
		const mockStore = configureMockStore( middlewares );

		let results = [ { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false } ];
		let oldKeyword = "oldKeyword";
		let newKeyword = "newKeyword";
		let resultsPerKeyword = [ {
			keyword: newKeyword,
			results: [ { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false } ],
		} ];

		const expectedActions = [
			{ type: REMOVE_KEYWORD, keyword: oldKeyword },
			{ type: SET_SEO_RESULTS, resultsPerKeyword: resultsPerKeyword },
		];
		const store = mockStore( { oldKeyword: [] }, { otherKeyword: [] } );

		store.dispatch( replaceKeyword( oldKeyword, newKeyword, results ) );
		expect( store.getActions() ).toEqual( expectedActions );
	} );
} );

describe( "setSeoResults function", function() {
	it( "creates the setSeoResults action", function() {
		let keyword = "keyword";
		let resultsPerKeyword = [ {
			keyword: keyword,
			results: [ { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false } ],
		} ];

		const expected = {
			type: SET_SEO_RESULTS,
			resultsPerKeyword: resultsPerKeyword,
		};
		const actual = setSeoResults( resultsPerKeyword );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "setReadabilityResults function", function() {
	it( "creates the setReadabilityResults action", function() {
		let results = [ { id: "result", score: 3, description: "This is a bad score!", markingIsActive: false } ];

		const expected = {
			type: SET_READABILITY_RESULTS,
			results: results,
		};
		const actual = setReadabilityResults( results );
		expect( actual ).toEqual( expected );
	} );
} );

describe( "removeKeyword function", function() {
	it( "creates the removeKeywordsAction", function() {
		let keyword = "keyword";

		const expected = {
			type: REMOVE_KEYWORD,
			keyword: keyword,
		};
		const actual = removeKeyword( keyword );
		expect( actual ).toEqual( expected );
	} );
} );
