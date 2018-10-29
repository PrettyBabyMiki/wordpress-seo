import ItalianParticiple from "../../../../src/researches/italian/passiveVoice/ItalianParticiple.js";
import checkException from "../../../../src/researches/passiveVoice/periphrastic/checkException.js";

describe( "A test for checking the Italian participle", function() {
	it( "checks the properties of the Italian participle object with a passive", function() {
		var mockParticiple = new ItalianParticiple( "scritto", "Il libro è stato scritto dal mio amico.", {
			auxiliaries: [ "stato" ],
			type: "irregular",
			language: "it",
		} );
		expect( mockParticiple.getParticiple() ).toBe( "scritto" );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( true );
	} );

	it( "checks the properties of the Italian participle object with a direct precedence exception", function() {
		// Direct precedence exception word: il.
		const mockParticiple = new ItalianParticiple( "mandato", "Dovresti andare a vedere se esiste il mandato.", {
			auxiliaries: [ "andare" ],
			type: "irregular",
			language: "it",
		} );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle, "it" ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle, "it" ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the Italian participle object with a precedence exception", function() {
		// Direct precedence exception word: il.
		const mockParticiple = new ItalianParticiple( "mandato", "Dovresti andare a vedere se esiste il mandato.", {
			auxiliaries: [ "andare" ],
			type: "irregular",
			language: "it",
		} );
		expect( mockParticiple.directPrecedenceException( mockParticiple._sentencePart, mockParticiple._participle, "it" ) ).toBe( true );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle, "it" ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "checks the properties of the Italian participle object with a precedence exception", function() {
		// Direct precedence exception word: il.
		const mockParticiple = new ItalianParticiple( "mandato", "Dovresti andare a vedere se esiste il mandato.", {
			auxiliaries: [ "andare" ],
			type: "irregular",
			language: "it",
		} );
		expect( mockParticiple.precedenceException( mockParticiple._sentencePart, mockParticiple._participle, "it" ) ).toBe( true );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );

	it( "ensures that the sentence part is not set to passive if the participle is empty.", function() {
		const mockParticiple = new ItalianParticiple( "scritto", "è stato scritto dal mio amico.", {
			auxiliaries: [ "stato" ],
			type: "irregular",
			language: "it",
		} );
		mockParticiple._participle = null;
		checkException.call( mockParticiple );
		expect( mockParticiple.determinesSentencePartIsPassive() ).toBe( false );
	} );
} );
