yoastWebpackJsonp([167],{

/***/ 413:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; };\n\n!function (e, a) {\n  \"object\" == ( false ? \"undefined\" : _typeof(exports)) && \"undefined\" != typeof module ? module.exports = a() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (a),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?\n\t\t\t\t(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :\n\t\t\t\t__WEBPACK_AMD_DEFINE_FACTORY__),\n\t\t\t\t__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.hr = a());\n}(undefined, function () {\n  \"use strict\";\n  return [{ locale: \"hr\", pluralRuleFunction: function pluralRuleFunction(e, a) {\n      var i = String(e).split(\".\"),\n          t = i[0],\n          r = i[1] || \"\",\n          n = !i[1],\n          o = t.slice(-1),\n          s = t.slice(-2),\n          u = r.slice(-1),\n          d = r.slice(-2);return a ? \"other\" : n && 1 == o && 11 != s || 1 == u && 11 != d ? \"one\" : n && o >= 2 && o <= 4 && (s < 12 || s > 14) || u >= 2 && u <= 4 && (d < 12 || d > 14) ? \"few\" : \"other\";\n    }, fields: { year: { displayName: \"godina\", relative: { 0: \"ove godine\", 1: \"sljedeće godine\", \"-1\": \"prošle godine\" }, relativeTime: { future: { one: \"za {0} godinu\", few: \"za {0} godine\", other: \"za {0} godina\" }, past: { one: \"prije {0} godinu\", few: \"prije {0} godine\", other: \"prije {0} godina\" } } }, month: { displayName: \"mjesec\", relative: { 0: \"ovaj mjesec\", 1: \"sljedeći mjesec\", \"-1\": \"prošli mjesec\" }, relativeTime: { future: { one: \"za {0} mjesec\", few: \"za {0} mjeseca\", other: \"za {0} mjeseci\" }, past: { one: \"prije {0} mjesec\", few: \"prije {0} mjeseca\", other: \"prije {0} mjeseci\" } } }, day: { displayName: \"dan\", relative: { 0: \"danas\", 1: \"sutra\", 2: \"prekosutra\", \"-2\": \"prekjučer\", \"-1\": \"jučer\" }, relativeTime: { future: { one: \"za {0} dan\", few: \"za {0} dana\", other: \"za {0} dana\" }, past: { one: \"prije {0} dan\", few: \"prije {0} dana\", other: \"prije {0} dana\" } } }, hour: { displayName: \"sat\", relative: { 0: \"ovaj sat\" }, relativeTime: { future: { one: \"za {0} sat\", few: \"za {0} sata\", other: \"za {0} sati\" }, past: { one: \"prije {0} sat\", few: \"prije {0} sata\", other: \"prije {0} sati\" } } }, minute: { displayName: \"minuta\", relative: { 0: \"ova minuta\" }, relativeTime: { future: { one: \"za {0} minutu\", few: \"za {0} minute\", other: \"za {0} minuta\" }, past: { one: \"prije {0} minutu\", few: \"prije {0} minute\", other: \"prije {0} minuta\" } } }, second: { displayName: \"sekunda\", relative: { 0: \"sad\" }, relativeTime: { future: { one: \"za {0} sekundu\", few: \"za {0} sekunde\", other: \"za {0} sekundi\" }, past: { one: \"prije {0} sekundu\", few: \"prije {0} sekunde\", other: \"prije {0} sekundi\" } } } } }, { locale: \"hr-BA\", parentLocale: \"hr\" }];\n});\n\n//////////////////\n// WEBPACK FOOTER\n// /Users/joostdevalk/Code/GitHub/wordpress-seo/node_modules/react-intl/locale-data/hr.js\n// module id = 413\n// module chunks = 167\n\n//# sourceURL=webpack:////Users/joostdevalk/Code/GitHub/wordpress-seo/node_modules/react-intl/locale-data/hr.js?");

/***/ })

});