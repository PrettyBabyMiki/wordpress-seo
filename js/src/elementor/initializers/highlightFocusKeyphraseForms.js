import { dispatch, select, subscribe } from "@wordpress/data";
import {
	flatten,
	uniq,
} from "lodash";
import { Paper } from "yoastseo";

/**
 * Runs the morpohology research and updates the store.
 *
 * @param {function} runResearch Runs the research.
 * @param {string} focusKeyphrase The focus keyphrase.
 *
 * @returns {void}
 */
function runMorphologyResearch( runResearch, focusKeyphrase ) {
	const { updateWordsToHighlight } = dispatch( "yoast-seo/editor" );

	runResearch( "morphology", new Paper( "", { keyword: focusKeyphrase } ) )
		.then( ( { result: { keyphraseForms } } ) => {
			updateWordsToHighlight( uniq( flatten( keyphraseForms ) ) );
		} )
		.catch( () => {
			updateWordsToHighlight( [] );
		} );
}

/**
 * Initializes the focus keyphrase forms watcher.
 *
 * @param {function} runResearch Runs a research.
 *
 * @returns {void}
 */
export default function initHighlightFocusKeyphraseForms( runResearch ) {
	const { getFocusKeyphrase } = select( "yoast-seo/editor" );

	let previousFocusKeyphrase = getFocusKeyphrase();

	// Listen to focus keyphrase changes.
	subscribe( () => {
		const currentFocusKeyphrase = getFocusKeyphrase();

		if ( previousFocusKeyphrase !== currentFocusKeyphrase ) {
			previousFocusKeyphrase = currentFocusKeyphrase;
			runMorphologyResearch( runResearch, currentFocusKeyphrase );
		}
	} );

	// Runs the research on the initial focus keyphrase.
	runMorphologyResearch( runResearch, previousFocusKeyphrase );
}
