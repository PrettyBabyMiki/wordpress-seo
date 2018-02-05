yoastWebpackJsonp([183],{

/***/ 376:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.fo = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "fo", pluralRuleFunction: function pluralRuleFunction(e, a) {
      return a ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "ár", relative: { 0: "í ár", 1: "næsta ár", "-1": "í fjør" }, relativeTime: { future: { one: "um {0} ár", other: "um {0} ár" }, past: { one: "{0} ár síðan", other: "{0} ár síðan" } } }, month: { displayName: "mánaður", relative: { 0: "henda mánaðin", 1: "næsta mánað", "-1": "seinasta mánað" }, relativeTime: { future: { one: "um {0} mánað", other: "um {0} mánaðir" }, past: { one: "{0} mánað síðan", other: "{0} mánaðir síðan" } } }, day: { displayName: "dagur", relative: { 0: "í dag", 1: "í morgin", 2: "í ovurmorgin", "-2": "fyrradagin", "-1": "í gjár" }, relativeTime: { future: { one: "um {0} dag", other: "um {0} dagar" }, past: { one: "{0} dagur síðan", other: "{0} dagar síðan" } } }, hour: { displayName: "tími", relative: { 0: "hendan tíman" }, relativeTime: { future: { one: "um {0} tíma", other: "um {0} tímar" }, past: { one: "{0} tími síðan", other: "{0} tímar síðan" } } }, minute: { displayName: "minuttur", relative: { 0: "hendan minuttin" }, relativeTime: { future: { one: "um {0} minutt", other: "um {0} minuttir" }, past: { one: "{0} minutt síðan", other: "{0} minuttir síðan" } } }, second: { displayName: "sekund", relative: { 0: "nú" }, relativeTime: { future: { one: "um {0} sekund", other: "um {0} sekund" }, past: { one: "{0} sekund síðan", other: "{0} sekund síðan" } } } } }, { locale: "fo-DK", parentLocale: "fo" }];
});

/***/ })

});