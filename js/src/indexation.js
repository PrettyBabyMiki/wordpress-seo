/* global jQuery, yoastIndexingData */
import { render, Component, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { Alert, NewButton, ProgressBar } from "@yoast/components";
import { colors } from "@yoast/style-guide";

const preIndexingActions = {};
const IndexingActions = {};

window.yoast = window.yoast || {};
window.yoast.indexing = window.yoast.indexing || {};

/**
 * Registers a pre-indexing action on the given indexing endpoint.
 *
 * This action is executed before the endpoint is first called with the indexing
 * settings as its first argument.
 *
 * @param {string}   endpoint The endpoint on which to register the action.
 * @param {function} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexing.registerPreIndexingAction = ( endpoint, action ) => {
	preIndexingActions[ endpoint ] = action;
};

/**
 * Registers an action on the given indexing endpoint.
 *
 * This action is executed each time after the endpoint is called, with the objects
 * returned from the endpoint as its first argument and the indexing settings as its second argument.
 *
 * @param {string}                       endpoint The endpoint on which to register the action.
 * @param {function(Object[], Object[])} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexing.registerIndexingAction = ( endpoint, action ) => {
	IndexingActions[ endpoint ] = action;
};

/**
 * @deprecated Deprecated since 15.1. Use `window.yoast.indexing` instead.
 */
window.yoast.indexation = window.yoast.indexing;

/**
 * Registers a pre-indexing action on the given indexing endpoint.
 *
 * This action is executed before the endpoint is first called with the indexing
 * settings as its first argument.
 *
 * @deprecated Deprecated since 15.1. Use `window.yoast.indexing.registerPreIndexingAction` instead.
 *
 * @param {string}   endpoint The endpoint on which to register the action.
 * @param {function} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexation.registerPreIndexationAction = ( endpoint, action ) => {
	console.warn( "Deprecated since 15.1. Use 'window.yoast.indexing.registerPreIndexingAction' instead." );
	window.yoast.indexing.registerPreIndexingAction( endpoint, action );
};

/**
 * Registers an action on the given indexing endpoint.
 *
 * This action is executed each time after the endpoint is called, with the objects
 * returned from the endpoint as its first argument and the indexing settings as its second argument.
 *
 * @deprecated Deprecated since 15.1. Use `window.yoast.indexing.registerIndexingAction` instead.
 *
 * @param {string}   endpoint The endpoint on which to register the action.
 * @param {function(Object[], Object[])} action   The action to register.
 *
 * @returns {void}
 */
window.yoast.indexation.registerIndexationAction = ( endpoint, action ) => {
	console.warn( "Deprecated since 15.1. Use 'window.yoast.indexing.registerIndexingAction' instead." );
	window.yoast.indexing.registerIndexingAction( endpoint, action );
};

/**
 * Indexes the site and shows a progress bar indicating the indexing process' progress.
 */
class Indexing extends Component {
	/**
	 * Indexing constructor.
	 *
	 * @param {Object} props The properties.
	 */
	constructor( props ) {
		super( props );

		this.settings = yoastIndexingData;

		this.state = {
			inProgress: false,
			processed: 0,
			amount: this.settings.amount,
			error: null,
			firstTime: ( this.settings.firstTime === "1" ),
		};

		this.startIndexing = this.startIndexing.bind( this );
		this.stopIndexing = this.stopIndexing.bind( this );
	}

	/**
	 * Does an indexing request.
	 *
	 * @param {string} url   The url of the indexing that should be done.
	 * @param {string} nonce The WordPress nonce value for in the header.
	 *
	 * @returns {Promise} The request promise.
	 */
	async doIndexingRequest( url, nonce ) {
		const response = await fetch( url, {
			method: "POST",
			headers: {
				"X-WP-Nonce": nonce,
			},
		} );

		const data = await response.json();

		// Throw an error when the response's status code is not in the 200-299 range.
		if ( ! response.ok ) {
			throw new Error( data.message );
		}

		return data;
	}

	/**
	 * Does any registered indexing action *before* a call to an index endpoint.
	 *
	 * @param {string} endpoint The endpoint that has been called.
	 *
	 * @returns {Promise<void>} An empty promise.
	 */
	async doPreIndexingAction( endpoint ) {
		if ( typeof preIndexingActions[ endpoint ] === "function" ) {
			await preIndexingActions[ endpoint ]( this.settings );
		}
	}

	/**
	 * Does any registered indexing action *after* a call to an index endpoint.
	 *
	 * @param {string} endpoint The endpoint that has been called.
	 * @param {Object} response The response of the call to the endpoint.
	 *
	 * @returns {Promise<void>} An empty promise.
	 */
	async doPostIndexingAction( endpoint, response ) {
		if ( typeof IndexingActions[ endpoint ] === "function" ) {
			await IndexingActions[ endpoint ]( response.objects, this.settings );
		}
	}

	/**
	 * Does the indexing of a given endpoint.
	 *
	 * @param {string} endpoint The endpoint.
	 *
	 * @returns {Promise} The indexing promise.
	 */
	async doIndexing( endpoint ) {
		let url = this.settings.restApi.root + this.settings.restApi.endpoints[ endpoint ];

		while ( this.state.inProgress && url !== false && this.state.processed <= this.state.amount ) {
			try {
				await this.doPreIndexingAction( endpoint );
				const response = await this.doIndexingRequest( url, this.settings.restApi.nonce );
				await this.doPostIndexingAction( endpoint, response );

				this.setState( previousState => (
					{
						processed: previousState.processed + response.objects.length,
						firstTime: false,
					}
				) );

				url = response.next_url;
			} catch ( error ) {
				this.setState( {
					inProgress: false,
					firstTime: false,
					error,
				} );
			}
		}
	}

	/**
	 * Indexes the objects by calling each indexing endpoint in turn.
	 *
	 * @returns {Promise<void>} The indexing promise.
	 */
	async index() {
		for ( const endpoint of Object.keys( this.settings.restApi.endpoints ) ) {
			await this.doIndexing( endpoint );
		}
		/*
		 * Set the indexing process as completed only when there is no error
		 * and the user has not stopped the process manually.
		 */
		if ( ! this.state.error && this.state.inProgress ) {
			this.completeIndexing();
		}
	}

	/**
	 * Starts the indexing process.
	 *
	 * @returns {Promise<void>} The start indexing promise.
	 */
	async startIndexing() {
		/*
		 * Since `setState` is asynchronous in nature, we have to supply a callback
		 * to make sure the state is correctly set before trying to call the first
		 * endpoint.
		 */
		this.setState( { processed: 0, inProgress: true, error: null }, this.index );
	}

	/**
	 * Sets the state of the indexing process to completed.
	 *
	 * @returns {void}
	 */
	completeIndexing() {
		this.setState( previousState => (
			{
				inProgress: false,
				processed: previousState.amount,
			}
		) );
	}

	/**
	 * Stops the indexing process.
	 *
	 * @returns {void}
	 */
	stopIndexing() {
		this.setState( previousState => (
			{
				inProgress: false,
				amount: previousState.amount - previousState.processed,
			}
		) );
	}

	/**
	 * Start indexation on mount, when redirected from the "Start SEO data optimization" button in the dashboard notification.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		if ( this.settings.disabled ) {
			return;
		}

		const shouldStart = new URLSearchParams( window.location.search ).get( "start-indexation" ) === "true";

		if ( shouldStart ) {
			this.startIndexing();
		}
	}

	/**
	 * Renders a notice if it is the first time the indexation is performed.
	 *
	 * @returns {JSX.Element} The rendered component.
	 */
	renderFirstIndexationNotice() {
		if ( this.state.inProgress || ! this.state.firstTime ) {
			return null;
		}

		return (
			<Alert type={ "info" }>
				{ __( "This feature includes and replaces the Text Link Counter and Internal Linking Analysis", "wordpress-seo" ) }
			</Alert>
		);
	}

	/**
	 * Renders the component
	 *
	 * @returns {JSX.Element} The rendered component.
	 */
	render() {
		if ( this.settings.disabled ) {
			return <Fragment>
				<p>
					<NewButton
						variant="secondary"
						disabled={ true }
					>
						{ __( "Start SEO data optimization", "wordpress-seo" ) }
					</NewButton>
				</p>
				<Alert type={ "info" }>
					{ __( "SEO data optimization is disabled for non-production environments.", "wordpress-seo" ) }
				</Alert>
			</Fragment>;
		}

		if ( this.state.processed >= this.state.amount ) {
			return <Alert type={ "success" }>{ __( "SEO data optimization complete", "wordpress-seo" ) }</Alert>;
		}

		return (
			<Fragment>
				{
					this.state.inProgress && <Fragment>
						<ProgressBar
							style={ { height: "16px", margin: "8px 0" } }
							progressColor={ colors.$color_pink_dark }
							max={ parseInt( this.state.amount, 10 ) }
							value={ this.state.processed }
						/>
						<p style={ { color: colors.$palette_grey_text } }>
							{ __( "Optimizing SEO data... This may take a while.", "wordpress-seo" ) }
						</p>
					</Fragment>
				}
				{
					this.state.error && <Alert type={ "error" }>
						{ __( "Oops, something has gone wrong and we couldn't complete the optimization of your SEO data. " +
							  "Please click the button again to re-start the process.", "wordpress-seo" ) }
					</Alert>
				}
				{ this.renderFirstIndexationNotice() }
				{
					this.state.inProgress
						? <NewButton
							variant="secondary"
							onClick={ this.stopIndexing }
						>
							{ __( "Stop SEO data optimization", "wordpress-seo" ) }
						</NewButton>
						: <NewButton
							variant="primary"
							onClick={ this.startIndexing }
						>
							{ __( "Start SEO data optimization", "wordpress-seo" ) }
						</NewButton>
				}
			</Fragment>
		);
	}
}

jQuery( document ).ready( function() {
	const root = document.getElementById( "yoast-seo-indexing-action" );
	if ( root ) {
		render( <Indexing />, root );
	}
} );
