import { TreeResearcher } from "../../../src/tree/research";
import Research from "../../../src/tree/research/researches/Research";

describe( "TreeResearcher", () => {
	describe( "constructor", () => {
		it( "makes a new TreeResearcher", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher ).toBeInstanceOf( TreeResearcher );
		} );
	} );

	describe( "addResearch", () => {
		it( "adds a research", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher._researches ).toEqual( {} );
			const research = new Research();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( treeResearcher._researches ).toEqual( {
				"number of unicorns": research,
			} );
		} );
	} );

	describe( "getResearches", () => {
		it( "returns the stored researches", () => {
			const treeResearcher = new TreeResearcher();
			treeResearcher.addResearch( "number of unicorns", new Research() );
			treeResearcher.addResearch( "amount of rainbows", new Research() );
			expect( treeResearcher.getResearches() ).toEqual( {
				"number of unicorns": new Research(),
				"amount of rainbows": new Research(),
			} );
		} );

		it( "returns an empty object when no researches are stored", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher.getResearches() ).toEqual( { } );
		} );
	} );

	describe( "hasResearch", () => {
		it( "returns true when the TreeResearcher has a research with a given name", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher._researches ).toEqual( {} );
			const research = new Research();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( treeResearcher.hasResearch( "number of unicorns" ) ).toEqual( true );
		} );

		it( "returns false when the TreeResearcher does not have a research with a given name", () => {
			const treeResearcher = new TreeResearcher();
			expect( treeResearcher._researches ).toEqual( {} );
			expect( treeResearcher.hasResearch( "number of unicorns" ) ).toEqual( false );
		} );
	} );

	describe( "getResearchInstance", () => {
		it( "returns an instance of the given research when it exists", () => {
			const treeResearcher = new TreeResearcher();
			const research = new Research();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( treeResearcher.getResearch( "number of unicorns" ) ).toEqual( research );
		} );

		it( "throws an error if the given research does not exist", () => {
			const treeResearcher = new TreeResearcher();
			const research = new Research();
			treeResearcher.addResearch( "number of unicorns", research );
			expect( () => treeResearcher.getResearch( "number of dragons" ) ).toThrow();
		} );

		it( "throws an error if no name is given", () => {
			const treeResearcher = new TreeResearcher();
			expect( () => treeResearcher.getResearch() ).toThrow();
		} );
	} );

	describe( "getResearchForNode", () => {

	} );

	describe( "addResearchData", () => {
		it( "sets research data", () => {
			const treeResearcher = new TreeResearcher();
			const data = { array: [ 1, 2, 3, 4, 5 ] }
			treeResearcher.addResearchData( "number of gnomes", data );
			expect( treeResearcher._data ).toHaveProperty( "number of gnomes" );
			expect( treeResearcher._data[ "number of gnomes" ] ).toEqual( data );
		} );
	} );

	describe( "getData", () => {

	} );
} );
