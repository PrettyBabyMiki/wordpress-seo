yoastWebpackJsonp([226],{

/***/ 333:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.az = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "az", pluralRuleFunction: function pluralRuleFunction(e, t) {
      var a = String(e).split(".")[0],
          r = a.slice(-1),
          i = a.slice(-2),
          n = a.slice(-3);return t ? 1 == r || 2 == r || 5 == r || 7 == r || 8 == r || 20 == i || 50 == i || 70 == i || 80 == i ? "one" : 3 == r || 4 == r || 100 == n || 200 == n || 300 == n || 400 == n || 500 == n || 600 == n || 700 == n || 800 == n || 900 == n ? "few" : 0 == a || 6 == r || 40 == i || 60 == i || 90 == i ? "many" : "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "İl", relative: { 0: "bu il", 1: "gələn il", "-1": "keçən il" }, relativeTime: { future: { one: "{0} il ərzində", other: "{0} il ərzində" }, past: { one: "{0} il öncə", other: "{0} il öncə" } } }, month: { displayName: "Ay", relative: { 0: "bu ay", 1: "gələn ay", "-1": "keçən ay" }, relativeTime: { future: { one: "{0} ay ərzində", other: "{0} ay ərzində" }, past: { one: "{0} ay öncə", other: "{0} ay öncə" } } }, day: { displayName: "Gün", relative: { 0: "bu gün", 1: "sabah", "-1": "dünən" }, relativeTime: { future: { one: "{0} gün ərzində", other: "{0} gün ərzində" }, past: { one: "{0} gün öncə", other: "{0} gün öncə" } } }, hour: { displayName: "Saat", relative: { 0: "bu saat" }, relativeTime: { future: { one: "{0} saat ərzində", other: "{0} saat ərzində" }, past: { one: "{0} saat öncə", other: "{0} saat öncə" } } }, minute: { displayName: "Dəqiqə", relative: { 0: "bu dəqiqə" }, relativeTime: { future: { one: "{0} dəqiqə ərzində", other: "{0} dəqiqə ərzində" }, past: { one: "{0} dəqiqə öncə", other: "{0} dəqiqə öncə" } } }, second: { displayName: "Saniyə", relative: { 0: "indi" }, relativeTime: { future: { one: "{0} saniyə ərzində", other: "{0} saniyə ərzində" }, past: { one: "{0} saniyə öncə", other: "{0} saniyə öncə" } } } } }, { locale: "az-Arab", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return "other";
    }, fields: { year: { displayName: "Year", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { other: "+{0} y" }, past: { other: "-{0} y" } } }, month: { displayName: "Month", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { other: "+{0} m" }, past: { other: "-{0} m" } } }, day: { displayName: "Day", relative: { 0: "today", 1: "tomorrow", "-1": "yesterday" }, relativeTime: { future: { other: "+{0} d" }, past: { other: "-{0} d" } } }, hour: { displayName: "Hour", relative: { 0: "this hour" }, relativeTime: { future: { other: "+{0} h" }, past: { other: "-{0} h" } } }, minute: { displayName: "Minute", relative: { 0: "this minute" }, relativeTime: { future: { other: "+{0} min" }, past: { other: "-{0} min" } } }, second: { displayName: "Second", relative: { 0: "now" }, relativeTime: { future: { other: "+{0} s" }, past: { other: "-{0} s" } } } } }, { locale: "az-Cyrl", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return "other";
    }, fields: { year: { displayName: "Year", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { other: "+{0} y" }, past: { other: "-{0} y" } } }, month: { displayName: "Month", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { other: "+{0} m" }, past: { other: "-{0} m" } } }, day: { displayName: "Day", relative: { 0: "today", 1: "tomorrow", "-1": "yesterday" }, relativeTime: { future: { other: "+{0} d" }, past: { other: "-{0} d" } } }, hour: { displayName: "Hour", relative: { 0: "this hour" }, relativeTime: { future: { other: "+{0} h" }, past: { other: "-{0} h" } } }, minute: { displayName: "Minute", relative: { 0: "this minute" }, relativeTime: { future: { other: "+{0} min" }, past: { other: "-{0} min" } } }, second: { displayName: "Second", relative: { 0: "now" }, relativeTime: { future: { other: "+{0} s" }, past: { other: "-{0} s" } } } } }, { locale: "az-Latn", parentLocale: "az" }];
});

/***/ })

});