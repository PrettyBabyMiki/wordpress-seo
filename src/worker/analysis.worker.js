// External dependencies.
import Jed from "jed";
import omit from "lodash/omit";
import merge from "lodash/merge";
const isUndefined = require( "lodash/isUndefined" );

// YoastSEO.js dependencies.
import * as Paper from "yoastseo/values/Paper";
import * as Researcher from "yoastseo/researcher";
import * as ContentAssessor from "yoastseo/contentAssessor";
import * as SEOAssessor from "yoastseo/seoAssessor";
import * as CornerstoneContentAssessor from "yoastseo/cornerstone/contentAssessor";
import * as CornerstoneSEOAssessor from "yoastseo/cornerstone/seoAssessor";
const removeHtmlBlocks = require( "../stringProcessing/htmlParser.js" );
const LargestKeywordDistanceAssessment = require( "yoastseo/assessments/seo/LargestKeywordDistanceAssessment" );

// Internal dependencies.
import Scheduler from "./scheduler";
import { encodePayload, decodePayload } from "./utils";

/**
 * Analysis Web Worker.
 *
 * Worker API:     https://developer.mozilla.org/en-US/docs/Web/API/Worker
 * Webpack loader: https://github.com/webpack-contrib/worker-loader
 */
class AnalysisWebWorker {
	/**
	 * Initializes the AnalysisWebWorker class.
	 */
	constructor() {
		this._configuration = {
			contentAnalysisActive: true,
			keywordAnalysisActive: true,
			useCornerstone: false,
			useKeywordDistribution: false,
			// The locale used for language-specific configurations in Flesch-reading ease and Sentence length assessments.
			locale: "en_US",
		};
		this._scheduler = new Scheduler( { resetQueue: true } );
		this._paper = new Paper( "" );
		this._researcher = new Researcher( this._paper );
		this._contentAssessor = null;
		this._seoAssessor = null;

		// Bind actions to this scope.
		this.analyze = this.analyze.bind( this );
		this.analyzeDone = this.analyzeDone.bind( this );

		// Bind event handlers to this scope.
		this.handleMessage = this.handleMessage.bind( this );
	}

	/**
	 * Receives the post message and determines the action.
	 *
	 * See: https://developer.mozilla.org/en-US/docs/Web/API/Worker/onmessage
	 *
	 * @param {MessageEvent} event              The post message event.
	 * @param {Object}       event.data         The data object.
	 * @param {string}       event.data.type    The action type.
	 * @param {string}       event.data.id      The request id.
	 * @param {string}       event.data.payload The payload of the action.
	 *
	 * @returns {void}
	 */
	handleMessage( { data: { type, id, payload } } ) {
		switch( type ) {
			case "initialize":
				this.initialize( id, decodePayload( payload ) );
				break;
			case "analyze":
				this._scheduler.schedule( {
					id,
					execute: this.analyze,
					done: this.analyzeDone,
					data: decodePayload( payload ),
				} );
				break;
			default:
				console.warn( "Unrecognized command", type );
		}
	}

	/**
	 * Initializes i18n object based on passed configuration.
	 *
	 * @param {Object} [translations] The translations to be used in the current
	 *                                instance.
	 *
	 * @returns {Jed} Jed instance.
	 */
	static createI18n( translations ) {
		// Use default object to prevent Jed from erroring out.
		translations = translations || {
			domain: "js-text-analysis",
			// eslint-disable-next-line camelcase
			locale_data: {
				"js-text-analysis": {
					"": {},
				},
			},
		};

		return new Jed( translations );
	}

	/**
	 * Initializes the appropriate content assessor.
	 *
	 * @returns {null|ContentAssessor|CornerstoneContentAssessor} The chosen
	 *                                                            content
	 *                                                            assessor.
	 */
	createContentAssessor() {
		const {
			contentAnalysisActive,
			useCornerstone,
			locale,
		} = this._configuration;

		if ( contentAnalysisActive === false ) {
			return null;
		}

		const assessor = useCornerstone === true ?
			new CornerstoneSEOAssessor( this._i18n, { locale } ) :
			new SEOAssessor( this._i18n, { locale } );

		return assessor;
	}

