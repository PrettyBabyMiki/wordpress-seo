/* global wpseoAdminL10n */
/* External components */
import { Component, Fragment } from "@wordpress/element";
import { withSelect } from "@wordpress/data";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __, sprintf } from "@wordpress/i18n";
import { isNil } from "lodash-es";

/* Internal components */
import ScoreIconPortal from "../portals/ScoreIconPortal";
import Results from "../../containers/Results";
import Collapsible from "../SidebarCollapsible";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import { getIconForScore } from "./mapResults";
import { LocationConsumer, RootContext } from "@yoast/externals/contexts";
import HelpLink from "../HelpLink";
import ReadabilityResultsPortal from "../portals/ReadabilityResultsPortal";
import { isWordComplexitySupported } from "../../helpers/assessmentUpsellHelpers";
import { addQueryArgs } from "@wordpress/url";

const AnalysisHeader = styled.span`
	font-size: 1em;
	font-weight: bold;
	margin: 0 0 8px;
	display: block;
`;

const ReadabilityResultsTabContainer = styled.div`
	padding: 16px;
`;

const StyledHelpLink = styled( HelpLink )`
	margin: -8px 0 -4px 4px;
`;

/**
 * Redux container for the readability analysis.
 */
class ReadabilityAnalysis extends Component {
	/**
	 * Renders the Readability Analysis results.
	 *
	 * @param {Array} upsellResults The array of upsell results.
	 *
	 * @returns {wp.Element} The Readability Analysis results.
	 */
	renderResults( upsellResults ) {
		return (
			<Fragment>
				<AnalysisHeader>
					{ __( "Analysis results", "wordpress-seo" ) }
					<StyledHelpLink
						href={ wpseoAdminL10n[ "shortlinks.readability_analysis_info" ] }
						className="dashicons"
					>
						<span className="screen-reader-text">
							{ __( "Learn more about the readability analysis", "wordpress-seo" ) }
						</span>
					</StyledHelpLink>
				</AnalysisHeader>
				<Results
					results={ this.props.results }
					upsellResults={ upsellResults }
					marksButtonClassName="yoast-tooltip yoast-tooltip-w"
					marksButtonStatus={ this.props.marksButtonStatus }
				/>
			</Fragment>
		);
	}

	/**
	 * Returns the list of results used to upsell the user to Premium.
	 *
	 * @param {string} location Where this component is rendered (metabox or sidebar).
	 * @param {string} locationContext In which editor this component is rendered.
	 *
	 * @returns {Array} The upsell results.
	 */
	getUpsellResults( location, locationContext ) {
		let link = wpseoAdminL10n[ "shortlinks.upsell.metabox.word_complexity" ];
		if ( location === "sidebar" ) {
			link = wpseoAdminL10n[ "shortlinks.upsell.sidebar.word_complexity" ];
		}

		link = addQueryArgs( link, { context: locationContext } );

		/*
		 * We don't show the upsell in WooCommerce product pages when Yoast SEO WooCommerce plugin is activated.
		 * This is because the premium assessments of the upsell are already loaded even when the Premium plugin is not activated.
		 * Additionally, we also don't show the upsell for Word complexity assessment if it's not supported for the current locale.
		 */
		const contentType = wpseoAdminL10n.postType;
		if ( ( this.props.isYoastSEOWooActive && contentType === "product" ) || ! isWordComplexitySupported() ) {
			return [];
		}

		const wordComplexityUpsellText = sprintf(
			/* Translators: %1$s is a span tag that adds styling to 'Word complexity', %2$s is a closing span tag.
			   %3$s is an anchor tag with a link to yoast.com, %4$s is a closing anchor tag.*/
			__(
				"%1$sWord complexity%2$s: Is your vocabulary suited for a larger audience? %3$sYoast SEO Premium will tell you!%4$s",
				"wordpress-seo"
			),
			"<span style='text-decoration: underline'>",
			"</span>",
			`<a href="${ link }" data-action="load-nfd-ctb" data-ctb-id="57d6a568-783c-45e2-a388-847cff155897">`,
			"</a>"
		);

		return [
			{
				score: 0,
				rating: "upsell",
				hasMarks: false,
				id: "wordComplexity",
				text: wordComplexityUpsellText,
				markerId: "wordComplexity",
			},
		];
	}

	/**
	 * Renders the Readability Analysis component.
	 *
	 * @returns {wp.Element} The Readability Analysis component.
	 */
	render() {
		const score = getIndicatorForScore( this.props.overallScore );

		if ( isNil( this.props.overallScore ) ) {
			score.className = "loading";
		}

		return (
			<LocationConsumer>
				{ location => {
					return (
						<RootContext.Consumer>
							{ ( { locationContext } ) => {
								let upsellResults = [];
								if ( this.props.shouldUpsell ) {
									upsellResults = this.getUpsellResults( location, locationContext );
								}
								if ( location === "sidebar" ) {
									return (
										<Collapsible
											title={ __( "Readability analysis", "wordpress-seo" ) }
											titleScreenReaderText={ score.screenReaderReadabilityText }
											prefixIcon={ getIconForScore( score.className ) }
											prefixIconCollapsed={ getIconForScore( score.className ) }
											id={ `yoast-readability-analysis-collapsible-${ location }` }
										>
											{ this.renderResults( upsellResults ) }
										</Collapsible>
									);
								}

								if ( location === "metabox" ) {
									return (
										<ReadabilityResultsPortal target="wpseo-metabox-readability-root">
											<ReadabilityResultsTabContainer>
												<ScoreIconPortal
													target="wpseo-readability-score-icon"
													scoreIndicator={ score.className }
												/>
												{ this.renderResults( upsellResults ) }
											</ReadabilityResultsTabContainer>
										</ReadabilityResultsPortal>
									);
								}
							} }
						</RootContext.Consumer>
					);
				} }
			</LocationConsumer>
		);
	}
}

ReadabilityAnalysis.propTypes = {
	results: PropTypes.array.isRequired,
	marksButtonStatus: PropTypes.string.isRequired,
	overallScore: PropTypes.number,
	shouldUpsell: PropTypes.bool,
	isYoastSEOWooActive: PropTypes.bool,
};

ReadabilityAnalysis.defaultProps = {
	overallScore: null,
	shouldUpsell: false,
	isYoastSEOWooActive: false,
};

export default withSelect( select => {
	const {
		getReadabilityResults,
		getMarkButtonStatus,
	} = select( "yoast-seo/editor" );

	return {
		...getReadabilityResults(),
		marksButtonStatus: getMarkButtonStatus(),
	};
} )( ReadabilityAnalysis );
