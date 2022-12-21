import { useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { get, isEmpty } from "lodash";
import { useSelectSettings } from "./index";

/**
 * @param {string} name The field name.
 * @returns {{isDisabled: boolean, message: string}} The disabled state.
 */
const useDisabledMessage = ( { name } ) => {
	const isNetworkAdmin = useSelectSettings( "selectPreference", [], "isNetworkAdmin" );
	const isMainSite = useSelectSettings( "selectPreference", [], "isMainSite" );
	const isDisabledTracking = useMemo(
		() => name === "wpseo.tracking" && ! isNetworkAdmin && ! isMainSite,
		[ name, isNetworkAdmin, isMainSite ]
	);
	const isDisabledInclusiveLanguageAnalysis = useMemo(
		() => name === "wpseo.inclusive_language_analysis_active" && Boolean( window.wpseoScriptData.hasInclusiveLanguageSupport ) === false,
		[ name, window.wpseoScriptData.hasInclusiveLanguageSupport ]
	);
	const disabledSetting = useMemo( () => get( window, `wpseoScriptData.disabledSettings.${ name }`, "" ), [] );
	const message = useMemo( () => {
		if ( isDisabledTracking ) {
			return __( "Unavailable for sub-sites", "wordpress-seo" );
		}
		if ( isDisabledInclusiveLanguageAnalysis ) {
			return __( "Only available for English sites", "wordpress-seo" );
		}
		switch ( disabledSetting ) {
			case "multisite":
				return __( "Unavailable for multisites", "wordpress-seo" );
			case "network":
				return __( "Network disabled", "wordpress-seo" );
			default:
				return "";
		}
	}, [ disabledSetting, isDisabledTracking ] );
	const isDisabled = useMemo( () => ! isEmpty( message ), [ message ] );

	return {
		isDisabled,
		message,
	};
};

export default useDisabledMessage;
