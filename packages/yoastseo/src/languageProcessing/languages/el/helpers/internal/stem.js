/**
 * MIT License
 *
 * Copyright (c) 2015 apmats <amatsagkas@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * https://github.com/Apmats/greekstemmerjs
 */

import getMorphologyData from "../../../../../../spec/specHelpers/getMorphologyData";
import { matchAndStemWordWithRegexArray, matchAndStemWordWithOneRegex, matchAndStemWord } from "./stemHelpers";

/**
 * Checks if a word is in the exception list of step 1 stemming process.
 *
 * @param {string} word             The word to check.
 * @param {Object} morphologyData   The Greek morphology data.
 * @returns {string}    The stem of the word.
 */
function checkExceptionStep1( word, morphologyData ) {
	const exceptions = morphologyData.externalStemmer.step1Exceptions;
	const regex = new RegExp( "(.*)(" + Object.keys( exceptions ).join( "|" ) + ")$" );
	const match = regex.exec( word );
	if ( match !== null ) {
		word = match[ 1 ] + exceptions[ match[ 2 ] ];
	}
	return word;
}

/**
 * Stems suffixes from step 1.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
 */
function stemWordStep1( word, morphologyData ) {
	const regexesStep1 = morphologyData.externalStemmer.suffixesStep1;
	const regexes1 = new RegExp( regexesStep1.regexesArray1 );
	const regexes2 = regexesStep1.regexesArray2;
	const endings = regexesStep1.step1Endings;
	let match;
	if ( ( match = new RegExp( regexesStep1.regexStep1a ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( ! new RegExp( regexesStep1.regexStep1b ).test( word ) ) {
			word += "αδ";
		}
	}
	word = matchAndStemWordWithRegexArray( word, regexes1, regexes2, endings );

	return word;
}

/**
 * Stems suffixes from step 2.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
 */
function stemWordStep2( word, morphologyData ) {
	const regexesStep2 = morphologyData.externalStemmer.regexesStep2;
	const vowelRegex1 = new RegExp( morphologyData.externalStemmer.vowelRegex1 );
	let match;
	if ( ( match = new RegExp( regexesStep2.regex2a ).exec( word ) ) !== null && match[ 1 ].length > 4 ) {
		word = match[ 1 ];
	}
	if ( ( match = new RegExp( regexesStep2.regex2b ).exec( word ) !== null ) ) {
		word = match[ 1 ];
		if ( vowelRegex1.test( word ) || word.length < 2 || new RegExp( regexesStep2.regex2c ).test( match[ 1 ] ) ) {
			word += "ι";
		}
		if ( new RegExp( regexesStep2.regex2d ).test( match[ 1 ] ) ) {
			word += "αι";
		}
	}
	return word;
}

/**
 * Stems suffixes from step 3.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
 */
function stemWordStep3( word, morphologyData ) {
	const vowelRegex1 = new RegExp( morphologyData.externalStemmer.vowelRegex1 );
	const regexesStep3 = morphologyData.externalStemmer.regexesStep3;
	let match;
	if ( ( match = new RegExp( regexesStep3.regex3a ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( vowelRegex1.test( word ) || new RegExp( regexesStep3.regex3b ).test( word ) || new RegExp( regexesStep3.regex3c ).test( word ) ) {
			word += "ικ";
		}
	}
	return word;
}

/**
 * Stems suffixes from step 4.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
 */
function stemWordStep4( word, morphologyData ) {
	const regexesStep4 = morphologyData.externalStemmer.regexesStep4;
	const vowelRegex1 = morphologyData.externalStemmer.vowelRegex1;
	const vowelRegex2 = morphologyData.externalStemmer.vowelRegex2;
	let match;
	if ( word === "αγαμε" ) {
		return "αγαμ";
	}

	word = matchAndStemWordWithOneRegex( word, regexesStep4.regex4a );

	word = matchAndStemWordWithRegexArray( word, regexesStep4.regexesArray1a, regexesStep4.regexesArray1b, regexesStep4.step4Endings1 );

	word = matchAndStemWord( word, regexesStep4.regex4b, vowelRegex2, regexesStep4.regex4c, "αν" );

	word = matchAndStemWordWithOneRegex( word, regexesStep4.regex4d );

	if ( ( match = new RegExp( regexesStep4.regex4e ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( vowelRegex2.test( word ) || new RegExp( regexesStep4.regex4f ).test( word ) ||
			new RegExp( regexesStep4.regex4g ).test( word ) ) {
			word += "ετ";
		}
	}

	if ( ( match = new RegExp( regexesStep4.regex4h ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( new RegExp( regexesStep4.regex4i ).test( match[ 1 ] ) ) {
			word += "οντ";
		} else if ( new RegExp( regexesStep4.regex4j ).test( match[ 1 ] ) ) {
			word += "ωντ";
		}
	}
	word = matchAndStemWordWithRegexArray( word, regexesStep4.regexesArray2a, regexesStep4.regexesArray2b, regexesStep4.step4Endings2 );

	word = matchAndStemWordWithOneRegex( word, regexesStep4.regex4k );

	word = matchAndStemWord( word, regexesStep4.regex4l, regexesStep4.regex4m, regexesStep4.regex4n, "ηκ" );

	if ( ( match = new RegExp( regexesStep4.regex4o ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( vowelRegex1.test( word ) || new RegExp( regexesStep4.regex4p ).test( match[ 1 ] ) ||
			new RegExp( regexesStep4.regex4q ).test( match[ 1 ] ) ) {
			word += "ους";
		}
	}

	if ( ( match = new RegExp( regexesStep4.regex4r ).exec( word ) ) !== null ) {
		word = match[ 1 ];
		if ( new RegExp( regexesStep4.regex4s ).test( word ) ||
			( new RegExp( regexesStep4.regex4t ).test( word ) && ! new RegExp( regexesStep4.regex4u ).test( word ) ) ||
			new RegExp( regexesStep4.regex4v ).test( word ) ) {
			word += "αγ";
		}
	}
	word = matchAndStemWordWithRegexArray( word, regexesStep4.regexesArray3a, regexesStep4.regexesArray3b, regexesStep4.step4Endings3 );

	return word;
}

/**
 * Stems suffixes from step 5.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
 */
function stemWordStep5( word, morphologyData ) {
	const regexesStep5 = morphologyData.externalStemmer.regexesStep5;
	let match;
	if ( ( match = new RegExp( regexesStep5.regex5a ).exec( word ) ) !== null ) {
		word = match[ 1 ] + "μ";
		if ( new RegExp( regexesStep5.regex5b ).test( match[ 1 ] ) ) {
			word += "α";
		} else if ( new RegExp( regexesStep5.regex5c ).test( match[ 1 ] ) ) {
			word += "ατ";
		}
	}

	if ( ( match = new RegExp( regexesStep5.regex5d ).exec( word ) ) !== null ) {
		word = match[ 1 ] + "ου";
	}

	return word;
}

/**
 * Stems suffixes from step 6.
 *
 * @param {string} word             The word to stem.
 * @param {Object} morphologyData   The Greek morphology data.
 *
 * @returns {string}     The word without suffixes or the original word if no such suffix is found.
 */
function stemWordStep6( word, morphologyData ) {
	const regexesStep6 = morphologyData.externalStemmer.regexesStep6;

	let match;
	if ( ( match = new RegExp( regexesStep6.regex6a ).exec( word ) ) !== null ) {
		if ( ! new RegExp( regexesStep6.regex6b ).test( match[ 1 ] ) ) {
			word = match[ 1 ];
		}
		if ( new RegExp( regexesStep6.regex6c ).test( match[ 1 ] ) ) {
			word += "υτ";
		}
	}

	return word;
}

/**
 * Stems Greek words
 *
 * @param {string} word           The word to stem.
 * @param {Object} morphologyData The object that contains regex-based rules and exception lists for Greek stemming.
 *
 * @returns {string} The stem of an Greek word.
 */
export default function stem( word, morphologyData ) {
	const originalWord = word;
	const doNotStemWords = morphologyData.externalStemmer.doNotStemWords;
	if ( word.length < 3 || doNotStemWords.include( word ) ) {
		return word;
	}
	// Check for exceptions first before proceeding to the next step.
	word = checkExceptionStep1( word, morphologyData );
	// Step 1
	word = stemWordStep1( word, morphologyData );
	// Step 2
	word = stemWordStep2( word, morphologyData );
	// Step 3
	word = stemWordStep3( word, morphologyData );
	// Step 4
	word = stemWordStep4( word, morphologyData );
	// Step 5
	word = stemWordStep5( word, morphologyData );

	// Handle long words.
	const longWordRegex = morphologyData.externalStemmer.longWordRegex;
	if ( originalWord.length === word.length ) {
		word = matchAndStemWordWithOneRegex( word, longWordRegex );
	}
	// Step 6
	word = stemWordStep6( word, morphologyData );

	return word;
}
