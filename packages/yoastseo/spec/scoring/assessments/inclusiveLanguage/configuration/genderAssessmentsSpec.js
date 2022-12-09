import Paper from "../../../../../src/values/Paper";
import Mark from "../../../../../src/values/Mark";
import InclusiveLanguageAssessment from "../../../../../src/scoring/assessments/inclusiveLanguage/InclusiveLanguageAssessment";
import assessments from "../../../../../src/scoring/assessments/inclusiveLanguage/configuration/genderAssessments";
import Factory from "../../../../specHelpers/factory.js";
import { testMultipleForms } from "../testHelpers/testHelpers";

describe( "Gender assessments", function() {
	it( "should target non-inclusive phrases", function() {
		const mockPaper = new Paper( "Mankind is so great! I could talk for hours about it." );
		const mockResearcher = Factory.buildMockResearcher( [ "Mankind is so great!", "I could talk for hours about it." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "mankind" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>mankind</i> as it is exclusionary. Consider using an alternative, such as " +
			"<i>individuals, people, persons, human beings, humanity</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "Mankind is so great!",
			marked: "<yoastmark class='yoast-text-mark'>Mankind is so great!</yoastmark>",
		} ) ] );
	} );

	it( "should target potentially non-inclusive phrases", function() {
		const mockPaper = new Paper( "Look at those firemen! They're putting out the fire." );
		const mockResearcher = Factory.buildMockResearcher( [ "Look at those firemen!", "They're putting out the fire." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firemen" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual(
			"Be careful when using <i>firemen</i> as it can be exclusionary. " +
			"Unless you are sure that the group you refer to only consists of men, use an alternative, such as <i>firefighters</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "Look at those firemen!",
			marked: "<yoastmark class='yoast-text-mark'>Look at those firemen!</yoastmark>",
		} ) ] );
	} );

	it( "should not target other phrases", function() {
		const mockPaper = new Paper( "Look at those firefighters! They're putting out the fire." );
		const mockResearcher = Factory.buildMockResearcher( [ "Look at those firefighters!", "They're putting out the fire." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "firemen" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
		expect( assessor.getMarks() ).toEqual( [] );
	} );

	it( "should return proper feedback without an alternative given", function() {
		const mockPaper = new Paper( "She's acting like a shemale." );
		const mockResearcher = Factory.buildMockResearcher( [ "She's acting like a shemale." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "shemale" )  );

		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>shemale</i> as it is derogatory. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "She's acting like a shemale.",
			marked: "<yoastmark class='yoast-text-mark'>She's acting like a shemale.</yoastmark>",
		} ) ] );
	} );

	it( "correctly identifies 'the transgender' which is only recognized when followed by participle or simple past tense", () => {
		const mockPaper = new Paper( "the transgender worked, the better they are." );
		const mockResearcher = Factory.buildMockResearcher( [ "The transgender worked, the better they are." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "aTransgender" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the transgender</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>transgender person</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The transgender worked, the better they are.",
			marked: "<yoastmark class='yoast-text-mark'>The transgender worked, the better they are.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'the transgender', which is only recognized when followed by a function word", () => {
		const mockPaper = new Paper( "The transgender however, did not go to the zoo." );
		const mockResearcher = Factory.buildMockResearcher( [ "The transgender however, did not go to the zoo." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "aTransgender" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the transgender</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>transgender person</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "The transgender however, did not go to the zoo.",
			marked: "<yoastmark class='yoast-text-mark'>The transgender however, did not go to the zoo.</yoastmark>",
		} ) ] );
	} );
	it( "correctly identifies 'the transgender', which is only recognized when followed by a punctuation mark", () => {
		const mockPaper = new Paper( "I have always loved the transgender!" );
		const mockResearcher = Factory.buildMockResearcher( [ "I have always loved the transgender!" ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "aTransgender" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );
		const assessmentResult = assessor.getResult();

		expect( isApplicable ).toBeTruthy();
		expect( assessmentResult.getScore() ).toEqual( 3 );
		expect( assessmentResult.getText() ).toEqual(
			"Avoid using <i>the transgender</i> as it is potentially harmful. " +
			"Consider using an alternative, such as <i>transgender person</i>. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>" );
		expect( assessmentResult.hasMarks() ).toBeTruthy();
		expect( assessor.getMarks() ).toEqual( [ new Mark( {
			original: "I have always loved the transgender!",
			marked: "<yoastmark class='yoast-text-mark'>I have always loved the transgender!</yoastmark>",
		} ) ] );
	} );
	it( "does not identify 'the transgender' when not followed by punctuation, function word or participle", () => {
		const mockPaper = new Paper( "The transgender person walks on the street." );
		const mockResearcher = Factory.buildMockResearcher( [ "The transgender person walks on the street." ] );
		const assessor = new InclusiveLanguageAssessment( assessments.find( obj => obj.identifier === "aTransgender" ) );
		const isApplicable = assessor.isApplicable( mockPaper, mockResearcher );

		expect( isApplicable ).toBeFalsy();
	} );
} );

