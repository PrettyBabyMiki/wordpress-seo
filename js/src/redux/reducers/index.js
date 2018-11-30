import { analysis } from "yoast-components";

import isCornerstone from "./cornerstoneContent";
import focusKeyword from "./focusKeyword";
import marksButtonStatus from "./markerButtons";
import snippetEditor from "./snippetEditor";
import analysisDataReducer from "./analysisData";
import preferences from "./preferences";
import settings from "./settings";
import primaryTaxonomies from "./primaryTaxonomies";
import activeMarker from "./activeMarker";
import markerPause from "./markerPause";

export default {
	analysis,
	isCornerstone,
	focusKeyword,
	marksButtonStatus,
	snippetEditor,
	analysisData: analysisDataReducer,
	preferences,
	settings,
	primaryTaxonomies,
	activeMarker,
	markerPause,
};
