import { withSelect, withDispatch } from "@wordpress/data";
import { compose } from "@wordpress/compose";

import PrePublish from "../components/PrePublish";
import {
	maybeAddReadabilityCheck,
	maybeAddFocusKeyphraseCheck,
	maybeAddSchemaBlocksValidationCheck,
	maybeAddSEOCheck,
} from "../helpers/addCheckToChecklist";

/**
 * Maps the select function to props for the checklist.
 *
 * @param {function} select The WordPress select function.
 *
 * @returns {{checklist: []}} The props for the checklist.
 */
export function mapSelectToProps( select ) {
	const data = select( "yoast-seo/editor" );

	const checklist = [];

	maybeAddFocusKeyphraseCheck( checklist, data );
	maybeAddReadabilityCheck( checklist, data );
	maybeAddSEOCheck( checklist, data );
	maybeAddSchemaBlocksValidationCheck( checklist, data );

	return { checklist };
}

/**
 * Maps the dispatch function to props for the checklist.
 *
 * @param {function} dispatch The dispatch function.
 *
 * @returns {{onClick: onClick}} The properties to use.
 */
export function mapDispatchToProps( dispatch ) {
	const { closePublishSidebar, openGeneralSidebar } = dispatch(
		"core/edit-post"
	);
	/**
	 * Closes the publish sidebar and opens the Yoast sidebar.
	 *
	 * @returns {void}
	 */
	const onClick = () => {
		closePublishSidebar();
		openGeneralSidebar( "yoast-seo/seo-sidebar" );
	};

	return { onClick };
}

export default compose( [
	withSelect( mapSelectToProps ),
	withDispatch( mapDispatchToProps ),
] )( PrePublish );
