/* eslint-disable require-jsdoc */
/* global jQuery, Marionette, elementor */
import domReady from "@wordpress/dom-ready";
import { registerReactComponent } from "../helpers/reactRoot";
import { get } from "lodash";
import { Fragment, unmountComponentAtNode, createPortal } from "@wordpress/element";
import ElementorSlot from "../elementor/components/slots/ElementorSlot";
import ElementorFill from "../elementor/containers/ElementorFill";
import { renderReactRoot } from "../helpers/reactRoot";

const YoastView = Marionette.ItemView.extend( {
	template: false,
	id: "elementor-panel-yoast",
	className: "yoast-elementor yoast-sidebar-panel",

	initialize() {
		// Hide the search widget.
		elementor.getPanelView().getCurrentPageView().search.reset();
	},

	onShow() {
		renderReactRoot( window.YoastSEO.store, this.id, (
			<Fragment>
				<ElementorSlot />
				<ElementorFill />
			</Fragment>
		) );
	},

	onDestroy() {
		unmountComponentAtNode( this.$el[0] );
	},
} );


/**
 * Adds the Yoast region to the Elementor regionviews.
 *
 * @param {array} regions The regions to be filtered.
 * @returns {array} The filtered regions.
 */
const addYoastRegion = ( regions ) => {
	regions.yoast = {
		region: regions.global.region,
		view: YoastView,
		options: {},
	};

	return regions;
};

/**
 * Activates the Elementor save button.
 *
 * @returns {void}
 */
const activateSaveButton = () => {
	const footerSaver = get( window.elementor, "saver.footerSaver", false );
	if ( false !== footerSaver ) {
		footerSaver.activateSaveButtons( document, true );
		return;
	}
	window.elementor.channels.editor.trigger( "status:change", true );
};

/**
 * Copies the current value to the oldValue.
 *
 * @param {HTMLElement} input The input element.
 *
 * @returns {void}
 */
const storeValueAsOldValue = ( input ) => {
	input.oldValue = input.value;
};

/**
 * Activates the save button if a change is detected.
 *
 * @param {HTMLElement} input The input.
 *
 * @returns {void}
 */
const detectChange = input => {
	if ( input.value !== input.oldValue ) {
		activateSaveButton();
		storeValueAsOldValue( input );
	}
};

const sendFormData = ( form ) => {
	const data = jQuery( form ).serializeArray().reduce( ( result, { name, value } ) => {
		result[ name ] = value;

		return result;
	}, {} );
	jQuery.post( form.getAttribute( "action" ), data );
};

/**
 * Initializes the Yoast elementor editor integration.
 *
 * @returns {void}
 */
export default function initElementEditorIntegration() {
	// Expose registerReactComponent as an alternative to registerPlugin.
	window.YoastSEO = window.YoastSEO || {};
	window.YoastSEO._registerReactComponent = registerReactComponent;

	domReady( () => {
		window.$e.routes.on( "run:after", function( component, route ) {
			if ( route === "panel/page-settings/yoast-tab" ) {
			   renderReactRoot( window.YoastSEO.store, "elementor-panel-page-settings-controls", (
				  <Fragment>
					 <ElementorSlot />
					 <ElementorFill />
				  </Fragment>
			   ) );
			}
		 } );

		// Hook into the save.
		 const handleSave = sendFormData.bind( null, document.getElementById( "yoast-form" ) );
		 window.elementor.saver.on( "before:save", handleSave );
	} );

	const yoastInputs = document.querySelectorAll( "input[name^='yoast']" );
	yoastInputs.forEach( input => storeValueAsOldValue( input ) );

	setInterval( () => yoastInputs.forEach( detectChange ), 500 );
}
