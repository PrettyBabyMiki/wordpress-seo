import { inherits } from "util";

import * as Assessor from "../assessor";
import * as SEOAssessor from "../seoAssessor";
import IntroductionHasKeywordAssessment from "../assessments/seo/IntroductionHasKeywordAssessment";
import KeyphraseLengthAssessment from "../assessments/seo/KeyphraseLengthAssessment";
import KeywordDensityAssessment from "../assessments/seo/KeywordDensityAssessment";
import * as keywordStopWords from "../assessments/seo/keywordStopWordsAssessment";
import MetaDescriptionKeywordAssessment from "../assessments/seo/MetaDescriptionKeywordAssessment";
import * as MetaDescriptionLength from "../assessments/seo/metaDescriptionLengthAssessment";
import * as SubheadingsKeyword from "../assessments/seo/subheadingsKeywordAssessment";
import TextCompetingLinksAssessment from "../assessments/seo/TextCompetingLinksAssessment";
import * as TextImages from "../assessments/seo/textImagesAssessment";
import * as TextLength from "../assessments/seo/textLengthAssessment";
import * as OutboundLinks from "../assessments/seo/outboundLinksAssessment";
import InternalLinksAssessment from "../assessments/seo/InternalLinksAssessment";
import TitleKeywordAssessment from "../assessments/seo/TitleKeywordAssessment";
import * as TitleWidth from "../assessments/seo/pageTitleWidthAssessment";
import UrlKeywordAssessment from "../assessments/seo/UrlKeywordAssessment";
import * as UrlLength from "../assessments/seo/urlLengthAssessment";
import * as urlStopWords from "../assessments/seo/urlStopWordsAssessment";

/**
 * Creates the Assessor
 *
 * @param {Object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
const CornerstoneSEOAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		new IntroductionHasKeywordAssessment(),
		new KeyphraseLengthAssessment(),
		new KeywordDensityAssessment(),
		keywordStopWords,
		new MetaDescriptionKeywordAssessment(),
		new MetaDescriptionLength( {
			scores:	{
				tooLong: 3,
				tooShort: 3,
			},
		} ),
		new SubheadingsKeyword(
			{
				scores: {
					noMatches: 3,
					oneMatch: 6,
					multipleMatches: 9,
				},
			}
		),
		new TextCompetingLinksAssessment(),
		new TextImages( {
			scores: {
				noImages: 3,
				withAltNonKeyword: 3,
				withAlt: 3,
				noAlt: 3,
			},
		} ),
		new TextLength( {
			recommendedMinimum: 900,
			slightlyBelowMinimum: 400,
			belowMinimum: 300,
			farBelowMinimum: 0,

			scores: {
				belowMinimum: -20,
				farBelowMinimum: -20,
			},
		} ),
		new OutboundLinks( {
			scores: {
				noLinks: 3,
			},
		} ),
		new TitleKeywordAssessment(),
		new InternalLinksAssessment(),
		new TitleWidth(
			{
				scores: {
					widthTooShort: 3,
					widthTooLong: 3,
				},
			}
		),
		new UrlKeywordAssessment(
			{
				scores: {
					noKeywordInUrl: 3,
				},
			}
		),
		new UrlLength( {
			scores: {
				tooLong: 3,
			},
		} ),
		urlStopWords,
	];
};

inherits( CornerstoneSEOAssessor, SEOAssessor );

module.exports = CornerstoneSEOAssessor;
