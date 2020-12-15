import { filter } from "lodash-es";
import getWords from "../../../stringProcessing/getWords.js";

// Verb-form lists per language
import getPassiveVerbsRussianFactory from "../../russian/passiveVoice/participlesShortenedList.js";
const getPassiveVerbsRussian = getPassiveVerbsRussianFactory().all;

import getPassiveVerbsSwedishFactory from "../../swedish/passiveVoice/participles.js";
const getPassiveVerbsSwedish = getPassiveVerbsSwedishFactory().all;

const passiveEndingsTurkish = [ "nmak", "nmek", "nir", "nır", "nür", "nur", "nıyor", "niyor", "ndı", "ndi", "ndu", "ndü", "nmış", "nmiş", "nmuş",
	"nmüş", "necek", "nacak", "nmıştı", "nmişti", "nmuştu", "nmüştü", "nıyordu", "niyordu", "nuyordu", "nüyordu", "necekti", "nacaktı", "nsa", "nse",
	"nmalı", "nmeli", "nmaz", "nmez", "anmak", "enmek", "ınmak", "inmek", "unmak", "ünmek", "anır", "enir", "ınır", "inir", "unur", "ünür", "anıyor",
	"eniyor", "ınıyor", "iniyor", "unuyor", "ünüyor", "andı", "endi", "ındı", "indi", "undu", "ündü", "anmış", "enmiş", "ınmış", "inmiş", "unmuş",
	"ünmüş", "anacak", "enecek", "ınacak", "inecek", "unacak", "ünecek", "ınmıştı", "inmişti", "unmuştu", "ünmüştü", "ınıyordu", "iniyordu",
	"unuyordu", "ünüyordu", "necekti", "nacaktı", "ansa", "ense", "ınsa", "inse", "unsa", "ünse", "anmalı", "enmeli", "ınmalı", "inmeli", "unmalı",
	"ünmeli", "anmaz", "enmez", "ınmaz", "inmez", "unmaz", "ünmez", "ılmak", "ilmek", "ulmak", "ülmek", "ılır", "ilir", "ulur", "ülür", "ılınıyor",
	"iliniyor", "ulunuyor", "ülüyor", "ıldı", "ildi", "uldu", "üldü", "ılmış", "ilmiş", "ulmuş", "ülmül", "ılacak", "ilecek", "ulacak", "ülecek",
	"ılmıştı", "ilmişti", "ulmuştu", "ülmüştü", "ılıyordu", "iliyordu", "uluyordu", "ülüyordu", "necekti", "nacaktı", "ılsa", "ilse", "ulsa", "ülse",
	"ılmalı", "ilmeli", "ulmalı", "ülmeli", "ılmaz", "ilmez", "ulmaz", "ülmez" ];

import { nonPassivesFullForms, nonPassiveStems } from "../../turkish/passiveVoice/nonPassivesTurkish";

const passivePrefixIndonesian = "di";
import nonPassivesIndonesianFactory from "../../indonesian/passiveVoice/nonPassiveVerbsStartingDi";
const nonPassivesIndonesian = nonPassivesIndonesianFactory();

import getPassiveVerbsArabicFactory from "../../arabic/passiveVoice/passiveVerbsWithLongVowel";
const getPassiveVerbsArabic = getPassiveVerbsArabicFactory();

import getNifalVerbsHebrewFactory from "../../hebrew/passiveVoice/regularRootsNifal";
const nifalVerbsHebrew = getNifalVerbsHebrewFactory();

import getPualVerbsHebrewFactory from "../../hebrew/passiveVoice/regularRootsPual";
const pualVerbsHebrew = getPualVerbsHebrewFactory();

import getHufalVerbsHebrewFactory from "../../hebrew/passiveVoice/regularRootsHufal";
import { removeSuffixesFromFullForm, removeSuffixFromFullForm } from "../../../morphology/morphoHelpers/stemHelpers";
const hufalVerbsHebrew = getHufalVerbsHebrewFactory();

/**
 * Matches the sentence against passive verbs.
 *
 * @param {string} sentence       The sentence to match against.
 * @param {Array}  passiveVerbs   The array containing passive verb-forms.
 *
 * @returns {Array}               The found passive verbs.
 */
const matchPassiveVerbs = function( sentence, passiveVerbs ) {
	return filter( getWords( sentence ), function( word ) {
		return passiveVerbs.includes( word.toLocaleLowerCase() );
	} );
};

