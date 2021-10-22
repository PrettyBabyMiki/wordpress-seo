import { StemOriginalPair } from "../../../../helpers/morphology/buildTopicStems";
import getWords from "./../getWords";
import functionWords from "./../../config/functionWords";

/**
 * A topic phrase (i.e., a keyphrase or synonym) with stem-original pairs for the words in the topic phrase.
 *
 * @param {StemOriginalPair[]} stemOriginalPairs The stem-original pairs for the words in the topic phrase.
 * @param {boolean}            exactMatch        Whether the topic phrase is an exact match.
 *
 * @constructor
 */
function TopicPhrase( stemOriginalPairs = [], exactMatch = false ) {
	this.stemOriginalPairs = stemOriginalPairs;
	this.exactMatch = exactMatch;
}

/**
 * Returns all stems in the topic phrase.
 *
 * @returns {string[]|[]} The stems in the topic phrase or empty array if the topic phrase is exact match.
 */
TopicPhrase.prototype.getStems = function() {
	// An exact match keyphrase doesn't have stems.
	if ( this.exactMatch ) {
		return [];
	}

	return this.stemOriginalPairs.map( stemOriginalPair => stemOriginalPair.stem );
};

/**
 * A stem-original pair ƒor a word in a topic phrase.
 *
 * @param {string} stem     The stem of the topic phrase word.
 * @param {string} original The original word form the topic phrase (unsanitized)
 *
 * @constructor
 */
function StemOriginalPair( stem, original ) {
	this.stem = stem;
	this.original = original;
}

/**
 * Analyzes the focus keyword string or one synonym phrase.
 * Checks if morphology is requested or if the user wants to match exact string.
 * If morphology is required the module finds a stem for all words (if no function words list available) or
 * for all content words (i.e., excluding prepositions, articles, conjunctions, if the function words list is available).
 *
 * @param {string}   keyphrase     The keyphrase of the paper (or a synonym phrase) to get stem for.
 * @param {Function} stemmer       The language-specific stemmer.
 * @param {string[]} functionWords The language-specific function words.
 *
 * @returns {TopicPhrase} Object with an array of StemOriginalPairs of all (content) words in the keyphrase or synonym
 * phrase and information about whether the keyphrase/synonym should be matched exactly.
 */
const buildStems = function( keyphrase, createWordForms ) {
	if ( isUndefined( keyphrase ) || keyphrase === "" ) {
		return new TopicPhrase();
	}

	// If the keyphrase is embedded in double quotation marks, return keyword itself, without outer-most quotation marks.
	const doubleQuotes = [ "「", "」", "『", "』", "“", "”", "〝", "〞", "〟", "‟", "„", "\"" ];
	if ( doubleQuotes.includes( keyphrase[ 0 ] ) && doubleQuotes.includes( keyphrase[ keyphrase.length - 1 ] ) ) {
		keyphrase = keyphrase.substring( 1, keyphrase.length - 1 );
		return new TopicPhrase(
			[ keyphrase, keyphrase ],
			true
		);
	}

	let keyphraseWords = getWords( keyphrase );

	// Filter function words from keyphrase. Don't filter if the keyphrase only consists of function words.
	const wordsWithoutFunctionWords = keyphraseWords.filter( ( word ) => ! functionWords.includes( word ) );
	if ( wordsWithoutFunctionWords.length > 0 ) {
		keyphraseWords = wordsWithoutFunctionWords;
	}

	// Return a stem-original pair with a stem.
	const stemOriginalPairs = keyphraseWords.map( word => {
		return new StemOriginalPair( createWordForms( word ), word );
	} );

	return new TopicPhrase( stemOriginalPairs );
};

/**
 * Builds stems of words of the keyphrase and of each synonym phrase.
 *
 * @param {string}   keyphrase     The paper's keyphrase.
 * @param {string[]} synonyms      The paper's synonyms.
 * @param {Function} stemmer       The language-specific stemmer (if available).
 * @param {string[]} functionWords The language-specific function words.
 *
 * @returns {Object} Object with an array of stems of words in the keyphrase and an array of arrays of stems of words in the synonyms.
 */
export default function collectKeyphraseAndSynonymsStems( keyphrase, synonyms, createWordForms ) {
	const keyphraseStems = buildStems( keyphrase, createWordForms );
	const synonymsStems = synonyms.map( synonym => buildStems( synonym, createWordForms ) );

	return {
		keyphraseStems,
		synonymsStems,
	};
};
