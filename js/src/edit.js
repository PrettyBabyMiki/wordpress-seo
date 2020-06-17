/* global window wp */
/* External dependencies */
import React from "react";
import styled from "styled-components";
import { Slot, Fill, PanelBody } from "@wordpress/components";
import { Fragment } from "@wordpress/element";
import { combineReducers, registerStore } from "@wordpress/data";
import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@wordpress/i18n";
import { PluginPrePublishPanel, PluginPostPublishPanel } from "@wordpress/edit-post";
import { registerFormatType, applyFormat, isCollapsed } from "@wordpress/rich-text";
import { isURL } from "@wordpress/url";
import {
	get,
	pickBy,
} from "lodash-es";

/* Internal dependencies */
import Data from "./analysis/data.js";
import reducers from "./redux/reducers";
import PluginIcon from "../../images/Yoast_icon_kader.svg";
import ClassicEditorData from "./analysis/classicEditorData.js";
import isGutenbergDataAvailable from "./helpers/isGutenbergDataAvailable";
import Sidebar from "./containers/Sidebar";
import EditLink from "./inline-links/edit-link";
import MetaboxPortal from "./components/MetaboxPortal";
import sortComponentsByRenderPriority from "./helpers/sortComponentsByRenderPriority";
import * as selectors from "./redux/selectors";
import * as actions from "./redux/actions";
import { setSettings } from "./redux/actions/settings";
import UsedKeywords from "./analysis/usedKeywords";
import { setMarkerStatus } from "./redux/actions";
import { isAnnotationAvailable } from "./decorator/gutenberg";
import PrePublish from "./containers/PrePublish";
import DocumentSidebar from "./containers/DocumentSidebar";
import PostPublish from "./containers/PostPublish";

const PLUGIN_NAMESPACE = "yoast-seo";

const PinnedPluginIcon = styled( PluginIcon )`
	width: 20px;
	height: 20px;
`;

/**
 * Contains the Yoast SEO block editor integration.
 */
class Edit {
	/**
	 * @param {Object}   args                                 Edit initialize arguments.
	 * @param {Function} args.onRefreshRequest                The function to refresh the analysis.
	 * @param {Object}   args.replaceVars                     The replaceVars object.
	 * @param {string}   args.snippetEditorBaseUrl            Base URL of the site the user is editing.
	 * @param {string}   args.snippetEditorDate               The date for the snippet editor.
	 * @param {array}    args.recommendedReplacementVariables The recommended replacement variables for this context.
	 * @param {Object}   args.classicEditorDataSettings       Settings for the ClassicEditorData object.
	 */
	constructor( args ) {
		this._localizedData = this.getLocalizedData();
		this._args =          args;
		this.link = {
			name: "yoast-seo/link",
			title: __( "Link", "wordpress-seo" ),
			tagName: "a",
			className: "yoast-seo-link",
			attributes: {
				url: "href",
				target: "target",
				rel: "rel",
			},
			__unstablePasteRule( value, { html, plainText } ) {
				if ( isCollapsed( value ) ) {
					return value;
				}

				const pastedText = ( html || plainText ).replace( /<[^>]+>/g, "" ).trim();

				if ( ! isURL( pastedText ) ) {
					return value;
				}

				return applyFormat( value, {
					type: "yoast-seo/link",
					attributes: {
						url: decodeEntities( pastedText ),
					},
				} );
			},
			edit: EditLink,
		};

		this._init();
	}

	/**
	 * Get the localized data from the global namespace.
	 *
	 * @returns {Object} Localized data.
	 */
	getLocalizedData() {
		return (
			window.wpseoPostScraperL10n ||
			window.wpseoTermScraperL10n ||
			{ intl: {}, isRtl: false }
		);
	}

	_init() {
		this._store = this._registerStoreInGutenberg();

		this._registerPlugin();
		this._registerFormats();

		this._data = this._initializeData();

		this._store.dispatch( setSettings( {
			snippetEditor: {
				baseUrl: this._args.snippetEditorBaseUrl,
				date: this._args.snippetEditorDate,
				recommendedReplacementVariables: this._args.recommendedReplaceVars,
				siteIconUrl: this._localizedData.siteIconUrl,
				socialPreviewImageURL: this._localizedData.social_preview_image_url,
			},
		} ) );
	}

	_registerFormats() {
		[
			this.link,
		].forEach( ( { name, ...settings } ) => {
			if ( name ) {
				registerFormatType( name, settings );
			}
		} );
	}

	/**
	 * Registers a redux store in Gutenberg.
	 *
	 * @returns {Object} The store.
	 */
	_registerStoreInGutenberg() {
		return registerStore( "yoast-seo/editor", {
			reducer: combineReducers( reducers ),
			selectors,
			actions: pickBy( actions, x => typeof x === "function" ),
		} );
	}

