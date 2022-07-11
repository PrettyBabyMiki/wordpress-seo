import apiFetch from "@wordpress/api-fetch";
import { Slot } from "@wordpress/components";
import { useState, useCallback } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { PropTypes } from "prop-types";

import { Button, Badge, ToggleField } from "@yoast/ui-library";
import { Card } from "./card";
import AlgoliaLogo from "../../../images/algolia-logo.svg";
import RyteLogo from "../../../images/ryte-logo.svg";
import SemrushLogo from "../../../images/semrush-logo.svg";
import wincherLogo from "../../../images/wincher-logo.svg";
import ZapierLogo from "../../../images/zapier-logo.svg";
import WordproofLogo from "../../../images/wordproof-logo.svg";
import WoocommerceLogo from "../../../images/woocommerce-logo.svg";

const isPremiumInstalled = Boolean( window.wpseoScriptData.isPremium );
const upsellLink         = "https://yoa.st/workout-orphaned-content-upsell";

const SEOTools = [
	{
		name: "Semrush",
		type: "toggleable",
		slug: "semrush",
		description: "The Semrush integration offers suggestions and insights for keywords related to the entered focus keyphrase.",
		isPremium: false,
		isNew: false,
		isNetworkAvailable: true,
		logo: SemrushLogo,
	},
	{
		name: "Wincher",
		type: "toggleable",
		slug: "wincher",
		description: "The Wincher integration offers the option to track specific keyphrases and gain insights in their positions.",
		isPremium: false,
		isNew: false,
		isNetworkAvailable: false,
		logo: wincherLogo,
	},
	{
		name: "Ryte",
		type: "toggleable",
		slug: "ryte",
		description: "Ryte will check weekly if your site is still indexable by search engines and Yoast SEO will notify you when this is not the case. Read more about how Ryte works.",
		isPremium: false,
		isNew: false,
		isNetworkAvailable: true,
		logo: RyteLogo,
	},
	{
		name: "WordProof",
		type: "toggleable",
		slug: "wordproof",
		description: "Together with WordProof, we've built an integration that will allow you to timestamp your privacy page. Using the blockchain, you can protect your content and help the web become more trustworthy. For yourself, as well as for SEO, since trust is a big factor for search engines as well.",
		isPremium: false,
		isNew: false,
		isNetworkAvailable: false,
		logo: WordproofLogo,

	},
	{
		name: "Zapier",
		type: "toggleable",
		slug: "zapier",
		usps: [ "Automatically share your content on the platforms of your choice", "Stay in control of how your content is being shared", "Save time and focus on the tasks that need your attention" ],
		isPremium: true,
		isNew: false,
		isNetworkAvailable: true,
		logo: ZapierLogo,
	},
];

const pluginIntegrations = [
	{
		name: "Elementor",
		type: "builtin",
		description: "Optimize your content right inside the Elementor site builder.",
		isPremium: false,
		isNew: false,
		isNetworkAvailable: true,
		logo: null,
	},
	{
		name: "Jetpack",
		type: "builtin",
		description: "Short descriptive copy that tells about the integrations and its value.",
		isPremium: false,
		isNew: false,
		isNetworkAvailable: true,
		logo: null,
	},
	{
		name: "Algolia",
		type: "toggleable",
		slug: "algolia",
		description: "Improve the quality of your site search! Automatically helps your users find your cornerstone and most important content in your internal search results. It also removes noindexed posts & pages from your site’s search results. Find out more about our Algolia integration.",
		isPremium: true,
		isNew: false,
		isNetworkAvailable: true,
		logo: AlgoliaLogo,
	},
	{
		name: "WooCommerce",
		type: "simple",
		description: "Short descriptive copy that tells about the integrations and its value.",
		isPremium: false,
		isNew: false,
		isNetworkAvailable: true,
		logo: WoocommerceLogo,
	},
	{
		name: "ACF",
		type: "simple",
		description: "Short descriptive copy that tells about the integrations and its value.",
		isPremium: false,
		isNew: false,
		isNetworkAvailable: true,
		logo: null,
	},
];

const partnerships = [
	{
		name: "Bertha",
		type: "simple",
		description: "Optimize your content right inside the Elementor site builder.",
		isPremium: false,
		isNew: false,
		isNetworkAvailable: true,
		logo: null,
	},
];

/**
 * Checks if an integration is active.
 *
 * @param {string} integrationSlug The integration slug.
 *
 * @returns {bool} True if the integration is active, false otherwise.
 */
const getIsCardActive = ( integrationSlug ) => {
	const integrationOption = `${ integrationSlug }_integration_active`;
	return Boolean( window.wpseoIntegrationsData[ integrationOption ] );
};

/**
 * Checks if an integration is network-enabled.
 *
 * @param {string} integrationSlug The integration slug.
 *
 * @returns {bool} True if the integration is active, false otherwise.
 */
