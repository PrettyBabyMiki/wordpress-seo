/* global wp, jQuery */
module.exports = (function() {
	'use strict';

	/**
	 * Renders a keyword tab as a jQuery HTML object.
	 *
	 * @param {string} scoreClass
	 * @param {string} keyword
	 * @param {string} prefix
	 *
	 * @returns {HTMLElement}
	 */
	function renderKeywordTab( scoreClass, scoreText, keyword, prefix, basedOn ) {
		var placeholder = keyword.length > 0 ? keyword : '...';
		var html = wp.template( 'keyword_tab' )({
			keyword: keyword,
			placeholder: placeholder,
			score: scoreClass,
			hideRemove: true,
			prefix: prefix + ' ',
			active: true,
			basedOn: basedOn,
			scoreText: scoreText
		});

		return jQuery( html );
	}

	/**
	 * Constructor for a keyword tab object
	 * @param {Object} args
	 * @constructor
	 */
	function KeywordTab( args ) {
		this.keyword = '';
		this.prefix  = args.prefix || '';
		this.basedOn = args.basedOn || '';

		this.setScoreClass( 0 );
		this.setScoreText( '' );
	}

	/**
	 * Initialize a keyword tab.
	 *
	 * @param {HTMLElement} parent
	 */
	KeywordTab.prototype.init = function( parent ) {
		this.setElement( renderKeywordTab( this.scoreClass, this.scoreText, this.keyword, this.prefix, this.basedOn ) );

		jQuery( parent ).append( this.element );
	};

	/**
	 * Updates the keyword tabs with new values.
	 *
	 * @param {string} scoreClass
	 * @param {string} scoreText
	 * @param {string} keyword
	 */
	KeywordTab.prototype.update = function( scoreClass, scoreText, keyword ) {
		this.keyword = keyword;
		this.setScoreClass( scoreClass );
		this.setScoreText( scoreText );
		this.refresh();
	};

	/**
	 * Renders a new keyword tab with the current values and replaces the old tab with this one.
	 */
	KeywordTab.prototype.refresh = function() {
		var newElem = renderKeywordTab( this.scoreClass, this.scoreText, this.keyword, this.prefix, this.basedOn );

		this.element.replaceWith( newElem );
		this.setElement( newElem );
	};

	/**
	 * Sets the current element
	 *
	 * @param {HTMLElement} element
	 */
	KeywordTab.prototype.setElement = function( element ) {
		this.element = jQuery( element );
	};

	/**
	 * Formats the given score and store it in the attribute.
	 *
	 * @param {string} scoreClass
	 */
	KeywordTab.prototype.setScoreClass = function( scoreClass ) {
		this.scoreClass = scoreClass;
	};

	/**
	 * Formats the given score text and store it in the attribute.
	 *
	 * @param {string} scoreText
	 */
	KeywordTab.prototype.setScoreText = function( scoreText ) {
		this.scoreText = scoreText;
	};

	return KeywordTab;
})();
