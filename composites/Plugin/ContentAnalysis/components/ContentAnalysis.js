import React from "react";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";
import PropTypes from "prop-types";

import { injectIntl, intlShape, defineMessages, FormattedMessage } from "react-intl";
import { makeOutboundLink } from "../../../../utils/makeOutboundLink";
import AnalysisResult from "../components/AnalysisResult.js";
import AnalysisCollapsible from "../components/AnalysisCollapsible.js";

export const ContentAnalysisContainer = styled.div`
	width: 100%;
	background-color: white;
	max-width: 800px;
	margin: 0 auto;
`;

const LanguageNotice = styled.p`
	min-height: 24px;
	margin-bottom: 8px;
	margin-left: 24px;
`;

const ChangeLanguageLink = makeOutboundLink( styled.a`
	color: ${ colors.$color_blue };
	margin-left: 4px;
` );

const messages = defineMessages( {
	languageNoticeLink: {
		id: "content-analysis.language-notice-link",
		defaultMessage:	"Change language",
	},
	errorsHeader: {
		id: "content-analysis.errors",
		defaultMessage: "Errors",
	},
	problemsHeader: {
		id: "content-analysis.problems",
		defaultMessage: "Problems",
	},
	improvementsHeader: {
		id: "content-analysis.improvements",
		defaultMessage: "Improvements",
	},
	considerationsHeader: {
		id: "content-analysis.considerations",
		defaultMessage: "Considerations",
	},
	goodHeader: {
		id: "content-analysis.good",
		defaultMessage: "Good results",
	},
	highlight: {
		id: "content-analysis.highlight",
		defaultMessage: "Highlight this result in the text",
	},
	noHighlight: {
		id: "content-analysis.nohighlight",
		defaultMessage: "Remove highlight from the text",
	},
	disabledButton: {
		id: "content-analysis.disabledButton",
		defaultMessage: "Marks are disabled in current view",
	},
} );

/**
 * Returns the ContentAnalysis component.
 *
 * @returns {ReactElement} The ContentAnalysis component.
 */
class ContentAnalysis extends React.Component {
	/**
	 * The constructor.
	 *
	 * @param {object} props The component props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = {
			checked: "",
		};
	}

	/**
	 * Handles button clicks. Makes sure no more than one button can be active at the same time.
	 *
	 * @param {string} id The button id.
	 * @param {function} marker Function to apply marker to the editor.
	 *
	 * @returns {void}
	 */
	handleClick( id, marker ) {
		let checkedId = id;

		// Uncheck if button is deactivated.
		if ( id === this.state.checked ) {
			checkedId = "";
		}

		// Set state and call onMarkButtonClick callback.
		this.setState( {
			checked: checkedId,
		}, () => {
			this.props.onMarkButtonClick( this.state.checked, marker );
		} );
	}

	/**
	 * Gets the color for the bullet, based on the rating.
	 *
	 * @param {string} rating The rating of the result.
	 *
	 * @returns {string} The color for the bullet.
	 */
	getColor( rating ) {
		switch ( rating ) {
			case "good":
				return colors.$color_good;
			case "OK":
				return colors.$color_ok;
			case "bad":
				return colors.$color_bad;
			default:
				return colors.$color_score_icon;
		}
	}

	/**
	 * Returns an AnalysisResult component for each result.
	 *
	 * @param {array} results The analysis results.
	 *
	 * @returns {array} A list of AnalysisResult components.
	 */
	getResults( results ) {
		return results.map( ( result ) => {
			let color = this.getColor( result.rating );
			let isPressed = result.id === this.state.checked;
			let ariaLabel = "";
			if ( this.props.marksButtonStatus === "disabled" ) {
				ariaLabel = this.props.intl.formatMessage( messages.disabledButton );
			} else if ( isPressed ) {
				ariaLabel = this.props.intl.formatMessage( messages.noHighlight );
			} else {
				ariaLabel = this.props.intl.formatMessage( messages.highlight );
			}
			return <AnalysisResult
				key={ result.id }
				text={ result.text }
				bulletColor={ color }
				hasMarksButton={ result.hasMarks }
				ariaLabel={ ariaLabel }
				pressed={ isPressed }
				buttonId={ result.id }
				onButtonClick={ this.handleClick.bind( this, result.id, result.marker ) }
				marksButtonClassName={ this.props.marksButtonClassName }
				marksButtonStatus={ this.props.marksButtonStatus }
			/>;
		} );
	}

