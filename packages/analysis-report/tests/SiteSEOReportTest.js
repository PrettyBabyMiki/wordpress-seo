import React from "react";
import renderer from "react-test-renderer";

import SiteSEOReport from "../src/SiteSEOReport";

test( "the SiteSEOReport matches the snapshot", () => {
	const seoAssessmentItems = [
		{
			html: "<div></div>",
			value: 10,
			color: "blue",
		},
		{
			html: "<div></div>",
			value: 15,
			color: "red",
		},
		{
			html: "<div></div>",
			value: 20,
			color: "yellow",
		},
	];

	const component = renderer.create(
		<SiteSEOReport
			className="test_SiteSEOReport"
			seoAssessmentText="Test assessment"
			seoAssessmentItems={ seoAssessmentItems }
			barHeight={ "10" }
		/>
	);

	const tree = component.toJSON();
	expect( tree ).toMatchSnapshot();
} );
