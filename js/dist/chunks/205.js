yoastWebpackJsonp([205],{375:function(module,exports,__webpack_require__){"use strict";eval('var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };\n\n!function (e, t) {\n  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === \'function\' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :\n\t\t\t\t__WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.da = t());\n}(undefined, function () {\n  "use strict";\n  return [{ locale: "da", pluralRuleFunction: function pluralRuleFunction(e, t) {\n      var r = String(e).split("."),\n          n = r[0],\n          o = Number(r[0]) == e;return t ? "other" : 1 != e && (o || 0 != n && 1 != n) ? "other" : "one";\n    }, fields: { year: { displayName: "år", relative: { 0: "i år", 1: "næste år", "-1": "sidste år" }, relativeTime: { future: { one: "om {0} år", other: "om {0} år" }, past: { one: "for {0} år siden", other: "for {0} år siden" } } }, month: { displayName: "måned", relative: { 0: "denne måned", 1: "næste måned", "-1": "sidste måned" }, relativeTime: { future: { one: "om {0} måned", other: "om {0} måneder" }, past: { one: "for {0} måned siden", other: "for {0} måneder siden" } } }, day: { displayName: "dag", relative: { 0: "i dag", 1: "i morgen", 2: "i overmorgen", "-2": "i forgårs", "-1": "i går" }, relativeTime: { future: { one: "om {0} dag", other: "om {0} dage" }, past: { one: "for {0} dag siden", other: "for {0} dage siden" } } }, hour: { displayName: "time", relative: { 0: "i den kommende time" }, relativeTime: { future: { one: "om {0} time", other: "om {0} timer" }, past: { one: "for {0} time siden", other: "for {0} timer siden" } } }, minute: { displayName: "minut", relative: { 0: "i det kommende minut" }, relativeTime: { future: { one: "om {0} minut", other: "om {0} minutter" }, past: { one: "for {0} minut siden", other: "for {0} minutter siden" } } }, second: { displayName: "sekund", relative: { 0: "nu" }, relativeTime: { future: { one: "om {0} sekund", other: "om {0} sekunder" }, past: { one: "for {0} sekund siden", other: "for {0} sekunder siden" } } } } }, { locale: "da-GL", parentLocale: "da" }];\n});\n\n//////////////////\n// WEBPACK FOOTER\n// /Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/react-intl/locale-data/da.js\n// module id = 375\n// module chunks = 205\n\n//# sourceURL=webpack:////Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/react-intl/locale-data/da.js?')}});