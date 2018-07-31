// "use strict";
const countSyllablesInText = require( "../../stringProcessing/syllables/count" );

const englishMorphology = require( "./englishMorphology.json" );
import createRulesFromArrays from "../createRulesFromJsonArrays.js";

const isUndefined = require( "lodash/isUndefined.js" );
const unique = require( "lodash/uniq" );

const irregularAdjectives = englishMorphology.irregularAdjectives;
const noComparativeOrSuperlative = new RegExp( englishMorphology.regexAdjective.noComparativeOrSuperlative, "i" );
const comparativeRegex = createRulesFromArrays( englishMorphology.regexAdjective.comparative );
const superlativeRegex = createRulesFromArrays( englishMorphology.regexAdjective.superlative );
const comparativeToBaseRegex = createRulesFromArrays( englishMorphology.regexAdjective.comparativeToBase );
const superlativeToBaseRegex = createRulesFromArrays( englishMorphology.regexAdjective.superlativeToBase );
const adverbRegex = createRulesFromArrays( englishMorphology.regexAdjective.adverb );
const adverbToBaseRegex = createRulesFromArrays( englishMorphology.regexAdjective.adverbToBase );
const icallyAdverbsRegex = createRulesFromArrays( englishMorphology.regexAdjective.icallyAdverbs );


/**
 * Checks if the input word occurs in the list of irregular adjectives and if so returns all its irregular forms.
 *
 * @param {string} word The word for which to determine its irregular forms.
 *
 * @returns {Array} Array of word forms from the exception list.
 */
const checkIrregulars = function( word ) {
	let irregulars;

	irregularAdjectives.forEach( function( paradigm ) {
		paradigm.forEach( function( wordInParadigm ) {
			if ( wordInParadigm === word ) {
				irregulars = paradigm;
			}
		} );
	} );
	return irregulars;
};

/**
 * Checks if the input word ends in -ically, in which case return two possible base forms
 *
 * @param {string} word The word for which to determine its forms.
 *
 * @returns {Array} Array of word forms.
 */
const checkIcally = function( word ) {
	for ( let i = 0; i < icallyAdverbsRegex.length; i++ ) {
		if ( icallyAdverbsRegex[ i ].reg.test( word ) === true ) {
			return [
				word.replace( icallyAdverbsRegex[ i ].reg, icallyAdverbsRegex[ i ].repl1 ),
				word.replace( icallyAdverbsRegex[ i ].reg, icallyAdverbsRegex[ i ].repl2 ),
			];
		}
	}
};

/**
 * Checks if the input word is longer than 2 syllables (in this case comparative and superlative forms do not need to be formed).
 *
 * @param {string} word The word for which to determine its length.
 *
 * @returns {boolean} True if the input word is longer than 2 syllables.
 */
const checkWordTooLong = function( word ) {
	// todo: provide proper locale definition
	const lengthInSyllables = countSyllablesInText( word, "en_EN" );

	return lengthInSyllables > 2;
};

/**
 * Checks if the input word ends with "er".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "er".
 */
const endsWithEr = function( word ) {
	const wordLength = word.length;
	// Consider only words of four letters or more to be comparatives (otherwise, words like "per" are being treated as comparatives).
	if ( wordLength > 3 ) {
		return word.substring( word.length - 2, word.length ) === "er";
	}
	return false;
};

/**
 * Checks if the input word ends with "est".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "est".
 */
const endsWithEst = function( word ) {
	const wordLength = word.length;
	// Consider only words of five letters or more to be superlatives (otherwise, words like "test" are being treated as superlatives).
	if ( wordLength > 4 ) {
		return word.substring( word.length - 3, word.length ) === "est";
	}
	return false;
};

/**
 * Checks if the input word ends with "ly".
 *
 * @param {string} word The word to check.
 *
 * @returns {boolean} True if the word ends with "ly".
 */
