yoastWebpackJsonp([113],{

/***/ 446:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.lv = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "lv", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var i = String(e).split("."),
          t = i[1] || "",
          n = t.length,
          m = Number(i[0]) == e,
          r = m && i[0].slice(-1),
          s = m && i[0].slice(-2),
          o = t.slice(-2),
          p = t.slice(-1);return a ? "other" : m && 0 == r || s >= 11 && s <= 19 || 2 == n && o >= 11 && o <= 19 ? "zero" : 1 == r && 11 != s || 2 == n && 1 == p && 11 != o || 2 != n && 1 == p ? "one" : "other";
    }, fields: { year: { displayName: "gads", relative: { 0: "šajā gadā", 1: "nākamajā gadā", "-1": "pagājušajā gadā" }, relativeTime: { future: { zero: "pēc {0} gadiem", one: "pēc {0} gada", other: "pēc {0} gadiem" }, past: { zero: "pirms {0} gadiem", one: "pirms {0} gada", other: "pirms {0} gadiem" } } }, month: { displayName: "mēnesis", relative: { 0: "šajā mēnesī", 1: "nākamajā mēnesī", "-1": "pagājušajā mēnesī" }, relativeTime: { future: { zero: "pēc {0} mēnešiem", one: "pēc {0} mēneša", other: "pēc {0} mēnešiem" }, past: { zero: "pirms {0} mēnešiem", one: "pirms {0} mēneša", other: "pirms {0} mēnešiem" } } }, day: { displayName: "diena", relative: { 0: "šodien", 1: "rīt", 2: "parīt", "-2": "aizvakar", "-1": "vakar" }, relativeTime: { future: { zero: "pēc {0} dienām", one: "pēc {0} dienas", other: "pēc {0} dienām" }, past: { zero: "pirms {0} dienām", one: "pirms {0} dienas", other: "pirms {0} dienām" } } }, hour: { displayName: "stundas", relative: { 0: "šajā stundā" }, relativeTime: { future: { zero: "pēc {0} stundām", one: "pēc {0} stundas", other: "pēc {0} stundām" }, past: { zero: "pirms {0} stundām", one: "pirms {0} stundas", other: "pirms {0} stundām" } } }, minute: { displayName: "minūtes", relative: { 0: "šajā minūtē" }, relativeTime: { future: { zero: "pēc {0} minūtēm", one: "pēc {0} minūtes", other: "pēc {0} minūtēm" }, past: { zero: "pirms {0} minūtēm", one: "pirms {0} minūtes", other: "pirms {0} minūtēm" } } }, second: { displayName: "sekundes", relative: { 0: "tagad" }, relativeTime: { future: { zero: "pēc {0} sekundēm", one: "pēc {0} sekundes", other: "pēc {0} sekundēm" }, past: { zero: "pirms {0} sekundēm", one: "pirms {0} sekundes", other: "pirms {0} sekundēm" } } } } }];
});

/***/ })

});