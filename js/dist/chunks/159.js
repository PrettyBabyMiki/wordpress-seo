yoastWebpackJsonp([159],{

/***/ 400:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, r) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = r() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (r),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.is = r());
}(undefined, function () {
  "use strict";
  return [{ locale: "is", pluralRuleFunction: function pluralRuleFunction(e, r) {
      var t = String(e).split("."),
          i = t[0],
          u = Number(t[0]) == e,
          a = i.slice(-1),
          n = i.slice(-2);return r ? "other" : u && 1 == a && 11 != n || !u ? "one" : "other";
    }, fields: { year: { displayName: "ár", relative: { 0: "á þessu ári", 1: "á næsta ári", "-1": "á síðasta ári" }, relativeTime: { future: { one: "eftir {0} ár", other: "eftir {0} ár" }, past: { one: "fyrir {0} ári", other: "fyrir {0} árum" } } }, month: { displayName: "mánuður", relative: { 0: "í þessum mánuði", 1: "í næsta mánuði", "-1": "í síðasta mánuði" }, relativeTime: { future: { one: "eftir {0} mánuð", other: "eftir {0} mánuði" }, past: { one: "fyrir {0} mánuði", other: "fyrir {0} mánuðum" } } }, day: { displayName: "dagur", relative: { 0: "í dag", 1: "á morgun", 2: "eftir tvo daga", "-2": "í fyrradag", "-1": "í gær" }, relativeTime: { future: { one: "eftir {0} dag", other: "eftir {0} daga" }, past: { one: "fyrir {0} degi", other: "fyrir {0} dögum" } } }, hour: { displayName: "klukkustund", relative: { 0: "this hour" }, relativeTime: { future: { one: "eftir {0} klukkustund", other: "eftir {0} klukkustundir" }, past: { one: "fyrir {0} klukkustund", other: "fyrir {0} klukkustundum" } } }, minute: { displayName: "mínúta", relative: { 0: "this minute" }, relativeTime: { future: { one: "eftir {0} mínútu", other: "eftir {0} mínútur" }, past: { one: "fyrir {0} mínútu", other: "fyrir {0} mínútum" } } }, second: { displayName: "sekúnda", relative: { 0: "núna" }, relativeTime: { future: { one: "eftir {0} sekúndu", other: "eftir {0} sekúndur" }, past: { one: "fyrir {0} sekúndu", other: "fyrir {0} sekúndum" } } } } }];
});

/***/ })

});