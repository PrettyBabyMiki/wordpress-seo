var defaults = require( "lodash/defaults" );
const isEmpty = require( "lodash/isEmpty" );

/**
 * Default attributes to be used by the Paper if they are left undefined.
 * @type {{keyword: string, synonyms: string, description: string, title: string, url: string}}
 */
var defaultAttributes = {
	keyword: "",
	synonyms: "",
	description: "",
	title: "",
	titleWidth: 0,
	url: "",
	locale: "en_US",
	permalink: "",
};

/**
 * Construct the Paper object and set the keyword property.
 * @param {string} text The text to use in the analysis.
 * @param {object} attributes The object containing all attributes.
 * @constructor
 */
var Paper = function( text, attributes ) {
	this._text = text || "";

	attributes = attributes || {};
	defaults( attributes, defaultAttributes );

	if ( attributes.locale === "" ) {
		attributes.locale = defaultAttributes.locale;
	}

	const onlyLetters = attributes.keyword.replace( /[‘’“”"'.?!:;,¿¡«»&*@#±^%|~`[\](){}⟨⟩<>/\\–\-\u2014\u00d7\u002b\u0026\s]/g, "" );

	if ( isEmpty( onlyLetters ) ) {
		attributes.keyword = defaultAttributes.keyword;
	}

	this._attributes = attributes;
};

/**
 * Check whether a keyword is available.
 * @returns {boolean} Returns true if the Paper has a keyword.
 */
Paper.prototype.hasKeyword = function() {
	return this._attributes.keyword !== "";
};

/**
 * Return the associated keyword or an empty string if no keyword is available.
 * @returns {string} Returns Keyword
 */
Paper.prototype.getKeyword = function() {
	return this._attributes.keyword;
};

/**
 * Check whether synonyms is available.
 * @returns {boolean} Returns true if the Paper has synonyms.
 */
Paper.prototype.hasSynonyms = function() {
	return this._attributes.synonyms !== "";
};

/**
 * Return the associated synonyms or an empty string if no synonyms is available.
 * @returns {string} Returns synonyms.
 */
Paper.prototype.getSynonyms = function() {
	return this._attributes.synonyms;
};

/**
 * Check whether the text is available.
 * @returns {boolean} Returns true if the paper has a text.
 */
Paper.prototype.hasText = function() {
	return this._text !== "";
};

/**
 * Return the associated text or am empty string if no text is available.
 * @returns {string} Returns text
 */
Paper.prototype.getText = function() {
	return this._text;
};

/**
 * Check whether a description is available.
 * @returns {boolean} Returns true if the paper has a description.
 */
Paper.prototype.hasDescription = function() {
	return this._attributes.description !== "";
};

/**
 * Return the description or an empty string if no description is available.
 * @returns {string} Returns the description.
 */
Paper.prototype.getDescription = function() {
	return this._attributes.description;
};

/**
 * Check whether an title is available
 * @returns {boolean} Returns true if the Paper has a title.
 */
Paper.prototype.hasTitle = function() {
	return this._attributes.title !== "";
};

/**
 * Return the title, or an empty string of no title is available.
 * @returns {string} Returns the title
 */
Paper.prototype.getTitle = function() {
	return this._attributes.title;
};

/**
 * Check whether an title width in pixels is available
 * @returns {boolean} Returns true if the Paper has a title.
 */
Paper.prototype.hasTitleWidth = function() {
	return this._attributes.titleWidth !== 0;
};

/**
 * Return the title width in pixels, or an empty string of no title width in pixels is available.
 * @returns {string} Returns the title
 */
Paper.prototype.getTitleWidth = function() {
	return this._attributes.titleWidth;
};

/**
 * Check whether an url is available
 * @returns {boolean} Returns true if the Paper has an Url.
 */
Paper.prototype.hasUrl = function() {
	return this._attributes.url !== "";
};

/**
 * Return the url, or an empty string of no url is available.
 * @returns {string} Returns the url
 */
Paper.prototype.getUrl = function() {
	return this._attributes.url;
};

/**
 * Check whether a locale is available
 * @returns {boolean} Returns true if the paper has a locale
 */
Paper.prototype.hasLocale = function() {
	return this._attributes.locale !== "";
};

/**
 * Return the locale or an empty string if no locale is available
 * @returns {string} Returns the locale
 */
Paper.prototype.getLocale = function() {
	return this._attributes.locale;
};

/**
 * Check whether a permalink is available
 * @returns {boolean} Returns true if the Paper has a permalink.
 */
Paper.prototype.hasPermalink = function() {
	return this._attributes.permalink !== "";
};

/**
 * Return the permalink, or an empty string of no permalink is available.
 * @returns {string} Returns the permalink.
 */
Paper.prototype.getPermalink = function() {
	return this._attributes.permalink;
};

/**
 * Check whether keyphraseForms are available.
 * @returns {boolean} Returns true if the Paper has keyphrase forms.
 */
Paper.prototype.hasKeyphraseForms = function() {
	return ! ( isEmpty( this._attributes.topicForms.keyphraseForms ) );
};

/**
 * Return the keyphrase forms or an empty array if no keyphrase forms are available.
 * @returns {Array} Returns Keyphrase forms
 */
Paper.prototype.getKeyphraseForms = function() {
	return this._attributes.topicForms.keyphraseForms;
};

/**
 * Check whether synonymsForms are available.
 * @returns {boolean} Returns true if the Paper has synonyms forms.
 */
Paper.prototype.hasSynonymsForms = function() {
	return ! ( isEmpty( this._attributes.topicForms.synonymsForms ) );
};

/**
 * Return the synonyms forms or an empty array if no synonyms forms are available.
 * @returns {Array} Returns synonyms forms
 */
Paper.prototype.getSynonymsForms = function() {
	return this._attributes.topicForms.synonymsForms;
};

module.exports = Paper;
