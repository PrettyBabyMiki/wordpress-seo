import { inherits } from "util";
import { createAnchorOpeningTag } from "../../../helpers/shortlinker";

import IntroductionKeywordAssessment from "./../../assessments/seo/IntroductionKeywordAssessment";
import KeyphraseLengthAssessment from "./../../assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "./../../assessments/seo/KeywordDensityAssessment";
import MetaDescriptionKeywordAssessment from "./../../assessments/seo/MetaDescriptionKeywordAssessment";
import TitleKeywordAssessment from "./../../assessments/seo/TitleKeywordAssessment";
import UrlKeywordAssessment from "./../../assessments/seo/UrlKeywordAssessment";
import Assessor from "./../../assessor";
import MetaDescriptionLengthAssessment from "./../../assessments/seo/MetaDescriptionLengthAssessment";
import TextLengthAssessment from "./../../assessments/seo/TextLengthAssessment";
import PageTitleWidthAssessment from "./../../assessments/seo/PageTitleWidthAssessment";
import FunctionWordsInKeyphrase from "./../../assessments/seo/FunctionWordsInKeyphraseAssessment";
import SingleH1Assessment from "./../../assessments/seo/SingleH1Assessment";
import KeyphraseDistribution from "./../../assessments/seo/KeyphraseDistributionAssessment";

/**
 * Returns the text length assessment to use.
 *
 * @returns {TextLengthAssessment} The text length assessment (with collection page configuration) to use.
 */
export const getTextLengthAssessment = function() {
	// Export so it can be used in tests.
	return new TextLengthAssessment( {
		recommendedMinimum: 100,
		slightlyBelowMinimum: 80,
		belowMinimum: 50,
		veryFarBelowMinimum: 20,
		urlTitle: createAnchorOpeningTag( "https://yoa.st/34j" ),
		urlCallToAction: createAnchorOpeningTag( "https://yoa.st/34k" ),
		cornerstoneContent: true,
	} );
};

/**
 * Creates the Assessor used for collection pages.
 *
 * @param {object} i18n         The i18n object used for translations.
 * @param {object} researcher   The researcher used for the analysis.
 * @param {Object} options      The options for this assessor.
 * @constructor
 */
const CollectionCornerstoneSEOAssessor = function( i18n, researcher, options ) {
	Assessor.call( this, i18n, researcher, options );
	this.type = "CollectionCornerstoneSEOAssessor";

	this._assessments = [
		new IntroductionKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		new MetaDescriptionKeywordAssessment(
			{ parameters: { recommendedMinimum: 1 },
				scores: { good: 9, bad: 3 },
			}
		),
		new MetaDescriptionLengthAssessment(),
		getTextLengthAssessment(),
		new TitleKeywordAssessment(
			{
				parameters: {
					recommendedPosition: 0,
				},
				scores: {
					good: 9,
					bad: 2,
				},
				urlTitle: createAnchorOpeningTag( "https://yoa.st/33g" ),
				urlCallToAction: createAnchorOpeningTag( "https://yoa.st/33h" ),
			}
		),
		new PageTitleWidthAssessment(),
		new UrlKeywordAssessment(),
		new FunctionWordsInKeyphrase(),
		new SingleH1Assessment(),
		new KeyphraseDistribution(),
	];
};

inherits( CollectionCornerstoneSEOAssessor, Assessor );

export default CollectionCornerstoneSEOAssessor;
