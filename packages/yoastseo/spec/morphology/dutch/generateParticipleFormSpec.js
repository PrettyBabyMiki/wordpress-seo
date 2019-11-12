import { generateParticipleForm } from "../../../src/morphology/dutch/generateParticipleForm";
import getMorphologyData from "../../specHelpers/getMorphologyData";

const morphologyDataNL = getMorphologyData( "nl" ).nl;

describe( "Test for generating participle forms", () => {
	it( "generates a regular participle form for a stem ending in d or t", () => {
		expect( generateParticipleForm( morphologyDataNL.verbs, "grond" ) ).toEqual( "gegrond" );
	} );
	it( "generates a regular participle form for a stem ending in a diphthong and f", () => {
		expect( generateParticipleForm( morphologyDataNL.verbs, "fuif" ) ).toEqual( "gefuifd" );
	} );
	it( "generates a regular participle form for a stem ending in a voiceless consonant", () => {
		expect( generateParticipleForm( morphologyDataNL.verbs, "zwik" ) ).toEqual( "gezwikt" );
	} );
	it( "generates a regular participle form for a stem ending in a voiced consonant", () => {
		expect( generateParticipleForm( morphologyDataNL.verbs, "dreg" ) ).toEqual( "gedregd" );
	} );
	it( "generates a regular participle form for a stem with a separable prefix ending in a voiceless consonant", () => {
		expect( generateParticipleForm( morphologyDataNL.verbs, "bijtank" ) ).toEqual( "bijgetankt" );
	} );
	it( "generates a regular participle form for a stem with a separable prefix ending in a voiced consonant", () => {
		expect( generateParticipleForm( morphologyDataNL.verbs, "opkraam" ) ).toEqual( "opgekraamd" );
	} );
	it( "generates a regular participle form for a stem with an inseparable prefix ending that takes the -d suffix in the participle", () => {
		expect( generateParticipleForm( morphologyDataNL.verbs, "besnuffel" ) ).toEqual( "besnuffeld" );
	} );
	it( "generates a regular participle form for a stem with an inseparable prefix that is usually separable", () => {
		expect( generateParticipleForm( morphologyDataNL.verbs, "omring" ) ).toEqual( "omringd" );
	} );
	it( "returns null if the stem contains an inseparable prefix and takes the -t suffix in the participle", () => {
		expect( generateParticipleForm( morphologyDataNL.verbs, "herpak" ) ).toEqual( null );
	} );
} );
