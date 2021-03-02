import AbstractResearcher from "../../AbstractResearcher";

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import stopWords from "./config/stopWords";
import { all as functionWords } from "./config/functionWords";

// All helpers
import getSentenceParts from "./helpers/getSentenceParts";
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
		Object.assign( this.config, {
			language: "cz",
			passiveConstructionType: "periphrastic",
			firstWordExceptions,
			stopWords,
			functionWords,
		} );

		Object.assign( this.helpers, {
			getSentenceParts,
			isPassiveSentencePart,
		} );
	}
}