	/**
	 * Renders the language notice. Provides a link to a setting page in case of
	 * administrator, a notice to contact an administrator otherwise.
	 *
	 * @returns {ReactElement} The rendered language notice.
	 */
	renderLanguageNotice() {
		let showLanguageNotice = this.props.showLanguageNotice;
		let canChangeLanguage = this.props.canChangeLanguage;
		if ( ! showLanguageNotice ) {
			return null;
		}
		if ( canChangeLanguage ) {
			return (
				<LanguageNotice>
					<FormattedMessage
						id="content-analysis.language-notice"
						defaultMessage="Your site language is set to {language}."
						values={ { language: <strong>{ this.props.language }</strong> } } />
					<ChangeLanguageLink href={ this.props.changeLanguageLink }>
						{ this.props.intl.formatMessage( messages.languageNoticeLink ) }
					</ChangeLanguageLink>
				</LanguageNotice>
			);
		}
		return (
			<LanguageNotice>
				<FormattedMessage
					id="content-analysis.language-notice-contact-admin"
					defaultMessage="Your site language is set to {language}. If this is not correct, contact your site administrator."
					values={ { language: <strong>{ this.props.language }</strong> } } />
			</LanguageNotice>
		);
	}

	/**
	 * Renders a ContentAnalysis component.
	 *
	 * @returns {ReactElement} The rendered ContentAnalysis component.
	 */
	render() {
		let problemsResults = this.props.problemsResults;
		let improvementsResults = this.props.improvementsResults;
		let goodResults = this.props.goodResults;
		let considerationsResults = this.props.considerationsResults;
		let errorsResults = this.props.errorsResults;
		let headingLevel = this.props.headingLevel;
		let errorsFound = errorsResults.length;
		let problemsFound = problemsResults.length;
		let improvementsFound = improvementsResults.length;
		let considerationsFound = considerationsResults.length;
		let goodResultsFound = goodResults.length;

		// Analysis collapsibles are only rendered when there is at least one analysis result for that category present.
		return (
			<ContentAnalysisContainer>
				{ this.renderLanguageNotice() }
				{ errorsFound > 0 &&
				<AnalysisCollapsible
					headingLevel={ headingLevel }
					title={ this.props.intl.formatMessage( messages.errorsHeader ) }
				>
					{ this.getResults( errorsResults ) }
				</AnalysisCollapsible> }
				{ problemsFound > 0 &&
					<AnalysisCollapsible
						headingLevel={ headingLevel }
						title={ this.props.intl.formatMessage( messages.problemsHeader ) }
					>
						{ this.getResults( problemsResults ) }
					</AnalysisCollapsible> }
				{ improvementsFound > 0 &&
					<AnalysisCollapsible
						headingLevel={ headingLevel }
						title={ this.props.intl.formatMessage( messages.improvementsHeader ) }
					>
						{ this.getResults( improvementsResults ) }
					</AnalysisCollapsible> }
				{ considerationsFound > 0 &&
					<AnalysisCollapsible
						headingLevel={ headingLevel }
						title={ this.props.intl.formatMessage( messages.considerationsHeader ) }
					>
						{ this.getResults( considerationsResults ) }
					</AnalysisCollapsible> }
				{ goodResultsFound > 0 &&
					<AnalysisCollapsible
						headingLevel={ headingLevel }
						title={this.props.intl.formatMessage( messages.goodHeader ) }
					>
						{ this.getResults( goodResults ) }
					</AnalysisCollapsible> }
			</ContentAnalysisContainer>
		);
	}
}

ContentAnalysis.propTypes = {
	onMarkButtonClick: PropTypes.func,
	problemsResults: PropTypes.array,
	improvementsResults: PropTypes.array,
	goodResults: PropTypes.array,
	considerationsResults: PropTypes.array,
	errorsResults: PropTypes.array,
	changeLanguageLink: PropTypes.string.isRequired,
	canChangeLanguage: PropTypes.bool,
	language: PropTypes.string.isRequired,
	showLanguageNotice: PropTypes.bool,
	headingLevel: PropTypes.number,
	marksButtonStatus: PropTypes.string,
	marksButtonClassName: PropTypes.string,
	intl: intlShape.isRequired,
};

ContentAnalysis.defaultProps = {
	onMarkButtonClick: () => {},
	problemsResults: [],
	improvementsResults: [],
	goodResults: [],
	considerationsResults: [],
	errorsResults: [],
	showLanguageNotice: false,
	canChangeLanguage: false,
	headingLevel: 4,
	marksButtonStatus: "enabled",
};

export default injectIntl( ContentAnalysis );
