import { __ } from "@wordpress/i18n";
import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";

import SocialFieldArray from "./social-field-array";
import SocialInput from "./social-input";

/* eslint-disable complexity */
/**
 * A wrapper that combines all the SocialInputs. Intended for use in the configuration workout.
 *
 * @param {Object} props The props object.
 * @param {function} dispatch                     A dispatch function to communicate with the Stepper store.
 * @param {Object}   state                        The Stepper store.
 * @returns {WPElement} The SocialInputSection.
 */
export default function SocialInputSection( { socialProfiles, errorFields, dispatch, isDisabled } ) {
	const onChangeHandler = useCallback(
		( newValue, socialMedium ) => {
			dispatch( { type: "CHANGE_SOCIAL_PROFILE", payload: { socialMedium, value: newValue } } );
		},
		[]
	);
	const onChangeOthersHandler = useCallback(
		( newValue, index ) => {
			dispatch( { type: "CHANGE_OTHERS_SOCIAL_PROFILE", payload: { index, value: newValue } } );
		},
		[]
	);
	const onAddProfileHandler = useCallback(
		() => {
			dispatch( { type: "ADD_OTHERS_SOCIAL_PROFILE", payload: { value: "" } } );
		},
		[]
	);

	const onRemoveProfileHandler = useCallback(
		( idx ) => {
			dispatch( { type: "REMOVE_OTHERS_SOCIAL_PROFILE", payload: { index: idx } } );
		},
		[]
	);

	return (
		<div id="social-input-section" className="yoast-social-profiles-input-fields">
			<SocialInput
				className="yst-mt-4"
				label={ __( "Facebook", "wordpress-seo" ) }
				id="social-input-facebook-url"
				value={ socialProfiles.facebookUrl }
				socialMedium="facebookUrl"
				onChange={ onChangeHandler }
				isDisabled={ isDisabled }
				error={ {
					message: [ __( "Could not save this value. Please check the URL.", "wordpress-seo" ) ],
					isVisible: errorFields.includes( "facebook_site" ),
				} }
			/>
			<SocialInput
				className="yst-mt-4"
				label={ __( "Twitter", "wordpress-seo" ) }
				id="social-input-twitter-url"
				value={ socialProfiles.twitterUsername }
				socialMedium="twitterUsername"
				onChange={ onChangeHandler }
				isDisabled={ isDisabled }
				error={ {
					message: [ __( "Could not save this value. Please check the URL or username.", "wordpress-seo" ) ],
					isVisible: errorFields.includes( "twitter_site" ),
				} }
			/>

			<SocialFieldArray
				fieldType={ SocialInput }
				items={ socialProfiles.otherSocialUrls }
				onAddProfile={ onAddProfileHandler }
				onRemoveProfile={ onRemoveProfileHandler }
				onChangeProfile={ onChangeOthersHandler }
				errorFields={ errorFields }
			/>
		</div>
	);
}
/* eslint-enable complexity */

SocialInputSection.propTypes = {
	socialProfiles: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	errorFields: PropTypes.array,
	isDisabled: PropTypes.bool,
};

SocialInputSection.defaultProps = {
	errorFields: [],
	isDisabled: false,
};
