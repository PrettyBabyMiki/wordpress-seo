import { FINISHABLE_STEPS } from "../config";
/**
 * Gets the workouts data from the state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} the workout.
 */
export const getWorkouts = ( state ) => {
	return state.workouts;
};

/**
 * Gets the indexables for a particular step.
 *
 * @param {Object} state The state.
 * @param {string} workout The name of the workout.
 * @param {string} step The name of the step.
 * @returns {Object[]} The indexables.
 */
export const getIndexablesByStep = ( state, workout, step ) => {
	return state.workouts[ workout ].indexablesByStep[ step ];
};

/**
 * Get the finished workouts.
 * @param {Object} state The state.
 * @returns {String[]} The finished workouts.
 */
export const getFinishedWorkouts = ( state ) => {
	const finishedWorkouts = [];
	Object.keys( state.workouts ).forEach( function( workout ) {
		if ( state.workouts[ workout ].finishedSteps.length === FINISHABLE_STEPS[ workout ].length ) {
			finishedWorkouts.push( workout );
		}
	} );
	return finishedWorkouts;
};

/**
 * Gets the loading state.
 *
 * @param {Object} state The state.
 *
 * @returns {String} the loading state.
 */
export const getLoading = ( state ) => {
	return state.loading;
};

/**
 * Gets the activeWorkout.
 *
 * @param {Object} state The state.
 *
 * @returns {String} the active workout.
 */
export const getActiveWorkout = ( state ) => {
	return state.activeWorkout;
};
