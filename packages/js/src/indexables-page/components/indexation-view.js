
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";

import IconSearch from "../../../images/icon-search.svg";
import Indexation from "./indexation";

/**
 * Renders a page in case the SEO optimization process has not been performed.
 *
 * @returns {WPElement} The IndexationView.
 */
function IndexationView( { setIndexingState } ) {
	return <div
		id="indexation-view"
		className="yst-max-w-full yst-mt-6 yst-flex"
	>
		<div
			className="yst-grid yst-w-[1088px] yst-grid-cols-1 yst-justify-items-center yst-bg-white yst-rounded-lg yst-px-8 yst-py-10 yst-shadow"
		>
			<img src={ IconSearch } alt="Magnifying lens icon" className="yst-mb-4" />
			<h4 className="yst-mb-2 yst-text-base yst-text-gray-900 yst-font-medium yst-leading-tight">{ __( "No data to show yet", "wordpress-seo" ) }</h4>
			<span className="yst-gray-500 yst-font-normal yst-leading-normal">
				{ __( "We would like to show you insights into content that we feel could use improving.", "wordpress-seo" ) }
			</span>
			<span className="yst-gray-500 yst-font-normal yst-leading-normal yst-mb-6">
				{ __( "Help us to analyze your site by running the SEO data optimization below.", "wordpress-seo" ) }
			</span>
			<div className="yst-grid yst-grid-cols-1 yst-justify-items-center yst-w-1/3">
				<Indexation
					preIndexingActions={ window.yoast.indexing.preIndexingActions }
					indexingActions={ window.yoast.indexing.indexingActions }
					indexingStateCallback={ setIndexingState }
				/>
			</div>
		</div>
	</div>;
}

IndexationView.propTypes =  {
	setIndexingState: PropTypes.func.isRequired,
};

export default IndexationView;
