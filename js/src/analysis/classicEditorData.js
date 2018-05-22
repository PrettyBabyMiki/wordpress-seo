/* External dependencies */
import removeMarks from "yoastseo/js/markers/removeMarks";
import forEach from "lodash/forEach";
import omit from "lodash/omit";

/* Internal dependencies */
import { updateReplacementVariable } from "../redux/actions/snippetEditor";
import updateReplacementVariables from "../helpers/updateReplacementVariables";
import tmceHelper, { tmceId } from "../wp-seo-tinymce";
import debounce from "lodash/debounce";
import { setDocumentExcerpt, setDocumentText, setDocumentTitle } from "../redux/actions/documentData";
import { mapDocumentToDisplayData } from "../edit";

/**
 * Represents the classic editor data.
 */
class ClassicEditorData {
	/**
	 * Sets the wp data, Yoast SEO refresh function and data object.
	 *
	 * @param {Function} refresh The YoastSEO refresh function.
	 * @param {Object} store     The YoastSEO Redux store.
	 * @returns {void}
	 */
	constructor( refresh, store ) {
		this._refresh = refresh;
		this._store = store;
		this._data = {};
		// This will be used for the comparison whether the title, description and slug are dirty.
		this._previousData = {};
		this.subscribeToInputElement = this.subscribeToInputElement.bind( this );
		this.updateReplacementData = this.updateReplacementData.bind( this );
		this.refreshYoastSEO = this.refreshYoastSEO.bind( this );
	}

	/**
	 * Initializes the class by filling this._data and subscribing to relevant elements.
	 *
	 * @param {Object} replaceVars The replacement variables passed in the wp-seo-post-scraper args.
	 *
	 * @returns {void}
	 */
	initialize( replaceVars ) {
		this._data = this.getInitialData( replaceVars );
		updateReplacementVariables( this._data, this._store );
		this.subscribeToElements();
		this.subscribeToStore();
	}

	/**
	 * Gets the title from the document.
	 *
	 * @returns {string} The title or an empty string.
	 */
	getTitle() {
		let titleElement = document.getElementById( "title" );
		return titleElement && titleElement.value || "";
	}

	/**
	 * Gets the excerpt from the document.
	 *
	 * @returns {string} The excerpt or an empty string.
	 */
	getExcerpt() {
		let excerptElement = document.getElementById( "excerpt" );
		return excerptElement && excerptElement.value || "";
	}

	/**
	 * Gets the slug from the document.
	 *
	 * @returns {string} The slug or an empty string.
	 */
	getSlug() {
		let slug = "";

		let newPostSlug = document.getElementById( "new-post-slug" );

		if ( newPostSlug ) {
			slug = newPostSlug.val();
		} else if ( document.getElementById( "editable-post-name-full" ) !== null ) {
			slug = document.getElementById( "editable-post-name-full" ).textContent;
		}

		return slug;
	}

	/**
	 * Gets the content of the document after removing marks.
	 *
	 * @returns {string} The content of the document.
	 */
	getContent() {
		return removeMarks( tmceHelper.getContentTinyMce( tmceId ) );
	}

	/**
	 * Subscribes to input elements.
	 *
	 * @returns {void}
	 */
	subscribeToElements() {
		this.subscribeToInputElement( "title", "title" );
		this.subscribeToInputElement( "excerpt", "excerpt" );
		this.subscribeToInputElement( "excerpt", "excerpt", false );
		this.subscribeToInputElement( "excerpt", "excerpt_only" );
		let cb = () => {
			this._store.dispatch( setDocumentText( this.getContent() ) );
			mapDocumentToDisplayData( this._store );
		};
		tmceHelper.addEventHandler( tmceId, [ "input", "change", "cut", "paste" ], cb );
	}

	/**
	 * Subscribes to an element via its id, and sets a callback.
	 *
	 * @param {string}  elementId            The id of the element to subscribe to.
	 * @param {string}  targetField          The name of the field the value should be sent to.
	 * @param {boolean} forReplaceVariable   Whether this is a subscription for the replaceVariables.
	 *
	 * @returns {void}
	 */
	subscribeToInputElement( elementId, targetField, forReplaceVariable = true ) {
		const element = document.getElementById( elementId );

		/*
		 * On terms some elements don't exist in the DOM, such as the title element.
		 * We return early if the element was not found.
		 */
		if ( ! element ) {
			return;
		}

		if ( ! forReplaceVariable ) {
			switch( targetField ) {
				case "excerpt":
					element.addEventListener( "input", ( event ) => {
						this._store.dispatch( setDocumentExcerpt( event.target.value ) );
						mapDocumentToDisplayData( this._store );
					} );
					break;
				case "title":
					element.addEventListener( "input", ( event ) => {
						this._store.dispatch( setDocumentTitle( event.target.value ) );
						mapDocumentToDisplayData( this._store );
					} );
					break;
				default:
					return;
			}
		}

		element.addEventListener( "input", ( event ) => {
			this.updateReplacementData( event, targetField );
		} );
	}

