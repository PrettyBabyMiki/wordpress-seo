import React from "react";
import renderer from "react-test-renderer";

import { BaseLinkButton, LinkButton } from "../components/LinkButton";

test( "the BaseLinkButton matches the snapshot", () => {
	const component = renderer.create(
		<BaseLinkButton>LinkButtonValue</BaseLinkButton>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );

test( "the LinkButton matches the snapshot", () => {
	const component = renderer.create(
		<LinkButton>LinkButtonValue</LinkButton>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
