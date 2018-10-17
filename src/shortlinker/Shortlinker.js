/**
 * Shortlinker to handle appending parameters to a shortlink.
 */
export default class Shortlinker {
	/**
	 * Initialize the Shortlinker class.
	 *
	 * @param {Object} [config={}] Optional configuration.
	 */
	constructor( config = {} ) {
		this.configure( config );
	}

	/**
	 * Saves the passed configuration.
	 *
	 * @param {Object} config             The configuration.
	 * @param {Object} [config.params={}] The params to create the query string with.
	 *
	 * @returns {void}
	 */
	configure( config ) {
		this._config = {
			params: {},
			...config,
		};
	}

	/**
	 * Creates a query string from a params object.
	 *
	 * @param {Object} params Params for in the query string.
	 *
	 * @returns {string} URI encoded query string.
	 */
	static createQueryString( params ) {
		return Object.keys( params )
			.map( key => `${ encodeURIComponent( key ) }=${ encodeURIComponent( params[ key ] ) }` )
			.join( "&" );
	}

	/**
	 * Creates a shortlink using the params from the config.
	 *
	 * @param {string} url         The base url.
	 * @param {Object} [params={}] Optional params for in the query string.
	 *
	 * @returns {string} The shortlink with query string.
	 */
	create( url, params = {} ) {
		let link = encodeURI( url );
		const queryString = Shortlinker.createQueryString( {
			...this._config.params,
			...params,
		} );

		if ( queryString !== "" ) {
			link += "?" + queryString;
		}

		return link;
	}

	/**
	 * Creates an anchor opening tag using the shortlink create.
	 *
	 * @param {string} url         The base url.
	 * @param {Object} [params={}] Optional params for in the query string.
	 *
	 * @returns {string} The shortlink with query string.
	 */
	createAnchorOpeningTag( url, params = {} ) {
		return `<a href='${ this.create( url, params ) }' target='_blank'>`;
	}
}
