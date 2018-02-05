yoastWebpackJsonp([71],{

/***/ 488:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

!function (e, t) {
  "object" == ( false ? "undefined" : _typeof(exports)) && "undefined" != typeof module ? module.exports = t() :  true ? !(__WEBPACK_AMD_DEFINE_FACTORY__ = (t),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
				__WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : (e.ReactIntlLocaleData = e.ReactIntlLocaleData || {}, e.ReactIntlLocaleData.pt = t());
}(undefined, function () {
  "use strict";
  return [{ locale: "pt", pluralRuleFunction: function pluralRuleFunction(e, t) {
      var o = String(e).split(".")[0];return t ? "other" : 0 == o || 1 == o ? "one" : "other";
    }, fields: { year: { displayName: "ano", relative: { 0: "este ano", 1: "próximo ano", "-1": "ano passado" }, relativeTime: { future: { one: "em {0} ano", other: "em {0} anos" }, past: { one: "há {0} ano", other: "há {0} anos" } } }, month: { displayName: "mês", relative: { 0: "este mês", 1: "próximo mês", "-1": "mês passado" }, relativeTime: { future: { one: "em {0} mês", other: "em {0} meses" }, past: { one: "há {0} mês", other: "há {0} meses" } } }, day: { displayName: "dia", relative: { 0: "hoje", 1: "amanhã", 2: "depois de amanhã", "-2": "anteontem", "-1": "ontem" }, relativeTime: { future: { one: "em {0} dia", other: "em {0} dias" }, past: { one: "há {0} dia", other: "há {0} dias" } } }, hour: { displayName: "hora", relative: { 0: "esta hora" }, relativeTime: { future: { one: "em {0} hora", other: "em {0} horas" }, past: { one: "há {0} hora", other: "há {0} horas" } } }, minute: { displayName: "minuto", relative: { 0: "este minuto" }, relativeTime: { future: { one: "em {0} minuto", other: "em {0} minutos" }, past: { one: "há {0} minuto", other: "há {0} minutos" } } }, second: { displayName: "segundo", relative: { 0: "agora" }, relativeTime: { future: { one: "em {0} segundo", other: "em {0} segundos" }, past: { one: "há {0} segundo", other: "há {0} segundos" } } } } }, { locale: "pt-AO", parentLocale: "pt-PT" }, { locale: "pt-PT", parentLocale: "pt", fields: { year: { displayName: "ano", relative: { 0: "este ano", 1: "próximo ano", "-1": "ano passado" }, relativeTime: { future: { one: "dentro de {0} ano", other: "dentro de {0} anos" }, past: { one: "há {0} ano", other: "há {0} anos" } } }, month: { displayName: "mês", relative: { 0: "este mês", 1: "próximo mês", "-1": "mês passado" }, relativeTime: { future: { one: "dentro de {0} mês", other: "dentro de {0} meses" }, past: { one: "há {0} mês", other: "há {0} meses" } } }, day: { displayName: "dia", relative: { 0: "hoje", 1: "amanhã", 2: "depois de amanhã", "-2": "anteontem", "-1": "ontem" }, relativeTime: { future: { one: "dentro de {0} dia", other: "dentro de {0} dias" }, past: { one: "há {0} dia", other: "há {0} dias" } } }, hour: { displayName: "hora", relative: { 0: "esta hora" }, relativeTime: { future: { one: "dentro de {0} hora", other: "dentro de {0} horas" }, past: { one: "há {0} hora", other: "há {0} horas" } } }, minute: { displayName: "minuto", relative: { 0: "este minuto" }, relativeTime: { future: { one: "dentro de {0} minuto", other: "dentro de {0} minutos" }, past: { one: "há {0} minuto", other: "há {0} minutos" } } }, second: { displayName: "segundo", relative: { 0: "agora" }, relativeTime: { future: { one: "dentro de {0} segundo", other: "dentro de {0} segundos" }, past: { one: "há {0} segundo", other: "há {0} segundos" } } } } }, { locale: "pt-CH", parentLocale: "pt-PT" }, { locale: "pt-CV", parentLocale: "pt-PT" }, { locale: "pt-GQ", parentLocale: "pt-PT" }, { locale: "pt-GW", parentLocale: "pt-PT" }, { locale: "pt-LU", parentLocale: "pt-PT" }, { locale: "pt-MO", parentLocale: "pt-PT" }, { locale: "pt-MZ", parentLocale: "pt-PT" }, { locale: "pt-ST", parentLocale: "pt-PT" }, { locale: "pt-TL", parentLocale: "pt-PT" }];
});

/***/ })

});