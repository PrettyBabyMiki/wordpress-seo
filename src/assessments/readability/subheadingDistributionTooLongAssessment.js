const AssessmentResult = require( "../../values/AssessmentResult.js" );
const Assessment = require( "../../assessment.js" );
const isTextTooLong = require( "../../helpers/isValueTooLong" );
const getSubheadings = require( "../../stringProcessing/getSubheadings.js" ).getSubheadings;
const getWords = require( "../../stringProcessing/getWords.js" );
const filter = require( "lodash/filter" );
const map = require( "lodash/map" );
const merge = require( "lodash/merge" );

const Mark = require( "../../values/Mark.js" );
const marker = require( "../../markers/addMark.js" );
const inRange = require( "../../helpers/inRange.js" ).inRangeEndInclusive;

/**
 * Represents the assessment for calculating the text after each subheading.
 */
class SubheadingsDistributionTooLong extends Assessment {
	/**
	 * Sets the identifier and the config.
	 *
	 * @param {object} config The configuration to use.
	 * @returns {void}
	 */
	constructor( config = {} ) {
		super();

		let defaultConfig = {
			parameters: {
				// The maximum recommended value of the subheading text.
				recommendedMaximumWordCount: 300,
				slightlyTooMany: 300,
				farTooMany: 350,
			},
			url: "<a href='https://yoa.st/headings' target='_blank'>",
			goodShortTextNoSubheadings: {
				score: 9,
				resultText: "You are not using any %1$ssubheadings%2$s, but your text is short enough and probably doesn't need them.",
				resultTextPlural: "",
				requiresMaxAndNum: false,
			},
			goodSubheadings: {
				score: 9,
				resultText: "Great job with using %1$ssubheadings%2$s!",
				resultTextPlural: "",
				requiresMaxAndNum: false,
			},
			okSubheadings: {
				score: 6,
				resultText: "%1$d section of your text is longer than %2$d words and is not separated by any subheadings. " +
				"Add %3$ssubheadings%4$s to improve readability.",
				// The text of the result for feedback, in case it is different for plural.
				resultTextPlural: "%1$d sections of your text are longer than %2$d words and are not separated by any subheadings. " +
				"Add %3$ssubheadings%4$s to improve readability.",
				requiresMaxAndNum: true,
			},
			badSubheadings: {
				score: 3,
				resultText: "%1$d section of your text is longer than %2$d words and is not separated by any subheadings. " +
				"Add %3$ssubheadings%4$s to improve readability.",
				// The text of the result for feedback, in case it is different for plural.
				resultTextPlural: "%1$d sections of your text are longer than %2$d words and are not separated by any subheadings. " +
				"Add %3$ssubheadings%4$s to improve readability.",
				requiresMaxAndNum: true,
			},
			badLongTextNoSubheadings: {
				score: 2,
				resultText: "You are not using any subheadings, although your text is rather long. " +
				"Try and add  some %1$ssubheadings%2$s.",
				resultTextPlural: "",
				requiresMaxAndNum: false,
			},
		};

		this.identifier = "subheadingsTooLong";
		this._config = merge( defaultConfig, config );
	}

	/**
	 * Runs the getSubheadingTextLength research and checks scores based on length.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 * @param {Researcher} researcher The researcher used for calling research.
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {AssessmentResult} The assessment result.
	 */
	getResult( paper, researcher, i18n ) {
		this._subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );

		this._subheadingTextsLength = this._subheadingTextsLength.sort( function( a, b ) {
			return b.wordCount - a.wordCount;
		} );

		this._tooLongTexts = this.getTooLongSubheadingTexts();
		this._tooLongTextsNumber = this.getTooLongSubheadingTexts().length;

		let assessmentResult = new AssessmentResult();
		assessmentResult.setIdentifier( this.identifier );

