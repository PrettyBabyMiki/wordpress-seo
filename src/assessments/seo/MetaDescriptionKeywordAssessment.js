import { merge } from "lodash-es";

import Assessment from "../../assessment";
import AssessmentResult from "../../values/AssessmentResult";

/**
 * Assessment for checking the keyword matches in the meta description.
 */
class MetaDescriptionKeywordAssessment extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {Object} [config] The configuration to use.
	 * @param {number} [config.parameters.recommendedMinimum] The recommended minimum of keyword occurrences in the meta description.
	 * @param {number} [config.scores.good] The score to return if there are enough keyword occurrences in the meta description.
	 * @param {number} [config.scores.bad] The score to return if there aren't enough keyword occurrences in the meta description.
	 * @param {string} [config.url] The URL to the relevant article on Yoast.com.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		const defaultConfig = {
			parameters: {
				recommendedMinimum: 1,
			},
			scores: {
				good: 9,
				ok: 6,
				bad: 3,
			},
			url: "<a href='https://yoa.st/33l' target='_blank'>",
		};

		this.identifier = "metaDescriptionKeyword";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the metaDescriptionKeyword researcher and based on this, returns an assessment result with score.
	 *
	 * @param {Paper}      paper      The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Jed}        i18n       The object used for translations.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		this._keywordMatches = researcher.getResearch( "metaDescriptionKeyword" );
		const assessmentResult = new AssessmentResult();
		const calculatedResult = this.calculateResult( i18n );

		assessmentResult.setScore( calculatedResult.score );
		assessmentResult.setText( calculatedResult.resultText );

		return assessmentResult;
	}

	/**
	 * Returns the result object based on the number of keyword matches in the meta description.
	 *
	 * @param {Jed} i18n The object used for translations.
	 *
	 * @returns {Object} Result object with score and text.
	 */
	calculateResult( i18n ) {
		const nrOfSentencesWithAllKeywords = this._keywordMatches.perSentence
			.filter( percentageKeywordsMatched => percentageKeywordsMatched === 100 )
			.length;
		// GOOD result when one or two sentences contain every keyword term at least once.
		if ( nrOfSentencesWithAllKeywords >= 1 && nrOfSentencesWithAllKeywords <= 2 ) {
			return {
				score: this._config.scores.good,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"Key phrase in meta description: Focus key phrase or synonym %1$sappear in the meta description%2$s. Well done!",
					),
					this._config.url,
					"</a>"
				),
			};
		}

		// BAD if the description contains every keyword term more than twice.
		if ( nrOfSentencesWithAllKeywords >= 3 ) {
			return {
				score: this._config.scores.bad,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag,
					   %3$s expands to the number of sentences containing the key phrase.
					*/
					i18n.dngettext(
						"js-text-analysis",
						"Key phrase in meta description: The meta description %1$scontains the focus keyword%2$s %3$s times, " +
						"which is over the advised maximum of 2 times. Limit that!",
					),
					this._config.url,
					"</a>",
					nrOfSentencesWithAllKeywords
				),
			};
		}

		// OK result when the full description contains every keyword term at least once.
		if ( this._keywordMatches.fullDescription === 100 ) {
			return {
				score: this._config.scores.ok,
				resultText: i18n.sprintf(
					/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
					i18n.dngettext(
						"js-text-analysis",
						"Key phrase in meta description: All words of focus key phrase or synonym " +
						"%1$sappear in the meta description%2$s, but not within one sentence. " +
						"Try to use them in one sentence."
					),
					this._config.url,
					"</a>"
				),
			};
		}

		// BAD if the key phrases is not contained in the meta description.
		return {
			score: this._config.scores.bad,
			resultText: i18n.sprintf(
				/* Translators: %1$s expands to a link on yoast.com, %2$s expands to the anchor end tag. */
				i18n.dgettext(
					"js-text-analysis",
					"Key phrase in meta description: The meta description has been specified, " +
					"but it %1$sdoes not contain the focus key phrase%2$s. Fix that!"
				),
				this._config.url,
				"</a>"
			),
		};
	}

	/**
	 * Checks whether the paper has a keyword and a meta description.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True if the paper has a keyword and a meta description.
	 */
	isApplicable( paper ) {
		return paper.hasKeyword() && paper.hasDescription();
	}
}

export default MetaDescriptionKeywordAssessment;
