import stem from "../../../src/morphology/german/stem";

const nounsToStem = [
	// Suffix step 1 category a (-ern).
	[ "häusern", "häus" ],
	// Suffix step 1 category b (-en).
	[ "studenten", "student" ],
	// Suffix step 1 category c (-s preceded by valid s-ending).
	[ "manns", "mann" ],
	// Suffix step 1 category b with -nis ending.
	[ "ergebnisse", "ergebnis" ],
	// Suffix step 2 category a (-est)
	[ "nettesten", "nett" ],
	// Suffix step 2 category b (-st)
	[ "liebsten", "lieb" ],
	// Suffix as defined in step 1 (-ern) that is not within the R1.
	[ "kern", "kern" ],
	// Suffix as defined in step 2 (-est) that is not within the R1.
	[ "test", "test" ],
	// A word without an R1.
	[ "so", "so" ],
];

describe( "Test for stemming German words", () => {
	it( "stems German nouns", () => {
		nounsToStem.forEach( wordToStem => expect( stem( wordToStem[ 0 ] ) ).toBe( wordToStem[ 1 ] ) );
	} );
} );
