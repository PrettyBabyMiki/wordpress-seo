import { BlockInstance, createBlock } from "@wordpress/blocks";
import * as renderer from "react-test-renderer";
import { mount } from "enzyme";
import BlockSuggestionsPresenter from "../../../src/functions/presenters/BlockSuggestionsPresenter";
import { insertBlock } from "../../../src/functions/innerBlocksHelper";

jest.mock( "@wordpress/blocks", () => {
	return {
		createBlock: jest.fn(),
	};
} );

jest.mock( "../../../src/functions/BlockHelper", () => {
	return {
		getBlockType: jest.fn( ( blockName: string )  => {
			if ( blockName === "yoast/nonexisting" ) {
				// eslint-disable-next-line no-undefined
				return undefined;
			}

			return {
				title: "The required block",
			};
		} ),
	};
} );

jest.mock( "../../../src/functions/innerBlocksHelper", () => {
	return {
		insertBlock: jest.fn(),
		getInnerblocksByName: jest.fn( ()  => {
			return [
				{
					name: "yoast/added-to-content",
				},
			];
		} ),
	};
} );

describe( "The required blocks in the sidebar", () => {
	it( "doesn't have the required block being registered as a block", () => {
		const block = { innerBlocks: [] } as BlockInstance;
		const requiredBlocks = [ "yoast/nonexisting" ];

		const actual = BlockSuggestionsPresenter( { title: "Required information", block, suggestions: requiredBlocks } );

		expect( actual ).toBe( null );
	} );

	it( "renders the required block as an added one", () => {
		const block = { innerBlocks: [] } as BlockInstance;
		const requiredBlocks = [ "yoast/added-to-content"  ];

		const tree = renderer
			.create( BlockSuggestionsPresenter( { title: "Required information", block, suggestions: requiredBlocks } ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "renders the required block as a non-added one", () => {
		const block = { innerBlocks: [] } as BlockInstance;
		const requiredBlocks = [ "yoast/non-added-to-content" ];

		const tree = renderer
			.create( BlockSuggestionsPresenter( { title: "Required information", block, suggestions: requiredBlocks } ) )
			.toJSON();

		expect( tree ).toMatchSnapshot();
	} );

	it( "should call the function to add the block when the button is clicked.", () => {
		const block = { innerBlocks: [], clientId: "1" } as BlockInstance;
		const requiredBlocks = [ "yoast/non-added-to-content" ];

		const tree = mount( BlockSuggestionsPresenter( { title: "Required information", block, suggestions: requiredBlocks } )  );

		const addButton = tree.find( "button" ).first();

		addButton.simulate( "click" );

		expect( createBlock ).toHaveBeenCalled();
		expect( insertBlock ).toHaveBeenCalled();
	} );
} );
