import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import functionWords from "./config/functionWords";
import stopWords from "./config/stopWords";

// All helpers
import getStemmer from "./helpers/getStemmer";
import getClauses from "./helpers/getClauses";

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

		// Delete Flesch Reading Ease research since Norwegian doesn't have the support for it
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.getPassiveVoiceResult;
		delete this.defaultResearches.getSentenceBeginnings;
		delete this.defaultResearches.findTransitionWords;

		Object.assign( this.config, {
			language: "nb",
			passiveConstructionType: "periphrastic",
			functionWords,
			stopWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
			getClauses,
		} );
	}
}
