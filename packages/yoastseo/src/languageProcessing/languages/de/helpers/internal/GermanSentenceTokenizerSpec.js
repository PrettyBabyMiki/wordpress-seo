import GermanSentenceTokenizer from "../../../../../../src/languageProcessing/languages/de/helpers/internal/SentenceTokenizer";


const sentenceTokenizer = new GermanSentenceTokenizer();

describe( "Test German extension to sentence tokenizer", () =>{
	it( "Correctly tokenizes a sentence with a german ordinal.", () =>{
		const tokens = [
			{ type: "sentence", src: "In den 66" },
			{ type: "full-stop", src: "." },
			{ type: "sentence", src: " Club der Stadt wird nachts getanzt" },
			{ type: "full-stop", src: "." },

		];
		expect( sentenceTokenizer.getSentencesFromTokens( tokens ) ).toBe( "In den 66. Club der Stadt wird nachts getanzt." );
	} );
} );
