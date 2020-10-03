import { forEach } from "lodash-es";
import { isEmpty } from "lodash-es";
import { map } from "lodash-es";

import arrayToRegex from "../../stringProcessing/createRegexFromArray.js";
import stripSpaces from "../../stringProcessing/stripSpaces.js";

// German-specific imports.
import SentencePartGerman from "../../de/passiveVoice/SentencePart.js";

import auxiliariesGermanFactory from "../../de/passiveVoice/auxiliaries.js";

const auxiliariesGerman = auxiliariesGermanFactory().allAuxiliaries;
import stopwordsGermanFactory from "../../de/passiveVoice/stopwords.js";
const stopwordsGerman = stopwordsGermanFactory();

// Dutch-specific imports.
import SentencePartDutch from "../../nl/passiveVoice/SentencePart.js";

import stopwordsDutchFactory from "../../nl/passiveVoice/stopwords.js";
const stopwordsDutch = stopwordsDutchFactory();
import auxiliariesDutchFactory from "../../nl/passiveVoice/auxiliaries.js";
const auxiliariesDutch = auxiliariesDutchFactory();

// Polish-specific imports.
import SentencePartPolish from "../../pl/passiveVoice/SentencePart.js";

import stopwordsPolishFactory from "../../pl/passiveVoice/stopwords.js";
const stopwordsPolish = stopwordsPolishFactory();
import auxiliariesPolishFactory from "../../pl/passiveVoice/auxiliaries.js";
const auxiliariesPolish = auxiliariesPolishFactory();


// The language-specific variables.
const languageVariables = {
	de: {
		SentencePart: SentencePartGerman,
		stopwordRegex: arrayToRegex( stopwordsGerman ),
		auxiliaryRegex: arrayToRegex( auxiliariesGerman ),
		locale: "de_DE",
	},
	nl: {
		SentencePart: SentencePartDutch,
		stopwordRegex: arrayToRegex( stopwordsDutch ),
		auxiliaryRegex: arrayToRegex( auxiliariesDutch ),
		locale: "nl_NL",
	},
	pl: {
		SentencePart: SentencePartPolish,
		stopwordRegex: arrayToRegex( stopwordsPolish ),
		auxiliaryRegex: arrayToRegex( auxiliariesPolish ),
		locale: "pl_PL",
	},
};

/**
 * Strips spaces from the auxiliary matches.
 *
 * @param {Array} matches A list with matches of auxiliaries.
 * @returns {Array} A list with matches with spaces removed.
 */
function sanitizeMatches( matches ) {
	return map( matches, function( match ) {
		return stripSpaces( match );
	} );
}

/**
 * Splits sentences into sentence parts based on stopwords.
 *
 * @param {string} sentence The sentence to split.
 * @param {Array} stopwords The array with matched stopwords.
 * @returns {Array} The array with sentence parts.
 */
function splitOnWords( sentence, stopwords ) {
	const splitSentences = [];

	// Split the sentence on each found stopword and push this part in an array.
	forEach( stopwords, function( stopword ) {
		const sentenceSplit = sentence.split( stopword );
		if ( ! isEmpty( sentenceSplit[ 0 ] ) ) {
			splitSentences.push( sentenceSplit[ 0 ] );
		}
		const startIndex = sentence.indexOf( stopword );
		const endIndex = sentence.length;
		sentence = stripSpaces( sentence.substr( startIndex, endIndex ) );
	} );

	// Push the remainder of the sentence in the sentence parts array.
	splitSentences.push( sentence );
	return splitSentences;
}

/**
 * Creates sentence parts based on split sentences.

 * @param {Array}   sentences   The array with split sentences.
 * @param {string}  language    The language for which to create sentence parts.
 *
 * @returns {Array} The array with sentence parts.
 */
function createSentenceParts( sentences, language ) {
	const auxiliaryRegex = languageVariables[ language ].auxiliaryRegex;
	const SentencePart = languageVariables[ language ].SentencePart;
	const sentenceParts = [];
	forEach( sentences, function( part ) {
		const foundAuxiliaries = sanitizeMatches( part.match( auxiliaryRegex || [] ) );
		sentenceParts.push( new SentencePart( part, foundAuxiliaries, languageVariables[ language ].locale ) );
	} );
	return sentenceParts;
}

/**
 * Splits the sentence into sentence parts based on stopwords.
 *
 * @param {string} sentence The text to split into sentence parts.
 * @param {string} language The language for which to split sentences.
 *
 * @returns {Array} The array with sentence parts.
 */
function splitSentence( sentence, language ) {
	const stopwordRegex = languageVariables[ language ].stopwordRegex;
	const stopwords = sentence.match( stopwordRegex ) || [];
	const splitSentences = splitOnWords( sentence, stopwords );
	return createSentenceParts( splitSentences, language );
}

export default splitSentence;
