yoastWebpackJsonp([34],{

/***/ 525:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.ta = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "ta", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "ஆண்டு", relative: { 0: "இந்த ஆண்டு", 1: "அடுத்த ஆண்டு", "-1": "கடந்த ஆண்டு" }, relativeTime: { future: { one: "{0} ஆண்டில்", other: "{0} ஆண்டுகளில்" }, past: { one: "{0} ஆண்டிற்கு முன்", other: "{0} ஆண்டுகளுக்கு முன்" } } }, month: { displayName: "மாதம்", relative: { 0: "இந்த மாதம்", 1: "அடுத்த மாதம்", "-1": "கடந்த மாதம்" }, relativeTime: { future: { one: "{0} மாதத்தில்", other: "{0} மாதங்களில்" }, past: { one: "{0} மாதத்துக்கு முன்", other: "{0} மாதங்களுக்கு முன்" } } }, day: { displayName: "நாள்", relative: { 0: "இன்று", 1: "நாளை", 2: "நாளை மறுநாள்", "-2": "நேற்று முன் தினம்", "-1": "நேற்று" }, relativeTime: { future: { one: "{0} நாளில்", other: "{0} நாட்களில்" }, past: { one: "{0} நாளுக்கு முன்", other: "{0} நாட்களுக்கு முன்" } } }, hour: { displayName: "மணி", relative: { 0: "இந்த ஒரு மணிநேரத்தில்" }, relativeTime: { future: { one: "{0} மணிநேரத்தில்", other: "{0} மணிநேரத்தில்" }, past: { one: "{0} மணிநேரம் முன்", other: "{0} மணிநேரம் முன்" } } }, minute: { displayName: "நிமிடம்", relative: { 0: "இந்த ஒரு நிமிடத்தில்" }, relativeTime: { future: { one: "{0} நிமிடத்தில்", other: "{0} நிமிடங்களில்" }, past: { one: "{0} நிமிடத்திற்கு முன்", other: "{0} நிமிடங்களுக்கு முன்" } } }, second: { displayName: "விநாடி", relative: { 0: "இப்போது" }, relativeTime: { future: { one: "{0} விநாடியில்", other: "{0} விநாடிகளில்" }, past: { one: "{0} விநாடிக்கு முன்", other: "{0} விநாடிகளுக்கு முன்" } } } } }, { locale: "ta-LK", parentLocale: "ta" }, { locale: "ta-MY", parentLocale: "ta" }, { locale: "ta-SG", parentLocale: "ta" }];
});

/***/ })

});