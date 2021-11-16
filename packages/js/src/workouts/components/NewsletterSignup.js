import { useCallback, useState } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";

import { NewButton as Button, TextInput } from "@yoast/components";
import { addLinkToString } from "../../helpers/stringHelpers";

/**
 * A function to request a sign up to the newsletter.
 *
 * @param {string} email The email to signup to the newsletter.
 *
 * @returns {Object} The request's response.
 */
async function postSignUp( email ) {
	const response = await fetch( "https://my.yoast.com/api/Mailing-list/subscribe", {
		method: "POST",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json",
		},
		redirect: "follow",
		referrerPolicy: "no-referrer",
		body: JSON.stringify(
			{
				customerDetails: {
					firstName: "",
					email,
				},
				list: "Yoast newsletter",
			}
		),
	} );
	return response.json();
}

/**
 * The newsletter signup section.
 *
 * @returns {WPElement} A newslettersignup element.
 */
export function NewsletterSignup() {
	const [ newsletterEmail, setNewsletterEmail ] = useState( "" );
	const [ signUpState, setSignUpState ] = useState( "waiting" );

	const onSignUpClick = useCallback(
		async function() {
			setSignUpState( "loading" );
			await postSignUp( newsletterEmail );
			setSignUpState( "ready" );
		},
		[ newsletterEmail ]
	);

	return (
		<>
			<ul className="yoast-list--usp">
				<li>{ __( "Receive best-practice tips and learn how to rank on search engines", "wordpress-seo" ) }</li>
				<li>{ __( "Stay up-to-date with the latest SEO news", "wordpress-seo" ) }</li>
				<li>{ __( "Get guidance on how to use Yoast SEO to the fullest", "wordpress-seo" ) }</li>
			</ul>
			<div className="yoast-newsletter-signup">
				<TextInput
					label={ __( "Email address", "wordpress-seo" ) }
					id="newsletter-email"
					name="newsletter email"
					value={ newsletterEmail }
					onChange={ setNewsletterEmail }
					type="email"
				/>
				<Button
					variant="primary"
					onClick={ onSignUpClick }
					disabled={ signUpState === "loading" }
				>
					{ __( "Sign up!", "wordpress-seo" ) }
				</Button>
			</div>
			<p className="yoast-privacy-policy">
				{
					addLinkToString(
						sprintf(
							// translators: %1$s and %2$s are replaced by opening and closing anchor tags.
							__(
								"Yoast respects your privacy. Read %1$sour privacy policy%2$s on how we handle your personal information.",
								"wordpress-seo"
							),
							"<a>",
							"</a>"
						),
						"https://yoa.st/gdpr-config-workout"
					)
				}
			</p>
			{ signUpState === "ready" && <ul className="yoast-list--usp yoast-newsletter-result">
				<li>{ __( "Thanks! Check your inbox for the confirmation email.", "wordpress-seo" ) }</li>
			</ul> }
		</>
	);
}
