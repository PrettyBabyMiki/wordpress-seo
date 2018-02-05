yoastWebpackJsonp([17],{

/***/ 542:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.uz = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "uz", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return t ? "other" : 1 == e ? "one" : "other";
    }, fields: { year: { displayName: "yil", relative: { 0: "shu yil", 1: "keyingi yil", "-1": "o‘tgan yil" }, relativeTime: { future: { one: "{0} yildan keyin", other: "{0} yildan keyin" }, past: { one: "{0} yil oldin", other: "{0} yil oldin" } } }, month: { displayName: "oy", relative: { 0: "shu oy", 1: "keyingi oy", "-1": "o‘tgan oy" }, relativeTime: { future: { one: "{0} oydan keyin", other: "{0} oydan keyin" }, past: { one: "{0} oy oldin", other: "{0} oy oldin" } } }, day: { displayName: "kun", relative: { 0: "bugun", 1: "ertaga", "-1": "kecha" }, relativeTime: { future: { one: "{0} kundan keyin", other: "{0} kundan keyin" }, past: { one: "{0} kun oldin", other: "{0} kun oldin" } } }, hour: { displayName: "soat", relative: { 0: "shu soatda" }, relativeTime: { future: { one: "{0} soatdan keyin", other: "{0} soatdan keyin" }, past: { one: "{0} soat oldin", other: "{0} soat oldin" } } }, minute: { displayName: "daqiqa", relative: { 0: "shu daqiqada" }, relativeTime: { future: { one: "{0} daqiqadan keyin", other: "{0} daqiqadan keyin" }, past: { one: "{0} daqiqa oldin", other: "{0} daqiqa oldin" } } }, second: { displayName: "soniya", relative: { 0: "hozir" }, relativeTime: { future: { one: "{0} soniyadan keyin", other: "{0} soniyadan keyin" }, past: { one: "{0} soniya oldin", other: "{0} soniya oldin" } } } } }, { locale: "uz-Arab", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return "other";
    }, fields: { year: { displayName: "Year", relative: { 0: "this year", 1: "next year", "-1": "last year" }, relativeTime: { future: { other: "+{0} y" }, past: { other: "-{0} y" } } }, month: { displayName: "Month", relative: { 0: "this month", 1: "next month", "-1": "last month" }, relativeTime: { future: { other: "+{0} m" }, past: { other: "-{0} m" } } }, day: { displayName: "Day", relative: { 0: "today", 1: "tomorrow", "-1": "yesterday" }, relativeTime: { future: { other: "+{0} d" }, past: { other: "-{0} d" } } }, hour: { displayName: "Hour", relative: { 0: "this hour" }, relativeTime: { future: { other: "+{0} h" }, past: { other: "-{0} h" } } }, minute: { displayName: "Minute", relative: { 0: "this minute" }, relativeTime: { future: { other: "+{0} min" }, past: { other: "-{0} min" } } }, second: { displayName: "Second", relative: { 0: "now" }, relativeTime: { future: { other: "+{0} s" }, past: { other: "-{0} s" } } } } }, { locale: "uz-Cyrl", pluralRuleFunction: function pluralRuleFunction(e, t) {
      return "other";
    }, fields: { year: { displayName: "Йил", relative: { 0: "бу йил", 1: "кейинги йил", "-1": "ўтган йил" }, relativeTime: { future: { one: "{0} йилдан сўнг", other: "{0} йилдан сўнг" }, past: { one: "{0} йил аввал", other: "{0} йил аввал" } } }, month: { displayName: "Ой", relative: { 0: "бу ой", 1: "кейинги ой", "-1": "ўтган ой" }, relativeTime: { future: { one: "{0} ойдан сўнг", other: "{0} ойдан сўнг" }, past: { one: "{0} ой аввал", other: "{0} ой аввал" } } }, day: { displayName: "Кун", relative: { 0: "бугун", 1: "эртага", "-1": "кеча" }, relativeTime: { future: { one: "{0} кундан сўнг", other: "{0} кундан сўнг" }, past: { one: "{0} кун олдин", other: "{0} кун олдин" } } }, hour: { displayName: "Соат", relative: { 0: "this hour" }, relativeTime: { future: { one: "{0} соатдан сўнг", other: "{0} соатдан сўнг" }, past: { one: "{0} соат олдин", other: "{0} соат олдин" } } }, minute: { displayName: "Дақиқа", relative: { 0: "this minute" }, relativeTime: { future: { one: "{0} дақиқадан сўнг", other: "{0} дақиқадан сўнг" }, past: { one: "{0} дақиқа олдин", other: "{0} дақиқа олдин" } } }, second: { displayName: "Сония", relative: { 0: "ҳозир" }, relativeTime: { future: { one: "{0} сониядан сўнг", other: "{0} сониядан сўнг" }, past: { one: "{0} сония олдин", other: "{0} сония олдин" } } } } }, { locale: "uz-Latn", parentLocale: "uz" }];
});

/***/ })

});