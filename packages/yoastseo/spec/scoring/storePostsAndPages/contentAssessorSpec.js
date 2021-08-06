import EnglishResearcher from "../../../src/languageProcessing/languages/en/Researcher";
import DutchResearcher from "../../../src/languageProcessing/languages/nl/Researcher";
import DefaultResearcher from "../../../src/languageProcessing/languages/_default/Researcher";
import ContentAssessor from "../../../src/scoring/storePostsAndPages/contentAssessor.js";
import AssessmentResult from "../../../src/values/AssessmentResult.js";
import Factory from "../../specHelpers/factory.js";
import Paper from "../../../src/values/Paper.js";

import { forEach } from "lodash-es";

const i18n = Factory.buildJed();

describe( "A content assessor", function() {
	describe( "calculatePenaltyPoints", function() {
		let contentAssessor;
		let results;
		const paper = new Paper();
		beforeEach( function() {
			contentAssessor = new ContentAssessor( i18n, new EnglishResearcher( paper ) );
			contentAssessor.getValidResults = function() {
				return results;
			};
			contentAssessor.getPaper = function() {
				return paper;
			};
		} );

		it( "should have no points for an empty result set", function() {
			results = [];
			const expected = 0;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );

		it( "should return 0 for all green assessment results", function() {
			results = [
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 9 } ),
			];
			const expected = 0;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );

		it( "should return 3 for a red assessment result", function() {
			contentAssessor._allAssessmentsSupported = function() {
				return true;
			};

			results = [
				new AssessmentResult( { score: 3 } ),
			];
			const expected = 3;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );

		it( "should return 2 for an orange assessment result", function() {
			results = [
				new AssessmentResult( { score: 6 } ),
			];
			const expected = 2;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );

		it( "should return an aggregate for a mixed resultset", function() {
			contentAssessor._allAssessmentsSupported = function() {
				return true;
			};
			results = [
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 3 } ),
				new AssessmentResult( { score: 6 } ),
				new AssessmentResult( { score: 9 } ),
				new AssessmentResult( { text: "A piece of feedback" } ),
			];
			const expected = 6 + 6;

			const actual = contentAssessor.calculatePenaltyPoints();

			expect( actual ).toBe( expected );
		} );
	} );

	describe( "calculateOverallScore for English", function() {
		let points, results, contentAssessor;

		beforeEach( function() {
			contentAssessor = new ContentAssessor( i18n, new EnglishResearcher() );
			contentAssessor.getValidResults = function() {
				return results;
			};
			contentAssessor.calculatePenaltyPoints = function() {
				return points;
			};
			contentAssessor.getPaper = function() {
				return new Paper();
			};
		} );

		it( "should default to a bad indicator", function() {
			const expected = 30;
			results = [];

			const actual = contentAssessor.calculateOverallScore();

			expect( actual ).toBe( expected );
		} );

		it( "should give worse results based on the negative points", function() {
			results = [
				new AssessmentResult(),
				new AssessmentResult(),
			];
			const testCases = [
				{ points: 7, expected: 30 },
				{ points: 6, expected: 60 },
				{ points: 9, expected: 30 },
				{ points: 4, expected: 90 },
				{ points: 2, expected: 90 },
				{ points: 1.9, expected: 90 },
				{ points: 1, expected: 90 },
			];

			forEach( testCases, function( testCase ) {
				points = testCase.points;

				contentAssessor._allAssessmentsSupported = function() {
					return true;
				};

				const actual = contentAssessor.calculateOverallScore();

				expect( actual ).toBe( testCase.expected );
			} );
		} );
	} );

	describe( "calculateOverallScore for non English with a text containing more than 200 words", function() {
		let points, results, contentAssessor;

		const paper = new Paper( "Lorem ipsum dolor sit amet, voluptua probatus ullamcorper id vis, ceteros consetetur qui ea, " +
			"nam movet populo aliquam te. His eu debitis fastidii. Pri ea amet dicant. Ut his suas corpora, eu reformidans " +
			"signiferumque duo. At erant expetenda patrioque quo, rebum atqui nam ad, tempor elaboraret interpretaris pri ad. " +
			"Novum postea sea in. Placerat recteque cu usu. Cu nam sadipscing disputationi, sed labitur elaboraret et. Eu sed " +
			"accumsan prodesset. Posse integre et nec, usu assum audiam erroribus eu. Ei viris eirmod interesset usu, " +
			"usu homero liberavisse in, solet disputando ea vim. Mei eu inani nonumes consulatu, ea alterum menandri ius, " +
			"ne euismod neglegentur sed. Vis te deleniti suscipit, fabellas laboramus pri ei. Te quo aliquip offendit. " +
			"Vero paulo regione ei eum, sed at atqui meliore copiosae. Has et vocent vivendum. Mundi graeco latine cum ne, " +
			"no cum laoreet alienum. Quo cu vero utinam constituto. Vis omnium vivendum ea. Eum lorem ludus possim ut. Eu has eius " +
			"munere explicari, atqui ullamcorper eos no, harum epicuri per ut. Utamur volumus minimum ea vel, duo eu praesent " +
			"accommodare. Mutat gloriatur ex cum, rebum salutandi ei his, vis delenit quaestio ne. Iisque qualisque duo ei. " +
			"Splendide tincidunt te sit, commune oporteat quo id. Sumo recusabo suscipiantur duo an, no eum malis vulputate " +
			"consectetuer. Mel te noster invenire, nec ad vidisse constituto. Eos ut quod.", { locale: "nl_NL" } );

		beforeEach( function() {
			contentAssessor = new ContentAssessor( i18n, new DutchResearcher( paper ) );
			contentAssessor.getValidResults = function() {
				return results;
			};
			contentAssessor.calculatePenaltyPoints = function() {
				return points;
			};
			contentAssessor.getPaper = function() {
				return paper;
			};
		} );

		it( "should give worse results based on the negative points", function() {
			results = [
				new AssessmentResult(),
				new AssessmentResult(),
			];
			const testCases = [
				{ points: 6, expected: 30 },
				{ points: 4, expected: 60 },
				{ points: 3, expected: 60 },
				{ points: 2, expected: 90 },
			];

			forEach( testCases, function( testCase ) {
				points = testCase.points;

				const actual = contentAssessor.calculateOverallScore();

				expect( actual ).toBe( testCase.expected );
			} );
		} );
	} );

	describe( "calculateOverallScore for non English with an empty paper", function() {
		let points, results, contentAssessor;

		const paper = new Paper( "", { locale: "jv_ID" } );

		beforeEach( function() {
			contentAssessor = new ContentAssessor( i18n, new DefaultResearcher( paper ) );
			contentAssessor.getValidResults = function() {
				return results;
			};
			contentAssessor.calculatePenaltyPoints = function() {
				return points;
			};
			contentAssessor.getPaper = function() {
				return paper;
			};
		} );

		it( "should give worse results based on the negative points", function() {
			results = [
				new AssessmentResult(),
				new AssessmentResult(),
			];
			const testCases = [
				{ points: 6, expected: 30 },
				{ points: 4, expected: 60 },
				{ points: 3, expected: 60 },
				{ points: 2, expected: 90 },
			];

			forEach( testCases, function( testCase ) {
				points = testCase.points;

				const actual = contentAssessor.calculateOverallScore();

				expect( actual ).toBe( testCase.expected );
			} );
		} );
	} );

	describe( "Checks the applicable assessments", function() {
		it( "Should have 7 available assessments for a fully supported language", function() {
			const paper = new Paper( "Lorem ipsum dolor sit amet, voluptua probatus ullamcorper id vis, ceteros consetetur qui ea, " +
				"nam movet populo aliquam te. His eu debitis fastidii. Pri ea amet dicant. Ut his suas corpora, eu reformidans " +
				"signiferumque duo. At erant expetenda patrioque quo, rebum atqui nam ad, tempor elaboraret interpretaris pri ad. " +
				"Novum postea sea in. Placerat recteque cu usu. Cu nam sadipscing disputationi, sed labitur elaboraret et. Eu sed " +
				"accumsan prodesset. Posse integre et nec, usu assum audiam erroribus eu. Ei viris eirmod interesset usu, " +
				"usu homero liberavisse in, solet disputando ea vim. Mei eu inani nonumes consulatu, ea alterum menandri ius, " +
				"ne euismod neglegentur sed. Vis te deleniti suscipit, fabellas laboramus pri ei. Te quo aliquip offendit. " +
				"Vero paulo regione ei eum, sed at atqui meliore copiosae. Has et vocent vivendum. Mundi graeco latine cum ne, " +
				"no cum laoreet alienum. Quo cu vero utinam constituto. Vis omnium vivendum ea. Eum lorem ludus possim ut. Eu has eius " +
				"munere explicari, atqui ullamcorper eos no, harum epicuri per ut. Utamur volumus minimum ea vel, duo eu praesent " +
				"accommodare. Mutat gloriatur ex cum, rebum salutandi ei his, vis delenit quaestio ne. Iisque qualisque duo ei. " +
				"Splendide tincidunt te sit, commune oporteat quo id. Sumo recusabo suscipiantur duo an, no eum malis vulputate " +
				"consectetuer. Mel te noster invenire, nec ad vidisse constituto. Eos ut quod.", { locale: "en_US" } );
			const contentAssessor = new ContentAssessor( i18n, new EnglishResearcher( paper ) );

			contentAssessor.getPaper = function() {
				return paper;
			};
			const actual = contentAssessor.getApplicableAssessments().length;
			const expected = 7;
			expect( actual ).toBe( expected );
		} );

		it( "Should have 4 available assessments for a basic supported language", function() {
			const paper = new Paper( "test", { locale: "xx_XX" } );
			const contentAssessor = new ContentAssessor( i18n, new DefaultResearcher( paper ) );

			contentAssessor.getPaper = function() {
				return paper;
			};

			const actual = contentAssessor.getApplicableAssessments().length;
			const expected = 4;
			expect( actual ).toBe( expected );
		} );
	} );

	describe( "has configuration overrides", () => {
		let contentAssessor;
		let results;
		const paper = new Paper();
		beforeEach( function() {
			contentAssessor = new ContentAssessor( i18n, new EnglishResearcher( paper ) );
			contentAssessor.getValidResults = function() {
				return results;
			};
			contentAssessor.getPaper = function() {
				return paper;
			};
		} );

		test( "SubheadingsDistributionTooLong", () => {
			const assessment = contentAssessor.getAssessment( "subheadingsTooLong" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.shouldNotAppearInShortText ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify30' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify31' target='_blank'>" );
		} );

		test( "SentenceLengthAssessment", () => {
			const assessment = contentAssessor.getAssessment( "textSentenceLength" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify30' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify31' target='_blank'>" );
		} );

		test( "ParagraphTooLong", () => {
			const assessment = contentAssessor.getAssessment( "textParagraphTooLong" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify30' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify31' target='_blank'>" );
		} );

		test( "TransitionWords", () => {
			const assessment = contentAssessor.getAssessment( "textTransitionWords" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify44' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify45' target='_blank'>" );
		} );

		test( "PassiveVoice", () => {
			const assessment = contentAssessor.getAssessment( "passiveVoice" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify42' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify43' target='_blank'>" );
		} );

		test( "TextPresence", () => {
			const assessment = contentAssessor.getAssessment( "textPresence" );

			expect( assessment ).toBeDefined();
			expect( assessment._config ).toBeDefined();
			expect( assessment._config.urlTitle ).toBe( "<a href='https://yoa.st/shopify30' target='_blank'>" );
			expect( assessment._config.urlCallToAction ).toBe( "<a href='https://yoa.st/shopify31' target='_blank'>" );
		} );
	} );
} );
