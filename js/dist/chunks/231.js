yoastWebpackJsonp([231],{

/***/ 328:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.ar = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "ar", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var r = String(e).split("."),
          o = Number(r[0]) == e && r[0].slice(-2);return a ? "other" : 0 == e ? "zero" : 1 == e ? "one" : 2 == e ? "two" : o >= 3 && o <= 10 ? "few" : o >= 11 && o <= 99 ? "many" : "other";
    }, fields: { year: { displayName: "السنة", relative: { 0: "السنة الحالية", 1: "السنة القادمة", "-1": "السنة الماضية" }, relativeTime: { future: { zero: "خلال {0} سنة", one: "خلال سنة واحدة", two: "خلال سنتين", few: "خلال {0} سنوات", many: "خلال {0} سنة", other: "خلال {0} سنة" }, past: { zero: "قبل {0} سنة", one: "قبل سنة واحدة", two: "قبل سنتين", few: "قبل {0} سنوات", many: "قبل {0} سنة", other: "قبل {0} سنة" } } }, month: { displayName: "الشهر", relative: { 0: "هذا الشهر", 1: "الشهر القادم", "-1": "الشهر الماضي" }, relativeTime: { future: { zero: "خلال {0} شهر", one: "خلال شهر واحد", two: "خلال شهرين", few: "خلال {0} أشهر", many: "خلال {0} شهرًا", other: "خلال {0} شهر" }, past: { zero: "قبل {0} شهر", one: "قبل شهر واحد", two: "قبل شهرين", few: "قبل {0} أشهر", many: "قبل {0} شهرًا", other: "قبل {0} شهر" } } }, day: { displayName: "يوم", relative: { 0: "اليوم", 1: "غدًا", 2: "بعد الغد", "-2": "أول أمس", "-1": "أمس" }, relativeTime: { future: { zero: "خلال {0} يوم", one: "خلال يوم واحد", two: "خلال يومين", few: "خلال {0} أيام", many: "خلال {0} يومًا", other: "خلال {0} يوم" }, past: { zero: "قبل {0} يوم", one: "قبل يوم واحد", two: "قبل يومين", few: "قبل {0} أيام", many: "قبل {0} يومًا", other: "قبل {0} يوم" } } }, hour: { displayName: "الساعات", relative: { 0: "الساعة الحالية" }, relativeTime: { future: { zero: "خلال {0} ساعة", one: "خلال ساعة واحدة", two: "خلال ساعتين", few: "خلال {0} ساعات", many: "خلال {0} ساعة", other: "خلال {0} ساعة" }, past: { zero: "قبل {0} ساعة", one: "قبل ساعة واحدة", two: "قبل ساعتين", few: "قبل {0} ساعات", many: "قبل {0} ساعة", other: "قبل {0} ساعة" } } }, minute: { displayName: "الدقائق", relative: { 0: "هذه الدقيقة" }, relativeTime: { future: { zero: "خلال {0} دقيقة", one: "خلال دقيقة واحدة", two: "خلال دقيقتين", few: "خلال {0} دقائق", many: "خلال {0} دقيقة", other: "خلال {0} دقيقة" }, past: { zero: "قبل {0} دقيقة", one: "قبل دقيقة واحدة", two: "قبل دقيقتين", few: "قبل {0} دقائق", many: "قبل {0} دقيقة", other: "قبل {0} دقيقة" } } }, second: { displayName: "الثواني", relative: { 0: "الآن" }, relativeTime: { future: { zero: "خلال {0} ثانية", one: "خلال ثانية واحدة", two: "خلال ثانيتين", few: "خلال {0} ثوانٍ", many: "خلال {0} ثانية", other: "خلال {0} ثانية" }, past: { zero: "قبل {0} ثانية", one: "قبل ثانية واحدة", two: "قبل ثانيتين", few: "قبل {0} ثوانِ", many: "قبل {0} ثانية", other: "قبل {0} ثانية" } } } } }, { locale: "ar-AE", parentLocale: "ar", fields: { year: { displayName: "السنة", relative: { 0: "هذه السنة", 1: "السنة التالية", "-1": "السنة الماضية" }, relativeTime: { future: { zero: "خلال {0} سنة", one: "خلال سنة واحدة", two: "خلال سنتين", few: "خلال {0} سنوات", many: "خلال {0} سنة", other: "خلال {0} سنة" }, past: { zero: "قبل {0} سنة", one: "قبل سنة واحدة", two: "قبل سنتين", few: "قبل {0} سنوات", many: "قبل {0} سنة", other: "قبل {0} سنة" } } }, month: { displayName: "الشهر", relative: { 0: "هذا الشهر", 1: "الشهر القادم", "-1": "الشهر الماضي" }, relativeTime: { future: { zero: "خلال {0} شهر", one: "خلال شهر واحد", two: "خلال شهرين", few: "خلال {0} أشهر", many: "خلال {0} شهرًا", other: "خلال {0} شهر" }, past: { zero: "قبل {0} شهر", one: "قبل شهر واحد", two: "قبل شهرين", few: "قبل {0} أشهر", many: "قبل {0} شهرًا", other: "قبل {0} شهر" } } }, day: { displayName: "يوم", relative: { 0: "اليوم", 1: "غدًا", 2: "بعد الغد", "-2": "أول أمس", "-1": "أمس" }, relativeTime: { future: { zero: "خلال {0} يوم", one: "خلال يوم واحد", two: "خلال يومين", few: "خلال {0} أيام", many: "خلال {0} يومًا", other: "خلال {0} يوم" }, past: { zero: "قبل {0} يوم", one: "قبل يوم واحد", two: "قبل يومين", few: "قبل {0} أيام", many: "قبل {0} يومًا", other: "قبل {0} يوم" } } }, hour: { displayName: "الساعات", relative: { 0: "الساعة الحالية" }, relativeTime: { future: { zero: "خلال {0} ساعة", one: "خلال ساعة واحدة", two: "خلال ساعتين", few: "خلال {0} ساعات", many: "خلال {0} ساعة", other: "خلال {0} ساعة" }, past: { zero: "قبل {0} ساعة", one: "قبل ساعة واحدة", two: "قبل ساعتين", few: "قبل {0} ساعات", many: "قبل {0} ساعة", other: "قبل {0} ساعة" } } }, minute: { displayName: "الدقائق", relative: { 0: "هذه الدقيقة" }, relativeTime: { future: { zero: "خلال {0} دقيقة", one: "خلال دقيقة واحدة", two: "خلال دقيقتين", few: "خلال {0} دقائق", many: "خلال {0} دقيقة", other: "خلال {0} دقيقة" }, past: { zero: "قبل {0} دقيقة", one: "قبل دقيقة واحدة", two: "قبل دقيقتين", few: "قبل {0} دقائق", many: "قبل {0} دقيقة", other: "قبل {0} دقيقة" } } }, second: { displayName: "الثواني", relative: { 0: "الآن" }, relativeTime: { future: { zero: "خلال {0} ثانية", one: "خلال ثانية واحدة", two: "خلال ثانيتين", few: "خلال {0} ثوانٍ", many: "خلال {0} ثانية", other: "خلال {0} ثانية" }, past: { zero: "قبل {0} ثانية", one: "قبل ثانية واحدة", two: "قبل ثانيتين", few: "قبل {0} ثوانِ", many: "قبل {0} ثانية", other: "قبل {0} ثانية" } } } } }, { locale: "ar-BH", parentLocale: "ar" }, { locale: "ar-DJ", parentLocale: "ar" }, { locale: "ar-DZ", parentLocale: "ar" }, { locale: "ar-EG", parentLocale: "ar" }, { locale: "ar-EH", parentLocale: "ar" }, { locale: "ar-ER", parentLocale: "ar" }, { locale: "ar-IL", parentLocale: "ar" }, { locale: "ar-IQ", parentLocale: "ar" }, { locale: "ar-JO", parentLocale: "ar" }, { locale: "ar-KM", parentLocale: "ar" }, { locale: "ar-KW", parentLocale: "ar" }, { locale: "ar-LB", parentLocale: "ar" }, { locale: "ar-LY", parentLocale: "ar" }, { locale: "ar-MA", parentLocale: "ar" }, { locale: "ar-MR", parentLocale: "ar" }, { locale: "ar-OM", parentLocale: "ar" }, { locale: "ar-PS", parentLocale: "ar" }, { locale: "ar-QA", parentLocale: "ar" }, { locale: "ar-SA", parentLocale: "ar" }, { locale: "ar-SD", parentLocale: "ar" }, { locale: "ar-SO", parentLocale: "ar" }, { locale: "ar-SS", parentLocale: "ar" }, { locale: "ar-SY", parentLocale: "ar" }, { locale: "ar-TD", parentLocale: "ar" }, { locale: "ar-TN", parentLocale: "ar" }, { locale: "ar-YE", parentLocale: "ar" }];
});

/***/ })

});