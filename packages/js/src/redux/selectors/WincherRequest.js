/**
 * Gets the current request status - pending or done.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Current request status.
 */
export function getWincherIsRequestPending( state ) {
	return state.WincherRequest.isRequestPending;
}

/**
 * Gets the request return state (success or failed).
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Current request return state.
 */
export function getWincherRequestIsSuccess( state ) {
	return state.WincherRequest.isSuccess;
}

/**
 * Gets the request response.
 *
 * @param {Object} state The state.
 *
 * @returns {Object} Current request response.
 */
export function getWincherRequestResponse( state ) {
	return state.WincherRequest.response;
}

/**
 * Gets the request limit reached boolean.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Current request limit reached boolean.
 */
export function getWincherRequestLimitReached( state ) {
	return state.WincherRequest.limitReached;
}

/**
 * Gets the current keyphrase of the request.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Current request keyphrase.
 */
export function getWincherRequestKeyphrase( state ) {
	return state.WincherRequest.keyphrase;
}

/**
 * Gets the currently selected country.
 *
 * @param {Object} state The state.
 *
 * @returns {string} Current country.
 */
export function getWincherSelectedCountry( state ) {
	return state.WincherRequest.countryCode;
}

/**
 * Checks whether the last successful request has a dataset.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether or not there was a dataset in the last successful request.
 */
export function getWincherRequestHasData( state ) {
	return state.WincherRequest.hasData;
}

/**
 * Gets the user logged in to Wincher status.
 *
 * @param {Object} state The state.
 *
 * @returns {boolean} Whether or not the user is logged in to Wincher.
 */
export function getWincherLoginStatus( state ) {
	return state.WincherRequest.isLoggedIn;
}