		if ( this.isApplicable( paper ) ) {
			this._hasSubheadings = this.hasSubheadings( paper );

			this._textLength = getWords( paper.getText() ).length;

			const calculatedResult = this.calculateResult();
			assessmentResult.setScore( calculatedResult.score );
			assessmentResult.setText( this.translateScore( calculatedResult.resultText, calculatedResult.resultTextPlural,
				calculatedResult.requiresMaxAndNum, i18n ) );

			if ( calculatedResult.score > 2 && calculatedResult.score < 7 ) {
				assessmentResult.setHasMarks( true );
				assessmentResult.setMarker( this.getMarks() );
			}
		}
		return assessmentResult;
	}

	/**
	 * Checks whether the paper has text.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is text.
	 */
	isApplicable( paper ) {
		return paper.hasText();
	}

	/**
	 * Checks whether the paper has subheadings.
	 *
	 * @param {Paper} paper The paper to use for the assessment.
	 *
	 * @returns {boolean} True when there is at least one subheading.
	 */
	hasSubheadings( paper ) {
		const subheadings = getSubheadings( paper.getText() );
		return subheadings.length > 0;
	}

	/**
	 * Creates a marker for each text following a subheading that is too long.
	 * @returns {Array} All markers for the current text.
	 */
	getMarks() {
		return map( this._tooLongTexts, function( tooLongText ) {
			const marked = marker( tooLongText.text );
			return new Mark( {
				original: tooLongText.text,
				marked: marked,
			} );
		} );
	}

	/**
	 * Counts the number of subheading texts that are too long.
	 *
	 * @returns {number} The number of subheading texts that are too long.
	 */
	getTooLongSubheadingTexts() {
		return filter( this._subheadingTextsLength, function( subheading ) {
			return isTextTooLong( this._config.parameters.recommendedMaximumWordCount, subheading.wordCount );
		}.bind( this ) );
	}

	/**
	 * Calculates the result based on the subheading texts length.
	 *
	 * @returns {Object} The calculated result.
	 */
	calculateResult() {
		if ( this._textLength > 300 ) {
			if ( this._hasSubheadings ) {
				const longestSubheadingTextLength = this._subheadingTextsLength[ 0 ].wordCount;
				if ( longestSubheadingTextLength <= this._config.parameters.slightlyTooMany ) {
					// Green indicator.
					return this._config.goodSubheadings;
				}
				if ( inRange( longestSubheadingTextLength, this._config.parameters.slightlyTooMany, this._config.parameters.farTooMany ) ) {
					// Orange indicator.
					return this._config.okSubheadings;
				}
				// Red indicator.
				return this._config.badSubheadings;
			}
			// Red indicator, use '2' so we can differentiate in external analysis.
			return this._config.badLongTextNoSubheadings;
		}
		if ( this._hasSubheadings ) {
			// Green indicator.
			return this._config.goodSubheadings;
		}
		// Green indicator.
		return this._config.goodShortTextNoSubheadings;
	}

	/**
	 * Translates the score to a message the user can understand.
	 *
	 * @param {string} resultText The resultText of the calculated result.
	 * @param {string} resultTextPlural The resultText of the calculated result specifically for the plural form of subheadings.
	 * @param {boolean} requiresMaxAndNum Whether the feedback will show the maximum recommended value and Whether the feedback
	 *                                      will depend on a singular or plural number of too long paragraphs.
	 * @param {Object} i18n The object used for translations.
	 *
	 * @returns {string} A string.
	 */
	translateScore( resultText, resultTextPlural, requiresMaxAndNum, i18n ) {
		if ( requiresMaxAndNum ) {
			return i18n.sprintf(
				i18n.dngettext( "js-text-analysis",
				/*
				 * Translators: %1$d expands to the number of subheadings, %2$d expands to the recommended number
				 * of words following a subheading, %3$s expands to a link to https://yoa.st/headings,
				 * %4$s expands to the link closing tag.
				 */
				resultText, resultTextPlural, this._tooLongTextsNumber ),
				this._tooLongTextsNumber, this._config.parameters.recommendedMaximumWordCount, this._config.url, "</a>" );
		}
		return i18n.sprintf(
			i18n.dgettext( "js-text-analysis",
			// Translators: %1$s expands to a link to https://yoa.st/headings, %2$s expands to the link closing tag.
			resultText ),
			this._config.url, "</a>" );
	}
}

module.exports = SubheadingsDistributionTooLong;

