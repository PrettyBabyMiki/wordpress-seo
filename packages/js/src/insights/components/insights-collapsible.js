import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import PropTypes from "prop-types";
import MetaboxCollapsible from "../../components/MetaboxCollapsible";
import EstimatedReadingTime from "./estimated-reading-time";
import FleschReadingEase from "./flesch-reading-ease";
import ProminentWords from "./prominent-words";
import TextLength from "./text-length";
import TextFormality from "./text-formality";

/**
 * Insights collapsible component.
 * @param {string} location The location of this modal.
 * @returns {JSX.Element} The element.
 */
const InsightsCollapsible = ( { location } ) => {
	const isFleschReadingEaseAvailable = useSelect( select => select( "yoast-seo/editor" ).isFleschReadingEaseAvailable(), [] );
	const isTextFormalityAvailable = useSelect( select => select( "yoast-seo-premium/editor" )?.isTextFormalityAvailable(), [] );
	console.log( isTextFormalityAvailable );

	return (
		<MetaboxCollapsible
			title={ __( "Insights", "wordpress-seo" ) }
			id={ `yoast-insights-collapsible-${ location }` }
			className="yoast-insights"
		>
			<ProminentWords location={ location } />
			<div>
				{ isFleschReadingEaseAvailable && <div className="yoast-insights-row">
					<FleschReadingEase />
				</div> }
				<div className="yoast-insights-row yoast-insights-row--columns">
					<EstimatedReadingTime />
					<TextLength />
				</div>
				{ isTextFormalityAvailable && <div>
					<TextFormality location={ location } />
				</div> }
			</div>
		</MetaboxCollapsible>
	);
};

InsightsCollapsible.propTypes = {
	location: PropTypes.string,
};

InsightsCollapsible.defaultProps = {
	location: "metabox",
};

export default InsightsCollapsible;
