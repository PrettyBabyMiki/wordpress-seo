import { get } from "lodash";

/**
 * @param {Object} state The current Redux state.
 * @returns {boolean} The is premium boolean.
 */
export const getIsPremium = ( state ) => get( state, "isPremium", false );
