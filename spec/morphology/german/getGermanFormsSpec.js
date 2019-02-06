import { getForms } from "../../../src/morphology/german/getForms";
import { de as morphologyDataDE } from "../../../premium-configuration/data/morphologyData.json";

describe( "Test for creating forms for German words", () => {
	it( "creates forms with regular suffixes for words that aren't included on any exception list", () => {
		expect( getForms( "studenten", morphologyDataDE ) ).toEqual( {
			forms: [
				// Noun suffixes
				"studenten",
				"studente",
				"studentens",
				"studenter",
				"studentern",
				"studenters",
				"studentes",
				"students",
				// Adjective suffixes
				"studentem",
				"studentere",
				"studenterem",
				"studenteren",
				"studenterer",
				"studenteres",
				"studenteste",
				"studentestem",
				"studentesten",
				"studentester",
				"studentestes",
				"student" ],
			stem: "student",
		} );
	} );

	it( "creates forms for words that don't get get an -s noun suffix (but all other regular suffixes)", () => {
		expect( getForms( "maß", morphologyDataDE ) ).toEqual( {
			forms: [
				"maß",
				"maße",
				"maßen",
				"maßens",
				"maßer",
				"maßern",
				"maßers",
				"maßes",
				// Adjective suffixes
				"maßem",
				"maßere",
				"maßerem",
				"maßeren",
				"maßerer",
				"maßeres",
				"maßste",
				"maßstem",
				"maßsten",
				"maßster",
				"maßstes",
			],
			stem: "maß",
		} );
	} );

	it( "creates forms for words which get -n and -ns noun suffixes in addition to all regular noun suffixes", () => {
		expect( getForms( "winkel", morphologyDataDE ) ).toEqual( {
			forms: [
				// Regular noun suffixes
				"winkel",
				"winkele",
				"winkelen",
				"winkelens",
				"winkeler",
				"winkelern",
				"winkelers",
				"winkeles",
				"winkels",
				// Added noun suffixes
				"winkeln",
				"winkelns",
				// Adjective suffixes
				"winkelem",
				"winkelere",
				"winkelerem",
				"winkeleren",
				"winkelerer",
				"winkeleres",
				"winkelste",
				"winkelstem",
				"winkelsten",
				"winkelster",
				"winkelstes",
			],
			stem: "winkel",
		} );
	} );

	it( "creates forms for words which get the suffix -nen in addition to all other regular noun suffixes", () => {
		expect( getForms( "ärztin", morphologyDataDE ) ).toEqual( {
			forms: [
				// Regular noun suffixes
				"ärztin",
				"ärztine",
				"ärztinen",
				"ärztinens",
				"ärztiner",
				"ärztinern",
				"ärztiners",
				"ärztines",
				"ärztins",
				// Additional noun suffixes
				"ärztinnen",
				// Adjective suffixes
				"ärztinem",
				"ärztinere",
				"ärztinerem",
				"ärztineren",
				"ärztinerer",
				"ärztineres",
				"ärztinste",
				"ärztinstem",
				"ärztinsten",
				"ärztinster",
				"ärztinstes",
			],
			stem: "ärztin",
		} );
	} );

	it( "removes -e noun endings and adds -n/-ns noun endings for words ending in -e", () => {
		expect( getForms( "tee", morphologyDataDE ) ).toEqual( {
			forms: [
				"tee",
				"tees",
				// Irregular noun suffixes
				"teen",
				"teens",
				// Adjective suffixes
				"teee",
				"teeem",
				"teeen",
				"teeer",
				"teees",
				"teer",
				"teere",
				"teerem",
				"teeren",
				"teerer",
				"teeres",
				"teeste",
				"teestem",
				"teesten",
				"teester",
				"teestes",
			],
			stem: "tee",
		} );
	} );

	it( "adds a form where -n is removed for nouns with a stem ending in -inn", () => {
		expect( getForms( "ärztinnen", morphologyDataDE ) ).toEqual( {
			forms: [
				// Regular noun suffixes.
				"ärztinnen",
				"ärztinne",
				"ärztinnens",
				"ärztinner",
				"ärztinnern",
				"ärztinners",
				"ärztinnes",
				"ärztinns",
				// Adjective suffixes.
				"ärztinnem",
				"ärztinnere",
				"ärztinnerem",
				"ärztinneren",
				"ärztinnerer",
				"ärztinneres",
				"ärztinnste",
				"ärztinnstem",
				"ärztinnsten",
				"ärztinnster",
				"ärztinnstes",
				// Stem
				"ärztinn",
				// Additional noun suffix.
				"ärztin",

			],
			stem: "ärztinn",
		} );
	} );
} );