/*
var SubheadingsDistributionTooLong = function (_Assessment) {
	_inherits(SubheadingsDistributionTooLong, _Assessment);


	function SubheadingsDistributionTooLong() {
		var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		_classCallCheck(this, SubheadingsDistributionTooLong);

		var _this = _possibleConstructorReturn(this, (SubheadingsDistributionTooLong.__proto__ ||
		Object.getPrototypeOf(SubheadingsDistributionTooLong)).call(this));

		var defaultConfig = {
			parameters: {
				// The maximum recommended value of the subheading text.
				recommendedMaximumWordCount: 300,
				slightlyTooMany: 300,
				farTooMany: 350
			},
			url: "<a href='https://yoa.st/headings' target='_blank'>",
			goodShortTextNoSubheadings: {
				score: 9,
				resultText: "You are not using any %1$ssubheadings%2$s, but your text is short enough and probably doesn't need them.",
				resultTextPlural: "",
				requiresMaxAndNum: false
			},
			goodSubheadings: {
				score: 9,
				resultText: "Great job with using %1$ssubheadings%2$s!",
				resultTextPlural: "",
				requiresMaxAndNum: false
			},
			okSubheadings: {
				score: 6,
				resultText: "%1$d section of your text is longer than %2$d words and is not separated by any subheadings. " +
				 "Add %3$ssubheadings%4$s to improve readability.",
				// The text of the result for feedback, in case it is different for plural.
				resultTextPlural: "%1$d sections of your text are longer than %2$d words and are not separated by any subheadings. " +
				 "Add %3$ssubheadings%4$s to improve readability.",
				requiresMaxAndNum: true
			},
			badSubheadings: {
				score: 3,
				resultText: "%1$d section of your text is longer than %2$d words and is not separated by any subheadings. " +
				 "Add %3$ssubheadings%4$s to improve readability.",
				// The text of the result for feedback, in case it is different for plural.
				resultTextPlural: "%1$d sections of your text are longer than %2$d words and are not separated by any subheadings. " +
				 "Add %3$ssubheadings%4$s to improve readability.",
				requiresMaxAndNum: true
			},
			badLongTextNoSubheadings: {
				score: 2,
				resultText: "You are not using any subheadings, although your text is rather long. " +
				 "Try and add  some %1$ssubheadings%2$s.",
				resultTextPlural: "",
				requiresMaxAndNum: false
			}
		};
		_this.identifier = "subheadingsTooLong";
		_this._config = merge(defaultConfig, config);
		return _this;

	_createClass(SubheadingsDistributionTooLong, [{
		key: "getResult",
		value: function getResult(paper, researcher, i18n) {
			this._subheadingTextsLength = researcher.getResearch("getSubheadingTextLengths");
			this._subheadingTextsLength = this._subheadingTextsLength.sort(function (a, b) {
				return b.wordCount - a.wordCount;
			});
			this._tooLongTexts = this.getTooLongSubheadingTexts();
			this._tooLongTextsNumber = this.getTooLongSubheadingTexts().length;
			var assessmentResult = new AssessmentResult();
			assessmentResult.setIdentifier(this.identifier);
			if (this.isApplicable(paper)) {
				this._hasSubheadings = this.hasSubheadings(paper);
				this._textLength = getWords(paper.getText()).length;
				var calculatedResult = this.calculateResult();
				assessmentResult.setScore(calculatedResult.score);
				assessmentResult.setText(this.translateScore(calculatedResult.resultText, calculatedResult.resultTextPlural,
				calculatedResult.requiresMaxAndNum, i18n));
				if (calculatedResult.score > 2 && calculatedResult.score < 7) {
					assessmentResult.setHasMarks(true);
					assessmentResult.setMarker(this.getMarks());
				}
			}
			return assessmentResult;
		}

	}, {
		key: "isApplicable",
		value: function isApplicable(paper) {
			return paper.hasText();
		}


	}, {
		key: "hasSubheadings",
		value: function hasSubheadings(paper) {
			var subheadings = getSubheadings(paper.getText());
			return subheadings.length > 0;
		}


	}, {
		key: "getMarks",
		value: function getMarks() {
			return map(this._tooLongTexts, function (tooLongText) {
				var marked = marker(tooLongText.text);
				return new Mark({
					original: tooLongText.text,
					marked: marked
				});
			});
		}

	}, {
		key: "getTooLongSubheadingTexts",
		value: function getTooLongSubheadingTexts() {
			return filter(this._subheadingTextsLength, function (subheading) {
				return isTextTooLong(this._config.parameters.recommendedMaximumWordCount, subheading.wordCount);
			}.bind(this));
		}


	}, {
		key: "calculateResult",
		value: function calculateResult() {
			if (this._textLength > 300) {
				if (this._hasSubheadings) {
					var longestSubheadingTextLength = this._subheadingTextsLength[0].wordCount;
					if (longestSubheadingTextLength <= this._config.parameters.slightlyTooMany) {
						// Green indicator.
						return this._config.goodSubheadings;
					}
					if (inRange(longestSubheadingTextLength, this._config.parameters.slightlyTooMany, this._config.parameters.farTooMany)) {
						// Orange indicator.
						return this._config.okSubheadings;
					}
					// Red indicator.
					return this._config.badSubheadings;
				}
				// Red indicator, use '2' so we can differentiate in external analysis.
				return this._config.badLongTextNoSubheadings;
			}
			if (this._hasSubheadings) {
				// Green indicator.
				return this._config.goodSubheadings;
			}
			// Green indicator.
			return this._config.goodShortTextNoSubheadings;
		}


	}, {
		key: "translateScore",
		value: function translateScore(resultText, resultTextPlural, requiresMaxAndNum, i18n) {
			if (requiresMaxAndNum) {
				return i18n.sprintf(i18n.dngettext("js-text-analysis",
					resultText, resultTextPlural, this._tooLongTextsNumber), this._tooLongTextsNumber,
					this._config.parameters.recommendedMaximumWordCount, this._config.url, "</a>");
			}
			return i18n.sprintf(i18n.dgettext("js-text-analysis",
				resultText), this._config.url, "</a>");
		}
	}]);

	return SubheadingsDistributionTooLong;
}(Assessment);

module.exports = SubheadingsDistributionTooLong;
*/
