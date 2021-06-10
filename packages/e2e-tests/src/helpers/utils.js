/**
 * WordPress e2e utilities
 */
import {
    visitAdminPage,
} from "@wordpress/e2e-test-utils";

import { addQueryArgs } from '@wordpress/url';

export const deleteExistingTaxonomies = async ( taxonomySlug ) => {
	const taxonomyPageQuery = addQueryArgs( '', {
		taxonomy: taxonomySlug,
	} );
	
	await visitAdminPage( 'edit-tags.php', taxonomyPageQuery );
	
	const noTaxonomyFoundRow = await page.$( 'tr.no-items' );
	if( noTaxonomyFoundRow == null ) {
		await page.click( '[id^=cb-select-all-]' );
		await page.select( '#bulk-action-selector-top', 'delete' );
		await page.focus( '#doaction' );
		await page.keyboard.press( 'Enter' );
	}
}
