import { map } from "lodash-es";
import addWordBoundary from "./addWordboundary.js";
import stripSpaces from "./stripSpaces.js";
import transliterate from "./transliterate.js";
import transliterateWP from "./transliterateWPstyle.js";
import { replaceTurkishIsMemoized } from "./specialCharacterMappings";

/**
 * Creates a regex from the keyword with included wordboundaries.
 *
 * @param {string} keyword  The keyword to create a regex from.
 * @param {string} locale   The locale.
 *
 * @returns {RegExp} Regular expression of the keyword with word boundaries.
 */
var toRegex = function( keyword, locale ) {
	keyword = addWordBoundary( keyword, false, "", locale );
	return new RegExp( keyword, "ig" );
};

/**
 * Matches a string with and without transliteration.
 * @param {string} text The text to match.
 * @param {string} keyword The keyword to match in the text.
 * @param {string} locale The locale used for transliteration.
 * @returns {Array} All matches from the original as the transliterated text and keyword.
 */
export default function( text, keyword, locale ) {
	var keywordRegex = toRegex( keyword, locale );

	if ( locale === "tr_TR" ) {
		const turkishMappings = replaceTurkishIsMemoized( keyword );
		keywordRegex = new RegExp( turkishMappings.map( x => addWordBoundary( x ) ).join( "|" ), "ig" );
	}
	var matches = text.match( keywordRegex ) || [];

	text = text.replace( keywordRegex, "" );

	var transliterateKeyword = transliterate( keyword, locale );
	var transliterateKeywordRegex = toRegex( transliterateKeyword, locale );
	var transliterateMatches = text.match( transliterateKeywordRegex ) || [];
	var combinedArray = matches.concat( transliterateMatches );

	var transliterateWPKeyword = transliterateWP( keyword, locale );

	if ( ! ( transliterateWPKeyword === transliterateKeyword ) ) {
		var transliterateWPKeywordRegex = toRegex( transliterateWPKeyword, locale );
		var transliterateWPMatches = text.match( transliterateWPKeywordRegex ) || [];

		combinedArray = combinedArray.concat( transliterateWPMatches );
	}

	return map( combinedArray, function( match ) {
		return stripSpaces( match );
	} );
}