const getIsCardEnabled = ( integrationSlug ) => {
	const integrationOption = `allow_${ integrationSlug }_integration`;
	return Boolean( window.wpseoIntegrationsData[ integrationOption ] );
};

/**
 * Updates an integration state.
 *
 * @param {string} integrationSlug The integration slug.
 * @param {bool} setActive If the integration must be activated.
 *
 * @returns {Promise|bool} A promise, or false if the call fails.
*/
const updateIntegrationState = async( integrationSlug, setActive ) => {
	const basePath = "yoast/v1/integrations";

	const response = await apiFetch( {
		path: `${basePath}/set_${integrationSlug}_active`,
		method: "POST",
		data: { active: setActive },
	} );
	return await response.json;
};

/* eslint-disable complexity */
/**
 * An integration which can be toggled on and off.
 *
 * @param {string}    name                 The integration name.
 * @param {array}     usps                 The array of upselling points.
 * @param {string}    slug                 The integration slug.
 * @param {string}    description          The integration description.
 * @param {WPElement} logo                 The integration logo.
 * @param {string}    toggleLabel          The toggle label.
 * @param {bool}      isIntegrationActive  True if the integration has been activated by the user.
 * @param {bool}      isIntegrationEnabled True if the integration is network-enabled.
 * @param {bool}      isPremium            True if the integration is in Yoast SEO Premium.
 * @param {function}  beforeToggle         Check function to call before toggling the integration.
 *
 * @returns {WPElement} A card representing an integration which can be toggled active by the user.
 */
const ToggleableIntegration = ( {
	name,
	usps,
	slug,
	description,
	logo,
	toggleLabel,
	isIntegrationActive,
	isIntegrationEnabled,
	isPremium,
	beforeToggle } ) => {
	const [ isActive, setIsActive ] = useState( isIntegrationActive );

	/**
	 * The toggle management.
	 *
	 * @returns {Boolean} The footer.
	 */
	 const toggleActive = useCallback(
	 async() => {
		 let canToggle = true;
		 const newState = ! isActive;
		 // Immediately switch the toggle for enhanced UX
		 setIsActive( newState );

		 if ( beforeToggle ) {
			 canToggle = false;
			 canToggle = await beforeToggle( slug, newState );
		 }
		 if ( ! canToggle ) {
			 // If something went wrong, switch the toggle back
			 setIsActive( ! newState );
		 }
	 }, [ isActive, beforeToggle, setIsActive ] );

	 return (
		<Card>
			<Card.Header>
				{ logo && <img src={ logo } alt={ `${name} logo` } className={ `${ ( isActive && isIntegrationEnabled ) ? "" : "yst-opacity-50 yst-filter yst-grayscale" }` } /> }
				{ ( ! isIntegrationEnabled ) && <Badge className="yst-absolute yst-top-2 yst-right-2">{ __( "Network Disabled", "wordpress-seo" ) }</Badge> }
			</Card.Header>
			<Card.Content>
				<div className={ `${ isActive ? "" : "yst-opacity-50  yst-filter yst-grayscale" } ` }>
					<h4 className="yst-flex yst-items-center yst-text-base yst-mb-3 yst-font-medium yst-text-[#111827]">
						<span>{ name }</span>
					</h4>
					{ description && <p> { description } </p> }
					{ usps && <ul className="yst-space-y-3">
						{ usps.map( ( usp, idx ) => {
							return (
								<li key={ idx } className="yst-flex yst-items-start">
									<svg xmlns="http://www.w3.org/2000/svg" className="yst-h-5 yst-w-5 yst-mr-2 yst-text-green-400 yst-flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
									</svg>
									<span> { usp } </span>
								</li>
							);
						} ) }
					</ul> }
				</div>
				{ isActive &&
					<Slot
						name={`${name}Slot`}
					/> }
			</Card.Content>
			<Card.Footer>
				{ ( ( isPremium && isPremiumInstalled ) || ! isPremium )
					? <ToggleField checked={ isActive } label={ toggleLabel } onChange={ toggleActive } disabled={ ! isIntegrationEnabled }  className={ `${ isIntegrationEnabled ? "" : "yst-opacity-50 yst-filter yst-grayscale" }` } />
					:	<Button id={ `${name}-upsell-button` } type="button" as="a" href={ upsellLink } variant="upsell" className="yst-w-full yst-text-gray-800">
						<svg xmlns="http://www.w3.org/2000/svg" className="yst--ml-1 yst-mr-2 yst-h-5 yst-w-5 yst-text-yellow-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
							<path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
						</svg>
						{ __( "Unlock with Premium", "wordpress-seo" ) }
					</Button>
				}
			</Card.Footer>
		</Card>
	 );
};

