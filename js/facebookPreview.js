/* jshint browser: true */

var isElement = require( "lodash/lang/isElement" );
var clone = require( "lodash/lang/clone" );
var defaultsDeep = require( "lodash/object/defaultsDeep" );

var Jed = require( "jed" );

var imageDisplayMode = require( "./helpers/imageDisplayMode" );
var renderDescription = require( "./helpers/renderDescription" );
var imagePlaceholder  = require( "./element/imagePlaceholder" );
var bemAddModifier = require( "./helpers/bem/addModifier" );
var bemRemoveModifier = require( "./helpers/bem/removeModifier" );

var TextField = require( "./inputs/textInput" );
var TextArea = require( "./inputs/textarea" );

var InputElement = require( "./element/input" );
var PreviewEvents = require( "./preview/events" );

var templates = require( "./templates.js" );
var facebookEditorTemplate = templates.facebookPreview;
var facebookAuthorTemplate = templates.facebookAuthor;

var facebookDefaults = {
	data: {
		title: "",
		description: "",
		imageUrl: ""
	},
	placeholder: {
		title:    "This is an example title - edit by clicking here",
		description: "Modify your Facebook description by editing it right here",
		imageUrl: ""
	},
	defaultValue: {
		title: "",
		description: "",
		imageUrl: ""
	},
	baseURL: "example.com",
	callbacks: {
		updateSocialPreview: function() {},
		modifyTitle: function( title ) {
			return title;
		},
		modifyDescription: function( description ) {
			return description;
		},
		modifyImageUrl: function( imageUrl ) {
			return imageUrl;
		}
	}
};

var inputFacebookPreviewBindings = [
	{
		"preview": "editable-preview__title--facebook",
		"inputField": "title"
	},
	{
		"preview": "editable-preview__image--facebook",
		"inputField": "imageUrl"
	},
	{
		"preview": "editable-preview__description--facebook",
		"inputField": "description"
	}
];

var WIDTH_FACEBOOK_IMAGE_SMALL = 158;
var WIDTH_FACEBOOK_IMAGE_LARGE = 470;

var FACEBOOK_IMAGE_TOO_SMALL_WIDTH = 200;
var FACEBOOK_IMAGE_TOO_SMALL_HEIGHT = 200;

