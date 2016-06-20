var Assessor = require( "./assessor.js" );

var fleschReadingEase = require( "./assessments/fleschReadingEaseAssessment.js" );
var paragraphTooLong = require( "./assessments/paragraphTooLongAssessment.js" );
var sentenceLengthInText = require( "./assessments/sentenceLengthInTextAssessment.js" );
var subheadingDistributionTooLong = require( "./assessments/subheadingDistributionTooLongAssessment.js" );
var transitionWords = require( "./assessments/transitionWordsAssessment.js" );
var passiveVoice = require( "./assessments/passiveVoiceAssessment.js" );
// var subHeadingLength = require( "./assessments/getSubheadingLengthAssessment.js" );
// var getSubheadingPresence = require( "./assessments/subheadingPresenceAssessment.js" );
// var sentenceVariation = require( "./assessments/sentenceVariationAssessment.js" );
// var sentenceBeginnings = require( "./assessments/sentenceBeginningsAssessment.js" );
// var wordComplexity = require( "./assessments/wordComplexityAssessment.js" );
// var subheadingDistributionTooShort = require( "./assessments/subheadingDistributionTooShortAssessment.js" );
// var paragraphTooShort = require( "./assessments/paragraphTooShortAssessment.js" );
// var sentenceLengthInDescription = require( "./assessments/sentenceLengthInDescriptionAssessment.js" );
var textPresence = require( "./assessments/textPresenceAssessment.js" );

var scoreToRating = require( "./interpreters/scoreToRating" );

var map = require( "lodash/map" );
var sum = require( "lodash/sum" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var ContentAssessor = function ( i18n, options ) {

	Assessor.call( this, i18n, options );

	this._assessments = [
		fleschReadingEase,
		subheadingDistributionTooLong,
		paragraphTooLong,
		sentenceLengthInText,
		transitionWords,
		passiveVoice,
		textPresence
		// sentenceVariation,
		// sentenceBeginnings,
		// wordComplexity,
		// subheadingDistributionTooShort,
		// paragraphTooShort
		// sentenceLengthInDescription,
	];
};

require( "util" ).inherits( ContentAssessor, Assessor );

/**
 * Calculates the weighted rating for English languages based on a given rating.
 *
 * @param {number} rating The rating to be weighted.
 * @returns {number} The weighted rating.
 */
ContentAssessor.prototype.calculateNegativePointsEnglish = function( rating ) {
	switch ( rating ) {
		case "bad":
			return 3;
		case "ok":
			return 2;
		default:
		case "good":
			return 0;
	}
};

/**
 * Calculates the weighted rating for non-English languages based on a given rating.
 *
 * @param {number} rating The rating to be weighted.
 * @returns {number} The weighted rating.
 */
ContentAssessor.prototype.calculateNegativePointsNonEnglish = function( rating ) {
	switch ( rating ) {
		case "bad":
			return 4;
		case "ok":
			return 2;
		default:
		case "good":
			return 0;
	}
};

/**
 * Calculates the negative points based on the assessment results.
 *
 * @returns {number} The total negative points for the results.
 */
ContentAssessor.prototype.calculatePenaltyPoints = function () {
	var results = this.getValidResults();
	var self = this;
	var negativePoints = map( results, function ( result ) {
		var rating = scoreToRating( result.getScore() );

		if ( self.getPaper().getLocale().indexOf( "en_" ) > -1 ) {
			return self.calculateNegativePointsEnglish( rating );
		}

		return self.calculateNegativePointsNonEnglish( rating );
	} );

	return sum( negativePoints );
};

/**
 * Rates the negative points
 *
 * @param {number} totalPenaltyPoints The amount of negative points.
 * @returns {number} The score based on the amount of negative points.
 *
 * @private
 */
ContentAssessor.prototype._ratePenaltyPoints = function ( totalPenaltyPoints ) {
	if ( this.getValidResults().length === 1 ) {
		// If we have only 1 result, we only have a "no content" result
		return 30;
	}

	if ( this.getPaper().getLocale().indexOf( "en_" ) > -1 ) {
		// Determine the total score based on the total negative points.
		if ( totalPenaltyPoints > 6 ) {
			// A red indicator.
			return 30;
		}

		if ( totalPenaltyPoints > 4 ) {
			// An orange indicator.
			return 60;
		}
	} else {
		if ( totalPenaltyPoints > 4 ) {
			// A red indicator.
			return 30;
		}

		if ( totalPenaltyPoints > 2 ) {
			// An orange indicator.
			return 60;
		}
	}
	// A green indicator.
	return 90;
};

/**
 * Calculates the overall score based on the assessment results.
 *
 * @returns {number} The overall score.
 */
ContentAssessor.prototype.calculateOverallScore = function () {
	var results = this.getValidResults();

	// If you have no content, you have a red indicator.
	if ( results.length === 0 ) {
		return 30;
	}

	var totalPenaltyPoints = this.calculatePenaltyPoints();

	return this._ratePenaltyPoints( totalPenaltyPoints );
};

module.exports = ContentAssessor;

