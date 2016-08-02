(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* global wp, jQuery */

var isUndefined = require( 'lodash/isUndefined' );
var defaultsDeep = require( 'lodash/defaultsDeep' );
var getIndicatorForScore = require( './getIndicatorForScore' );

var $ = jQuery;

var defaultArguments = {
	label: '',
	active: false,
	hideable: false,

	classes: [ 'wpseo_tab', 'wpseo_generic_tab' ],

	onActivate: function ( ) { },
	afterActivate: function ( ) { },
};

module.exports = (function() {
	'use strict';

	/**
	 * Constructor for a generic tab object
	 * @param {Object} args
	 * @constructor
	 */
	function GenericTab( args ) {
		defaultsDeep( args, defaultArguments );

		this.label          = args.label;
		this.active         = args.active;
		this.hideable       = args.hideable;
		this.classes        = args.classes;

		this.onActivate     = args.onActivate;
		this.afterActivate  = args.afterActivate;
	}

	/**
	 * Initialize a keyword tab.
	 *
	 * @param {HTMLElement} container The container element to add the tab to.
	 * @param {string} [position] Either prepend or append for the position in the container.
	 */
	GenericTab.prototype.init = function( container, position ) {
		position = position || 'prepend';

		this.setElement( this.render() );
		this.addToContainer( container, position );
	};

	/**
	 * Adds the current tab to the container element.
	 *
	 * @param {string|Object} container The container element to add the tab to. jQuery object or selector.
	 * @param {string} [position] Either prepend or append for the position in the container.
	 */
	GenericTab.prototype.addToContainer = function ( container, position ) {
		var $container = $( container );

		if ( 'prepend' === position ) {
			$container.prepend( this.element );
			return;
		}

		$container.append( this.element );
	};

	/**
	 * Gets the indicator object based on the passed score.
	 *
	 * @param {int} score The score to be used to determine the indicator.
	 * @returns {Object} The indicator.
	 */
	GenericTab.prototype.getIndicator = function( score ) {
		return getIndicatorForScore( score );
	};

	/**
	 * Updates the keyword tabs with new values.
	 *
	 * @param {int} indicator
	 */
	GenericTab.prototype.updateScore = function( score ) {
		var indicator = this.getIndicator( score );

		this.score = indicator.className;
		this.scoreText = indicator.screenReaderText;

		this.refresh();
	};

	/**
	 * Renders a new keyword tab with the current values and replaces the old tab with this one.
	 */
	GenericTab.prototype.refresh = function() {
		var replacement = this.render();

		this.element.replaceWith( replacement );
		this.setElement( replacement );
	};

	/**
	 * Adds additional CSS classes based on the classes field.
	 *
	 * @returns {string} The classes to add.
	 */
	GenericTab.prototype.addAdditionalClasses = function() {
		return this.classes.join( ' ' );
	};

	/**
	 * Renders this keyword tab as a jQuery HTML object.
	 *
	 * @returns {HTMLElement} jQuery HTML object.
	 */
	GenericTab.prototype.render = function() {
		var html = wp.template( 'generic_tab' )( {
			label: this.label,

			active: this.active,
			hideable: this.hideable,

			score: this.score,
			scoreText: this.scoreText,

			classes: this.addAdditionalClasses()
		} );

		return jQuery( html );
	};

	/**
	 * Sets the current element
	 *
	 * @param {HTMLElement} element
	 */
	GenericTab.prototype.setElement = function( element ) {
		this.element = jQuery( element );

		this.addEventHandler();
	};

	/**
	 * Adds event handler to tab
	 */
	GenericTab.prototype.addEventHandler = function() {
		$( this.element ).on( 'click', this.onClick.bind( this ) );
	};

	/**
	 * Activates the tab
	 */
	GenericTab.prototype.activate = function() {
		this.onActivate();

		this.deactivate();

		this.active = true;

		this.refresh();

		this.afterActivate();
	};

	/**
	 * Removes active state class from all tabs.
	 */
	GenericTab.prototype.deactivate = function() {
		this.active = false;
		$( '.wpseo_tab' ).removeClass( 'active' );
	};

	/**
	 * Handles clicking the tab.
	 *
	 * @param {UIEvent} ev The event fired by the browser.
	 */
	GenericTab.prototype.onClick = function( ev ) {
		ev.preventDefault();

		this.activate();
	};

	return GenericTab;
} )();

},{"./getIndicatorForScore":4,"lodash/defaultsDeep":185,"lodash/isUndefined":218}],2:[function(require,module,exports){
var getL10nObject = require( './getL10nObject' );

/**
 * Returns the description placeholder for use in the description forms.
 *
 * @returns {string}
 */
function getDescriptionPlaceholder( l10n ) {
	var descriptionPlaceholder = '';
	var l10nObject = getL10nObject();

	if ( l10nObject ) {
		descriptionPlaceholder = l10nObject.metadesc_template;
	}

	return descriptionPlaceholder;
}

module.exports = getDescriptionPlaceholder;

},{"./getL10nObject":5}],3:[function(require,module,exports){
var getTranslations = require( './getTranslations' );
var isEmpty = require( 'lodash/isEmpty' );
var Jed = require( 'jed' );

/**
 * Returns a Jed object usable in YoastSEO.js
 *
 * @returns {Jed} A usable i18n translations object.
 */
function getI18n() {
	"use strict";

	var translations = getTranslations();
	var i18n = new Jed( translations );

	if ( isEmpty( translations ) ) {
		i18n = new Jed( {
			"domain": "js-text-analysis",
			"locale_data": {
				"js-text-analysis": {
					"": {}
				}
			}
		} );
	}

	return i18n;
}

module.exports = getI18n;

},{"./getTranslations":7,"jed":22,"lodash/isEmpty":207}],4:[function(require,module,exports){
var scoreToRating = require( 'yoastseo' ).helpers.scoreToRating;
var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns whether or not the current page has presenters.
 *
 * @returns {boolean} Whether or not the page has presenters.
 */
var hasPresenter = function() {
	var app = YoastSEO.app;

	return ( ! isUndefined( app.seoAssessorPresenter ) || ! isUndefined( app.contentAssessorPresenter ) );
};

/**
 * Returns the presenter that is currently present on the page. Prevent errors if one of the analyses is disabled.
 *
 * @returns {AssessorPresenter} An active assessor presenter.
 */
var getPresenter = function() {
	var app = YoastSEO.app;

	if ( ! isUndefined( app.seoAssessorPresenter ) ) {
		return app.seoAssessorPresenter;
	}

	if ( ! isUndefined( app.contentAssessorPresenter ) ) {
		return app.contentAssessorPresenter;
	}
};

/**
 * Simple helper function that returns the indicator for a given total score
 *
 * @param {number} score The score from 0 to 100.
 * @returns {Object} The indicator for the given score.
 */
function getIndicatorForScore( score ) {
	// Scale because scoreToRating works from 0 to 10.
	score /= 10;


	var indicator = {
		className: '',
		screenReaderText: '',
		fullText: ''
	};

	var presenter = getPresenter();

	if ( ! hasPresenter() ) {
		return indicator;
	}

	return presenter.getIndicator( scoreToRating( score ) );
}

module.exports = getIndicatorForScore;

},{"lodash/isUndefined":218,"yoastseo":252}],5:[function(require,module,exports){
/* global wpseoPostScraperL10n */

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns the l10n object for the current page, either term or post.
 *
 * @returns {Object} The l10n object for the current page.
 */
function getL10nObject() {
	var l10nObject = null;

	if ( ! isUndefined( window.wpseoPostScraperL10n ) ) {
		l10nObject = window.wpseoPostScraperL10n;
	} else if ( ! isUndefined( window.wpseoTermScraperL10n ) ) {
		l10nObject = window.wpseoTermScraperL10n;
	}

	return l10nObject;
}

module.exports = getL10nObject;

},{"lodash/isUndefined":218}],6:[function(require,module,exports){
/* global wpseoPostScraperL10n, wpseoTermScraperL10n */

var getL10nObject = require( './getL10nObject' );

/**
 * Returns the title placeholder for use in the title forms.
 *
 * @returns {string}
 */
function getTitlePlaceholder() {
	var titlePlaceholder = '';
	var l10nObject = getL10nObject();

	if ( l10nObject ) {
		titlePlaceholder = l10nObject.title_template;
	}

	if ( titlePlaceholder === '' ) {
		titlePlaceholder = '%%title%% - %%sitename%%';
	}

	return titlePlaceholder;
}

module.exports = getTitlePlaceholder;

},{"./getL10nObject":5}],7:[function(require,module,exports){
var getL10nObject = require( './getL10nObject' );

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Retrieves translations for YoastSEO.js for the current page, either term or post.
 *
 * @returns {Object} The translations object for the current page.
 */
function getTranslations() {
	"use strict";

	var l10nObject = getL10nObject();
	var translations = l10nObject.translations;

	if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
		translations.domain = 'js-text-analysis';
		translations.locale_data['js-text-analysis'] = translations.locale_data['wordpress-seo'];
		delete( translations.locale_data['wordpress-seo'] );
	}

	return translations;
}

module.exports = getTranslations;

},{"./getL10nObject":5,"lodash/isUndefined":218}],8:[function(require,module,exports){
var getL10nObject = require( './getL10nObject' );

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns whether or not the content analysis is active
 *
 * @returns {boolean} Whether or not the content analysis is active.
 */
function isContentAnalysisActive() {
	var l10nObject = getL10nObject();

	return ! isUndefined( l10nObject ) && l10nObject.contentAnalysisActive === '1'
}

module.exports = isContentAnalysisActive;

},{"./getL10nObject":5,"lodash/isUndefined":218}],9:[function(require,module,exports){
var getL10nObject = require( './getL10nObject' );

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns whether or not the content analysis is active
 */
function isKeywordAnalysisActive() {
	var l10nObject = getL10nObject();

	return ! isUndefined( l10nObject ) && l10nObject.keywordAnalysisActive === '1'
}

module.exports = isKeywordAnalysisActive;

},{"./getL10nObject":5,"lodash/isUndefined":218}],10:[function(require,module,exports){
/* global wp, jQuery */
var isUndefined = require( 'lodash/isUndefined' );
var defaultsDeep = require( 'lodash/defaultsDeep' );

var GenericTab = require( './genericTab' );

var defaultArguments = {
	keyword: '',
	placeholder: '',

	active: false,
	hideable: false,
	prefix: '',

	classes: [ 'wpseo_tab', 'wpseo_keyword_tab' ],

	onActivate: function ( ) { },
	afterActivate: function ( ) { }
};

module.exports = (function() {
	'use strict';

	// Extending all the things.
	KeywordTab.prototype = Object.create( GenericTab.prototype );

	/**
	 * Constructor for a keyword tab object
	 * @param {Object} args
	 * @constructor
	 */
	function KeywordTab( args ) {
		defaultsDeep( args, defaultArguments );
		this.fallback       = args.fallback;
		this.keyword        = args.keyword;
		this.placeholder    = args.placeholder;
		this.prefix         = args.prefix;

		this.classes        = args.classes;

		this.onActivate     = args.onActivate;
		this.afterActivate  = args.afterActivate;
	}

	/**
	 * Updates the keyword tabs with new values.
	 *
	 * @param {string} scoreClass
	 * @param {string} scoreText
	 * @param {string} [keyword]
	 */
	KeywordTab.prototype.updateScore = function( score, keyword ) {
		if ( ! isUndefined( keyword ) ) {
			this.keyword = keyword;
		}

		if ( keyword === '' ) {
			this.score = 'na';
			this.scoreText = YoastSEO.app.i18n.dgettext( 'js-text-analysis', 'Enter a focus keyword to calculate the SEO score' );
			this.refresh();

			return;
		}

		var indicator   = this.getIndicator( score );

		this.score      = indicator.className;
		this.scoreText  = indicator.screenReaderText;

		this.refresh();
	};

	KeywordTab.prototype.hasKeyword = function() {
		return this.keyword !== '';
	};

	KeywordTab.prototype.getKeyWord = function() {
		return this.keyword;
	};

	KeywordTab.prototype.hasFallback = function() {
		return this.fallback !== '';
	};

	KeywordTab.prototype.determinePrefix = function() {
		if ( ! this.hasKeyword() && this.hasFallback() ) {
			return '';
		}

		return this.prefix;
	};

	KeywordTab.prototype.determineLabel = function() {
		if ( ! this.hasKeyword() && this.hasFallback() ) {
			return this.fallback;
		}

		return this.hasKeyword() ? this.getKeyWord() : '...';
	};

	/**
	 * Renders this keyword tab as a jQuery HTML object
	 *
	 * @returns {HTMLElement} jQuery HTML object.
	 */
	KeywordTab.prototype.render = function() {
		var html = wp.template( 'keyword_tab' )({
			label: this.determineLabel(),
			keyword: this.getKeyWord(),

			hideable: this.hideable,
			active: this.active,

			prefix: this.determinePrefix(),

			score: this.score,
			scoreText: this.scoreText,

			classes: this.addAdditionalClasses()
		});

		return jQuery( html );
	};

	/**
	 * Returns the keyword for this keyword tab
	 */
	KeywordTab.prototype.getKeywordFromElement = function() {
		return this.element.find( '.wpseo_tablink' ).data( 'keyword' );
	};

	return KeywordTab;
})();

},{"./genericTab":1,"lodash/defaultsDeep":185,"lodash/isUndefined":218}],11:[function(require,module,exports){
/* global jQuery */

"use strict";

var getL10nObject = require( './getL10nObject' );
var getI18n = require( './getI18n' );
var getTitlePlaceholder = require( './getTitlePlaceholder' );
var getDescriptionPlaceholder = require( './getDescriptionPlaceholder' );

var SnippetPreview = require( 'yoastseo' ).SnippetPreview;

/**
 * Removes all analysis objects from the DOM except the snippet preview
 *
 * @param {Object} snippetContainer A jQuery object with the snippet container element.
 */
function isolate( snippetContainer ) {
	snippetContainer = jQuery( snippetContainer );

	// Remove all other table rows except the snippet preview one.
	var tr = snippetContainer.closest( 'tr' );
	tr.siblings().hide();

	// Remove the tab navigation.
	jQuery( '#wpseo-metabox-tabs' ).hide();
}

/**
 * Returns all the arguments required to create a snippet preview object
 *
 * @param {Object} snippetContainer A jQuery object with the snippet container element.
 *
 * @param {Object} data The data that is saved for the snippet editor fields.
 * @param {Object} data.title The title for the snippet editor.
 * @param {Object} data.urlPath The url path for the snippet editor.
 * @param {Object} data.metaDesc The meta description for the snippet editor.
 *
 * @param {Function} saveCallback A callback that is called when the snippet editor fields should be saved.
 *
 * @return {Object} An object with all the arguments required to create a snippet preview object
 */
function getSnippetPreviewArgs( snippetContainer, data, saveCallback ) {
	var l10nObject = getL10nObject();

	snippetContainer = jQuery( snippetContainer ).get( 0 );

	var titlePlaceholder = getTitlePlaceholder();
	var descriptionPlaceholder = getDescriptionPlaceholder();

	var snippetPreviewArgs = {
		targetElement: snippetContainer,
		placeholder: {
			title: titlePlaceholder,
			urlPath: ''
		},
		defaultValue: {
			title: titlePlaceholder
		},
		baseURL: l10nObject.base_url,
		callbacks: {
			saveSnippetData: saveCallback
		},
		metaDescriptionDate: l10nObject.metaDescriptionDate,
		data: data

	};

	if ( descriptionPlaceholder !== '' ) {
		snippetPreviewArgs.placeholder.metaDesc = descriptionPlaceholder;
		snippetPreviewArgs.defaultValue.metaDesc = descriptionPlaceholder;
	}

	return snippetPreviewArgs;
}
/**
 * Creates a snippet preview in the given location
 *
 * @param {Object} snippetContainer A jQuery object with the snippet container element.
 *
 * @param {Object} data The data that is saved for the snippet editor fields.
 * @param {Object} data.title The title for the snippet editor.
 * @param {Object} data.urlPath The url path for the snippet editor.
 * @param {Object} data.metaDesc The meta description for the snippet editor.
 *
 * @param {Function} saveCallback A callback that is called when the snippet editor fields should be saved.
 *
 * @return {SnippetPreview} The newly created snippet preview object.
 */
function create( snippetContainer, data, saveCallback ) {
	var args = getSnippetPreviewArgs( snippetContainer, data, saveCallback );

	return new SnippetPreview( args );
}

/**
 * Creates a standalone snippet preview
 *
 * @param {Object} snippetContainer A jQuery object with the snippet container element.
 *
 * @param {Object} data The data that is saved for the snippet editor fields.
 * @param {Object} data.title The title for the snippet editor.
 * @param {Object} data.urlPath The url path for the snippet editor.
 * @param {Object} data.metaDesc The meta description for the snippet editor.
 *
 * @param {Function} saveCallback A callback that is called when the snippet editor fields should be saved.
 *
 * @returns {SnippetPreview} The newly created snippet preview object.
 */
function createStandalone( snippetContainer, data, saveCallback ) {
	var args;

	args = getSnippetPreviewArgs( snippetContainer, data, saveCallback );
	args.i18n = getI18n();

	var snippetPreview = new SnippetPreview( args );
	snippetPreview.renderTemplate();
	snippetPreview.callRegisteredEventBinder();
	snippetPreview.bindEvents();
	snippetPreview.init();

	return snippetPreview;
}

module.exports = {
	isolate: isolate,
	create: create,
	createStandalone: createStandalone
};

},{"./getDescriptionPlaceholder":2,"./getI18n":3,"./getL10nObject":5,"./getTitlePlaceholder":6,"yoastseo":252}],12:[function(require,module,exports){
var defaultsDeep = require( 'lodash/defaultsDeep' );

var getIndicatorForScore = require( './getIndicatorForScore' );
var KeywordTab = require( './keywordTab' );
var GenericTab = require( './genericTab' );

var $ = jQuery;

var defaultArguments = {
	strings: {
		keywordTab: '',
		contentTab: ''
	},
	focusKeywordField: '#yoast_wpseo_focuskw',
	contentAnalysisActive: '1'
};

/**
 * The tab manager is responsible for managing the analysis tabs in the metabox.
 *
 * @constructor
 */
function TabManager( arguments ) {
	arguments = arguments || {};

	defaultsDeep( arguments, defaultArguments );

	this.arguments = arguments;
	this.strings = arguments.strings;
}

/**
 * Initializes the two tabs.
 */
TabManager.prototype.init = function() {
	var metaboxTabs = $( '#wpseo-metabox-tabs' );

	// Remove default functionality to prevent scrolling to top.
	metaboxTabs.on( 'click', '.wpseo_tablink', function( ev ) {
		ev.preventDefault();
	});

	this.focusKeywordInput = $( '#yoast_wpseo_focuskw_text_input,#wpseo_focuskw' );
	this.focusKeywordRow = this.focusKeywordInput.closest( 'tr' );
	this.contentAnalysis = $( '#yoast-seo-content-analysis' );
	this.keywordAnalysis = $( '#wpseo-pageanalysis, #wpseo_analysis' );
	this.snippetPreview  = $( '#wpseosnippet' ).closest( 'tr' );

	var initialKeyword   = $( this.arguments.focusKeywordField ).val();

	// We start on the content analysis 'tab'.
	this.contentAnalysis.show();
	this.keywordAnalysis.hide();
	this.focusKeywordRow.hide();

	// Initialize an instance of the keyword tab.
	this.mainKeywordTab = new KeywordTab( {
		keyword:    initialKeyword,
		prefix:     this.strings.keywordTab,
		fallback:   this.strings.enterFocusKeyword,
		onActivate: function() {
			this.showKeywordAnalysis();
			this.contentTab.deactivate();
		}.bind( this ),
		afterActivate: function() {
			YoastSEO.app.refresh();
		}
	} );

	this.contentTab = new GenericTab( {
		label: this.strings.contentTab,
		onActivate: function() {
			this.showContentAnalysis();
			this.mainKeywordTab.deactivate();
		}.bind( this ),
		afterActivate: function() {
			YoastSEO.app.refresh();
		}
	} );

	if ( this.arguments.keywordAnalysisActive ) {
		this.mainKeywordTab.init( metaboxTabs );
	}

	if ( this.arguments.contentAnalysisActive ) {
		this.contentTab.init( metaboxTabs );
	}

	$( '.yoast-seo__remove-tab' ).remove();
};

/**
 * Shows the keyword analysis elements.
 */
TabManager.prototype.showKeywordAnalysis = function() {
	this.focusKeywordRow.show();
	this.keywordAnalysis.show();
	this.contentAnalysis.hide();

	if ( this.arguments.keywordAnalysisActive ) {
		this.snippetPreview.show();
	}
};

/**
 * Shows the content analysis elements.
 */
TabManager.prototype.showContentAnalysis = function() {
	this.focusKeywordRow.hide();
	this.keywordAnalysis.hide();
	this.contentAnalysis.show();

	if ( this.arguments.keywordAnalysisActive ) {
		this.snippetPreview.hide();
	}
};

/**
 * Updates the content tab with the calculated score
 *
 * @param {number} score The score that has been calculated.
 */
TabManager.prototype.updateContentTab = function( score ) {
	this.contentTab.updateScore( score );
};

/**
 * Updates the keyword tab with the calculated score
 *
 * @param {number} score The score that has been calculated.
 * @param {string} keyword The keyword that has been used to calculate the score.
 */
TabManager.prototype.updateKeywordTab = function( score, keyword ) {
	this.mainKeywordTab.updateScore( score, keyword );
};

/**
 * Returns whether or not the keyword is the main keyword
 *
 * @param {string} keyword The keyword to check
 *
 * @returns {boolean}
 */
TabManager.prototype.isMainKeyword = function( keyword ) {
	return this.mainKeywordTab.getKeywordFromElement() === keyword;
};

/**
 * Returns the keyword tab object
 *
 * @returns {KeywordTab} The keyword tab object.
 */
TabManager.prototype.getKeywordTab = function() {
	return this.mainKeywordTab;
};

/**
 * Returns the content tab object
 *
 * @returns {KeywordTab} The content tab object.
 */
TabManager.prototype.getContentTab = function() {
	return this.contentTab;
};

module.exports = TabManager;

},{"./genericTab":1,"./getIndicatorForScore":4,"./keywordTab":10,"lodash/defaultsDeep":185}],13:[function(require,module,exports){
/* global jQuery, ajaxurl */

var UsedKeywordsPlugin = require( 'yoastseo' ).bundledPlugins.usedKeywords;
var _has = require( 'lodash/has' );
var _debounce = require( 'lodash/debounce' );
var _isArray = require( 'lodash/isArray' );
var $ = jQuery;

/**
 * Object that handles keeping track if the current keyword has been used before and retrieves this usage from the
 * server.
 *
 * @param {string} focusKeywordElement A jQuery selector for the focus keyword input element.
 * @param {string} ajaxAction The ajax action to use when retrieving the used keywords data.
 * @param {Object} options The options for the used keywords assessment plugin.
 * @param {Object} options.keyword_usage An object that contains the keyword usage when instantiating.
 * @param {Object} options.search_url The URL to link the user to if the keyword has been used multiple times.
 * @param {Object} options.post_edit_url The URL to link the user to if the keyword has been used a single time.
 * @param {App} app The app for which to keep track of the used keywords.
 */
function UsedKeywords( focusKeywordElement, ajaxAction, options, app ) {
	this._keywordUsage = options.keyword_usage;
	this._focusKeywordElement = $( focusKeywordElement );

	this._plugin = new UsedKeywordsPlugin( app, {
		usedKeywords: options.keyword_usage,
		searchUrl: options.search_url,
		postUrl: options.post_edit_url
	}, app.i18n );

	this._postID = $( '#post_ID, [name=tag_ID]' ).val();
	this._taxonomy = $( '[name=taxonomy]' ).val() || "";
	this._ajaxAction = ajaxAction;
	this._app = app;
}

/**
 * Initializes everything necessary for used keywords
 */
UsedKeywords.prototype.init = function() {
	var eventHandler = _debounce( this.keywordChangeHandler.bind( this ), 500 );

	this._plugin.registerPlugin();
	this._focusKeywordElement.on( 'keyup', eventHandler );
};

/**
 * Handles an event of the keyword input field
 */
UsedKeywords.prototype.keywordChangeHandler = function() {
	var keyword = this._focusKeywordElement.val();

	if ( ! _has( this._keywordUsage, keyword ) ) {
		this.requestKeywordUsage( keyword );
	}
};

/**
 * Request keyword usage from the server
 *
 * @param {string} keyword The keyword to request the usage for.
 */
UsedKeywords.prototype.requestKeywordUsage = function( keyword ) {
	$.post( ajaxurl, {
		action: this._ajaxAction,
		post_id: this._postID,
		keyword: keyword,
		taxonomy: this._taxonomy
	}, this.updateKeywordUsage.bind( this, keyword ), 'json' );
};

/**
 * Updates the keyword usage based on the response of the ajax request
 *
 * @param {string} keyword The keyword for which the usage was requested.
 * @param {*} response The response retrieved from the server.
 */
UsedKeywords.prototype.updateKeywordUsage = function( keyword, response ) {
	if ( response && _isArray( response ) ) {
		this._keywordUsage[ keyword ] = response;
		this._plugin.updateKeywordUsage( this._keywordUsage );
		this._app.analyzeTimer();
	}
};

module.exports = UsedKeywords;

},{"lodash/debounce":183,"lodash/has":196,"lodash/isArray":202,"yoastseo":252}],14:[function(require,module,exports){
var Assessor = require( "yoastseo/js/assessor.js" );

var introductionKeyword = require( "yoastseo/js/assessments/introductionKeywordAssessment.js" );
var keyphraseLength = require( "yoastseo/js/assessments/keyphraseLengthAssessment.js" );
var keywordDensity = require( "yoastseo/js/assessments/keywordDensityAssessment.js" );
var keywordStopWords = require( "yoastseo/js/assessments/keywordStopWordsAssessment.js" );
var metaDescriptionKeyword = require ( "yoastseo/js/assessments/metaDescriptionKeywordAssessment.js" );
var metaDescriptionLength = require( "yoastseo/js/assessments/metaDescriptionLengthAssessment.js" );
var titleKeyword = require( "yoastseo/js/assessments/titleKeywordAssessment.js" );
var titleWidth = require( "yoastseo/js/assessments/pageTitleWidthAssessment.js" );
var urlKeyword = require( "yoastseo/js/assessments/urlKeywordAssessment.js" );
var urlLength = require( "yoastseo/js/assessments/urlLengthAssessment.js" );
var urlStopWords = require( "yoastseo/js/assessments/urlStopWordsAssessment.js" );
var taxonomyTextLength = require( 'yoastseo/js/assessments/taxonomyTextLengthAssessment' );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @constructor
 */
var TaxonomyAssessor = function( i18n ) {
	Assessor.call( this, i18n );

	this._assessments = [
		introductionKeyword,
		keyphraseLength,
		keywordDensity,
		keywordStopWords,
		metaDescriptionKeyword,
		metaDescriptionLength,
		taxonomyTextLength,
		titleKeyword,
		titleWidth,
		urlKeyword,
		urlLength,
		urlStopWords
	];
};

module.exports = TaxonomyAssessor;

require( "util" ).inherits( module.exports, Assessor );


},{"util":251,"yoastseo/js/assessments/introductionKeywordAssessment.js":256,"yoastseo/js/assessments/keyphraseLengthAssessment.js":257,"yoastseo/js/assessments/keywordDensityAssessment.js":258,"yoastseo/js/assessments/keywordStopWordsAssessment.js":259,"yoastseo/js/assessments/metaDescriptionKeywordAssessment.js":260,"yoastseo/js/assessments/metaDescriptionLengthAssessment.js":261,"yoastseo/js/assessments/pageTitleWidthAssessment.js":262,"yoastseo/js/assessments/taxonomyTextLengthAssessment":269,"yoastseo/js/assessments/titleKeywordAssessment.js":275,"yoastseo/js/assessments/urlKeywordAssessment.js":277,"yoastseo/js/assessments/urlLengthAssessment.js":278,"yoastseo/js/assessments/urlStopWordsAssessment.js":279,"yoastseo/js/assessor.js":280}],15:[function(require,module,exports){
var $ = jQuery;

var _forEach = require( 'lodash/foreach' );

var removeMarks = require( 'yoastseo/js/markers/removeMarks' );

var MARK_TAG = 'yoastmark';

/**
 * Cleans the editor of any invalid marks. Invalid marks are marks where < and > are converted to
 * html entities by tinyMCE so these can be filtered out to keep the output text clean.
 *
 * @param {tinyMCE.Editor} editor The editor to remove invalid marks from.
 */
function removeInvalidMarks( editor ) {
	var html = editor.getContent();

	html = html
		.replace( new RegExp( '&lt;yoastmark.+?&gt;', 'g' ), '' )
		.replace( new RegExp( '&lt;/yoastmark&gt;', 'g' ), '' );

	editor.setContent( html );
}

/**
 * Puts a list of marks into the given tinyMCE editor
 *
 * @param {tinyMCE.Editor} editor The editor to apply the marks to.
 * @param {Paper} paper The paper for which the marks have been generated.
 * @param {Array.<Mark>} marks The marks to show in the editor.
 */
function markTinyMCE( editor, paper, marks ) {
	var dom = editor.dom;
	var html = editor.getContent();
	html = removeMarks( html );

	// Generate marked HTML.
	_forEach( marks, function( mark ) {
		html = mark.applyWithReplace( html );
	});

	// Replace the contents in the editor with the marked HTML.
	editor.setContent( html );

	removeInvalidMarks( editor );

	var markElements = dom.select( MARK_TAG );
	/*
	 * The `mce-bogus` data is an internal tinyMCE indicator that the elements themselves shouldn't be saved.
	 * Add data-mce-bogus after the elements have been inserted because setContent strips elements with data-mce-bogus.
	 */
	_forEach( markElements, function( markElement ) {
		markElement.setAttribute( 'data-mce-bogus', '1' );
	} );
}

/**
 * Returns a function that can decorate a tinyMCE editor
 *
 * @param {tinyMCE.Editor} editor The editor to return a function for.
 * @returns {Function} The function that can be called to decorate the editor.
 */
function tinyMCEDecorator( editor ) {
	window.test = editor;

	return markTinyMCE.bind( null, editor );
}

/**
 * Returns whether or not the editor has marks
 *
 * @param {tinyMCE.Editor} editor The editor.
 * @returns {boolean} Whether or not there are marks inside the editor.
 */
function editorHasMarks( editor ) {
	var content = editor.getContent({ format: 'raw' });

	return -1 !== content.indexOf( '<' + MARK_TAG );
}

/**
 * Removes marks currently in the given editor
 *
 * @param {tinyMCE.Editor} editor The editor to remove all marks for.
 */
function editorRemoveMarks( editor ) {
	// Create a decorator with the given editor.
	var decorator = tinyMCEDecorator( editor );

	// Calling the decorator with an empty array of marks will clear the editor of marks.
	decorator( null, [] );
}

module.exports = {
	tinyMCEDecorator: tinyMCEDecorator,

	editorHasMarks: editorHasMarks,
	editorRemoveMarks: editorRemoveMarks
};

},{"lodash/foreach":194,"yoastseo/js/markers/removeMarks":305}],16:[function(require,module,exports){
/**
 * Updates the traffic light present on the page
 *
 * @param {Object} indicator The indicator for the keyword score.
 */
function updateAdminBar( indicator ) {
	jQuery( '.adminbar-seo-score' )
		.attr( 'class', 'wpseo-score-icon adminbar-seo-score ' + indicator.className )
		.find( '.adminbar-seo-score-text' ).text( indicator.screenReaderText );
}

module.exports = {
	update: updateAdminBar
};

},{}],17:[function(require,module,exports){
/**
 * Updates the traffic light present on the page
 *
 * @param {Object} indicator The indicator for the keyword score.
 */
function updateTrafficLight( indicator ) {
	var trafficLight = jQuery( '.yst-traffic-light' );
	var trafficLightLink = trafficLight.closest( '.wpseo-meta-section-link' );

	// Update the traffic light image.
	trafficLight
		.attr( 'class', 'yst-traffic-light ' + indicator.className )
		.attr( 'alt', '' );

	// Update the traffic light link.
	trafficLightLink.attr( 'title', indicator.fullText );
}

module.exports = {
	update: updateTrafficLight
};

},{}],18:[function(require,module,exports){
/* global YoastSEO: true, wpseoTermScraperL10n, YoastReplaceVarPlugin, console, require */

var isUndefined = require( 'lodash/isUndefined' );

var getIndicatorForScore = require( './analysis/getIndicatorForScore' );
var TabManager = require( './analysis/tabManager' );
var tmceHelper = require( './wp-seo-tinymce' );

var updateTrafficLight = require( './ui/trafficLight' ).update;
var updateAdminBar = require( './ui/adminBar' ).update;

var getTranslations = require( './analysis/getTranslations' );
var isKeywordAnalysisActive = require( './analysis/isKeywordAnalysisActive' );
var isContentAnalysisActive = require( './analysis/isContentAnalysisActive' );
var snippetPreviewHelpers = require( './analysis/snippetPreview' );

window.yoastHideMarkers = true;

(function( $ ) {
	'use strict';

	var snippetContainer;
	var App = require( 'yoastseo' ).App;

	var TaxonomyAssessor = require( './assessors/taxonomyAssessor' );
	var UsedKeywords = require( './analysis/usedKeywords' );

	var app, snippetPreview;

	var termSlugInput;

	var tabManager;

	/**
	 * The HTML 'id' attribute for the TinyMCE editor.
	 * @type {String}
	 */
	var tmceId = 'description';

	var TermScraper = function() {
		if ( typeof CKEDITOR === 'object' ) {
			console.warn( 'YoastSEO currently doesn\'t support ckEditor. The content analysis currently only works with the HTML editor or TinyMCE.' );
		}
	};

	/**
	 * Returns data fetched from input fields.
	 * @returns {{keyword: *, meta: *, text: *, pageTitle: *, title: *, url: *, baseUrl: *, snippetTitle: *, snippetMeta: *, snippetCite: *}}
	 */
	TermScraper.prototype.getData = function() {
		return {
			title: this.getTitle(),
			keyword: isKeywordAnalysisActive() ? this.getKeyword() : '',
			text: this.getText(),
			meta: this.getMeta(),
			url: this.getUrl(),
			permalink: this.getPermalink(),
			snippetCite: this.getSnippetCite(),
			snippetTitle: this.getSnippetTitle(),
			snippetMeta: this.getSnippetMeta(),
			name: this.getName(),
			baseUrl: this.getBaseUrl(),
			pageTitle: this.getPageTitle()
		};
	};

	/**
	 * Returns the title from the DOM.
	 *
	 * @returns {string} The title.
	 */
	TermScraper.prototype.getTitle = function() {
		return document.getElementById( 'hidden_wpseo_title' ).value;
	};

	/**
	 * Returns the keyword from the DOM.
	 *
	 * @returns {string} The keyword.
	 */
	TermScraper.prototype.getKeyword = function() {
		var elem, val;

		elem = document.getElementById( 'wpseo_focuskw' );
		val = elem.value;
		if ( val === '' ) {
			val = document.getElementById( 'name' ).value;
			elem.placeholder = val;
		}

		return val;
	};

	/**
	 * Returns the text from the DOM.
	 *
	 * @returns {string} The text.
	 */
	TermScraper.prototype.getText = function() {
		return tmceHelper.getContentTinyMce( tmceId );
	};

	/**
	 * Returns the meta description from the DOM.
	 *
	 * @returns {string} The meta.
	 */
	TermScraper.prototype.getMeta = function() {
		var  val = '';

		var elem = document.getElementById( 'hidden_wpseo_desc' );
		if ( elem !== null ) {
			val = elem.value;
		}

		return val;
	};

	/**
	 * Returns the url from the DOM.
	 *
	 * @returns {string} The url.
	 */
	TermScraper.prototype.getUrl = function() {
		return document.getElementById( 'slug' ).value;
	};

	/**
	 * Returns the permalink from the DOM.
	 *
	 * @returns {string} The permalink.
	 */
	TermScraper.prototype.getPermalink = function() {
		var url = this.getUrl();

		return this.getBaseUrl() + url + '/';
	};

	/**
	 * Returns the snippet cite from the DOM.
	 *
	 * @returns {string} The snippet cite.
	 */
	TermScraper.prototype.getSnippetCite = function() {
		return this.getUrl();
	};

	/**
	 * Returns the snippet title from the DOM.
	 *
	 * @returns {string} The snippet title.
	 */
	TermScraper.prototype.getSnippetTitle = function() {
		return document.getElementById( 'hidden_wpseo_title' ).value;
	};

	/**
	 * Returns the snippet meta from the DOM.
	 *
	 * @returns {string} The snippet meta.
	 */
	TermScraper.prototype.getSnippetMeta = function() {
		var val = '';

		var elem = document.getElementById( 'hidden_wpseo_desc' );
		if ( elem !== null ) {
			val = elem.value;
		}

		return val;
	};

	/**
	 * Returns the name from the DOM.
	 *
	 * @returns {string} The name.
	 */
	TermScraper.prototype.getName = function() {
		return document.getElementById( 'name' ).value;
	};

	/**
	 * Returns the base url from the DOM.
	 *
	 * @returns {string} The base url.
	 */
	TermScraper.prototype.getBaseUrl = function() {
		return wpseoTermScraperL10n.base_url;
	};

	/**
	 * Returns the page title from the DOM.
	 *
	 * @returns {string} The page title.
	 */
	TermScraper.prototype.getPageTitle = function() {
		return document.getElementById( 'hidden_wpseo_title' ).value;
	};

	/**
	 * When the snippet is updated, update the (hidden) fields on the page.
	 * @param {Object} value Value for the data to set.
	 * @param {String} type The field(type) that the data is set for.
	 */
	TermScraper.prototype.setDataFromSnippet = function( value, type ) {
		switch ( type ) {
			case 'snippet_meta':
				document.getElementById( 'hidden_wpseo_desc' ).value = value;
				break;
			case 'snippet_cite':
				document.getElementById( 'slug' ).value = value;
				break;
			case 'snippet_title':
				document.getElementById( 'hidden_wpseo_title' ).value = value;
				break;
			default:
				break;
		}
	};

	/**
	 * The data passed from the snippet editor.
	 *
	 * @param {Object} data
	 * @param {string} data.title
	 * @param {string} data.urlPath
	 * @param {string} data.metaDesc
	 */
	TermScraper.prototype.saveSnippetData = function( data ) {
		this.setDataFromSnippet( data.title, 'snippet_title' );
		this.setDataFromSnippet( data.urlPath, 'snippet_cite' );
		this.setDataFromSnippet( data.metaDesc, 'snippet_meta' );
	};

	/**
	 * binds elements
	 */
	TermScraper.prototype.bindElementEvents = function( app ) {
		this.inputElementEventBinder( app );
	};

	/**
	 * binds the renewData function on the change of inputelements.
	 */
	TermScraper.prototype.inputElementEventBinder = function( app ) {
		var elems = [ 'name', tmceId, 'slug', 'wpseo_focuskw' ];
		for ( var i = 0; i < elems.length; i++ ) {
			var elem = document.getElementById( elems[ i ] );
			if ( elem !== null ) {
				document.getElementById( elems[ i ] ).addEventListener( 'input', app.refresh.bind( app ) );
			}
		}
		tmceHelper.tinyMceEventBinder( app, tmceId );
	};

	/**
	 * Creates SVG for the overall score.
	 *
	 * @param {number} score Score to save.
	 */
	TermScraper.prototype.saveScores = function( score ) {
		var indicator = getIndicatorForScore( score );
		var keyword = this.getKeyword();

		document.getElementById( 'hidden_wpseo_linkdex' ).value = score;
		jQuery( window ).trigger( 'YoastSEO:numericScore', score );

		tabManager.updateKeywordTab( score, keyword );

		updateTrafficLight( indicator );
		updateAdminBar( indicator );
	};
	/**
	 * Saves the content score to a hidden field.
	 *
	 * @param {number} score The score calculated by the content assessor.
	 */
	TermScraper.prototype.saveContentScore = function( score ) {
		var indicator = getIndicatorForScore( score );

		tabManager.updateContentTab( score );

		if ( ! isKeywordAnalysisActive() ) {
			updateTrafficLight( indicator );
			updateAdminBar( indicator );
		}

		$( '#hidden_wpseo_content_score' ).val( score );
	};

	/**
	 * Initializes keyword tab with the correct template.
	 */
	TermScraper.prototype.initKeywordTabTemplate = function() {
		// Remove default functionality to prevent scrolling to top.
		$( '.wpseo-metabox-tabs' ).on( 'click', '.wpseo_tablink', function( ev ) {
			ev.preventDefault();
		});
	};

	/**
	 * Get the editor created via wp_editor() and append it to the term-description-wrap
	 * table cell. This way we can use the wp tinyMCE editor on the description field.
	 */
	var insertTinyMCE = function() {
		// Get the table cell that contains the description textarea.
		var descriptionTd = jQuery( '.term-description-wrap' ).find( 'td' );

		// Get the textNode from the original textarea.
		var textNode = descriptionTd.find( 'textarea' ).val();

		// Get the editor container.
		var newEditor = document.getElementById( 'wp-description-wrap' );

		// Get the description help text below the textarea.
		var text = descriptionTd.find( 'p' );

		// Empty the TD with the old description textarea.
		descriptionTd.html( '' );

		/*
		 * The editor is printed out via PHP as child of the form and initially
		 * hidden with a child `>` CSS selector. We now move the editor and the
		 * help text in a new position so the previous CSS rule won't apply any
		 * longer and the editor will be visible.
		 */
		descriptionTd.append( newEditor ).append( text );

		// Populate the editor textarea with the original content,
		document.getElementById( 'description' ).value = textNode;
	};

	/**
	 * Initializes the snippet preview.
	 *
	 * @param {TermScraper} termScraper
	 * @returns {SnippetPreview}
	 */
	function initSnippetPreview( termScraper ) {
		return snippetPreviewHelpers.create( snippetContainer, {
			title: termScraper.getSnippetTitle(),
			urlPath: termScraper.getSnippetCite(),
			metaDesc: termScraper.getSnippetMeta()
		}, termScraper.saveSnippetData.bind( termScraper ) );
	}

	/**
	 * Function to handle when the user updates the term slug
	 */
	function updatedTermSlug() {
		snippetPreview.setUrlPath( termSlugInput.val() );
	}

	/**
	 * Adds a watcher on the term slug input field
	 */
	function initTermSlugWatcher() {
		termSlugInput = $( '#slug' );
		termSlugInput.on( 'change', updatedTermSlug );
	}

	/**
	 * Retrieves the target to be passed to the App.
	 *
	 * @returns {Object} The targets object for the App.
	 */
	function retrieveTargets() {
		var targets = {};

		if ( isKeywordAnalysisActive() ) {
			targets.output = 'wpseo_analysis';
		}

		if ( isContentAnalysisActive() ) {
			targets.contentOutput = 'yoast-seo-content-analysis';
		}

		return targets;
	}

	/**
	 * Initializes keyword analysis.
	 *
	 * @param {App} app The App object.
	 * @param {TermScraper} termScraper The post scraper object.
	 */
	function initializeKeywordAnalysis( app, termScraper ) {
		var savedKeywordScore = $( '#hidden_wpseo_linkdex' ).val();
		var usedKeywords = new UsedKeywords( '#wpseo_focuskw', 'get_term_keyword_usage', wpseoTermScraperL10n, app );

		usedKeywords.init();
		termScraper.initKeywordTabTemplate();

		var indicator = getIndicatorForScore( savedKeywordScore );

		updateTrafficLight( indicator );
		updateAdminBar( indicator );
	}

	/**
	 * Initializes content analysis
	 */
	function initializeContentAnalysis() {
		var savedContentScore = $( '#hidden_wpseo_content_score' ).val();

		var indicator = getIndicatorForScore( savedContentScore );

		updateTrafficLight( indicator );
		updateAdminBar( indicator );
	}

	jQuery( document ).ready(function() {
		var args, termScraper, translations;

		snippetContainer = $( '#wpseo_snippet' );

		insertTinyMCE();

		$( '#wpseo_analysis' ).after( '<div id="yoast-seo-content-analysis"></div>' );

		tabManager = new TabManager({
			strings: wpseoTermScraperL10n,
			focusKeywordField: '#wpseo_focuskw',
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive()
		});

		tabManager.init();

		termScraper = new TermScraper();
		snippetPreview = initSnippetPreview( termScraper );

		args = {
			// ID's of elements that need to trigger updating the analyzer.
			elementTarget: [ tmceId, 'yoast_wpseo_focuskw', 'yoast_wpseo_metadesc', 'excerpt', 'editable-post-name', 'editable-post-name-full' ],
			targets: retrieveTargets(),
			callbacks: {
				getData: termScraper.getData.bind( termScraper )
			},
			locale: wpseoTermScraperL10n.locale,
			contentAnalysisActive: isContentAnalysisActive(),
			keywordAnalysisActive: isKeywordAnalysisActive(),
			snippetPreview: snippetPreview
		};

		if ( isKeywordAnalysisActive() ) {
			args.callbacks.saveScores = termScraper.saveScores.bind( termScraper );
		}

		if ( isContentAnalysisActive() ) {
			args.callbacks.saveContentScore = termScraper.saveContentScore.bind( termScraper );
		}

		translations = getTranslations();
		if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
			args.translations = translations;
		}

		app = new App( args );

		if ( isKeywordAnalysisActive() ) {
			app.seoAssessor = new TaxonomyAssessor( app.i18n );
			app.seoAssessorPresenter.assessor = app.seoAssessor;
		}

		window.YoastSEO = {};
		window.YoastSEO.app = app;

		termScraper.initKeywordTabTemplate();

		// Init Plugins.
		YoastSEO.wp = {};
		YoastSEO.wp.replaceVarsPlugin = new YoastReplaceVarPlugin( app );

		// For backwards compatibility.
		YoastSEO.analyzerArgs = args;

		initTermSlugWatcher();
		termScraper.bindElementEvents( app );

		if ( isKeywordAnalysisActive() ) {
			initializeKeywordAnalysis( app, termScraper );
			tabManager.getKeywordTab().activate();
		} else if ( isContentAnalysisActive() ) {
			tabManager.getContentTab().activate();
		} else {
			snippetPreviewHelpers.isolate( snippetContainer );
		}

		if ( isContentAnalysisActive() ) {
			initializeContentAnalysis();
		}

		jQuery( window ).trigger( 'YoastSEO:ready' );
	} );
}( jQuery ));

},{"./analysis/getIndicatorForScore":4,"./analysis/getTranslations":7,"./analysis/isContentAnalysisActive":8,"./analysis/isKeywordAnalysisActive":9,"./analysis/snippetPreview":11,"./analysis/tabManager":12,"./analysis/usedKeywords":13,"./assessors/taxonomyAssessor":14,"./ui/adminBar":16,"./ui/trafficLight":17,"./wp-seo-tinymce":19,"lodash/isUndefined":218,"yoastseo":252}],19:[function(require,module,exports){
/* global tinyMCE, require, YoastSEO */

var forEach = require( 'lodash/forEach' );
var isUndefined = require( 'lodash/isUndefined' );
var editorHasMarks = require( './decorator/tinyMCE' ).editorHasMarks;
var editorRemoveMarks = require( './decorator/tinyMCE' ).editorRemoveMarks;

(function() {
	'use strict';

	/**
	 * Gets content from the content field by element id.
	 *
	 * @param {String} content_id The (HTML) id attribute for the TinyMCE field.
	 * @returns {String}
	 */
	function tinyMCEElementContent( content_id ) {
		return document.getElementById( content_id ) && document.getElementById( content_id ).value || '';
	}

	/**
	 * Returns whether or not the tinyMCE script is available on the page.
	 *
	 * @returns {boolean}
	 */
	function isTinyMCELoaded() {
		return (
			typeof tinyMCE !== 'undefined' &&
			typeof tinyMCE.editors !== 'undefined' &&
			tinyMCE.editors.length !== 0
		);
	}

	/**
	 * Returns whether or not a tinyMCE editor with the given ID is available.
	 *
	 * @param {string} editorID The ID of the tinyMCE editor.
	 */
	function isTinyMCEAvailable( editorID ) {
		if ( !isTinyMCELoaded() ) {
			return false;
		}

		var editor = tinyMCE.get( editorID );

		return (
			editor !== null && !editor.isHidden()
		);
	}

	/**
	 * Converts the html entities for symbols back to the original symbol. For now this only converts the & symbol.
	 * @param {String} text The text to replace the '&amp;' entities.
	 * @returns {String} text Text with html entities replaced by the symbol.
	 */
	function convertHtmlEntities( text ) {
		// Create regular expression, this searches for the html entity '&amp;', the 'g' param is for searching the whole text.
		var regularExpression = new RegExp('&amp;','g');
		return text.replace(regularExpression, '&');
	}

	/**
	 * Returns the value of the content field via TinyMCE object, or ff tinyMCE isn't initialized via the content element id.
	 * Also converts 'amp;' to & in the content.
	 * @param {String} content_id The (HTML) id attribute for the TinyMCE field.
	 * @returns {String} Content from the TinyMCE editor.
	 */
	function getContentTinyMce( content_id ) {
		//if no TinyMce object available
		var content = '';
		if ( isTinyMCEAvailable( content_id ) === false ) {
			content = tinyMCEElementContent( content_id );
		}
		else {
			content = tinyMCE.get( content_id ).getContent();
		}

		return convertHtmlEntities( content );
	}
	/**
	 * Adds an event handler to certain tinyMCE events
	 *
	 * @param {string} editorId The ID for the tinyMCE editor.
	 * @param {Array<string>} events The events to bind to.
	 * @param {Function} callback The function to call when an event occurs.
	 */
	function addEventHandler( editorId, events, callback ) {
		if ( typeof tinyMCE === 'undefined' || typeof tinyMCE.on !== 'function' ) {
			return;
		}

		tinyMCE.on( 'addEditor', function( evt ) {
			var editor = evt.editor;

			if ( editor.id !== editorId ) {
				return;
			}

			forEach( events, function( eventName ) {
				editor.on( eventName, callback );
			} );
		});
	}

	/**
	 * Calls the function in the YoastSEO.js app that disables the marker (eye)icons.
	 */
	function disableMarkerButtons() {
		if ( ! isUndefined( YoastSEO.app.contentAssessorPresenter ) ) {
			YoastSEO.app.contentAssessorPresenter.disableMarkerButtons();
		}

		if ( ! isUndefined( YoastSEO.app.seoAssessorPresenter ) ) {
			YoastSEO.app.seoAssessorPresenter.disableMarkerButtons();
		}
	}

	/**
	 * Calls the function in the YoastSEO.js app that enables the marker (eye)icons.
	 */
	function enableMarkerButtons() {
		if ( ! isUndefined( YoastSEO.app.contentAssessorPresenter ) ) {
			YoastSEO.app.contentAssessorPresenter.enableMarkerButtons();
		}

		if ( ! isUndefined( YoastSEO.app.seoAssessorPresenter ) ) {
			YoastSEO.app.seoAssessorPresenter.enableMarkerButtons();
		}
	}

	/**
	 * Check if the TinyMCE editor is created in the DOM. If it doesn't exist yet an on create event created.
	 * This enables the marker buttons, when TinyMCE is created.
	 */
	function wpTextViewOnInitCheck() {
		// If #wp-content-wrap has the 'html-active' class, text view is enabled in WordPress.
		// TMCE is not available, the text cannot be marked and so the marker buttons are disabled.
		if ( jQuery( '#wp-content-wrap' ).hasClass( 'html-active' ) ) {
			// The enable/disable marker functions are not called here,
			// because the render function(in yoastseo lib) doesn't have to be called.
			if ( ! isUndefined( YoastSEO.app.contentAssessorPresenter ) ) {
				YoastSEO.app.contentAssessorPresenter._disableMarkerButtons = true;
			}
			if ( ! isUndefined( YoastSEO.app.seoAssessorPresenter ) ) {
				YoastSEO.app.seoAssessorPresenter._disableMarkerButtons = true;
			}

			if( isTinyMCELoaded() ) {
				tinyMCE.on( 'AddEditor' , function( ) {
					enableMarkerButtons( );
				} );
			}
		}
	}

	/**
	 * Binds the renewData functionality to the TinyMCE content field on the change of input elements.
	 *
	 * @param {App} app YoastSeo application.
	 * @param {String} tmceId The ID of the tinyMCE editor.
	 */
	function tinyMceEventBinder( app, tmceId ) {
		addEventHandler( tmceId, [ 'input', 'change', 'cut', 'paste' ], app.refresh.bind( app ) );

		addEventHandler( tmceId, [ 'hide' ], disableMarkerButtons );
		addEventHandler( tmceId, [ 'init', 'show' ], enableMarkerButtons );

		addEventHandler( 'content', [ 'focus' ], function( evt ) {
			var editor = evt.target;

			if ( editorHasMarks( editor ) ) {
				editorRemoveMarks( editor );

				YoastSEO.app.disableMarkers();
			}
		} );
	}

	module.exports = {
		addEventHandler: addEventHandler,
		tinyMceEventBinder: tinyMceEventBinder,
		getContentTinyMce: getContentTinyMce,
		isTinyMCEAvailable: isTinyMCEAvailable,
		isTinyMCELoaded: isTinyMCELoaded,
		disableMarkerButtons: disableMarkerButtons,
		enableMarkerButtons: enableMarkerButtons,
		wpTextViewOnInitCheck: wpTextViewOnInitCheck
	};
})(jQuery);

},{"./decorator/tinyMCE":15,"lodash/forEach":194,"lodash/isUndefined":218}],20:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],21:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],22:[function(require,module,exports){
/**
 * @preserve jed.js https://github.com/SlexAxton/Jed
 */
/*
-----------
A gettext compatible i18n library for modern JavaScript Applications

by Alex Sexton - AlexSexton [at] gmail - @SlexAxton

MIT License

A jQuery Foundation project - requires CLA to contribute -
https://contribute.jquery.org/CLA/



Jed offers the entire applicable GNU gettext spec'd set of
functions, but also offers some nicer wrappers around them.
The api for gettext was written for a language with no function
overloading, so Jed allows a little more of that.

Many thanks to Joshua I. Miller - unrtst@cpan.org - who wrote
gettext.js back in 2008. I was able to vet a lot of my ideas
against his. I also made sure Jed passed against his tests
in order to offer easy upgrades -- jsgettext.berlios.de
*/
(function (root, undef) {

  // Set up some underscore-style functions, if you already have
  // underscore, feel free to delete this section, and use it
  // directly, however, the amount of functions used doesn't
  // warrant having underscore as a full dependency.
  // Underscore 1.3.0 was used to port and is licensed
  // under the MIT License by Jeremy Ashkenas.
  var ArrayProto    = Array.prototype,
      ObjProto      = Object.prototype,
      slice         = ArrayProto.slice,
      hasOwnProp    = ObjProto.hasOwnProperty,
      nativeForEach = ArrayProto.forEach,
      breaker       = {};

  // We're not using the OOP style _ so we don't need the
  // extra level of indirection. This still means that you
  // sub out for real `_` though.
  var _ = {
    forEach : function( obj, iterator, context ) {
      var i, l, key;
      if ( obj === null ) {
        return;
      }

      if ( nativeForEach && obj.forEach === nativeForEach ) {
        obj.forEach( iterator, context );
      }
      else if ( obj.length === +obj.length ) {
        for ( i = 0, l = obj.length; i < l; i++ ) {
          if ( i in obj && iterator.call( context, obj[i], i, obj ) === breaker ) {
            return;
          }
        }
      }
      else {
        for ( key in obj) {
          if ( hasOwnProp.call( obj, key ) ) {
            if ( iterator.call (context, obj[key], key, obj ) === breaker ) {
              return;
            }
          }
        }
      }
    },
    extend : function( obj ) {
      this.forEach( slice.call( arguments, 1 ), function ( source ) {
        for ( var prop in source ) {
          obj[prop] = source[prop];
        }
      });
      return obj;
    }
  };
  // END Miniature underscore impl

  // Jed is a constructor function
  var Jed = function ( options ) {
    // Some minimal defaults
    this.defaults = {
      "locale_data" : {
        "messages" : {
          "" : {
            "domain"       : "messages",
            "lang"         : "en",
            "plural_forms" : "nplurals=2; plural=(n != 1);"
          }
          // There are no default keys, though
        }
      },
      // The default domain if one is missing
      "domain" : "messages",
      // enable debug mode to log untranslated strings to the console
      "debug" : false
    };

    // Mix in the sent options with the default options
    this.options = _.extend( {}, this.defaults, options );
    this.textdomain( this.options.domain );

    if ( options.domain && ! this.options.locale_data[ this.options.domain ] ) {
      throw new Error('Text domain set to non-existent domain: `' + options.domain + '`');
    }
  };

  // The gettext spec sets this character as the default
  // delimiter for context lookups.
  // e.g.: context\u0004key
  // If your translation company uses something different,
  // just change this at any time and it will use that instead.
  Jed.context_delimiter = String.fromCharCode( 4 );

  function getPluralFormFunc ( plural_form_string ) {
    return Jed.PF.compile( plural_form_string || "nplurals=2; plural=(n != 1);");
  }

  function Chain( key, i18n ){
    this._key = key;
    this._i18n = i18n;
  }

  // Create a chainable api for adding args prettily
  _.extend( Chain.prototype, {
    onDomain : function ( domain ) {
      this._domain = domain;
      return this;
    },
    withContext : function ( context ) {
      this._context = context;
      return this;
    },
    ifPlural : function ( num, pkey ) {
      this._val = num;
      this._pkey = pkey;
      return this;
    },
    fetch : function ( sArr ) {
      if ( {}.toString.call( sArr ) != '[object Array]' ) {
        sArr = [].slice.call(arguments, 0);
      }
      return ( sArr && sArr.length ? Jed.sprintf : function(x){ return x; } )(
        this._i18n.dcnpgettext(this._domain, this._context, this._key, this._pkey, this._val),
        sArr
      );
    }
  });

  // Add functions to the Jed prototype.
  // These will be the functions on the object that's returned
  // from creating a `new Jed()`
  // These seem redundant, but they gzip pretty well.
  _.extend( Jed.prototype, {
    // The sexier api start point
    translate : function ( key ) {
      return new Chain( key, this );
    },

    textdomain : function ( domain ) {
      if ( ! domain ) {
        return this._textdomain;
      }
      this._textdomain = domain;
    },

    gettext : function ( key ) {
      return this.dcnpgettext.call( this, undef, undef, key );
    },

    dgettext : function ( domain, key ) {
     return this.dcnpgettext.call( this, domain, undef, key );
    },

    dcgettext : function ( domain , key /*, category */ ) {
      // Ignores the category anyways
      return this.dcnpgettext.call( this, domain, undef, key );
    },

    ngettext : function ( skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, undef, skey, pkey, val );
    },

    dngettext : function ( domain, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    dcngettext : function ( domain, skey, pkey, val/*, category */) {
      return this.dcnpgettext.call( this, domain, undef, skey, pkey, val );
    },

    pgettext : function ( context, key ) {
      return this.dcnpgettext.call( this, undef, context, key );
    },

    dpgettext : function ( domain, context, key ) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    dcpgettext : function ( domain, context, key/*, category */) {
      return this.dcnpgettext.call( this, domain, context, key );
    },

    npgettext : function ( context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, undef, context, skey, pkey, val );
    },

    dnpgettext : function ( domain, context, skey, pkey, val ) {
      return this.dcnpgettext.call( this, domain, context, skey, pkey, val );
    },

    // The most fully qualified gettext function. It has every option.
    // Since it has every option, we can use it from every other method.
    // This is the bread and butter.
    // Technically there should be one more argument in this function for 'Category',
    // but since we never use it, we might as well not waste the bytes to define it.
    dcnpgettext : function ( domain, context, singular_key, plural_key, val ) {
      // Set some defaults

      plural_key = plural_key || singular_key;

      // Use the global domain default if one
      // isn't explicitly passed in
      domain = domain || this._textdomain;

      var fallback;

      // Handle special cases

      // No options found
      if ( ! this.options ) {
        // There's likely something wrong, but we'll return the correct key for english
        // We do this by instantiating a brand new Jed instance with the default set
        // for everything that could be broken.
        fallback = new Jed();
        return fallback.dcnpgettext.call( fallback, undefined, undefined, singular_key, plural_key, val );
      }

      // No translation data provided
      if ( ! this.options.locale_data ) {
        throw new Error('No locale data provided.');
      }

      if ( ! this.options.locale_data[ domain ] ) {
        throw new Error('Domain `' + domain + '` was not found.');
      }

      if ( ! this.options.locale_data[ domain ][ "" ] ) {
        throw new Error('No locale meta information provided.');
      }

      // Make sure we have a truthy key. Otherwise we might start looking
      // into the empty string key, which is the options for the locale
      // data.
      if ( ! singular_key ) {
        throw new Error('No translation key found.');
      }

      var key  = context ? context + Jed.context_delimiter + singular_key : singular_key,
          locale_data = this.options.locale_data,
          dict = locale_data[ domain ],
          defaultConf = (locale_data.messages || this.defaults.locale_data.messages)[""],
          pluralForms = dict[""].plural_forms || dict[""]["Plural-Forms"] || dict[""]["plural-forms"] || defaultConf.plural_forms || defaultConf["Plural-Forms"] || defaultConf["plural-forms"],
          val_list,
          res;

      var val_idx;
      if (val === undefined) {
        // No value passed in; assume singular key lookup.
        val_idx = 0;

      } else {
        // Value has been passed in; use plural-forms calculations.

        // Handle invalid numbers, but try casting strings for good measure
        if ( typeof val != 'number' ) {
          val = parseInt( val, 10 );

          if ( isNaN( val ) ) {
            throw new Error('The number that was passed in is not a number.');
          }
        }

        val_idx = getPluralFormFunc(pluralForms)(val);
      }

      // Throw an error if a domain isn't found
      if ( ! dict ) {
        throw new Error('No domain named `' + domain + '` could be found.');
      }

      val_list = dict[ key ];

      // If there is no match, then revert back to
      // english style singular/plural with the keys passed in.
      if ( ! val_list || val_idx > val_list.length ) {
        if (this.options.missing_key_callback) {
          this.options.missing_key_callback(key, domain);
        }
        res = [ singular_key, plural_key ];

        // collect untranslated strings
        if (this.options.debug===true) {
          console.log(res[ getPluralFormFunc(pluralForms)( val ) ]);
        }
        return res[ getPluralFormFunc()( val ) ];
      }

      res = val_list[ val_idx ];

      // This includes empty strings on purpose
      if ( ! res  ) {
        res = [ singular_key, plural_key ];
        return res[ getPluralFormFunc()( val ) ];
      }
      return res;
    }
  });


  // We add in sprintf capabilities for post translation value interolation
  // This is not internally used, so you can remove it if you have this
  // available somewhere else, or want to use a different system.

  // We _slightly_ modify the normal sprintf behavior to more gracefully handle
  // undefined values.

  /**
   sprintf() for JavaScript 0.7-beta1
   http://www.diveintojavascript.com/projects/javascript-sprintf

   Copyright (c) Alexandru Marasteanu <alexaholic [at) gmail (dot] com>
   All rights reserved.

   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions are met:
       * Redistributions of source code must retain the above copyright
         notice, this list of conditions and the following disclaimer.
       * Redistributions in binary form must reproduce the above copyright
         notice, this list of conditions and the following disclaimer in the
         documentation and/or other materials provided with the distribution.
       * Neither the name of sprintf() for JavaScript nor the
         names of its contributors may be used to endorse or promote products
         derived from this software without specific prior written permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
   ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
   WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
   DISCLAIMED. IN NO EVENT SHALL Alexandru Marasteanu BE LIABLE FOR ANY
   DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
   ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
  */
  var sprintf = (function() {
    function get_type(variable) {
      return Object.prototype.toString.call(variable).slice(8, -1).toLowerCase();
    }
    function str_repeat(input, multiplier) {
      for (var output = []; multiplier > 0; output[--multiplier] = input) {/* do nothing */}
      return output.join('');
    }

    var str_format = function() {
      if (!str_format.cache.hasOwnProperty(arguments[0])) {
        str_format.cache[arguments[0]] = str_format.parse(arguments[0]);
      }
      return str_format.format.call(null, str_format.cache[arguments[0]], arguments);
    };

    str_format.format = function(parse_tree, argv) {
      var cursor = 1, tree_length = parse_tree.length, node_type = '', arg, output = [], i, k, match, pad, pad_character, pad_length;
      for (i = 0; i < tree_length; i++) {
        node_type = get_type(parse_tree[i]);
        if (node_type === 'string') {
          output.push(parse_tree[i]);
        }
        else if (node_type === 'array') {
          match = parse_tree[i]; // convenience purposes only
          if (match[2]) { // keyword argument
            arg = argv[cursor];
            for (k = 0; k < match[2].length; k++) {
              if (!arg.hasOwnProperty(match[2][k])) {
                throw(sprintf('[sprintf] property "%s" does not exist', match[2][k]));
              }
              arg = arg[match[2][k]];
            }
          }
          else if (match[1]) { // positional argument (explicit)
            arg = argv[match[1]];
          }
          else { // positional argument (implicit)
            arg = argv[cursor++];
          }

          if (/[^s]/.test(match[8]) && (get_type(arg) != 'number')) {
            throw(sprintf('[sprintf] expecting number but found %s', get_type(arg)));
          }

          // Jed EDIT
          if ( typeof arg == 'undefined' || arg === null ) {
            arg = '';
          }
          // Jed EDIT

          switch (match[8]) {
            case 'b': arg = arg.toString(2); break;
            case 'c': arg = String.fromCharCode(arg); break;
            case 'd': arg = parseInt(arg, 10); break;
            case 'e': arg = match[7] ? arg.toExponential(match[7]) : arg.toExponential(); break;
            case 'f': arg = match[7] ? parseFloat(arg).toFixed(match[7]) : parseFloat(arg); break;
            case 'o': arg = arg.toString(8); break;
            case 's': arg = ((arg = String(arg)) && match[7] ? arg.substring(0, match[7]) : arg); break;
            case 'u': arg = Math.abs(arg); break;
            case 'x': arg = arg.toString(16); break;
            case 'X': arg = arg.toString(16).toUpperCase(); break;
          }
          arg = (/[def]/.test(match[8]) && match[3] && arg >= 0 ? '+'+ arg : arg);
          pad_character = match[4] ? match[4] == '0' ? '0' : match[4].charAt(1) : ' ';
          pad_length = match[6] - String(arg).length;
          pad = match[6] ? str_repeat(pad_character, pad_length) : '';
          output.push(match[5] ? arg + pad : pad + arg);
        }
      }
      return output.join('');
    };

    str_format.cache = {};

    str_format.parse = function(fmt) {
      var _fmt = fmt, match = [], parse_tree = [], arg_names = 0;
      while (_fmt) {
        if ((match = /^[^\x25]+/.exec(_fmt)) !== null) {
          parse_tree.push(match[0]);
        }
        else if ((match = /^\x25{2}/.exec(_fmt)) !== null) {
          parse_tree.push('%');
        }
        else if ((match = /^\x25(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?([b-fosuxX])/.exec(_fmt)) !== null) {
          if (match[2]) {
            arg_names |= 1;
            var field_list = [], replacement_field = match[2], field_match = [];
            if ((field_match = /^([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
              field_list.push(field_match[1]);
              while ((replacement_field = replacement_field.substring(field_match[0].length)) !== '') {
                if ((field_match = /^\.([a-z_][a-z_\d]*)/i.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else if ((field_match = /^\[(\d+)\]/.exec(replacement_field)) !== null) {
                  field_list.push(field_match[1]);
                }
                else {
                  throw('[sprintf] huh?');
                }
              }
            }
            else {
              throw('[sprintf] huh?');
            }
            match[2] = field_list;
          }
          else {
            arg_names |= 2;
          }
          if (arg_names === 3) {
            throw('[sprintf] mixing positional and named placeholders is not (yet) supported');
          }
          parse_tree.push(match);
        }
        else {
          throw('[sprintf] huh?');
        }
        _fmt = _fmt.substring(match[0].length);
      }
      return parse_tree;
    };

    return str_format;
  })();

  var vsprintf = function(fmt, argv) {
    argv.unshift(fmt);
    return sprintf.apply(null, argv);
  };

  Jed.parse_plural = function ( plural_forms, n ) {
    plural_forms = plural_forms.replace(/n/g, n);
    return Jed.parse_expression(plural_forms);
  };

  Jed.sprintf = function ( fmt, args ) {
    if ( {}.toString.call( args ) == '[object Array]' ) {
      return vsprintf( fmt, [].slice.call(args) );
    }
    return sprintf.apply(this, [].slice.call(arguments) );
  };

  Jed.prototype.sprintf = function () {
    return Jed.sprintf.apply(this, arguments);
  };
  // END sprintf Implementation

  // Start the Plural forms section
  // This is a full plural form expression parser. It is used to avoid
  // running 'eval' or 'new Function' directly against the plural
  // forms.
  //
  // This can be important if you get translations done through a 3rd
  // party vendor. I encourage you to use this instead, however, I
  // also will provide a 'precompiler' that you can use at build time
  // to output valid/safe function representations of the plural form
  // expressions. This means you can build this code out for the most
  // part.
  Jed.PF = {};

  Jed.PF.parse = function ( p ) {
    var plural_str = Jed.PF.extractPluralExpr( p );
    return Jed.PF.parser.parse.call(Jed.PF.parser, plural_str);
  };

  Jed.PF.compile = function ( p ) {
    // Handle trues and falses as 0 and 1
    function imply( val ) {
      return (val === true ? 1 : val ? val : 0);
    }

    var ast = Jed.PF.parse( p );
    return function ( n ) {
      return imply( Jed.PF.interpreter( ast )( n ) );
    };
  };

  Jed.PF.interpreter = function ( ast ) {
    return function ( n ) {
      var res;
      switch ( ast.type ) {
        case 'GROUP':
          return Jed.PF.interpreter( ast.expr )( n );
        case 'TERNARY':
          if ( Jed.PF.interpreter( ast.expr )( n ) ) {
            return Jed.PF.interpreter( ast.truthy )( n );
          }
          return Jed.PF.interpreter( ast.falsey )( n );
        case 'OR':
          return Jed.PF.interpreter( ast.left )( n ) || Jed.PF.interpreter( ast.right )( n );
        case 'AND':
          return Jed.PF.interpreter( ast.left )( n ) && Jed.PF.interpreter( ast.right )( n );
        case 'LT':
          return Jed.PF.interpreter( ast.left )( n ) < Jed.PF.interpreter( ast.right )( n );
        case 'GT':
          return Jed.PF.interpreter( ast.left )( n ) > Jed.PF.interpreter( ast.right )( n );
        case 'LTE':
          return Jed.PF.interpreter( ast.left )( n ) <= Jed.PF.interpreter( ast.right )( n );
        case 'GTE':
          return Jed.PF.interpreter( ast.left )( n ) >= Jed.PF.interpreter( ast.right )( n );
        case 'EQ':
          return Jed.PF.interpreter( ast.left )( n ) == Jed.PF.interpreter( ast.right )( n );
        case 'NEQ':
          return Jed.PF.interpreter( ast.left )( n ) != Jed.PF.interpreter( ast.right )( n );
        case 'MOD':
          return Jed.PF.interpreter( ast.left )( n ) % Jed.PF.interpreter( ast.right )( n );
        case 'VAR':
          return n;
        case 'NUM':
          return ast.val;
        default:
          throw new Error("Invalid Token found.");
      }
    };
  };

  Jed.PF.extractPluralExpr = function ( p ) {
    // trim first
    p = p.replace(/^\s\s*/, '').replace(/\s\s*$/, '');

    if (! /;\s*$/.test(p)) {
      p = p.concat(';');
    }

    var nplurals_re = /nplurals\=(\d+);/,
        plural_re = /plural\=(.*);/,
        nplurals_matches = p.match( nplurals_re ),
        res = {},
        plural_matches;

    // Find the nplurals number
    if ( nplurals_matches.length > 1 ) {
      res.nplurals = nplurals_matches[1];
    }
    else {
      throw new Error('nplurals not found in plural_forms string: ' + p );
    }

    // remove that data to get to the formula
    p = p.replace( nplurals_re, "" );
    plural_matches = p.match( plural_re );

    if (!( plural_matches && plural_matches.length > 1 ) ) {
      throw new Error('`plural` expression not found: ' + p);
    }
    return plural_matches[ 1 ];
  };

  /* Jison generated parser */
  Jed.PF.parser = (function(){

var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"expressions":3,"e":4,"EOF":5,"?":6,":":7,"||":8,"&&":9,"<":10,"<=":11,">":12,">=":13,"!=":14,"==":15,"%":16,"(":17,")":18,"n":19,"NUMBER":20,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",6:"?",7:":",8:"||",9:"&&",10:"<",11:"<=",12:">",13:">=",14:"!=",15:"==",16:"%",17:"(",18:")",19:"n",20:"NUMBER"},
productions_: [0,[3,2],[4,5],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,3],[4,1],[4,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1: return { type : 'GROUP', expr: $$[$0-1] };
break;
case 2:this.$ = { type: 'TERNARY', expr: $$[$0-4], truthy : $$[$0-2], falsey: $$[$0] };
break;
case 3:this.$ = { type: "OR", left: $$[$0-2], right: $$[$0] };
break;
case 4:this.$ = { type: "AND", left: $$[$0-2], right: $$[$0] };
break;
case 5:this.$ = { type: 'LT', left: $$[$0-2], right: $$[$0] };
break;
case 6:this.$ = { type: 'LTE', left: $$[$0-2], right: $$[$0] };
break;
case 7:this.$ = { type: 'GT', left: $$[$0-2], right: $$[$0] };
break;
case 8:this.$ = { type: 'GTE', left: $$[$0-2], right: $$[$0] };
break;
case 9:this.$ = { type: 'NEQ', left: $$[$0-2], right: $$[$0] };
break;
case 10:this.$ = { type: 'EQ', left: $$[$0-2], right: $$[$0] };
break;
case 11:this.$ = { type: 'MOD', left: $$[$0-2], right: $$[$0] };
break;
case 12:this.$ = { type: 'GROUP', expr: $$[$0-1] };
break;
case 13:this.$ = { type: 'VAR' };
break;
case 14:this.$ = { type: 'NUM', val: Number(yytext) };
break;
}
},
table: [{3:1,4:2,17:[1,3],19:[1,4],20:[1,5]},{1:[3]},{5:[1,6],6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{4:17,17:[1,3],19:[1,4],20:[1,5]},{5:[2,13],6:[2,13],7:[2,13],8:[2,13],9:[2,13],10:[2,13],11:[2,13],12:[2,13],13:[2,13],14:[2,13],15:[2,13],16:[2,13],18:[2,13]},{5:[2,14],6:[2,14],7:[2,14],8:[2,14],9:[2,14],10:[2,14],11:[2,14],12:[2,14],13:[2,14],14:[2,14],15:[2,14],16:[2,14],18:[2,14]},{1:[2,1]},{4:18,17:[1,3],19:[1,4],20:[1,5]},{4:19,17:[1,3],19:[1,4],20:[1,5]},{4:20,17:[1,3],19:[1,4],20:[1,5]},{4:21,17:[1,3],19:[1,4],20:[1,5]},{4:22,17:[1,3],19:[1,4],20:[1,5]},{4:23,17:[1,3],19:[1,4],20:[1,5]},{4:24,17:[1,3],19:[1,4],20:[1,5]},{4:25,17:[1,3],19:[1,4],20:[1,5]},{4:26,17:[1,3],19:[1,4],20:[1,5]},{4:27,17:[1,3],19:[1,4],20:[1,5]},{6:[1,7],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[1,28]},{6:[1,7],7:[1,29],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16]},{5:[2,3],6:[2,3],7:[2,3],8:[2,3],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,3]},{5:[2,4],6:[2,4],7:[2,4],8:[2,4],9:[2,4],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,4]},{5:[2,5],6:[2,5],7:[2,5],8:[2,5],9:[2,5],10:[2,5],11:[2,5],12:[2,5],13:[2,5],14:[2,5],15:[2,5],16:[1,16],18:[2,5]},{5:[2,6],6:[2,6],7:[2,6],8:[2,6],9:[2,6],10:[2,6],11:[2,6],12:[2,6],13:[2,6],14:[2,6],15:[2,6],16:[1,16],18:[2,6]},{5:[2,7],6:[2,7],7:[2,7],8:[2,7],9:[2,7],10:[2,7],11:[2,7],12:[2,7],13:[2,7],14:[2,7],15:[2,7],16:[1,16],18:[2,7]},{5:[2,8],6:[2,8],7:[2,8],8:[2,8],9:[2,8],10:[2,8],11:[2,8],12:[2,8],13:[2,8],14:[2,8],15:[2,8],16:[1,16],18:[2,8]},{5:[2,9],6:[2,9],7:[2,9],8:[2,9],9:[2,9],10:[2,9],11:[2,9],12:[2,9],13:[2,9],14:[2,9],15:[2,9],16:[1,16],18:[2,9]},{5:[2,10],6:[2,10],7:[2,10],8:[2,10],9:[2,10],10:[2,10],11:[2,10],12:[2,10],13:[2,10],14:[2,10],15:[2,10],16:[1,16],18:[2,10]},{5:[2,11],6:[2,11],7:[2,11],8:[2,11],9:[2,11],10:[2,11],11:[2,11],12:[2,11],13:[2,11],14:[2,11],15:[2,11],16:[2,11],18:[2,11]},{5:[2,12],6:[2,12],7:[2,12],8:[2,12],9:[2,12],10:[2,12],11:[2,12],12:[2,12],13:[2,12],14:[2,12],15:[2,12],16:[2,12],18:[2,12]},{4:30,17:[1,3],19:[1,4],20:[1,5]},{5:[2,2],6:[1,7],7:[2,2],8:[1,8],9:[1,9],10:[1,10],11:[1,11],12:[1,12],13:[1,13],14:[1,14],15:[1,15],16:[1,16],18:[2,2]}],
defaultActions: {6:[2,1]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this,
        stack = [0],
        vstack = [null], // semantic value stack
        lstack = [], // location stack
        table = this.table,
        yytext = '',
        yylineno = 0,
        yyleng = 0,
        recovering = 0,
        TERROR = 2,
        EOF = 1;

    //this.reductionCount = this.shiftCount = 0;

    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == 'undefined')
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);

    if (typeof this.yy.parseError === 'function')
        this.parseError = this.yy.parseError;

    function popStack (n) {
        stack.length = stack.length - 2*n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }

    function lex() {
        var token;
        token = self.lexer.lex() || 1; // $end = 1
        // if token isn't its numeric value, convert
        if (typeof token !== 'number') {
            token = self.symbols_[token] || token;
        }
        return token;
    }

    var symbol, preErrorSymbol, state, action, a, r, yyval={},p,len,newState, expected;
    while (true) {
        // retreive state number from top of stack
        state = stack[stack.length-1];

        // use default actions if available
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            // read action for current state and first input
            action = table[state] && table[state][symbol];
        }

        // handle parse error
        _handle_error:
        if (typeof action === 'undefined' || !action.length || !action[0]) {

            if (!recovering) {
                // Report error
                expected = [];
                for (p in table[state]) if (this.terminals_[p] && p > 2) {
                    expected.push("'"+this.terminals_[p]+"'");
                }
                var errStr = '';
                if (this.lexer.showPosition) {
                    errStr = 'Parse error on line '+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(', ') + ", got '" + this.terminals_[symbol]+ "'";
                } else {
                    errStr = 'Parse error on line '+(yylineno+1)+": Unexpected " +
                                  (symbol == 1 /*EOF*/ ? "end of input" :
                                              ("'"+(this.terminals_[symbol] || symbol)+"'"));
                }
                this.parseError(errStr,
                    {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }

            // just recovered from another error
            if (recovering == 3) {
                if (symbol == EOF) {
                    throw new Error(errStr || 'Parsing halted.');
                }

                // discard current lookahead and grab another
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                symbol = lex();
            }

            // try to recover from error
            while (1) {
                // check for error recovery rule in this state
                if ((TERROR.toString()) in table[state]) {
                    break;
                }
                if (state == 0) {
                    throw new Error(errStr || 'Parsing halted.');
                }
                popStack(1);
                state = stack[stack.length-1];
            }

            preErrorSymbol = symbol; // save the lookahead token
            symbol = TERROR;         // insert generic error symbol as new lookahead
            state = stack[stack.length-1];
            action = table[state] && table[state][TERROR];
            recovering = 3; // allow 3 real symbols to be shifted before reporting a new error
        }

        // this shouldn't happen, unless resolve defaults are off
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: '+state+', token: '+symbol);
        }

        switch (action[0]) {

            case 1: // shift
                //this.shiftCount++;

                stack.push(symbol);
                vstack.push(this.lexer.yytext);
                lstack.push(this.lexer.yylloc);
                stack.push(action[1]); // push state
                symbol = null;
                if (!preErrorSymbol) { // normal execution/no error
                    yyleng = this.lexer.yyleng;
                    yytext = this.lexer.yytext;
                    yylineno = this.lexer.yylineno;
                    yyloc = this.lexer.yylloc;
                    if (recovering > 0)
                        recovering--;
                } else { // error just occurred, resume old lookahead f/ before error
                    symbol = preErrorSymbol;
                    preErrorSymbol = null;
                }
                break;

            case 2: // reduce
                //this.reductionCount++;

                len = this.productions_[action[1]][1];

                // perform semantic action
                yyval.$ = vstack[vstack.length-len]; // default to $$ = $1
                // default location, uses first token for firsts, last for lasts
                yyval._$ = {
                    first_line: lstack[lstack.length-(len||1)].first_line,
                    last_line: lstack[lstack.length-1].last_line,
                    first_column: lstack[lstack.length-(len||1)].first_column,
                    last_column: lstack[lstack.length-1].last_column
                };
                r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);

                if (typeof r !== 'undefined') {
                    return r;
                }

                // pop off stack
                if (len) {
                    stack = stack.slice(0,-1*len*2);
                    vstack = vstack.slice(0, -1*len);
                    lstack = lstack.slice(0, -1*len);
                }

                stack.push(this.productions_[action[1]][0]);    // push nonterminal (reduce)
                vstack.push(yyval.$);
                lstack.push(yyval._$);
                // goto new state = table[STATE][NONTERMINAL]
                newState = table[stack[stack.length-2]][stack[stack.length-1]];
                stack.push(newState);
                break;

            case 3: // accept
                return true;
        }

    }

    return true;
}};/* Jison generated lexer */
var lexer = (function(){

var lexer = ({EOF:1,
parseError:function parseError(str, hash) {
        if (this.yy.parseError) {
            this.yy.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },
setInput:function (input) {
        this._input = input;
        this._more = this._less = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {first_line:1,first_column:0,last_line:1,last_column:0};
        return this;
    },
input:function () {
        var ch = this._input[0];
        this.yytext+=ch;
        this.yyleng++;
        this.match+=ch;
        this.matched+=ch;
        var lines = ch.match(/\n/);
        if (lines) this.yylineno++;
        this._input = this._input.slice(1);
        return ch;
    },
unput:function (ch) {
        this._input = ch + this._input;
        return this;
    },
more:function () {
        this._more = true;
        return this;
    },
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20)+(next.length > 20 ? '...':'')).replace(/\n/g, "");
    },
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c+"^";
    },
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) this.done = true;

        var token,
            match,
            col,
            lines;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i=0;i < rules.length; i++) {
            match = this._input.match(this.rules[rules[i]]);
            if (match) {
                lines = match[0].match(/\n.*/g);
                if (lines) this.yylineno += lines.length;
                this.yylloc = {first_line: this.yylloc.last_line,
                               last_line: this.yylineno+1,
                               first_column: this.yylloc.last_column,
                               last_column: lines ? lines[lines.length-1].length-1 : this.yylloc.last_column + match[0].length}
                this.yytext += match[0];
                this.match += match[0];
                this.matches = match;
                this.yyleng = this.yytext.length;
                this._more = false;
                this._input = this._input.slice(match[0].length);
                this.matched += match[0];
                token = this.performAction.call(this, this.yy, this, rules[i],this.conditionStack[this.conditionStack.length-1]);
                if (token) return token;
                else return;
            }
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),
                    {text: "", token: null, line: this.yylineno});
        }
    },
lex:function lex() {
        var r = this.next();
        if (typeof r !== 'undefined') {
            return r;
        } else {
            return this.lex();
        }
    },
begin:function begin(condition) {
        this.conditionStack.push(condition);
    },
popState:function popState() {
        return this.conditionStack.pop();
    },
_currentRules:function _currentRules() {
        return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;
    },
topState:function () {
        return this.conditionStack[this.conditionStack.length-2];
    },
pushState:function begin(condition) {
        this.begin(condition);
    }});
lexer.performAction = function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {

var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0:/* skip whitespace */
break;
case 1:return 20
break;
case 2:return 19
break;
case 3:return 8
break;
case 4:return 9
break;
case 5:return 6
break;
case 6:return 7
break;
case 7:return 11
break;
case 8:return 13
break;
case 9:return 10
break;
case 10:return 12
break;
case 11:return 14
break;
case 12:return 15
break;
case 13:return 16
break;
case 14:return 17
break;
case 15:return 18
break;
case 16:return 5
break;
case 17:return 'INVALID'
break;
}
};
lexer.rules = [/^\s+/,/^[0-9]+(\.[0-9]+)?\b/,/^n\b/,/^\|\|/,/^&&/,/^\?/,/^:/,/^<=/,/^>=/,/^</,/^>/,/^!=/,/^==/,/^%/,/^\(/,/^\)/,/^$/,/^./];
lexer.conditions = {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17],"inclusive":true}};return lexer;})()
parser.lexer = lexer;
return parser;
})();
// End parser

  // Handle node, amd, and global systems
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = Jed;
    }
    exports.Jed = Jed;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define(function() {
        return Jed;
      });
    }
    // Leak a global regardless of module system
    root['Jed'] = Jed;
  }

})(this);

},{}],23:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView');

module.exports = DataView;

},{"./_getNative":128,"./_root":169}],24:[function(require,module,exports){
var hashClear = require('./_hashClear'),
    hashDelete = require('./_hashDelete'),
    hashGet = require('./_hashGet'),
    hashHas = require('./_hashHas'),
    hashSet = require('./_hashSet');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

module.exports = Hash;

},{"./_hashClear":134,"./_hashDelete":135,"./_hashGet":136,"./_hashHas":137,"./_hashSet":138}],25:[function(require,module,exports){
var listCacheClear = require('./_listCacheClear'),
    listCacheDelete = require('./_listCacheDelete'),
    listCacheGet = require('./_listCacheGet'),
    listCacheHas = require('./_listCacheHas'),
    listCacheSet = require('./_listCacheSet');

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

module.exports = ListCache;

},{"./_listCacheClear":153,"./_listCacheDelete":154,"./_listCacheGet":155,"./_listCacheHas":156,"./_listCacheSet":157}],26:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map');

module.exports = Map;

},{"./_getNative":128,"./_root":169}],27:[function(require,module,exports){
var mapCacheClear = require('./_mapCacheClear'),
    mapCacheDelete = require('./_mapCacheDelete'),
    mapCacheGet = require('./_mapCacheGet'),
    mapCacheHas = require('./_mapCacheHas'),
    mapCacheSet = require('./_mapCacheSet');

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

module.exports = MapCache;

},{"./_mapCacheClear":158,"./_mapCacheDelete":159,"./_mapCacheGet":160,"./_mapCacheHas":161,"./_mapCacheSet":162}],28:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Promise = getNative(root, 'Promise');

module.exports = Promise;

},{"./_getNative":128,"./_root":169}],29:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Reflect = root.Reflect;

module.exports = Reflect;

},{"./_root":169}],30:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var Set = getNative(root, 'Set');

module.exports = Set;

},{"./_getNative":128,"./_root":169}],31:[function(require,module,exports){
var MapCache = require('./_MapCache'),
    setCacheAdd = require('./_setCacheAdd'),
    setCacheHas = require('./_setCacheHas');

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

module.exports = SetCache;

},{"./_MapCache":27,"./_setCacheAdd":170,"./_setCacheHas":171}],32:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    stackClear = require('./_stackClear'),
    stackDelete = require('./_stackDelete'),
    stackGet = require('./_stackGet'),
    stackHas = require('./_stackHas'),
    stackSet = require('./_stackSet');

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

module.exports = Stack;

},{"./_ListCache":25,"./_stackClear":173,"./_stackDelete":174,"./_stackGet":175,"./_stackHas":176,"./_stackSet":177}],33:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;

},{"./_root":169}],34:[function(require,module,exports){
var root = require('./_root');

/** Built-in value references. */
var Uint8Array = root.Uint8Array;

module.exports = Uint8Array;

},{"./_root":169}],35:[function(require,module,exports){
var getNative = require('./_getNative'),
    root = require('./_root');

/* Built-in method references that are verified to be native. */
var WeakMap = getNative(root, 'WeakMap');

module.exports = WeakMap;

},{"./_getNative":128,"./_root":169}],36:[function(require,module,exports){
/**
 * Adds the key-value `pair` to `map`.
 *
 * @private
 * @param {Object} map The map to modify.
 * @param {Array} pair The key-value pair to add.
 * @returns {Object} Returns `map`.
 */
function addMapEntry(map, pair) {
  // Don't return `map.set` because it's not chainable in IE 11.
  map.set(pair[0], pair[1]);
  return map;
}

module.exports = addMapEntry;

},{}],37:[function(require,module,exports){
/**
 * Adds `value` to `set`.
 *
 * @private
 * @param {Object} set The set to modify.
 * @param {*} value The value to add.
 * @returns {Object} Returns `set`.
 */
function addSetEntry(set, value) {
  // Don't return `set.add` because it's not chainable in IE 11.
  set.add(value);
  return set;
}

module.exports = addSetEntry;

},{}],38:[function(require,module,exports){
/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

module.exports = apply;

},{}],39:[function(require,module,exports){
/**
 * A specialized version of `baseAggregator` for arrays.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function arrayAggregator(array, setter, iteratee, accumulator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    var value = array[index];
    setter(accumulator, value, iteratee(value), array);
  }
  return accumulator;
}

module.exports = arrayAggregator;

},{}],40:[function(require,module,exports){
/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */
function arrayEach(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}

module.exports = arrayEach;

},{}],41:[function(require,module,exports){
/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function arrayFilter(array, predicate) {
  var index = -1,
      length = array ? array.length : 0,
      resIndex = 0,
      result = [];

  while (++index < length) {
    var value = array[index];
    if (predicate(value, index, array)) {
      result[resIndex++] = value;
    }
  }
  return result;
}

module.exports = arrayFilter;

},{}],42:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf');

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to search.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

module.exports = arrayIncludes;

},{"./_baseIndexOf":69}],43:[function(require,module,exports){
/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to search.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

module.exports = arrayIncludesWith;

},{}],44:[function(require,module,exports){
/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;

},{}],45:[function(require,module,exports){
/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

module.exports = arrayPush;

},{}],46:[function(require,module,exports){
/**
 * A specialized version of `_.reduce` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @param {boolean} [initAccum] Specify using the first element of `array` as
 *  the initial value.
 * @returns {*} Returns the accumulated value.
 */
function arrayReduce(array, iteratee, accumulator, initAccum) {
  var index = -1,
      length = array ? array.length : 0;

  if (initAccum && length) {
    accumulator = array[++index];
  }
  while (++index < length) {
    accumulator = iteratee(accumulator, array[index], index, array);
  }
  return accumulator;
}

module.exports = arrayReduce;

},{}],47:[function(require,module,exports){
/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

module.exports = arraySome;

},{}],48:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used by `_.defaults` to customize its `_.assignIn` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to assign.
 * @param {Object} object The parent object of `objValue`.
 * @returns {*} Returns the value to assign.
 */
function assignInDefaults(objValue, srcValue, key, object) {
  if (objValue === undefined ||
      (eq(objValue, objectProto[key]) && !hasOwnProperty.call(object, key))) {
    return srcValue;
  }
  return objValue;
}

module.exports = assignInDefaults;

},{"./eq":187}],49:[function(require,module,exports){
var eq = require('./eq');

/**
 * This function is like `assignValue` except that it doesn't assign
 * `undefined` values.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignMergeValue(object, key, value) {
  if ((value !== undefined && !eq(object[key], value)) ||
      (typeof key == 'number' && value === undefined && !(key in object))) {
    object[key] = value;
  }
}

module.exports = assignMergeValue;

},{"./eq":187}],50:[function(require,module,exports){
var eq = require('./eq');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Assigns `value` to `key` of `object` if the existing value is not equivalent
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons.
 *
 * @private
 * @param {Object} object The object to modify.
 * @param {string} key The key of the property to assign.
 * @param {*} value The value to assign.
 */
function assignValue(object, key, value) {
  var objValue = object[key];
  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
      (value === undefined && !(key in object))) {
    object[key] = value;
  }
}

module.exports = assignValue;

},{"./eq":187}],51:[function(require,module,exports){
var eq = require('./eq');

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

module.exports = assocIndexOf;

},{"./eq":187}],52:[function(require,module,exports){
var baseEach = require('./_baseEach');

/**
 * Aggregates elements of `collection` on `accumulator` with keys transformed
 * by `iteratee` and values set by `setter`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} setter The function to set `accumulator` values.
 * @param {Function} iteratee The iteratee to transform keys.
 * @param {Object} accumulator The initial aggregated object.
 * @returns {Function} Returns `accumulator`.
 */
function baseAggregator(collection, setter, iteratee, accumulator) {
  baseEach(collection, function(value, key, collection) {
    setter(accumulator, value, iteratee(value), collection);
  });
  return accumulator;
}

module.exports = baseAggregator;

},{"./_baseEach":57}],53:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keys = require('./keys');

/**
 * The base implementation of `_.assign` without support for multiple sources
 * or `customizer` functions.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @returns {Object} Returns `object`.
 */
function baseAssign(object, source) {
  return object && copyObject(source, keys(source), object);
}

module.exports = baseAssign;

},{"./_copyObject":110,"./keys":219}],54:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignValue = require('./_assignValue'),
    baseAssign = require('./_baseAssign'),
    cloneBuffer = require('./_cloneBuffer'),
    copyArray = require('./_copyArray'),
    copySymbols = require('./_copySymbols'),
    getAllKeys = require('./_getAllKeys'),
    getTag = require('./_getTag'),
    initCloneArray = require('./_initCloneArray'),
    initCloneByTag = require('./_initCloneByTag'),
    initCloneObject = require('./_initCloneObject'),
    isArray = require('./isArray'),
    isBuffer = require('./isBuffer'),
    isHostObject = require('./_isHostObject'),
    isObject = require('./isObject'),
    keys = require('./keys');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values supported by `_.clone`. */
var cloneableTags = {};
cloneableTags[argsTag] = cloneableTags[arrayTag] =
cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
cloneableTags[boolTag] = cloneableTags[dateTag] =
cloneableTags[float32Tag] = cloneableTags[float64Tag] =
cloneableTags[int8Tag] = cloneableTags[int16Tag] =
cloneableTags[int32Tag] = cloneableTags[mapTag] =
cloneableTags[numberTag] = cloneableTags[objectTag] =
cloneableTags[regexpTag] = cloneableTags[setTag] =
cloneableTags[stringTag] = cloneableTags[symbolTag] =
cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
cloneableTags[errorTag] = cloneableTags[funcTag] =
cloneableTags[weakMapTag] = false;

/**
 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
 * traversed objects.
 *
 * @private
 * @param {*} value The value to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @param {boolean} [isFull] Specify a clone including symbols.
 * @param {Function} [customizer] The function to customize cloning.
 * @param {string} [key] The key of `value`.
 * @param {Object} [object] The parent object of `value`.
 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
 * @returns {*} Returns the cloned value.
 */
function baseClone(value, isDeep, isFull, customizer, key, object, stack) {
  var result;
  if (customizer) {
    result = object ? customizer(value, key, object, stack) : customizer(value);
  }
  if (result !== undefined) {
    return result;
  }
  if (!isObject(value)) {
    return value;
  }
  var isArr = isArray(value);
  if (isArr) {
    result = initCloneArray(value);
    if (!isDeep) {
      return copyArray(value, result);
    }
  } else {
    var tag = getTag(value),
        isFunc = tag == funcTag || tag == genTag;

    if (isBuffer(value)) {
      return cloneBuffer(value, isDeep);
    }
    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
      if (isHostObject(value)) {
        return object ? value : {};
      }
      result = initCloneObject(isFunc ? {} : value);
      if (!isDeep) {
        return copySymbols(value, baseAssign(result, value));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value : {};
      }
      result = initCloneByTag(value, tag, baseClone, isDeep);
    }
  }
  // Check for circular references and return its corresponding clone.
  stack || (stack = new Stack);
  var stacked = stack.get(value);
  if (stacked) {
    return stacked;
  }
  stack.set(value, result);

  if (!isArr) {
    var props = isFull ? getAllKeys(value) : keys(value);
  }
  arrayEach(props || value, function(subValue, key) {
    if (props) {
      key = subValue;
      subValue = value[key];
    }
    // Recursively populate clone (susceptible to call stack limits).
    assignValue(result, key, baseClone(subValue, isDeep, isFull, customizer, key, value, stack));
  });
  return result;
}

module.exports = baseClone;

},{"./_Stack":32,"./_arrayEach":40,"./_assignValue":50,"./_baseAssign":53,"./_cloneBuffer":100,"./_copyArray":109,"./_copySymbols":111,"./_getAllKeys":124,"./_getTag":131,"./_initCloneArray":140,"./_initCloneByTag":141,"./_initCloneObject":142,"./_isHostObject":144,"./isArray":202,"./isBuffer":205,"./isObject":212,"./keys":219}],55:[function(require,module,exports){
var isObject = require('./isObject');

/** Built-in value references. */
var objectCreate = Object.create;

/**
 * The base implementation of `_.create` without support for assigning
 * properties to the created object.
 *
 * @private
 * @param {Object} prototype The object to inherit from.
 * @returns {Object} Returns the new object.
 */
function baseCreate(proto) {
  return isObject(proto) ? objectCreate(proto) : {};
}

module.exports = baseCreate;

},{"./isObject":212}],56:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    arrayMap = require('./_arrayMap'),
    baseUnary = require('./_baseUnary'),
    cacheHas = require('./_cacheHas');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of methods like `_.difference` without support
 * for excluding multiple arrays or iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Array} values The values to exclude.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of filtered values.
 */
function baseDifference(array, values, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      isCommon = true,
      length = array.length,
      result = [],
      valuesLength = values.length;

  if (!length) {
    return result;
  }
  if (iteratee) {
    values = arrayMap(values, baseUnary(iteratee));
  }
  if (comparator) {
    includes = arrayIncludesWith;
    isCommon = false;
  }
  else if (values.length >= LARGE_ARRAY_SIZE) {
    includes = cacheHas;
    isCommon = false;
    values = new SetCache(values);
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var valuesIndex = valuesLength;
      while (valuesIndex--) {
        if (values[valuesIndex] === computed) {
          continue outer;
        }
      }
      result.push(value);
    }
    else if (!includes(values, computed, comparator)) {
      result.push(value);
    }
  }
  return result;
}

module.exports = baseDifference;

},{"./_SetCache":31,"./_arrayIncludes":42,"./_arrayIncludesWith":43,"./_arrayMap":44,"./_baseUnary":94,"./_cacheHas":97}],57:[function(require,module,exports){
var baseForOwn = require('./_baseForOwn'),
    createBaseEach = require('./_createBaseEach');

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;

},{"./_baseForOwn":62,"./_createBaseEach":115}],58:[function(require,module,exports){
var baseEach = require('./_baseEach');

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;

},{"./_baseEach":57}],59:[function(require,module,exports){
/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;

},{}],60:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isFlattenable = require('./_isFlattenable');

/**
 * The base implementation of `_.flatten` with support for restricting flattening.
 *
 * @private
 * @param {Array} array The array to flatten.
 * @param {number} depth The maximum recursion depth.
 * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
 * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
 * @param {Array} [result=[]] The initial result value.
 * @returns {Array} Returns the new flattened array.
 */
function baseFlatten(array, depth, predicate, isStrict, result) {
  var index = -1,
      length = array.length;

  predicate || (predicate = isFlattenable);
  result || (result = []);

  while (++index < length) {
    var value = array[index];
    if (depth > 0 && predicate(value)) {
      if (depth > 1) {
        // Recursively flatten arrays (susceptible to call stack limits).
        baseFlatten(value, depth - 1, predicate, isStrict, result);
      } else {
        arrayPush(result, value);
      }
    } else if (!isStrict) {
      result[result.length] = value;
    }
  }
  return result;
}

module.exports = baseFlatten;

},{"./_arrayPush":45,"./_isFlattenable":143}],61:[function(require,module,exports){
var createBaseFor = require('./_createBaseFor');

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;

},{"./_createBaseFor":116}],62:[function(require,module,exports){
var baseFor = require('./_baseFor'),
    keys = require('./keys');

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;

},{"./_baseFor":61,"./keys":219}],63:[function(require,module,exports){
var castPath = require('./_castPath'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;

},{"./_castPath":98,"./_isKey":147,"./_toKey":179}],64:[function(require,module,exports){
var arrayPush = require('./_arrayPush'),
    isArray = require('./isArray');

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

module.exports = baseGetAllKeys;

},{"./_arrayPush":45,"./isArray":202}],65:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

module.exports = baseGetTag;

},{}],66:[function(require,module,exports){
var getPrototype = require('./_getPrototype');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * The base implementation of `_.has` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHas(object, key) {
  // Avoid a bug in IE 10-11 where objects with a [[Prototype]] of `null`,
  // that are composed entirely of index properties, return `false` for
  // `hasOwnProperty` checks of them.
  return object != null &&
    (hasOwnProperty.call(object, key) ||
      (typeof object == 'object' && key in object && getPrototype(object) === null));
}

module.exports = baseHas;

},{"./_getPrototype":129}],67:[function(require,module,exports){
/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

module.exports = baseHasIn;

},{}],68:[function(require,module,exports){
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * The base implementation of `_.inRange` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function baseInRange(number, start, end) {
  return number >= nativeMin(start, end) && number < nativeMax(start, end);
}

module.exports = baseInRange;

},{}],69:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIsNaN = require('./_baseIsNaN');

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to search.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = baseIndexOf;

},{"./_baseFindIndex":59,"./_baseIsNaN":73}],70:[function(require,module,exports){
var baseIsEqualDeep = require('./_baseIsEqualDeep'),
    isObject = require('./isObject'),
    isObjectLike = require('./isObjectLike');

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

module.exports = baseIsEqual;

},{"./_baseIsEqualDeep":71,"./isObject":212,"./isObjectLike":213}],71:[function(require,module,exports){
var Stack = require('./_Stack'),
    equalArrays = require('./_equalArrays'),
    equalByTag = require('./_equalByTag'),
    equalObjects = require('./_equalObjects'),
    getTag = require('./_getTag'),
    isArray = require('./isArray'),
    isHostObject = require('./_isHostObject'),
    isTypedArray = require('./isTypedArray');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

module.exports = baseIsEqualDeep;

},{"./_Stack":32,"./_equalArrays":119,"./_equalByTag":120,"./_equalObjects":121,"./_getTag":131,"./_isHostObject":144,"./isArray":202,"./isTypedArray":217}],72:[function(require,module,exports){
var Stack = require('./_Stack'),
    baseIsEqual = require('./_baseIsEqual');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

module.exports = baseIsMatch;

},{"./_Stack":32,"./_baseIsEqual":70}],73:[function(require,module,exports){
/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;

},{}],74:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isHostObject = require('./_isHostObject'),
    isMasked = require('./_isMasked'),
    isObject = require('./isObject'),
    toSource = require('./_toSource');

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

module.exports = baseIsNative;

},{"./_isHostObject":144,"./_isMasked":149,"./_toSource":180,"./isFunction":208,"./isObject":212}],75:[function(require,module,exports){
var isLength = require('./isLength'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

module.exports = baseIsTypedArray;

},{"./isLength":209,"./isObjectLike":213}],76:[function(require,module,exports){
var baseMatches = require('./_baseMatches'),
    baseMatchesProperty = require('./_baseMatchesProperty'),
    identity = require('./identity'),
    isArray = require('./isArray'),
    property = require('./property');

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

module.exports = baseIteratee;

},{"./_baseMatches":80,"./_baseMatchesProperty":81,"./identity":198,"./isArray":202,"./property":229}],77:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeKeys = Object.keys;

/**
 * The base implementation of `_.keys` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
var baseKeys = overArg(nativeKeys, Object);

module.exports = baseKeys;

},{"./_overArg":168}],78:[function(require,module,exports){
var Reflect = require('./_Reflect'),
    iteratorToArray = require('./_iteratorToArray');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Built-in value references. */
var enumerate = Reflect ? Reflect.enumerate : undefined,
    propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * The base implementation of `_.keysIn` which doesn't skip the constructor
 * property of prototypes or treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  object = object == null ? object : Object(object);

  var result = [];
  for (var key in object) {
    result.push(key);
  }
  return result;
}

// Fallback for IE < 9 with es6-shim.
if (enumerate && !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf')) {
  baseKeysIn = function(object) {
    return iteratorToArray(enumerate(object));
  };
}

module.exports = baseKeysIn;

},{"./_Reflect":29,"./_iteratorToArray":152}],79:[function(require,module,exports){
var baseEach = require('./_baseEach'),
    isArrayLike = require('./isArrayLike');

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;

},{"./_baseEach":57,"./isArrayLike":203}],80:[function(require,module,exports){
var baseIsMatch = require('./_baseIsMatch'),
    getMatchData = require('./_getMatchData'),
    matchesStrictComparable = require('./_matchesStrictComparable');

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

module.exports = baseMatches;

},{"./_baseIsMatch":72,"./_getMatchData":127,"./_matchesStrictComparable":164}],81:[function(require,module,exports){
var baseIsEqual = require('./_baseIsEqual'),
    get = require('./get'),
    hasIn = require('./hasIn'),
    isKey = require('./_isKey'),
    isStrictComparable = require('./_isStrictComparable'),
    matchesStrictComparable = require('./_matchesStrictComparable'),
    toKey = require('./_toKey');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

module.exports = baseMatchesProperty;

},{"./_baseIsEqual":70,"./_isKey":147,"./_isStrictComparable":151,"./_matchesStrictComparable":164,"./_toKey":179,"./get":195,"./hasIn":197}],82:[function(require,module,exports){
var Stack = require('./_Stack'),
    arrayEach = require('./_arrayEach'),
    assignMergeValue = require('./_assignMergeValue'),
    baseMergeDeep = require('./_baseMergeDeep'),
    isArray = require('./isArray'),
    isObject = require('./isObject'),
    isTypedArray = require('./isTypedArray'),
    keysIn = require('./keysIn');

/**
 * The base implementation of `_.merge` without support for multiple sources.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} [customizer] The function to customize merged values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  if (!(isArray(source) || isTypedArray(source))) {
    var props = keysIn(source);
  }
  arrayEach(props || source, function(srcValue, key) {
    if (props) {
      key = srcValue;
      srcValue = source[key];
    }
    if (isObject(srcValue)) {
      stack || (stack = new Stack);
      baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
    }
    else {
      var newValue = customizer
        ? customizer(object[key], srcValue, (key + ''), object, source, stack)
        : undefined;

      if (newValue === undefined) {
        newValue = srcValue;
      }
      assignMergeValue(object, key, newValue);
    }
  });
}

module.exports = baseMerge;

},{"./_Stack":32,"./_arrayEach":40,"./_assignMergeValue":49,"./_baseMergeDeep":83,"./isArray":202,"./isObject":212,"./isTypedArray":217,"./keysIn":220}],83:[function(require,module,exports){
var assignMergeValue = require('./_assignMergeValue'),
    baseClone = require('./_baseClone'),
    copyArray = require('./_copyArray'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLikeObject = require('./isArrayLikeObject'),
    isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isPlainObject = require('./isPlainObject'),
    isTypedArray = require('./isTypedArray'),
    toPlainObject = require('./toPlainObject');

/**
 * A specialized version of `baseMerge` for arrays and objects which performs
 * deep merges and tracks traversed objects enabling objects with circular
 * references to be merged.
 *
 * @private
 * @param {Object} object The destination object.
 * @param {Object} source The source object.
 * @param {string} key The key of the value to merge.
 * @param {number} srcIndex The index of `source`.
 * @param {Function} mergeFunc The function to merge values.
 * @param {Function} [customizer] The function to customize assigned values.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 */
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = object[key],
      srcValue = source[key],
      stacked = stack.get(srcValue);

  if (stacked) {
    assignMergeValue(object, key, stacked);
    return;
  }
  var newValue = customizer
    ? customizer(objValue, srcValue, (key + ''), object, source, stack)
    : undefined;

  var isCommon = newValue === undefined;

  if (isCommon) {
    newValue = srcValue;
    if (isArray(srcValue) || isTypedArray(srcValue)) {
      if (isArray(objValue)) {
        newValue = objValue;
      }
      else if (isArrayLikeObject(objValue)) {
        newValue = copyArray(objValue);
      }
      else {
        isCommon = false;
        newValue = baseClone(srcValue, true);
      }
    }
    else if (isPlainObject(srcValue) || isArguments(srcValue)) {
      if (isArguments(objValue)) {
        newValue = toPlainObject(objValue);
      }
      else if (!isObject(objValue) || (srcIndex && isFunction(objValue))) {
        isCommon = false;
        newValue = baseClone(srcValue, true);
      }
      else {
        newValue = objValue;
      }
    }
    else {
      isCommon = false;
    }
  }
  if (isCommon) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack['delete'](srcValue);
  }
  assignMergeValue(object, key, newValue);
}

module.exports = baseMergeDeep;

},{"./_assignMergeValue":49,"./_baseClone":54,"./_copyArray":109,"./isArguments":201,"./isArray":202,"./isArrayLikeObject":204,"./isFunction":208,"./isObject":212,"./isPlainObject":214,"./isTypedArray":217,"./toPlainObject":239}],84:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    baseSortBy = require('./_baseSortBy'),
    baseUnary = require('./_baseUnary'),
    compareMultiple = require('./_compareMultiple'),
    identity = require('./identity');

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  var result = baseMap(collection, function(value, key, collection) {
    var criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

module.exports = baseOrderBy;

},{"./_arrayMap":44,"./_baseIteratee":76,"./_baseMap":79,"./_baseSortBy":90,"./_baseUnary":94,"./_compareMultiple":108,"./identity":198}],85:[function(require,module,exports){
/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

module.exports = baseProperty;

},{}],86:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

module.exports = basePropertyDeep;

},{"./_baseGet":63}],87:[function(require,module,exports){
/**
 * The base implementation of `_.propertyOf` without support for deep paths.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyOf(object) {
  return function(key) {
    return object == null ? undefined : object[key];
  };
}

module.exports = basePropertyOf;

},{}],88:[function(require,module,exports){
/**
 * The base implementation of `_.reduce` and `_.reduceRight`, without support
 * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {*} accumulator The initial value.
 * @param {boolean} initAccum Specify using the first or last element of
 *  `collection` as the initial value.
 * @param {Function} eachFunc The function to iterate over `collection`.
 * @returns {*} Returns the accumulated value.
 */
function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
  eachFunc(collection, function(value, index, collection) {
    accumulator = initAccum
      ? (initAccum = false, value)
      : iteratee(accumulator, value, index, collection);
  });
  return accumulator;
}

module.exports = baseReduce;

},{}],89:[function(require,module,exports){
var apply = require('./_apply');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

module.exports = baseRest;

},{"./_apply":38}],90:[function(require,module,exports){
/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

module.exports = baseSortBy;

},{}],91:[function(require,module,exports){
/**
 * The base implementation of `_.sum` and `_.sumBy` without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {number} Returns the sum.
 */
function baseSum(array, iteratee) {
  var result,
      index = -1,
      length = array.length;

  while (++index < length) {
    var current = iteratee(array[index]);
    if (current !== undefined) {
      result = result === undefined ? current : (result + current);
    }
  }
  return result;
}

module.exports = baseSum;

},{}],92:[function(require,module,exports){
/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

module.exports = baseTimes;

},{}],93:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;

},{"./_Symbol":33,"./isSymbol":216}],94:[function(require,module,exports){
/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

module.exports = baseUnary;

},{}],95:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arrayIncludes = require('./_arrayIncludes'),
    arrayIncludesWith = require('./_arrayIncludesWith'),
    cacheHas = require('./_cacheHas'),
    createSet = require('./_createSet'),
    setToArray = require('./_setToArray');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * The base implementation of `_.uniqBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 */
function baseUniq(array, iteratee, comparator) {
  var index = -1,
      includes = arrayIncludes,
      length = array.length,
      isCommon = true,
      result = [],
      seen = result;

  if (comparator) {
    isCommon = false;
    includes = arrayIncludesWith;
  }
  else if (length >= LARGE_ARRAY_SIZE) {
    var set = iteratee ? null : createSet(array);
    if (set) {
      return setToArray(set);
    }
    isCommon = false;
    includes = cacheHas;
    seen = new SetCache;
  }
  else {
    seen = iteratee ? [] : result;
  }
  outer:
  while (++index < length) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (isCommon && computed === computed) {
      var seenIndex = seen.length;
      while (seenIndex--) {
        if (seen[seenIndex] === computed) {
          continue outer;
        }
      }
      if (iteratee) {
        seen.push(computed);
      }
      result.push(value);
    }
    else if (!includes(seen, computed, comparator)) {
      if (seen !== result) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

module.exports = baseUniq;

},{"./_SetCache":31,"./_arrayIncludes":42,"./_arrayIncludesWith":43,"./_cacheHas":97,"./_createSet":118,"./_setToArray":172}],96:[function(require,module,exports){
var arrayMap = require('./_arrayMap');

/**
 * The base implementation of `_.values` and `_.valuesIn` which creates an
 * array of `object` property values corresponding to the property names
 * of `props`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array} props The property names to get values for.
 * @returns {Object} Returns the array of property values.
 */
function baseValues(object, props) {
  return arrayMap(props, function(key) {
    return object[key];
  });
}

module.exports = baseValues;

},{"./_arrayMap":44}],97:[function(require,module,exports){
/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

module.exports = cacheHas;

},{}],98:[function(require,module,exports){
var isArray = require('./isArray'),
    stringToPath = require('./_stringToPath');

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

module.exports = castPath;

},{"./_stringToPath":178,"./isArray":202}],99:[function(require,module,exports){
var Uint8Array = require('./_Uint8Array');

/**
 * Creates a clone of `arrayBuffer`.
 *
 * @private
 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
 * @returns {ArrayBuffer} Returns the cloned array buffer.
 */
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
  return result;
}

module.exports = cloneArrayBuffer;

},{"./_Uint8Array":34}],100:[function(require,module,exports){
/**
 * Creates a clone of  `buffer`.
 *
 * @private
 * @param {Buffer} buffer The buffer to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Buffer} Returns the cloned buffer.
 */
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var result = new buffer.constructor(buffer.length);
  buffer.copy(result);
  return result;
}

module.exports = cloneBuffer;

},{}],101:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `dataView`.
 *
 * @private
 * @param {Object} dataView The data view to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned data view.
 */
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}

module.exports = cloneDataView;

},{"./_cloneArrayBuffer":99}],102:[function(require,module,exports){
var addMapEntry = require('./_addMapEntry'),
    arrayReduce = require('./_arrayReduce'),
    mapToArray = require('./_mapToArray');

/**
 * Creates a clone of `map`.
 *
 * @private
 * @param {Object} map The map to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned map.
 */
function cloneMap(map, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(mapToArray(map), true) : mapToArray(map);
  return arrayReduce(array, addMapEntry, new map.constructor);
}

module.exports = cloneMap;

},{"./_addMapEntry":36,"./_arrayReduce":46,"./_mapToArray":163}],103:[function(require,module,exports){
/** Used to match `RegExp` flags from their coerced string values. */
var reFlags = /\w*$/;

/**
 * Creates a clone of `regexp`.
 *
 * @private
 * @param {Object} regexp The regexp to clone.
 * @returns {Object} Returns the cloned regexp.
 */
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}

module.exports = cloneRegExp;

},{}],104:[function(require,module,exports){
var addSetEntry = require('./_addSetEntry'),
    arrayReduce = require('./_arrayReduce'),
    setToArray = require('./_setToArray');

/**
 * Creates a clone of `set`.
 *
 * @private
 * @param {Object} set The set to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned set.
 */
function cloneSet(set, isDeep, cloneFunc) {
  var array = isDeep ? cloneFunc(setToArray(set), true) : setToArray(set);
  return arrayReduce(array, addSetEntry, new set.constructor);
}

module.exports = cloneSet;

},{"./_addSetEntry":37,"./_arrayReduce":46,"./_setToArray":172}],105:[function(require,module,exports){
var Symbol = require('./_Symbol');

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * Creates a clone of the `symbol` object.
 *
 * @private
 * @param {Object} symbol The symbol object to clone.
 * @returns {Object} Returns the cloned symbol object.
 */
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}

module.exports = cloneSymbol;

},{"./_Symbol":33}],106:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer');

/**
 * Creates a clone of `typedArray`.
 *
 * @private
 * @param {Object} typedArray The typed array to clone.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the cloned typed array.
 */
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}

module.exports = cloneTypedArray;

},{"./_cloneArrayBuffer":99}],107:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

module.exports = compareAscending;

},{"./isSymbol":216}],108:[function(require,module,exports){
var compareAscending = require('./_compareAscending');

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

module.exports = compareMultiple;

},{"./_compareAscending":107}],109:[function(require,module,exports){
/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */
function copyArray(source, array) {
  var index = -1,
      length = source.length;

  array || (array = Array(length));
  while (++index < length) {
    array[index] = source[index];
  }
  return array;
}

module.exports = copyArray;

},{}],110:[function(require,module,exports){
var assignValue = require('./_assignValue');

/**
 * Copies properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy properties from.
 * @param {Array} props The property identifiers to copy.
 * @param {Object} [object={}] The object to copy properties to.
 * @param {Function} [customizer] The function to customize copied values.
 * @returns {Object} Returns `object`.
 */
function copyObject(source, props, object, customizer) {
  object || (object = {});

  var index = -1,
      length = props.length;

  while (++index < length) {
    var key = props[index];

    var newValue = customizer
      ? customizer(object[key], source[key], key, object, source)
      : undefined;

    assignValue(object, key, newValue === undefined ? source[key] : newValue);
  }
  return object;
}

module.exports = copyObject;

},{"./_assignValue":50}],111:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    getSymbols = require('./_getSymbols');

/**
 * Copies own symbol properties of `source` to `object`.
 *
 * @private
 * @param {Object} source The object to copy symbols from.
 * @param {Object} [object={}] The object to copy symbols to.
 * @returns {Object} Returns `object`.
 */
function copySymbols(source, object) {
  return copyObject(source, getSymbols(source), object);
}

module.exports = copySymbols;

},{"./_copyObject":110,"./_getSymbols":130}],112:[function(require,module,exports){
var root = require('./_root');

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

module.exports = coreJsData;

},{"./_root":169}],113:[function(require,module,exports){
var arrayAggregator = require('./_arrayAggregator'),
    baseAggregator = require('./_baseAggregator'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Creates a function like `_.groupBy`.
 *
 * @private
 * @param {Function} setter The function to set accumulator values.
 * @param {Function} [initializer] The accumulator object initializer.
 * @returns {Function} Returns the new aggregator function.
 */
function createAggregator(setter, initializer) {
  return function(collection, iteratee) {
    var func = isArray(collection) ? arrayAggregator : baseAggregator,
        accumulator = initializer ? initializer() : {};

    return func(collection, setter, baseIteratee(iteratee, 2), accumulator);
  };
}

module.exports = createAggregator;

},{"./_arrayAggregator":39,"./_baseAggregator":52,"./_baseIteratee":76,"./isArray":202}],114:[function(require,module,exports){
var baseRest = require('./_baseRest'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Creates a function like `_.assign`.
 *
 * @private
 * @param {Function} assigner The function to assign values.
 * @returns {Function} Returns the new assigner function.
 */
function createAssigner(assigner) {
  return baseRest(function(object, sources) {
    var index = -1,
        length = sources.length,
        customizer = length > 1 ? sources[length - 1] : undefined,
        guard = length > 2 ? sources[2] : undefined;

    customizer = (assigner.length > 3 && typeof customizer == 'function')
      ? (length--, customizer)
      : undefined;

    if (guard && isIterateeCall(sources[0], sources[1], guard)) {
      customizer = length < 3 ? undefined : customizer;
      length = 1;
    }
    object = Object(object);
    while (++index < length) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}

module.exports = createAssigner;

},{"./_baseRest":89,"./_isIterateeCall":146}],115:[function(require,module,exports){
var isArrayLike = require('./isArrayLike');

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;

},{"./isArrayLike":203}],116:[function(require,module,exports){
/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;

},{}],117:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    isArrayLike = require('./isArrayLike'),
    keys = require('./keys');

/**
 * Creates a `_.find` or `_.findLast` function.
 *
 * @private
 * @param {Function} findIndexFunc The function to find the collection index.
 * @returns {Function} Returns the new find function.
 */
function createFind(findIndexFunc) {
  return function(collection, predicate, fromIndex) {
    var iterable = Object(collection);
    if (!isArrayLike(collection)) {
      var iteratee = baseIteratee(predicate, 3);
      collection = keys(collection);
      predicate = function(key) { return iteratee(iterable[key], key, iterable); };
    }
    var index = findIndexFunc(collection, predicate, fromIndex);
    return index > -1 ? iterable[iteratee ? collection[index] : index] : undefined;
  };
}

module.exports = createFind;

},{"./_baseIteratee":76,"./isArrayLike":203,"./keys":219}],118:[function(require,module,exports){
var Set = require('./_Set'),
    noop = require('./noop'),
    setToArray = require('./_setToArray');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Creates a set object of `values`.
 *
 * @private
 * @param {Array} values The values to add to the set.
 * @returns {Object} Returns the new set.
 */
var createSet = !(Set && (1 / setToArray(new Set([,-0]))[1]) == INFINITY) ? noop : function(values) {
  return new Set(values);
};

module.exports = createSet;

},{"./_Set":30,"./_setToArray":172,"./noop":226}],119:[function(require,module,exports){
var SetCache = require('./_SetCache'),
    arraySome = require('./_arraySome');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

module.exports = equalArrays;

},{"./_SetCache":31,"./_arraySome":47}],120:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    Uint8Array = require('./_Uint8Array'),
    eq = require('./eq'),
    equalArrays = require('./_equalArrays'),
    mapToArray = require('./_mapToArray'),
    setToArray = require('./_setToArray');

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]';

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/6.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

module.exports = equalByTag;

},{"./_Symbol":33,"./_Uint8Array":34,"./_equalArrays":119,"./_mapToArray":163,"./_setToArray":172,"./eq":187}],121:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    keys = require('./keys');

/** Used to compose bitmasks for comparison styles. */
var PARTIAL_COMPARE_FLAG = 2;

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : baseHas(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

module.exports = equalObjects;

},{"./_baseHas":66,"./keys":219}],122:[function(require,module,exports){
var basePropertyOf = require('./_basePropertyOf');

/** Used to map characters to HTML entities. */
var htmlEscapes = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '`': '&#96;'
};

/**
 * Used by `_.escape` to convert characters to HTML entities.
 *
 * @private
 * @param {string} chr The matched character to escape.
 * @returns {string} Returns the escaped character.
 */
var escapeHtmlChar = basePropertyOf(htmlEscapes);

module.exports = escapeHtmlChar;

},{"./_basePropertyOf":87}],123:[function(require,module,exports){
(function (global){
/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],124:[function(require,module,exports){
var baseGetAllKeys = require('./_baseGetAllKeys'),
    getSymbols = require('./_getSymbols'),
    keys = require('./keys');

/**
 * Creates an array of own enumerable property names and symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeys(object) {
  return baseGetAllKeys(object, keys, getSymbols);
}

module.exports = getAllKeys;

},{"./_baseGetAllKeys":64,"./_getSymbols":130,"./keys":219}],125:[function(require,module,exports){
var baseProperty = require('./_baseProperty');

/**
 * Gets the "length" property value of `object`.
 *
 * **Note:** This function is used to avoid a
 * [JIT bug](https://bugs.webkit.org/show_bug.cgi?id=142792) that affects
 * Safari on at least iOS 8.1-8.3 ARM64.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {*} Returns the "length" value.
 */
var getLength = baseProperty('length');

module.exports = getLength;

},{"./_baseProperty":85}],126:[function(require,module,exports){
var isKeyable = require('./_isKeyable');

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

module.exports = getMapData;

},{"./_isKeyable":148}],127:[function(require,module,exports){
var isStrictComparable = require('./_isStrictComparable'),
    keys = require('./keys');

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

module.exports = getMatchData;

},{"./_isStrictComparable":151,"./keys":219}],128:[function(require,module,exports){
var baseIsNative = require('./_baseIsNative'),
    getValue = require('./_getValue');

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

module.exports = getNative;

},{"./_baseIsNative":74,"./_getValue":132}],129:[function(require,module,exports){
var overArg = require('./_overArg');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetPrototype = Object.getPrototypeOf;

/**
 * Gets the `[[Prototype]]` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {null|Object} Returns the `[[Prototype]]`.
 */
var getPrototype = overArg(nativeGetPrototype, Object);

module.exports = getPrototype;

},{"./_overArg":168}],130:[function(require,module,exports){
var overArg = require('./_overArg'),
    stubArray = require('./stubArray');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols;

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

module.exports = getSymbols;

},{"./_overArg":168,"./stubArray":232}],131:[function(require,module,exports){
var DataView = require('./_DataView'),
    Map = require('./_Map'),
    Promise = require('./_Promise'),
    Set = require('./_Set'),
    WeakMap = require('./_WeakMap'),
    baseGetTag = require('./_baseGetTag'),
    toSource = require('./_toSource');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    setTag = '[object Set]',
    weakMapTag = '[object WeakMap]';

var dataViewTag = '[object DataView]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

module.exports = getTag;

},{"./_DataView":23,"./_Map":26,"./_Promise":28,"./_Set":30,"./_WeakMap":35,"./_baseGetTag":65,"./_toSource":180}],132:[function(require,module,exports){
/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

module.exports = getValue;

},{}],133:[function(require,module,exports){
var castPath = require('./_castPath'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isIndex = require('./_isIndex'),
    isKey = require('./_isKey'),
    isLength = require('./isLength'),
    isString = require('./isString'),
    toKey = require('./_toKey');

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isString(object) || isArguments(object));
}

module.exports = hasPath;

},{"./_castPath":98,"./_isIndex":145,"./_isKey":147,"./_toKey":179,"./isArguments":201,"./isArray":202,"./isLength":209,"./isString":215}],134:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

module.exports = hashClear;

},{"./_nativeCreate":166}],135:[function(require,module,exports){
/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

module.exports = hashDelete;

},{}],136:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

module.exports = hashGet;

},{"./_nativeCreate":166}],137:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

module.exports = hashHas;

},{"./_nativeCreate":166}],138:[function(require,module,exports){
var nativeCreate = require('./_nativeCreate');

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

module.exports = hashSet;

},{"./_nativeCreate":166}],139:[function(require,module,exports){
var baseTimes = require('./_baseTimes'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isLength = require('./isLength'),
    isString = require('./isString');

/**
 * Creates an array of index keys for `object` values of arrays,
 * `arguments` objects, and strings, otherwise `null` is returned.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array|null} Returns index keys, else `null`.
 */
function indexKeys(object) {
  var length = object ? object.length : undefined;
  if (isLength(length) &&
      (isArray(object) || isString(object) || isArguments(object))) {
    return baseTimes(length, String);
  }
  return null;
}

module.exports = indexKeys;

},{"./_baseTimes":92,"./isArguments":201,"./isArray":202,"./isLength":209,"./isString":215}],140:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Initializes an array clone.
 *
 * @private
 * @param {Array} array The array to clone.
 * @returns {Array} Returns the initialized clone.
 */
function initCloneArray(array) {
  var length = array.length,
      result = array.constructor(length);

  // Add properties assigned by `RegExp#exec`.
  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}

module.exports = initCloneArray;

},{}],141:[function(require,module,exports){
var cloneArrayBuffer = require('./_cloneArrayBuffer'),
    cloneDataView = require('./_cloneDataView'),
    cloneMap = require('./_cloneMap'),
    cloneRegExp = require('./_cloneRegExp'),
    cloneSet = require('./_cloneSet'),
    cloneSymbol = require('./_cloneSymbol'),
    cloneTypedArray = require('./_cloneTypedArray');

/** `Object#toString` result references. */
var boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/**
 * Initializes an object clone based on its `toStringTag`.
 *
 * **Note:** This function only supports cloning values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to clone.
 * @param {string} tag The `toStringTag` of the object to clone.
 * @param {Function} cloneFunc The function to clone values.
 * @param {boolean} [isDeep] Specify a deep clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneByTag(object, tag, cloneFunc, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag:
      return cloneArrayBuffer(object);

    case boolTag:
    case dateTag:
      return new Ctor(+object);

    case dataViewTag:
      return cloneDataView(object, isDeep);

    case float32Tag: case float64Tag:
    case int8Tag: case int16Tag: case int32Tag:
    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
      return cloneTypedArray(object, isDeep);

    case mapTag:
      return cloneMap(object, isDeep, cloneFunc);

    case numberTag:
    case stringTag:
      return new Ctor(object);

    case regexpTag:
      return cloneRegExp(object);

    case setTag:
      return cloneSet(object, isDeep, cloneFunc);

    case symbolTag:
      return cloneSymbol(object);
  }
}

module.exports = initCloneByTag;

},{"./_cloneArrayBuffer":99,"./_cloneDataView":101,"./_cloneMap":102,"./_cloneRegExp":103,"./_cloneSet":104,"./_cloneSymbol":105,"./_cloneTypedArray":106}],142:[function(require,module,exports){
var baseCreate = require('./_baseCreate'),
    getPrototype = require('./_getPrototype'),
    isPrototype = require('./_isPrototype');

/**
 * Initializes an object clone.
 *
 * @private
 * @param {Object} object The object to clone.
 * @returns {Object} Returns the initialized clone.
 */
function initCloneObject(object) {
  return (typeof object.constructor == 'function' && !isPrototype(object))
    ? baseCreate(getPrototype(object))
    : {};
}

module.exports = initCloneObject;

},{"./_baseCreate":55,"./_getPrototype":129,"./_isPrototype":150}],143:[function(require,module,exports){
var Symbol = require('./_Symbol'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray');

/** Built-in value references. */
var spreadableSymbol = Symbol ? Symbol.isConcatSpreadable : undefined;

/**
 * Checks if `value` is a flattenable `arguments` object or array.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
 */
function isFlattenable(value) {
  return isArray(value) || isArguments(value) ||
    !!(spreadableSymbol && value && value[spreadableSymbol]);
}

module.exports = isFlattenable;

},{"./_Symbol":33,"./isArguments":201,"./isArray":202}],144:[function(require,module,exports){
/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

module.exports = isHostObject;

},{}],145:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

module.exports = isIndex;

},{}],146:[function(require,module,exports){
var eq = require('./eq'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isObject = require('./isObject');

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;

},{"./_isIndex":145,"./eq":187,"./isArrayLike":203,"./isObject":212}],147:[function(require,module,exports){
var isArray = require('./isArray'),
    isSymbol = require('./isSymbol');

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;

},{"./isArray":202,"./isSymbol":216}],148:[function(require,module,exports){
/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

module.exports = isKeyable;

},{}],149:[function(require,module,exports){
var coreJsData = require('./_coreJsData');

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

module.exports = isMasked;

},{"./_coreJsData":112}],150:[function(require,module,exports){
/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

module.exports = isPrototype;

},{}],151:[function(require,module,exports){
var isObject = require('./isObject');

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

module.exports = isStrictComparable;

},{"./isObject":212}],152:[function(require,module,exports){
/**
 * Converts `iterator` to an array.
 *
 * @private
 * @param {Object} iterator The iterator to convert.
 * @returns {Array} Returns the converted array.
 */
function iteratorToArray(iterator) {
  var data,
      result = [];

  while (!(data = iterator.next()).done) {
    result.push(data.value);
  }
  return result;
}

module.exports = iteratorToArray;

},{}],153:[function(require,module,exports){
/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

module.exports = listCacheClear;

},{}],154:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/** Built-in value references. */
var splice = arrayProto.splice;

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

module.exports = listCacheDelete;

},{"./_assocIndexOf":51}],155:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

module.exports = listCacheGet;

},{"./_assocIndexOf":51}],156:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

module.exports = listCacheHas;

},{"./_assocIndexOf":51}],157:[function(require,module,exports){
var assocIndexOf = require('./_assocIndexOf');

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

module.exports = listCacheSet;

},{"./_assocIndexOf":51}],158:[function(require,module,exports){
var Hash = require('./_Hash'),
    ListCache = require('./_ListCache'),
    Map = require('./_Map');

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

module.exports = mapCacheClear;

},{"./_Hash":24,"./_ListCache":25,"./_Map":26}],159:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

module.exports = mapCacheDelete;

},{"./_getMapData":126}],160:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

module.exports = mapCacheGet;

},{"./_getMapData":126}],161:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

module.exports = mapCacheHas;

},{"./_getMapData":126}],162:[function(require,module,exports){
var getMapData = require('./_getMapData');

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

module.exports = mapCacheSet;

},{"./_getMapData":126}],163:[function(require,module,exports){
/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

module.exports = mapToArray;

},{}],164:[function(require,module,exports){
/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

module.exports = matchesStrictComparable;

},{}],165:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    isObject = require('./isObject');

/**
 * Used by `_.defaultsDeep` to customize its `_.merge` use.
 *
 * @private
 * @param {*} objValue The destination value.
 * @param {*} srcValue The source value.
 * @param {string} key The key of the property to merge.
 * @param {Object} object The parent object of `objValue`.
 * @param {Object} source The parent object of `srcValue`.
 * @param {Object} [stack] Tracks traversed source values and their merged
 *  counterparts.
 * @returns {*} Returns the value to assign.
 */
function mergeDefaults(objValue, srcValue, key, object, source, stack) {
  if (isObject(objValue) && isObject(srcValue)) {
    // Recursively merge objects and arrays (susceptible to call stack limits).
    stack.set(srcValue, objValue);
    baseMerge(objValue, srcValue, undefined, mergeDefaults, stack);
    stack['delete'](srcValue);
  }
  return objValue;
}

module.exports = mergeDefaults;

},{"./_baseMerge":82,"./isObject":212}],166:[function(require,module,exports){
var getNative = require('./_getNative');

/* Built-in method references that are verified to be native. */
var nativeCreate = getNative(Object, 'create');

module.exports = nativeCreate;

},{"./_getNative":128}],167:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

module.exports = nodeUtil;

},{"./_freeGlobal":123}],168:[function(require,module,exports){
/**
 * Creates a function that invokes `func` with its first argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

module.exports = overArg;

},{}],169:[function(require,module,exports){
var freeGlobal = require('./_freeGlobal');

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;

},{"./_freeGlobal":123}],170:[function(require,module,exports){
/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

module.exports = setCacheAdd;

},{}],171:[function(require,module,exports){
/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

module.exports = setCacheHas;

},{}],172:[function(require,module,exports){
/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

module.exports = setToArray;

},{}],173:[function(require,module,exports){
var ListCache = require('./_ListCache');

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

module.exports = stackClear;

},{"./_ListCache":25}],174:[function(require,module,exports){
/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

module.exports = stackDelete;

},{}],175:[function(require,module,exports){
/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

module.exports = stackGet;

},{}],176:[function(require,module,exports){
/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

module.exports = stackHas;

},{}],177:[function(require,module,exports){
var ListCache = require('./_ListCache'),
    Map = require('./_Map'),
    MapCache = require('./_MapCache');

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

module.exports = stackSet;

},{"./_ListCache":25,"./_Map":26,"./_MapCache":27}],178:[function(require,module,exports){
var memoize = require('./memoize'),
    toString = require('./toString');

/** Used to match property names within property paths. */
var reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;

},{"./memoize":222,"./toString":240}],179:[function(require,module,exports){
var isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = toKey;

},{"./isSymbol":216}],180:[function(require,module,exports){
/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

module.exports = toSource;

},{}],181:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    createAssigner = require('./_createAssigner'),
    keysIn = require('./keysIn');

/**
 * This method is like `_.assignIn` except that it accepts `customizer`
 * which is invoked to produce the assigned values. If `customizer` returns
 * `undefined`, assignment is handled by the method instead. The `customizer`
 * is invoked with five arguments: (objValue, srcValue, key, object, source).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @alias extendWith
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} [customizer] The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @see _.assignWith
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   return _.isUndefined(objValue) ? srcValue : objValue;
 * }
 *
 * var defaults = _.partialRight(_.assignInWith, customizer);
 *
 * defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
  copyObject(source, keysIn(source), object, customizer);
});

module.exports = assignInWith;

},{"./_copyObject":110,"./_createAssigner":114,"./keysIn":220}],182:[function(require,module,exports){
var baseClone = require('./_baseClone');

/**
 * Creates a shallow clone of `value`.
 *
 * **Note:** This method is loosely based on the
 * [structured clone algorithm](https://mdn.io/Structured_clone_algorithm)
 * and supports cloning arrays, array buffers, booleans, date objects, maps,
 * numbers, `Object` objects, regexes, sets, strings, symbols, and typed
 * arrays. The own enumerable properties of `arguments` objects are cloned
 * as plain objects. An empty object is returned for uncloneable values such
 * as error objects, functions, DOM nodes, and WeakMaps.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to clone.
 * @returns {*} Returns the cloned value.
 * @see _.cloneDeep
 * @example
 *
 * var objects = [{ 'a': 1 }, { 'b': 2 }];
 *
 * var shallow = _.clone(objects);
 * console.log(shallow[0] === objects[0]);
 * // => true
 */
function clone(value) {
  return baseClone(value, false, true);
}

module.exports = clone;

},{"./_baseClone":54}],183:[function(require,module,exports){
var isObject = require('./isObject'),
    now = require('./now'),
    toNumber = require('./toNumber');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;

},{"./isObject":212,"./now":227,"./toNumber":238}],184:[function(require,module,exports){
var apply = require('./_apply'),
    assignInDefaults = require('./_assignInDefaults'),
    assignInWith = require('./assignInWith'),
    baseRest = require('./_baseRest');

/**
 * Assigns own and inherited enumerable string keyed properties of source
 * objects to the destination object for all destination properties that
 * resolve to `undefined`. Source objects are applied from left to right.
 * Once a property is set, additional values of the same property are ignored.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaultsDeep
 * @example
 *
 * _.defaults({ 'a': 1 }, { 'b': 2 }, { 'a': 3 });
 * // => { 'a': 1, 'b': 2 }
 */
var defaults = baseRest(function(args) {
  args.push(undefined, assignInDefaults);
  return apply(assignInWith, undefined, args);
});

module.exports = defaults;

},{"./_apply":38,"./_assignInDefaults":48,"./_baseRest":89,"./assignInWith":181}],185:[function(require,module,exports){
var apply = require('./_apply'),
    baseRest = require('./_baseRest'),
    mergeDefaults = require('./_mergeDefaults'),
    mergeWith = require('./mergeWith');

/**
 * This method is like `_.defaults` except that it recursively assigns
 * default properties.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 3.10.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @see _.defaults
 * @example
 *
 * _.defaultsDeep({ 'a': { 'b': 2 } }, { 'a': { 'b': 1, 'c': 3 } });
 * // => { 'a': { 'b': 2, 'c': 3 } }
 */
var defaultsDeep = baseRest(function(args) {
  args.push(undefined, mergeDefaults);
  return apply(mergeWith, undefined, args);
});

module.exports = defaultsDeep;

},{"./_apply":38,"./_baseRest":89,"./_mergeDefaults":165,"./mergeWith":224}],186:[function(require,module,exports){
var baseDifference = require('./_baseDifference'),
    baseFlatten = require('./_baseFlatten'),
    baseRest = require('./_baseRest'),
    isArrayLikeObject = require('./isArrayLikeObject');

/**
 * Creates an array of `array` values not included in the other given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * for equality comparisons. The order of result values is determined by the
 * order they occur in the first array.
 *
 * **Note:** Unlike `_.pullAll`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {...Array} [values] The values to exclude.
 * @returns {Array} Returns the new array of filtered values.
 * @see _.without, _.xor
 * @example
 *
 * _.difference([2, 1], [2, 3]);
 * // => [1]
 */
var difference = baseRest(function(array, values) {
  return isArrayLikeObject(array)
    ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
    : [];
});

module.exports = difference;

},{"./_baseDifference":56,"./_baseFlatten":60,"./_baseRest":89,"./isArrayLikeObject":204}],187:[function(require,module,exports){
/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],188:[function(require,module,exports){
var escapeHtmlChar = require('./_escapeHtmlChar'),
    toString = require('./toString');

/** Used to match HTML entities and HTML characters. */
var reUnescapedHtml = /[&<>"'`]/g,
    reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/**
 * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
 * their corresponding HTML entities.
 *
 * **Note:** No other characters are escaped. To escape additional
 * characters use a third-party library like [_he_](https://mths.be/he).
 *
 * Though the ">" character is escaped for symmetry, characters like
 * ">" and "/" don't need escaping in HTML and have no special meaning
 * unless they're part of a tag or unquoted attribute value. See
 * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
 * (under "semi-related fun fact") for more details.
 *
 * Backticks are escaped because in IE < 9, they can break out of
 * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
 * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
 * [#133](https://html5sec.org/#133) of the
 * [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
 *
 * When working with HTML you should always
 * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
 * XSS vectors.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category String
 * @param {string} [string=''] The string to escape.
 * @returns {string} Returns the escaped string.
 * @example
 *
 * _.escape('fred, barney, & pebbles');
 * // => 'fred, barney, &amp; pebbles'
 */
function escape(string) {
  string = toString(string);
  return (string && reHasUnescapedHtml.test(string))
    ? string.replace(reUnescapedHtml, escapeHtmlChar)
    : string;
}

module.exports = escape;

},{"./_escapeHtmlChar":122,"./toString":240}],189:[function(require,module,exports){
var arrayFilter = require('./_arrayFilter'),
    baseFilter = require('./_baseFilter'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity]
 *  The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;

},{"./_arrayFilter":41,"./_baseFilter":58,"./_baseIteratee":76,"./isArray":202}],190:[function(require,module,exports){
var createFind = require('./_createFind'),
    findIndex = require('./findIndex');

/**
 * Iterates over elements of `collection`, returning the first element
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to search.
 * @param {Function} [predicate=_.identity]
 *  The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {*} Returns the matched element, else `undefined`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': true },
 *   { 'user': 'fred',    'age': 40, 'active': false },
 *   { 'user': 'pebbles', 'age': 1,  'active': true }
 * ];
 *
 * _.find(users, function(o) { return o.age < 40; });
 * // => object for 'barney'
 *
 * // The `_.matches` iteratee shorthand.
 * _.find(users, { 'age': 1, 'active': true });
 * // => object for 'pebbles'
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.find(users, ['active', false]);
 * // => object for 'fred'
 *
 * // The `_.property` iteratee shorthand.
 * _.find(users, 'active');
 * // => object for 'barney'
 */
var find = createFind(findIndex);

module.exports = find;

},{"./_createFind":117,"./findIndex":191}],191:[function(require,module,exports){
var baseFindIndex = require('./_baseFindIndex'),
    baseIteratee = require('./_baseIteratee'),
    toInteger = require('./toInteger');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * This method is like `_.find` except that it returns the index of the first
 * element `predicate` returns truthy for instead of the element itself.
 *
 * @static
 * @memberOf _
 * @since 1.1.0
 * @category Array
 * @param {Array} array The array to search.
 * @param {Function} [predicate=_.identity]
 *  The function invoked per iteration.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the found element, else `-1`.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'active': false },
 *   { 'user': 'fred',    'active': false },
 *   { 'user': 'pebbles', 'active': true }
 * ];
 *
 * _.findIndex(users, function(o) { return o.user == 'barney'; });
 * // => 0
 *
 * // The `_.matches` iteratee shorthand.
 * _.findIndex(users, { 'user': 'fred', 'active': false });
 * // => 1
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.findIndex(users, ['active', false]);
 * // => 0
 *
 * // The `_.property` iteratee shorthand.
 * _.findIndex(users, 'active');
 * // => 2
 */
function findIndex(array, predicate, fromIndex) {
  var length = array ? array.length : 0;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseFindIndex(array, baseIteratee(predicate, 3), index);
}

module.exports = findIndex;

},{"./_baseFindIndex":59,"./_baseIteratee":76,"./toInteger":237}],192:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten'),
    map = require('./map');

/**
 * Creates a flattened array of values by running each element in `collection`
 * thru `iteratee` and flattening the mapped results. The iteratee is invoked
 * with three arguments: (value, index|key, collection).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity]
 *  The function invoked per iteration.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * function duplicate(n) {
 *   return [n, n];
 * }
 *
 * _.flatMap([1, 2], duplicate);
 * // => [1, 1, 2, 2]
 */
function flatMap(collection, iteratee) {
  return baseFlatten(map(collection, iteratee), 1);
}

module.exports = flatMap;

},{"./_baseFlatten":60,"./map":221}],193:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten');

/**
 * Flattens `array` a single level deep.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to flatten.
 * @returns {Array} Returns the new flattened array.
 * @example
 *
 * _.flatten([1, [2, [3, [4]], 5]]);
 * // => [1, 2, [3, [4]], 5]
 */
function flatten(array) {
  var length = array ? array.length : 0;
  return length ? baseFlatten(array, 1) : [];
}

module.exports = flatten;

},{"./_baseFlatten":60}],194:[function(require,module,exports){
var arrayEach = require('./_arrayEach'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
    isArray = require('./isArray');

/**
 * Iterates over elements of `collection` and invokes `iteratee` for each element.
 * The iteratee is invoked with three arguments: (value, index|key, collection).
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * **Note:** As with other "Collections" methods, objects with a "length"
 * property are iterated like arrays. To avoid this behavior use `_.forIn`
 * or `_.forOwn` for object iteration.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @alias each
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 * @see _.forEachRight
 * @example
 *
 * _([1, 2]).forEach(function(value) {
 *   console.log(value);
 * });
 * // => Logs `1` then `2`.
 *
 * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
 *   console.log(key);
 * });
 * // => Logs 'a' then 'b' (iteration order is not guaranteed).
 */
function forEach(collection, iteratee) {
  var func = isArray(collection) ? arrayEach : baseEach;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = forEach;

},{"./_arrayEach":40,"./_baseEach":57,"./_baseIteratee":76,"./isArray":202}],195:[function(require,module,exports){
var baseGet = require('./_baseGet');

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;

},{"./_baseGet":63}],196:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct property of `object`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = { 'a': { 'b': 2 } };
 * var other = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.has(object, 'a');
 * // => true
 *
 * _.has(object, 'a.b');
 * // => true
 *
 * _.has(object, ['a', 'b']);
 * // => true
 *
 * _.has(other, 'a');
 * // => false
 */
function has(object, path) {
  return object != null && hasPath(object, path, baseHas);
}

module.exports = has;

},{"./_baseHas":66,"./_hasPath":133}],197:[function(require,module,exports){
var baseHasIn = require('./_baseHasIn'),
    hasPath = require('./_hasPath');

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

module.exports = hasIn;

},{"./_baseHasIn":67,"./_hasPath":133}],198:[function(require,module,exports){
/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;

},{}],199:[function(require,module,exports){
var baseInRange = require('./_baseInRange'),
    toFinite = require('./toFinite'),
    toNumber = require('./toNumber');

/**
 * Checks if `n` is between `start` and up to, but not including, `end`. If
 * `end` is not specified, it's set to `start` with `start` then set to `0`.
 * If `start` is greater than `end` the params are swapped to support
 * negative ranges.
 *
 * @static
 * @memberOf _
 * @since 3.3.0
 * @category Number
 * @param {number} number The number to check.
 * @param {number} [start=0] The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 * @see _.range, _.rangeRight
 * @example
 *
 * _.inRange(3, 2, 4);
 * // => true
 *
 * _.inRange(4, 8);
 * // => true
 *
 * _.inRange(4, 2);
 * // => false
 *
 * _.inRange(2, 2);
 * // => false
 *
 * _.inRange(1.2, 2);
 * // => true
 *
 * _.inRange(5.2, 4);
 * // => false
 *
 * _.inRange(-3, -2, -6);
 * // => true
 */
function inRange(number, start, end) {
  start = toFinite(start);
  if (end === undefined) {
    end = start;
    start = 0;
  } else {
    end = toFinite(end);
  }
  number = toNumber(number);
  return baseInRange(number, start, end);
}

module.exports = inRange;

},{"./_baseInRange":68,"./toFinite":236,"./toNumber":238}],200:[function(require,module,exports){
var baseIndexOf = require('./_baseIndexOf'),
    isArrayLike = require('./isArrayLike'),
    isString = require('./isString'),
    toInteger = require('./toInteger'),
    values = require('./values');

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Checks if `value` is in `collection`. If `collection` is a string, it's
 * checked for a substring of `value`, otherwise
 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * is used for equality comparisons. If `fromIndex` is negative, it's used as
 * the offset from the end of `collection`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object|string} collection The collection to search.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {boolean} Returns `true` if `value` is found, else `false`.
 * @example
 *
 * _.includes([1, 2, 3], 1);
 * // => true
 *
 * _.includes([1, 2, 3], 1, 2);
 * // => false
 *
 * _.includes({ 'a': 1, 'b': 2 }, 1);
 * // => true
 *
 * _.includes('abcd', 'bc');
 * // => true
 */
function includes(collection, value, fromIndex, guard) {
  collection = isArrayLike(collection) ? collection : values(collection);
  fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

  var length = collection.length;
  if (fromIndex < 0) {
    fromIndex = nativeMax(length + fromIndex, 0);
  }
  return isString(collection)
    ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
    : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
}

module.exports = includes;

},{"./_baseIndexOf":69,"./isArrayLike":203,"./isString":215,"./toInteger":237,"./values":242}],201:[function(require,module,exports){
var isArrayLikeObject = require('./isArrayLikeObject');

/** `Object#toString` result references. */
var argsTag = '[object Arguments]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 incorrectly makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

module.exports = isArguments;

},{"./isArrayLikeObject":204}],202:[function(require,module,exports){
/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;

},{}],203:[function(require,module,exports){
var getLength = require('./_getLength'),
    isFunction = require('./isFunction'),
    isLength = require('./isLength');

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(getLength(value)) && !isFunction(value);
}

module.exports = isArrayLike;

},{"./_getLength":125,"./isFunction":208,"./isLength":209}],204:[function(require,module,exports){
var isArrayLike = require('./isArrayLike'),
    isObjectLike = require('./isObjectLike');

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

module.exports = isArrayLikeObject;

},{"./isArrayLike":203,"./isObjectLike":213}],205:[function(require,module,exports){
var root = require('./_root'),
    stubFalse = require('./stubFalse');

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Built-in value references. */
var Buffer = moduleExports ? root.Buffer : undefined;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

/**
 * Checks if `value` is a buffer.
 *
 * @static
 * @memberOf _
 * @since 4.3.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
 * @example
 *
 * _.isBuffer(new Buffer(2));
 * // => true
 *
 * _.isBuffer(new Uint8Array(2));
 * // => false
 */
var isBuffer = nativeIsBuffer || stubFalse;

module.exports = isBuffer;

},{"./_root":169,"./stubFalse":233}],206:[function(require,module,exports){
var isObjectLike = require('./isObjectLike'),
    isPlainObject = require('./isPlainObject');

/**
 * Checks if `value` is likely a DOM element.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a DOM element,
 *  else `false`.
 * @example
 *
 * _.isElement(document.body);
 * // => true
 *
 * _.isElement('<body>');
 * // => false
 */
function isElement(value) {
  return !!value && value.nodeType === 1 && isObjectLike(value) && !isPlainObject(value);
}

module.exports = isElement;

},{"./isObjectLike":213,"./isPlainObject":214}],207:[function(require,module,exports){
var getTag = require('./_getTag'),
    isArguments = require('./isArguments'),
    isArray = require('./isArray'),
    isArrayLike = require('./isArrayLike'),
    isBuffer = require('./isBuffer'),
    isFunction = require('./isFunction'),
    isObjectLike = require('./isObjectLike'),
    isString = require('./isString'),
    keys = require('./keys');

/** `Object#toString` result references. */
var mapTag = '[object Map]',
    setTag = '[object Set]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Built-in value references. */
var propertyIsEnumerable = objectProto.propertyIsEnumerable;

/** Detect if properties shadowing those on `Object.prototype` are non-enumerable. */
var nonEnumShadows = !propertyIsEnumerable.call({ 'valueOf': 1 }, 'valueOf');

/**
 * Checks if `value` is an empty object, collection, map, or set.
 *
 * Objects are considered empty if they have no own enumerable string keyed
 * properties.
 *
 * Array-like values such as `arguments` objects, arrays, buffers, strings, or
 * jQuery-like collections are considered empty if they have a `length` of `0`.
 * Similarly, maps and sets are considered empty if they have a `size` of `0`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is empty, else `false`.
 * @example
 *
 * _.isEmpty(null);
 * // => true
 *
 * _.isEmpty(true);
 * // => true
 *
 * _.isEmpty(1);
 * // => true
 *
 * _.isEmpty([1, 2, 3]);
 * // => false
 *
 * _.isEmpty({ 'a': 1 });
 * // => false
 */
function isEmpty(value) {
  if (isArrayLike(value) &&
      (isArray(value) || isString(value) || isFunction(value.splice) ||
        isArguments(value) || isBuffer(value))) {
    return !value.length;
  }
  if (isObjectLike(value)) {
    var tag = getTag(value);
    if (tag == mapTag || tag == setTag) {
      return !value.size;
    }
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return !(nonEnumShadows && keys(value).length);
}

module.exports = isEmpty;

},{"./_getTag":131,"./isArguments":201,"./isArray":202,"./isArrayLike":203,"./isBuffer":205,"./isFunction":208,"./isObjectLike":213,"./isString":215,"./keys":219}],208:[function(require,module,exports){
var isObject = require('./isObject');

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8 which returns 'object' for typed array and weak map constructors,
  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

module.exports = isFunction;

},{"./isObject":212}],209:[function(require,module,exports){
/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This function is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/6.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length,
 *  else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

module.exports = isLength;

},{}],210:[function(require,module,exports){
var isNumber = require('./isNumber');

/**
 * Checks if `value` is `NaN`.
 *
 * **Note:** This method is based on
 * [`Number.isNaN`](https://mdn.io/Number/isNaN) and is not the same as
 * global [`isNaN`](https://mdn.io/isNaN) which returns `true` for
 * `undefined` and other non-number values.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 * @example
 *
 * _.isNaN(NaN);
 * // => true
 *
 * _.isNaN(new Number(NaN));
 * // => true
 *
 * isNaN(undefined);
 * // => true
 *
 * _.isNaN(undefined);
 * // => false
 */
function isNaN(value) {
  // An `NaN` primitive is the only value that is not equal to itself.
  // Perform the `toStringTag` check first to avoid errors with some
  // ActiveX objects in IE.
  return isNumber(value) && value != +value;
}

module.exports = isNaN;

},{"./isNumber":211}],211:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var numberTag = '[object Number]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Number` primitive or object.
 *
 * **Note:** To exclude `Infinity`, `-Infinity`, and `NaN`, which are
 * classified as numbers, use the `_.isFinite` method.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a number, else `false`.
 * @example
 *
 * _.isNumber(3);
 * // => true
 *
 * _.isNumber(Number.MIN_VALUE);
 * // => true
 *
 * _.isNumber(Infinity);
 * // => true
 *
 * _.isNumber('3');
 * // => false
 */
function isNumber(value) {
  return typeof value == 'number' ||
    (isObjectLike(value) && objectToString.call(value) == numberTag);
}

module.exports = isNumber;

},{"./isObjectLike":213}],212:[function(require,module,exports){
/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

module.exports = isObject;

},{}],213:[function(require,module,exports){
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = isObjectLike;

},{}],214:[function(require,module,exports){
var getPrototype = require('./_getPrototype'),
    isHostObject = require('./_isHostObject'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = Function.prototype.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object,
 *  else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;

},{"./_getPrototype":129,"./_isHostObject":144,"./isObjectLike":213}],215:[function(require,module,exports){
var isArray = require('./isArray'),
    isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var stringTag = '[object String]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `String` primitive or object.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a string, else `false`.
 * @example
 *
 * _.isString('abc');
 * // => true
 *
 * _.isString(1);
 * // => false
 */
function isString(value) {
  return typeof value == 'string' ||
    (!isArray(value) && isObjectLike(value) && objectToString.call(value) == stringTag);
}

module.exports = isString;

},{"./isArray":202,"./isObjectLike":213}],216:[function(require,module,exports){
var isObjectLike = require('./isObjectLike');

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

module.exports = isSymbol;

},{"./isObjectLike":213}],217:[function(require,module,exports){
var baseIsTypedArray = require('./_baseIsTypedArray'),
    baseUnary = require('./_baseUnary'),
    nodeUtil = require('./_nodeUtil');

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

module.exports = isTypedArray;

},{"./_baseIsTypedArray":75,"./_baseUnary":94,"./_nodeUtil":167}],218:[function(require,module,exports){
/**
 * Checks if `value` is `undefined`.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `undefined`, else `false`.
 * @example
 *
 * _.isUndefined(void 0);
 * // => true
 *
 * _.isUndefined(null);
 * // => false
 */
function isUndefined(value) {
  return value === undefined;
}

module.exports = isUndefined;

},{}],219:[function(require,module,exports){
var baseHas = require('./_baseHas'),
    baseKeys = require('./_baseKeys'),
    indexKeys = require('./_indexKeys'),
    isArrayLike = require('./isArrayLike'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/6.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  var isProto = isPrototype(object);
  if (!(isProto || isArrayLike(object))) {
    return baseKeys(object);
  }
  var indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  for (var key in object) {
    if (baseHas(object, key) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(isProto && key == 'constructor')) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keys;

},{"./_baseHas":66,"./_baseKeys":77,"./_indexKeys":139,"./_isIndex":145,"./_isPrototype":150,"./isArrayLike":203}],220:[function(require,module,exports){
var baseKeysIn = require('./_baseKeysIn'),
    indexKeys = require('./_indexKeys'),
    isIndex = require('./_isIndex'),
    isPrototype = require('./_isPrototype');

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  var index = -1,
      isProto = isPrototype(object),
      props = baseKeysIn(object),
      propsLength = props.length,
      indexes = indexKeys(object),
      skipIndexes = !!indexes,
      result = indexes || [],
      length = result.length;

  while (++index < propsLength) {
    var key = props[index];
    if (!(skipIndexes && (key == 'length' || isIndex(key, length))) &&
        !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

module.exports = keysIn;

},{"./_baseKeysIn":78,"./_indexKeys":139,"./_isIndex":145,"./_isPrototype":150}],221:[function(require,module,exports){
var arrayMap = require('./_arrayMap'),
    baseIteratee = require('./_baseIteratee'),
    baseMap = require('./_baseMap'),
    isArray = require('./isArray');

/**
 * Creates an array of values by running each element in `collection` thru
 * `iteratee`. The iteratee is invoked with three arguments:
 * (value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
 *
 * The guarded methods are:
 * `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`,
 * `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`,
 * `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`,
 * `template`, `trim`, `trimEnd`, `trimStart`, and `words`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 * @example
 *
 * function square(n) {
 *   return n * n;
 * }
 *
 * _.map([4, 8], square);
 * // => [16, 64]
 *
 * _.map({ 'a': 4, 'b': 8 }, square);
 * // => [16, 64] (iteration order is not guaranteed)
 *
 * var users = [
 *   { 'user': 'barney' },
 *   { 'user': 'fred' }
 * ];
 *
 * // The `_.property` iteratee shorthand.
 * _.map(users, 'user');
 * // => ['barney', 'fred']
 */
function map(collection, iteratee) {
  var func = isArray(collection) ? arrayMap : baseMap;
  return func(collection, baseIteratee(iteratee, 3));
}

module.exports = map;

},{"./_arrayMap":44,"./_baseIteratee":76,"./_baseMap":79,"./isArray":202}],222:[function(require,module,exports){
var MapCache = require('./_MapCache');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

module.exports = memoize;

},{"./_MapCache":27}],223:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

/**
 * This method is like `_.assign` except that it recursively merges own and
 * inherited enumerable string keyed properties of source objects into the
 * destination object. Source properties that resolve to `undefined` are
 * skipped if a destination value exists. Array and plain object properties
 * are merged recursively. Other objects and value types are overridden by
 * assignment. Source objects are applied from left to right. Subsequent
 * sources overwrite property assignments of previous sources.
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 0.5.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} [sources] The source objects.
 * @returns {Object} Returns `object`.
 * @example
 *
 * var object = {
 *   'a': [{ 'b': 2 }, { 'd': 4 }]
 * };
 *
 * var other = {
 *   'a': [{ 'c': 3 }, { 'e': 5 }]
 * };
 *
 * _.merge(object, other);
 * // => { 'a': [{ 'b': 2, 'c': 3 }, { 'd': 4, 'e': 5 }] }
 */
var merge = createAssigner(function(object, source, srcIndex) {
  baseMerge(object, source, srcIndex);
});

module.exports = merge;

},{"./_baseMerge":82,"./_createAssigner":114}],224:[function(require,module,exports){
var baseMerge = require('./_baseMerge'),
    createAssigner = require('./_createAssigner');

/**
 * This method is like `_.merge` except that it accepts `customizer` which
 * is invoked to produce the merged values of the destination and source
 * properties. If `customizer` returns `undefined`, merging is handled by the
 * method instead. The `customizer` is invoked with seven arguments:
 * (objValue, srcValue, key, object, source, stack).
 *
 * **Note:** This method mutates `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The destination object.
 * @param {...Object} sources The source objects.
 * @param {Function} customizer The function to customize assigned values.
 * @returns {Object} Returns `object`.
 * @example
 *
 * function customizer(objValue, srcValue) {
 *   if (_.isArray(objValue)) {
 *     return objValue.concat(srcValue);
 *   }
 * }
 *
 * var object = { 'a': [1], 'b': [2] };
 * var other = { 'a': [3], 'b': [4] };
 *
 * _.mergeWith(object, other, customizer);
 * // => { 'a': [1, 3], 'b': [2, 4] }
 */
var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
  baseMerge(object, source, srcIndex, customizer);
});

module.exports = mergeWith;

},{"./_baseMerge":82,"./_createAssigner":114}],225:[function(require,module,exports){
/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a function that negates the result of the predicate `func`. The
 * `func` predicate is invoked with the `this` binding and arguments of the
 * created function.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Function
 * @param {Function} predicate The predicate to negate.
 * @returns {Function} Returns the new negated function.
 * @example
 *
 * function isEven(n) {
 *   return n % 2 == 0;
 * }
 *
 * _.filter([1, 2, 3, 4, 5, 6], _.negate(isEven));
 * // => [1, 3, 5]
 */
function negate(predicate) {
  if (typeof predicate != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  return function() {
    var args = arguments;
    switch (args.length) {
      case 0: return !predicate.call(this);
      case 1: return !predicate.call(this, args[0]);
      case 2: return !predicate.call(this, args[0], args[1]);
      case 3: return !predicate.call(this, args[0], args[1], args[2]);
    }
    return !predicate.apply(this, args);
  };
}

module.exports = negate;

},{}],226:[function(require,module,exports){
/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;

},{}],227:[function(require,module,exports){
/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
function now() {
  return Date.now();
}

module.exports = now;

},{}],228:[function(require,module,exports){
var createAggregator = require('./_createAggregator');

/**
 * Creates an array of elements split into two groups, the first of which
 * contains elements `predicate` returns truthy for, the second of which
 * contains elements `predicate` returns falsey for. The predicate is
 * invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the array of grouped elements.
 * @example
 *
 * var users = [
 *   { 'user': 'barney',  'age': 36, 'active': false },
 *   { 'user': 'fred',    'age': 40, 'active': true },
 *   { 'user': 'pebbles', 'age': 1,  'active': false }
 * ];
 *
 * _.partition(users, function(o) { return o.active; });
 * // => objects for [['fred'], ['barney', 'pebbles']]
 *
 * // The `_.matches` iteratee shorthand.
 * _.partition(users, { 'age': 1, 'active': false });
 * // => objects for [['pebbles'], ['barney', 'fred']]
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.partition(users, ['active', false]);
 * // => objects for [['barney', 'pebbles'], ['fred']]
 *
 * // The `_.property` iteratee shorthand.
 * _.partition(users, 'active');
 * // => objects for [['fred'], ['barney', 'pebbles']]
 */
var partition = createAggregator(function(result, value, key) {
  result[key ? 0 : 1].push(value);
}, function() { return [[], []]; });

module.exports = partition;

},{"./_createAggregator":113}],229:[function(require,module,exports){
var baseProperty = require('./_baseProperty'),
    basePropertyDeep = require('./_basePropertyDeep'),
    isKey = require('./_isKey'),
    toKey = require('./_toKey');

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

module.exports = property;

},{"./_baseProperty":85,"./_basePropertyDeep":86,"./_isKey":147,"./_toKey":179}],230:[function(require,module,exports){
var arrayReduce = require('./_arrayReduce'),
    baseEach = require('./_baseEach'),
    baseIteratee = require('./_baseIteratee'),
    baseReduce = require('./_baseReduce'),
    isArray = require('./isArray');

/**
 * Reduces `collection` to a value which is the accumulated result of running
 * each element in `collection` thru `iteratee`, where each successive
 * invocation is supplied the return value of the previous. If `accumulator`
 * is not given, the first element of `collection` is used as the initial
 * value. The iteratee is invoked with four arguments:
 * (accumulator, value, index|key, collection).
 *
 * Many lodash methods are guarded to work as iteratees for methods like
 * `_.reduce`, `_.reduceRight`, and `_.transform`.
 *
 * The guarded methods are:
 * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
 * and `sortBy`
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [iteratee=_.identity] The function invoked per iteration.
 * @param {*} [accumulator] The initial value.
 * @returns {*} Returns the accumulated value.
 * @see _.reduceRight
 * @example
 *
 * _.reduce([1, 2], function(sum, n) {
 *   return sum + n;
 * }, 0);
 * // => 3
 *
 * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
 *   (result[value] || (result[value] = [])).push(key);
 *   return result;
 * }, {});
 * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
 */
function reduce(collection, iteratee, accumulator) {
  var func = isArray(collection) ? arrayReduce : baseReduce,
      initAccum = arguments.length < 3;

  return func(collection, baseIteratee(iteratee, 4), accumulator, initAccum, baseEach);
}

module.exports = reduce;

},{"./_arrayReduce":46,"./_baseEach":57,"./_baseIteratee":76,"./_baseReduce":88,"./isArray":202}],231:[function(require,module,exports){
var baseFlatten = require('./_baseFlatten'),
    baseOrderBy = require('./_baseOrderBy'),
    baseRest = require('./_baseRest'),
    isIterateeCall = require('./_isIterateeCall');

/**
 * Creates an array of elements, sorted in ascending order by the results of
 * running each element in a collection thru each iteratee. This method
 * performs a stable sort, that is, it preserves the original sort order of
 * equal elements. The iteratees are invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {...(Function|Function[])} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 36 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 34 }
 * ];
 *
 * _.sortBy(users, function(o) { return o.user; });
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 *
 * _.sortBy(users, ['user', 'age']);
 * // => objects for [['barney', 34], ['barney', 36], ['fred', 40], ['fred', 48]]
 *
 * _.sortBy(users, 'user', function(o) {
 *   return Math.floor(o.age / 10);
 * });
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 */
var sortBy = baseRest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});

module.exports = sortBy;

},{"./_baseFlatten":60,"./_baseOrderBy":84,"./_baseRest":89,"./_isIterateeCall":146}],232:[function(require,module,exports){
/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = stubArray;

},{}],233:[function(require,module,exports){
/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;

},{}],234:[function(require,module,exports){
var baseSum = require('./_baseSum'),
    identity = require('./identity');

/**
 * Computes the sum of the values in `array`.
 *
 * @static
 * @memberOf _
 * @since 3.4.0
 * @category Math
 * @param {Array} array The array to iterate over.
 * @returns {number} Returns the sum.
 * @example
 *
 * _.sum([4, 2, 8, 6]);
 * // => 20
 */
function sum(array) {
  return (array && array.length)
    ? baseSum(array, identity)
    : 0;
}

module.exports = sum;

},{"./_baseSum":91,"./identity":198}],235:[function(require,module,exports){
var debounce = require('./debounce'),
    isObject = require('./isObject');

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/**
 * Creates a throttled function that only invokes `func` at most once per
 * every `wait` milliseconds. The throttled function comes with a `cancel`
 * method to cancel delayed `func` invocations and a `flush` method to
 * immediately invoke them. Provide `options` to indicate whether `func`
 * should be invoked on the leading and/or trailing edge of the `wait`
 * timeout. The `func` is invoked with the last arguments provided to the
 * throttled function. Subsequent calls to the throttled function return the
 * result of the last `func` invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the throttled function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.throttle` and `_.debounce`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to throttle.
 * @param {number} [wait=0] The number of milliseconds to throttle invocations to.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=true]
 *  Specify invoking on the leading edge of the timeout.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new throttled function.
 * @example
 *
 * // Avoid excessively updating the position while scrolling.
 * jQuery(window).on('scroll', _.throttle(updatePosition, 100));
 *
 * // Invoke `renewToken` when the click event is fired, but not more than once every 5 minutes.
 * var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
 * jQuery(element).on('click', throttled);
 *
 * // Cancel the trailing throttled invocation.
 * jQuery(window).on('popstate', throttled.cancel);
 */
function throttle(func, wait, options) {
  var leading = true,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    'leading': leading,
    'maxWait': wait,
    'trailing': trailing
  });
}

module.exports = throttle;

},{"./debounce":183,"./isObject":212}],236:[function(require,module,exports){
var toNumber = require('./toNumber');

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;

},{"./toNumber":238}],237:[function(require,module,exports){
var toFinite = require('./toFinite');

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/6.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;

},{"./toFinite":236}],238:[function(require,module,exports){
var isFunction = require('./isFunction'),
    isObject = require('./isObject'),
    isSymbol = require('./isSymbol');

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = isFunction(value.valueOf) ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;

},{"./isFunction":208,"./isObject":212,"./isSymbol":216}],239:[function(require,module,exports){
var copyObject = require('./_copyObject'),
    keysIn = require('./keysIn');

/**
 * Converts `value` to a plain object flattening inherited enumerable string
 * keyed properties of `value` to own properties of the plain object.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {Object} Returns the converted plain object.
 * @example
 *
 * function Foo() {
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.assign({ 'a': 1 }, new Foo);
 * // => { 'a': 1, 'b': 2 }
 *
 * _.assign({ 'a': 1 }, _.toPlainObject(new Foo));
 * // => { 'a': 1, 'b': 2, 'c': 3 }
 */
function toPlainObject(value) {
  return copyObject(value, keysIn(value));
}

module.exports = toPlainObject;

},{"./_copyObject":110,"./keysIn":220}],240:[function(require,module,exports){
var baseToString = require('./_baseToString');

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;

},{"./_baseToString":93}],241:[function(require,module,exports){
var baseIteratee = require('./_baseIteratee'),
    baseUniq = require('./_baseUniq');

/**
 * This method is like `_.uniq` except that it accepts `iteratee` which is
 * invoked for each element in `array` to generate the criterion by which
 * uniqueness is computed. The iteratee is invoked with one argument: (value).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {Function} [iteratee=_.identity]
 *  The iteratee invoked per element.
 * @returns {Array} Returns the new duplicate free array.
 * @example
 *
 * _.uniqBy([2.1, 1.2, 2.3], Math.floor);
 * // => [2.1, 1.2]
 *
 * // The `_.property` iteratee shorthand.
 * _.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], 'x');
 * // => [{ 'x': 1 }, { 'x': 2 }]
 */
function uniqBy(array, iteratee) {
  return (array && array.length)
    ? baseUniq(array, baseIteratee(iteratee, 2))
    : [];
}

module.exports = uniqBy;

},{"./_baseIteratee":76,"./_baseUniq":95}],242:[function(require,module,exports){
var baseValues = require('./_baseValues'),
    keys = require('./keys');

/**
 * Creates an array of the own enumerable string keyed property values of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property values.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.values(new Foo);
 * // => [1, 2] (iteration order is not guaranteed)
 *
 * _.values('hi');
 * // => ['h', 'i']
 */
function values(object) {
  return object ? baseValues(object, keys(object)) : [];
}

module.exports = values;

},{"./_baseValues":96,"./keys":219}],243:[function(require,module,exports){
(function (global){
/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		define('punycode', function() {
			return punycode;
		});
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],244:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],245:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],246:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":244,"./encode":245}],247:[function(require,module,exports){
var findMatchingRule = function(rules, text){
  var i;
  for(i=0; i<rules.length; i++)
    if(rules[i].regex.test(text))
      return rules[i];
  return undefined;
};

var findMaxIndexAndRule = function(rules, text){
  var i, rule, last_matching_rule;
  for(i=0; i<text.length; i++){
    rule = findMatchingRule(rules, text.substring(0, i + 1));
    if(rule)
      last_matching_rule = rule;
    else if(last_matching_rule)
      return {max_index: i, rule: last_matching_rule};
  }
  return last_matching_rule ? {max_index: text.length, rule: last_matching_rule} : undefined;
};

module.exports = function(onToken_orig){
  var buffer = "";
  var rules = [];
  var line = 1;
  var col = 1;

  var onToken = function(src, type){
    onToken_orig({
      type: type,
      src: src,
      line: line,
      col: col
    });
    var lines = src.split("\n");
    line += lines.length - 1;
    col = (lines.length > 1 ? 1 : col) + lines[lines.length - 1].length;
  };

  return {
    addRule: function(regex, type){
      rules.push({regex: regex, type: type});
    },
    onText: function(text){
      var str = buffer + text;
      var m = findMaxIndexAndRule(rules, str);
      while(m && m.max_index !== str.length){
        onToken(str.substring(0, m.max_index), m.rule.type);

        //now find the next token
        str = str.substring(m.max_index);
        m = findMaxIndexAndRule(rules, str);
      }
      buffer = str;
    },
    end: function(){
      if(buffer.length === 0)
        return;

      var rule = findMatchingRule(rules, buffer);
      if(!rule){
        var err = new Error("unable to tokenize");
        err.tokenizer2 = {
          buffer: buffer,
          line: line,
          col: col
        };
        throw err;
      }

      onToken(buffer, rule.type);
    }
  };
};

},{}],248:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var punycode = require('punycode');
var util = require('./util');

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = require('querystring');

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};

},{"./util":249,"punycode":243,"querystring":246}],249:[function(require,module,exports){
'use strict';

module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};

},{}],250:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],251:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":250,"_process":20,"inherits":21}],252:[function(require,module,exports){
var plugins = {
	usedKeywords: require( "./js/bundledPlugins/previouslyUsedKeywords" )
};

var helpers = {
	scoreToRating: require( "./js/interpreters/scoreToRating" )
};

module.exports = {
	Assessor: require( "./js/assessor" ),
	SEOAssessor: require( "./js/seoAssessor" ),
	ContentAssessor: require( "./js/contentAssessor" ),
	App: require( "./js/app" ),
	Pluggable: require( "./js/pluggable" ),
	Researcher: require( "./js/researcher" ),
	SnippetPreview: require( "./js/snippetPreview.js" ),

	Paper: require( "./js/values/Paper" ),
	AssessmentResult: require( "./js/values/AssessmentResult" ),

	bundledPlugins: plugins,
	helpers: helpers
};

},{"./js/app":253,"./js/assessor":280,"./js/bundledPlugins/previouslyUsedKeywords":281,"./js/contentAssessor":290,"./js/interpreters/scoreToRating":302,"./js/pluggable":306,"./js/researcher":308,"./js/seoAssessor":356,"./js/snippetPreview.js":357,"./js/values/AssessmentResult":396,"./js/values/Paper":398}],253:[function(require,module,exports){
/* jshint browser: true */

require( "./config/config.js" );
var SnippetPreview = require( "./snippetPreview.js" );

var defaultsDeep = require( "lodash/defaultsDeep" );
var isObject = require( "lodash/isObject" );
var isString = require( "lodash/isString" );
var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/isUndefined" );
var isEmpty = require( "lodash/isEmpty" );
var forEach = require( "lodash/forEach" );
var debounce = require( "lodash/debounce" );
var throttle = require( "lodash/throttle" );

var Jed = require( "jed" );

var SEOAssessor = require( "./seoAssessor.js" );
var ContentAssessor = require( "./contentAssessor.js" );
var Researcher = require( "./researcher.js" );
var AssessorPresenter = require( "./renderers/AssessorPresenter.js" );
var Pluggable = require( "./pluggable.js" );
var Paper = require( "./values/Paper.js" );

var inputDebounceDelay = 400;

/**
 * Default config for YoastSEO.js
 *
 * @type {Object}
 */
var defaults = {
	callbacks: {
		bindElementEvents: function( ) { },
		updateSnippetValues: function( ) { },
		saveScores: function( ) { },
		saveContentScore: function( ) { }
	},
	sampleText: {
		baseUrl: "example.org/",
		snippetCite: "example-post/",
		title: "This is an example title - edit by clicking here",
		keyword: "Choose a focus keyword",
		meta: "Modify your meta description by editing it right here",
		text: "Start writing your text!"
	},
	queue: [ "wordCount",
		"keywordDensity",
		"subHeadings",
		"stopwords",
		"fleschReading",
		"linkCount",
		"imageCount",
		"urlKeyword",
		"urlLength",
		"metaDescription",
		"pageTitleKeyword",
		"pageTitleWidth",
		"firstParagraph",
		"'keywordDoubles" ],
	typeDelay: 3000,
	typeDelayStep: 1500,
	maxTypeDelay: 5000,
	dynamicDelay: true,
	locale: "en_US",
	translations: {
		"domain": "js-text-analysis",
		"locale_data": {
			"js-text-analysis": {
				"": {}
			}
		}
	},
	replaceTarget: [],
	resetTarget: [],
	elementTarget: [],
	marker: function() {},
	keywordAnalysisActive: true,
	contentAnalysisActive: true
};

/**
 * Creates a default snippet preview, this can be used if no snippet preview has been passed.
 *
 * @private
 * @this App
 *
 * @returns {SnippetPreview} The SnippetPreview object.
 */
function createDefaultSnippetPreview() {
	var targetElement = document.getElementById( this.config.targets.snippet );

	return new SnippetPreview( {
		analyzerApp: this,
		targetElement: targetElement,
		callbacks: {
			saveSnippetData: this.config.callbacks.saveSnippetData
		}
	} );
}

/**
 * Returns whether or not the given argument is a valid SnippetPreview object.
 *
 * @param   {*}         snippetPreview  The 'object' to check against.
 * @returns {boolean}                   Whether or not it's a valid SnippetPreview object.
 */
function isValidSnippetPreview( snippetPreview ) {
	return !isUndefined( snippetPreview ) && SnippetPreview.prototype.isPrototypeOf( snippetPreview );
}

/**
 * Check arguments passed to the App to check if all necessary arguments are set.
 *
 * @private
 * @param {Object}      args            The arguments object passed to the App.
 * @returns {void}
 */
function verifyArguments( args ) {

	if ( !isObject( args.callbacks.getData ) ) {
		throw new MissingArgument( "The app requires an object with a getdata callback." );
	}

	if ( !isObject( args.targets ) ) {
		throw new MissingArgument( "`targets` is a required App argument, `targets` is not an object." );
	}

	// The args.targets.snippet argument is only required if not SnippetPreview object has been passed.
	if ( !isValidSnippetPreview( args.snippetPreview ) && !isString( args.targets.snippet ) ) {
		throw new MissingArgument( "A snippet preview is required. When no SnippetPreview object isn't passed to " +
			"the App, the `targets.snippet` is a required App argument. `targets.snippet` is not a string." );
	}
}

/**
 * This should return an object with the given properties
 *
 * @callback YoastSEO.App~getData
 * @returns {Object} data
 * @returns {String} data.keyword The keyword that should be used
 * @returns {String} data.meta
 * @returns {String} data.text The text to analyze
 * @returns {String} data.metaTitle The text in the HTML title tag
 * @returns {String} data.title The title to analyze
 * @returns {String} data.url The URL for the given page
 * @returns {String} data.excerpt Excerpt for the pages
 */

/**
 * @callback YoastSEO.App~getAnalyzerInput
 *
 * @returns {Array} An array containing the analyzer queue
 */

/**
 * @callback YoastSEO.App~bindElementEvents
 *
 * @param {YoastSEO.App} app A reference to the YoastSEO.App from where this is called.
 */

/**
 * @callback YoastSEO.App~updateSnippetValues
 *
 * @param {Object} ev The event emitted from the DOM
 */

/**
 * @callback YoastSEO.App~saveScores
 *
 * @param {int} score The overall keyword score as determined by the assessor.
 * @param {AssessorPresenter} assessorPresenter The assessor presenter that will be used to render the keyword score.
 */

/**
 * @callback YoastSEO.App~saveContentScore
 *
 * @param {int} score The overall content score as determined by the assessor.
 * @param {AssessorPresenter} assessorPresenter The assessor presenter that will be used to render the content score.
 */

/**
 * Loader for the analyzer, loads the eventbinder and the elementdefiner
 *
 * @param {Object} args The arguments oassed to the loader.
 * @param {Object} args.translations Jed compatible translations.
 * @param {Object} args.targets Targets to retrieve or set on.
 * @param {String} args.targets.snippet ID for the snippet preview element.
 * @param {String} args.targets.output ID for the element to put the output of the analyzer in.
 * @param {int} args.typeDelay Number of milliseconds to wait between typing to refresh the analyzer output.
 * @param {boolean} args.dynamicDelay   Whether to enable dynamic delay, will ignore type delay if the analyzer takes a long time.
 *                                      Applicable on slow devices.
 * @param {int} args.maxTypeDelay The maximum amount of type delay even if dynamic delay is on.
 * @param {int} args.typeDelayStep The amount with which to increase the typeDelay on each step when dynamic delay is enabled.
 * @param {Object} args.callbacks The callbacks that the app requires.
 * @param {Object} args.assessor The Assessor to use instead of the default assessor.
 * @param {YoastSEO.App~getData} args.callbacks.getData Called to retrieve input data
 * @param {YoastSEO.App~getAnalyzerInput} args.callbacks.getAnalyzerInput Called to retrieve input for the analyzer.
 * @param {YoastSEO.App~bindElementEvents} args.callbacks.bindElementEvents Called to bind events to the DOM elements.
 * @param {YoastSEO.App~updateSnippetValues} args.callbacks.updateSnippetValues Called when the snippet values need to be updated.
 * @param {YoastSEO.App~saveScores} args.callbacks.saveScores Called when the score has been determined by the analyzer.
 * @param {YoastSEO.App~saveContentScore} args.callback.saveContentScore Called when the content score has been
 *                                                                       determined by the assessor.
 * @param {Function} args.callbacks.saveSnippetData Function called when the snippet data is changed.
 * @param {Function} args.marker The marker to use to apply the list of marks retrieved from an assessment.
 *
 * @param {SnippetPreview} args.snippetPreview The SnippetPreview object to be used.
 *
 * @constructor
 */
var App = function( args ) {

	if ( !isObject( args ) ) {
		args = {};
	}

	defaultsDeep( args, defaults );

	verifyArguments( args );

	this.config = args;

	this.refresh = debounce( this.refresh.bind( this ), inputDebounceDelay );
	this._pureRefresh = throttle( this._pureRefresh.bind( this ), this.config.typeDelay );

	this.callbacks = this.config.callbacks;
	this.i18n = this.constructI18n( this.config.translations );

	this.initializeAssessors( args );

	this.pluggable = new Pluggable( this );

	this.getData();

	this.defaultOutputElement = this.getDefaultOutputElement( args );

	if ( this.defaultOutputElement !== "" ) {
		this.showLoadingDialog();
	}

	if ( isValidSnippetPreview( args.snippetPreview ) ) {
		this.snippetPreview = args.snippetPreview;

		/* Hack to make sure the snippet preview always has a reference to this App. This way we solve the circular
		dependency issue. In the future this should be solved by the snippet preview not having a reference to the
		app.*/
		if ( this.snippetPreview.refObj !== this ) {
			this.snippetPreview.refObj = this;
			this.snippetPreview.i18n = this.i18n;
		}
	} else {
		this.snippetPreview = createDefaultSnippetPreview.call( this );
	}
	this.initSnippetPreview();
	this.initAssessorPresenters();

	this.refresh();
};

/**
 * Returns the default output element based on which analyses are active.
 *
 * @param {Object} args The arguments passed to the App.
 * @returns {string} The ID of the target that is active.
 */
App.prototype.getDefaultOutputElement = function( args ) {
	if ( args.keywordAnalysisActive ) {
		return args.targets.output;
	}

	if ( args.contentAnalysisActive ) {
		return args.targets.contentOutput;
	}

	return "";
};

/**
 * Initializes assessors based on if the respective analysis is active.
 *
 * @param {Object} args The arguments passed to the App.
 */
App.prototype.initializeAssessors = function( args ) {
	if ( args.keywordAnalysisActive ) {
		this.initializeSEOAssessor( args );
	}

	if ( args.contentAnalysisActive ) {
		this.initializeContentAssessor( args );
	}
};

/**
 * Initializes the SEO assessor.
 *
 * @param {Object} args The arguments passed to the App.
 */
App.prototype.initializeSEOAssessor = function( args ) {
	// Set the assessor
	if ( isUndefined( args.seoAssessor ) ) {
		this.seoAssessor = new SEOAssessor( this.i18n, { marker: this.config.marker } );
	} else {
		this.seoAssessor = args.seoAssessor;
	}
};

/**
 * Initializes the content assessor.
 *
 * @param {Object} args The arguments passed to the App.
 */
App.prototype.initializeContentAssessor = function( args ) {
	// Set the content assessor
	if ( isUndefined( args.contentAssessor ) ) {
		this.contentAssessor = new ContentAssessor( this.i18n, { marker: this.config.marker } );
	} else {
		this.contentAssessor = args.contentAssessor;
	}
};

/**
 * Extend the config with defaults.
 *
 * @param   {Object}    args    The arguments to be extended.
 * @returns {Object}    args    The extended arguments.
 */
App.prototype.extendConfig = function( args ) {
	args.sampleText = this.extendSampleText( args.sampleText );
	args.locale = args.locale || "en_US";

	return args;
};

/**
 * Extend sample text config with defaults.
 *
 * @param   {Object}    sampleText  The sample text to be extended.
 * @returns {Object}    sampleText  The extended sample text.
 */
App.prototype.extendSampleText = function( sampleText ) {
	var defaultSampleText = defaults.sampleText;

	if ( isUndefined( sampleText ) ) {
		return defaultSampleText;
	}

	for ( var key in sampleText ) {
		if ( isUndefined( sampleText[ key ] ) ) {
			sampleText[ key ] = defaultSampleText[ key ];
		}
	}

	return sampleText;
};

/**
 * Initializes i18n object based on passed configuration
 *
 * @param {Object}  translations    The translations to be used in the current instance.
 * @returns {void}
 */
App.prototype.constructI18n = function( translations ) {
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
 * Retrieves data from the callbacks.getData and applies modification to store these in this.rawData.
 * @returns {void}
 */
App.prototype.getData = function() {
	this.rawData = this.callbacks.getData();

	if ( !isUndefined( this.snippetPreview ) ) {

		// Gets the data FOR the analyzer
		var data = this.snippetPreview.getAnalyzerData();

		this.rawData.metaTitle = data.title;
		this.rawData.url = data.url;
		this.rawData.meta = data.metaDesc;
	}

	if ( this.pluggable.loaded ) {
		this.rawData.metaTitle = this.pluggable._applyModifications( "data_page_title", this.rawData.metaTitle );
		this.rawData.meta = this.pluggable._applyModifications( "data_meta_desc", this.rawData.meta );
	}

	this.rawData.locale = this.config.locale;
};

/**
 * Refreshes the analyzer and output of the analyzer, is debounced for a better experience.
 */
App.prototype.refresh = function() {
	this._pureRefresh();
};

/**
 * Refreshes the analyzer and output of the analyzer, is throttled to prevent performance issues.
 *
 * @private
 */
App.prototype._pureRefresh = function() {
	this.getData();
	this.runAnalyzer();
};

/**
 * Creates the elements for the snippetPreview
 *
 * @deprecated Don't create a snippet preview using this method, create it directly using the prototype and pass it as
 * an argument instead.
 * @returns {void}
 */
App.prototype.createSnippetPreview = function() {
	this.snippetPreview = createDefaultSnippetPreview.call( this );
	this.initSnippetPreview();
};

/**
 * Initializes the snippet preview for this App.
 * @returns {void}
 */
App.prototype.initSnippetPreview = function() {
	this.snippetPreview.renderTemplate();
	this.snippetPreview.callRegisteredEventBinder();
	this.snippetPreview.bindEvents();
	this.snippetPreview.init();
};

/**
 * Initializes the assessorpresenters for content and SEO.
 */
App.prototype.initAssessorPresenters = function() {

	// Pass the assessor result through to the formatter
	if ( !isUndefined( this.config.targets.output ) ) {
		this.seoAssessorPresenter = new AssessorPresenter( {
			targets: {
				output: this.config.targets.output
			},
			assessor: this.seoAssessor,
			i18n: this.i18n
		} );
	}

	if ( !isUndefined( this.config.targets.contentOutput ) ) {
		// Pass the assessor result through to the formatter
		this.contentAssessorPresenter = new AssessorPresenter( {
			targets: {
				output: this.config.targets.contentOutput
			},
			assessor: this.contentAssessor,
			i18n: this.i18n
		} );
	}
};

/**
 * Binds the refresh function to the input of the targetElement on the page.
 * @returns {void}
 */
App.prototype.bindInputEvent = function() {
	for ( var i = 0; i < this.config.elementTarget.length; i++ ) {
		var elem = document.getElementById( this.config.elementTarget[ i ] );
		elem.addEventListener( "input", this.refresh.bind( this ) );
	}
};

/**
 * Runs the rerender function of the snippetPreview if that object is defined.
 * @returns {void}
 */
App.prototype.reloadSnippetText = function() {
	if ( isUndefined( this.snippetPreview ) ) {
		this.snippetPreview.reRender();
	}
};

/**
 * Sets the startTime timestamp.
 * @returns {void}
 */
App.prototype.startTime = function() {
	this.startTimestamp = new Date().getTime();
};

/**
 * Sets the endTime timestamp and compares with startTime to determine typeDelayincrease.
 * @returns {void}
 */
App.prototype.endTime = function() {
	this.endTimestamp = new Date().getTime();
	if ( this.endTimestamp - this.startTimestamp > this.config.typeDelay ) {
		if ( this.config.typeDelay < ( this.config.maxTypeDelay - this.config.typeDelayStep ) ) {
			this.config.typeDelay += this.config.typeDelayStep;
		}
	}
};

/**
 * Inits a new pageAnalyzer with the inputs from the getInput function and calls the scoreFormatter
 * to format outputs.
 * @returns {void}
 */
App.prototype.runAnalyzer = function() {
	if ( this.pluggable.loaded === false ) {
		return;
	}

	if ( this.config.dynamicDelay ) {
		this.startTime();
	}

	this.analyzerData = this.modifyData( this.rawData );

	this.snippetPreview.refresh();

	// Create a paper object for the Researcher
	this.paper = new Paper( this.analyzerData.text, {
		keyword:  this.analyzerData.keyword,
		description: this.analyzerData.meta,
		url: this.analyzerData.url,
		title: this.analyzerData.metaTitle,
		titleWidth: this.snippetPreview.getTitleWidth(),
		locale: this.config.locale,
		permalink: this.analyzerData.permalink
	} );

	// The new researcher
	if ( isUndefined( this.researcher ) ) {
		this.researcher = new Researcher( this.paper );
	} else {
		this.researcher.setPaper( this.paper );
	}

	if ( this.config.keywordAnalysisActive && !isUndefined( this.seoAssessorPresenter ) ) {
		this.seoAssessor.assess( this.paper );

		this.seoAssessorPresenter.setKeyword( this.paper.getKeyword() );
		this.seoAssessorPresenter.render();

		this.callbacks.saveScores( this.seoAssessor.calculateOverallScore(), this.seoAssessorPresenter );
	}

	if ( this.config.contentAnalysisActive && !isUndefined( this.contentAssessorPresenter ) ) {
		this.contentAssessor.assess( this.paper );

		this.contentAssessorPresenter.renderIndividualRatings();
		this.callbacks.saveContentScore( this.contentAssessor.calculateOverallScore(), this.contentAssessorPresenter );
	}

	if ( this.config.dynamicDelay ) {
		this.endTime();
	}

	this.snippetPreview.reRender();
};

/**
 * Modifies the data with plugins before it is sent to the analyzer.
 * @param   {Object}  data      The data to be modified.
 * @returns {Object}            The data with the applied modifications.
 */
App.prototype.modifyData = function( data ) {

	// Copy rawdata to lose object reference.
	data = JSON.parse( JSON.stringify( data ) );

	data.text      = this.pluggable._applyModifications( "content", data.text );
	data.metaTitle = this.pluggable._applyModifications( "title", data.metaTitle );

	return data;
};

/**
 * Function to fire the analyzer when all plugins are loaded, removes the loading dialog.
 * @returns {void}
 */
App.prototype.pluginsLoaded = function() {
	this.getData();
	this.removeLoadingDialog();
	this.runAnalyzer();
};

/**
 * Shows the loading dialog which shows the loading of the plugins.
 *
 * @returns {void}
 */
App.prototype.showLoadingDialog = function() {
	var outputElement = document.getElementById( this.defaultOutputElement );

	if ( this.defaultOutputElement !== "" && !isEmpty( outputElement ) ) {
		var dialogDiv = document.createElement( "div" );
		dialogDiv.className = "YoastSEO_msg";
		dialogDiv.id = "YoastSEO-plugin-loading";
		document.getElementById( this.defaultOutputElement ).appendChild( dialogDiv );
	}
};

/**
 * Updates the loading plugins. Uses the plugins as arguments to show which plugins are loading
 * @param   {Object}  plugins   The plugins to be parsed into the dialog.
 * @returns {void}
 */
App.prototype.updateLoadingDialog = function( plugins ) {
	var outputElement = document.getElementById( this.defaultOutputElement );

	if ( this.defaultOutputElement === "" || isEmpty( outputElement ) ) {
		return;
	}

	var dialog = document.getElementById( "YoastSEO-plugin-loading" );
	dialog.textContent = "";

	forEach( plugins, function( plugin, pluginName ) {
		dialog.innerHTML += "<span class=left>" + pluginName + "</span><span class=right " +
							plugin.status + ">" + plugin.status + "</span><br />";
	} );

	dialog.innerHTML += "<span class=bufferbar></span>";
};

/**
 * Removes the pluging load dialog.
 * @returns {void}
 */
App.prototype.removeLoadingDialog = function() {
	var outputElement = document.getElementById( this.defaultOutputElement );
	var loadingDialog = document.getElementById( "YoastSEO-plugin-loading" );

	if ( ( this.defaultOutputElement !== "" && !isEmpty( outputElement ) ) && !isEmpty( loadingDialog ) ) {
		document.getElementById( this.defaultOutputElement ).removeChild( document.getElementById( "YoastSEO-plugin-loading" ) );
	}
};

// ***** PLUGGABLE PUBLIC DSL ***** //

/**
 * Delegates to `YoastSEO.app.pluggable.registerPlugin`
 *
 * @param {string}  pluginName      The name of the plugin to be registered.
 * @param {object}  options         The options object.
 * @param {string}  options.status  The status of the plugin being registered. Can either be "loading" or "ready".
 * @returns {boolean}               Whether or not it was successfully registered.
 */
App.prototype.registerPlugin = function( pluginName, options ) {
	return this.pluggable._registerPlugin( pluginName, options );
};

/**
 * Delegates to `YoastSEO.app.pluggable.ready`
 *
 * @param {string}  pluginName  The name of the plugin to check.
 * @returns {boolean}           Whether or not the plugin is ready.
 */
App.prototype.pluginReady = function( pluginName ) {
	return this.pluggable._ready( pluginName );
};

/**
 * Delegates to `YoastSEO.app.pluggable.reloaded`
 *
 * @param {string} pluginName   The name of the plugin to reload
 * @returns {boolean}           Whether or not the plugin was reloaded.
 */
App.prototype.pluginReloaded = function( pluginName ) {
	return this.pluggable._reloaded( pluginName );
};

/**
 * Delegates to `YoastSEO.app.pluggable.registerModification`
 *
 * @param {string}      modification 		The name of the filter
 * @param {function}    callable 		 	The callable function
 * @param {string}      pluginName 		    The plugin that is registering the modification.
 * @param {number}      priority 		 	(optional) Used to specify the order in which the callables associated with a particular filter are
                                            called.
 * 									        Lower numbers correspond with earlier execution.
 * @returns 			{boolean}           Whether or not the modification was successfully registered.
 */
App.prototype.registerModification = function( modification, callable, pluginName, priority ) {
	return this.pluggable._registerModification( modification, callable, pluginName, priority );
};

/**
 * Registers a custom test for use in the analyzer, this will result in a new line in the analyzer results. The function
 * has to return a result based on the contents of the page/posts.
 *
 * The scoring object is a special object with definitions about how to translate a result from your analysis function
 * to a SEO score.
 *
 * Negative scores result in a red circle
 * Scores 1, 2, 3, 4 and 5 result in a orange circle
 * Scores 6 and 7 result in a yellow circle
 * Scores 8, 9 and 10 result in a red circle
 *
 * @deprecated since version 1.2
 */
App.prototype.registerTest = function() {
	console.error( "This function is deprecated, please use registerAssessment" );
};

/**
 * Registers a custom assessment for use in the analyzer, this will result in a new line in the analyzer results.
 * The function needs to use the assessmentresult to return an result  based on the contents of the page/posts.
 *
 * Score 0 results in a grey circle if it is not explicitly set by using setscore
 * Scores 0, 1, 2, 3 and 4 result in a red circle
 * Scores 6 and 7 result in a yellow circle
 * Scores 8, 9 and 10 result in a green circle
 *
 * @param {string} name Name of the test.
 * @param {function} assessment The assessment to run
 * @param {string}   pluginName The plugin that is registering the test.
 * @returns {boolean} Whether or not the test was successfully registered.
 */
App.prototype.registerAssessment = function( name, assessment, pluginName ) {
	if ( !isUndefined( this.seoAssessor ) ) {
		return this.pluggable._registerAssessment( this.seoAssessor, name, assessment, pluginName );
	}
};

/**
 * Disables markers visually in the UI.
 */
App.prototype.disableMarkers = function() {
	if ( !isUndefined( this.seoAssessorPresenter ) ) {
		this.seoAssessorPresenter.disableMarker();
	}

	if ( !isUndefined( this.contentAssessorPresenter ) ) {
		this.contentAssessorPresenter.disableMarker();
	}
};

// Deprecated functions

/**
 * The analyzeTimer calls the checkInputs function with a delay, so the function won't be executed
 * at every keystroke checks the reference object, so this function can be called from anywhere,
 * without problems with different scopes.
 *
 * @deprecated: 1.3 - Use this.refresh() instead.
 *
 * @returns {void}
 */
App.prototype.analyzeTimer = function() {
	this.refresh();
};

module.exports = App;

},{"./config/config.js":282,"./contentAssessor.js":290,"./errors/missingArgument":292,"./pluggable.js":306,"./renderers/AssessorPresenter.js":307,"./researcher.js":308,"./seoAssessor.js":356,"./snippetPreview.js":357,"./values/Paper.js":398,"jed":22,"lodash/debounce":183,"lodash/defaultsDeep":185,"lodash/forEach":194,"lodash/isEmpty":207,"lodash/isObject":212,"lodash/isString":215,"lodash/isUndefined":218,"lodash/throttle":235}],254:[function(require,module,exports){
var filter = require( "lodash/filter" );
var isSentenceTooLong = require( "../helpers/isValueTooLong" );

/**
 * Checks for too long sentences.
 * @param {array} sentences The array containing sentence lengths.
 * @param {number} recommendedValue The recommended maximum length of sentence.
 * @returns {array} Array of too long sentences.
 */
module.exports = function( sentences, recommendedValue ) {
	var tooLongSentences = filter( sentences, function( sentence ) {
		return isSentenceTooLong( recommendedValue, sentence.sentenceLength );
	} );

	return tooLongSentences;
};

},{"../helpers/isValueTooLong":301,"lodash/filter":189}],255:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

/**
 * Calculates the assessment result based on the fleschReadingScore
 * @param {int} fleschReadingScore The score from the fleschReadingtest
 * @param {object} i18n The i18n-object used for parsing translations
 * @returns {object} object with score, resultText and note
 */
var calculateFleschReadingResult = function( fleschReadingScore, i18n ) {
	if ( fleschReadingScore > 90 ) {
		return {
			score: 9,
			resultText: i18n.dgettext( "js-text-analysis", "very easy" ),
			note: ""
		};
	}

	if ( inRange( fleschReadingScore, 80, 90 ) ) {
		return {
			score: 9,
			resultText:  i18n.dgettext( "js-text-analysis", "easy" ),
			note: ""
		};
	}

	if ( inRange( fleschReadingScore, 70, 80 ) ) {
		return {
			score: 9,
			resultText: i18n.dgettext( "js-text-analysis", "fairly easy" ),
			note: ""
		};
	}

	if ( inRange( fleschReadingScore, 60, 70 ) ) {
		return {
			score: 9,
			resultText: i18n.dgettext( "js-text-analysis", "ok" ),
			note: ""
		};
	}

	if ( inRange( fleschReadingScore, 50, 60 ) ) {
		return {
			score: 6,
			resultText: i18n.dgettext( "js-text-analysis", "fairly difficult" ),
			note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences to improve readability." )
		};
	}

	if ( inRange( fleschReadingScore, 30, 50 ) ) {
		return {
			score: 3,
			resultText: i18n.dgettext( "js-text-analysis", "difficult" ),
			note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." )
		};
	}

	if ( fleschReadingScore < 30 ) {
		return {
			score: 3,
			resultText: i18n.dgettext( "js-text-analysis", "very difficult" ),
			note: i18n.dgettext( "js-text-analysis", "Try to make shorter sentences, using less difficult words to improve readability." )
		};
	}
};

/**
 * The assessment that runs the FleschReading on the paper.
 *
 * @param {object} paper The paper to run this assessment on
 * @param {object} researcher The researcher used for the assessment
 * @param {object} i18n The i18n-object used for parsing translations
 * @returns {object} an assessmentresult with the score and formatted text.
 */
var fleschReadingEaseAssessment = function( paper, researcher, i18n ) {
	var fleschReadingScore = researcher.getResearch( "calculateFleschReading" );

	/* Translators: %1$s expands to the numeric flesch reading ease score, %2$s to a link to a Yoast.com article about Flesch ease reading score,
	 %3$s to the easyness of reading, %4$s expands to a note about the flesch reading score. */
	var text = i18n.dgettext( "js-text-analysis", "The copy scores %1$s in the %2$s test, which is considered %3$s to read. %4$s" );
	var url = "<a href='https://yoast.com/flesch-reading-ease-score/' target='new'>Flesch Reading Ease</a>";

	// scores must be between 0 and 100;
	if ( fleschReadingScore < 0 ) {
		fleschReadingScore = 0;
	}
	if ( fleschReadingScore > 100 ) {
		fleschReadingScore = 100;
	}

	var fleschReadingResult = calculateFleschReadingResult( fleschReadingScore, i18n );

	text = i18n.sprintf( text, fleschReadingScore, url, fleschReadingResult.resultText, fleschReadingResult.note );

	var assessmentResult =  new AssessmentResult();
	assessmentResult.setScore( fleschReadingResult.score );
	assessmentResult.setText( text );

	return assessmentResult;
};

module.exports = {
	identifier: "fleschReadingEase",
	getResult: fleschReadingEaseAssessment,
	isApplicable: function( paper ) {
		return ( paper.getLocale().indexOf( "en_" ) > -1 && paper.hasText() );
	}
};

},{"../values/AssessmentResult.js":396,"lodash/inRange":199}],256:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns a score and text based on the firstParagraph object.
 *
 * @param {object} firstParagraphMatches The object with all firstParagraphMatches.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateFirstParagraphResult = function( firstParagraphMatches, i18n ) {
	if ( firstParagraphMatches > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in the first paragraph of the copy." )
		};
	}

	return {
		score: 3,
		text: i18n.dgettext( "js-text-analysis", "The focus keyword doesn\'t appear in the first paragraph of the copy. " +
			"Make sure the topic is clear immediately." )
	};
};

/**
 * Runs the findKeywordInFirstParagraph module, based on this returns an assessment result with score.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var introductionHasKeywordAssessment = function( paper, researcher, i18n ) {
	var firstParagraphMatches = researcher.getResearch( "firstParagraph" );
	var firstParagraphResult = calculateFirstParagraphResult( firstParagraphMatches, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( firstParagraphResult.score );
	assessmentResult.setText( firstParagraphResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "introductionKeyword",
	getResult: introductionHasKeywordAssessment,
	isApplicable: function( paper ) {
		return paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":396}],257:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Assesses the keyphrase presence and length
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {Researcher} researcher The researcher used for calling research.
 * @param {Jed} i18n The object used for translations
 * @returns {AssessmentResult} The result of this assessment
*/
function keyphraseAssessment( paper, researcher, i18n ) {
	var keyphraseLength = researcher.getResearch( "keyphraseLength" );

	var assessmentResult = new AssessmentResult();

	if ( !paper.hasKeyword() ) {
		assessmentResult.setScore( -999 );
		assessmentResult.setText( i18n.dgettext( "js-text-analysis", "No focus keyword was set for this page. " +
			"If you do not set a focus keyword, no score can be calculated." ) );
	} else if ( keyphraseLength > 10 ) {
		assessmentResult.setScore( 0 );
		assessmentResult.setText( i18n.dgettext( "js-text-analysis", "The keyphrase is over 10 words, a keyphrase should be shorter." ) );
	}

	return assessmentResult;
}

module.exports = {
	identifier: "keyphraseLength",
	getResult: keyphraseAssessment
};

},{"../values/AssessmentResult.js":396}],258:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var matchWords = require( "../stringProcessing/matchTextWithWord.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var formatNumber = require( "../helpers/formatNumber.js" );
var inRange = require( "../helpers/inRange.js" );

var inRangeEndInclusive = inRange.inRangeEndInclusive;
var inRangeStartInclusive = inRange.inRangeStartInclusive;

/**
 * Returns the scores and text for keyword density
 *
 * @param {string} keywordDensity The keyword density
 * @param {object} i18n The i18n object used for translations
 * @param {number} keywordCount The number of times the keyword has been found in the text.
 * @returns {{score: number, text: *}} The assessment result
 */
var calculateKeywordDensityResult = function( keywordDensity, i18n, keywordCount ) {
	var score, text, max;

	var roundedKeywordDensity = formatNumber( keywordDensity );
	var keywordDensityPercentage = roundedKeywordDensity + "%";

	if ( roundedKeywordDensity > 3.5 ) {
		score = -50;

		/* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to the maximum keyword density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s," +
			" which is way over the advised %3$s maximum;" +
			" the focus keyword was found %2$d times." );

		max = "2.5%";

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, max );
	}

	if ( inRangeEndInclusive( roundedKeywordDensity, 2.5, 3.5 ) ) {
		score = -10;

		/* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count,
		%3$s expands to the maximum keyword density percentage. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s," +
			" which is over the advised %3$s maximum;" +
			" the focus keyword was found %2$d times." );

		max = "2.5%";

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount, max );
	}

	if ( inRangeEndInclusive( roundedKeywordDensity, 0.5, 2.5 ) ) {
		score = 9;

		/* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s, which is great;" +
			" the focus keyword was found %2$d times." );

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount );
	}

	if ( inRangeStartInclusive( roundedKeywordDensity, 0, 0.5 ) ) {
		score = 4;

		/* Translators: %1$s expands to the keyword density percentage, %2$d expands to the keyword count. */
		text = i18n.dgettext( "js-text-analysis", "The keyword density is %1$s, which is too low;" +
			" the focus keyword was found %2$d times." );

		text = i18n.sprintf( text, keywordDensityPercentage, keywordCount );
	}

	return {
		score: score,
		text: text
	};
};

/**
 * Runs the getkeywordDensity module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var keywordDensityAssessment = function( paper, researcher, i18n ) {

	var keywordDensity = researcher.getResearch( "getKeywordDensity" );
	var keywordCount = matchWords( paper.getText(), paper.getKeyword(), paper.getLocale() );

	var keywordDensityResult = calculateKeywordDensityResult( keywordDensity, i18n, keywordCount );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( keywordDensityResult.score );
	assessmentResult.setText( keywordDensityResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "keywordDensity",
	getResult: keywordDensityAssessment,
	isApplicable: function( paper ) {
		return paper.hasText() && paper.hasKeyword() && countWords( paper.getText() ) >= 100;
	}
};

},{"../helpers/formatNumber.js":295,"../helpers/inRange.js":300,"../stringProcessing/countWords.js":362,"../stringProcessing/matchTextWithWord.js":377,"../values/AssessmentResult.js":396}],259:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Calculate the score based on the amount of stop words in the keyword.
 * @param {number} stopWordCount The amount of stop words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateStopWordsCountResult = function( stopWordCount, i18n ) {

	if ( stopWordCount > 0 ) {
		return {
			score: 0,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$s opens a link to a Yoast article about stop words, %2$s closes the link */
				"The focus keyword contains a stop word. This may or may not be wise depending on the circumstances. " +
				"Read %1$sthis article%2$s for more info.",
				"The focus keyword contains %3$d stop words. This may or may not be wise depending on the circumstances. " +
				"Read %1$sthis article%2$s for more info.",
				stopWordCount
			)
		};
	}

	return {};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var keywordHasStopWordsAssessment = function( paper, researcher, i18n ) {
	var stopWords = researcher.getResearch( "stopWordsInKeyword" );
	var stopWordsResult = calculateStopWordsCountResult( stopWords.length, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( stopWordsResult.score );
	assessmentResult.setText( i18n.sprintf(
		stopWordsResult.text,
		"<a href='https://yoast.com/handling-stopwords/' target='new'>",
		"</a>",
		stopWords.length
	) );

	return assessmentResult;
};

module.exports = {
	identifier: "keywordStopWords",
	getResult: keywordHasStopWordsAssessment,
	isApplicable: function ( paper ) {
		return paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":396}],260:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns the score and text for the description keyword match.
 * @param {number} keywordMatches The number of keyword matches in the description.
 * @param {object} i18n The i18n object used for translations.
 * @returns {Object} An object with values for the assessment result.
 */
var calculateKeywordMatchesResult = function( keywordMatches, i18n ) {
	if ( keywordMatches > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The meta description contains the focus keyword." )
		};
	}
	if ( keywordMatches === 0 ) {
		return {
			score: 3,
			text: i18n.dgettext( "js-text-analysis", "A meta description has been specified, but it does not contain the focus keyword." )
		};
	}
	return {};
};

/**
 * Runs the metaDescription keyword module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var metaDescriptionHasKeywordAssessment = function( paper, researcher, i18n ) {
	var keywordMatches = researcher.getResearch( "metaDescriptionKeyword" );
	var descriptionLengthResult = calculateKeywordMatchesResult( keywordMatches, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( descriptionLengthResult.score );
	assessmentResult.setText( descriptionLengthResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "metaDescriptionKeyword",
	getResult: metaDescriptionHasKeywordAssessment,
	isApplicable: function ( paper ) {
		return paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":396}],261:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns the score and text for the descriptionLength
 * @param {number} descriptionLength The length of the metadescription.
 * @param {object} i18n The i18n object used for translations.
 * @returns {Object} An object with values for the assessment result.
 */
var calculateDescriptionLengthResult = function( descriptionLength, i18n ) {
	var recommendedValue = 120;
	var maximumValue = 156;
	if ( descriptionLength === 0 ) {
		return {
			score: 1,
			text: i18n.dgettext( "js-text-analysis", "No meta description has been specified, " +
				"search engines will display copy from the page instead." )
		};
	}
	if ( descriptionLength <= recommendedValue ) {
		return {
			score: 6,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "The meta description is under %1$d characters, " +
				"however up to %2$d characters are available." ), recommendedValue, maximumValue )
		};
	}
	if ( descriptionLength > maximumValue ) {
		return {
			score: 6,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "The specified meta description is over %1$d characters. " +
				"Reducing it will ensure the entire description is visible." ), maximumValue )
		};
	}
	if ( descriptionLength >= recommendedValue && descriptionLength <= maximumValue ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "In the specified meta description, consider: " +
				"How does it compare to the competition? Could it be made more appealing?" )
		};
	}
};

/**
 * Runs the metaDescriptionLength module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var metaDescriptionLengthAssessment = function( paper, researcher, i18n ) {
	var descriptionLength = researcher.getResearch( "metaDescriptionLength" );
	var descriptionLengthResult = calculateDescriptionLengthResult( descriptionLength, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( descriptionLengthResult.score );
	assessmentResult.setText( descriptionLengthResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "metaDescriptionLength",
	getResult: metaDescriptionLengthAssessment
};

},{"../values/AssessmentResult.js":396}],262:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "../helpers/inRange" ).inRangeEndInclusive;

/**
 * Returns the score and text for the pageTitleLength
 * @param {number} pageTitleLength The length of the pageTitle.
 * @param {object} i18n The i18n object used for translations.
 * @returns {object} The result object.
 */
var calculatePageTitleLengthResult = function( pageTitleLength, i18n ) {
	var minLength = 400;
	var maxLength = 600;

	if ( inRange( pageTitleLength, 1, 400 ) ) {
		return {
			score: 6,
			text: i18n.dgettext(
				"js-text-analysis",
				"The page title is too short. Use the space to add keyword variations or create compelling call-to-action copy."
			)
		};
	}

	if ( inRange( pageTitleLength, minLength, maxLength ) ) {
		return {
			score: 9,
			text: i18n.dgettext(
				"js-text-analysis",
				"The page title has a nice length."
			)
		};
	}

	if ( pageTitleLength > maxLength ) {
		return {
			score: 6,
			text: i18n.dgettext(
				"js-text-analysis",
				"The page title is wider than the viewable limit."
			)
		};
	}

	return {
		score: 1,
		text: i18n.dgettext( "js-text-analysis", "Please create a page title." )
	};
};

/**
 * Runs the pageTitleLength module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var titleWidthAssessment = function( paper, researcher, i18n ) {
	var pageTitleWidth = researcher.getResearch( "pageTitleWidth" );
	var pageTitleWidthResult = calculatePageTitleLengthResult( pageTitleWidth, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( pageTitleWidthResult.score );
	assessmentResult.setText( pageTitleWidthResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "titleWidth",
	getResult: titleWidthAssessment
};


},{"../helpers/inRange":300,"../values/AssessmentResult.js":396}],263:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isParagraphTooLong = require( "../helpers/isValueTooLong" );
var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeEndInclusive;

var filter = require( "lodash/filter" );
var map = require( "lodash/map" );

// 150 is the recommendedValue for the maximum paragraph length.
var recommendedValue = 150;

/**
 * Returns an array containing only the paragraphs longer than the recommended length.
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @returns {number} The number of too long paragraphs.
 */
var getTooLongParagraphs = function( paragraphsLength  ) {
	return filter( paragraphsLength, function( paragraph ) {
		return isParagraphTooLong( recommendedValue, paragraph.wordCount );
	} );
};

/**
 * Returns the scores and text for the ParagraphTooLongAssessment
 * @param {array} paragraphsLength The array containing the lengths of individual paragraphs.
 * @param {number} tooLongParagraphs The number of too long paragraphs.
 * @param {object} i18n The i18n object used for translations.
 * @returns {{score: number, text: string }} the assessmentResult.
 */
var calculateParagraphLengthResult = function( paragraphsLength, tooLongParagraphs, i18n ) {
	var score;

	if ( paragraphsLength.length === 0 ) {
		return {};
	}

	var longestParagraphLength = paragraphsLength[ 0 ].wordCount;

	if ( longestParagraphLength <= 150 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( longestParagraphLength, 150, 200 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( longestParagraphLength > 200 ) {
		// Red indicator.
		score = 3;
	}

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: false,
			text: i18n.dgettext( "js-text-analysis", "None of the paragraphs are too long, which is great." )
		};
	}
	return {
		score: score,
		hasMarks: true,

		// Translators: %1$d expands to the number of paragraphs, %2$d expands to the recommended value
		text: i18n.sprintf( i18n.dngettext( "js-text-analysis", "%1$d of the paragraphs contains more than the recommended maximum " +
			"of %2$d words. Are you sure all information is about the same topic, and therefore belongs in one single paragraph?",
			"%1$d of the paragraphs contain more than the recommended maximum of %2$d words. Are you sure all information within each of" +
			" these paragraphs is about the same topic, and therefore belongs in a single paragraph?", tooLongParagraphs.length ),
			tooLongParagraphs.length, recommendedValue )
	};
};

/**
 * Sort the paragraphs based on word count.
 *
 * @param {Array} paragraphs The array with paragraphs.
 * @returns {Array} The array sorted on word counts.
 */
var sortParagraphs = function( paragraphs ) {
	return paragraphs.sort(
		function( a, b ) {
			return b.wordCount - a.wordCount;
		}
	);
};

/**
 * Creates a marker for the paragraphs.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {Array} An array with marked paragraphs.
 */
var paragraphLengthMarker = function( paper, researcher ) {
	var paragraphsLength = researcher.getResearch( "getParagraphLength" );
	var tooLongParagraphs = getTooLongParagraphs( paragraphsLength );
	return map( tooLongParagraphs, function( paragraph ) {
		var marked = marker( paragraph.paragraph );
		return new Mark( {
			original: paragraph.paragraph,
			marked: marked
		} );
	} );
};

/**
 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var paragraphLengthAssessment = function( paper, researcher, i18n ) {
	var paragraphsLength = researcher.getResearch( "getParagraphLength" );

	paragraphsLength = sortParagraphs( paragraphsLength );

	var tooLongParagraphs = getTooLongParagraphs( paragraphsLength );
	var paragraphLengthResult = calculateParagraphLengthResult( paragraphsLength, tooLongParagraphs, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( paragraphLengthResult.score );
	assessmentResult.setText( paragraphLengthResult.text );
	assessmentResult.setHasMarks( paragraphLengthResult.hasMarks );

	return assessmentResult;
};

module.exports = {
	identifier: "textParagraphTooLong",
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: paragraphLengthMarker
};

},{"../helpers/inRange.js":300,"../helpers/isValueTooLong":301,"../markers/addMark.js":303,"../values/AssessmentResult.js":396,"../values/Mark.js":397,"lodash/filter":189,"lodash/map":221}],264:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var formatNumber = require( "../helpers/formatNumber.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeEndInclusive;
var stripTags = require( "../stringProcessing/stripHTMLTags" ).stripIncompleteTags;

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

var map = require( "lodash/map" );

/**
 * Calculates the result based on the number of sentences and passives.
 * @param {object} passiveVoice The object containing the number of sentences and passives
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text}} resultobject with score and text.
 */
var calculatePassiveVoiceResult = function( passiveVoice, i18n ) {
	var score;

	var percentage = ( passiveVoice.passives.length / passiveVoice.total ) * 100;
	percentage = formatNumber( percentage );
	var recommendedValue = 10;
	var passiveVoiceURL = "<a href='https://yoa.st/passive-voice' target='_blank'>";
	var hasMarks = ( percentage > 0 );

	if ( percentage <= 10 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( percentage, 10, 15 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( percentage > 15 ) {
		// Red indicator.
		score = 3;
	}

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,
			text: i18n.sprintf(
					i18n.dgettext(
						"js-text-analysis",

						// Translators: %1$s expands to the number of sentences in passive voice, %2$s expands to a link on yoast.com,
						// %3$s expands to the anchor end tag, %4$s expands to the recommended value.
						"%1$s of the sentences contain %2$spassive voice%3$s, " +
						"which is less than or equal to the recommended maximum of %4$s." ),
					percentage + "%",
					passiveVoiceURL,
					"</a>",
					recommendedValue + "%"
			)
		};
	}
	return {
		score: score,
		hasMarks: hasMarks,
		text: i18n.sprintf(
			i18n.dgettext(
				"js-text-analysis",

				// Translators: %1$s expands to the number of sentences in passive voice, %2$s expands to a link on yoast.com,
				// %3$s expands to the anchor end tag, %4$s expands to the recommended value.
				"%1$s of the sentences contain %2$spassive voice%3$s, " +
				"which is more than the recommended maximum of %4$s. Try to use their active counterparts."
			),
			percentage + "%",
			passiveVoiceURL,
			"</a>",
			recommendedValue + "%"
		)
	};
};

/**
 * Marks all sentences that have the passive voice.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {object} All marked sentences.
 */
var passiveVoiceMarker = function( paper, researcher ) {
	var passiveVoice = researcher.getResearch( "passiveVoice" );
	return map( passiveVoice.passives, function( sentence ) {
		sentence = stripTags( sentence );
		var marked = marker( sentence );
		return new Mark( {
			original: sentence,
			marked: marked
		} );
	} );
};

/**
 * Runs the getParagraphLength module, based on this returns an assessment result with score and text.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var paragraphLengthAssessment = function( paper, researcher, i18n ) {
	var passiveVoice = researcher.getResearch( "passiveVoice" );

	var passiveVoiceResult = calculatePassiveVoiceResult( passiveVoice, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( passiveVoiceResult.score );
	assessmentResult.setText( passiveVoiceResult.text );
	assessmentResult.setHasMarks( passiveVoiceResult.hasMarks );

	return assessmentResult;
};

module.exports = {
	identifier: "passiveVoice",
	getResult: paragraphLengthAssessment,
	isApplicable: function( paper ) {
		return ( paper.getLocale().indexOf( "en_" ) > -1 && paper.hasText() );
	},
	getMarks: passiveVoiceMarker
};

},{"../helpers/formatNumber.js":295,"../helpers/inRange.js":300,"../markers/addMark.js":303,"../stringProcessing/stripHTMLTags":387,"../values/AssessmentResult.js":396,"../values/Mark.js":397,"lodash/map":221}],265:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var getLanguage = require( "../helpers/getLanguage.js" );
var stripTags = require( "../stringProcessing/stripHTMLTags" ).stripIncompleteTags;

var partition = require( "lodash/partition" );
var sortBy = require( "lodash/sortBy" );
var map = require( "lodash/map" );
var filter = require( "lodash/filter" );
var flatten = require( "lodash/flatten" );

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

var maximumConsecutiveDuplicates = 2;

/**
 * Counts and groups the number too often used sentence beginnings and determines the lowest count within that group.
 * @param {array} sentenceBeginnings The array containing the objects containing the beginning words and counts.
 * @returns {object} The object containing the total number of too often used beginnings and the lowest count within those.
 */
var groupSentenceBeginnings = function( sentenceBeginnings ) {
	var tooOften = partition( sentenceBeginnings, function ( word ) {
		return word.count > maximumConsecutiveDuplicates;
	} );
	if ( tooOften[ 0 ].length === 0 ) {
		return { total: 0 };
	}
	var sortedCounts = sortBy( tooOften[ 0 ], function( word ) {
		return word.count;
	} );
	return { total: tooOften[ 0 ].length, lowestCount: sortedCounts[ 0 ].count };
};

/**
 * Calculates the score based on sentence beginnings.
 * @param {Array} groupedSentenceBeginnings The array with grouped sentence beginnings.
 * @param {object} i18n The object used for translations.
 * @returns {{score: number, text: string, hasMarks: boolean}} resultobject with score and text.
 */
var calculateSentenceBeginningsResult = function( groupedSentenceBeginnings, i18n ) {
	if ( groupedSentenceBeginnings.total > 0 ) {
		return {
			score: 3,
			hasMarks: true,
			text: i18n.sprintf(
				i18n.dngettext(
					"js-text-analysis",

					// Translators: %1$d expands to the number of instances where 3 or more consecutive sentences start with the same word.
					// %2$d expands to the number of consecutive sentences starting with the same word.
					"The text contains %2$d consecutive sentences starting with the same word. Try to mix things up!",
					"The text contains %1$d instances where %2$d or more consecutive sentences start with the same word. " +
					"Try to mix things up!",
					groupedSentenceBeginnings.total
				),
				groupedSentenceBeginnings.total, groupedSentenceBeginnings.lowestCount )
		};
	}
	return {};
};

/**
 * Marks all consecutive sentences with the same beginnings.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {object} All marked sentences.
 */
var sentenceBeginningMarker = function( paper, researcher ) {
	var sentenceBeginnings = researcher.getResearch( "getSentenceBeginnings" );
	sentenceBeginnings = filter( sentenceBeginnings, function( sentenceBeginning ) {
		return sentenceBeginning.count > maximumConsecutiveDuplicates;
	} );
	var sentences = map( sentenceBeginnings, function( begin ) {
		return begin.sentences;
	} );
	return map( flatten( sentences ), function( sentence ) {
		sentence = stripTags( sentence );
		var marked = marker( sentence );
		return new Mark( {
			original: sentence,
			marked: marked
		} );
	} );
};

/**
 * Scores the repetition of sentence beginnings in consecutive sentences.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessment result
 */
var sentenceBeginningsAssessment = function( paper, researcher, i18n ) {
	var sentenceBeginnings = researcher.getResearch( "getSentenceBeginnings" );
	var groupedSentenceBeginnings = groupSentenceBeginnings( sentenceBeginnings );
	var sentenceBeginningsResult = calculateSentenceBeginningsResult( groupedSentenceBeginnings, i18n );
	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( sentenceBeginningsResult.score );
	assessmentResult.setText( sentenceBeginningsResult.text );
	assessmentResult.setHasMarks( sentenceBeginningsResult.hasMarks );
	return assessmentResult;
};

module.exports = {
	identifier: "sentenceBeginnings",
	getResult: sentenceBeginningsAssessment,
	isApplicable: function( paper ) {
		var locale = getLanguage( paper.getLocale() );
		var validLocale = locale === "en" || locale === "de" || locale === "fr" || locale === "es";
		return ( validLocale && paper.hasText() );
	},
	getMarks: sentenceBeginningMarker
};


},{"../helpers/getLanguage.js":297,"../markers/addMark.js":303,"../stringProcessing/stripHTMLTags":387,"../values/AssessmentResult.js":396,"../values/Mark.js":397,"lodash/filter":189,"lodash/flatten":193,"lodash/map":221,"lodash/partition":228,"lodash/sortBy":231}],266:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var countTooLongSentences = require( "./../assessmentHelpers/checkForTooLongSentences.js" );
var formatNumber = require( "../helpers/formatNumber.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeEndInclusive;
var stripTags = require( "../stringProcessing/stripHTMLTags" ).stripIncompleteTags;

var Mark = require( "../values/Mark.js" );
var addMark = require( "../markers/addMark.js" );

var map = require( "lodash/map" );

var recommendedValue = 20;
var maximumPercentage = 25;

/**
 * Gets the sentences that are qualified as being too long.
 *
 * @param {Object} sentences The sentences to filter through.
 * @param {Number} recommendedValue The recommended number of words.
 * @returns {Array} Array with all the sentences considered to be too long.
 */
var tooLongSentences = function( sentences, recommendedValue ) {
	return countTooLongSentences( sentences, recommendedValue );
};

/**
 * Get the total amount of sentences that are qualified as being too long.
 *
 * @param {Object} sentences The sentences to filter through.
 * @param {Number} recommendedValue The recommended number of words.
 * @returns {Number} The amount of sentences that are considered too long.
 */
var tooLongSentencesTotal = function( sentences, recommendedValue ) {
	return tooLongSentences( sentences, recommendedValue ).length;
};

/**
 * Calculates sentence length score.
 *
 * @param {Object} sentences The object containing sentences and their lengths.
 * @param {Object} i18n The object used for translations.
 * @returns {Object} Object containing score and text.
 */
var calculateSentenceLengthResult = function( sentences, i18n ) {
	var score;
	var percentage = 0;
	var tooLongTotal = tooLongSentencesTotal( sentences, recommendedValue );

	if ( sentences.length !== 0 ) {
		percentage = formatNumber( ( tooLongTotal / sentences.length ) * 100 );
	}

	if ( percentage <= 25 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( percentage, 25, 30 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( percentage > 30 ) {
		// Red indicator.
		score = 3;
	}

	var hasMarks = ( percentage > 0 );
	var sentenceLengthURL = "<a href='https://yoa.st/short-sentences' target='_blank'>";

	if ( score >= 7 ) {
		return {
			score: score,
			hasMarks: hasMarks,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis",
				// Translators: %1$d expands to percentage of sentences, %2$s expands to a link on yoast.com,
				// %3$s expands to the recommended maximum sentence length, %4$s expands to the anchor end tag,
				// %5$s expands to the recommended maximum percentage.
				"%1$s of the sentences contain %2$smore than %3$s words%4$s, which is less than or equal to the recommended maximum of %5$s."
				), percentage + "%", sentenceLengthURL, recommendedValue, "</a>", maximumPercentage + "%"
			)
		};
	}

	return {
		score: score,
		hasMarks: hasMarks,

		// Translators: %1$s expands to the percentage of sentences, %2$d expands to the maximum percentage of sentences.
		// %3$s expands to the recommended amount of words.
		text: i18n.sprintf( i18n.dgettext( "js-text-analysis",

			// Translators: %1$d expands to percentage of sentences, %2$s expands to a link on yoast.com,
			// %3$s expands to the recommended maximum sentence length, %4$s expands to the anchor end tag,
			// %5$s expands to the recommended maximum percentage.
			"%1$s of the sentences contain %2$smore than %3$s words%4$s, which is more than the recommended maximum of %5$s. " +
			"Try to shorten the sentences."
			), percentage + "%", sentenceLengthURL, recommendedValue, "</a>", maximumPercentage + "%"
		)
	};
};

/**
 * Scores the percentage of sentences including more than the recommended number of words.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var sentenceLengthInTextAssessment = function( paper, researcher, i18n ) {
	var sentenceCount = researcher.getResearch( "countSentencesFromText" );
	var sentenceResult = calculateSentenceLengthResult( sentenceCount, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( sentenceResult.score );
	assessmentResult.setText( sentenceResult.text );
	assessmentResult.setHasMarks( sentenceResult.hasMarks );

	return assessmentResult;
};

/**
 * Mark the sentences.
 *
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher to use.
 * @returns {Array} Array with all the marked sentences.
 */
var sentenceLengthMarker = function( paper, researcher ) {
	var sentenceCount = researcher.getResearch( "countSentencesFromText" );
	var sentenceObjects = tooLongSentences( sentenceCount, recommendedValue );

	return map( sentenceObjects, function( sentenceObject ) {
		var sentence = stripTags( sentenceObject.sentence );
		return new Mark( {
			original: sentence,
			marked: addMark( sentence )
		} );
	} );
};

module.exports = {
	identifier: "textSentenceLength",
	getResult: sentenceLengthInTextAssessment,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: sentenceLengthMarker
};

},{"../helpers/formatNumber.js":295,"../helpers/inRange.js":300,"../markers/addMark.js":303,"../stringProcessing/stripHTMLTags":387,"../values/AssessmentResult.js":396,"../values/Mark.js":397,"./../assessmentHelpers/checkForTooLongSentences.js":254,"lodash/map":221}],267:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isTextTooLong = require( "../helpers/isValueTooLong" );
var filter = require( "lodash/filter" );
var map = require( "lodash/map" );

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );
var inRange = require( "../helpers/inRange.js" ).inRangeEndInclusive;

// The maximum recommended value of the subheading text.
var recommendedValue = 300;

/**
 * Counts the number of subheading texts that are too long.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @returns {number} The number of subheading texts that are too long.
 */
var getTooLongSubheadingTexts = function( subheadingTextsLength ) {
	return filter( subheadingTextsLength, function( subheading ) {
		return isTextTooLong( recommendedValue, subheading.wordCount );
	} );
};

/**
 * Calculates the score based on the subheading texts length.
 * @param {Array} subheadingTextsLength Array with subheading text lengths.
 * @param {number} tooLongTexts The number of subheading texts that are too long.
 * @param {object} i18n The object used for translations.
 * @returns {object} the resultobject containing a score and text if subheadings are present
 */
var subheadingsTextLength = function( subheadingTextsLength, tooLongTexts, i18n ) {
	var score;

	if ( subheadingTextsLength.length === 0 ) {
		// Red indicator, use '2' so we can differentiate in external analysis.
		return {
			score: 2,
			text: i18n.dgettext(
				"js-text-analysis",
				"The text does not contain any subheadings. Add at least one subheading."
			)
		};
	}

	var longestSubheadingTextLength = subheadingTextsLength[ 0 ].wordCount;

	if ( longestSubheadingTextLength <= 300 ) {
		// Green indicator.
		score = 9;
	}

	if ( inRange( longestSubheadingTextLength, 300, 350  ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( longestSubheadingTextLength > 350 ) {
		// Red indicator.
		score = 3;
	}

	if ( score >= 7 ) {
		return {
			score: score,
			text: i18n.sprintf(
				i18n.dgettext(
					"js-text-analysis",
					"The amount of words following each of the subheadings doesn't exceed the recommended maximum of %1$d words, which is great."
				), recommendedValue )
		};
	}

	return {
		score: score,
		hasMarks: true,

		// Translators: %1$d expands to the number of subheadings, %2$d expands to the recommended value
		text: i18n.sprintf(
			i18n.dngettext(
				"js-text-analysis",
				"%1$d of the subheadings is followed by more than the recommended maximum of %2$d words. Try to insert another subheading.",
				"%1$d of the subheadings are followed by more than the recommended maximum of %2$d words. Try to insert additional subheadings.",
				tooLongTexts ),
			tooLongTexts, recommendedValue
		)
	};
};

/**
 * Creates a marker for each text following a subheading that is too long.
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @returns {Array} All markers for the current text.
 */
var subheadingsMarker = function( paper, researcher ) {
	var subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );
	var tooLongTexts = getTooLongSubheadingTexts( subheadingTextsLength );

	return map( tooLongTexts, function( tooLongText ) {
		var marked = marker( tooLongText.text );
		return new Mark( {
			original: tooLongText.text,
			marked: marked
		} );
	} );
};

/**
 * Runs the getSubheadingLength research and checks scores based on length.
 *
 * @param {Paper} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessmentresult
 */
var getSubheadingsTextLength = function( paper, researcher, i18n ) {
	var subheadingTextsLength = researcher.getResearch( "getSubheadingTextLengths" );
	subheadingTextsLength = subheadingTextsLength.sort(
		function( a, b ) {
			return b.wordCount - a.wordCount;
		}
	);
	var tooLongTexts = getTooLongSubheadingTexts( subheadingTextsLength ).length;
	var subheadingsTextLengthresult = subheadingsTextLength( subheadingTextsLength, tooLongTexts, i18n );

	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subheadingsTextLengthresult.score );
	assessmentResult.setText( subheadingsTextLengthresult.text );
	// assessmentResult.setHasMarks( subheadingsTextLengthresult.hasMarks );

	return assessmentResult;
};

module.exports = {
	identifier: "subheadingsTooLong",
	getResult: getSubheadingsTextLength,
	isApplicable: function( paper ) {
		return paper.hasText();
	},
	getMarks: subheadingsMarker
};

},{"../helpers/inRange.js":300,"../helpers/isValueTooLong":301,"../markers/addMark.js":303,"../values/AssessmentResult.js":396,"../values/Mark.js":397,"lodash/filter":189,"lodash/map":221}],268:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Returns a score and text based on the keyword matches object.
 *
 * @param {object} subHeadings The object with all subHeadings matches.
 * @param {object} i18n The object used for translations.
 * @returns {object} resultObject with score and text.
 */
var calculateKeywordMatchesResult = function( subHeadings, i18n ) {
	if ( subHeadings.matches === 0 ) {
		return {
			score: 6,
			text: i18n.dgettext( "js-text-analysis", "You have not used the focus keyword in any subheading (such as an H2) in your copy." )
		};
	}
	if ( subHeadings.matches >= 1 ) {
		return {
			score: 9,
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "The focus keyword appears in %2$d (out of %1$d) subheadings in the copy. " +
				"While not a major ranking factor, this is beneficial." ), subHeadings.count, subHeadings.matches )
		};
	}
	return {};
};

/**
 * Runs the match keyword in subheadings module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} the Assessmentresult
 */
var subheadingsHaveKeywordAssessment = function( paper, researcher, i18n ) {
	var subHeadings = researcher.getResearch( "matchKeywordInSubheadings" );
	var subHeadingsResult = calculateKeywordMatchesResult( subHeadings, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( subHeadingsResult.score );
	assessmentResult.setText( subHeadingsResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "subheadingsKeyword",
	getResult: subheadingsHaveKeywordAssessment,
	isApplicable: function( paper ) {
		return paper.hasText() && paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":396}],269:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

var recommendedMinimum = 150;
/**
 * Calculate the score based on the current word count.
 * @param {number} wordCount The amount of words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateWordCountResult = function( wordCount, i18n ) {
	if ( wordCount >= 150 ) {
		return {
			score: 9,
			text: i18n.dngettext(


				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text. */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
				"This is more than or equal to the recommended minimum of %2$d word.",
				"This is more than or equal to the recommended minimum of %2$d words.",
				recommendedMinimum
			)
		};
	}

	if ( inRange( wordCount, 125, 150 ) ) {
		return {
			score: 7,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text. */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
				"This is slightly below the recommended minimum of %2$d word. Add a bit more copy.",
				"This is slightly below the recommended minimum of %2$d words. Add a bit more copy.",
				recommendedMinimum
			)
		};
	}

	if ( inRange( wordCount, 100, 125 ) ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text. */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
				"This is below the recommended minimum of %2$d word. Add more content that is relevant for the topic.",
				"This is below the recommended minimum of %2$d words. Add more content that is relevant for the topic.",
				recommendedMinimum
			)
		};
	}

	if ( inRange( wordCount, 50, 100 ) ) {
		return {
			score: -10,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text. */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
				"This is below the recommended minimum of %2$d word. Add more content that is relevant for the topic.",
				"This is below the recommended minimum of %2$d words. Add more content that is relevant for the topic.",
				recommendedMinimum
			)
		};
	}

	if ( inRange( wordCount, 0, 50 ) ) {
		return {
			score: -20,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text. */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
				"This is far below the recommended minimum of %2$d word. Add more content that is relevant for the topic.",
				"This is far below the recommended minimum of %2$d words. Add more content that is relevant for the topic.",
				recommendedMinimum
			)
		};
	}
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var taxonomyTextLengthAssessment = function( paper, researcher, i18n ) {
	var wordCount = researcher.getResearch( "wordCountInText" );
	var wordCountResult = calculateWordCountResult( wordCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( wordCountResult.score );
	assessmentResult.setText( i18n.sprintf( wordCountResult.text, wordCount, recommendedMinimum ) );

	return assessmentResult;
};

module.exports = {
	identifier: "taxonomyTextLength",
	getResult: taxonomyTextLengthAssessment
};

},{"../values/AssessmentResult.js":396,"lodash/inRange":199}],270:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

var Mark = require( "../values/Mark.js" );
var addMark = require( "../markers/addMark.js" );

var map = require( "lodash/map" );

/**
 * Returns a score and text based on the number of links.
 *
 * @param {object} linkStatistics The object with all linkstatistics.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateLinkCountResult = function( linkStatistics, i18n ) {
	if ( linkStatistics.keyword.totalKeyword > 0 ) {
		return {
			score: 2,
			hasMarks: true,
			text: i18n.dgettext( "js-text-analysis", "You\'re linking to another page with the focus keyword you want this page to rank for. " +
				"Consider changing that if you truly want this page to rank." )
		};
	}
	return {};
};

/**
 * Runs the linkCount module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var textHasCompetingLinksAssessment = function( paper, researcher, i18n ) {
	var linkCount = researcher.getResearch( "getLinkStatistics" );

	var linkCountResult = calculateLinkCountResult( linkCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( linkCountResult.score );
	assessmentResult.setText( linkCountResult.text );
	assessmentResult.setHasMarks( linkCountResult.hasMarks );

	return assessmentResult;
};

/**
 * Mark the anchors.
 *
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher to use.
 * @returns {Array} Array with all the marked anchors.
 */
var competingLinkMarker = function( paper, researcher ) {
	var competingLinks = researcher.getResearch( "getLinkStatistics" );

	return map( competingLinks.keyword.matchedAnchors, function( matchedAnchor ) {
		return new Mark( {
			original: matchedAnchor,
			marked: addMark( matchedAnchor )
		} );
	} );
};

module.exports = {
	identifier: "textCompetingLinks",
	getResult: textHasCompetingLinksAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText() && paper.hasKeyword();
	},
	getMarks: competingLinkMarker
};

},{"../markers/addMark.js":303,"../values/AssessmentResult.js":396,"../values/Mark.js":397,"lodash/map":221}],271:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isEmpty = require( "lodash/isEmpty" );

/**
 * Calculate the score based on the current image count.
 * @param {number} imageCount The amount of images to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateImageCountResult = function( imageCount, i18n ) {
	if ( imageCount === 0 ) {
		return {
			score: 3,
			text: i18n.dgettext( "js-text-analysis", "No images appear in this page, consider adding some as appropriate." )
		};
	}

	return {};
};

/**
 * Calculate the score based on the current image alt-tag count.
 * @param {object} altProperties An object containing the various alt-tags.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var assessImages = function( altProperties, i18n ) {
	// Has alt-tag and keywords
	if ( altProperties.withAltKeyword > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The images on this page contain alt attributes with the focus keyword." )
		};
	}

	// Has alt-tag, but no keywords and it's not okay
	if ( altProperties.withAltNonKeyword > 0 ) {
		return {
			score: 5,
			text: i18n.dgettext( "js-text-analysis", "The images on this page do not have alt attributes containing the focus keyword." )
		};
	}

	// Has alt-tag, but no keyword is set
	if ( altProperties.withAlt > 0 ) {
		return {
			score: 5,
			text: i18n.dgettext( "js-text-analysis", "The images on this page contain alt attributes." )
		};
	}

	// Has no alt-tag
	if ( altProperties.noAlt > 0 ) {
		return {
			score: 5,
			text: i18n.dgettext( "js-text-analysis", "The images on this page are missing alt attributes." )
		};
	}

	return {};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var textHasImagesAssessment = function( paper, researcher, i18n ) {
	var assessmentResult = new AssessmentResult();

	var imageCount = researcher.getResearch( "imageCount" );
	var imageCountResult = calculateImageCountResult( imageCount, i18n );

	if ( isEmpty( imageCountResult ) ) {
		var altTagCount = researcher.getResearch( "altTagCount" );
		var altTagCountResult = assessImages( altTagCount, i18n );

		assessmentResult.setScore( altTagCountResult.score );
		assessmentResult.setText( altTagCountResult.text );

		return assessmentResult;
	}

	assessmentResult.setScore( imageCountResult.score );
	assessmentResult.setText( imageCountResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "textImages",
	getResult: textHasImagesAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText();
	}
};

},{"../values/AssessmentResult.js":396,"lodash/isEmpty":207}],272:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var inRange = require( "lodash/inRange" );

var recommendedMinimum = 300;
/**
 * Calculate the score based on the current word count.
 * @param {number} wordCount The amount of words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateWordCountResult = function( wordCount, i18n ) {
	if ( wordCount >= 300 ) {
		return {
			score: 9,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words. */
				"This is more than or equal to the recommended minimum of %2$d word.",
				"This is more than or equal to the recommended minimum of %2$d words.",
				recommendedMinimum
			)
		};
	}

	if ( inRange( wordCount, 250, 300 ) ) {
		return {
			score: 7,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
				"This is slightly below the recommended minimum of %2$d word. Add a bit more copy.",
				"This is slightly below the recommended minimum of %2$d words. Add a bit more copy.",
				recommendedMinimum
			)
		};
	}

	if ( inRange( wordCount, 200, 250 ) ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
				"This is below the recommended minimum of %2$d word. Add more content that is relevant for the topic.",
				"This is below the recommended minimum of %2$d words. Add more content that is relevant for the topic.",
				recommendedMinimum
			)
		};
	}

	if ( inRange( wordCount, 100, 200 ) ) {
		return {
			score: -10,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
				"This is below the recommended minimum of %2$d word. Add more content that is relevant for the topic.",
				"This is below the recommended minimum of %2$d words. Add more content that is relevant for the topic.",
				recommendedMinimum
			)
		};
	}

	if ( inRange( wordCount, 0, 100 ) ) {
		return {
			score: -20,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$d expands to the number of words in the text */
				"The text contains %1$d word.",
				"The text contains %1$d words.",
				wordCount
			) + " " + i18n.dngettext(
				"js-text-analysis",
				/* Translators: The preceding sentence is "The text contains x words.", %2$s expands to the recommended minimum of words */
				"This is far below the recommended minimum of %2$d word. Add more content that is relevant for the topic.",
				"This is far below the recommended minimum of %2$d words. Add more content that is relevant for the topic.",
				recommendedMinimum
			)
		};
	}
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var textLengthAssessment = function( paper, researcher, i18n ) {
	var wordCount = researcher.getResearch( "wordCountInText" );
	var wordCountResult = calculateWordCountResult( wordCount, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( wordCountResult.score );
	assessmentResult.setText( i18n.sprintf( wordCountResult.text, wordCount, recommendedMinimum ) );

	return assessmentResult;
};

module.exports = {
	identifier: "textLength",
	getResult: textLengthAssessment
};

},{"../values/AssessmentResult.js":396,"lodash/inRange":199}],273:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isEmpty = require( "lodash/isEmpty" );

/**
 * Returns a score and text based on the linkStatistics object.
 *
 * @param {object} linkStatistics The object with all linkstatistics.
 * @param {object} i18n The object used for translations
 * @returns {object} resultObject with score and text
 */
var calculateLinkStatisticsResult = function( linkStatistics, i18n ) {
	if ( linkStatistics.total === 0 ) {
		return {
			score: 6,
			text: i18n.dgettext( "js-text-analysis", "No links appear in this page, consider adding some as appropriate." )
		};
	}

	if ( linkStatistics.externalNofollow === linkStatistics.total ) {
		return {
			score: 7,
			/* Translators: %1$s expands the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s), all nofollowed." ),
				linkStatistics.externalNofollow )
		};
	}

	if ( linkStatistics.externalNofollow < linkStatistics.externalTotal ) {
		return {
			score: 8,
			/* Translators: %1$s expands to the number of nofollow links, %2$s to the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s nofollowed link(s) and %2$s normal outbound link(s)." ),
				linkStatistics.externalNofollow, linkStatistics.externalDofollow )
		};
	}

	if ( linkStatistics.externalDofollow === linkStatistics.total ) {
		return {
			score: 9,
			/* Translators: %1$s expands to the number of outbound links */
			text: i18n.sprintf( i18n.dgettext( "js-text-analysis", "This page has %1$s outbound link(s)." ), linkStatistics.externalTotal )
		};
	}

	return {};
};

/**
 * Runs the getLinkStatistics module, based on this returns an assessment result with score.
 *
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations
 * @returns {object} the Assessmentresult
 */
var textHasLinksAssessment = function( paper, researcher, i18n ) {
	var linkStatistics = researcher.getResearch( "getLinkStatistics" );
	var assessmentResult = new AssessmentResult();
	if ( !isEmpty( linkStatistics ) ) {
		var linkStatisticsResult = calculateLinkStatisticsResult( linkStatistics, i18n );
		assessmentResult.setScore( linkStatisticsResult.score );
		assessmentResult.setText( linkStatisticsResult.text );
	}
	return assessmentResult;
};

module.exports = {
	identifier: "textLinks",
	getResult: textHasLinksAssessment,
	isApplicable: function ( paper ) {
		return paper.hasText();
	}
};

},{"../values/AssessmentResult.js":396,"lodash/isEmpty":207}],274:[function(require,module,exports){
var stripHTMLTags = require( "../stringProcessing/stripHTMLTags" ).stripFullTags;
var AssessmentResult = require( "../values/AssessmentResult" );

/**
 * Assesses that the paper has at least a little bit of content.
 *
 * @param {Paper} paper The paper to assess.
 * @param {Researcher} researcher The researcher.
 * @param {Jed} i18n The translations object.
 * @returns {AssessmentResult} The result of this assessment.
 */
function textPresenceAssessment( paper, researcher, i18n ) {
	var text = stripHTMLTags( paper.getText() );

	if ( text.length < 50 ) {
		var result = new AssessmentResult();

		result.setText( i18n.dgettext( "js-text-analysis", "You have far too little content, please add some content to enable a good analysis." ) );
		result.setScore( 3 );

		return result;
	}

	return new AssessmentResult();
}

module.exports = {
	identifier: "textPresence",
	getResult: textPresenceAssessment
};

},{"../stringProcessing/stripHTMLTags":387,"../values/AssessmentResult":396}],275:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var escape = require( "lodash/escape" );

/**
 * Executes the pagetitle keyword assessment and returns an assessment result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment with text and score
 */
var titleHasKeywordAssessment = function( paper, researcher, i18n ) {

	var keywordMatches = researcher.getResearch( "findKeywordInPageTitle" );
	var score, text;

	if ( keywordMatches.matches === 0 ) {
		score = 2;
		text = i18n.sprintf( i18n.dgettext( "js-text-analysis", "The focus keyword '%1$s' does " +
			"not appear in the SEO title." ), escape( paper.getKeyword() ) );
	}

	if ( keywordMatches.matches > 0 && keywordMatches.position === 0 ) {
		score = 9;
		text = i18n.dgettext( "js-text-analysis", "The SEO title contains the focus keyword, at the beginning which is considered " +
			"to improve rankings." );
	}

	if ( keywordMatches.matches > 0 && keywordMatches.position > 0 ) {
		score = 6;
		text = i18n.dgettext( "js-text-analysis", "The SEO title contains the focus keyword, but it does not appear at the beginning;" +
			" try and move it to the beginning." );
	}
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( score );
	assessmentResult.setText( text );

	return assessmentResult;
};

module.exports = {
	identifier: "titleKeyword",
	getResult: titleHasKeywordAssessment,
	isApplicable: function ( paper ) {
		return paper.hasKeyword();
	}
};

},{"../values/AssessmentResult.js":396,"lodash/escape":188}],276:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var formatNumber = require( "../helpers/formatNumber.js" );
var map = require( "lodash/map" );
var inRange = require( "../helpers/inRange.js" ).inRangeStartInclusive;
var stripTags = require( "../stringProcessing/stripHTMLTags" ).stripIncompleteTags;
var getLanguage = require( "../helpers/getLanguage.js" );

var Mark = require( "../values/Mark.js" );
var marker = require( "../markers/addMark.js" );

/**
 * Calculates transition word result
 * @param {object} transitionWordSentences The object containing the total number of sentences and the number of sentences containing
 * a transition word.
 * @param {object} i18n The object used for translations.
 * @returns {object} Object containing score and text.
 */
var calculateTransitionWordResult = function( transitionWordSentences, i18n ) {
	var score;
	var percentage = ( transitionWordSentences.transitionWordSentences / transitionWordSentences.totalSentences ) * 100;
	percentage     = formatNumber( percentage );
	var hasMarks   = ( percentage > 0 );
	var transitionWordsURL = "<a href='https://yoa.st/transition-words' target='_blank'>";

	if ( percentage < 20 ) {
		// Red indicator.
		score = 3;
	}

	if ( inRange( percentage, 20, 30 ) ) {
		// Orange indicator.
		score = 6;
	}

	if ( percentage >= 30 ) {
		// Green indicator.
		score = 9;
	}

	if ( score < 7 ) {
		var recommendedMinimum = 30;
		return {
			score: formatNumber( score ),
			hasMarks: hasMarks,
			text: i18n.sprintf(
				i18n.dgettext( "js-text-analysis",

					// Translators: %1$s expands to the number of sentences containing transition words, %2$s expands to a link on yoast.com,
					// %3$s expands to the anchor end tag, %4$s expands to the recommended value.
					"%1$s of the sentences contain a %2$stransition word%3$s or phrase, " +
					"which is less than the recommended minimum of %4$s."
				), percentage + "%", transitionWordsURL, "</a>", recommendedMinimum + "%" )
		};
	}

	return {
		score: formatNumber( score ),
		hasMarks: hasMarks,
		text: i18n.sprintf( i18n.dgettext( "js-text-analysis",

			// Translators: %1$s expands to the number of sentences containing transition words, %2$s expands to a link on yoast.com,
			// %3$s expands to the anchor end tag.
			"%1$s of the sentences contain a %2$stransition word%3$s or phrase, " +
			"which is great."
		), percentage + "%", transitionWordsURL, "</a>" )
	};
};

/**
 * Scores the percentage of sentences including one or more transition words.
 * @param {object} paper The paper to use for the assessment.
 * @param {object} researcher The researcher used for calling research.
 * @param {object} i18n The object used for translations.
 * @returns {object} The Assessment result.
 */
var transitionWordsAssessment = function( paper, researcher, i18n ) {
	var transitionWordSentences = researcher.getResearch( "findTransitionWords" );
	var transitionWordResult = calculateTransitionWordResult( transitionWordSentences, i18n );
	var assessmentResult = new AssessmentResult();

	assessmentResult.setScore( transitionWordResult.score );
	assessmentResult.setText( transitionWordResult.text );
	assessmentResult.setHasMarks( transitionWordResult.hasMarks );

	return assessmentResult;
};

/**
 * Marks text for the transition words assessment.
 * @param {Paper} paper The paper to use for the marking.
 * @param {Researcher} researcher The researcher containing the necessary research.
 * @returns {Array<Mark>} A list of marks that should be applied.
 */
var transitionWordsMarker = function( paper, researcher ) {
	var transitionWordSentences = researcher.getResearch( "findTransitionWords" );

	return map( transitionWordSentences.sentenceResults, function( sentenceResult ) {
		var sentence = sentenceResult.sentence;
		sentence = stripTags( sentence );
		return new Mark( {
			original: sentence,
			marked: marker( sentence )
		} );
	} );
};

module.exports = {
	identifier: "textTransitionWords",
	getResult: transitionWordsAssessment,
	isApplicable: function( paper ) {
		var locale = getLanguage( paper.getLocale() );
		var validLocale = locale === "en" || locale === "de" || locale === "es" || locale === "fr";
		return ( validLocale && paper.hasText() );
	},
	getMarks: transitionWordsMarker
};

},{"../helpers/formatNumber.js":295,"../helpers/getLanguage.js":297,"../helpers/inRange.js":300,"../markers/addMark.js":303,"../stringProcessing/stripHTMLTags":387,"../values/AssessmentResult.js":396,"../values/Mark.js":397,"lodash/map":221}],277:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Calculate the score based on whether or not there's a keyword in the url.
 * @param {number} keywordsResult The amount of keywords to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateUrlKeywordCountResult = function( keywordsResult, i18n ) {

	if ( keywordsResult > 0 ) {
		return {
			score: 9,
			text: i18n.dgettext( "js-text-analysis", "The focus keyword appears in the URL for this page." )
		};
	}

	return {
		score: 6,
		text: i18n.dgettext( "js-text-analysis", "The focus keyword does not appear in the URL for this page. " +
		                                         "If you decide to rename the URL be sure to check the old URL 301 redirects to the new one!" )
	};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var urlHasKeywordAssessment = function( paper, researcher, i18n ) {
	var keywords = researcher.getResearch( "keywordCountInUrl" );
	var keywordsResult = calculateUrlKeywordCountResult( keywords, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( keywordsResult.score );
	assessmentResult.setText( keywordsResult.text );

	return assessmentResult;
};

module.exports = {
	identifier: "urlKeyword",
	getResult: urlHasKeywordAssessment,
	isApplicable: function( paper ) {
		return paper.hasKeyword() && paper.hasUrl();
	}
};

},{"../values/AssessmentResult.js":396}],278:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * The assessment that checks the url length
 *
 * @param {Paper} paper The paper to run this assessment on.
 * @param {object} researcher The researcher used for the assessment.
 * @param {object} i18n The i18n-object used for parsing translations.
 * @returns {object} an AssessmentResult with the score and the formatted text.
 */
var urlLengthAssessment = function( paper, researcher, i18n ) {
	var urlIsTooLong = researcher.getResearch( "urlLength" );
	var assessmentResult = new AssessmentResult();
	if ( urlIsTooLong ) {
		var score = 5;
		var text = i18n.dgettext( "js-text-analysis", "The slug for this page is a bit long, consider shortening it." );
		assessmentResult.setScore( score );
		assessmentResult.setText( text );
	}
	return assessmentResult;
};

module.exports = {
	identifier: "urlLength",
	getResult: urlLengthAssessment,
	isApplicable: function ( paper ) {
		return paper.hasUrl();
	}
};

},{"../values/AssessmentResult.js":396}],279:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );

/**
 * Calculate the score based on the amount of stop words in the url.
 * @param {number} stopWordCount The amount of stop words to be checked against.
 * @param {object} i18n The locale object.
 * @returns {object} The resulting score object.
 */
var calculateUrlStopWordsCountResult = function( stopWordCount, i18n ) {

	if ( stopWordCount > 0 ) {
		return {
			score: 5,
			text: i18n.dngettext(
				"js-text-analysis",
				/* Translators: %1$s opens a link to a wikipedia article about stop words, %2$s closes the link */
				"The slug for this page contains a %1$sstop word%2$s, consider removing it.",
				"The slug for this page contains %1$sstop words%2$s, consider removing them.",
				stopWordCount
			)
		};
	}

	return {};
};

/**
 * Execute the Assessment and return a result.
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The result of the assessment, containing both a score and a descriptive text.
 */
var urlHasStopWordsAssessment = function( paper, researcher, i18n ) {
	var stopWords = researcher.getResearch( "stopWordsInUrl" );
	var stopWordsResult = calculateUrlStopWordsCountResult( stopWords.length, i18n );

	var assessmentResult = new AssessmentResult();
	assessmentResult.setScore( stopWordsResult.score );
	assessmentResult.setText( i18n.sprintf(
		stopWordsResult.text,
		/* Translators: this link is referred to in the content analysis when a slug contains one or more stop words */
		"<a href='" + i18n.dgettext( "js-text-analysis", "http://en.wikipedia.org/wiki/Stop_words" ) + "' target='new'>",
		"</a>"
	) );

	return assessmentResult;
};

module.exports = {
	identifier: "urlStopWords",
	getResult: urlHasStopWordsAssessment
};

},{"../values/AssessmentResult.js":396}],280:[function(require,module,exports){
/* global window */

var Researcher = require( "./researcher.js" );
var MissingArgument = require( "./errors/missingArgument" );
var removeDuplicateMarks = require( "./markers/removeDuplicateMarks" );
var AssessmentResult = require( "./values/AssessmentResult.js" );
var showTrace = require( "./helpers/errors.js" ).showTrace;

var isUndefined = require( "lodash/isUndefined" );
var isFunction = require( "lodash/isFunction" );
var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );
var map = require( "lodash/map" );
var findIndex = require( "lodash/findIndex" );
var find = require( "lodash/find" );

var ScoreRating = 9;

/**
 * Creates the Assessor
 *
 * @param {Object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var Assessor = function( i18n, options ) {
	this.setI18n( i18n );
	this._assessments = [];

	this._options = options || {};
};

/**
 * Checks if the i18n object is defined and sets it.
 * @param {Object} i18n The i18n object used for translations.
 * @throws {MissingArgument} Parameter needs to be a valid i18n object.
 */
Assessor.prototype.setI18n = function( i18n ) {
	if ( isUndefined( i18n ) ) {
		throw new MissingArgument( "The assessor requires an i18n object." );
	}
	this.i18n = i18n;
};

/**
 * Gets all available assessments.
 * @returns {object} assessment
 */
Assessor.prototype.getAvailableAssessments = function() {
	return this._assessments;
};

/**
 * Checks whether or not the Assessment is applicable.
 * @param {Object} assessment The Assessment object that needs to be checked.
 * @param {Paper} paper The Paper object to check against.
 * @param {Researcher} [researcher] The Researcher object containing additional information.
 * @returns {boolean} Whether or not the Assessment is applicable.
 */
Assessor.prototype.isApplicable = function( assessment, paper, researcher ) {
	if ( assessment.hasOwnProperty( "isApplicable" ) ) {
		return assessment.isApplicable( paper, researcher );
	}

	return true;
};

/**
 * Determines whether or not an assessment has a marker
 *
 * @param {Object} assessment The assessment to check for.
 * @returns {boolean} Whether or not the assessment has a marker.
 */
Assessor.prototype.hasMarker = function( assessment ) {
	if ( !isUndefined( window ) && !isUndefined( window.yoastHideMarkers ) && window.yoastHideMarkers ) {
		return false;
	}

	return isFunction( this._options.marker ) && assessment.hasOwnProperty( "getMarks" );
};

/**
 * Returns the specific marker for this assessor
 *
 * @returns {Function} The specific marker for this assessor.
 */
Assessor.prototype.getSpecificMarker = function() {
	return this._options.marker;
};

/**
 * Returns the paper that was most recently assessed
 *
 * @returns {Paper} The paper that was most recently assessed.
 */
Assessor.prototype.getPaper = function() {
	return this._lastPaper;
};

/**
 * Returns the marker for a given assessment, composes the specific marker with the assessment getMarks function.
 *
 * @param {Object} assessment The assessment for which we are retrieving the composed marker.
 * @param {Paper} paper The paper to retrieve the marker for.
 * @param {Researcher} researcher The researcher for the paper.
 * @returns {Function} A function that can mark the given paper according to the given assessment.
 */
Assessor.prototype.getMarker = function( assessment, paper, researcher ) {
	var specificMarker = this._options.marker;

	return function() {
		var marks = assessment.getMarks( paper, researcher );

		marks = removeDuplicateMarks( marks );

		specificMarker( paper, marks );
	};
};

/**
 * Runs the researches defined in the tasklist or the default researches.
 * @param {Paper} paper The paper to run assessments on.
 */
Assessor.prototype.assess = function( paper ) {
	var researcher = new Researcher( paper );
	var assessments = this.getAvailableAssessments();
	this.results = [];

	assessments = filter( assessments, function( assessment ) {
		return this.isApplicable( assessment, paper, researcher );
	}.bind( this ) );

	this.setHasMarkers( false );
	this.results = map( assessments, this.executeAssessment.bind( this, paper, researcher ) );

	this._lastPaper = paper;
};

/**
 * Sets the value of has markers with a boolean to determine if there are markers.
 *
 * @param {bool} hasMarkers True when there are markers, otherwise it is false.
 */
Assessor.prototype.setHasMarkers = function( hasMarkers ) {
	this._hasMarkers = hasMarkers;
};

/**
 * Returns true when there are markers.
 *
 * @returns {bool} Are there markers
 */
Assessor.prototype.hasMarkers = function() {
	return this._hasMarkers;
};

/**
 * Executes an assessment and returns the AssessmentResult
 *
 * @param {Paper} paper The paper to pass to the assessment.
 * @param {Researcher} researcher The researcher to pass to the assessment.
 * @param {Object} assessment The assessment to execute.
 * @returns {AssessmentResult} The result of the assessment.
 */
Assessor.prototype.executeAssessment = function( paper, researcher, assessment ) {
	var result;

	try {
		result = assessment.getResult( paper, researcher, this.i18n );
		result.setIdentifier( assessment.identifier );

		if ( result.hasMarks() && this.hasMarker( assessment ) ) {
			this.setHasMarkers( true );

			result.setMarker( this.getMarker( assessment, paper, researcher ) );
		}
	} catch ( assessmentError ) {
		showTrace( assessmentError );

		result = new AssessmentResult();

		result.setScore( 0 );
		result.setText( this.i18n.sprintf(
			/* Translators: %1$s expands to the name of the assessment. */
			this.i18n.dgettext( "js-text-analysis", "An error occurred in the '%1$s' assessment" ),
			assessment.identifier,
			assessmentError
		) );
	}
	return result;
};

/**
 * Filters out all assessmentresults that have no score and no text.
 * @returns {Array<AssessmentResult>} The array with all the valid assessments.
 */
Assessor.prototype.getValidResults = function() {
	return filter( this.results, function( result ) {
		return this.isValidResult( result );
	}.bind( this ) );
};

/**
 * Returns if an assessmentResult is valid.
 * @param {object} assessmentResult The assessmentResult to validate.
 * @returns {boolean} whether or not the result is valid.
 */
Assessor.prototype.isValidResult = function( assessmentResult ) {
	return assessmentResult.hasScore() && assessmentResult.hasText();
};

/**
 * Returns the overallscore. Calculates the totalscore by adding all scores and dividing these
 * by the number of results times the ScoreRating.
 *
 * @returns {number} The overallscore
 */
Assessor.prototype.calculateOverallScore  = function() {
	var results = this.getValidResults();
	var totalScore = 0;

	forEach( results, function( assessmentResult ) {
		totalScore += assessmentResult.getScore();

	} );

	return Math.round( totalScore / ( results.length * ScoreRating ) * 100 ) || 0;
};

/**
 * Register an assessment to add it to the internal assessments object.
 *
 * @param {string} name The name of the assessment.
 * @param {object} assessment The object containing function to run as an assessment and it's requirements.
 * @returns {boolean} Whether registering the assessment was successful.
 * @private
 */
Assessor.prototype.addAssessment = function( name, assessment ) {
	if ( !assessment.hasOwnProperty( "identifier" ) ) {
		assessment.identifier = name;
	}

	this._assessments.push( assessment );
	return true;
};

/**
 * Remove a specific Assessment from the list of Assessments.
 * @param {string} name The Assessment to remove from the list of assessments.
 */
Assessor.prototype.removeAssessment = function( name ) {
	var toDelete = findIndex( this._assessments, function( assessment ) {
		return assessment.hasOwnProperty( "identifier" ) && name === assessment.identifier;
	} );

	if ( -1 !== toDelete ) {
		this._assessments.splice( toDelete, 1 );
	}
};

/**
 * Returns an assessment by identifier
 *
 * @param {string} identifier The identifier of the assessment.
 * @returns {undefined|Object} The object if found, otherwise undefined.
 */
Assessor.prototype.getAssessment = function( identifier ) {
	return find( this._assessments, function( assessment ) {
		return assessment.hasOwnProperty( "identifier" ) && identifier === assessment.identifier;
	} );
};

module.exports = Assessor;

},{"./errors/missingArgument":292,"./helpers/errors.js":294,"./markers/removeDuplicateMarks":304,"./researcher.js":308,"./values/AssessmentResult.js":396,"lodash/filter":189,"lodash/find":190,"lodash/findIndex":191,"lodash/forEach":194,"lodash/isFunction":208,"lodash/isUndefined":218,"lodash/map":221}],281:[function(require,module,exports){
var AssessmentResult = require( "../values/AssessmentResult.js" );
var isUndefined = require( "lodash/isUndefined" );

var MissingArgument = require( "../../js/errors/missingArgument" );
/**
 * @param {object} app The app
 * @param {object} args An arguments object with usedKeywords, searchUrl, postUrl,
 * @param {object} args.usedKeywords An object with keywords and ids where they are used.
 * @param {string} args.searchUrl The url used to link to a search page when multiple usages of the keyword are found.
 * @param {string} args.postUrl The url used to link to a post when 1 usage of the keyword is found.
 * @constructor
 */
var PreviouslyUsedKeyword = function( app, args ) {
	if ( isUndefined( app ) ) {
		throw new MissingArgument( "The previously keyword plugin requires the YoastSEO app" );
	}

	if ( isUndefined( args ) ) {
		args = {
			usedKeywords: {},
			searchUrl: "",
			postUrl: ""
		};
	}

	this.app = app;
	this.usedKeywords = args.usedKeywords;
	this.searchUrl = args.searchUrl;
	this.postUrl = args.postUrl;
};

/**
 * Registers the assessment with the assessor.
 */
PreviouslyUsedKeyword.prototype.registerPlugin = function() {
	this.app.registerAssessment( "usedKeywords", {
		getResult: this.assess.bind( this ),
		isApplicable: function( paper ) {
			return paper.hasKeyword();
		}
	}, "previouslyUsedKeywords" );
};

/**
 * Updates the usedKeywords
 * @param {object} usedKeywords An object with keywords and ids where they are used.
 */
PreviouslyUsedKeyword.prototype.updateKeywordUsage = function( usedKeywords ) {
	this.usedKeywords = usedKeywords;
};

/**
 * Scores the previously used keyword assessment based on the count.
 *
 * @param {object} previouslyUsedKeywords The result of the previously used keywords research
 * @param {Paper} paper The paper object to research.
 * @param {Jed} i18n The i18n object.
 * @returns {object} the scoreobject with text and score.
 */
PreviouslyUsedKeyword.prototype.scoreAssessment = function( previouslyUsedKeywords, paper, i18n ) {
	var count = previouslyUsedKeywords.count;
	var id = previouslyUsedKeywords.id;
	if( count === 0 ) {
		return {
			text: i18n.dgettext( "js-text-analysis", "You've never used this focus keyword before, very good." ),
			score: 9
		};
	}
	if( count === 1 ) {
		var url = "<a href='" + this.postUrl.replace( "{id}", id ) + "' target='_blank'>";
		return {
			/* Translators: %1$s and %2$s expand to an admin link where the focus keyword is already used */
			text:  i18n.sprintf( i18n.dgettext( "js-text-analysis", "You've used this focus keyword %1$sonce before%2$s, " +
				"be sure to make very clear which URL on your site is the most important for this keyword." ), url, "</a>" ),
			score: 6
		};
	}
	if ( count > 1 ) {
		url = "<a href='" + this.searchUrl.replace( "{keyword}", paper.getKeyword() )+ "' target='_blank'>";
		return {
			/* Translators: %1$s and $3$s expand to the admin search page for the focus keyword, %2$d expands to the number of times this focus
			 keyword has been used before, %4$s and %5$s expand to a link to an article on yoast.com about cornerstone content */
			text:  i18n.sprintf( i18n.dgettext( "js-text-analysis", "You've used this focus keyword %1$s%2$d times before%3$s, " +
				"it's probably a good idea to read %4$sthis post on cornerstone content%5$s and improve your keyword strategy." ),
				url, count, "</a>", "<a href='https://yoast.com/cornerstone-content-rank/' target='_blank'>", "</a>" ),
			score: 1
		};
	}
};

/**
 * Researches the previously used keywords, based on the used keywords and the keyword in the paper.
 *
 * @param {Paper} paper The paper object to research.
 * @returns {{id: number, count: number}} The object with the count and the id of the previously used keyword
 */
PreviouslyUsedKeyword.prototype.researchPreviouslyUsedKeywords = function( paper ) {
	var keyword = paper.getKeyword();
	var count = 0;
	var id = 0;

	if ( !isUndefined( this.usedKeywords[ keyword ] ) ) {
		count = this.usedKeywords[ keyword ].length;
		id = this.usedKeywords[ keyword ][ 0 ];
	}

	return {
		id: id,
		count: count
	};
};

/**
 * The assessment for the previously used keywords.
 *
 * @param {Paper} paper The Paper object to assess.
 * @param {Researcher} researcher The Researcher object containing all available researches.
 * @param {object} i18n The locale object.
 * @returns {AssessmentResult} The assessment result of the assessment
 */
PreviouslyUsedKeyword.prototype.assess = function( paper, researcher, i18n ) {
	var previouslyUsedKeywords = this.researchPreviouslyUsedKeywords( paper );
	var previouslyUsedKeywordsResult = this.scoreAssessment( previouslyUsedKeywords, paper, i18n );

	var assessmentResult =  new AssessmentResult();
	assessmentResult.setScore( previouslyUsedKeywordsResult.score );
	assessmentResult.setText( previouslyUsedKeywordsResult.text );

	return assessmentResult;
};

module.exports = PreviouslyUsedKeyword;

},{"../../js/errors/missingArgument":292,"../values/AssessmentResult.js":396,"lodash/isUndefined":218}],282:[function(require,module,exports){
var analyzerConfig = {
	queue: [ "wordCount", "keywordDensity", "subHeadings", "stopwords", "fleschReading", "linkCount", "imageCount", "urlKeyword", "urlLength", "metaDescriptionLength", "metaDescriptionKeyword", "pageTitleKeyword", "pageTitleLength", "firstParagraph", "urlStopwords", "keywordDoubles", "keyphraseSizeCheck" ],
	stopWords: [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves" ],
	wordsToRemove: [ " a", " in", " an", " on", " for", " the", " and" ],
	maxSlugLength: 20,
	maxUrlLength: 40,
	maxMeta: 156
};

module.exports = analyzerConfig;

},{}],283:[function(require,module,exports){
/** @module config/diacritics */

/**
 * Returns the diacritics map
 *
 * @returns {array} diacritics map
 */
module.exports = function() {
	return [
		{
			base: "a",
			letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
		},
		{ base: "aa", letters: /[\uA733]/g },
		{ base: "ae", letters: /[\u00E6\u01FD\u01E3]/g },
		{ base: "ao", letters: /[\uA735]/g },
		{ base: "au", letters: /[\uA737]/g },
		{ base: "av", letters: /[\uA739\uA73B]/g },
		{ base: "ay", letters: /[\uA73D]/g },
		{ base: "b", letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
		{
			base: "c",
			letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
		},
		{
			base: "d",
			letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
		},
		{ base: "dz", letters: /[\u01F3\u01C6]/g },
		{
			base: "e",
			letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
		},
		{ base: "f", letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
		{
			base: "g",
			letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
		},
		{
			base: "h",
			letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
		},
		{ base: "hv", letters: /[\u0195]/g },
		{
			base: "i",
			letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
		},
		{ base: "j", letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
		{
			base: "k",
			letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
		},
		{
			base: "l",
			letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
		},
		{ base: "lj", letters: /[\u01C9]/g },
		{ base: "m", letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
		{
			base: "n",
			letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
		},
		{ base: "nj", letters: /[\u01CC]/g },
		{
			base: "o",
			letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
		},
		{ base: "oi", letters: /[\u01A3]/g },
		{ base: "ou", letters: /[\u0223]/g },
		{ base: "oo", letters: /[\uA74F]/g },
		{ base: "p", letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
		{ base: "q", letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
		{
			base: "r",
			letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
		},
		{
			base: "s",
			letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
		},
		{
			base: "t",
			letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
		},
		{ base: "tz", letters: /[\uA729]/g },
		{
			base: "u",
			letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
		},
		{ base: "v", letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
		{ base: "vy", letters: /[\uA761]/g },
		{
			base: "w",
			letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
		},
		{ base: "x", letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
		{
			base: "y",
			letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
		},
		{
			base: "z",
			letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
		}
	];
};

},{}],284:[function(require,module,exports){
/**
 * Returns the configuration used for score ratings and the AssessorPresenter.
 * @param {Jed} i18n The translator object.
 * @returns {Object} The config object.
 */
module.exports = function ( i18n ) {
	return {
		feedback: {
			className: "na",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Feedback" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content optimization: Has feedback" )
		},
		bad: {
			className: "bad",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Bad SEO score" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content optimization: Bad SEO score" )
		},
		ok: {
			className: "ok",
			screenReaderText: i18n.dgettext( "js-text-analysis", "OK SEO score" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content optimization: OK SEO score" )
		},
		good: {
			className: "good",
			screenReaderText: i18n.dgettext( "js-text-analysis", "Good SEO score" ),
			fullText: i18n.dgettext( "js-text-analysis", "Content optimization: Good SEO score" )
		}
	};
};

},{}],285:[function(require,module,exports){
/** @module config/removalWords */

/**
 * Returns an array with words that need to be removed
 *
 * @returns {array} removalWords Returns an array with words.
 */
module.exports = function() {
	return [ " a", " in", " an", " on", " for", " the", " and" ];
};

},{}],286:[function(require,module,exports){
/** @module config/stopwords */

/**
 * Returns an array with stopwords to be used by the analyzer.
 *
 * @returns {Array} stopwords The array filled with stopwords.
 */
module.exports = function() {
	return [ "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "could", "did", "do", "does", "doing", "down", "during", "each", "few", "for", "from", "further", "had", "has", "have", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "it", "it's", "its", "itself", "let's", "me", "more", "most", "my", "myself", "nor", "of", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "she", "she'd", "she'll", "she's", "should", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "we", "we'd", "we'll", "we're", "we've", "were", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "would", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves" ];
};

},{}],287:[function(require,module,exports){
/** @module config/syllables */

/**
 * Returns an array with syllables.
 * Subtractsyllables are counted as two and need to be counted as one.
 * Addsyllables are counted as one but need to be counted as two.
 * Exclusionwords are removed from the text to be counted seperatly.
 *
 * @returns {object}
 */
module.exports = function() {
	return {
		syllableExclusion: {
			subtractSyllables: {
				syllables: [ "cial", "tia", "cius", "cious", "giu", "ion", "iou", "sia$", "[^aeiuoyt]{2,}ed$", "[aeiouy][^aeiuoyts]{1,}e$", ".ely$", "[cg]h?e[sd]", "rved$", "rved", "[aeiouy][dt]es?$", "[aeiouy][^aeiouydt]e[sd]?$", "^[dr]e[aeiou][^aeiou]+$", "[aeiouy]rse$" ],
				multiplier: -1
			},
			addSyllables: {
				syllables: [ "ia", "riet", "dien", "iu", "io", "ii", "[aeiouym][bdp]le$", "[aeiou]{3}", "^mc", "ism$", "([^aeiouy])\1l$", "[^l]lien", "^coa[dglx].", "[^gq]ua[^auieo]", "dnt$", "uity$", "ie(r|st)", "[aeiouy]ing", "[aeiouw]y[aeiou]", "[^ao]ire[ds]", "[^ao]ire$"],
				multiplier: +1
			}
		},
		exclusionWords: [
			{ word: "shoreline", syllables: 2 },
			{ word: "simile", syllables: 3 },
			{ word: "business", syllables: 2 },
			{ word: "heiress", syllables: 2 },
			{ word: "coheiress", syllables: 3 },
			{ word: "unheired", syllables: 2 },
			// The abbreviation i.e. should be counted as 2 syllables.
			{ word: "i.e", syllables: 2}
		],
		vowels: 'aeiouy'
	};
};


},{}],288:[function(require,module,exports){
var getLanguage = require( "../helpers/getLanguage.js" );
var isUndefined = require( "lodash/isUndefined" );


var transliterations = {

	// Language: Spanish.
	// Source: https://en.wikipedia.org/wiki/Spanish_orthography
	es: [
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" },
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00C1]/g, alternative: "A" },
		{ letter: /[\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9]/g, alternative: "E" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u00F3]/g, alternative: "o" },
		{ letter: /[\u00D3]/g, alternative: "O" },
		{ letter: /[\u00FA\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DA\u00DC]/g, alternative: "U" }
	],
	// Language: Polish.
	// Source: https://en.wikipedia.org/wiki/Polish_orthography
	pl: [
		{ letter: /[\u0105]/g, alternative: "a" },
		{ letter: /[\u0104]/g, alternative: "A" },
		{ letter: /[\u0107]/g, alternative: "c" },
		{ letter: /[\u0106]/g, alternative: "C" },
		{ letter: /[\u0119]/g, alternative: "e" },
		{ letter: /[\u0118]/g, alternative: "E" },
		{ letter: /[\u0142]/g, alternative: "l" },
		{ letter: /[\u0141]/g, alternative: "L" },
		{ letter: /[\u0144]/g, alternative: "n" },
		{ letter: /[\u0143]/g, alternative: "N" },
		{ letter: /[\u00F3]/g, alternative: "o" },
		{ letter: /[\u00D3]/g, alternative: "O" },
		{ letter: /[\u015B]/g, alternative: "s" },
		{ letter: /[\u015A]/g, alternative: "S" },
		{ letter: /[\u017A\u017C]/g, alternative: "z" },
		{ letter: /[\u0179\u017B]/g, alternative: "Z" }
	],
	// Language: German.
	// Source: https://en.wikipedia.org/wiki/German_orthography#Special_characters
	de: [
		{ letter: /[\u00E4]/g, alternative: "ae" },
		{ letter: /[\u00C4]/g, alternative: "Ae" },
		{ letter: /[\u00FC]/g, alternative: "ue" },
		{ letter: /[\u00DC]/g, alternative: "Ue" },
		{ letter: /[\u00F6]/g, alternative: "oe" },
		{ letter: /[\u00D6]/g, alternative: "Oe" },
		{ letter: /[\u00DF]/g, alternative: "ss" },
		{ letter: /[\u1E9E]/g, alternative: "SS" }
	],
	// Language Bokmål
	// Source: http://www.dagbladet.no/2011/12/30/tema/reise/reiseeksperter/forbrukerrettigheter/19494227/
	// Language Nynorks
	// Source: http://www.dagbladet.no/2011/12/30/tema/reise/reiseeksperter/forbrukerrettigheter/19494227/
	// Bokmål and Nynorks use the same transliterations
	nbnn: [
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00F8]/g, alternative: "oe" },
		{ letter: /[\u00D8]/g, alternative: "Oe" },
		{ letter: /[\u00E9\u00E8\u00EA]/g, alternative: "e" },
		{ letter: /[\u00C9\u00C8\u00CA]/g, alternative: "E" },
		{ letter: /[\u00F3\u00F2\u00F4]/g, alternative: "o" },
		{ letter: /[\u00D3\u00D2\u00D4]/g, alternative: "O" }
	],
	// Language: Swedish.
	// Sources: https://sv.wikipedia.org/wiki/%C3%85#Historia
	// http://forum.wordreference.com/threads/swedish-%C3%A4-ae-%C3%B6-oe-acceptable.1451839/
	sv: [
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00E4]/g, alternative: "ae" },
		{ letter: /[\u00C4]/g, alternative: "Ae" },
		{ letter: /[\u00F6]/g, alternative: "oe" },
		{ letter: /[\u00D6]/g, alternative: "Oe" },
		{ letter: /[\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9]/g, alternative: "E" },
		{ letter: /[\u00E0]/g, alternative: "a" },
		{ letter: /[\u00C0]/g, alternative: "A" }
	],
	// Language: Finnish.
	// Sources: https://www.cs.tut.fi/~jkorpela/lang/finnish-letters.html
	// https://en.wikipedia.org/wiki/Finnish_orthography
	fi: [
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" },
		{ letter: /[\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D6]/g, alternative: "O" },
		{ letter: /[\u017E]/g, alternative: "zh" },
		{ letter: /[\u017D]/g, alternative: "Zh" },
		{ letter: /[\u0161]/g, alternative: "sh" },
		{ letter: /[\u0160]/g, alternative: "Sh" }
	],
	// Language: Danish.
	// Sources: https://sv.wikipedia.org/wiki/%C3%85#Historia
	// https://en.wikipedia.org/wiki/Danish_orthography
	da: [
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u00C4]/g, alternative: "Ae" },
		{ letter: /[\u00F8]/g, alternative: "oe" },
		{ letter: /[\u00D8]/g, alternative: "Oe" },
		{ letter: /[\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9]/g, alternative: "E" }
	],
	// Language: Turkish.
	// Source: https://en.wikipedia.org/wiki/Turkish_alphabet
	// ‘İ’ is the capital dotted ‘i’. Its lowercase counterpart is the ‘regular’ ‘i’.
	tr: [
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u011F]/g, alternative: "g" },
		{ letter: /[\u011E]/g, alternative: "G" },
		{ letter: /[\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D6]/g, alternative: "O" },
		{ letter: /[\u015F]/g, alternative: "s" },
		{ letter: /[\u015E]/g, alternative: "S" },
		{ letter: /[\u00E2]/g, alternative: "a" },
		{ letter: /[\u00C2]/g, alternative: "A" },
		{ letter: /[\u0131\u00EE]/g, alternative: "i" },
		{ letter: /[\u0130\u00CE]/g, alternative: "I" },
		{ letter: /[\u00FC\u00FB]/g, alternative: "u" },
		{ letter: /[\u00DC\u00DB]/g, alternative: "U" }
	],
	// Language: Latvian.
	// Source: https://en.wikipedia.org/wiki/Latvian_orthography
	lv: [
		{ letter: /[\u0101]/g, alternative: "a" },
		{ letter: /[\u0100]/g, alternative: "A" },
		{ letter: /[\u010D]/g, alternative: "c" },
		{ letter: /[\u010C]/g, alternative: "C" },
		{ letter: /[\u0113]/g, alternative: "e" },
		{ letter: /[\u0112]/g, alternative: "E" },
		{ letter: /[\u0123]/g, alternative: "g" },
		{ letter: /[\u0122]/g, alternative: "G" },
		{ letter: /[\u012B]/g, alternative: "i" },
		{ letter: /[\u012A]/g, alternative: "I" },
		{ letter: /[\u0137]/g, alternative: "k" },
		{ letter: /[\u0136]/g, alternative: "K" },
		{ letter: /[\u013C]/g, alternative: "l" },
		{ letter: /[\u013B]/g, alternative: "L" },
		{ letter: /[\u0146]/g, alternative: "n" },
		{ letter: /[\u0145]/g, alternative: "N" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" },
		{ letter: /[\u016B]/g, alternative: "u" },
		{ letter: /[\u016A]/g, alternative: "U" },
		{ letter: /[\u017E]/g, alternative: "z" },
		{ letter: /[\u017D]/g, alternative: "Z" }
	],
	// Language: Icelandic.
	// Sources: https://en.wikipedia.org/wiki/Thorn_(letter),
	// https://en.wikipedia.org/wiki/Eth,  https://en.wikipedia.org/wiki/Icelandic_orthography
	is: [
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00C1]/g, alternative: "A" },
		{ letter: /[\u00F0]/g, alternative: "d" },
		{ letter: /[\u00D0]/g, alternative: "D" },
		{ letter: /[\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9]/g, alternative: "E" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u00F3\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D3\u00D6]/g, alternative: "O" },
		{ letter: /[\u00FA]/g, alternative: "u" },
		{ letter: /[\u00DA]/g, alternative: "U" },
		{ letter: /[\u00FD]/g, alternative: "y" },
		{ letter: /[\u00DD]/g, alternative: "Y" },
		{ letter: /[\u00FE]/g, alternative: "th" },
		{ letter: /[\u00DE]/g, alternative: "Th" },
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" }
	],
	// Language: Faroese.
	// Source: https://www.facebook.com/groups/1557965757758234/permalink/1749847165236758/ (conversation in private Facebook Group ‘Faroese Language Learning Enthusiasts’)
	// depending on the word, ð can be d, g, j, v, ng or nothing. However, ‘d’ is most frequent.
	// when writing text messages or using a foreign keyboard, í is sometimes written as ij, ý as yj, ú as uv, ó as ov, ø as oe, and á as aa or oa.
	// However, in website URLs the alternatives mentioned below are by far the most common.
	fa: [
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00C1]/g, alternative: "A" },
		{ letter: /[\u00F0]/g, alternative: "d" },
		{ letter: /[\u00D0]/g, alternative: "D" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u00FD]/g, alternative: "y" },
		{ letter: /[\u00DD]/g, alternative: "Y" },
		{ letter: /[\u00FA]/g, alternative: "u" },
		{ letter: /[\u00DA]/g, alternative: "U" },
		{ letter: /[\u00F3\u00F8]/g, alternative: "o" },
		{ letter: /[\u00D3\u00D8]/g, alternative: "O" },
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" }
	],
	// Language: Czech.
	// Source: https://en.wikipedia.org/wiki/Czech_orthography
	cs: [
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00C1]/g, alternative: "A" },
		{ letter: /[\u010D]/g, alternative: "c" },
		{ letter: /[\u010C]/g, alternative: "C" },
		{ letter: /[\u010F]/g, alternative: "d" },
		{ letter: /[\u010E]/g, alternative: "D" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u0148]/g, alternative: "n" },
		{ letter: /[\u0147]/g, alternative: "N" },
		{ letter: /[\u00F3]/g, alternative: "o" },
		{ letter: /[\u00D3]/g, alternative: "O" },
		{ letter: /[\u0159]/g, alternative: "r" },
		{ letter: /[\u0158]/g, alternative: "R" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" },
		{ letter: /[\u0165]/g, alternative: "t" },
		{ letter: /[\u0164]/g, alternative: "T" },
		{ letter: /[\u00FD]/g, alternative: "y" },
		{ letter: /[\u00DD]/g, alternative: "Y" },
		{ letter: /[\u017E]/g, alternative: "z" },
		{ letter: /[\u017D]/g, alternative: "Z" },
		{ letter: /[\u00E9\u011B]/g, alternative: "e" },
		{ letter: /[\u00C9\u011A]/g, alternative: "E" },
		{ letter: /[\u00FA\u016F]/g, alternative: "u" },
		{ letter: /[\u00DA\u016E]/g, alternative: "U" }
	],
	// Language: Russian.
	// Source:  Machine Readable Travel Documents, Doc 9303, Part 1, Volume 1 (PDF) (Sixth ed.).
	// ICAO. 2006. p. IV-50—IV-52. http://www.icao.int/publications/Documents/9303_p3_cons_en.pdf
	// ‘ь’ is the so-called soft sign, indicating a sound change (palatalization) of the preceding consonant.
	// In text it is transliterated to a character similar to an apostroph: ′.
	// I recommend omittance in slugs. (https://en.wikipedia.org/wiki/Romanization_of_Russian)
	ru: [
		{ letter: /[\u0430]/g, alternative: "a" },
		{ letter: /[\u0410]/g, alternative: "A" },
		{ letter: /[\u0431]/g, alternative: "b" },
		{ letter: /[\u0411]/g, alternative: "B" },
		{ letter: /[\u0432]/g, alternative: "v" },
		{ letter: /[\u0412]/g, alternative: "V" },
		{ letter: /[\u0433]/g, alternative: "g" },
		{ letter: /[\u0413]/g, alternative: "G" },
		{ letter: /[\u0434]/g, alternative: "d" },
		{ letter: /[\u0414]/g, alternative: "D" },
		{ letter: /[\u0435]/g, alternative: "e" },
		{ letter: /[\u0415]/g, alternative: "E" },
		{ letter: /[\u0436]/g, alternative: "zh" },
		{ letter: /[\u0416]/g, alternative: "Zh" },
		{ letter: /[\u0437]/g, alternative: "z" },
		{ letter: /[\u0417]/g, alternative: "Z" },
		{ letter: /[\u0456\u0438\u0439]/g, alternative: "i" },
		{ letter: /[\u0406\u0418\u0419]/g, alternative: "I" },
		{ letter: /[\u043A]/g, alternative: "k" },
		{ letter: /[\u041A]/g, alternative: "K" },
		{ letter: /[\u043B]/g, alternative: "l" },
		{ letter: /[\u041B]/g, alternative: "L" },
		{ letter: /[\u043C]/g, alternative: "m" },
		{ letter: /[\u041C]/g, alternative: "M" },
		{ letter: /[\u043D]/g, alternative: "n" },
		{ letter: /[\u041D]/g, alternative: "N" },
		{ letter: /[\u0440]/g, alternative: "r" },
		{ letter: /[\u0420]/g, alternative: "R" },
		{ letter: /[\u043E]/g, alternative: "o" },
		{ letter: /[\u041E]/g, alternative: "O" },
		{ letter: /[\u043F]/g, alternative: "p" },
		{ letter: /[\u041F]/g, alternative: "P" },
		{ letter: /[\u0441]/g, alternative: "s" },
		{ letter: /[\u0421]/g, alternative: "S" },
		{ letter: /[\u0442]/g, alternative: "t" },
		{ letter: /[\u0422]/g, alternative: "T" },
		{ letter: /[\u0443]/g, alternative: "u" },
		{ letter: /[\u0423]/g, alternative: "U" },
		{ letter: /[\u0444]/g, alternative: "f" },
		{ letter: /[\u0424]/g, alternative: "F" },
		{ letter: /[\u0445]/g, alternative: "kh" },
		{ letter: /[\u0425]/g, alternative: "Kh" },
		{ letter: /[\u0446]/g, alternative: "ts" },
		{ letter: /[\u0426]/g, alternative: "Ts" },
		{ letter: /[\u0447]/g, alternative: "ch" },
		{ letter: /[\u0427]/g, alternative: "Ch" },
		{ letter: /[\u0448]/g, alternative: "sh" },
		{ letter: /[\u0428]/g, alternative: "Sh" },
		{ letter: /[\u0449]/g, alternative: "shch" },
		{ letter: /[\u0429]/g, alternative: "Shch" },
		{ letter: /[\u044A]/g, alternative: "ie" },
		{ letter: /[\u042A]/g, alternative: "Ie" },
		{ letter: /[\u044B]/g, alternative: "y" },
		{ letter: /[\u042B]/g, alternative: "Y" },
		{ letter: /[\u044C]/g, alternative: "" },
		{ letter: /[\u042C]/g, alternative: "" },
		{ letter: /[\u0451\u044D]/g, alternative: "e" },
		{ letter: /[\u0401\u042D]/g, alternative: "E" },
		{ letter: /[\u044E]/g, alternative: "iu" },
		{ letter: /[\u042E]/g, alternative: "Iu" },
		{ letter: /[\u044F]/g, alternative: "ia" },
		{ letter: /[\u042F]/g, alternative: "Ia" }
	],
	// Language: Esperanto.
	// Source: https://en.wikipedia.org/wiki/Esperanto#Writing_diacritics
	eo: [
		{ letter: /[\u0109]/g, alternative: "ch" },
		{ letter: /[\u0108]/g, alternative: "Ch" },
		{ letter: /[\u011d]/g, alternative: "gh" },
		{ letter: /[\u011c]/g, alternative: "Gh" },
		{ letter: /[\u0125]/g, alternative: "hx" },
		{ letter: /[\u0124]/g, alternative: "Hx" },
		{ letter: /[\u0135]/g, alternative: "jx" },
		{ letter: /[\u0134]/g, alternative: "Jx" },
		{ letter: /[\u015d]/g, alternative: "sx" },
		{ letter: /[\u015c]/g, alternative: "Sx" },
		{ letter: /[\u016d]/g, alternative: "ux" },
		{ letter: /[\u016c]/g, alternative: "Ux" }
	],
	// Language: Afrikaans.
	// Source: https://en.wikipedia.org/wiki/Afrikaans#Orthography
	af: [
		{ letter: /[\u00E8\u00EA\u00EB]/g, alternative: "e" },
		{ letter: /[\u00CB\u00C8\u00CA]/g, alternative: "E" },
		{ letter: /[\u00EE\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CE\u00CF]/g, alternative: "I" },
		{ letter: /[\u00F4\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D4\u00D6]/g, alternative: "O" },
		{ letter: /[\u00FB\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DB\u00DC]/g, alternative: "U" }
	],
	// Language: Catalan.
	// Source: https://en.wikipedia.org/wiki/Catalan_orthography
	ca: [
		{ letter: /[\u00E0]/g, alternative: "a" },
		{ letter: /[\u00C0]/g, alternative: "A" },
		{ letter: /[\u00E9|\u00E8]/g, alternative: "e" },
		{ letter: /[\u00C9|\u00C8]/g, alternative: "E" },
		{ letter: /[\u00ED|\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CD|\u00CF]/g, alternative: "I" },
		{ letter: /[\u00F3|\u00F2]/g, alternative: "o" },
		{ letter: /[\u00D3|\u00D2]/g, alternative: "O" },
		{ letter: /[\u00FA|\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DA|\u00DC]/g, alternative: "U" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" }
	],
	// Language: Asturian.
	// Source: http://www.orbilat.com/Languages/Asturian/Grammar/Asturian-Alphabet.html
	ast: [
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" }
	],
	// Language: Aragonese.
	// Source: https://en.wikipedia.org/wiki/Aragonese_language#Orthography
	an: [
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00F1]/g, alternative: "ny" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00ED]/g, alternative: "i" },
		{ letter: /[\u00F3]/g, alternative: "o" },
		{ letter: /[\u00E1]/g, alternative: "a" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u00D1]/g, alternative: "Ny" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00CD]/g, alternative: "I" },
		{ letter: /[\u00D3]/g, alternative: "O" },
		{ letter: /[\u00C1]/g, alternative: "A" }
	],
	// Language: Aymara.
	// Source: http://www.omniglot.com/writing/aymara.htm
	ay: [
		{ letter: /(([\u00EF])|([\u00ED]))/g, alternative: "i" },
		{ letter: /(([\u00CF])|([\u00CD]))/g, alternative: "I" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" },
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u0027]/g, alternative: "" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" }
	],
	// Language: English.
	// Sources: https://en.wikipedia.org/wiki/English_terms_with_diacritical_marks https://en.wikipedia.org/wiki/English_orthography
	en: [
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u0153]/g, alternative: "oe" },
		{ letter: /[\u0152]/g, alternative: "Oe" },
		{ letter: /[\u00EB\u00E9]/g, alternative: "e" },
		{ letter: /[\u00C9\u00CB]/g, alternative: "E" },
		{ letter: /[\u00F4\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D4\u00D6]/g, alternative: "O" },
		{ letter: /[\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CF]/g, alternative: "I" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" },
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" }
	],
	// Language: French.
	// Sources: https://en.wikipedia.org/wiki/French_orthography#Ligatures https://en.wikipedia.org/wiki/French_orthography#Diacritics
	fr: [
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u0153]/g, alternative: "oe" },
		{ letter: /[\u0152]/g, alternative: "Oe" },
		{ letter: /[\u00E9\u00E8\u00EB\u00EA]/g, alternative: "e" },
		{ letter: /[\u00C9\u00C8\u00CB\u00CA]/g, alternative: "E" },
		{ letter: /[\u00E0\u00E2]/g, alternative: "a" },
		{ letter: /[\u00C0\u00C2]/g, alternative: "A" },
		{ letter: /[\u00EF\u00EE]/g, alternative: "i" },
		{ letter: /[\u00CF\u00CE]/g, alternative: "I" },
		{ letter: /[\u00F9\u00FB\u00FC]/g, alternative: "u" },
		{ letter: /[\u00D9\u00DB\u00DC]/g, alternative: "U" },
		{ letter: /[\u00F4]/g, alternative: "o" },
		{ letter: /[\u00D4]/g, alternative: "O" },
		{ letter: /[\u00FF]/g, alternative: "y" },
		{ letter: /[\u0178]/g, alternative: "Y" },
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" }
	],
	// Language: Italian.
	// Source: https://en.wikipedia.org/wiki/Italian_orthography
	it: [
		{ letter: /[\u00E0]/g, alternative: "a" },
		{ letter: /[\u00C0]/g, alternative: "A" },
		{ letter: /[\u00E9\u00E8]/g, alternative: "e" },
		{ letter: /[\u00C9\u00C8]/g, alternative: "E" },
		{ letter: /[\u00EC\u00ED\u00EE]/g, alternative: "i" },
		{ letter: /[\u00CC\u00CD\u00CE]/g, alternative: "I" },
		{ letter: /[\u00F3\u00F2]/g, alternative: "o" },
		{ letter: /[\u00D3\u00D2]/g, alternative: "O" },
		{ letter: /[\u00F9\u00FA]/g, alternative: "u" },
		{ letter: /[\u00D9\u00DA]/g, alternative: "U" }
	],
	// Language: Dutch.
	// Sources: https://en.wikipedia.org/wiki/Dutch_orthography https://nl.wikipedia.org/wiki/Trema_in_de_Nederlandse_spelling
	nl: [
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00F1]/g, alternative: "n" },
		{ letter: /[\u00D1]/g, alternative: "N" },
		{ letter: /[\u00E9\u00E8\u00EA\u00EB]/g, alternative: "e" },
		{ letter: /[\u00C9\u00C8\u00CA\u00CB]/g, alternative: "E" },
		{ letter: /[\u00F4\u00F6]/g, alternative: "o" },
		{ letter: /[\u00D4\u00D6]/g, alternative: "O" },
		{ letter: /[\u00EF]/g, alternative: "i" },
		{ letter: /[\u00CF]/g, alternative: "I" },
		{ letter: /[\u00FC]/g, alternative: "u" },
		{ letter: /[\u00DC]/g, alternative: "U" },
		{ letter: /[\u00E4]/g, alternative: "a" },
		{ letter: /[\u00C4]/g, alternative: "A" }
	],
	// Language: Bambara.
	// Sources: http://www.omniglot.com/writing/bambara.htm https://en.wikipedia.org/wiki/Bambara_language
	bm: [
		{ letter: /[\u025B]/g, alternative: "e" },
		{ letter: /[\u0190]/g, alternative: "E" },
		{ letter: /[\u0272]/g, alternative: "ny" },
		{ letter: /[\u019D]/g, alternative: "Ny" },
		{ letter: /[\u014B]/g, alternative: "ng" },
		{ letter: /[\u014A]/g, alternative: "Ng" },
		{ letter: /[\u0254]/g, alternative: "o" },
		{ letter: /[\u0186]/g, alternative: "O" }
	],
	// Language: Ukrainian.
	// Source: Resolution no. 55 of the Cabinet of Ministers of Ukraine, January 27, 2010 http://zakon2.rada.gov.ua/laws/show/55-2010-%D0%BF
	// ‘ь’ is the so-called soft sign, indicating a sound change (palatalization) of the preceding consonant. In text it is sometimes transliterated
	// to a character similar to an apostroph: ′. Omittance is recommended in slugs (https://en.wikipedia.org/wiki/Romanization_of_Ukrainian).
	uk: [
		{ letter: /[\u0431]/g, alternative: "b" },
		{ letter: /[\u0411]/g, alternative: "B" },
		{ letter: /[\u0432]/g, alternative: "v" },
		{ letter: /[\u0412]/g, alternative: "V" },
		{ letter: /[\u0433]/g, alternative: "h" },
		{ letter: /[\u0413]/g, alternative: "H" },
		{ letter: /[\u0491]/g, alternative: "g" },
		{ letter: /[\u0490]/g, alternative: "G" },
		{ letter: /[\u0434]/g, alternative: "d" },
		{ letter: /[\u0414]/g, alternative: "D" },
		{ letter: /[\u043A]/g, alternative: "k" },
		{ letter: /[\u041A]/g, alternative: "K" },
		{ letter: /[\u043B]/g, alternative: "l" },
		{ letter: /[\u041B]/g, alternative: "L" },
		{ letter: /[\u043C]/g, alternative: "m" },
		{ letter: /[\u041C]/g, alternative: "M" },
		{ letter: /[\u0070]/g, alternative: "r" },
		{ letter: /[\u0050]/g, alternative: "R" },
		{ letter: /[\u043F]/g, alternative: "p" },
		{ letter: /[\u041F]/g, alternative: "P" },
		{ letter: /[\u0441]/g, alternative: "s" },
		{ letter: /[\u0421]/g, alternative: "S" },
		{ letter: /[\u0442]/g, alternative: "t" },
		{ letter: /[\u0422]/g, alternative: "T" },
		{ letter: /[\u0443]/g, alternative: "u" },
		{ letter: /[\u0423]/g, alternative: "U" },
		{ letter: /[\u0444]/g, alternative: "f" },
		{ letter: /[\u0424]/g, alternative: "F" },
		{ letter: /[\u0445]/g, alternative: "kh" },
		{ letter: /[\u0425]/g, alternative: "Kh" },
		{ letter: /[\u0446]/g, alternative: "ts" },
		{ letter: /[\u0426]/g, alternative: "Ts" },
		{ letter: /[\u0447]/g, alternative: "ch" },
		{ letter: /[\u0427]/g, alternative: "Ch" },
		{ letter: /[\u0448]/g, alternative: "sh" },
		{ letter: /[\u0428]/g, alternative: "Sh" },
		{ letter: /[\u0449]/g, alternative: "shch" },
		{ letter: /[\u0429]/g, alternative: "Shch" },
		{ letter: /[\u044C\u042C]/g, alternative: "" },
		{ letter: /[\u0436]/g, alternative: "zh" },
		{ letter: /[\u0416]/g, alternative: "Zh" },
		{ letter: /[\u0437]/g, alternative: "z" },
		{ letter: /[\u0417]/g, alternative: "Z" },
		{ letter: /[\u0438]/g, alternative: "y" },
		{ letter: /[\u0418]/g, alternative: "Y" },
		{ letter: /^[\u0454]/g, alternative: "ye" },
		{ letter: /[\s][\u0454]/g, alternative: " ye" },
		{ letter: /[\u0454]/g, alternative: "ie" },
		{ letter: /^[\u0404]/g, alternative: "Ye" },
		{ letter: /[\s][\u0404]/g, alternative: " Ye" },
		{ letter: /[\u0404]/g, alternative: "IE" },
		{ letter: /^[\u0457]/g, alternative: "yi" },
		{ letter: /[\s][\u0457]/g, alternative: " yi" },
		{ letter: /[\u0457]/g, alternative: "i" },
		{ letter: /^[\u0407]/g, alternative: "Yi" },
		{ letter: /[\s][\u0407]/g, alternative: " Yi" },
		{ letter: /[\u0407]/g, alternative: "I" },
		{ letter: /^[\u0439]/g, alternative: "y" },
		{ letter: /[\s][\u0439]/g, alternative: " y" },
		{ letter: /[\u0439]/g, alternative: "i" },
		{ letter: /^[\u0419]/g, alternative: "Y" },
		{ letter: /[\s][\u0419]/g, alternative: " Y" },
		{ letter: /[\u0419]/g, alternative: "I" },
		{ letter: /^[\u044E]/g, alternative: "yu" },
		{ letter: /[\s][\u044E]/g, alternative: " yu" },
		{ letter: /[\u044E]/g, alternative: "iu" },
		{ letter: /^[\u042E]/g, alternative: "Yu" },
		{ letter: /[\s][\u042E]/g, alternative: " Yu" },
		{ letter: /[\u042E]/g, alternative: "IU" },
		{ letter: /^[\u044F]/g, alternative: "ya" },
		{ letter: /[\s][\u044F]/g, alternative: " ya" },
		{ letter: /[\u044F]/g, alternative: "ia" },
		{ letter: /^[\u042F]/g, alternative: "Ya" },
		{ letter: /[\s][\u042F]/g, alternative: " Ya" },
		{ letter: /[\u042F]/g, alternative: "IA" }
	],
	// Language: Breton
	// Source: http://www.omniglot.com/writing/breton.htm
	br: [
		{ letter: /\u0063\u0027\u0068/g, alternative: "ch" },
		{ letter: /\u0043\u0027\u0048/g, alternative: "CH" },
		{ letter: /[\u00e2]/g, alternative: "a" },
		{ letter: /[\u00c2]/g, alternative: "A" },
		{ letter: /[\u00ea]/g, alternative: "e" },
		{ letter: /[\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ee]/g, alternative: "i" },
		{ letter: /[\u00ce]/g, alternative: "I" },
		{ letter: /[\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d4]/g, alternative: "O" },
		{ letter: /[\u00fb\u00f9\u00fc]/g, alternative: "u" },
		{ letter: /[\u00db\u00d9\u00dc]/g, alternative: "U" },
		{ letter: /[\u00f1]/g, alternative: "n" },
		{ letter: /[\u00d1]/g, alternative: "N" }
	],
	// Language: Chamorro
	// Source: http://www.omniglot.com/writing/chamorro.htm
	ch: [
		{ letter: /[\u0027]/g, alternative: "" },
		{ letter: /[\u00e5]/g, alternative: "a" },
		{ letter: /[\u00c5]/g, alternative: "A" },
		{ letter: /[\u00f1]/g, alternative: "n" },
		{ letter: /[\u00d1]/g, alternative: "N" }
	],
	// Language: Corsican
	// Sources: http://www.omniglot.com/writing/corsican.htm https://en.wikipedia.org/wiki/Corsican_alphabet
	co: [
		{ letter: /[\u00e2\u00e0]/g, alternative: "a" },
		{ letter: /[\u00c2\u00c0]/g, alternative: "A" },
		{ letter: /[\u00e6\u04d5]/g, alternative: "ae" },
		{ letter: /[\u00c6\u04d4]/g, alternative: "Ae" },
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00e9\u00ea\u00e8\u00eb]/g, alternative: "e" },
		{ letter: /[\u00c9\u00ca\u00c8\u00cb]/g, alternative: "E" },
		{ letter: /[\u00ec\u00ee\u00ef]/g, alternative: "i" },
		{ letter: /[\u00cc\u00ce\u00cf]/g, alternative: "I" },
		{ letter: /[\u00f1]/g, alternative: "n" },
		{ letter: /[\u00d1]/g, alternative: "N" },
		{ letter: /[\u00f4\u00f2]/g, alternative: "o" },
		{ letter: /[\u00d4\u00d2]/g, alternative: "O" },
		{ letter: /[\u0153]/g, alternative: "oe" },
		{ letter: /[\u0152]]/g, alternative: "Oe" },
		{ letter: /[\u00f9\u00fc]/g, alternative: "u" },
		{ letter: /[\u00d9\u00dc]/g, alternative: "U" },
		{ letter: /[\u00ff]/g, alternative: "y" },
		{ letter: /[\u0178]/g, alternative: "Y" }
	],
	// Language: Kashubian
	// Sources: http://www.omniglot.com/writing/kashubian.htm https://en.wikipedia.org/wiki/Kashubian_language
	csb: [
		{ letter: /[\u0105\u00e3]/g, alternative: "a" },
		{ letter: /[\u0104\u00c3]/g, alternative: "A" },
		{ letter: /[\u00e9\u00eb]/g, alternative: "e" },
		{ letter: /[\u00c9\u00cb]/g, alternative: "E" },
		{ letter: /[\u0142]/g, alternative: "l" },
		{ letter: /[\u0141]/g, alternative: "L" },
		{ letter: /[\u0144]/g, alternative: "n" },
		{ letter: /[\u0143]/g, alternative: "N" },
		{ letter: /[\u00f2\u00f3\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d2\u00d3\u00d4]/g, alternative: "O" },
		{ letter: /[\u00f9]/g, alternative: "u" },
		{ letter: /[\u00d9]/g, alternative: "U" },
		{ letter: /[\u017c]/g, alternative: "z" },
		{ letter: /[\u017b]/g, alternative: "Z" }
	],
	// Language: Welsh
	// Sources: http://www.omniglot.com/writing/welsh.htm https://en.wikipedia.org/wiki/Welsh_orthography#Diacritics
	cy: [
		{ letter: /[\u00e2]/g, alternative: "a" },
		{ letter: /[\u00c2]/g, alternative: "A" },
		{ letter: /[\u00ea]/g, alternative: "e" },
		{ letter: /[\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ee]/g, alternative: "i" },
		{ letter: /[\u00ce]/g, alternative: "I" },
		{ letter: /[\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d4]/g, alternative: "O" },
		{ letter: /[\u00fb]/g, alternative: "u" },
		{ letter: /[\u00db]/g, alternative: "U" },
		{ letter: /[\u0175]/g, alternative: "w" },
		{ letter: /[\u0174]/g, alternative: "W" },
		{ letter: /[\u0177]/g, alternative: "y" },
		{ letter: /[\u0176]/g, alternative: "Y" }
	],
	// Language: Ewe
	// Sources: http://www.omniglot.com/writing/ewe.htm https://en.wikipedia.org/wiki/Ewe_language#Writing_system
	ee: [
		{ letter: /[\u0256]/g, alternative: "d" },
		{ letter: /[\u0189]/g, alternative: "D" },
		{ letter: /[\u025b]/g, alternative: "e" },
		{ letter: /[\u0190]/g, alternative: "E" },
		{ letter: /[\u0192]/g, alternative: "f" },
		{ letter: /[\u0191]/g, alternative: "F" },
		{ letter: /[\u0263]/g, alternative: "g" },
		{ letter: /[\u0194]/g, alternative: "G" },
		{ letter: /[\u014b]/g, alternative: "ng" },
		{ letter: /[\u014a]/g, alternative: "Ng" },
		{ letter: /[\u0254]/g, alternative: "o" },
		{ letter: /[\u0186]/g, alternative: "O" },
		{ letter: /[\u028b]/g, alternative: "w" },
		{ letter: /[\u01b2]/g, alternative: "W" },
		{ letter: /\u0061\u0303/g, alternative: "a" },
		{ letter: /[\u00e1\u00e0\u01ce\u00e2\u00e3]/g, alternative: "a" },
		{ letter: /\u0041\u0303/g, alternative: "A" },
		{ letter: /[\u00c1\u00c0\u01cd\u00c2\u00c3]/g, alternative: "A" },
		{ letter: /[\u00e9\u00e8\u011b\u00ea]/g, alternative: "e" },
		{ letter: /[\u00c9\u00c8\u011a\u00ca]/g, alternative: "E" },
		{ letter: /[\u00f3\u00f2\u01d2\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d3\u00d2\u01d1\u00d4]/g, alternative: "O" },
		{ letter: /[\u00fa\u00f9\u01d4\u00fb]/g, alternative: "u" },
		{ letter: /[\u00da\u00d9\u01d3\u00db]/g, alternative: "U" },
		{ letter: /[\u00ed\u00ec\u01d0\u00ee]/g, alternative: "i" },
		{ letter: /[\u00cd\u00cc\u01cf\u00ce]/g, alternative: "I" }
	],
	// Language: Estonian
	// Sources: http://www.omniglot.com/writing/estonian.htm https://en.wikipedia.org/wiki/Estonian_orthography https://en.wikipedia.org/wiki/%C5%BD https://en.wikipedia.org/wiki/%C5%A0
	et: [
		{ letter: /[\u0161]/g, alternative: "sh" },
		{ letter: /[\u0160]/g, alternative: "Sh" },
		{ letter: /[\u017e]/g, alternative: "zh" },
		{ letter: /[\u017d]/g, alternative: "Zh" },
		{ letter: /[\u00f5\u00f6]/g, alternative: "o" },
		{ letter: /[\u00d6\u00d5]/g, alternative: "O" },
		{ letter: /[\u00e4]/g, alternative: "a" },
		{ letter: /[\u00c4]/g, alternative: "A" },
		{ letter: /[\u00fc]/g, alternative: "u" },
		{ letter: /[\u00dc]/g, alternative: "U" }
		],
	// Language: Basque
	// Sources: http://www.omniglot.com/writing/basque.htm https://en.wikipedia.org/wiki/Basque_language#Writing_system https://en	.wikipedia.org/wiki/Basque_alphabet
	eu: [
		{ letter: /[\u00f1]/g, alternative: "n" },
		{ letter: /[\u00d1]/g, alternative: "N" },
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00fc]/g, alternative: "u" },
		{ letter: /[\u00dc]/g, alternative: "U" }
	],
	// Language: Fulah
	// Sources: http://www.omniglot.com/writing/fula.htm https://en.wikipedia.org/wiki/Fula_language#Writing_systems
	fuc: [
		{ letter: /[\u0253]/g, alternative: "b" },
		{ letter: /[\u0181]/g, alternative: "B" },
		{ letter: /[\u0257]/g, alternative: "d" },
		{ letter: /[\u018a]/g, alternative: "D" },
		{ letter: /[\u014b]/g, alternative: "ng" },
		{ letter: /[\u014a]/g, alternative: "Ng" },
		{ letter: /[\u0272\u00f1]/g, alternative: "ny" },
		{ letter: /[\u019d\u00d1]/g, alternative: "Ny" },
		{ letter: /[\u01b4]/g, alternative: "y" },
		{ letter: /[\u01b3]/g, alternative: "Y" },
		{ letter: /[\u0260]/g, alternative: "g" },
		{ letter: /[\u0193]/g, alternative: "G" }
	],
	// Language: Fijian
	// Source: http://www.omniglot.com/writing/fijian.htm
	fj: [
		{ letter: /[\u0101]/g, alternative: "a" },
		{ letter: /[\u0100]/g, alternative: "A" },
		{ letter: /[\u0113]/g, alternative: "e" },
		{ letter: /[\u0112]/g, alternative: "E" },
		{ letter: /[\u012b]/g, alternative: "i" },
		{ letter: /[\u012a]/g, alternative: "I" },
		{ letter: /[\u016b]/g, alternative: "u" },
		{ letter: /[\u016a]/g, alternative: "U" },
		{ letter: /[\u014d]/g, alternative: "o" },
		{ letter: /[\u014c]/g, alternative: "O" }
	],
	// Language: Arpitan (Franco-Provençal language)
	// Source: http://www.omniglot.com/writing/francoprovencal.htm
	frp: [
		{ letter: /[\u00e2]/g, alternative: "a" },
		{ letter: /[\u00c2]/g, alternative: "A" },
		{ letter: /[\u00ea\u00e8\u00e9]/g, alternative: "e" },
		{ letter: /[\u00ca\u00c8\u00c9]/g, alternative: "E" },
		{ letter: /[\u00ee]/g, alternative: "i" },
		{ letter: /[\u00ce]/g, alternative: "I" },
		{ letter: /[\u00fb\u00fc]/g, alternative: "u" },
		{ letter: /[\u00db\u00dc]/g, alternative: "U" },
		{ letter: /[\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d4]/g, alternative: "O" }
	],
	// Language: Friulian
	// Sources: https://en.wikipedia.org/wiki/Friulian_language https://en.wikipedia.org/wiki/Faggin-Nazzi_alphabet
	// http://www.omniglot.com/writing/friulian.htm
	fur: [
		{ letter: /[\u00E7]/g, alternative: "c" },
		{ letter: /[\u00C7]/g, alternative: "C" },
		{ letter: /[\u00e0\u00e2]/g, alternative: "a" },
		{ letter: /[\u00c0\u00c2]/g, alternative: "A" },
		{ letter: /[\u00e8\u00ea]/g, alternative: "e" },
		{ letter: /[\u00c8\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ec\u00ee]/g, alternative: "i" },
		{ letter: /[\u00cc\u00ce]/g, alternative: "I" },
		{ letter: /[\u00f2\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d2\u00d4]/g, alternative: "O" },
		{ letter: /[\u00f9\u00fb]/g, alternative: "u" },
		{ letter: /[\u00d9\u00db]/g, alternative: "U" },
		{ letter: /[\u010d]/g, alternative: "c" },
		{ letter: /[\u010c]/g, alternative: "C" },
		{ letter: /[\u011f]/g, alternative: "g" },
		{ letter: /[\u011e]/g, alternative: "G" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" }
	],
	// Language: Frisian
	// Sources: https://en.wikipedia.org/wiki/West_Frisian_alphabet http://www.omniglot.com/writing/frisian.htm
	fy: [
		{ letter: /[\u00e2\u0101\u00e4\u00e5]/g, alternative: "a" },
		{ letter: /[\u00c2\u0100\u00c4\u00c5]/g, alternative: "A" },
		{ letter: /[\u00ea\u00e9\u0113]/g, alternative: "e" },
		{ letter: /[\u00ca\u00c9\u0112]/g, alternative: "E" },
		{ letter: /[\u00f4\u00f6]/g, alternative: "o" },
		{ letter: /[\u00d4\u00d6]/g, alternative: "O" },
		{ letter: /[\u00fa\u00fb\u00fc]/g, alternative: "u" },
		{ letter: /[\u00da\u00db\u00dc]/g, alternative: "U" },
		{ letter: /[\u00ed]/g, alternative: "i" },
		{ letter: /[\u00cd]/g, alternative: "I" },
		{ letter: /[\u0111\u00f0]/g, alternative: "d" },
		{ letter: /[\u0110\u00d0]/g, alternative: "D" }
	],
	// Language: Irish
	// Source: https://en.wikipedia.org/wiki/Irish_orthography
	ga: [
		{ letter: /[\u00e1]/g, alternative: "a" },
		{ letter: /[\u00c1]/g, alternative: "A" },
		{ letter: /[\u00e9]/g, alternative: "e" },
		{ letter: /[\u00c9]/g, alternative: "E" },
		{ letter: /[\u00f3]/g, alternative: "o" },
		{ letter: /[\u00d3]/g, alternative: "O" },
		{ letter: /[\u00fa]/g, alternative: "u" },
		{ letter: /[\u00da]/g, alternative: "U" },
		{ letter: /[\u00ed]/g, alternative: "i" },
		{ letter: /[\u00cd]/g, alternative: "I" }
	],
	// Language: Scottish Gaelic
	// Sources: https://en.wikipedia.org/wiki/Scottish_Gaelic_orthography http://www.omniglot.com/writing/gaelic.htm
	gd: [
		{ letter: /[\u00e0]/g, alternative: "a" },
		{ letter: /[\u00c0]/g, alternative: "A" },
		{ letter: /[\u00e8]/g, alternative: "e" },
		{ letter: /[\u00c8]/g, alternative: "E" },
		{ letter: /[\u00f2]/g, alternative: "o" },
		{ letter: /[\u00d2]/g, alternative: "O" },
		{ letter: /[\u00f9]/g, alternative: "u" },
		{ letter: /[\u00d9]/g, alternative: "U" },
		{ letter: /[\u00ec]/g, alternative: "i" },
		{ letter: /[\u00cc]/g, alternative: "I" }
	],
	// Language: Galician
	// Sources: https://en.wikipedia.org/wiki/Diacritic https://en.wikipedia.org/wiki/Galician_Alphabet
	gl: [
		{ letter: /[\u00e1\u00e0]/g, alternative: "a" },
		{ letter: /[\u00c1\u00c0]/g, alternative: "A" },
		{ letter: /[\u00e9\u00ea]/g, alternative: "e" },
		{ letter: /[\u00c9\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ed\u00ef]/g, alternative: "i" },
		{ letter: /[\u00cd\u00cf]/g, alternative: "I" },
		{ letter: /[\u00f3]/g, alternative: "o" },
		{ letter: /[\u00d3]/g, alternative: "O" },
		{ letter: /[\u00fa\u00fc]/g, alternative: "u" },
		{ letter: /[\u00da\u00dc]/g, alternative: "U" },
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00f1]/g, alternative: "n" },
		{ letter: /[\u00d1]/g, alternative: "N" }
	],
	// Language: Guarani
	// Sources: https://en.wikipedia.org/wiki/Guarani_alphabet http://www.omniglot.com/writing/guarani.htm
	gn: [
		{ letter: /[\u2019]/g, alternative: "" },
		{ letter: /\u0067\u0303/g, alternative: "g" },
		{ letter: /\u0047\u0303/g, alternative: "G" },
		{ letter: /[\u00e3]/g, alternative: "a" },
		{ letter: /[\u00c3]/g, alternative: "A" },
		{ letter: /[\u1ebd]/g, alternative: "e" },
		{ letter: /[\u1ebc]/g, alternative: "E" },
		{ letter: /[\u0129]/g, alternative: "i" },
		{ letter: /[\u0128]/g, alternative: "I" },
		{ letter: /[\u00f5]/g, alternative: "o" },
		{ letter: /[\u00d5]/g, alternative: "O" },
		{ letter: /[\u00f1]/g, alternative: "n" },
		{ letter: /[\u00d1]/g, alternative: "N" },
		{ letter: /[\u0169]/g, alternative: "u" },
		{ letter: /[\u0168]/g, alternative: "U" },
		{ letter: /[\u1ef9]/g, alternative: "y" },
		{ letter: /[\u1ef8]/g, alternative: "Y" }
	],
	// Language: Swiss German
	// Source: http://www.omniglot.com/writing/swissgerman.htm
	gsw: [
		{ letter: /[\u00e4]/g, alternative: "a" },
		{ letter: /[\u00c4]/g, alternative: "A" },
		{ letter: /[\u00f6]/g, alternative: "o" },
		{ letter: /[\u00d6]/g, alternative: "O" },
		{ letter: /[\u00fc]/g, alternative: "u" },
		{ letter: /[\u00dc]/g, alternative: "U" }
	],
	// Language: Haitian Creole
	// Sources: https://en.wikipedia.org/wiki/Haitian_Creole http://www.omniglot.com/writing/haitiancreole.htm
	hat: [
		{ letter: /[\u00e8]/g, alternative: "e" },
		{ letter: /[\u00c8]/g, alternative: "E" },
		{ letter: /[\u00f2]/g, alternative: "o" },
		{ letter: /[\u00d2]/g, alternative: "O" }
	],
	// Language: Hawaiian
	// Sources: https://en.wikipedia.org/wiki/Hawaiian_language#Macron http://www.omniglot.com/writing/hawaiian.htm
	haw: [
		{ letter: /[\u02bb\u0027\u2019]/g, alternative: "" },
		{ letter: /[\u0101]/g, alternative: "a" },
		{ letter: /[\u0113]/g, alternative: "e" },
		{ letter: /[\u012b]/g, alternative: "i" },
		{ letter: /[\u014d]/g, alternative: "o" },
		{ letter: /[\u016b]/g, alternative: "u" },
		{ letter: /[\u0100]/g, alternative: "A" },
		{ letter: /[\u0112]/g, alternative: "E" },
		{ letter: /[\u012a]/g, alternative: "I" },
		{ letter: /[\u014c]/g, alternative: "O" },
		{ letter: /[\u016a]/g, alternative: "U" }
	],
	// Language: Croatian
	// Sources: https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet https://en.wikipedia.org/wiki/D_with_stroke
	// http://www.omniglot.com/writing/croatian.htm
	hr: [
		{ letter: /[\u010d\u0107]/g, alternative: "c" },
		{ letter: /[\u010c\u0106]/g, alternative: "C" },
		{ letter: /[\u0111]/g, alternative: "dj" },
		{ letter: /[\u0110]/g, alternative: "Dj" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" },
		{ letter: /[\u017e]/g, alternative: "z" },
		{ letter: /[\u017d]/g, alternative: "Z" },
		{ letter: /[\u01c4]/g, alternative: "DZ" },
		{ letter: /[\u01c5]/g, alternative: "Dz" },
		{ letter: /[\u01c6]/g, alternative: "dz" }
	],
	// Language: Georgian
	// The Georgian language does not use capital letters.
	// Sources: https://en.wikipedia.org/wiki/Romanization_of_Georgian (national system)
	ka: [
		{ letter: /[\u10d0]/g, alternative: "a" },
		{ letter: /[\u10d1]/g, alternative: "b" },
		{ letter: /[\u10d2]/g, alternative: "g" },
		{ letter: /[\u10d3]/g, alternative: "d" },
		{ letter: /[\u10d4]/g, alternative: "e" },
		{ letter: /[\u10d5]/g, alternative: "v" },
		{ letter: /[\u10d6]/g, alternative: "z" },
		{ letter: /[\u10d7]/g, alternative: "t" },
		{ letter: /[\u10d8]/g, alternative: "i" },
		{ letter: /[\u10d9]/g, alternative: "k" },
		{ letter: /[\u10da]/g, alternative: "l" },
		{ letter: /[\u10db]/g, alternative: "m" },
		{ letter: /[\u10dc]/g, alternative: "n" },
		{ letter: /[\u10dd]/g, alternative: "o" },
		{ letter: /[\u10de]/g, alternative: "p" },
		{ letter: /[\u10df]/g, alternative: "zh" },
		{ letter: /[\u10e0]/g, alternative: "r" },
		{ letter: /[\u10e1]/g, alternative: "s" },
		{ letter: /[\u10e2]/g, alternative: "t" },
		{ letter: /[\u10e3]/g, alternative: "u" },
		{ letter: /[\u10e4]/g, alternative: "p" },
		{ letter: /[\u10e5]/g, alternative: "k" },
		{ letter: /[\u10e6]/g, alternative: "gh" },
		{ letter: /[\u10e7]/g, alternative: "q" },
		{ letter: /[\u10e8]/g, alternative: "sh" },
		{ letter: /[\u10e9]/g, alternative: "ch" },
		{ letter: /[\u10ea]/g, alternative: "ts" },
		{ letter: /[\u10eb]/g, alternative: "dz" },
		{ letter: /[\u10ec]/g, alternative: "ts" },
		{ letter: /[\u10ed]/g, alternative: "ch" },
		{ letter: /[\u10ee]/g, alternative: "kh" },
		{ letter: /[\u10ef]/g, alternative: "j" },
		{ letter: /[\u10f0]/g, alternative: "h" }
	],
	// Language: Greenlandic.
	// Source: https://en.wikipedia.org/wiki/Greenlandic_language#Orthography
	kal: [
		{ letter: /[\u00E5]/g, alternative: "aa" },
		{ letter: /[\u00C5]/g, alternative: "Aa" },
		{ letter: /[\u00E6\u04D5]/g, alternative: "ae" },
		{ letter: /[\u00C6\u04D4]/g, alternative: "Ae" },
		{ letter: /[\u00C4]/g, alternative: "Ae" },
		{ letter: /[\u00F8]/g, alternative: "oe" },
		{ letter: /[\u00D8]/g, alternative: "Oe" }
		],
	// Language: Kinyarwanda.
	// Source: https://en.wikipedia.org/wiki/Kinyarwanda
	kin: [
		{ letter: /[\u2019\u0027]/g, alternative: "" }
	],
	// Language: Luxembourgish.
	// Source: http://www.omniglot.com/writing/luxembourgish.htm
	lb: [
		{ letter: /[\u00e4]/g, alternative: "a" },
		{ letter: /[\u00c4]/g, alternative: "A" },
		{ letter: /[\u00eb\u00e9]/g, alternative: "e" },
		{ letter: /[\u00cb\u00c9]/g, alternative: "E" }
	],
	// Language: Limburgish.
	// Source: http://www.omniglot.com/writing/limburgish.htm
	li: [
		{ letter: /[\u00e1\u00e2\u00e0\u00e4]/g, alternative: "a" },
		{ letter: /[\u00c1\u00c2\u00c0\u00c4]/g, alternative: "A" },
		{ letter: /[\u00eb\u00e8\u00ea]/g, alternative: "e" },
		{ letter: /[\u00cb\u00c8\u00ca]/g, alternative: "E" },
		{ letter: /[\u00f6\u00f3]/g, alternative: "o" },
		{ letter: /[\u00d6\u00d3]/g, alternative: "O" }
	],
	// Language: Lingala.
	// Sources: https://en.wikipedia.org/wiki/Lingala#Writing_system http://www.omniglot.com/writing/lingala.htm
	lin: [
		{ letter: /[\u00e1\u00e2\u01ce]/g, alternative: "a" },
		{ letter: /[\u00c1\u00c2\u01cd]/g, alternative: "A" },
		{ letter: /\u025b\u0301/g, alternative: "e" },
		{ letter: /\u025b\u0302/g, alternative: "e" },
		{ letter: /\u025b\u030c/g, alternative: "e" },
		{ letter: /[\u00e9\u00ea\u011b\u025b]/g, alternative: "e" },
		{ letter: /\u0190\u0301/g, alternative: "E" },
		{ letter: /\u0190\u0302/g, alternative: "E" },
		{ letter: /\u0190\u030c/g, alternative: "E" },
		{ letter: /[\u00c9\u00ca\u011a\u0190]/g, alternative: "E" },
		{ letter: /[\u00ed\u00ee\u01d0]/g, alternative: "i" },
		{ letter: /[\u00cd\u00ce\u01cf]/g, alternative: "I" },
		{ letter: /\u0254\u0301/g, alternative: "o" },
		{ letter: /\u0254\u0302/g, alternative: "o" },
		{ letter: /\u0254\u030c/g, alternative: "o" },
		{ letter: /[\u00f3\u00f4\u01d2\u0254]/g, alternative: "o" },
		{ letter: /\u0186\u0301/g, alternative: "O" },
		{ letter: /\u0186\u0302/g, alternative: "O" },
		{ letter: /\u0186\u030c/g, alternative: "O" },
		{ letter: /[\u00d3\u00d4\u01d1\u0186]/g, alternative: "O" },
		{ letter: /[\u00fa]/g, alternative: "u" },
		{ letter: /[\u00da]/g, alternative: "U" }
	],
	// Language: Lithuanian.
	// Sources: https://en.wikipedia.org/wiki/Lithuanian_orthography http://www.omniglot.com/writing/lithuanian.htm
	lt: [
		{ letter: /[\u0105]/g, alternative: "a" },
		{ letter: /[\u0104]/g, alternative: "A" },
		{ letter: /[\u010d]/g, alternative: "c" },
		{ letter: /[\u010c]/g, alternative: "C" },
		{ letter: /[\u0119\u0117]/g, alternative: "e" },
		{ letter: /[\u0118\u0116]/g, alternative: "E" },
		{ letter: /[\u012f]/g, alternative: "i" },
		{ letter: /[\u012e]/g, alternative: "I" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" },
		{ letter: /[\u0173\u016b]/g, alternative: "u" },
		{ letter: /[\u0172\u016a]/g, alternative: "U" },
		{ letter: /[\u017e]/g, alternative: "z" },
		{ letter: /[\u017d]/g, alternative: "Z" }
	],
	// Language: Malagasy.
	// Source: http://www.omniglot.com/writing/malagasy.htm
	mg: [
		{ letter: /[\u00f4]/g, alternative: "ao" },
		{ letter: /[\u00d4]/g, alternative: "Ao" }
	],
	// Language: Macedonian.
	// Source: http://www.omniglot.com/writing/macedonian.htm
	mk: [
		{ letter: /[\u0430]/g, alternative: "a" },
		{ letter: /[\u0410]/g, alternative: "A" },
		{ letter: /[\u0431]/g, alternative: "b" },
		{ letter: /[\u0411]/g, alternative: "B" },
		{ letter: /[\u0432]/g, alternative: "v" },
		{ letter: /[\u0412]/g, alternative: "V" },
		{ letter: /[\u0433]/g, alternative: "g" },
		{ letter: /[\u0413]/g, alternative: "G" },
		{ letter: /[\u0434]/g, alternative: "d" },
		{ letter: /[\u0414]/g, alternative: "D" },
		{ letter: /[\u0453]/g, alternative: "gj" },
		{ letter: /[\u0403]/g, alternative: "Gj" },
		{ letter: /[\u0435]/g, alternative: "e" },
		{ letter: /[\u0415]/g, alternative: "E" },
		{ letter: /[\u0436]/g, alternative: "zh" },
		{ letter: /[\u0416]/g, alternative: "Zh" },
		{ letter: /[\u0437]/g, alternative: "z" },
		{ letter: /[\u0417]/g, alternative: "Z" },
		{ letter: /[\u0455]/g, alternative: "dz" },
		{ letter: /[\u0405]/g, alternative: "Dz" },
		{ letter: /[\u0438]/g, alternative: "i" },
		{ letter: /[\u0418]/g, alternative: "I" },
		{ letter: /[\u0458]/g, alternative: "j" },
		{ letter: /[\u0408]/g, alternative: "J" },
		{ letter: /[\u043A]/g, alternative: "k" },
		{ letter: /[\u041A]/g, alternative: "K" },
		{ letter: /[\u043B]/g, alternative: "l" },
		{ letter: /[\u041B]/g, alternative: "L" },
		{ letter: /[\u0459]/g, alternative: "lj" },
		{ letter: /[\u0409]/g, alternative: "Lj" },
		{ letter: /[\u043C]/g, alternative: "m" },
		{ letter: /[\u041C]/g, alternative: "M" },
		{ letter: /[\u043D]/g, alternative: "n" },
		{ letter: /[\u041D]/g, alternative: "N" },
		{ letter: /[\u045A]/g, alternative: "nj" },
		{ letter: /[\u040A]/g, alternative: "Nj" },
		{ letter: /[\u043E]/g, alternative: "o" },
		{ letter: /[\u041E]/g, alternative: "O" },
		{ letter: /[\u0440]/g, alternative: "r" },
		{ letter: /[\u0420]/g, alternative: "R" },
		{ letter: /[\u043F]/g, alternative: "p" },
		{ letter: /[\u041F]/g, alternative: "P" },
		{ letter: /[\u0441]/g, alternative: "s" },
		{ letter: /[\u0421]/g, alternative: "S" },
		{ letter: /[\u0442]/g, alternative: "t" },
		{ letter: /[\u0422]/g, alternative: "T" },
		{ letter: /[\u045C]/g, alternative: "kj" },
		{ letter: /[\u040C]/g, alternative: "Kj" },
		{ letter: /[\u0443]/g, alternative: "u" },
		{ letter: /[\u0423]/g, alternative: "U" },
		{ letter: /[\u0444]/g, alternative: "f" },
		{ letter: /[\u0424]/g, alternative: "F" },
		{ letter: /[\u0445]/g, alternative: "h" },
		{ letter: /[\u0425]/g, alternative: "H" },
		{ letter: /[\u0446]/g, alternative: "c" },
		{ letter: /[\u0426]/g, alternative: "C" },
		{ letter: /[\u0447]/g, alternative: "ch" },
		{ letter: /[\u0427]/g, alternative: "Ch" },
		{ letter: /[\u045F]/g, alternative: "dj" },
		{ letter: /[\u040F]/g, alternative: "Dj" },
		{ letter: /[\u0448]/g, alternative: "sh" },
		{ letter: /[\u0428]/g, alternative: "Sh" }
	],
	// Language: Maori.
	// Source: http://www.omniglot.com/writing/maori.htm
	mri: [
		{ letter: /[\u0101]/g, alternative: "aa" },
		{ letter: /[\u0100]/g, alternative: "Aa" },
		{ letter: /[\u0113]/g, alternative: "ee" },
		{ letter: /[\u0112]/g, alternative: "Ee" },
		{ letter: /[\u012b]/g, alternative: "ii" },
		{ letter: /[\u012a]/g, alternative: "Ii" },
		{ letter: /[\u014d]/g, alternative: "oo" },
		{ letter: /[\u014c]/g, alternative: "Oo" },
		{ letter: /[\u016b]/g, alternative: "uu" },
		{ letter: /[\u016a]/g, alternative: "Uu" }
	],
	// Language: Mirandese.
	// Source: http://www.omniglot.com/writing/mirandese.htm
	mwl: [
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00e1]/g, alternative: "a" },
		{ letter: /[\u00c1]/g, alternative: "A" },
		{ letter: /[\u00e9\u00ea]/g, alternative: "e" },
		{ letter: /[\u00c9\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ed]/g, alternative: "i" },
		{ letter: /[\u00cd]/g, alternative: "I" },
		{ letter: /[\u00f3\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d3\u00d4]/g, alternative: "O" },
		{ letter: /[\u00fa\u0169]/g, alternative: "u" },
		{ letter: /[\u00da\u0168]/g, alternative: "U" }
	],
	// Language: Occitan.
	// Sources: http://www.omniglot.com/writing/oromo.htm https://en.wikipedia.org/wiki/Occitan_alphabet
	oci: [
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00e0\u00e1]/g, alternative: "a" },
		{ letter: /[\u00c0\u00c1]/g, alternative: "A" },
		{ letter: /[\u00e8\u00e9]/g, alternative: "e" },
		{ letter: /[\u00c8\u00c9]/g, alternative: "E" },
		{ letter: /[\u00ed\u00ef]/g, alternative: "i" },
		{ letter: /[\u00cd\u00cf]/g, alternative: "I" },
		{ letter: /[\u00f2\u00f3]/g, alternative: "o" },
		{ letter: /[\u00d2\u00d3]/g, alternative: "O" },
		{ letter: /[\u00fa\u00fc]/g, alternative: "u" },
		{ letter: /[\u00da\u00dc]/g, alternative: "U" },
		{ letter: /[\u00b7]/g, alternative: "" }
	],
	// Language: Oromo.
	// Source: http://www.omniglot.com/writing/occitan.htm
	orm: [
		{ letter: /[\u0027]/g, alternative: "" }
	],
	// Language: Portuguese.
	// Source: https://en.wikipedia.org/wiki/Portuguese_orthography http://www.omniglot.com/writing/portuguese.htm
	pt: [
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00e1\u00e2\u00e3\u00e0]/g, alternative: "a" },
		{ letter: /[\u00c1\u00c2\u00c3\u00c0]/g, alternative: "A" },
		{ letter: /[\u00e9\u00ea]/g, alternative: "e" },
		{ letter: /[\u00c9\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ed]/g, alternative: "i" },
		{ letter: /[\u00cd]/g, alternative: "I" },
		{ letter: /[\u00f3\u00f4\u00f5]/g, alternative: "o" },
		{ letter: /[\u00d3\u00d4\u00d5]/g, alternative: "O" },
		{ letter: /[\u00fa]/g, alternative: "u" },
		{ letter: /[\u00da]/g, alternative: "U" }
	],
	// Language: Romansh Vallader.
	// Source: https://en.wikipedia.org/wiki/Romansh_language#Orthography http://www.omniglot.com/writing/romansh.htm
	roh: [
		{ letter: /[\u00e9\u00e8\u00ea]/g, alternative: "e" },
		{ letter: /[\u00c9\u00c8\u00ca]/g, alternative: "E" },
		{ letter: /[\u00ef]/g, alternative: "i" },
		{ letter: /[\u00cf]/g, alternative: "I" },
		{ letter: /[\u00f6]/g, alternative: "oe" },
		{ letter: /[\u00d6]/g, alternative: "Oe" },
		{ letter: /[\u00fc]/g, alternative: "ue" },
		{ letter: /[\u00dc]/g, alternative: "Ue" },
		{ letter: /[\u00e4]/g, alternative: "ae" },
		{ letter: /[\u00c4]/g, alternative: "Ae" }
	],
	// Language: Aromanian.
	// Sources: https://en.wikipedia.org/wiki/Aromanian_alphabet http://www.omniglot.com/writing/aromanian.htm
	rup: [
		{ letter: /[\u00e3]/g, alternative: "a" },
		{ letter: /[\u00c3]/g, alternative: "A" }
	],
	// Language: Romanian.
	// Sources: http://forum.wordreference.com/threads/romanian-transliteration.3193544/#post-16161251
	// https://en.wikipedia.org/wiki/Romanian_alphabet http://www.omniglot.com/writing/romanian.htm
	ro: [
		{ letter: /[\u0103\u00e2]/g, alternative: "a" },
		{ letter: /[\u0102\u00c2]/g, alternative: "A" },
		{ letter: /[\u00ee]/g, alternative: "i" },
		{ letter: /[\u00ce]/g, alternative: "I" },
		{ letter: /[\u0219\u015f]/g, alternative: "s" },
		{ letter: /[\u0218\u015e]/g, alternative: "S" },
		{ letter: /[\u021b\u0163]/g, alternative: "t" },
		{ letter: /[\u021a\u0162]/g, alternative: "T" }
	],
	// Language: Klingon.
	// Sources: http://www.omniglot.com/conscripts/klingon.htm https://en.wikipedia.org/wiki/Klingon_language#Writing_systems
	// This translation module only works for Klingon written in Latin characters. KLI PlqaD script is not supported yet.
	tlh: [
		{ letter: /[\u2019\u0027]/g, alternative: "" }
	],
	// Language: Slovak.
	// Sources: https://en.wikipedia.org/wiki/Dz_(digraph) https://en.wikipedia.org/wiki/Slovak_orthography
	// http://www.omniglot.com/writing/slovak.htm
	sk: [
		{ letter: /[\u01c4]/g, alternative: "DZ" },
		{ letter: /[\u01c5]/g, alternative: "Dz" },
		{ letter: /[\u01c6]/g, alternative: "dz" },
		{ letter: /[\u00e1\u00e4]/g, alternative: "a" },
		{ letter: /[\u00c1\u00c4]/g, alternative: "A" },
		{ letter: /[\u010d]/g, alternative: "c" },
		{ letter: /[\u010c]/g, alternative: "C" },
		{ letter: /[\u010f]/g, alternative: "d" },
		{ letter: /[\u010e]/g, alternative: "D" },
		{ letter: /[\u00e9]/g, alternative: "e" },
		{ letter: /[\u00c9]/g, alternative: "E" },
		{ letter: /[\u00ed]/g, alternative: "i" },
		{ letter: /[\u00cd]/g, alternative: "I" },
		{ letter: /[\u013e\u013a]/g, alternative: "l" },
		{ letter: /[\u013d\u0139]/g, alternative: "L" },
		{ letter: /[\u0148]/g, alternative: "n" },
		{ letter: /[\u0147]/g, alternative: "N" },
		{ letter: /[\u00f3\u00f4]/g, alternative: "o" },
		{ letter: /[\u00d3\u00d4]/g, alternative: "O" },
		{ letter: /[\u0155]/g, alternative: "r" },
		{ letter: /[\u0154]/g, alternative: "R" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" },
		{ letter: /[\u0165]/g, alternative: "t" },
		{ letter: /[\u0164]/g, alternative: "T" },
		{ letter: /[\u00fa]/g, alternative: "u" },
		{ letter: /[\u00da]/g, alternative: "U" },
		{ letter: /[\u00fd]/g, alternative: "y" },
		{ letter: /[\u00dd]/g, alternative: "Y" },
		{ letter: /[\u017e]/g, alternative: "z" },
		{ letter: /[\u017d]/g, alternative: "Z" }
	],
	// Language: Slovenian.
	// Sources: https://en.wikipedia.org/wiki/Slovene_alphabet http://www.omniglot.com/writing/slovene.htm
	sl: [
		{ letter: /[\u010d\u0107]/g, alternative: "c" },
		{ letter: /[\u010c\u0106]/g, alternative: "C" },
		{ letter: /[\u0111]/g, alternative: "d" },
		{ letter: /[\u0110]/g, alternative: "D" },
		{ letter: /[\u0161]/g, alternative: "s" },
		{ letter: /[\u0160]/g, alternative: "S" },
		{ letter: /[\u017e]/g, alternative: "z" },
		{ letter: /[\u017d]/g, alternative: "Z" },
		{ letter: /[\u00e0\u00e1\u0203\u0201]/g, alternative: "a" },
		{ letter: /[\u00c0\u00c1\u0202\u0200]/g, alternative: "A" },
		{ letter: /[\u00e8\u00e9\u0207\u0205]/g, alternative: "e" },
		{ letter: /\u01dd\u0300/g, alternative: "e" },
		{ letter: /\u01dd\u030f/g, alternative: "e" },
		{ letter: /\u1eb9\u0301/g, alternative: "e" },
		{ letter: /\u1eb9\u0311/g, alternative: "e" },
		{ letter: /[\u00c8\u00c9\u0206\u0204]/g, alternative: "E" },
		{ letter: /\u018e\u030f/g, alternative: "E" },
		{ letter: /\u018e\u0300/g, alternative: "E" },
		{ letter: /\u1eb8\u0311/g, alternative: "E" },
		{ letter: /\u1eb8\u0301/g, alternative: "E" },
		{ letter: /[\u00ec\u00ed\u020b\u0209]/g, alternative: "i" },
		{ letter: /[\u00cc\u00cd\u020a\u0208]/g, alternative: "I" },
		{ letter: /[\u00f2\u00f3\u020f\u020d]/g, alternative: "o" },
		{ letter: /\u1ecd\u0311/g, alternative: "o" },
		{ letter: /\u1ecd\u0301/g, alternative: "o" },
		{ letter: /\u1ecc\u0311/g, alternative: "O" },
		{ letter: /\u1ecc\u0301/g, alternative: "O" },
		{ letter: /[\u00d2\u00d3\u020e\u020c]/g, alternative: "O" },
		{ letter: /[\u00f9\u00fa\u0217\u0215]/g, alternative: "u" },
		{ letter: /[\u00d9\u00da\u0216\u0214]/g, alternative: "U" },
		{ letter: /[\u0155\u0213]/g, alternative: "r" },
		{ letter: /[\u0154\u0212]/g, alternative: "R" }
	],
	// Language: Albanian.
	// Sources: https://en.wikipedia.org/wiki/Albanian_alphabet http://www.omniglot.com/writing/albanian.htm
	sq: [
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00eb]/g, alternative: "e" },
		{ letter: /[\u00cb]/g, alternative: "E" }
	],
	// Language: Hungarian.
	// Sources: http://forum.wordreference.com/threads/hungarian-transliteration.3193022/#post-16166901
	// http://www.omniglot.com/writing/hungarian.htm
	hu: [
		{ letter: /[\u00e1]/g, alternative: "a" },
		{ letter: /[\u00c1]/g, alternative: "A" },
		{ letter: /[\u00e9]/g, alternative: "e" },
		{ letter: /[\u00c9]/g, alternative: "E" },
		{ letter: /[\u00ed]/g, alternative: "i" },
		{ letter: /[\u00cd]/g, alternative: "I" },
		{ letter: /[\u00f3\u00f6\u0151]/g, alternative: "o" },
		{ letter: /[\u00d3\u00d6\u0150]/g, alternative: "O" },
		{ letter: /[\u00fa\u00fc\u0171]/g, alternative: "u" },
		{ letter: /[\u00da\u00dc\u0170]/g, alternative: "U" }
	],
	// Language: Sardinian.
	// Sources: http://www.omniglot.com/writing/sardinian.htm https://en.wikipedia.org/wiki/Sardinian_language
	srd: [
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00e0\u00e1]/g, alternative: "a" },
		{ letter: /[\u00c0\u00c1]/g, alternative: "A" },
		{ letter: /[\u00e8\u00e9]/g, alternative: "e" },
		{ letter: /[\u00c8\u00c9]/g, alternative: "E" },
		{ letter: /[\u00ed\u00ef]/g, alternative: "i" },
		{ letter: /[\u00cd\u00cf]/g, alternative: "I" },
		{ letter: /[\u00f2\u00f3]/g, alternative: "o" },
		{ letter: /[\u00d2\u00d3]/g, alternative: "O" },
		{ letter: /[\u00fa\u00f9]/g, alternative: "u" },
		{ letter: /[\u00da\u00d9]/g, alternative: "U" }
	],
	// Language: Silesian.
	// Source: https://en.wikipedia.org/wiki/Silesian_language#Writing_system
	szl: [
		{ letter: /[\u0107]/g, alternative: "c" },
		{ letter: /[\u0106]/g, alternative: "C" },
		{ letter: /[\u00e3]/g, alternative: "a" },
		{ letter: /[\u00c3]/g, alternative: "A" },
		{ letter: /[\u0142]/g, alternative: "u" },
		{ letter: /[\u0141]/g, alternative: "U" },
		{ letter: /[\u006e]/g, alternative: "n" },
		{ letter: /[\u004e]/g, alternative: "N" },
		{ letter: /[\u014f\u014d\u00f4\u00f5]/g, alternative: "o" },
		{ letter: /[\u014e\u014c\u00d4\u00d5]/g, alternative: "O" },
		{ letter: /[\u015b]/g, alternative: "s" },
		{ letter: /[\u015a]/g, alternative: "S" },
		{ letter: /[\u017a\u017c\u017e]/g, alternative: "z" },
		{ letter: /[\u0179\u017b\u017d]/g, alternative: "Z" },
		{ letter: /[\u016f]/g, alternative: "u" },
		{ letter: /[\u016e]/g, alternative: "U" },
		{ letter: /[\u010d]/g, alternative: "cz" },
		{ letter: /[\u010c]/g, alternative: "Cz" },
		{ letter: /[\u0159]/g, alternative: "rz" },
		{ letter: /[\u0158]/g, alternative: "Rz" },
		{ letter: /[\u0161]/g, alternative: "sz" },
		{ letter: /[\u0160]/g, alternative: "Sz" }
	],
	// Language: Tahitian.
	// Sources: https://en.wikipedia.org/wiki/Tahitian_language#Phonology http://www.omniglot.com/writing/tahitian.htm
	tah: [
		{ letter: /[\u0101\u00e2\u00e0]/g, alternative: "a" },
		{ letter: /[\u0100\u00c2\u00c0]/g, alternative: "A" },
		{ letter: /[\u00ef\u00ee\u00ec]/g, alternative: "i" },
		{ letter: /[\u00cf\u00ce\u00cc]/g, alternative: "I" },
		{ letter: /[\u0113\u00ea\u00e9]/g, alternative: "e" },
		{ letter: /[\u0112\u00ca\u00c9]/g, alternative: "E" },
		{ letter: /[\u016b\u00fb\u00fa]/g, alternative: "u" },
		{ letter: /[\u016a\u00db\u00da]/g, alternative: "U" },
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /[\u00f2\u00f4\u014d]/g, alternative: "o" },
		{ letter: /[\u00d2\u00d4\u014c]/g, alternative: "O" },
		{ letter: /[\u2019\u0027\u2018]/g, alternative: "" }
	],
	// Language: Venetian.
	// Sources: http://www.omniglot.com/writing/venetian.htm https://en.wikipedia.org/wiki/Venetian_language#Spelling_systems
	// http://www.venipedia.org/wiki/index.php?title=Venetian_Language
	vec: [
		{ letter: /\u0073\u002d\u0063/g, alternative: "sc" },
		{ letter: /\u0053\u002d\u0043/g, alternative: "SC" },
		{ letter: /\u0073\u0027\u0063/g, alternative: "sc" },
		{ letter: /\u0053\u0027\u0043/g, alternative: "SC" },
		{ letter: /\u0073\u2019\u0063/g, alternative: "sc" },
		{ letter: /\u0053\u2019\u0043/g, alternative: "SC" },
		{ letter: /\u0073\u2018\u0063/g, alternative: "sc" },
		{ letter: /\u0053\u2018\u0043/g, alternative: "SC" },
		{ letter: /\u0053\u002d\u0063/g, alternative: "Sc" },
		{ letter: /\u0053\u0027\u0063/g, alternative: "Sc" },
		{ letter: /\u0053\u2019\u0063/g, alternative: "Sc" },
		{ letter: /\u0053\u2018\u0063/g, alternative: "Sc" },
		{ letter: /\u0063\u2019/g, alternative: "c" },
		{ letter: /\u0043\u2019/g, alternative: "C" },
		{ letter: /\u0063\u2018/g, alternative: "c" },
		{ letter: /\u0043\u2018/g, alternative: "C" },
		{ letter: /\u0063\u0027/g, alternative: "c" },
		{ letter: /\u0043\u0027/g, alternative: "C" },
		{ letter: /[\u00e0\u00e1\u00e2]/g, alternative: "a" },
		{ letter: /[\u00c0\u00c1\u00c2]/g, alternative: "A" },
		{ letter: /[\u00e8\u00e9]/g, alternative: "e" },
		{ letter: /[\u00c8\u00c9]/g, alternative: "E" },
		{ letter: /[\u00f2\u00f3]/g, alternative: "o" },
		{ letter: /[\u00d2\u00d3]/g, alternative: "O" },
		{ letter: /[\u00f9\u00fa]/g, alternative: "u" },
		{ letter: /[\u00d9\u00da]/g, alternative: "U" },
		{ letter: /[\u00e7\u010d\u010b]/g, alternative: "c" },
		{ letter: /[\u00c7\u010c\u010a]/g, alternative: "C" },
		{ letter: /[\u0142]/g, alternative: "l" },
		{ letter: /[\u00a3\u0141]/g, alternative: "L" },
		{ letter: /\ud835\udeff/g, alternative: "dh" },
		{ letter: /[\u0111\u03b4]/g, alternative: "dh" },
		{ letter: /[\u0110\u0394]/g, alternative: "Dh" }
	],
	// Language: Walloon.
	// Sources: http://www.omniglot.com/writing/walloon.htm https://en.wikipedia.org/wiki/Walloon_alphabet
	wa: [
		{ letter: /[\u00e2\u00e5]/g, alternative: "a" },
		{ letter: /[\u00c2\u00c5]/g, alternative: "A" },
		{ letter: /[\u00e7]/g, alternative: "c" },
		{ letter: /[\u00c7]/g, alternative: "C" },
		{ letter: /\u0065\u030a/g, alternative: "e" },
		{ letter: /\u0045\u030a/g, alternative: "E" },
		{ letter: /[\u00eb\u00ea\u00e8\u00e9]/g, alternative: "e" },
		{ letter: /[\u00c9\u00c8\u00ca\u00cb]/g, alternative: "E" },
		{ letter: /[\u00ee]/g, alternative: "i" },
		{ letter: /[\u00ce]/g, alternative: "I" },
		{ letter: /[\u00f4\u00f6]/g, alternative: "o" },
		{ letter: /[\u00d6\u00d4]/g, alternative: "O" },
		{ letter: /[\u00fb]/g, alternative: "u" },
		{ letter: /[\u00db]/g, alternative: "U" }
	],
	// Language: Yoruba.
	// Sources: http://www.omniglot.com/writing/yoruba.htm https://en.wikipedia.org/wiki/Yoruba_language
	yor: [
		{ letter: /[\u00e1\u00e0]/g, alternative: "a" },
		{ letter: /[\u00c1\u00c0]/g, alternative: "A" },
		{ letter: /[\u00ec\u00ed]/g, alternative: "i" },
		{ letter: /[\u00cc\u00cd]/g, alternative: "I" },
		{ letter: /\u1ecd\u0301/g, alternative: "o" },
		{ letter: /\u1ecc\u0301/g, alternative: "O" },
		{ letter: /\u1ecd\u0300/g, alternative: "o" },
		{ letter: /\u1ecc\u0300/g, alternative: "O" },
		{ letter: /[\u00f3\u00f2\u1ecd]/g, alternative: "o" },
		{ letter: /[\u00d3\u00d2\u1ecc]/g, alternative: "O" },
		{ letter: /[\u00fa\u00f9]/g, alternative: "u" },
		{ letter: /[\u00da\u00d9]/g, alternative: "U" },
		{ letter: /\u1eb9\u0301/g, alternative: "e" },
		{ letter: /\u1eb8\u0301/g, alternative: "E" },
		{ letter: /\u1eb9\u0300/g, alternative: "e" },
		{ letter: /\u1eb8\u0300/g, alternative: "E" },
		{ letter: /[\u00e9\u00e8\u1eb9]/g, alternative: "e" },
		{ letter: /[\u00c9\u00c8\u1eb8]/g, alternative: "E" },
		{ letter: /[\u1e63]/g, alternative: "s" },
		{ letter: /[\u1e62]/g, alternative: "S" }
	]
};

/**
 * The function returning an array containing transliteration objects, based on the given locale.
 *
 * @param {string} locale The locale.
 * @returns {Array} An array containing transliteration objects.
 */
module.exports = function( locale ) {
	if ( isUndefined( locale ) ) {
		return [];
	}
	switch( getLanguage( locale ) ) {
		case "es":
			return transliterations.es;
		case "pl":
			return transliterations.pl;
		case "de":
			return transliterations.de;
		case "nb":
		case "nn":
			return transliterations.nbnn;
		case "sv":
			return transliterations.sv;
		case "fi":
			return transliterations.fi;
		case "da":
			return transliterations.da;
		case "tr":
			return transliterations.tr;
		case "lv":
			return transliterations.lv;
		case "is":
			return transliterations.is;
		case "fa":
			return transliterations.fa;
		case "cs":
			return transliterations.cs;
		case "ru":
			return transliterations.ru;
		case "eo":
			return transliterations.eo;
		case "af":
			return transliterations.af;
		case "bal":
		case "ca":
			return transliterations.ca;
		case "ast":
			return transliterations.ast;
		case "an":
			return transliterations.an;
		case "ay":
			return transliterations.ay;
		case "en":
			return transliterations.en;
		case "fr":
			return transliterations.fr;
		case "it":
			return transliterations.it;
		case "nl":
			return transliterations.nl;
		case "bm":
			return transliterations.bm;
		case "uk":
			return transliterations.uk;
		case "br":
			return transliterations.br;
		case "ch":
			return transliterations.ch;
		case "csb":
			return transliterations.csb;
		case "cy":
			return transliterations.cy;
		case "ee":
			return transliterations.ee;
		case "et":
			return transliterations.et;
		case "eu":
			return transliterations.eu;
		case "fuc":
			return transliterations.fuc;
		case "fj":
			return transliterations.fj;
		case "frp":
			return transliterations.frp;
		case "fur":
			return transliterations.fur;
		case "fy":
			return transliterations.fy;
		case "ga":
			return transliterations.ga;
		case "gd":
			return transliterations.gd;
		case "gl":
			return transliterations.gl;
		case "gn":
			return transliterations.gn;
		case "gsw":
			return transliterations.gsw;
		case "hat":
			return transliterations.hat;
		case "haw":
			return transliterations.haw;
		case "hr":
			return transliterations.hr;
		case "ka":
			return transliterations.ka;
		case "kal":
			return transliterations.kal;
		case "kin":
			return transliterations.kin;
		case "lb":
			return transliterations.lb;
		case "li":
			return transliterations.li;
		case "lin":
			return transliterations.lin;
		case "lt":
			return transliterations.lt;
		case "mg":
			return transliterations.mg;
		case "mk":
			return transliterations.mk;
		case "mri":
			return transliterations.mri;
		case "mwl":
			return transliterations.mwl;
		case "oci":
			return transliterations.oci;
		case "orm":
			return transliterations.orm;
		case "pt":
			return transliterations.pt;
		case "roh":
			return transliterations.roh;
		case "rup":
			return transliterations.rup;
		case "ro":
			return transliterations.ro;
		case "tlh":
			return transliterations.tlh;
		case "sk":
			return transliterations.sk;
		case "sl":
			return transliterations.sl;
		case "sq":
			return transliterations.sq;
		case "hu":
			return transliterations.hu;
		case "srd":
			return transliterations.srd;
		case "szl":
			return transliterations.szl;
		case "tah":
			return transliterations.tah;
		case "vec":
			return transliterations.vec;
		case "wa":
			return transliterations.wa;
		case "yor":
			return transliterations.yor;
		default:
			return [];
	}
};

},{"../helpers/getLanguage.js":297,"lodash/isUndefined":218}],289:[function(require,module,exports){
module.exports = function() {
	return [
		// Whitespace is always a word boundary.
		" ", "\\n", "\\r", "\\t",
		// NO-BREAK SPACE.
		"\u00a0",
		" ",

		".", ",", "'", "(", ")", "\"", "+", "-", ";", "!", "?", ":", "/", "»", "«", "‹", "›", "<", ">" ];
};

},{}],290:[function(require,module,exports){
var Assessor = require( "./assessor.js" );

var fleschReadingEase = require( "./assessments/fleschReadingEaseAssessment.js" );
var paragraphTooLong = require( "./assessments/paragraphTooLongAssessment.js" );
var sentenceLengthInText = require( "./assessments/sentenceLengthInTextAssessment.js" );
var subheadingDistributionTooLong = require( "./assessments/subheadingDistributionTooLongAssessment.js" );
var transitionWords = require( "./assessments/transitionWordsAssessment.js" );
var passiveVoice = require( "./assessments/passiveVoiceAssessment.js" );
var sentenceBeginnings = require( "./assessments/sentenceBeginningsAssessment.js" );
var textPresence = require( "./assessments/textPresenceAssessment.js" );
// var sentenceVariation = require( "./assessments/sentenceVariationAssessment.js" );
// var subHeadingLength = require( "./assessments/getSubheadingLengthAssessment.js" );
// var getSubheadingPresence = require( "./assessments/subheadingPresenceAssessment.js" );
// var wordComplexity = require( "./assessments/wordComplexityAssessment.js" );
// var subheadingDistributionTooShort = require( "./assessments/subheadingDistributionTooShortAssessment.js" );
// var paragraphTooShort = require( "./assessments/paragraphTooShortAssessment.js" );
// var sentenceLengthInDescription = require( "./assessments/sentenceLengthInDescriptionAssessment.js" );

var scoreToRating = require( "./interpreters/scoreToRating" );

var map = require( "lodash/map" );
var sum = require( "lodash/sum" );

/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var ContentAssessor = function ( i18n, options ) {

	Assessor.call( this, i18n, options );

	this._assessments = [
		fleschReadingEase,
		subheadingDistributionTooLong,
		paragraphTooLong,
		sentenceLengthInText,
		transitionWords,
		passiveVoice,
		textPresence,
		sentenceBeginnings
		// sentenceVariation,
		// wordComplexity,
		// subheadingDistributionTooShort,
		// paragraphTooShort
		// sentenceLengthInDescription,
	];
};

require( "util" ).inherits( ContentAssessor, Assessor );

/**
 * Calculates the weighted rating for English languages based on a given rating.
 *
 * @param {number} rating The rating to be weighted.
 * @returns {number} The weighted rating.
 */
ContentAssessor.prototype.calculatePenaltyPointsEnglish = function( rating ) {
	switch ( rating ) {
		case "bad":
			return 3;
		case "ok":
			return 2;
		default:
		case "good":
			return 0;
	}
};

/**
 * Calculates the weighted rating for non-English languages based on a given rating.
 *
 * @param {number} rating The rating to be weighted.
 * @returns {number} The weighted rating.
 */
ContentAssessor.prototype.calculatePenaltyPointsNonEnglish = function( rating ) {
	switch ( rating ) {
		case "bad":
			return 4;
		case "ok":
			return 2;
		default:
		case "good":
			return 0;
	}
};

/**
 * Calculates the penalty points based on the assessment results.
 *
 * @returns {number} The total penalty points for the results.
 */
ContentAssessor.prototype.calculatePenaltyPoints = function () {
	var results = this.getValidResults();

	var penaltyPoints = map( results, function ( result ) {
		var rating = scoreToRating( result.getScore() );

		if ( this.getPaper().getLocale().indexOf( "en_" ) > -1 ) {
			return this.calculatePenaltyPointsEnglish( rating );
		}

		return this.calculatePenaltyPointsNonEnglish( rating );
	}.bind( this ) );

	return sum( penaltyPoints );
};

/**
 * Rates the penalty points
 *
 * @param {number} totalPenaltyPoints The amount of penalty points.
 * @returns {number} The score based on the amount of penalty points.
 *
 * @private
 */
ContentAssessor.prototype._ratePenaltyPoints = function ( totalPenaltyPoints ) {
	if ( this.getValidResults().length === 1 ) {
		// If we have only 1 result, we only have a "no content" result
		return 30;
	}

	if ( this.getPaper().getLocale().indexOf( "en_" ) > -1 ) {
		// Determine the total score based on the total penalty points.
		if ( totalPenaltyPoints > 6 ) {
			// A red indicator.
			return 30;
		}

		if ( totalPenaltyPoints > 4 ) {
			// An orange indicator.
			return 60;
		}
	} else {
		if ( totalPenaltyPoints > 4 ) {
			// A red indicator.
			return 30;
		}

		if ( totalPenaltyPoints > 2 ) {
			// An orange indicator.
			return 60;
		}
	}
	// A green indicator.
	return 90;
};

/**
 * Calculates the overall score based on the assessment results.
 *
 * @returns {number} The overall score.
 */
ContentAssessor.prototype.calculateOverallScore = function () {
	var results = this.getValidResults();

	// If you have no content, you have a red indicator.
	if ( results.length === 0 ) {
		return 30;
	}

	var totalPenaltyPoints = this.calculatePenaltyPoints();

	return this._ratePenaltyPoints( totalPenaltyPoints );
};

module.exports = ContentAssessor;


},{"./assessments/fleschReadingEaseAssessment.js":255,"./assessments/paragraphTooLongAssessment.js":263,"./assessments/passiveVoiceAssessment.js":264,"./assessments/sentenceBeginningsAssessment.js":265,"./assessments/sentenceLengthInTextAssessment.js":266,"./assessments/subheadingDistributionTooLongAssessment.js":267,"./assessments/textPresenceAssessment.js":274,"./assessments/transitionWordsAssessment.js":276,"./assessor.js":280,"./interpreters/scoreToRating":302,"lodash/map":221,"lodash/sum":234,"util":251}],291:[function(require,module,exports){
/**
 * Throws an invalid type error
 * @param {string} message The message to show when the error is thrown
 * @returns {void}
 */
module.exports = function InvalidTypeError( message ) {
	Error.captureStackTrace( this, this.constructor );
	this.name = this.constructor.name;
	this.message = message;
};

require( "util" ).inherits( module.exports, Error );

},{"util":251}],292:[function(require,module,exports){
module.exports = function MissingArgumentError( message ) {
	Error.captureStackTrace( this, this.constructor );
	this.name = this.constructor.name;
	this.message = message;
};

require( "util" ).inherits( module.exports, Error );

},{"util":251}],293:[function(require,module,exports){
var forEach = require( "lodash/forEach" );

/**
 * Adds a class to an element
 *
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 * @returns {void}
 */
var addClass = function( element, className ) {
	var classes = element.className.split( " " );

	if ( -1 === classes.indexOf( className ) ) {
		classes.push( className );
	}

	element.className = classes.join( " " );
};

/**
 * Removes a class from an element
 *
 * @param {HTMLElement} element The element to remove the class from.
 * @param {string} className The class to remove.
 * @returns {void}
 */
var removeClass = function( element, className ) {
	var classes = element.className.split( " " );
	var foundClass = classes.indexOf( className );

	if ( -1 !== foundClass ) {
		classes.splice( foundClass, 1 );
	}

	element.className = classes.join( " " );
};

/**
 * Removes multiple classes from an element
 *
 * @param {HTMLElement} element The element to remove the classes from.
 * @param {Array} classes A list of classes to remove
 * @returns {void}
 */
var removeClasses = function( element, classes ) {
	forEach( classes, this.removeClass.bind( null, element ) );
};

/**
 * Checks whether an element has a specific class.
 *
 * @param {HTMLElement} element The element to check for the class.
 * @param {string} className The class to look for.
 * @returns {boolean} Whether or not the class is present.
 */
var hasClass = function( element, className ) {
	return element.className.indexOf( className ) > -1;
};

module.exports = {
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	removeClasses: removeClasses
};

},{"lodash/forEach":194}],294:[function(require,module,exports){
var isUndefined = require( "lodash/isUndefined" );

/**
 * Shows and error trace of the error message in the console if the console is available.
 *
 * @param {string} [errorMessage=""] The error message.
 */
function showTrace( errorMessage ) {
	if ( isUndefined( errorMessage ) ) {
		errorMessage = "";
	}

	if (
		!isUndefined( console ) &&
		!isUndefined( console.trace )
	) {
		console.trace( errorMessage );
	}
}

module.exports = {
	showTrace: showTrace
};

},{"lodash/isUndefined":218}],295:[function(require,module,exports){
/**
 * Returns rounded number to fix floating point bug http://floating-point-gui.de
 * @param {number} number The unrounded number
 * @returns {number} Rounded number
 */
module.exports = function ( number ) {

	if ( Math.round( number ) === number ) {
		return Math.round( number );
	}

	return Math.round( number * 10 ) / 10;
};

},{}],296:[function(require,module,exports){
var firstWordExceptionsEnglish = require( "../researches/english/firstWordExceptions.js" );
var firstWordExceptionsGerman = require( "../researches/german/firstWordExceptions.js" );
var firstWordExceptionsSpanish = require( "../researches/spanish/firstWordExceptions.js" );
var firstWordExceptionsFrench = require( "../researches/french/firstWordExceptions.js" );

var getLanguage = require( "./getLanguage.js" );

module.exports = function( locale ) {
	switch( getLanguage( locale ) ) {
		case "de":
			return firstWordExceptionsGerman;
		case "fr":
			return firstWordExceptionsFrench;
		case "es":
			return firstWordExceptionsSpanish;
		default:
		case "en":
			return firstWordExceptionsEnglish;
	}
};

},{"../researches/english/firstWordExceptions.js":313,"../researches/french/firstWordExceptions.js":324,"../researches/german/firstWordExceptions.js":327,"../researches/spanish/firstWordExceptions.js":348,"./getLanguage.js":297}],297:[function(require,module,exports){
/**
 * The function getting the language part of the locale.
 *
 * @param {string} locale The locale.
 * @returns {string} The language part of the locale.
 */
module.exports = function ( locale ) {
	return locale.split( "_" )[ 0 ];
};

},{}],298:[function(require,module,exports){
var transitionWordsEnglish = require( "../researches/english/transitionWords.js" );
var twoPartTransitionWordsEnglish = require( "../researches/english/twoPartTransitionWords.js" );
var transitionWordsGerman = require( "../researches/german/transitionWords.js" );
var twoPartTransitionWordsGerman = require( "../researches/german/twoPartTransitionWords.js" );
var transitionWordsFrench = require( "../researches/french/transitionWords.js" );
var twoPartTransitionWordsFrench = require( "../researches/french/twoPartTransitionWords.js" );
var transitionWordsSpanish = require( "../researches/spanish/transitionWords.js" );
var twoPartTransitionWordsSpanish = require( "../researches/spanish/twoPartTransitionWords.js" );

var getLanguage = require( "./getLanguage.js" );

module.exports = function( locale ) {
	switch( getLanguage( locale ) ) {
		case "de":
			return {
				transitionWords: transitionWordsGerman,
				twoPartTransitionWords: twoPartTransitionWordsGerman
			};
		case "es":
			return {
				transitionWords: transitionWordsSpanish,
				twoPartTransitionWords: twoPartTransitionWordsSpanish
			};
		case "fr":
			return {
				transitionWords: transitionWordsFrench,
				twoPartTransitionWords: twoPartTransitionWordsFrench
			};
		default:
		case "en":
			return {
				transitionWords: transitionWordsEnglish,
				twoPartTransitionWords: twoPartTransitionWordsEnglish
			};
	}
};

},{"../researches/english/transitionWords.js":319,"../researches/english/twoPartTransitionWords.js":320,"../researches/french/transitionWords.js":325,"../researches/french/twoPartTransitionWords.js":326,"../researches/german/transitionWords.js":328,"../researches/german/twoPartTransitionWords.js":329,"../researches/spanish/transitionWords.js":349,"../researches/spanish/twoPartTransitionWords.js":350,"./getLanguage.js":297}],299:[function(require,module,exports){
var blockElements = [ "address", "article", "aside", "blockquote", "canvas", "dd", "div", "dl", "fieldset", "figcaption",
	"figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "hr", "li", "main", "nav",
	"noscript", "ol", "output", "p", "pre", "section", "table", "tfoot", "ul", "video" ];
var inlineElements = [ "b", "big", "i", "small", "tt", "abbr", "acronym", "cite", "code", "dfn", "em", "kbd", "strong",
	"samp", "time", "var", "a", "bdo", "br", "img", "map", "object", "q", "script", "span", "sub", "sup", "button",
	"input", "label", "select", "textarea" ];

var blockElementsRegex = new RegExp( "^(" + blockElements.join( "|" ) + ")$", "i" );
var inlineElementsRegex = new RegExp( "^(" + inlineElements.join( "|" ) + ")$", "i" );

var blockElementStartRegex = new RegExp( "^<(" + blockElements.join( "|" ) + ")[^>]*?>$", "i" );
var blockElementEndRegex = new RegExp( "^</(" + blockElements.join( "|" ) + ")[^>]*?>$", "i" );

var inlineElementStartRegex = new RegExp( "^<(" + inlineElements.join( "|" ) + ")[^>]*>$", "i" );
var inlineElementEndRegex = new RegExp( "^</(" + inlineElements.join( "|" ) + ")[^>]*>$", "i" );

var otherElementStartRegex = /^<([^>\s\/]+)[^>]*>$/;
var otherElementEndRegex = /^<\/([^>\s]+)[^>]*>$/;

var contentRegex = /^[^<]+$/;
var greaterThanContentRegex = /^<[^><]*$/;

var commentRegex = /<!--(.|[\r\n])*?-->/g;

var core = require( "tokenizer2/core" );
var forEach = require( "lodash/forEach" );
var memoize = require( "lodash/memoize" );

var tokens = [];
var htmlBlockTokenizer;

/**
 * Creates a tokenizer to tokenize HTML into blocks.
 */
function createTokenizer() {
	tokens = [];

	htmlBlockTokenizer = core( function( token ) {
		tokens.push( token );
	} );

	htmlBlockTokenizer.addRule( contentRegex, "content" );
	htmlBlockTokenizer.addRule( greaterThanContentRegex, "greater-than-sign-content" );

	htmlBlockTokenizer.addRule( blockElementStartRegex, "block-start" );
	htmlBlockTokenizer.addRule( blockElementEndRegex, "block-end" );
	htmlBlockTokenizer.addRule( inlineElementStartRegex, "inline-start" );
	htmlBlockTokenizer.addRule( inlineElementEndRegex, "inline-end" );

	htmlBlockTokenizer.addRule( otherElementStartRegex, "other-element-start" );
	htmlBlockTokenizer.addRule( otherElementEndRegex, "other-element-end" );
}

/**
 * Returns whether or not the given element name is a block element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is a block element.
 */
function isBlockElement( htmlElementName ) {
	return blockElementsRegex.test( htmlElementName );
}

/**
 * Returns whether or not the given element name is an inline element.
 *
 * @param {string} htmlElementName The name of the HTML element.
 * @returns {boolean} Whether or not it is an inline element.
 */
function isInlineElement( htmlElementName ) {
	return inlineElementsRegex.test( htmlElementName );
}

/**
 * Splits a text into blocks based on HTML block elements.
 *
 * @param {string} text The text to split.
 * @returns {Array} A list of blocks based on HTML block elements.
 */
function getBlocks( text ) {
	var blocks = [], depth = 0,
		blockStartTag = "",
		currentBlock = "",
		blockEndTag = "";

	// Remove all comments because it is very hard to tokenize them.
	text = text.replace( commentRegex, "" );

	createTokenizer();
	htmlBlockTokenizer.onText( text );

	htmlBlockTokenizer.end();

	forEach( tokens, function( token, i ) {
		var nextToken = tokens[ i + 1 ];

		switch ( token.type ) {

			case "content":
			case "greater-than-sign-content":
			case "inline-start":
			case "inline-end":
			case "other-tag":
			case "other-element-start":
			case "other-element-end":
			case "greater than sign":
				if ( !nextToken || ( depth === 0 && ( nextToken.type === "block-start" || nextToken.type === "block-end" ) ) ) {
					currentBlock += token.src;

					blocks.push( currentBlock );
					blockStartTag = "";
					currentBlock = "";
					blockEndTag = "";
				} else {
					currentBlock += token.src;
				}
				break;

			case "block-start":
				if ( depth !== 0 ) {
					if ( currentBlock.trim() !== "" ) {
						blocks.push( currentBlock );
					}
					currentBlock = "";
					blockEndTag = "";
				}

				depth++;
				blockStartTag = token.src;
				break;

			case "block-end":
				depth--;
				blockEndTag = token.src;

				/*
				 * We try to match the most deep blocks so discard any other blocks that have been started but not
				 * finished.
				 */
				if ( "" !== blockStartTag && "" !== blockEndTag ) {
					blocks.push( blockStartTag + currentBlock + blockEndTag );
				} else if ( "" !== currentBlock.trim() ) {
					blocks.push( currentBlock );
				}
				blockStartTag = "";
				currentBlock = "";
				blockEndTag = "";
				break;
		}

		// Handles HTML with too many closing tags.
		if ( depth < 0 ) {
			depth = 0;
		}
	} );

	return blocks;
}

module.exports = {
	blockElements: blockElements,
	inlineElements: inlineElements,
	isBlockElement: isBlockElement,
	isInlineElement: isInlineElement,
	getBlocks: memoize( getBlocks )
};

},{"lodash/forEach":194,"lodash/memoize":222,"tokenizer2/core":247}],300:[function(require,module,exports){
/**
 * Checks if `n` is between `start` and up to, but not including, `start`.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function inRangeEndInclusive( number, start, end ) {
	return number > start && number <= end;
}

/**
 * Checks if `n` is between `start` and up to, but not including, `end`.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function inRangeStartInclusive( number, start, end ) {
	return number >= start && number < end;
}

/**
 * Checks if `n` is between `start` and up to, but not including, `start`.
 *
 * @param {number} number The number to check.
 * @param {number} start The start of the range.
 * @param {number} end The end of the range.
 * @returns {boolean} Returns `true` if `number` is in the range, else `false`.
 */
function inRange( number, start, end ) {
	return inRangeEndInclusive( number, start, end );
}

module.exports = {
	inRange: inRange,
	inRangeStartInclusive: inRangeStartInclusive,
	inRangeEndInclusive: inRangeEndInclusive
};

},{}],301:[function(require,module,exports){
/**
 * Returns true or false, based on the length of the value text and the recommended value.
 *
 * @param {number} recommendedValue The recommended value.
 * @param {number} valueLength      The length of the value to check.
 * @returns {boolean} True if the length is greater than the recommendedValue, false if it is smaller.
 */
module.exports = function( recommendedValue, valueLength ) {
	return valueLength > recommendedValue;
};

},{}],302:[function(require,module,exports){
/**
 * Interpreters a score and gives it a particular rating.
 *
 * @param {Number} score The score to interpreter.
 * @returns {string} The rating, given based on the score.
 */
var ScoreToRating = function( score ) {

	if ( score === 0 ) {
		return "feedback";
	}

	if ( score <= 4 ) {
		return "bad";
	}

	if ( score > 4 && score <= 7 ) {
		return "ok";
	}

	if ( score > 7 ) {
		return "good";
	}

	return "";
};

module.exports = ScoreToRating;

},{}],303:[function(require,module,exports){
/**
 * Marks a text with HTML tags
 *
 * @param {string} text The unmarked text.
 * @returns {string} The marked text.
 */
module.exports = function( text ) {
	return "<yoastmark class='yoast-text-mark'>" + text + "</yoastmark>";
};

},{}],304:[function(require,module,exports){
var uniqBy = require( "lodash/uniqBy" );

/**
 * Removes duplicate marks from an array
 *
 * @param {Array} marks The marks to remove duplications from
 * @returns {Array} A list of de-duplicated marks.
 */
function removeDuplicateMarks( marks ) {
	return uniqBy( marks, function( mark ) {
		return mark.getOriginal();
	} );
}

module.exports = removeDuplicateMarks;

},{"lodash/uniqBy":241}],305:[function(require,module,exports){
/**
 * Removes all marks from a text
 *
 * @param {string} text The marked text.
 * @returns {string} The unmarked text.
 */
module.exports = function( text ) {
	return text
		.replace( new RegExp( "<yoastmark[^>]*>", "g" ), "" )
		.replace( new RegExp( "</yoastmark>", "g" ), "" );
};

},{}],306:[function(require,module,exports){
/* global console: true */
/* global setTimeout: true */
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var reduce = require( "lodash/reduce" );
var isString = require( "lodash/isString" );
var isObject = require( "lodash/isObject" );
var InvalidTypeError = require( "./errors/invalidType" );

/**
 * The plugins object takes care of plugin registrations, preloading and managing data modifications.
 *
 * A plugin for YoastSEO.js is basically a piece of JavaScript that hooks into YoastSEO.js by registering modifications.
 * In order to do so, it must first register itself as a plugin with YoastSEO.js. To keep our content analysis fast, we
 * don't allow asynchronous modifications. That's why we require plugins to preload all data they need in order to modify
 * the content. If plugins need to preload data, they can first register, then preload using AJAX and call `ready` once
 * preloaded.
 *
 * To minimize client side memory usage, we request plugins to preload as little data as possible. If you need to dynamically
 * fetch more data in the process of content creation, you can reload your data set and let YoastSEO.js know you've reloaded
 * by calling `reloaded`.
 *
 * @todo: add list of supported modifications and compare on registration of modification
 */

/**
 * Setup Pluggable and set its default values.
 *
 * @constructor
 * @param       {App}       app                 The App object to attach to.
 * @property    {number}    preloadThreshold	The maximum time plugins are allowed to preload before we load our content analysis.
 * @property    {object}    plugins             The plugins that have been registered.
 * @property    {object}    modifications 	    The modifications that have been registered. Every modification contains an array with callables.
 * @property    {Array}     customTests         All tests added by plugins.
 */
var Pluggable = function( app ) {
	this.app = app;
	this.loaded = false;
	this.preloadThreshold = 3000;
	this.plugins = {};
	this.modifications = {};
	this.customTests = [];

	// Allow plugins 1500 ms to register before we start polling their
	setTimeout( this._pollLoadingPlugins.bind( this ), 1500 );
};

//  ***** DSL IMPLEMENTATION ***** //

/**
 * Register a plugin with YoastSEO. A plugin can be declared "ready" right at registration or later using `this.ready`.
 *
 * @param {string}  pluginName      The name of the plugin to be registered.
 * @param {object}  options         The options passed by the plugin.
 * @param {string}  options.status  The status of the plugin being registered. Can either be "loading" or "ready".
 * @returns {boolean}               Whether or not the plugin was successfully registered.
 */
Pluggable.prototype._registerPlugin = function( pluginName, options ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register plugin. Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( !isUndefined( options ) && typeof options !== "object" ) {
		console.error( "Failed to register plugin " + pluginName + ". Expected parameters `options` to be a object." );
		return false;
	}

	if ( this._validateUniqueness( pluginName ) === false ) {
		console.error( "Failed to register plugin. Plugin with name " + pluginName + " already exists" );
		return false;
	}

	this.plugins[ pluginName ] = options;

	return true;
};

/**
 * Declare a plugin "ready". Use this if you need to preload data with AJAX.
 *
 * @param {string} pluginName	The name of the plugin to be declared as ready.
 * @returns {boolean}           Whether or not the plugin was successfully declared ready.
 */
Pluggable.prototype._ready = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( isUndefined( this.plugins[ pluginName ] ) ) {
		console.error( "Failed to modify status for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

	this.plugins[ pluginName ].status = "ready";

	return true;
};

/**
 * Used to declare a plugin has been reloaded. If an analysis is currently running. We will reset it to ensure running the latest modifications.
 *
 * @param {string} pluginName   The name of the plugin to be declared as reloaded.
 * @returns {boolean}           Whether or not the plugin was successfully declared as reloaded.
 */
Pluggable.prototype._reloaded = function( pluginName ) {
	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to reload Content Analysis for " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	if ( isUndefined( this.plugins[ pluginName ] ) ) {
		console.error( "Failed to reload Content Analysis for plugin " + pluginName + ". The plugin was not properly registered." );
		return false;
	}

	this.app.refresh();
	return true;
};

/**
 * Enables hooking a callable to a specific data filter supported by YoastSEO. Can only be performed for plugins that have finished loading.
 *
 * @param {string}      modification	The name of the filter
 * @param {function}    callable 	    The callable
 * @param {string}      pluginName 	    The plugin that is registering the modification.
 * @param {number}      priority	    (optional) Used to specify the order in which the callables associated with a particular filter are called.
 * 									    Lower numbers correspond with earlier execution.
 * @returns {boolean}                   Whether or not applying the hook was successfull.
 */
Pluggable.prototype._registerModification = function( modification, callable, pluginName, priority ) {
	if ( typeof modification !== "string" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `modification` to be a string." );
		return false;
	}

	if ( typeof callable !== "function" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `callable` to be a function." );
		return false;
	}

	if ( typeof pluginName !== "string" ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". Expected parameter `pluginName` to be a string." );
		return false;
	}

	// Validate origin
	if ( this._validateOrigin( pluginName ) === false ) {
		console.error( "Failed to register modification for plugin " + pluginName + ". The integration has not finished loading yet." );
		return false;
	}

	// Default priority to 10
	var prio = typeof priority === "number" ?  priority : 10;

	var callableObject = {
		callable: callable,
		origin: pluginName,
		priority: prio
	};

	// Make sure modification is defined on modifications object
	if ( isUndefined( this.modifications[ modification ] ) ) {
		this.modifications[ modification ] = [];
	}

	this.modifications[ modification ].push( callableObject );

	return true;
};

/**
 * Register test for a specific plugin
 *
 * @deprecated
 */
Pluggable.prototype._registerTest = function() {
	console.error( "This function is deprecated, please use _registerAssessment" );
};

/**
 * Register an assessment for a specific plugin
 *
 * @param {object} assessor The assessor object where the assessments needs to be added.
 * @param {string} name The name of the assessment.
 * @param {function} assessment The function to run as an assessment.
 * @param {string} pluginName The name of the plugin associated with the assessment.
 * @returns {boolean} Whether registering the assessment was successful.
 * @private
 */
Pluggable.prototype._registerAssessment = function( assessor, name, assessment, pluginName ) {
	if ( !isString( name ) ) {
		throw new InvalidTypeError( "Failed to register test for plugin " + pluginName + ". Expected parameter `name` to be a string." );
	}

	if ( !isObject( assessment ) ) {
		throw new InvalidTypeError( "Failed to register assessment for plugin " + pluginName +
			". Expected parameter `assessment` to be a function." );
	}

	if ( !isString( pluginName ) ) {
		throw new InvalidTypeError( "Failed to register assessment for plugin " + pluginName +
			". Expected parameter `pluginName` to be a string." );
	}

	// Prefix the name with the pluginName so the test name is always unique.
	name = pluginName + "-" + name;

	assessor.addAssessment( name, assessment );

	return true;
};

// ***** PRIVATE HANDLERS *****//

/**
 * Poller to handle loading of plugins. Plugins can register with our app to let us know they are going to hook into our Javascript. They are allowed
 * 5 seconds of pre-loading time to fetch all the data they need to be able to perform their data modifications. We will only apply data modifications
 * from plugins that have declared ready within the pre-loading time in order to safeguard UX and data integrity.
 *
 * @param   {number} pollTime (optional) The accumulated time to compare with the pre-load threshold.
 * @returns {void}
 * @private
 */
Pluggable.prototype._pollLoadingPlugins = function( pollTime ) {
	pollTime = isUndefined( pollTime ) ? 0 : pollTime;
	if ( this._allReady() === true ) {
		this.loaded = true;
		this.app.pluginsLoaded();
	} else if ( pollTime >= this.preloadThreshold ) {
		this._pollTimeExceeded();
	} else {
		pollTime += 50;
		setTimeout( this._pollLoadingPlugins.bind( this, pollTime ), 50 );
	}
};

/**
 * Checks if all registered plugins have finished loading
 *
 * @returns {boolean} Whether or not all registered plugins are loaded.
 * @private
 */
Pluggable.prototype._allReady = function() {
	return reduce( this.plugins, function( allReady, plugin ) {
		return allReady && plugin.status === "ready";
	}, true );
};

/**
 * Removes the plugins that were not loaded within time and calls `pluginsLoaded` on the app.
 *
 * @returns {void}
 * @private
 */
Pluggable.prototype._pollTimeExceeded = function() {
	forEach( this.plugins, function( plugin, pluginName ) {
		if ( !isUndefined( plugin.options ) && plugin.options.status !== "ready" ) {
			console.error( "Error: Plugin " + pluginName + ". did not finish loading in time." );
			delete this.plugins[ pluginName ];
		}
	} );
	this.loaded = true;
	this.app.pluginsLoaded();
};

/**
 * Calls the callables added to a modification hook. See the YoastSEO.js Readme for a list of supported modification hooks.
 *
 * @param	{string}    modification	The name of the filter
 * @param   {*}         data 		    The data to filter
 * @param   {*}         context		    (optional) Object for passing context parameters to the callable.
 * @returns {*} 		                The filtered data
 * @private
 */
Pluggable.prototype._applyModifications = function( modification, data, context ) {
	var callChain = this.modifications[ modification ];

	if ( callChain instanceof Array && callChain.length > 0 ) {
		callChain = this._stripIllegalModifications( callChain );

		callChain.sort( function( a, b ) {
			return a.priority - b.priority;
		} );
		forEach( callChain, function( callableObject ) {
			var callable = callableObject.callable;
			var newData = callable( data, context );
			if ( typeof newData === typeof data ) {
				data = newData;
			} else {
				console.error( "Modification with name " + modification + " performed by plugin with name " +
				callableObject.origin +
				" was ignored because the data that was returned by it was of a different type than the data we had passed it." );
			}
		} );
	}
	return data;

};

/**
 * Adds new tests to the analyzer and it's scoring object.
 *
 * @param {YoastSEO.Analyzer} analyzer The analyzer object to add the tests to
 * @returns {void}
 * @private
 */
Pluggable.prototype._addPluginTests = function( analyzer ) {
	this.customTests.map( function( customTest ) {
		this._addPluginTest( analyzer, customTest );
	}, this );
};

/**
 * Adds one new test to the analyzer and it's scoring object.
 *
 * @param {YoastSEO.Analyzer} analyzer              The analyzer that the test will be added to.
 * @param {Object}            pluginTest            The test to be added.
 * @param {string}            pluginTest.name       The name of the test.
 * @param {function}          pluginTest.callable   The function associated with the test.
 * @param {function}          pluginTest.analysis   The function associated with the analyzer.
 * @param {Object}            pluginTest.scoring    The scoring object to be used.
 * @returns {void}
 * @private
 */
Pluggable.prototype._addPluginTest = function( analyzer, pluginTest ) {
	analyzer.addAnalysis( {
		"name": pluginTest.name,
		"callable": pluginTest.analysis
	} );

	analyzer.analyzeScorer.addScoring( {
		"name": pluginTest.name,
		"scoring": pluginTest.scoring
	} );
};

/**
 * Strips modifications from a callChain if they were not added with a valid origin.
 *
 * @param   {Array} callChain	 The callChain that contains items with possible invalid origins.
 * @returns {Array} callChain 	 The stripped version of the callChain.
 * @private
 */
Pluggable.prototype._stripIllegalModifications = function( callChain ) {
	forEach( callChain, function( callableObject, index ) {
		if ( this._validateOrigin( callableObject.origin ) === false ) {
			delete callChain[ index ];
		}
	}.bind( this ) );

	return callChain;
};

/**
 * Validates if origin of a modification has been registered and finished preloading.
 *
 * @param 	{string}    pluginName      The name of the plugin that needs to be validated.
 * @returns {boolean}                   Whether or not the origin is valid.
 * @private
 */
Pluggable.prototype._validateOrigin = function( pluginName ) {
	if ( this.plugins[ pluginName ].status !== "ready" ) {
		return false;
	}
	return true;
};

/**
 * Validates if registered plugin has a unique name.
 *
 * @param 	{string}    pluginName      The name of the plugin that needs to be validated for uniqueness.
 * @returns {boolean}                   Whether or not the plugin has a unique name.
 * @private
 */
Pluggable.prototype._validateUniqueness = function( pluginName ) {
	if ( !isUndefined( this.plugins[ pluginName ] ) ) {
		return false;
	}
	return true;
};

module.exports = Pluggable;

},{"./errors/invalidType":291,"lodash/forEach":194,"lodash/isObject":212,"lodash/isString":215,"lodash/isUndefined":218,"lodash/reduce":230}],307:[function(require,module,exports){
/* jshint browser: true */

var forEach = require( "lodash/forEach" );
var isNumber = require( "lodash/isNumber" );
var isObject = require( "lodash/isObject" );
var isUndefined = require( "lodash/isUndefined" );
var difference = require( "lodash/difference" );
var template = require( "../templates.js" ).assessmentPresenterResult;
var scoreToRating = require( "../interpreters/scoreToRating.js" );
var createConfig = require( "../config/presenter.js" );

/**
 * Constructs the AssessorPresenter.
 *
 * @param {Object} args A list of arguments to use in the presenter.
 * @param {object} args.targets The HTML elements to render the output to.
 * @param {string} args.targets.output The HTML element to render the individual ratings out to.
 * @param {string} args.targets.overall The HTML element to render the overall rating out to.
 * @param {string} args.keyword The keyword to use for checking, when calculating the overall rating.
 * @param {SEOAssessor} args.assessor The Assessor object to retrieve assessment results from.
 * @param {Jed} args.i18n The translation object.
 *
 * @constructor
 */
var AssessorPresenter = function( args ) {
	this.keyword = args.keyword;
	this.assessor = args.assessor;
	this.i18n = args.i18n;
	this.output = args.targets.output;
	this.overall = args.targets.overall || "overallScore";
	this.presenterConfig = createConfig( args.i18n );

	this._disableMarkerButtons = false;

	this._activeMarker = false;
};

/**
 * Sets the keyword
 * @param {string} keyword The keyword to use.
 */
AssessorPresenter.prototype.setKeyword = function( keyword ) {
	this.keyword = keyword;
};

/**
 * Checks whether or not a specific property exists in the presenter configuration.
 * @param {string} property The property name to search for.
 * @returns {boolean} Whether or not the property exists.
 */
AssessorPresenter.prototype.configHasProperty = function( property ) {
	return this.presenterConfig.hasOwnProperty( property );
};

/**
 * Gets a fully formatted indicator object that can be used.
 * @param {string} rating The rating to use.
 * @returns {Object} An object containing the class, the screen reader text, and the full text.
 */
AssessorPresenter.prototype.getIndicator = function( rating ) {
	return {
		className: this.getIndicatorColorClass( rating ),
		screenReaderText: this.getIndicatorScreenReaderText( rating ),
		fullText: this.getIndicatorFullText( rating )
	};
};

/**
 * Gets the indicator color class from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} String containing the CSS class to be used.
 */
AssessorPresenter.prototype.getIndicatorColorClass = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].className;
};

/**
 * Get the indicator screen reader text from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} Translated string containing the screen reader text to be used.
 */
AssessorPresenter.prototype.getIndicatorScreenReaderText = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].screenReaderText;
};

/**
 * Get the indicator full text from the presenter configuration, if it exists.
 * @param {string} rating The rating to check against the config.
 * @returns {string} Translated string containing the full text to be used.
 */
AssessorPresenter.prototype.getIndicatorFullText = function( rating ) {
	if ( !this.configHasProperty( rating ) ) {
		return "";
	}

	return this.presenterConfig[ rating ].fullText;
};

/**
 * Adds a rating based on the numeric score.
 * @param {Object} result Object based on the Assessment result. Requires a score property to work.
 * @returns {Object} The Assessment result object with the rating added.
 */
AssessorPresenter.prototype.resultToRating = function( result ) {
	if ( !isObject( result ) ) {
		return "";
	}

	result.rating = scoreToRating( result.score );

	return result;
};

/**
 * Takes the individual assessment results, sorts and rates them.
 * @returns {Object} Object containing all the individual ratings.
 */
AssessorPresenter.prototype.getIndividualRatings = function() {
	var ratings = {};
	var validResults = this.sort( this.assessor.getValidResults() );
	var mappedResults = validResults.map( this.resultToRating );

	forEach( mappedResults, function( item, key ) {
		ratings[ key ] = this.addRating( item );
	}.bind( this ) );

	return ratings;
};

/**
 * Excludes items from the results that are present in the exclude array.
 * @param {Array} results Array containing the items to filter through.
 * @param {Array} exclude Array of results to exclude.
 * @returns {Array} Array containing items that remain after exclusion.
 */
AssessorPresenter.prototype.excludeFromResults = function( results, exclude ) {
	return difference( results, exclude );
};

/**
 * Sorts results based on their score property and always places items considered to be unsortable, at the top.
 * @param {Array} results Array containing the results that need to be sorted.
 * @returns {Array} Array containing the sorted results.
 */
AssessorPresenter.prototype.sort = function ( results ) {
	var unsortables = this.getUndefinedScores( results );
	var sortables = this.excludeFromResults( results, unsortables );

	sortables.sort( function( a, b ) {
		return a.score - b.score;
	} );

	return unsortables.concat( sortables );
};

/**
 * Returns a subset of results that have an undefined score or a score set to zero.
 * @param {Array} results The results to filter through.
 * @returns {Array} A subset of results containing items with an undefined score or where the score is zero.
 */
AssessorPresenter.prototype.getUndefinedScores = function ( results ) {
	return results.filter( function( result ) {
		return isUndefined( result.score ) || result.score === 0;
	} );
};

/**
 * Creates a rating object based on the item that is being passed.
 * @param {AssessmentResult} item The item to check and create a rating object from.
 * @returns {Object} Object containing a parsed item, including a colored indicator.
 */
AssessorPresenter.prototype.addRating = function( item ) {
	var indicator = this.getIndicator( item.rating );
	indicator.text = item.text;
	indicator.identifier = item.getIdentifier();

	if ( item.hasMarker() ) {
		indicator.marker = item.getMarker();
	}

	return indicator;
};

/**
 * Calculates the overall rating score based on the overall score.
 * @param {Number} overallScore The overall score to use in the calculation.
 * @returns {Object} The rating based on the score.
 */
AssessorPresenter.prototype.getOverallRating = function( overallScore ) {
	var rating = 0;

	if ( this.keyword === "" ) {
		return this.resultToRating( { score: rating } );
	}

	if ( isNumber( overallScore ) ) {
		rating = ( overallScore / 10 );
	}

	return this.resultToRating( { score: rating } );
};

/**
 * Mark with a given marker. This will set the active marker to the correct value.
 *
 * @param {string} identifier The identifier for the assessment/marker.
 * @param {Function} marker The marker function.
 */
AssessorPresenter.prototype.markAssessment = function( identifier, marker ) {
	if ( this._activeMarker === identifier ) {
		this.removeAllMarks();
		this._activeMarker = false;
	} else {
		marker();
		this._activeMarker = identifier;
	}

	this.render();
};

/**
 * Disables the currently active marker in the UI.
 */
AssessorPresenter.prototype.disableMarker = function() {
	this._activeMarker = false;
	this.render();
};

/**
 * Disables the marker buttons.
 */
AssessorPresenter.prototype.disableMarkerButtons = function() {
	this._disableMarkerButtons = true;
	this.render();
};

/**
 * Enables the marker buttons.
 */
AssessorPresenter.prototype.enableMarkerButtons = function() {
	this._disableMarkerButtons = false;
	this.render();
};

/**
 * Adds an event listener for the marker button
 *
 * @param {string} identifier The identifier for the assessment the marker belongs to.
 * @param {Function} marker The marker function that can mark the assessment in the text.
 */
AssessorPresenter.prototype.addMarkerEventHandler = function( identifier, marker ) {
	var container = document.getElementById( this.output );
	var markButton = container.getElementsByClassName( "js-assessment-results__mark-" + identifier )[ 0 ];

	markButton.addEventListener( "click", this.markAssessment.bind( this, identifier, marker ) );
};

/**
 * Renders out both the individual and the overall ratings.
 */
AssessorPresenter.prototype.render = function() {
	this.renderIndividualRatings();
	this.renderOverallRating();
};

/**
 * Adds event handlers to the mark buttons
 *
 * @param {Array} scores The list of rendered scores.
 */
AssessorPresenter.prototype.bindMarkButtons = function( scores ) {
	// Make sure the button works for every score with a marker.
	forEach( scores, function ( score ) {
		if ( score.hasOwnProperty( "marker" ) ) {
			this.addMarkerEventHandler( score.identifier, score.marker );
		}
	}.bind( this ) );
};

/**
 * Removes all marks currently on the text
 */
AssessorPresenter.prototype.removeAllMarks = function() {
	var marker = this.assessor.getSpecificMarker();

	marker( this.assessor.getPaper(), [] );
};

/**
 * Renders out the individual ratings.
 */
AssessorPresenter.prototype.renderIndividualRatings = function() {
	var outputTarget = document.getElementById( this.output );
	var scores = this.getIndividualRatings();

	outputTarget.innerHTML = template( {
		scores: scores,
		i18n: {
			disabledMarkText: this.i18n.dgettext( "js-text-analysis", "Marks are disabled in current view" ),
			markInText: this.i18n.dgettext( "js-text-analysis", "Mark this result in the text" ),
			removeMarksInText: this.i18n.dgettext( "js-text-analysis", "Remove marks in the text" )
		},
		activeMarker: this._activeMarker,
		markerButtonsDisabled: this._disableMarkerButtons
	} );

	this.bindMarkButtons( scores );
};

/**
 * Renders out the overall rating.
 */
AssessorPresenter.prototype.renderOverallRating = function() {
	var overallRating = this.getOverallRating( this.assessor.calculateOverallScore() );
	var overallRatingElement = document.getElementById( this.overall );

	if ( !overallRatingElement ) {
		return;
	}

	overallRatingElement.className = "overallScore " + this.getIndicatorColorClass( overallRating.rating );
};

module.exports = AssessorPresenter;

},{"../config/presenter.js":284,"../interpreters/scoreToRating.js":302,"../templates.js":395,"lodash/difference":186,"lodash/forEach":194,"lodash/isNumber":211,"lodash/isObject":212,"lodash/isUndefined":218}],308:[function(require,module,exports){
var merge = require( "lodash/merge" );
var InvalidTypeError = require( "./errors/invalidType" );
var MissingArgument = require( "./errors/missingArgument" );
var isUndefined = require( "lodash/isUndefined" );
var isEmpty = require( "lodash/isEmpty" );

// Researches
var wordCountInText = require( "./researches/wordCountInText.js" );
var getLinkStatistics = require( "./researches/getLinkStatistics.js" );
var linkCount = require( "./researches/countLinks.js" );
var urlLength = require( "./researches/urlIsTooLong.js" );
var findKeywordInPageTitle = require( "./researches/findKeywordInPageTitle.js" );
var matchKeywordInSubheadings = require( "./researches/matchKeywordInSubheadings.js" );
var getKeywordDensity = require( "./researches/getKeywordDensity.js" );
var stopWordsInKeyword = require( "./researches/stopWordsInKeyword" );
var stopWordsInUrl = require( "./researches/stopWordsInUrl" );
var calculateFleschReading = require( "./researches/calculateFleschReading.js" );
var metaDescriptionLength = require( "./researches/metaDescriptionLength.js" );
var imageCount = require( "./researches/imageCountInText.js" );
var altTagCount = require( "./researches/imageAltTags.js" );
var keyphraseLength = require( "./researches/keyphraseLength" );
var metaDescriptionKeyword = require( "./researches/metaDescriptionKeyword.js" );
var keywordCountInUrl = require( "./researches/keywordCountInUrl" );
var findKeywordInFirstParagraph = require( "./researches/findKeywordInFirstParagraph.js" );
var pageTitleWidth = require( "./researches/pageTitleWidth.js" );
var wordComplexity = require( "./researches/getWordComplexity.js" );
var getParagraphLength = require( "./researches/getParagraphLength.js" );
var countSentencesFromText = require( "./researches/countSentencesFromText.js" );
var countSentencesFromDescription = require( "./researches/countSentencesFromDescription.js" );
var getSubheadingLength = require( "./researches/getSubheadingLength.js" );
var getSubheadingTextLengths = require( "./researches/getSubheadingTextLengths.js" );
var getSubheadingPresence = require( "./researches/getSubheadingPresence.js" );
var findTransitionWords = require( "./researches/findTransitionWords.js" );
var passiveVoice = require( "./researches/getPassiveVoice.js" );
var getSentenceBeginnings = require( "./researches/getSentenceBeginnings.js" );

/**
 * This contains all possible, default researches.
 * @param {Paper} paper The Paper object that is needed within the researches.
 * @constructor
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 */
var Researcher = function( paper ) {
	this.setPaper( paper );

	this.defaultResearches = {
		"urlLength": urlLength,
		"wordCountInText": wordCountInText,
		"findKeywordInPageTitle": findKeywordInPageTitle,
		"calculateFleschReading": calculateFleschReading,
		"getLinkStatistics": getLinkStatistics,
		"linkCount": linkCount,
		"imageCount": imageCount,
		"altTagCount": altTagCount,
		"matchKeywordInSubheadings": matchKeywordInSubheadings,
		"getKeywordDensity": getKeywordDensity,
		"stopWordsInKeyword": stopWordsInKeyword,
		"stopWordsInUrl": stopWordsInUrl,
		"metaDescriptionLength": metaDescriptionLength,
		"keyphraseLength": keyphraseLength,
		"keywordCountInUrl": keywordCountInUrl,
		"firstParagraph": findKeywordInFirstParagraph,
		"metaDescriptionKeyword": metaDescriptionKeyword,
		"pageTitleWidth": pageTitleWidth,
		"wordComplexity": wordComplexity,
		"getParagraphLength": getParagraphLength,
		"countSentencesFromText": countSentencesFromText,
		"countSentencesFromDescription": countSentencesFromDescription,
		"getSubheadingLength": getSubheadingLength,
		"getSubheadingTextLengths": getSubheadingTextLengths,
		"getSubheadingPresence": getSubheadingPresence,
		"findTransitionWords": findTransitionWords,
		"passiveVoice": passiveVoice,
		"getSentenceBeginnings": getSentenceBeginnings
	};

	this.customResearches = {};
};

/**
 * Set the Paper associated with the Researcher.
 * @param {Paper} paper The Paper to use within the Researcher
 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
 * @returns {void}
 */
Researcher.prototype.setPaper = function( paper ) {
	this.paper = paper;
};

/**
 * Add a custom research that will be available within the Researcher.
 * @param {string} name A name to reference the research by.
 * @param {function} research The function to be added to the Researcher.
 * @throws {MissingArgument} Research name cannot be empty.
 * @throws {InvalidTypeError} The research requires a valid Function callback.
 * @returns {void}
 */
Researcher.prototype.addResearch = function( name, research ) {
	if ( isUndefined( name ) || isEmpty( name ) ) {
		throw new MissingArgument( "Research name cannot be empty" );
	}

	if ( !( research instanceof Function ) ) {
		throw new InvalidTypeError( "The research requires a Function callback." );
	}

	this.customResearches[ name ] = research;
};

/**
 * Check wheter or not the research is known by the Researcher.
 * @param {string} name The name to reference the research by.
 * @returns {boolean} Whether or not the research is known by the Researcher
 */
Researcher.prototype.hasResearch = function( name ) {
	return Object.keys( this.getAvailableResearches() ).filter(
	function( research ) {
		return research === name;
	} ).length > 0;
};

/**
 * Return all available researches.
 * @returns {Object} An object containing all available researches.
 */
Researcher.prototype.getAvailableResearches = function() {
	return merge( this.defaultResearches, this.customResearches );
};

/**
 * Return the Research by name.
 * @param {string} name The name to reference the research by.
 * @returns {*} Returns the result of the research or false if research does not exist.
 * @throws {MissingArgument} Research name cannot be empty.
 */
Researcher.prototype.getResearch = function( name ) {
	if ( isUndefined( name ) || isEmpty( name ) ) {
		throw new MissingArgument( "Research name cannot be empty" );
	}

	if ( !this.hasResearch( name ) ) {
		return false;
	}

	return this.getAvailableResearches()[ name ]( this.paper );
};

module.exports = Researcher;

},{"./errors/invalidType":291,"./errors/missingArgument":292,"./researches/calculateFleschReading.js":309,"./researches/countLinks.js":310,"./researches/countSentencesFromDescription.js":311,"./researches/countSentencesFromText.js":312,"./researches/findKeywordInFirstParagraph.js":321,"./researches/findKeywordInPageTitle.js":322,"./researches/findTransitionWords.js":323,"./researches/getKeywordDensity.js":330,"./researches/getLinkStatistics.js":331,"./researches/getParagraphLength.js":333,"./researches/getPassiveVoice.js":334,"./researches/getSentenceBeginnings.js":335,"./researches/getSubheadingLength.js":336,"./researches/getSubheadingPresence.js":337,"./researches/getSubheadingTextLengths.js":338,"./researches/getWordComplexity.js":339,"./researches/imageAltTags.js":340,"./researches/imageCountInText.js":341,"./researches/keyphraseLength":342,"./researches/keywordCountInUrl":343,"./researches/matchKeywordInSubheadings.js":344,"./researches/metaDescriptionKeyword.js":345,"./researches/metaDescriptionLength.js":346,"./researches/pageTitleWidth.js":347,"./researches/stopWordsInKeyword":351,"./researches/stopWordsInUrl":353,"./researches/urlIsTooLong.js":354,"./researches/wordCountInText.js":355,"lodash/isEmpty":207,"lodash/isUndefined":218,"lodash/merge":223}],309:[function(require,module,exports){
/** @module analyses/calculateFleschReading */

var stripNumbers = require( "../stringProcessing/stripNumbers.js" );
var countSentences = require( "../stringProcessing/countSentences.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );
var formatNumber = require( "../helpers/formatNumber.js" );

/**
 * This calculates the fleschreadingscore for a given text
 * The formula used:
 * 206.835 - 1.015 (total words / total sentences) - 84.6 ( total syllables / total words);
 *
 * @param {object} paper The paper containing the text
 * @returns {number} the score of the fleschreading test
 */
module.exports = function( paper ) {
	var text = paper.getText();
	if ( text === "" ) {
		return 0;
	}

	text = stripNumbers( text );

	var numberOfSentences = countSentences( text );

	var numberOfWords = countWords( text );

	// Prevent division by zero errors.
	if ( numberOfSentences === 0 || numberOfWords === 0 ) {
		return 0;
	}

	var numberOfSyllables = countSyllables( text );

	var score = 206.835 - ( 1.015 * ( numberOfWords / numberOfSentences ) ) - ( 84.6 * ( numberOfSyllables / numberOfWords ) );

	return formatNumber( score );
};

},{"../helpers/formatNumber.js":295,"../stringProcessing/countSentences.js":360,"../stringProcessing/countSyllables.js":361,"../stringProcessing/countWords.js":362,"../stringProcessing/stripNumbers.js":389}],310:[function(require,module,exports){
/** @module analyses/getLinkStatistics */

var getLinks = require( "./getLinks" );

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {number} The number of links found in the text.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var anchors = getLinks( text );

	return anchors.length;
};

},{"./getLinks":332}],311:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences" );
var sentencesLength = require( "./../stringProcessing/sentencesLength.js" );

/**
 * Counts sentences in the description..
 * @param {Paper} paper The Paper object to get description from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getDescription() );
	return sentencesLength( sentences );
};

},{"../stringProcessing/getSentences":369,"./../stringProcessing/sentencesLength.js":385}],312:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences" );
var sentencesLength = require( "./../stringProcessing/sentencesLength.js" );

/**
 * Count sentences in the text.
 * @param {Paper} paper The Paper object to get text from.
 * @returns {Array} The sentences from the text.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );
	return sentencesLength( sentences );
};

},{"../stringProcessing/getSentences":369,"./../stringProcessing/sentencesLength.js":385}],313:[function(require,module,exports){
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
module.exports = function() {
	return [
		// Definite articles:
		"the",
		// Indefinite articles:
		"a", "an",
		// Numbers 1-10:
		"one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
		// Demonstrative pronouns:
		"this", "that", "these", "those"
	];
};

},{}],314:[function(require,module,exports){
module.exports = function() {
	return [
		"am",
		"is",
		"are",
		"was",
		"were",
		"been",
		"being",
		"get",
		"gets",
		"getting",
		"got",
		"gotten",
		"having",
		"be",
		"she's",
		"he's",
		"it's",
		"i'm",
		"we're",
		"they're",
		"you're",
		"what's",
		"isn't",
		"weren't",
		"wasn't",
		"that's",
		"aren't"
	];
};

},{}],315:[function(require,module,exports){
module.exports = function() {
	return [
		"a",
		"an",
		"the",
		"my",
		"her",
		"his",
		"their",
		"its",
		"our",
		"your",
		"am",
		"is",
		"are",
		"was",
		"were",
		"been",
		"being",
		"get",
		"gets",
		"getting",
		"got",
		"gotten",
		"having",
		"be",
		"she's",
		"he's",
		"it's",
		"i'm",
		"we're",
		"they're",
		"you're",
		"what's",
		"isn't",
		"weren't",
		"wasn't",
		"that's",
		"aren't"
	];
};


},{}],316:[function(require,module,exports){
module.exports = function() {
	return [
		"arisen",
		"awoken",
		"reawoken",
		"babysat",
		"backslid",
		"backslidden",
		"beat",
		"beaten",
		"become",
		"begun",
		"bent",
		"unbent",
		"bet",
		"bid",
		"outbid",
		"rebid",
		"underbid",
		"overbid",
		"bidden",
		"bitten",
		"blown",
		"bought",
		"overbought",
		"bound",
		"unbound",
		"rebound",
		"broadcast",
		"rebroadcast",
		"broken",
		"brought",
		"browbeat",
		"browbeaten",
		"built",
		"prebuilt",
		"rebuilt",
		"overbuilt",
		"burnt",
		"burst",
		"bust",
		"cast",
		"miscast",
		"recast",
		"caught",
		"chosen",
		"clung",
		"come",
		"overcome",
		"cost",
		"crept",
		"cut",
		"undercut",
		"recut",
		"daydreamt",
		"dealt",
		"misdealt",
		"redealt",
		"disproven",
		"done",
		"predone",
		"outdone",
		"misdone",
		"redone",
		"overdone",
		"undone",
		"drawn",
		"outdrawn",
		"redrawn",
		"overdrawn",
		"dreamt",
		"driven",
		"outdriven",
		"drunk",
		"outdrunk",
		"overdrunk",
		"dug",
		"dwelt",
		"eaten",
		"overeaten",
		"fallen",
		"felt",
		"fit",
		"refit",
		"retrofit",
		"flown",
		"outflown",
		"flung",
		"forbidden",
		"forecast",
		"foregone",
		"foreseen",
		"foretold",
		"forgiven",
		"forgotten",
		"forsaken",
		"fought",
		"outfought",
		"found",
		"frostbitten",
		"frozen",
		"unfrozen",
		"given",
		"gone",
		"undergone",
//		"got",
		"gotten",
		"ground",
		"reground",
		"grown",
		"outgrown",
		"regrown",
		"had",
		"handwritten",
		"heard",
		"reheard",
		"misheard",
		"overheard",
		"held",
		"hewn",
		"hidden",
		"unhidden",
		"hit",
		"hung",
		"rehung",
		"overhung",
		"unhung",
		"hurt",
		"inlaid",
		"input",
		"interwound",
		"interwoven",
		"jerry-built",
		"kept",
		"knelt",
		"knit",
		"reknit",
		"unknit",
		"known",
		"laid",
		"mislaid",
		"relaid",
		"overlaid",
		"lain",
		"underlain",
		"leant",
		"leapt",
		"outleapt",
		"learnt",
		"unlearnt",
		"relearnt",
		"mislearnt",
		"left",
		"lent",
		"let",
		"lip-read",
		"lit",
		"relit",
		"lost",
		"made",
		"premade",
		"remade",
		"meant",
		"met",
		"mown",
		"offset",
		"paid",
		"prepaid",
		"repaid",
		"overpaid",
		"partaken",
		"proofread",
		"proven",
		"put",
		"quick-frozen",
		"quit",
		"read",
		"misread",
		"reread",
		"retread",
		"rewaken",
		"rid",
		"ridden",
		"outridden",
		"overridden",
		"risen",
		"roughcast",
		"run",
		"outrun",
		"rerun",
		"overrun",
		"rung",
		"said",
		"sand-cast",
		"sat",
		"outsat",
		"sawn",
		"seen",
		"overseen",
		"sent",
		"resent",
		"set",
		"preset",
		"reset",
		"misset",
		"sewn",
		"resewn",
		"oversewn",
		"unsewn",
		"shaken",
		"shat",
		"shaven",
		"shit",
		"shone",
		"outshone",
		"shorn",
		"shot",
		"outshot",
		"overshot",
		"shown",
		"shrunk",
		"preshrunk",
		"shut",
		"sight-read",
		"slain",
		"slept",
		"outslept",
		"overslept",
		"slid",
		"slit",
		"slung",
		"unslung",
		"slunk",
		"smelt",
		"outsmelt",
		"snuck",
		"sold",
		"undersold",
		"presold",
		"outsold",
		"resold",
		"oversold",
		"sought",
		"sown",
		"spat",
		"spelt",
		"misspelt",
		"spent",
		"underspent",
		"outspent",
		"misspent",
		"overspent",
		"spilt",
		"overspilt",
		"spit",
		"split",
		"spoilt",
		"spoken",
		"outspoken",
		"misspoken",
		"overspoken",
		"spread",
		"sprung",
		"spun",
		"unspun",
		"stolen",
		"stood",
		"understood",
		"misunderstood",
		"strewn",
		"stricken",
		"stridden",
		"striven",
		"struck",
		"strung",
		"unstrung",
		"stuck",
		"unstuck",
		"stung",
		"stunk",
		"sublet",
		"sunburnt",
		"sung",
		"outsung",
		"sunk",
		"sweat",
		"swept",
		"swollen",
		"sworn",
		"outsworn",
		"swum",
		"outswum",
		"swung",
		"taken",
		"undertaken",
		"mistaken",
		"retaken",
		"overtaken",
		"taught",
		"mistaught",
		"retaught",
		"telecast",
		"test-driven",
		"test-flown",
		"thought",
		"outthought",
		"rethought",
		"overthought",
		"thrown",
		"outthrown",
		"overthrown",
		"thrust",
		"told",
		"retold",
		"torn",
		"retorn",
		"trod",
		"trodden",
		"typecast",
		"typeset",
		"upheld",
		"upset",
		"waylaid",
		"wept",
		"wet",
		"rewet",
		"withdrawn",
		"withheld",
		"withstood",
		"woken",
		"won",
		"rewon",
		"worn",
		"reworn",
		"wound",
		"rewound",
		"overwound",
		"unwound",
		"woven",
		"rewoven",
		"unwoven",
		"written",
		"typewritten",
		"underwritten",
		"outwritten",
		"miswritten",
		"rewritten",
		"overwritten",
		"wrung"
	];
};

},{}],317:[function(require,module,exports){
module.exports = function() {
	return [
		"ablebodied",
		"abovementioned",
		"absentminded",
		"accoladed",
		"accompanied",
		"acculturized",
		"accursed",
		"acerated",
		"acerbated",
		"acetylized",
		"achromatised",
		"achromatized",
		"acidified",
		"acned",
		"actualised",
		"adrenalised",
		"adulated",
		"adversed",
		"aestheticised",
		"affectioned",
		"affined",
		"affricated",
		"aforementioned",
		"agerelated",
		"aggrieved",
		"airbed",
		"aircooled",
		"airspeed",
		"alcoholized",
		"alcoved",
		"alkalised",
		"allianced",
		"aluminized",
		"alveolated",
		"ambered",
		"ammonified",
		"amplified",
		"anagrammatised",
		"anagrammatized",
		"anathematised",
		"aniseed",
		"ankled",
		"annualized",
		"anonymised",
		"anthologized",
		"antlered",
		"anucleated",
		"anviled",
		"anvilshaped",
		"apostrophised",
		"apostrophized",
		"appliqued",
		"apprized",
		"arbitrated",
		"armored",
		"articled",
		"ashamed",
		"assented",
		"atomised",
		"atrophied",
		"auricled",
		"auriculated",
		"aurified",
		"autopsied",
		"axled",
		"babied",
		"backhoed",
		"badmannered",
		"badtempered",
		"balustered",
		"baned",
		"barcoded",
		"bareboned",
		"barefooted",
		"barelegged",
		"barnacled",
		"bayoneted",
		"beadyeyed",
		"beaked",
		"beaned",
		"beatified",
		"beautified",
		"beavered",
		"bed",
		"bedamned",
		"bedecked",
		"behoved",
		"belated",
		"bellbottomed",
		"bellshaped",
		"benighted",
		"bequeathed",
		"berried",
		"bespectacled",
		"bewhiskered",
		"bighearted",
		"bigmouthed",
		"bigoted",
		"bindweed",
		"binucleated",
		"biopsied",
		"bioturbed",
		"biped",
		"bipinnated",
		"birdfeed",
		"birdseed",
		"bisegmented",
		"bitterhearted",
		"blabbermouthed",
		"blackhearted",
		"bladed",
		"blankminded",
		"blearyeyed",
		"bleed",
		"blissed",
		"blobbed",
		"blondhaired",
		"bloodied",
		"bloodred",
		"bloodshed",
		"blueblooded",
		"boatshaped",
		"bobsled",
		"bodied",
		"boldhearted",
		"boogied",
		"boosed",
		"bosomed",
		"bottlefed",
		"bottlefeed",
		"bottlenecked",
		"bouldered",
		"bowlegged",
		"bowlshaped",
		"brandied",
		"bravehearted",
		"breastfed",
		"breastfeed",
		"breed",
		"brighteyed",
		"brindled",
		"broadhearted",
		"broadleaved",
		"broadminded",
		"brokenhearted",
		"broomed",
		"broomweed",
		"buccaned",
		"buckskinned",
		"bucktoothed",
		"buddied",
		"buffaloed",
		"bugeyed",
		"bugleweed",
		"bugweed",
		"bulletined",
		"bunked",
		"busied",
		"butterfingered",
		"cabbed",
		"caddied",
		"cairned",
		"calcified",
		"canalized",
		"candied",
		"cannulated",
		"canoed",
		"canopied",
		"canvased",
		"caped",
		"capsulated",
		"cassocked",
		"castellated",
		"catabolised",
		"catheterised",
		"caudated",
		"cellmediated",
		"cellulosed",
		"certified",
		"chagrined",
		"chambered",
		"chested",
		"chevroned",
		"chickenfeed",
		"chickenhearted",
		"chickweed",
		"chilblained",
		"childbed",
		"chinned",
		"chromatographed",
		"ciliated",
		"cindered",
		"cingulated",
		"circumstanced",
		"cisgendered",
		"citrullinated",
		"clappered",
		"clarified",
		"classified",
		"clawshaped",
		"claysized",
		"cleanhearted",
		"clearminded",
		"clearsighted",
		"cliched",
		"clodded",
		"cloistered",
		"closefisted",
		"closehearted",
		"closelipped",
		"closemouthed",
		"closeted",
		"cloudseed",
		"clubfooted",
		"clubshaped",
		"clued",
		"cockeyed",
		"codified",
		"coed",
		"coevolved",
		"coffined",
		"coiffed",
		"coinfected",
		"coldblooded",
		"coldhearted",
		"collateralised",
		"colonialised",
		"colorcoded",
		"colorised",
		"colourised",
		"columned",
		"commoditized",
		"compactified",
		"companioned",
		"complexioned",
		"conceited",
		"concerned",
		"concussed",
		"coneshaped",
		"congested",
		"contented",
		"convexed",
		"coralled",
		"corymbed",
		"cottonseed",
		"countrified",
		"countrybred",
		"courtmartialled",
		"coved",
		"coveralled",
		"cowshed",
		"cozied",
		"cragged",
		"crayoned",
		"credentialed",
		"creed",
		"crenulated",
		"crescentshaped",
		"cressweed",
		"crewed",
		"cricked",
		"crispated",
		"crossbarred",
		"crossbed",
		"crossbred",
		"crossbreed",
		"crossclassified",
		"crosseyed",
		"crossfertilised",
		"crossfertilized",
		"crossindexed",
		"crosslegged",
		"crossshaped",
		"crossstratified",
		"crossstriated",
		"crotched",
		"crucified",
		"cruelhearted",
		"crutched",
		"cubeshaped",
		"cubified",
		"cuckolded",
		"cucumbershaped",
		"cumbered",
		"cuminseed",
		"cupshaped",
		"curated",
		"curded",
		"curfewed",
		"curlicued",
		"curlycued",
		"curried",
		"curtsied",
		"cyclized",
		"cylindershaped",
		"damed",
		"dandified",
		"dangered",
		"darkhearted",
		"daybed",
		"daylighted",
		"deacidified",
		"deacylated",
		"deadhearted",
		"deadlined",
		"deaminized",
		"deathbed",
		"decalcified",
		"decertified",
		"deckbed",
		"declassified",
		"declutched",
		"decolourated",
		"decreed",
		"deed",
		"deeprooted",
		"deepseated",
		"defensed",
		"defied",
		"deflexed",
		"deglamorised",
		"degunkified",
		"dehumidified",
		"deified",
		"deled",
		"delegitimised",
		"demoded",
		"demystified",
		"denasalized",
		"denazified",
		"denied",
		"denitrified",
		"denticulated",
		"deseed",
		"desexualised",
		"desposited",
		"detoxified",
		"deuced",
		"devitrified",
		"dewlapped",
		"dezincified",
		"diagonalised",
		"dialogued",
		"died",
		"digitated",
		"dignified",
		"dilled",
		"dimwitted",
		"diphthonged",
		"disaffected",
		"disaggregated",
		"disarrayed",
		"discalced",
		"discolorated",
		"discolourated",
		"discshaped",
		"diseased",
		"disembodied",
		"disencumbered",
		"disfranchised",
		"diskshaped",
		"disproportionated",
		"disproportioned",
		"disqualified",
		"distempered",
		"districted",
		"diversified",
		"diverticulated",
		"divested",
		"divvied",
		"dizzied",
		"dogged",
		"dogsbodied",
		"dogsled",
		"domeshaped",
		"domiciled",
		"dormered",
		"doublebarrelled",
		"doublestranded",
		"doublewalled",
		"downhearted",
		"duckbilled",
		"eared",
		"echeloned",
		"eddied",
		"edified",
		"eggshaped",
		"elasticated",
		"electrified",
		"elegized",
		"embed",
		"embodied",
		"emceed",
		"empaneled",
		"empanelled",
		"emptyhearted",
		"emulsified",
		"engined",
		"ennobled",
		"envied",
		"enzymecatalysed",
		"enzymecatalyzed",
		"epitomised",
		"epoxidized",
		"epoxied",
		"etherised",
		"etherized",
		"evilhearted",
		"evilminded",
		"exceed",
		"exemplified",
		"exponentiated",
		"expurgated",
		"extravasated",
		"extraverted",
		"extroverted",
		"fabled",
		"facelifted",
		"facsimiled",
		"fainthearted",
		"falcated",
		"falsehearted",
		"falsified",
		"famed",
		"fancified",
		"fanged",
		"fanshaped",
		"fantasied",
		"farsighted",
		"fated",
		"fatted",
		"fazed",
		"featherbed",
		"fed",
		"federalized",
		"feeblehearted",
		"feebleminded",
		"feeblewitted",
		"feed",
		"fendered",
		"fenestrated",
		"ferried",
		"fevered",
		"fibered",
		"fibred",
		"ficklehearted",
		"fiercehearted",
		"figged",
		"filigreed",
		"filterfeed",
		"fireweed",
		"firmhearted",
		"fissured",
		"flanged",
		"flanneled",
		"flannelled",
		"flatbed",
		"flatfooted",
		"flatted",
		"flaxenhaired",
		"flaxseed",
		"flaxweed",
		"flighted",
		"floodgenerated",
		"flowerbed",
		"fluidised",
		"fluidized",
		"flurried",
		"fobbed",
		"fonded",
		"forcefeed",
		"foreshortened",
		"foresighted",
		"forkshaped",
		"formfeed",
		"fortified",
		"fortressed",
		"foulmouthed",
		"foureyed",
		"foxtailed",
		"fractionalised",
		"fractionalized",
		"frankhearted",
		"freed",
		"freehearted",
		"freespirited",
		"frenzied",
		"friezed",
		"frontiered",
		"fructified",
		"frumped",
		"fullblooded",
		"fullbodied",
		"fullfledged",
		"fullhearted",
		"funnelshaped",
		"furnaced",
		"gaitered",
		"galleried",
		"gangliated",
		"ganglionated",
		"gangrened",
		"gargoyled",
		"gasified",
		"gaunted",
		"gauntleted",
		"gauzed",
		"gavelled",
		"gelatinised",
		"gemmed",
		"genderized",
		"gentled",
		"gentlehearted",
		"gerrymandered",
		"gladhearted",
		"glamored",
		"globed",
		"gloried",
		"glorified",
		"glycosylated",
		"goateed",
		"gobletshaped",
		"godspeed",
		"goodhearted",
		"goodhumored",
		"goodhumoured",
		"goodnatured",
		"goodtempered",
		"goosed",
		"goosenecked",
		"goutweed",
		"grainfed",
		"grammaticalized",
		"grapeseed",
		"gratified",
		"graved",
		"gravelbed",
		"grayhaired",
		"greathearted",
		"greed",
		"greenweed",
		"grommeted",
		"groundspeed",
		"groved",
		"gruffed",
		"guiled",
		"gulled",
		"gumshoed",
		"gunkholed",
		"gussied",
		"guyed",
		"gyrostabilized",
		"hackneyed",
		"hagged",
		"haired",
		"halfcivilized",
		"halfhearted",
		"halfwitted",
		"haloed",
		"handballed",
		"handfed",
		"handfeed",
		"hardcoded",
		"hardhearted",
		"hardnosed",
		"hared",
		"harelipped",
		"hasted",
		"hatred",
		"haunched",
		"hawkeyed",
		"hayseed",
		"hayweed",
		"hearsed",
		"hearted",
		"heartshaped",
		"heavenlyminded",
		"heavyfooted",
		"heavyhearted",
		"heed",
		"heired",
		"heisted",
		"helicoptered",
		"helmed",
		"helmeted",
		"hemagglutinated",
		"hemolyzed",
		"hempseed",
		"hempweed",
		"heparinised",
		"heparinized",
		"herbed",
		"highheeled",
		"highminded",
		"highpriced",
		"highspeed",
		"highspirited",
		"hilled",
		"hipped",
		"hispanicised",
		"hocked",
		"hoed",
		"hogweed",
		"holstered",
		"homaged",
		"hoodooed",
		"hoofed",
		"hooknosed",
		"hooved",
		"horned",
		"horrified",
		"horseshoed",
		"horseweed",
		"hotbed",
		"hotblooded",
		"hothearted",
		"hotted",
		"hottempered",
		"hued",
		"humansized",
		"humidified",
		"humped",
		"hundred",
		"hutched",
		"hyperinflated",
		"hyperpigmented",
		"hyperstimulated",
		"hypertrophied",
		"hyphened",
		"hypophysectomised",
		"hypophysectomized",
		"hypopigmented",
		"hypostatised",
		"hysterectomized",
		"iconified",
		"iconised",
		"iconized",
		"ideologised",
		"illbred",
		"illconceived",
		"illdefined",
		"illdisposed",
		"illequipped",
		"illfated",
		"illfavored",
		"illfavoured",
		"illflavored",
		"illfurnished",
		"illhumored",
		"illhumoured",
		"illimited",
		"illmannered",
		"illnatured",
		"illomened",
		"illproportioned",
		"illqualified",
		"illscented",
		"illtempered",
		"illumed",
		"illusioned",
		"imbed",
		"imbossed",
		"imbued",
		"immatured",
		"impassioned",
		"impenetrated",
		"imperfected",
		"imperialised",
		"imperturbed",
		"impowered",
		"imputed",
		"inarticulated",
		"inbred",
		"inbreed",
		"incapsulated",
		"incased",
		"incrustated",
		"incrusted",
		"indebted",
		"indeed",
		"indemnified",
		"indentured",
		"indigested",
		"indisposed",
		"inexperienced",
		"infrared",
		"intensified",
		"intentioned",
		"interbedded",
		"interbred",
		"interbreed",
		"interluded",
		"introverted",
		"inured",
		"inventoried",
		"iodinated",
		"iodised",
		"irked",
		"ironfisted",
		"ironweed",
		"itchweed",
		"ivied",
		"ivyweed",
		"jagged",
		"jellified",
		"jerseyed",
		"jetlagged",
		"jetpropelled",
		"jeweled",
		"jewelled",
		"jewelweed",
		"jiggered",
		"jimmyweed",
		"jimsonweed",
		"jointweed",
		"joyweed",
		"jungled",
		"juried",
		"justiceweed",
		"justified",
		"karstified",
		"kerchiefed",
		"kettleshaped",
		"kibbled",
		"kidneyshaped",
		"kimonoed",
		"kindhearted",
		"kindred",
		"kingsized",
		"kirtled",
		"knacked",
		"knapweed",
		"kneed",
		"knobbed",
		"knobweed",
		"knopweed",
		"knotweed",
		"lakebed",
		"lakeweed",
		"lamed",
		"lamellated",
		"lanceshaped",
		"lanceted",
		"landbased",
		"lapeled",
		"lapelled",
		"largehearted",
		"lariated",
		"lased",
		"latticed",
		"lauded",
		"lavaged",
		"lavendered",
		"lawned",
		"led",
		"lefteyed",
		"legitimatised",
		"legitimatized",
		"leisured",
		"lensshaped",
		"leveed",
		"levied",
		"lichened",
		"lichenized",
		"lidded",
		"lifesized",
		"lightfingered",
		"lightfooted",
		"lighthearted",
		"lightminded",
		"lightspeed",
		"lignified",
		"likeminded",
		"lilylivered",
		"limbed",
		"linearised",
		"linearized",
		"linefeed",
		"linseed",
		"lionhearted",
		"liquefied",
		"liquified",
		"lithified",
		"liveried",
		"lobbied",
		"locoweed",
		"longarmed",
		"longhaired",
		"longhorned",
		"longlegged",
		"longnecked",
		"longsighted",
		"longwinded",
		"lopsided",
		"loudmouthed",
		"louvered",
		"louvred",
		"lowbred",
		"lowpriced",
		"lowspirited",
		"lozenged",
		"lunated",
		"lyrated",
		"lysinated",
		"maced",
		"macroaggregated",
		"macrodissected",
		"maculated",
		"madweed",
		"magnified",
		"maidenweed",
		"maladapted",
		"maladjusted",
		"malnourished",
		"malrotated",
		"maned",
		"mannered",
		"manuevered",
		"manyhued",
		"manyshaped",
		"manysided",
		"masted",
		"mealymouthed",
		"meanspirited",
		"membered",
		"membraned",
		"metaled",
		"metalized",
		"metallised",
		"metallized",
		"metamerized",
		"metathesized",
		"meted",
		"methylated",
		"mettled",
		"microbrecciated",
		"microminiaturized",
		"microstratified",
		"middleaged",
		"midsized",
		"miffed",
		"mildhearted",
		"milkweed",
		"miniskirted",
		"misactivated",
		"misaligned",
		"mischiefed",
		"misclassified",
		"misdeed",
		"misdemeaned",
		"mismannered",
		"misnomered",
		"misproportioned",
		"miswired",
		"mitred",
		"mitted",
		"mittened",
		"moneyed",
		"monocled",
		"mononucleated",
		"monospaced",
		"monotoned",
		"monounsaturated",
		"mortified",
		"moseyed",
		"motorised",
		"motorized",
		"moussed",
		"moustached",
		"muddied",
		"mugweed",
		"multiarmed",
		"multibarreled",
		"multibladed",
		"multicelled",
		"multichambered",
		"multichanneled",
		"multichannelled",
		"multicoated",
		"multidirected",
		"multiengined",
		"multifaceted",
		"multilaminated",
		"multilaned",
		"multilayered",
		"multilobed",
		"multilobulated",
		"multinucleated",
		"multipronged",
		"multisegmented",
		"multisided",
		"multispeed",
		"multistemmed",
		"multistoried",
		"multitalented",
		"multitoned",
		"multitowered",
		"multivalued",
		"mummied",
		"mummified",
		"mustached",
		"mustachioed",
		"mutinied",
		"myelinated",
		"mystified",
		"mythicised",
		"naked",
		"narcotised",
		"narrowminded",
		"natured",
		"neaped",
		"nearsighted",
		"necrosed",
		"nectared",
		"need",
		"needleshaped",
		"newfangled",
		"newlywed",
		"nibbed",
		"nimblewitted",
		"nippled",
		"nixed",
		"nobled",
		"noduled",
		"noised",
		"nonaccented",
		"nonactivated",
		"nonadsorbed",
		"nonadulterated",
		"nonaerated",
		"nonaffiliated",
		"nonaliased",
		"nonalienated",
		"nonaligned",
		"nonarchived",
		"nonarmored",
		"nonassociated",
		"nonattenuated",
		"nonblackened",
		"nonbreastfed",
		"nonbrecciated",
		"nonbuffered",
		"nonbuttered",
		"noncarbonated",
		"noncarbonized",
		"noncatalogued",
		"noncatalyzed",
		"noncategorized",
		"noncertified",
		"nonchlorinated",
		"nonciliated",
		"noncircumcised",
		"noncivilized",
		"nonclassified",
		"noncoated",
		"noncodified",
		"noncoerced",
		"noncommercialized",
		"noncommissioned",
		"noncompacted",
		"noncompiled",
		"noncomplicated",
		"noncomposed",
		"noncomputed",
		"noncomputerized",
		"nonconcerted",
		"nonconditioned",
		"nonconfirmed",
		"noncongested",
		"nonconjugated",
		"noncooled",
		"noncorrugated",
		"noncoupled",
		"noncreated",
		"noncrowded",
		"noncultured",
		"noncurated",
		"noncushioned",
		"nondecoded",
		"nondecomposed",
		"nondedicated",
		"nondeferred",
		"nondeflated",
		"nondegenerated",
		"nondegraded",
		"nondelegated",
		"nondelimited",
		"nondelineated",
		"nondemarcated",
		"nondeodorized",
		"nondeployed",
		"nonderivatized",
		"nonderived",
		"nondetached",
		"nondetailed",
		"nondifferentiated",
		"nondigested",
		"nondigitized",
		"nondilapidated",
		"nondilated",
		"nondimensionalised",
		"nondimensionalized",
		"nondirected",
		"nondisabled",
		"nondisciplined",
		"nondispersed",
		"nondisputed",
		"nondisqualified",
		"nondisrupted",
		"nondisseminated",
		"nondissipated",
		"nondissolved",
		"nondistressed",
		"nondistributed",
		"nondiversified",
		"nondiverted",
		"nondocumented",
		"nondomesticated",
		"nondoped",
		"nondrafted",
		"nondrugged",
		"nondubbed",
		"nonducted",
		"nonearthed",
		"noneclipsed",
		"nonedged",
		"nonedited",
		"nonelasticized",
		"nonelectrified",
		"nonelectroplated",
		"nonelectroporated",
		"nonelevated",
		"noneliminated",
		"nonelongated",
		"nonembedded",
		"nonembodied",
		"nonemphasized",
		"nonencapsulated",
		"nonencoded",
		"nonencrypted",
		"nonendangered",
		"nonengraved",
		"nonenlarged",
		"nonenriched",
		"nonentangled",
		"nonentrenched",
		"nonepithelized",
		"nonequilibrated",
		"nonestablished",
		"nonetched",
		"nonethoxylated",
		"nonethylated",
		"nonetiolated",
		"nonexaggerated",
		"nonexcavated",
		"nonexhausted",
		"nonexperienced",
		"nonexpired",
		"nonfabricated",
		"nonfalsified",
		"nonfeathered",
		"nonfeatured",
		"nonfed",
		"nonfederated",
		"nonfeed",
		"nonfenestrated",
		"nonfertilized",
		"nonfilamented",
		"nonfinanced",
		"nonfinished",
		"nonfinned",
		"nonfissured",
		"nonflagellated",
		"nonflagged",
		"nonflared",
		"nonflavored",
		"nonfluidized",
		"nonfluorinated",
		"nonfluted",
		"nonforested",
		"nonformalized",
		"nonformatted",
		"nonfragmented",
		"nonfragranced",
		"nonfranchised",
		"nonfreckled",
		"nonfueled",
		"nonfumigated",
		"nonfunctionalized",
		"nonfunded",
		"nongalvanized",
		"nongated",
		"nongelatinized",
		"nongendered",
		"nongeneralized",
		"nongenerated",
		"nongifted",
		"nonglazed",
		"nonglucosated",
		"nonglucosylated",
		"nonglycerinated",
		"nongraded",
		"nongrounded",
		"nonhalogenated",
		"nonhandicapped",
		"nonhospitalised",
		"nonhospitalized",
		"nonhydrated",
		"nonincorporated",
		"nonindexed",
		"noninfected",
		"noninfested",
		"noninitialized",
		"noninitiated",
		"noninoculated",
		"noninseminated",
		"noninstitutionalized",
		"noninsured",
		"nonintensified",
		"noninterlaced",
		"noninterpreted",
		"nonintroverted",
		"noninvestigated",
		"noninvolved",
		"nonirrigated",
		"nonisolated",
		"nonisomerized",
		"nonissued",
		"nonitalicized",
		"nonitemized",
		"noniterated",
		"nonjaded",
		"nonlabelled",
		"nonlaminated",
		"nonlateralized",
		"nonlayered",
		"nonlegalized",
		"nonlegislated",
		"nonlesioned",
		"nonlexicalized",
		"nonliberated",
		"nonlichenized",
		"nonlighted",
		"nonlignified",
		"nonlimited",
		"nonlinearized",
		"nonlinked",
		"nonlobed",
		"nonlobotomized",
		"nonlocalized",
		"nonlysed",
		"nonmachined",
		"nonmalnourished",
		"nonmandated",
		"nonmarginalized",
		"nonmassaged",
		"nonmatriculated",
		"nonmatted",
		"nonmatured",
		"nonmechanized",
		"nonmedicated",
		"nonmedullated",
		"nonmentioned",
		"nonmetabolized",
		"nonmetallized",
		"nonmetastasized",
		"nonmetered",
		"nonmethoxylated",
		"nonmilled",
		"nonmineralized",
		"nonmirrored",
		"nonmodeled",
		"nonmoderated",
		"nonmodified",
		"nonmonetized",
		"nonmonitored",
		"nonmortgaged",
		"nonmotorized",
		"nonmottled",
		"nonmounted",
		"nonmultithreaded",
		"nonmutilated",
		"nonmyelinated",
		"nonnormalized",
		"nonnucleated",
		"nonobjectified",
		"nonobligated",
		"nonoccupied",
		"nonoiled",
		"nonopinionated",
		"nonoxygenated",
		"nonpaginated",
		"nonpaired",
		"nonparalyzed",
		"nonparameterized",
		"nonparasitized",
		"nonpasteurized",
		"nonpatterned",
		"nonphased",
		"nonphosphatized",
		"nonphosphorized",
		"nonpierced",
		"nonpigmented",
		"nonpiloted",
		"nonpipelined",
		"nonpitted",
		"nonplussed",
		"nonpuffed",
		"nonrandomized",
		"nonrated",
		"nonrefined",
		"nonregistered",
		"nonregulated",
		"nonrelated",
		"nonretarded",
		"nonsacred",
		"nonsalaried",
		"nonsanctioned",
		"nonsaturated",
		"nonscented",
		"nonscheduled",
		"nonseasoned",
		"nonsecluded",
		"nonsegmented",
		"nonsegregated",
		"nonselected",
		"nonsolidified",
		"nonspecialized",
		"nonspored",
		"nonstandardised",
		"nonstandardized",
		"nonstratified",
		"nonstressed",
		"nonstriated",
		"nonstriped",
		"nonstructured",
		"nonstylised",
		"nonstylized",
		"nonsubmerged",
		"nonsubscripted",
		"nonsubsidised",
		"nonsubsidized",
		"nonsubstituted",
		"nonsyndicated",
		"nonsynthesised",
		"nontabulated",
		"nontalented",
		"nonthreaded",
		"nontinted",
		"nontolerated",
		"nontranslated",
		"nontunnelled",
		"nonunified",
		"nonunionised",
		"nonupholstered",
		"nonutilised",
		"nonutilized",
		"nonvalued",
		"nonvaried",
		"nonverbalized",
		"nonvitrified",
		"nonvolatilised",
		"nonvolatilized",
		"normed",
		"nosebleed",
		"notated",
		"notified",
		"nuanced",
		"nullified",
		"numerated",
		"oarweed",
		"objectified",
		"obliqued",
		"obtunded",
		"occupied",
		"octupled",
		"odored",
		"oilseed",
		"oinked",
		"oldfashioned",
		"onesided",
		"oophorectomized",
		"opaqued",
		"openhearted",
		"openminded",
		"openmouthed",
		"opiated",
		"opinionated",
		"oracled",
		"oreweed",
		"ossified",
		"outbreed",
		"outmoded",
		"outrigged",
		"outriggered",
		"outsized",
		"outskated",
		"outspeed",
		"outtopped",
		"outtrumped",
		"outvoiced",
		"outweed",
		"ovated",
		"overadorned",
		"overaged",
		"overalled",
		"overassured",
		"overbred",
		"overbreed",
		"overcomplicated",
		"overdamped",
		"overdetailed",
		"overdiversified",
		"overdyed",
		"overequipped",
		"overfatigued",
		"overfed",
		"overfeed",
		"overindebted",
		"overintensified",
		"overinventoried",
		"overmagnified",
		"overmodified",
		"overpreoccupied",
		"overprivileged",
		"overproportionated",
		"overqualified",
		"overseed",
		"oversexed",
		"oversimplified",
		"oversized",
		"oversophisticated",
		"overstudied",
		"oversulfated",
		"ovicelled",
		"ovoidshaped",
		"ozonated",
		"pacified",
		"packeted",
		"palatalized",
		"paled",
		"palsied",
		"paned",
		"panicled",
		"parabled",
		"parallelepiped",
		"parallelized",
		"parallelopiped",
		"parenthesised",
		"parodied",
		"parqueted",
		"passioned",
		"paunched",
		"pauperised",
		"pedigreed",
		"pedimented",
		"pedunculated",
		"pegged",
		"peglegged",
		"penanced",
		"pencilshaped",
		"permineralized",
		"personified",
		"petrified",
		"photodissociated",
		"photoduplicated",
		"photoed",
		"photoinduced",
		"photolysed",
		"photolyzed",
		"pied",
		"pigeoned",
		"pigtailed",
		"pigweed",
		"pilastered",
		"pillared",
		"pilloried",
		"pimpled",
		"pinealectomised",
		"pinealectomized",
		"pinfeathered",
		"pinnacled",
		"pinstriped",
		"pixellated",
		"pixilated",
		"pixillated",
		"plainclothed",
		"plantarflexed",
		"pled",
		"plumaged",
		"pocked",
		"pokeweed",
		"polychlorinated",
		"polyunsaturated",
		"ponytailed",
		"pooched",
		"poorspirited",
		"popeyed",
		"poppyseed",
		"porcelainized",
		"porched",
		"poshed",
		"pottered",
		"poxed",
		"preachified",
		"precertified",
		"preclassified",
		"preconized",
		"preinoculated",
		"premed",
		"prenotified",
		"preoccupied",
		"preposed",
		"prequalified",
		"preshaped",
		"presignified",
		"prespecified",
		"prettified",
		"pried",
		"principled",
		"proceed",
		"prophesied",
		"propounded",
		"prosed",
		"protonated",
		"proudhearted",
		"proxied",
		"pulpified",
		"pumpkinseed",
		"puppied",
		"purebred",
		"pured",
		"pureed",
		"purified",
		"pustuled",
		"putrefied",
		"pyjamaed",
		"quadruped",
		"qualified",
		"quantified",
		"quantised",
		"quantized",
		"quarried",
		"queried",
		"questoned",
		"quicktempered",
		"quickwitted",
		"quiesced",
		"quietened",
		"quizzified",
		"racemed",
		"radiosensitised",
		"ragweed",
		"raindrenched",
		"ramped",
		"rapeseed",
		"rarefied",
		"rarified",
		"ratified",
		"razoredged",
		"reaccelerated",
		"reaccompanied",
		"reachieved",
		"reacknowledged",
		"readdicted",
		"readied",
		"reamplified",
		"reannealed",
		"reassociated",
		"rebadged",
		"rebiopsied",
		"recabled",
		"recategorised",
		"receipted",
		"recentred",
		"recertified",
		"rechoreographed",
		"reclarified",
		"reclassified",
		"reconferred",
		"recrystalized",
		"rectified",
		"recursed",
		"redblooded",
		"redefied",
		"redenied",
		"rednecked",
		"redshifted",
		"redweed",
		"redyed",
		"reed",
		"reembodied",
		"reenlighted",
		"refeed",
		"refereed",
		"reflexed",
		"refortified",
		"refronted",
		"refuged",
		"reglorified",
		"reimpregnated",
		"reinitialized",
		"rejustified",
		"reliquefied",
		"remedied",
		"remodified",
		"remonetized",
		"remythologized",
		"renotified",
		"renullified",
		"renumerated",
		"reoccupied",
		"repacified",
		"repurified",
		"reputed",
		"requalified",
		"rescinded",
		"reseed",
		"reshoed",
		"resolidified",
		"resorbed",
		"respecified",
		"restudied",
		"retabulated",
		"reticulated",
		"retinted",
		"retreed",
		"retroacted",
		"reunified",
		"reverified",
		"revested",
		"revivified",
		"rewed",
		"ridgepoled",
		"riffled",
		"rightminded",
		"rigidified",
		"rinded",
		"riped",
		"rited",
		"ritualised",
		"riverbed",
		"rivered",
		"roached",
		"roadbed",
		"robotised",
		"robotized",
		"romanized",
		"rosetted",
		"rosined",
		"roughhearted",
		"rubied",
		"ruddied",
		"runcinated",
		"russeted",
		"sabled",
		"sabred",
		"sabretoothed",
		"sacheted",
		"sacred",
		"saddlebred",
		"sainted",
		"salaried",
		"samoyed",
		"sanctified",
		"satellited",
		"savvied",
		"sawtoothed",
		"scandalled",
		"scarified",
		"scarped",
		"sceptred",
		"scissored",
		"screed",
		"screwshaped",
		"scrupled",
		"sculked",
		"scurried",
		"scuttled",
		"seabed",
		"seaweed",
		"seed",
		"seedbed",
		"selfassured",
		"selforganized",
		"semicivilized",
		"semidetached",
		"semidisassembled",
		"semidomesticated",
		"semipetrified",
		"semipronated",
		"semirefined",
		"semivitrified",
		"sentineled",
		"sepaled",
		"sepalled",
		"sequinned",
		"sexed",
		"shagged",
		"shaggycoated",
		"shaggyhaired",
		"shaled",
		"shammed",
		"sharpangled",
		"sharpclawed",
		"sharpcornered",
		"sharpeared",
		"sharpedged",
		"sharpeyed",
		"sharpflavored",
		"sharplimbed",
		"sharpnosed",
		"sharpsighted",
		"sharptailed",
		"sharptongued",
		"sharptoothed",
		"sharpwitted",
		"sharpworded",
		"shed",
		"shellbed",
		"shieldshaped",
		"shimmied",
		"shinned",
		"shirted",
		"shirtsleeved",
		"shoed",
		"shortbeaked",
		"shortbilled",
		"shortbodied",
		"shorthaired",
		"shortlegged",
		"shortlimbed",
		"shortnecked",
		"shortnosed",
		"shortsighted",
		"shortsleeved",
		"shortsnouted",
		"shortstaffed",
		"shorttailed",
		"shorttempered",
		"shorttoed",
		"shorttongued",
		"shortwinded",
		"shortwinged",
		"shotted",
		"shred",
		"shrewsized",
		"shrined",
		"shrinkproofed",
		"sickbed",
		"sickleshaped",
		"sickleweed",
		"signalised",
		"signified",
		"silicified",
		"siliconized",
		"silkweed",
		"siltsized",
		"silvertongued",
		"simpleminded",
		"simplified",
		"singlebarreled",
		"singlebarrelled",
		"singlebed",
		"singlebladed",
		"singlebreasted",
		"singlecelled",
		"singlefooted",
		"singlelayered",
		"singleminded",
		"singleseeded",
		"singleshelled",
		"singlestranded",
		"singlevalued",
		"sissified",
		"sistered",
		"sixgilled",
		"sixmembered",
		"sixsided",
		"sixstoried",
		"skulled",
		"slickered",
		"slipcased",
		"slowpaced",
		"slowwitted",
		"slurried",
		"smallminded",
		"smoothened",
		"smoothtongued",
		"snaggletoothed",
		"snouted",
		"snowballed",
		"snowcapped",
		"snowshed",
		"snowshoed",
		"snubnosed",
		"so-called",
		"sofabed",
		"softhearted",
		"sogged",
		"soled",
		"solidified",
		"soliped",
		"sorbed",
		"souled",
		"spearshaped",
		"specified",
		"spectacled",
		"sped",
		"speeched",
		"speechified",
		"speed",
		"spied",
		"spiffied",
		"spindleshaped",
		"spiritualised",
		"spirted",
		"splayfooted",
		"spoonfed",
		"spoonfeed",
		"spoonshaped",
		"spreadeagled",
		"squarejawed",
		"squareshaped",
		"squareshouldered",
		"squaretoed",
		"squeegeed",
		"staled",
		"starshaped",
		"starspangled",
		"starstudded",
		"statechartered",
		"statesponsored",
		"statued",
		"steadied",
		"steampowered",
		"steed",
		"steelhearted",
		"steepled",
		"sterned",
		"stiffnecked",
		"stilettoed",
		"stimied",
		"stinkweed",
		"stirrupshaped",
		"stockinged",
		"storeyed",
		"storied",
		"stouthearted",
		"straitlaced",
		"stratified",
		"strawberryflavored",
		"streambed",
		"stressinduced",
		"stretchered",
		"strictured",
		"strongbodied",
		"strongboned",
		"strongflavored",
		"stronghearted",
		"stronglimbed",
		"strongminded",
		"strongscented",
		"strongwilled",
		"stubbled",
		"studied",
		"stultified",
		"stupefied",
		"styed",
		"stymied",
		"subclassified",
		"subcommissioned",
		"subminiaturised",
		"subsaturated",
		"subulated",
		"suburbanised",
		"suburbanized",
		"suburbed",
		"succeed",
		"sueded",
		"sugarrelated",
		"sulfurized",
		"sunbed",
		"superhardened",
		"superinfected",
		"supersimplified",
		"surefooted",
		"sweetscented",
		"swifted",
		"swordshaped",
		"syllabified",
		"syphilized",
		"tabularized",
		"talented",
		"tarpapered",
		"tautomerized",
		"teated",
		"teed",
		"teenaged",
		"teetotaled",
		"tenderhearted",
		"tentacled",
		"tenured",
		"termed",
		"ternated",
		"testbed",
		"testified",
		"theatricalised",
		"theatricalized",
		"themed",
		"thicketed",
		"thickskinned",
		"thickwalled",
		"thighed",
		"thimbled",
		"thimblewitted",
		"thonged",
		"thoroughbred",
		"thralled",
		"threated",
		"throated",
		"throughbred",
		"thyroidectomised",
		"thyroidectomized",
		"tiaraed",
		"ticktocked",
		"tidied",
		"tightassed",
		"tightfisted",
		"tightlipped",
		"timehonoured",
		"tindered",
		"tined",
		"tinselled",
		"tippytoed",
		"tiptoed",
		"titled",
		"toed",
		"tomahawked",
		"tonged",
		"toolshed",
		"toothplated",
		"toplighted",
		"torchlighted",
		"toughhearted",
		"traditionalized",
		"trajected",
		"tranced",
		"transgendered",
		"transliterated",
		"translocated",
		"transmogrified",
		"treadled",
		"treed",
		"treelined",
		"tressed",
		"trialled",
		"triangled",
		"trifoliated",
		"trifoliolated",
		"trilobed",
		"trucklebed",
		"truehearted",
		"trumpetshaped",
		"trumpetweed",
		"tuberculated",
		"tumbleweed",
		"tunnelshaped",
		"turbaned",
		"turreted",
		"turtlenecked",
		"tuskshaped",
		"tweed",
		"twigged",
		"typified",
		"ulcered",
		"ultracivilised",
		"ultracivilized",
		"ultracooled",
		"ultradignified",
		"ultradispersed",
		"ultrafiltered",
		"ultrared",
		"ultrasimplified",
		"ultrasophisticated",
		"unabandoned",
		"unabashed",
		"unabbreviated",
		"unabetted",
		"unabolished",
		"unaborted",
		"unabraded",
		"unabridged",
		"unabsolved",
		"unabsorbed",
		"unaccelerated",
		"unaccented",
		"unaccentuated",
		"unacclimatised",
		"unacclimatized",
		"unaccompanied",
		"unaccomplished",
		"unaccosted",
		"unaccredited",
		"unaccrued",
		"unaccumulated",
		"unaccustomed",
		"unacidulated",
		"unacquainted",
		"unacquitted",
		"unactivated",
		"unactuated",
		"unadapted",
		"unaddicted",
		"unadjourned",
		"unadjudicated",
		"unadjusted",
		"unadmonished",
		"unadopted",
		"unadored",
		"unadorned",
		"unadsorbed",
		"unadulterated",
		"unadvertised",
		"unaerated",
		"unaffiliated",
		"unaggregated",
		"unagitated",
		"unaimed",
		"unaired",
		"unaliased",
		"unalienated",
		"unaligned",
		"unallocated",
		"unalloyed",
		"unalphabetized",
		"unamassed",
		"unamortized",
		"unamplified",
		"unanaesthetised",
		"unanaesthetized",
		"unaneled",
		"unanesthetised",
		"unanesthetized",
		"unangered",
		"unannealed",
		"unannexed",
		"unannihilated",
		"unannotated",
		"unanointed",
		"unanticipated",
		"unappareled",
		"unappendaged",
		"unapportioned",
		"unapprenticed",
		"unapproached",
		"unappropriated",
		"unarbitrated",
		"unarched",
		"unarchived",
		"unarmored",
		"unarmoured",
		"unarticulated",
		"unascertained",
		"unashamed",
		"unaspirated",
		"unassembled",
		"unasserted",
		"unassessed",
		"unassociated",
		"unassorted",
		"unassuaged",
		"unastonished",
		"unastounded",
		"unatoned",
		"unattained",
		"unattainted",
		"unattenuated",
		"unattributed",
		"unauctioned",
		"unaudited",
		"unauthenticated",
		"unautographed",
		"unaverted",
		"unawaked",
		"unawakened",
		"unawarded",
		"unawed",
		"unbaffled",
		"unbaited",
		"unbalconied",
		"unbanded",
		"unbanished",
		"unbaptised",
		"unbaptized",
		"unbarreled",
		"unbarrelled",
		"unbattered",
		"unbeaded",
		"unbearded",
		"unbeneficed",
		"unbesotted",
		"unbetrayed",
		"unbetrothed",
		"unbiased",
		"unbiassed",
		"unbigoted",
		"unbilled",
		"unblackened",
		"unblanketed",
		"unblasphemed",
		"unblazoned",
		"unblistered",
		"unblockaded",
		"unbloodied",
		"unbodied",
		"unbonded",
		"unbothered",
		"unbounded",
		"unbracketed",
		"unbranded",
		"unbreaded",
		"unbrewed",
		"unbridged",
		"unbridled",
		"unbroached",
		"unbudgeted",
		"unbuffed",
		"unbuffered",
		"unburnished",
		"unbutchered",
		"unbuttered",
		"uncached",
		"uncaked",
		"uncalcified",
		"uncalibrated",
		"uncamouflaged",
		"uncamphorated",
		"uncanceled",
		"uncancelled",
		"uncapitalized",
		"uncarbonated",
		"uncarpeted",
		"uncased",
		"uncashed",
		"uncastrated",
		"uncatalogued",
		"uncatalysed",
		"uncatalyzed",
		"uncategorised",
		"uncatered",
		"uncaulked",
		"uncelebrated",
		"uncensored",
		"uncensured",
		"uncertified",
		"unchambered",
		"unchanneled",
		"unchannelled",
		"unchaperoned",
		"uncharacterized",
		"uncharted",
		"unchartered",
		"unchastened",
		"unchastised",
		"unchelated",
		"uncherished",
		"unchilled",
		"unchristened",
		"unchronicled",
		"uncircumcised",
		"uncircumscribed",
		"uncited",
		"uncivilised",
		"uncivilized",
		"unclarified",
		"unclassed",
		"unclassified",
		"uncleaved",
		"unclimbed",
		"unclustered",
		"uncluttered",
		"uncoagulated",
		"uncoded",
		"uncodified",
		"uncoerced",
		"uncoined",
		"uncollapsed",
		"uncollated",
		"uncolonised",
		"uncolonized",
		"uncolumned",
		"uncombined",
		"uncommented",
		"uncommercialised",
		"uncommercialized",
		"uncommissioned",
		"uncommitted",
		"uncompacted",
		"uncompartmentalized",
		"uncompartmented",
		"uncompensated",
		"uncompiled",
		"uncomplicated",
		"uncompounded",
		"uncomprehened",
		"uncomputed",
		"unconcealed",
		"unconceded",
		"unconcluded",
		"uncondensed",
		"unconditioned",
		"unconfined",
		"unconfirmed",
		"uncongested",
		"unconglomerated",
		"uncongratulated",
		"unconjugated",
		"unconquered",
		"unconsecrated",
		"unconsoled",
		"unconsolidated",
		"unconstipated",
		"unconstricted",
		"unconstructed",
		"unconsumed",
		"uncontacted",
		"uncontracted",
		"uncontradicted",
		"uncontrived",
		"unconverted",
		"unconveyed",
		"unconvicted",
		"uncooked",
		"uncooled",
		"uncoordinated",
		"uncopyrighted",
		"uncored",
		"uncorrelated",
		"uncorroborated",
		"uncosted",
		"uncounseled",
		"uncounselled",
		"uncounterfeited",
		"uncoveted",
		"uncrafted",
		"uncramped",
		"uncrannied",
		"uncrazed",
		"uncreamed",
		"uncreased",
		"uncreated",
		"uncredentialled",
		"uncredited",
		"uncrested",
		"uncrevassed",
		"uncrippled",
		"uncriticised",
		"uncriticized",
		"uncropped",
		"uncrosslinked",
		"uncrowded",
		"uncrucified",
		"uncrumbled",
		"uncrystalized",
		"uncrystallised",
		"uncrystallized",
		"uncubed",
		"uncuddled",
		"uncued",
		"unculled",
		"uncultivated",
		"uncultured",
		"uncupped",
		"uncurated",
		"uncurbed",
		"uncurried",
		"uncurtained",
		"uncushioned",
		"undamped",
		"undampened",
		"undappled",
		"undarkened",
		"undated",
		"undaubed",
		"undazzled",
		"undeadened",
		"undeafened",
		"undebated",
		"undebunked",
		"undeceased",
		"undecimalized",
		"undeciphered",
		"undecked",
		"undeclared",
		"undecomposed",
		"undeconstructed",
		"undedicated",
		"undefeated",
		"undeferred",
		"undefied",
		"undefined",
		"undeflected",
		"undefrauded",
		"undefrayed",
		"undegassed",
		"undejected",
		"undelegated",
		"undeleted",
		"undelimited",
		"undelineated",
		"undemented",
		"undemolished",
		"undemonstrated",
		"undenatured",
		"undenied",
		"undented",
		"undeodorized",
		"undepicted",
		"undeputized",
		"underaged",
		"underarmed",
		"underassessed",
		"underbred",
		"underbudgeted",
		"undercapitalised",
		"undercapitalized",
		"underdiagnosed",
		"underdocumented",
		"underequipped",
		"underexploited",
		"underexplored",
		"underfed",
		"underfeed",
		"underfurnished",
		"undergoverned",
		"undergrazed",
		"underinflated",
		"underinsured",
		"underinvested",
		"underived",
		"undermaintained",
		"undermentioned",
		"undermotivated",
		"underperceived",
		"underpowered",
		"underprivileged",
		"underqualified",
		"underrehearsed",
		"underresourced",
		"underripened",
		"undersaturated",
		"undersexed",
		"undersized",
		"underspecified",
		"understaffed",
		"understocked",
		"understressed",
		"understudied",
		"underutilised",
		"underventilated",
		"undescaled",
		"undesignated",
		"undetached",
		"undetailed",
		"undetained",
		"undeteriorated",
		"undeterred",
		"undetonated",
		"undevised",
		"undevoted",
		"undevoured",
		"undiagnosed",
		"undialed",
		"undialysed",
		"undialyzed",
		"undiapered",
		"undiffracted",
		"undigested",
		"undignified",
		"undiluted",
		"undiminished",
		"undimmed",
		"undipped",
		"undirected",
		"undisciplined",
		"undiscouraged",
		"undiscussed",
		"undisfigured",
		"undisguised",
		"undisinfected",
		"undismayed",
		"undisposed",
		"undisproved",
		"undisputed",
		"undisrupted",
		"undissembled",
		"undissipated",
		"undissociated",
		"undissolved",
		"undistilled",
		"undistorted",
		"undistracted",
		"undistributed",
		"undisturbed",
		"undiversified",
		"undiverted",
		"undivulged",
		"undoctored",
		"undocumented",
		"undomesticated",
		"undosed",
		"undramatised",
		"undrilled",
		"undrugged",
		"undubbed",
		"unduplicated",
		"uneclipsed",
		"unedged",
		"unedited",
		"unejaculated",
		"unejected",
		"unelaborated",
		"unelapsed",
		"unelected",
		"unelectrified",
		"unelevated",
		"unelongated",
		"unelucidated",
		"unemaciated",
		"unemancipated",
		"unemasculated",
		"unembalmed",
		"unembed",
		"unembellished",
		"unembodied",
		"unemboldened",
		"unemerged",
		"unenacted",
		"unencoded",
		"unencrypted",
		"unencumbered",
		"unendangered",
		"unendorsed",
		"unenergized",
		"unenfranchised",
		"unengraved",
		"unenhanced",
		"unenlarged",
		"unenlivened",
		"unenraptured",
		"unenriched",
		"unentangled",
		"unentitled",
		"unentombed",
		"unentranced",
		"unentwined",
		"unenumerated",
		"unenveloped",
		"unenvied",
		"unequaled",
		"unequalised",
		"unequalized",
		"unequalled",
		"unequipped",
		"unerased",
		"unerected",
		"uneroded",
		"unerupted",
		"unescorted",
		"unestablished",
		"unevaluated",
		"unexaggerated",
		"unexampled",
		"unexcavated",
		"unexceeded",
		"unexcelled",
		"unexecuted",
		"unexerted",
		"unexhausted",
		"unexpensed",
		"unexperienced",
		"unexpired",
		"unexploited",
		"unexplored",
		"unexposed",
		"unexpurgated",
		"unextinguished",
		"unfabricated",
		"unfaceted",
		"unfanned",
		"unfashioned",
		"unfathered",
		"unfathomed",
		"unfattened",
		"unfavored",
		"unfavoured",
		"unfazed",
		"unfeathered",
		"unfed",
		"unfeigned",
		"unfermented",
		"unfertilised",
		"unfertilized",
		"unfilleted",
		"unfiltered",
		"unfinished",
		"unflavored",
		"unflavoured",
		"unflawed",
		"unfledged",
		"unfleshed",
		"unflurried",
		"unflushed",
		"unflustered",
		"unfluted",
		"unfocussed",
		"unforested",
		"unformatted",
		"unformulated",
		"unfortified",
		"unfractionated",
		"unfractured",
		"unfragmented",
		"unfrequented",
		"unfretted",
		"unfrosted",
		"unfueled",
		"unfunded",
		"unfurnished",
		"ungarbed",
		"ungarmented",
		"ungarnished",
		"ungeared",
		"ungerminated",
		"ungifted",
		"unglazed",
		"ungoverned",
		"ungraded",
		"ungrasped",
		"ungratified",
		"ungroomed",
		"ungrounded",
		"ungrouped",
		"ungummed",
		"ungusseted",
		"unhabituated",
		"unhampered",
		"unhandicapped",
		"unhardened",
		"unharvested",
		"unhasped",
		"unhatched",
		"unheralded",
		"unhindered",
		"unhomogenised",
		"unhomogenized",
		"unhonored",
		"unhonoured",
		"unhooded",
		"unhusked",
		"unhyphenated",
		"unified",
		"unillustrated",
		"unimpacted",
		"unimpaired",
		"unimpassioned",
		"unimpeached",
		"unimpelled",
		"unimplemented",
		"unimpregnated",
		"unimprisoned",
		"unimpugned",
		"unincorporated",
		"unincubated",
		"unincumbered",
		"unindemnified",
		"unindexed",
		"unindicted",
		"unindorsed",
		"uninduced",
		"unindustrialised",
		"unindustrialized",
		"uninebriated",
		"uninfected",
		"uninflated",
		"uninflected",
		"uninhabited",
		"uninhibited",
		"uninitialised",
		"uninitialized",
		"uninitiated",
		"uninoculated",
		"uninseminated",
		"uninsulated",
		"uninsured",
		"uninterpreted",
		"unintimidated",
		"unintoxicated",
		"unintroverted",
		"uninucleated",
		"uninverted",
		"uninvested",
		"uninvolved",
		"unissued",
		"unjaundiced",
		"unjointed",
		"unjustified",
		"unkeyed",
		"unkindled",
		"unlabelled",
		"unlacquered",
		"unlamented",
		"unlaminated",
		"unlarded",
		"unlaureled",
		"unlaurelled",
		"unleaded",
		"unleavened",
		"unled",
		"unlettered",
		"unlicenced",
		"unlighted",
		"unlimbered",
		"unlimited",
		"unlined",
		"unlipped",
		"unliquidated",
		"unlithified",
		"unlittered",
		"unliveried",
		"unlobed",
		"unlocalised",
		"unlocalized",
		"unlocated",
		"unlogged",
		"unlubricated",
		"unmagnified",
		"unmailed",
		"unmaimed",
		"unmaintained",
		"unmalted",
		"unmangled",
		"unmanifested",
		"unmanipulated",
		"unmannered",
		"unmanufactured",
		"unmapped",
		"unmarred",
		"unmastered",
		"unmatriculated",
		"unmechanised",
		"unmechanized",
		"unmediated",
		"unmedicated",
		"unmentioned",
		"unmerged",
		"unmerited",
		"unmetabolised",
		"unmetabolized",
		"unmetamorphosed",
		"unmethylated",
		"unmineralized",
		"unmitigated",
		"unmoderated",
		"unmodernised",
		"unmodernized",
		"unmodified",
		"unmodulated",
		"unmolded",
		"unmolested",
		"unmonitored",
		"unmortgaged",
		"unmotivated",
		"unmotorised",
		"unmotorized",
		"unmounted",
		"unmutated",
		"unmutilated",
		"unmyelinated",
		"unnaturalised",
		"unnaturalized",
		"unnotched",
		"unnourished",
		"unobligated",
		"unobstructed",
		"unoccupied",
		"unoiled",
		"unopposed",
		"unoptimised",
		"unordained",
		"unorganised",
		"unorganized",
		"unoriented",
		"unoriginated",
		"unornamented",
		"unoxidized",
		"unoxygenated",
		"unpacified",
		"unpackaged",
		"unpaired",
		"unparalleled",
		"unparallelled",
		"unparasitized",
		"unpardoned",
		"unparodied",
		"unpartitioned",
		"unpasteurised",
		"unpasteurized",
		"unpatented",
		"unpaved",
		"unpedigreed",
		"unpenetrated",
		"unpenned",
		"unperfected",
		"unperjured",
		"unpersonalised",
		"unpersuaded",
		"unperturbed",
		"unperverted",
		"unpestered",
		"unphosphorylated",
		"unphotographed",
		"unpigmented",
		"unpiloted",
		"unpledged",
		"unploughed",
		"unplumbed",
		"unpoised",
		"unpolarized",
		"unpoliced",
		"unpolled",
		"unpopulated",
		"unposed",
		"unpowered",
		"unprecedented",
		"unpredicted",
		"unprejudiced",
		"unpremeditated",
		"unprescribed",
		"unpressurised",
		"unpressurized",
		"unpriced",
		"unprimed",
		"unprincipled",
		"unprivileged",
		"unprized",
		"unprocessed",
		"unprofaned",
		"unprofessed",
		"unprohibited",
		"unprompted",
		"unpronounced",
		"unproposed",
		"unprospected",
		"unproved",
		"unpruned",
		"unpublicised",
		"unpublicized",
		"unpublished",
		"unpuckered",
		"unpunctuated",
		"unpurified",
		"unqualified",
		"unquantified",
		"unquenched",
		"unquoted",
		"unranked",
		"unrated",
		"unratified",
		"unrebuked",
		"unreckoned",
		"unrecompensed",
		"unreconciled",
		"unreconstructed",
		"unrectified",
		"unredeemed",
		"unrefined",
		"unrefreshed",
		"unrefrigerated",
		"unregarded",
		"unregimented",
		"unregistered",
		"unregulated",
		"unrehearsed",
		"unrelated",
		"unrelieved",
		"unrelinquished",
		"unrenewed",
		"unrented",
		"unrepealed",
		"unreplicated",
		"unreprimanded",
		"unrequited",
		"unrespected",
		"unrestricted",
		"unretained",
		"unretarded",
		"unrevised",
		"unrevived",
		"unrevoked",
		"unrifled",
		"unripened",
		"unrivaled",
		"unrivalled",
		"unroasted",
		"unroofed",
		"unrounded",
		"unruffled",
		"unsalaried",
		"unsalted",
		"unsanctified",
		"unsanctioned",
		"unsanded",
		"unsaponified",
		"unsated",
		"unsatiated",
		"unsatisfied",
		"unsaturated",
		"unscaled",
		"unscarred",
		"unscathed",
		"unscented",
		"unscheduled",
		"unschooled",
		"unscreened",
		"unscripted",
		"unseamed",
		"unseared",
		"unseasoned",
		"unseeded",
		"unsegmented",
		"unsegregated",
		"unselected",
		"unserviced",
		"unsexed",
		"unshamed",
		"unshaped",
		"unsharpened",
		"unsheared",
		"unshielded",
		"unshifted",
		"unshirted",
		"unshoed",
		"unshuttered",
		"unsifted",
		"unsighted",
		"unsilenced",
		"unsimplified",
		"unsized",
		"unskewed",
		"unskinned",
		"unslaked",
		"unsliced",
		"unsloped",
		"unsmoothed",
		"unsoiled",
		"unsoldered",
		"unsolicited",
		"unsolved",
		"unsophisticated",
		"unsorted",
		"unsourced",
		"unsoured",
		"unspaced",
		"unspanned",
		"unspecialised",
		"unspecialized",
		"unspecified",
		"unspiced",
		"unstaged",
		"unstandardised",
		"unstandardized",
		"unstapled",
		"unstarched",
		"unstarred",
		"unstated",
		"unsteadied",
		"unstemmed",
		"unsterilised",
		"unsterilized",
		"unstickered",
		"unstiffened",
		"unstifled",
		"unstigmatised",
		"unstigmatized",
		"unstilted",
		"unstippled",
		"unstipulated",
		"unstirred",
		"unstocked",
		"unstoked",
		"unstoppered",
		"unstratified",
		"unstressed",
		"unstriped",
		"unstructured",
		"unstudied",
		"unstumped",
		"unsubdued",
		"unsubmitted",
		"unsubsidised",
		"unsubsidized",
		"unsubstantiated",
		"unsubstituted",
		"unsugared",
		"unsummarized",
		"unsupervised",
		"unsuprised",
		"unsurveyed",
		"unswayed",
		"unsweetened",
		"unsyllabled",
		"unsymmetrized",
		"unsynchronised",
		"unsynchronized",
		"unsyncopated",
		"unsyndicated",
		"unsynthesized",
		"unsystematized",
		"untagged",
		"untainted",
		"untalented",
		"untanned",
		"untaped",
		"untapered",
		"untargeted",
		"untarnished",
		"untattooed",
		"untelevised",
		"untempered",
		"untenanted",
		"unterminated",
		"untextured",
		"unthickened",
		"unthinned",
		"unthrashed",
		"unthreaded",
		"unthrottled",
		"unticketed",
		"untiled",
		"untilled",
		"untilted",
		"untimbered",
		"untinged",
		"untinned",
		"untinted",
		"untitled",
		"untoasted",
		"untoggled",
		"untoothed",
		"untopped",
		"untoughened",
		"untracked",
		"untrammeled",
		"untrammelled",
		"untranscribed",
		"untransduced",
		"untransferred",
		"untranslated",
		"untransmitted",
		"untraumatized",
		"untraversed",
		"untufted",
		"untuned",
		"untutored",
		"unupgraded",
		"unupholstered",
		"unutilised",
		"unutilized",
		"unuttered",
		"unvaccinated",
		"unvacuumed",
		"unvalidated",
		"unvalued",
		"unvandalized",
		"unvaned",
		"unvanquished",
		"unvapourised",
		"unvapourized",
		"unvaried",
		"unvariegated",
		"unvarnished",
		"unvented",
		"unventilated",
		"unverbalised",
		"unverbalized",
		"unverified",
		"unversed",
		"unvetted",
		"unvictimized",
		"unviolated",
		"unvitrified",
		"unvocalized",
		"unvoiced",
		"unwaged",
		"unwarped",
		"unwarranted",
		"unwaxed",
		"unweakened",
		"unweaned",
		"unwearied",
		"unweathered",
		"unwebbed",
		"unwed",
		"unwedded",
		"unweeded",
		"unweighted",
		"unwelded",
		"unwinterized",
		"unwired",
		"unwitnessed",
		"unwonted",
		"unwooded",
		"unworshipped",
		"unwounded",
		"unzoned",
		"uprated",
		"uprighted",
		"upsized",
		"upswelled",
		"vacuolated",
		"valanced",
		"valueoriented",
		"varied",
		"vascularised",
		"vascularized",
		"vasectomised",
		"vaunted",
		"vectorised",
		"vectorized",
		"vegged",
		"verdured",
		"verified",
		"vermiculated",
		"vernacularized",
		"versified",
		"verticillated",
		"vesiculated",
		"vied",
		"vilified",
		"virtualised",
		"vitrified",
		"vivified",
		"volumed",
		"vulcanised",
		"wabbled",
		"wafered",
		"waisted",
		"walleyed",
		"wared",
		"warmblooded",
		"warmhearted",
		"warted",
		"waterbased",
		"waterbed",
		"watercooled",
		"watersaturated",
		"watershed",
		"wavegenerated",
		"waxweed",
		"weakhearted",
		"weakkneed",
		"weakminded",
		"wearied",
		"weatherised",
		"weatherstriped",
		"webfooted",
		"wedgeshaped",
		"weed",
		"weeviled",
		"welladapted",
		"welladjusted",
		"wellbred",
		"wellconducted",
		"welldefined",
		"welldisposed",
		"welldocumented",
		"wellequipped",
		"wellestablished",
		"wellfavored",
		"wellfed",
		"wellgrounded",
		"wellintentioned",
		"wellmannered",
		"wellminded",
		"wellorganised",
		"wellrounded",
		"wellshaped",
		"wellstructured",
		"whinged",
		"whinnied",
		"whiplashed",
		"whiskered",
		"wholehearted",
		"whorled",
		"widebased",
		"wideeyed",
		"widemeshed",
		"widemouthed",
		"widenecked",
		"widespaced",
		"wilded",
		"wildered",
		"wildeyed",
		"willinghearted",
		"windspeed",
		"winterfed",
		"winterfeed",
		"winterised",
		"wirehaired",
		"wised",
		"witchweed",
		"woaded",
		"wombed",
		"wooded",
		"woodshed",
		"wooled",
		"woolled",
		"woollyhaired",
		"woollystemmed",
		"woolyhaired",
		"woolyminded",
		"wormholed",
		"wormshaped",
		"wrappered",
		"wretched",
		"wronghearted",
		"ycleped",
		"yolked",
		"zincified",
		"zinckified",
		"zinkified",
		"zombified"
	];
};

},{}],318:[function(require,module,exports){
module.exports = function() {
	return [
		"to",
		"which",
		"who",
		"whom",
		"that",
		"whose",
		"after",
		"although",
		"as",
		"because",
		"before",
		"even if",
		"even though",
		"how",
		"if",
		"in order that",
		"inasmuch",
		"lest",
		"once",
		"provided",
		"since",
		"so that",
		"than",
		"though",
		"till",
		"unless",
		"until",
		"when",
		"whenever",
		"where",
		"whereas",
		"wherever",
		"whether",
		"while",
		"why",
		"by the time",
		"supposing",
		"no matter",
		"how",
		"what",
		"won't",
		"do",
		"does",
		"'ll",
		":"
	];
};

},{}],319:[function(require,module,exports){
/** @module config/transitionWords */

/**
 * Returns an array with transition words to be used by the assessments.
 * @returns {Array} The array filled with transition words.
 */
module.exports = function() {
	return [ "above all", "accordingly", "additionally", "after all", "after that", "afterward", "afterwards", "albeit",
		"all in all", "all of a sudden", "all things considered", "also", "although", "although this may be true", "altogether",
		"analogous to", "another", "another key point", "as a matter of fact", "as a result", "as an illustration",
		"as can be seen", "as has been noted", "as I have noted", "as I have said", "as I have shown", "as long as",
		"as much as", "as shown above", "as soon as", "as well as", "at any rate", "at first", "at last", "at least",
		"at length", "at the present time", "at the same time", "at this instant", "at this point", "at this time",
		"balanced against", "basically", "be that as it may", "because", "before", "being that", "besides", "but",
		"by all means", "by and large", "by comparison", "by the same token", "by the time", "certainly", "chiefly",
		"comparatively", "compared to", "concurrently", "consequently", "contrarily", "conversely", "correspondingly",
		"coupled with", "despite", "different from", "doubtedly", "due to", "during", "e.g.", "earlier", "emphatically",
		"equally", "equally important", "especially", "even if", "even more", "even so", "even though", "eventually",
		"evidently", "explicitly", "finally", "first thing to remember", "firstly", "following", "for example",
		"for fear that", "for instance", "for one thing", "for that reason", "for the most part", "for the purpose of",
		"for the same reason", "for this purpose", "for this reason", "formerly", "forthwith", "fourthly",
		"from time to time", "further", "furthermore", "generally", "given that", "given these points",
		"hence", "henceforth", "however", "i.e.", "identically", "important to realize", "in a word", "in addition",
		"in another case", "in any case", "in any event", "in brief", "in case", "in conclusion", "in contrast",
		"in detail", "in due time", "in effect", "in either case", "in essence", "in fact", "in general", "in light of",
		"in like fashion", "in like manner", "in order that", "in order to", "in other words", "in particular", "in reality",
		"in short", "in similar fashion", "in spite of", "in sum", "in summary", "in that case", "in the event that",
		"in the final analysis", "in the first place", "in the fourth place", "in the hope that", "in the light of",
		"in the long run", "in the meantime", "in the same fashion", "in the same way", "in the second place",
		"in the third place", "in this case", "in this situation", "in time", "in truth", "in view of", "inasmuch as",
		"indeed", "instead", "last", "lastly", "later", "lest", "likewise", "markedly", "meanwhile", "moreover",
		"most compelling evidence", "most important", "must be remembered", "nevertheless", "nonetheless", "nor",
		"not to mention",  "notwithstanding", "now that", "obviously", "occasionally", "of course", "on account of",
		"on balance", "on condition that", "on one hand", "on the condition that", "on the contrary", "on the negative side",
		"on the other hand", "on the positive side", "on the whole", "on this occasion", "once", "once in a while",
		"only if", "otherwise", "overall", "owing to", "particularly", "point often overlooked", "presently",
		"previously", "prior to", "provided that", "rather", "regardless", "secondly", "seeing that",
		"shortly", "significantly", "similarly", "simultaneously", "since", "so", "so as to", "so far", "so long as",
		"so that", "soon", "sooner or later", "specifically", "still", "straightaway", "subsequently", "such as",
		"summing up", "surely", "surprisingly", "take the case of", "than", "that is", "that is to say", "then",
		"then again", "thereafter", "therefore", "thereupon", "thirdly", "this time", "though", "thus",
		"till", "to be sure", "to begin with", "to clarify", "to conclude", "to demonstrate", "to emphasize",
		"to enumerate", "to explain", "to illustrate", "too", "to list", "to point out", "to put it another way",
		"to put it differently", "to repeat", "to rephrase it", "to say nothing of", "to sum up", "to summarize",
		"to that end", "to the end that", "to this end", "together with", "undeniably", "under those circumstances",
		"undoubtedly", "unless", "unlike", "unquestionably", "until", "until now", "up against", "up to the present time",
		"vis a vis", "what's more", "when", "whenever", "whereas", "while", "while it may be true", "while this may be true",
		"with attention to", "with the result that", "with this in mind", "with this intention", "with this purpose in mind",
		"without a doubt", "without delay", "without doubt", "without reservation" ];
};


},{}],320:[function(require,module,exports){
/** @module config/twoPartTransitionWords */

/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */
module.exports = function() {
	return [ [ "both", "and" ], [ "if", "then" ], [ "not only", "but also" ], [ "neither", "nor" ], [ "either", "or" ], [ "not", "but" ],
		[ "whether", "or" ], [ "no sooner", "than" ] ];
};

},{}],321:[function(require,module,exports){
/** @module analyses/findKeywordInFirstParagraph */

var matchParagraphs = require( "../stringProcessing/matchParagraphs.js" );
var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Counts the occurrences of the keyword in the first paragraph, returns 0 if it is not found,
 * if there is no paragraph tag or 0 hits, it checks for 2 newlines, otherwise returns the keyword
 * count of the complete text.
 *
 * @param {Paper} paper The text to check for paragraphs.
 * @returns {number} The number of occurences of the keyword in the first paragraph.
 */
module.exports = function( paper ) {
	var paragraph = matchParagraphs( paper.getText() );
	return wordMatch( paragraph[ 0 ], paper.getKeyword(), paper.getLocale() );
};

},{"../stringProcessing/matchParagraphs.js":374,"../stringProcessing/matchTextWithWord.js":377}],322:[function(require,module,exports){
/** @module analyses/findKeywordInPageTitle */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Counts the occurrences of the keyword in the pagetitle. Returns the number of matches
 * and the position of the keyword.
 *
 * @param {object} paper The paper containing title and keyword.
 * @returns {object} result with the matches and position.
 */

module.exports = function( paper ) {
	var title = paper.getTitle();
	var keyword = paper.getKeyword();
	var locale = paper.getLocale();
	var result = { matches: 0, position: -1 };
	result.matches = wordMatch( title, keyword, locale );
	result.position = title.toLocaleLowerCase().indexOf( keyword );

	return result;
};

},{"../stringProcessing/matchTextWithWord.js":377}],323:[function(require,module,exports){
var createRegexFromDoubleArray = require( "../stringProcessing/createRegexFromDoubleArray.js" );
var getSentences = require( "../stringProcessing/getSentences.js" );
var matchWordInSentence = require( "../stringProcessing/matchWordInSentence.js" );
var normalizeSingleQuotes = require( "../stringProcessing/quotes.js" ).normalizeSingle;
var getTransitionWords = require( "../helpers/getTransitionWords.js" );

var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );
var memoize = require( "lodash/memoize" );

var createRegexFromDoubleArrayCached = memoize( createRegexFromDoubleArray );
/**
 * Matches the sentence against two part transition words.
 *
 * @param {string} sentence The sentence to match against.
 * @param {Array} twoPartTransitionWords The array containing two-part transition words.
 * @returns {Array} The found transitional words.
 */
var matchTwoPartTransitionWords = function( sentence, twoPartTransitionWords ) {
	sentence = normalizeSingleQuotes( sentence );
	var twoPartTransitionWordsRegex = createRegexFromDoubleArrayCached( twoPartTransitionWords );
	return sentence.match( twoPartTransitionWordsRegex );
};

/**
 * Matches the sentence against transition words.
 *
 * @param {string} sentence The sentence to match against.
 * @param {Array} transitionWords The array containing transition words.
 * @returns {Array} The found transitional words.
 */
var matchTransitionWords = function( sentence, transitionWords ) {
	sentence = normalizeSingleQuotes( sentence );

	var matchedTransitionWords = filter( transitionWords, function( word ) {
		return matchWordInSentence( word, sentence );
	} );

	return matchedTransitionWords;
};

/**
 * Checks the passed sentences to see if they contain transition words.
 *
 * @param {Array} sentences The sentences to match against.
 * @param {Object} transitionWords The object containing both transition words and two part transition words.
 * @returns {Array} Array of sentence objects containing the complete sentence and the transition words.
 */
var checkSentencesForTransitionWords = function( sentences, transitionWords ) {
	var results = [];

	forEach( sentences, function( sentence ) {
		var twoPartMatches = matchTwoPartTransitionWords( sentence, transitionWords.twoPartTransitionWords() );

		if ( twoPartMatches !== null ) {
			results.push( {
				sentence: sentence,
				transitionWords: twoPartMatches
			} );

			return;
		}

		var transitionWordMatches = matchTransitionWords( sentence, transitionWords.transitionWords() );

		if ( transitionWordMatches.length !== 0 ) {
			results.push( {
				sentence: sentence,
				transitionWords: transitionWordMatches
			} );

			return;
		}
	} );

	return results;
};

/**
 * Checks how many sentences from a text contain at least one transition word or two-part transition word
 * that are defined in the transition words config and two part transition words config.
 *
 * @param {Paper} paper The Paper object to get text from.
 * @returns {object} An object with the total number of sentences in the text
 * and the total number of sentences containing one or more transition words.
 */
module.exports = function( paper ) {
	var locale = paper.getLocale();
	var transitionWords = getTransitionWords( locale );
	var sentences = getSentences( paper.getText() );
	var sentenceResults = checkSentencesForTransitionWords( sentences, transitionWords );

	return {
		totalSentences: sentences.length,
		sentenceResults: sentenceResults,
		transitionWordSentences: sentenceResults.length
	};
};

},{"../helpers/getTransitionWords.js":298,"../stringProcessing/createRegexFromDoubleArray.js":364,"../stringProcessing/getSentences.js":369,"../stringProcessing/matchWordInSentence.js":378,"../stringProcessing/quotes.js":379,"lodash/filter":189,"lodash/forEach":194,"lodash/memoize":222}],324:[function(require,module,exports){
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
module.exports = function() {
	return [
		// Definite articles:
		"le", "la", "les",
		// Indefinite articles:
		"un", "une",
		// Numbers 2-10 ('une' is already included in the indefinite articles):
		"deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
		// Demonstrative pronouns:
		"celui", "celle", "ceux", "celles", "celui-ci", "celle-là", "celui-là", "celle-ci"
	];
};


},{}],325:[function(require,module,exports){
/** @module config/transitionWords */

/**
 * Returns an array with transition words to be used by the assessments.
 * @returns {Array} The array filled with transition words.
 */
module.exports = function() {
	return [
		"à cause de", "à ce propos", "à ce sujet", "à condition que", "à l'encontre de", "à l'image de", "à l'inverse",
		"à l'inverse de", "à mesure que", "à moins que", "à première vue", "à savoir", "à seule fin que", "à supposer que",
		"à vrai dire", "afin que", "ainsi", "ainsi donc", "ainsi que", "alors", "alors que", "apès réflexion", "après cela",
		"après que", "après réflexion", "après tout", "attendu que", "au cas où", "au contraire", "au fur et à mesure que",
		"au lieu de", "au même temps", "au moment où", "au point que", "aussi", "aussi bien que", "aussitôt que", "autant que",
		"autrement dit", "avant que", "avant tout", "ayant fini", "bien que", "c'est à dire que", "c'est ainsi que",
		"c'est le cas de", "c'est pourquoi", "c'est qu'en effet", "c'est-à-dire", "ça confirme que", "ça montre que",
		"ça prouve que", "car", "cela dit", "cela étant", "cependant", "cependant que", "comme l'illustre", "comme le souligne",
		"comme quoi", "comme si", "conséquemment", "contrairement à", "d'abord", "d'ailleurs", "d'après", "d'autant plus que",
		"d'autant que", "d'autre part", "d'ici là", "d'un autre côté", "d'un côté", "d'une facon générale ''", "dans ce cas",
		"dans ces conditions", "dans l'ensemble", "dans l'hypothèse où", "dans la mesure où", "dans le cadre de",
		"dans le cas où", "dans un autre ordre d'idée", "de crainte que", "de façon à ce que", "de façon que", "de fait",
		"de l'autre côté", "de la même façon que", "de manière que", "de même", "de même qua", "de même que", "de peur que",
		"de prime abord", "de sorte que", "de surcroît", "de telle manière que", "de telle sorte que", "de toute façon",
		"depuis que", "dès lors que", "dès qua", "dès que", "désormais", "deuxièmement", "donc", "dorénavant", "du fait que",
		"du moment que", "du point de vue de", "du reste", "effectivement", "également", "en admettant que", "en attendant que",
		"en bref", "en cas que", "en ce domaine", "en cela", "en concequence", "en conclusion", "en conséquence",
		"en d'autres termes", "en définitive", "en dépit de", "en dernier lieu", "en deuxième lieu", "en effet", "en face de",
		"en fait", "en fin de compte", "en général", "en guise de conclusion", "en même temps que", "en outre", "en particulier",
		"en plus", "en premier lieu", "en raison de", "en réalité", "en règle générale", "en résumé", "en revanche", "en second lieu",
		"en somme", "en sorte que", "en supposant que", "en tant que", "en tout cas", "en troisième lieu", "en un mot", "en vue que",
		"encore que", "enfin", "ensuite", "entre autres", "et puis", "étant donné qua", "étant donné que", "face à", "finalement",
		"globalement", "grâce à", "il faut dire aussi que", "jusqu'à ce que", "la preuve c'est que", "la-dessus", "loin que", "lorsque",
		"mais", "malgré", "malgré cela", "malgré tout", "même si", "mis à part le fait que", "néanmoins", "notamment", "nul doute que",
		"ou bien", "où que", "par ailleurs", "par conséquent", "par contre", "par example", "par exemple", "par la suite",
		"par rapport à", "par suite", "par suite de", "parce que", "pareillement", "partant", "partant de ce fait", "pas du tout",
		"pendant que", "pour ainsi dire", "pour ces raisons", "pour cette raison", "pour conclure", "pour peu que", "pour que", "pour résumé",
		"pourtant", "pourvu que", "premièrement", "probablement", "puis", "puisque", "pur toutes ces raisons", "quand bien même que",
		"quand même", "quant à", "quant même", "quel que soit", "qui que", "quoi qu'il en soit", "quoi que", "quoiqu'il en soit",
		"quoique", "sans doute", "selon", "selon que", "semblablement", "si bien que", "si ce n'est que", "sinon", "sitôt que",
		"somme toute", "sous prétexte que", "suivant", "suivant que", "supposé que", "tandis que", "tant et si bien que", "tant que",
		"tellement que", "tout bien pesé", "tout compte fait", "tout d'abord", "tout de même", "toutefois", "troisièmement", "vu que"
	];
};

},{}],326:[function(require,module,exports){
/** @module config/twoPartTransitionWords */

/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */
module.exports = function() {
	return [
		[ "à première vue", "mais à bien considérer les choses" ], [ "à première vue", "mais toute réflexion faite" ],
		[ "aussi", "que" ], [ "certes", "mais" ], [ "d'un côté", "de l'autre côté" ], [ "d'un côté", "de l'autre" ],
		[ "d'une part", "d'autre part" ], [ "d'une parte", "de l'autre parte" ], [ "non seulement", "mais aussi" ],
		[ "non seulement", "mais en outre" ], [ "non seulement", "mais encore" ], [ "quelque", "que" ], [ "si", "que" ],
		[ "soit", "soit" ], [ "tantôt", "tantôt" ], [ "tout d'abord", "ensuite" ], [ "tout", "que" ]
	];
};

},{}],327:[function(require,module,exports){
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
module.exports = function() {
	return [
		// Definite articles:
		"das", "dem", "den", "der", "des", "die",
		// Indefinite articles:
		"ein", "eine", "einem", "einen", "einer", "eines",
		// Numbers 1-10:
		"eins", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn",
		// Demonstrative pronouns:
		"denen", "deren", "derer", "dessen", "diese", "diesem", "diesen", "dieser", "dieses", "jene",
		"jenem", "jenen", "jener", "jenes"
	];
};



},{}],328:[function(require,module,exports){
/** @module config/transitionWords */

/**
 * Returns an array with transition words to be used by the assessments.
 * @returns {Array} The array filled with transition words.
 */
module.exports = function() {
	return [ "aber", "abgesehen von", "alldieweil", "allerdings", "als dass", "also", "anderenteils",
		"andererseits", "andernteils", "anders ausgedrückt", "anders ausgedrueckt", "anders formuliert",
		"anders gefasst", "anders gefragt", "anders gesagt", "anders gesprochen", "anfaenglich", "anfänglich",
		"anfangs", "angenommen", "anschliessend", "anschließend", "auch wenn", "auf grund", "auf jeden Fall", "aufgrund",
		"ausgenommen", "aus diesem Grund", "ausser", "außer", "ausser dass", "außer dass", "ausser wenn", "außer wenn",
		"ausserdem", "außerdem", "beispielsweise", "besser ausgedrückt", "besser ausgedrueckt", "besser formuliert",
		"besser gesagt", "besser gesprochen", "bevor", "beziehungsweise", "bloss dass", "bloß dass",
		"bspw.", "bzw.", "d.h.", "da", "dabei", "dadurch", "dafuer", "dafür", "dagegen", "daher", "dahingegen",
		"danach", "dann", "darauf", "darum", "das heisst", "das heißt", "dass", "davor", "dazu", "dementgegen",
		"dementsprechend", "demgegenüber", "demgegenueber", "demgemaess", "demgemäß", "demzufolge", "denn", "dennoch",
		"des Weiteren", "deshalb", "dessen ungeachtet", "desungeachtet", "deswegen", "doch", "dort", "drittens",
		"ebenfalls", "ebenso wie", "ehe", "einerseits", "einesteils", "entsprechend", "erstens", "falls", "ferner",
		"folglich", "genauso", "genauso wie", "hierdurch", "hierzu", "hingegen", "im Folgenden", "im Gegensatz dazu",
		"im Grunde genommen", "immerhin", "indem", "infolge", "infolgedessen", "inzwischen", "je nachdem",
		"jedenfalls", "jedoch", "kurzum", "m.a.W.", "mit anderen Worten", "nachdem", "nebenher",
		"nichtsdestotrotz", "nichtsdestoweniger", "ob", "obenrein", "obgleich", "obschon", "obwohl", "obzwar",
		"schliesslich", "schließlich", "seit", "seitdem", "sobald", "sodass", "sofern", "solange", "somit",
		"sondern", "sooft", "sowie", "später", "trotz", "trotzdem", "überdies", "überigens", "ueberdies", "ueberigens",
		"umso mehr, als", "umso weniger, als", "unbeschadet dessen", "und zwar", "unter dem Strich", "vielmehr",
		"vorausgesetzt", "vorher", "waehrend", "während", "wegen", "weil", "weiter", "weiterhin", "wenn", "wenngleich",
		"wennschon", "wennzwar", "weshalb", "widrigenfalls", "wiewohl", "wohingegen", "zudem", "zuerst",
		"zufolge", "zuletzt", "zum beispiel", "zumal", "zuvor", "zwar", "zweitens" ];
};

},{}],329:[function(require,module,exports){
/** @module config/twoPartTransitionWords */

/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */
module.exports = function() {
	return [ [ "anstatt", "dass" ], [ "bald", "bald" ], [ "dadurch", "dass" ], [ "dessen ungeachtet", "dass" ],
		[ "entweder", "oder" ], [ "einerseits", "andererseits" ], [ "erst", "wenn" ], [ "je", "desto" ], [ "je", "umsto" ],
		[ "nicht nur", "sondern auch" ], [ "ob", "oder" ], [ "ohne", "dass" ], [ "so", "dass" ], [ "sowohl", "als auch" ],
		[ "sowohl", "wie auch" ], [ "unbeschadet dessen", "dass" ], [ "weder", "noch" ], [ "wenn", "auch" ],
		[ "wenn", "schon" ], [ "nicht weil", "sondern" ]  ];
};

},{}],330:[function(require,module,exports){
/** @module analyses/getKeywordDensity */

var countWords = require( "../stringProcessing/countWords.js" );
var matchWords = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Calculates the keyword density .
 *
 * @param {object} paper The paper containing keyword and text.
  * @returns {number} The keyword density.
 */
module.exports = function( paper ) {
	var keyword = paper.getKeyword();
	var text = paper.getText();
	var locale = paper.getLocale();
	var wordCount = countWords( text );
	if ( wordCount === 0 ) {
		return 0;
	}
	var keywordCount = matchWords( text, keyword, locale );
	return ( keywordCount / wordCount ) * 100;
};

},{"../stringProcessing/countWords.js":362,"../stringProcessing/matchTextWithWord.js":377}],331:[function(require,module,exports){
/** @module analyses/getLinkStatistics */

var getLinks = require( "./getLinks.js" );
var findKeywordInUrl = require( "../stringProcessing/findKeywordInUrl.js" );
var getLinkType = require( "../stringProcessing/getLinkType.js" );
var checkNofollow = require( "../stringProcessing/checkNofollow.js" );
var urlHelper = require( "../stringProcessing/url.js" );

/**
 * Checks whether or not an anchor contains the passed keyword.
 * @param {string} keyword The keyword to look for.
 * @param {string} anchor The anchor to check against.
 * @param {string} locale The locale used for transliteration.
 * @returns {boolean} Whether or not the keyword was found.
 */
var keywordInAnchor = function( keyword, anchor, locale ) {
	if ( keyword === "" ) {
		return false;
	}

	return findKeywordInUrl( anchor, keyword, locale );
};

/**
 * Counts the links found in the text.
 *
 * @param {object} paper The paper object containing text, keyword and url.
 * @returns {object} The object containing all linktypes.
 * total: the total number of links found.
 * totalNaKeyword: the total number of links if keyword is not available.
 * keyword: Object containing all the keyword related counts and matches.
 * keyword.totalKeyword: the total number of links with the keyword.
 * keyword.matchedAnchors: Array with the anchors that contain the keyword.
 * internalTotal: the total number of links that are internal.
 * internalDofollow: the internal links without a nofollow attribute.
 * internalNofollow: the internal links with a nofollow attribute.
 * externalTotal: the total number of links that are external.
 * externalDofollow: the external links without a nofollow attribute.
 * externalNofollow: the internal links with a dofollow attribute.
 * otherTotal: all links that are not HTTP or HTTPS.
 * otherDofollow: other links without a nofollow attribute.
 * otherNofollow: other links with a nofollow attribute.
 */
var countLinkTypes = function( paper ) {
	var keyword = paper.getKeyword();
	var locale = paper.getLocale();
	var anchors = getLinks( paper.getText() );
	var permalink = paper.getPermalink();

	var linkCount = {
		total: anchors.length,
		totalNaKeyword: 0,
		keyword: {
			totalKeyword: 0,
			matchedAnchors: []
		},
		internalTotal: 0,
		internalDofollow: 0,
		internalNofollow: 0,
		externalTotal: 0,
		externalDofollow: 0,
		externalNofollow: 0,
		otherTotal: 0,
		otherDofollow: 0,
		otherNofollow: 0
	};

	for ( var i = 0; i < anchors.length; i++ ) {
		var currentAnchor = anchors[ i ];

		var anchorLink = urlHelper.getFromAnchorTag( currentAnchor );
		var linkToSelf = urlHelper.areEqual( anchorLink, permalink );

		if ( keywordInAnchor( keyword, currentAnchor, locale ) && !linkToSelf ) {
			linkCount.keyword.totalKeyword++;
			linkCount.keyword.matchedAnchors.push( currentAnchor );
		}

		var linkType = getLinkType( currentAnchor, permalink );
		var linkFollow = checkNofollow( currentAnchor );

		linkCount[ linkType + "Total" ]++;
		linkCount[ linkType + linkFollow ]++;
	}

	return linkCount;
};

/**
 * Checks a text for anchors and returns an object with all linktypes found.
 *
 * @param {Paper} paper The paper object containing text, keyword and url.
 * @returns {Object} The object containing all linktypes.
 */
module.exports = function( paper ) {
	return countLinkTypes( paper );
};

},{"../stringProcessing/checkNofollow.js":359,"../stringProcessing/findKeywordInUrl.js":365,"../stringProcessing/getLinkType.js":368,"../stringProcessing/url.js":394,"./getLinks.js":332}],332:[function(require,module,exports){
/** @module analyses/getLinkStatistics */

var getAnchors = require( "../stringProcessing/getAnchorsFromText.js" );

/**
 * Checks a text for anchors and returns the number found.
 *
 * @param {Object} text The text
 * @returns {Array} An array with the anchors
 */
module.exports = function( text ) {
	return getAnchors( text );
};

},{"../stringProcessing/getAnchorsFromText.js":367}],333:[function(require,module,exports){
var countWords = require( "../stringProcessing/countWords.js" );
var matchParagraphs = require( "../stringProcessing/matchParagraphs.js" );
var filter = require( "lodash/filter" );

/**
 * Gets all paragraphs and their word counts from the text.
 *
 * @param {Paper} paper The paper object to get the text from.
 * @returns {Array} The array containing an object with the paragraph word count and paragraph text.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var paragraphs = matchParagraphs( text );
	var paragraphsLength = [];
	paragraphs.map( function ( paragraph ) {
		paragraphsLength.push( {
			wordCount: countWords( paragraph ),
			paragraph: paragraph
		} );
	} );

	return filter( paragraphsLength, function ( paragraphLength ) {
		return ( paragraphLength.wordCount > 0 );
	} );
};

},{"../stringProcessing/countWords.js":362,"../stringProcessing/matchParagraphs.js":374,"lodash/filter":189}],334:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences.js" );
var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var stripHTMLTags = require( "../stringProcessing/stripHTMLTags.js" ).stripFullTags;
var matchWordInSentence = require( "../stringProcessing/matchWordInSentence.js" );
var normalizeSingleQuotes = require( "../stringProcessing/quotes.js" ).normalizeSingle;

var nonverbEndingEd = require( "./english/passivevoice-english/non-verb-ending-ed.js" )();
var determiners = require( "./english/passivevoice-english/determiners.js" )();

var auxiliaries = require( "./english/passivevoice-english/auxiliaries.js" )();
var irregulars = require( "./english/passivevoice-english/irregulars.js" )();
var stopwords = require( "./english/passivevoice-english/stopwords.js" )();

var filter = require( "lodash/filter" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var includes = require( "lodash/includes" );

var auxiliaryRegex = arrayToRegex( auxiliaries );
var verbEndingInIngRegex = /\w+ing($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;
var regularVerbsRegex = /\w+ed($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;

var ingExclusionArray = [ "king", "cling", "ring", "being" ];
var irregularExclusionArray = [ "get", "gets", "getting", "got", "gotten" ];

/**
 * Matches string with an array, returns the word and the index it was found on.
 *
 * @param {string} sentence The sentence to match the strings from the array to.
 * @param {Array} matches The array with strings to match.
 * @returns {Array} The array with matches, containing the index of the match and the matched string.
 * Returns an empty array if none are found.
 */
var matchArray = function( sentence, matches ) {
	var matchedParts = [];

	forEach( matches, function( part ) {
		part = stripSpaces( part );

		if ( !matchWordInSentence( part, sentence ) ) {
			return;
		}

		matchedParts.push( { index: sentence.indexOf( part ), match: part } );
	} );

	return matchedParts;
};

/**
 * Sorts the array on the index property of each entry.
 *
 * @param {Array} indices The array with indices.
 * @returns {Array} The sorted array with indices.
 */
var sortIndices = function( indices ) {
	return indices.sort( function( a, b ) {
		return ( a.index > b.index );
	} );
};

/**
 * Filters duplicate entries if the indices overlap.
 *
 * @param {Array} indices The array with indices to be filtered.
 * @returns {Array} The filtered array.
 */
var filterIndices = function( indices ) {
	indices = sortIndices( indices );
	for ( var i = 0; i < indices.length; i++ ) {

		// If the next index is within the range of the current index and the length of the word, remove it
		// This makes sure we don't match combinations twice, like "even though" and "though".
		if ( !isUndefined( indices[ i + 1 ] ) && indices[ i + 1 ].index < indices[ i ].index + indices[ i ].match.length ) {
			indices.pop( i + 1 );
		}
	}
	return indices;
};

/**
 * Gets active verbs (ending in ing) to determine sentence breakers.
 *
 * @param {string} sentence The sentence to get the active verbs from.
 * @returns {Array} The array with valid matches.
 */
var getVerbsEndingInIng = function( sentence ) {

	// Matches the sentences with words ending in ing
	var matches = sentence.match( verbEndingInIngRegex ) || [];

	// Filters out words ending in -ing that aren't verbs.
	return filter( matches, function( match ) {
		return !includes( ingExclusionArray, stripSpaces( match ) );
	} );
};

/**
 * Gets the indexes of sentence breakers (auxiliaries, stopwords and active verbs) to determine subsentences.
 * Stopwords are filtered because they can contain duplicate matches, like "even though" and "though".
 *
 * @param {string} sentence The sentence to check for indices of auxiliaries, stopwords and active verbs.
 * @returns {Array} The array with valid indices to use for determining subsentences.
 */
var getSentenceBreakers = function( sentence ) {
	sentence = sentence.toLocaleLowerCase();
	var auxiliaryIndices = matchArray( sentence, auxiliaries );

	var stopwordIndices = matchArray( sentence, stopwords );
	stopwordIndices = filterIndices( stopwordIndices );

	var ingVerbs = getVerbsEndingInIng( sentence );
	var ingVerbsIndices = matchArray( sentence, ingVerbs );

	// Concat all indices arrays and sort them.
	var indices = [].concat( auxiliaryIndices, stopwordIndices, ingVerbsIndices );
	return sortIndices( indices );
};

/**
 * Gets the subsentences from a sentence by determining sentence breakers.
 *
 * @param {string} sentence The sentence to split up in subsentences.
 * @returns {Array} The array with all subsentences of a sentence that have an auxiliary.
 */
var getSubsentences = function( sentence ) {
	var subSentences = [];

	sentence = normalizeSingleQuotes( sentence );

	// First check if there is an auxiliary word in the sentence
	if( sentence.match( auxiliaryRegex ) !== null ) {
		var indices = getSentenceBreakers( sentence );

		// Get the words after the found auxiliary
		for ( var i = 0; i < indices.length; i++ ) {
			var endIndex = sentence.length;
			if ( !isUndefined( indices[ i + 1 ] ) ) {
				endIndex = indices[ i + 1 ].index;
			}

			// Cut the sentence from the current index to the endIndex (start of next breaker, of end of sentence).
			var subSentence = stripSpaces( sentence.substr( indices[ i ].index, endIndex - indices[ i ].index ) );
			subSentences.push( subSentence );
		}
	}

	// If a subsentence doesn't have an auxiliary, we don't need it, so it can be filtered out.
	subSentences = filter( subSentences, function( subSentence ) {
		return subSentence.match( auxiliaryRegex ) !== null;
	} );

	return subSentences;
};

/**
 * Gets regular passive verbs.
 *
 * @param {string} subSentence The sub sentence to check for passive verbs.
 * @returns {Array} The array with all matched verbs.
 */
var getRegularVerbs = function( subSentence ) {
	// Matches the sentences with words ending in ed
	var matches = subSentence.match( regularVerbsRegex ) || [];

	// Filters out words ending in -ed that aren't verbs.
	return filter( matches, function( match ) {
		return !includes( nonverbEndingEd, stripSpaces( match ) );
	} );
};

/**
 * Loops through a list of words and detects if they are present in the sentence.
 *
 * @param {Array} wordList The list of words to filter through.
 * @param {string} sentence The sentence to check for matches.
 * @returns {Array} A list of detected words.
 */
var filterWordListInSentence = function( wordList, sentence ) {
	return filter( wordList, function( word ) {
		return matchWordInSentence( word, sentence );
	} );
};

/**
 * Checks whether the sentence contains an excluded verb.
 *
 * @param {string} sentence The sentence to check for excluded verbs.
 * @returns {boolean} Whether or not the sentence contains an excluded verb.
 */
var hasExcludedIrregularVerb = function( sentence ) {
	return filterWordListInSentence( irregularExclusionArray, sentence ).length !== 0;
};

/**
 * Gets irregular passive verbs.
 *
 * @param {string} sentence The sentence to check for passive verbs.
 * @returns {Array} The array with all matched verbs.
 */
var getIrregularVerbs = function( sentence ) {
	var irregularVerbs = filterWordListInSentence( irregulars, sentence );

	return filter( irregularVerbs, function( verb ) {
		// If rid is used with get, gets, getting, got or gotten, remove it.
		if ( verb.match !== "rid" ) {
			return true;
		}

		return hasExcludedIrregularVerb( sentence );
	} );
};

/**
 * Matches having with a verb directly following it. If so, it is not passive.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @param {Array} verbs The array with verbs to check.
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isHavingException = function( subSentence, verbs ) {
	// Match having with a verb directly following it. If so it is active.
	var indexOfHaving = subSentence.indexOf( "having" );

	if ( indexOfHaving > -1 ) {
		var verbIndices = matchArray( subSentence, verbs );

		if ( !isUndefined( verbIndices[ 0 ] ) && !isUndefined( verbIndices[ 0 ].index ) ) {
			// 7 is the number of characters of the word 'having' including space.
			return verbIndices[ 0 ].index  <= subSentence.indexOf( "having" ) + 7;
		}
	}
	return false;
};

/**
 * Match the left. If left is preceeded by `a` or `the`, it isn't a verb.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @param {Array} verbs The array with verbs to check.
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isLeftException = function ( subSentence, verbs ) {

	// Matches left with the or a preceeding.
	var matchLeft = subSentence.match( /(the|a)\sleft/ig ) || [];
	return matchLeft.length > 0 && verbs[ 0 ].match === "left";
};

/**
 * If the word 'fit' is preceeded by a determiner, it shouldn't be marked as active.
 * @param {string} subSentence The subsentence to check for the word 'having' and a verb
 * @returns {boolean} True if it is an exception, false if it is not.
 */
var isFitException = function( subSentence ) {
	var indexOfFit = subSentence.indexOf( "fit" );
	if ( indexOfFit > -1 ) {
		var subString = subSentence.substr( 0, indexOfFit );
		var determinerIndices = filterWordListInSentence( determiners, subString );
		return determinerIndices.length > 1;
	}
	return false;
};

/**
 * Gets the exceptions. Some combinations shouldn't be marked as passive, so we need to filter them out.
 * @param {string} subSentence The subsentence to check for exceptions.
 * @param {array} verbs The array of verbs, used to determine exceptions.
 * @returns {boolean} Wether there is an exception or not.
 */
var getExceptions = function( subSentence, verbs ) {
	if ( isHavingException( subSentence, verbs ) ) {
		return true;
	}

	if ( isLeftException( subSentence, verbs ) ) {
		return true;
	}

	if ( isFitException( subSentence ) ) {
		return true;
	}

	return false;
};

/**
 * Checks the subsentence for any passive verb.
 * @param {string} subSentence The subsentence to check for passives.
 * @returns {boolean} True if passive is found, false if no passive is found.
 */
var determinePassives = function( subSentence ) {
	subSentence = normalizeSingleQuotes( subSentence );

	var regularVerbs = getRegularVerbs( subSentence );
	var irregularVerbs = getIrregularVerbs( subSentence );
	var verbs = regularVerbs.concat( irregularVerbs );

	// Checks for exceptions in the found verbs.
	var exceptions = getExceptions( subSentence, verbs );

	// If there is any exception, this subsentence cannot be passive.
	return verbs.length > 0 && exceptions === false;
};

/**
 * Determines the number of passive sentences in the text.
 * @param {Paper} paper The paper object to get the text from.
 * @returns {object} The number of passives found in the text and the passive sentences.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var sentences = getSentences( text );
	var passiveSentences = [];

	// Get subsentences for each sentence.
	forEach( sentences, function( sentence ) {
		var strippedSentence = stripHTMLTags( sentence );

		var subSentences = getSubsentences( strippedSentence );

		var passive = false;
		forEach( subSentences, function( subSentence ) {
			passive = passive || determinePassives( subSentence );
		} );

		if ( passive === true ) {
			passiveSentences.push( sentence );
		}
	} );

	return {
		total: sentences.length,
		passives: passiveSentences
	};
};

},{"../stringProcessing/createRegexFromArray.js":363,"../stringProcessing/getSentences.js":369,"../stringProcessing/matchWordInSentence.js":378,"../stringProcessing/quotes.js":379,"../stringProcessing/stripHTMLTags.js":387,"../stringProcessing/stripSpaces.js":390,"./english/passivevoice-english/auxiliaries.js":314,"./english/passivevoice-english/determiners.js":315,"./english/passivevoice-english/irregulars.js":316,"./english/passivevoice-english/non-verb-ending-ed.js":317,"./english/passivevoice-english/stopwords.js":318,"lodash/filter":189,"lodash/forEach":194,"lodash/includes":200,"lodash/isUndefined":218}],335:[function(require,module,exports){
var getSentences = require( "../stringProcessing/getSentences.js" );
var getWords = require( "../stringProcessing/getWords.js" );
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );
var stripTagParts = require( "../stringProcessing/stripHTMLTags.js" ).stripIncompleteTags;
var removeNonWordCharacters = require( "../stringProcessing/removeNonWordCharacters.js" );
var getFirstWordExceptions = require( "../helpers/getFirstWordExceptions.js" );

var isEmpty = require( "lodash/isEmpty" );
var forEach = require( "lodash/forEach" );

/**
 * Compares the first word of each sentence with the first word of the following sentence.
 *
 * @param {string} currentSentenceBeginning The first word of the current sentence.
 * @param {string} nextSentenceBeginning The first word of the next sentence.
 * @returns {boolean} Returns true if sentence beginnings match.
 */
var startsWithSameWord = function( currentSentenceBeginning, nextSentenceBeginning ) {
	if ( !isEmpty( currentSentenceBeginning ) && currentSentenceBeginning === nextSentenceBeginning ) {
		return true;
	}
	return false;
};

/**
 * Counts the number of similar sentence beginnings.
 * @param {array} sentenceBeginnings The array containing the first word of each sentence.
 * @param {array} sentences The array containing all sentences.
 * @returns {array} The array containing the objects containing the first words and the corresponding counts.
 */
var compareFirstWords = function ( sentenceBeginnings, sentences ) {
	var consecutiveFirstWords = [];
	var foundSentences = [];
	var sameBeginnings = 1;

	forEach( sentenceBeginnings, function( beginning, i ) {
		var currentSentenceBeginning = beginning;
		var nextSentenceBeginning = sentenceBeginnings[ i + 1 ];
		foundSentences.push( sentences[ i ] );

		if ( startsWithSameWord( currentSentenceBeginning, nextSentenceBeginning ) ) {
			sameBeginnings++;
		} else {
			consecutiveFirstWords.push( { word: currentSentenceBeginning, count: sameBeginnings, sentences: foundSentences } );
			sameBeginnings = 1;
			foundSentences = [];
		}
	} );

	return consecutiveFirstWords;
};

/**
 * Gets the first word of each sentence from the text, and returns an object containing the first word of each sentence and the corresponding counts.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The object containing the first word of each sentence and the corresponding counts.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );
	var firstWordExceptions = getFirstWordExceptions( paper.getLocale() )();
	var sentenceBeginnings = sentences.map( function( sentence ) {
		sentence = stripTagParts( sentence );
		var words = getWords( stripSpaces( sentence ) );
		if( words.length === 0 ) {
			return "";
		}
		var firstWord = removeNonWordCharacters( words[ 0 ] ).toLocaleLowerCase();
		if ( firstWordExceptions.indexOf( firstWord ) > -1 && words.length > 1 ) {
			firstWord += " " + removeNonWordCharacters( words[ 1 ] );
		}
		return firstWord;
	} );
	return compareFirstWords( sentenceBeginnings, sentences );
};



},{"../helpers/getFirstWordExceptions.js":296,"../stringProcessing/getSentences.js":369,"../stringProcessing/getWords.js":372,"../stringProcessing/removeNonWordCharacters.js":380,"../stringProcessing/stripHTMLTags.js":387,"../stringProcessing/stripSpaces.js":390,"lodash/forEach":194,"lodash/isEmpty":207}],336:[function(require,module,exports){
var getSubheadingContents = require( "../stringProcessing/getSubheadings.js" ).getSubheadingContents;
var stripTags = require( "../stringProcessing/stripHTMLTags.js" ).stripFullTags;
var forEach = require( "lodash/forEach" );

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the length of each subheading.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var matches = getSubheadingContents( text );

	var subHeadings = [];
	forEach( matches, function( subHeading ) {
		subHeading = stripTags( subHeading ).length;
		if ( subHeading > 0 ) {
			subHeadings.push( subHeading );
		}
	} );

	return subHeadings;
};

},{"../stringProcessing/getSubheadings.js":371,"../stringProcessing/stripHTMLTags.js":387,"lodash/forEach":194}],337:[function(require,module,exports){
var getSubheadingsContents = require( "../stringProcessing/getSubheadings.js" ).getSubheadingContents;

/**
 * Checks if there is a subheading present in the text
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {number} Number of headings found.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var headings = getSubheadingsContents( text ) || [];
	return headings.length;
};

},{"../stringProcessing/getSubheadings.js":371}],338:[function(require,module,exports){
var getSubheadingTexts = require( "../stringProcessing/getSubheadingTexts.js" );
var countWords = require( "../stringProcessing/countWords.js" );
var forEach = require( "lodash/forEach" );

/**
 * Gets the subheadings from the text and returns the length of these subheading in an array.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Array} The array with the length of each subheading.
 */
module.exports = function( paper ) {
	var text = paper.getText();

	var matches = getSubheadingTexts( text );

	var subHeadingTexts = [];
	forEach( matches, function( subHeading ) {

		subHeadingTexts.push( {
			text: subHeading,
			wordCount: countWords( subHeading )
		} );
	} );
	return subHeadingTexts;
};


},{"../stringProcessing/countWords.js":362,"../stringProcessing/getSubheadingTexts.js":370,"lodash/forEach":194}],339:[function(require,module,exports){
var getWords = require( "../stringProcessing/getWords.js" );
var countSyllables = require( "../stringProcessing/countSyllables.js" );
var getSentences = require( "../stringProcessing/getSentences.js" );

var map = require( "lodash/map" );
var forEach = require( "lodash/forEach" );

/**
 * Gets the complexity per word, along with the index for the sentence.
 * @param {string} sentence The sentence to get wordComplexity from.
 * @returns {Array} A list with words, the index and the complexity per word.
 */
var getWordComplexityForSentence = function( sentence ) {
	var words = getWords( sentence );
	var results = [];

	forEach( words, function( word, i ) {
		results.push( {
			word: word,
			wordIndex: i,
			complexity: countSyllables( word )
		} );
	} );

	return results;
};

/**
 * Calculates the complexity of words in a text, returns each words with their complexity.
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {Object} The words found in the text with the number of syllables.
 */
module.exports = function( paper ) {
	var sentences = getSentences( paper.getText() );

	return map( sentences, function( sentence ) {
		return {
			sentence: sentence,
			words: getWordComplexityForSentence( sentence )
		};
	} );
};


},{"../stringProcessing/countSyllables.js":361,"../stringProcessing/getSentences.js":369,"../stringProcessing/getWords.js":372,"lodash/forEach":194,"lodash/map":221}],340:[function(require,module,exports){
/** @module researches/imageAltTags */

var imageInText = require( "../stringProcessing/imageInText" );
var imageAlttag = require( "../stringProcessing/getAlttagContent" );
var wordMatch = require( "../stringProcessing/matchTextWithWord" );

/**
 * Matches the alt-tags in the images found in the text.
 * Returns an object with the totals and different alt-tags.
 *
 * @param {Array} imageMatches Array with all the matched images in the text
 * @param {string} keyword the keyword to check for.
 * @param {string} locale The locale used for transliteration.
 * @returns {object} altProperties Object with all alt-tags that were found.
 */
var matchAltProperties = function( imageMatches, keyword, locale ) {
	var altProperties = {
		noAlt: 0,
		withAlt: 0,
		withAltKeyword: 0,
		withAltNonKeyword: 0
	};

	for ( var i = 0; i < imageMatches.length; i++ ) {
		var alttag = imageAlttag( imageMatches[ i ] );

		// If no alt-tag is set
		if ( alttag === "" ) {
			altProperties.noAlt++;
			continue;
		}

		// If no keyword is set, but the alt-tag is
		if ( keyword === "" && alttag !== "" ) {
			altProperties.withAlt++;
			continue;
		}

		if ( wordMatch( alttag, keyword, locale ) === 0 && alttag !== "" ) {

			// Match for keywords?
			altProperties.withAltNonKeyword++;
			continue;
		}

		if ( wordMatch( alttag, keyword, locale ) > 0 ) {
			altProperties.withAltKeyword++;
			continue;
		}
	}

	return altProperties;
};

/**
 * Checks the text for images, checks the type of each image and alttags for containing keywords
 *
 * @param {Paper} paper The paper to check for images
 * @returns {object} Object containing all types of found images
 */
module.exports = function( paper ) {
	return matchAltProperties( imageInText( paper.getText() ), paper.getKeyword(), paper.getLocale() );
};

},{"../stringProcessing/getAlttagContent":366,"../stringProcessing/imageInText":373,"../stringProcessing/matchTextWithWord":377}],341:[function(require,module,exports){
/** @module researches/imageInText */

var imageInText = require( "./../stringProcessing/imageInText" );

/**
 * Checks the amount of images in the text.
 *
 * @param {Paper} paper The paper to check for images
 * @returns {number} The amount of found images
 */
module.exports = function( paper ) {
	return imageInText( paper.getText() ).length;
};

},{"./../stringProcessing/imageInText":373}],342:[function(require,module,exports){
var countWords = require( "../stringProcessing/countWords" );
var sanitizeString = require( "../stringProcessing/sanitizeString" );

/**
 * Determines the length in words of a the keyphrase, the keyword is a keyphrase if it is more than one word.
 *
 * @param {Paper} paper The paper to research
 * @returns {number} The length of the keyphrase
 */
function keyphraseLengthResearch( paper ) {
	var keyphrase = sanitizeString( paper.getKeyword() );

	return countWords( keyphrase );
}

module.exports = keyphraseLengthResearch;

},{"../stringProcessing/countWords":362,"../stringProcessing/sanitizeString":384}],343:[function(require,module,exports){
/** @module researches/countKeywordInUrl */

var wordMatch = require( "../stringProcessing/matchTextWithWord.js" );
/**
 * Matches the keyword in the URL. Replaces whitespaces with dashes and uses dash as wordboundary.
 *
 * @param {Paper} paper the Paper object to use in this count.
 * @returns {int} Number of times the keyword is found.
 */
module.exports = function( paper ) {
	var keyword = paper.getKeyword().replace( "'", "" ).replace( /\s/ig, "-" );

	return wordMatch( paper.getUrl(), keyword, paper.getLocale() );
};

},{"../stringProcessing/matchTextWithWord.js":377}],344:[function(require,module,exports){
/* @module analyses/matchKeywordInSubheadings */

var stripSomeTags = require( "../stringProcessing/stripNonTextTags.js" );
var subheadingMatch = require( "../stringProcessing/subheadingsMatch.js" );
var getSubheadingContents = require( "../stringProcessing/getSubheadings.js" ).getSubheadingContents;

/**
 * Checks if there are any subheadings like h2 in the text
 * and if they have the keyword in them.
 *
 * @param {object} paper The paper object containing the text and keyword.
 * @returns {object} the result object.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var keyword = paper.getKeyword();
	var locale = paper.getLocale();
	var result = { count: 0 };
	text = stripSomeTags( text );
	var matches = getSubheadingContents( text );

	if ( 0 !== matches.length ) {
		result.count = matches.length;
		result.matches = subheadingMatch( matches, keyword, locale );
	}

	return result;
};


},{"../stringProcessing/getSubheadings.js":371,"../stringProcessing/stripNonTextTags.js":388,"../stringProcessing/subheadingsMatch.js":391}],345:[function(require,module,exports){
var matchTextWithWord = require( "../stringProcessing/matchTextWithWord.js" );

/**
 * Matches the keyword in the description if a description and keyword are available.
 * default is -1 if no description and/or keyword is specified
 *
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The number of matches with the keyword
 */
module.exports = function( paper ) {
	if ( paper.getDescription() === "" ) {
		return -1;
	}
	return matchTextWithWord( paper.getDescription(), paper.getKeyword(), paper.getLocale() );
};


},{"../stringProcessing/matchTextWithWord.js":377}],346:[function(require,module,exports){
/**
 * Check the length of the description.
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The length of the description.
 */
module.exports = function( paper ) {
	return paper.getDescription().length;
};

},{}],347:[function(require,module,exports){
/**
 * Check the width of the title in pixels
 * @param {Paper} paper The paper object containing the title width in pixels.
 * @returns {number} The width of the title in pixels
 */
module.exports = function( paper ) {
	if( paper.hasTitle() ) {
		return paper.getTitleWidth();
	}
	return 0;
};

},{}],348:[function(require,module,exports){
/**
 * Returns an array with exceptions for the sentence beginning researcher.
 * @returns {Array} The array filled with exceptions.
 */
module.exports = function() {
	return [
		// Definite articles:
		"el", "los", "la", "las",
		// Indefinite articles:
		"un", "una", "unas", "unos",
		// Numbers 1-10:
		"uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez",
		// Demonstrative pronouns:
		"este", "estos", "esta", "estas", "ese", "esos", "esa", "esas", "aquel",
		"aquellos", "aquella", "aquellas", "esto", "eso", "aquello" ];
};



},{}],349:[function(require,module,exports){
/** @module config/transitionWords */

/**
 * Returns an array with transition words to be used by the assessments.
 * @returns {Array} The array filled with transition words.
 */
module.exports = function() {
	return [ "a causa de", "a continuación", "a diferencia de", "a la inversa", "a la misma vez", "a más de", "a más de esto",
		"a menos que", "a pesar de", "a pesar de eso", "a pesar de todo", "a peser de", "a propósito", "a saber", "a todo esto",
		"además", "adicional", "al contrario", "al fin y al cabo", "al final", "al inicio", "al mismo tiempo", "al principio",
		"ante todo", "antes de", "aparte de", "as asií como", "así", "así como", "así mismo", "así que", "asimismo", "aún así",
		"aunque", "ciertamente", "claro está que", "claro que", "claro que sí", "como", "como caso típico", "como era de esperarse",
		"como es de esperarse", "como muestra", "como resultado", "como se ha notado", "como sigue", "comparado con", "con que",
		"con relación a", "con todo", "conque", "cuando", "dado que", "de ahí", "de cierta manera", "de cualquier manera",
		"de cualquier modo", "de este modo", "de golpe", "de hecho", "de igual manera", "de igual modo", "de igualmanera",
		"de la manera siguente", "de la misma forma", "de la misma manera", "de manera semejante", "de mismo modo", "de modo que",
		"de nuevo", "de otra manera", "de otro modo", "de qualquier manera", "de repente", "de todas formas", "de todas maneras",
		"de todos modos", "de veras", "debido a", "debido a que", "decididamente", "decisivamente", "del mismo modo",
		"dentro de poco", "desde entonces", "después", "después de", "después de todo", "diferentemente", "dúbitamente",
		"efectivamente", "ejemplo de esto", "en cambio", "en cierto modo", "en comparación con", "en conclusión", "en concreto",
		"en conformidad con", "en consecuencia", "en consiguiente", "en contraste con", "en cuanto", "en cuanto a", "en efecto",
		"en fin", "en fin de cuentas", "en general", "en lugar de", "en otras palabras", "en particular", "en primer lugar",
		"en primer término", "en primera instancia", "en realidad", "en relación a", "en relación con", "en representación de",
		"en resumen", "en segundo lugar", "en síntesis", "en suma", "en todo caso", "en último término", "en verdad", "en vez de",
		"entonces", "entre ellas figura", "entre ellos figura", "es decir", "es más", "especialmente", "específicamente",
		"esto indica", "eventualmente", "finalmente", "frecuentemente", "generalmente", "generalmente por ejemplo",
		"hasta cierto punto", "hay que añadir", "igual que", "igualmente", "la mayor parte del tiempo", "la mayoría del tiempo",
		"lo que es peor", "lógicamente", "luego", "más tarde", "mientras", "mientras tanto", "mirándolo todo", "no faltaría más",
		"no obstante", "o sea", "otra vez", "otro aspecto", "par ilustrar", "par terminar", "para concluir", "para conclusión",
		"para continuar", "para empezar", "para mencionar una cosa", "para que", "para resumir", "pero", "por", "por añadidura",
		"por consiguiente", "por ejemplo", "por el contrario", "por eso", "por esta razón", "por esto", "por fin", "por la mayor parte",
		"por lo general", "por lo tanto", "por orto lado", "por otra parte", "por otro lado", "por supuesto", "por tanto",
		"por último", "por un lado", "por una parte", "porque", "posteriormente", "primero", "primero que nada", "principalmente",
		"pronto", "próximamente", "pues bien", "puesto que", "rara vez", "raramente", "realmente", "resulta que", "seguidamente",
		"seguidamente entre tanto", "segundo", "semejantemente", "siempre que", "sigue que", "siguiente", "sin duda", "sin embargo",
		"sino", "sobre todo", "supongamos", "supuesto que", "tal como", "también", "tan pronto como", "tanto como", "tercero",
		"una vez", "verbigracia", "vice-versa", "ya", "ya que" ];
};

},{}],350:[function(require,module,exports){
/** @module config/twoPartTransitionWords */

/**
 * Returns an array with two-part transition words to be used by the assessments.
 * @returns {Array} The array filled with two-part transition words.
 */
module.exports = function() {
	return [ [ "de un lado", "de otra parte" ], [ "de un lado", "de otro" ], [ "no", "sino que" ], [ "no", "sino" ],
		[ "por un lado", "por otro lado" ], [ "por una parte", "por otra parte" ], [ "por una parte", "por otra" ], [ "tanto", "como" ] ];
};

},{}],351:[function(require,module,exports){
/** @module researches/stopWordsInKeyword */

var stopWordsInText = require( "./stopWordsInText.js" );

/**
 * Checks for the amount of stop words in the keyword.
 * @param {Paper} paper The Paper object to be checked against.
 * @returns {Array} All the stopwords that were found in the keyword.
 */
module.exports = function( paper ) {
	return stopWordsInText( paper.getKeyword() );
};

},{"./stopWordsInText.js":352}],352:[function(require,module,exports){
var stopwords = require( "../config/stopwords.js" )();
var toRegex = require( "../stringProcessing/stringToRegex.js" );

/**
 * Checks a text to see if there are any stopwords, that are defined in the stopwords config.
 *
 * @param {string} text The input text to match stopwords.
 * @returns {Array} An array with all stopwords found in the text.
 */
module.exports = function( text ) {
	var i, matches = [];

	for ( i = 0; i < stopwords.length; i++ ) {
		if ( text.match( toRegex( stopwords[ i ] ) ) !== null ) {
			matches.push( stopwords[ i ] );
		}
	}

	return matches;
};

},{"../config/stopwords.js":286,"../stringProcessing/stringToRegex.js":386}],353:[function(require,module,exports){
/** @module researches/stopWordsInUrl */

var stopWordsInText = require( "./stopWordsInText.js" );

/**
 * Matches stopwords in the URL. Replaces - and _ with whitespace.
 * @param {Paper} paper The Paper object to get the url from.
 * @returns {Array} stopwords found in URL
 */
module.exports = function( paper ) {
	return stopWordsInText( paper.getUrl().replace( /[-_]/g, " " ) );
};

},{"./stopWordsInText.js":352}],354:[function(require,module,exports){
/** @module analyses/isUrlTooLong */

/**
 * Checks if an URL is too long, based on slug and relative to keyword length.
 *
 * @param {object} paper the paper to run this assessment on
 * @returns {boolean} true if the URL is too long, false if it isn't
 */
module.exports = function( paper ) {
	var urlLength = paper.getUrl().length;
	var keywordLength = paper.getKeyword().length;
	var maxUrlLength = 40;
	var maxSlugLength = 20;

	if ( urlLength > maxUrlLength	&& urlLength > keywordLength + maxSlugLength ) {
		return true;
	}
	return false;
};

},{}],355:[function(require,module,exports){
var wordCount = require( "../stringProcessing/countWords.js" );

/**
 * Count the words in the text
 * @param {Paper} paper The Paper object who's
 * @returns {number} The amount of words found in the text.
 */
module.exports = function( paper ) {
	return wordCount( paper.getText() );
};

},{"../stringProcessing/countWords.js":362}],356:[function(require,module,exports){
var Assessor = require( "./assessor.js" );

var introductionKeyword = require( "./assessments/introductionKeywordAssessment.js" );
var keyphraseLength = require( "./assessments/keyphraseLengthAssessment.js" );
var keywordDensity = require( "./assessments/keywordDensityAssessment.js" );
var keywordStopWords = require( "./assessments/keywordStopWordsAssessment.js" );
var metaDescriptionKeyword = require ( "./assessments/metaDescriptionKeywordAssessment.js" );
var metaDescriptionLength = require( "./assessments/metaDescriptionLengthAssessment.js" );
var subheadingsKeyword = require( "./assessments/subheadingsKeywordAssessment.js" );
var textCompetingLinks = require( "./assessments/textCompetingLinksAssessment.js" );
var textImages = require( "./assessments/textImagesAssessment.js" );
var textLength = require( "./assessments/textLengthAssessment.js" );
var textLinks = require( "./assessments/textLinksAssessment.js" );
var titleKeyword = require( "./assessments/titleKeywordAssessment.js" );
var titleWidth = require( "./assessments/pageTitleWidthAssessment.js" );
var urlKeyword = require( "./assessments/urlKeywordAssessment.js" );
var urlLength = require( "./assessments/urlLengthAssessment.js" );
var urlStopWords = require( "./assessments/urlStopWordsAssessment.js" );
/**
 * Creates the Assessor
 *
 * @param {object} i18n The i18n object used for translations.
 * @param {Object} options The options for this assessor.
 * @param {Object} options.marker The marker to pass the list of marks to.
 *
 * @constructor
 */
var SEOAssessor = function( i18n, options ) {
	Assessor.call( this, i18n, options );

	this._assessments = [
		introductionKeyword,
		keyphraseLength,
		keywordDensity,
		keywordStopWords,
		metaDescriptionKeyword,
		metaDescriptionLength,
		subheadingsKeyword,
		textCompetingLinks,
		textImages,
		textLength,
		textLinks,
		titleKeyword,
		titleWidth,
		urlKeyword,
		urlLength,
		urlStopWords
	];
};

module.exports = SEOAssessor;

require( "util" ).inherits( module.exports, Assessor );


},{"./assessments/introductionKeywordAssessment.js":256,"./assessments/keyphraseLengthAssessment.js":257,"./assessments/keywordDensityAssessment.js":258,"./assessments/keywordStopWordsAssessment.js":259,"./assessments/metaDescriptionKeywordAssessment.js":260,"./assessments/metaDescriptionLengthAssessment.js":261,"./assessments/pageTitleWidthAssessment.js":262,"./assessments/subheadingsKeywordAssessment.js":268,"./assessments/textCompetingLinksAssessment.js":270,"./assessments/textImagesAssessment.js":271,"./assessments/textLengthAssessment.js":272,"./assessments/textLinksAssessment.js":273,"./assessments/titleKeywordAssessment.js":275,"./assessments/urlKeywordAssessment.js":277,"./assessments/urlLengthAssessment.js":278,"./assessments/urlStopWordsAssessment.js":279,"./assessor.js":280,"util":251}],357:[function(require,module,exports){
/* jshint browser: true */

var isEmpty = require( "lodash/isEmpty" );
var isElement = require( "lodash/isElement" );
var isUndefined = require( "lodash/isUndefined" );
var clone = require( "lodash/clone" );
var defaultsDeep = require( "lodash/defaultsDeep" );
var forEach = require( "lodash/forEach" );
var debounce = require( "lodash/debounce" );

var stringToRegex = require( "../js/stringProcessing/stringToRegex.js" );
var stripHTMLTags = require( "../js/stringProcessing/stripHTMLTags.js" ).stripFullTags;
var sanitizeString = require( "../js/stringProcessing/sanitizeString.js" );
var stripSpaces = require( "../js/stringProcessing/stripSpaces.js" );
var replaceDiacritics = require( "../js/stringProcessing/replaceDiacritics.js" );
var transliterate = require( "../js/stringProcessing/transliterate.js" );
var analyzerConfig = require( "./config/config.js" );

var templates = require( "./templates.js" );
var snippetEditorTemplate = templates.snippetEditor;
var hiddenElement = templates.hiddenSpan;

var domManipulation = require( "./helpers/domManipulation.js" );

var defaults = {
	data: {
		title: "",
		metaDesc: "",
		urlPath: "",
		titleWidth: 0,
		metaHeight: 0
	},
	placeholder: {
		title:    "This is an example title - edit by clicking here",
		metaDesc: "Modify your meta description by editing it right here",
		urlPath:  "example-post/"
	},
	defaultValue: {
		title: "",
		metaDesc: ""
	},
	baseURL: "http://example.com/",
	callbacks: {
		saveSnippetData: function() {}
	},
	addTrailingSlash: true,
	metaDescriptionDate: ""
};

var titleMaxLength = 600;

var inputPreviewBindings = [
	{
		"preview": "title_container",
		"inputField": "title"
	},
	{
		"preview": "url_container",
		"inputField": "urlPath"
	},
	{
		"preview": "meta_container",
		"inputField": "metaDesc"
	}
];

/**
 * Get's the base URL for this instance of the snippet preview.
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The base URL.
 */
var getBaseURL = function() {
	var baseURL = this.opts.baseURL;

	/*
	 * For backwards compatibility, if no URL was passed to the snippet editor we try to retrieve the base URL from the
	 * rawData in the App. This is because the scrapers used to be responsible for retrieving the baseURL, but the base
	 * URL is static so we can just pass it to the snippet editor.
	 */
	if ( this.hasApp() && !isEmpty( this.refObj.rawData.baseUrl ) && this.opts.baseURL === defaults.baseURL ) {
		baseURL = this.refObj.rawData.baseUrl;
	}

	return baseURL;
};

/**
 * Retrieves unformatted text from the data object
 *
 * @private
 * @this SnippetPreview
 *
 * @param {string} key The key to retrieve.
 * @returns {string} The unformatted text.
 */
function retrieveUnformattedText( key ) {
	return this.data[ key ];
}

/**
 * Update data and DOM objects when the unformatted text is updated, here for backwards compatibility
 *
 * @private
 * @this SnippetPreview
 *
 * @param {string} key The data key to update.
 * @param {string} value The value to update.
 * @returns {void}
 */
function updateUnformattedText( key, value ) {
	this.element.input[ key ].value = value;

	this.data[ key ] = value;
}

/**
 * Returns if a url has a trailing slash or not.
 *
 * @param {string} url The url to check for a trailing slash.
 * @returns {boolean} Whether or not the url contains a trailing slash.
 */
function hasTrailingSlash( url ) {
	return url.indexOf( "/" ) === ( url.length - 1 );
}

/**
 * Detects if this browser has <progress> support. Also serves as a poor man's HTML5shiv.
 *
 * @private
 *
 * @returns {boolean} Whether or not the browser supports a <progress> element
 */
function hasProgressSupport() {
	var progressElement = document.createElement( "progress" );

	return !isUndefined( progressElement.max );
}

/**
 * Returns a rating based on the length of the title
 *
 * @param {number} titleLength the length of the title.
 * @returns {string} The rating given based on the title length.
 */
function rateTitleLength( titleLength ) {
	var rating;

	switch ( true ) {
		case titleLength > 0 && titleLength <= 399:
		case titleLength > 600:
			rating = "ok";
			break;

		case titleLength >= 400 && titleLength <= 600:
			rating = "good";
			break;

		default:
			rating = "bad";
			break;
	}

	return rating;
}

/**
 * Returns a rating based on the length of the meta description
 *
 * @param {number} metaDescLength the length of the meta description.
 * @returns {string} The rating given based on the description length.
 */
function rateMetaDescLength( metaDescLength ) {
	var rating;

	switch ( true ) {
		case metaDescLength > 0 && metaDescLength <= 120:
		case metaDescLength >= 157:
			rating = "ok";
			break;

		case metaDescLength >= 120 && metaDescLength <= 157:
			rating = "good";
			break;

		default:
			rating = "bad";
			break;
	}

	return rating;
}

/**
 * Updates a progress bar
 *
 * @private
 * @this SnippetPreview
 *
 * @param {HTMLElement} element The progress element that's rendered.
 * @param {number} value The current value.
 * @param {number} maximum The maximum allowed value.
 * @param {string} rating The SEO score rating for this value.
 * @returns {void}
 */
function updateProgressBar( element, value, maximum, rating ) {
	var barElement, progress,
		allClasses = [
			"snippet-editor__progress--bad",
			"snippet-editor__progress--ok",
			"snippet-editor__progress--good"
		];

	element.value = value;
	domManipulation.removeClasses( element, allClasses );
	domManipulation.addClass( element, "snippet-editor__progress--" + rating );

	if ( !this.hasProgressSupport ) {
		barElement = element.getElementsByClassName( "snippet-editor__progress-bar" )[ 0 ];
		progress = ( value / maximum ) * 100;

		barElement.style.width = progress + "%";
	}
}

/**
 * @module snippetPreview
 */

/**
 * Defines the config and outputTarget for the SnippetPreview
 *
 * @param {Object}         opts                           - Snippet preview options.
 * @param {App}            opts.analyzerApp               - The app object the snippet preview is part of.
 * @param {Object}         opts.placeholder               - The placeholder values for the fields, will be shown as
 * actual placeholders in the inputs and as a fallback for the preview.
 * @param {string}         opts.placeholder.title         - The placeholder title.
 * @param {string}         opts.placeholder.metaDesc      - The placeholder meta description.
 * @param {string}         opts.placeholder.urlPath       - The placeholder url.
 *
 * @param {Object}         opts.defaultValue              - The default value for the fields, if the user has not
 * changed a field, this value will be used for the analyzer, preview and the progress bars.
 * @param {string}         opts.defaultValue.title        - The default title.
 * @param {string}         opts.defaultValue.metaDesc     - The default meta description.
 * it.
 *
 * @param {string}         opts.baseURL                   - The basic URL as it will be displayed in google.
 * @param {HTMLElement}    opts.targetElement             - The target element that contains this snippet editor.
 *
 * @param {Object}         opts.callbacks                 - Functions that are called on specific instances.
 * @param {Function}       opts.callbacks.saveSnippetData - Function called when the snippet data is changed.
 *
 * @param {boolean}        opts.addTrailingSlash          - Whether or not to add a trailing slash to the URL.
 * @param {string}         opts.metaDescriptionDate       - The date to display before the meta description.
 *
 * @param {Jed}            opts.i18n                      - The translation object.
 *
 * @property {App}         refObj                         - The connected app object.
 * @property {Jed}         i18n                           - The translation object.
 *
 * @property {HTMLElement} targetElement                  - The target element that contains this snippet editor.
 *
 * @property {Object}      element                        - The elements for this snippet editor.
 * @property {Object}      element.rendered               - The rendered elements.
 * @property {HTMLElement} element.rendered.title         - The rendered title element.
 * @property {HTMLElement} element.rendered.urlPath       - The rendered url path element.
 * @property {HTMLElement} element.rendered.urlBase       - The rendered url base element.
 * @property {HTMLElement} element.rendered.metaDesc      - The rendered meta description element.
 *
 * @property {HTMLElement} element.measurers.titleWidth   - The rendered title width element.
 * @property {HTMLElement} element.measurers.metaHeight   - The rendered meta height element.
 *
 * @property {Object}      element.input                  - The input elements.
 * @property {HTMLElement} element.input.title            - The title input element.
 * @property {HTMLElement} element.input.urlPath          - The url path input element.
 * @property {HTMLElement} element.input.metaDesc         - The meta description input element.
 *
 * @property {HTMLElement} element.container              - The main container element.
 * @property {HTMLElement} element.formContainer          - The form container element.
 * @property {HTMLElement} element.editToggle             - The button that toggles the editor form.
 *
 * @property {Object}      data                           - The data for this snippet editor.
 * @property {string}      data.title                     - The title.
 * @property {string}      data.urlPath                   - The url path.
 * @property {string}      data.metaDesc                  - The meta description.
 * @property {int}         data.titleWidth                - The width of the title in pixels.
 * @property {int}         data.metaHeight                - The height of the meta description in pixels.
 *
 * @property {string}      baseURL                        - The basic URL as it will be displayed in google.
 *
 * @property {boolean}     hasProgressSupport             - Whether this browser supports the <progress> element.
 *
 * @constructor
 */
var SnippetPreview = function( opts ) {
	defaultsDeep( opts, defaults );

	this.data = opts.data;

	if ( !isUndefined( opts.analyzerApp ) ) {
		this.refObj = opts.analyzerApp;
		this.i18n = this.refObj.i18n;

		this.data = {
			title: this.refObj.rawData.snippetTitle || "",
			urlPath: this.refObj.rawData.snippetCite || "",
			metaDesc: this.refObj.rawData.snippetMeta || ""
		};

		// For backwards compatibility set the metaTitle as placeholder.
		if ( !isEmpty( this.refObj.rawData.metaTitle ) ) {
			opts.placeholder.title = this.refObj.rawData.metaTitle;
		}
	}

	if ( !isUndefined( opts.i18n ) ) {
		this.i18n = opts.i18n;
	}

	if ( !isElement( opts.targetElement ) ) {
		throw new Error( "The snippet preview requires a valid target element" );
	}

	this.opts = opts;
	this._currentFocus = null;
	this._currentHover = null;

	// For backwards compatibility monitor the unformatted text for changes and reflect them in the preview
	this.unformattedText = {};
	Object.defineProperty( this.unformattedText, "snippet_cite", {
		get: retrieveUnformattedText.bind( this, "urlPath" ),
		set: updateUnformattedText.bind( this, "urlPath" )
	} );
	Object.defineProperty( this.unformattedText, "snippet_meta", {
		get: retrieveUnformattedText.bind( this, "metaDesc" ),
		set: updateUnformattedText.bind( this, "metaDesc" )
	} );
	Object.defineProperty( this.unformattedText, "snippet_title", {
		get: retrieveUnformattedText.bind( this, "title" ),
		set: updateUnformattedText.bind( this, "title" )
	} );
};

/**
 * Renders snippet editor and adds it to the targetElement
 * @returns {void}
 */
SnippetPreview.prototype.renderTemplate = function() {
	var targetElement = this.opts.targetElement;

	targetElement.innerHTML = snippetEditorTemplate( {
		raw: {
			title: this.data.title,
			snippetCite: this.data.urlPath,
			meta: this.data.metaDesc
		},
		rendered: {
			title: this.formatTitle(),
			baseUrl: this.formatUrl(),
			snippetCite: this.formatCite(),
			meta: this.formatMeta()
		},
		metaDescriptionDate: this.opts.metaDescriptionDate,
		placeholder: this.opts.placeholder,
		i18n: {
			edit: this.i18n.dgettext( "js-text-analysis", "Edit snippet" ),
			title: this.i18n.dgettext( "js-text-analysis", "SEO title" ),
			slug:  this.i18n.dgettext( "js-text-analysis", "Slug" ),
			metaDescription: this.i18n.dgettext( "js-text-analysis", "Meta description" ),
			save: this.i18n.dgettext( "js-text-analysis", "Close snippet editor" ),
			snippetPreview: this.i18n.dgettext( "js-text-analysis", "Snippet preview" ),
			titleLabel: this.i18n.dgettext( "js-text-analysis", "SEO title preview:" ),
			slugLabel: this.i18n.dgettext( "js-text-analysis", "Slug preview:" ),
			metaDescriptionLabel: this.i18n.dgettext( "js-text-analysis", "Meta description preview:" ),
			snippetPreviewDescription: this.i18n.dgettext(
				"js-text-analysis",
				"You can click on each element in the preview to jump to the Snippet Editor."
			)
		}
	} );

	this.element = {
		measurers: {
			metaHeight: null
		},
		rendered: {
			title: document.getElementById( "snippet_title" ),
			urlBase: document.getElementById( "snippet_citeBase" ),
			urlPath: document.getElementById( "snippet_cite" ),
			metaDesc: document.getElementById( "snippet_meta" )
		},
		input: {
			title: targetElement.getElementsByClassName( "js-snippet-editor-title" )[ 0 ],
			urlPath: targetElement.getElementsByClassName( "js-snippet-editor-slug" )[ 0 ],
			metaDesc: targetElement.getElementsByClassName( "js-snippet-editor-meta-description" )[ 0 ]
		},
		progress: {
			title: targetElement.getElementsByClassName( "snippet-editor__progress-title" )[ 0 ],
			metaDesc: targetElement.getElementsByClassName( "snippet-editor__progress-meta-description" )[ 0 ]
		},
		container: document.getElementById( "snippet_preview" ),
		formContainer: targetElement.getElementsByClassName( "snippet-editor__form" )[ 0 ],
		editToggle: targetElement.getElementsByClassName( "snippet-editor__edit-button" )[ 0 ],
		closeEditor: targetElement.getElementsByClassName( "snippet-editor__submit" )[ 0 ],
		formFields: targetElement.getElementsByClassName( "snippet-editor__form-field" )
	};

	this.element.label = {
		title: this.element.input.title.parentNode,
		urlPath: this.element.input.urlPath.parentNode,
		metaDesc: this.element.input.metaDesc.parentNode
	};

	this.element.preview = {
		title: this.element.rendered.title.parentNode,
		urlPath: this.element.rendered.urlPath.parentNode,
		metaDesc: this.element.rendered.metaDesc.parentNode
	};

	this.hasProgressSupport = hasProgressSupport();

	if ( this.hasProgressSupport ) {
		this.element.progress.title.max = titleMaxLength;
		this.element.progress.metaDesc.max = analyzerConfig.maxMeta;
	} else {
		forEach( this.element.progress, function( progressElement ) {
			domManipulation.addClass( progressElement, "snippet-editor__progress--fallback" );
		} );
	}

	this.opened = false;
	this.createMeasurementElements();
	this.updateProgressBars();
};

/**
 * Refreshes the snippet editor rendered HTML
 * @returns {void}
 */
SnippetPreview.prototype.refresh = function() {
	this.output = this.htmlOutput();
	this.renderOutput();
	this.renderSnippetStyle();
	this.measureTitle();
	this.measureMetaDescription();
	this.updateProgressBars();
};

/**
 * Returns the title as meant for the analyzer
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The title that is meant for the analyzer.
 */
function getAnalyzerTitle() {
	var title = this.data.title;

	if ( isEmpty( title ) ) {
		title = this.opts.defaultValue.title;
	}

	if ( this.hasPluggable() ) {
		title = this.refObj.pluggable._applyModifications( "data_page_title", title );
	}

	return stripSpaces( title );
}

/**
 * Returns the metaDescription, includes the date if it is set.
 *
 * @private
 * @this SnippetPreview
 *
 * @returns {string} The meta data for the analyzer.
 */
var getAnalyzerMetaDesc = function() {
	var metaDesc = this.data.metaDesc;

	if ( isEmpty( metaDesc ) ) {
		metaDesc = this.opts.defaultValue.metaDesc;
	}

	if ( this.hasPluggable() ) {
		metaDesc = this.refObj.pluggable._applyModifications( "data_meta_desc", metaDesc );
	}

	if ( !isEmpty( this.opts.metaDescriptionDate ) && !isEmpty( metaDesc ) ) {
		metaDesc = this.opts.metaDescriptionDate + " - " + this.data.metaDesc;
	}

	return stripSpaces( metaDesc );
};

/**
 * Returns the data from the snippet preview.
 *
 * @returns {Object} The collected data for the analyzer.
 */
SnippetPreview.prototype.getAnalyzerData = function() {
	return {
		title:    getAnalyzerTitle.call( this ),
		url:      this.data.urlPath,
		metaDesc: getAnalyzerMetaDesc.call( this )
	};
};

/**
 * Calls the event binder that has been registered using the callbacks option in the arguments of the App.
 * @returns {void}
 */
SnippetPreview.prototype.callRegisteredEventBinder = function() {
	if ( this.hasApp() ) {
		this.refObj.callbacks.bindElementEvents( this.refObj );
	}
};

/**
 *  Checks if title and url are set so they can be rendered in the snippetPreview
 *  @returns {void}
 */
SnippetPreview.prototype.init = function() {
	if (
		this.hasApp() &&
		this.refObj.rawData.metaTitle !== null &&
		this.refObj.rawData.cite !== null
	) {
		this.refresh();
	}
};

/**
 * Creates html object to contain the strings for the snippetpreview
 *
 * @returns {Object} The HTML output of the collected data.
 */
SnippetPreview.prototype.htmlOutput = function() {
	var html = {};
	html.title = this.formatTitle();
	html.cite = this.formatCite();
	html.meta = this.formatMeta();
	html.url = this.formatUrl();
	return html;
};

/**
 * Formats the title for the snippet preview. If title and pageTitle are empty, sampletext is used
 *
 * @returns {string} The correctly formatted title.
 */
SnippetPreview.prototype.formatTitle = function() {
	var title = this.data.title;

	// Fallback to the default if the title is empty.
	if ( isEmpty( title ) ) {
		title = this.opts.defaultValue.title;
	}

	// For rendering we can fallback to the placeholder as well.
	if ( isEmpty( title ) ) {
		title = this.opts.placeholder.title;
	}

	// Apply modification to the title before showing it.
	if ( this.hasPluggable() && this.refObj.pluggable.loaded ) {
		title = this.refObj.pluggable._applyModifications( "data_page_title", title );
	}

	title = stripHTMLTags( title );

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( title ) ) {
		title = this.i18n.dgettext( "js-text-analysis", "Please provide an SEO title by editing the snippet below." );
	}

	return title;
};

/**
 * Formats the base url for the snippet preview. Removes the protocol name from the URL.
 *
 * @returns {string} Formatted base url for the snippet preview.
 */
SnippetPreview.prototype.formatUrl = function() {
	var url = getBaseURL.call( this );

	// Removes the http part of the url, google displays https:// if the website supports it.
	return url.replace( /http:\/\//ig, "" );
};

/**
 * Formats the url for the snippet preview
 *
 * @returns {string} Formatted URL for the snippet preview.
 */
SnippetPreview.prototype.formatCite = function() {
	var cite = this.data.urlPath;

	cite = replaceDiacritics( stripHTMLTags( cite ) );

	// Fallback to the default if the cite is empty.
	if ( isEmpty( cite ) ) {
		cite = this.opts.placeholder.urlPath;
	}

	if ( this.hasApp() && !isEmpty( this.refObj.rawData.keyword ) ) {
		cite = this.formatKeywordUrl( cite );
	}

	if ( this.opts.addTrailingSlash && !hasTrailingSlash( cite ) ) {
		cite = cite + "/";
	}

	// URL's cannot contain whitespace so replace it by dashes.
	cite = cite.replace( /\s/g, "-" );

	return cite;
};

/**
 * Formats the meta description for the snippet preview, if it's empty retrieves it using getMetaText.
 *
 * @returns {string} Formatted meta description.
 */
SnippetPreview.prototype.formatMeta = function() {
	var meta = this.data.metaDesc;

	// If no meta has been set, generate one.
	if ( isEmpty( meta ) ) {
		meta = this.getMetaText();
	}

	// Apply modification to the desc before showing it.
	if ( this.hasPluggable() && this.refObj.pluggable.loaded ) {
		meta = this.refObj.pluggable._applyModifications( "data_meta_desc", meta );
	}

	meta = stripHTMLTags( meta );

	// Cut-off the meta description according to the maximum length
	meta = meta.substring( 0, analyzerConfig.maxMeta );

	if ( this.hasApp() && !isEmpty( this.refObj.rawData.keyword ) ) {
		meta = this.formatKeyword( meta );
	}

	// As an ultimate fallback provide the user with a helpful message.
	if ( isEmpty( meta ) ) {
		meta = this.i18n.dgettext( "js-text-analysis", "Please provide a meta description by editing the snippet below." );
	}

	return meta;
};

/**
 * Generates a meta description with an educated guess based on the passed text and excerpt. It uses the keyword to
 * select an appropriate part of the text. If the keyword isn't present it takes the first 156 characters of the text.
 * If both the keyword, text and excerpt are empty this function returns the sample text.
 *
 * @returns {string} A generated meta description.
 */
SnippetPreview.prototype.getMetaText = function() {
	var metaText = this.opts.defaultValue.metaDesc;

	if ( this.hasApp() && !isUndefined( this.refObj.rawData.excerpt ) && isEmpty( metaText ) ) {
		metaText = this.refObj.rawData.excerpt;
	}

	if ( this.hasApp() && !isUndefined( this.refObj.rawData.text ) && isEmpty( metaText ) ) {
		metaText = this.refObj.rawData.text;

		if ( this.hasPluggable() && this.refObj.pluggable.loaded ) {
			metaText = this.refObj.pluggable._applyModifications( "content", metaText );
		}
	}

	metaText = stripHTMLTags( metaText );

	return metaText.substring( 0, analyzerConfig.maxMeta );
};

/**
 * Builds an array with all indexes of the keyword
 * @returns {Array} Array with matches
 */
SnippetPreview.prototype.getIndexMatches = function() {
	var indexMatches = [];
	var i = 0;

	// Starts at 0, locates first match of the keyword.
	var match = this.refObj.rawData.text.indexOf(
		this.refObj.rawData.keyword,
		i
	);

	// Runs the loop untill no more indexes are found, and match returns -1.
	while ( match > -1 ) {
		indexMatches.push( match );

		// Pushes location to indexMatches and increase i with the length of keyword.
		i = match + this.refObj.rawData.keyword.length;
		match = this.refObj.rawData.text.indexOf(
			this.refObj.rawData.keyword,
			i
		);
	}
	return indexMatches;
};

/**
 * Builds an array with indexes of all sentence ends (select on .)
 * @returns {Array} Array with sentences.
 */
SnippetPreview.prototype.getPeriodMatches = function() {
	var periodMatches = [ 0 ];
	var match;
	var i = 0;
	while ( ( match = this.refObj.rawData.text.indexOf( ".", i ) ) > -1 ) {
		periodMatches.push( match );
		i = match + 1;
	}
	return periodMatches;
};

/**
 * Formats the keyword for use in the snippetPreview by adding <strong>-tags
 * strips unwanted characters that could break the regex or give unwanted results.
 *
 * @param {string} textString The keyword string that needs to be formatted.
 * @returns {string} The formatted keyword.
 */
SnippetPreview.prototype.formatKeyword = function( textString ) {
	// Removes characters from the keyword that could break the regex, or give unwanted results.
	var keyword = this.refObj.rawData.keyword.replace( /[\[\]\{\}\(\)\*\+\?\.\^\$\|]/g, " " );

	// Match keyword case-insensitively.
	var keywordRegex = stringToRegex( keyword, "", false );

	textString = textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );

	// Transliterate the keyword for highlighting
	var transliterateKeyword = transliterate( keyword, this.refObj.rawData.locale );
	if ( transliterateKeyword !== keyword ) {
		keywordRegex = stringToRegex( transliterateKeyword, "", false );
		textString = textString.replace( keywordRegex, function( str ) {
			return "<strong>" + str + "</strong>";
		} );
	}
	return textString;
};

/**
 * Formats the keyword for use in the URL by accepting - and _ in stead of space and by adding
 * <strong>-tags
 * Strips unwanted characters that could break the regex or give unwanted results
 *
 * @param {string} textString The keyword string that needs to be formatted.
 * @returns {XML|string|void} The formatted keyword string to be used in the URL.
 */
SnippetPreview.prototype.formatKeywordUrl = function( textString ) {
	var keyword = sanitizeString( this.refObj.rawData.keyword );
	keyword = transliterate( keyword, this.refObj.rawData.locale );
	keyword = keyword.replace( /'/, "" );

	var dashedKeyword = keyword.replace( /\s/g, "-" );

	// Match keyword case-insensitively.
	var keywordRegex = stringToRegex( dashedKeyword, "\\-" );

	// Make the keyword bold in the textString.
	return textString.replace( keywordRegex, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * Renders the outputs to the elements on the page.
 * @returns {void}
 */
SnippetPreview.prototype.renderOutput = function() {
	this.element.rendered.title.innerHTML = this.output.title;
	this.element.rendered.urlPath.innerHTML = this.output.cite;
	this.element.rendered.urlBase.innerHTML = this.output.url;
	this.element.rendered.metaDesc.innerHTML = this.output.meta;
};

/**
 * Makes the rendered meta description gray if no meta description has been set by the user.
 * @returns {void}
 */
SnippetPreview.prototype.renderSnippetStyle = function() {
	var metaDescElement = this.element.rendered.metaDesc;
	var metaDesc = getAnalyzerMetaDesc.call( this );

	if ( isEmpty( metaDesc ) ) {
		domManipulation.addClass( metaDescElement, "desc-render" );
		domManipulation.removeClass( metaDescElement, "desc-default" );
	} else {
		domManipulation.addClass( metaDescElement, "desc-default" );
		domManipulation.removeClass( metaDescElement, "desc-render" );
	}
};

/**
 * Function to call init, to rerender the snippetpreview
 * @returns {void}
 */
SnippetPreview.prototype.reRender = function() {
	this.init();
};

/**
 * Checks text length of the snippetmeta and snippet title, shortens it if it is too long.
 * @param {Object} event The event to check the text length from.
 * @returns {void}
 */
SnippetPreview.prototype.checkTextLength = function( event ) {
	var text = event.currentTarget.textContent;
	switch ( event.currentTarget.id ) {
		case "snippet_meta":
			event.currentTarget.className = "desc";
			if ( text.length > analyzerConfig.maxMeta ) {
				/* eslint-disable */
				YoastSEO.app.snippetPreview.unformattedText.snippet_meta = event.currentTarget.textContent;
				/* eslint-enable */
				event.currentTarget.textContent = text.substring(
					0,
					analyzerConfig.maxMeta
				);

			}
			break;
		case "snippet_title":
			event.currentTarget.className = "title";
			if ( text.length > titleMaxLength ) {
				/* eslint-disable */
				YoastSEO.app.snippetPreview.unformattedText.snippet_title = event.currentTarget.textContent;
				/* eslint-enable */
				event.currentTarget.textContent = text.substring( 0, titleMaxLength );
			}
			break;
		default:
			break;
	}
};

/**
 * When clicked on an element in the snippet, checks fills the textContent with the data from the unformatted text.
 * This removes the keyword highlighting and modified data so the original content can be editted.
 * @param {Object} event The event to get the unformatted text from.
 * @returns {void}
 */
SnippetPreview.prototype.getUnformattedText = function( event ) {
	var currentElement = event.currentTarget.id;
	if ( typeof this.unformattedText[ currentElement ] !== "undefined" ) {
		event.currentTarget.textContent = this.unformattedText[ currentElement ];
	}
};

/**
 * When text is entered into the snippetPreview elements, the text is set in the unformattedText object.
 * This allows the visible data to be editted in the snippetPreview.
 * @param {Object} event The event to set the unformatted text from.
 * @returns {void}
 */
SnippetPreview.prototype.setUnformattedText = function( event ) {
	var elem =  event.currentTarget.id;
	this.unformattedText[ elem ] = document.getElementById( elem ).textContent;
};

/**
 * Validates all fields and highlights errors.
 * @returns {void}
 */
SnippetPreview.prototype.validateFields = function() {
	var metaDescription = getAnalyzerMetaDesc.call( this );
	var title = getAnalyzerTitle.call( this );

	if ( metaDescription.length > analyzerConfig.maxMeta ) {
		domManipulation.addClass( this.element.input.metaDesc, "snippet-editor__field--invalid" );
	} else {
		domManipulation.removeClass( this.element.input.metaDesc, "snippet-editor__field--invalid" );
	}

	if ( title.length > titleMaxLength ) {
		domManipulation.addClass( this.element.input.title, "snippet-editor__field--invalid" );
	} else {
		domManipulation.removeClass( this.element.input.title, "snippet-editor__field--invalid" );
	}
};

/**
 * Updates progress bars based on the data
 * @returns {void}
 */
SnippetPreview.prototype.updateProgressBars = function() {
	var metaDescriptionRating, titleRating, metaDescription;

	metaDescription = getAnalyzerMetaDesc.call( this );

	titleRating = rateTitleLength( this.data.titleWidth );
	metaDescriptionRating = rateMetaDescLength( metaDescription.length );

	updateProgressBar(
		this.element.progress.title,
		this.data.titleWidth,
		titleMaxLength,
		titleRating
	);

	updateProgressBar(
		this.element.progress.metaDesc,
		metaDescription.length,
		analyzerConfig.maxMeta,
		metaDescriptionRating
	);
};

/**
 * Binds the reloadSnippetText function to the blur of the snippet inputs.
 * @returns {void}
 */
SnippetPreview.prototype.bindEvents = function() {
	var targetElement,
		elems = [ "title", "slug", "meta-description" ];

	forEach( elems, function( elem ) {
		targetElement = document.getElementsByClassName( "js-snippet-editor-" + elem )[ 0 ];

		targetElement.addEventListener( "keydown", this.changedInput.bind( this ) );
		targetElement.addEventListener( "keyup", this.changedInput.bind( this ) );

		targetElement.addEventListener( "input", this.changedInput.bind( this ) );
		targetElement.addEventListener( "focus", this.changedInput.bind( this ) );
		targetElement.addEventListener( "blur", this.changedInput.bind( this ) );
	}.bind( this ) );

	this.element.editToggle.addEventListener( "click", this.toggleEditor.bind( this ) );
	this.element.closeEditor.addEventListener( "click", this.closeEditor.bind( this ) );

	// Loop through the bindings and bind a click handler to the click to focus the focus element.
	forEach( inputPreviewBindings, function( binding ) {
		var previewElement = document.getElementById( binding.preview );
		var inputElement = this.element.input[ binding.inputField ];

		// Make the preview element click open the editor and focus the correct input.
		previewElement.addEventListener( "click", function() {
			this.openEditor();
			inputElement.focus();
		}.bind( this ) );

		// Make focusing an input, update the carets.
		inputElement.addEventListener( "focus", function() {
			this._currentFocus = binding.inputField;

			this._updateFocusCarets();
		}.bind( this ) );

		// Make removing focus from an element, update the carets.
		inputElement.addEventListener( "blur", function() {
			this._currentFocus = null;

			this._updateFocusCarets();
		}.bind( this ) );

		previewElement.addEventListener( "mouseover", function() {
			this._currentHover = binding.inputField;

			this._updateHoverCarets();
		}.bind( this ) );

		previewElement.addEventListener( "mouseout", function() {
			this._currentHover = null;

			this._updateHoverCarets();
		}.bind( this ) );

	}.bind( this ) );
};

/**
 * Updates snippet preview on changed input. It's debounced so that we can call this function as much as we want.
 * @returns {void}
 */
SnippetPreview.prototype.changedInput = debounce( function() {
	this.updateDataFromDOM();
	this.validateFields();
	this.updateProgressBars();

	this.refresh();

	if ( this.hasApp() ) {
		this.refObj.refresh();
	}
}, 25 );

/**
 * Updates our data object from the DOM
 * @returns {void}
 */
SnippetPreview.prototype.updateDataFromDOM = function() {
	this.data.title = this.element.input.title.value;
	this.data.urlPath = this.element.input.urlPath.value;
	this.data.metaDesc = this.element.input.metaDesc.value;

	// Clone so the data isn't changeable.
	this.opts.callbacks.saveSnippetData( clone( this.data ) );
};

/**
 * Opens the snippet editor.
 * @returns {void}
 */
SnippetPreview.prototype.openEditor = function() {

	this.element.editToggle.setAttribute( "aria-expanded", "true" );

	// Show these elements.
	domManipulation.removeClass( this.element.formContainer, "snippet-editor--hidden" );

	this.opened = true;
};

/**
 * Closes the snippet editor.
 * @returns {void}
 */
SnippetPreview.prototype.closeEditor = function() {

	// Hide these elements.
	domManipulation.addClass( this.element.formContainer,     "snippet-editor--hidden" );

	this.element.editToggle.setAttribute( "aria-expanded", "false" );
	this.element.editToggle.focus();

	this.opened = false;
};

/**
 * Toggles the snippet editor.
 * @returns {void}
 */
SnippetPreview.prototype.toggleEditor = function() {
	if ( this.opened ) {
		this.closeEditor();
	} else {
		this.openEditor();
	}
};

/**
 * Updates carets before the preview and input fields.
 *
 * @private
 * @returns {void}
 */
SnippetPreview.prototype._updateFocusCarets = function() {
	var focusedLabel, focusedPreview;

	// Disable all carets on the labels.
	forEach( this.element.label, function( element ) {
		domManipulation.removeClass( element, "snippet-editor__label--focus" );
	} );

	// Disable all carets on the previews.
	forEach( this.element.preview, function( element ) {
		domManipulation.removeClass( element, "snippet-editor__container--focus" );
	} );

	if ( null !== this._currentFocus ) {
		focusedLabel = this.element.label[ this._currentFocus ];
		focusedPreview = this.element.preview[ this._currentFocus ];

		domManipulation.addClass( focusedLabel, "snippet-editor__label--focus" );
		domManipulation.addClass( focusedPreview, "snippet-editor__container--focus" );
	}
};

/**
 * Updates hover carets before the input fields.
 *
 * @private
 * @returns {void}
 */
SnippetPreview.prototype._updateHoverCarets = function() {
	var hoveredLabel;

	forEach( this.element.label, function( element ) {
		domManipulation.removeClass( element, "snippet-editor__label--hover" );
	} );

	if ( null !== this._currentHover ) {
		hoveredLabel = this.element.label[ this._currentHover ];

		domManipulation.addClass( hoveredLabel, "snippet-editor__label--hover" );
	}
};

/**
 * Updates the title data and the title input field. This also means the snippet editor view is updated.
 *
 * @param {string} title The title to use in the input field.
 * @returns {void}
 */
SnippetPreview.prototype.setTitle = function( title ) {
	this.element.input.title.value = title;

	this.changedInput();
};

/**
 * Updates the url path data and the url path input field. This also means the snippet editor view is updated.
 *
 * @param {string} urlPath the URL path to use in the input field.
 * @returns {void}
 */
SnippetPreview.prototype.setUrlPath = function( urlPath ) {
	this.element.input.urlPath.value = urlPath;

	this.changedInput();
};

/**
 * Updates the meta description data and the meta description input field. This also means the snippet editor view is updated.
 *
 * @param {string} metaDesc the meta description to use in the input field.
 * @returns {void}
 */
SnippetPreview.prototype.setMetaDescription = function( metaDesc ) {
	this.element.input.metaDesc.value = metaDesc;

	this.changedInput();
};

/**
 * Creates elements with the purpose to calculate the sizes of elements and puts these elemenents to the body.
 */
SnippetPreview.prototype.createMeasurementElements = function() {
	var metaDescriptionElement, spanHolder;
	metaDescriptionElement = hiddenElement(
		{
			width: document.getElementById( "meta_container" ).offsetWidth + "px",
			whiteSpace: ""
		}
	);

	spanHolder = document.createElement( "div" );

	spanHolder.innerHTML = metaDescriptionElement;

	document.body.appendChild( spanHolder );

	this.element.measurers.metaHeight = spanHolder.childNodes[ 0 ];
};

/**
 * Copies the title text to the title measure element to calculate the width in pixels.
 */
SnippetPreview.prototype.measureTitle = function() {
	if( this.element.rendered.title.offsetWidth !== 0 || this.element.rendered.title.textContent === "" ) {
		this.data.titleWidth = this.element.rendered.title.offsetWidth;
	}
};

/**
 * Copies the metadescription text to the metadescription measure element to calculate the height in pixels.
 */
SnippetPreview.prototype.measureMetaDescription = function() {
	var metaHeightElement = this.element.measurers.metaHeight;

	metaHeightElement.innerHTML = this.element.rendered.metaDesc.innerHTML;

	this.data.metaHeight = metaHeightElement.offsetHeight;
};

/**
 * Returns the width of the title in pixels.
 *
 * @returns {Number} The width of the title in pixels.
 */
SnippetPreview.prototype.getTitleWidth = function() {
	return this.data.titleWidth;
};

/**
 * Returns whether or not an app object is present.
 *
 * @returns {boolean} Whether or not there is an App object present.
 */
SnippetPreview.prototype.hasApp = function() {
	return !isUndefined( this.refObj );
};

/**
 * Returns whether or not a pluggable object is present.
 *
 * @returns {boolean} Whether or not there is a Pluggable object present.
 */
SnippetPreview.prototype.hasPluggable = function() {
	return !isUndefined( this.refObj ) && !isUndefined( this.refObj.pluggable );
};

/* jshint ignore:start */
/* eslint-disable */

/**
 * Used to disable enter as input. Returns false to prevent enter, and preventDefault and
 * cancelBubble to prevent
 * other elements from capturing this event.
 *
 * @deprecated
 * @param {KeyboardEvent} ev
 */
SnippetPreview.prototype.disableEnter = function( ev ) {};

/**
 * Adds and remove the tooLong class when a text is too long.
 *
 * @deprecated
 * @param ev
 */
SnippetPreview.prototype.textFeedback = function( ev ) {};

/**
 * shows the edit icon corresponding to the hovered element
 *
 * @deprecated
 *
 * @param ev
 */
SnippetPreview.prototype.showEditIcon = function( ev ) {

};

/**
 * removes all editIcon-classes, sets to snippet_container
 *
 * @deprecated
 */
SnippetPreview.prototype.hideEditIcon = function() {};

/**
 * sets focus on child element of the snippet_container that is clicked. Hides the editicon.
 *
 * @deprecated
 * @param ev
 */
SnippetPreview.prototype.setFocus = function( ev ) {};
/* jshint ignore:end */
/* eslint-disable */
module.exports = SnippetPreview;

},{"../js/stringProcessing/replaceDiacritics.js":382,"../js/stringProcessing/sanitizeString.js":384,"../js/stringProcessing/stringToRegex.js":386,"../js/stringProcessing/stripHTMLTags.js":387,"../js/stringProcessing/stripSpaces.js":390,"../js/stringProcessing/transliterate.js":392,"./config/config.js":282,"./helpers/domManipulation.js":293,"./templates.js":395,"lodash/clone":182,"lodash/debounce":183,"lodash/defaultsDeep":185,"lodash/forEach":194,"lodash/isElement":206,"lodash/isEmpty":207,"lodash/isUndefined":218}],358:[function(require,module,exports){
/** @module stringProcessing/addWordboundary */

/**
 * Returns a string that can be used in a regex to match a matchString with word boundaries.
 *
 * @param {string} matchString The string to generate a regex string for.
 * @param {string} [extraWordBoundary] Extra characters to match a word boundary on.
 * @returns {string} A regex string that matches the matchString with word boundaries.
 */
module.exports = function( matchString, extraWordBoundary ) {
	var wordBoundary, wordBoundaryStart, wordBoundaryEnd;
	var _extraWordBoundary = extraWordBoundary || "";

	wordBoundary = "[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›" + _extraWordBoundary + "<>]";
	wordBoundaryStart = "(^|" + wordBoundary + ")";
	wordBoundaryEnd = "($|" + wordBoundary + ")";

	return wordBoundaryStart + matchString + wordBoundaryEnd;
};

},{}],359:[function(require,module,exports){
/** @module stringProcessing/checkNofollow */

/**
 * Checks if a links has a nofollow attribute. If it has, returns Nofollow, otherwise Dofollow.
 *
 * @param {string} text The text to check against.
 * @returns {string} Returns Dofollow or Nofollow.
 */
module.exports = function( text ) {
	var linkFollow = "Dofollow";

	// Matches all nofollow links, case insensitive and global
	if ( text.match( /rel=([\'\"])nofollow\1/ig ) !== null ) {
		linkFollow = "Nofollow";
	}
	return linkFollow;
};

},{}],360:[function(require,module,exports){
/** @module stringProcessing/countSentences */

var getSentences = require( "../stringProcessing/getSentences.js" );

/**
 * Counts the number of sentences in a given string.
 *
 * @param {string} text The text used to count sentences.
 * @returns {number} The number of sentences in the text.
 */
module.exports = function( text ) {
	var sentences = getSentences( text );
	var sentenceCount = 0;
	for ( var i = 0; i < sentences.length; i++ ) {
		if ( sentences[ i ] !== "" && sentences[ i ] !== " " ) {
			sentenceCount++;
		}
	}
	return sentenceCount;
};

},{"../stringProcessing/getSentences.js":369}],361:[function(require,module,exports){
/** @module stringProcessing/countSyllables */

var syllableMatchers = require( "../config/syllables.js" );

var getWords = require( "../stringProcessing/getWords.js" );

var forEach = require( "lodash/forEach" );
var filter = require( "lodash/filter" );

var exclusionWords = syllableMatchers().exclusionWords;

var vowelRegex = new RegExp( "[^" + syllableMatchers().vowels + "]", "ig" );

var SyllableCountIterator = require( "../values/syllableCountIterator.js" );

var syllableCountIterator = new SyllableCountIterator( syllableMatchers() );

/**
 * Counts the syllables by splitting on consonants, leaving groups of vowels.
 *
 * @param {string} word A text with words to count syllables.
 * @returns {number} the syllable count.
 */
var countUsingVowels = function( word ) {
	var numberOfSyllables = 0;
	var foundVowels = word.split( vowelRegex );
	var filteredWords = filter( foundVowels, function( vowel ) {
		return vowel !== "";
	} );
	numberOfSyllables += filteredWords.length;

	return numberOfSyllables;
};

/**
 * Counts the syllables using vowel exclusions. These are used for groups of vowels that are more or less
 * then 1 syllable.
 *
 * @param {String} word The word to count syllables in.
 * @returns {number} The number of syllables found in the given word.
 */
var countVowelExclusions = function( word ) {
	return syllableCountIterator.countSyllables( word );
};

/**
 * Checks if the word is an exclusion word.
 *
 * @param {String} word The word to check against exclusion words.
 * @returns {number} The number of syllables found.
 */
var countSyllablesInExclusions = function( word ) {
	var syllableCount = 0;
	forEach( exclusionWords, function( exclusionWordsObject ) {
		if( exclusionWordsObject.word === word ) {
			syllableCount = exclusionWordsObject.syllables;

			// If we find an exclusion, we can break out of this forEach.
			return false;
		}
	} );
	return syllableCount;
};

/**
 * Count the number of syllables in a word, using vowels and exceptions.
 *
 * @param {String} word The word to count the number of syllables.
 * @returns {number} The number of syllables found in a word.
 */
var countSyllables = function( word ) {
	var syllableCount = 0;
	syllableCount += countUsingVowels( word );
	syllableCount += countVowelExclusions ( word );
	return syllableCount;
};

/**
 * Counts the number of syllables in a textstring per word based on vowels.
 * Uses exclusion words for words that cannot be matched with vowel matching.
 *
 * @param {String} text The text to count the syllables in.
 * @returns {int} The total number of syllables found in the text.
 */
module.exports = function( text ) {
	var words = getWords( text );

	var syllableCount = 0;

	forEach( words, function( word ) {
		var exclusions = countSyllablesInExclusions( word );
		if ( exclusions !== 0 ) {
			syllableCount += exclusions;
			return;
		}
		syllableCount += countSyllables( word );
	} );
	return syllableCount;
};


},{"../config/syllables.js":287,"../stringProcessing/getWords.js":372,"../values/syllableCountIterator.js":399,"lodash/filter":189,"lodash/forEach":194}],362:[function(require,module,exports){
/** @module stringProcessing/countWords */

var getWords = require( "../stringProcessing/getWords.js" );

/**
 * Calculates the wordcount of a certain text.
 *
 * @param {string} text The text to be counted.
 * @returns {int} The word count of the given text.
 */
module.exports = function( text ) {
	return getWords( text ).length;
};

},{"../stringProcessing/getWords.js":372}],363:[function(require,module,exports){
/** @module stringProcessing/createRegexFromArray */

var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );
var map = require( "lodash/map" );

/**
 * Creates a regex of combined strings from the input array.
 *
 * @param {array} array The array with strings
 * @param {boolean} [disableWordBoundary] Boolean indicating whether or not to disable word boundaries
 * @returns {RegExp} regex The regex created from the array.
 */
module.exports = function( array, disableWordBoundary ) {
	var regexString;
	var _disableWordBoundary = disableWordBoundary || false;

	var boundedArray = map( array, function( string ) {
		if ( _disableWordBoundary ) {
			return string;
		}
		return addWordBoundary( string );
	} );

	regexString = "(" + boundedArray.join( ")|(" ) + ")";

	return new RegExp( regexString, "ig" );
};

},{"../stringProcessing/addWordboundary.js":358,"lodash/map":221}],364:[function(require,module,exports){
/** @module stringProcessing/createRegexFromDoubleArray */

var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

/**
 * Creates a regex string of combined strings from the input array.
 * @param {array} array The array containing the various parts of a transition word combination.
 * @returns {array} The array with replaced entries.
 */
var wordCombinationToRegexString = function( array ) {
	array = array.map( function( word ) {
		return addWordBoundary( word );
	} );
	return array.join( "(.*?)" );
};

/**
 * Creates a regex of combined strings from the input array, containing arrays with two entries.
 * @param {array} array The array containing arrays.
 * @returns {RegExp} The regex created from the array.
 */
module.exports = function ( array ) {
	array = array.map( function( wordCombination ) {
		return wordCombinationToRegexString( wordCombination );
	} );
	var regexString = "(" + array.join( ")|(" ) + ")";
	return new RegExp( regexString, "ig" );
};

},{"../stringProcessing/addWordboundary.js":358}],365:[function(require,module,exports){
/** @module stringProcessing/findKeywordInUrl */

var matchTextWithTransliteration = require( "./matchTextWithTransliteration.js" );

/**
 * Matches the keyword in the URL.
 *
 * @param {string} url The url to check for keyword
 * @param {string} keyword The keyword to check if it is in the URL
 * @param {string} locale The locale used for transliteration.
 * @returns {boolean} If a keyword is found, returns true
 */
module.exports = function( url, keyword, locale ) {
	var formatUrl = url.match( />(.*)/ig );

	if ( formatUrl !== null ) {
		formatUrl = formatUrl[ 0 ].replace( /<.*?>\s?/ig, "" );
		return matchTextWithTransliteration( formatUrl, keyword, locale ).length > 0;
	}

	return false;
};

},{"./matchTextWithTransliteration.js":376}],366:[function(require,module,exports){
/** @module stringProcessing/getAlttagContent */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

var regexAltTag = /alt=(['"])(.*?)\1/i;

/**
 * Checks for an alttag in the image and returns its content
 *
 * @param {String} text Textstring to match alt
 * @returns {String} the contents of the alttag, empty if none is set.
 */
module.exports = function( text ) {
	var alt = "";

	var matches = text.match( regexAltTag );

	if ( matches !== null ) {
		alt = stripSpaces( matches[ 2 ] );

		alt = alt.replace( /&quot;/g, "\"" );
		alt = alt.replace( /&#039;/g, "'" );
	}
	return alt;
};

},{"../stringProcessing/stripSpaces.js":390}],367:[function(require,module,exports){
/** @module stringProcessing/getAnchorsFromText */

/**
 * Check for anchors in the textstring and returns them in an array.
 *
 * @param {String} text The text to check for matches.
 * @returns {Array} The matched links in text.
 */
module.exports = function( text ) {
	var matches;

	// regex matches everything between <a> and </a>
	matches = text.match( /<a(?:[^>]+)?>(.*?)<\/a>/ig );

	if ( matches === null ) {
		matches = [];
	}

	return matches;
};

},{}],368:[function(require,module,exports){
/** @module stringProcess/getLinkType */

var urlHelper = require( "./url" );

/**
 * Determines the type of link.
 *
 * @param {string} text String with anchor tag.
 * @param {string} url Url to match against.
 * @returns {string} The link type (other, external or internal).
 */

module.exports = function( text, url ) {
	var linkType = "other";

	var anchorUrl = urlHelper.getFromAnchorTag( text );

	// Matches all links that start with http:// and https://, case insensitive and global
	if ( anchorUrl.match( /https?:\/\//ig ) !== null ) {
		linkType = "external";

		if ( urlHelper.getHostname( anchorUrl ) === urlHelper.getHostname( url ) ) {
			linkType = "internal";
		}
	}

	return linkType;
};

},{"./url":394}],369:[function(require,module,exports){
var map = require( "lodash/map" );
var isUndefined = require( "lodash/isUndefined" );
var forEach = require( "lodash/forEach" );
var isNaN = require( "lodash/isNaN" );
var filter = require( "lodash/filter" );
var flatMap = require( "lodash/flatMap" );
var isEmpty = require( "lodash/isEmpty" );
var negate = require( "lodash/negate" );
var memoize = require( "lodash/memoize" );

var core = require( "tokenizer2/core" );

var getBlocks = require( "../helpers/html.js" ).getBlocks;
var normalizeQuotes = require( "../stringProcessing/quotes.js" ).normalize;

var unifyWhitespace = require( "../stringProcessing/unifyWhitespace.js" ).unifyNonBreakingSpace;

// All characters that indicate a sentence delimiter.
var fullStop = ".";
var sentenceDelimiters = "?!;";
var newLines = "\n\r|\n|\r";

var fullStopRegex = new RegExp( "^[" + fullStop + "]$" );
var sentenceDelimiterRegex = new RegExp( "^[" + sentenceDelimiters + "]$" );
var sentenceRegex = new RegExp( "^[^" + fullStop + sentenceDelimiters + "<\\(\\)\\[\\]]+$" );
var htmlStartRegex = /^<([^>\s\/]+)[^>]*>$/mi;
var htmlEndRegex = /^<\/([^>\s]+)[^>]*>$/mi;
var newLineRegex = new RegExp( newLines );

var blockStartRegex = /^\s*[\[\(\{]\s*$/;
var blockEndRegex = /^\s*[\]\)}]\s*$/;

var tokens = [];
var sentenceTokenizer;

/**
 * Creates a tokenizer to create tokens from a sentence.
 */
function createTokenizer() {
	tokens = [];

	sentenceTokenizer = core( function( token ) {
		tokens.push( token );
	} );

	sentenceTokenizer.addRule( htmlStartRegex, "html-start" );
	sentenceTokenizer.addRule( htmlEndRegex, "html-end" );
	sentenceTokenizer.addRule( blockStartRegex, "block-start" );
	sentenceTokenizer.addRule( blockEndRegex, "block-end" );
	sentenceTokenizer.addRule( fullStopRegex, "full-stop" );
	sentenceTokenizer.addRule( sentenceDelimiterRegex, "sentence-delimiter" );
	sentenceTokenizer.addRule( sentenceRegex, "sentence" );
}

/**
 * Returns whether or not a certain character is a capital letter.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the character is a capital letter.
 */
function isCapitalLetter( character ) {
	return character !== character.toLocaleLowerCase();
}

/**
 * Returns whether or not a certain character is a number.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the character is a capital letter.
 */
function isNumber( character ) {
	return !isNaN( parseInt( character, 10 ) );
}

/**
 * Returns whether or not a given HTML tag is a break tag.
 *
 * @param {string} htmlTag The HTML tag to check.
 * @returns {boolean} Whether or not the given HTML tag is a break tag.
 */
function isBreakTag( htmlTag ) {
	return /<br/.test( htmlTag );
}

/**
 * Returns whether or not a given character is quotation mark.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the given character is a quotation mark.
 */
function isQuotation( character ) {
	character = normalizeQuotes( character );

	return "'" === character
		|| "\"" === character;
}

/**
 * Returns whether or not a given character is a punctuation mark that can be at the beginning
 * of a sentence, like ¿ and ¡ used in Spanish.
 *
 * @param {string} character The character to check.
 * @returns {boolean} Whether or not the given character is a punctuation mark.
 */
function isPunctuation( character ) {
	return "¿" === character
		|| "¡" === character;
}

/**
 * Tokenizes a sentence, assumes that the text has already been split into blocks.
 *
 * @param {string} text The text to tokenize.
 * @returns {Array} An array of tokens.
 */
function tokenizeSentences( text ) {

	createTokenizer();
	sentenceTokenizer.onText( text );

	sentenceTokenizer.end();

	return tokens;
}

/**
 * Removes duplicate whitespace from a given text.
 *
 * @param {string} text The text with duplicate whitespace.
 * @returns {string} The text without duplicate whitespace.
 */
function removeDuplicateWhitespace( text ) {
	return text.replace( /\s+/, " " );
}

/**
 * Retrieves the next two characters from an array with the two next tokens.
 *
 * @param {Array} nextTokens The two next tokens. Might be undefined.
 * @returns {string} The next two characters.
 */
function getNextTwoCharacters( nextTokens ) {
	var next = "";

	if ( !isUndefined( nextTokens[ 0 ] ) ) {
		next += nextTokens[ 0 ].src;
	}

	if ( !isUndefined( nextTokens[ 1 ] ) ) {
		next += nextTokens[ 1 ].src;
	}

	next = removeDuplicateWhitespace( next );

	return next;
}

/**
 * Returns an array of sentences for a given array of tokens, assumes that the text has already been split into blocks.
 *
 * @param {Array} tokens The tokens from the sentence tokenizer.
 * @returns {Array<string>} A list of sentences.
 */
function getSentencesFromTokens( tokens ) {
	var tokenSentences = [], currentSentence = "", nextSentenceStart, previousToken;

	var sliced;

	// Drop the first and last HTML tag if both are present.
	do {
		sliced = false;
		var firstToken = tokens[ 0 ];
		var lastToken = tokens[ tokens.length - 1 ];

		if ( firstToken.type === "html-start" && lastToken.type === "html-end" ) {
			tokens = tokens.slice( 1, tokens.length - 1 );

			sliced = true;
		}
	} while ( sliced && tokens.length > 1 );

	forEach( tokens, function( token, i ) {
		var hasNextSentence;
		var nextToken = tokens[ i + 1 ];
		var secondToNextToken = tokens[ i + 2 ];

		switch ( token.type ) {

			case "html-start":
			case "html-end":
				if ( isBreakTag( token.src ) ) {
					tokenSentences.push( currentSentence );
					currentSentence = "";
				} else {
					currentSentence += token.src;
				}
				break;

			case "sentence":
				currentSentence += token.src;
				break;

			case "sentence-delimiter":
				currentSentence += token.src;

				tokenSentences.push( currentSentence );
				currentSentence = "";
				break;

			case "full-stop":
				currentSentence += token.src;

				var nextCharacters = getNextTwoCharacters( [ nextToken, secondToNextToken ] );

				// For a new sentence we need to check the next two characters.
				hasNextSentence = nextCharacters.length >= 2;
				nextSentenceStart = hasNextSentence ? nextCharacters[ 1 ] : "";

				// If the next character is a number, never split. For example: IPv4-numbers.
				if ( hasNextSentence && isNumber( nextCharacters[ 0 ] ) ) {
					break;
				}

				// Only split on sentence delimiters when the next sentence looks like the start of a sentence.
				if (
					( hasNextSentence && (
						isCapitalLetter( nextSentenceStart )
						|| isNumber( nextSentenceStart ) )
						|| isQuotation( nextSentenceStart )
						|| isPunctuation( nextSentenceStart )
					|| ( !isUndefined( nextToken ) && (
						"html-start" === nextToken.type
						|| "html-end" === nextToken.type
						|| "block-start" === nextToken.type
						|| "block-end" === nextToken.type
						) )
					)
				) {
					tokenSentences.push( currentSentence );
					currentSentence = "";
				}
				break;

			case "newline":
				tokenSentences.push( currentSentence );
				currentSentence = "";
				break;

			case "block-start":
				currentSentence += token.src;
				break;

			case "block-end":
				// When a block ends after a sentence delimiter make sure to add the block end to the sentence.
				if ( !isUndefined( previousToken ) && ( previousToken.type === "sentence-delimiter" || previousToken.type === "full-stop" ) ) {
					tokenSentences[ tokenSentences.length - 1 ] += token.src;
				} else {
					currentSentence += token.src;
				}
				break;
		}

		previousToken = token;
	} );

	if ( "" !== currentSentence ) {
		tokenSentences.push( currentSentence );
	}

	tokenSentences = map( tokenSentences, function( sentence ) {
		return sentence.trim();
	} );

	return tokenSentences;
}

/**
 * Returns the sentences from a certain block.
 *
 * @param {string} block The HTML inside a HTML block.
 * @returns {Array<string>} The list of sentences in the block.
 */
function getSentencesFromBlock( block ) {
	var tokens = tokenizeSentences( block );

	return tokens.length === 0 ? [] : getSentencesFromTokens( tokens );
}

var getSentencesFromBlockCached = memoize( getSentencesFromBlock );

/**
 * Returns sentences in a string.
 *
 * @param {String} text The string to count sentences in.
 * @returns {Array} Sentences found in the text.
 */
module.exports = function( text ) {
	text = unifyWhitespace( text );
	var sentences, blocks = getBlocks( text );

	// Split each block on newlines.
	blocks = flatMap( blocks, function( block ) {
		return block.split( newLineRegex );
	} );

	sentences = flatMap( blocks, getSentencesFromBlockCached );

	return filter( sentences, negate( isEmpty ) );
};

},{"../helpers/html.js":299,"../stringProcessing/quotes.js":379,"../stringProcessing/unifyWhitespace.js":393,"lodash/filter":189,"lodash/flatMap":192,"lodash/forEach":194,"lodash/isEmpty":207,"lodash/isNaN":210,"lodash/isUndefined":218,"lodash/map":221,"lodash/memoize":222,"lodash/negate":225,"tokenizer2/core":247}],370:[function(require,module,exports){
/**
 * Returns all texts per subheading.
 * @param {string} text The text to analyze from.
 * @returns {Array} an array with text blocks per subheading.
 */
module.exports = function( text ) {
	/*
	 matching this in a regex is pretty hard, since we need to find a way for matching the text after a heading, and before the end of the text.
	 The hard thing capturing this is with a capture, it captures the next subheading as well, so it skips the next part of the text,
	 since the subheading is already matched.
	 For now we use this method to be sure we capture the right blocks of text. We remove all | 's from text,
	 then replace all headings with a | and split on a |.
	 */
	text = text.replace( /\|/ig, "" );
	text = text.replace( /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig, "|" );
	var subheadings =  text.split( "|" );

	// we never need the first entry, if the text starts with a subheading it will be empty, and if the text doesn't start with a subheading, the
	// text doesnt't belong to a subheading, so it can be removed
	subheadings.shift();
	return subheadings;
};



},{}],371:[function(require,module,exports){
var map = require( "lodash/map" );

/**
 * Gets all subheadings from the text and returns these in an array.
 *
 * @param {string} text The text to return the headings from.
 * @returns {Array} Matches of subheadings in the text, first key is everything including tags, second is the heading
 *                  level, third is the content of the subheading.
 */
function getSubheadings( text ) {
	var subheadings = [];
	var regex = /<h([1-6])(?:[^>]+)?>(.*?)<\/h\1>/ig;
	var match;

	while ( ( match = regex.exec( text ) ) !== null ) {
		subheadings.push( match );
	}

	return subheadings;
}

/**
 * Gets the content of subheadings in the text
 *
 * @param {string} text The text to get the subheading contents from.
 * @returns {Array<string>} A list of all the subheadings with their content.
 */
function getSubheadingContents( text ) {
	var subheadings = getSubheadings( text );

	subheadings = map( subheadings, function( subheading ) {
		return subheading[0];
	} );

	return subheadings;
}

module.exports = {
	getSubheadings: getSubheadings,
	getSubheadingContents: getSubheadingContents
};

},{"lodash/map":221}],372:[function(require,module,exports){
/** @module stringProcessing/countWords */

var stripTags = require( "./stripHTMLTags.js" ).stripFullTags;
var stripSpaces = require( "./stripSpaces.js" );
var removeTerminators = require( "./removeTerminators.js" );
var map = require( "lodash/map" );
var filter = require( "lodash/filter" );

/**
 * Returns an array with words used in the text.
 *
 * @param {string} text The text to be counted.
 * @returns {Array} The array with all words.
 */
module.exports = function( text ) {
	text = stripSpaces( stripTags( text ) );
	if ( text === "" ) {
		return [];
	}

	var words = text.split( /\s/g );

	words = map( words, function( word ) {
		return removeTerminators( word );
	} );

	return filter( words, function( word ) {
		return word.trim() !== "";
	} );
};


},{"./removeTerminators.js":381,"./stripHTMLTags.js":387,"./stripSpaces.js":390,"lodash/filter":189,"lodash/map":221}],373:[function(require,module,exports){
/** @module stringProcessing/imageInText */

var matchStringWithRegex = require( "./matchStringWithRegex.js" );

/**
 * Checks the text for images.
 *
 * @param {string} text The textstring to check for images
 * @returns {Array} Array containing all types of found images
 */
module.exports = function( text ) {
	return matchStringWithRegex( text, "<img(?:[^>]+)?>" );
};

},{"./matchStringWithRegex.js":375}],374:[function(require,module,exports){
var map = require( "lodash/map" );
var flatMap = require( "lodash/flatMap" );
var filter = require( "lodash/filter" );

var getBlocks = require( "../helpers/html" ).getBlocks;

/**
 * Matches the paragraphs in <p>-tags and returns the text in them.
 * @param {string} text The text to match paragraph in.
 * @returns {array} An array containing all paragraphs texts.
 */
var getParagraphsInTags = function ( text ) {
	var paragraphs = [];
	// Matches everything between the <p> and </p> tags.
	var regex = /<p(?:[^>]+)?>(.*?)<\/p>/ig;
	var match;

	while ( ( match = regex.exec( text ) ) !== null ) {
		paragraphs.push( match );
	}

	// Returns only the text from within the paragraph tags.
	return map( paragraphs, function( paragraph ) {
		return paragraph[ 1 ];
	} );
};

/**
 * Returns an array with all paragraphs from the text.
 * @param {string} text The text to match paragraph in.
 * @returns {Array} The array containing all paragraphs from the text.
 */
module.exports = function( text ) {
	var paragraphs = getParagraphsInTags( text );

	if ( paragraphs.length > 0 ) {
		return paragraphs;
	}

	// If no <p> tags found, split on double linebreaks.
	var blocks = getBlocks( text );

	blocks = filter( blocks, function( block ) {
		// Match explicit paragraph tags, or if a block has no HTML tags.
		return 0 !== block.indexOf( "<h" );
	} );

	paragraphs = flatMap( blocks, function( block ) {
		return block.split( "\n\n" );
	} );

	if ( paragraphs.length > 0 ) {
		return paragraphs;
	}

	// If no paragraphs are found, return an array containing the entire text.
	return [ text ];
};

},{"../helpers/html":299,"lodash/filter":189,"lodash/flatMap":192,"lodash/map":221}],375:[function(require,module,exports){
/** @module stringProcessing/matchStringWithRegex */

/**
 * Checks a string with a regex, return all matches found with that regex.
 *
 * @param {String} text The text to match the
 * @param {String} regexString A string to use as regex.
 * @returns {Array} Array with matches, empty array if no matches found.
 */
module.exports = function( text, regexString ) {
	var regex = new RegExp( regexString, "ig" );
	var matches = text.match( regex );

	if ( matches === null ) {
		matches = [];
	}

	return matches;
};

},{}],376:[function(require,module,exports){
var map = require( "lodash/map" );
var addWordBoundary = require( "./addWordboundary.js" );
var stripSpaces = require( "./stripSpaces.js" );
var transliterate = require( "./transliterate.js" );

/**
 * Creates a regex from the keyword with included wordboundaries.
 * @param {string} keyword The keyword to create a regex from.
 * @returns {RegExp} Regular expression of the keyword with wordboundaries.
 */
var toRegex = function( keyword ) {
	keyword = addWordBoundary( keyword );
	return new RegExp( keyword, "ig" );
};

/**
 * Matches a string with and without transliteration.
 * @param {string} text The text to match.
 * @param {string} keyword The keyword to match in the text.
 * @param {string} locale The locale used for transliteration.
 * @returns {Array} All matches from the original as the transliterated text and keyword.
 */
module.exports = function( text, keyword, locale ) {
	var keywordRegex = toRegex( keyword );
	var matches = text.match( keywordRegex ) || [];

	text = text.replace( keywordRegex, "" );

	var transliterateKeyword = transliterate( keyword, locale );
	var transliterateKeywordRegex = toRegex( transliterateKeyword );
	var transliterateMatches = text.match( transliterateKeywordRegex ) || [];

	var combinedArray = matches.concat( transliterateMatches );
	return map( combinedArray, function( keyword ) {
		return stripSpaces( keyword );
	} );
};



},{"./addWordboundary.js":358,"./stripSpaces.js":390,"./transliterate.js":392,"lodash/map":221}],377:[function(require,module,exports){
/** @module stringProcessing/matchTextWithWord */

var stripSomeTags = require( "../stringProcessing/stripNonTextTags.js" );
var unifyWhitespace = require( "../stringProcessing/unifyWhitespace.js" ).unifyAllSpaces;
var matchStringWithTransliteration = require( "../stringProcessing/matchTextWithTransliteration.js" );

/**
 * Returns the number of matches in a given string
 *
 * @param {string} text The text to use for matching the wordToMatch.
 * @param {string} wordToMatch The word to match in the text
 * @param {string} locale The locale used for transliteration.
 * @param {string} [extraBoundary] An extra string that can be added to the wordboundary regex
 * @returns {number} The amount of matches found.
 */
module.exports = function( text, wordToMatch, locale, extraBoundary ) {
	text = stripSomeTags( text );
	text = unifyWhitespace( text );
	var matches = matchStringWithTransliteration( text, wordToMatch, locale, extraBoundary );
	return matches.length;
};

},{"../stringProcessing/matchTextWithTransliteration.js":376,"../stringProcessing/stripNonTextTags.js":388,"../stringProcessing/unifyWhitespace.js":393}],378:[function(require,module,exports){
var wordBoundaries = require( "../config/wordBoundaries.js" )();
var includes = require( "lodash/includes" );

/**
 * Checks whether a character is present in the list of word boundaries.
 *
 * @param {string} character The character to look for.
 * @returns {boolean} Whether or not the character is present in the list of word boundaries.
 */
var characterInBoundary = function( character ) {
	return includes( wordBoundaries, character );
};

/**
 * Checks whether a word is present in a sentence.
 *
 * @param {string} word The word to search for in the sentence.
 * @param {string} sentence The sentence to look through.
 * @returns {boolean} Whether or not the word is present in the sentence.
 */
module.exports = function( word, sentence ) {
	// To ensure proper matching, make everything lowercase.
	word = word.toLocaleLowerCase();
	sentence = sentence.toLocaleLowerCase();

	var occurrenceStart = sentence.indexOf( word );
	var occurrenceEnd = occurrenceStart + word.length;

	// Return false if no match has been found.
	if ( occurrenceStart === -1 ) {
		return false;
	}

	// Check if the previous and next character are word boundaries to determine if a complete word was detected
	var previousCharacter = characterInBoundary( sentence[occurrenceStart - 1 ] ) || occurrenceStart === 0;
	var nextCharacter = characterInBoundary( sentence[ occurrenceEnd ] ) || occurrenceEnd === sentence.length;

	return ( ( previousCharacter ) && ( nextCharacter ) );
};

},{"../config/wordBoundaries.js":289,"lodash/includes":200}],379:[function(require,module,exports){
/**
 * Normalizes single quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeSingleQuotes( text ) {
	return text
		.replace( "‘", "'" )
		.replace( "’", "'" )
		.replace( "‛", "'" )
		.replace( "`", "'" );
}

/**
 * Normalizes double quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeDoubleQuotes( text ) {
	return text
		.replace( "“", "\"" )
		.replace( "”", "\"" )
		.replace( "〝", "\"" )
		.replace( "〞", "\"" )
		.replace( "〟", "\"" )
		.replace( "‟", "\"" )
		.replace( "„", "\"" );
}

/**
 * Normalizes quotes to 'regular' quotes.
 *
 * @param {string} text Text to normalize.
 * @returns {string} The normalized text.
 */
function normalizeQuotes( text ) {
	return normalizeDoubleQuotes( normalizeSingleQuotes( text ) );
}

module.exports = {
	normalizeSingle: normalizeSingleQuotes,
	normalizeDouble: normalizeDoubleQuotes,
	normalize: normalizeQuotes
};

},{}],380:[function(require,module,exports){
/** @module stringProcessing/removeNonWordCharacters.js */

/**
 * Removes all spaces and nonwordcharacters from a string.
 *
 * @param {string} string The string to replace spaces from.
 * @returns {string} string The string without spaces.
 */
module.exports = function( string ) {
	return string.replace( /[\s\n\r\t\.,'\(\)\"\+;!?:\/]/g, "" );
};

},{}],381:[function(require,module,exports){
var terminatorRegexString = "[\-()_\\[\\]’“”\"'\/.?!:;,¿¡]";
var terminatorRegexStart = new RegExp( "^" + terminatorRegexString + "+" );
var terminatorRegexEnd = new RegExp( terminatorRegexString + "+$" );

/**
 * Removes sentence terminators at the beginning and end of a sentence.
 *
 * @param {String} word The word to remove terminators from.
 * @returns {String} The word without terminators.
 */
module.exports = function( word ) {
	word = word.replace( terminatorRegexStart, "" );
	word = word.replace( terminatorRegexEnd, "" );
	return word;
};

},{}],382:[function(require,module,exports){
/** @module stringProcessing/replaceDiacritics */

var diacriticsRemovalMap = require( "../config/diacritics.js" );

/**
 * Replaces all diacritics from the text based on the diacritics removal map.
 *
 * @param {string} text The text to remove diacritics from.
 * @returns {string} The text with all diacritics replaced.
 */
module.exports = function( text ) {
	var map = diacriticsRemovalMap();

	for ( var i = 0; i < map.length; i++ ) {
		text = text.replace(
			map[ i ].letters,
			map[ i ].base
		);
	}
	return text;
};

},{"../config/diacritics.js":283}],383:[function(require,module,exports){
/** @module stringProcessing/replaceString */

/**
 * Replaces string with a replacement in text
 *
 * @param {string} text The textstring to remove
 * @param {string} stringToReplace The string to replace
 * @param {string} replacement The replacement of the string
 * @returns {string} The text with the string replaced
 */
module.exports = function( text, stringToReplace, replacement ) {
	text = text.replace( stringToReplace, replacement );

	return text;
};

},{}],384:[function(require,module,exports){
/** @module stringProcessing/sanitizeString */

var stripTags = require( "../stringProcessing/stripHTMLTags.js" ).stripFullTags;
var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strip HTMLtags characters from string that break regex
 *
 * @param {String} text The text to strip the characters from.
 * @returns {String} The text without characters.
 */
module.exports = function( text ) {
	text = text.replace( /[\[\]\{\}\(\)\*\+\?\^\$\|]/g, "" );
	text = stripTags( text );
	text = stripSpaces( text );

	return text;
};

},{"../stringProcessing/stripHTMLTags.js":387,"../stringProcessing/stripSpaces.js":390}],385:[function(require,module,exports){
var wordCount = require( "./countWords.js" );
var forEach = require( "lodash/forEach" );
var stripHTMLTags = require( "./stripHTMLTags.js" ).stripFullTags;

/**
 * Returns an array with the number of words in a sentence.
 * @param {Array} sentences Array with sentences from text.
 * @returns {Array} Array with amount of words in each sentence.
 */
module.exports = function( sentences ) {
	var sentencesWordCount = [];
	forEach( sentences, function( sentence ) {

		// For counting words we want to omit the HTMLtags.
		var strippedSentence = stripHTMLTags( sentence );
		var length = wordCount( strippedSentence );

		if ( length <= 0 ) {
			return;
		}

		sentencesWordCount.push( {
			sentence: sentence,
			sentenceLength: wordCount( sentence )
		} );
	} );
	return sentencesWordCount;
};

},{"./countWords.js":362,"./stripHTMLTags.js":387,"lodash/forEach":194}],386:[function(require,module,exports){
/** @module stringProcessing/stringToRegex */
var isUndefined = require( "lodash/isUndefined" );
var replaceDiacritics = require( "../stringProcessing/replaceDiacritics.js" );
var sanitizeString = require( "../stringProcessing/sanitizeString.js" );
var addWordBoundary = require( "../stringProcessing/addWordboundary.js" );

var memoize = require( "lodash/memoize" );

/**
 * Creates a regex from a string so it can be matched everywhere in the same way.
 *
 * @param {string} string The string to make a regex from.
 * @param {string} [extraBoundary=""] A string that is used as extra boundary for the regex.
 * @param {boolean} [doReplaceDiacritics=true] If set to false, it doesn't replace diacritics. Defaults to true.
 * @returns {RegExp} regex The regex made from the keyword
 */
module.exports = memoize( function( string, extraBoundary, doReplaceDiacritics ) {
	if ( isUndefined( extraBoundary ) ) {
		extraBoundary = "";
	}

	if ( isUndefined( doReplaceDiacritics ) || doReplaceDiacritics === true ) {
		string = replaceDiacritics( string );
	}

	string = sanitizeString( string );
	string = addWordBoundary( string, extraBoundary );
	return new RegExp( string, "ig" );
} );

},{"../stringProcessing/addWordboundary.js":358,"../stringProcessing/replaceDiacritics.js":382,"../stringProcessing/sanitizeString.js":384,"lodash/isUndefined":218,"lodash/memoize":222}],387:[function(require,module,exports){
/** @module stringProcessing/stripHTMLTags */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strip incomplete tags within a text. Strips an endtag at the beginning of a string and the start tag at the end of a
 * start of a string.
 * @param {String} text The text to strip the HTML-tags from at the begin and end.
 * @returns {String} The text without HTML-tags at the begin and end.
 */
var stripIncompleteTags = function( text ) {
	text = text.replace( /^(<\/([^>]+)>)+/i, "" );
	text = text.replace( /(<([^\/>]+)>)+$/i, "" );
	return text;
};

/**
 * Strip HTML-tags from text
 *
 * @param {String} text The text to strip the HTML-tags from.
 * @returns {String} The text without HTML-tags.
 */
var stripFullTags = function( text ) {
	text = text.replace( /(<([^>]+)>)/ig, " " );
	text = stripSpaces( text );
	return text;
};

module.exports = {
	stripFullTags: stripFullTags,
	stripIncompleteTags: stripIncompleteTags
};

},{"../stringProcessing/stripSpaces.js":390}],388:[function(require,module,exports){
/** @module stringProcessing/stripNonTextTags */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Strips all tags from the text, except li, p, dd and h1-h6 tags from the text that contain content to check.
 *
 * @param {string} text The text to strip tags from
 * @returns {string} The text stripped of tags, except for li, p, dd and h1-h6 tags.
 */
module.exports = function( text ) {
	text = text.replace( /<(?!li|\/li|p|\/p|h1|\/h1|h2|\/h2|h3|\/h3|h4|\/h4|h5|\/h5|h6|\/h6|dd).*?\>/g, "" );
	text = stripSpaces( text );
	return text;
};

},{"../stringProcessing/stripSpaces.js":390}],389:[function(require,module,exports){
/** @module stringProcessing/stripNumbers */

var stripSpaces = require( "../stringProcessing/stripSpaces.js" );

/**
 * Removes all words comprised only of numbers.
 *
 * @param {string} text to remove words
 * @returns {string} The text with numberonly words removed.
 */

module.exports = function( text ) {

	// Remove "words" comprised only of numbers
	text = text.replace( /\b[0-9]+\b/g, "" );

	text = stripSpaces( text );

	if ( text === "." ) {
		text = "";
	}
	return text;
};

},{"../stringProcessing/stripSpaces.js":390}],390:[function(require,module,exports){
/** @module stringProcessing/stripSpaces */

/**
 * Strip double spaces from text
 *
 * @param {String} text The text to strip spaces from.
 * @returns {String} The text without double spaces
 */
module.exports = function( text ) {

	// Replace multiple spaces with single space
	text = text.replace( /\s{2,}/g, " " );

	// Replace spaces followed by periods with only the period.
	text = text.replace( /\s\./g, "." );

	// Remove first/last character if space
	text = text.replace( /^\s+|\s+$/g, "" );

	return text;
};

},{}],391:[function(require,module,exports){
var replaceString = require( "../stringProcessing/replaceString.js" );
var removalWords = require( "../config/removalWords.js" )();
var matchTextWithTransliteration = require( "../stringProcessing/matchTextWithTransliteration.js" );

/**
 * Matches the keyword in an array of strings
 *
 * @param {Array} matches The array with the matched headings.
 * @param {String} keyword The keyword to match
 * @param {string} locale The locale used for transliteration.
 * @returns {number} The number of occurrences of the keyword in the headings.
 */
module.exports = function( matches, keyword, locale ) {
	var foundInHeader;
	if ( matches === null ) {
		foundInHeader = -1;
	} else {
		foundInHeader = 0;
		for ( var i = 0; i < matches.length; i++ ) {

			// TODO: This replaceString call seemingly doesn't work, as no replacement value is being sent to the .replace method in replaceString
			var formattedHeaders = replaceString(
				matches[ i ], removalWords
			);
			if (
				matchTextWithTransliteration( formattedHeaders, keyword, locale ).length > 0 ||
				matchTextWithTransliteration( matches[ i ], keyword, locale ).length > 0
			) {
				foundInHeader++;
			}
		}
	}
	return foundInHeader;
};

},{"../config/removalWords.js":285,"../stringProcessing/matchTextWithTransliteration.js":376,"../stringProcessing/replaceString.js":383}],392:[function(require,module,exports){
/** @module stringProcessing/replaceDiacritics */

var transliterationsMap = require( "../config/transliterations.js" );

/**
 * Replaces all special characters from the text based on the transliterations map.
 *
 * @param {string} text The text to remove special characters from.
 * @param {string} locale The locale.
 * @returns {string} The text with all special characters replaced.
 */
module.exports = function( text, locale ) {
	var map = transliterationsMap( locale );
	for ( var i = 0; i < map.length; i++ ) {
		text = text.replace(
			map[ i ].letter,
			map[ i ].alternative
		);
	}
	return text;
};

},{"../config/transliterations.js":288}],393:[function(require,module,exports){
/** @module stringProcessing/unifyWhitespace */

/**
 * Replaces a non breaking space with a normal space
 * @param {string} text The string to replace the non breaking space in.
 * @returns {string} The text with unified spaces.
 */
var unifyNonBreakingSpace = function( text ) {
	return text.replace( /&nbsp;/g, " " );
};

/**
 * Replaces all whitespaces with a normal space
 * @param {string} text The string to replace the non breaking space in.
 * @returns {string} The text with unified spaces.
 */
var unifyWhiteSpace = function( text ) {
	return text.replace( /\s/g, " " );
};

/**
 * Converts all whitespace to spaces.
 *
 * @param {string} text The text to replace spaces.
 * @returns {string} The text with unified spaces.
 */
var unifyAllSpaces = function( text ) {
	text = unifyNonBreakingSpace( text );
	return unifyWhiteSpace( text );
};

module.exports = {
	unifyNonBreakingSpace: unifyNonBreakingSpace,
	unifyWhiteSpace: unifyWhiteSpace,
	unifyAllSpaces: unifyAllSpaces
};

},{}],394:[function(require,module,exports){
var urlFromAnchorRegex = /href=(["'])([^"']+)\1/i;
var urlMethods = require( "url" );

/**
 * Removes a hash from a URL, assumes a well formed URL.
 *
 * @param {string} url The URL to remove a hash from.
 * @returns {string} The URL without the hash.
 */
function removeHash( url ) {
	return url.split( "#" )[ 0 ];
}

/**
 * Removes all query args from a URL, assumes a well formed URL.
 *
 * @param {string} url The URL to remove the query args from.
 * @returns {string} The URL without the query args.
 */
function removeQueryArgs( url ) {
	return url.split( "?" )[ 0 ];
}

/**
 * Removes the trailing slash of a URL.
 *
 * @param {string} url The URL to remove the trailing slash from.
 * @returns {string} A URL without a trailing slash.
 */
function removeTrailingSlash( url ) {
	return url.replace( /\/$/, "" );
}

/**
 * Adds a trailing slash to a URL if it is not present.
 *
 * @param {string} url The URL to add a trailing slash to.
 * @returns {string} A URL with a trailing slash.
 */
function addTrailingSlash( url ) {
	return removeTrailingSlash( url ) + "/";
}

/**
 * Retrieves the URL from an anchor tag
 *
 * @param {string} anchorTag An anchor tag.
 * @returns {string} The URL in the anchor tag.
 */
function getFromAnchorTag( anchorTag ) {
	var urlMatch = urlFromAnchorRegex.exec( anchorTag );

	return ( urlMatch === null ) ? "" : urlMatch[ 2 ];
}

/**
 * Returns whether or not the given URLs are equal
 *
 * @param {string} urlA The first URL to compare.
 * @param {string} urlB The second URL to compare.
 *
 * @returns {boolean} Whether or not the given URLs are equal.
 */
function areEqual( urlA, urlB ) {
	// Make sure we are comparing URLs without query arguments and hashes.
	urlA = removeQueryArgs( removeHash( urlA ) );
	urlB = removeQueryArgs( removeHash( urlB ) );

	return addTrailingSlash( urlA ) === addTrailingSlash( urlB );
}

/**
 * Returns the domain name of a URL
 *
 * @param {string} url The URL to retrieve the domain name of.
 * @returns {string} The domain name of the URL.
 */
function getHostname( url ) {
	url = urlMethods.parse( url );

	return url.hostname;
}

module.exports = {
	removeHash: removeHash,
	removeQueryArgs: removeQueryArgs,
	removeTrailingSlash: removeTrailingSlash,
	addTrailingSlash: addTrailingSlash,
	getFromAnchorTag: getFromAnchorTag,
	areEqual: areEqual,
	getHostname: getHostname
};

},{"url":248}],395:[function(require,module,exports){
(function (global){
;(function() {
  var undefined;

  var freeExports = typeof exports == 'object' && exports;

  var freeModule = freeExports && typeof module == 'object' && module;

  var freeGlobal = checkGlobal(typeof global == 'object' && global);

  var freeSelf = checkGlobal(typeof self == 'object' && self);

  var thisGlobal = checkGlobal(typeof this == 'object' && this);

  var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
  var undefined;

  /** Used as the semantic version number. */
  var VERSION = '4.13.1';

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /** Used to match HTML entities and HTML characters. */
  var reUnescapedHtml = /[&<>"'`]/g,
      reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

  /** Used to map characters to HTML entities. */
  var htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '`': '&#96;'
  };

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = checkGlobal(typeof global == 'object' && global);

  /** Detect free variable `self`. */
  var freeSelf = checkGlobal(typeof self == 'object' && self);

  /** Detect `this` as the global object. */
  var thisGlobal = checkGlobal(typeof this == 'object' && this);

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || thisGlobal || Function('return this')();

  /*--------------------------------------------------------------------------*/

  /**
   * Checks if `value` is a global object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {null|Object} Returns `value` if it's a global object, else `null`.
   */
  function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

  /**
   * Used by `_.escape` to convert characters to HTML entities.
   *
   * @private
   * @param {string} chr The matched character to escape.
   * @returns {string} Returns the escaped character.
   */
  function escapeHtmlChar(chr) {
    return htmlEscapes[chr];
  }

  /*--------------------------------------------------------------------------*/

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
   * of values.
   */
  var objectToString = objectProto.toString;

  /** Built-in value references. */
  var Symbol = root.Symbol;

  /** Used to lookup unminified function names. */
  var realNames = {};

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol ? Symbol.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /*------------------------------------------------------------------------*/

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /*------------------------------------------------------------------------*/

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return !!value && typeof value == 'object';
  }

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is correctly classified,
   *  else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && objectToString.call(value) == symbolTag);
  }

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  /*------------------------------------------------------------------------*/

  /**
   * Converts the characters "&", "<", ">", '"', "'", and "\`" in `string` to
   * their corresponding HTML entities.
   *
   * **Note:** No other characters are escaped. To escape additional
   * characters use a third-party library like [_he_](https://mths.be/he).
   *
   * Though the ">" character is escaped for symmetry, characters like
   * ">" and "/" don't need escaping in HTML and have no special meaning
   * unless they're part of a tag or unquoted attribute value. See
   * [Mathias Bynens's article](https://mathiasbynens.be/notes/ambiguous-ampersands)
   * (under "semi-related fun fact") for more details.
   *
   * Backticks are escaped because in IE < 9, they can break out of
   * attribute values or HTML comments. See [#59](https://html5sec.org/#59),
   * [#102](https://html5sec.org/#102), [#108](https://html5sec.org/#108), and
   * [#133](https://html5sec.org/#133) of the
   * [HTML5 Security Cheatsheet](https://html5sec.org/) for more details.
   *
   * When working with HTML you should always
   * [quote attribute values](http://wonko.com/post/html-escaping) to reduce
   * XSS vectors.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category String
   * @param {string} [string=''] The string to escape.
   * @returns {string} Returns the escaped string.
   * @example
   *
   * _.escape('fred, barney, & pebbles');
   * // => 'fred, barney, &amp; pebbles'
   */
  function escape(string) {
    string = toString(string);
    return (string && reHasUnescapedHtml.test(string))
      ? string.replace(reUnescapedHtml, escapeHtmlChar)
      : string;
  }

  var _ = { 'escape': escape };

  /*----------------------------------------------------------------------------*/

  var templates = {
    'assessmentPresenterResult': {},
    'hiddenSpan': {},
    'snippetEditor': {}
  };

  templates['assessmentPresenterResult'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<ul class="wpseoanalysis assessment-results">\n    ';
     for (var i in scores) {
    __p += '\n        <li class="score">\n            <span class="assessment-results__mark-container">\n                ';
     if ( scores[ i ].marker ) {
    __p += '\n                    <button type="button" ';
     if ( markerButtonsDisabled ) {
    __p += ' disabled="disabled" ';
     }
    __p += '\n                        aria-label="';
     if ( markerButtonsDisabled ) {
    __p +=
    ((__t = ( i18n.disabledMarkText )) == null ? '' : __t);
     }
                                else if ( scores[ i ].identifier === activeMarker ) {
    __p +=
    ((__t = ( i18n.removeMarksInText )) == null ? '' : __t);
     }
                                else {
    __p +=
    ((__t = ( i18n.markInText )) == null ? '' : __t);
     }
    __p += '"\n                        class="assessment-results__mark ';

                            if ( markerButtonsDisabled ) {
    __p += ' icon-eye-disabled ';
     }
                            else if ( scores[ i ].identifier === activeMarker ) {
    __p += '\n                            icon-eye-active\n                        ';
     }
                            else {
    __p += '\n                            icon-eye-inactive\n                        ';
     }
    __p += '\n                        js-assessment-results__mark-' +
    ((__t = ( scores[ i ].identifier )) == null ? '' : __t) +
    ' yoast-tooltip yoast-tooltip-s">\n                        <span class="screen-reader-text">';
     if ( markerButtonsDisabled ) {
    __p +=
    ((__t = ( i18n.disabledMarkText )) == null ? '' : __t);
     }
                                else if ( scores[ i ].identifier === activeMarker ) {
    __p +=
    ((__t = ( i18n.removeMarksInText )) == null ? '' : __t);
     }
                                else {
    __p +=
    ((__t = ( i18n.markInText )) == null ? '' : __t);
     }
    __p += '\n                        </span></button>\n                ';
     }
    __p += '\n            </span>\n            <span class="wpseo-score-icon ' +
    __e( scores[ i ].className ) +
    '"></span>\n            <span class="screen-reader-text">' +
    ((__t = ( scores[ i ].screenReaderText )) == null ? '' : __t) +
    '</span>\n            <span class="wpseo-score-text">' +
    ((__t = ( scores[ i ].text )) == null ? '' : __t) +
    '</span>\n        </li>\n    ';
     }
    __p += '\n</ul>\n';

    }
    return __p
  };

  templates['hiddenSpan'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<span style="width: ' +
    __e( width ) +
    '; height: auto; position: absolute; visibility: hidden; ';
     if ( "" !== whiteSpace ) {
    __p += 'white-space: ' +
    __e(whiteSpace );
       }
    __p += '">\n\n</span>';

    }
    return __p
  };

  templates['snippetEditor'] =   function(obj) {
    obj || (obj = {});
    var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
    function print() { __p += __j.call(arguments, '') }
    with (obj) {
    __p += '<div id="snippet_preview">\n    <section class="snippet-editor__preview">\n		<h3 class="snippet-editor__heading snippet-editor__heading-icon-eye">' +
    __e( i18n.snippetPreview ) +
    '</h3>\n    <p class="screen-reader-text">' +
    __e( i18n.snippetPreviewDescription ) +
    '</p>\n\n        <div class="snippet_container snippet-editor__container" id="title_container">\n            <span class="screen-reader-text">' +
    __e( i18n.titleLabel ) +
    '</span>\n            <span class="title" id="render_title_container">\n                <span id="snippet_title">\n                    ' +
    __e( rendered.title ) +
    '\n                </span>\n            </span>\n            <span class="title" id="snippet_sitename"></span>\n        </div>\n        <div class="snippet_container snippet-editor__container" id="url_container">\n            <span class="screen-reader-text">' +
    __e( i18n.slugLabel ) +
    '</span>\n            <cite class="url urlBase" id="snippet_citeBase">\n                ' +
    __e( rendered.baseUrl ) +
    '\n            </cite>\n            <cite class="url" id="snippet_cite">\n                ' +
    __e( rendered.snippetCite ) +
    '\n            </cite>\n        </div>\n        <div class="snippet_container snippet-editor__container" id="meta_container">\n            <span class="screen-reader-text">' +
    __e( i18n.metaDescriptionLabel ) +
    '</span>\n            ';
     if ( "" !== metaDescriptionDate ) {
    __p += '\n                <span class="snippet-editor__date">\n                    ' +
    __e( metaDescriptionDate ) +
    ' -\n                </span>\n            ';
     }
    __p += '\n            <span class="desc" id="snippet_meta">\n                ' +
    __e( rendered.meta ) +
    '\n            </span>\n        </div>\n\n        <button class="snippet-editor__button snippet-editor__edit-button" type="button" aria-expanded="false">\n            ' +
    __e( i18n.edit ) +
    '\n        </button>\n    </section>\n\n    <div class="snippet-editor__form snippet-editor--hidden">\n        <label for="snippet-editor-title" class="snippet-editor__label">\n            ' +
    __e( i18n.title ) +
    '\n            <input type="text" class="snippet-editor__input snippet-editor__title js-snippet-editor-title" id="snippet-editor-title" value="' +
    __e( raw.title ) +
    '" placeholder="' +
    __e( placeholder.title ) +
    '" />\n        </label>\n        <progress value="0.0" class="snippet-editor__progress snippet-editor__progress-title" aria-hidden="true">\n            <div class="snippet-editor__progress-bar"></div>\n        </progress>\n        <label for="snippet-editor-slug" class="snippet-editor__label">\n            ' +
    __e( i18n.slug ) +
    '\n            <input type="text" class="snippet-editor__input snippet-editor__slug js-snippet-editor-slug" id="snippet-editor-slug" value="' +
    __e( raw.snippetCite ) +
    '" placeholder="' +
    __e( placeholder.urlPath ) +
    '" />\n        </label>\n        <label for="snippet-editor-meta-description" class="snippet-editor__label">\n            ' +
    __e( i18n.metaDescription ) +
    '\n            <textarea class="snippet-editor__input snippet-editor__meta-description js-snippet-editor-meta-description" id="snippet-editor-meta-description" placeholder="' +
    __e( placeholder.metaDesc ) +
    '">' +
    __e( raw.meta ) +
    '</textarea>\n        </label>\n        <progress value="0.0" class="snippet-editor__progress snippet-editor__progress-meta-description" aria-hidden="true">\n            <div class="snippet-editor__progress-bar"></div>\n        </progress>\n\n        <button class="snippet-editor__submit snippet-editor__button" type="button">' +
    __e( i18n.save ) +
    '</button>\n    </div>\n</div>\n';

    }
    return __p
  };

  /*----------------------------------------------------------------------------*/

  if (freeModule) {
    (freeModule.exports = templates).templates = templates;
    freeExports.templates = templates;
  }
  else {
    root.templates = templates;
  }
}.call(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],396:[function(require,module,exports){
var isUndefined = require( "lodash/isUndefined" );
var isNumber = require( "lodash/isNumber" );

/**
 * A function that only returns an empty that can be used as an empty marker
 *
 * @returns {Array} A list of empty marks.
 */
var emptyMarker = function() {
	return [];
};

/**
 * Construct the AssessmentResult value object.
 *
 * @param {Object} [values] The values for this assessment result.
 *
 * @constructor
 */
var AssessmentResult = function( values ) {
	this._hasScore = false;
	this._identifier = "";
	this._hasMarks = false;
	this._marker = emptyMarker;
	this.score = 0;
	this.text = "";

	if ( isUndefined( values ) ) {
		values = {};
	}

	if ( !isUndefined( values.score ) ) {
		this.setScore( values.score );
	}

	if ( !isUndefined( values.text ) ) {
		this.setText( values.text );
	}
};

/**
 * Check if a score is available.
 * @returns {boolean} Whether or not a score is available.
 */
AssessmentResult.prototype.hasScore = function() {
	return this._hasScore;
};

/**
 * Get the available score
 * @returns {number} The score associated with the AssessmentResult.
 */
AssessmentResult.prototype.getScore = function() {
	return this.score;
};

/**
 * Set the score for the assessment.
 * @param {number} score The score to be used for the score property
 * @returns {void}
 */
AssessmentResult.prototype.setScore = function( score ) {
	if ( isNumber( score ) ) {
		this.score = score;
		this._hasScore = true;
	}
};

/**
 * Check if a text is available.
 * @returns {boolean} Whether or not a text is available.
 */
AssessmentResult.prototype.hasText = function() {
	return this.text !== "";
};

/**
 * Get the available text
 * @returns {string} The text associated with the AssessmentResult.
 */
AssessmentResult.prototype.getText = function() {
	return this.text;
};

/**
 * Set the text for the assessment.
 * @param {string} text The text to be used for the text property
 * @returns {void}
 */
AssessmentResult.prototype.setText = function( text ) {
	if ( isUndefined( text ) ) {
		text = "";
	}

	this.text = text;
};

/**
 * Sets the identifier
 *
 * @param {string} identifier An alphanumeric identifier for this result.
 */
AssessmentResult.prototype.setIdentifier = function( identifier ) {
	this._identifier = identifier;
};

/**
 * Gets the identifier
 *
 * @returns {string} An alphanumeric identifier for this result.
 */
AssessmentResult.prototype.getIdentifier = function() {
	return this._identifier;
};

/**
 * Sets the marker, a pure function that can return the marks for a given Paper
 *
 * @param {Function} marker The marker to set.
 */
AssessmentResult.prototype.setMarker = function( marker ) {
	this._marker = marker;
};

/**
 * Returns whether or not this result has a marker that can be used to mark for a given Paper
 *
 * @returns {boolean} Whether or this result has a marker.
 */
AssessmentResult.prototype.hasMarker = function() {
	return this._hasMarks && this._marker !== emptyMarker;
};

/**
 * Gets the marker, a pure function that can return the marks for a given Paper
 *
 * @returns {Function} The marker.
 */
AssessmentResult.prototype.getMarker = function() {
	return this._marker;
};

/**
 * Sets the value of _hasMarks to determine if there is something to mark.
 *
 * @param {boolean} hasMarks Is there something to mark.
 */
AssessmentResult.prototype.setHasMarks = function( hasMarks ) {
	this._hasMarks = hasMarks;
};

/**
 * Returns the value of _hasMarks to determine if there is something to mark.
 *
 * @returns {boolean} Is there something to mark.
 */
AssessmentResult.prototype.hasMarks = function() {
	return this._hasMarks;
};

module.exports = AssessmentResult;

},{"lodash/isNumber":211,"lodash/isUndefined":218}],397:[function(require,module,exports){
var defaults = require( "lodash/defaults" );

/**
 * Represents a marked piece of text
 *
 * @param {Object} properties The properties of this Mark.
 * @param {string} properties.original The original text that should be marked.
 * @param {string} properties.marked The new text including marks.
 * @constructor
 */
function Mark( properties ) {
	defaults( properties, { original: "", marked: "" } );

	this._properties = properties;
}


/**
 * Returns the original text
 *
 * @returns {string} The original text.
 */
Mark.prototype.getOriginal = function() {
	return this._properties.original;
};

/**
 * Returns the marked text
 *
 * @returns {string} The replaced text.
 */
Mark.prototype.getMarked = function() {
	return this._properties.marked;
};

/**
 * Applies this mark to the given text
 *
 * @param {string} text The original text without the mark applied.
 * @returns {string} The A new text with the mark applied to it.
 */
Mark.prototype.applyWithReplace = function( text ) {
	// Cute method to replace everything in a string without using regex.
	return text.split( this._properties.original ).join( this._properties.marked );
};

module.exports = Mark;

},{"lodash/defaults":184}],398:[function(require,module,exports){
var defaults = require( "lodash/defaults" );
var sanitizeString = require( "../stringProcessing/sanitizeString.js" );

/**
 * Default attributes to be used by the Paper if they are left undefined.
 * @type {{keyword: string, description: string, title: string, url: string}}
 */
var defaultAttributes = {
	keyword: "",
	description: "",
	title: "",
	titleWidth: 0,
	url: "",
	locale: "en_US",
	permalink: ""
};

/**
 * Sanitize attributes before they are assigned to the Paper.
 * @param {object} attributes The attributes that need sanitizing.
 * @returns {object} The attributes passed to the Paper.
 */
var sanitizeAttributes = function( attributes ) {
	attributes.keyword = sanitizeString( attributes.keyword );

	return attributes;
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
	this._attributes = sanitizeAttributes( attributes );
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

module.exports = Paper;

},{"../stringProcessing/sanitizeString.js":384,"lodash/defaults":184}],399:[function(require,module,exports){
var SyllableCountStep = require ( "./syllableCountStep.js" );

var isUndefined = require( "lodash/isUndefined" );
var forEach = require ( "lodash/forEach" );

/**
 * Creates a syllable count iterator.
 *
 * @param {object} config The config object containing an array with syllable exclusions.
 * @constructor
 */
var SyllableCountIterator = function( config ) {
	this.countSteps = [];
	if( !isUndefined( config ) ) {
		this.createSyllableCountSteps( config.syllableExclusion );
	}
};

/**
 * Creates a language syllable regex for each exclusion.
 *
 * @param {object} syllableRegexes The object containing all exclusion syllables including the multipliers.
 */
SyllableCountIterator.prototype.createSyllableCountSteps = function( syllableRegexes ) {
	forEach( syllableRegexes, function( syllableRegex ) {
		this.countSteps.push( new SyllableCountStep( syllableRegex ) );
	}.bind( this ) );
};

/**
 * Returns all available count steps.
 *
 * @returns {Array} All available count steps.
 */
SyllableCountIterator.prototype.getAvailableSyllableCountSteps = function() {
	return this.countSteps;
};

/**
 * Counts the syllables for all the steps and returns the total syllable count.
 *
 * @param {String} word The word to count syllables in.
 * @returns {number} The number of syllables found based on exclusions.
 */
SyllableCountIterator.prototype.countSyllables = function( word ) {
	var syllableCount = 0;
	forEach( this.countSteps, function( step ) {
		syllableCount += step.countSyllables( word );
	} );
	return syllableCount;
};

module.exports = SyllableCountIterator;

},{"./syllableCountStep.js":400,"lodash/forEach":194,"lodash/isUndefined":218}],400:[function(require,module,exports){
var isUndefined = require( "lodash/isUndefined" );

var arrayToRegex = require( "../stringProcessing/createRegexFromArray.js" );

/**
 * Constructs a language syllable regex that contains a regex for matching syllable exclusion.
 *
 * @param {object} syllableRegex The object containing the syllable exclusions.
 * @constructor
 */
var SyllableCountStep = function( syllableRegex ) {
	this._hasRegex = false;
	this._regex = "";
	this._multiplier = "";
	this.createRegex( syllableRegex );
};

/**
 * Returns if a valid regex has been set.
 *
 * @returns {boolean} True if a regex has been set, false if not.
 */
SyllableCountStep.prototype.hasRegex = function() {
	return this._hasRegex;
};

/**
 * Creates a regex based on the given syllable exclusions, and sets the multiplier to use.
 *
 * @param {object} syllableRegex The object containing the syllable exclusions and multiplier.
 */
SyllableCountStep.prototype.createRegex = function( syllableRegex ) {
	if( !isUndefined( syllableRegex ) && !isUndefined( syllableRegex.syllables ) ) {

		this._hasRegex = true;
		this._regex = arrayToRegex( syllableRegex.syllables, true );
		this._multiplier = syllableRegex.multiplier;
	}
};

/**
 * Returns the stored regular expression.
 *
 * @returns {RegExp} The stored regular expression.
 */
SyllableCountStep.prototype.getRegex = function() {
	return this._regex;
};

/**
 * Matches syllable exclusions in a given word and the returns the number found multiplied with the
 * given multiplier.
 *
 * @param {String} word The word to match for syllable exclusions.
 * @returns {number} The amount of syllables found.
 */
SyllableCountStep.prototype.countSyllables = function( word ) {
	if( this._hasRegex ) {
		var match = word.match( this._regex ) || [];
		return match.length * this._multiplier;
	}
	return 0;
};

module.exports = SyllableCountStep;

},{"../stringProcessing/createRegexFromArray.js":363,"lodash/isUndefined":218}]},{},[18]);
