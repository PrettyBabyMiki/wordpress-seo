import { shallow } from "enzyme";
import ReplacementVariableEditorStandalone from "../components/ReplacementVariableEditorStandalone";
import React from "react";

jest.mock( "draft-js/lib/generateRandomKey", () => () => {
	let randomKey = global._testDraftJSRandomNumber;

	if ( ! randomKey ) {
		randomKey = 0;
	}

	randomKey++;
	global._testDraftJSRandomNumber = randomKey;

	return randomKey + "";
} );

describe( "ReplacementVariableEditor", () => {
	it( "wraps a Draft.js editor instance", () => {

		const editor = shallow(
			<ReplacementVariableEditorStandalone
				replacementVariables={ [] }
				content="Dummy content"
				onChange={ () => {} }
				ariaLabelledBy="id"
			/>
		);

		expect( editor ).toMatchSnapshot();
	} );
} );

describe( "replacementVariablesFilter", () => {
	let searchValue, replacementVariables, replacementVariablesEditor, expected;

	beforeEach( () => {
		searchValue = "cat";
		replacementVariables = [
			{
				name: "category",
				label: "Category",
				value: "uncategorized",
			},
			{
				name: "primary_category",
				label: "Primary category",
				value: "uncategorized",
			},
			{
				name: "category_description",
				label: "Category description",
				value: "uncategorized",
			},
			{
				name: "date",
				label: "Date",
				value: "May 30, 2018",
			},
		];

		const props = {
			content: "Dummy content",
			onChange: () => {},
			ariaLabelledBy: "id",
		};

		replacementVariablesEditor = new ReplacementVariableEditorStandalone( props );

		expected = [
			{
				name: "category",
				label: "Category",
				value: "uncategorized",
			},
			{
				name: "category_description",
				label: "Category description",
				value: "uncategorized",
			},
		];
	} );

	it( "Returns only the replacement variables where the start of the name matches with the search value.", () => {
		const actual = replacementVariablesEditor.replacementVariablesFilter( searchValue, replacementVariables );

		expect( actual ).toEqual( expected );
	} );

	it( "Returns the matching replacement variables, regardless of upper- or lowercase in the search value.", () => {
		searchValue = "Cat";

		const actual = replacementVariablesEditor.replacementVariablesFilter( searchValue, replacementVariables );

		expect( actual ).toEqual( expected );
	} );
} );
