yoastWebpackJsonp([100],{478:function(e,t,i){"use strict";var a,r,o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};!function(n,l){"object"==o(t)&&void 0!==e?e.exports=l():(a=l,void 0!==(r="function"==typeof a?a.call(t,i,t,e):a)&&(e.exports=r))}(0,function(){return[{locale:"mt",pluralRuleFunction:function(e,t){var i=String(e).split("."),a=Number(i[0])==e&&i[0].slice(-2);return t?"other":1==e?"one":0==e||a>=2&&a<=10?"few":a>=11&&a<=19?"many":"other"},fields:{year:{displayName:"Sena",relative:{0:"din is-sena",1:"Is-sena d-dieħla","-1":"Is-sena li għaddiet"},relativeTime:{future:{other:"+{0} y"},past:{one:"{0} sena ilu",few:"{0} snin ilu",many:"{0} snin ilu",other:"{0} snin ilu"}}},month:{displayName:"Xahar",relative:{0:"Dan ix-xahar",1:"Ix-xahar id-dieħel","-1":"Ix-xahar li għadda"},relativeTime:{future:{other:"+{0} m"},past:{other:"-{0} m"}}},day:{displayName:"Jum",relative:{0:"Illum",1:"Għada","-1":"Ilbieraħ"},relativeTime:{future:{other:"+{0} d"},past:{other:"-{0} d"}}},hour:{displayName:"Siegħa",relative:{0:"this hour"},relativeTime:{future:{other:"+{0} h"},past:{other:"-{0} h"}}},minute:{displayName:"Minuta",relative:{0:"this minute"},relativeTime:{future:{other:"+{0} min"},past:{other:"-{0} min"}}},second:{displayName:"Sekonda",relative:{0:"now"},relativeTime:{future:{other:"+{0} s"},past:{other:"-{0} s"}}}}}]})}});