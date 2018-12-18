/* External dependencies */
import { Fill } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import React from "react";

/* Internal dependencies */
import CollapsibleCornerstone from "../containers/CollapsibleCornerstone";
import SnippetEditor from "../containers/SnippetEditor";
import Warning from "../containers/Warning";
import ReadabilityAnalysis from "./contentAnalysis/ReadabilityAnalysis";
import SeoAnalysis from "./contentAnalysis/SeoAnalysis";
import Collapsible from "./SidebarCollapsible";
import SidebarItem from "./SidebarItem";
import TopLevelProviders from "./TopLevelProviders";

/**
 * Creates the Metabox component.
 *
 * @param {Object} settings The feature toggles.
 * @param {Object} store    The Redux store.
 * @param {Object} theme    The theme to use.
 *
 * @returns {ReactElement} The Metabox component.
 */
export default function Metabox( { settings, store, theme } ) {
	return (
		<Fragment>
			<Fill name="YoastMetabox">
				<SidebarItem renderPriority={ 1 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "metabox" }
					>
						<Warning />
					</TopLevelProviders>
				</SidebarItem>
				<SidebarItem renderPriority={ 9 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "metabox" }
					>
						<Collapsible
							id={ "yoast-snippet-editor-metabox" }
							title={ __( "Snippet Preview", "wordpress-seo" ) } initialIsOpen={ true }
						>
							<SnippetEditor hasPaperStyle={ false } />
						</Collapsible>
					</TopLevelProviders>
				</SidebarItem>
				{ settings.isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "metabox" }
					>
						<ReadabilityAnalysis />
					</TopLevelProviders>
				</SidebarItem> }
				{ settings.isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "metabox" }
					>
						<SeoAnalysis
							shouldUpsell={ settings.shouldUpsell }
							shouldUpsellWordFormRecognition={ settings.isWordFormRecognitionActive }
						/>
					</TopLevelProviders>
				</SidebarItem> }
				{ settings.isCornerstoneActive && <SidebarItem renderPriority={ 30 }>
					<TopLevelProviders
						store={ store }
						theme={ theme }
						location={ "metabox" }
					>
						<CollapsibleCornerstone />
					</TopLevelProviders>
				</SidebarItem> }
			</Fill>
		</Fragment>
	);
}

Metabox.propTypes = {
	settings: PropTypes.object.isRequired,
	store: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired,
};
