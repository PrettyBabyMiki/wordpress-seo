var AssessmentResult = require( "../values/AssessmentResult.js" );

var getSentences = require( "../stringProcessing/getSentences.js" );

/**
 * Calculates the score based on the given deviation.
 *
 * @param {number} standardDeviation The deviation to calculate the score for.
 * @returns {number} The calculated score.
 */
var calculateScore = function( standardDeviation ) {
	return 3 + Math.max( Math.min( ( 6 ) * ( standardDeviation - 2.33 ), 6 ), 0 );
};

/**
 * Get the result based on the score. When score is 7 or more, the result is good. Below 7 should be improved.
 *
 * @param {number} standardDeviation The deviation to calculate the score for.
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text: *}} The calculated result.
 */
var getStandardDeviationResult = function( standardDeviation, i18n ) {
	var score = calculateScore( standardDeviation );
	var recommendedMinimumDeviation = 3;
	var sentenceVariationURL = "<a href='https://yoa.st/mix-it-up' target='_blank'>";
	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
				// Translators: %1$s expands to a link on yoast.com, %2$s expands to the calculated score,
				// %3$d expands to the anchor end tag, %4$s expands to the recommended minimum score.
					"The %1$ssentence length variation%2$s score is %3$s, " +
					"which is more than or equal to the recommended minimum of %4$d. " +
					"The text contains a nice combination of long and short sentences."
				 ), sentenceVariationURL, "</a>", standardDeviation, recommendedMinimumDeviation
			)
		};
	}

	return {
		score: score,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",
				// Translators: %1$s expands to a link on yoast.com, %2$s expands to the calculated score,
				// %3$d expands to the anchor end tag, %4$s expands to the recommended minimum score.
				"The %1$ssentence length variation%2$s score is %3$s, " +
				"which is less than the recommended minimum of %4$d. " +
				"Try to alternate more between long and short sentences."
			), sentenceVariationURL, "</a>", standardDeviation, recommendedMinimumDeviation
		)
	};
};

/**
 * Runs the sentenceVariation research and checks scores based on calculated deviation.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSentenceVariation = function( paper, researcher, i18n ) {
	var standardDeviation = researcher.getResearch( "sentenceVariation" );

	var numberOfSentences = getSentences( paper.getText() ).length;
	var assessmentResult = new AssessmentResult();

	if ( numberOfSentences <= 1 ) {
		return assessmentResult;
	}

	var sentenceDeviationResult =  getStandardDeviationResult( standardDeviation, i18n );

	assessmentResult.setScore( sentenceDeviationResult.score );
	assessmentResult.setText( sentenceDeviationResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "textSentenceLengthVariation",
	getResult: getSentenceVariation,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};

