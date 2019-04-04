import Heading from "../../../../../src/parsedPaper/structure/tree/nodes/Heading";
import TextContainer from "../../../../../src/parsedPaper/structure/tree/TextContainer";

describe( "Heading", () => {
	describe( "constructor", () => {
		it( "creates a heading", () => {
			const heading = new Heading( 1 );

			expect( heading.sourceStartIndex ).toBe( 0 );
			expect( heading.sourceEndIndex ).toBe( 0 );
			expect( heading.level ).toBe( 1 );
			expect( heading.type ).toBe( "Heading" );
			expect( heading.textContainer instanceof TextContainer ).toBe( true );
		} );
	} );

	describe( "get and set text", () => {
		it( "sets text to a Heading tree node and get text from it", () => {
			const heading = new Heading( 3 );

			// Use a setter to add text to the Heading
			heading.text = "Some text!";

			expect( heading.type ).toEqual( "Heading" );
			expect( heading.textContainer ).not.toEqual( null );
			expect( heading.textContainer.text ).toEqual( "Some text!" );

			// Use a getter to get text from the Heading
			expect( heading.text ).toEqual( "Some text!" );
		} );
	} );
} );
