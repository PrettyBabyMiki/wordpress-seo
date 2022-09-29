import { createSelector, createSlice } from "@reduxjs/toolkit";
import { get, isEmpty } from "lodash";

/**
 * @returns {Object} The initial state.
 */
export const createInitialPreferencesState = () => get( window, "wpseoScriptData.preferences", {} );

const slice = createSlice( {
	name: "preferences",
	initialState: createInitialPreferencesState(),
	reducers: {},
} );

export const preferencesSelectors = {
	selectPreference: ( state, preference, defaultValue = {} ) => get( state, `preferences.${ preference }`, defaultValue ),
	selectPreferences: state => get( state, "preferences", {} ),
};
preferencesSelectors.selectHasPageForPosts = createSelector(
	[
		state => preferencesSelectors.selectPreference( state, "homepageIsLatestPosts" ),
		state => preferencesSelectors.selectPreference( state, "homepagePostsEditUrl" ),
	],
	( homepageIsLatestPosts, homepagePostsEditUrl ) => ! homepageIsLatestPosts && ! isEmpty( homepagePostsEditUrl )
);
preferencesSelectors.selectCanEditUser = createSelector(
	[
		state => preferencesSelectors.selectPreference( state, "currentUserId", -1 ),
		state => preferencesSelectors.selectPreference( state, "canEditUsers", false ),
		( state, userId ) => userId,
	],
	( currentUserId, canEditUsers, userId ) => currentUserId === userId || canEditUsers
);

export const preferencesActions = slice.actions;

export default slice.reducer;
