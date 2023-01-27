import { Fragment } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import PropTypes from "prop-types";
import { createInterpolateElement } from "@wordpress/element";
import SocialInputSection from "./social-input-section";
import Alert from "../../base/alert";

/* eslint-disable max-len, react/prop-types */
/**
 * Social profiles step component
 *
 * @param {Object}   props                The props object.
 * @param {Object}   props.state          The container's state.
 * @param {function} props.dispatch       The function to update the container's state.
 * @param {function} props.setErrorFields The function to keep track of which text fields are not valid.
 *
 * @returns {WPElement} The social profiles step.
 */
export default function SocialProfilesStep( { state, dispatch, setErrorFields } ) {
	const editUserUrl = "user-edit.php";
	if ( [ "company", "emptyChoice" ].includes( state.companyOrPerson ) ) {
		return <Fragment>
			<p>{
				__(
					"We need a little more help from you! Add your organization's Facebook and Twitter profile so we can optimize the metadata for those platforms too.",
					"wordpress-seo"
				)
			}</p>
			<SocialInputSection
				socialProfiles={ state.socialProfiles }
				dispatch={ dispatch }
				errorFields={ state.errorFields }
				setErrorFields={ setErrorFields }
			/>
		</Fragment>;
	}

	return <Fragment>
		<p>{ state.personId === 0
			? __(
				"If you select a Person to represent this site, we will use the social profiles from the selected user's profile page.",
				"wordpress-seo"
			)
			: 	createInterpolateElement(
				sprintf(
					// translators: %1$s is replaced by the selected person's username. %2$s and %3$s is replaced by a link to the selected person's profile page.
					__(
						"You have selected the user %1$s as the person this site represents. You can %2$supdate or add your social profiles to this user profile%3$s.",
						"wordpress-seo"
					),
					`<b>${state.personName}</b>`,
					"<a>",
					"</a>"

				),
				{
					// eslint-disable-next-line jsx-a11y/anchor-has-content
					a: <a
						href={ `${ editUserUrl }?user_id=${ state.personId }` }
						target="_blank" rel="noopener noreferrer"
					/>,
					b: <b />,
				}
			)
		}</p>

		{
			// No person has been selected in step 2
			state.personId === 0 && <Alert type="info" className="yst-mt-5">
				{
					// translators: please note that "Site representation" here refers to the name of a step in the first-time configuration, so this occurrence needs to be translated in the same manner as that step's heading.
					__(
						"Please select a user in the Site representation step.",
						"wordpress-seo"

					)
				}
			</Alert>
		}
		{
			( ( state.personId !== 0 ) && ( ! state.canEditUser ) ) &&
				<Alert type="info" className="yst-mt-5">
					{
						createInterpolateElement(
							sprintf(
								// translators: %1$s is replaced by the selected person's username
								__(
									"You're not allowed to edit the social profiles of the user %1$s. Please ask this user or an admin to do this.",
									"wordpress-seo"
								),
								window.wpseoFirstTimeConfigurationData.personName
							),
							{
								b: <b />,
							}
						)
					}
				</Alert>
		}

	</Fragment>;
}

SocialProfilesStep.propTypes = {
	state: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	setErrorFields: PropTypes.func.isRequired,
};
