yoastWebpackJsonp([119],{

/***/ 440:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.lo = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "lo", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t && 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "ປີ", relative: { 0: "ປີນີ້", 1: "ປີໜ້າ", "-1": "ປີກາຍ" }, relativeTime: { future: { other: "ໃນອີກ {0} ປີ" }, past: { other: "{0} ປີກ່ອນ" } } }, month: { displayName: "ເດືອນ", relative: { 0: "ເດືອນນີ້", 1: "ເດືອນໜ້າ", "-1": "ເດືອນແລ້ວ" }, relativeTime: { future: { other: "ໃນອີກ {0} ເດືອນ" }, past: { other: "{0} ເດືອນກ່ອນ" } } }, day: { displayName: "ມື້", relative: { 0: "ມື້ນີ້", 1: "ມື້ອື່ນ", 2: "ມື້ຮື", "-2": "ມື້ກ່ອນ", "-1": "ມື້ວານ" }, relativeTime: { future: { other: "ໃນອີກ {0} ມື້" }, past: { other: "{0} ມື້ກ່ອນ" } } }, hour: { displayName: "ຊົ່ວໂມງ", relative: { 0: "ຊົ່ວໂມງນີ້" }, relativeTime: { future: { other: "ໃນອີກ {0} ຊົ່ວໂມງ" }, past: { other: "{0} ຊົ່ວໂມງກ່ອນ" } } }, minute: { displayName: "ນາທີ", relative: { 0: "ນາທີນີ້" }, relativeTime: { future: { other: "{0} ໃນອີກ 0 ນາທີ" }, past: { other: "{0} ນາທີກ່ອນ" } } }, second: { displayName: "ວິນາທີ", relative: { 0: "ຕອນນີ້" }, relativeTime: { future: { other: "ໃນອີກ {0} ວິນາທີ" }, past: { other: "{0} ວິນາທີກ່ອນ" } } } } }];
});

/***/ })

});