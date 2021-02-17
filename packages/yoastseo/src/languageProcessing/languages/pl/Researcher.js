import AbstractResearcher from "../../AbstractResearcher";

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import { all as functionWords } from "./config/functionWords";
import stopWords from "./config/stopWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";
import sentenceLength from "./config/sentenceLength";

// All helpers
import getSentenceParts from "./helpers/getSentenceParts";
import getStemmer from "./helpers/getStemmer";
import isPassiveSentencePart from "./helpers/isPassiveSentencePart";


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

		// Delete a research(es) that is not available in Polish
		delete this.defaultResearches.getFleschReadingScore;

		Object.assign( this.config, {
			language: "pl",
			passiveConstructionType: "periphrastic",
			firstWordExceptions,
			functionWords,
			stopWords,
			transitionWords,
			twoPartTransitionWords,
			sentenceLength: sentenceLength.regularConfig,
			sentenceLengthCornerstone: sentenceLength.cornerstoneConfig,
		} );

		Object.assign( this.helpers, {
			getSentenceParts,
			getStemmer,
			isPassiveSentencePart,
		} );
	}
}
