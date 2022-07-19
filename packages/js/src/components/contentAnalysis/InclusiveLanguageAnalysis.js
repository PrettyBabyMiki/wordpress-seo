/* global wpseoAdminL10n */
/* External components */
import { withSelect } from "@wordpress/data";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { isNil } from "lodash-es";
import PropTypes from "prop-types";
import styled from "styled-components";

/* Internal components */
import ScoreIconPortal from "../portals/ScoreIconPortal";
import Results from "../../containers/Results";
import Collapsible from "../SidebarCollapsible";
import getIndicatorForScore from "../../analysis/getIndicatorForScore";
import { getIconForScore } from "./mapResults";
import { LocationConsumer } from "@yoast/externals/contexts";
import HelpLink from "../HelpLink";
import ReadabilityResultsPortal from "../portals/ReadabilityResultsPortal";
import Portal from "../portals/Portal";

const AnalysisHeader = styled.span`
	font-size: 1em;
	font-weight: bold;
	margin: 0 0 8px;
	display: block;
`;

const InclusiveLanguageResultsTabContainer = styled.div`
	padding: 16px;
`;

const StyledHelpLink = styled( HelpLink )`
	margin: -8px 0 -4px 4px;
`;

/**
 * The inclusive language analysis component.
 *
 * @param {Object} props The properties.
 *
 * @param {MappedResult[]} props.results The assessment results.
 * @param {number} props.overallScore The overall analysis score.
 * @param {"enabled"|"disabled"} props.markedButtonStatus The status of the mark buttons.
 *
 * @returns {JSX.Element} The inclusive language analysis component.
 */
const InclusiveLanguageAnalysis = ( props ) => {
	/**
	 * Renders the results of the analysis.
	 *
	 * @returns {JSX.Element} The results of the analysis.
	 */
	function renderResults() {
		return (
			<Fragment>
				<AnalysisHeader>
					{ __( "Problematic phrases", "wordpress-seo" ) }
					<StyledHelpLink
						href={ wpseoAdminL10n[ "shortlinks.inclusive_language_analysis_info" ] }
						className="dashicons"
					>
						<span className="screen-reader-text">
							{ __( "Learn more about the inclusive language analysis", "wordpress-seo" ) }
						</span>
					</StyledHelpLink>
				</AnalysisHeader>
				<Results
					results={ props.results }
					marksButtonClassName="yoast-tooltip yoast-tooltip-w"
					marksButtonStatus={ props.marksButtonStatus }
					resultCategoryLabels={ {
						problems: __( "Non-inclusive phrases", "wordpress-seo" ),
						improvements: __( "Potentially non-inclusive phrases", "wordpress-seo" ),
					} }
				/>
			</Fragment>
		);
	}

	/**
	 * Renders a feedback string for when no non-inclusive phrases are detected.
	 *
	 * @returns {JSX.Element} The feedback string.
	 */
	function renderGoodJob() {
		return <p>{ __( "We haven't detected any potentially non-inclusive phrases. Great work!", "wordpress-seo" ) }</p>;
	}

	const score = getIndicatorForScore( props.overallScore );

	if ( isNil( props.overallScore ) ) {
		score.className = "loading";
	}

	return (
		<LocationConsumer>
			{ location => {
				if ( location === "sidebar" ) {
					return (
						<Collapsible
							title={ __( "Inclusive language", "wordpress-seo" ) }
							titleScreenReaderText={ score.screenReaderReadabilityText }
							prefixIcon={ getIconForScore( score.className ) }
							prefixIconCollapsed={ getIconForScore( score.className ) }
							id={ `yoast-inclusive-language-analysis-collapsible-${ location }` }
							hasBetaBadgeLabel={ true }
						>
							{ props.results.length >= 1 ? renderResults() : renderGoodJob() }
						</Collapsible>
					);
				}

				if ( location === "metabox" ) {
					return (
						<Portal target="wpseo-metabox-inclusive-language-root">
							<InclusiveLanguageResultsTabContainer>
								<ScoreIconPortal
									target="wpseo-inclusive-language-score-icon"
									scoreIndicator={ score.className }
								/>
								{ props.results.length >= 1 ? renderResults() : renderGoodJob() }
							</InclusiveLanguageResultsTabContainer>
						</Portal>
					);
				}
			} }
		</LocationConsumer>
	);
};

InclusiveLanguageAnalysis.propTypes = {
	results: PropTypes.array,
	marksButtonStatus: PropTypes.oneOf( [ "enabled", "disabled", "hidden" ] ).isRequired,
	overallScore: PropTypes.number,
};

InclusiveLanguageAnalysis.defaultProps = {
	results: [],
	overallScore: null,
};

export default withSelect( select => {
	const {
		getInclusiveLanguageResults,
		getMarkButtonStatus,
	} = select( "yoast-seo/editor" );

	return {
		...getInclusiveLanguageResults(),
		marksButtonStatus: getMarkButtonStatus(),
	};
} )( InclusiveLanguageAnalysis );
