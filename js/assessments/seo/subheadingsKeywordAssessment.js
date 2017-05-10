let AssessmentResult = require( "../../values/AssessmentResult.js" );
let Assessment = require( "../../assessment.js" );
let merge = require( "lodash/merge" );

let defaultConfig = {
	scores: {
		noMatches: 6,
		oneMatch: 9,
		hasMatches: 9,
	},
};

/**
 * Represents the assessment that checks if the keyword is present in one of the subheadings.
 */
class SubHeadingsKeywordAssessment extends Assessment {

	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		this.identifier = "subheadingsKeyword";
		this._config = merge( config, defaultConfig );
	}

	/**
	 * Runs the match keyword in subheadings module, based on this returns an assessment result with score.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {object} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		let subHeadings = researcher.getResearch( "matchKeywordInSubheadings" );
		let assessmentResult = new AssessmentResult();
		let score = this.calculateScore( subHeadings );

		assessmentResult.setScore( score );
		assessmentResult.setText( this.translateScore( score, subHeadings, i18n ) );

		return assessmentResult;
	}

	/**
	 * Is this assessment applicable?
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text and a keyword.
	 */
	isApplicable( paper ) {
		return paper.hasText() && paper.hasKeyword();
	}

	/**
	 * Returns the score for the subheadings.
	 *
	 * @param {object} subHeadings The object with all subHeadings matches.
	 *
	 * @returns {number|null} The calculated score.
	 */
	calculateScore( subHeadings ) {
		if ( subHeadings.matches === 0 ) {
			return this._config.scores.noMatches;
		}
		if ( subHeadings.matches === 1 ) {
			return this._config.scores.oneMatch;
		}

		if ( subHeadings.matches > 1 ) {
			return this._config.scores.hasMatches;
		}

		return null;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {number} score The score for this assessment.
	 * @param {object} subHeadings The object with all subHeadings matches.
	 * @param {object} i18n The object used for translations.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( score, subHeadings, i18n ) {
		if ( score === this._config.scores.hasMatches ) {
			return i18n.sprintf(
				i18n.dgettext( "js-text-analysis", "The focus keyword appears in %2$d (out of %1$d) subheadings in the copy. " +
					"While not a major ranking factor, this is beneficial." ), subHeadings.count, subHeadings.matches
			);
		}

		if ( score === this._config.scores.oneMatch ) {
			return i18n.sprintf(
				i18n.dgettext( "js-text-analysis", "The focus keyword appears in %2$d (out of %1$d) subheadings in the copy. " +
					"While not a major ranking factor, this is beneficial." ), subHeadings.count, subHeadings.matches
			);
		}

		if ( score === this._config.scores.noMatches ) {
			return i18n.dgettext(
				"js-text-analysis",
				"You have not used the focus keyword in any subheading (such as an H2) in your copy."
			);
		}

		return "";
	}

}

module.exports = SubHeadingsKeywordAssessment;
