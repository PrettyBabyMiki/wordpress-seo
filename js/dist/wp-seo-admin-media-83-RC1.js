yoastWebpackJsonp([25],{

/***/ 3257:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/* global wpseoMediaL10n */\n/* global wp */\n/* jshint -W097 */\n/* jshint -W003 */\n/* jshint unused:false */\n\n// Taken and adapted from http://www.webmaster-source.com/2013/02/06/using-the-wordpress-3-5-media-uploader-in-your-plugin-or-theme/\njQuery(document).ready(function ($) {\n\t\"use strict\";\n\n\tif (typeof wp.media === \"undefined\") {\n\t\treturn;\n\t}\n\n\t$(\".wpseo_image_upload_button\").each(function (index, element) {\n\t\tvar wpseoTargetId = $(element).attr(\"id\").replace(/_button$/, \"\");\n\t\t// eslint-disable-next-line\n\t\tvar wpseoCustomUploader = wp.media.frames.file_frame = wp.media({\n\t\t\ttitle: wpseoMediaL10n.choose_image,\n\t\t\tbutton: { text: wpseoMediaL10n.choose_image },\n\t\t\tmultiple: false\n\t\t});\n\n\t\twpseoCustomUploader.on(\"select\", function () {\n\t\t\tvar attachment = wpseoCustomUploader.state().get(\"selection\").first().toJSON();\n\t\t\t$(\"#\" + wpseoTargetId).val(attachment.url);\n\t\t});\n\n\t\t$(element).click(function (e) {\n\t\t\te.preventDefault();\n\t\t\twpseoCustomUploader.open();\n\t\t});\n\t});\n});//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMzI1Ny5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9qcy9zcmMvd3Atc2VvLWFkbWluLW1lZGlhLmpzPzA3ZmQiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIHdwc2VvTWVkaWFMMTBuICovXG4vKiBnbG9iYWwgd3AgKi9cbi8qIGpzaGludCAtVzA5NyAqL1xuLyoganNoaW50IC1XMDAzICovXG4vKiBqc2hpbnQgdW51c2VkOmZhbHNlICovXG5cbi8vIFRha2VuIGFuZCBhZGFwdGVkIGZyb20gaHR0cDovL3d3dy53ZWJtYXN0ZXItc291cmNlLmNvbS8yMDEzLzAyLzA2L3VzaW5nLXRoZS13b3JkcHJlc3MtMy01LW1lZGlhLXVwbG9hZGVyLWluLXlvdXItcGx1Z2luLW9yLXRoZW1lL1xualF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KFxuXHRmdW5jdGlvbiggJCApIHtcblx0XHRcInVzZSBzdHJpY3RcIjtcblx0XHRpZiggdHlwZW9mIHdwLm1lZGlhID09PSBcInVuZGVmaW5lZFwiICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdCQoIFwiLndwc2VvX2ltYWdlX3VwbG9hZF9idXR0b25cIiApLmVhY2goIGZ1bmN0aW9uKCBpbmRleCwgZWxlbWVudCApIHtcblx0XHRcdHZhciB3cHNlb1RhcmdldElkID0gJCggZWxlbWVudCApLmF0dHIoIFwiaWRcIiApLnJlcGxhY2UoIC9fYnV0dG9uJC8sIFwiXCIgKTtcblx0XHRcdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuXHRcdFx0dmFyIHdwc2VvQ3VzdG9tVXBsb2FkZXIgPSB3cC5tZWRpYS5mcmFtZXMuZmlsZV9mcmFtZSA9IHdwLm1lZGlhKCB7XG5cdFx0XHRcdHRpdGxlOiB3cHNlb01lZGlhTDEwbi5jaG9vc2VfaW1hZ2UsXG5cdFx0XHRcdGJ1dHRvbjogeyB0ZXh0OiB3cHNlb01lZGlhTDEwbi5jaG9vc2VfaW1hZ2UgfSxcblx0XHRcdFx0bXVsdGlwbGU6IGZhbHNlLFxuXHRcdFx0fSApO1xuXG5cdFx0XHR3cHNlb0N1c3RvbVVwbG9hZGVyLm9uKCBcInNlbGVjdFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGF0dGFjaG1lbnQgPSB3cHNlb0N1c3RvbVVwbG9hZGVyLnN0YXRlKCkuZ2V0KCBcInNlbGVjdGlvblwiICkuZmlyc3QoKS50b0pTT04oKTtcblx0XHRcdFx0JCggXCIjXCIgKyB3cHNlb1RhcmdldElkICkudmFsKCBhdHRhY2htZW50LnVybCApO1xuXHRcdFx0fVxuXHRcdFx0KTtcblxuXHRcdFx0JCggZWxlbWVudCApLmNsaWNrKCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHR3cHNlb0N1c3RvbVVwbG9hZGVyLm9wZW4oKTtcblx0XHRcdH0gKTtcblx0XHR9ICk7XG5cdH1cbik7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8ganMvc3JjL3dwLXNlby1hZG1pbi1tZWRpYS5qcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///3257\n");

/***/ })

},[3257]);