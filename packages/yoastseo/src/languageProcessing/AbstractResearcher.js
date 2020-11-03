import { merge, isUndefined, isEmpty } from "lodash-es";

import InvalidTypeError from "../errors/invalidType";
import MissingArgument from "../errors/missingArgument";

// All researches in alphabetical order.
import altTagCount from "./researches/altTagCount.js";
import countSentencesFromDescription from "./researches/countSentencesFromDescription.js";
import countSentencesFromText from "./researches/countSentencesFromText.js";
import findKeywordInFirstParagraph from "./researches/findKeywordInFirstParagraph.js";
import findKeywordInPageTitle from "./researches/findKeywordInPageTitle";
import findTransitionWords from "./researches/findTransitionWords";
import functionWordsInKeyphrase from "./researches/functionWordsInKeyphrase";
import getKeywordDensity from "./researches/getKeywordDensity.js";
import getLinks from "./researches/getLinks.js";
import getLinkStatistics from "./researches/getLinkStatistics";
import getParagraphLength from "./researches/getParagraphLength.js";
import getPassiveVoice from "./researches/getPassiveVoice";
import getProminentWordsForInsights from "./researches/getProminentWordsForInsights";
import getProminentWordsForInternalLinking from "./researches/getProminentWordsForInternalLinking";
import getSentenceBeginnings from "./researches/getSentenceBeginnings";
import getSubheadingTextLengths from "./researches/getSubheadingTextLengths.js";
import h1s from "./researches/h1s";
import imageCount from "./researches/imageCount.js";
import keyphraseDistribution from "./researches/keyphraseDistribution";
import keyphraseLength from "./researches/keyphraseLength";
import keywordCount from "./researches/keywordCount";
import keywordCountInUrl from "./researches/keywordCountInUrl";
import linkCount from "./researches/linkCount.js";
import matchKeywordInSubheadings from "./researches/matchKeywordInSubheadings";
import metaDescriptionKeyword from "./researches/metaDescriptionKeyword";
import metaDescriptionLength from "./researches/metaDescriptionLength.js";
import morphology from "./researches/getWordForms";
import pageTitleWidth from "./researches/pageTitleWidth.js";
import readingTime from "./researches/readingTime";
import sentences from "./researches/sentences";
import stopWordsInKeyword from "./researches/stopWordsInKeyword";
import stopWordsInUrl from "./researches/stopWordsInUrl";
import urlLength from "./researches/urlLength.js";
import wordComplexity from "./researches/wordComplexity.js";
import wordCountInText from "./researches/wordCountInText.js";

/**
 * The researches contains all the researches
 */
export default class AbstractResearcher {
	/**
	 * Constructor
	 * @param {Paper} paper The Paper object that is needed within the researches.
	 *
	 * @constructor
	 */
	constructor( paper ) {
		this.paper = paper;

		this.defaultResearches = {
			altTagCount,
			countSentencesFromDescription,
			countSentencesFromText,
			findKeywordInFirstParagraph,
			findKeywordInPageTitle,
			findTransitionWords,
			functionWordsInKeyphrase,
			getKeywordDensity,
			getLinks,
			getLinkStatistics,
			getParagraphLength,
			getPassiveVoice,
			getProminentWordsForInsights,
			getProminentWordsForInternalLinking,
			getSentenceBeginnings,
			getSubheadingTextLengths,
			morphology,
			h1s,
			imageCount,
			keyphraseDistribution,
			keyphraseLength,
			keywordCount,
			keywordCountInUrl,
			linkCount,
			matchKeywordInSubheadings,
			metaDescriptionKeyword,
			metaDescriptionLength,
			pageTitleWidth,
			readingTime,
			sentences,
			stopWordsInKeyword,
			stopWordsInUrl,
			urlLength,
			wordComplexity,
			wordCountInText,
		};

		this._data = {};

		this.customResearches = {};

		this.helpers = {};

		this.config = {};
	}

	/**
	 * Set the Paper associated with the Researcher.
	 *
	 * @param {Paper} paper The Paper to use within the Researcher.
	 *
	 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
	 *
	 * @returns {void}
	 */
	setPaper( paper ) {
		this.paper = paper;
	}

	/**
	 * Add a custom research that will be available within the Researcher.
	 *
	 * @param {string}   name     A name to reference the research by.
	 * @param {function} research The function to be added to the Researcher.
	 *
	 * @throws {MissingArgument}  Research name cannot be empty.
	 * @throws {InvalidTypeError} The research requires a valid Function callback.
	 *
	 * @returns {void}
	 */
	addResearch( name, research ) {
		if ( isUndefined( name ) || isEmpty( name ) ) {
			throw new MissingArgument( "Research name cannot be empty" );
		}

		if ( ! ( research instanceof Function ) ) {
			throw new InvalidTypeError( "The research requires a Function callback." );
		}

		this.customResearches[ name ] = research;
	}

	/**
	 * Check whether or not the research is known by the Researcher.
	 *
	 * @param {string} name The name to reference the research by.
	 *
	 * @returns {boolean} Whether or not the research is known by the Researcher.
	 */
	hasResearch( name ) {
		return Object.keys( this.getAvailableResearches() ).filter(
			function( research ) {
				return research === name;
			} ).length > 0;
	}

	/**
	 * Return all available researches.
	 *
	 * @returns {Object} An object containing all available researches.
	 */
	getAvailableResearches() {
		return merge( this.defaultResearches, this.customResearches );
	}

	/**
	 * Return the Research by name.
	 *
	 * @param {string} name The name to reference the research by.
	 *
	 * @returns {*} Returns the result of the research or false if research does not exist.
	 *
	 * @throws {MissingArgument} Research name cannot be empty.
	 */
	getResearch( name ) {
		if ( isUndefined( name ) || isEmpty( name ) ) {
			throw new MissingArgument( "Research name cannot be empty" );
		}

		if ( ! this.hasResearch( name ) ) {
			return false;
		}

		return this.getAvailableResearches()[ name ]( this.paper, this );
	}

	/**
	 * Add research data to the researcher by the research name.
	 *
	 * @param {string} research The identifier of the research.
	 * @param {Object} data     The data object.
	 *
	 * @returns {void}.
	 */
	addResearchData( research, data ) {
		this._data[ research ] = data;
	}

	/**
	 * Return the research data from a research data provider by research name.
	 *
	 * @param {string} research The identifier of the research.
	 *
	 * @returns {*} The data provided by the provider, false if the data do not exist
	 */
	getData( research ) {
		if ( this._data.hasOwnProperty( research ) ) {
			return this._data[ research ];
		}

		return false;
	}

	/**
	 * Return language specific configuration by configuration name.
	 *
	 * @param {string} name The name of the configuration.
	 *
	 * @returns {*} The configuration, false if the configuration does not exist.
	 */
	getConfig( name ) {
		if ( this.config.hasOwnProperty( name ) ) {
			return this.config[ name ];
		}

		return false;
	}

	/**
	 * Return whether or not language specific configuration exists by configuration name.
	 *
	 * @param {string} name The name of the configuration.
	 *
	 * @returns {boolean} Whether or not the configuration exists.
	 */
	hasConfig( name ) {
		return this.config.hasOwnProperty( name );
	}

	/**
	 * Return language specific helper by helper name.
	 *
	 * @param {string} name The name of the helper.
	 *
	 * @returns {*} The helper, false if the helper does not exist.
	 */
	getHelper( name ) {
		if ( this.helpers.hasOwnProperty( name ) ) {
			return this.helpers[ name ];
		}

		return false;
	}
}
