var pageTitleKeyword = require( "../../js/analyses/findKeywordInPageTitle.js" );
var result;

describe("Match keywords in string", function(){
	it("returns number of matches and position", function(){
		result = pageTitleKeyword( "keyword in a string", "keyword" );
		expect( result.matches ).toBe( 1 );
		expect( result.position ).toBe( 0 );

		result = pageTitleKeyword( "a string with a keyword and another keyword", "keyword");
		expect( result.matches ).toBe( 2 );
		expect( result.position ).toBe( 16 );

		result = pageTitleKeyword( "a string with words", "");
		expect( result.matches).toBe( 0 );

		result = pageTitleKeyword( "ст, чтобы проверить нечто Test текст, чтобы ", "нечто");
		expect( result.matches ).toBe( 1 );

		result = pageTitleKeyword( "äbc", "äbc");
		expect( result.matches ).toBe( 1 );

		result = pageTitleKeyword( "focus-keyword", "focus keyword");
		expect( result.matches ).toBe( 0 );
	});
});

