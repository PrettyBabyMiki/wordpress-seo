/* eslint-disable complexity */
import { Transition } from "@headlessui/react";
import { TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { createInterpolateElement, useEffect, useMemo } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Alert, Button, Radio, RadioGroup, TextField, usePrevious } from "@yoast/ui-library";
import { Field, FieldArray, useFormikContext } from "formik";
import { get, isEmpty, map } from "lodash";
import { addLinkToString } from "../../helpers/stringHelpers";
import { FieldsetLayout, FormikMediaSelectField, FormikUserSelectField, FormikWithErrorField, FormLayout, RouteLayout } from "../components";
import { fetchUserSocialProfiles } from "../helpers";
import { useDispatchSettings, useSelectSettings } from "../hooks";

/**
 * @returns {JSX.Element} The person social profiles form.
 */
const PersonSocialProfiles = () => {
	const personSocialProfiles = useMemo( () => get( window, "wpseoScriptData.personSocialProfiles", {} ), [] );
	const { addNotification } = useDispatchSettings();
	const { values, status, setStatus, setFieldValue } = useFormikContext();
	const { company_or_person_user_id: companyOrPersonId } = values.wpseo_titles;
	const previousUserId = usePrevious( companyOrPersonId );
	const canEditUser = useSelectSettings( "selectCanEditUser", [], companyOrPersonId );
	const socialProfileFieldLabels = useMemo( () => ( {
		facebook: __( "Facebook URL", "wordpress-seo" ),
		instagram: __( "Instagram URL", "wordpress-seo" ),
		linkedin: __( "LinkedIn URL", "wordpress-seo" ),
		myspace: __( "MySpace URL", "wordpress-seo" ),
		pinterest: __( "Pinterest URL", "wordpress-seo" ),
		soundcloud: __( "SoundCloud URL", "wordpress-seo" ),
		tumblr: __( "Tumblr URL", "wordpress-seo" ),
		twitter: __( "Twitter username (without @)", "wordpress-seo" ),
		youtube: __( "YouTube URL", "wordpress-seo" ),
		wikipedia: __( "Wikipedia URL", "wordpress-seo" ),
	} ), [] );

	useEffect( () => {
		if ( previousUserId === companyOrPersonId || companyOrPersonId < 1 ) {
			return;
		}

		setStatus( { ...status, isFetchingPersonSocialProfiles: true } );
		fetchUserSocialProfiles( companyOrPersonId )
			.then( socialProfiles => {
				setFieldValue( "person_social_profiles", socialProfiles );
			} )
			.catch( error => {
				addNotification( {
					id: "social-profiles-error",
					variant: "error",
					title: __( "Oops! Something went wrong while retrieving the person social profiles.", "wordpress-seo" ),
				} );
				console.error( "Error while fetching the social profiles:", error.message );
			} )
			.finally( () => {
				setStatus( { ...status, isFetchingPersonSocialProfiles: false } );
			} );
	}, [ previousUserId, companyOrPersonId, setFieldValue, setStatus, addNotification ] );

	return (
		<FieldsetLayout
			id="fieldset-wpseo_social-other_social_urls"
			title={ __( "Other profiles", "wordpress-seo" ) }
			description={ __( "Tell us about the other profiles on the web that belong to the person.", "wordpress-seo" ) }
		>
			{ map( personSocialProfiles, socialProfile => (
				<FormikWithErrorField
					key={ socialProfile }
					as={ TextField }
					name={ `person_social_profiles.${ socialProfile }` }
					id={ `input-person_social_profiles-${ socialProfile }` }
					label={ socialProfileFieldLabels[ socialProfile ] }
					// translators: %1$s expands to social media example URL, ie. https://facebook.com/yoast.
					placeholder={ canEditUser && sprintf( __( "E.g. %1$s", "wordpress-seo" ), `https://${ socialProfile }.com/yoast` ) }
					readOnly={ ! canEditUser }
					disabled={ ! companyOrPersonId }
				/>
			) ) }
		</FieldsetLayout>
	);
};

