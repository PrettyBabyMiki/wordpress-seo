import {
	mapDispatchToProps,
	mapStateToProps,
} from "../../src/containers/SnippetEditor";
import {switchMode, updateData} from "../../src/redux/actions/snippetEditor";


describe( "SnippetEditor container", () => {
	it( "maps the state to the props", () => {
		const state = { snippetEditor: {
			mode: "desktop",
			data: {
				title: "Title",
				slug: "slug",
				description: "Description",
			},
			replacementVariables: [],
		} };
		const expected = {
			mode: "desktop",
			data: {
				title: "Title",
				slug: "slug",
				description: "Description",
			},
			replacementVariables: [],
		};

		const result = mapStateToProps( state );

		expect( result ).toEqual( expected );
	} );

	it( "maps dispatch to props", () => {
		const dispatch = jest.fn();

		const result = mapDispatchToProps( dispatch );

		result.onChange( "mode", "some-mode" );
		result.onChange( "title", "Title" );

		expect( dispatch.mock.calls ).toEqual( [
			[ switchMode( "some-mode" ) ],
			[ updateData( { title: "Title" } ) ],
		] );
	} );
} );
