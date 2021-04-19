import { includes } from "lodash-es";
import getFunctionWordsLanguages from "../helpers/getFunctionWordsLanguages";
import getLanguage from "../helpers/getLanguage";
import { getSubheadingContentsTopLevel } from "../stringProcessing/getSubheadings";
import stripSomeTags from "../stringProcessing/stripNonTextTags";
import { findTopicFormsInString } from "./findKeywordFormsInString";

const functionWordLanguages = getFunctionWordsLanguages();

/**
 * Computes the amount of subheadings reflecting the topic.
 *
 * @param {Object}      topicForms      The main key phrase and its synonyms to check.
 * @param {string[]}    subheadings     The subheadings to check.
 * @param {boolean}     useSynonyms     Whether to match synonyms or only main keyphrase.
 * @param {string}      locale          The current locale.
 *
 * @returns {number} The amount of subheadings reflecting the topic.
 */
const numberOfSubheadingsReflectingTopic = function( topicForms, subheadings, useSynonyms, locale ) {
	const isFunctionWordLanguage = includes( functionWordLanguages, getLanguage( locale ) );

	return subheadings.filter( subheading => {
		const matchedTopicForms = findTopicFormsInString( topicForms, subheading, useSynonyms, locale );

		if ( ! isFunctionWordLanguage ) {
			return matchedTopicForms.percentWordMatches === 100;
		}
		return matchedTopicForms.percentWordMatches > 50;
	} ).length;
};

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the key phrase and the keywords' respective morphological forms in them.
 *
 * Also checks for synonyms.
 *
 * @param {Object}      paper       The paper object containing the text and keyword.
 * @param {Researcher}  researcher  The researcher object.
 *
 * @returns {Object} The result object.
 */
export default function( paper, researcher ) {
	const text = stripSomeTags( paper.getText() );
	const topicForms = researcher.getResearch( "morphology" );
	const locale = paper.getLocale();
	const result = { count: 0, matches: 0, percentReflectingTopic: 0 };
	const useSynonyms = true;
	const subheadings = getSubheadingContentsTopLevel( text );

	if ( subheadings.length !== 0 ) {
		result.count = subheadings.length;
		result.matches = numberOfSubheadingsReflectingTopic( topicForms, subheadings, useSynonyms, locale );
		result.percentReflectingTopic = result.matches / result.count * 100;
	}

	return result;
}
