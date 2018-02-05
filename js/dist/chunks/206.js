yoastWebpackJsonp([206],{

/***/ 353:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, n) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = n() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (n),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.cy = n());
}(undefined, function () {
  "use strict";
  return [{ locale: "cy", pluralRuleFunction: function pluralRuleFunction(e, n) {
      return n ? 0 == e || 7 == e || 8 == e || 9 == e ? "zero" : 1 == e ? "one" : 2 == e ? "two" : 3 == e || 4 == e ? "few" : 5 == e || 6 == e ? "many" : "other" : 0 == e ? "zero" : 1 == e ? "one" : 2 == e ? "two" : 3 == e ? "few" : 6 == e ? "many" : "other";
    }, fields: { year: { displayName: "blwyddyn", relative: { 0: "eleni", 1: "blwyddyn nesaf", "-1": "llynedd" }, relativeTime: { future: { zero: "ymhen {0} mlynedd", one: "ymhen blwyddyn", two: "ymhen {0} flynedd", few: "ymhen {0} blynedd", many: "ymhen {0} blynedd", other: "ymhen {0} mlynedd" }, past: { zero: "{0} o flynyddoedd yn ôl", one: "blwyddyn yn ôl", two: "{0} flynedd yn ôl", few: "{0} blynedd yn ôl", many: "{0} blynedd yn ôl", other: "{0} o flynyddoedd yn ôl" } } }, month: { displayName: "mis", relative: { 0: "y mis hwn", 1: "mis nesaf", "-1": "mis diwethaf" }, relativeTime: { future: { zero: "ymhen {0} mis", one: "ymhen mis", two: "ymhen deufis", few: "ymhen {0} mis", many: "ymhen {0} mis", other: "ymhen {0} mis" }, past: { zero: "{0} mis yn ôl", one: "{0} mis yn ôl", two: "{0} fis yn ôl", few: "{0} mis yn ôl", many: "{0} mis yn ôl", other: "{0} mis yn ôl" } } }, day: { displayName: "dydd", relative: { 0: "heddiw", 1: "yfory", 2: "drennydd", "-2": "echdoe", "-1": "ddoe" }, relativeTime: { future: { zero: "ymhen {0} diwrnod", one: "ymhen diwrnod", two: "ymhen deuddydd", few: "ymhen tridiau", many: "ymhen {0} diwrnod", other: "ymhen {0} diwrnod" }, past: { zero: "{0} diwrnod yn ôl", one: "{0} diwrnod yn ôl", two: "{0} ddiwrnod yn ôl", few: "{0} diwrnod yn ôl", many: "{0} diwrnod yn ôl", other: "{0} diwrnod yn ôl" } } }, hour: { displayName: "awr", relative: { 0: "yr awr hon" }, relativeTime: { future: { zero: "ymhen {0} awr", one: "ymhen awr", two: "ymhen {0} awr", few: "ymhen {0} awr", many: "ymhen {0} awr", other: "ymhen {0} awr" }, past: { zero: "{0} awr yn ôl", one: "awr yn ôl", two: "{0} awr yn ôl", few: "{0} awr yn ôl", many: "{0} awr yn ôl", other: "{0} awr yn ôl" } } }, minute: { displayName: "munud", relative: { 0: "y funud hon" }, relativeTime: { future: { zero: "ymhen {0} munud", one: "ymhen munud", two: "ymhen {0} funud", few: "ymhen {0} munud", many: "ymhen {0} munud", other: "ymhen {0} munud" }, past: { zero: "{0} munud yn ôl", one: "{0} munud yn ôl", two: "{0} funud yn ôl", few: "{0} munud yn ôl", many: "{0} munud yn ôl", other: "{0} munud yn ôl" } } }, second: { displayName: "eiliad", relative: { 0: "nawr" }, relativeTime: { future: { zero: "ymhen {0} eiliad", one: "ymhen eiliad", two: "ymhen {0} eiliad", few: "ymhen {0} eiliad", many: "ymhen {0} eiliad", other: "ymhen {0} eiliad" }, past: { zero: "{0} eiliad yn ôl", one: "eiliad yn ôl", two: "{0} eiliad yn ôl", few: "{0} eiliad yn ôl", many: "{0} eiliad yn ôl", other: "{0} eiliad yn ôl" } } } } }];
});

/***/ })

});