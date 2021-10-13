import { STEPS } from "../config";
import apiFetch from "@wordpress/api-fetch";

export const FINISH_STEPS = "FINISH_STEPS";
export const TOGGLE_WORKOUT = "TOGGLE_WORKOUT";
export const SET_WORKOUTS = "SET_WORKOUTS";
export const OPEN_WORKOUT = "OPEN_WORKOUT";
export const CLEAR_ACTIVE_WORKOUT = "CLEAR_ACTIVE_WORKOUT";
export const TOGGLE_STEP = "TOGGLE_STEP";
export const MOVE_INDEXABLES = "MOVE_INDEXABLES";
export const CLEAR_INDEXABLES = "CLEAR_INDEXABLES";
export const CLEAR_INDEXABLES_IN_STEPS = "CLEAR_INDEXABLES_IN_STEPS";

/**
 * An action creator for finishing a workout step.
 *
 * @param {String} workout The workout key.
 * @param {array} steps The step key.
 *
 * @returns {object} The action object.
 */
export const finishSteps = ( workout, steps ) => {
	return { type: FINISH_STEPS, workout, steps };
};

/**
 * An action creator for toggling an entire workout.
 *
 * @param {String} workout The workout key.
 *
 * @returns {object} The action object.
 */
export const toggleWorkout = ( workout ) => {
	return { type: TOGGLE_WORKOUT, workout };
};

/**
 * An action creator to initialize the workouts.
 *
 * @param {object} workouts the workouts.
 *
 * @returns {object} The action object.
 */
export const initWorkouts = ( workouts ) => {
	return { type: SET_WORKOUTS, workouts };
};

/**
 * An action creator for opening a workout.
 *
 * @param {String} workout The workout key.
 *
 * @returns {object} The action object.
 */
export const openWorkout = ( workout ) => {
	window.location.hash = workout;
	return { type: OPEN_WORKOUT, workout };
};

/**
 * An action creator for clearing the active workout.
 *
 * @returns {object} The action object.
 */
export const clearActiveWorkout = () => {
	window.location.hash = "";
	return { type: CLEAR_ACTIVE_WORKOUT };
};

/**
 * Toggles a workout step for a workout.
 *
 * @param {string} workout The workout for which to toggle the step.
 * @param {string} step The name of the step.
 *
 * @returns {object} The action that toggles the step.
 */
export const toggleStep = ( workout, step ) => {
	return { type: TOGGLE_STEP, workout, step };
};
