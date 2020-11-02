import getAllWordsFromPaper from "../../../helpers/morphology/getAllWordsFromPaper";
import parseSynonyms from "../../../helpers/sanitize/parseSynonyms";
import getFunctionWords from "../config/";
import getWordForms from "../../../researches/base/getWordForms";
import { determineStem } from "../morphology/determineStem";
const functionWords = getFunctionWords();

import { get } from "lodash-es";

/**
 * Gets all matching word forms for the keyphrase and synonyms.
 *
 * @param {Paper}       paper       The paper.
 * @param {Researcher}  researcher  The researcher.
 *
 * @returns {Object} Object with an array of keyphrase forms and an array of arrays of synonyms forms, based on the forms
 * found in the text or created forms.
 */
export default function( paper, researcher ) {
	// Collect and process/sanitize all data necessary to create word forms.
	const morphologyData = get( researcher.getData( "morphology" ), "en", false );
	// If no morphology data is available no stemmer should be defined. This is the case for e.g. Free users.
	const stem = morphologyData ? determineStem : null;
	const allWordsFromPaper = getAllWordsFromPaper( paper ).map( word => word.toLocaleLowerCase( "en" ) );
	const keyphrase = paper.getKeyword().toLocaleLowerCase( "en" ).trim();
	const synonyms = parseSynonyms( paper.getSynonyms().toLocaleLowerCase( "en" ).trim() );

	// In English we have function words, a stemmer and morphology data.
	return getWordForms( keyphrase, synonyms, allWordsFromPaper, functionWords, stem, morphologyData, null );
}
