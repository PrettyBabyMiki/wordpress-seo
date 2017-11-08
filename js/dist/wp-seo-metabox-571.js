/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1265);
/******/ })
/************************************************************************/
/******/ ({

/***/ 1265:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n/* browser:true */\n/* global tb_show, wpseoSelect2Locale */\n\n(function ($) {\n\t// eslint-disable-next-line\n\tfunction wpseoInitTabs() {\n\t\tif (jQuery(\".wpseo-metabox-tabs-div\").length > 0) {\n\t\t\tjQuery(\".wpseo-metabox-tabs\").on(\"click\", \"a.wpseo_tablink\", function (ev) {\n\t\t\t\tev.preventDefault();\n\n\t\t\t\tjQuery(\".wpseo-meta-section.active .wpseo-metabox-tabs li\").removeClass(\"active\");\n\t\t\t\tjQuery(\".wpseo-meta-section.active .wpseotab\").removeClass(\"active\");\n\n\t\t\t\t// Hide the Yoast tooltip when the element gets clicked.\n\t\t\t\tjQuery(this).addClass(\"yoast-tooltip-hidden\");\n\n\t\t\t\tvar targetElem = jQuery(jQuery(this).attr(\"href\"));\n\t\t\t\ttargetElem.addClass(\"active\");\n\t\t\t\tjQuery(this).parent(\"li\").addClass(\"active\");\n\n\t\t\t\tif (jQuery(this).hasClass(\"scroll\")) {\n\t\t\t\t\tjQuery(\"html, body\").animate({\n\t\t\t\t\t\tscrollTop: jQuery(targetElem).offset().top\n\t\t\t\t\t}, 500);\n\t\t\t\t}\n\t\t\t}).on(\"mouseleave\", \"a.wpseo_tablink\", function () {\n\t\t\t\t// The element can still have focus, ensure to hide the tooltip.\n\t\t\t\tjQuery(this).addClass(\"yoast-tooltip-hidden\");\n\t\t\t}).on(\"blur mouseenter\", \"a.wpseo_tablink\", function () {\n\t\t\t\t// Make the element tooltip-able again.\n\t\t\t\tjQuery(this).removeClass(\"yoast-tooltip-hidden\");\n\t\t\t});\n\t\t}\n\n\t\tif (jQuery(\".wpseo-meta-section\").length > 0) {\n\t\t\tjQuery(\"#wpseo-meta-section-content\").addClass(\"active\");\n\t\t\tjQuery(\".wpseo-metabox-sidebar li\").filter(function () {\n\t\t\t\treturn jQuery(this).find(\".wpseo-meta-section-link\").attr(\"href\") === \"#wpseo-meta-section-content\";\n\t\t\t}).addClass(\"active\");\n\n\t\t\tjQuery(\"a.wpseo-meta-section-link\").on(\"click\", function (ev) {\n\t\t\t\tev.preventDefault();\n\n\t\t\t\tjQuery(\".wpseo-metabox-sidebar li\").removeClass(\"active\");\n\t\t\t\tjQuery(\".wpseo-meta-section\").removeClass(\"active\");\n\n\t\t\t\t// Hide the Yoast tooltip when the element gets clicked.\n\t\t\t\tjQuery(this).addClass(\"yoast-tooltip-hidden\");\n\n\t\t\t\tvar targetElem = jQuery(jQuery(this).attr(\"href\"));\n\t\t\t\ttargetElem.addClass(\"active\");\n\n\t\t\t\tjQuery(this).parent(\"li\").addClass(\"active\");\n\t\t\t}).on(\"mouseleave\", function () {\n\t\t\t\t// The element can still have focus, ensure to hide the tooltip.\n\t\t\t\tjQuery(this).addClass(\"yoast-tooltip-hidden\");\n\t\t\t}).on(\"blur mouseenter\", function () {\n\t\t\t\t// Make the element tooltip-able again.\n\t\t\t\tjQuery(this).removeClass(\"yoast-tooltip-hidden\");\n\t\t\t});\n\t\t}\n\n\t\tjQuery(\".wpseo-metabox-tabs\").show();\n\t\t// End Tabs code.\n\t}\n\n\twindow.wpseoInitTabs = wpseoInitTabs;\n\twindow.wpseo_init_tabs = wpseoInitTabs;\n\n\t/**\n  * @summary Adds select2 for selected fields.\n  *\n  * @returns {void}\n  */\n\tfunction initSelect2() {\n\t\t// Select2 for Yoast SEO Metabox Advanced tab\n\t\t$(\"#yoast_wpseo_meta-robots-noindex\").select2({ width: \"100%\", language: wpseoSelect2Locale });\n\t\t$(\"#yoast_wpseo_meta-robots-adv\").select2({ width: \"100%\", language: wpseoSelect2Locale });\n\t}\n\n\t/**\n  * @summary Shows a informational popup if someone click the add keyword button.\n  *\n  * @returns {void}\n  */\n\tfunction addKeywordPopup() {\n\t\tvar $buyButton = $(\"#wpseo-add-keyword-popup-button\"),\n\t\t    title = $buyButton.text(),\n\t\t    $popupWindow,\n\t\t    $closeButton;\n\n\t\ttb_show(title, \"#TB_inline?width=650&height=350&inlineId=wpseo-add-keyword-popup\", \"group\");\n\n\t\t// The thicbox popup UI is now available.\n\t\t$popupWindow = $(\"#TB_window\");\n\t\t$closeButton = $(\"#TB_closeWindowButton\");\n\n\t\t// The container window isn't the correct size, rectify this and also the centering.\n\t\t$popupWindow.css({ width: 680, height: 350, \"margin-left\": -340 });\n\n\t\t// Accessibility improvements.\n\t\t$popupWindow.attr({\n\t\t\trole: \"dialog\",\n\t\t\t\"aria-labelledby\": \"TB_ajaxWindowTitle\",\n\t\t\t\"aria-describedby\": \"TB_ajaxContent\"\n\t\t}).on(\"keydown\", function (event) {\n\t\t\tvar id;\n\n\t\t\t// Constrain tabbing within the modal.\n\t\t\tif (9 === event.which) {\n\t\t\t\tid = event.target.id;\n\n\t\t\t\tif (id === \"wpseo-add-keyword-popup-button\" && !event.shiftKey) {\n\t\t\t\t\t$closeButton.focus();\n\t\t\t\t\tevent.preventDefault();\n\t\t\t\t} else if (id === \"TB_closeWindowButton\" && event.shiftKey) {\n\t\t\t\t\t$buyButton.focus();\n\t\t\t\t\tevent.preventDefault();\n\t\t\t\t}\n\t\t\t}\n\t\t});\n\n\t\t// Move focus back to the element that opened the modal.\n\t\t$(\"body\").on(\"thickbox:removed\", function () {\n\t\t\t$(\".wpseo-add-keyword\").focus();\n\t\t});\n\t}\n\n\t/**\n  * @summary Adds keyword popup if the template for it is found.\n  *\n  * @returns {void}\n  */\n\tfunction initAddKeywordPopup() {\n\t\t// If add keyword popup exists bind it to the add keyword button\n\t\tif (1 === $(\"#wpseo-add-keyword-popup\").length) {\n\t\t\t$(\".wpseo-add-keyword\").on(\"click\", addKeywordPopup);\n\t\t}\n\t}\n\n\t/**\n  * Move the help elements by injecting them into the h3 elements.\n  *\n  * @returns {void}\n  */\n\tfunction moveHelpElements() {\n\t\tjQuery(\"#wpseo-focuskeyword-section\").find(\"h3\").after(jQuery(\"#help-yoast-focuskeyword\").detach().removeClass(\"wpseo_hidden\"));\n\n\t\tjQuery(\"#wpseo-pageanalysis-section\").find(\"h3\").after(jQuery(\"#help-yoast-pageanalysis\").detach().removeClass(\"wpseo_hidden\"));\n\n\t\tvar snippetHelp = jQuery(\"#help-yoast-snippetpreview\").detach().removeClass(\"wpseo_hidden\");\n\t\t// Post/taxonomy/media meta box.\n\t\tjQuery(\"#wpseosnippet\").find(\"h3\").after(snippetHelp);\n\t}\n\n\tjQuery(document).ready(function () {\n\t\tjQuery(\".wpseo-meta-section\").each(function (_, el) {\n\t\t\tjQuery(el).find(\".wpseo-metabox-tabs li:first\").addClass(\"active\");\n\t\t\tjQuery(el).find(\".wpseotab:first\").addClass(\"active\");\n\t\t});\n\t\twindow.wpseo_init_tabs();\n\n\t\tinitAddKeywordPopup();\n\t\tinitSelect2();\n\n\t\tjQuery(window).on(\"YoastSEO:ready\", moveHelpElements);\n\t});\n})(jQuery);\n\n/* eslint-disable */\n/* jshint ignore:start */\n/**\n * Cleans up a string, removing script tags etc.\n *\n * @deprecated since version 3.0\n *\n * @param {string} str\n *\n * @returns {string}\n */\nfunction ystClean(str) {\n\tconsole.error(\"ystClean is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n\n\treturn str;\n}\n\n/**\n * Tests whether given element `str` matches `p`.\n *\n * @deprecated since version 3.0\n *\n * @param {string} str The string to match\n * @param {RegExp} p The regex to match\n * @returns {string}\n */\nfunction ystFocusKwTest(str, p) {\n\tconsole.error(\"ystFocusKwTest is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n\n\treturn \"\";\n}\n\n/**\n * The function name says it all, removes lower case diacritics\n *\n * @deprecated since version 3.0\n *\n * @param {string} str\n * @returns {string}\n */\nfunction ystRemoveLowerCaseDiacritics(str) {\n\tconsole.error(\"ystRemoveLowerCaseDiacritics is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n\n\treturn str;\n}\n\n/**\n * Tests whether the focus keyword is used in title, body and description\n *\n * @deprecated since version 3.0\n */\nfunction ystTestFocusKw() {\n\tconsole.error(\"ystTestFocusKw is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n}\n\n/**\n * This callback is used for variable replacement\n *\n * This is done through a callback as it _could_ be that `ystReplaceVariables` has to do an AJAX request.\n *\n * @callback replaceVariablesCallback\n * @param {string} str The string with the replaced variables in it\n */\n\n/**\n * Replaces variables either with values from wpseoMetaboxL10n, by grabbing them from the page or (ultimately) getting them through AJAX\n *\n * @deprecated since version 3.0\n *\n * @param {string} str The string with variables to be replaced\n * @param {replaceVariablesCallback} callback Callback function for when the\n */\nfunction ystReplaceVariables(str, callback) {\n\tconsole.error(\"ystReplaceVariables is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n\n\tcallback(str);\n}\n\n/**\n * Replace a variable with a string, through an AJAX call to WP\n *\n * @deprecated since version 3.0\n *\n * @param {string} replaceableVar\n * @param {replaceVariablesCallback} callback\n */\nfunction ystAjaxReplaceVariables(replaceableVar, callback) {\n\tconsole.error(\"ystAjaxReplaceVariables is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n}\n\n/**\n * Updates the title in the snippet preview\n *\n * @deprecated since version 3.0\n *\n * @param {boolean} [force = false]\n */\nfunction ystUpdateTitle(force) {\n\tconsole.error(\"ystUpdateTitle is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n}\n\n/**\n * Cleans the title before use\n *\n * @deprecated since version 3.0\n *\n * @param {string} title\n * @returns {string}\n */\nfunction ystSanitizeTitle(title) {\n\tconsole.error(\"ystSanitizeTitle is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n\n\treturn title;\n}\n\n/**\n * Updates the meta description in the snippet preview\n *\n * @deprecated since version 3.0\n */\nfunction ystUpdateDesc() {\n\tconsole.error(\"ystUpdateDesc is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n}\n\n/**\n * Sanitized the description\n *\n * @deprecated since version 3.0\n *\n * @param {string} desc\n * @returns {string}\n */\nfunction ystSanitizeDesc(desc) {\n\tconsole.error(\"ystSanitizeDesc is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n\n\treturn desc;\n}\n\n/**\n * Trims the description to the desired length\n *\n * @deprecated since version 3.0\n *\n * @param {string} desc\n * @returns {string}\n */\nfunction ystTrimDesc(desc) {\n\tconsole.error(\"ystTrimDesc is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n\n\treturn desc;\n}\n\n/**\n * Updates the URL in the snippet preview\n *\n * @deprecated since version 3.0\n */\nfunction ystUpdateURL() {\n\tconsole.error(\"ystUpdateURL is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n}\n\n/**\n * Bolds the keywords in a string\n *\n * @deprecated since version 3.0\n *\n * @param {string} str\n * @param {boolean} url\n * @returns {string}\n */\nfunction ystBoldKeywords(str, url) {\n\tconsole.error(\"ystBoldKeywords is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n\n\treturn str;\n}\n\n/**\n * Updates the entire snippet preview\n *\n * @deprecated since version 3.0\n */\nfunction ystUpdateSnippet() {\n\tconsole.error(\"ystUpdateSnippet is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n}\n\n/**\n * Escapres the focus keyword\n *\n * @deprecated since version 3.0\n *\n * @param {string} str\n * @returns {string}\n */\nfunction ystEscapeFocusKw(str) {\n\tconsole.error(\"ystEscapeFocusKw is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.\");\n\n\treturn str;\n}\n\nwindow.ystClean = ystClean;\nwindow.ystFocusKwTest = ystFocusKwTest;\nwindow.ystRemoveLowerCaseDiacritics = ystRemoveLowerCaseDiacritics;\nwindow.ystTestFocusKw = ystTestFocusKw;\nwindow.ystReplaceVariables = ystReplaceVariables;\nwindow.ystAjaxReplaceVariables = ystAjaxReplaceVariables;\nwindow.ystUpdateTitle = ystUpdateTitle;\nwindow.ystSanitizeTitle = ystSanitizeTitle;\nwindow.ystUpdateDesc = ystUpdateDesc;\nwindow.ystSanitizeDesc = ystSanitizeDesc;\nwindow.ystTrimDesc = ystTrimDesc;\nwindow.ystUpdateURL = ystUpdateURL;\nwindow.ystBoldKeywords = ystBoldKeywords;\nwindow.ystUpdateSnippet = ystUpdateSnippet;\nwindow.ystEscapeFocusKw = ystEscapeFocusKw;\n/* jshint ignore:end */\n/* eslint-enable */\n\n//////////////////\n// WEBPACK FOOTER\n// ./wp-seo-metabox.js\n// module id = 1265\n// module chunks = 5\n\n//# sourceURL=webpack:///./wp-seo-metabox.js?");

/***/ })

/******/ });