	/**
	 * Initializes the appropriate SEO assessor.
	 *
	 * @returns {null|SEOAssessor|CornerstoneSEOAssessor} The chosen
	 *                                                    SEO
	 *                                                    assessor.
	 */
	createSEOAssessor() {
		const {
			keywordAnalysisActive,
			useCornerstone,
			useKeywordDistribution,
			locale,
		} = this._configuration;

		if ( keywordAnalysisActive === false ) {
			return null;
		}

		const assessor = useCornerstone === true ?
			new CornerstoneSEOAssessor( this._i18n, { locale } ) :
			new SEOAssessor( this._i18n, { locale } );

		if ( useKeywordDistribution && isUndefined( assessor.getAssessment( "largestKeywordDistance" ) ) ) {
			assessor.addAssessment( "largestKeywordDistance", LargestKeywordDistanceAssessment );
		}

		return assessor;
	}

	/**
	 * Sends a message.
	 *
	 * @param {string} type      The message type.
	 * @param {number} id        The request id.
	 * @param {Object} [payload] The payload to deliver.
	 *
	 * @returns {void}
	 */
	send( type, id, payload = {} ) {
		console.log( "worker => wrapper", type, id, payload );
		self.postMessage( {
			type,
			id,
			payload: encodePayload( payload ),
		} );
	}

	/**
	 * Configures the analysis worker.
	 *
	 * @param {number}  id                                     The id of the request.
	 * @param {Object}  configuration                          The configuration object.
	 * @param {boolean} [configuration.contentAnalysisActive]  Whether the content analysis is active.
	 * @param {boolean} [configuration.keywordAnalysisActive]  Whether the keyword analysis is active.
	 * @param {boolean} [configuration.useCornerstone]         Whether the keyword is cornerstone or not.
	 * @param {boolean} [configuration.useKeywordDistribution] Whether the largestKeywordDistance assessment should run.
	 * @param {string}  [configuration.locale]                 The locale used in the seo assessor.
	 *
	 * @returns {void}
	 */
	initialize( id, configuration ) {
		this._configuration = merge( this._configuration, configuration );
		console.log( "run initialize", configuration, this._configuration );

		this._i18n = AnalysisWebWorker.createI18n( this._configuration.translations );

		this.setLocale( this._configuration.locale );
		// Ensure we always have a content assessor.
		if ( this._contentAssessor === null ) {
			this._contentAssessor = this.createContentAssessor();
		}

		this._seoAssessor = this.createSEOAssessor();

		this.send( "initialize:done", id );
	}

	/**
	 * Changes the locale in the configuration.
	 *
	 * If the locale is different:
	 * - Update the configuration locale.
	 * - Create the content assessor.
	 *
	 * @param {string} locale The locale to set.
	 *
	 * @returns {void}
	 */
	setLocale( locale ) {
		if ( this._configuration.locale === locale ) {
			return;
		}
		this._configuration.locale = locale;
		this._contentAssessor = this.createContentAssessor();
	}

	/**
	 * Runs analyses on a paper.
	 *
	 * @param {Object} payload                 The payload object.
	 * @param {Object} payload.paper           The paper to analyze.
	 *
	 * @returns {Object} The result, may not contain readability or seo.
	 */
	analyze( { id, paper } ) {
		console.log( "run analyze", id, paper );
		const result = { id };

		this._paper = new Paper( removeHtmlBlocks( paper.text ), omit( paper, "text" ) );

		// Update the configuration locale to the paper locale.
		this.setLocale( this._paper.getLocale() );

		this._researcher.setPaper( this._paper );

		if ( this._configuration.contentAnalysisActive && this._contentAssessor ) {
			this._contentAssessor.assess( this._paper );
			result.readability = {
				results: this._contentAssessor.results,
				score: this._contentAssessor.calculateOverallScore(),
			};
		}

		if ( this._configuration.keywordAnalysisActive && this._seoAssessor ) {
			this._seoAssessor.assess( this._paper );
			result.seo = {
				results: this._seoAssessor.results,
				score: this._seoAssessor.calculateOverallScore(),
			};
		}

		return result;
	}

	/**
	 * Sends the result back.
	 *
	 * @param {number} id     The request id.
	 * @param {Object} result The result.
	 *
	 * @returns {void}
	 */
	analyzeDone( id, result ) {
		this.send( "analyze:done", id, result );
	}
}

// Create an instance of the analysis web worker.
const analysisWebWorker = new AnalysisWebWorker();

// Bind the post message handler.
self.addEventListener( "message", analysisWebWorker.handleMessage );