describe( "a test for targeting non-inclusive phrases in gender assessments", () => {
	it( "should return the appropriate score and feedback string for: 'hermaphrodite' and its plural form", () => {
		const identifiers = [ "hermaphrodite", "hermaphrodites" ];
		const texts = [
			"That person there is a hermaphrodite",
			"Those group of people are all hermaphrodites",
		];
		const feedbacks = [
			"Avoid using <i>hermaphrodite</i> as it is potentially harmful. Consider using an alternative, such as <i>intersex</i>." +
			" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
			"Avoid using <i>hermaphrodites</i> as it is potentially harmful. Consider using an alternative, such as <i>intersex people</i>." +
			" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 3 );
	} );
	it( "should return the appropriate score and feedback string for: 'husband and wife' and its plural form", () => {
		// The different forms of "husband and wife" is one entry under the same identifier.
		const identifiers = [ "husbandAndWife", "husbandAndWife" ];
		const texts = [
			"The officiant pronounces them husband and wife", "The officiant pronounces them husbands and wives",
		];
		const feedbacks = [
			"Be careful when using <i>husband and wife</i> as it is potentially exclusionary. Consider using an alternative, " +
			"such as <i>spouses, partners</i>, unless referring to someone who explicitly wants to be referred to with this term." +
			" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
			"Be careful when using <i>husbands and wives</i> as it is potentially exclusionary. Consider using an alternative, " +
			"such as <i>spouses, partners</i>, unless referring to someone who explicitly wants to be referred to with this term." +
			" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 6 );
	} );
	it( "should return the appropriate score and feedback string for: 'transsexual' and its plural form", () => {
		const identifiers = [ "transsexual", "transsexuals" ];
		const texts = [
			"The term transsexual is a subset of transgender.",
			"As of 2018, use of the noun form (e.g. referring to people as transsexuals) is often deprecated by those in the transsexual community.",
		];
		const feedbacks = [
			"Be careful when using <i>transsexual</i> as it is potentially harmful. Consider using an alternative, such as <i>transgender</i>, " +
			"unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
			"Be careful when using <i>transsexuals</i> as it is potentially harmful. Consider using an alternative, such as <i>trans people, " +
			"transgender people</i>, unless referring to someone who explicitly wants to be referred to with this term." +
			" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 6 );
	} );
	it( "should return the appropriate score and feedback string for: 'transwoman' and its plural form", () => {
		const identifiers = [ "transWoman", "transWomen" ];
		const texts = [
			"A transwoman is a woman who was assigned male at birth.",
			"Transwomen have a female gender identity, may experience gender dysphoria, and may transition.",
		];
		const feedbacks = [
			"Be careful when using <i>transwoman</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>trans woman, transgender woman</i>, unless referring to someone who explicitly wants to be referred to with this term." +
			" <a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
			"Be careful when using <i>transwomen</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>trans women, transgender women</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 6 );
	} );
	it( "should return the appropriate score and feedback string for: 'transman' and its plural form", () => {
		const identifiers = [ "transMan", "transMen" ];
		const texts = [
			"A transman is a man who was assigned female at birth.",
			"Originally, the term transmen referred specifically to female-to-male transsexual people who underwent " +
			"hormone replacement therapy (HRT) or sex reassignment surgery (SRS), or both.",
		];
		const feedbacks = [
			"Be careful when using <i>transman</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>trans man, transgender man</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
			"Be careful when using <i>transmen</i> as it is potentially harmful. Consider using an alternative, such as " +
			"<i>trans men, transgender men</i>, unless referring to someone who explicitly wants to be referred to with this term. " +
			"<a href='https://yoa.st/inclusive-language-gender' target='_blank'>Learn more.</a>",
		];

		testMultipleForms( assessments, texts, identifiers, feedbacks, 6 );
	} );
} );
