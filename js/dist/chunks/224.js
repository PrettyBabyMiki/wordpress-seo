yoastWebpackJsonp([224],{354:function(e,t,o){"use strict";var n,r,a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(i,f){"object"==a(t)&&void 0!==e?e.exports=f():(n=f,void 0!==(r="function"==typeof n?n.call(t,o,t,e):n)&&(e.exports=r))}(0,function(){return[{locale:"be",pluralRuleFunction:function(e,t){var o=String(e).split("."),n=Number(o[0])==e,r=n&&o[0].slice(-1),a=n&&o[0].slice(-2);return t?2!=r&&3!=r||12==a||13==a?"other":"few":1==r&&11!=a?"one":r>=2&&r<=4&&(a<12||a>14)?"few":n&&0==r||r>=5&&r<=9||a>=11&&a<=14?"many":"other"},fields:{year:{displayName:"год",relative:{0:"у гэтым годзе",1:"у наступным годзе","-1":"у мінулым годзе"},relativeTime:{future:{one:"праз {0} год",few:"праз {0} гады",many:"праз {0} гадоў",other:"праз {0} года"},past:{one:"{0} год таму",few:"{0} гады таму",many:"{0} гадоў таму",other:"{0} года таму"}}},month:{displayName:"месяц",relative:{0:"у гэтым месяцы",1:"у наступным месяцы","-1":"у мінулым месяцы"},relativeTime:{future:{one:"праз {0} месяц",few:"праз {0} месяцы",many:"праз {0} месяцаў",other:"праз {0} месяца"},past:{one:"{0} месяц таму",few:"{0} месяцы таму",many:"{0} месяцаў таму",other:"{0} месяца таму"}}},day:{displayName:"дзень",relative:{0:"сёння",1:"заўтра",2:"паслязаўтра","-2":"пазаўчора","-1":"учора"},relativeTime:{future:{one:"праз {0} дзень",few:"праз {0} дні",many:"праз {0} дзён",other:"праз {0} дня"},past:{one:"{0} дзень таму",few:"{0} дні таму",many:"{0} дзён таму",other:"{0} дня таму"}}},hour:{displayName:"гадзіна",relative:{0:"у гэту гадзіну"},relativeTime:{future:{one:"праз {0} гадзіну",few:"праз {0} гадзіны",many:"праз {0} гадзін",other:"праз {0} гадзіны"},past:{one:"{0} гадзіну таму",few:"{0} гадзіны таму",many:"{0} гадзін таму",other:"{0} гадзіны таму"}}},minute:{displayName:"хвіліна",relative:{0:"у гэту хвіліну"},relativeTime:{future:{one:"праз {0} хвіліну",few:"праз {0} хвіліны",many:"праз {0} хвілін",other:"праз {0} хвіліны"},past:{one:"{0} хвіліну таму",few:"{0} хвіліны таму",many:"{0} хвілін таму",other:"{0} хвіліны таму"}}},second:{displayName:"секунда",relative:{0:"цяпер"},relativeTime:{future:{one:"праз {0} секунду",few:"праз {0} секунды",many:"праз {0} секунд",other:"праз {0} секунды"},past:{one:"{0} секунду таму",few:"{0} секунды таму",many:"{0} секунд таму",other:"{0} секунды таму"}}}}}]})}});