/**
 * @returns {JSX.Element} The site representation route.
 */
const SiteRepresentation = () => {
	const { values } = useFormikContext();
	// eslint-disable-next-line camelcase
	const {
		website_name: websiteName,
		company_or_person: companyOrPerson,
		company_or_person_user_id: companyOrPersonId,
		company_name: companyName,
		company_logo_id: companyLogoId,
	} = values.wpseo_titles;
	const { other_social_urls: otherSocialUrls } = values.wpseo_social;

	const personUser = useSelectSettings( "selectUserById", [ companyOrPersonId ], companyOrPersonId );
	const googleKnowledgeGraphLink = useSelectSettings( "selectLink", [], "https://yoa.st/1-p" );
	const structuredDataLink = useSelectSettings( "selectLink", [], "https://yoa.st/3r3" );
	const editUserUrl = useSelectSettings( "selectPreference", [], "editUserUrl" );
	const isLocalSeoActive = useSelectSettings( "selectPreference", [], "isLocalSeoActive" );
	const companyOrPersonMessage = useSelectSettings( "selectPreference", [], "companyOrPersonMessage" );
	const siteLogoId = useSelectSettings( "selectFallback", [], "siteLogoId" );
	const canEditUser = useSelectSettings( "selectCanEditUser", [], companyOrPersonId );

	return (
		<RouteLayout
			title={ __( "Site representation", "wordpress-seo" ) }
			description={ addLinkToString(
				sprintf(
					// translators: %1$s and %2$s are replaced by opening and closing <a> tags.
					__( "This info is intended to appear in %1$sGoogle's Knowledge Graph%2$s.", "wordpress-seo" ),
					"<a>",
					"</a>"
				),
				googleKnowledgeGraphLink,
				"link-google-knowledge-graph"
			) }
		>
			<FormLayout>
				<div className="yst-max-w-5xl">
					<FieldsetLayout
						title={ __( "Organization/person", "wordpress-seo" ) }
						description={ __( "Choose whether your site represents an organization or a person.", "wordpress-seo" ) }
					>
						{ isLocalSeoActive && (
							<Alert id="alert-local-seo-company-or-person" variant="info">
								{ companyOrPersonMessage }
							</Alert>
						) }
						<RadioGroup disabled={ isLocalSeoActive }>
							<Field
								as={ Radio }
								type="radio"
								name="wpseo_titles.company_or_person"
								id="input-wpseo_titles-company_or_person-company"
								label={ __( "Organization", "wordpress-seo" ) }
								value="company"
								disabled={ isLocalSeoActive }
							/>
							<Field
								as={ Radio }
								type="radio"
								name="wpseo_titles.company_or_person"
								id="input-wpseo_titles-company_or_person-person"
								label={ __( "Person", "wordpress-seo" ) }
								value="person"
								disabled={ isLocalSeoActive }
							/>
						</RadioGroup>
					</FieldsetLayout>
					<section className="yst-space-y-8" />
					<hr className="yst-my-8" />
					<div className="yst-relative">
						<Transition
							show={ companyOrPerson === "company" }
							enter="yst-transition yst-ease-out yst-duration-300 yst-delay-300"
							enterFrom="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
							enterTo="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
							leave="yst-transition yst-absolute yst-top-0 yst-left-0 yst-ease-out yst-duration-300"
							leaveFrom="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
							leaveTo="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
						>
							<FieldsetLayout
								title={ __( "Organization", "wordpress-seo" ) }
								description={ __( "Please tell us more about your organization. This information will help Google to understand your website, and improve your chance of getting rich results.", "wordpress-seo" ) }
							>
								{ ( ! companyName || companyLogoId < 1 ) && (
									<Alert id="alert-organization-name-logo" variant="info">
										{ addLinkToString(
											sprintf(
												// translators: %1$s and %2$s are replaced by opening and closing <a> tags.
												__( "An organization name and logo need to be set for structured data to work properly. Since you haven’t set these yet, we are using the site name and logo as default values. %1$sLearn more about the importance of structured data%2$s.", "wordpress-seo" ),
												"<a>",
												"</a>"
											),
											structuredDataLink,
											"link-structured-data"
										) }
									</Alert>
								) }
								<Field
									as={ TextField }
									name="wpseo_titles.company_name"
									id="input-wpseo_titles-company_name"
									label={ __( "Organization name", "wordpress-seo" ) }
									placeholder={ websiteName }
								/>
								<Field
									as={ TextField }
									name="wpseo_titles.company_alternate_name"
									id="input-wpseo_titles-company_alternate_name"
									label={ __( "Alternate organization name", "wordpress-seo" ) }
									description={ __( "Use the alternate organization name for acronyms, or a shorter version of your organization's name.", "wordpress-seo" ) }
								/>
								<FormikMediaSelectField
									id="wpseo_titles-company_logo"
									label={ __( "Organization logo", "wordpress-seo" ) }
									variant="square"
									previewLabel={ createInterpolateElement(
										sprintf(
											// translators: %1$s expands to an opening strong tag.
											// %2$s expands to a closing strong tag.
											// %3$s expands to the recommended image size.
											__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
											"<strong>",
											"</strong>",
											"696x696px"
										), {
											strong: <strong className="yst-font-semibold" />,
										} ) }
									mediaUrlName="wpseo_titles.company_logo"
									mediaIdName="wpseo_titles.company_logo_id"
									fallbackMediaId={ siteLogoId }
								/>
							</FieldsetLayout>
							<hr className="yst-my-8" />
							<FieldsetLayout
								id="fieldset-wpseo_social-other_social_urls"
								title={ __( "Other profiles", "wordpress-seo" ) }
								description={ __( "Tell us if you have any other profiles on the web that belong to your organization. This can be any number of profiles, like YouTube, LinkedIn, Pinterest, or even Wikipedia.", "wordpress-seo" ) }
							>
								<FormikWithErrorField
									as={ TextField }
									name="wpseo_social.facebook_site"
									id="input-wpseo_social-facebook_site"
									label={ __( "Facebook", "wordpress-seo" ) }
									placeholder={ __( "E.g. https://facebook.com/yoast", "wordpress-seo" ) }
								/>
								<FormikWithErrorField
									as={ TextField }
									name="wpseo_social.twitter_site"
									id="input-wpseo_social-twitter_site"
									label={ __( "Twitter", "wordpress-seo" ) }
									placeholder={ __( "E.g. https://twitter.com/yoast", "wordpress-seo" ) }
								/>
								<FieldArray name="wpseo_social.other_social_urls">
									{ arrayHelpers => (
										<>
											{ otherSocialUrls.map( ( _, index ) => (
												<div
													key={ `wpseo_social.other_social_urls.${ index }` }
													className="yst-w-full yst-flex yst-items-start yst-gap-2"
												>
													<FormikWithErrorField
														as={ TextField }
														name={ `wpseo_social.other_social_urls.${ index }` }
														id={ `input-wpseo_social-other_social_urls-${ index }` }
														// translators: %1$s expands to array index + 1.
														label={ sprintf( __( "Other profile %1$s", "wordpress-seo" ), index + 1 ) }
														placeholder={ __( "E.g. https://example.com/yoast", "wordpress-seo" ) }
														className="yst-grow"
													/>
													<Button
														variant="secondary"
														// eslint-disable-next-line react/jsx-no-bind
														onClick={ arrayHelpers.remove.bind( null, index ) }
														className="yst-mt-7 yst-p-2.5"
													>
														<TrashIcon className="yst-h-5 yst-w-5" />
													</Button>
												</div>
											) ) }
											{ /* eslint-disable-next-line react/jsx-no-bind */ }
											<Button id="button-add-social-profile" variant="secondary" onClick={ arrayHelpers.push.bind( null, "" ) }>
												<PlusIcon className="yst--ml-1 yst-mr-1 yst-h-5 yst-w-5 yst-text-slate-400" />
												{ __( "Add another profile", "wordpress-seo" ) }
											</Button>
										</>
									) }
								</FieldArray>
							</FieldsetLayout>
						</Transition>
						<Transition
							show={ companyOrPerson === "person" }
							enter="yst-transition yst-ease-out yst-duration-300 yst-delay-300"
							enterFrom="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
							enterTo="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
							leave="yst-transition yst-absolute yst-top-0 yst-left-0 yst-ease-out yst-duration-300"
							leaveFrom="yst-transform yst-opacity-100 yst-translate-y-0 sm:yst-scale-100"
							leaveTo="yst-transform yst-opacity-0 yst-translate-y-4 sm:yst-translate-y-0 sm:yst-scale-90"
						>
							<FieldsetLayout
								title={ __( "Personal info", "wordpress-seo" ) }
								description={ __( "Please tell us more about the person this site represents.", "wordpress-seo" ) }
							>
								<FormikUserSelectField
									name="wpseo_titles.company_or_person_user_id"
									id="input-wpseo_titles-company_or_person_user_id"
									label={ __( "Select a user", "wordpress-seo" ) }
								/>
								{ ! isEmpty( personUser ) && (
									<Alert id="alert-person-user-profile">
										{ canEditUser && createInterpolateElement(
											sprintf(
												// translators: %1$s and %2$s are replaced by opening and closing <span> tags.
												// %3$s and %4$s are replaced by opening and closing <a> tags.
												// %5$s is replaced by the selected user display name.
												__( "You have selected the user %1$s%5$s%2$s as the person this site represents. Their user profile information will now be used in search results. %3$sUpdate their profile to make sure the information is correct%4$s.", "wordpress-seo" ),
												"<strong>",
												"</strong>",
												"<a>",
												"</a>",
												personUser?.name
											), {
												strong: <strong className="yst-font-medium" />,
												// eslint-disable-next-line jsx-a11y/anchor-has-content
												a: <a
													id="link-person-user-profile" href={ `${ editUserUrl }?user_id=${ personUser?.id }` }
													target="_blank" rel="noopener noreferrer"
												/>,
											} ) }
										{ ! canEditUser && createInterpolateElement(
											sprintf(
												// translators: %1$s and %2$s are replaced by opening and closing <span> tags.
												// %3$s is replaced by the selected user display name.
												__( "You have selected the user %1$s%3$s%2$s as the person this site represents. Their user profile information will now be used in search results. We're sorry, you're not allowed to edit this user's profile. Please contact your admin or %1$s%3$s%2$s to check and/or update the information below.", "wordpress-seo" ),
												"<strong>",
												"</strong>",
												personUser?.name
											), {
												strong: <strong className="yst-font-medium" />,
											} ) }
									</Alert>
								) }

								<FormikMediaSelectField
									id="wpseo_titles-person_logo"
									label={ __( "Personal logo or avatar", "wordpress-seo" ) }
									variant="square"
									previewLabel={ createInterpolateElement(
										sprintf(
											// translators: %1$s expands to an opening strong tag.
											// %2$s expands to a closing strong tag.
											// %3$s expands to the recommended image size.
											__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
											"<strong>",
											"</strong>",
											"696x696px"
										), {
											strong: <strong className="yst-font-semibold" />,
										} ) }
									mediaUrlName="wpseo_titles.person_logo"
									mediaIdName="wpseo_titles.person_logo_id"
									fallbackMediaId={ siteLogoId }
									disabled={ ! companyOrPersonId }
								/>
							</FieldsetLayout>
							<hr className="yst-my-8" />
							<PersonSocialProfiles />
						</Transition>
					</div>
				</div>
			</FormLayout>
		</RouteLayout>
	);
};

export default SiteRepresentation;
