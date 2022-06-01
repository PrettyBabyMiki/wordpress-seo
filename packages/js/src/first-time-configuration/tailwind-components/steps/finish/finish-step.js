import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { ReactComponent as ConfigurationFinishImage } from "../../../../../images/indexables_2_left_bubble_optm.svg";

/**
 * Goes to the Dashboard tab by clicking the tab button.
 *
 * @returns {void}
 */
function goToSEODashboard() {
	document.getElementById( "dashboard-tab" ).click();
	window.scrollTo( 0, 0 );
}

/**
 * The last step of the Stepper: the Finish step.
 *
 * @returns {WPElement} The Finish step.
 */
export default function FinishStep() {
	const isPremium = useSelect( select => select( "yoast-seo/settings" ).getIsPremium() );

	return (
		<div className="yst-flex yst-flex-row yst-justify-between yst-items-center yst--mt-4">
			<div className="yst-mr-6">
				<p className="yst-text-sm yst-mb-6">{ __( "Our indexables squad has worked hard and solved a lot of technical problems. Let's have a look at the SEO fitness of your site!", "wordpress-seo" ) }</p>
				{ ! isPremium && (
					<p className="yst-text-sm -yst-mt-3 yst-mb-6">
						{ __( "Curious what Yoast SEO Premium can do for you? Join one of our upcoming webinars and our SEO experts will tell you all about it!", "wordpress-seo" ) }
						&nbsp;
						<a href="https://yoast.com/" target="_blank" rel="noreferrer">
							{ __( "Read more", "wordpress-seo" ) }
						</a>
					</p>
				) }
				<button
					type="button"
					onClick={ goToSEODashboard }
					className={ "yst-button yst-button--primary" }
				>{ __( "Go to your SEO dashboard", "wordpress-seo" ) }</button>
			</div>
			<ConfigurationFinishImage className="yst-shrink-0 yst-h-28" />
		</div>
	);
}
