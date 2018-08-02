yoastWebpackJsonp([13],{

/***/ 1962:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _typeof = typeof Symbol === \"function\" && typeof Symbol.iterator === \"symbol\" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === \"function\" && obj.constructor === Symbol && obj !== Symbol.prototype ? \"symbol\" : typeof obj; }; /* global tinyMCE */\n/* global wpseoShortcodePluginL10n */\n/* global ajaxurl */\n/* global _ */\n/* global JSON */\n/* global console */\n\n\n__webpack_require__(85);\n\nvar shortcodeNameMatcher = \"[^<>&/\\\\[\\\\]\\x00-\\x20=]+?\";\nvar shortcodeAttributesMatcher = \"( [^\\\\]]+?)?\";\n\nvar shortcodeStartRegex = new RegExp(\"\\\\[\" + shortcodeNameMatcher + shortcodeAttributesMatcher + \"\\\\]\", \"g\");\nvar shortcodeEndRegex = new RegExp(\"\\\\[/\" + shortcodeNameMatcher + \"\\\\]\", \"g\");\n\n(function () {\n\t/**\n  * The Yoast Shortcode plugin parses the shortcodes in a given piece of text. It analyzes multiple input fields for\n  * shortcodes which it will preload using AJAX.\n  *\n  * @constructor\n  * @property {RegExp} keywordRegex Used to match a given string for valid shortcode keywords.\n  * @property {RegExp} closingTagRegex Used to match a given string for shortcode closing tags.\n  * @property {RegExp} nonCaptureRegex Used to match a given string for non capturing shortcodes.\n  * @property {Array} parsedShortcodes Used to store parsed shortcodes.\n  *\n  * @param {app} app The app object.\n  */\n\tvar YoastShortcodePlugin = function YoastShortcodePlugin(app) {\n\t\tthis._app = app;\n\n\t\tthis._app.registerPlugin(\"YoastShortcodePlugin\", { status: \"loading\" });\n\t\tthis.bindElementEvents();\n\n\t\tvar keywordRegexString = \"(\" + wpseoShortcodePluginL10n.wpseo_shortcode_tags.join(\"|\") + \")\";\n\n\t\t// The regex for matching shortcodes based on the available shortcode keywords.\n\t\tthis.keywordRegex = new RegExp(keywordRegexString, \"g\");\n\t\tthis.closingTagRegex = new RegExp(\"\\\\[\\\\/\" + keywordRegexString + \"\\\\]\", \"g\");\n\t\tthis.nonCaptureRegex = new RegExp(\"\\\\[\" + keywordRegexString + \"[^\\\\]]*?\\\\]\", \"g\");\n\n\t\tthis.parsedShortcodes = [];\n\n\t\tthis.loadShortcodes(this.declareReady.bind(this));\n\t};\n\n\t/* YOAST SEO CLIENT */\n\n\t/**\n  * Declares ready with YoastSEO.\n  *\n  * @returns {void}\n  */\n\tYoastShortcodePlugin.prototype.declareReady = function () {\n\t\tthis._app.pluginReady(\"YoastShortcodePlugin\");\n\t\tthis.registerModifications();\n\t};\n\n\t/**\n  * Declares reloaded with YoastSEO.\n  *\n  * @returns {void}\n  */\n\tYoastShortcodePlugin.prototype.declareReloaded = function () {\n\t\tthis._app.pluginReloaded(\"YoastShortcodePlugin\");\n\t};\n\n\t/**\n  * Registers the modifications for the content in which we want to replace shortcodes.\n  *\n  * @returns {void}\n  */\n\tYoastShortcodePlugin.prototype.registerModifications = function () {\n\t\tthis._app.registerModification(\"content\", this.replaceShortcodes.bind(this), \"YoastShortcodePlugin\");\n\t};\n\n\t/**\n  * Removes all unknown shortcodes. Not all plugins properly registerd their shortcodes in the WordPress backend.\n  * Since we cannot use the data from these shortcodes they must be removed.\n  *\n  * @param {string} data The text to remove unknown shortcodes.\n  * @returns {string} The text with removed unknown shortcodes.\n  */\n\tYoastShortcodePlugin.prototype.removeUnknownShortCodes = function (data) {\n\t\tdata = data.replace(shortcodeStartRegex, \"\");\n\t\tdata = data.replace(shortcodeEndRegex, \"\");\n\n\t\treturn data;\n\t};\n\n\t/**\n  * The callback used to replace the shortcodes.\n  *\n  * @param {string} data The text to replace the shortcodes in.\n  *\n  * @returns {string} The text with replaced shortcodes.\n  */\n\tYoastShortcodePlugin.prototype.replaceShortcodes = function (data) {\n\t\tvar parsedShortcodes = this.parsedShortcodes;\n\n\t\tif (typeof data === \"string\" && parsedShortcodes.length > 0) {\n\t\t\tfor (var i = 0; i < parsedShortcodes.length; i++) {\n\t\t\t\tdata = data.replace(parsedShortcodes[i].shortcode, parsedShortcodes[i].output);\n\t\t\t}\n\t\t}\n\n\t\tdata = this.removeUnknownShortCodes(data);\n\n\t\treturn data;\n\t};\n\n\t/* DATA SOURCING */\n\n\t/**\n  * Get data from inputfields and store them in an analyzerData object. This object will be used to fill\n  * the analyzer and the snippetpreview\n  *\n  * @param {function} callback To declare either ready or reloaded after parsing.\n  *\n  * @returns {void}\n  */\n\tYoastShortcodePlugin.prototype.loadShortcodes = function (callback) {\n\t\tvar unparsedShortcodes = this.getUnparsedShortcodes(this.getShortcodes(this.getContentTinyMCE()));\n\t\tif (unparsedShortcodes.length > 0) {\n\t\t\tthis.parseShortcodes(unparsedShortcodes, callback);\n\t\t} else {\n\t\t\treturn callback();\n\t\t}\n\t};\n\n\t/**\n  * Bind elements to be able to reload the dataset if shortcodes get added.\n  *\n  * @returns {void}\n  */\n\tYoastShortcodePlugin.prototype.bindElementEvents = function () {\n\t\tvar contentElement = document.getElementById(\"content\") || false;\n\t\tvar callback = _.debounce(this.loadShortcodes.bind(this, this.declareReloaded.bind(this)), 500);\n\n\t\tif (contentElement) {\n\t\t\tcontentElement.addEventListener(\"keyup\", callback);\n\t\t\tcontentElement.addEventListener(\"change\", callback);\n\t\t}\n\n\t\tif (typeof tinyMCE !== \"undefined\" && typeof tinyMCE.on === \"function\") {\n\t\t\ttinyMCE.on(\"addEditor\", function (e) {\n\t\t\t\te.editor.on(\"change\", callback);\n\t\t\t\te.editor.on(\"keyup\", callback);\n\t\t\t});\n\t\t}\n\t};\n\n\t/**\n  * Gets content from the content field, if tinyMCE is initialized, use the getContent function to\n  * get the data from tinyMCE.\n  *\n  * @returns {String} Content from tinyMCE.\n  */\n\tYoastShortcodePlugin.prototype.getContentTinyMCE = function () {\n\t\tvar val = document.getElementById(\"content\") && document.getElementById(\"content\").value || \"\";\n\t\tif (typeof tinyMCE !== \"undefined\" && typeof tinyMCE.editors !== \"undefined\" && tinyMCE.editors.length !== 0) {\n\t\t\tval = tinyMCE.get(\"content\") && tinyMCE.get(\"content\").getContent() || \"\";\n\t\t}\n\n\t\treturn val;\n\t};\n\n\t/* SHORTCODE PARSING */\n\n\t/**\n  * Returns the unparsed shortcodes out of a collection of shortcodes.\n  *\n  * @param {Array} shortcodes The shortcodes to check.\n  *\n  * @returns {Array} Array with unparsed shortcodes.\n  */\n\tYoastShortcodePlugin.prototype.getUnparsedShortcodes = function (shortcodes) {\n\t\tif ((typeof shortcodes === \"undefined\" ? \"undefined\" : _typeof(shortcodes)) !== \"object\") {\n\t\t\tconsole.error(\"Failed to get unparsed shortcodes. Expected parameter to be an array, instead received \" + (typeof shortcodes === \"undefined\" ? \"undefined\" : _typeof(shortcodes)));\n\t\t\treturn false;\n\t\t}\n\n\t\tvar unparsedShortcodes = [];\n\n\t\tfor (var i = 0; i < shortcodes.length; i++) {\n\t\t\tvar shortcode = shortcodes[i];\n\t\t\tif (unparsedShortcodes.indexOf(shortcode) === -1 && this.isUnparsedShortcode(shortcode)) {\n\t\t\t\tunparsedShortcodes.push(shortcode);\n\t\t\t}\n\t\t}\n\n\t\treturn unparsedShortcodes;\n\t};\n\n\t/**\n  * Checks if a given shortcode was already parsed.\n  *\n  * @param {string} shortcode The shortcode to check.\n  *\n  * @returns {boolean} True when shortcode is not parsed yet.\n  */\n\tYoastShortcodePlugin.prototype.isUnparsedShortcode = function (shortcode) {\n\t\tvar alreadyExists = false;\n\n\t\tfor (var i = 0; i < this.parsedShortcodes.length; i++) {\n\t\t\tif (this.parsedShortcodes[i].shortcode === shortcode) {\n\t\t\t\talreadyExists = true;\n\t\t\t}\n\t\t}\n\n\t\treturn alreadyExists === false;\n\t};\n\n\t/**\n  * Gets the shortcodes from a given piece of text.\n  *\n  * @param {string} text Text to extract shortcodes from.\n  *\n  * @returns {array} The matched shortcodes.\n  */\n\tYoastShortcodePlugin.prototype.getShortcodes = function (text) {\n\t\tif (typeof text !== \"string\") {\n\t\t\t/* jshint ignore:start */\n\t\t\tconsole.error(\"Failed to get shortcodes. Expected parameter to be a string, instead received\" + (typeof text === \"undefined\" ? \"undefined\" : _typeof(text)));\n\t\t\t/* jshint ignore:end*/\n\t\t\treturn false;\n\t\t}\n\n\t\tvar captures = this.matchCapturingShortcodes(text);\n\n\t\t// Remove the capturing shortcodes from the text before trying to match the capturing shortcodes.\n\t\tfor (var i = 0; i < captures.length; i++) {\n\t\t\ttext = text.replace(captures[i], \"\");\n\t\t}\n\n\t\tvar nonCaptures = this.matchNonCapturingShortcodes(text);\n\n\t\treturn captures.concat(nonCaptures);\n\t};\n\n\t/**\n  * Matches the capturing shortcodes from a given piece of text.\n  *\n  * @param {string} text Text to get the capturing shortcodes from.\n  *\n  * @returns {Array} The capturing shortcodes.\n  */\n\tYoastShortcodePlugin.prototype.matchCapturingShortcodes = function (text) {\n\t\tvar captures = [];\n\n\t\t// First identify which tags are being used in a capturing shortcode by looking for closing tags.\n\t\tvar captureKeywords = (text.match(this.closingTagRegex) || []).join(\" \").match(this.keywordRegex) || [];\n\n\t\t// Fetch the capturing shortcodes and strip them from the text so we can easily match the non capturing shortcodes.\n\t\tfor (var i = 0; i < captureKeywords.length; i++) {\n\t\t\tvar captureKeyword = captureKeywords[i];\n\t\t\tvar captureRegex = \"\\\\[\" + captureKeyword + \"[^\\\\]]*?\\\\].*?\\\\[\\\\/\" + captureKeyword + \"\\\\]\";\n\t\t\tvar matches = text.match(new RegExp(captureRegex, \"g\")) || [];\n\n\t\t\tcaptures = captures.concat(matches);\n\t\t}\n\n\t\treturn captures;\n\t};\n\n\t/**\n  * Matches the non capturing shortcodes from a given piece of text.\n  *\n  * @param {string} text Text to get the non capturing shortcodes from.\n  *\n  * @returns {Array}     The non capturing shortcodes.\n  */\n\tYoastShortcodePlugin.prototype.matchNonCapturingShortcodes = function (text) {\n\t\treturn text.match(this.nonCaptureRegex) || [];\n\t};\n\n\t/**\n  * Parses the unparsed shortcodes through AJAX and clears them.\n  *\n  * @param {Array} shortcodes shortcodes to be parsed.\n  * @param {function} callback function to be called in the context of the AJAX callback.\n  *\n  * @returns {void}\n  */\n\tYoastShortcodePlugin.prototype.parseShortcodes = function (shortcodes, callback) {\n\t\tif (typeof callback !== \"function\") {\n\t\t\t/* jshint ignore:start */\n\t\t\tconsole.error(\"Failed to parse shortcodes. Expected parameter to be a function, instead received \" + (typeof callback === \"undefined\" ? \"undefined\" : _typeof(callback)));\n\t\t\t/* jshint ignore:end */\n\t\t\treturn false;\n\t\t}\n\n\t\tif ((typeof shortcodes === \"undefined\" ? \"undefined\" : _typeof(shortcodes)) === \"object\" && shortcodes.length > 0) {\n\t\t\tjQuery.post(ajaxurl, {\n\t\t\t\taction: \"wpseo_filter_shortcodes\",\n\t\t\t\t_wpnonce: wpseoShortcodePluginL10n.wpseo_filter_shortcodes_nonce,\n\t\t\t\tdata: shortcodes\n\t\t\t}, function (shortcodeResults) {\n\t\t\t\tthis.saveParsedShortcodes(shortcodeResults, callback);\n\t\t\t}.bind(this));\n\t\t} else {\n\t\t\treturn callback();\n\t\t}\n\t};\n\n\t/**\n  * Saves the shortcodes that were parsed with AJAX to `this.parsedShortcodes`\n  *\n  * @param {Array}    shortcodeResults Shortcodes that must be saved.\n  * @param {function} callback         Callback to execute of saving shortcodes.\n  *\n  * @returns {void}\n  */\n\tYoastShortcodePlugin.prototype.saveParsedShortcodes = function (shortcodeResults, callback) {\n\t\tshortcodeResults = JSON.parse(shortcodeResults);\n\t\tfor (var i = 0; i < shortcodeResults.length; i++) {\n\t\t\tthis.parsedShortcodes.push(shortcodeResults[i]);\n\t\t}\n\n\t\tcallback();\n\t};\n\n\twindow.YoastShortcodePlugin = YoastShortcodePlugin;\n})();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTk2Mi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9qcy9zcmMvd3Atc2VvLXNob3J0Y29kZS1wbHVnaW4uanM/ZWI4ZSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgdGlueU1DRSAqL1xuLyogZ2xvYmFsIHdwc2VvU2hvcnRjb2RlUGx1Z2luTDEwbiAqL1xuLyogZ2xvYmFsIGFqYXh1cmwgKi9cbi8qIGdsb2JhbCBfICovXG4vKiBnbG9iYWwgSlNPTiAqL1xuLyogZ2xvYmFsIGNvbnNvbGUgKi9cbmltcG9ydCBcIi4vaGVscGVycy9iYWJlbC1wb2x5ZmlsbFwiO1xuXG5jb25zdCBzaG9ydGNvZGVOYW1lTWF0Y2hlciA9IFwiW148PiYvXFxcXFtcXFxcXVxceDAwLVxceDIwPV0rP1wiO1xuY29uc3Qgc2hvcnRjb2RlQXR0cmlidXRlc01hdGNoZXIgPSBcIiggW15cXFxcXV0rPyk/XCI7XG5cbmNvbnN0IHNob3J0Y29kZVN0YXJ0UmVnZXggPSBuZXcgUmVnRXhwKCBcIlxcXFxbXCIgKyBzaG9ydGNvZGVOYW1lTWF0Y2hlciArIHNob3J0Y29kZUF0dHJpYnV0ZXNNYXRjaGVyICsgXCJcXFxcXVwiLCBcImdcIiApO1xuY29uc3Qgc2hvcnRjb2RlRW5kUmVnZXggPSBuZXcgUmVnRXhwKCBcIlxcXFxbL1wiICsgc2hvcnRjb2RlTmFtZU1hdGNoZXIgKyBcIlxcXFxdXCIsIFwiZ1wiICk7XG5cbiggZnVuY3Rpb24oKSB7XG5cdC8qKlxuXHQgKiBUaGUgWW9hc3QgU2hvcnRjb2RlIHBsdWdpbiBwYXJzZXMgdGhlIHNob3J0Y29kZXMgaW4gYSBnaXZlbiBwaWVjZSBvZiB0ZXh0LiBJdCBhbmFseXplcyBtdWx0aXBsZSBpbnB1dCBmaWVsZHMgZm9yXG5cdCAqIHNob3J0Y29kZXMgd2hpY2ggaXQgd2lsbCBwcmVsb2FkIHVzaW5nIEFKQVguXG5cdCAqXG5cdCAqIEBjb25zdHJ1Y3RvclxuXHQgKiBAcHJvcGVydHkge1JlZ0V4cH0ga2V5d29yZFJlZ2V4IFVzZWQgdG8gbWF0Y2ggYSBnaXZlbiBzdHJpbmcgZm9yIHZhbGlkIHNob3J0Y29kZSBrZXl3b3Jkcy5cblx0ICogQHByb3BlcnR5IHtSZWdFeHB9IGNsb3NpbmdUYWdSZWdleCBVc2VkIHRvIG1hdGNoIGEgZ2l2ZW4gc3RyaW5nIGZvciBzaG9ydGNvZGUgY2xvc2luZyB0YWdzLlxuXHQgKiBAcHJvcGVydHkge1JlZ0V4cH0gbm9uQ2FwdHVyZVJlZ2V4IFVzZWQgdG8gbWF0Y2ggYSBnaXZlbiBzdHJpbmcgZm9yIG5vbiBjYXB0dXJpbmcgc2hvcnRjb2Rlcy5cblx0ICogQHByb3BlcnR5IHtBcnJheX0gcGFyc2VkU2hvcnRjb2RlcyBVc2VkIHRvIHN0b3JlIHBhcnNlZCBzaG9ydGNvZGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge2FwcH0gYXBwIFRoZSBhcHAgb2JqZWN0LlxuXHQgKi9cblx0dmFyIFlvYXN0U2hvcnRjb2RlUGx1Z2luID0gZnVuY3Rpb24oIGFwcCApIHtcblx0XHR0aGlzLl9hcHAgPSBhcHA7XG5cblx0XHR0aGlzLl9hcHAucmVnaXN0ZXJQbHVnaW4oIFwiWW9hc3RTaG9ydGNvZGVQbHVnaW5cIiwgeyBzdGF0dXM6IFwibG9hZGluZ1wiIH0gKTtcblx0XHR0aGlzLmJpbmRFbGVtZW50RXZlbnRzKCk7XG5cblx0XHR2YXIga2V5d29yZFJlZ2V4U3RyaW5nID0gXCIoXCIgKyB3cHNlb1Nob3J0Y29kZVBsdWdpbkwxMG4ud3BzZW9fc2hvcnRjb2RlX3RhZ3Muam9pbiggXCJ8XCIgKSArIFwiKVwiO1xuXG5cdFx0Ly8gVGhlIHJlZ2V4IGZvciBtYXRjaGluZyBzaG9ydGNvZGVzIGJhc2VkIG9uIHRoZSBhdmFpbGFibGUgc2hvcnRjb2RlIGtleXdvcmRzLlxuXHRcdHRoaXMua2V5d29yZFJlZ2V4ID0gbmV3IFJlZ0V4cCgga2V5d29yZFJlZ2V4U3RyaW5nLCBcImdcIiApO1xuXHRcdHRoaXMuY2xvc2luZ1RhZ1JlZ2V4ID0gbmV3IFJlZ0V4cCggXCJcXFxcW1xcXFwvXCIgKyBrZXl3b3JkUmVnZXhTdHJpbmcgKyBcIlxcXFxdXCIsIFwiZ1wiICk7XG5cdFx0dGhpcy5ub25DYXB0dXJlUmVnZXggPSBuZXcgUmVnRXhwKCBcIlxcXFxbXCIgKyBrZXl3b3JkUmVnZXhTdHJpbmcgKyBcIlteXFxcXF1dKj9cXFxcXVwiLCBcImdcIiApO1xuXG5cdFx0dGhpcy5wYXJzZWRTaG9ydGNvZGVzID0gW107XG5cblx0XHR0aGlzLmxvYWRTaG9ydGNvZGVzKCB0aGlzLmRlY2xhcmVSZWFkeS5iaW5kKCB0aGlzICkgKTtcblx0fTtcblxuXHQvKiBZT0FTVCBTRU8gQ0xJRU5UICovXG5cblx0LyoqXG5cdCAqIERlY2xhcmVzIHJlYWR5IHdpdGggWW9hc3RTRU8uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLmRlY2xhcmVSZWFkeSA9IGZ1bmN0aW9uKCkge1xuXHRcdHRoaXMuX2FwcC5wbHVnaW5SZWFkeSggXCJZb2FzdFNob3J0Y29kZVBsdWdpblwiICk7XG5cdFx0dGhpcy5yZWdpc3Rlck1vZGlmaWNhdGlvbnMoKTtcblx0fTtcblxuXHQvKipcblx0ICogRGVjbGFyZXMgcmVsb2FkZWQgd2l0aCBZb2FzdFNFTy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUuZGVjbGFyZVJlbG9hZGVkID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fYXBwLnBsdWdpblJlbG9hZGVkKCBcIllvYXN0U2hvcnRjb2RlUGx1Z2luXCIgKTtcblx0fTtcblxuXHQvKipcblx0ICogUmVnaXN0ZXJzIHRoZSBtb2RpZmljYXRpb25zIGZvciB0aGUgY29udGVudCBpbiB3aGljaCB3ZSB3YW50IHRvIHJlcGxhY2Ugc2hvcnRjb2Rlcy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUucmVnaXN0ZXJNb2RpZmljYXRpb25zID0gZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5fYXBwLnJlZ2lzdGVyTW9kaWZpY2F0aW9uKCBcImNvbnRlbnRcIiwgdGhpcy5yZXBsYWNlU2hvcnRjb2Rlcy5iaW5kKCB0aGlzICksIFwiWW9hc3RTaG9ydGNvZGVQbHVnaW5cIiApO1xuXHR9O1xuXG5cblx0LyoqXG5cdCAqIFJlbW92ZXMgYWxsIHVua25vd24gc2hvcnRjb2Rlcy4gTm90IGFsbCBwbHVnaW5zIHByb3Blcmx5IHJlZ2lzdGVyZCB0aGVpciBzaG9ydGNvZGVzIGluIHRoZSBXb3JkUHJlc3MgYmFja2VuZC5cblx0ICogU2luY2Ugd2UgY2Fubm90IHVzZSB0aGUgZGF0YSBmcm9tIHRoZXNlIHNob3J0Y29kZXMgdGhleSBtdXN0IGJlIHJlbW92ZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBkYXRhIFRoZSB0ZXh0IHRvIHJlbW92ZSB1bmtub3duIHNob3J0Y29kZXMuXG5cdCAqIEByZXR1cm5zIHtzdHJpbmd9IFRoZSB0ZXh0IHdpdGggcmVtb3ZlZCB1bmtub3duIHNob3J0Y29kZXMuXG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUucmVtb3ZlVW5rbm93blNob3J0Q29kZXMgPSBmdW5jdGlvbiggZGF0YSApIHtcblx0XHRkYXRhID0gZGF0YS5yZXBsYWNlKCBzaG9ydGNvZGVTdGFydFJlZ2V4LCBcIlwiICk7XG5cdFx0ZGF0YSA9IGRhdGEucmVwbGFjZSggc2hvcnRjb2RlRW5kUmVnZXgsIFwiXCIgKTtcblxuXHRcdHJldHVybiBkYXRhO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBUaGUgY2FsbGJhY2sgdXNlZCB0byByZXBsYWNlIHRoZSBzaG9ydGNvZGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge3N0cmluZ30gZGF0YSBUaGUgdGV4dCB0byByZXBsYWNlIHRoZSBzaG9ydGNvZGVzIGluLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7c3RyaW5nfSBUaGUgdGV4dCB3aXRoIHJlcGxhY2VkIHNob3J0Y29kZXMuXG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUucmVwbGFjZVNob3J0Y29kZXMgPSBmdW5jdGlvbiggZGF0YSApIHtcblx0XHR2YXIgcGFyc2VkU2hvcnRjb2RlcyA9IHRoaXMucGFyc2VkU2hvcnRjb2RlcztcblxuXHRcdGlmICggdHlwZW9mIGRhdGEgPT09IFwic3RyaW5nXCIgJiYgcGFyc2VkU2hvcnRjb2Rlcy5sZW5ndGggPiAwICkge1xuXHRcdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgcGFyc2VkU2hvcnRjb2Rlcy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdFx0ZGF0YSA9IGRhdGEucmVwbGFjZSggcGFyc2VkU2hvcnRjb2Rlc1sgaSBdLnNob3J0Y29kZSwgcGFyc2VkU2hvcnRjb2Rlc1sgaSBdLm91dHB1dCApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGRhdGEgPSB0aGlzLnJlbW92ZVVua25vd25TaG9ydENvZGVzKCBkYXRhICk7XG5cblx0XHRyZXR1cm4gZGF0YTtcblx0fTtcblxuXHQvKiBEQVRBIFNPVVJDSU5HICovXG5cblx0LyoqXG5cdCAqIEdldCBkYXRhIGZyb20gaW5wdXRmaWVsZHMgYW5kIHN0b3JlIHRoZW0gaW4gYW4gYW5hbHl6ZXJEYXRhIG9iamVjdC4gVGhpcyBvYmplY3Qgd2lsbCBiZSB1c2VkIHRvIGZpbGxcblx0ICogdGhlIGFuYWx5emVyIGFuZCB0aGUgc25pcHBldHByZXZpZXdcblx0ICpcblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgVG8gZGVjbGFyZSBlaXRoZXIgcmVhZHkgb3IgcmVsb2FkZWQgYWZ0ZXIgcGFyc2luZy5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUubG9hZFNob3J0Y29kZXMgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdFx0dmFyIHVucGFyc2VkU2hvcnRjb2RlcyA9IHRoaXMuZ2V0VW5wYXJzZWRTaG9ydGNvZGVzKCB0aGlzLmdldFNob3J0Y29kZXMoIHRoaXMuZ2V0Q29udGVudFRpbnlNQ0UoKSApICk7XG5cdFx0aWYgKCB1bnBhcnNlZFNob3J0Y29kZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdHRoaXMucGFyc2VTaG9ydGNvZGVzKCB1bnBhcnNlZFNob3J0Y29kZXMsIGNhbGxiYWNrICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBjYWxsYmFjaygpO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogQmluZCBlbGVtZW50cyB0byBiZSBhYmxlIHRvIHJlbG9hZCB0aGUgZGF0YXNldCBpZiBzaG9ydGNvZGVzIGdldCBhZGRlZC5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUuYmluZEVsZW1lbnRFdmVudHMgPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgY29udGVudEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJjb250ZW50XCIgKSB8fCBmYWxzZTtcblx0XHR2YXIgY2FsbGJhY2sgPSAgXy5kZWJvdW5jZShcdHRoaXMubG9hZFNob3J0Y29kZXMuYmluZCggdGhpcywgdGhpcy5kZWNsYXJlUmVsb2FkZWQuYmluZCggdGhpcyApICksIDUwMCApO1xuXG5cdFx0aWYgKCBjb250ZW50RWxlbWVudCApIHtcblx0XHRcdGNvbnRlbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwia2V5dXBcIiwgY2FsbGJhY2sgKTtcblx0XHRcdGNvbnRlbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoIFwiY2hhbmdlXCIsIGNhbGxiYWNrICk7XG5cdFx0fVxuXG5cdFx0aWYoIHR5cGVvZiB0aW55TUNFICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiB0aW55TUNFLm9uID09PSBcImZ1bmN0aW9uXCIgKSB7XG5cdFx0XHR0aW55TUNFLm9uKCBcImFkZEVkaXRvclwiLCBmdW5jdGlvbiggZSApIHtcblx0XHRcdFx0ZS5lZGl0b3Iub24oIFwiY2hhbmdlXCIsIGNhbGxiYWNrICk7XG5cdFx0XHRcdGUuZWRpdG9yLm9uKCBcImtleXVwXCIsIGNhbGxiYWNrICk7XG5cdFx0XHR9ICk7XG5cdFx0fVxuXHR9O1xuXG5cdC8qKlxuXHQgKiBHZXRzIGNvbnRlbnQgZnJvbSB0aGUgY29udGVudCBmaWVsZCwgaWYgdGlueU1DRSBpcyBpbml0aWFsaXplZCwgdXNlIHRoZSBnZXRDb250ZW50IGZ1bmN0aW9uIHRvXG5cdCAqIGdldCB0aGUgZGF0YSBmcm9tIHRpbnlNQ0UuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9IENvbnRlbnQgZnJvbSB0aW55TUNFLlxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLmdldENvbnRlbnRUaW55TUNFID0gZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHZhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImNvbnRlbnRcIiApICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcImNvbnRlbnRcIiApLnZhbHVlIHx8IFwiXCI7XG5cdFx0aWYgKCB0eXBlb2YgdGlueU1DRSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgdGlueU1DRS5lZGl0b3JzICE9PSBcInVuZGVmaW5lZFwiICYmIHRpbnlNQ0UuZWRpdG9ycy5sZW5ndGggIT09IDAgKSB7XG5cdFx0XHR2YWwgPSB0aW55TUNFLmdldCggXCJjb250ZW50XCIgKSAmJiB0aW55TUNFLmdldCggXCJjb250ZW50XCIgKS5nZXRDb250ZW50KCkgfHwgXCJcIjtcblx0XHR9XG5cblx0XHRyZXR1cm4gdmFsO1xuXHR9O1xuXG5cdC8qIFNIT1JUQ09ERSBQQVJTSU5HICovXG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIHVucGFyc2VkIHNob3J0Y29kZXMgb3V0IG9mIGEgY29sbGVjdGlvbiBvZiBzaG9ydGNvZGVzLlxuXHQgKlxuXHQgKiBAcGFyYW0ge0FycmF5fSBzaG9ydGNvZGVzIFRoZSBzaG9ydGNvZGVzIHRvIGNoZWNrLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7QXJyYXl9IEFycmF5IHdpdGggdW5wYXJzZWQgc2hvcnRjb2Rlcy5cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5nZXRVbnBhcnNlZFNob3J0Y29kZXMgPSBmdW5jdGlvbiggc2hvcnRjb2RlcyApIHtcblx0XHRpZiAoIHR5cGVvZiBzaG9ydGNvZGVzICE9PSBcIm9iamVjdFwiICkge1xuXHRcdFx0Y29uc29sZS5lcnJvciggXCJGYWlsZWQgdG8gZ2V0IHVucGFyc2VkIHNob3J0Y29kZXMuIEV4cGVjdGVkIHBhcmFtZXRlciB0byBiZSBhbiBhcnJheSwgaW5zdGVhZCByZWNlaXZlZCBcIiArIHR5cGVvZiBzaG9ydGNvZGVzICk7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0dmFyIHVucGFyc2VkU2hvcnRjb2RlcyA9IFtdO1xuXG5cdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgc2hvcnRjb2Rlcy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdHZhciBzaG9ydGNvZGUgPSBzaG9ydGNvZGVzWyBpIF07XG5cdFx0XHRpZiAoIHVucGFyc2VkU2hvcnRjb2Rlcy5pbmRleE9mKCBzaG9ydGNvZGUgKSA9PT0gLTEgJiYgdGhpcy5pc1VucGFyc2VkU2hvcnRjb2RlKCBzaG9ydGNvZGUgKSApIHtcblx0XHRcdFx0dW5wYXJzZWRTaG9ydGNvZGVzLnB1c2goIHNob3J0Y29kZSApO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiB1bnBhcnNlZFNob3J0Y29kZXM7XG5cdH07XG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiBhIGdpdmVuIHNob3J0Y29kZSB3YXMgYWxyZWFkeSBwYXJzZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSBzaG9ydGNvZGUgVGhlIHNob3J0Y29kZSB0byBjaGVjay5cblx0ICpcblx0ICogQHJldHVybnMge2Jvb2xlYW59IFRydWUgd2hlbiBzaG9ydGNvZGUgaXMgbm90IHBhcnNlZCB5ZXQuXG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUuaXNVbnBhcnNlZFNob3J0Y29kZSA9IGZ1bmN0aW9uKCBzaG9ydGNvZGUgKSB7XG5cdFx0dmFyIGFscmVhZHlFeGlzdHMgPSBmYWxzZTtcblxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IHRoaXMucGFyc2VkU2hvcnRjb2Rlcy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdGlmICggdGhpcy5wYXJzZWRTaG9ydGNvZGVzWyBpIF0uc2hvcnRjb2RlID09PSBzaG9ydGNvZGUgKSB7XG5cdFx0XHRcdGFscmVhZHlFeGlzdHMgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBhbHJlYWR5RXhpc3RzID09PSBmYWxzZTtcblx0fTtcblxuXHQvKipcblx0ICogR2V0cyB0aGUgc2hvcnRjb2RlcyBmcm9tIGEgZ2l2ZW4gcGllY2Ugb2YgdGV4dC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGV4dCB0byBleHRyYWN0IHNob3J0Y29kZXMgZnJvbS5cblx0ICpcblx0ICogQHJldHVybnMge2FycmF5fSBUaGUgbWF0Y2hlZCBzaG9ydGNvZGVzLlxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLmdldFNob3J0Y29kZXMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0XHRpZiAoIHR5cGVvZiB0ZXh0ICE9PSBcInN0cmluZ1wiICkge1xuXHRcdFx0LyoganNoaW50IGlnbm9yZTpzdGFydCAqL1xuXHRcdFx0Y29uc29sZS5lcnJvciggXCJGYWlsZWQgdG8gZ2V0IHNob3J0Y29kZXMuIEV4cGVjdGVkIHBhcmFtZXRlciB0byBiZSBhIHN0cmluZywgaW5zdGVhZCByZWNlaXZlZFwiICsgdHlwZW9mIHRleHQgKTtcblx0XHRcdC8qIGpzaGludCBpZ25vcmU6ZW5kKi9cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHR2YXIgY2FwdHVyZXMgPSB0aGlzLm1hdGNoQ2FwdHVyaW5nU2hvcnRjb2RlcyggdGV4dCApO1xuXG5cdFx0Ly8gUmVtb3ZlIHRoZSBjYXB0dXJpbmcgc2hvcnRjb2RlcyBmcm9tIHRoZSB0ZXh0IGJlZm9yZSB0cnlpbmcgdG8gbWF0Y2ggdGhlIGNhcHR1cmluZyBzaG9ydGNvZGVzLlxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IGNhcHR1cmVzLmxlbmd0aDsgaSsrICkge1xuXHRcdFx0dGV4dCA9IHRleHQucmVwbGFjZSggY2FwdHVyZXNbIGkgXSwgXCJcIiApO1xuXHRcdH1cblxuXHRcdHZhciBub25DYXB0dXJlcyA9IHRoaXMubWF0Y2hOb25DYXB0dXJpbmdTaG9ydGNvZGVzKCB0ZXh0ICk7XG5cblx0XHRyZXR1cm4gY2FwdHVyZXMuY29uY2F0KCBub25DYXB0dXJlcyApO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBNYXRjaGVzIHRoZSBjYXB0dXJpbmcgc2hvcnRjb2RlcyBmcm9tIGEgZ2l2ZW4gcGllY2Ugb2YgdGV4dC5cblx0ICpcblx0ICogQHBhcmFtIHtzdHJpbmd9IHRleHQgVGV4dCB0byBnZXQgdGhlIGNhcHR1cmluZyBzaG9ydGNvZGVzIGZyb20uXG5cdCAqXG5cdCAqIEByZXR1cm5zIHtBcnJheX0gVGhlIGNhcHR1cmluZyBzaG9ydGNvZGVzLlxuXHQgKi9cblx0WW9hc3RTaG9ydGNvZGVQbHVnaW4ucHJvdG90eXBlLm1hdGNoQ2FwdHVyaW5nU2hvcnRjb2RlcyA9IGZ1bmN0aW9uKCB0ZXh0ICkge1xuXHRcdHZhciBjYXB0dXJlcyA9IFtdO1xuXG5cdFx0Ly8gRmlyc3QgaWRlbnRpZnkgd2hpY2ggdGFncyBhcmUgYmVpbmcgdXNlZCBpbiBhIGNhcHR1cmluZyBzaG9ydGNvZGUgYnkgbG9va2luZyBmb3IgY2xvc2luZyB0YWdzLlxuXHRcdHZhciBjYXB0dXJlS2V5d29yZHMgPSAoIHRleHQubWF0Y2goIHRoaXMuY2xvc2luZ1RhZ1JlZ2V4ICkgfHwgW10gKS5qb2luKCBcIiBcIiApLm1hdGNoKCB0aGlzLmtleXdvcmRSZWdleCApIHx8IFtdO1xuXG5cdFx0Ly8gRmV0Y2ggdGhlIGNhcHR1cmluZyBzaG9ydGNvZGVzIGFuZCBzdHJpcCB0aGVtIGZyb20gdGhlIHRleHQgc28gd2UgY2FuIGVhc2lseSBtYXRjaCB0aGUgbm9uIGNhcHR1cmluZyBzaG9ydGNvZGVzLlxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IGNhcHR1cmVLZXl3b3Jkcy5sZW5ndGg7IGkrKyApIHtcblx0XHRcdHZhciBjYXB0dXJlS2V5d29yZCA9IGNhcHR1cmVLZXl3b3Jkc1sgaSBdO1xuXHRcdFx0dmFyIGNhcHR1cmVSZWdleCA9IFwiXFxcXFtcIiArIGNhcHR1cmVLZXl3b3JkICsgXCJbXlxcXFxdXSo/XFxcXF0uKj9cXFxcW1xcXFwvXCIgKyBjYXB0dXJlS2V5d29yZCArIFwiXFxcXF1cIjtcblx0XHRcdHZhciBtYXRjaGVzID0gdGV4dC5tYXRjaCggbmV3IFJlZ0V4cCggY2FwdHVyZVJlZ2V4LCBcImdcIiApICkgfHwgW107XG5cblx0XHRcdGNhcHR1cmVzID0gY2FwdHVyZXMuY29uY2F0KCBtYXRjaGVzICk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNhcHR1cmVzO1xuXHR9O1xuXG5cdC8qKlxuXHQgKiBNYXRjaGVzIHRoZSBub24gY2FwdHVyaW5nIHNob3J0Y29kZXMgZnJvbSBhIGdpdmVuIHBpZWNlIG9mIHRleHQuXG5cdCAqXG5cdCAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IFRleHQgdG8gZ2V0IHRoZSBub24gY2FwdHVyaW5nIHNob3J0Y29kZXMgZnJvbS5cblx0ICpcblx0ICogQHJldHVybnMge0FycmF5fSAgICAgVGhlIG5vbiBjYXB0dXJpbmcgc2hvcnRjb2Rlcy5cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5tYXRjaE5vbkNhcHR1cmluZ1Nob3J0Y29kZXMgPSBmdW5jdGlvbiggdGV4dCApIHtcblx0XHRyZXR1cm4gdGV4dC5tYXRjaCggdGhpcy5ub25DYXB0dXJlUmVnZXggKSB8fCBbXTtcblx0fTtcblxuXHQvKipcblx0ICogUGFyc2VzIHRoZSB1bnBhcnNlZCBzaG9ydGNvZGVzIHRocm91Z2ggQUpBWCBhbmQgY2xlYXJzIHRoZW0uXG5cdCAqXG5cdCAqIEBwYXJhbSB7QXJyYXl9IHNob3J0Y29kZXMgc2hvcnRjb2RlcyB0byBiZSBwYXJzZWQuXG5cdCAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBpbiB0aGUgY29udGV4dCBvZiB0aGUgQUpBWCBjYWxsYmFjay5cblx0ICpcblx0ICogQHJldHVybnMge3ZvaWR9XG5cdCAqL1xuXHRZb2FzdFNob3J0Y29kZVBsdWdpbi5wcm90b3R5cGUucGFyc2VTaG9ydGNvZGVzID0gZnVuY3Rpb24oIHNob3J0Y29kZXMsIGNhbGxiYWNrICkge1xuXHRcdGlmICggdHlwZW9mIGNhbGxiYWNrICE9PSBcImZ1bmN0aW9uXCIgKSB7XG5cdFx0XHQvKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG5cdFx0XHRjb25zb2xlLmVycm9yKCBcIkZhaWxlZCB0byBwYXJzZSBzaG9ydGNvZGVzLiBFeHBlY3RlZCBwYXJhbWV0ZXIgdG8gYmUgYSBmdW5jdGlvbiwgaW5zdGVhZCByZWNlaXZlZCBcIiArIHR5cGVvZiBjYWxsYmFjayApO1xuXHRcdFx0LyoganNoaW50IGlnbm9yZTplbmQgKi9cblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHRpZiAoIHR5cGVvZiBzaG9ydGNvZGVzID09PSBcIm9iamVjdFwiICYmIHNob3J0Y29kZXMubGVuZ3RoID4gMCApIHtcblx0XHRcdGpRdWVyeS5wb3N0KCBhamF4dXJsLCB7XG5cdFx0XHRcdGFjdGlvbjogXCJ3cHNlb19maWx0ZXJfc2hvcnRjb2Rlc1wiLFxuXHRcdFx0XHRfd3Bub25jZTogd3BzZW9TaG9ydGNvZGVQbHVnaW5MMTBuLndwc2VvX2ZpbHRlcl9zaG9ydGNvZGVzX25vbmNlLFxuXHRcdFx0XHRkYXRhOiBzaG9ydGNvZGVzLFxuXHRcdFx0fSxcblx0XHRcdFx0ZnVuY3Rpb24oIHNob3J0Y29kZVJlc3VsdHMgKSB7XG5cdFx0XHRcdFx0dGhpcy5zYXZlUGFyc2VkU2hvcnRjb2Rlcyggc2hvcnRjb2RlUmVzdWx0cywgY2FsbGJhY2sgKTtcblx0XHRcdFx0fS5iaW5kKCB0aGlzIClcblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiBjYWxsYmFjaygpO1xuXHRcdH1cblx0fTtcblxuXHQvKipcblx0ICogU2F2ZXMgdGhlIHNob3J0Y29kZXMgdGhhdCB3ZXJlIHBhcnNlZCB3aXRoIEFKQVggdG8gYHRoaXMucGFyc2VkU2hvcnRjb2Rlc2Bcblx0ICpcblx0ICogQHBhcmFtIHtBcnJheX0gICAgc2hvcnRjb2RlUmVzdWx0cyBTaG9ydGNvZGVzIHRoYXQgbXVzdCBiZSBzYXZlZC5cblx0ICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgICAgICAgICBDYWxsYmFjayB0byBleGVjdXRlIG9mIHNhdmluZyBzaG9ydGNvZGVzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdFlvYXN0U2hvcnRjb2RlUGx1Z2luLnByb3RvdHlwZS5zYXZlUGFyc2VkU2hvcnRjb2RlcyA9IGZ1bmN0aW9uKCBzaG9ydGNvZGVSZXN1bHRzLCBjYWxsYmFjayApIHtcblx0XHRzaG9ydGNvZGVSZXN1bHRzID0gSlNPTi5wYXJzZSggc2hvcnRjb2RlUmVzdWx0cyApO1xuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IHNob3J0Y29kZVJlc3VsdHMubGVuZ3RoOyBpKysgKSB7XG5cdFx0XHR0aGlzLnBhcnNlZFNob3J0Y29kZXMucHVzaCggc2hvcnRjb2RlUmVzdWx0c1sgaSBdICk7XG5cdFx0fVxuXG5cdFx0Y2FsbGJhY2soKTtcblx0fTtcblxuXHR3aW5kb3cuWW9hc3RTaG9ydGNvZGVQbHVnaW4gPSBZb2FzdFNob3J0Y29kZVBsdWdpbjtcbn0oKSApO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGpzL3NyYy93cC1zZW8tc2hvcnRjb2RlLXBsdWdpbi5qcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7OztBQVlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUVBOzs7Ozs7O0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7O0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7O0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFNQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///1962\n");

/***/ }),

