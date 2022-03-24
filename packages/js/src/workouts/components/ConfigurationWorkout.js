import apiFetch from "@wordpress/api-fetch";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { createInterpolateElement, useCallback, useReducer, useState, useEffect, Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { cloneDeep } from "lodash";
import PropTypes from "prop-types";

import UnsavedChangesModal from "../tailwind-components/unsaved-changes-modal";
import Alert from "../tailwind-components/base/alert";
import { NewButton as Button, RadioButtonGroup, SingleSelect, TextInput } from "@yoast/components";
import { ReactComponent as WorkoutDoneImage } from "../../../../../images/mirrored_fit_bubble_woman_1_optim.svg";
import { ReactComponent as WorkoutStartImage } from "../../../images/motivated_bubble_woman_1_optim.svg";
import { addLinkToString } from "../../helpers/stringHelpers.js";
import { Step as OldStep, Steps, FinishButtonSection } from "./Steps";
import { NewsletterSignup } from "./NewsletterSignup";
import { ConfigurationIndexation } from "../tailwind-components/steps/indexation/ConfigurationIndexation";
import SocialInputSection from "./SocialInputSection";
import SocialInputPersonSection from "./SocialInputPersonSection";
import SocialProfilesStep from "../tailwind-components/steps/social-profiles/social-profiles-step";
import Stepper, { Step } from "../tailwind-components/Stepper";
import { ContinueButton, EditButton, ConfigurationStepButtons } from "../tailwind-components/ConfigurationStepperButtons";
import { STEPS, WORKOUTS } from "../config";
import { getInitialActiveStepIndex } from "../stepper-helper";
import { scrollToStep } from "../helpers";
import IndexationStep from "../tailwind-components/steps/indexation/indexation-step";
import SiteRepresentationStep from "../tailwind-components/steps/site-representation/site-representation-step";

window.wpseoScriptData = window.wpseoScriptData || {};
window.wpseoScriptData.searchAppearance = {
	...window.wpseoScriptData.searchAppearance,
	userEditUrl: "/wp-admin/user-edit.php?user_id={user_id}",
};

/**
 * Adds a step to editedSteps if not there already.
 *
 * @param {Array} editedSteps Steps that have been edited.
 * @param {number} stepNumber  The number of the field that was edited.
 *
 * @returns {Array} The new array of editedSteps.
 */
function addStepToEditedSteps( editedSteps, stepNumber ) {
	if ( editedSteps.includes( stepNumber ) ) {
		return [ ...editedSteps ];
	}
	return [ ...editedSteps, stepNumber ];
}

/**
 * Removes a step from savedSteps.
 *
 * @param {Array} savedSteps Steps that have been saved.
 * @param {number} stepNumber  The number of the step that was edited.
 *
 * @returns {Array} The new array of savedSteps
 */
function removeStepFromSavedSteps( savedSteps, stepNumber ) {
	return savedSteps.filter( step => step !== stepNumber );
}

/**
 * Adjusts the editedSteps and savedSteps and returns the full state;
 *
 * @param {Object} state      The state.
 * @param {number} stepNumber The number of the step that was edited.
 *
 * @returns {Object} The new state;
 */
function handleStepEdit( state, stepNumber ) {
	const newEditedSteps = addStepToEditedSteps( state.editedSteps, stepNumber );
	const newSavedSteps = removeStepFromSavedSteps( state.savedSteps, stepNumber );
	return {
		...state,
		editedSteps: newEditedSteps,
		savedSteps: newSavedSteps,
	};
}

/* eslint-disable complexity */
/**
 * A reducer for the configuration workout's internal state.
 *
 * @param {Object} state  The "current" state.
 * @param {Object} action The action with which to mutate the state.
 *
 * @returns {Object} The state as altered by the action.
 */
function configurationWorkoutReducer( state, action ) {
	let newState = cloneDeep( state );
	switch ( action.type ) {
		case "SET_COMPANY_OR_PERSON":
			newState = handleStepEdit( newState, 2 );
			newState.companyOrPerson = action.payload;
			newState.companyOrPersonLabel = newState.companyOrPersonOptions.filter( ( item ) => {
				return item.value === action.payload;
			} ).pop().label;
			return newState;
		case "CHANGE_COMPANY_NAME":
			newState = handleStepEdit( newState, 2 );
			newState.companyName = action.payload;
			return newState;
		case "SET_COMPANY_LOGO":
			newState = handleStepEdit( newState, 2 );
			newState.companyLogo = action.payload.url;
			newState.companyLogoId = action.payload.id;
			return newState;
		case "REMOVE_COMPANY_LOGO":
			newState = handleStepEdit( newState, 2 );
			newState.companyLogo = "";
			newState.companyLogoId = "";
			return newState;
		case "SET_PERSON_LOGO":
			newState = handleStepEdit( newState, 2 );
			newState.personLogo = action.payload.url;
			newState.personLogoId = action.payload.id;
			return newState;
		case "REMOVE_PERSON_LOGO":
			newState = handleStepEdit( newState, 2 );
			newState.personLogo = "";
			newState.personLogoId = "";
			return newState;
		case "SET_PERSON":
			newState = handleStepEdit( newState, 2 );
			newState.personId = action.payload.value;
			newState.personName = action.payload.label;
			return newState;
		case "CHANGE_PERSON_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.personSocialProfiles[ action.payload.socialMedium ] = action.payload.value;
			return newState;
		case "INIT_PERSON_SOCIAL_PROFILES":
			newState = handleStepEdit( newState, 3 );
			newState.personSocialProfiles = action.payload.socialProfiles;
			return newState;
		case "SET_CAN_EDIT_USER":
			newState = handleStepEdit( newState, 2 );
			newState.canEditUser = action.payload.value === true ? 1 : 0;
			return newState;
		case "CHANGE_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.socialProfiles[ action.payload.socialMedium ] = action.payload.value;
			return newState;
		case "CHANGE_OTHERS_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.socialProfiles.otherSocialUrls[ action.payload.index ] = action.payload.value;
			return newState;
		case "ADD_OTHERS_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.socialProfiles.otherSocialUrls = [ ...newState.socialProfiles.otherSocialUrls, action.payload.value ];
			return newState;
		case "REMOVE_OTHERS_SOCIAL_PROFILE":
			newState = handleStepEdit( newState, 3 );
			newState.socialProfiles.otherSocialUrls.splice( action.payload.index, 1 );
			return newState;
		case "SET_ERROR_FIELDS":
			newState.errorFields = action.payload;
			return newState;
		case "CHANGE_SITE_TAGLINE":
			newState = handleStepEdit( newState, 2 );
			newState.siteTagline = action.payload;
			return newState;
		case "SET_TRACKING":
			newState = handleStepEdit( newState, 4 );
			newState.tracking = action.payload;
			return newState;
		case "SET_STEP_SAVED":
			if ( ! newState.savedSteps.includes( action.payload ) ) {
				newState.savedSteps = [ ...newState.savedSteps, action.payload ];
			}
			newState.editedSteps = newState.editedSteps.filter( step => step !== action.payload );
			return newState;
		case "SET_STEP_NOT_SAVED":
			newState.savedSteps = newState.savedSteps.filter( step => step !== action.payload );
			return newState;
		case "SET_ALL_STEPS_NOT_SAVED":
			newState.savedSteps = [];
			return newState;
		default:
			return newState;
	}
}

/**
 * Updates the site representation in the database.
 *
 * @param {Object} state The state to save.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
 */
async function updateSiteRepresentation( state ) {
	// Revert emptyChoice to the actual default: "company";
	const siteRepresentation = {
		/* eslint-disable camelcase */
		company_or_person: state.companyOrPerson === "emptyChoice" ? "company" : state.companyOrPerson,
		company_name: state.companyName,
		company_logo: state.companyLogo,
		company_logo_id: state.companyLogoId ? state.companyLogoId : 0,
		person_logo: state.personLogo,
		person_logo_id: state.personLogoId ? state.personLogoId : 0,
		company_or_person_user_id: state.personId,
		/* eslint-enable camelcase */
	};

	if ( window.wpseoWorkoutsData.canEditWordPressOptions ) {
		siteRepresentation.description = state.siteTagline;
	}
	const response = await apiFetch( {
		path: "yoast/v1/workouts/site_representation",
		method: "POST",
		data: siteRepresentation,
	} );
	return await response.json;
}

/**
 * Updates the social profiles in the database.
 *
 * @param {Object} state The state to save.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
 */
async function updateSocialProfiles( state ) {
	const socialProfiles = {
		/* eslint-disable camelcase */
		facebook_site: state.socialProfiles.facebookUrl,
		twitter_site: state.socialProfiles.twitterUsername,
		other_social_urls: state.socialProfiles.otherSocialUrls,
		/* eslint-enable camelcase */
	};

	const response = await apiFetch( {
		path: "yoast/v1/workouts/social_profiles",
		method: "POST",
		data: socialProfiles,
	} );
	return await response.json;
}

/**
 * Updates the person social profiles in the database.
 *
 * @param {Object} state The state to save.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
 */
async function updatePersonSocialProfiles( state ) {
	const socialProfiles = {
		/* eslint-disable camelcase */
		user_id: state.personId,
		facebook: state.personSocialProfiles.facebook,
		instagram: state.personSocialProfiles.instagram,
		linkedin: state.personSocialProfiles.linkedin,
		myspace: state.personSocialProfiles.myspace,
		pinterest: state.personSocialProfiles.pinterest,
		soundcloud: state.personSocialProfiles.soundcloud,
		tumblr: state.personSocialProfiles.tumblr,
		twitter: state.personSocialProfiles.twitter,
		youtube: state.personSocialProfiles.youtube,
		wikipedia: state.personSocialProfiles.wikipedia,
		/* eslint-enable camelcase */
	};
	const response = await apiFetch( {
		path: "yoast/v1/workouts/person_social_profiles",
		method: "POST",
		data: socialProfiles,
	} );
	return await response.json;
}

/**
 * Updates the tracking option in the database.
 *
 * @param {Object} state The state to save.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
 */
async function updateTracking( state ) {
	if ( state.tracking !== 0 && state.tracking !== 1 ) {
		throw "Value not set!";
	}

	const tracking = {
		tracking: state.tracking,
	};

	const response = await apiFetch( {
		path: "yoast/v1/workouts/enable_tracking",
		method: "POST",
		data: tracking,
	} );
	return await response.json;
}

const stepNumberNameMap = {
	1: STEPS.configuration.optimizeSeoData,
	2: STEPS.configuration.siteRepresentation,
	3: STEPS.configuration.socialProfiles,
	4: STEPS.configuration.newsletterSignup,
};

/**
 * Doc comment to make linter happy.
 *
 * @param {Object}   state                    The state
 * @param {function} setTracking              Callback function to update tracking preference
 * @param {Boolean}  isTrackingOptionSelected Wether the tracking option is selected
 *
 * @returns {JSX.Element} Example step.
 */
function PersonalPreferencesStep( { state, setTracking, isTrackingOptionSelected } ) {
	return <Fragment>
		<p>
			{
				__( "To provide the best experience for you, we need your permission to do the following things:", "wordpress-seo" )
			}
		</p>
		<ul className="yoast-tracking">
			<li> { __( "collect info about the plugins and themes you have installed;", "wordpress-seo" ) } </li>
			<li> {
				sprintf(
					// translators: translates to Yoast SEO.
					__( "see which %s features you use or don't use;", "wordpress-seo" ),
					"Yoast SEO"
				)
			} </li>
			<li> { __( "always load our customer support window so we can immediately assist you when you need help.", "wordpress-seo" ) } </li>
		</ul>
		<RadioButtonGroup
			id="yoast-configuration-workout-tracking-radio-button"
			label={ __( "Can we collect anonymous information about your website and how you use it?", "wordpress-seo" ) }
			groupName="yoast-configuration-workout-tracking"
			selected={ state.tracking }
			onChange={ setTracking }
			vertical={ true }
			wrapperClassName={ "tracking-radiobuttons" }
			options={ [
				{
					value: 0,
					label: __( "No, don’t track my site data", "wordpress-seo" ),
				},
				{
					value: 1,
					label: __( "Yes, you can track my site data", "wordpress-seo" ),
				},
			] }
		/>
		<p>
			<i>{
				__( "Important: We will never sell this data. And of course, as always, we won't collect any personal data about you or your visitors!", "wordpress-seo" )
			}</i>
		</p>
		{ ! isTrackingOptionSelected && <Alert type="warning">
			{ __(
				// eslint-disable-next-line max-len
				"In order to complete this step please select if we are allowed to improve Yoast SEO with your data.",
				"wordpress-seo"
			) }
		</Alert> }
		<br />
		<NewsletterSignup gdprLink={ window.wpseoWorkoutsData.configuration.shortlinks.gdpr } />
	</Fragment>;
}

PersonalPreferencesStep.propTypes = {
	state: PropTypes.object.isRequired,
	setTracking: PropTypes.func.isRequired,
	isTrackingOptionSelected: PropTypes.bool.isRequired,
};

/**
 * Example Finish step.
 *
 * @returns {WPElement} Finish step.
 */
const FinishStep = () => <Fragment>
	<p className="yst-mb-6">You have finished all the things, yay!</p>
	<button className="yst-button yst-button--primary">{ __( "Check out your Indexables page", "wordpress-seo" ) }</button>
</Fragment>;

/**
 * Calculates the initial state from the window object.
 *
 * @param {Object}   windowObject   The object to base the initial state on.
 * @param {function} isStepFinished A function to determine whether a step is finished.
 *
 * @returns {Object} The initial state.
 */
function calculateInitialState( windowObject, isStepFinished ) {
	// Overrule default state to empty and add empty choice.
	let { companyOrPerson, companyName,	companyLogo, companyOrPersonOptions } = windowObject; // eslint-disable-line prefer-const
	if ( companyOrPerson === "company" && ( ! companyName && ! companyLogo ) && ! isStepFinished( "configuration", STEPS.configuration.siteRepresentation ) ) {
		companyOrPerson = "emptyChoice";
	}

	return {
		...windowObject,
		companyOrPerson,
		companyOrPersonOptions,
		errorFields: [],
		editedSteps: [],
		savedSteps: [],
	};
}

/**
 * A function that returns true for completed indexingstates.
 *
 * @param {string} indexingState The indexation state.
 *
 * @returns {bool} Whether indexation is done.
 */
function isIndexationDone( indexingState ) {
	return [ "completed", "already_done" ].includes( indexingState );
}

/* eslint-enable max-len, react/prop-types */

/* eslint-disable max-statements */
/**
 * The configuration workout.
 *
 * @param {function}  toggleStep                The function to toggle the step state.
 * @param {function}  finishSteps               The function to finish steps.
 * @param {function}  reviseStep                The function to revise steps.
 * @param {function}  toggleWorkout             The function to toggle the workout state.
 * @param {function}  isStepFinished            The function to check whether a step is finished.
 * @returns {WPElement} The ConfigurationWorkout component.
 */
export function ConfigurationWorkout( { finishSteps, reviseStep, toggleWorkout, clearActiveWorkout, isStepFinished } ) {
	const [ state, dispatch ] = useReducer( configurationWorkoutReducer, {
		...calculateInitialState( window.wpseoWorkoutsData.configuration, isStepFinished ),
	} );
	const [ indexingState, setIndexingState ] = useState( () => window.yoastIndexingData.amount === "0" ? "already_done" : "idle" );
	const [ siteRepresentationEmpty, setSiteRepresentationEmpty ] = useState( false );
	const [ showRunIndexationAlert, setShowRunIndexationAlert ] = useState( false );
	const steps = STEPS.configuration;

	const isTrackingOptionSelected = state.tracking === 0 || state.tracking === 1;

	// Whenever a step is edited, toggle the saved state for that step.
	useEffect( () => {
		state.editedSteps.forEach( stepNumber => {
			reviseStep( "configuration", stepNumberNameMap[ stepNumber ] );
		} );
	}, [ state.editedSteps ] );

	/* Briefly override window variable because indexingstate is reinitialized when navigating back and forth on the workouts page,
	whereas the window variable remains stale. */
	useEffect( () => {
		if ( indexingState === "completed" ) {
			window.yoastIndexingData.amount = "0";
		}
	}, [ indexingState ] );

	/**
	 * Sets the step to isSaved.
	 *
	 * @param {number} stepNumber The number of the step to save.
	 *
	 * @returns {void}
	 */
	const setStepIsSaved = ( stepNumber ) => {
		dispatch( { type: "SET_STEP_SAVED", payload: stepNumber } );
	};

	const isStep1Finished = isStepFinished( "configuration", steps.optimizeSeoData );
	const isStep2Finished = isStepFinished( "configuration", steps.siteRepresentation );
	const isStep3Finished = isStepFinished( "configuration", steps.socialProfiles );
	const isStep4Finished = isStepFinished( "configuration", steps.enableTracking );
	const isStep5Finished = isStepFinished( "configuration", steps.newsletterSignup );
	const isWorkoutFinished = [
		isStep2Finished,
		isStep3Finished,
		isStep4Finished,
	].every( Boolean );

	/**
	 * A function that tests whether criteria are met.
	 *
	 * @param {number} stepNumber The number of the step to verify readiness for.
	 *
	 * @returns {Boolean} Whether the step is ready to be saved.
	 */
	function isStepReady( stepNumber ) {
		switch ( stepNumber ) {
			case 1:
				return [ "in_progress", "completed", "already_done" ].includes( indexingState );
			case 2:
				if ( state.companyOrPerson === "company" ) {
					return Boolean( state.companyLogo && state.companyName );
				}
				return Boolean( state.personLogo && state.personId );
			case 3:
			case 4:
				return true;
			case 5:
				return [ isStep1Finished, isStep2Finished, isStep3Finished, isStep4Finished ].every( Boolean ) && isIndexationDone( indexingState );
			default:
				return false;
		}
	}

	const setTracking = useCallback( ( value ) => {
		dispatch( { type: "SET_TRACKING", payload: parseInt( value, 10 ) } );
	} );

	const setErrorFields = useCallback( ( value ) => {
		dispatch( { type: "SET_ERROR_FIELDS", payload: value } );
	} );

	const onFinishOptimizeSeoData = useCallback(
		() => {
			scrollToStep( 2 );
		},
		[ isStep1Finished ]
	);

	const isCompanyAndEmpty = state.companyOrPerson === "company" && ( ! state.companyName || ! state.companyLogo );
	const isPersonAndEmpty = state.companyOrPerson === "person" && ( ! state.personId || ! state.personLogo );

	/**
	 * Runs checks of finishing the site representation step.
	 *
	 * @returns {void}
	 */
	function updateOnFinishSiteRepresentation() {
		if ( ! siteRepresentationEmpty && isCompanyAndEmpty ) {
			setSiteRepresentationEmpty( true );
			return false;
		} else if ( ! siteRepresentationEmpty && isPersonAndEmpty ) {
			setSiteRepresentationEmpty( true );
			return false;
		} else if ( ! siteRepresentationEmpty && state.companyOrPerson === "emptyChoice" ) {
			setSiteRepresentationEmpty( true );
			return false;
		}
		setSiteRepresentationEmpty( state.companyOrPerson === "emptyChoice" || isCompanyAndEmpty || isPersonAndEmpty );
		updateSiteRepresentation( state )
			.then( () => setStepIsSaved( 2 ) )
			.then( () => finishSteps( "configuration", [ steps.siteRepresentation ] ) );
		scrollToStep( 3 );
		return true;
	}

	/**
	 * Runs checks of finishing the social profiles step.
	 *
	 * @returns {void}
	 */
	function updateOnFinishSocialProfiles() {
		if ( state.companyOrPerson === "person" ) {
			if ( ! state.canEditUser ) {
				return true;
			}
			return updatePersonSocialProfiles( state )
				.then( () => setStepIsSaved( 3 ) )
				.then( () => {
					setErrorFields( [] );
					finishSteps( "configuration", [ steps.socialProfiles ] );
					scrollToStep( 4 );
				} )
				.then( () => {
					return true;
				} )
				.catch(
					( e ) => {
						if ( e.failures ) {
							setErrorFields( e.failures );
						}
						console.error( e );
						return false;
					}
				);
		}

		return updateSocialProfiles( state )
			.then( () => setStepIsSaved( 3 ) )
			.then( () => {
				setErrorFields( [] );
				finishSteps( "configuration", [ steps.socialProfiles ] );
				scrollToStep( 4 );
			} )
			.then( () => {
				return true;
			} )
			.catch(
				( e ) => {
					if ( e.failures ) {
						setErrorFields( e.failures );
					}
					return false;
				}
			);
	}

	/**
	 * Runs checks of finishing the enable tracking step.
	 *
	 * @returns {void}
	 */
	function updateOnFinishEnableTracking() {
		return updateTracking( state )
			.then( () => setStepIsSaved( 4 ) )
			.then( () => finishSteps( "configuration", [ steps.enableTracking ] ) )
			.then( () => {
				scrollToStep( 5 );
				return true;
			} );
	}

	const toggleConfigurationWorkout = useCallback(
		async() => {
			const stepsToFinish = [];

			if ( isWorkoutFinished ) {
				reviseStep( "configuration", steps.siteRepresentation );
				reviseStep( "configuration", steps.socialProfiles );
				reviseStep( "configuration", steps.enableTracking );
				reviseStep( "configuration", steps.newsletterSignup );
				dispatch( { type: "SET_ALL_STEPS_NOT_SAVED" } );
				return;
			}
			if ( ! isStep2Finished ) {
				try {
					await updateSiteRepresentation( state );
					setStepIsSaved( 2 );
					stepsToFinish.push( steps.siteRepresentation );
				} catch ( e ) {
					console.error( e.message );
				}
			}
			if ( ! isStep3Finished ) {
				try {
					await updateSocialProfiles( state );
					setStepIsSaved( 3 );
					setErrorFields( [] );
					stepsToFinish.push( steps.socialProfiles );
				} catch ( e ) {
					if ( e.failures ) {
						setErrorFields( e.failures );
					}
					scrollToStep( 3 );
				}
			}
			if ( ! isStep4Finished ) {
				try {
					await updateTracking( state );
					setStepIsSaved( 4 );
					stepsToFinish.push( steps.enableTracking );
				} catch ( e ) {
					console.error( e.message );
				}
			}
			if ( ! isStep5Finished ) {
				stepsToFinish.push( steps.newsletterSignup );
			}
			finishSteps( "configuration", stepsToFinish );
		},
		[ toggleWorkout, isWorkoutFinished, isStep1Finished, isStep2Finished, isStep3Finished, isStep4Finished, isStep5Finished, state ]
	);

	const onOrganizationOrPersonChange = useCallback(
		( value ) => dispatch( { type: "SET_COMPANY_OR_PERSON", payload: value } ),
		[ dispatch ]
	);

	const onSiteTaglineChange = useCallback(
		( event ) => dispatch( { type: "CHANGE_SITE_TAGLINE", payload: event.target.value } ),
		[ dispatch ]
	);

	const siteRepresentsPerson = state.companyOrPerson === "person";

	// PROBABLY DELETE BETWEEN HERE....
	const isStepperFinished = [
		isStep2Finished,
		isStep3Finished,
		isStep4Finished,
	].every( Boolean );

	const [ isIndexationStepFinished, setIndexationStepFinished ] = useState( isStepFinished( "configuration", steps.siteRepresentation ) );

	/* Duplicate site representation, because in reality, the first step cannot be saved.
	It's considered "finished" once at least the site representation has been done. */
	const savedSteps = [
		isIndexationStepFinished,
		isStepFinished( "configuration", steps.siteRepresentation ),
		isStepFinished( "configuration", steps.socialProfiles ),
		isStepFinished( "configuration", steps.enableTracking ),
		isStepperFinished,
	];

	const [ hideOriginal, setHideOriginal ] = useState( true );
	const [ activeStepIndex, setActiveStepIndex ] = useState( getInitialActiveStepIndex( savedSteps ) );

	const [ stepperFinishedOnce, setStepperFinishedOnce ] = useState( isStepperFinished );
	const [ isStepBeingEdited, setIsStepBeingEdited ] = useState( false );
	const [ showEditButton, setShowEditButton ] = useState( stepperFinishedOnce && ! isStepBeingEdited );

	/**
	 * Save and continue functionality for the Indexation step.
	 *
	 * @returns {boolean} Whether the stepper can continue to the next step.
	 */
	function beforeContinueIndexationStep() {
		if ( ! showRunIndexationAlert && indexingState === "idle" ) {
			setShowRunIndexationAlert( true );
			return false;
		}

		setIndexationStepFinished( true );
		setIsStepBeingEdited( false );
		return true;
	}

	/**
	 * Save and continue functionality for the Indexation step.
	 *
	 * @returns {boolean} Whether the stepper can continue to the next step.
	 */
	function beforeEditing() {
		setShowEditButton( false );
		setIsStepBeingEdited( true );
		return true;
	}

	// The first time isStepperFinished is true, set stepperFinishedOnce to true.
	useEffect( () => {
		if ( isStepperFinished ) {
			setStepperFinishedOnce( true );
		}
	}, [ isStepperFinished ] );

	// If stepperFinishedOnce changes or isStepBeingEdited changes, evaluate edit button state.
	useEffect( () => {
		setShowEditButton( stepperFinishedOnce && ! isStepBeingEdited );
	}, [ stepperFinishedOnce, isStepBeingEdited ] );

	// AND HERE....
	/* eslint-disable max-len */
	return (
		<div id="yoast-configuration-workout" className="card">
			<h2 id="yoast-configuration-workout-title">{ __( "Configuration", "wordpress-seo" ) }</h2>
			<h3 id="yoast-configuration-workout-tagline">{
				// translators: %1$s is replaced by "Yoast SEO"
				sprintf( __( "Configure %1$s with optimal SEO settings for your site", "wordpress-seo" ), "Yoast SEO" )
			}</h3>
			<p>
				{
					sprintf(
						// translators: %1$s is replaced by "Yoast SEO"
						__(
							"Do the five steps in this workout to configure the essential %1$s settings!",
							"wordpress-seo"
						),
						"Yoast SEO"
					)
				}
			</p>
			<p>
				<i>
					{
						addLinkToString(
							sprintf(
								__(
									// translators: %1$s and %3$s are replaced by opening and closing anchor tags. %2$s is replaced by "Yoast SEO"
									"Need more guidance? We've covered every step in more detail in the %1$s%2$s configuration workout guide.%3$s",
									"wordpress-seo"
								),
								"<a>",
								"Yoast SEO",
								"</a>"
							),
							window.wpseoWorkoutsData.configuration.shortlinks.workoutGuide,
							"yoast-configuration-workout-guide-link"
						)
					}
				</i>
			</p>
			<hr id="configuration-workout-hr-top" />
			<p id="configuration-workout-important-message">
				{
					createInterpolateElement(
						sprintf(
							__(
								// translators: %1$s and %2$s are replaced by opening and closing <b> tags.
								"%1$sImportant:%2$s If the SEO data optimization in step 1 is running, you can already continue to the next steps.",
								"wordpress-seo"
							),
							"<b>",
							"</b>"
						),
						{
							b: <b />,
						}
					)
				}
			</p>
			{ /* eslint-disable react/jsx-no-bind */ }
			<div className="yst-mt-8">
				<Stepper
					setActiveStepIndex={ setActiveStepIndex }
					activeStepIndex={ activeStepIndex }
					isStepperFinished={ isStepperFinished }
				>
					<Step>
						<Step.Header
							name="SEO data optimization"
							isFinished={ isIndexationStepFinished }
						>
							<EditButton
								beforeGo={ beforeEditing }
								isVisible={ showEditButton }
								additionalClasses={ "yst-ml-auto" }
							>
								{ __( "Edit", "wordpress-seo" ) }
							</EditButton>
						</Step.Header>
						<Step.Content>
							<IndexationStep setIndexingState={ setIndexingState } indexingState={ indexingState } showRunIndexationAlert={ showRunIndexationAlert }  isStepperFinished={ isStepperFinished } />
							<ContinueButton
								additionalClasses="yst-mt-12"
								beforeGo={ beforeContinueIndexationStep }
								destination={ stepperFinishedOnce ? "last" : 1 }
							>
								{ __( "Continue", "wordpress-seo" ) }
							</ContinueButton>
						</Step.Content>
					</Step>
					<Step>
						<Step.Header
							name="Site representation"
							isFinished={ isStep2Finished }
						>
							<EditButton
								beforeGo={ beforeEditing }
								isVisible={ showEditButton }
								additionalClasses={ "yst-ml-auto" }
							>
								{ __( "Edit", "wordpress-seo" ) }
							</EditButton>
						</Step.Header>
						<Step.Content>
							<SiteRepresentationStep
								onOrganizationOrPersonChange={ onOrganizationOrPersonChange }
								dispatch={ dispatch }
								state={ state }
								siteRepresentationEmpty={ siteRepresentationEmpty }
							/>
							<ConfigurationStepButtons
								stepperFinishedOnce={ stepperFinishedOnce }
								saveFunction={ updateOnFinishSiteRepresentation }
								setEditState={ setIsStepBeingEdited }
							/>
						</Step.Content>
					</Step>
					<Step>
						<Step.Header
							name="Social profiles"
							isFinished={ isStep3Finished }
						>
							<EditButton
								beforeGo={ beforeEditing }
								isVisible={ showEditButton }
								additionalClasses={ "yst-ml-auto" }
							>
								{ __( "Edit", "wordpress-seo" ) }
							</EditButton>
						</Step.Header>
						<Step.Content>
							<SocialProfilesStep state={ state } dispatch={ dispatch } setErrorFields={ setErrorFields } />
							<ConfigurationStepButtons stepperFinishedOnce={ stepperFinishedOnce } saveFunction={ updateOnFinishSocialProfiles } setEditState={ setIsStepBeingEdited } />
						</Step.Content>
					</Step>
					<Step>
						<Step.Header
							name="Personal preferences"
							isFinished={ isStep4Finished }
						>
							<EditButton
								beforeGo={ beforeEditing }
								isVisible={ showEditButton }
								additionalClasses={ "yst-ml-auto" }
							>
								{ __( "Edit", "wordpress-seo" ) }
							</EditButton>
						</Step.Header>
						<Step.Content>
							<PersonalPreferencesStep state={ state } setTracking={ setTracking } isTrackingOptionSelected={ isTrackingOptionSelected } />
							<ConfigurationStepButtons stepperFinishedOnce={ stepperFinishedOnce } saveFunction={ updateOnFinishEnableTracking } setEditState={ setIsStepBeingEdited } />
						</Step.Content>
					</Step>
					<Step>
						<Step.Header
							name="Finish configuration"
							isFinished={ isStepperFinished }
						/>
						<Step.Content>
							<FinishStep />
						</Step.Content>
					</Step>
				</Stepper>
			</div>

			<UnsavedChangesModal
				hasUnsavedChanges={ state.editedSteps.includes( activeStepIndex + 1 ) }
				title={ __( "Unsaved changes", "wordpress-seo" ) }
				description={ __( "There are unsaved changes in this step. Leaving means that those changes will be lost. Are you sure you want to leave this page?", "wordpress-seo" ) }
				okButtonLabel={ __( "Yes, leave page", "wordpress-seo" ) }
				cancelButtonLabel={ __( "No, continue editing", "wordpress-seo" ) }
			/>

			<UnsavedChangesModal
				hasUnsavedChanges={ indexingState === "in_progress" }
				title={ __( "SEO data optimization is still running...", "wordpress-seo" ) }
				description={ __( "The SEO data optimization is still running. Leaving this page means that this processs will be stopped. Are you sure you want to leave this page?", "wordpress-seo" ) }
				okButtonLabel={ __( "Yes, leave page", "wordpress-seo" ) }
				cancelButtonLabel={ __( "No, continue SEO data optimization", "wordpress-seo" ) }
			/>

			<button
				className="yst-button yst-button--danger yst-mt-4"
				onClick={ () => {
					setHideOriginal( prevState => ! prevState  );
				} }
			>
				Toggle original
			</button>
			{ /* eslint-enable react/jsx-no-bind */ }

			<div className={ `workflow ${ hideOriginal ? "yst-hidden" : "" }` }>
				<Steps id="yoast-configuration-workout-steps">
					<OldStep
						id="yoast-configuration-workout-step-optimize-seo-data"
						title={ __( "Optimize SEO data", "wordpress-seo" ) }
						subtitle={ addLinkToString(
							sprintf(
								__(
									"Click the button below to optimize your SEO data. It will let us see your site as Google does, so we can give " +
									"you the best SEO tips and improve technical SEO issues in the background! If you have a lot of content the " +
									"optimization might take a while. But trust us, it's worth it! %1$sLearn more about the benefits of optimized SEO data.%2$s",
									"wordpress-seo"
								),
								"<a>",
								"</a>"
							),
							window.wpseoWorkoutsData.configuration.shortlinks.indexData,
							"yoast-configuration-workout-index-data-link"
						) }
						subtitleClass={ window.wpseoWorkoutsData.shouldUpdatePremium ? "disabled" : "" }
						ImageComponent={ WorkoutStartImage }
						isFinished={ isStep1Finished }
					>
						<div id="yoast-configuration-workout-indexing-container" className="indexation-container">
							<ConfigurationIndexation
								indexingStateCallback={ setIndexingState }
								isEnabled={ ! window.wpseoWorkoutsData.shouldUpdatePremium }
								indexingState={ indexingState }
							/>
						</div>
						{ ( window.wpseoWorkoutsData.shouldUpdatePremium && ! isIndexationDone( indexingState ) ) && <Alert type="warning">
							<p>{
								// translators: %1$s is replaced by a version number.
								sprintf( __( "This workout step is currently disabled, because you're not running the latest version of Yoast SEO Premium. " +
								"Please update to the latest version (at least %1$s). ",
								"wordpress-seo"
								), "17.7"
								)
							}</p>
							<p>{
								addLinkToString(
									sprintf(
										// translators: %1$s and %2$s are replaced by anchor tags to make a link to the tool section.
										__( "You can still run the SEO data optimization in the %1$sTools section%2$s. " +
										"Once that is finished, please refresh this workout.", "wordpress-seo" ),
										"<a>",
										"</a>"
									),
									window.wpseoWorkoutsData.toolsPageUrl
								) }
							</p>
						</Alert> }
						<FinishButtonSection
							buttonId="yoast-configuration-workout-step-optimize-seo-data-button"
							stepNumber={ 1 }
							hasDownArrow={ true }
							finishText={ __( "Continue", "wordpress-seo" ) }
							onFinishClick={	onFinishOptimizeSeoData }
							isFinished={ isStep1Finished }
							isReady={ isStepReady( 1 ) }
						/>
					</OldStep>
					<p className="extra-list-content">
						{
							createInterpolateElement(
								sprintf(
									__(
										// translators: %1$s and %2$s are replaced by opening and closing <b> tags.
										"%1$sImportant:%2$s After you’ve completed (or made any changes to) a step below, please make sure to save your changes by clicking the ‘Save and continue’ button below that step.",
										"wordpress-seo"
									),
									"<b>",
									"</b>"
								),
								{
									b: <b />,
								}
							)
						}
					</p>
					<OldStep
						id="yoast-configuration-workout-step-site-representation"
						title={ __( "Site representation", "wordpress-seo" ) }
						subtitle={ __( "Tell Google what kind of site you have and increase the chance it gets features in a Google Knowledge Panel. Select ‘Organization’ if you are working on a site for a business or an organization. Select ‘Person’ if you have, say, a personal blog.", "wordpress-seo" ) }
						isFinished={ isStep2Finished }
					>
						{  window.wpseoWorkoutsData.configuration.knowledgeGraphMessage &&  <Alert type="warning">
							{  window.wpseoWorkoutsData.configuration.knowledgeGraphMessage }
						</Alert> }
						{
							window.wpseoWorkoutsData.configuration.shouldForceCompany === 0 && <SingleSelect
								id="organization-person-select"
								htmlFor="organization-person-select"
								name="organization"
								label={ __( "Does your site represent an Organization or Person?", "wordpress-seo" ) }
								selected={ state.companyOrPerson }
								onChange={ onOrganizationOrPersonChange }
								options={  window.wpseoWorkoutsData.configuration.companyOrPersonOptions }
							/>
						}
						{
							window.wpseoWorkoutsData.configuration.shouldForceCompany === 1 && <TextInput
								id="organization-forced-readonly-text"
								name="organization"
								label={ __( "Does your site represent an Organization or Person?", "wordpress-seo" ) }
								value={ state.companyOrPersonLabel }
								readOnly={ true }
							/>
						}
						{ state.companyOrPerson === "company" && <Fragment>
							{ ( ! state.companyName || ! state.companyLogo ) && <Alert type="warning">
								{ __(
									// eslint-disable-next-line max-len
									"You need to set an organization name and logo for structured data to work properly.",
									"wordpress-seo"
								) }
							</Alert> }
							<div>organization section was here</div>
						</Fragment> }
						{ siteRepresentsPerson && <Fragment>
							{ ( ! state.personLogo || state.personId === 0 ) && <Alert type="warning">
								{ __(
									// eslint-disable-next-line max-len
									"You need to set a person name and logo for structured data to work properly.",
									"wordpress-seo"
								) }
							</Alert> }
							<div>person section was here</div>
						</Fragment> }
						{ window.wpseoWorkoutsData.canEditWordPressOptions && <TextInput
							id="site-tagline-input"
							name="site-tagline"
							label={ __( "Site tagline", "wordpress-seo" ) }
							description={ sprintf( __( "Add a catchy tagline that describes your site in the best light. Use the keywords you want people to find your site with. Example: %1$s’s tagline is ‘SEO for everyone.’", "wordpress-seo" ), "Yoast" ) }
							value={ state.siteTagline }
							onChange={ onSiteTaglineChange }
						/> }
						{ siteRepresentationEmpty && <Alert type="warning">
							{ __(
								// eslint-disable-next-line max-len
								"Please be aware that you need to set a name and logo in step 2 for structured data to work properly.",
								"wordpress-seo"
							) }
						</Alert> }
						<FinishButtonSection
							buttonId="yoast-configuration-workout-step-site-representation-button"
							stepNumber={ 2 }
							isSaved={ state.savedSteps.includes( 2 ) }
							hasDownArrow={ true }
							finishText={ __( "Save and continue", "wordpress-seo" ) }
							onFinishClick={ updateOnFinishSiteRepresentation }
							isFinished={ isStep2Finished }
							isReady={ isStepReady( 2 ) }
						/>
					</OldStep>
					<OldStep
						id="yoast-configuration-workout-step-social-profiles"
						title={ __( "Social profiles", "wordpress-seo" ) }
						subtitle={ state.companyOrPerson === "company" ?  __( "Do you have profiles for your site on social media? Then, add all of their URLs here, so your social profiles may also appear in a Google Knowledge Panel.", "wordpress-seo" ) : "" }
						isFinished={ isStep3Finished }
					>
						{ state.companyOrPerson === "company" && <SocialInputSection
							socialProfiles={ state.socialProfiles }
							dispatch={ dispatch }
							errorFields={ state.errorFields }
							setErrorFields={ setErrorFields }
						/> }
						{ siteRepresentsPerson && <SocialInputPersonSection personId={ state.personId } /> }
						<FinishButtonSection
							buttonId="yoast-configuration-workout-step-social-profiles-button"
							stepNumber={ 3 }
							isSaved={ ! siteRepresentsPerson && state.savedSteps.includes( 3 ) }
							hasDownArrow={ true }
							finishText={ siteRepresentsPerson ? __( "Continue", "wordpress-seo" ) :  __( "Save and continue", "wordpress-seo" ) }
							onFinishClick={ updateOnFinishSocialProfiles }
							isFinished={ isStep3Finished }
							isReady={ isStepReady( 3 ) }
						/>
					</OldStep>
					<OldStep
						id="yoast-configuration-workout-step-tracking"
						title={ __( "Help us improve Yoast SEO", "wordpress-seo" ) }
						isFinished={ isStep4Finished }
					>
						<p>
							{
								__( "To provide the best experience for you, we need your permission to do the following things:", "wordpress-seo" )
							}
						</p>
						<ul className="yoast-tracking">
							<li> { __( "collect info about the plugins and themes you have installed;", "wordpress-seo" ) } </li>
							<li> {
								sprintf(
									// translators: translates to Yoast SEO.
									__( "see which %s features you use or don't use;", "wordpress-seo" ),
									"Yoast SEO"
								)
							} </li>
							<li> { __( "always load our customer support window so we can immediately assist you when you need help.", "wordpress-seo" ) } </li>
						</ul>
						<RadioButtonGroup
							id="yoast-configuration-workout-tracking-radio-button"
							label={ __( "Can we collect anonymous information about your website and how you use it?", "wordpress-seo" ) }
							groupName="yoast-configuration-workout-tracking"
							selected={ state.tracking }
							onChange={ setTracking }
							vertical={ true }
							wrapperClassName={ "tracking-radiobuttons" }
							options={ [
								{
									value: 0,
									label: __( "No, don’t track my site data", "wordpress-seo" ),
								},
								{
									value: 1,
									label: __( "Yes, you can track my site data", "wordpress-seo" ),
								},
							] }
						/>
						<p>
							<i>{
								__( "Important: We will never sell this data. And of course, as always, we won't collect any personal data about you or your visitors!", "wordpress-seo" )
							}</i>
						</p>
						{ ! isTrackingOptionSelected && <Alert type="warning">
							{ __(
								// eslint-disable-next-line max-len
								"In order to complete this step please select if we are allowed to improve Yoast SEO with your data.",
								"wordpress-seo"
							) }
						</Alert> }
						<FinishButtonSection
							buttonId="yoast-configuration-workout-step-tracking-button"
							stepNumber={ 4 }
							isSaved={ state.savedSteps.includes( 4 ) }
							hasDownArrow={ true }
							finishText={ __( "Save and continue", "wordpress-seo" ) }
							onFinishClick={ updateOnFinishEnableTracking }
							isFinished={ isStep4Finished }
							additionalButtonProps={ { disabled: ! isTrackingOptionSelected } }
							isReady={ isStepReady( 4 ) }
						/>
					</OldStep>
					<OldStep
						id="yoast-configuration-workout-step-newsletter"
						title={ __( "Sign up for the Yoast newsletter!", "wordpress-seo" ) }
						isFinished={ isStep5Finished }
					>
						<br />
						<NewsletterSignup gdprLink={ window.wpseoWorkoutsData.configuration.shortlinks.gdpr } />
					</OldStep>
					<FinishButtonSection
						buttonId="yoast-configuration-workout-finish-workout-button"
						finishText={ isWorkoutFinished ? __( "Do workout again", "wordpress-seo" ) : __( "Finish this workout", "wordpress-seo" ) }
						onFinishClick={ toggleConfigurationWorkout }
						isFinished={ false }
						isReady={ isWorkoutFinished ? false : isStepReady( 5 ) }
						additionalButtonProps={ { disabled: ! isIndexationDone( indexingState ) || ! isTrackingOptionSelected } }
					>
						{ indexingState !== "completed" && <Alert type="warning">
							{ indexingState === "idle" && __( "Before you finish this workout, please start the SEO data optimization in step 1 and wait until it is completed...", "wordpress-seo" ) }
							{ indexingState === "in_progress" && __( "Before you finish this workout, please wait on this page until the SEO data optimization in step 1 is completed...", "wordpress-seo" ) }
						</Alert> }
					</FinishButtonSection>
				</Steps>
			</div>
			{ isWorkoutFinished && <div className={ hideOriginal ? "yst-hidden" : "" } id="yoast-configuration-workout-congratulations">
				<hr />
				<h3 id="yoast-configuration-workout-congratulations-title" style={ { marginBottom: 0 } }>{ __( "Congratulations!", "wordpress-seo" ) }</h3>
				<div id="yoast-configuration-workout-congratulations-content" style={ { display: "flex" } }>
					<div>
						<p>
							{
								// translators: %1$s is replaced by "Yoast SEO"
								sprintf( __( "Amazing! You’ve successfully finished the Configuration workout! %1$s now outputs the essential structured data for your site.", "wordpress-seo" ), "Yoast SEO" )
							}
						</p>
						<p>{ __( "Make sure to also check out our other SEO workouts to really get your site into shape!", "wordpress-seo" ) }</p>
					</div>
					<WorkoutDoneImage style={ { height: "119px", width: "100px", flexShrink: 0 } } />
				</div>
				<Button id="yoast-configuration-workout-congratulations-button" onClick={ clearActiveWorkout } variant="primary">
					{
						// translators: %1$s translates to a rightward pointing arrow ( → )
						sprintf( __( "View other SEO workouts%1$s", "wordpress-seo" ), " →" )
					}
				</Button>
			</div> }
		</div>
		/* eslint-enable max-len */
	);
}

ConfigurationWorkout.propTypes = {
	finishSteps: PropTypes.func.isRequired,
	reviseStep: PropTypes.func.isRequired,
	toggleWorkout: PropTypes.func.isRequired,
	isStepFinished: PropTypes.func.isRequired,
	clearActiveWorkout: PropTypes.func.isRequired,
};
/* eslint-enable complexity */

export default compose(
	[
		withSelect( ( select ) => {
			const workouts = select( "yoast-seo/workouts" ).getWorkouts();
			const finishedWorkouts = select( "yoast-seo/workouts" ).getFinishedWorkouts();
			/**
			 * Determines if a step for a particular workout is finished.
			 * @param {string} workout The name of the workout.
			 * @param {string} step The name of the step.
			 * @returns {boolean} Whether or not the step is finished.
			 */
			const isStepFinished = ( workout, step ) => {
				return workouts[ workout ].finishedSteps.includes( step );
			};
			const isWorkoutFinished = finishedWorkouts.includes( WORKOUTS.cornerstone );
			const getIndexablesByStep = select( "yoast-seo/workouts" ).getIndexablesByStep;
			return { finishedWorkouts, isStepFinished, isWorkoutFinished, getIndexablesByStep };
		} ),
		withDispatch(
			( dispatch ) => {
				const {
					toggleStep,
					finishSteps,
					reviseStep,
					toggleWorkout,
					moveIndexables,
					clearActiveWorkout,
				} = dispatch( "yoast-seo/workouts" );

				return {
					toggleStep,
					finishSteps,
					reviseStep,
					toggleWorkout,
					moveIndexables,
					clearActiveWorkout,
				};
			}
		),
	]
)( ConfigurationWorkout );
/* eslint-enable max-statements */
