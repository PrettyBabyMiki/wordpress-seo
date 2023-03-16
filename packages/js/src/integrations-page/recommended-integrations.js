import { createInterpolateElement } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { ReactComponent as JetpackBoostLogo } from "../../images/jetpack-boost-integration-logo.svg";
import { ReactComponent as SemrushLogo } from "../../images/semrush-logo.svg";
import { ReactComponent as WincherLogo } from "../../images/wincher-logo.svg";
import { getInitialState, getIsMultisiteAvailable, getIsNetworkControlEnabled, updateIntegrationState } from "./helper";
import { JetpackBoostIntegration } from "./jetpack-boost-integration";

import { ToggleableIntegration } from "./toggleable-integration";

const integrations = [
	{
		name: "Semrush",
		claim: createInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: Semrush; 3: bold close tag. */
				__( "Use %1$s%2$s%3$s to do keyword research - without leaving your post", "wordpress-seo" ),
				"<strong>",
				"Semrush",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-semrush",
		logoLink: "http://yoa.st/semrush-prices-wordpress",
		slug: "semrush",
		description: sprintf(
			/* translators: 1: Semrush */
			__( "Find out what your audience is searching for with %s data right in your sidebar.", "wordpress-seo" ),
			"Semrush"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: true,
		logo: SemrushLogo,
	},
	{
		name: "Wincher",
		claim: createInterpolateElement(
			sprintf(
				/* translators: 1: bold open tag; 2: Wincher; 3: bold close tag. */
				__( "Track your rankings through time with %1$s%2$s%3$s", "wordpress-seo" ),
				"<strong>",
				"Wincher",
				"</strong>"
			), {
				strong: <strong />,
			}
		),
		learnMoreLink: "https://yoa.st/integrations-about-wincher",
		logoLink: "https://yoa.st/integrations-logo-wincher",
		slug: "wincher",
		description: sprintf(
			/* translators: 1: Wincher */
			__( "Keep an eye on how your posts are ranking by connecting to your %s account.", "wordpress-seo" ),
			"Wincher"
		),
		isPremium: false,
		isNew: false,
		isMultisiteAvailable: false,
		logo: WincherLogo,
	},
];

const jetpackBoostSlug = "jetpack-boost";
const jetpackBoostIsActive = getInitialState( { slug: jetpackBoostSlug } );
const jetpackBoostIntegration = {
	name: "Jetpack Boost",
	claim: createInterpolateElement(
		sprintf(
			/* translators: 1: bold open tag; 2: Jetpack Boost; 3: bold close tag. */
			__( "Speed up your website with %1$s%2$s%3$s", "wordpress-seo" ),
			"<strong>",
			"Jetpack Boost",
			"</strong>"
		), {
			strong: <strong />,
		}
	),
	learnMoreLink: "https://yoa.st/integrations-about-jetpack-boost",
	linkTextInActive: __( "Get Jetpack Boost", "wordpress-seo" ),
	linkInActive: "https://yoa.st/integrations-get-jetpack-boost",
	linkUpgrade: "https://yoa.st/integrations-upgrade-jetpack-boost",
	logoLink: "https://yoa.st/integrations-logo-jetpack-boost",
	slug: jetpackBoostSlug,
	description: __( "Optimize your CSS, defer non-essential JavaScript and Lazy-load your images to optimize your site for speed!", "wordpress-seo" ),
	isPremium: false,
	isNew: false,
	isMultisiteAvailable: false,
	logo: JetpackBoostLogo,
};

export const RecommendedIntegrations = [
	integrations.map( ( integration, index ) => {
		return (
			<ToggleableIntegration
				key={ index }
				integration={ integration }
				toggleLabel={ __( "Enable integration", "wordpress-seo" ) }
				initialActivationState={ getInitialState( integration ) }
				isNetworkControlEnabled={ getIsNetworkControlEnabled( integration ) }
				isMultisiteAvailable={ getIsMultisiteAvailable( integration ) }
				beforeToggle={ updateIntegrationState }
			/>
		);
	} ),
	<JetpackBoostIntegration
		key={ integrations.length }
		integration={ jetpackBoostIntegration }
		isActive={ jetpackBoostIsActive }
		isIntegrationPremium={ Boolean( window.wpseoIntegrationsData[ "jetpack-boost_premium" ] ) }
	/>,
];
