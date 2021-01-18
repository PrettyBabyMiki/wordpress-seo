/* global wpseoScriptData */
import initAdminMedia from "./initializers/admin-media";
import initAdmin from "./initializers/admin";
import initSearchAppearance from "./initializers/search-appearance";
import initSocialSettings from "./initializers/social-settings";

initAdmin( jQuery );
if ( wpseoScriptData && typeof wpseoScriptData.media !== "undefined" ) {
	initAdminMedia( jQuery );
	initSocialSettings();
}
if ( wpseoScriptData && typeof wpseoScriptData.searchAppearance !== "undefined" ) {
	initSearchAppearance();
}
