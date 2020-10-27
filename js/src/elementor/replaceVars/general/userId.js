/**
 * Returns the replacement for the %%userid%% variable.
 * @returns {string} The userid string.
 */
function getReplacement() {
	return window.wpseoScriptData.analysis.plugins.replaceVars.userid || "";
}

/**
 * Replaces the %%userid%% variable in a text if in scope.
 *
 * @param {string} text The text to replace the variable in.
 * @returns {string} The modified text.
 */
export default function replace( text ) {
	return text.replace(
		new RegExp( "%%userid%%", "g" ),
		getReplacement()
	);
}
