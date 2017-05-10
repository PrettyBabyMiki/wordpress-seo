let AssessmentResult = require( "../../values/AssessmentResult.js" );
let Assessment = require( "../../assessment.js" );
let merge = require( "lodash/merge" );

let defaultConfig = {
	scoreWhenNoResults: 6,
};

/**
 * Represents the URL keyword assessments. This assessments will check if the URL is present in the url.
 */
class UrlKeywordAssessment extends Assessment {

	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 *
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		this.identifier = "urlKeyword";
		this._config = merge( config, defaultConfig );
	}

	/**
	 * Executes the Assessment and return a result.
	 *
	 * @param {Paper} paper The Paper object to assess.
	 * @param {Researcher} researcher The Researcher object containing all available researches.
	 * @param {object} i18n The locale object.
	 *
	 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
	 */
	getResult( paper, researcher, i18n ) {
		let totalKeywords = researcher.getResearch( "keywordCountInUrl" );

		let assessmentResult = new AssessmentResult();
		assessmentResult.setScore( this.calculateScore( totalKeywords ) );
		assessmentResult.setText( this.translateScore( totalKeywords, i18n ) );

		return assessmentResult;
	}

	/**
	 * Is this assessment applicable?
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is a keyword and an url.
	 */
	isApplicable( paper ) {
		return paper.hasKeyword() && paper.hasUrl();
	}

	/**
	 * Calculates the score based on whether or not there's a keyword in the url.
	 *
	 * @param {number} totalKeywords The amount of keywords to be checked against.
	 *
	 * @returns {number} The calculated score.
	 */
	calculateScore( totalKeywords ) {
		if ( totalKeywords === 0 ) {
			return this._config.scoreWhenNoResults;
		}

		return 9;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {number} totalKeywords The amount of keywords to be checked against.
	 * @param {object} i18n The object used for translations.
	 *
	 * @returns {string} The translated string.
	 */
	translateScore( totalKeywords, i18n ) {
		if ( totalKeywords === 0 ) {
			return i18n.dgettext( "js-text-analysis", "The focus keyword does not appear in the URL for this page. " +
				"If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!" );
		}

		return i18n.dgettext( "js-text-analysis", "The focus keyword appears in the URL for this page." );
	}

}

module.exports = UrlKeywordAssessment;
