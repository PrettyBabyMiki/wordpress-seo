/* global wpseoReplaceVarsL10n, wpseoSearchAppearance */

/* External dependencies */
import { render, Fragment } from "@wordpress/element";
import { forEach } from "lodash-es";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";

/* Yoast dependencies */
import SettingsReplacementVariableEditors from "./components/SettingsReplacementVariableEditors";
import snippetEditorReducer from "./redux/reducers/snippetEditor";
import configureEnhancers from "./redux/utils/configureEnhancers";
import getDefaultReplacementVariables from "./values/defaultReplaceVariables";
import { updateReplacementVariable } from "./redux/actions/snippetEditor";
import { setWordPressSeoL10n, setYoastComponentsL10n } from "./helpers/i18n";
import { ThemeProvider } from "styled-components";
import UserSelectPortal from "./components/portals/UserSelectPortal";
import CompanyInfoMissingPortal from "./components/portals/CompanyInfoMissingPortal";
import LocalSEOUpsellPortal from "./components/portals/LocalSEOUpsellPortal";

setYoastComponentsL10n();
setWordPressSeoL10n();

/**
 * Create a shared store for all snippet editors in the search appearance pages.
 *
 * @returns {Object} Redux store.
 */
function configureStore() {
	const store = createStore(
		combineReducers( {
			snippetEditor: snippetEditorReducer,
		} ),
		{
			snippetEditor: {
				replacementVariables: getDefaultReplacementVariables(),
				recommendedReplacementVariables: wpseoReplaceVarsL10n.recommended_replace_vars,
			},
		},
		configureEnhancers()
	);
	forEach( window.wpseoReplaceVarsL10n.replace_vars, replacementVariable => {
		const name = replacementVariable.name.replace( / /g, "_" );

		store.dispatch( updateReplacementVariable(
			name,
			replacementVariable.value,
			replacementVariable.label,
		) );
	} );
	return store;
}

const editorElements = document.querySelectorAll( "[data-react-replacevar-editor]" );
const singleFieldElements = document.querySelectorAll( "[data-react-replacevar-field]" );

const element = document.createElement( "div" );
document.body.appendChild( element );

const store = configureStore();

const theme = {
	isRtl: wpseoSearchAppearance.isRtl,
};

const {
	showLocalSEOUpsell,
	localSEOUpsellURL,
	brushstrokeBackgroundURL,
	knowledgeGraphCompanyInfoMissing,
} = wpseoSearchAppearance;

render(
	<Provider store={ store }>
		<ThemeProvider theme={ theme }>
			<Fragment>
				<SettingsReplacementVariableEditors
					singleFieldElements={ singleFieldElements }
					editorElements={ editorElements }
				/>
				<UserSelectPortal target="wpseo-person-selector" />
				<CompanyInfoMissingPortal
					target="knowledge-graph-company-warning"
					message={ knowledgeGraphCompanyInfoMissing.message }
					link={ knowledgeGraphCompanyInfoMissing.URL }
				/>
				{ showLocalSEOUpsell && (
					<LocalSEOUpsellPortal
						target="wpseo-local-seo-upsell"
						url={ localSEOUpsellURL }
						backgroundUrl={ brushstrokeBackgroundURL }
					/>
				) }
			</Fragment>
		</ThemeProvider>
	</Provider>,
	element
);
