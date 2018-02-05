yoastWebpackJsonp([167],{

/***/ 392:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.hr = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "hr", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var i = String(e).split("."),
          t = i[0],
          r = i[1] || "",
          n = !i[1],
          o = t.slice(-1),
          s = t.slice(-2),
          u = r.slice(-1),
          d = r.slice(-2);return a ? "other" : n && 1 == o && 11 != s || 1 == u && 11 != d ? "one" : n && o >= 2 && o <= 4 && (s < 12 || s > 14) || u >= 2 && u <= 4 && (d < 12 || d > 14) ? "few" : "other";
    }, fields: { year: { displayName: "godina", relative: { 0: "ove godine", 1: "sljedeće godine", "-1": "prošle godine" }, relativeTime: { future: { one: "za {0} godinu", few: "za {0} godine", other: "za {0} godina" }, past: { one: "prije {0} godinu", few: "prije {0} godine", other: "prije {0} godina" } } }, month: { displayName: "mjesec", relative: { 0: "ovaj mjesec", 1: "sljedeći mjesec", "-1": "prošli mjesec" }, relativeTime: { future: { one: "za {0} mjesec", few: "za {0} mjeseca", other: "za {0} mjeseci" }, past: { one: "prije {0} mjesec", few: "prije {0} mjeseca", other: "prije {0} mjeseci" } } }, day: { displayName: "dan", relative: { 0: "danas", 1: "sutra", 2: "prekosutra", "-2": "prekjučer", "-1": "jučer" }, relativeTime: { future: { one: "za {0} dan", few: "za {0} dana", other: "za {0} dana" }, past: { one: "prije {0} dan", few: "prije {0} dana", other: "prije {0} dana" } } }, hour: { displayName: "sat", relative: { 0: "ovaj sat" }, relativeTime: { future: { one: "za {0} sat", few: "za {0} sata", other: "za {0} sati" }, past: { one: "prije {0} sat", few: "prije {0} sata", other: "prije {0} sati" } } }, minute: { displayName: "minuta", relative: { 0: "ova minuta" }, relativeTime: { future: { one: "za {0} minutu", few: "za {0} minute", other: "za {0} minuta" }, past: { one: "prije {0} minutu", few: "prije {0} minute", other: "prije {0} minuta" } } }, second: { displayName: "sekunda", relative: { 0: "sad" }, relativeTime: { future: { one: "za {0} sekundu", few: "za {0} sekunde", other: "za {0} sekundi" }, past: { one: "prije {0} sekundu", few: "prije {0} sekunde", other: "prije {0} sekundi" } } } } }, { locale: "hr-BA", parentLocale: "hr" }];
});

/***/ })

});