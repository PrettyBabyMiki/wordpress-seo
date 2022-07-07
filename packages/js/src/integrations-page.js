import domReady from "@wordpress/dom-ready";

import { render } from "@wordpress/element";
import { Root } from "@yoast/ui-library";
import { get } from "lodash";
import IntegrationsGrid from "./integrations-page/tailwind-components/integrations-grid";


domReady( () => {
	const context = {
		isRtl: Boolean( get( window, "wpseoScriptData.metabox.isRtl", false ) ),
	};
	const root = document.getElementById( "wpseo-integrations" );
	if ( ! root ) {
		return;
	}

	render(
		<Root context={ context }>
			<IntegrationsGrid />
		</Root>,
		root
	);
} );
