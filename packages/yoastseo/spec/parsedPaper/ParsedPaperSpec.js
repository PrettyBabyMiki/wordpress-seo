import ParsedPaper from "../../src/parsedPaper/ParsedPaper";
import buildTree from "../../src/tree/builder/buildTree";

describe( "ParsedPaper", () => {
	describe( "constructor", () => {
		it( "makes a new ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			expect( parsedPaper ).toBeInstanceOf( ParsedPaper );
		} );
	} );

	describe( "setTree", () => {
		it( "sets the _tree on the ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			const tree = buildTree( "<h1>test</h1>" );
			parsedPaper.setTree( tree );
			expect( parsedPaper._tree ).toEqual( tree );
		} );
	} );

	describe( "getTree", () => {
		it( "sets gets _tree from the ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			const tree = buildTree( "<h1>test</h1>" );
			parsedPaper.setTree( tree );
			const result = parsedPaper.getTree();
			expect( result ).toEqual( tree );
		} );
	} );

	describe( "setMetaValue", () => {
		it( "sets a key-value pair to the _metadata on the ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			parsedPaper.setMetaValue( "keyword", "test" );
			expect( parsedPaper._metaData ).toEqual( { keyword: "test" } );
		} );
	} );

	describe( "getMetaValue", () => {
		it( "gets the value for a key from the _metadata on the ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			parsedPaper.setMetaValue( "keyword", "test" );
			const result = parsedPaper.getMetaValue( "keyword" );
			expect( result ).toEqual( "test" );
		} );

		it( "returns undefined if the metaData key doesn't exist", () => {
			const parsedPaper = new ParsedPaper();
			parsedPaper.setMetaValue( "keyword", "test" );
			const result = parsedPaper.getMetaValue( "badKey" );
			expect( result ).toEqual( undefined );
		} );
	} );

	describe( "setMetaData", () => {
		it( "sets a full _metadata object on the ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			const newMetaData = {
				keyword: "test",
				anotherKey: "anotherTest",
			};
			parsedPaper.setMetaData( newMetaData );
			expect( parsedPaper._metaData ).toEqual( newMetaData );
		} );

		it( "overwrites the _metadata object on the ParsedPaper with a new object", () => {
			const parsedPaper = new ParsedPaper();
			const oldMetaData = {
				oldKeyword: "old",
				anotherOldKey: "oldTest",
			};
			const newMetaData = {
				keyword: "test",
				anotherKey: "anotherTest",
			};
			parsedPaper.setMetaData( oldMetaData );
			parsedPaper.setMetaData( newMetaData );
			expect( parsedPaper._metaData ).toEqual( newMetaData );
		} );
	} );

	describe( "getMetaData", () => {
		it( "Returns the _metaData from the ParsedPaper", () => {
			const parsedPaper = new ParsedPaper();
			const newMetaData = {
				keyword: "test",
				anotherKey: "anotherTest",
			};
			parsedPaper.setMetaData( newMetaData );
			const result = parsedPaper.getMetaData();
			expect( result ).toEqual( newMetaData );
		} );
	} );
} );
