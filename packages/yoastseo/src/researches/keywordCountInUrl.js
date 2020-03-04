/** @module researches/countKeywordInUrl */

import parseSlug from "../stringProcessing/parseSlug";
import { findTopicFormsInString } from "./findKeywordFormsInString.js";

/**
 * Matches the keyword in the URL. Replaces dashes and underscores with whitespaces and uses whitespace as wordboundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 *
 * @returns {int} Number of times the keyword is found.
 */
export default function( paper, researcher ) {
	const topicForms = researcher.getResearch( "morphology" );
	const slug = parseSlug( paper.getUrl() );

	const keyphraseInSlug = findTopicFormsInString( topicForms, slug, false, paper.getLocale() );

	return {
		keyphraseLength: topicForms.keyphraseForms.length,
		percentWordMatches: keyphraseInSlug.percentWordMatches,
	};
}
