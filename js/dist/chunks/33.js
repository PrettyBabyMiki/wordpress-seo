yoastWebpackJsonp([33],{

/***/ 526:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.te = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "te", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "సంవత్సరం", relative: { 0: "ఈ సంవత్సరం", 1: "తదుపరి సంవత్సరం", "-1": "గత సంవత్సరం" }, relativeTime: { future: { one: "{0} సంవత్సరంలో", other: "{0} సంవత్సరాల్లో" }, past: { one: "{0} సంవత్సరం క్రితం", other: "{0} సంవత్సరాల క్రితం" } } }, month: { displayName: "నెల", relative: { 0: "ఈ నెల", 1: "తదుపరి నెల", "-1": "గత నెల" }, relativeTime: { future: { one: "{0} నెలలో", other: "{0} నెలల్లో" }, past: { one: "{0} నెల క్రితం", other: "{0} నెలల క్రితం" } } }, day: { displayName: "దినం", relative: { 0: "ఈ రోజు", 1: "రేపు", 2: "ఎల్లుండి", "-2": "మొన్న", "-1": "నిన్న" }, relativeTime: { future: { one: "{0} రోజులో", other: "{0} రోజుల్లో" }, past: { one: "{0} రోజు క్రితం", other: "{0} రోజుల క్రితం" } } }, hour: { displayName: "గంట", relative: { 0: "ఈ గంట" }, relativeTime: { future: { one: "{0} గంటలో", other: "{0} గంటల్లో" }, past: { one: "{0} గంట క్రితం", other: "{0} గంటల క్రితం" } } }, minute: { displayName: "నిమిషము", relative: { 0: "ఈ నిమిషం" }, relativeTime: { future: { one: "{0} నిమిషంలో", other: "{0} నిమిషాల్లో" }, past: { one: "{0} నిమిషం క్రితం", other: "{0} నిమిషాల క్రితం" } } }, second: { displayName: "సెకను", relative: { 0: "ప్రస్తుతం" }, relativeTime: { future: { one: "{0} సెకనులో", other: "{0} సెకన్లలో" }, past: { one: "{0} సెకను క్రితం", other: "{0} సెకన్ల క్రితం" } } } } }];
});

/***/ })

});