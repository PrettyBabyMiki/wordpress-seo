/* External dependencies */
import React from "react";
import renderer from "react-test-renderer";
/* Internal dependencies */
import ImageSelect from "../src/ImageSelect";

describe( "<ImageSelect />", () => {
	it( "renders", () => {
		const tree = renderer.create(
			<ImageSelect
				imageSelected={ false }
				title="Facebook image"
				isPremium={ true }
			/>,
		).toJSON();
		expect( tree ).toMatchSnapshot();
	} );

	it( "displays warnings", () => {
		const tree = renderer.create(
			<ImageSelect
				title="Facebook image"
				imageSelected={ true }
				isPremium={ false }
				warnings={ [
					"Your image is too small",
					"Wow, I like writing tests",
				] }
			/>,
		).toJSON();
		expect( tree ).toMatchSnapshot();
	} );
} );
