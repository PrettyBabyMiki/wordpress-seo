import FleschReadingAssessment from "../../../../src/scoring/assessments/readability/fleschReadingEaseAssessment.js";
import Paper from "../../../../src/values/Paper.js";
import factory from "../../../specHelpers/factory.js";
const i18n = factory.buildJed();

import contentConfiguration from "../../../../src/config/_todo/content/combinedConfig.js";
import EnglishResearcher from "../../../../src/languageProcessing/languages/en/Researcher";
import DefaultResearcher from "../../../../src/languageProcessing/languages/_default/Researcher";

describe( "An assessment for the flesch reading", function() {
	it( "returns a 'very easy' score and the associated feedback text for a paper.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult(
			paper, factory.buildMockResearcher( 100.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 100 in the test, which is considered very easy to read. Good job!" );
	} );

	it( "returns a 'very easy' score and the associated feedback text for a paper when the score is exactly 90.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult(
			paper, factory.buildMockResearcher( 90.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 90 in the test, which is considered very easy to read. Good job!" );
	} );

	it( "returns an 'easy' score and the associated feedback text for a paper.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult(
			paper, factory.buildMockResearcher( 82.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 82 in the test, which is considered easy to read. Good job!" );
	} );

	it( "returns a 'fairly easy' score and the associated feedback text for a paper.", function() {
		const paper = new Paper( "A piece of text to calculate scores." );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult(
			paper, factory.buildMockResearcher( 78.9 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 78.9 in the test, which is considered fairly easy to read. Good job!" );
	} );

	it( "returns an 'ok' score and the associated feedback text for a paper.", function() {
		const paper = new Paper( "One question we get quite often in our website reviews is whether we can help people recover" +
			" from the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people" +
			" were actually in a bit of trouble" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult(
			paper, factory.buildMockResearcher( 63.9 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 63.9 in the test, which is considered ok to read. Good job!" );
	} );

	it( "returns an 'ok' score and the associated feedback text for a paper.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult(
			paper, factory.buildMockResearcher( 60.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: " +
			"The copy scores 60 in the test, which is considered ok to read. Good job!" );
	} );

	it( "returns a 'fairly difficult' score and the associated feedback text for a paper.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult(
			paper, factory.buildMockResearcher( 55.0 ), i18n );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: " +
			"The copy scores 55 in the test, which is considered fairly difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try" +
			" to make shorter sentences to improve readability</a>." );
	} );

	it( "returns a 'difficult' score for a paper with the score between 40 and 50, and the associated feedback text for a paper.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 45.0 ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 45 in the test, which is considered difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try" +
			" to make shorter sentences, using less difficult words to improve readability</a>." );
	} );

	it( "returns a 'difficult' score and the associated feedback text for a paper.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 36.6 ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 36.6 in the test, which is considered difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try" +
			" to make shorter sentences, using less difficult words to improve readability</a>." );
	} );

	it( "returns a 'very difficult' score and the associated feedback text for a paper.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 0 ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 0 in the test, which is considered very difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try" +
			" to make shorter sentences, using less difficult words to improve readability</a>." );
	} );

	it( "returns a 'very easy' score and the associated feedback text for a Russian paper.", function() {
		const paper = new Paper( "This is a very interesting paper", { locale: "ru_RU" } );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 100.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 100 in the test, which is considered very easy to read. Good job!" );
	} );

	it( "returns a 'very easy' score and the associated feedback text for a Russian paper.", function() {
		const paper = new Paper( "This is a very interesting paper", { locale: "ru_RU" }  );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 85 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 85 in the test, which is considered very easy to read. Good job!" );
	} );

	it( "returns an 'easy' score and the associated feedback text for a Russian paper.", function() {
		const paper = new Paper( "This is a very interesting paper", { locale: "ru_RU" }  );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 72.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 72 in the test, which is considered easy to read. Good job!" );
	} );

	it( "returns a 'fairly easy' score and the associated feedback text for a Russian paper.", function() {
		const paper = new Paper( "A piece of text to calculate scores.", { locale: "ru_RU" }  );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 68.9 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 68.9 in the test, which is considered fairly easy to read. Good job!" );
	} );

	it( "returns an 'ok' score and the associated feedback text for a Russian paper.", function() {
		const paper = new Paper( "One question we get quite often in our website reviews is whether we can help people recover from" +
			" the drop they noticed in their rankings or traffic. A lot of the times, this is a legitimate drop and people were actually" +
			" in a bit of trouble", { locale: "ru_RU" } );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 53.9 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 53.9 in the test, which is considered ok to read. Good job!" );
	} );

	it( "returns an 'ok' score and the associated feedback text for a Russian paper.", function() {
		const paper = new Paper( "This is a very interesting paper", { locale: "ru_RU" } );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 50.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 50 in the test, which is considered ok to read. Good job!" );
	} );

	it( "returns a 'fairly difficult' score and the associated feedback text for a Russian paper.", function() {
		const paper = new Paper( "This is a very interesting paper", { locale: "ru_RU" } );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 45.0 ), i18n );

		expect( result.getScore() ).toBe( 6 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 45 in the test, which is considered fairly difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try" +
			" to make shorter sentences to improve readability</a>." );
	} );

	it( "returns a 'difficult' score and the associated feedback text for a Russian paper.", function() {
		const paper = new Paper( "This is a very interesting paper", { locale: "ru_RU" } );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 35.0 ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>: The" +
			" copy scores 35 in the test, which is considered difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try" +
			" to make shorter sentences, using less difficult words to improve readability</a>." );
	} );

	it( "returns a 'difficult' score and the associated feedback text for a Russian paper.", function() {
		const paper = new Paper( "This is a very interesting paper", { locale: "ru_RU" } );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 26.6 ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 26.6 in the test, which is considered difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try" +
			" to make shorter sentences, using less difficult words to improve readability</a>." );
	} );

	it( "returns a 'very difficult' score and the associated feedback text for a Russian paper.", function() {
		const paper = new Paper( "This is a very interesting paper", { locale: "ru_RU" } );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 0 ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 0 in the test, which is considered very difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try" +
			" to make shorter sentences, using less difficult words to improve readability</a>." );
	} );

	it( "returns a feedback text containing '100' for a paper with a flesch score above 100.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 103.0 ), i18n );

		expect( result.getScore() ).toBe( 9 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 100 in the test, which is considered very easy to read. Good job!" );
	} );

	it( "returns a feedback text containing '0' for a paper with a flesch score under 0.", function() {
		const paper = new Paper( "This is a very interesting paper" );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( -3.0 ), i18n );

		expect( result.getScore() ).toBe( 3 );
		expect( result.getText() ).toBe( "<a href='https://yoa.st/34r' target='_blank'>Flesch Reading Ease</a>:" +
			" The copy scores 0 in the test, which is considered very difficult to read. <a href='https://yoa.st/34s' target='_blank'>Try" +
			" to make shorter sentences, using less difficult words to improve readability</a>." );
	} );

	it( "returns a null result for the assessment for an Afrikaans paper with text.", function() {
		const paper = new Paper( "Hierdie is 'n interessante papier.", { locale: "af_ZA" } );
		const result = new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading ).getResult( paper,
			factory.buildMockResearcher( 0 ), i18n );
		expect( result ).toBe( null );
	} );

	it( "returns true for isApplicable for an English paper with text.", function() {
		const paper = new Paper( "This is a very interesting paper.", { locale: "en_US" } );
		expect( new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading )
			.isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( true );
	} );

	it( "returns false for isApplicable for an Afrikaans paper with text.", function() {
		const paper = new Paper( "Hierdie is 'n interessante papier.", { locale: "af_ZA" } );
		expect( new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading )
			.isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an English paper without text.", function() {
		const paper = new Paper( "", { locale: "en_US" } );
		expect( new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading )
			.isApplicable( paper, new EnglishResearcher( paper ) ) ).toBe( false );
	} );

	it( "returns false for isApplicable for an Afrikaans paper without text.", function() {
		const paper = new Paper( "", { locale: "af_ZA" } );
		expect( new FleschReadingAssessment( contentConfiguration( paper.getLocale() ).fleschReading )
			.isApplicable( paper, new DefaultResearcher( paper ) ) ).toBe( false );
	} );
} );
