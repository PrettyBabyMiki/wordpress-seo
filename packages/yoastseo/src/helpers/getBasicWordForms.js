import { createBasicWordForms as createBasicWordFormsArabic } from "../morphology/arabic/createBasicWordForms";

/**
 * Collects functions for creating basic word forms for different languages.
 *
 * @returns {Object} An object with basic word form creation functions for multiple languages.
 */
export default function() {
	return {
		ar: createBasicWordFormsArabic,
	};
}
