/** @module stringProcessing/addWordboundary */
/* eslint-disable no-useless-escape */

/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {string}  matchString                 The string to generate a regex string for.
 * @param {boolean} [positiveLookAhead=false]   Boolean indicating whether or not to include a positive look ahead
 * for the word boundaries at the end.
 * @param {string} [extraWordBoundary=""]       Extra characters to match a word boundary on.
 * @param {string} [locale=""]                  The locale used to determine the word boundary.
 *
 * @returns {string} A regex string that matches the matchString with word boundaries.
 */
export default function( matchString, positiveLookAhead = false, extraWordBoundary = "", locale = "" ) {
	var wordBoundary, wordBoundaryStart, wordBoundaryEnd;

	if ( locale === "id_ID" ) {
		wordBoundary = "[ \\u00a0 \\n\\r\\t\.,\(\)”“〝〞〟‟„\"+;!¡?¿:\/»«‹›" + extraWordBoundary + "<>";
	} else {
		wordBoundary = "[ \\u00a0 \\n\\r\\t\.,\(\)”“〝〞〟‟„\"+\\-;!¡?¿:\/»«‹›" + extraWordBoundary + "<>";
	}

	wordBoundaryStart = "(^|" + wordBoundary + "'‘’‛`])";
	if ( positiveLookAhead ) {
		wordBoundaryEnd = "($|((?=" + wordBoundary + "]))|((['‘’‛`])(" + wordBoundary + "])))";
	} else {
		wordBoundaryEnd = "($|(" + wordBoundary + "])|((['‘’‛`])(" + wordBoundary + "])))";
	}

	return wordBoundaryStart + matchString + wordBoundaryEnd;
}
