import {
	START_MARK,
	END_MARK,
	getYoastmarkOffsets,
	getIndicesOf,
	calculateAnnotationsForTextFormat,
	getAnnotationsFromBlock,
	hasInnerBlocks,
	getAnnotationsForYoastBlocks,
} from "../../src/decorator/gutenberg";

jest.mock( "@wordpress/rich-text", () => {
	// Mock the import of the `create` function.
	return {
	  __esModule: true,
	  create: () => ( { text: "An item about lingo" } ),
	};
} );

import { select } from "@wordpress/data";

jest.mock( "@wordpress/data" );

/**
 * Mocks a YoastSEO.js Mark object.
 *
 * @param {string} original The sentence without yoastmark tags.
 * @param {string} marked   The sentence with yoastmark tags.
 *
 * @returns {Object} Mark mock.
 */
function mockMark( original, marked ) {
	return {
		getOriginal: () => original,
		getMarked: () => marked,
	};
}

describe( "getOffsets", () => {
	it( "successfully finds offsets for a single mark at the start of the text", () => {
		const markedText = `${ START_MARK }A marked${ END_MARK } text.`;

		const expected = [
			{
				startOffset: 0,
				endOffset: 8,
			},
		];

		expect( getYoastmarkOffsets( markedText ) ).toEqual( expected );
	} );

	it( "successfully finds offsets for a single mark at the end of the text", () => {
		const markedText = `A ${ START_MARK }marked text.${ END_MARK }`;

		const expected = [
			{
				startOffset: 2,
				endOffset: 14,
			},
		];

		expect( getYoastmarkOffsets( markedText ) ).toEqual( expected );
	} );

	it( "successfully finds multiple offsets for multiple marks", () => {
		const markedText = `${ START_MARK }A${ END_MARK } marked ${ START_MARK }text.${ END_MARK }`;

		const expected = [
			{
				startOffset: 0,
				endOffset: 1,
			},
			{
				startOffset: 9,
				endOffset: 14,
			},
		];

		expect( getYoastmarkOffsets( markedText ) ).toEqual( expected );
	} );

	/**
	 * If we receive an unexpected string we don't do anything to avoid code complexity. We
	 * expect YoastSEO.js to provide us with proper marked sentences after all.
	 */
	it( "returns an empty array if the start and end tags are in a incorrect order", () => {
		const markedText = `${ START_MARK }A${ END_MARK } marked ${ END_MARK }text.${ START_MARK }`;

		const expected = [];

		expect( getYoastmarkOffsets( markedText ) ).toEqual( expected );
	} );
} );

describe( "getIndicesOf", () => {
	it( "finds a single case sensitive occurence", () => {
		const expected = [ 3 ];

		expect( getIndicesOf( "la LA", "LA" ) ).toEqual( expected );
	} );

	it( "finds multiple case insensitive occurences", () => {
		const expected = [ 0, 3 ];

		expect( getIndicesOf( "la LA", "LA", false ) ).toEqual( expected );
	} );
} );

describe( "calculateAnnotationsForTextFormat", () => {
	it( "correctly calculates multiple offsets for a single sentence in a text", () => {
		const text = "A long text. A marked text.";

		const mark = mockMark(
			"A marked text.",
			`A marked ${ START_MARK }text${ END_MARK }.`
		);

		/*
		 * "A long text. A marked text."
		 *                     22 ^   ^ 26
		 */
		const expected = [
			{
				startOffset: 22,
				endOffset: 26,
			},
		];

		const actual = calculateAnnotationsForTextFormat(
			text,
			mark
		);

		expect( actual ).toEqual( expected );
	} );

	it( "correctly calculates offsets in a text with HTML tags", () => {
		const text = "A long text. A marked text.";

		const mark = mockMark(
			"A marked text.",
			`A ${ START_MARK }<b>marked text</b>${ END_MARK }.`
		);

		/*
		 * "A long text. A marked text."
		 *                 ^ 15       ^ 26
		 */
		const expected = [ {
			startOffset: 15,
			endOffset: 26,
		} ];

		const actual = calculateAnnotationsForTextFormat(
			text,
			mark
		);

		expect( actual ).toEqual( expected );
	} );

	it( "correctly calculates offsets in a text with invalid HTML markup", () => {
		const text = "A long text. A marked text.";

		const mark = mockMark(
			"A marked text.",
			`A ${ START_MARK }<b>marked${ END_MARK } text</b>.`
		);

		/*
		 * "A long text. A marked text."
		 *                 ^ 15  ^ 21
		 */
		const expected = [ {
			startOffset: 15,
			endOffset: 21,
		} ];

		const actual = calculateAnnotationsForTextFormat(
			text,
			mark
		);

		expect( actual ).toEqual( expected );
	} );
} );


