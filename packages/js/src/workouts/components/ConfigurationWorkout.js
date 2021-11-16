/* global yoastIndexingData */
import apiFetch from "@wordpress/api-fetch";
import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { createInterpolateElement, useCallback, useReducer, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { cloneDeep } from "lodash";

import { Alert, RadioButtonGroup, SingleSelect, TextInput } from "@yoast/components";
import { ReactComponent as WorkoutImage } from "../../../images/motivated_bubble_woman_1_optim.svg";
import { addLinkToString } from "../../helpers/stringHelpers.js";
import { Step, Steps, FinishStepSection } from "./Steps";
import Indexation from "../../components/Indexation";
import { STEPS, WORKOUTS } from "../config";
import { OrganizationSection } from "./OrganizationSection";
import { PersonSection } from "./PersonSection";
import { SocialInput } from "./SocialInput";
import PropTypes from "prop-types";
import { NewsletterSignup } from "./NewsletterSignup";

window.wpseoScriptData = window.wpseoScriptData || {};
window.wpseoScriptData.searchAppearance = {
	...window.wpseoScriptData.searchAppearance,
	userEditUrl: "/wp-admin/user-edit.php?user_id={user_id}",
};

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
	const newState = cloneDeep( state );
	switch ( action.type ) {
		case "SET_COMPANY_OR_PERSON":
			newState.companyOrPerson = action.payload;
			return newState;
		case "CHANGE_COMPANY_NAME":
			newState.companyName = action.payload;
			return newState;
		case "SET_COMPANY_LOGO":
			newState.companyLogo = action.payload.url;
			newState.companyLogoId = action.payload.id;
			return newState;
		case "REMOVE_COMPANY_LOGO":
			newState.companyLogo = "";
			newState.companyLogoId = "";
			return newState;
		case "SET_PERSON_LOGO":
			newState.personLogo = action.payload.url;
			newState.personLogoId = action.payload.id;
			return newState;
		case "REMOVE_PERSON_LOGO":
			newState.personLogo = "";
			newState.personLogoId = "";
			return newState;
		case "SET_PERSON_ID":
			newState.personId = action.payload;
			return newState;
		case "CHANGE_SOCIAL_PROFILE":
			newState.socialProfiles[ action.payload.socialMedium ] = action.payload.value;
			return newState;
		case "CHANGE_SITE_TAGLINE":
			newState.siteTagline = action.payload;
			return newState;
		case "SET_TRACKING":
			newState.tracking = action.payload;
			return newState;
		default:
			return newState;
	}
}

/**
 * The configuration workout.
 *
 * @param {function}  toggleStep                The function to toggle the step state.
 * @param {function}  toggleWorkout             The function to toggle the workout state.
 * @param {function}  isStepFinished            The function to check whether a step is finished.
 * @param {string}    seoDataOptimizationNeeded The flag signaling if SEO optimization is needed.
 * @returns {WPElement} The ConfigurationWorkout component.
 */
