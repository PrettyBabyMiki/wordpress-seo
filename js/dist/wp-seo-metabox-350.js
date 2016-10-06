(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* browser:true */
/* global tb_show, wpseoSelect2Locale */
(function ($) {
	"use strict";

	window.wpseo_init_tabs = function () {
		if (jQuery(".wpseo-metabox-tabs-div").length > 0) {
			jQuery(".wpseo-metabox-tabs").on("click", "a.wpseo_tablink", function (ev) {
				ev.preventDefault();

				jQuery(".wpseo-meta-section.active .wpseo-metabox-tabs li").removeClass("active");
				jQuery(".wpseo-meta-section.active .wpseotab").removeClass("active");

				// Hide the Yoast tooltip when the element gets clicked.
				jQuery(this).addClass("yoast-tooltip-hidden");

				var targetElem = jQuery(jQuery(this).attr("href"));
				targetElem.addClass("active");
				jQuery(this).parent("li").addClass("active");

				if (jQuery(this).hasClass("scroll")) {
					jQuery("html, body").animate({
						scrollTop: jQuery(targetElem).offset().top
					}, 500);
				}
			}).on("mouseleave", "a.wpseo_tablink", function () {
				// The element can still have focus, ensure to hide the tooltip.
				jQuery(this).addClass("yoast-tooltip-hidden");
			}).on("blur mouseenter", "a.wpseo_tablink", function () {
				// Make the element tooltip-able again.
				jQuery(this).removeClass("yoast-tooltip-hidden");
			});
		}

		if (jQuery(".wpseo-meta-section").length > 0) {
			jQuery("#wpseo-meta-section-content").addClass("active");
			jQuery(".wpseo-metabox-sidebar li").filter(function () {
				return jQuery(this).find(".wpseo-meta-section-link").attr("href") === "#wpseo-meta-section-content";
			}).addClass("active");

			jQuery("a.wpseo-meta-section-link").on("click", function (ev) {
				ev.preventDefault();

				jQuery(".wpseo-metabox-sidebar li").removeClass("active");
				jQuery(".wpseo-meta-section").removeClass("active");

				// Hide the Yoast tooltip when the element gets clicked.
				jQuery(this).addClass("yoast-tooltip-hidden");

				var targetElem = jQuery(jQuery(this).attr("href"));
				targetElem.addClass("active");

				jQuery(this).parent("li").addClass("active");
			}).on("mouseleave", function () {
				// The element can still have focus, ensure to hide the tooltip.
				jQuery(this).addClass("yoast-tooltip-hidden");
			}).on("blur mouseenter", function () {
				// Make the element tooltip-able again.
				jQuery(this).removeClass("yoast-tooltip-hidden");
			});
		}

		jQuery(".wpseo-heading").hide();
		jQuery(".wpseo-metabox-tabs").show();
		// End Tabs code.
	};

	/**
  * Adds select2 for selected fields.
  */
	function initSelect2() {
		// Select2 for Yoast SEO Metabox Advanced tab
		$("#yoast_wpseo_meta-robots-noindex").select2({ width: "100%", language: wpseoSelect2Locale });
		$("#yoast_wpseo_meta-robots-adv").select2({ width: "100%", language: wpseoSelect2Locale });
	}

	/**
  * Shows a informational popup if someone click the add keyword button
  */
	function addKeywordPopup() {
		var $buyButton = $("#wpseo-add-keyword-popup-button"),
		    title = $buyButton.text(),
		    $popupWindow,
		    $closeButton;

		tb_show(title, "#TB_inline?width=650&height=350&inlineId=wpseo-add-keyword-popup", "group");

		// The thicbox popup UI is now available.
		$popupWindow = $("#TB_window");
		$closeButton = $("#TB_closeWindowButton");

		// The container window isn't the correct size, rectify this and also the centering.
		$popupWindow.css({ width: 680, height: 235, "margin-left": -340 });

		// Accessibility improvements.
		$popupWindow.attr({
			role: "dialog",
			"aria-labelledby": "TB_ajaxWindowTitle",
			"aria-describedby": "TB_ajaxContent"
		}).on("keydown", function (event) {
			var id;

			// Constrain tabbing within the modal.
			if (9 === event.which) {
				id = event.target.id;

				if (id === "wpseo-add-keyword-popup-button" && !event.shiftKey) {
					$closeButton.focus();
					event.preventDefault();
				} else if (id === "TB_closeWindowButton" && event.shiftKey) {
					$buyButton.focus();
					event.preventDefault();
				}
			}
		});

		// Move focus back to the element that opened the modal.
		$("body").on("thickbox:removed", function () {
			$(".wpseo-add-keyword").focus();
		});
	}

	/**
  * Adds keyword popup if the template for it is found
  */
	function initAddKeywordPopup() {
		// If add keyword popup exists bind it to the add keyword button
		if (1 === $("#wpseo-add-keyword-popup").length) {
			$(".wpseo-add-keyword").on("click", addKeywordPopup);
		}
	}

	/**
  * Move the help elements by injecting them into the h3 elements.
  *
  * @returns {void}
  */
	function moveHelpElements() {
		jQuery(" #wpseo-focuskeyword-section").find("h3").append(jQuery("#help-yoast-focuskeyword").detach().removeClass("wpseo_hidden"));

		jQuery(" #wpseo-pageanalysis-section").find("h3").append(jQuery("#help-yoast-pageanalysis").detach().removeClass("wpseo_hidden"));

		var snippetHelp = jQuery("#help-yoast-snippetpreview").detach().removeClass("wpseo_hidden");
		jQuery(" #wpseosnippet").find("h3").append(snippetHelp);
		jQuery(" #wpseo_snippet").find("h3").append(snippetHelp);
	}

	jQuery(document).ready(function () {
		jQuery(".wpseo-meta-section").each(function (_, el) {
			jQuery(el).find(".wpseo-metabox-tabs li:first").addClass("active");
			jQuery(el).find(".wpseotab:first").addClass("active");
		});
		window.wpseo_init_tabs();

		initAddKeywordPopup();
		initSelect2();

		jQuery(window).on("YoastSEO:ready", moveHelpElements);
	});
})(jQuery);

/* eslint-disable */
/* jshint ignore:start */
/**
 * Cleans up a string, removing script tags etc.
 *
 * @deprecated since version 3.0
 *
 * @param {string} str
 * @returns {string}
 */
function ystClean(str) {
	console.error("ystClean is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");

	return str;
}

/**
 * Tests whether given element `str` matches `p`.
 *
 * @deprecated since version 3.0
 *
 * @param {string} str The string to match
 * @param {RegExp} p The regex to match
 * @returns {string}
 */
function ystFocusKwTest(str, p) {
	console.error("ystFocusKwTest is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");

	return "";
}

/**
 * The function name says it all, removes lower case diacritics
 *
 * @deprecated since version 3.0
 *
 * @param {string} str
 * @returns {string}
 */
function ystRemoveLowerCaseDiacritics(str) {
	console.error("ystRemoveLowerCaseDiacritics is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");

	return str;
}

/**
 * Tests whether the focus keyword is used in title, body and description
 *
 * @deprecated since version 3.0
 */
function ystTestFocusKw() {
	console.error("ystTestFocusKw is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");
}

/**
 * This callback is used for variable replacement
 *
 * This is done through a callback as it _could_ be that `ystReplaceVariables` has to do an AJAX request.
 *
 * @callback replaceVariablesCallback
 * @param {string} str The string with the replaced variables in it
 */

/**
 * Replaces variables either with values from wpseoMetaboxL10n, by grabbing them from the page or (ultimately) getting them through AJAX
 *
 * @deprecated since version 3.0
 *
 * @param {string} str The string with variables to be replaced
 * @param {replaceVariablesCallback} callback Callback function for when the
 */
function ystReplaceVariables(str, callback) {
	console.error("ystReplaceVariables is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");

	callback(str);
}

/**
 * Replace a variable with a string, through an AJAX call to WP
 *
 * @deprecated since version 3.0
 *
 * @param {string} replaceableVar
 * @param {replaceVariablesCallback} callback
 */
function ystAjaxReplaceVariables(replaceableVar, callback) {
	console.error("ystAjaxReplaceVariables is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");
}

/**
 * Updates the title in the snippet preview
 *
 * @deprecated since version 3.0
 *
 * @param {boolean} [force = false]
 */
function ystUpdateTitle(force) {
	console.error("ystUpdateTitle is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");
}

/**
 * Cleans the title before use
 *
 * @deprecated since version 3.0
 *
 * @param {string} title
 * @returns {string}
 */
function ystSanitizeTitle(title) {
	console.error("ystSanitizeTitle is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");

	return title;
}

/**
 * Updates the meta description in the snippet preview
 *
 * @deprecated since version 3.0
 */
function ystUpdateDesc() {
	console.error("ystUpdateDesc is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");
}

/**
 * Sanitized the description
 *
 * @deprecated since version 3.0
 *
 * @param {string} desc
 * @returns {string}
 */
function ystSanitizeDesc(desc) {
	console.error("ystSanitizeDesc is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");

	return desc;
}

/**
 * Trims the description to the desired length
 *
 * @deprecated since version 3.0
 *
 * @param {string} desc
 * @returns {string}
 */
function ystTrimDesc(desc) {
	console.error("ystTrimDesc is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");

	return desc;
}

/**
 * Updates the URL in the snippet preview
 *
 * @deprecated since version 3.0
 */
function ystUpdateURL() {
	console.error("ystUpdateURL is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");
}

/**
 * Bolds the keywords in a string
 *
 * @deprecated since version 3.0
 *
 * @param {string} str
 * @param {boolean} url
 * @returns {string}
 */
function ystBoldKeywords(str, url) {
	console.error("ystBoldKeywords is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");

	return str;
}

/**
 * Updates the entire snippet preview
 *
 * @deprecated since version 3.0
 */
function ystUpdateSnippet() {
	console.error("ystUpdateSnippet is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");
}

/**
 * Escapres the focus keyword
 *
 * @deprecated since version 3.0
 *
 * @param {string} str
 * @returns {string}
 */
function ystEscapeFocusKw(str) {
	console.error("ystEscapeFocusKw is deprecated since Yoast SEO 3.0, use YoastSEO.js functionality instead.");

	return str;
}

window.ystClean = ystClean;
window.ystFocusKwTest = ystFocusKwTest;
window.ystRemoveLowerCaseDiacritics = ystRemoveLowerCaseDiacritics;
window.ystTestFocusKw = ystTestFocusKw;
window.ystReplaceVariables = ystReplaceVariables;
window.ystAjaxReplaceVariables = ystAjaxReplaceVariables;
window.ystUpdateTitle = ystUpdateTitle;
window.ystSanitizeTitle = ystSanitizeTitle;
window.ystUpdateDesc = ystUpdateDesc;
window.ystSanitizeDesc = ystSanitizeDesc;
window.ystTrimDesc = ystTrimDesc;
window.ystUpdateURL = ystUpdateURL;
window.ystBoldKeywords = ystBoldKeywords;
window.ystUpdateSnippet = ystUpdateSnippet;
window.ystEscapeFocusKw = ystEscapeFocusKw;
/* jshint ignore:end */
/* eslint-enable */

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLW1ldGFib3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0E7QUFDRSxXQUFVLENBQVYsRUFBYztBQUNmOztBQUVBLFFBQU8sZUFBUCxHQUF5QixZQUFXO0FBQ25DLE1BQUssT0FBUSx5QkFBUixFQUFvQyxNQUFwQyxHQUE2QyxDQUFsRCxFQUFzRDtBQUNyRCxVQUFRLHFCQUFSLEVBQ0UsRUFERixDQUNNLE9BRE4sRUFDZSxpQkFEZixFQUNrQyxVQUFVLEVBQVYsRUFBZTtBQUMvQyxPQUFHLGNBQUg7O0FBRUEsV0FBUSxtREFBUixFQUE4RCxXQUE5RCxDQUEyRSxRQUEzRTtBQUNBLFdBQVEsc0NBQVIsRUFBaUQsV0FBakQsQ0FBOEQsUUFBOUQ7O0FBRUE7QUFDQSxXQUFRLElBQVIsRUFBZSxRQUFmLENBQXlCLHNCQUF6Qjs7QUFFQSxRQUFJLGFBQWEsT0FBUSxPQUFRLElBQVIsRUFBZSxJQUFmLENBQXFCLE1BQXJCLENBQVIsQ0FBakI7QUFDQSxlQUFXLFFBQVgsQ0FBcUIsUUFBckI7QUFDQSxXQUFRLElBQVIsRUFBZSxNQUFmLENBQXVCLElBQXZCLEVBQThCLFFBQTlCLENBQXdDLFFBQXhDOztBQUVBLFFBQUssT0FBUSxJQUFSLEVBQWUsUUFBZixDQUF5QixRQUF6QixDQUFMLEVBQTJDO0FBQzFDLFlBQVEsWUFBUixFQUF1QixPQUF2QixDQUFnQztBQUMvQixpQkFBVyxPQUFRLFVBQVIsRUFBcUIsTUFBckIsR0FBOEI7QUFEVixNQUFoQyxFQUVHLEdBRkg7QUFHQTtBQUNELElBbkJGLEVBb0JFLEVBcEJGLENBb0JNLFlBcEJOLEVBb0JvQixpQkFwQnBCLEVBb0J1QyxZQUFXO0FBQ2hEO0FBQ0EsV0FBUSxJQUFSLEVBQWUsUUFBZixDQUF5QixzQkFBekI7QUFDQSxJQXZCRixFQXdCRSxFQXhCRixDQXdCTSxpQkF4Qk4sRUF3QnlC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Q0EsT0FBTyxXQUFQLEdBQXFCLFdBQXJCO0FBQ0EsT0FBTyxZQUFQLEdBQXNCLFlBQXRCO0FBQ0EsT0FBTyxlQUFQLEdBQXlCLGVBQXpCO0FBQ0EsT0FBTyxnQkFBUCxHQUEwQixnQkFBMUI7QUFDQSxPQUFPLGdCQUFQLEdBQTBCLGdCQUExQjtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogYnJvd3Nlcjp0cnVlICovXG4vKiBnbG9iYWwgdGJfc2hvdywgd3BzZW9TZWxlY3QyTG9jYWxlICovXG4oIGZ1bmN0aW9uKCAkICkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR3aW5kb3cud3BzZW9faW5pdF90YWJzID0gZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCBqUXVlcnkoIFwiLndwc2VvLW1ldGFib3gtdGFicy1kaXZcIiApLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRqUXVlcnkoIFwiLndwc2VvLW1ldGFib3gtdGFic1wiIClcblx0XHRcdFx0Lm9uKCBcImNsaWNrXCIsIFwiYS53cHNlb190YWJsaW5rXCIsIGZ1bmN0aW9uKCBldiApIHtcblx0XHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHRcdFx0alF1ZXJ5KCBcIi53cHNlby1tZXRhLXNlY3Rpb24uYWN0aXZlIC53cHNlby1tZXRhYm94LXRhYnMgbGlcIiApLnJlbW92ZUNsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0XHRcdFx0alF1ZXJ5KCBcIi53cHNlby1tZXRhLXNlY3Rpb24uYWN0aXZlIC53cHNlb3RhYlwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblxuXHRcdFx0XHRcdC8vIEhpZGUgdGhlIFlvYXN0IHRvb2x0aXAgd2hlbiB0aGUgZWxlbWVudCBnZXRzIGNsaWNrZWQuXG5cdFx0XHRcdFx0alF1ZXJ5KCB0aGlzICkuYWRkQ2xhc3MoIFwieW9hc3QtdG9vbHRpcC1oaWRkZW5cIiApO1xuXG5cdFx0XHRcdFx0dmFyIHRhcmdldEVsZW0gPSBqUXVlcnkoIGpRdWVyeSggdGhpcyApLmF0dHIoIFwiaHJlZlwiICkgKTtcblx0XHRcdFx0XHR0YXJnZXRFbGVtLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0XHRcdFx0alF1ZXJ5KCB0aGlzICkucGFyZW50KCBcImxpXCIgKS5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xuXG5cdFx0XHRcdFx0aWYgKCBqUXVlcnkoIHRoaXMgKS5oYXNDbGFzcyggXCJzY3JvbGxcIiApICkge1xuXHRcdFx0XHRcdFx0alF1ZXJ5KCBcImh0bWwsIGJvZHlcIiApLmFuaW1hdGUoIHtcblx0XHRcdFx0XHRcdFx0c2Nyb2xsVG9wOiBqUXVlcnkoIHRhcmdldEVsZW0gKS5vZmZzZXQoKS50b3AsXG5cdFx0XHRcdFx0XHR9LCA1MDAgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oIFwibW91c2VsZWF2ZVwiLCBcImEud3BzZW9fdGFibGlua1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBUaGUgZWxlbWVudCBjYW4gc3RpbGwgaGF2ZSBmb2N1cywgZW5zdXJlIHRvIGhpZGUgdGhlIHRvb2x0aXAuXG5cdFx0XHRcdFx0alF1ZXJ5KCB0aGlzICkuYWRkQ2xhc3MoIFwieW9hc3QtdG9vbHRpcC1oaWRkZW5cIiApO1xuXHRcdFx0XHR9IClcblx0XHRcdFx0Lm9uKCBcImJsdXIgbW91c2VlbnRlclwiLCBcImEud3BzZW9fdGFibGlua1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHQvLyBNYWtlIHRoZSBlbGVtZW50IHRvb2x0aXAtYWJsZSBhZ2Fpbi5cblx0XHRcdFx0XHRqUXVlcnkoIHRoaXMgKS5yZW1vdmVDbGFzcyggXCJ5b2FzdC10b29sdGlwLWhpZGRlblwiICk7XG5cdFx0XHRcdH0gKTtcblx0XHR9XG5cblx0XHRpZiAoIGpRdWVyeSggXCIud3BzZW8tbWV0YS1zZWN0aW9uXCIgKS5sZW5ndGggPiAwICkge1xuXHRcdFx0alF1ZXJ5KCBcIiN3cHNlby1tZXRhLXNlY3Rpb24tY29udGVudFwiICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRcdGpRdWVyeSggXCIud3BzZW8tbWV0YWJveC1zaWRlYmFyIGxpXCIgKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRyZXR1cm4galF1ZXJ5KCB0aGlzICkuZmluZCggXCIud3BzZW8tbWV0YS1zZWN0aW9uLWxpbmtcIiApLmF0dHIoIFwiaHJlZlwiICkgPT09IFwiI3dwc2VvLW1ldGEtc2VjdGlvbi1jb250ZW50XCI7XG5cdFx0XHR9ICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblxuXHRcdFx0alF1ZXJ5KCBcImEud3BzZW8tbWV0YS1zZWN0aW9uLWxpbmtcIiApXG5cdFx0XHRcdC5vbiggXCJjbGlja1wiLCBmdW5jdGlvbiggZXYgKSB7XG5cdFx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0XHRcdGpRdWVyeSggXCIud3BzZW8tbWV0YWJveC1zaWRlYmFyIGxpXCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuXHRcdFx0XHRcdGpRdWVyeSggXCIud3BzZW8tbWV0YS1zZWN0aW9uXCIgKS5yZW1vdmVDbGFzcyggXCJhY3RpdmVcIiApO1xuXG5cdFx0XHRcdFx0Ly8gSGlkZSB0aGUgWW9hc3QgdG9vbHRpcCB3aGVuIHRoZSBlbGVtZW50IGdldHMgY2xpY2tlZC5cblx0XHRcdFx0XHRqUXVlcnkoIHRoaXMgKS5hZGRDbGFzcyggXCJ5b2FzdC10b29sdGlwLWhpZGRlblwiICk7XG5cblx0XHRcdFx0XHR2YXIgdGFyZ2V0RWxlbSA9IGpRdWVyeSggalF1ZXJ5KCB0aGlzICkuYXR0ciggXCJocmVmXCIgKSApO1xuXHRcdFx0XHRcdHRhcmdldEVsZW0uYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblxuXHRcdFx0XHRcdGpRdWVyeSggdGhpcyApLnBhcmVudCggXCJsaVwiICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcblx0XHRcdFx0fSApXG5cdFx0XHRcdC5vbiggXCJtb3VzZWxlYXZlXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdC8vIFRoZSBlbGVtZW50IGNhbiBzdGlsbCBoYXZlIGZvY3VzLCBlbnN1cmUgdG8gaGlkZSB0aGUgdG9vbHRpcC5cblx0XHRcdFx0XHRqUXVlcnkoIHRoaXMgKS5hZGRDbGFzcyggXCJ5b2FzdC10b29sdGlwLWhpZGRlblwiICk7XG5cdFx0XHRcdH0gKVxuXHRcdFx0XHQub24oIFwiYmx1ciBtb3VzZWVudGVyXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdC8vIE1ha2UgdGhlIGVsZW1lbnQgdG9vbHRpcC1hYmxlIGFnYWluLlxuXHRcdFx0XHRcdGpRdWVyeSggdGhpcyApLnJlbW92ZUNsYXNzKCBcInlvYXN0LXRvb2x0aXAtaGlkZGVuXCIgKTtcblx0XHRcdFx0fSApO1xuXHRcdH1cblxuXHRcdGpRdWVyeSggXCIud3BzZW8taGVhZGluZ1wiICkuaGlkZSgpO1xuXHRcdGpRdWVyeSggXCIud3BzZW8tbWV0YWJveC10YWJzXCIgKS5zaG93KCk7XG5cdFx0Ly8gRW5kIFRhYnMgY29kZS5cblx0fTtcblxuXHQvKipcblx0ICogQWRkcyBzZWxlY3QyIGZvciBzZWxlY3RlZCBmaWVsZHMuXG5cdCAqL1xuXHRmdW5jdGlvbiBpbml0U2VsZWN0MigpIHtcblx0XHQvLyBTZWxlY3QyIGZvciBZb2FzdCBTRU8gTWV0YWJveCBBZHZhbmNlZCB0YWJcblx0XHQkKCBcIiN5b2FzdF93cHNlb19tZXRhLXJvYm90cy1ub2luZGV4XCIgKS5zZWxlY3QyKCB7IHdpZHRoOiBcIjEwMCVcIiwgbGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSB9ICk7XG5cdFx0JCggXCIjeW9hc3Rfd3BzZW9fbWV0YS1yb2JvdHMtYWR2XCIgKS5zZWxlY3QyKCB7IHdpZHRoOiBcIjEwMCVcIiwgbGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSB9ICk7XG5cdH1cblxuXHQvKipcblx0ICogU2hvd3MgYSBpbmZvcm1hdGlvbmFsIHBvcHVwIGlmIHNvbWVvbmUgY2xpY2sgdGhlIGFkZCBrZXl3b3JkIGJ1dHRvblxuXHQgKi9cblx0ZnVuY3Rpb24gYWRkS2V5d29yZFBvcHVwKCkge1xuXHRcdHZhciAkYnV5QnV0dG9uID0gJCggXCIjd3BzZW8tYWRkLWtleXdvcmQtcG9wdXAtYnV0dG9uXCIgKSxcblx0XHRcdHRpdGxlID0gJGJ1eUJ1dHRvbi50ZXh0KCksXG5cdFx0XHQkcG9wdXBXaW5kb3csXG5cdFx0XHQkY2xvc2VCdXR0b247XG5cblx0XHR0Yl9zaG93KCB0aXRsZSwgXCIjVEJfaW5saW5lP3dpZHRoPTY1MCZoZWlnaHQ9MzUwJmlubGluZUlkPXdwc2VvLWFkZC1rZXl3b3JkLXBvcHVwXCIsIFwiZ3JvdXBcIiApO1xuXG5cdFx0Ly8gVGhlIHRoaWNib3ggcG9wdXAgVUkgaXMgbm93IGF2YWlsYWJsZS5cblx0XHQkcG9wdXBXaW5kb3cgPSAkKCBcIiNUQl93aW5kb3dcIiApO1xuXHRcdCRjbG9zZUJ1dHRvbiA9ICQoIFwiI1RCX2Nsb3NlV2luZG93QnV0dG9uXCIgKTtcblxuXHRcdC8vIFRoZSBjb250YWluZXIgd2luZG93IGlzbid0IHRoZSBjb3JyZWN0IHNpemUsIHJlY3RpZnkgdGhpcyBhbmQgYWxzbyB0aGUgY2VudGVyaW5nLlxuXHRcdCRwb3B1cFdpbmRvdy5jc3MoIHsgd2lkdGg6IDY4MCwgaGVpZ2h0OiAyMzUsIFwibWFyZ2luLWxlZnRcIjogLTM0MCB9ICk7XG5cblx0XHQvLyBBY2Nlc3NpYmlsaXR5IGltcHJvdmVtZW50cy5cblx0XHQkcG9wdXBXaW5kb3dcblx0XHRcdC5hdHRyKCB7XG5cdFx0XHRcdHJvbGU6IFwiZGlhbG9nXCIsXG5cdFx0XHRcdFwiYXJpYS1sYWJlbGxlZGJ5XCI6IFwiVEJfYWpheFdpbmRvd1RpdGxlXCIsXG5cdFx0XHRcdFwiYXJpYS1kZXNjcmliZWRieVwiOiBcIlRCX2FqYXhDb250ZW50XCIsXG5cdFx0XHR9IClcblx0XHRcdC5vbiggXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0dmFyIGlkO1xuXG5cdFx0XHRcdC8vIENvbnN0cmFpbiB0YWJiaW5nIHdpdGhpbiB0aGUgbW9kYWwuXG5cdFx0XHRcdGlmICggOSA9PT0gZXZlbnQud2hpY2ggKSB7XG5cdFx0XHRcdFx0aWQgPSBldmVudC50YXJnZXQuaWQ7XG5cblx0XHRcdFx0XHRpZiAoIGlkID09PSBcIndwc2VvLWFkZC1rZXl3b3JkLXBvcHVwLWJ1dHRvblwiICYmICEgZXZlbnQuc2hpZnRLZXkgKSB7XG5cdFx0XHRcdFx0XHQkY2xvc2VCdXR0b24uZm9jdXMoKTtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggaWQgPT09IFwiVEJfY2xvc2VXaW5kb3dCdXR0b25cIiAmJiBldmVudC5zaGlmdEtleSApIHtcblx0XHRcdFx0XHRcdCRidXlCdXR0b24uZm9jdXMoKTtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9ICk7XG5cblx0XHQvLyBNb3ZlIGZvY3VzIGJhY2sgdG8gdGhlIGVsZW1lbnQgdGhhdCBvcGVuZWQgdGhlIG1vZGFsLlxuXHRcdCQoIFwiYm9keVwiICkub24oIFwidGhpY2tib3g6cmVtb3ZlZFwiLCBmdW5jdGlvbigpIHtcblx0XHRcdCQoIFwiLndwc2VvLWFkZC1rZXl3b3JkXCIgKS5mb2N1cygpO1xuXHRcdH0gKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBBZGRzIGtleXdvcmQgcG9wdXAgaWYgdGhlIHRlbXBsYXRlIGZvciBpdCBpcyBmb3VuZFxuXHQgKi9cblx0ZnVuY3Rpb24gaW5pdEFkZEtleXdvcmRQb3B1cCgpIHtcblx0XHQvLyBJZiBhZGQga2V5d29yZCBwb3B1cCBleGlzdHMgYmluZCBpdCB0byB0aGUgYWRkIGtleXdvcmQgYnV0dG9uXG5cdFx0aWYgKCAxID09PSAkKCBcIiN3cHNlby1hZGQta2V5d29yZC1wb3B1cFwiICkubGVuZ3RoICkge1xuXHRcdFx0JCggXCIud3BzZW8tYWRkLWtleXdvcmRcIiApLm9uKCBcImNsaWNrXCIsIGFkZEtleXdvcmRQb3B1cCApO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBNb3ZlIHRoZSBoZWxwIGVsZW1lbnRzIGJ5IGluamVjdGluZyB0aGVtIGludG8gdGhlIGgzIGVsZW1lbnRzLlxuXHQgKlxuXHQgKiBAcmV0dXJucyB7dm9pZH1cblx0ICovXG5cdGZ1bmN0aW9uIG1vdmVIZWxwRWxlbWVudHMoKSB7XG5cdFx0alF1ZXJ5KCBcIiAjd3BzZW8tZm9jdXNrZXl3b3JkLXNlY3Rpb25cIiApLmZpbmQoIFwiaDNcIiApLmFwcGVuZChcblx0XHRcdGpRdWVyeSggXCIjaGVscC15b2FzdC1mb2N1c2tleXdvcmRcIiApLmRldGFjaCgpLnJlbW92ZUNsYXNzKCBcIndwc2VvX2hpZGRlblwiIClcblx0XHQpO1xuXG5cdFx0alF1ZXJ5KCBcIiAjd3BzZW8tcGFnZWFuYWx5c2lzLXNlY3Rpb25cIiApLmZpbmQoIFwiaDNcIiApLmFwcGVuZChcblx0XHRcdGpRdWVyeSggXCIjaGVscC15b2FzdC1wYWdlYW5hbHlzaXNcIiApLmRldGFjaCgpLnJlbW92ZUNsYXNzKCBcIndwc2VvX2hpZGRlblwiIClcblx0XHQpO1xuXG5cdFx0dmFyIHNuaXBwZXRIZWxwID0galF1ZXJ5KCBcIiNoZWxwLXlvYXN0LXNuaXBwZXRwcmV2aWV3XCIgKS5kZXRhY2goKS5yZW1vdmVDbGFzcyggXCJ3cHNlb19oaWRkZW5cIiApO1xuXHRcdGpRdWVyeSggXCIgI3dwc2Vvc25pcHBldFwiICkuZmluZCggXCJoM1wiICkuYXBwZW5kKCBzbmlwcGV0SGVscCApO1xuXHRcdGpRdWVyeSggXCIgI3dwc2VvX3NuaXBwZXRcIiApLmZpbmQoIFwiaDNcIiApLmFwcGVuZCggc25pcHBldEhlbHAgKTtcblx0fVxuXG5cdGpRdWVyeSggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XG5cdFx0alF1ZXJ5KCBcIi53cHNlby1tZXRhLXNlY3Rpb25cIiApLmVhY2goIGZ1bmN0aW9uKCBfLCBlbCApIHtcblx0XHRcdGpRdWVyeSggZWwgKS5maW5kKCBcIi53cHNlby1tZXRhYm94LXRhYnMgbGk6Zmlyc3RcIiApLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0XHRqUXVlcnkoIGVsICkuZmluZCggXCIud3BzZW90YWI6Zmlyc3RcIiApLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XG5cdFx0fSApO1xuXHRcdHdpbmRvdy53cHNlb19pbml0X3RhYnMoKTtcblxuXHRcdGluaXRBZGRLZXl3b3JkUG9wdXAoKTtcblx0XHRpbml0U2VsZWN0MigpO1xuXG5cdFx0alF1ZXJ5KCB3aW5kb3cgKS5vbiggXCJZb2FzdFNFTzpyZWFkeVwiLCBtb3ZlSGVscEVsZW1lbnRzICk7XG5cdH0gKTtcbn0oIGpRdWVyeSApICk7XG5cbi8qIGVzbGludC1kaXNhYmxlICovXG4vKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXG4vKipcbiAqIENsZWFucyB1cCBhIHN0cmluZywgcmVtb3Zpbmcgc2NyaXB0IHRhZ3MgZXRjLlxuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24geXN0Q2xlYW4oIHN0ciApIHtcblx0Y29uc29sZS5lcnJvciggXCJ5c3RDbGVhbiBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcblxuXHRyZXR1cm4gc3RyO1xufVxuXG4vKipcbiAqIFRlc3RzIHdoZXRoZXIgZ2l2ZW4gZWxlbWVudCBgc3RyYCBtYXRjaGVzIGBwYC5cbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byBtYXRjaFxuICogQHBhcmFtIHtSZWdFeHB9IHAgVGhlIHJlZ2V4IHRvIG1hdGNoXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5mdW5jdGlvbiB5c3RGb2N1c0t3VGVzdCggc3RyLCBwICkge1xuXHRjb25zb2xlLmVycm9yKCBcInlzdEZvY3VzS3dUZXN0IGlzIGRlcHJlY2F0ZWQgc2luY2UgWW9hc3QgU0VPIDMuMCwgdXNlIFlvYXN0U0VPLmpzIGZ1bmN0aW9uYWxpdHkgaW5zdGVhZC5cIiApO1xuXG5cdHJldHVybiBcIlwiO1xufVxuXG4vKipcbiAqIFRoZSBmdW5jdGlvbiBuYW1lIHNheXMgaXQgYWxsLCByZW1vdmVzIGxvd2VyIGNhc2UgZGlhY3JpdGljc1xuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24geXN0UmVtb3ZlTG93ZXJDYXNlRGlhY3JpdGljcyggc3RyICkge1xuXHRjb25zb2xlLmVycm9yKCBcInlzdFJlbW92ZUxvd2VyQ2FzZURpYWNyaXRpY3MgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLlwiICk7XG5cblx0cmV0dXJuIHN0cjtcbn1cblxuLyoqXG4gKiBUZXN0cyB3aGV0aGVyIHRoZSBmb2N1cyBrZXl3b3JkIGlzIHVzZWQgaW4gdGl0bGUsIGJvZHkgYW5kIGRlc2NyaXB0aW9uXG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcbiAqL1xuZnVuY3Rpb24geXN0VGVzdEZvY3VzS3coKSB7XG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0VGVzdEZvY3VzS3cgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLlwiICk7XG59XG5cbi8qKlxuICogVGhpcyBjYWxsYmFjayBpcyB1c2VkIGZvciB2YXJpYWJsZSByZXBsYWNlbWVudFxuICpcbiAqIFRoaXMgaXMgZG9uZSB0aHJvdWdoIGEgY2FsbGJhY2sgYXMgaXQgX2NvdWxkXyBiZSB0aGF0IGB5c3RSZXBsYWNlVmFyaWFibGVzYCBoYXMgdG8gZG8gYW4gQUpBWCByZXF1ZXN0LlxuICpcbiAqIEBjYWxsYmFjayByZXBsYWNlVmFyaWFibGVzQ2FsbGJhY2tcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHN0cmluZyB3aXRoIHRoZSByZXBsYWNlZCB2YXJpYWJsZXMgaW4gaXRcbiAqL1xuXG4vKipcbiAqIFJlcGxhY2VzIHZhcmlhYmxlcyBlaXRoZXIgd2l0aCB2YWx1ZXMgZnJvbSB3cHNlb01ldGFib3hMMTBuLCBieSBncmFiYmluZyB0aGVtIGZyb20gdGhlIHBhZ2Ugb3IgKHVsdGltYXRlbHkpIGdldHRpbmcgdGhlbSB0aHJvdWdoIEFKQVhcbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHN0cmluZyB3aXRoIHZhcmlhYmxlcyB0byBiZSByZXBsYWNlZFxuICogQHBhcmFtIHtyZXBsYWNlVmFyaWFibGVzQ2FsbGJhY2t9IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIGZvciB3aGVuIHRoZVxuICovXG5mdW5jdGlvbiB5c3RSZXBsYWNlVmFyaWFibGVzKCBzdHIsIGNhbGxiYWNrICkge1xuXHRjb25zb2xlLmVycm9yKCBcInlzdFJlcGxhY2VWYXJpYWJsZXMgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLlwiICk7XG5cblx0Y2FsbGJhY2soIHN0ciApO1xufVxuXG4vKipcbiAqIFJlcGxhY2UgYSB2YXJpYWJsZSB3aXRoIGEgc3RyaW5nLCB0aHJvdWdoIGFuIEFKQVggY2FsbCB0byBXUFxuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHJlcGxhY2VhYmxlVmFyXG4gKiBAcGFyYW0ge3JlcGxhY2VWYXJpYWJsZXNDYWxsYmFja30gY2FsbGJhY2tcbiAqL1xuZnVuY3Rpb24geXN0QWpheFJlcGxhY2VWYXJpYWJsZXMoIHJlcGxhY2VhYmxlVmFyLCBjYWxsYmFjayApIHtcblx0Y29uc29sZS5lcnJvciggXCJ5c3RBamF4UmVwbGFjZVZhcmlhYmxlcyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcbn1cblxuLyoqXG4gKiBVcGRhdGVzIHRoZSB0aXRsZSBpbiB0aGUgc25pcHBldCBwcmV2aWV3XG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcbiAqXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmb3JjZSA9IGZhbHNlXVxuICovXG5mdW5jdGlvbiB5c3RVcGRhdGVUaXRsZSggZm9yY2UgKSB7XG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0VXBkYXRlVGl0bGUgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLlwiICk7XG59XG5cbi8qKlxuICogQ2xlYW5zIHRoZSB0aXRsZSBiZWZvcmUgdXNlXG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHlzdFNhbml0aXplVGl0bGUoIHRpdGxlICkge1xuXHRjb25zb2xlLmVycm9yKCBcInlzdFNhbml0aXplVGl0bGUgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLlwiICk7XG5cblx0cmV0dXJuIHRpdGxlO1xufVxuXG4vKipcbiAqIFVwZGF0ZXMgdGhlIG1ldGEgZGVzY3JpcHRpb24gaW4gdGhlIHNuaXBwZXQgcHJldmlld1xuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXG4gKi9cbmZ1bmN0aW9uIHlzdFVwZGF0ZURlc2MoKSB7XG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0VXBkYXRlRGVzYyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcbn1cblxuLyoqXG4gKiBTYW5pdGl6ZWQgdGhlIGRlc2NyaXB0aW9uXG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzY1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24geXN0U2FuaXRpemVEZXNjKCBkZXNjICkge1xuXHRjb25zb2xlLmVycm9yKCBcInlzdFNhbml0aXplRGVzYyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcblxuXHRyZXR1cm4gZGVzYztcbn1cblxuLyoqXG4gKiBUcmltcyB0aGUgZGVzY3JpcHRpb24gdG8gdGhlIGRlc2lyZWQgbGVuZ3RoXG4gKlxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZGVzY1xuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24geXN0VHJpbURlc2MoIGRlc2MgKSB7XG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0VHJpbURlc2MgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLlwiICk7XG5cblx0cmV0dXJuIGRlc2M7XG59XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgVVJMIGluIHRoZSBzbmlwcGV0IHByZXZpZXdcbiAqXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxuICovXG5mdW5jdGlvbiB5c3RVcGRhdGVVUkwoKSB7XG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0VXBkYXRlVVJMIGlzIGRlcHJlY2F0ZWQgc2luY2UgWW9hc3QgU0VPIDMuMCwgdXNlIFlvYXN0U0VPLmpzIGZ1bmN0aW9uYWxpdHkgaW5zdGVhZC5cIiApO1xufVxuXG4vKipcbiAqIEJvbGRzIHRoZSBrZXl3b3JkcyBpbiBhIHN0cmluZ1xuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHBhcmFtIHtib29sZWFufSB1cmxcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIHlzdEJvbGRLZXl3b3Jkcyggc3RyLCB1cmwgKSB7XG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0Qm9sZEtleXdvcmRzIGlzIGRlcHJlY2F0ZWQgc2luY2UgWW9hc3QgU0VPIDMuMCwgdXNlIFlvYXN0U0VPLmpzIGZ1bmN0aW9uYWxpdHkgaW5zdGVhZC5cIiApO1xuXG5cdHJldHVybiBzdHI7XG59XG5cbi8qKlxuICogVXBkYXRlcyB0aGUgZW50aXJlIHNuaXBwZXQgcHJldmlld1xuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXG4gKi9cbmZ1bmN0aW9uIHlzdFVwZGF0ZVNuaXBwZXQoKSB7XG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0VXBkYXRlU25pcHBldCBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcbn1cblxuLyoqXG4gKiBFc2NhcHJlcyB0aGUgZm9jdXMga2V5d29yZFxuICpcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24geXN0RXNjYXBlRm9jdXNLdyggc3RyICkge1xuXHRjb25zb2xlLmVycm9yKCBcInlzdEVzY2FwZUZvY3VzS3cgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLlwiICk7XG5cblx0cmV0dXJuIHN0cjtcbn1cblxud2luZG93LnlzdENsZWFuID0geXN0Q2xlYW47XG53aW5kb3cueXN0Rm9jdXNLd1Rlc3QgPSB5c3RGb2N1c0t3VGVzdDtcbndpbmRvdy55c3RSZW1vdmVMb3dlckNhc2VEaWFjcml0aWNzID0geXN0UmVtb3ZlTG93ZXJDYXNlRGlhY3JpdGljcztcbndpbmRvdy55c3RUZXN0Rm9jdXNLdyA9IHlzdFRlc3RGb2N1c0t3O1xud2luZG93LnlzdFJlcGxhY2VWYXJpYWJsZXMgPSB5c3RSZXBsYWNlVmFyaWFibGVzO1xud2luZG93LnlzdEFqYXhSZXBsYWNlVmFyaWFibGVzID0geXN0QWpheFJlcGxhY2VWYXJpYWJsZXM7XG53aW5kb3cueXN0VXBkYXRlVGl0bGUgPSB5c3RVcGRhdGVUaXRsZTtcbndpbmRvdy55c3RTYW5pdGl6ZVRpdGxlID0geXN0U2FuaXRpemVUaXRsZTtcbndpbmRvdy55c3RVcGRhdGVEZXNjID0geXN0VXBkYXRlRGVzYztcbndpbmRvdy55c3RTYW5pdGl6ZURlc2MgPSB5c3RTYW5pdGl6ZURlc2M7XG53aW5kb3cueXN0VHJpbURlc2MgPSB5c3RUcmltRGVzYztcbndpbmRvdy55c3RVcGRhdGVVUkwgPSB5c3RVcGRhdGVVUkw7XG53aW5kb3cueXN0Qm9sZEtleXdvcmRzID0geXN0Qm9sZEtleXdvcmRzO1xud2luZG93LnlzdFVwZGF0ZVNuaXBwZXQgPSB5c3RVcGRhdGVTbmlwcGV0O1xud2luZG93LnlzdEVzY2FwZUZvY3VzS3cgPSB5c3RFc2NhcGVGb2N1c0t3O1xuLyoganNoaW50IGlnbm9yZTplbmQgKi9cbi8qIGVzbGludC1lbmFibGUgKi9cbiJdfQ==
