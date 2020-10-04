import { forEach, includes } from "lodash-es";
import getWords from "../../../helpers/getWords";
import participlesFactory from "../config/passiveVoice/participles";
import ItalianParticiple from "../config/passiveVoice/ItalianParticiple";

const participles = participlesFactory();

/**
 * Creates participle objects for the participles found in a sentence part.
 *
 * @param {string} sentencePartText The sentence part to find participles in.
 * @param {Array} auxiliaries The list of auxiliaries from the sentence part.
 * @returns {Array} The list with participle objects.
 */
export default function getParticiples( sentencePartText, auxiliaries ) {
	const words = getWords( sentencePartText );
	const foundParticiples = [];

	forEach( words, function( word ) {
		if ( includes( participles, word ) ) {
			foundParticiples.push( new ItalianParticiple( word, sentencePartText,
				{ auxiliaries: auxiliaries, type: type, language: "it" } ) );
		}
	} );
	return foundParticiples;
}
