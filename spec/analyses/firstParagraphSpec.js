var firstParagraph = require( "../../js/analyses/firstParagraph.js" );

describe( "checks for the keyword in the first paragraph", function(){
	it( "returns the number of matches", function(){
		expect( firstParagraph( "<p>keyword</p>", "keyword" ) ).toBe( 1 );
		expect( firstParagraph( "<p>test</p><p>keyword</p>", "keyword" ) ).toBe( 0 );
		expect( firstParagraph( "dit is een keyword test \n\n ", "keyword" ) ).toBe( 1 );
		expect( firstParagraph( "dit is een test \n\n keyword", "keyword" ) ).toBe( 0 );
		expect( firstParagraph( "dit is een test keyword", "keyword" ) ).toBe( 1 );
	});
});
