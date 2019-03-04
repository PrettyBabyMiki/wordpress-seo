import { generateNounExceptionForms } from "../../../src/morphology/german/generateNounExceptionForms";
import getMorphologyData from "../../specHelpers/getMorphologyData";


const morphologyDataDE = getMorphologyData( "de" ).de;

describe( "Test for checking adjective exceptions in German", () => {
	it( "creates forms for a singular word with a stem that changes to an umlaut", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "stadt" ) ).toEqual( [
			"stadt",
			"städte",
			"städten",
		] );
	} );

	it( "creates forms for a plural word with a stem that changes to an umlaut", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "städt" ) ).toEqual( [
			"stadt",
			"städte",
			"städten",
		] );
	} );

	it( "creates forms for a compound word a stem that changes to an umlaut", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "hauptstadt" ) ).toEqual( [
			"hauptstadt",
			"hauptstädte",
			"hauptstädten",
		] );
	} );

	it( "creates forms for a singular word with a stem with s-reduplication", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "fokus" ) ).toEqual( [
			"fokus",
			"fokusse",
			"fokussen",
		] );
	} );

	it( "creates forms for a plural word with a stem with s-reduplication", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "fokuss" ) ).toEqual( [
			"fokus",
			"fokusse",
			"fokussen",
		] );
	} );

	it( "creates forms for a compound word with a stem with s-reduplication", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "autofokus" ) ).toEqual( [
			"autofokus",
			"autofokusse",
			"autofokussen",
		] );
	} );

	it( "creates forms for a singular word that ends in -um in the singular", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "antidepressivum" ) ).toEqual( [
			"antidepressivum",
			"antidepressivums",
			"antidepressiva",
		] );
	} );

	it( "creates forms for a plural word that ends in -um in the singular", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "antidepressiva" ) ).toEqual( [
			"antidepressivum",
			"antidepressivums",
			"antidepressiva",
		] );
	} );

	it( "creates forms for a singular word that ends in -us in the singular (without s-reduplication)", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "euphemismus" ) ).toEqual( [
			"euphemismus",
			"euphemismen",
		] );
	} );

	it( "creates forms for a plural word that ends in -us in the singular (without s-reduplication)", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "euphemism" ) ).toEqual( [
			"euphemismus",
			"euphemismen",
		] );
	} );

	it( "creates forms for a singular word that ends in -on in the singular", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "lexikon" ) ).toEqual( [
			"lexikon",
			"lexikons",
			"lexika",
			"lexiken",
		] );
	} );

	it( "creates forms for a plural word that ends in -on in the singular", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "lexika" ) ).toEqual( [
			"lexikon",
			"lexikons",
			"lexika",
			"lexiken",
		] );
	} );

	it( "creates forms for a singular word that ends in -a in the singular", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "dogma" ) ).toEqual( [
			"dogma",
			"dogmas",
			"dogmen",
			"dogmata",
		] );
	} );

	it( "creates forms for a plural word that ends in -a in the singular", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "dogmata" ) ).toEqual( [
			"dogma",
			"dogmas",
			"dogmen",
			"dogmata",
		] );
	} );

	it( "creates forms for a singular word that ends in -o in the singular", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "cello" ) ).toEqual( [
			"cello",
			"cellos",
			"celli",
		] );
	} );

	it( "creates forms for a plural word that ends in -o in the singular", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "celli" ) ).toEqual( [
			"cello",
			"cellos",
			"celli",
		] );
	} );

	it( "creates forms for a singular word that ends in -x in the singular", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "sphinx" ) ).toEqual( [
			"sphinx",
			"sphinxe",
			"sphinxen",
			"sphingen",
		] );
	} );

	it( "creates forms for a plural word that ends in -x in the singular", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "sphing" ) ).toEqual( [
			"sphinx",
			"sphinxe",
			"sphinxen",
			"sphingen",
		] );
	} );

	it( "creates forms for a singular word with a -ien plural", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "mineral" ) ).toEqual( [
			"mineral",
			"minerals",
			"minerale",
			"mineralen",
			"mineralien",
		] );
	} );

	it( "creates forms for a plural ord with a -ien plural", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "minerali" ) ).toEqual( [
			"mineral",
			"minerals",
			"minerale",
			"mineralen",
			"mineralien",
		] );
	} );

	it( "creates forms for a singular word with an irregular plural pattern", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "kibbuz" ) ).toEqual( [
			"kibbuz",
			"kibbuzim",
			"kibbuze",
		] );
	} );

	it( "creates forms for a plural word with an irregular plural pattern", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "kibbuzim" ) ).toEqual( [
			"kibbuz",
			"kibbuzim",
			"kibbuze",
		] );
	} );

	it( "creates forms for a singular word with an ambiguous plural", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "stadium" ) ).toEqual( [
			"stadium",
			"stadiums",
			"stadien",
		] );
	} );

	it( "creates forms for a plural word with an ambiguous plural", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "stadi" ) ).toEqual( [
			"stadion",
			"stadions",
			"stadium",
			"stadiums",
			"stadien",
		] );
	} );

	it( "only creates the correct forms for inkubus and doens't add the forms for kubus", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "inkubus" ) ).toEqual( [
			"inkubus",
			"inkuben",
		] );
	} );


	it( "creates forms for a singular noun that only gets an -en suffix", () => {
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "warnung" ) ).toEqual( [
			"warnungen",
			"warnung",
		] );
	} );

	it( "makes sure that an exception to the -en suffix rule skips that rule and returns no exceptoins", () => {
		// "Sprung" is an exception to the general -ung rule.
		expect( generateNounExceptionForms( morphologyDataDE.nouns, "hochsprung" ) ).toEqual( [] );
	} );
} );
