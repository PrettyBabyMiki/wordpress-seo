// External dependencies.
import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";

// Internal dependencies.
import HelpText, { helpTextPropType } from "../../Shared/components/HelpText";
import KeywordInput, { keywordInputPropType } from "../../Shared/components/KeywordInput";
import ContentAnalysis, { contentAnalysisPropType } from "./ContentAnalysis";

export default class SeoAnalysis extends PureComponent {
	/**
	 * Creates the SeoAnalysis component.
	 *
	 * @param {Object} props The passed props.
	 *
	 * @returns {ReactElement} The SeoAnalysis component.
	 */
	constructor( props ) {
		super( props );
	}

	/**
	 * Renders the seo analysis.
	 *
	 * @returns {ReactElement} The rendered seo analysis.
	 */
	render() {
		const { helpText, keywordInput, contentAnalysis } = this.props;

		return (
			<Fragment>
				<HelpText { ...helpText } />
				<KeywordInput { ...keywordInput } />
				<ContentAnalysis { ...contentAnalysis } />
			</Fragment>
		);
	}
}

SeoAnalysis.propTypes = {
	helpText: PropTypes.shape( helpTextPropType ),
	keywordInput: PropTypes.shape( keywordInputPropType ),
	contentAnalysis: PropTypes.shape( contentAnalysisPropType ),
};

SeoAnalysis.defaultProps = {
};
