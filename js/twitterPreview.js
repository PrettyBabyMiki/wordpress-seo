/* jshint browser: true */

var isEmpty = require( "lodash/lang/isEmpty" );
var isElement = require( "lodash/lang/isElement" );
var clone = require( "lodash/lang/clone" );
var defaultsDeep = require( "lodash/object/defaultsDeep" );
var forEach = require( "lodash/collection/forEach" );
var debounce = require( "lodash/function/debounce" );

var Jed = require( "jed" );

var stripHTMLTags = require( "yoastseo/js/stringProcessing/stripHTMLTags.js" );
var stripSpaces = require( "yoastseo/js/stringProcessing/stripSpaces.js" );

var addClass = require( "./helpers/addClass.js" );
var removeClass = require( "./helpers/removeClass.js" );
var imageRatio = require( "./helpers/imageRatio" );

var TextField = require( "./fields/textFieldFactory" );
var TextArea = require( "./fields/textAreaFactory" );
var Button = require( "./fields/button.js" );

var PreviewEvents = require( "./preview/events" );

var twitterEditorTemplate = require( "./templates.js" ).twitterPreview;

var twitterDefaults = {
	data: {
		title: "",
		description: "",
		imageUrl: ""
	},
	placeholder: {
		title:    "This is an example title - edit by clicking here",
		description: "Modify your twitter description by editing it right here",
		imageUrl: ""
	},
	defaultValue: {
		title: "",
		description: "",
		imageUrl: ""
	},
	baseURL: "http://example.com",
	callbacks: {
		saveSnippetData: function() {}
	}
};

var inputTwitterPreviewBindings = [
	{
		"preview": "twitter_title_container",
		"inputField": "title"
	},
	{
		"preview": "twitter_image_container",
		"inputField": "imageUrl"
	},
	{
		"preview": "twitter_description_container",
		"inputField": "description"
	}
];

/**
 * @module snippetPreview
 */

/**
 * Defines the config and outputTarget for the SnippetPreview
 *
 * @param {Object}         opts                           - Snippet preview options.
 * @param {Object}         opts.placeholder               - The placeholder values for the fields, will be shown as
 * actual placeholders in the inputs and as a fallback for the preview.
 * @param {string}         opts.placeholder.title         - Placeholder for the title field.
 * @param {string}         opts.placeholder.description   - Placeholder for the description field.
 * @param {string}         opts.placeholder.imageUrl      - Placeholder for the image url field.
 *
 * @param {Object}         opts.defaultValue              - The default value for the fields, if the user has not
 * changed a field, this value will be used for the analyzer, preview and the progress bars.
 * @param {string}         opts.defaultValue.title        - Default title.
 * @param {string}         opts.defaultValue.description  - Default description.
 * @param {string}         opts.defaultValue.imageUrl     - Default image url.
 * it.
 *
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in twitter.
 * @param {HTMLElement}    opts.targetElement             - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                 - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.saveSnippetData - Function called when the snippet data is changed.
 *
 * @param {Object}         i18n                           - The i18n object.
 *
 * @property {Object}      i18n                           - The translation object.
 *
 * @property {HTMLElement} targetElement                  - The target element that contains this snippet editor.
 *
 * @property {Object}      element                        - The elements for this snippet editor.
 * @property {Object}      element.rendered               - The rendered elements.
 * @property {HTMLElement} element.rendered.title         - The rendered title element.
 * @property {HTMLElement} element.rendered.imageUrl      - The rendered url path element.
 * @property {HTMLElement} element.rendered.urlBase       - The rendered url base element.
 * @property {HTMLElement} element.rendered.description   - The rendered twitter description element.
 *
 * @property {Object}      element.input                  - The input elements.
 * @property {HTMLElement} element.input.title            - The title input element.
 * @property {HTMLElement} element.input.imageUrl         - The url path input element.
 * @property {HTMLElement} element.input.description      - The meta description input element.
 *
 * @property {HTMLElement} element.container              - The main container element.
 * @property {HTMLElement} element.formContainer          - The form container element.
 * @property {HTMLElement} element.editToggle             - The button that toggles the editor form.
 *
 * @property {Object}      data                           - The data for this snippet editor.
 * @property {string}      data.title                     - The title.
 * @property {string}      data.imageUrl                  - The url path.
 * @property {string}      data.description               - The meta description.
 *
 * @property {string}      baseURL                        - The basic URL as it will be displayed in google.
 *
 * @constructor
 */