var FACEBOOK_IMAGE_THRESHOLD_WIDTH = 600;
var FACEBOOK_IMAGE_THRESHOLD_HEIGHT = 315;

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
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in Facebook.
 * @param {HTMLElement}    opts.targetElement             - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                 - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.updateSocialPreview - Function called when the social preview is updated.
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
 * @property {HTMLElement} element.rendered.description   - The rendered Facebook description element.
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
var FacebookPreview = function( opts, i18n ) {
	defaultsDeep( opts, facebookDefaults );

	if ( !isElement( opts.targetElement ) ) {
		throw new Error( "The Facebook preview requires a valid target element" );
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
FacebookPreview.prototype.constructI18n = function( translations ) {
	var defaultTranslations = {
		"domain": "yoast-social-previews",
		"locale_data": {
			"yoast-social-previews": {
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
FacebookPreview.prototype.init = function() {
	this.renderTemplate();
	this.bindEvents();
	this.updatePreview();
};

/**
 * Renders snippet editor and adds it to the targetElement.
 *
 * @returns {void}
 */
FacebookPreview.prototype.renderTemplate = function() {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = facebookEditorTemplate( {
		rendered: {
			title: "",
			description: "",
			imageUrl: "",
			baseUrl: this.opts.baseURL
		},
		placeholder: this.opts.placeholder,
		i18n: {
			edit: this.i18n.dgettext( "yoast-social-previews", "Edit Facebook preview" ),
			snippetPreview: this.i18n.dgettext( "yoast-social-previews", "Facebook preview" ),
			snippetEditor: this.i18n.dgettext( "yoast-social-previews", "Facebook editor" )
		}
	} );

	this.element = {
		rendered: {
			title: targetElement.getElementsByClassName( "editable-preview__value--facebook-title" )[0],
			description: targetElement.getElementsByClassName( "editable-preview__value--facebook-description" )[0]
		},
		fields: this.getFields(),
		container: targetElement.getElementsByClassName( "editable-preview--facebook" )[0],
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[0],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[0],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" ),
		headingEditor: targetElement.getElementsByClassName( "snippet-editor__heading-editor" )[0],
		authorContainer: targetElement.getElementsByClassName( "editable-preview__value--facebook-author" )[0]
	};

	this.element.formContainer.innerHTML = this.element.fields.imageUrl.render()
		+ this.element.fields.title.render()
		+ this.element.fields.description.render();

	this.element.input = {
		title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
		imageUrl: targetElement.getElementsByClassName( "js-snippet-editor-imageUrl" )[0],
		description: targetElement.getElementsByClassName( "js-snippet-editor-description" )[0]
	};

	this.element.fieldElements = this.getFieldElements();
	this.element.closeEditor = targetElement.getElementsByClassName( "snippet-editor__submit" )[0];

	this.element.label = {
		title: this.element.input.title.parentNode,
		imageUrl: this.element.input.imageUrl.parentNode,
		description: this.element.input.description.parentNode
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		imageUrl: targetElement.getElementsByClassName( "editable-preview__image--facebook" )[0],
		description: this.element.rendered.description.parentNode
	};

};

/**
 * Returns the form fields.
 *
 * @returns {{title: *, description: *, imageUrl: *, button: Button}} Object with the fields.
 */
FacebookPreview.prototype.getFields = function() {
	return {
		title: new TextField( {
			className: "snippet-editor__input snippet-editor__title js-snippet-editor-title",
			id: "facebook-editor-title",
			value: this.data.title,
			placeholder: this.opts.placeholder.title,
			title: this.i18n.dgettext( "yoast-social-previews", "Facebook title" ),
			labelClassName: "snippet-editor__label"
		} ),
		description: new TextArea( {
			className: "snippet-editor__input snippet-editor__description js-snippet-editor-description",
			id: "facebook-editor-description",
			value: this.data.description,
			placeholder: this.opts.placeholder.description,
			title: this.i18n.dgettext( "yoast-social-previews", "Facebook description" ),
			labelClassName: "snippet-editor__label"
		} ),
		imageUrl: new TextField( {
			className: "snippet-editor__input snippet-editor__imageUrl js-snippet-editor-imageUrl",
			id: "facebook-editor-imageUrl",
			value: this.data.imageUrl,
			placeholder: this.opts.placeholder.imageUrl,
			title: this.i18n.dgettext( "yoast-social-previews", "Facebook image" ),
			labelClassName: "snippet-editor__label"
		} )
	};
};

/**
 * Returns all field elements.
 *
 * @returns {{title: InputElement, description: InputElement, imageUrl: InputElement}} The field elements.
 */
FacebookPreview.prototype.getFieldElements = function() {
	var targetElement = this.opts.targetElement;

	return {
		title: new InputElement(
			targetElement.getElementsByClassName( "js-snippet-editor-title" )[0],
			{
				currentValue: this.data.title,
				defaultValue: this.opts.defaultValue.title,
				placeholder: this.opts.placeholder.title,
				fallback: this.i18n.dgettext( "yoast-social-previews", "Please provide a Facebook title by editing the snippet below." )
			},
			this.updatePreview.bind( this )
		),
		description: new InputElement(
			targetElement.getElementsByClassName( "js-snippet-editor-description" )[0],
			{
				currentValue: this.data.description,
				defaultValue: this.opts.defaultValue.description,
				placeholder: this.opts.placeholder.description,
				fallback: this.i18n.dgettext( "yoast-social-previews", "Please provide a Facebook description by editing the snippet below." )
			},
			this.updatePreview.bind( this )
		),
		imageUrl: new InputElement(
			targetElement.getElementsByClassName( "js-snippet-editor-imageUrl" )[0],
			{
				currentValue: this.data.imageUrl,
				defaultValue: this.opts.defaultValue.imageUrl,
				placeholder: this.opts.placeholder.imageUrl,
				fallback: ""
			},
			this.updatePreview.bind( this )
		)
	};
};


/**
 * Updates the Facebook preview.
 */
FacebookPreview.prototype.updatePreview = function() {
	// Update the data.
	this.data.title = this.element.fieldElements.title.getInputValue();
	this.data.description = this.element.fieldElements.description.getInputValue();
	this.data.imageUrl = this.element.fieldElements.imageUrl.getInputValue();

	// Sets the title field
	this.setTitle( this.element.fieldElements.title.getValue() );
	this.setTitle( this.element.fieldElements.title.getValue() );

	// Set the description field and parse the styling of it.
	this.setDescription( this.element.fieldElements.description.getValue() );

	// Sets the Image
	this.setImage( this.data.imageUrl );

	// Clone so the data isn't changeable.
	this.opts.callbacks.updateSocialPreview( clone( this.data ) );
};

/**
 * Sets the preview title.
 *
 * @param {string} title The title to set
 */
FacebookPreview.prototype.setTitle = function( title ) {
	title = this.opts.callbacks.modifyTitle( title );

	this.element.rendered.title.innerHTML = title;
};

/**
 * Sets the preview description.
 *
 * @param {string} description The description to set
 */
FacebookPreview.prototype.setDescription = function( description ) {
	description = this.opts.callbacks.modifyDescription( description );

	this.element.rendered.description.innerHTML = description;
	renderDescription( this.element.rendered.description, this.element.fieldElements.description.getInputValue() );
};

/**
 * Gets the image container.
 * @returns {string} The container that will hold the image.
 */
FacebookPreview.prototype.getImageContainer = function() {
	return this.element.preview.imageUrl;
};

/**
 * Updates the image object with the new URL.
 *
 * @param {string} imageUrl The image path.
 * @returns {void}
 */
FacebookPreview.prototype.setImage = function ( imageUrl ) {
	imageUrl = this.opts.callbacks.modifyImageUrl( imageUrl );

	if ( imageUrl === "" && this.data.imageUrl === "" ) {
		this.removeImageFromContainer();
		return this.noUrlSet();
	}

	var img = new Image();

	img.onload = function() {
		if ( this.isTooSmallImage( img ) ) {
			this.removeImageFromContainer();
			return this.imageTooSmall();
		}

		this.setSizingClass( img );
		this.addImageToContainer( imageUrl );
	}.bind( this );

	img.onerror = function() {
		this.removeImageFromContainer();
		return this.imageError();
	}.bind( this );

	// Load image to trigger load or error event.
	img.src = imageUrl;
};

/**
 * Displays the No URL Set warning.
 * @returns {void}
 */
FacebookPreview.prototype.noUrlSet = function() {
	this.removeImageClasses();

	imagePlaceholder(
		this.getImageContainer(),
		this.i18n.dgettext( "yoast-social-previews", "Please enter an image url by clicking here" ),
		false,
		"facebook"
	);

	return;
};

/**
 * Displays the Image Too Small error.
 * @returns {void}
 */
FacebookPreview.prototype.imageTooSmall = function() {
	this.removeImageClasses();
	imagePlaceholder(
		this.getImageContainer(),
		this.i18n.dgettext( "yoast-social-previews", "The image you selected is too small for Facebook" ),
		true,
		"facebook"
	);

	return;
};

/**
 * Displays the Url Cannot Be Loaded error.
 * @returns {void}
 */
FacebookPreview.prototype.imageError = function() {
	this.removeImageClasses();

	imagePlaceholder(
		this.getImageContainer(),
		this.i18n.dgettext( "yoast-social-previews", "The given image url cannot be loaded" ),
		true,
		"facebook"
	);
};

/**
 * Sets the image of the image container.
 * @param {string} image The image to use.
 */
FacebookPreview.prototype.addImageToContainer = function( image ) {
	var container = this.getImageContainer();

	container.innerHTML = "";
	container.style.backgroundImage = "url(" + image + ")";
};

/**
 * Removes the image from the container.
 */
FacebookPreview.prototype.removeImageFromContainer = function() {
	var container = this.getImageContainer();

	container.style.backgroundImage = "";
};

/**
 * Sets the proper CSS class for the current image.
 * @param {Image} img The image to base the sizing class on.
 * @returns {void}
 */
FacebookPreview.prototype.setSizingClass = function ( img ) {
	this.removeImageClasses();

	if ( imageDisplayMode( img ) === "portrait" ) {
		this.setPortraitImageClasses();

		return;
	}

	if ( this.isSmallImage( img ) ) {
		this.setSmallImageClasses();

		return;
	}

	this.setLargeImageClasses();

	return;
};

/**
 * Returns the max image width
 *
 * @param {Image} img The image object to use.
 * @returns {int} The calculated maxwidth
 */
FacebookPreview.prototype.getMaxImageWidth = function( img ) {
	if ( this.isSmallImage( img ) ) {
		return WIDTH_FACEBOOK_IMAGE_SMALL;
	}

	return WIDTH_FACEBOOK_IMAGE_LARGE;
};

/**
 * Detects if the Facebook preview should switch to small image mode
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is small.
 */
FacebookPreview.prototype.isSmallImage = function( image ) {
	return (
		image.width < FACEBOOK_IMAGE_THRESHOLD_WIDTH ||
		image.height < FACEBOOK_IMAGE_THRESHOLD_HEIGHT
	);
};

/**
 * Detects if the Facebook preview image is too small
 *
 * @param {HTMLImageElement} image The image in question.
 *
 * @returns {boolean} Whether the image is too small.
 */
FacebookPreview.prototype.isTooSmallImage = function( image ) {
	return (
		image.width < FACEBOOK_IMAGE_TOO_SMALL_WIDTH ||
		image.height < FACEBOOK_IMAGE_TOO_SMALL_HEIGHT
	);
};

/**
 * Sets the classes on the Facebook preview so that it will display a small Facebook image preview
 */
FacebookPreview.prototype.setSmallImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemAddModifier( "facebook-small", "social-preview__inner", targetElement );
	bemAddModifier( "facebook-small", "editable-preview__image--facebook", targetElement );
	bemAddModifier( "facebook-small", "editable-preview__text-keeper--facebook", targetElement );
};

/**
 * Removes the small image classes.
 */
FacebookPreview.prototype.removeSmallImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier( "facebook-small", "social-preview__inner", targetElement );
	bemRemoveModifier( "facebook-small", "editable-preview__image--facebook", targetElement );
	bemRemoveModifier( "facebook-small", "editable-preview__text-keeper--facebook", targetElement );
};

/**
 * Sets the classes on the facebook preview so that it will display a large facebook image preview
 */
FacebookPreview.prototype.setLargeImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemAddModifier( "facebook-large", "social-preview__inner", targetElement );
	bemAddModifier( "facebook-large", "editable-preview__image--facebook", targetElement );
	bemAddModifier( "facebook-large", "editable-preview__text-keeper--facebook", targetElement );
};

/**
 * Removes the large image classes.
 */
FacebookPreview.prototype.removeLargeImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier( "facebook-large", "social-preview__inner", targetElement );
	bemRemoveModifier( "facebook-large", "editable-preview__image--facebook", targetElement );
	bemRemoveModifier( "facebook-large", "editable-preview__text-keeper--facebook", targetElement );
};

/**
 * Sets the classes on the Facebook preview so that it will display a portrait Facebook image preview
 */
FacebookPreview.prototype.setPortraitImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemAddModifier( "facebook-portrait", "social-preview__inner", targetElement );
	bemAddModifier( "facebook-portrait", "editable-preview__image--facebook", targetElement );
	bemAddModifier( "facebook-portrait", "editable-preview__text-keeper--facebook", targetElement );
	bemAddModifier( "facebook-bottom", "editable-preview__website--facebook", targetElement );
};

/**
 * Removes the portrait image classes.
 */
FacebookPreview.prototype.removePortraitImageClasses = function() {
	var targetElement = this.opts.targetElement;

	bemRemoveModifier( "facebook-portrait", "social-preview__inner", targetElement );
	bemRemoveModifier( "facebook-portrait", "editable-preview__image--facebook", targetElement );
	bemRemoveModifier( "facebook-portrait", "editable-preview__text-keeper--facebook", targetElement );
	bemRemoveModifier( "facebook-bottom", "editable-preview__website--facebook", targetElement );
};

/**
 * Removes all image classes.
 */
FacebookPreview.prototype.removeImageClasses = function() {
	this.removeSmallImageClasses();
	this.removeLargeImageClasses();
	this.removePortraitImageClasses();
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 *
 * @returns {void}
 */
FacebookPreview.prototype.bindEvents = function() {
	var previewEvents = new PreviewEvents( inputFacebookPreviewBindings, this.element, true );
	previewEvents.bindEvents( this.element.editToggle, this.element.closeEditor );
};

/**
 * Sets the value of the Facebook author name.
 *
 * @param {string} authorName The name of the author to show.
 */
FacebookPreview.prototype.setAuthor = function( authorName ) {
	var authorHtml = "";
	if ( authorName !== "" ) {
		authorHtml = facebookAuthorTemplate(
			{
				authorName: authorName,
				authorBy: this.i18n.dgettext( "yoast-social-previews", "By" )
			}
		);
	}

	this.element.authorContainer.innerHTML = authorHtml;
};

module.exports = FacebookPreview;