	/**
	 * Registers the plugin into the gutenberg editor, creates a sidebar entry for the plugin,
	 * and creates that sidebar's content.
	 *
	 * @returns {void}
	 */
	_registerPlugin() {
		if ( ! isGutenbergDataAvailable() ) {
			return;
		}

		const { PluginSidebar, PluginSidebarMoreMenuItem } = wp.editPost;
		const { registerPlugin } = wp.plugins;
		const store = this._store;
		const pluginTitle = this._localizedData.isPremium ? "Yoast SEO Premium" : "Yoast SEO";

		const theme = {
			isRtl: this._localizedData.isRtl,
		};

		const YoastSidebar = () => (
			<Fragment>
				<PluginSidebarMoreMenuItem
					target="seo-sidebar"
					icon={ <PluginIcon /> }
				>
					{ pluginTitle }
				</PluginSidebarMoreMenuItem>
				<PluginSidebar
					name="seo-sidebar"
					title={ pluginTitle }
				>
					<Slot name="YoastSidebar">
						{ ( fills ) => {
							return sortComponentsByRenderPriority( fills );
						} }
					</Slot>
				</PluginSidebar>
				<Fragment>
					<Sidebar store={ store } theme={ theme } />
					<MetaboxPortal target="wpseo-metabox-root" store={ store } theme={ theme } />
				</Fragment>
				<PluginPrePublishPanel
					className="yoast-seo-sidebar-panel"
					title={ __( "Yoast SEO", "wordpress-seo" ) }
					initialOpen={ true }
					icon={ <Fragment /> }
				>
					<PrePublish />
				</PluginPrePublishPanel>
				<PluginPostPublishPanel
					className="yoast-seo-sidebar-panel"
					title={ __( "Yoast SEO", "wordpress-seo" ) }
					initialOpen={ true }
					icon={ <Fragment /> }
				>
					<PostPublish />
				</PluginPostPublishPanel>
				<Fill name="PluginDocumentSettingPanel">
					<PanelBody
						className="yoast-seo-sidebar-panel"
						title={ __( "Yoast SEO", "wordpress-seo" ) }
						initialOpen={ true }
					>
						<DocumentSidebar />
					</PanelBody>
				</Fill>
			</Fragment>
		);

		registerPlugin( PLUGIN_NAMESPACE, {
			render: YoastSidebar,
			icon: <PinnedPluginIcon />,
		} );
	}

	/**
	 * Initialize the appropriate data class.
	 *
	 * @returns {Object} The instantiated data class.
	 */
	_initializeData() {
		const store  = this._store;
		const args   = this._args;
		const wpData = get( window, "wp.data" );

		// Only use Gutenberg's data if Gutenberg is available.
		if ( isGutenbergDataAvailable() ) {
			const gutenbergData = new Data( wpData, args.onRefreshRequest, store );
			gutenbergData.initialize( args.replaceVars );
			return gutenbergData;
		}

		const classicEditorData = new ClassicEditorData( args.onRefreshRequest, store, args.classicEditorDataSettings );
		classicEditorData.initialize( args.replaceVars );
		return classicEditorData;
	}

	/**
	 * Initialize used keyword analysis.
	 *
	 * @param {Function} refreshAnalysis Function that triggers a refresh of the analysis.
	 * @param {string}   ajaxAction      The ajax action to use when retrieving the used keywords data.
	 *
	 * @returns {void}
	 */
	initializeUsedKeywords( refreshAnalysis, ajaxAction ) {
		const store         = this._store;
		const localizedData = this._localizedData;
		const scriptUrl     = get( window, [ "wpseoAnalysisWorkerL10n", "keywords_assessment_url" ], "wp-seo-used-keywords-assessment.js" );

		const usedKeywords = new UsedKeywords(
			ajaxAction,
			localizedData,
			refreshAnalysis,
			scriptUrl
		);
		usedKeywords.init();

		let lastData = {};
		store.subscribe( () => {
			const state = store.getState() || {};
			if ( state.focusKeyword === lastData.focusKeyword ) {
				return;
			}
			lastData = state;
			usedKeywords.setKeyword( state.focusKeyword );
		} );
	}

	/**
	 * Enables marker button if WordPress annotation is available.
	 *
	 * @returns {void}
	 */
	initializeAnnotations() {
		if ( isAnnotationAvailable() ) {
			this._store.dispatch( setMarkerStatus( "enabled" ) );
		}
	}

	/**
	 * Returns the store.
	 *
	 * @returns {Object} The redux store.
	 */
	getStore() {
		return this._store;
	}

	/**
	 * Returns the data object.
	 *
	 * @returns {Object} The data object.
	 */
	getData() {
		return this._data;
	}
}

export default Edit;
