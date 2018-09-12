yoastWebpackJsonp([16],{

/***/ 2231:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _a11ySpeak = __webpack_require__(843);\n\nvar _a11ySpeak2 = _interopRequireDefault(_a11ySpeak);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n(function ($) {\n\t\"use strict\";\n\n\tvar featuredImagePlugin;\n\tvar $featuredImageElement;\n\tvar $postImageDiv;\n\tvar $postImageDivHeading;\n\n\tvar FeaturedImagePlugin = function FeaturedImagePlugin(app) {\n\t\tthis._app = app;\n\n\t\tthis.featuredImage = null;\n\t\tthis.pluginName = \"addFeaturedImagePlugin\";\n\n\t\tthis.registerPlugin();\n\t\tthis.registerModifications();\n\t};\n\n\t/**\n  * Sets the featured image to use in the analysis\n  *\n  * @param {String} featuredImage The featured image to use.\n  *\n  * @returns {void}\n  */\n\tFeaturedImagePlugin.prototype.setFeaturedImage = function (featuredImage) {\n\t\tthis.featuredImage = featuredImage;\n\n\t\tthis._app.pluginReloaded(this.pluginName);\n\t};\n\n\t/**\n  * Removes featured image and reloads analyzer\n  *\n  * @returns {void}\n  */\n\tFeaturedImagePlugin.prototype.removeFeaturedImage = function () {\n\t\tthis.setFeaturedImage(null);\n\t};\n\n\t/**\n  * Registers this plugin to YoastSEO\n  *\n  * @returns {void}\n  */\n\tFeaturedImagePlugin.prototype.registerPlugin = function () {\n\t\tthis._app.registerPlugin(this.pluginName, { status: \"ready\" });\n\t};\n\n\t/**\n  * Registers modifications to YoastSEO\n  *\n  * @returns {void}\n  */\n\tFeaturedImagePlugin.prototype.registerModifications = function () {\n\t\tthis._app.registerModification(\"content\", this.addImageToContent.bind(this), this.pluginName, 10);\n\t};\n\n\t/**\n  * Adds featured image to sort so it can be analyzed\n  *\n  * @param {String} content The content to alter.\n  *\n  * @returns {String} Returns the possible altered content.\n  */\n\tFeaturedImagePlugin.prototype.addImageToContent = function (content) {\n\t\tif (null !== this.featuredImage) {\n\t\t\tcontent += this.featuredImage;\n\t\t}\n\n\t\treturn content;\n\t};\n\n\t/**\n  * Remove opengraph warning frame and borders\n  *\n  * @returns {void}\n  */\n\tfunction removeOpengraphWarning() {\n\t\t$(\"#yst_opengraph_image_warning\").remove();\n\t\t$postImageDiv.removeClass(\"yoast-opengraph-image-notice\");\n\t}\n\n\t/**\n  * Check if image is smaller than 200x200 pixels. If this is the case, show a warning\n  *\n  * @param {object} featuredImage The featured image object.\n  *\n  * @returns {void}\n  */\n\tfunction checkFeaturedImage(featuredImage) {\n\t\tvar attachment = featuredImage.state().get(\"selection\").first().toJSON();\n\n\t\tif (attachment.width < 200 || attachment.height < 200) {\n\t\t\t// Show warning to user and do not add image to OG\n\t\t\tif (0 === $(\"#yst_opengraph_image_warning\").length) {\n\t\t\t\t// Create a warning using native WordPress notices styling.\n\t\t\t\t$('<div id=\"yst_opengraph_image_warning\" class=\"notice notice-error notice-alt\"><p>' + wpseoFeaturedImageL10n.featured_image_notice + \"</p></div>\").insertAfter($postImageDivHeading);\n\n\t\t\t\t$postImageDiv.addClass(\"yoast-opengraph-image-notice\");\n\n\t\t\t\t(0, _a11ySpeak2.default)(wpseoFeaturedImageL10n.featured_image_notice, \"assertive\");\n\t\t\t}\n\t\t} else {\n\t\t\t// Force reset warning\n\t\t\tremoveOpengraphWarning();\n\t\t}\n\t}\n\n\t$(document).ready(function () {\n\t\tvar featuredImage = wp.media.featuredImage.frame();\n\n\t\tif (typeof YoastSEO === \"undefined\") {\n\t\t\treturn;\n\t\t}\n\n\t\tfeaturedImagePlugin = new FeaturedImagePlugin(YoastSEO.app);\n\n\t\t$postImageDiv = $(\"#postimagediv\");\n\t\t$postImageDivHeading = $postImageDiv.find(\".hndle\");\n\n\t\tfeaturedImage.on(\"select\", function () {\n\t\t\tvar selectedImageHTML, selectedImage, alt;\n\n\t\t\tcheckFeaturedImage(featuredImage);\n\n\t\t\tselectedImage = featuredImage.state().get(\"selection\").first();\n\n\t\t\t// WordPress falls back to the title for the alt attribute if no alt is present.\n\t\t\talt = selectedImage.get(\"alt\");\n\n\t\t\tif (\"\" === alt) {\n\t\t\t\talt = selectedImage.get(\"title\");\n\t\t\t}\n\n\t\t\tselectedImageHTML = \"<img\" + ' src=\"' + selectedImage.get(\"url\") + '\"' + ' width=\"' + selectedImage.get(\"width\") + '\"' + ' height=\"' + selectedImage.get(\"height\") + '\"' + ' alt=\"' + alt + '\"/>';\n\n\t\t\tfeaturedImagePlugin.setFeaturedImage(selectedImageHTML);\n\t\t});\n\n\t\t$postImageDiv.on(\"click\", \"#remove-post-thumbnail\", function () {\n\t\t\tfeaturedImagePlugin.removeFeaturedImage();\n\t\t\tremoveOpengraphWarning();\n\t\t});\n\n\t\t$featuredImageElement = $(\"#set-post-thumbnail > img\");\n\t\tif (\"undefined\" !== typeof $featuredImageElement.prop(\"src\")) {\n\t\t\tfeaturedImagePlugin.setFeaturedImage($(\"#set-post-thumbnail \").html());\n\t\t}\n\t});\n})(jQuery);\n\n/* eslint-disable */\n/* jshint ignore:start */\n/**\n * Check if image is smaller than 200x200 pixels. If this is the case, show a warning\n * @param {object} featuredImage\n *\n * @deprecated since 3.1\n */\n/* global wp */\n/* global wpseoFeaturedImageL10n */\n/* global YoastSEO */\n/* jshint -W097 */\n/* jshint -W003 */\nfunction yst_checkFeaturedImage(featuredImage) {\n\treturn;\n}\n\n/**\n * Counter to make sure we do not end up in an endless loop if there' no remove-post-thumbnail id\n * @type {number}\n *\n * @deprecated since 3.1\n */\nvar thumbIdCounter = 0;\n\n/**\n * Variable to hold the onclick function for remove-post-thumbnail.\n * @type {function}\n *\n * @deprecated since 3.1\n */\nvar removeThumb;\n\n/**\n * If there's a remove-post-thumbnail id, add an onclick. When this id is clicked, call yst_removeOpengraphWarning\n * If not, check again after 100ms. Do not do this for more than 10 times so we do not end up in an endless loop\n *\n * @deprecated since 3.1\n */\nfunction yst_overrideElemFunction() {\n\treturn;\n}\n\n/**\n * Remove error message\n */\nfunction yst_removeOpengraphWarning() {\n\treturn;\n}\n\nwindow.yst_checkFeaturedImage = yst_checkFeaturedImage;\nwindow.thumbIdCounter = thumbIdCounter;\nwindow.removeThumb = removeThumb;\nwindow.yst_overrideElemFunction = yst_overrideElemFunction;\nwindow.yst_removeOpengraphWarning = yst_removeOpengraphWarning;\n/* jshint ignore:end */\n/* eslint-enable *///# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjIzMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9qcy9zcmMvd3Atc2VvLWZlYXR1cmVkLWltYWdlLmpzP2I3NmYiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIHdwICovXG4vKiBnbG9iYWwgd3BzZW9GZWF0dXJlZEltYWdlTDEwbiAqL1xuLyogZ2xvYmFsIFlvYXN0U0VPICovXG4vKiBqc2hpbnQgLVcwOTcgKi9cbi8qIGpzaGludCAtVzAwMyAqL1xuaW1wb3J0IGExMXlTcGVhayBmcm9tIFwiYTExeS1zcGVha1wiO1xuXG4oIGZ1bmN0aW9uKCAkICkge1xuXHRcInVzZSBzdHJpY3RcIjtcblx0dmFyIGZlYXR1cmVkSW1hZ2VQbHVnaW47XG5cdHZhciAkZmVhdHVyZWRJbWFnZUVsZW1lbnQ7XG5cdHZhciAkcG9zdEltYWdlRGl2O1xuXHR2YXIgJHBvc3RJbWFnZURpdkhlYWRpbmc7XG5cblx0dmFyIEZlYXR1cmVkSW1hZ2VQbHVnaW4gPSBmdW5jdGlvbiggYXBwICkge1xuXHRcdHRoaXMuX2FwcCA9IGFwcDtcblxuXHRcdHRoaXMuZmVhdHVyZWRJbWFnZSA9IG51bGw7XG5cdFx0dGhpcy5wbHVnaW5OYW1lID0gXCJhZGRGZWF0dXJlZEltYWdlUGx1Z2luXCI7XG5cblx0XHR0aGlzLnJlZ2lzdGVyUGx1Z2luKCk7XG5cdFx0dGhpcy5yZWdpc3Rlck1vZGlmaWNhdGlvbnMoKTtcblx0fTtcblxuXHQvKipcblx0ICogU2V0cyB0aGUgZmVhdHVyZWQgaW1hZ2UgdG8gdXNlIGluIHRoZSBhbmFseXNpc1xuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gZmVhdHVyZWRJbWFnZSBUaGUgZmVhdHVyZWQgaW1hZ2UgdG8gdXNlLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnNldEZlYXR1cmVkSW1hZ2UgPSBmdW5jdGlvbiggZmVhdHVyZWRJbWFnZSApIHtcblx0XHR0aGlzLmZlYXR1cmVkSW1hZ2UgPSBmZWF0dXJlZEltYWdlO1xuXG5cdFx0dGhpcy5fYXBwLnBsdWdpblJlbG9hZGVkKCB0aGlzLnBsdWdpbk5hbWUgKTtcblx0fTtcblxuXHQvKipcblx0ICogUmVtb3ZlcyBmZWF0dXJlZCBpbWFnZSBhbmQgcmVsb2FkcyBhbmFseXplclxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnJlbW92ZUZlYXR1cmVkSW1hZ2UgPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLnNldEZlYXR1cmVkSW1hZ2UoIG51bGwgKTtcblx0fTtcblxuXHQvKipcblx0ICogUmVnaXN0ZXJzIHRoaXMgcGx1Z2luIHRvIFlvYXN0U0VPXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0RmVhdHVyZWRJbWFnZVBsdWdpbi5wcm90b3R5cGUucmVnaXN0ZXJQbHVnaW4gPSBmdW5jdGlvbigpIHtcblx0XHR0aGlzLl9hcHAucmVnaXN0ZXJQbHVnaW4oIHRoaXMucGx1Z2luTmFtZSwgeyBzdGF0dXM6IFwicmVhZHlcIiB9ICk7XG5cdH07XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVycyBtb2RpZmljYXRpb25zIHRvIFlvYXN0U0VPXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0RmVhdHVyZWRJbWFnZVBsdWdpbi5wcm90b3R5cGUucmVnaXN0ZXJNb2RpZmljYXRpb25zID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fYXBwLnJlZ2lzdGVyTW9kaWZpY2F0aW9uKCBcImNvbnRlbnRcIiwgdGhpcy5hZGRJbWFnZVRvQ29udGVudC5iaW5kKCB0aGlzICksIHRoaXMucGx1Z2luTmFtZSwgMTAgKTtcblx0fTtcblxuXHQvKipcblx0ICogQWRkcyBmZWF0dXJlZCBpbWFnZSB0byBzb3J0IHNvIGl0IGNhbiBiZSBhbmFseXplZFxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gY29udGVudCBUaGUgY29udGVudCB0byBhbHRlci5cblx0ICpcblx0ICogQHJldHVybnMge1N0cmluZ30gUmV0dXJucyB0aGUgcG9zc2libGUgYWx0ZXJlZCBjb250ZW50LlxuXHQgKi9cblx0RmVhdHVyZWRJbWFnZVBsdWdpbi5wcm90b3R5cGUuYWRkSW1hZ2VUb0NvbnRlbnQgPSBmdW5jdGlvbiggY29udGVudCApIHtcblx0XHRpZiAoIG51bGwgIT09IHRoaXMuZmVhdHVyZWRJbWFnZSApIHtcblx0XHRcdGNvbnRlbnQgKz0gdGhpcy5mZWF0dXJlZEltYWdlO1xuXHRcdH1cblxuXHRcdHJldHVybiBjb250ZW50O1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBSZW1vdmUgb3BlbmdyYXBoIHdhcm5pbmcgZnJhbWUgYW5kIGJvcmRlcnNcblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRmdW5jdGlvbiByZW1vdmVPcGVuZ3JhcGhXYXJuaW5nKCkge1xuXHRcdCQoIFwiI3lzdF9vcGVuZ3JhcGhfaW1hZ2Vfd2FybmluZ1wiICkucmVtb3ZlKCk7XG5cdFx0JHBvc3RJbWFnZURpdi5yZW1vdmVDbGFzcyggXCJ5b2FzdC1vcGVuZ3JhcGgtaW1hZ2Utbm90aWNlXCIgKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDaGVjayBpZiBpbWFnZSBpcyBzbWFsbGVyIHRoYW4gMjAweDIwMCBwaXhlbHMuIElmIHRoaXMgaXMgdGhlIGNhc2UsIHNob3cgYSB3YXJuaW5nXG5cdCAqXG5cdCAqIEBwYXJhbSB7b2JqZWN0fSBmZWF0dXJlZEltYWdlIFRoZSBmZWF0dXJlZCBpbWFnZSBvYmplY3QuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gY2hlY2tGZWF0dXJlZEltYWdlKCBmZWF0dXJlZEltYWdlICkge1xuXHRcdHZhciBhdHRhY2htZW50ID0gZmVhdHVyZWRJbWFnZS5zdGF0ZSgpLmdldCggXCJzZWxlY3Rpb25cIiApLmZpcnN0KCkudG9KU09OKCk7XG5cblx0XHRpZiAoIGF0dGFjaG1lbnQud2lkdGggPCAyMDAgfHwgYXR0YWNobWVudC5oZWlnaHQgPCAyMDAgKSB7XG5cdFx0XHQvLyBTaG93IHdhcm5pbmcgdG8gdXNlciBhbmQgZG8gbm90IGFkZCBpbWFnZSB0byBPR1xuXHRcdFx0aWYgKCAwID09PSAkKCBcIiN5c3Rfb3BlbmdyYXBoX2ltYWdlX3dhcm5pbmdcIiApLmxlbmd0aCApIHtcblx0XHRcdFx0Ly8gQ3JlYXRlIGEgd2FybmluZyB1c2luZyBuYXRpdmUgV29yZFByZXNzIG5vdGljZXMgc3R5bGluZy5cblx0XHRcdFx0JCggJzxkaXYgaWQ9XCJ5c3Rfb3BlbmdyYXBoX2ltYWdlX3dhcm5pbmdcIiBjbGFzcz1cIm5vdGljZSBub3RpY2UtZXJyb3Igbm90aWNlLWFsdFwiPjxwPicgK1xuXHRcdFx0XHRcdHdwc2VvRmVhdHVyZWRJbWFnZUwxMG4uZmVhdHVyZWRfaW1hZ2Vfbm90aWNlICtcblx0XHRcdFx0XHRcIjwvcD48L2Rpdj5cIiApXG5cdFx0XHRcdFx0Lmluc2VydEFmdGVyKCAkcG9zdEltYWdlRGl2SGVhZGluZyApO1xuXG5cdFx0XHRcdCRwb3N0SW1hZ2VEaXYuYWRkQ2xhc3MoIFwieW9hc3Qtb3BlbmdyYXBoLWltYWdlLW5vdGljZVwiICk7XG5cblx0XHRcdFx0YTExeVNwZWFrKCB3cHNlb0ZlYXR1cmVkSW1hZ2VMMTBuLmZlYXR1cmVkX2ltYWdlX25vdGljZSwgXCJhc3NlcnRpdmVcIiApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBGb3JjZSByZXNldCB3YXJuaW5nXG5cdFx0XHRyZW1vdmVPcGVuZ3JhcGhXYXJuaW5nKCk7XG5cdFx0fVxuXHR9XG5cblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGZlYXR1cmVkSW1hZ2UgPSB3cC5tZWRpYS5mZWF0dXJlZEltYWdlLmZyYW1lKCk7XG5cblx0XHRpZiAoIHR5cGVvZiBZb2FzdFNFTyA9PT0gXCJ1bmRlZmluZWRcIiApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRmZWF0dXJlZEltYWdlUGx1Z2luID0gbmV3IEZlYXR1cmVkSW1hZ2VQbHVnaW4oIFlvYXN0U0VPLmFwcCApO1xuXG5cdFx0JHBvc3RJbWFnZURpdiA9ICQoIFwiI3Bvc3RpbWFnZWRpdlwiICk7XG5cdFx0JHBvc3RJbWFnZURpdkhlYWRpbmcgPSAkcG9zdEltYWdlRGl2LmZpbmQoIFwiLmhuZGxlXCIgKTtcblxuXHRcdGZlYXR1cmVkSW1hZ2Uub24oIFwic2VsZWN0XCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHNlbGVjdGVkSW1hZ2VIVE1MLCBzZWxlY3RlZEltYWdlLCBhbHQ7XG5cblx0XHRcdGNoZWNrRmVhdHVyZWRJbWFnZSggZmVhdHVyZWRJbWFnZSApO1xuXG5cdFx0XHRzZWxlY3RlZEltYWdlID0gZmVhdHVyZWRJbWFnZS5zdGF0ZSgpLmdldCggXCJzZWxlY3Rpb25cIiApLmZpcnN0KCk7XG5cblx0XHRcdC8vIFdvcmRQcmVzcyBmYWxscyBiYWNrIHRvIHRoZSB0aXRsZSBmb3IgdGhlIGFsdCBhdHRyaWJ1dGUgaWYgbm8gYWx0IGlzIHByZXNlbnQuXG5cdFx0XHRhbHQgPSBzZWxlY3RlZEltYWdlLmdldCggXCJhbHRcIiApO1xuXG5cdFx0XHRpZiAoIFwiXCIgPT09IGFsdCApIHtcblx0XHRcdFx0YWx0ID0gc2VsZWN0ZWRJbWFnZS5nZXQoIFwidGl0bGVcIiApO1xuXHRcdFx0fVxuXG5cdFx0XHRzZWxlY3RlZEltYWdlSFRNTCA9IFwiPGltZ1wiICtcblx0XHRcdFx0JyBzcmM9XCInICsgc2VsZWN0ZWRJbWFnZS5nZXQoIFwidXJsXCIgKSArICdcIicgK1xuXHRcdFx0XHQnIHdpZHRoPVwiJyArIHNlbGVjdGVkSW1hZ2UuZ2V0KCBcIndpZHRoXCIgKSArICdcIicgK1xuXHRcdFx0XHQnIGhlaWdodD1cIicgKyBzZWxlY3RlZEltYWdlLmdldCggXCJoZWlnaHRcIiApICsgJ1wiJyArXG5cdFx0XHRcdCcgYWx0PVwiJyArIGFsdCArXG5cdFx0XHRcdCdcIi8+JztcblxuXHRcdFx0ZmVhdHVyZWRJbWFnZVBsdWdpbi5zZXRGZWF0dXJlZEltYWdlKCBzZWxlY3RlZEltYWdlSFRNTCApO1xuXHRcdH0gKTtcblxuXHRcdCRwb3N0SW1hZ2VEaXYub24oIFwiY2xpY2tcIiwgXCIjcmVtb3ZlLXBvc3QtdGh1bWJuYWlsXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ZmVhdHVyZWRJbWFnZVBsdWdpbi5yZW1vdmVGZWF0dXJlZEltYWdlKCk7XG5cdFx0XHRyZW1vdmVPcGVuZ3JhcGhXYXJuaW5nKCk7XG5cdFx0fSApO1xuXG5cdFx0JGZlYXR1cmVkSW1hZ2VFbGVtZW50ID0gJCggXCIjc2V0LXBvc3QtdGh1bWJuYWlsID4gaW1nXCIgKTtcblx0XHRpZiAoIFwidW5kZWZpbmVkXCIgIT09IHR5cGVvZiAkZmVhdHVyZWRJbWFnZUVsZW1lbnQucHJvcCggXCJzcmNcIiApICkge1xuXHRcdFx0ZmVhdHVyZWRJbWFnZVBsdWdpbi5zZXRGZWF0dXJlZEltYWdlKCAkKCBcIiNzZXQtcG9zdC10aHVtYm5haWwgXCIgKS5odG1sKCkgKTtcblx0XHR9XG5cdH0gKTtcbn0oIGpRdWVyeSApICk7XG5cbi8qIGVzbGludC1kaXNhYmxlICovXG4vKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG4vKipcbiAqIENoZWNrIGlmIGltYWdlIGlzIHNtYWxsZXIgdGhhbiAyMDB4MjAwIHBpeGVscy4gSWYgdGhpcyBpcyB0aGUgY2FzZSwgc2hvdyBhIHdhcm5pbmdcbiAqIEBwYXJhbSB7b2JqZWN0fSBmZWF0dXJlZEltYWdlXG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgMy4xXG4gKi9cbmZ1bmN0aW9uIHlzdF9jaGVja0ZlYXR1cmVkSW1hZ2UoIGZlYXR1cmVkSW1hZ2UgKSB7XG5cdHJldHVybjtcbn1cblxuLyoqXG4gKiBDb3VudGVyIHRvIG1ha2Ugc3VyZSB3ZSBkbyBub3QgZW5kIHVwIGluIGFuIGVuZGxlc3MgbG9vcCBpZiB0aGVyZScgbm8gcmVtb3ZlLXBvc3QtdGh1bWJuYWlsIGlkXG4gKiBAdHlwZSB7bnVtYmVyfVxuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIDMuMVxuICovXG52YXIgdGh1bWJJZENvdW50ZXIgPSAwO1xuXG4vKipcbiAqIFZhcmlhYmxlIHRvIGhvbGQgdGhlIG9uY2xpY2sgZnVuY3Rpb24gZm9yIHJlbW92ZS1wb3N0LXRodW1ibmFpbC5cbiAqIEB0eXBlIHtmdW5jdGlvbn1cbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSAzLjFcbiAqL1xudmFyIHJlbW92ZVRodW1iO1xuXG4vKipcbiAqIElmIHRoZXJlJ3MgYSByZW1vdmUtcG9zdC10aHVtYm5haWwgaWQsIGFkZCBhbiBvbmNsaWNrLiBXaGVuIHRoaXMgaWQgaXMgY2xpY2tlZCwgY2FsbCB5c3RfcmVtb3ZlT3BlbmdyYXBoV2FybmluZ1xuICogSWYgbm90LCBjaGVjayBhZ2FpbiBhZnRlciAxMDBtcy4gRG8gbm90IGRvIHRoaXMgZm9yIG1vcmUgdGhhbiAxMCB0aW1lcyBzbyB3ZSBkbyBub3QgZW5kIHVwIGluIGFuIGVuZGxlc3MgbG9vcFxuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIDMuMVxuICovXG5mdW5jdGlvbiB5c3Rfb3ZlcnJpZGVFbGVtRnVuY3Rpb24oKSB7XG5cdHJldHVybjtcbn1cblxuLyoqXG4gKiBSZW1vdmUgZXJyb3IgbWVzc2FnZVxuICovXG5mdW5jdGlvbiB5c3RfcmVtb3ZlT3BlbmdyYXBoV2FybmluZygpIHtcblx0cmV0dXJuO1xufVxuXG53aW5kb3cueXN0X2NoZWNrRmVhdHVyZWRJbWFnZSA9IHlzdF9jaGVja0ZlYXR1cmVkSW1hZ2U7XG53aW5kb3cudGh1bWJJZENvdW50ZXIgPSB0aHVtYklkQ291bnRlcjtcbndpbmRvdy5yZW1vdmVUaHVtYiA9IHJlbW92ZVRodW1iO1xud2luZG93LnlzdF9vdmVycmlkZUVsZW1GdW5jdGlvbiA9IHlzdF9vdmVycmlkZUVsZW1GdW5jdGlvbjtcbndpbmRvdy55c3RfcmVtb3ZlT3BlbmdyYXBoV2FybmluZyA9IHlzdF9yZW1vdmVPcGVuZ3JhcGhXYXJuaW5nO1xuLyoganNoaW50IGlnbm9yZTplbmQgKi9cbi8qIGVzbGludC1lbmFibGUgKi9cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBqcy9zcmMvd3Atc2VvLWZlYXR1cmVkLWltYWdlLmpzIl0sIm1hcHBpbmdzIjoiOztBQUtBO0FBQ0E7Ozs7O0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUF4S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTBLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUFNQTtBQUNBO0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTs7Ozs7O0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///2231\n");

/***/ }),

/***/ 843:
/***/ (function(module, exports) {

eval("var containerPolite, containerAssertive, previousMessage = \"\";\n\n/**\n * Build the live regions markup.\n *\n * @param {String} ariaLive Optional. Value for the \"aria-live\" attribute, default \"polite\".\n *\n * @returns {Object} $container The ARIA live region jQuery object.\n */\nvar addContainer = function( ariaLive ) {\n\tariaLive = ariaLive || \"polite\";\n\n\tvar container = document.createElement( \"div\" );\n\tcontainer.id = \"a11y-speak-\" + ariaLive;\n\tcontainer.className = \"a11y-speak-region\";\n\n\tvar screenReaderTextStyle = \"clip: rect(1px, 1px, 1px, 1px); position: absolute; height: 1px; width: 1px; overflow: hidden; word-wrap: normal;\";\n\tcontainer.setAttribute( \"style\", screenReaderTextStyle );\n\n\tcontainer.setAttribute( \"aria-live\", ariaLive );\n\tcontainer.setAttribute( \"aria-relevant\", \"additions text\" );\n\tcontainer.setAttribute( \"aria-atomic\", \"true\" );\n\n\tdocument.querySelector( \"body\" ).appendChild( container );\n\treturn container;\n};\n\n/**\n * Specify a function to execute when the DOM is fully loaded.\n *\n * @param {Function} callback A function to execute after the DOM is ready.\n *\n * @returns {void}\n */\nvar domReady = function( callback ) {\n\tif ( document.readyState === \"complete\" || ( document.readyState !== \"loading\" && !document.documentElement.doScroll ) ) {\n\t\treturn callback();\n\t}\n\n\tdocument.addEventListener( \"DOMContentLoaded\", callback );\n};\n\n/**\n * Create the live regions when the DOM is fully loaded.\n */\ndomReady( function() {\n\tcontainerPolite = document.getElementById( \"a11y-speak-polite\" );\n\tcontainerAssertive = document.getElementById( \"a11y-speak-assertive\" );\n\n\tif ( containerPolite === null ) {\n\t\tcontainerPolite = addContainer( \"polite\" );\n\t}\n\tif ( containerAssertive === null ) {\n\t\tcontainerAssertive = addContainer( \"assertive\" );\n\t}\n} );\n\n/**\n * Clear the live regions.\n */\nvar clear = function() {\n\tvar regions = document.querySelectorAll( \".a11y-speak-region\" );\n\tfor ( var i = 0; i < regions.length; i++ ) {\n\t\tregions[ i ].textContent = \"\";\n\t}\n};\n\n/**\n * Update the ARIA live notification area text node.\n *\n * @param {String} message  The message to be announced by Assistive Technologies.\n * @param {String} ariaLive Optional. The politeness level for aria-live. Possible values:\n *                          polite or assertive. Default polite.\n */\nvar A11ySpeak = function( message, ariaLive ) {\n\t// Clear previous messages to allow repeated strings being read out.\n\tclear();\n\n\t/*\n\t * Strip HTML tags (if any) from the message string. Ideally, messages should\n\t * be simple strings, carefully crafted for specific use with A11ySpeak.\n\t * When re-using already existing strings this will ensure simple HTML to be\n\t * stripped out and replaced with a space. Browsers will collapse multiple\n\t * spaces natively.\n\t */\n\tmessage = message.replace( /<[^<>]+>/g, \" \" );\n\n\tif ( previousMessage === message ) {\n\t\tmessage = message + \"\\u00A0\";\n\t}\n\n\tpreviousMessage = message;\n\n\tif ( containerAssertive && \"assertive\" === ariaLive ) {\n\t\tcontainerAssertive.textContent = message;\n\t} else if ( containerPolite ) {\n\t\tcontainerPolite.textContent = message;\n\t}\n};\n\nmodule.exports = A11ySpeak;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiODQzLmpzIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcz84MzE0Il0sInNvdXJjZXNDb250ZW50IjpbInZhciBjb250YWluZXJQb2xpdGUsIGNvbnRhaW5lckFzc2VydGl2ZSwgcHJldmlvdXNNZXNzYWdlID0gXCJcIjtcblxuLyoqXG4gKiBCdWlsZCB0aGUgbGl2ZSByZWdpb25zIG1hcmt1cC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFZhbHVlIGZvciB0aGUgXCJhcmlhLWxpdmVcIiBhdHRyaWJ1dGUsIGRlZmF1bHQgXCJwb2xpdGVcIi5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAkY29udGFpbmVyIFRoZSBBUklBIGxpdmUgcmVnaW9uIGpRdWVyeSBvYmplY3QuXG4gKi9cbnZhciBhZGRDb250YWluZXIgPSBmdW5jdGlvbiggYXJpYUxpdmUgKSB7XG5cdGFyaWFMaXZlID0gYXJpYUxpdmUgfHwgXCJwb2xpdGVcIjtcblxuXHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuXHRjb250YWluZXIuaWQgPSBcImExMXktc3BlYWstXCIgKyBhcmlhTGl2ZTtcblx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IFwiYTExeS1zcGVhay1yZWdpb25cIjtcblxuXHR2YXIgc2NyZWVuUmVhZGVyVGV4dFN0eWxlID0gXCJjbGlwOiByZWN0KDFweCwgMXB4LCAxcHgsIDFweCk7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgaGVpZ2h0OiAxcHg7IHdpZHRoOiAxcHg7IG92ZXJmbG93OiBoaWRkZW47IHdvcmQtd3JhcDogbm9ybWFsO1wiO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcInN0eWxlXCIsIHNjcmVlblJlYWRlclRleHRTdHlsZSApO1xuXG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1saXZlXCIsIGFyaWFMaXZlICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1yZWxldmFudFwiLCBcImFkZGl0aW9ucyB0ZXh0XCIgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWF0b21pY1wiLCBcInRydWVcIiApO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIFwiYm9keVwiICkuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lciApO1xuXHRyZXR1cm4gY29udGFpbmVyO1xufTtcblxuLyoqXG4gKiBTcGVjaWZ5IGEgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhZnRlciB0aGUgRE9NIGlzIHJlYWR5LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG52YXIgZG9tUmVhZHkgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIHx8ICggZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIgJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbCApICkge1xuXHRcdHJldHVybiBjYWxsYmFjaygpO1xuXHR9XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrICk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgbGl2ZSByZWdpb25zIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKi9cbmRvbVJlYWR5KCBmdW5jdGlvbigpIHtcblx0Y29udGFpbmVyUG9saXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1wb2xpdGVcIiApO1xuXHRjb250YWluZXJBc3NlcnRpdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLWFzc2VydGl2ZVwiICk7XG5cblx0aWYgKCBjb250YWluZXJQb2xpdGUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlID0gYWRkQ29udGFpbmVyKCBcInBvbGl0ZVwiICk7XG5cdH1cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlID0gYWRkQ29udGFpbmVyKCBcImFzc2VydGl2ZVwiICk7XG5cdH1cbn0gKTtcblxuLyoqXG4gKiBDbGVhciB0aGUgbGl2ZSByZWdpb25zLlxuICovXG52YXIgY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0dmFyIHJlZ2lvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi5hMTF5LXNwZWFrLXJlZ2lvblwiICk7XG5cdGZvciAoIHZhciBpID0gMDsgaSA8IHJlZ2lvbnMubGVuZ3RoOyBpKysgKSB7XG5cdFx0cmVnaW9uc1sgaSBdLnRleHRDb250ZW50ID0gXCJcIjtcblx0fVxufTtcblxuLyoqXG4gKiBVcGRhdGUgdGhlIEFSSUEgbGl2ZSBub3RpZmljYXRpb24gYXJlYSB0ZXh0IG5vZGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgIFRoZSBtZXNzYWdlIHRvIGJlIGFubm91bmNlZCBieSBBc3Npc3RpdmUgVGVjaG5vbG9naWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBUaGUgcG9saXRlbmVzcyBsZXZlbCBmb3IgYXJpYS1saXZlLiBQb3NzaWJsZSB2YWx1ZXM6XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saXRlIG9yIGFzc2VydGl2ZS4gRGVmYXVsdCBwb2xpdGUuXG4gKi9cbnZhciBBMTF5U3BlYWsgPSBmdW5jdGlvbiggbWVzc2FnZSwgYXJpYUxpdmUgKSB7XG5cdC8vIENsZWFyIHByZXZpb3VzIG1lc3NhZ2VzIHRvIGFsbG93IHJlcGVhdGVkIHN0cmluZ3MgYmVpbmcgcmVhZCBvdXQuXG5cdGNsZWFyKCk7XG5cblx0Lypcblx0ICogU3RyaXAgSFRNTCB0YWdzIChpZiBhbnkpIGZyb20gdGhlIG1lc3NhZ2Ugc3RyaW5nLiBJZGVhbGx5LCBtZXNzYWdlcyBzaG91bGRcblx0ICogYmUgc2ltcGxlIHN0cmluZ3MsIGNhcmVmdWxseSBjcmFmdGVkIGZvciBzcGVjaWZpYyB1c2Ugd2l0aCBBMTF5U3BlYWsuXG5cdCAqIFdoZW4gcmUtdXNpbmcgYWxyZWFkeSBleGlzdGluZyBzdHJpbmdzIHRoaXMgd2lsbCBlbnN1cmUgc2ltcGxlIEhUTUwgdG8gYmVcblx0ICogc3RyaXBwZWQgb3V0IGFuZCByZXBsYWNlZCB3aXRoIGEgc3BhY2UuIEJyb3dzZXJzIHdpbGwgY29sbGFwc2UgbXVsdGlwbGVcblx0ICogc3BhY2VzIG5hdGl2ZWx5LlxuXHQgKi9cblx0bWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZSggLzxbXjw+XSs+L2csIFwiIFwiICk7XG5cblx0aWYgKCBwcmV2aW91c01lc3NhZ2UgPT09IG1lc3NhZ2UgKSB7XG5cdFx0bWVzc2FnZSA9IG1lc3NhZ2UgKyBcIlxcdTAwQTBcIjtcblx0fVxuXG5cdHByZXZpb3VzTWVzc2FnZSA9IG1lc3NhZ2U7XG5cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgJiYgXCJhc3NlcnRpdmVcIiA9PT0gYXJpYUxpdmUgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fSBlbHNlIGlmICggY29udGFpbmVyUG9saXRlICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQTExeVNwZWFrO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvYTExeS1zcGVhay9hMTF5LXNwZWFrLmpzXG4vLyBtb2R1bGUgaWQgPSA4NDNcbi8vIG1vZHVsZSBjaHVua3MgPSAxNCAxNSAxNiAxNyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///843\n");

/***/ })

},[2231]);