/**
 * Checks the passed sentence to see if it contains passive verb-forms.
 *
 * @param {string} sentence   The sentence to match against.
 * @param {string} language   The language of the text.
 *
 * @returns {Boolean}         Whether the sentence contains passive voice.
 */
const determineSentenceIsPassiveListBased = function( sentence, language ) {
	let passiveVerbs = [];

	switch ( language ) {
		case "ru":
			passiveVerbs = getPassiveVerbsRussian;
			break;
		case "sv":
			passiveVerbs = getPassiveVerbsSwedish;
			break;
	}
	return matchPassiveVerbs( sentence, passiveVerbs ).length !== 0;
};

/**
 * Checks the passed sentence to see if it contains Indonesian passive verb-forms.
 *
 * @param {string} sentence   The sentence to match against.
 *
 * @returns {Boolean}         Whether the sentence contains Indonesian passive voice.
 */
const determineSentenceIsPassiveIndonesian = function( sentence ) {
	const words = getWords( sentence );
	let matchedPassives = words.filter( word => ( word.length > 4 ) );
	matchedPassives = matchedPassives.filter( word => ( word.startsWith( passivePrefixIndonesian ) ) );
	if ( matchedPassives.length === 0 ) {
		return false;
	}

	// Check exception list.
	for ( const nonPassive of nonPassivesIndonesian ) {
		matchedPassives = matchedPassives.filter( word => ( ! word.startsWith( nonPassive ) ) );
	}

	// Check direct precedence exceptions.
	matchedPassives = matchedPassives.filter( function( matchedPassive ) {
		let matchedPassivesShouldStay = true;
		const passiveIndex = words.indexOf( matchedPassive );
		const wordPrecedingPassive = words[ passiveIndex - 1 ];
		if ( wordPrecedingPassive === "untuk" ) {
			matchedPassivesShouldStay = false;
		}
		return matchedPassivesShouldStay;
	} );
	return matchedPassives.length !== 0;
};

/**
 * Checks the passed sentence to see if it contains Turkish passive verb forms. check exception full forms.
 * then remove ending. check for stemming exceptionss. if not found in tsemming exceptions, it is passive.
 *
 * @param {string} word   The word to check
 *
 * @returns {array}       The filtered passive
 */
const checkTurkishNonPassivesList = function( nonPassivesTurkish, passiveEndings, matchedPassives ) {
	return matchedPassives.filter( passive => nonPassivesTurkish.some( stem => passiveEndings.some( function( ending ) {
		const pattern =  new RegExp( "^" + stem + ending + "$" );
		return ! pattern.test( passive );
	} ) ) );
};

/**
 * Checks the passed sentence to see if it contains Turkish passive verb forms. check exception full forms.
 * then remove ending. check for stemming exceptionss. if not found in tsemming exceptions, it is passive.
 *
 * @param {string} sentence   The sentence to match against.
 *
 * @returns {Boolean}         Whether the sentence contains Turkish passive voice.
 */
const determineSentenceIsPassiveTurkish = function( sentence ) {
	const words = getWords( sentence );
	let matchedPassives = words.filter( word => ( word.length > 5 ) );
	matchedPassives = matchedPassives.filter( word => ! nonPassivesFullForms.includes( word ) );
	matchedPassives = checkTurkishNonPassivesList( nonPassiveStems, passiveEndingsTurkish, matchedPassives );
	console.log(matchedPassives )
	return  matchedPassives.some( word => passiveEndingsTurkish.some( ending => word.endsWith( ending ) ) );
};

/**
 * Checks the passed sentence to see if it contains Arabic passive verb-forms.
 *
 * @param {string} sentence     The sentence to match against.
 *
 * @returns {Boolean}           Whether the sentence contains Arabic passive voice.
 */
const determineSentenceIsPassiveArabic = function( sentence ) {
	const arabicPrepositionalPrefix =  "و";
	const words = getWords( sentence );
	const passiveVerbs = [];

	for ( let word of words ) {
		// Check if the word starts with prefix و
		if ( word.startsWith( arabicPrepositionalPrefix ) ) {
			word = word.slice( 1 );
		}
		let wordWithDamma = -1;
		// Check if the first character has a damma or if the word is in the list of Arabic passive verbs
		if ( word.length >= 2 ) {
			wordWithDamma = word[ 1 ].search( "\u064F" );
		}
		if ( wordWithDamma !== -1 || getPassiveVerbsArabic.includes( word ) ) {
			passiveVerbs.push( word );
		}
	}

	return passiveVerbs.length !== 0;
};