export function ConfigurationWorkout( { toggleStep, toggleWorkout, isStepFinished } ) {
	const [ state, dispatch ] = useReducer( configurationWorkoutReducer, window.wpseoWorkoutsData.configuration );
	const [ indexingState, setIndexingState ] = useState( () => window.yoastIndexingData.amount === "0" ? "completed" : "idle" );
	const [ siteRepresentationEmpty, setSiteRepresentationEmpty ] = useState( false );

	const setTracking = useCallback( ( value ) => {
		dispatch( { type: "SET_TRACKING", payload: parseInt( value, 10 ) } );
	} );

	const steps = STEPS.configuration;

	const updateSiteRepresentation = async function() {
		const siteRepresentation = {
			company_or_person: state.companyOrPerson,
			company_name: state.companyName,
			company_logo: state.companyLogo,
			company_logo_id: state.companyLogoId ? state.companyLogoId : 0,
			person_logo: state.personLogo,
			person_logo_id: state.personLogoId ? state.personLogoId : 0,
			company_or_person_user_id: state.personId,
			description: state.siteTagline,
		};

		try {
			const response = await apiFetch( {
				path: "yoast/v1/workouts/site_representation",
				method: "POST",
				data: siteRepresentation,
			} );
			return await response.json;
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
			return false;
		}
	};

	const updateSocialProfiles = async function() {
		const socialProfiles = {
			facebook_site: state.socialProfiles.facebookUrl,
			twitter_site: state.socialProfiles.twitterUsername,
			instagram_url: state.socialProfiles.instagramUrl,
			linkedin_url: state.socialProfiles.linkedinUrl,
			myspace_url: state.socialProfiles.myspaceUrl,
			pinterest_url: state.socialProfiles.pinterestUrl,
			youtube_url: state.socialProfiles.youtubeUrl,
			wikipedia_url: state.socialProfiles.wikipediaUrl,
		};

		try {
			const response = await apiFetch( {
				path: "yoast/v1/workouts/social_profiles",
				method: "POST",
				data: socialProfiles,
			} );
			return await response.json;
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
			return false;
		}
	};

	const updateTracking = async function() {
		const tracking = {
			tracking: state.tracking,
		};

		try {
			const response = await apiFetch( {
				path: "yoast/v1/workouts/enable_tracking",
				method: "POST",
				data: tracking,
			} );
			return await response.json;
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
			return false;
		}
	};

	const onFinishOptimizeSeoData = useCallback(
		toggleStep.bind( null, "configuration", steps.optimizeSeoData ),
		[ toggleStep, steps.optimizeSeoData ]
	);
	const toggleStepSiteRepresentation = useCallback(
		toggleStep.bind( null, "configuration", steps.siteRepresentation ),
		[ toggleStep, steps.siteRepresentation ]
	);

	function updateOnFinishSiteRepresentation() {
		if ( isStepFinished( "configuration", steps.siteRepresentation ) ) {
			toggleStepSiteRepresentation();
		} else {
			if ( ! siteRepresentationEmpty &&
				state.companyOrPerson === "company" &&
				( ! state.companyName || ! state.companyLogo ) ) {
				setSiteRepresentationEmpty( true );
			} else if (  ! siteRepresentationEmpty &&
				state.companyOrPerson === "person" &&
				( ! state.personId || ! state.personLogo ) ) {
				setSiteRepresentationEmpty( true );
			} else {
				setSiteRepresentationEmpty( false );
				updateSiteRepresentation().then( toggleStepSiteRepresentation );
			}
		}
	}

	const toggleStepSocialProfiles = useCallback(
		toggleStep.bind( null, "configuration", steps.socialProfiles ),
		[ toggleStep, steps.socialProfiles ]
	);

	function updateOnFinishSocialProfiles() {
		if ( isStepFinished( "configuration", steps.socialProfiles ) ) {
			toggleStepSocialProfiles();
		} else {
			updateSocialProfiles().then( toggleStepSocialProfiles );
		}
	}

	const toggleStepEnableTracking = useCallback(
		toggleStep.bind( null, "configuration", steps.enableTracking ),
		[ toggleStep, steps.enableTracking ]
	);

	function updateOnFinishEnableTracking() {
		if ( isStepFinished( "configuration", steps.enableTracking ) ) {
			toggleStepEnableTracking();
		} else {
			updateTracking().then( toggleStepEnableTracking );
		}
	}

	const toggleConfigurationWorkout = useCallback(
		toggleWorkout.bind( null, "configuration" ),
		[ toggleWorkout ]
	);

	const onOrganizationOrPersonChange = useCallback(
		( value ) => dispatch( { type: "SET_COMPANY_OR_PERSON", payload: value } ),
		[ dispatch ]
	);

	const onSiteTaglineChange = useCallback(
		( value ) => dispatch( { type: "CHANGE_SITE_TAGLINE", payload: value } ),
		[ dispatch ]
	);

	/* eslint-disable max-len */
	return (
		<div className="card">
			<h2>{ __( "Configuration", "wordpress-seo" ) }</h2>
			<h3>{ __( "Configure Yoast SEO with optimal SEO settings for your site", "wordpress-seo" ) }</h3>
			<p>
				{
					__(
						"This workout will guide you through the most important steps you need to take to configure the Yoast SEO plugin on your site.",
						"wordpress-seo"
					)
				}
			</p>
			<p>
				<i>
					{
						addLinkToString(
							sprintf(
								__(
									// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
									"Need more guidance? We've covered every step in more detail in the %1$sYoast SEO configuration workout guide.%2$s",
									"wordpress-seo"
								),
								"<a>",
								"</a>"
							),
							"https://yoa.st/config-workout-guide"
						)
					}
				</i>
			</p>
			<hr />
			<p>
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
			<br />
			<Steps>
				<Step
					title={ __( "Optimize SEO data", "wordpress-seo" ) }
					subtitle={ addLinkToString(
						sprintf(
							__(
								"Speed up your site and get internal linking insights by clicking the button below! It will let us optimize how your SEO data is stored. Do you have a lot of content? " +
								"Then the optimization might take a while. But trust us, it's worth it. %1$sLearn more about the benefits of optimized SEO data.%2$s",
								"wordpress-seo"
							),
							"<a>",
							"</a>"
						),
						"https://yoa.st/config-workout-index-data"
					) }
					ImageComponent={ WorkoutImage }
					isFinished={ isStepFinished( "configuration", steps.optimizeSeoData ) }
				>
					<div className="indexation-container">
						<Indexation
							indexingStateCallback={ setIndexingState }
						/>
						<FinishStepSection
							hasDownArrow={ true }
							finishText={ __( "Continue", "wordpress-seo" ) }
							onFinishClick={ onFinishOptimizeSeoData }
							isFinished={ isStepFinished( "configuration", steps.optimizeSeoData ) }
						/>
					</div>
				</Step>
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
				<Step
					title={ __( "Site representation", "wordpress-seo" ) }
					subtitle={ __( "Tell Google what kind of site you have. Select ‘Organization’ if you are working on a site for a business or an organization. Select ‘Person’ if you have, say, a personal blog.", "wordpress-seo" ) }
					isFinished={ isStepFinished( "configuration", steps.siteRepresentation ) }
				>
					<SingleSelect
						id="organization-person-select"
						htmlFor="organization-person-select"
						name="organization"
						label={ __( "Does you site represent an Organization or Person?", "wordpress-seo" ) }
						selected={ state.companyOrPerson }
						onChange={ onOrganizationOrPersonChange }
						options={ [ {
							name: "Organization",
							value: "company",
						},
						{
							name: "Person",
							value: "person",
						} ] }
						readOnly={ isStepFinished( "configuration", steps.siteRepresentation ) }

					/>
					{ state.companyOrPerson === "company" && <>
						{ ( ! state.companyName || ! state.companyLogo ) && <Alert type="warning">
							{ __(
								// eslint-disable-next-line max-len
								"You need to set an organization name and logo for structured data to work properly.",
								"wordpress-seo"
							) }
						</Alert> }
						<OrganizationSection
							dispatch={ dispatch }
							imageUrl={ state.companyLogo }
							organizationName={ state.companyName }
							isDisabled={ isStepFinished( "configuration", steps.siteRepresentation ) }
						/>
					</> }
					{ state.companyOrPerson === "person" && <>
						{ ( ! state.personLogo || state.personId === 0 ) && <Alert type="warning">
							{ __(
								// eslint-disable-next-line max-len
								"You need to set a person name and logo for structured data to work properly.",
								"wordpress-seo"
							) }
						</Alert> }
						<PersonSection
							dispatch={ dispatch }
							imageUrl={ state.personLogo }
							personId={ state.personId }
							isDisabled={ isStepFinished( "configuration", steps.siteRepresentation ) }
						/>
					</> }
					<TextInput
						id="site-tagline-input"
						name="site-tagline"
						label={ __( "Site tagline", "wordpress-seo" ) }
						// translators: %1$s expands to Yoast
						description={ sprintf( __( "Add a catchy tagline that describes your site in the best light. Use the keywords you want people to find your site with. Example: %1$s’s tagline is ‘SEO for everyone.’", "wordpress-seo" ), "Yoast" ) }
						value={ state.siteTagline }
						onChange={ onSiteTaglineChange }
						readOnly={ isStepFinished( "configuration", steps.siteRepresentation ) }
					/>
					{ siteRepresentationEmpty && <Alert type="warning">
						{ __(
							// eslint-disable-next-line max-len
							"Please be aware that you need to set a name and logo in step 2 for structured data to work properly.",
							"wordpress-seo"
						) }
					</Alert> }
					<FinishStepSection
						hasDownArrow={ true }
						finishText={ __( "Continue and save", "wordpress-seo" ) }
						onFinishClick={ updateOnFinishSiteRepresentation }
						isFinished={ isStepFinished( "configuration", steps.siteRepresentation ) }
					/>
				</Step>
				<Step
					title={ __( "Social profiles", "wordpress-seo" ) }
					subtitle={ state.companyOrPerson === "company" ?  __( "Do you have profiles for your site on social media? Then, add all of their URLs here.", "wordpress-seo" ) : '' }
					isFinished={ isStepFinished( "configuration", steps.socialProfiles ) }
				>
					{ state.companyOrPerson === "company" && <div className="yoast-social-profiles-input-fields">
						<SocialInput
							label={ __( "Facebook URL", "wordpress-seo" ) }
							value={ state.socialProfiles.facebookUrl }
							socialMedium="facebookUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "Twitter URL", "wordpress-seo" ) }
							value={ state.socialProfiles.twitterUsername }
							socialMedium="twitterUsername"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "Instagram URL", "wordpress-seo" ) }
							value={ state.socialProfiles.instagramUrl }
							socialMedium="instagramUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "LinkedIn URL", "wordpress-seo" ) }
							value={ state.socialProfiles.linkedinUrl }
							socialMedium="linkedinUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "MySpace URL", "wordpress-seo" ) }
							value={ state.socialProfiles.myspaceUrl }
							socialMedium="myspaceUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "Pinterest URL", "wordpress-seo" ) }
							value={ state.socialProfiles.pinterestUrl }
							socialMedium="pinterestUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "YouTube URL", "wordpress-seo" ) }
							value={ state.socialProfiles.youtubeUrl }
							socialMedium="youtubeUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
						<SocialInput
							label={ __( "Wikipedia URL", "wordpress-seo" ) }
							value={ state.socialProfiles.wikipediaUrl }
							socialMedium="wikipediaUrl"
							dispatch={ dispatch }
							isDisabled={ isStepFinished( "configuration", steps.socialProfiles ) }
						/>
					</div> }
					{ state.companyOrPerson === "person" && <div>
						<p>
							{
								createInterpolateElement(
									sprintf(
										__(
											// translators: %1$s and %2$s are replaced by opening and closing <b> tags, %3$s and %4$s are replaced by opening and closing anchor tags
											"%1$sNote%2$s: In this step, you need to add the personal social profiles of the person your site represents. To do that, you should go to the %3$sUsers%4$s > Profile page in a new browser tab.",
											"wordpress-seo"
										),
										"<b>",
										"</b>",
										"<a>",
										"</a>"
									),
									{
										b: <b />,
										// eslint-disable-next-line jsx-a11y/anchor-has-content
										a: <a href={ window.wpseoWorkoutsData.usersPageUrl } target="_blank" rel="noopener noreferrer" />,
									}
								)
							}
						</p>
						<p>
							{
								addLinkToString(
									sprintf(
										__(
											// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
											"On the %1$sUsers%2$s page, hover your mouse over the username you want to edit. Click ‘Edit’ to access the user’s profile. Then, scroll down to the ‘Contact info’ section and fill in the URLs of the personal social profiles you want to add.",
											"wordpress-seo"
										),
										"<a>",
										"</a>"
									),
									window.wpseoWorkoutsData.usersPageUrl
								)
							}
						</p>
						<p>
							<b>{ __( "Screenshot:", "wordpress-seo" ) }</b>
							<img
								src={ window.wpseoWorkoutsData.pluginUrl + "/images/profile-social-fields.png" }
								alt={ __( "A screenshot of the Contact Info section of a user's Profile page", "wordpress-seo" ) }
							/>
						</p>
					</div>
					}
					<FinishStepSection
						hasDownArrow={ true }
						finishText={ "Save and continue" }
						onFinishClick={ updateOnFinishSocialProfiles }
						isFinished={ isStepFinished( "configuration", steps.socialProfiles ) }
					/>
				</Step>
				<Step
					title={ __( "Help us improve Yoast SEO", "wordpress-seo" ) }
					isFinished={ isStepFinished( "configuration", steps.enableTracking ) }
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
						label={ __( "Can we collect anonymous information about your website and how you use it?", "wordpress-seo" ) }
						groupName="yoast-configuration-workout-tracking"
						selected={ state.tracking }
						onChange={ setTracking }
						vertical={ true }
						options={ [
							{
								value: 0,
								label: __( "No, I don’t want to allow you to track my site data", "wordpress-seo" ),
							},
							{
								value: 1,
								label: __( "Yes, you can track my site data", "wordpress-seo" ),
							},
						] }
					/>
					<i> {
						__( "Important: We will never sell this data. And of course, as always, we won't collect any personal data about you or your visitors!", "wordpress-seo" )
					} </i>
					<FinishStepSection
						hasDownArrow={ true }
						finishText={ "Save and continue" }
						onFinishClick={ updateOnFinishEnableTracking }
						isFinished={ isStepFinished( "configuration", steps.enableTracking ) }
					/>
				</Step>
				<Step
					title={ __( "Sign up for the Yoast newsletter!", "wordpress-seo" ) }
					isFinished={ isStepFinished( "configuration", steps.newsletterSignup ) }
				>
					<NewsletterSignup />
					<FinishStepSection
						finishText={ "Finish this workout" }
						onFinishClick={ toggleConfigurationWorkout }
						isFinished={ isStepFinished( "configuration", steps.newsletterSignup ) }
					>
						{ indexingState !== "completed" && <Alert type="warning">
							{ __( "Before you finish this workout, please wait on this page until the SEO data optimization in step 1 is completed...", "wordpress-seo" ) }
						</Alert> }
					</FinishStepSection>
				</Step>
			</Steps>
		</div>
		/* eslint-enable max-len */
	);
}

ConfigurationWorkout.propTypes = {
	toggleStep: PropTypes.func.isRequired,
	toggleWorkout: PropTypes.func.isRequired,
	isStepFinished: PropTypes.func.isRequired,
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
					toggleWorkout,
					moveIndexables,
				} = dispatch( "yoast-seo/workouts" );

				return {
					toggleStep,
					toggleWorkout,
					moveIndexables,
				};
			}
		),
	]
)( ConfigurationWorkout );