var TwitterPreview = function( opts, i18n ) {
	defaultsDeep( opts, twitterDefaults );

	if ( !isElement( opts.targetElement ) ) {
		throw new Error( "The twitter preview requires a valid target element" );
	}

	this.data = opts.data;
	this.i18n = i18n || this.constructI18n();
	this.opts = opts;

	this._currentFocus = null;
	this._currentHover = null;
};

/**
 * Initializes i18n object based on passed configuration
 *
 * @param {Object} translations - The values to translate.
 *
 * @returns {Jed} - The Jed translation object.
 */
TwitterPreview.prototype.constructI18n = function( translations ) {
	var defaultTranslations = {
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	};

	// Use default object to prevent Jed from erroring out.
	translations = translations || defaultTranslations;

	return new Jed( translations );
};

/**
 * Renders the template and bind the events.
 *
 * @returns {void}
 */
TwitterPreview.prototype.init = function() {
	this.renderTemplate();
	this.bindEvents();

	// Sets the image ratio.
	this.setImageRatio( this.element.rendered.imageUrl );

	// Renders the snippet style.
	this.renderSnippetStyle();
};

/**
 * Renders snippet editor and adds it to the targetElement.
 *
 * @returns {void}
 */
TwitterPreview.prototype.renderTemplate = function() {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = twitterEditorTemplate( {
		raw: {
			title: this.data.title,
			imageUrl: this.data.imageUrl,
			description: this.data.description
		},
		rendered: {
			title: this.formatTitle(),
			description: this.formatDescription(),
			imageUrl: this.formatImageUrl(),
			baseUrl: this.formatUrl()
		},
		placeholder: this.opts.placeholder,
		i18n: {
			edit: this.i18n.dgettext( "js-text-analysis", "Edit Twitter preview" ),
			title: this.i18n.dgettext( "js-text-analysis", "Twitter title" ),
			imageUrl:  this.i18n.dgettext( "js-text-analysis", "Twitter image URL" ),
			description: this.i18n.dgettext( "js-text-analysis", "Twitter description" ),
			save: this.i18n.dgettext( "js-text-analysis", "Close Twitter editor" ),
			snippetPreview: this.i18n.dgettext( "js-text-analysis", "Twitter preview" ),
			snippetEditor: this.i18n.dgettext( "js-text-analysis", "Twitter editor" )
		}
	} );

	this.element = {
		rendered: {
			title: document.getElementById( "twitter_title" ),
			urlBase: document.getElementById( "twitter_base_url" ),
			imageUrl: document.getElementById( "twitter_image" ),
			description: document.getElementById( "twitter_description" )
		},
		fields: {
			title: new TextField( {
				className: "snippet-editor__input snippet-editor__title js-snippet-editor-title",
				id: "twitter-editor-title",
				value: this.data.title,
				placeholder: this.opts.placeholder.title,
				title: this.i18n.dgettext( "js-text-analysis", "Twitter title" ),
				labelClassName: "snippet-editor__label"
			} ),
			description: new TextArea( {
				className: "snippet-editor__input snippet-editor__description js-snippet-editor-description",
				id: "twitter-editor-description",
				value: this.data.description,
				placeholder: this.opts.placeholder.description,
				title: this.i18n.dgettext( "js-text-analysis", "Twitter description" ),
				labelClassName: "snippet-editor__label"
			} ),
			imageUrl: new TextField( {
				className: "snippet-editor__input snippet-editor__imageUrl js-snippet-editor-imageUrl",
				id: "twitter-editor-imageUrl",
				value: this.data.imageUrl,
				placeholder: this.opts.placeholder.imageUrl,
				title: this.i18n.dgettext( "js-text-analysis", "Twitter image URL" ),
				labelClassName: "snippet-editor__label"
			} ),
			button : new Button(
				{
					className : "snippet-editor__submit snippet-editor__button",
					value: this.i18n.dgettext( "js-text-analysis", "Close Twitter editor" )
				}
			)
		},
		input: {
			title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
			imageUrl: targetElement.getElementsByClassName( "js-snippet-editor-imageUrl" )[0],
			description: targetElement.getElementsByClassName( "js-snippet-editor-description" )[0]
		},
		container: document.getElementById( "snippet_preview" ),
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[0],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[0],
		closeEditor: targetElement.getElementsByClassName( "snippet-editor__submit" )[0],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" ),
		headingEditor: targetElement.getElementsByClassName( "snippet-editor__heading-editor" )[0]
	};

	this.element.formContainer.innerHTML = this.element.fields.title.render()
		+ this.element.fields.description.render()
		+ this.element.fields.imageUrl.render()
		+ this.element.fields.button.render();

	this.element.input = {
		title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
		imageUrl: targetElement.getElementsByClassName( "js-snippet-editor-imageUrl" )[0],
		description: targetElement.getElementsByClassName( "js-snippet-editor-description" )[0]
	};

	this.element.closeEditor = targetElement.getElementsByClassName( "snippet-editor__submit" )[0];

	this.element.label = {
		title: this.element.input.title.parentNode,
		imageUrl: this.element.input.imageUrl.parentNode,
		description: this.element.input.description.parentNode
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		imageUrl: this.element.rendered.imageUrl.parentNode,
		description: this.element.rendered.description.parentNode
	};

};

