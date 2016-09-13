var countSyllableFunction = require( "../../../js/stringProcessing/syllables/count.js" );
var forEach = require( "lodash/forEach" );

function testCountSyllables( testCases, locale ) {
	forEach( testCases, function( expected, input ) {
		var actual = countSyllableFunction( input, locale );

		expect( actual ).toBe( expected );
	});
}

describe( "a syllable counter for English text strings", function () {
	it( "returns the number of syllables", function () {
		expect( countSyllableFunction( "this is a text string" ) ).toBe( 5 );

		expect( countSyllableFunction( "human beings" ) ).toBe( 4 );

		expect( countSyllableFunction( "along the shoreline" ) ).toBe( 5 );

		expect( countSyllableFunction( "A piece of text to calculate scores" ) ).toBe( 9 );

		expect( countSyllableFunction( "This is the year that Yoast turns 5 years old. A natural time to reflect upon how the company is doing and what it should and should not be doing and what we want for the future. Today we’re proud to announce that we’ve been acquired by CrowdFavorite" ) ).toBe( 63 );

		expect( countSyllableFunction( "One question we get quite often in our website reviews is whether we can help people recover from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually in a bit of trouble." ) ).toBe( 65 );

		expect( countSyllableFunction( "Bridger Pass is a mountain pass in Carbon County, Wyoming on the Continental Divide near the south Great Divide Basin bifurcation point, i.e., the point at which the divide appears to split and envelop the basin." ) ).toBe( 57 );

		expect( countSyllableFunction( "A test based on exclusion words for syllable count" ) ).toBe( 13 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable cial", function () {

		expect( countSyllableFunction( "special" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable tia", function () {
		expect( countSyllableFunction( "potential" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable cius", function () {
		// cius
		expect( countSyllableFunction( "Lucius" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable gui", function () {
		expect( countSyllableFunction( "linguist" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ion", function () {
		expect( countSyllableFunction( "region" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^bdnprv]iou", function () {
		expect( countSyllableFunction( "delicious" ) ).toBe( 3 );
		expect( countSyllableFunction( "dubious" ) ).toBe( 3 );
		expect( countSyllableFunction( "odious" ) ).toBe( 3 );
		expect( countSyllableFunction( "parsimonious" ) ).toBe( 5 );
		expect( countSyllableFunction( "pious" ) ).toBe( 2 );
		expect( countSyllableFunction( "spurious" ) ).toBe( 3 );
		expect( countSyllableFunction( "obvious" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable sia$", function () {
		expect( countSyllableFunction( "Malaysia" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^aeiuot]{2,}ed$", function () {
		expect( countSyllableFunction( "pyjamaed" ) ).toBe( 3 );
		expect( countSyllableFunction( "greed" ) ).toBe( 1 );
		expect( countSyllableFunction( "applied" ) ).toBe( 2 );
		expect( countSyllableFunction( "argued" ) ).toBe( 2 );
		expect( countSyllableFunction( "tangoed" ) ).toBe( 2 );
		expect( countSyllableFunction( "skirted" ) ).toBe( 2 );
		expect( countSyllableFunction( "inched" ) ).toBe( 1 );
		expect( countSyllableFunction( "coughed" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [aeiouy][^aeiuoyts]{1,}e$", function () {
		expect( countSyllableFunction( "snake" ) ).toBe( 1 );
		expect( countSyllableFunction( "scene" ) ).toBe( 1 );
		expect( countSyllableFunction( "file" ) ).toBe( 1 );
		expect( countSyllableFunction( "home" ) ).toBe( 1 );
		expect( countSyllableFunction( "nuke" ) ).toBe( 1 );
		expect( countSyllableFunction( "style" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [a-z]ely$", function () {
		expect( countSyllableFunction( "definitely" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [cgy]ed$", function () {
		expect( countSyllableFunction( "aced" ) ).toBe( 1 );
		expect( countSyllableFunction( "caged" ) ).toBe( 1 );
		expect( countSyllableFunction( "enjoyed" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable rved$", function () {
		expect( countSyllableFunction( "carved" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [aeiouy][dt]es?$", function () {
		expect( countSyllableFunction( "states" ) ).toBe( 1 );
		expect( countSyllableFunction( "state" ) ).toBe( 1 );
		expect( countSyllableFunction( "athletes" ) ).toBe( 2 );
		expect( countSyllableFunction( "althlete" ) ).toBe( 2 );
		expect( countSyllableFunction( "bites" ) ).toBe( 1 );
		expect( countSyllableFunction( "bite" ) ).toBe( 1 );
		expect( countSyllableFunction( "notes" ) ).toBe( 1 );
		expect( countSyllableFunction( "note" ) ).toBe( 1 );
		expect( countSyllableFunction( "minutes" ) ).toBe( 2 );
		expect( countSyllableFunction( "minute" ) ).toBe( 2 );
		expect( countSyllableFunction( "bytes" ) ).toBe( 1 );
		expect( countSyllableFunction( "byte" ) ).toBe( 1 );
		expect( countSyllableFunction( "grades" ) ).toBe( 1 );
		expect( countSyllableFunction( "grade" ) ).toBe( 1 );
		expect( countSyllableFunction( "Swede" ) ).toBe( 1 );
		expect( countSyllableFunction( "Swedes" ) ).toBe( 1 );
		expect( countSyllableFunction( "guides" ) ).toBe( 1 );
		expect( countSyllableFunction( "guide" ) ).toBe( 1 );
		expect( countSyllableFunction( "episodes" ) ).toBe( 3 );
		expect( countSyllableFunction( "episode" ) ).toBe( 3 );
		expect( countSyllableFunction( "dudes" ) ).toBe( 1 );
		expect( countSyllableFunction( "dude" ) ).toBe( 1 );
		expect( countSyllableFunction( "formaldehydes" ) ).toBe( 4 );
		expect( countSyllableFunction( "formaldehyde" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable eau", function () {
		// Compensates for "[aeio][aeiou]{2}" in add syllables
		expect( countSyllableFunction( "beautiful" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ieu", function () {
		// Compensates for "[aeio][aeiou]{2}" in add syllables
		expect( countSyllableFunction( "lieutenant" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable oeu", function () {
		// Compensate for "[aeio][aeiou]{2}" in add syllables
		expect( countSyllableFunction( "manoeuvre" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [aeiouy][^aeiouydt]e[sd]?$", function () {
		expect( countSyllableFunction( "caves" ) ).toBe( 1 );
		expect( countSyllableFunction( "caved" ) ).toBe( 1 );
		expect( countSyllableFunction( "cave" ) ).toBe( 1 );
		expect( countSyllableFunction( "believes" ) ).toBe( 2 );
		expect( countSyllableFunction( "believed" ) ).toBe( 2 );
		expect( countSyllableFunction( "believe" ) ).toBe( 2 );
		expect( countSyllableFunction( "lines" ) ).toBe( 1 );
		expect( countSyllableFunction( "lined" ) ).toBe( 1 );
		expect( countSyllableFunction( "line" ) ).toBe( 1 );
		expect( countSyllableFunction( "bores" ) ).toBe( 1 );
		expect( countSyllableFunction( "bored" ) ).toBe( 1 );
		expect( countSyllableFunction( "bore" ) ).toBe( 1 );
		expect( countSyllableFunction( "rebukes" ) ).toBe( 2 );
		expect( countSyllableFunction( "rebuked" ) ).toBe( 2 );
		expect( countSyllableFunction( "rebuke" ) ).toBe( 2 );
		expect( countSyllableFunction( "hypes" ) ).toBe( 1 );
		expect( countSyllableFunction( "hyped" ) ).toBe( 1 );
		expect( countSyllableFunction( "hype" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [aeouy]rse$", function () {
		expect( countSyllableFunction( "hearse" ) ).toBe( 1 );
		expect( countSyllableFunction( "universe" ) ).toBe( 3 );
		expect( countSyllableFunction( "horse" ) ).toBe( 1 );
		expect( countSyllableFunction( "purse" ) ).toBe( 1 );
		expect( countSyllableFunction( "thyrse" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^eye", function () {
		expect( countSyllableFunction( "eye" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable ia", function () {
		expect( countSyllableFunction( "liar" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable iu", function () {
		expect( countSyllableFunction( "delirium" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable io", function () {
		expect( countSyllableFunction( "interior" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ii", function () {
		expect( countSyllableFunction( "Hawaii" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeio][aeiou]{2}", function () {
		// In subtract syllables -1 for eau, ieu and oeu.
		expect( countSyllableFunction( "Saeed" ) ).toBe( 2 );
		expect( countSyllableFunction( "Hawaii" ) ).toBe( 3 );
		expect( countSyllableFunction( "Galilaei" ) ).toBe( 4 );
		expect( countSyllableFunction( "spiraea" ) ).toBe( 3 );
		expect( countSyllableFunction( "archaeology" ) ).toBe( 5 );
		expect( countSyllableFunction( "athenaeum" ) ).toBe( 4 );
		expect( countSyllableFunction( "Gaia" ) ).toBe( 2 );
		expect( countSyllableFunction( "aioli" ) ).toBe( 3 );
		expect( countSyllableFunction( "Gaius" ) ).toBe( 2 );
		expect( countSyllableFunction( "Curaçaoan" ) ).toBe( 4 );
		expect( countSyllableFunction( "logaoedic" ) ).toBe( 4 );
		expect( countSyllableFunction( "Maoist" ) ).toBe( 2 );
		expect( countSyllableFunction( "lauan" ) ).toBe( 2 );
		expect( countSyllableFunction( "sauerkraut" ) ).toBe( 3 );
		expect( countSyllableFunction( "maui" ) ).toBe( 2 );
		expect( countSyllableFunction( "tauon" ) ).toBe( 2 );
		expect( countSyllableFunction( "araceae" ) ).toBe( 4 );
		expect( countSyllableFunction( "agreeable" ) ).toBe( 4 );
		expect( countSyllableFunction( "sightseeing" ) ).toBe( 3 );
		expect( countSyllableFunction( "onomatopoeia" ) ).toBe( 6 );
		expect( countSyllableFunction( "pompeii" ) ).toBe( 3 );
		expect( countSyllableFunction( "meiosis" ) ).toBe( 3 );
		expect( countSyllableFunction( "paleoanthropology" ) ).toBe( 8 );
		expect( countSyllableFunction( "rodeoed" ) ).toBe( 3 );
		expect( countSyllableFunction( "nucleoid" ) ).toBe( 3 );
		expect( countSyllableFunction( "neoorthodoxy" ) ).toBe( 6 );
		expect( countSyllableFunction( "gorgeous" ) ).toBe( 3 );
		expect( countSyllableFunction( "striae" ) ).toBe( 2 );
		expect( countSyllableFunction( "liaison" ) ).toBe( 3 );
		expect( countSyllableFunction( "semiautomatic" ) ).toBe( 6 );
		expect( countSyllableFunction( "boogieing" ) ).toBe( 3 );
		expect( countSyllableFunction( "radioactive" ) ).toBe( 5 );
		expect( countSyllableFunction( "bioethics" ) ).toBe( 4 );
		expect( countSyllableFunction( "opioid" ) ).toBe( 3 );
		expect( countSyllableFunction( "bioorganic" ) ).toBe( 5 );
		expect( countSyllableFunction( "glorious" ) ).toBe( 3 );
		expect( countSyllableFunction( "hypoaesthesia" ) ).toBe( 5 );
		expect( countSyllableFunction( "autoaim" ) ).toBe( 3 );
		expect( countSyllableFunction( "coauthor" ) ).toBe( 3 );
		expect( countSyllableFunction( "apnoea" ) ).toBe( 3 );
		expect( countSyllableFunction( "boeing" ) ).toBe( 2 );
		expect( countSyllableFunction( "homoeostasis" ) ).toBe( 5 );
		expect( countSyllableFunction( "paranoia" ) ).toBe( 4 );
		expect( countSyllableFunction( "wooable" ) ).toBe( 3 );
		expect( countSyllableFunction( "gooey" ) ).toBe( 2 );
		expect( countSyllableFunction( "wooing" ) ).toBe( 2 );
		expect( countSyllableFunction( "homoousian" ) ).toBe( 5 );
		expect( countSyllableFunction( "zouave" ) ).toBe( 2 );
		expect( countSyllableFunction( "pirouetting" ) ).toBe( 4 );
		expect( countSyllableFunction( "louisiana" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeiou]ing", function () {
		expect( countSyllableFunction( "subpoenaing" ) ).toBe( 4 );
		expect( countSyllableFunction( "being" ) ).toBe( 2 );
		expect( countSyllableFunction( "skiing" ) ).toBe( 2 );
		expect( countSyllableFunction( "doing" ) ).toBe( 2 );
		expect( countSyllableFunction( "continuing" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^aeiou]ying", function () {
		expect( countSyllableFunction( "flying" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ui[aeou]", function () {
		expect( countSyllableFunction( "colloquial" ) ).toBe( 4 );
		expect( countSyllableFunction( "quiet" ) ).toBe( 2 );
		expect( countSyllableFunction( "sesquioxide" ) ).toBe( 4 );
		expect( countSyllableFunction( "colloquium" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^ree[jmnpqrsx]", function () {
		expect( countSyllableFunction( "reeject" ) ).toBe( 3 );
		expect( countSyllableFunction( "reemit" ) ).toBe( 3 );
		expect( countSyllableFunction( "reenact" ) ).toBe( 3 );
		expect( countSyllableFunction( "reepithelialization" ) ).toBe( 9 );
		expect( countSyllableFunction( "reequipe" ) ).toBe( 3 );
		expect( countSyllableFunction( "reerect" ) ).toBe( 3 );
		expect( countSyllableFunction( "reescalate" ) ).toBe( 4 );
		expect( countSyllableFunction( "reexamine" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^reele", function () {
		expect( countSyllableFunction( "reelect" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^reeva", function () {
		expect( countSyllableFunction( "reevaluate" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable riet", function () {
		expect( countSyllableFunction( "variety" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable dien", function () {
		expect( countSyllableFunction( "audience" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeiouym][bdp]le$", function () {
		expect( countSyllableFunction( "able" ) ).toBe( 2 );
		expect( countSyllableFunction( "cradle" ) ).toBe( 2 );
		expect( countSyllableFunction( "staple" ) ).toBe( 2 );
		expect( countSyllableFunction( "feeble" ) ).toBe( 2 );
		expect( countSyllableFunction( "needle" ) ).toBe( 2 );
		expect( countSyllableFunction( "steeple" ) ).toBe( 2 );
		expect( countSyllableFunction( "mandible" ) ).toBe( 3 );
		expect( countSyllableFunction( "idle" ) ).toBe( 2 );
		expect( countSyllableFunction( "multiple" ) ).toBe( 3 );
		expect( countSyllableFunction( "noble" ) ).toBe( 2 );
		expect( countSyllableFunction( "poodle" ) ).toBe( 2 );
		expect( countSyllableFunction( "people" ) ).toBe( 2 );
		expect( countSyllableFunction( "double" ) ).toBe( 2 );
		expect( countSyllableFunction( "caudle" ) ).toBe( 2 );
		expect( countSyllableFunction( "couple" ) ).toBe( 2 );
		expect( countSyllableFunction( "ensemble" ) ).toBe( 3 );
		expect( countSyllableFunction( "simple" ) ).toBe( 2 );
	} );


	it( "returns the number of syllables of words containing the add syllable uei", function () {
		expect( countSyllableFunction( "blueish" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable uou", function () {
		expect( countSyllableFunction( "ambiguous" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^mc", function () {
		expect( countSyllableFunction( "McKenzie" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ism$", function () {
		expect( countSyllableFunction( "socialism" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]lien", function () {
		expect( countSyllableFunction( "alien" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^coa[dglx]", function () {
		expect( countSyllableFunction( "coadjutor" ) ).toBe( 4 );
		expect( countSyllableFunction( "coagulate" ) ).toBe( 4 );
		expect( countSyllableFunction( "coalescent" ) ).toBe( 4 );
		expect( countSyllableFunction( "coaxial" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^gqauieo]ua[^auieo]", function () {
		expect( countSyllableFunction( "dual" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable dn't$", function () {
		expect( countSyllableFunction( "hadn't" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable uity$", function () {
		expect( countSyllableFunction( "ambiguity" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ie(r|st)", function () {
		expect( countSyllableFunction( "carrier" ) ).toBe( 3 );
		expect( countSyllableFunction( "happiest" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [aeiouw]y[aeiou]", function () {
		expect( countSyllableFunction( "papaya" ) ).toBe( 3 );
		expect( countSyllableFunction( "abeyance" ) ).toBe( 3 );
		expect( countSyllableFunction( "teriyaki" ) ).toBe( 4 );
		expect( countSyllableFunction( "loyal" ) ).toBe( 2 );
		expect( countSyllableFunction( "guyana" ) ).toBe( 3 );
		expect( countSyllableFunction( "wyandot" ) ).toBe( 3 );
		expect( countSyllableFunction( "prayer" ) ).toBe( 2 );
		expect( countSyllableFunction( "foyer" ) ).toBe( 2 );
		expect( countSyllableFunction( "buyer" ) ).toBe( 2 );
		expect( countSyllableFunction( "saying" ) ).toBe( 2 );
		expect( countSyllableFunction( "obeying" ) ).toBe( 3 );
		expect( countSyllableFunction( "tiyin" ) ).toBe( 2 );
		expect( countSyllableFunction( "boyish" ) ).toBe( 2 );
		expect( countSyllableFunction( "buying" ) ).toBe( 2 );
		expect( countSyllableFunction( "layout" ) ).toBe( 2 );
		expect( countSyllableFunction( "beyond" ) ).toBe( 2 );
		expect( countSyllableFunction( "coyotes" ) ).toBe( 3 );
		expect( countSyllableFunction( "buyout" ) ).toBe( 2 );
		expect( countSyllableFunction( "wyoming" ) ).toBe( 3 );
		expect( countSyllableFunction( "ayurvedic" ) ).toBe( 4 );
		expect( countSyllableFunction( "oyu" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^ao]ire[ds]", function () {
		expect( countSyllableFunction( "tires" ) ).toBe( 2 );
		expect( countSyllableFunction( "tired" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^ao]ire$", function () {
		expect( countSyllableFunction( "tire" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable eoa", function () {
		expect( countSyllableFunction( "paleoanthropology" ) ).toBe( 8 );
	} );

	it( "returns the number of syllables of words containing the add syllable eoo", function () {
		expect( countSyllableFunction( "neoorthodoxy" ) ).toBe( 6 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioa", function () {
		expect( countSyllableFunction( "radioactive" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioe", function () {
		expect( countSyllableFunction( "bioethics" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ioo", function () {
		expect( countSyllableFunction( "bioorganic" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables in an exclusion word", function () {
		expect( countSyllableFunction( "shoreline" ) ).toBe( 2 );
		expect( countSyllableFunction( "business" ) ).toBe( 2 );
	} );
} );

describe( "a syllable counter for Dutch text strings", function () {
	it( "returns the number of syllables of words containing the subtract syllable ue$", function () {
		expect( countSyllableFunction( "cue", "nl_NL" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable dge+$", function () {
		expect( countSyllableFunction( "bridge", "nl_NL" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [tcp]iënt", function () {
		expect( countSyllableFunction( "patiënt", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "recipiënt", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "efficiënt", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable ace$", function () {
		expect( countSyllableFunction( "interface", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [br]each", function () {
		expect( countSyllableFunction( "beachboy", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "reachtruck", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [ainpr]tiaal", function () {
		expect( countSyllableFunction( "spatiaal", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "initiaal", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "potentiaal", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "nuptiaal", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "martiaal", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [io]tiaan$", function () {
		expect( countSyllableFunction( "Mauritiaan", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "Laotiaan", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable gua[yc]", function () {
		expect( countSyllableFunction( "Paraguayaan", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "guacamole", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^i]deal", function () {
		expect( countSyllableFunction( "autodealer", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable tive$", function () {
		expect( countSyllableFunction( "detective", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable load", function () {
		expect( countSyllableFunction( "download", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^e]coke", function () {
		expect( countSyllableFunction( "parelcokes", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the subtract syllable [^s]core$", function () {
		expect( countSyllableFunction( "hardcore", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable aä", function () {
		expect( countSyllableFunction( "Kanaäniet", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable aeu", function () {
		expect( countSyllableFunction( "linnaeusklokje", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable aie", function () {
		expect( countSyllableFunction( "aaien", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ao", function () {
		expect( countSyllableFunction( "aorta", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ë", function () {
		expect( countSyllableFunction( "Indiër", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable eo", function () {
		expect( countSyllableFunction( "deodorant", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable eú", function () {
		expect( countSyllableFunction( "seúfeest", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ieau", function () {
		expect( countSyllableFunction( "politieauto", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ea$", function () {
		expect( countSyllableFunction( "alinea", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ea[^u]", function () {
		expect( countSyllableFunction( "Koreaan", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "bureau", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable ei[ej]", function () {
		expect( countSyllableFunction( "bemoeien", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "geijkt", "nl_NL" ) ).toBe( 2 );
	} );
	it( "returns the number of syllables of words containing the add syllable eu[iu]", function () {
		expect( countSyllableFunction( "geuit", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "geboorteuur", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable ï", function () {
		expect( countSyllableFunction( "atheïst", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable iei", function () {
		expect( countSyllableFunction( "persieing", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable ienne", function () {
		expect( countSyllableFunction( "julienne", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]ieu[^w]", function () {
		expect( countSyllableFunction( "copieus", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "milieubeheer", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "nieuw", "nl_NL" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^l]ieu$", function () {
		expect( countSyllableFunction( "camaieu", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "milieu", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable i[auiy]", function () {
		expect( countSyllableFunction( "Keniaan", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "atrium", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "eiig", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "riyal", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable stion", function () {
		expect( countSyllableFunction( "bastion", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^cstx]io", function () {
		expect( countSyllableFunction( "zionisme", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "aficionado", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "pensioen", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "station", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "annexionisme", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable ^sion", function () {
		expect( countSyllableFunction( "Sion", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "fusion", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable riè", function () {
		expect( countSyllableFunction( "carrière", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words containing the add syllable oö", function () {
		expect( countSyllableFunction( "coördinatie", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables of words containing the add syllable oa", function () {
		expect( countSyllableFunction( "arboarts", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oeing", function () {
		expect( countSyllableFunction( "boeing", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable oeyo", function () {
		expect( countSyllableFunction( "foeyonghai", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable oie", function () {
		expect( countSyllableFunction( "dooien", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [eu]ü", function () {
		expect( countSyllableFunction( "reünie", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "vacuüm", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words containing the add syllable [^q]u[aeèo]", function () {
		expect( countSyllableFunction( "duaal", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "actueel", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "suède", "nl_NL" ) ).toBe( 3 );
		expect( countSyllableFunction( "duo", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "qua", "nl_NL" ) ).toBe( 1 );
		expect( countSyllableFunction( "bouquet", "nl_NL" ) ).toBe( 2 );
		expect( countSyllableFunction( "quorn", "nl_NL" ) ).toBe( 1 );
	} );

	it( "returns the number of syllables of words containing the add syllable uie", function () {
		expect( countSyllableFunction( "buien", "nl_NL" ) ).toBe( 2 );
	} );

	it( "returns the number of syllables of words containing the add syllable [bhnpr]ieel", function () {
		expect( countSyllableFunction( "microbieel", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "parochieel", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "ceremonieel", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "principieel", "nl_NL" ) ).toBe( 4 );
		expect( countSyllableFunction( "prieel", "nl_NL" ) ).toBe( 2 );
	} );


	it( "returns the number of syllables of words containing the add syllable [bhnpr]iël", function () {
		expect( countSyllableFunction( "microbiële", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "parochiële", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "ceremoniële", "nl_NL" ) ).toBe( 6 );
		expect( countSyllableFunction( "principiële", "nl_NL" ) ).toBe( 5 );
		expect( countSyllableFunction( "notariële", "nl_NL" ) ).toBe( 5 );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function () {
		var testCases = {
			"keynoter": 3,
			"keynote": 2,
			"keynotes": 2,
			"kite": 1,
			"kiter": 2,
			"breakdance": 2,
			"breakdancer": 3,
			"race": 1,
			"racer": 2,
		};

		testCountSyllables( testCases, "nl_NL" );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function () {
		expect( countSyllableFunction( "bye hallo verjaardagscake superbarbecuetang hightea computerupgrades invoice", "nl_NL" ) ).toBe( 22 );
	} );
	it( "returns the number of syllables for a sentence with diacritics words", function () {
		expect( countSyllableFunction( "hé café", "nl_NL" ) ).toBe( 3 );
	} );
	it( "returns the number of syllables for a sentence with add and substract syllables", function () {
		expect( countSyllableFunction( "face bastion", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function () {
		var testCases = {
			"fleece": 1,
			"fleecedeken": 3,
			"image": 2,
			"images": 3,
			"imagecontract": 4,
			"pluimage": 3,
			"style": 1,
			"styleboek": 2,
			"stylen": 2,
			"douche": 1,
			"douches": 2,
			"office": 2,
			"officer": 3,
		};

		testCountSyllables( testCases, "nl_NL" );
	} );

	it( "returns the number of syllables for a sentence with exclusions", function () {
		var testCases = {
			"bye": 1,
			"dei": 2,
			"lone": 1,
		};

		testCountSyllables( testCases, "nl_NL" );
	} );

	it( "returns the number of syllables for a sentence with one-syllable words", function () {
		expect( countSyllableFunction( "dit is een huis", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables for two sentences containing one- and multiple-syllable words", function () {
		var testCases = {
			"dit": 1,
			"zijn": 1,
			"twee": 1,
			"zinnen": 2,
			"die": 1,
			"ook": 1,
			"langere": 3,
			"woorden": 2,
			"bevatten": 3,
			"eens": 1,
			"kijken": 2,
			"of": 1,
			"dat": 1,
			"werkt": 1,
		};

		testCountSyllables( testCases, "nl_NL" );
	} );

	it( "returns the number of syllables of words containing diacritics", function () {
		expect( countSyllableFunction( "café, ayó", "nl_NL" ) ).toBe( 4 );
	} );

	it( "returns the number of syllables of words from the exclusion word list", function () {
		expect( countSyllableFunction( "airline, fauteuil, lyceum, vibe", "nl_NL" ) ).toBe( 8 );
	} );

	it( "returns the number of syllables of words containing words from the exclusion word list at the beginning", function () {
		expect( countSyllableFunction( "airlineticket, fauteuilleer, muzieklyceum, zomervibe", "nl_NL" ) ).toBe( 15 );
	} );

	it( "returns the number of syllables of words containing words from the exclusion word list at the end", function () {
		expect( countSyllableFunction( "budgetairline, clubfauteuil, lyceumleerling, vibeje", "nl_NL" ) ).toBe( 14 );
	} );

	it( "returns the number of syllables of words affected by the substractSyllables regex and containing diacritics", function () {
		expect( countSyllableFunction( "patiënt, recipiënt, deficiënt", "nl_NL" ) ).toBe( 8 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function () {
		expect( countSyllableFunction( "voetbalteam, soap, teaktafel", "nl_NL" ) ).toBe( 7 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function () {
		expect( countSyllableFunction( "teaktafel", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of words affected by the exclusionCompound regex", function () {
		expect( countSyllableFunction( "voetbalteam", "nl_NL" ) ).toBe( 3 );
	} );

	it( "returns the number of syllables of a word that should not be affected by the exclusionCompound regex", function () {
		expect( countSyllableFunction( "gemeenteambtenaar, ", "nl_NL" ) ).toBe( 6 );
	} );

	it( "works for german", function() {
		expect( countSyllableFunction( "jupe", "de_DE" ) ).toBe( 1 );
	});

} );