/***/ 85:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n// The babel polyfill sets the _babelPolyfill to true. So only load it ourselves if the variable is undefined or false.\nif (typeof window._babelPolyfill === \"undefined\" || !window._babelPolyfill) {\n\t// eslint-disable-next-line global-require\n\t__webpack_require__(200);\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiODUuanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vanMvc3JjL2hlbHBlcnMvYmFiZWwtcG9seWZpbGwuanM/MTdiOSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGUgYmFiZWwgcG9seWZpbGwgc2V0cyB0aGUgX2JhYmVsUG9seWZpbGwgdG8gdHJ1ZS4gU28gb25seSBsb2FkIGl0IG91cnNlbHZlcyBpZiB0aGUgdmFyaWFibGUgaXMgdW5kZWZpbmVkIG9yIGZhbHNlLlxuaWYgKCB0eXBlb2Ygd2luZG93Ll9iYWJlbFBvbHlmaWxsID09PSBcInVuZGVmaW5lZFwiIHx8ICEgd2luZG93Ll9iYWJlbFBvbHlmaWxsICkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZ2xvYmFsLXJlcXVpcmVcblx0cmVxdWlyZSggXCJiYWJlbC1wb2x5ZmlsbFwiICk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8ganMvc3JjL2hlbHBlcnMvYmFiZWwtcG9seWZpbGwuanMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///85\n");

/***/ })

},[1962]);