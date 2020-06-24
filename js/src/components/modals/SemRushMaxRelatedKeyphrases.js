/* External dependencies */
import React from "react";
import { __, sprintf } from "@wordpress/i18n";

/* Yoast dependencies */
import { Alert } from "@yoast/components";

/**
 * Creates the content for the Maximum related keyphrases alert.
 *
 * @returns {React.Element} The Maximum related keyphrases alert.
 */
const SemRushMaxRelatedKeyphrases = () => {
	return (
		<Alert type="warning">
			{
				sprintf(
					/* translators: %s: Expands to "Yoast SEO". */
					__(
						// eslint-disable-next-line max-len
						"You've reached the maximum amount of 4 related keyphrases. You can change or remove related keyphrases in the %s metabox or sidebar.",
						"wordpress-seo",
					),
					"Yoast SEO",
				)
			}
		</Alert>
	);
};

export default SemRushMaxRelatedKeyphrases;
