/**
 * Gets the primary taxonomy term id for the give taxonomy.
 *
 * @param {Object} state    The state.
 * @param {string} taxonomy The primary taxonomy to retrieve.
 *
 * @returns {string} Primary taxonomy term id.
 */
export function getPrimaryTaxonomy( state, taxonomy ) {
	return state.primaryTaxonomies[ taxonomy ];
}