ToggleableIntegration.propTypes = {
	name: PropTypes.string,
	usps: PropTypes.array,
	slug: PropTypes.string,
	description: PropTypes.string,
	logo: PropTypes.string,
	toggleLabel: PropTypes.string,
	isIntegrationActive: PropTypes.bool,
	isIntegrationEnabled: PropTypes.bool,
	isPremium: PropTypes.bool,
	beforeToggle: PropTypes.func,
};

/* eslint-disable complexity */
/**
 * Represents an integration.
 *
 * @param {string} name        The integration name.
 * @param {array}  usps        The array of upselling points.
 * @param {string} description The integration description.
 * @param {bool}   isBuiltin   True if the integration is builtin in the plugin
 * @param {string} logo        The integration logo
 *
 * @returns {WPElement} A card representing an integration.
*/
const SimpleIntegration = ( {
	name,
	usps,
	description,
	isBuiltin,
	logo } ) => {
	return (
		<Card>
			<Card.Header>
				{ logo && <img src={ logo } alt={ `${name} logo` } /> }
			</Card.Header>
			<Card.Content>
				<h4 className="yst-flex yst-items-center yst-text-base yst-mb-3 yst-font-medium yst-text-[#111827]">
					<span>{ name }</span>
				</h4>
				{ description && <p> { description } </p> }
				{ usps && <ul className="yst-space-y-3">
					{ usps.map( ( usp, idx ) => {
						return (
							<li key={ idx } className="yst-flex yst-items-start">
								<svg xmlns="http://www.w3.org/2000/svg" className="yst-h-5 yst-w-5 yst-mr-2 yst-text-green-400 yst-flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
								</svg>
								<span> { usp } </span>
							</li>
						);
					} ) }
				</ul> }
			</Card.Content>
			<Card.Footer>
				{ isBuiltin && <p className="yst-flex yst-items-start yst-justify-between">
					<span className="yst-text-gray-700 yst-font-medium">{ __( "Integration active", "wordpress-seo" ) }</span>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="yst-h-5 yst-w-5 yst-text-green-400 yst-flex-shrink-0">
						<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
					</svg>
				</p> }
			</Card.Footer>
		</Card>
	);
};

SimpleIntegration.propTypes = {
	name: PropTypes.string,
	usps: PropTypes.array,
	isBuiltin: PropTypes.bool,
	description: PropTypes.string,
	logo: PropTypes.string,
};

/**
 * Renders a section.
 *
 * @param {string} title       The section title.
 * @param {string} description The section description.
 * @param {array}  elements    Array of elements to be rendered.
 *
 * @returns {WPElement} The section.
 */
const Section = ( { title, description, elements } ) => {
	return (
		<section>
			<div className="yst-mb-8">
				<h2 className="yst-mb-2 yst-text-lg">{ title }</h2>
				<p className="yst-text-tiny">{ description }</p>
			</div>
			<div className="yst-grid yst-grid-cols-1 yst-gap-6 sm:yst-grid-cols-2 md:yst-grid-cols-3 lg:yst-grid-cols-4">
				{ elements.map( ( integration, index ) => {
					const label =
						sprintf(
							// translators: %1$s expands to the name of the extension
							__(
								"Enable %1$s",
								"wordpress-seo"
							),
							integration.name
						);
					switch ( integration.type ) {
						case "toggleable":
							return (
								<ToggleableIntegration
									key={ index }
									slug={ integration.slug }
									name={ integration.name }
									description={ integration.description }
									logo={ integration.logo }
									toggleLabel={ label }
									isIntegrationActive={ getIsCardActive( integration.slug ) }
									isIntegrationEnabled={ getIsCardEnabled( integration.slug ) }
									beforeToggle={ updateIntegrationState }
									isPremium={ integration.isPremium }
								/>
							);
						case "simple":
						case "builtin":
							return (
								<SimpleIntegration
									key={ index }
									name={ integration.name }
									isBuiltin={ integration.type === "builtin" }
									usps={ integration.usps }
									description={ integration.description }
									logo={ integration.logo }
								/>
							);
						default:
							break;
					}
				} ) }
			</div>
		</section>
	);
};

Section.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	elements: PropTypes.array,
};

/**
 * Renders a grid of integrations subdivided into sections.
 *
 * @returns {WPElement} The integration grid.
*/
export default function IntegrationsGrid() {
	return (
		<div className="yst-h-full yst-flex yst-flex-col yst-bg-white">
			<div className="yst-flex-grow yst-max-w-6xl yst-p-8">

				<Section
					title={ __( "Recommended Integrations", "wordpress-seo" ) }
					description="description"
					elements={ SEOTools }
				/>

				<hr className="yst-my-12" />

				<Section
					title={ __( "Plugin Integrations", "wordpress-seo" ) }
					description="description"
					elements={ pluginIntegrations }
				/>

				<hr className="yst-my-12" />

				<Section
					title={ __( "Plugin Integrations", "wordpress-seo" ) }
					description="description"
					elements={ partnerships }
				/>

			</div>
		</div>
	);
}