	/**
	 * Sets the event target value in the data and dispatches to the store.
	 *
	 * @param {Object} event            An event object.
	 * @param {string} targetReplaceVar The replacevar the event's value belongs to.
	 *
	 * @returns {void}
	 */
	updateReplacementData( event, targetReplaceVar ) {
		const replaceValue = event.target.value;
		this._data[ targetReplaceVar ] = replaceValue;
		this._store.dispatch( updateReplacementVariable( targetReplaceVar, replaceValue ) );
	}

	/**
	 * Checks whether the current data and the data from the updated state are the same.
	 *
	 * @param {Object} currentData The current data.
	 * @param {Object} newData The data from the updated state.
	 * @returns {boolean} Whether the current data and the newData is the same.
	 */
	isShallowEqual( currentData, newData ) {
		if ( Object.keys( currentData ).length !== Object.keys( newData ).length ) {
			return false;
		}

		for( let dataPoint in currentData ) {
			if ( currentData.hasOwnProperty( dataPoint ) ) {
				if( ! ( dataPoint in newData ) || currentData[ dataPoint ] !== newData[ dataPoint ] ) {
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * Refreshes YoastSEO's app when the data is dirty.
	 *
	 * @returns {void}
	 */
	refreshYoastSEO() {
		let newData = this._store.getState().snippetEditor.data;

		// Set isDirty to true if the current data and Gutenberg data are unequal.
		let isDirty = ! this.isShallowEqual( this._previousData, newData );

		if ( isDirty ) {
			this._previousData = newData;
			if ( window.YoastSEO && window.YoastSEO.app ) {
				window.YoastSEO.app.refresh();
			}
		}
	}

	/**
	 * Listens to the store.
	 *
	 * @returns {void}
	 */
	subscribeToStore() {
		this.subscriber = debounce( this.refreshYoastSEO, 500 );
		this._store.subscribe(
			this.subscriber
		);
	}

	/**
	 * Map the custom_fields field in the replacevars to a format suited for redux.
	 *
	 * @param {Object} replaceVars       The original replacevars.
	 *
	 * @returns {Object}                 The restructured replacevars object without custom_fields.
	 */
	mapCustomFields( replaceVars ) {
		if( ! replaceVars.custom_fields ) {
			return replaceVars;
		}

		let customFieldReplaceVars = {};
		forEach( replaceVars.custom_fields, ( value, key ) => {
			customFieldReplaceVars[ `cf_${ key }` ] = value;
		} );

		return omit( {
			...replaceVars,
			...customFieldReplaceVars,
		}, "custom_fields" );
	}

	/**
	 * Map the custom_taxonomies field in the replacevars to a format suited for redux.
	 *
	 * @param {Object} replaceVars       The original replacevars.
	 *
	 * @returns {Object}                 The restructured replacevars object without custom_taxonomies.
	 */
	mapCustomTaxonomies( replaceVars ) {
		if( ! replaceVars.custom_taxonomies ) {
			return replaceVars;
		}

		let customTaxonomyReplaceVars = {};
		forEach( replaceVars.custom_taxonomies, ( value, key ) => {
			customTaxonomyReplaceVars[ `ct_${ key }` ] = value.name;
			customTaxonomyReplaceVars[ `ct_desc_${ key }` ] = value.description;
		} );

		return omit( {
			...replaceVars,
			...customTaxonomyReplaceVars,
		}, "custom_taxonomies" );
	}

	/**
	 * Gets the initial data from the replacevars and document.
	 *
	 * @param {Object} replaceVars The replaceVars object.
	 *
	 * @returns {Object} The data.
	 */
	getInitialData( replaceVars ) {
		replaceVars = this.mapCustomFields( replaceVars );
		replaceVars = this.mapCustomTaxonomies( replaceVars );
		return {
			...replaceVars,
			title: this.getTitle(),
			excerpt: this.getExcerpt(),
			// eslint-disable-next-line
			excerpt_only: this.getExcerpt(),
			slug: this.getSlug(),
			content: this.getContent(),
		};
	}

	/**
	 * Add the latest content to the data object, and return the data object.
	 *
	 * @returns {Object} The data.
	 */
	getData() {
		this._data.content = this.getContent();

		return this._data;
	}
}
module.exports = ClassicEditorData;
