const prefix = "SNIPPET_EDITOR"

export const SNIPPET_EDITOR_SWITCH_MODE = `${ prefix }_SWITCH_MODE`;
export const SNIPPET_EDITOR_UPDATE_DATA = `${ prefix }_UPDATE_DATA`;
export const SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE = `${ prefix }_UPDATE_REPLACEMENT_VARIABLE`;

/**
 * Switches mode of the snippet editor.
 *
 * @param {string} mode The mode the snippet editor should be in.
 *
 * @returns {Object} An action for redux.
 */
export function switchMode( mode ) {
	return {
		type: SNIPPET_EDITOR_SWITCH_MODE,
		mode,
	};
}

/**
 * Updates the data of the snippet editor.
 *
 * @param {Object} data             The snippet editor data.
 * @param {string} data.title       The title in the snippet editor.
 * @param {string} data.slug        The slug in the snippet editor.
 * @param {string} data.description The description in the snippet editor.
 *
 * @returns {Object} An action for redux.
 */
export function updateData( data ) {
	return {
		type: SNIPPET_EDITOR_UPDATE_DATA,
		data,
	};
}

/**
 * Updates replacement variables in redux.
 *
 * @param {string} name  The name of the replacement variable.
 * @param {string} value The value of the replacement variable.
 *
 * @returns {Object} An action for redux.
 */
export function updateReplacementVariable( name, value ) {
	return {
		type: SNIPPET_EDITOR_UPDATE_REPLACEMENT_VARIABLE,
		name,
		value,
	};
}
