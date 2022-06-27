import wordComplexity from "../../../src/languageProcessing/researches/wordComplexity.js";
import Paper from "../../../src/values/Paper";
import Researcher from "../../../src/languageProcessing/languages/en/Researcher";

describe( "a test for getting the complex words in the sentence and calculating their percentage",  function() {
	it( "returns an array with the complex words from the text in English", function() {
		const paper = new Paper( "Also called torties for short, tortoiseshell cats combine two colors other than white, " +
			"either closely mixed or in larger patches." +
			" The colors are often described as red and black, but the \"red\" patches can instead be orange, yellow, or cream," +
			" and the \"black\" can instead be chocolate, gray, tabby, or blue. Tortoiseshell cats with the tabby pattern as one of their colors " +
			"are sometimes referred to as a torbie. Cats having torbie coats are sometimes referred to as torbie cats.\n" +
			"\"Tortoiseshell\" is typically reserved for particolored cats with relatively small or no white markings. " +
			"Those that are predominantly white with tortoiseshell patches are described as tricolor, tortoiseshell-and-white " +
			"(in the United Kingdom), or calico (in Canada and the United States).\n" +
			"Cats with tortoiseshell pattern and small blotches of white are sometimes referred to as \"tortico\" by their owners, " +
			"a portmanteau of \"tortie\" and \"calico\"\n" +
			"Torbie cats with a predominantly white undercoat are often referred to as \"caliby\" by their respective owners, " +
			"an amalgamation of Calico and Tabby." );

		const researcher = new Researcher( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [
			{
				complexWords: [ "torties", "tortoiseshell", "combine", "patches" ],
				sentence: "Also called torties for short, tortoiseshell cats combine two colors other than white, " +
					"either closely mixed or in larger patches.",
			},
			{
				complexWords: [ "patches" ],
				sentence: "The colors are often described as red and black, but the \"red\" patches can instead be orange, yellow, " +
					"or cream, and the \"black\" can instead be chocolate, gray, tabby, or blue.",
			},
			{
				complexWords: [ "torbie" ],
				sentence: "Tortoiseshell cats with the tabby pattern as one of their colors are sometimes referred to as a torbie.",
			},
			{
				complexWords: [ "torbie", "torbie" ],
				sentence: "Cats having torbie coats are sometimes referred to as torbie cats.",
			},
			{
				complexWords: [ "typically", "reserved", "particolored", "markings" ],
				sentence: "\"Tortoiseshell\" is typically reserved for particolored cats with relatively small or no white markings.",
			},
			{
				complexWords: [ "predominantly", "tortoiseshell", "patches", "tricolor", "tortoiseshell-and-white", "calico" ],
				sentence: "Those that are predominantly white with tortoiseshell patches are described as tricolor, " +
					"tortoiseshell-and-white (in the United Kingdom), or calico (in Canada and the United States).",
			},
			{
				complexWords: [ "tortoiseshell", "blotches", "tortico", "owners", "portmanteau", "tortie", "calico" ],
				sentence: "Cats with tortoiseshell pattern and small blotches of white are sometimes referred to as \"tortico\" " +
					"by their owners, a portmanteau of \"tortie\" and \"calico\"",
			},
			{
				complexWords: [ "predominantly", "undercoat", "caliby", "respective", "owners", "amalgamation" ],
				sentence: "Torbie cats with a predominantly white undercoat are often referred to as \"caliby\" by their respective owners," +
					" an amalgamation of Calico and Tabby.",
			},
		]
		);
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 18.67 );
	} );
	it( "should return an empty array and 0% if there is no complex word found in the text", () => {
		const paper = new Paper( "This is short text. This is another short text." );
		const researcher = new Researcher( paper );

		expect( wordComplexity( paper, researcher ).complexWords ).toEqual( [] );
		expect( wordComplexity( paper, researcher ).percentage ).toEqual( 0 );
	} );
} );
