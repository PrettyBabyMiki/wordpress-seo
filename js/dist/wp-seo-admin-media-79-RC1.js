yoastWebpackJsonp([23],{

/***/ 1847:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/* global wpseoMediaL10n */\n/* global wp */\n/* jshint -W097 */\n/* jshint -W003 */\n/* jshint unused:false */\n\n// Taken and adapted from http://www.webmaster-source.com/2013/02/06/using-the-wordpress-3-5-media-uploader-in-your-plugin-or-theme/\njQuery(document).ready(function ($) {\n\t\"use strict\";\n\n\tif (typeof wp.media === \"undefined\") {\n\t\treturn;\n\t}\n\n\t$(\".wpseo_image_upload_button\").each(function (index, element) {\n\t\tvar wpseoTargetId = $(element).attr(\"id\").replace(/_button$/, \"\");\n\t\t// eslint-disable-next-line\n\t\tvar wpseoCustomUploader = wp.media.frames.file_frame = wp.media({\n\t\t\ttitle: wpseoMediaL10n.choose_image,\n\t\t\tbutton: { text: wpseoMediaL10n.choose_image },\n\t\t\tmultiple: false\n\t\t});\n\n\t\twpseoCustomUploader.on(\"select\", function () {\n\t\t\tvar attachment = wpseoCustomUploader.state().get(\"selection\").first().toJSON();\n\t\t\t$(\"#\" + wpseoTargetId).val(attachment.url);\n\t\t});\n\n\t\t$(element).click(function (e) {\n\t\t\te.preventDefault();\n\t\t\twpseoCustomUploader.open();\n\t\t});\n\t});\n});\n\n//////////////////\n// WEBPACK FOOTER\n// ./wp-seo-admin-media.js\n// module id = 1847\n// module chunks = 23\n\n//# sourceURL=webpack:///./wp-seo-admin-media.js?");

/***/ })

},[1847]);