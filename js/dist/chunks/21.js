yoastWebpackJsonp([21],{

/***/ 559:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n!function (e, t) {\n  \"object\" == ( false ? \"undefined\" : _typeof(exports)) && \"undefined\" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :\n\t\t\t\t__WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.tzm = t());\n}(undefined, function () {\n  \"use strict\";\n  return [{ locale: \"tzm\", pluralRuleFunction: function pluralRuleFunction(e, t) {\n      var a = String(e).split(\".\"),\n          r = Number(a[0]) == e;return t ? \"other\" : 0 == e || 1 == e || r && e >= 11 && e <= 99 ? \"one\" : \"other\";\n    }, fields: { year: { displayName: \"Asseggas\", relative: { 0: \"this year\", 1: \"next year\", \"-1\": \"last year\" }, relativeTime: { future: { other: \"+{0} y\" }, past: { other: \"-{0} y\" } } }, month: { displayName: \"Ayur\", relative: { 0: \"this month\", 1: \"next month\", \"-1\": \"last month\" }, relativeTime: { future: { other: \"+{0} m\" }, past: { other: \"-{0} m\" } } }, day: { displayName: \"Ass\", relative: { 0: \"Assa\", 1: \"Asekka\", \"-1\": \"Assenaṭ\" }, relativeTime: { future: { other: \"+{0} d\" }, past: { other: \"-{0} d\" } } }, hour: { displayName: \"Tasragt\", relative: { 0: \"this hour\" }, relativeTime: { future: { other: \"+{0} h\" }, past: { other: \"-{0} h\" } } }, minute: { displayName: \"Tusdat\", relative: { 0: \"this minute\" }, relativeTime: { future: { other: \"+{0} min\" }, past: { other: \"-{0} min\" } } }, second: { displayName: \"Tusnat\", relative: { 0: \"now\" }, relativeTime: { future: { other: \"+{0} s\" }, past: { other: \"-{0} s\" } } } } }];\n});\n\n//////////////////\n// WEBPACK FOOTER\n// /Users/joostdevalk/Code/GitHub/wordpress-seo/node_modules/react-intl/locale-data/tzm.js\n// module id = 559\n// module chunks = 21\n\n//# sourceURL=webpack:////Users/joostdevalk/Code/GitHub/wordpress-seo/node_modules/react-intl/locale-data/tzm.js?");

/***/ })

});