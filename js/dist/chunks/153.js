yoastWebpackJsonp([153],{

/***/ 406:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.jgo = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "jgo", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "Year", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { one: "Nǔu ŋguꞋ {0}", other: "Nǔu ŋguꞋ {0}" }, past: { one: "Ɛ́gɛ́ mɔ́ ŋguꞋ {0}", other: "Ɛ́gɛ́ mɔ́ ŋguꞋ {0}" } } }, month: { displayName: "Month", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { one: "Nǔu {0} saŋ", other: "Nǔu {0} saŋ" }, past: { one: "ɛ́ gɛ́ mɔ́ pɛsaŋ {0}", other: "ɛ́ gɛ́ mɔ́ pɛsaŋ {0}" } } }, day: { displayName: "Day", relative: { 0: "lɔꞋɔ", 1: "tomorrow", "-1": "yesterday" }, relativeTime: { future: { one: "Nǔu lɛ́Ꞌ {0}", other: "Nǔu lɛ́Ꞌ {0}" }, past: { one: "Ɛ́ gɛ́ mɔ́ lɛ́Ꞌ {0}", other: "Ɛ́ gɛ́ mɔ́ lɛ́Ꞌ {0}" } } }, hour: { displayName: "Hour", relative: { 0: "this hour" }, relativeTime: { future: { one: "nǔu háwa {0}", other: "nǔu háwa {0}" }, past: { one: "ɛ́ gɛ mɔ́ {0} háwa", other: "ɛ́ gɛ mɔ́ {0} háwa" } } }, minute: { displayName: "Minute", relative: { 0: "this minute" }, relativeTime: { future: { one: "nǔu {0} minút", other: "nǔu {0} minút" }, past: { one: "ɛ́ gɛ́ mɔ́ minút {0}", other: "ɛ́ gɛ́ mɔ́ minút {0}" } } }, second: { displayName: "Second", relative: { 0: "now" }, relativeTime: { future: { other: "+{0} s" }, past: { other: "-{0} s" } } } } }];
});

/***/ })

});