yoastWebpackJsonp([41],{

/***/ 518:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, a) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.sr = a());
}(undefined, function () {
  "use strict";
  return [{ locale: "sr", pluralRuleFunction: function pluralRuleFunction(e, a) {
      var t = String(e).split("."),
          r = t[0],
          o = t[1] || "",
          n = !t[1],
          i = r.slice(-1),
          l = r.slice(-2),
          s = o.slice(-1),
          u = o.slice(-2);return a ? "other" : n && 1 == i && 11 != l || 1 == s && 11 != u ? "one" : n && i >= 2 && i <= 4 && (l < 12 || l > 14) || s >= 2 && s <= 4 && (u < 12 || u > 14) ? "few" : "other";
    }, fields: { year: { displayName: "година", relative: { 0: "ове године", 1: "следеће године", "-1": "прошле године" }, relativeTime: { future: { one: "за {0} годину", few: "за {0} године", other: "за {0} година" }, past: { one: "пре {0} године", few: "пре {0} године", other: "пре {0} година" } } }, month: { displayName: "месец", relative: { 0: "овог месеца", 1: "следећег месеца", "-1": "прошлог месеца" }, relativeTime: { future: { one: "за {0} месец", few: "за {0} месеца", other: "за {0} месеци" }, past: { one: "пре {0} месеца", few: "пре {0} месеца", other: "пре {0} месеци" } } }, day: { displayName: "дан", relative: { 0: "данас", 1: "сутра", 2: "прекосутра", "-2": "прекјуче", "-1": "јуче" }, relativeTime: { future: { one: "за {0} дан", few: "за {0} дана", other: "за {0} дана" }, past: { one: "пре {0} дана", few: "пре {0} дана", other: "пре {0} дана" } } }, hour: { displayName: "сат", relative: { 0: "овог сата" }, relativeTime: { future: { one: "за {0} сат", few: "за {0} сата", other: "за {0} сати" }, past: { one: "пре {0} сата", few: "пре {0} сата", other: "пре {0} сати" } } }, minute: { displayName: "минут", relative: { 0: "овог минута" }, relativeTime: { future: { one: "за {0} минут", few: "за {0} минута", other: "за {0} минута" }, past: { one: "пре {0} минута", few: "пре {0} минута", other: "пре {0} минута" } } }, second: { displayName: "секунд", relative: { 0: "сада" }, relativeTime: { future: { one: "за {0} секунду", few: "за {0} секунде", other: "за {0} секунди" }, past: { one: "пре {0} секунде", few: "пре {0} секунде", other: "пре {0} секунди" } } } } }, { locale: "sr-Cyrl", parentLocale: "sr" }, { locale: "sr-Cyrl-BA", parentLocale: "sr-Cyrl" }, { locale: "sr-Cyrl-ME", parentLocale: "sr-Cyrl" }, { locale: "sr-Cyrl-XK", parentLocale: "sr-Cyrl" }, { locale: "sr-Latn", pluralRuleFunction: function pluralRuleFunction(e, a) {
      return "other";
    }, fields: { year: { displayName: "godina", relative: { 0: "ove godine", 1: "sledeće godine", "-1": "prošle godine" }, relativeTime: { future: { one: "za {0} godinu", few: "za {0} godine", other: "za {0} godina" }, past: { one: "pre {0} godine", few: "pre {0} godine", other: "pre {0} godina" } } }, month: { displayName: "mesec", relative: { 0: "ovog meseca", 1: "sledećeg meseca", "-1": "prošlog meseca" }, relativeTime: { future: { one: "za {0} mesec", few: "za {0} meseca", other: "za {0} meseci" }, past: { one: "pre {0} meseca", few: "pre {0} meseca", other: "pre {0} meseci" } } }, day: { displayName: "dan", relative: { 0: "danas", 1: "sutra", 2: "prekosutra", "-2": "prekjuče", "-1": "juče" }, relativeTime: { future: { one: "za {0} dan", few: "za {0} dana", other: "za {0} dana" }, past: { one: "pre {0} dana", few: "pre {0} dana", other: "pre {0} dana" } } }, hour: { displayName: "sat", relative: { 0: "ovog sata" }, relativeTime: { future: { one: "za {0} sat", few: "za {0} sata", other: "za {0} sati" }, past: { one: "pre {0} sata", few: "pre {0} sata", other: "pre {0} sati" } } }, minute: { displayName: "minut", relative: { 0: "ovog minuta" }, relativeTime: { future: { one: "za {0} minut", few: "za {0} minuta", other: "za {0} minuta" }, past: { one: "pre {0} minuta", few: "pre {0} minuta", other: "pre {0} minuta" } } }, second: { displayName: "sekund", relative: { 0: "sada" }, relativeTime: { future: { one: "za {0} sekundu", few: "za {0} sekunde", other: "za {0} sekundi" }, past: { one: "pre {0} sekunde", few: "pre {0} sekunde", other: "pre {0} sekundi" } } } } }, { locale: "sr-Latn-BA", parentLocale: "sr-Latn" }, { locale: "sr-Latn-ME", parentLocale: "sr-Latn" }, { locale: "sr-Latn-XK", parentLocale: "sr-Latn" }];
});

/***/ })

});