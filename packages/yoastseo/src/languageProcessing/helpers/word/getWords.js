/** @module stringProcessing/countWords */
import sanitizeString from "../sanitize/sanitizeString";
import { filter, flatMap } from "lodash-es";
import removePunctuation, { punctuationRegexString } from "../sanitize/removePunctuation.js";

const interJectionRegexString = `([${punctuationRegexString}])`;
const interJectionRegex = new RegExp( interJectionRegexString, "g" );

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @param {boolean} [shouldRemovePunctuation=true] If punctuation should be removed. Defaults to `true`.
 *
 * @returns {Array} The array with all words.
 */
export default function( text, shouldRemovePunctuation = true ) {
	// Unify whitespaces and non-breaking spaces, remove table of content and strip the tags and multiple spaces.
	text = sanitizeString( text );

	if ( text === "" ) {
		return [];
	}

	let words = text.split( /\s/g );

	if ( shouldRemovePunctuation ) {
		words = words.map( removePunctuation );
	} else {
		// If punctuation is not removed, punctuation marks are tokenized as if they were words.
		words = flatMap( words, ( word ) => {
			const newWord = word.replace( interJectionRegex, " $1 " );
			return newWord.split( " " );
		} );
	}

	return filter( words, function( word ) {
		return word.trim() !== "";
	} );
}

