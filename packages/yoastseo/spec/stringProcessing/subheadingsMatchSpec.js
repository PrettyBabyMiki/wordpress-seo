import subheadingsMatch from "../../src/stringProcessing/helpers/_todo/subheadingsMatch";

describe( "subheadingsMatch", function() {
	it( "should return -1 when match is null", function() {
		expect( subheadingsMatch( null ) ).toBe( -1 );
	} );
} );
