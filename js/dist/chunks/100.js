yoastWebpackJsonp([100],{

/***/ 459:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.mt = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "mt", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var t = String(e).split("."),
          i = Number(t[0]) == e && t[0].slice(-2);return a ? "other" : 1 == e ? "one" : 0 == e || i >= 2 && i <= 10 ? "few" : i >= 11 && i <= 19 ? "many" : "other";
    }, fields: { year: { displayName: "Sena", relative: { 0: "din is-sena", 1: "Is-sena d-dieħla", "-1": "Is-sena li għaddiet" }, relativeTime: { future: { other: "+{0} y" }, past: { one: "{0} sena ilu", few: "{0} snin ilu", many: "{0} snin ilu", other: "{0} snin ilu" } } }, month: { displayName: "Xahar", relative: { 0: "Dan ix-xahar", 1: "Ix-xahar id-dieħel", "-1": "Ix-xahar li għadda" }, relativeTime: { future: { other: "+{0} m" }, past: { other: "-{0} m" } } }, day: { displayName: "Jum", relative: { 0: "Illum", 1: "Għada", "-1": "Ilbieraħ" }, relativeTime: { future: { other: "+{0} d" }, past: { other: "-{0} d" } } }, hour: { displayName: "Siegħa", relative: { 0: "this hour" }, relativeTime: { future: { other: "+{0} h" }, past: { other: "-{0} h" } } }, minute: { displayName: "Minuta", relative: { 0: "this minute" }, relativeTime: { future: { other: "+{0} min" }, past: { other: "-{0} min" } } }, second: { displayName: "Sekonda", relative: { 0: "now" }, relativeTime: { future: { other: "+{0} s" }, past: { other: "-{0} s" } } } } }];
});

/***/ })

});