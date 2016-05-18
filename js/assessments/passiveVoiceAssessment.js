var AssessmentResult = require( "../values/AssessmentResult.js" );
var fixFloatingPoint = require( "../helpers/fixFloatingPoint.js" );

/**
 * Calculates the result based on the number of sentences and passives.
 * @param {object} passiveVoice The object containing the number of sentences and passives
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text}} resultobject with score and text.
 */
var calculatePassiveVoiceResult = function( passiveVoice, i18n ) {
	var percentage = ( passiveVoice.passives / passiveVoice.total ) * 100;
	percentage = fixFloatingPoint( percentage );
	var recommendedValue = 10;

	// 6 is the number of scorepoints between 3, minscore and 9, maxscore. For scoring we use 10 steps, each step is 0.6
	// Up to 6.7% passive sentences scores a 9, higher percentages give lower scores.
	// FloatingPointFix because of js rounding errors
	var score = 9 - Math.max( Math.min( ( 0.6 ) * ( percentage - 6.7 ), 6 ), 0 );
	score = fixFloatingPoint( score );
	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
					i18n.dgettext(
						"js-text-analysis",

						// Translators: %1$d expands to the number of sentences in passive voice.
						"%1$s of the sentences is written in the passive voice, which is within the recommended range." ),
					percentage + "%"
			)
		};
	}
	return {
		score: score,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",

				// Translators: %1$d expands to the number of sentences in passive voice, %2$d expands to the recommended value
				"%1$s of the sentences is written in the passive voice, which is more than the recommended maximum of %2$s. " +
				"Try to use their active counterparts."
			),
			percentage + "%",
			recommendedValue + "%"
		)
	};
};

/**
 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var paragraphLengthAssessment = function( paper, researcher, i18n ) {
	var passiveVoice = researcher.getResearch( "passiveVoice" );

	var passiveVoiceResult = calculatePassiveVoiceResult( passiveVoice, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( passiveVoiceResult.score );
	assessmentResult.setText( passiveVoiceResult.text );

	return assessmentResult;
};

module.exports = {
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	}
};
