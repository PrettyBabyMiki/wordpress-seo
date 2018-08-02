yoastWebpackJsonp([20],{

/***/ 1065:
/***/ (function(module, exports) {

eval("var containerPolite, containerAssertive, previousMessage = \"\";\n\n/**\n * Build the live regions markup.\n *\n * @param {String} ariaLive Optional. Value for the \"aria-live\" attribute, default \"polite\".\n *\n * @returns {Object} $container The ARIA live region jQuery object.\n */\nvar addContainer = function( ariaLive ) {\n\tariaLive = ariaLive || \"polite\";\n\n\tvar container = document.createElement( \"div\" );\n\tcontainer.id = \"a11y-speak-\" + ariaLive;\n\tcontainer.className = \"a11y-speak-region\";\n\n\tvar screenReaderTextStyle = \"clip: rect(1px, 1px, 1px, 1px); position: absolute; height: 1px; width: 1px; overflow: hidden; word-wrap: normal;\";\n\tcontainer.setAttribute( \"style\", screenReaderTextStyle );\n\n\tcontainer.setAttribute( \"aria-live\", ariaLive );\n\tcontainer.setAttribute( \"aria-relevant\", \"additions text\" );\n\tcontainer.setAttribute( \"aria-atomic\", \"true\" );\n\n\tdocument.querySelector( \"body\" ).appendChild( container );\n\treturn container;\n};\n\n/**\n * Specify a function to execute when the DOM is fully loaded.\n *\n * @param {Function} callback A function to execute after the DOM is ready.\n *\n * @returns {void}\n */\nvar domReady = function( callback ) {\n\tif ( document.readyState === \"complete\" || ( document.readyState !== \"loading\" && !document.documentElement.doScroll ) ) {\n\t\treturn callback();\n\t}\n\n\tdocument.addEventListener( \"DOMContentLoaded\", callback );\n};\n\n/**\n * Create the live regions when the DOM is fully loaded.\n */\ndomReady( function() {\n\tcontainerPolite = document.getElementById( \"a11y-speak-polite\" );\n\tcontainerAssertive = document.getElementById( \"a11y-speak-assertive\" );\n\n\tif ( containerPolite === null ) {\n\t\tcontainerPolite = addContainer( \"polite\" );\n\t}\n\tif ( containerAssertive === null ) {\n\t\tcontainerAssertive = addContainer( \"assertive\" );\n\t}\n} );\n\n/**\n * Clear the live regions.\n */\nvar clear = function() {\n\tvar regions = document.querySelectorAll( \".a11y-speak-region\" );\n\tfor ( var i = 0; i < regions.length; i++ ) {\n\t\tregions[ i ].textContent = \"\";\n\t}\n};\n\n/**\n * Update the ARIA live notification area text node.\n *\n * @param {String} message  The message to be announced by Assistive Technologies.\n * @param {String} ariaLive Optional. The politeness level for aria-live. Possible values:\n *                          polite or assertive. Default polite.\n */\nvar A11ySpeak = function( message, ariaLive ) {\n\t// Clear previous messages to allow repeated strings being read out.\n\tclear();\n\n\t/*\n\t * Strip HTML tags (if any) from the message string. Ideally, messages should\n\t * be simple strings, carefully crafted for specific use with A11ySpeak.\n\t * When re-using already existing strings this will ensure simple HTML to be\n\t * stripped out and replaced with a space. Browsers will collapse multiple\n\t * spaces natively.\n\t */\n\tmessage = message.replace( /<[^<>]+>/g, \" \" );\n\n\tif ( previousMessage === message ) {\n\t\tmessage = message + \"\\u00A0\";\n\t}\n\n\tpreviousMessage = message;\n\n\tif ( containerAssertive && \"assertive\" === ariaLive ) {\n\t\tcontainerAssertive.textContent = message;\n\t} else if ( containerPolite ) {\n\t\tcontainerPolite.textContent = message;\n\t}\n};\n\nmodule.exports = A11ySpeak;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTA2NS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8vVXNlcnMvamltbXkvWW9hc3QvdmFncmFudC1sb2NhbC93d3cvd29yZHByZXNzLWRlZmF1bHQvcHVibGljX2h0bWwvd3AtY29udGVudC9wbHVnaW5zL3dvcmRwcmVzcy1zZW8vbm9kZV9tb2R1bGVzL2ExMXktc3BlYWsvYTExeS1zcGVhay5qcz9mN2RkIl0sInNvdXJjZXNDb250ZW50IjpbInZhciBjb250YWluZXJQb2xpdGUsIGNvbnRhaW5lckFzc2VydGl2ZSwgcHJldmlvdXNNZXNzYWdlID0gXCJcIjtcblxuLyoqXG4gKiBCdWlsZCB0aGUgbGl2ZSByZWdpb25zIG1hcmt1cC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gYXJpYUxpdmUgT3B0aW9uYWwuIFZhbHVlIGZvciB0aGUgXCJhcmlhLWxpdmVcIiBhdHRyaWJ1dGUsIGRlZmF1bHQgXCJwb2xpdGVcIi5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAkY29udGFpbmVyIFRoZSBBUklBIGxpdmUgcmVnaW9uIGpRdWVyeSBvYmplY3QuXG4gKi9cbnZhciBhZGRDb250YWluZXIgPSBmdW5jdGlvbiggYXJpYUxpdmUgKSB7XG5cdGFyaWFMaXZlID0gYXJpYUxpdmUgfHwgXCJwb2xpdGVcIjtcblxuXHR2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJkaXZcIiApO1xuXHRjb250YWluZXIuaWQgPSBcImExMXktc3BlYWstXCIgKyBhcmlhTGl2ZTtcblx0Y29udGFpbmVyLmNsYXNzTmFtZSA9IFwiYTExeS1zcGVhay1yZWdpb25cIjtcblxuXHR2YXIgc2NyZWVuUmVhZGVyVGV4dFN0eWxlID0gXCJjbGlwOiByZWN0KDFweCwgMXB4LCAxcHgsIDFweCk7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgaGVpZ2h0OiAxcHg7IHdpZHRoOiAxcHg7IG92ZXJmbG93OiBoaWRkZW47IHdvcmQtd3JhcDogbm9ybWFsO1wiO1xuXHRjb250YWluZXIuc2V0QXR0cmlidXRlKCBcInN0eWxlXCIsIHNjcmVlblJlYWRlclRleHRTdHlsZSApO1xuXG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1saXZlXCIsIGFyaWFMaXZlICk7XG5cdGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoIFwiYXJpYS1yZWxldmFudFwiLCBcImFkZGl0aW9ucyB0ZXh0XCIgKTtcblx0Y29udGFpbmVyLnNldEF0dHJpYnV0ZSggXCJhcmlhLWF0b21pY1wiLCBcInRydWVcIiApO1xuXG5cdGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoIFwiYm9keVwiICkuYXBwZW5kQ2hpbGQoIGNvbnRhaW5lciApO1xuXHRyZXR1cm4gY29udGFpbmVyO1xufTtcblxuLyoqXG4gKiBTcGVjaWZ5IGEgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIHRoZSBET00gaXMgZnVsbHkgbG9hZGVkLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIEEgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhZnRlciB0aGUgRE9NIGlzIHJlYWR5LlxuICpcbiAqIEByZXR1cm5zIHt2b2lkfVxuICovXG52YXIgZG9tUmVhZHkgPSBmdW5jdGlvbiggY2FsbGJhY2sgKSB7XG5cdGlmICggZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIHx8ICggZG9jdW1lbnQucmVhZHlTdGF0ZSAhPT0gXCJsb2FkaW5nXCIgJiYgIWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5kb1Njcm9sbCApICkge1xuXHRcdHJldHVybiBjYWxsYmFjaygpO1xuXHR9XG5cblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lciggXCJET01Db250ZW50TG9hZGVkXCIsIGNhbGxiYWNrICk7XG59O1xuXG4vKipcbiAqIENyZWF0ZSB0aGUgbGl2ZSByZWdpb25zIHdoZW4gdGhlIERPTSBpcyBmdWxseSBsb2FkZWQuXG4gKi9cbmRvbVJlYWR5KCBmdW5jdGlvbigpIHtcblx0Y29udGFpbmVyUG9saXRlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoIFwiYTExeS1zcGVhay1wb2xpdGVcIiApO1xuXHRjb250YWluZXJBc3NlcnRpdmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggXCJhMTF5LXNwZWFrLWFzc2VydGl2ZVwiICk7XG5cblx0aWYgKCBjb250YWluZXJQb2xpdGUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyUG9saXRlID0gYWRkQ29udGFpbmVyKCBcInBvbGl0ZVwiICk7XG5cdH1cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgPT09IG51bGwgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlID0gYWRkQ29udGFpbmVyKCBcImFzc2VydGl2ZVwiICk7XG5cdH1cbn0gKTtcblxuLyoqXG4gKiBDbGVhciB0aGUgbGl2ZSByZWdpb25zLlxuICovXG52YXIgY2xlYXIgPSBmdW5jdGlvbigpIHtcblx0dmFyIHJlZ2lvbnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCBcIi5hMTF5LXNwZWFrLXJlZ2lvblwiICk7XG5cdGZvciAoIHZhciBpID0gMDsgaSA8IHJlZ2lvbnMubGVuZ3RoOyBpKysgKSB7XG5cdFx0cmVnaW9uc1sgaSBdLnRleHRDb250ZW50ID0gXCJcIjtcblx0fVxufTtcblxuLyoqXG4gKiBVcGRhdGUgdGhlIEFSSUEgbGl2ZSBub3RpZmljYXRpb24gYXJlYSB0ZXh0IG5vZGUuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG1lc3NhZ2UgIFRoZSBtZXNzYWdlIHRvIGJlIGFubm91bmNlZCBieSBBc3Npc3RpdmUgVGVjaG5vbG9naWVzLlxuICogQHBhcmFtIHtTdHJpbmd9IGFyaWFMaXZlIE9wdGlvbmFsLiBUaGUgcG9saXRlbmVzcyBsZXZlbCBmb3IgYXJpYS1saXZlLiBQb3NzaWJsZSB2YWx1ZXM6XG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgcG9saXRlIG9yIGFzc2VydGl2ZS4gRGVmYXVsdCBwb2xpdGUuXG4gKi9cbnZhciBBMTF5U3BlYWsgPSBmdW5jdGlvbiggbWVzc2FnZSwgYXJpYUxpdmUgKSB7XG5cdC8vIENsZWFyIHByZXZpb3VzIG1lc3NhZ2VzIHRvIGFsbG93IHJlcGVhdGVkIHN0cmluZ3MgYmVpbmcgcmVhZCBvdXQuXG5cdGNsZWFyKCk7XG5cblx0Lypcblx0ICogU3RyaXAgSFRNTCB0YWdzIChpZiBhbnkpIGZyb20gdGhlIG1lc3NhZ2Ugc3RyaW5nLiBJZGVhbGx5LCBtZXNzYWdlcyBzaG91bGRcblx0ICogYmUgc2ltcGxlIHN0cmluZ3MsIGNhcmVmdWxseSBjcmFmdGVkIGZvciBzcGVjaWZpYyB1c2Ugd2l0aCBBMTF5U3BlYWsuXG5cdCAqIFdoZW4gcmUtdXNpbmcgYWxyZWFkeSBleGlzdGluZyBzdHJpbmdzIHRoaXMgd2lsbCBlbnN1cmUgc2ltcGxlIEhUTUwgdG8gYmVcblx0ICogc3RyaXBwZWQgb3V0IGFuZCByZXBsYWNlZCB3aXRoIGEgc3BhY2UuIEJyb3dzZXJzIHdpbGwgY29sbGFwc2UgbXVsdGlwbGVcblx0ICogc3BhY2VzIG5hdGl2ZWx5LlxuXHQgKi9cblx0bWVzc2FnZSA9IG1lc3NhZ2UucmVwbGFjZSggLzxbXjw+XSs+L2csIFwiIFwiICk7XG5cblx0aWYgKCBwcmV2aW91c01lc3NhZ2UgPT09IG1lc3NhZ2UgKSB7XG5cdFx0bWVzc2FnZSA9IG1lc3NhZ2UgKyBcIlxcdTAwQTBcIjtcblx0fVxuXG5cdHByZXZpb3VzTWVzc2FnZSA9IG1lc3NhZ2U7XG5cblx0aWYgKCBjb250YWluZXJBc3NlcnRpdmUgJiYgXCJhc3NlcnRpdmVcIiA9PT0gYXJpYUxpdmUgKSB7XG5cdFx0Y29udGFpbmVyQXNzZXJ0aXZlLnRleHRDb250ZW50ID0gbWVzc2FnZTtcblx0fSBlbHNlIGlmICggY29udGFpbmVyUG9saXRlICkge1xuXHRcdGNvbnRhaW5lclBvbGl0ZS50ZXh0Q29udGVudCA9IG1lc3NhZ2U7XG5cdH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQTExeVNwZWFrO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gL1VzZXJzL2ppbW15L1lvYXN0L3ZhZ3JhbnQtbG9jYWwvd3d3L3dvcmRwcmVzcy1kZWZhdWx0L3B1YmxpY19odG1sL3dwLWNvbnRlbnQvcGx1Z2lucy93b3JkcHJlc3Mtc2VvL25vZGVfbW9kdWxlcy9hMTF5LXNwZWFrL2ExMXktc3BlYWsuanNcbi8vIG1vZHVsZSBpZCA9IDEwNjVcbi8vIG1vZHVsZSBjaHVua3MgPSAxMSAxMiAxOSAyMCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTsiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///1065\n");

/***/ }),

/***/ 1952:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _a11ySpeak = __webpack_require__(1065);\n\nvar _a11ySpeak2 = _interopRequireDefault(_a11ySpeak);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\n(function ($) {\n\t\"use strict\";\n\n\t/**\n  * Displays given settings errors.\n  *\n  * @param {Object} settingsErrors The list of settings error objects.\n  *\n  * @returns {void}\n  */\n\n\tfunction displaySettingsErrors(settingsErrors) {\n\t\tvar $heading = $(\".wrap > h1\");\n\t\tvar notices;\n\t\tvar prefix;\n\n\t\tif (!settingsErrors.length) {\n\t\t\treturn;\n\t\t}\n\n\t\tnotices = settingsErrors.map(function (settingsError) {\n\t\t\treturn \"<div class='\" + settingsError.type + \" notice'><p>\" + settingsError.message + \"</p></div>\";\n\t\t});\n\n\t\t$heading.after(notices.join(\"\"));\n\n\t\tprefix = wpseoNetworkAdminGlobalL10n.error_prefix;\n\t\tif (settingsErrors[0].type === \"updated\") {\n\t\t\tprefix = wpseoNetworkAdminGlobalL10n.success_prefix;\n\t\t}\n\n\t\t(0, _a11ySpeak2.default)(prefix.replace(\"%s\", settingsErrors[0].message), \"assertive\");\n\t}\n\n\t/**\n  * Handles a form submission with AJAX.\n  *\n  * @param {Event} event The submission event.\n  *\n  * @returns {void}\n  */\n\tfunction handleAJAXSubmission(event) {\n\t\tvar $form = $(this);\n\t\tvar $submit = $form.find(\"[type='submit']:focus\");\n\t\tvar formData = $form.serialize();\n\n\t\tevent.preventDefault();\n\n\t\t$(\".wrap > .notice\").remove();\n\n\t\tif (!$submit.length) {\n\t\t\t$submit = $(\".wpseotab.active [type='submit']\");\n\t\t}\n\n\t\tif ($submit.attr(\"name\") === \"action\") {\n\t\t\tformData = formData.replace(/action=([a-zA-Z0-9_]+)/, \"action=\" + $submit.val());\n\t\t}\n\n\t\t$.ajax({\n\t\t\ttype: \"POST\",\n\t\t\turl: ajaxurl,\n\t\t\tdata: formData\n\t\t}).done(function (response) {\n\t\t\tif (!response.data) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tdisplaySettingsErrors(response.data);\n\t\t}).fail(function (xhr) {\n\t\t\tvar response = xhr.responseJSON;\n\n\t\t\tif (!response || !response.data) {\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tdisplaySettingsErrors(response.data);\n\t\t});\n\n\t\treturn false;\n\t}\n\n\t$(document).ready(function () {\n\t\tvar $form = $(\"#wpseo-conf\");\n\n\t\tif (!$form.length) {\n\t\t\treturn;\n\t\t}\n\n\t\t$form.on(\"submit\", handleAJAXSubmission);\n\t});\n})(jQuery); /* global wpseoNetworkAdminGlobalL10n, ajaxurl *///# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMTk1Mi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9qcy9zcmMvd3Atc2VvLW5ldHdvcmstYWRtaW4uanM/NDk5NSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgd3BzZW9OZXR3b3JrQWRtaW5HbG9iYWxMMTBuLCBhamF4dXJsICovXG5cbmltcG9ydCBhMTF5U3BlYWsgZnJvbSBcImExMXktc3BlYWtcIjtcblxuKCBmdW5jdGlvbiggJCApIHtcblx0XCJ1c2Ugc3RyaWN0XCI7XG5cblx0LyoqXG5cdCAqIERpc3BsYXlzIGdpdmVuIHNldHRpbmdzIGVycm9ycy5cblx0ICpcblx0ICogQHBhcmFtIHtPYmplY3R9IHNldHRpbmdzRXJyb3JzIFRoZSBsaXN0IG9mIHNldHRpbmdzIGVycm9yIG9iamVjdHMuXG5cdCAqXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxuXHQgKi9cblx0ZnVuY3Rpb24gZGlzcGxheVNldHRpbmdzRXJyb3JzKCBzZXR0aW5nc0Vycm9ycyApIHtcblx0XHR2YXIgJGhlYWRpbmcgPSAkKCBcIi53cmFwID4gaDFcIiApO1xuXHRcdHZhciBub3RpY2VzO1xuXHRcdHZhciBwcmVmaXg7XG5cblx0XHRpZiAoICEgc2V0dGluZ3NFcnJvcnMubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdG5vdGljZXMgPSBzZXR0aW5nc0Vycm9ycy5tYXAoIGZ1bmN0aW9uKCBzZXR0aW5nc0Vycm9yICkge1xuXHRcdFx0cmV0dXJuIFwiPGRpdiBjbGFzcz0nXCIgKyBzZXR0aW5nc0Vycm9yLnR5cGUgKyBcIiBub3RpY2UnPjxwPlwiICsgc2V0dGluZ3NFcnJvci5tZXNzYWdlICsgXCI8L3A+PC9kaXY+XCI7XG5cdFx0fSApO1xuXG5cdFx0JGhlYWRpbmcuYWZ0ZXIoIG5vdGljZXMuam9pbiggXCJcIiApICk7XG5cblx0XHRwcmVmaXggPSB3cHNlb05ldHdvcmtBZG1pbkdsb2JhbEwxMG4uZXJyb3JfcHJlZml4O1xuXHRcdGlmICggc2V0dGluZ3NFcnJvcnNbIDAgXS50eXBlID09PSBcInVwZGF0ZWRcIiApIHtcblx0XHRcdHByZWZpeCA9IHdwc2VvTmV0d29ya0FkbWluR2xvYmFsTDEwbi5zdWNjZXNzX3ByZWZpeDtcblx0XHR9XG5cblx0XHRhMTF5U3BlYWsoIHByZWZpeC5yZXBsYWNlKCBcIiVzXCIsIHNldHRpbmdzRXJyb3JzWyAwIF0ubWVzc2FnZSApLCBcImFzc2VydGl2ZVwiICk7XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlcyBhIGZvcm0gc3VibWlzc2lvbiB3aXRoIEFKQVguXG5cdCAqXG5cdCAqIEBwYXJhbSB7RXZlbnR9IGV2ZW50IFRoZSBzdWJtaXNzaW9uIGV2ZW50LlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIGhhbmRsZUFKQVhTdWJtaXNzaW9uKCBldmVudCApIHtcblx0XHR2YXIgJGZvcm0gICAgPSAkKCB0aGlzICk7XG5cdFx0dmFyICRzdWJtaXQgID0gJGZvcm0uZmluZCggXCJbdHlwZT0nc3VibWl0J106Zm9jdXNcIiApO1xuXHRcdHZhciBmb3JtRGF0YSA9ICRmb3JtLnNlcmlhbGl6ZSgpO1xuXG5cdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdCQoIFwiLndyYXAgPiAubm90aWNlXCIgKS5yZW1vdmUoKTtcblxuXHRcdGlmICggISAkc3VibWl0Lmxlbmd0aCApIHtcblx0XHRcdCRzdWJtaXQgPSAkKCBcIi53cHNlb3RhYi5hY3RpdmUgW3R5cGU9J3N1Ym1pdCddXCIgKTtcblx0XHR9XG5cblx0XHRpZiAoICRzdWJtaXQuYXR0ciggXCJuYW1lXCIgKSA9PT0gXCJhY3Rpb25cIiApIHtcblx0XHRcdGZvcm1EYXRhID0gZm9ybURhdGEucmVwbGFjZSggL2FjdGlvbj0oW2EtekEtWjAtOV9dKykvLCBcImFjdGlvbj1cIiArICRzdWJtaXQudmFsKCkgKTtcblx0XHR9XG5cblx0XHQkLmFqYXgoIHtcblx0XHRcdHR5cGU6IFwiUE9TVFwiLFxuXHRcdFx0dXJsOiBhamF4dXJsLFxuXHRcdFx0ZGF0YTogZm9ybURhdGEsXG5cdFx0fSApXG5cdFx0XHQuZG9uZSggZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0XHRpZiAoICEgcmVzcG9uc2UuZGF0YSApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkaXNwbGF5U2V0dGluZ3NFcnJvcnMoIHJlc3BvbnNlLmRhdGEgKTtcblx0XHRcdH0gKVxuXHRcdFx0LmZhaWwoIGZ1bmN0aW9uKCB4aHIgKSB7XG5cdFx0XHRcdHZhciByZXNwb25zZSA9IHhoci5yZXNwb25zZUpTT047XG5cblx0XHRcdFx0aWYgKCAhIHJlc3BvbnNlIHx8ICEgcmVzcG9uc2UuZGF0YSApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkaXNwbGF5U2V0dGluZ3NFcnJvcnMoIHJlc3BvbnNlLmRhdGEgKTtcblx0XHRcdH0gKTtcblxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXG5cdCQoIGRvY3VtZW50ICkucmVhZHkoIGZ1bmN0aW9uKCkge1xuXHRcdHZhciAkZm9ybSA9ICQoIFwiI3dwc2VvLWNvbmZcIiApO1xuXG5cdFx0aWYgKCAhICRmb3JtLmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHQkZm9ybS5vbiggXCJzdWJtaXRcIiwgaGFuZGxlQUpBWFN1Ym1pc3Npb24gKTtcblx0fSApO1xufSggalF1ZXJ5ICkgKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBqcy9zcmMvd3Atc2VvLW5ldHdvcmstYWRtaW4uanMiXSwibWFwcGluZ3MiOiI7O0FBRUE7QUFDQTs7Ozs7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///1952\n");

/***/ })

},[1952]);