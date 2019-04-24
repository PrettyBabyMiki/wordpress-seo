/* External imports */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { defineMessages, injectIntl, intlShape } from "react-intl";

/* Yoast dependencies */
import { YoastButton, SvgIcon, YoastLinkButton } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";
import { colors, breakpoints } from "@yoast/style-guide";

/* Internal imports */
import ArticleContent from "./ArticleContent";

const messages = defineMessages( {
	searchResult: {
		id: "searchResultDetail.searchResult",
		defaultMessage: "Search result",
	},
	openButton: {
		id: "searchResultDetail.openButton",
		defaultMessage: "View in KB",
	},
	openButtonLabel: {
		id: "searchResultDetail.openButtonLabel",
		defaultMessage: "Open the knowledge base article in a new window or read it in the iframe below",
	},
	backButton: {
		id: "searchResultDetail.backButton",
		defaultMessage: "Go back",
	},
	backButtonLabel: {
		id: "searchResultDetail.backButtonLabel",
		defaultMessage: "Go back to the search results",
	},
	iframeTitle: {
		id: "searchResultDetail.iframeTitle",
		defaultMessage: "Knowledge base article",
	},
} );

const Detail = styled.section`
	outline: none;

	@media screen and ( max-width: ${ breakpoints.mobile } ) {
		margin: 0 -16px;
	}
`;

const Nav = styled.nav`
	padding: 0 16px 16px;
`;

const RightYoastLinkButton = makeOutboundLink( styled( YoastLinkButton )`
	float: right;
` );

/**
 * Create the JSX to render the SearchResultDetail component.
 *
 * @param {object} props The React props.
 *
 * @returns {ReactElement} A SearchResultDetail component.
 */
class SearchResultDetail extends React.Component {
	/**
	 * Creates navigational elements.
	 *
	 * @returns {ReactElement} The rendered element.
	 */
	createNavigation() {
		const formatMessage = this.props.intl.formatMessage;
		const openButtonText = formatMessage( messages.openButton );
		const openButtonLabel = formatMessage( messages.openButtonLabel );
		const backButtonText = formatMessage( messages.backButton );
		const backButtonLabel = formatMessage( messages.backButtonLabel );
		return (
			<Nav>
				<YoastButton aria-label={ backButtonLabel } onClick={ this.props.onBackButtonClicked }>
					<SvgIcon
						size="24px"
						color={ colors.$color_white }
						icon="angle-left"
					/>
					{ backButtonText }
				</YoastButton>
				<RightYoastLinkButton
					href={ this.props.post.permalink }
					aria-label={ openButtonLabel }
				>
					{ openButtonText }
					<SvgIcon
						size="24px"
						color={ colors.$color_white }
						icon="angle-right"
					/>
				</RightYoastLinkButton>
			</Nav>
		);
	}

	/**
	 * Renders the search result detail.
	 *
	 * @returns {ReactElement} The rendered element.
	 */
	render() {
		const formatMessage = this.props.intl.formatMessage;
		const searchResulLabel = formatMessage( messages.searchResult );
		const iframeTitle = formatMessage( messages.iframeTitle );
		return (
			<Detail
				aria-label={ searchResulLabel }
				tabIndex="-1"
				ref={ ( el ) => {
					this.detailWrapper = el;
				} }
			>
				{ this.createNavigation() }
				<ArticleContent post={ this.props.post } title={ iframeTitle } />
			</Detail>
		);
	}

	/**
	 * When the component mounts, set focus on the search detail wrapper.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		if ( this.detailWrapper !== null ) {
			this.detailWrapper.focus();
		}
	}
}

SearchResultDetail.propTypes = {
	post: PropTypes.object.isRequired,
	onBackButtonClicked: PropTypes.func.isRequired,
	intl: intlShape.isRequired,
};

export default injectIntl( SearchResultDetail );
