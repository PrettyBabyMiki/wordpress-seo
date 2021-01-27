import AbstractResearcher from "../../AbstractResearcher";

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import { all as functionWords } from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";
import sentenceLength from "./config/sentenceLength";

// All helpers
import getStemmer from "./helpers/getStemmer";
import isPassiveSentence from "./helpers/isPassiveSentence";

/**
 * The researches contains all the researches
 */
export default class Researcher extends AbstractResearcher {
	/**
	 * Constructor
	 * @param {Paper} paper The Paper object that is needed within the researches.
	 * @constructor
	 */
	constructor( paper ) {
		super( paper );

		// Delete the researches that are not available for Indonesian.
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.stopWordsInUrl;
		delete this.defaultResearches.stopWordsInKeyword;

		Object.assign( this.config, {
			language: "id",
			isPeriphrastic: false,
			firstWordExceptions,
			functionWords,
			transitionWords,
			twoPartTransitionWords,
			sentenceLength,
		} );

		Object.assign( this.helpers, {
			getStemmer,
			isPassiveSentence,
		} );
	}
}