const endsWithLy = function( word ) {
	const wordLength = word.length;
	// Consider only words of four letters or more to be adjectives (otherwise, words like "lily" are being treated as adjectives).
	if ( wordLength > 3 ) {
		return word.substring( word.length - 2, word.length ) === "ly";
	}
	return false;
};


/**
 * Checks if the input word qualifies for the input regex and if so builds a required form.
 * This function is used for other more specific functions.
 *
 * @param {string} word The word to build forms for.
 * @param {string} regex The regex to compare the word against.
 *
 * @returns {string} The newly built form of the word.
 */
const buildAdjectiveFormFromRegex = function( word, regex ) {
	for ( let i = 0; i < regex.length; i++ ) {
		if ( regex[ i ].reg.test( word ) === true ) {
			return word.replace( regex[ i ].reg, regex[ i ].repl );
		}
	}
};

/**
 * Forms a comparative from the base form.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The comparative formed from the input word.
 */
const comparative = function( word ) {
	return buildAdjectiveFormFromRegex( word, comparativeRegex );
};

/**
 * Forms a superlative from the base form.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The superlative formed from the input word.
 */
const superlative = function( word ) {
	return buildAdjectiveFormFromRegex( word, superlativeRegex );
};

/**
 * Forms an adverb from the base form.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The adverb formed from the input word.
 */
const adverb = function( word ) {
	return buildAdjectiveFormFromRegex( word, adverbRegex );
};


/**
 * Forms the base form from the comparative.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The base form formed from the input word.
 */
const comparativeToBase = function( word ) {
	return buildAdjectiveFormFromRegex( word, comparativeToBaseRegex );
};

/**
 * Forms the base form from the superlative.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The base form from the input word.
 */
const superlativeToBase = function( word ) {
	return buildAdjectiveFormFromRegex( word, superlativeToBaseRegex );
};

/**
 * Forms the base form from the adverb.
 *
 * @param {string} word The word to build forms for.
 *
 * @returns {string} The base form from the input word.
 */
const adverbToBase = function( word ) {
	return buildAdjectiveFormFromRegex( word, adverbToBaseRegex );
};


/**
 * Forms the base form from an input word.
 *
 * @param {string} word The word to build the base form for.
 *
 * @returns {string} The base form of the input word.
 */
const getBase = function( word ) {
	if ( endsWithEr( word ) ) {
		return {
			base: comparativeToBase( word ),
			guessedForm: "er",
		};
	}

	if ( endsWithEst( word ) ) {
		return {
			base: superlativeToBase( word ),
			guessedForm: "est",
		};
	}

	if ( endsWithLy( word ) ) {
		return {
			base: adverbToBase( word ),
			guessedForm: "ly",
		};
	}

	return {
		base: word,
		guessedForm: "base",
	};
};

/**
 * Collects all possible verb forms for a given word through checking if it is irregular, base, adverb,
 * adverb ending in -ically, comparative, or superlative.
 *
 * @param {string} word The word for which to determine its forms.
 *
 * @returns {Array} Array of word forms.
 */
const getAdjectiveForms = function( word ) {
	const irregular = checkIrregulars( word );
	if ( ! isUndefined( irregular ) ) {
		return irregular;
	}

	let forms = [];

	const ically = checkIcally( word );
	if ( ! isUndefined( ically ) ) {
		return ically.concat( word );
	}

	let base = getBase( word ).base;

	if ( isUndefined( base ) ) {
		base = word;
	}

	// Const guessedForm = getBase( word ).guessedForm; //Meant to be used to check if the newly built forms are built correctly.
	forms = forms.concat( word );

	forms.push( base );
	forms.push( adverb( base ) );

	if ( checkWordTooLong( base ) === true || noComparativeOrSuperlative.test( base ) === true ) {
		return unique( forms.filter( Boolean ) );
	}

	forms.push( comparative( base ) );
	forms.push( superlative( base ) );

	return unique( forms.filter( Boolean ) );
};

module.exports = {
	getAdjectiveForms: getAdjectiveForms,
	getBase: getBase,
	comparative: comparative,
	superlative: superlative,
	checkIcally: checkIcally,

};
