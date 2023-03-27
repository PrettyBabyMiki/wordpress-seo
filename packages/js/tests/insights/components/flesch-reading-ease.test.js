import React from "react";
import { shallow } from "enzyme";
import { useSelect } from "@wordpress/data";
import { set } from "lodash";

import FleschReadingEase from "../../../src/insights/components/flesch-reading-ease";
import { DIFFICULTY } from "yoastseo";

jest.mock( "@wordpress/data", () => (
	{
		useSelect: jest.fn(),
	}
) );

jest.mock( "@wordpress/element", () => (
	{
		...jest.requireActual( "@wordpress/element" ),
		useMemo: jest.fn( fn => fn() ),
	}
) );

/**
 * Mocks the WordPress `useSelect` hook.
 *
 * @param {number} score The Flesch reading ease score to use.
 * @param {DIFFICULTY} difficulty The Flesch reading ease difficulty to use.
 *
 * @returns {void}
 */
function mockSelect( score, difficulty ) {
	const select = jest.fn(
		() => (
			{
				getFleschReadingEaseScore: jest.fn( () => score ),
				getFleschReadingEaseDifficulty: jest.fn( () => difficulty ),
			}
		)
	);

	useSelect.mockImplementation(
		selectFunction => selectFunction( select )
	);
}

describe( "The FleschReadingEase component", () => {
	set( window, "wpseoAdminL10n.shortlinks-insights-flesch_reading_ease", "https://example.org/link" );
	set( window, "wpseoAdminL10n.shortlinks-insights-flesch_reading_ease_article", "https://example.org/article" );

	it( "renders the component when the text is considered very difficult.", () => {
		mockSelect( 10, DIFFICULTY.VERY_DIFFICULT );

		const element = shallow( <FleschReadingEase /> );

		const description = element.prop( "description" ).props.children;

		// Test the description feedback string.
		expect( description ).toContain(
			"The copy scores 10 in the test, which is considered very difficult to read."
		);
		// Test the call to action string of the feedback.
		expect( description[ 2 ].props.children ).toContain( "Try to make shorter sentences, using less difficult words to improve readability." );

		expect( element.prop( "amount" ) ).toEqual( 10 );
		expect( element.prop( "unit" ) ).toEqual( "out of 100" );
		expect( element.prop( "title" ) ).toEqual( "Flesch reading ease" );
		expect( element.prop( "linkTo" ) ).toEqual( "https://example.org/link" );
		expect( element.prop( "linkText" ) ).toEqual( "Learn more about Flesch reading ease" );
	} );
	it( "renders the component when the text is considered very easy.", () => {
		mockSelect( 90, DIFFICULTY.VERY_EASY );

		const element = shallow( <FleschReadingEase /> );

		const description = element.prop( "description" ).props.children;

		// Test the description feedback string.
		expect( description ).toContain(
			"The copy scores 90 in the test, which is considered very easy to read."
		);
		// Test the call to action string of the feedback.
		expect( description ).toContain( "Good job!" );
		expect( element.prop( "amount" ) ).toEqual( 90 );
	} );
	it( "renders the component when the text is considered easy.", () => {
		mockSelect( 80, DIFFICULTY.EASY );

		const element = shallow( <FleschReadingEase /> );
		const description = element.prop( "description" ).props.children;

		// Test the description feedback string.
		expect( description ).toContain(
			"The copy scores 80 in the test, which is considered easy to read."
		);
		// Test the call to action string of the feedback.
		expect( description[ 2 ] ).toContain( "Good job!" );
	} );
	it( "renders the component when the text is considered fairly easy.", () => {
		mockSelect( 70, DIFFICULTY.FAIRLY_EASY );

		const element = shallow( <FleschReadingEase /> );
		const description = element.prop( "description" ).props.children;

		// Test the description feedback string.
		expect( description ).toContain(
			"The copy scores 70 in the test, which is considered fairly easy to read."
		);
		// Test the call to action string of the feedback.
		expect( description[ 2 ] ).toContain( "Good job!" );
	} );
	it( "renders the component when the text is considered okay.", () => {
		mockSelect( 60, DIFFICULTY.OKAY );

		const element = shallow( <FleschReadingEase /> );
		const description = element.prop( "description" ).props.children;

		// Test the description feedback string.
		expect( description ).toContain(
			"The copy scores 60 in the test, which is considered okay to read."
		);
		// Test the call to action string of the feedback.
		expect( description[ 2 ] ).toContain( "Good job!" );
	} );
	it( "renders the component when the text is considered fairly difficult.", () => {
		mockSelect( 50, DIFFICULTY.FAIRLY_DIFFICULT );

		const element = shallow( <FleschReadingEase /> );
		const description = element.prop( "description" ).props.children;

		// Test the description feedback string.
		expect( description ).toContain(
			"The copy scores 50 in the test, which is considered fairly difficult to read."
		);
		// Test the call to action string of the feedback.
		expect( description[ 2 ].props.children ).toContain( "Try to make shorter sentences, using less difficult words to improve readability." );
	} );
	it( "renders the component when the text is considered difficult.", () => {
		mockSelect( 30, DIFFICULTY.DIFFICULT );

		const element = shallow( <FleschReadingEase /> );
		const description = element.prop( "description" ).props.children;

		// Test the description feedback string.
		expect( description ).toContain(
			"The copy scores 30 in the test, which is considered difficult to read."
		);
		// Test the call to action string of the feedback.
		expect( description[ 2 ].props.children ).toContain( "Try to make shorter sentences, using less difficult words to improve readability." );
	} );
} );
