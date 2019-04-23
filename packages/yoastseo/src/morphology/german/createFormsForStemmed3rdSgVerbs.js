import { detectAndStemRegularParticiple } from "./detectAndStemRegularParticiple";
import { generateRegularVerbForms } from "./generateRegularVerbForms";
import { generateVerbExceptionForms } from "./generateVerbExceptionForms";

/**
 * Recognizes words that might be 3rd person singular forms of verbs (e.g., "arbeitet") and stems them further
 * (to e.g., "arbeit") so that the correct forms can be built based on this stem.
 *
 * @param {Object}  verbData         The German morphology data for verbs.
 * @param {string}  stemmedWord      The stemmed word.
 * @param {string}  word             The full word.
 *
 * @returns {string|null} The stemmed word.
 */
export function stem3rdSgVerb( verbData, stemmedWord, word ) {
	const non3rdSgEndingInT = verbData.non3rdSgEndingInT;

	/*
	 * A number of specific endings signal that the form is not a verb form. Similarly, a word that's recognized
	 * as a participle shouldn't be stemmed as a 3rd person singular verb.
	 */
	if ( non3rdSgEndingInT.find( ending => stemmedWord.endsWith( ending ) ) ||
		detectAndStemRegularParticiple( verbData, word )
	) {
		return null;
	}

	const endings3rdSg = verbData.endings3rdSg;

	for ( const ending of endings3rdSg ) {
		if ( stemmedWord.endsWith( ending ) ) {
			return stemmedWord.slice( 0, stemmedWord.length - ending.length );
		}
	}

	return null;
}

/**
 * Checks whether a given stemmed word needs to be stemmed further because it could be a 3rd person singular verb
 * form and if so, creates appropriate forms.
 *
 * @param {Object}  morphologyData   The German morphology data.
 * @param {string}  stemmedWord      The stemmed word.
 * @param {string}  word             The full word.
 *
 * @returns {string[]|null} The created word forms.
 */
export function createFormsForStemmed3rdSgVerbs( morphologyData, stemmedWord, word ) {
	const verbData = morphologyData.verbs;
	const stemmedWordWithoutTEt = stem3rdSgVerb( verbData, stemmedWord, word );

	if ( stemmedWordWithoutTEt ) {
		const exceptions = generateVerbExceptionForms( verbData, stemmedWordWithoutTEt );

		return exceptions.length > 0
			? exceptions
			: generateRegularVerbForms( verbData, stemmedWordWithoutTEt );
	}

	return null;
}
