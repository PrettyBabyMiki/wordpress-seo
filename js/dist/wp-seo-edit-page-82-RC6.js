yoastWebpackJsonp([25],{

/***/ 2564:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\n(function ($) {\n\t// Set the yoast-tooltips on the list table links columns that have links.\n\t$(\".yoast-column-header-has-tooltip\").each(function () {\n\t\tvar parentLink = $(this).closest(\"th\").find(\"a\");\n\n\t\tparentLink.addClass(\"yoast-tooltip yoast-tooltip-n yoast-tooltip-multiline\").attr(\"aria-label\", $(this).data(\"label\"));\n\t});\n\n\t// Clean up the columns titles HTML for the Screen Options checkboxes labels.\n\t$(\".yoast-column-header-has-tooltip, .yoast-tooltip\", \"#screen-meta\").each(function () {\n\t\tvar text = $(this).text();\n\t\t$(this).replaceWith(text);\n\t});\n})(jQuery);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMjU2NC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9qcy9zcmMvd3Atc2VvLWVkaXQtcGFnZS5qcz9mNjNmIl0sInNvdXJjZXNDb250ZW50IjpbIiggZnVuY3Rpb24oICQgKSB7XG5cdC8vIFNldCB0aGUgeW9hc3QtdG9vbHRpcHMgb24gdGhlIGxpc3QgdGFibGUgbGlua3MgY29sdW1ucyB0aGF0IGhhdmUgbGlua3MuXG5cdCQoIFwiLnlvYXN0LWNvbHVtbi1oZWFkZXItaGFzLXRvb2x0aXBcIiApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciBwYXJlbnRMaW5rID0gJCggdGhpcyApLmNsb3Nlc3QoIFwidGhcIiApLmZpbmQoIFwiYVwiICk7XG5cblx0XHRwYXJlbnRMaW5rXG5cdFx0XHQuYWRkQ2xhc3MoIFwieW9hc3QtdG9vbHRpcCB5b2FzdC10b29sdGlwLW4geW9hc3QtdG9vbHRpcC1tdWx0aWxpbmVcIiApXG5cdFx0XHQuYXR0ciggXCJhcmlhLWxhYmVsXCIsICQoIHRoaXMgKS5kYXRhKCBcImxhYmVsXCIgKSApO1xuXHR9ICk7XG5cblx0Ly8gQ2xlYW4gdXAgdGhlIGNvbHVtbnMgdGl0bGVzIEhUTUwgZm9yIHRoZSBTY3JlZW4gT3B0aW9ucyBjaGVja2JveGVzIGxhYmVscy5cblx0JCggXCIueW9hc3QtY29sdW1uLWhlYWRlci1oYXMtdG9vbHRpcCwgLnlvYXN0LXRvb2x0aXBcIiwgXCIjc2NyZWVuLW1ldGFcIiApLmVhY2goIGZ1bmN0aW9uKCkge1xuXHRcdHZhciB0ZXh0ID0gJCggdGhpcyApLnRleHQoKTtcblx0XHQkKCB0aGlzICkucmVwbGFjZVdpdGgoIHRleHQgKTtcblx0fSApO1xufSggalF1ZXJ5ICkgKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyBqcy9zcmMvd3Atc2VvLWVkaXQtcGFnZS5qcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///2564\n");

/***/ })

},[2564]);