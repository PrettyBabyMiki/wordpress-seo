import { keywordResultsReducer } from "../contentAnalysis/keywordResultsReducer";
import { UPDATE_SEO_RESULT, SET_SEO_RESULTS, REMOVE_KEYWORD } from "../../actions/contentAnalysis";

describe( "SET_SEO_RESULTS action", () => {
	it( "sets seo results for a single keyword in an empty state", () => {
		const state = {};
		const action = {
			type: SET_SEO_RESULTS,
			resultsPerKeyword: [ {
				keyword: "thisIsMyKeyword",
				results: [
					{
						id: "resultId",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
					{
						id: "resultId2",
						score: 6,
						description: "This is a mediocre score!",
						markingIsActive: false,
					},
				],
			} ],
		};
		const expected = {
			thisIsMyKeyword: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
				{
					id: "resultId2",
					score: 6,
					description: "This is a mediocre score!",
					markingIsActive: false,
				},
			],
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "sets seo results for multiple keywords in an empty state", () => {
		const state = {};
		const action = {
			type: SET_SEO_RESULTS,
			resultsPerKeyword: [ {
				keyword: "thisIsMyKeyword",
				results: [
					{
						id: "resultId",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
					{
						id: "resultId2",
						score: 6,
						description: "This is a mediocre score!",
						markingIsActive: false,
					},
				],
			},
			{
				keyword: "thisIsMySecondKeyword",
				results: [
					{
						id: "resultId",
						score: 9,
						description: "This is a good score!",
						markingIsActive: false,
					},
					{
						id: "resultId2",
						score: 6,
						description: "This is a mediocre score!",
						markingIsActive: false,
					},
				],
			} ],
		};
		const expected = {
			thisIsMyKeyword: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
				{
					id: "resultId2",
					score: 6,
					description: "This is a mediocre score!",
					markingIsActive: false,
				},
			],
			thisIsMySecondKeyword: [
				{
					id: "resultId",
					score: 9,
					description: "This is a good score!",
					markingIsActive: false,
				},
				{
					id: "resultId2",
					score: 6,
					description: "This is a mediocre score!",
					markingIsActive: false,
				},
			],
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "sets seo results in an empty state", () => {
		const state = {};
		const action = {
			type: SET_SEO_RESULTS,
			resultsPerKeyword: [ {
				keyword: "thisIsMyKeyword",
				results: [
					{
						id: "resultId",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
					{
						id: "resultId2",
						score: 6,
						description: "This is a mediocre score!",
						markingIsActive: false,
					},
				],
			} ],

		};
		const expected = {
			thisIsMyKeyword: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
				{
					id: "resultId2",
					score: 6,
					description: "This is a mediocre score!",
					markingIsActive: false,
				},
			],
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "overwrites existing seo results in a non-empty state", () => {
		const state = {
			thisIsMyOldKeyword: [
				{
					id: "resultId",
					score: 9,
					description: "This is a good score!",
					markingIsActive: true,
				},
			],
		};
		const action = {
			type: SET_SEO_RESULTS,
			resultsPerKeyword: [ {
				keyword: "thisIsMyKeyword",
				results: [
					{
						id: "resultId",
						score: 3,
						description: "This is a bad score!",
						markingIsActive: false,
					},
					{
						id: "resultId2",
						score: 6,
						description: "This is a mediocre score!",
						markingIsActive: false,
					},
				],
			} ],
		};
		const expected = {
			thisIsMyKeyword: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
				{
					id: "resultId2",
					score: 6,
					description: "This is a mediocre score!",
					markingIsActive: false,
				},
			],
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "UPDATE_SEO_RESULT action", () => {
	it( "adds a new result for a new keyword to an empty state ", () => {
		const state = {};
		const action = {
			type: UPDATE_SEO_RESULT,
			keyword: "thisIsMyKeyword",
			result: { id: "resultId", score: 3, description: "This is a bad score!", markingIsActive: false },
		};
		const expected = {
			thisIsMyKeyword: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "adds a result for a new keyword in a non-empty state", () => {
		const state = {
			thisIsMyKeyword: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
		};
		const action = {
			type: UPDATE_SEO_RESULT,
			keyword: "thisIsMySecondKeyword",
			result: { id: "resultId", score: 9, description: "This is a good score!", markingIsActive: true },
		};
		const expected = {
			thisIsMyKeyword: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
			thisIsMySecondKeyword: [
				{
					id: "resultId",
					score: 9,
					description: "This is a good score!",
					markingIsActive: true,
				},
			],
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "adds a result for an existing keyword", () => {
		const state = {
			thisIsMyKeyword: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
			thisIsMySecondKeyword: [
				{
					id: "resultId",
					score: 6,
					description: "This is a mediocre score!",
					markingIsActive: false,
				},
			],
		};
		const action = {
			type: UPDATE_SEO_RESULT,
			keyword: "thisIsMyKeyword",
			result: { id: "resultId2", score: 9, description: "This is a good score!", markingIsActive: true },
		};
		const expected = {
			thisIsMyKeyword: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
				{
					id: "resultId2",
					score: 9,
					description: "This is a good score!",
					markingIsActive: true,
				},
			],
			thisIsMySecondKeyword: [
				{
					id: "resultId",
					score: 6,
					description: "This is a mediocre score!",
					markingIsActive: false,
				},
			],
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );

	it( "overwrites an existing result", () => {
		const state = {
			thisIsMyKeyword: [
				{
					id: "resultId",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
		};
		const action = {
			type: UPDATE_SEO_RESULT,
			keyword: "thisIsMyKeyword",
			result: { id: "resultId", score: 9, description: "This is a good score!", markingIsActive: true },
		};
		const expected = {
			thisIsMyKeyword: [
				{
					id: "resultId",
					score: 9,
					description: "This is a good score!",
					markingIsActive: true,
				},
			],
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "REMOVE_KEYWORD action", () => {
	it( "removes a keyword and its results", () => {
		const state = {
			keywordToBeRemoved: [
				{
					id: "resultId",
					score: 9,
					description: "This is a good score!",
					markingIsActive: true,
				},
			],
			keywordToStay: [
				{
					id: "resultId2",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
		};
		const action = {
			type: REMOVE_KEYWORD,
			keyword: "keywordToBeRemoved",
		};
		const expected = {
			keywordToStay: [
				{
					id: "resultId2",
					score: 3,
					description: "This is a bad score!",
					markingIsActive: false,
				},
			],
		};

		const actual = keywordResultsReducer( state, action );

		expect( actual ).toEqual( expected );
	} );
} );

describe( "BOGUS action", () => {
	it( "doesn't change the state when a bogus action is passed to the reducer", () => {
		const state = {};
		const action = {
			type: "BOGUS",
		};
		const expected = {};

		const actual = keywordResultsReducer( state, action );
		expect( actual ).toEqual( expected );
	} );
} );