/**
 * Checks if the input word's root is in the Hebrew verb roots list.
 *
 * @param {string} word             The word to check.
 * @param {string[]} verbRootsList  The Hebrew verb roots list.
 * @param {Object[]} affixesList    The list of prefixes and suffixes.
 *
 * @returns {Boolean}           Returns true if the root of the input word is in the list.
 */
const checkHebrewVerbRootsList = function( word, verbRootsList, affixesList ) {
	return verbRootsList.some( root => affixesList.some( function( affixes ) {
		const pattern =  new RegExp( "^" + affixes.prefix + root + affixes.suffix + "$" );
		return pattern.test( word );
	} ) );
};

/**
 * Checks the passed sentence to see if it contains Hebrew passive verb-forms.
 *
 * @param {string} sentence    The sentence to match against.
 *
 * @returns {Boolean}          Whether the sentence contains Hebrew passive voice.
 */
const determineSentenceIsPassiveHebrew = function( sentence ) {
	const words = getWords( sentence );
	for ( const word of words ) {
		// The list of prefixes and suffixes for nif'al.
		const nifalAffixes =  [
			{ prefix: "(נ|אי|תי|הי|יי|ני|להי)", suffix: "" },
			{ prefix: "(תי|הי)", suffix: "(י|ו|נה)" },
			{ prefix: "נ", suffix: "(ים|ת|ות|תי|ה|נו|תם|תן|ו)" },
			{ prefix: "יי", suffix: "ו" },
		];

		// Check if the root is in nif'al.
		const nifalPassive = checkHebrewVerbRootsList( word, nifalVerbsHebrew, nifalAffixes );

		if ( nifalPassive ) {
			return true;
		}

		// The list of prefixes and suffixes for pu'al.
		const pualAffixes = [
			{ prefix: "(מ|א|ת|י|נ)", suffix: "" },
			{ prefix: "תי", suffix: "נה" },
			{ prefix: "מ", suffix: "(ת|ים|ות)" },
			{ prefix: "ת", suffix: "(י|ו|נה)" },
			{ prefix: "י", suffix: "ו" },
			{ prefix: "", suffix: "(תי|ת|ה|נו|תם|תן|ו)" },
			{ prefix: "", suffix: "" },
		];
		const pualInfix = "ו";

		// Check if the root is in pu'al.
		const pualPassive = pualVerbsHebrew.some( root => pualAffixes.some( function( affixes ) {
			const pualPattern = new RegExp( "^" + affixes.prefix + root[ 0 ] + pualInfix + root[ 1 ] + root[ 2 ] + affixes.suffix + "$" );

			return pualPattern.test( word );
		} ) );

		if ( pualPassive ) {
			return true;
		}

		// The list of prefixes and suffixes for huf'al.
		const hufalAffixes = [
			{ prefix: "(מו|הו|או|תו|יו|נו)", suffix: "" },
			{ prefix: "מו", suffix: "(ת|ים|ות)" },
			{ prefix: "הו", suffix: "(תי|ת|ית|ה|נו|תם|תן|ו)" },
			{ prefix: "תו", suffix: "(ו|נה|י)" },
			{ prefix: "יו", suffix: "ו" },
		];

		// Check if the root is in huf'al.
		const hufalPassive = checkHebrewVerbRootsList( word, hufalVerbsHebrew, hufalAffixes );

		if ( hufalPassive ) {
			return true;
		}
	}

	return false;
};

/**
 * Determines whether a sentence is passive.
 *
 * @param {string} sentenceText     The sentence to determine voice for.
 * @param {string} language         The language of the sentence part.
 *
 * @returns {boolean}               Returns true if passive, otherwise returns false.
 */
export default function( sentenceText, language ) {
	if ( [ "ru", "sv" ].includes( language ) ) {
		return determineSentenceIsPassiveListBased( sentenceText, language );
	}

	if ( language === "id" ) {
		return determineSentenceIsPassiveIndonesian( sentenceText );
	}

	if ( language === "tr" ) {
		return determineSentenceIsPassiveTurkish( sentenceText );
	}

	if ( language === "ar" ) {
		return determineSentenceIsPassiveArabic( sentenceText );
	}
	if ( language === "he" ) {
		return determineSentenceIsPassiveHebrew( sentenceText );
	}
}
