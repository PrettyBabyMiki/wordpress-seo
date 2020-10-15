import { get } from "lodash";

/**
 * Gets the replacementVariables from the state.
 *
 * @param {Object} state The state object.
 *
 * @returns {Object[]} The replacementVariables.
 */
export const getReplaceVars = state => get( state, "snippetEditor.replacementVariables", [] );

/**
 * Gets the snippet editor mode.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor mode.
 */
export const getSnippetEditorMode = state => get( state, "snippetEditor.mode", "mobile" );

/**
 * Gets the snippet editor title.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor title.
 */
export const getSnippetEditorTitle = state => get( state, "snippetEditor.data.title", "" );

/**
 * Gets the snippet editor description.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor description.
 */
export const getSnippetEditorDescription = state => get( state, "snippetEditor.data.description", "" );

/**
 * Gets the snippet editor slug.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet editor slug.
 */
export const getSnippetEditorSlug = state => get( state, "snippetEditor.data.slug", "" );

/**
 * Gets the snippet preview image URL.
 *
 * @param {Object} state The state object.
 *
 * @returns {string} The snippet preview image URL.
 */
export const getSnippetPreviewImageUrl = state => get( state, "snippetEditor.data.snippetPreviewImageURL", "" );
