import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";

// All helpers
import getStemmer from "./helpers/getStemmer";

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

		// Deletes researches that are not available for languages that we haven't supported yet.
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.getPassiveVoiceResult;
		delete this.defaultResearches.getSentenceBeginnings;
		delete this.defaultResearches.functionWordsInKeyphrase;

		Object.assign( this.config, {
			language: "el",
			functionWords: [],
			transitionWords,
			twoPartTransitionWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
		} );
	}
}