describe( "test getAnnotationsFromBlock", () => {
	it( "returns an annotation if there is an applicable marker for the text", () => {
		const mockBlock = {
			clientId: "34f61542-0902-44f7-ab48-d9f88a022b43",
			name: "core/list-item",
			isValid: true,
			attributes: {
				content: "An item about lingo",
			},
			innerBlocks: [],
		};

		const myMockMark1 = mockMark(
			"The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32. lingo",
			"The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32. <yoastmark class='yoast-text-mark'>lingo</yoastmark>"
		);

		const myMockMark2 = mockMark(
			"An item about lingo",
			"An item about <yoastmark class='yoast-text-mark'>lingo</yoastmark>"
		);

		const mockMarks = [ myMockMark1, myMockMark2 ];

		select.mockReturnValue( {
			getActiveMarker: jest.fn( () => "keyphraseDensity" ),
		} );

		const annotations = getAnnotationsFromBlock( mockBlock, mockMarks );

		const resultWithAnnotation =     [
			{
			  startOffset: 14,
			  endOffset: 19,
			  block: "34f61542-0902-44f7-ab48-d9f88a022b43",
			  richTextIdentifier: "content",
			},
		  ];

		expect( annotations ).toEqual( resultWithAnnotation );
	} );
	it( "returns an annotation if there is an applicable marker for the text in a Yoast How-To block", () => {
		const mockAttribute = {
			id: "how-to-step-1673986648542",
			jsonName: "The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32. lingo",
			jsonText: "An item about lingo",
			key: "steps",
		};

		const mockBlock = {
			clientId: "2821282d-aead-4191-a844-c43568cd112d",
			name: "yoast/how-to-block",
			isValid: true,
			attributes: {
				steps: [ mockAttribute ],
			},
			innerBlocks: [],
		};
		const myMockMark1 = mockMark(
			"The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32. lingo",
			"The first line of Lorem Ipsum, \"Lorem ipsum dolor sit amet..\", comes from a line in section 1.10.32. <yoastmark class='yoast-text-mark'>lingo</yoastmark>"
		);

		const myMockMark2 = mockMark(
			"An item about lingo",
			"An item about <yoastmark class='yoast-text-mark'>lingo</yoastmark>"
		);

		const mockMarks = [ myMockMark1, myMockMark2 ];

		select.mockReturnValue( {
			getActiveMarker: jest.fn( () => "keyphraseDensity" ),
		} );

		const annotations = getAnnotationsForYoastBlocks( mockAttribute, mockBlock, mockMarks );
		console.log( annotations, "annotations" );
		// const resultWithAnnotation =     [
		// 	{
		// 		startOffset: 14,
		// 		endOffset: 19,
		// 		block: "2821282d-aead-4191-a844-c43568cd112d",
		// 		richTextIdentifier: "how-to-step-1673986648542-name",
		// 	},
		// ];
		const resultWithAnnotation = [
			{
				startOffset: 14,
				endOffset: 19,
				block: "2821282d-aead-4191-a844-c43568cd112d",
				richTextIdentifier: "how-to-step-1673986648542-name",
			},
			{
				startOffset: 14,
				endOffset: 19,
				block: "2821282d-aead-4191-a844-c43568cd112d",
				richTextIdentifier: "how-to-step-1673986648542-text",
			},
			{
				startOffset: 14,
				endOffset: 19,
				block: "2821282d-aead-4191-a844-c43568cd112d",
				richTextIdentifier: "description",
			},
		];

		expect( annotations ).toEqual( resultWithAnnotation );
	} );
} );

describe( "tests for the hasInnerBlocks helper", () => {
	it( "returns true if a block has inner blocks", () => {
		const mockBlockWithInnerblocks = {
			innerBlocks: [ { fakeData: "fakeData" } ],
		};
		expect( hasInnerBlocks( mockBlockWithInnerblocks ) ).toBeTruthy();
	} );
	it( "returns false if a block has no inner blocks", () =>{
		const mockBlockWithoutInnerblocks = {
			innerBlocks: [],
			fakeData: "fakeData",
		};
		expect( hasInnerBlocks( mockBlockWithoutInnerblocks ) ).toBeFalsy();
	} );
} );
