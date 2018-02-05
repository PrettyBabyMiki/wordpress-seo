yoastWebpackJsonp([187],{

/***/ 372:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.fa = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "fa", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : e >= 0 && e <= 1 ? "one" : "other";
    }, fields: { year: { displayName: "سال", relative: { 0: "امسال", 1: "سال آینده", "-1": "سال گذشته" }, relativeTime: { future: { one: "{0} سال بعد", other: "{0} سال بعد" }, past: { one: "{0} سال پیش", other: "{0} سال پیش" } } }, month: { displayName: "ماه", relative: { 0: "این ماه", 1: "ماه آینده", "-1": "ماه گذشته" }, relativeTime: { future: { one: "{0} ماه بعد", other: "{0} ماه بعد" }, past: { one: "{0} ماه پیش", other: "{0} ماه پیش" } } }, day: { displayName: "روز", relative: { 0: "امروز", 1: "فردا", 2: "پس‌فردا", "-2": "پریروز", "-1": "دیروز" }, relativeTime: { future: { one: "{0} روز بعد", other: "{0} روز بعد" }, past: { one: "{0} روز پیش", other: "{0} روز پیش" } } }, hour: { displayName: "ساعت", relative: { 0: "همین ساعت" }, relativeTime: { future: { one: "{0} ساعت بعد", other: "{0} ساعت بعد" }, past: { one: "{0} ساعت پیش", other: "{0} ساعت پیش" } } }, minute: { displayName: "دقیقه", relative: { 0: "همین دقیقه" }, relativeTime: { future: { one: "{0} دقیقه بعد", other: "{0} دقیقه بعد" }, past: { one: "{0} دقیقه پیش", other: "{0} دقیقه پیش" } } }, second: { displayName: "ثانیه", relative: { 0: "اکنون" }, relativeTime: { future: { one: "{0} ثانیه بعد", other: "{0} ثانیه بعد" }, past: { one: "{0} ثانیه پیش", other: "{0} ثانیه پیش" } } } } }, { locale: "fa-AF", parentLocale: "fa" }];
});

/***/ })

});