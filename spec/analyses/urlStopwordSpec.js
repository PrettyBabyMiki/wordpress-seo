var urlStopwords = require( "../../js/analyses/urlStopwords.js" );

describe( "Checks the URL for stopwords", function(){
	it("returns any stopwords found", function(){
		expect( urlStopwords( "before-and-after" ) ).toContain( "before" );
		expect( urlStopwords( "before-and-after" ) ).toContain( "after" );
	});
});