/**
 * Creates html object to contain the strings for the Twitter preview
 *
 * @returns {Object} The formatted output
 */
TwitterPreview.prototype.htmlOutput = function() {
	var html = {};
	html.title = this.formatTitle();
	html.description = this.formatDescription();
	html.imageUrl = this.formatImageUrl();
	html.url = this.formatUrl();

	return html;
};

/**
 * Formats the title for the Twitter preview. If title is empty, sampletext is used
 *
 * @returns {string} The formatted title, without html tags.
 */
TwitterPreview.prototype.formatTitle = function() {
	var title = this.getTitle();

	title = stripHTMLTags( title );

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( title ) ) {
		title = this.i18n.dgettext( "js-text-analysis", "Please provide a Twitter title by editing the snippet below." );
	}

	return title;
};

/**
 * Gets the title for the preview.
 *
 * @returns {string} Returns the title, or a fallback title
 */
TwitterPreview.prototype.getTitle = function() {
	var title = this.data.title;

	// Fallback to the default if the title is empty.
	if ( isEmpty( title ) ) {
		title = this.opts.defaultValue.title;
	}

	// For rendering we can fallback to the placeholder as well.
	if ( isEmpty( title ) ) {
		title = this.opts.placeholder.title;
	}

	return title;
};
/**
 * Formats the description for the twitter preview..
 *
 * @returns {string} Formatted description.
 */
TwitterPreview.prototype.formatDescription = function() {
	var description = this.getDescription();

	description = stripHTMLTags( description );

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( description ) ) {
		description = this.i18n.dgettext( "js-text-analysis", "Please provide a description by editing the snippet below." );
	}

	return description;
};

/**
 * Returns the description.
 *
 * @returns {string} Returns description or a fallback description.
 */
TwitterPreview.prototype.getDescription = function() {
	var description = this.data.description;

	if ( isEmpty( description ) ) {
		description = this.opts.defaultValue.description;
	}

	return stripSpaces( description );
};

/**
 * Formats the imageUrl for the twitter preview
 *
 * @returns {string} Formatted URL for the twitter preview.
 */
TwitterPreview.prototype.formatImageUrl = function() {
	var imageUrl = this.getImageUrl();

	imageUrl = stripHTMLTags( imageUrl );

	return imageUrl;
};

/**
 * Gets the imageUrl
 *
 * @returns {string} Returns the image URL
 */
TwitterPreview.prototype.getImageUrl = function() {
	var imageUrl = this.data.imageUrl;

	// Fallback to the default if the imageUrl is empty.
	if ( isEmpty( imageUrl ) ) {
		imageUrl = this.opts.placeholder.imageUrl;
	}

	return imageUrl;
};

