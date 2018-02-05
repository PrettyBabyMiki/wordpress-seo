yoastWebpackJsonp([51],{

/***/ 508:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, o) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = o() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (o),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.sk = o());
}(undefined, function () {
  "use strict";
  return [{ locale: "sk", pluralRuleFunction: function pluralRuleFunction(e, o) {
      var a = String(e).split("."),
          t = a[0],
          i = !a[1];return o ? "other" : 1 == e && i ? "one" : t >= 2 && t <= 4 && i ? "few" : i ? "other" : "many";
    }, fields: { year: { displayName: "rok", relative: { 0: "tento rok", 1: "budúci rok", "-1": "minulý rok" }, relativeTime: { future: { one: "o {0} rok", few: "o {0} roky", many: "o {0} roka", other: "o {0} rokov" }, past: { one: "pred {0} rokom", few: "pred {0} rokmi", many: "pred {0} roka", other: "pred {0} rokmi" } } }, month: { displayName: "mesiac", relative: { 0: "tento mesiac", 1: "budúci mesiac", "-1": "minulý mesiac" }, relativeTime: { future: { one: "o {0} mesiac", few: "o {0} mesiace", many: "o {0} mesiaca", other: "o {0} mesiacov" }, past: { one: "pred {0} mesiacom", few: "pred {0} mesiacmi", many: "pred {0} mesiaca", other: "pred {0} mesiacmi" } } }, day: { displayName: "deň", relative: { 0: "dnes", 1: "zajtra", 2: "pozajtra", "-2": "predvčerom", "-1": "včera" }, relativeTime: { future: { one: "o {0} deň", few: "o {0} dni", many: "o {0} dňa", other: "o {0} dní" }, past: { one: "pred {0} dňom", few: "pred {0} dňami", many: "pred {0} dňa", other: "pred {0} dňami" } } }, hour: { displayName: "hodina", relative: { 0: "v tejto hodine" }, relativeTime: { future: { one: "o {0} hodinu", few: "o {0} hodiny", many: "o {0} hodiny", other: "o {0} hodín" }, past: { one: "pred {0} hodinou", few: "pred {0} hodinami", many: "pred {0} hodinou", other: "pred {0} hodinami" } } }, minute: { displayName: "minúta", relative: { 0: "v tejto minúte" }, relativeTime: { future: { one: "o {0} minútu", few: "o {0} minúty", many: "o {0} minúty", other: "o {0} minút" }, past: { one: "pred {0} minútou", few: "pred {0} minútami", many: "pred {0} minúty", other: "pred {0} minútami" } } }, second: { displayName: "sekunda", relative: { 0: "teraz" }, relativeTime: { future: { one: "o {0} sekundu", few: "o {0} sekundy", many: "o {0} sekundy", other: "o {0} sekúnd" }, past: { one: "pred {0} sekundou", few: "pred {0} sekundami", many: "pred {0} sekundy", other: "pred {0} sekundami" } } } } }];
});

/***/ })

});