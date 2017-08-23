import React from "react";
import renderer from "react-test-renderer";

import ArticleContent from "../ArticleContent.js";

test( "the ArticleContent component  matches the snapshot", () => {
	const component = renderer.create(
		<ArticleContent permalink="www.example.com/" title="KB article"/>
	);

	let tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