/**
 * Updates the image object with the new URL.
 *
 * @param {Object} image    Image element.
 * @param {string} imageUrl The image path.
 *
 * @returns {void}
 */
TwitterPreview.prototype.setImageUrl = function( image, imageUrl ) {

	var img = new Image();
	img.onload = function() {
		image.src = imageUrl;

		this.setImageRatio( image );

		// Show the image, because it's done.
		removeClass( image, "snippet-editor--hidden" );
	}.bind( this );

	img.onerror = function() {
		addClass( image, "snippet-editor--hidden" );
	};

	img.src = imageUrl;
};

/**
 * Sets the image dimensions by ratio
 *
 * @param {Object} image The image object to calculate the ratio for.
 *
 * @returns {void}
 */
TwitterPreview.prototype.setImageRatio = function( image ) {
	imageRatio( image, 506 );
};

/**
 * Formats the base url for the twitter preview. Removes the protocol name from the URL.
 *
 * @returns {string} Formatted url for the twitter preview.
 */
TwitterPreview.prototype.formatUrl = function() {
	var url = this.opts.baseURL;

	// Removes the http part of the url, google displays https:// if the website supports it.
	return url.replace( /http:\/\//ig, "" );
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 *
 * @returns {void}
 */
TwitterPreview.prototype.bindEvents = function() {
	var targetElement,
		elems = [ "title", "description", "imageUrl" ];

	forEach( elems, function( elem ) {
		targetElement = this.opts.targetElement.getElementsByClassName( "js-snippet-editor-" + elem )[0];

		targetElement.addEventListener( "keydown", this.changedInput.bind( this ) );
		targetElement.addEventListener( "keyup", this.changedInput.bind( this ) );

		targetElement.addEventListener( "input", this.changedInput.bind( this ) );
		targetElement.addEventListener( "focus", this.changedInput.bind( this ) );
		targetElement.addEventListener( "blur", this.changedInput.bind( this ) );
	}.bind( this ) );

	var previewEvents = new PreviewEvents( inputTwitterPreviewBindings, this.element );
	previewEvents.bindEvents();
};

/**
 * Updates snippet preview on changed input. It's debounced so that we can call this function as much as we want.
 *
 * @returns {void}
 */
TwitterPreview.prototype.changedInput = debounce( function() {
	this.updateDataFromDOM();
	this.refresh();
}, 25 );

/**
 * Updates our data object from the DOM
 *
 * @returns {void}
 */
TwitterPreview.prototype.updateDataFromDOM = function() {
	this.data.title = this.element.input.title.value;
	this.data.imageUrl = this.element.input.imageUrl.value;
	this.data.description = this.element.input.description.value;

	// Clone so the data isn't changeable.
	this.opts.callbacks.saveSnippetData( clone( this.data ) );
};

/**
 * Refreshes the snippet editor rendered HTML
 *
 * @returns {void}
 */
TwitterPreview.prototype.refresh = function() {
	this.output = this.htmlOutput();
	this.renderOutput();
	this.renderSnippetStyle();
};

/**
 * Renders the outputs to the elements on the page.
 *
 * @returns {void}
 */
TwitterPreview.prototype.renderOutput = function() {
	this.element.rendered.title.innerHTML = this.output.title;

	if ( typeof this.output.imageUrl !== "undefined" ) {
		this.setImageUrl( this.element.rendered.imageUrl, this.output.imageUrl );
	}
	this.element.rendered.urlBase.innerHTML = this.output.url;
	this.element.rendered.description.innerHTML = this.output.description;
};

/**
 * Makes the rendered description gray if no description has been set by the user.
 *
 * @returns {void}
 */
TwitterPreview.prototype.renderSnippetStyle = function() {
	var descriptionElement = this.element.rendered.description;
	var description = this.getDescription();

	if ( isEmpty( description ) ) {
		addClass( descriptionElement, "desc-render" );
		removeClass( descriptionElement, "desc-default" );
	} else {
		addClass( descriptionElement, "desc-default" );
		removeClass( descriptionElement, "desc-render" );
	}
};

module.exports = TwitterPreview;
