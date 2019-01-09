import { inRange, merge } from "lodash-es";

import Assessment from "../../assessment";
import getLanguageAvailability from "../../helpers/getLanguageAvailability";
import { createAnchorOpeningTag } from "../../helpers/shortlinker";
import AssessmentResult from "../../values/AssessmentResult";

const availableLanguages = [ "en", "nl", "de", "it", "ru", "fr", "es" ];

/**
 * Assessment to check how readable the text is, based on the Flesch reading ease test.
 */
class FleschReadingEaseAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} config The configuration to use.
	 * @returns {void}
	 */
	constructor( config ) {
		super();

		const defaultConfig = {
			urlTitle: createAnchorOpeningTag( "https://yoa.st/34r" ),
			urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34s" ),
		};

		this.identifier = "fleschReadingEase";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * The assessment that runs the FleschReading on the paper.
	 *
	 * @param {Object} paper The paper to run this assessment on.
	 * @param {Object} researcher The researcher used for the assessment.
	 * @param {Object} i18n The i18n-object used for parsing translations.
	 *
	 * @returns {Object} An assessmentResult with the score and formatted text.
	 */
	getResult( paper, researcher, i18n ) {
		this.fleschReadingResult = researcher.getResearch( "calculateFleschReading" );
		if ( this.isApplicable( paper ) ) {
			const assessmentResult =  new AssessmentResult( i18n );
			const calculatedResult = this.calculateResult( i18n );
			assessmentResult.setScore( calculatedResult.score );
			assessmentResult.setText( calculatedResult.resultText );

			return assessmentResult;
		}
		return null;
	}

	/**
	 * Calculates the assessment result based on the fleschReadingScore.
	 *
	 * @param {Object} i18n The i18n-object used for parsing translations.
	 *
	 * @returns {Object} Object with score and resultText.
	 */
	calculateResult( i18n ) {
		// Results must be between 0 and 100;
		if ( this.fleschReadingResult < 0 ) {
			this.fleschReadingResult = 0;
		}

		if ( this.fleschReadingResult > 100 ) {
			this.fleschReadingResult = 100;
		}

		let score = 0;
		let feedback = "";
		let note = i18n.dgettext( "js-text-analysis", "Good job!" );

		if ( this.fleschReadingResult >= this._config.borders.veryEasy ) {
			score = this._config.scores.veryEasy;
			feedback = i18n.dgettext( "js-text-analysis", "very easy" );
		} else if ( inRange( this.fleschReadingResult, this._config.borders.easy, this._config.borders.veryEasy ) ) {
			score = this._config.scores.easy;
			feedback = i18n.dgettext( "js-text-analysis", "easy" );
		} else if ( inRange( this.fleschReadingResult, this._config.borders.fairlyEasy, this._config.borders.easy ) ) {
			score = this._config.scores.fairlyEasy;
			feedback = i18n.dgettext( "js-text-analysis", "fairly easy" );
		} else if ( inRange( this.fleschReadingResult, this._config.borders.okay, this._config.borders.fairlyEasy ) ) {
			score = this._config.scores.okay;
			feedback = i18n.dgettext( "js-text-analysis", "ok" );
		} else if ( inRange( this.fleschReadingResult, this._config.borders.fairlyDifficult, this._config.borders.okay ) ) {
			score = this._config.scores.fairlyDifficult;
			feedback = i18n.dgettext( "js-text-analysis", "fairly difficult" );
			note = i18n.dgettext( "js-text-analysis", "Try to make shorter sentences to improve readability" );
		} else if ( inRange( this.fleschReadingResult, this._config.borders.difficult, this._config.borders.fairlyDifficult ) ) {
			score = this._config.scores.difficult;
			feedback = i18n.dgettext( "js-text-analysis", "difficult" );
			note = i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability" );
		} else {
			score = this._config.scores.veryDifficult;
			feedback = i18n.dgettext( "js-text-analysis", "very difficult" );
			note = i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability" );
		}

		// If the score is good, add a "Good job" message without a link to the Call-to-action article.
		if ( score >= this._config.scores.okay ) {
			return {
				score: score,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com,
						%2$s to the anchor end tag,
						%3$s expands to the numeric Flesch reading ease score,
						%4$s to the easiness of reading,
						%5$s expands to a call to action based on the score */
					i18n.dgettext(
						"js-text-analysis",
						"%1$sFlesch Reading Ease%2$s: The copy scores %3$s in the test, which is considered %4$s to read. %5$s"
					),
					this._config.urlTitle,
					"</a>",
					this.fleschReadingResult,
					feedback,
					note,
				),
			};
		}
		// If the score is not good, add a Call-to-action message with a link to the Call-to-action article.
		return {
			score: score,
			resultText: i18n.sprintf(
				/* Translators: %1$s and %5$s expand to a link on yoast.com,
					%2$s to the anchor end tag,
					%7$s expands to the anchor end tag and a full stop,
					%3$s expands to the numeric Flesch reading ease score,
					%4$s to the easiness of reading,
					%6$s expands to a call to action based on the score */
				i18n.dgettext(
					"js-text-analysis",
					"%1$sFlesch Reading Ease%2$s: The copy scores %3$s in the test, which is considered %4$s to read. %5$s%6$s%7$s"
				),
				this._config.urlTitle,
				"</a>",
				this.fleschReadingResult,
				feedback,
				this._config.urlCallToAction,
				note,
				"</a>.",
			),
		};
	}

	/**
	 * Checks if Flesch reading analysis is available for the language of the paper.
	 *
	 * @param {Object} paper The paper to have the Flesch score to be calculated for.
	 * @returns {boolean} Returns true if the language is available and the paper is not empty.
	 */
	isApplicable( paper ) {
		const isLanguageAvailable = getLanguageAvailability( paper.getLocale(), availableLanguages );
		return ( isLanguageAvailable && paper.hasText() );
	}
}

export default FleschReadingEaseAssessment;
