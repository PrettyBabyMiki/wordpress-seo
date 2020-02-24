// External dependencies.
import PropTypes from "prop-types";

export const replacementVariablesShape = PropTypes.arrayOf( PropTypes.shape( {
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
} ) );

export const recommendedReplacementVariablesShape = PropTypes.arrayOf(
	PropTypes.string,
);
