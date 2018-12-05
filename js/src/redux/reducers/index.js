import { analysis } from "yoast-components";

import activeMarker from "./activeMarker";
import analysisDataReducer from "./analysisData";
import isCornerstone from "./cornerstoneContent";
import focusKeyword from "./focusKeyword";
import marksButtonStatus from "./markerButtons";
import preferences from "./preferences";
import primaryTaxonomies from "./primaryTaxonomies";
import activeMarker from "./activeMarker";
import isMarkerPaused from "./markerPauseStatus";
import settings from "./settings";
import snippetEditor from "./snippetEditor";
import warning from "./warning";

export default {
	analysis,
	activeMarker,
	analysisData: analysisDataReducer,
	isCornerstone,
	focusKeyword,
	marksButtonStatus,
	preferences,
	primaryTaxonomies,
	activeMarker,
	isMarkerPaused,
	settings,
	snippetEditor,
	warning,
};
