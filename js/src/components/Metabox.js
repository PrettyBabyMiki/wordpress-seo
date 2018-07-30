/* global wp */

import React from "react";
import PropTypes from "prop-types";

import SidebarItem from "./SidebarItem";
import SnippetEditor from "../containers/SnippetEditor";

import { Provider as StoreProvider } from "react-redux";
import { ThemeProvider } from "styled-components";

/**
 * Creates the Metabox component.
 *
 * @param {bool} isContentAnalysisActive Whether or not the readability analysis is active.
 * @param {bool} isKeywordAnalysisActive Whether or not the SEO analysis is active.
 *
 * @returns {ReactElement} The Metabox component.
 */
export default function Metabox( { isContentAnalysisActive, isKeywordAnalysisActive, store, theme } ) {
	const { Fill } = wp.components;

	return (
		<Fill name="YoastMetabox">
			<StoreProvider store={ store }>
				<SidebarItem renderPriority={ 30 }>
					<ThemeProvider theme={ theme }>
						<SnippetEditor />
					</ThemeProvider>
				</SidebarItem>
			</StoreProvider>
			{ isContentAnalysisActive && <SidebarItem renderPriority={ 10 }>Readability analysis</SidebarItem> }
			{ isKeywordAnalysisActive && <SidebarItem renderPriority={ 20 }>SEO analysis</SidebarItem> }
		</Fill>
	);
}

Metabox.propTypes = {
	isContentAnalysisActive: PropTypes.bool,
	isKeywordAnalysisActive: PropTypes.bool,
	theme: PropTypes.object,
	store: PropTypes.object,
};
