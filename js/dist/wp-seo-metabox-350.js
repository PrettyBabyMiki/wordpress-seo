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

				var targetElem = jQuery(jQuery(this).attr("href"));
				targetElem.addClass("active");
				jQuery(this).parent("li").addClass("active");

				if (jQuery(this).hasClass("scroll")) {
					jQuery("html, body").animate({
						scrollTop: jQuery(targetElem).offset().top
					}, 500);
				}
			});
		}

		if (jQuery(".wpseo-meta-section").length > 0) {
			jQuery("#wpseo-meta-section-content").addClass("active");
			jQuery(".wpseo-metabox-sidebar li").filter(function () {
				return jQuery(this).find(".wpseo-meta-section-link").attr("href") === "#wpseo-meta-section-content";
			}).addClass("active");

			jQuery("a.wpseo-meta-section-link").click(function (ev) {
				ev.preventDefault();

				jQuery(".wpseo-metabox-sidebar li").removeClass("active");
				jQuery(".wpseo-meta-section").removeClass("active");

				var targetElem = jQuery(jQuery(this).attr("href"));
				targetElem.addClass("active");

				jQuery(this).parent("li").addClass("active");
			});
		}

		jQuery(".wpseo-heading").hide();
		jQuery(".wpseo-metabox-tabs").show();
		// End Tabs code
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

	jQuery(document).ready(function () {
		jQuery(".wpseo-meta-section").each(function (_, el) {
			jQuery(el).find(".wpseo-metabox-tabs li:first").addClass("active");
			jQuery(el).find(".wpseotab:first").addClass("active");
		});
		window.wpseo_init_tabs();

		initAddKeywordPopup();
		initSelect2();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcc3JjXFx3cC1zZW8tbWV0YWJveC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7QUFDQTtBQUNFLFdBQVUsQ0FBVixFQUFjO0FBQ2Y7O0FBRUEsUUFBTyxlQUFQLEdBQXlCLFlBQVc7QUFDbkMsTUFBSyxPQUFRLHlCQUFSLEVBQW9DLE1BQXBDLEdBQTZDLENBQWxELEVBQXNEO0FBQ3JELFVBQVEscUJBQVIsRUFBZ0MsRUFBaEMsQ0FBb0MsT0FBcEMsRUFBNkMsaUJBQTdDLEVBQWdFLFVBQVUsRUFBVixFQUFlO0FBQzlFLE9BQUcsY0FBSDs7QUFFQSxXQUFRLG1EQUFSLEVBQThELFdBQTlELENBQTJFLFFBQTNFO0FBQ0EsV0FBUSxzQ0FBUixFQUFpRCxXQUFqRCxDQUE4RCxRQUE5RDs7QUFFQSxRQUFJLGFBQWEsT0FBUSxPQUFRLElBQVIsRUFBZSxJQUFmLENBQXFCLE1BQXJCLENBQVIsQ0FBakI7QUFDQSxlQUFXLFFBQVgsQ0FBcUIsUUFBckI7QUFDQSxXQUFRLElBQVIsRUFBZSxNQUFmLENBQXVCLElBQXZCLEVBQThCLFFBQTlCLENBQXdDLFFBQXhDOztBQUVBLFFBQUssT0FBUSxJQUFSLEVBQWUsUUFBZixDQUF5QixRQUF6QixDQUFMLEVBQTJDO0FBQzFDLFlBQVEsWUFBUixFQUF1QixPQUF2QixDQUFnQztBQUMvQixpQkFBVyxPQUFRLFVBQVIsRUFBcUIsTUFBckIsR0FBOEI7QUFEVixNQUFoQyxFQUVHLEdBRkg7QUFJQTtBQUNELElBaEJEO0FBa0JBOztBQUVELE1BQUssT0FBUSxxQkFBUixFQUFnQyxNQUFoQyxHQUF5QyxDQUE5QyxFQUFrRDtBQUNqRCxVQUFRLDZCQUFSLEVBQXdDLFFBQXhDLENBQWtELFFBQWxEO0FBQ0EsVUFBUSwyQkFBUixFQUFz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TyxZQUFQLEdBQXNCLFlBQXRCO0FBQ0EsT0FBTyxlQUFQLEdBQXlCLGVBQXpCO0FBQ0EsT0FBTyxnQkFBUCxHQUEwQixnQkFBMUI7QUFDQSxPQUFPLGdCQUFQLEdBQTBCLGdCQUExQjtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogYnJvd3Nlcjp0cnVlICovXHJcbi8qIGdsb2JhbCB0Yl9zaG93LCB3cHNlb1NlbGVjdDJMb2NhbGUgKi9cclxuKCBmdW5jdGlvbiggJCApIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHJcblx0d2luZG93Lndwc2VvX2luaXRfdGFicyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKCBqUXVlcnkoIFwiLndwc2VvLW1ldGFib3gtdGFicy1kaXZcIiApLmxlbmd0aCA+IDAgKSB7XHJcblx0XHRcdGpRdWVyeSggXCIud3BzZW8tbWV0YWJveC10YWJzXCIgKS5vbiggXCJjbGlja1wiLCBcImEud3BzZW9fdGFibGlua1wiLCBmdW5jdGlvbiggZXYgKSB7XHJcblx0XHRcdFx0ZXYucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0alF1ZXJ5KCBcIi53cHNlby1tZXRhLXNlY3Rpb24uYWN0aXZlIC53cHNlby1tZXRhYm94LXRhYnMgbGlcIiApLnJlbW92ZUNsYXNzKCBcImFjdGl2ZVwiICk7XHJcblx0XHRcdFx0alF1ZXJ5KCBcIi53cHNlby1tZXRhLXNlY3Rpb24uYWN0aXZlIC53cHNlb3RhYlwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcclxuXHJcblx0XHRcdFx0dmFyIHRhcmdldEVsZW0gPSBqUXVlcnkoIGpRdWVyeSggdGhpcyApLmF0dHIoIFwiaHJlZlwiICkgKTtcclxuXHRcdFx0XHR0YXJnZXRFbGVtLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XHJcblx0XHRcdFx0alF1ZXJ5KCB0aGlzICkucGFyZW50KCBcImxpXCIgKS5hZGRDbGFzcyggXCJhY3RpdmVcIiApO1xyXG5cclxuXHRcdFx0XHRpZiAoIGpRdWVyeSggdGhpcyApLmhhc0NsYXNzKCBcInNjcm9sbFwiICkgKSB7XHJcblx0XHRcdFx0XHRqUXVlcnkoIFwiaHRtbCwgYm9keVwiICkuYW5pbWF0ZSgge1xyXG5cdFx0XHRcdFx0XHRzY3JvbGxUb3A6IGpRdWVyeSggdGFyZ2V0RWxlbSApLm9mZnNldCgpLnRvcCxcclxuXHRcdFx0XHRcdH0sIDUwMFxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggalF1ZXJ5KCBcIi53cHNlby1tZXRhLXNlY3Rpb25cIiApLmxlbmd0aCA+IDAgKSB7XHJcblx0XHRcdGpRdWVyeSggXCIjd3BzZW8tbWV0YS1zZWN0aW9uLWNvbnRlbnRcIiApLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XHJcblx0XHRcdGpRdWVyeSggXCIud3BzZW8tbWV0YWJveC1zaWRlYmFyIGxpXCIgKS5maWx0ZXIoIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBqUXVlcnkoIHRoaXMgKS5maW5kKCBcIi53cHNlby1tZXRhLXNlY3Rpb24tbGlua1wiICkuYXR0ciggXCJocmVmXCIgKSA9PT0gXCIjd3BzZW8tbWV0YS1zZWN0aW9uLWNvbnRlbnRcIjtcclxuXHRcdFx0fSApLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XHJcblxyXG5cdFx0XHRqUXVlcnkoIFwiYS53cHNlby1tZXRhLXNlY3Rpb24tbGlua1wiICkuY2xpY2soIGZ1bmN0aW9uKCBldiApIHtcclxuXHRcdFx0XHRldi5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRqUXVlcnkoIFwiLndwc2VvLW1ldGFib3gtc2lkZWJhciBsaVwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcclxuXHRcdFx0XHRqUXVlcnkoIFwiLndwc2VvLW1ldGEtc2VjdGlvblwiICkucmVtb3ZlQ2xhc3MoIFwiYWN0aXZlXCIgKTtcclxuXHJcblx0XHRcdFx0dmFyIHRhcmdldEVsZW0gPSBqUXVlcnkoIGpRdWVyeSggdGhpcyApLmF0dHIoIFwiaHJlZlwiICkgKTtcclxuXHRcdFx0XHR0YXJnZXRFbGVtLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XHJcblxyXG5cdFx0XHRcdGpRdWVyeSggdGhpcyApLnBhcmVudCggXCJsaVwiICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGpRdWVyeSggXCIud3BzZW8taGVhZGluZ1wiICkuaGlkZSgpO1xyXG5cdFx0alF1ZXJ5KCBcIi53cHNlby1tZXRhYm94LXRhYnNcIiApLnNob3coKTtcclxuXHRcdC8vIEVuZCBUYWJzIGNvZGVcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBBZGRzIHNlbGVjdDIgZm9yIHNlbGVjdGVkIGZpZWxkcy5cclxuXHQgKi9cclxuXHRmdW5jdGlvbiBpbml0U2VsZWN0MigpIHtcclxuXHRcdC8vIFNlbGVjdDIgZm9yIFlvYXN0IFNFTyBNZXRhYm94IEFkdmFuY2VkIHRhYlxyXG5cdFx0JCggXCIjeW9hc3Rfd3BzZW9fbWV0YS1yb2JvdHMtbm9pbmRleFwiICkuc2VsZWN0MiggeyB3aWR0aDogXCIxMDAlXCIsIGxhbmd1YWdlOiB3cHNlb1NlbGVjdDJMb2NhbGUgfSApO1xyXG5cdFx0JCggXCIjeW9hc3Rfd3BzZW9fbWV0YS1yb2JvdHMtYWR2XCIgKS5zZWxlY3QyKCB7IHdpZHRoOiBcIjEwMCVcIiwgbGFuZ3VhZ2U6IHdwc2VvU2VsZWN0MkxvY2FsZSB9ICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBTaG93cyBhIGluZm9ybWF0aW9uYWwgcG9wdXAgaWYgc29tZW9uZSBjbGljayB0aGUgYWRkIGtleXdvcmQgYnV0dG9uXHJcblx0ICovXHJcblx0ZnVuY3Rpb24gYWRkS2V5d29yZFBvcHVwKCkge1xyXG5cdFx0dmFyICRidXlCdXR0b24gPSAkKCBcIiN3cHNlby1hZGQta2V5d29yZC1wb3B1cC1idXR0b25cIiApLFxyXG5cdFx0XHR0aXRsZSA9ICRidXlCdXR0b24udGV4dCgpLFxyXG5cdFx0XHQkcG9wdXBXaW5kb3csXHJcblx0XHRcdCRjbG9zZUJ1dHRvbjtcclxuXHJcblx0XHR0Yl9zaG93KCB0aXRsZSwgXCIjVEJfaW5saW5lP3dpZHRoPTY1MCZoZWlnaHQ9MzUwJmlubGluZUlkPXdwc2VvLWFkZC1rZXl3b3JkLXBvcHVwXCIsIFwiZ3JvdXBcIiApO1xyXG5cclxuXHRcdC8vIFRoZSB0aGljYm94IHBvcHVwIFVJIGlzIG5vdyBhdmFpbGFibGUuXHJcblx0XHQkcG9wdXBXaW5kb3cgPSAkKCBcIiNUQl93aW5kb3dcIiApO1xyXG5cdFx0JGNsb3NlQnV0dG9uID0gJCggXCIjVEJfY2xvc2VXaW5kb3dCdXR0b25cIiApO1xyXG5cclxuXHRcdC8vIFRoZSBjb250YWluZXIgd2luZG93IGlzbid0IHRoZSBjb3JyZWN0IHNpemUsIHJlY3RpZnkgdGhpcyBhbmQgYWxzbyB0aGUgY2VudGVyaW5nLlxyXG5cdFx0JHBvcHVwV2luZG93LmNzcyggeyB3aWR0aDogNjgwLCBoZWlnaHQ6IDIzNSwgXCJtYXJnaW4tbGVmdFwiOiAtMzQwIH0gKTtcclxuXHJcblx0XHQvLyBBY2Nlc3NpYmlsaXR5IGltcHJvdmVtZW50cy5cclxuXHRcdCRwb3B1cFdpbmRvd1xyXG5cdFx0XHQuYXR0cigge1xyXG5cdFx0XHRcdHJvbGU6IFwiZGlhbG9nXCIsXHJcblx0XHRcdFx0XCJhcmlhLWxhYmVsbGVkYnlcIjogXCJUQl9hamF4V2luZG93VGl0bGVcIixcclxuXHRcdFx0XHRcImFyaWEtZGVzY3JpYmVkYnlcIjogXCJUQl9hamF4Q29udGVudFwiLFxyXG5cdFx0XHR9IClcclxuXHRcdFx0Lm9uKCBcImtleWRvd25cIiwgZnVuY3Rpb24oIGV2ZW50ICkge1xyXG5cdFx0XHRcdHZhciBpZDtcclxuXHJcblx0XHRcdFx0Ly8gQ29uc3RyYWluIHRhYmJpbmcgd2l0aGluIHRoZSBtb2RhbC5cclxuXHRcdFx0XHRpZiAoIDkgPT09IGV2ZW50LndoaWNoICkge1xyXG5cdFx0XHRcdFx0aWQgPSBldmVudC50YXJnZXQuaWQ7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBpZCA9PT0gXCJ3cHNlby1hZGQta2V5d29yZC1wb3B1cC1idXR0b25cIiAmJiAhIGV2ZW50LnNoaWZ0S2V5ICkge1xyXG5cdFx0XHRcdFx0XHQkY2xvc2VCdXR0b24uZm9jdXMoKTtcclxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdH0gZWxzZSBpZiAoIGlkID09PSBcIlRCX2Nsb3NlV2luZG93QnV0dG9uXCIgJiYgZXZlbnQuc2hpZnRLZXkgKSB7XHJcblx0XHRcdFx0XHRcdCRidXlCdXR0b24uZm9jdXMoKTtcclxuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gKTtcclxuXHJcblx0XHQvLyBNb3ZlIGZvY3VzIGJhY2sgdG8gdGhlIGVsZW1lbnQgdGhhdCBvcGVuZWQgdGhlIG1vZGFsLlxyXG5cdFx0JCggXCJib2R5XCIgKS5vbiggXCJ0aGlja2JveDpyZW1vdmVkXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkKCBcIi53cHNlby1hZGQta2V5d29yZFwiICkuZm9jdXMoKTtcclxuXHRcdH0gKTtcclxuXHR9XHJcblxyXG5cdC8qKlxyXG5cdCAqIEFkZHMga2V5d29yZCBwb3B1cCBpZiB0aGUgdGVtcGxhdGUgZm9yIGl0IGlzIGZvdW5kXHJcblx0ICovXHJcblx0ZnVuY3Rpb24gaW5pdEFkZEtleXdvcmRQb3B1cCgpIHtcclxuXHRcdC8vIElmIGFkZCBrZXl3b3JkIHBvcHVwIGV4aXN0cyBiaW5kIGl0IHRvIHRoZSBhZGQga2V5d29yZCBidXR0b25cclxuXHRcdGlmICggMSA9PT0gJCggXCIjd3BzZW8tYWRkLWtleXdvcmQtcG9wdXBcIiApLmxlbmd0aCApIHtcclxuXHRcdFx0JCggXCIud3BzZW8tYWRkLWtleXdvcmRcIiApLm9uKCBcImNsaWNrXCIsIGFkZEtleXdvcmRQb3B1cCApO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0alF1ZXJ5KCBkb2N1bWVudCApLnJlYWR5KCBmdW5jdGlvbigpIHtcclxuXHRcdGpRdWVyeSggXCIud3BzZW8tbWV0YS1zZWN0aW9uXCIgKS5lYWNoKCBmdW5jdGlvbiggXywgZWwgKSB7XHJcblx0XHRcdGpRdWVyeSggZWwgKS5maW5kKCBcIi53cHNlby1tZXRhYm94LXRhYnMgbGk6Zmlyc3RcIiApLmFkZENsYXNzKCBcImFjdGl2ZVwiICk7XHJcblx0XHRcdGpRdWVyeSggZWwgKS5maW5kKCBcIi53cHNlb3RhYjpmaXJzdFwiICkuYWRkQ2xhc3MoIFwiYWN0aXZlXCIgKTtcclxuXHRcdH0gKTtcclxuXHRcdHdpbmRvdy53cHNlb19pbml0X3RhYnMoKTtcclxuXHJcblx0XHRpbml0QWRkS2V5d29yZFBvcHVwKCk7XHJcblx0XHRpbml0U2VsZWN0MigpO1xyXG5cdH0gKTtcclxufSggalF1ZXJ5ICkgKTtcclxuXHJcbi8qIGVzbGludC1kaXNhYmxlICovXHJcbi8qIGpzaGludCBpZ25vcmU6c3RhcnQgKi9cclxuLyoqXHJcbiAqIENsZWFucyB1cCBhIHN0cmluZywgcmVtb3Zpbmcgc2NyaXB0IHRhZ3MgZXRjLlxyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiB5c3RDbGVhbiggc3RyICkge1xyXG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0Q2xlYW4gaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLlwiICk7XHJcblxyXG5cdHJldHVybiBzdHI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUZXN0cyB3aGV0aGVyIGdpdmVuIGVsZW1lbnQgYHN0cmAgbWF0Y2hlcyBgcGAuXHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHN0cmluZyB0byBtYXRjaFxyXG4gKiBAcGFyYW0ge1JlZ0V4cH0gcCBUaGUgcmVnZXggdG8gbWF0Y2hcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIHlzdEZvY3VzS3dUZXN0KCBzdHIsIHAgKSB7XHJcblx0Y29uc29sZS5lcnJvciggXCJ5c3RGb2N1c0t3VGVzdCBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcclxuXHJcblx0cmV0dXJuIFwiXCI7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGUgZnVuY3Rpb24gbmFtZSBzYXlzIGl0IGFsbCwgcmVtb3ZlcyBsb3dlciBjYXNlIGRpYWNyaXRpY3NcclxuICpcclxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24geXN0UmVtb3ZlTG93ZXJDYXNlRGlhY3JpdGljcyggc3RyICkge1xyXG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0UmVtb3ZlTG93ZXJDYXNlRGlhY3JpdGljcyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcclxuXHJcblx0cmV0dXJuIHN0cjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRlc3RzIHdoZXRoZXIgdGhlIGZvY3VzIGtleXdvcmQgaXMgdXNlZCBpbiB0aXRsZSwgYm9keSBhbmQgZGVzY3JpcHRpb25cclxuICpcclxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcclxuICovXHJcbmZ1bmN0aW9uIHlzdFRlc3RGb2N1c0t3KCkge1xyXG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0VGVzdEZvY3VzS3cgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLlwiICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGlzIGNhbGxiYWNrIGlzIHVzZWQgZm9yIHZhcmlhYmxlIHJlcGxhY2VtZW50XHJcbiAqXHJcbiAqIFRoaXMgaXMgZG9uZSB0aHJvdWdoIGEgY2FsbGJhY2sgYXMgaXQgX2NvdWxkXyBiZSB0aGF0IGB5c3RSZXBsYWNlVmFyaWFibGVzYCBoYXMgdG8gZG8gYW4gQUpBWCByZXF1ZXN0LlxyXG4gKlxyXG4gKiBAY2FsbGJhY2sgcmVwbGFjZVZhcmlhYmxlc0NhbGxiYWNrXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHIgVGhlIHN0cmluZyB3aXRoIHRoZSByZXBsYWNlZCB2YXJpYWJsZXMgaW4gaXRcclxuICovXHJcblxyXG4vKipcclxuICogUmVwbGFjZXMgdmFyaWFibGVzIGVpdGhlciB3aXRoIHZhbHVlcyBmcm9tIHdwc2VvTWV0YWJveEwxMG4sIGJ5IGdyYWJiaW5nIHRoZW0gZnJvbSB0aGUgcGFnZSBvciAodWx0aW1hdGVseSkgZ2V0dGluZyB0aGVtIHRocm91Z2ggQUpBWFxyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyIFRoZSBzdHJpbmcgd2l0aCB2YXJpYWJsZXMgdG8gYmUgcmVwbGFjZWRcclxuICogQHBhcmFtIHtyZXBsYWNlVmFyaWFibGVzQ2FsbGJhY2t9IGNhbGxiYWNrIENhbGxiYWNrIGZ1bmN0aW9uIGZvciB3aGVuIHRoZVxyXG4gKi9cclxuZnVuY3Rpb24geXN0UmVwbGFjZVZhcmlhYmxlcyggc3RyLCBjYWxsYmFjayApIHtcclxuXHRjb25zb2xlLmVycm9yKCBcInlzdFJlcGxhY2VWYXJpYWJsZXMgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLlwiICk7XHJcblxyXG5cdGNhbGxiYWNrKCBzdHIgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFJlcGxhY2UgYSB2YXJpYWJsZSB3aXRoIGEgc3RyaW5nLCB0aHJvdWdoIGFuIEFKQVggY2FsbCB0byBXUFxyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVwbGFjZWFibGVWYXJcclxuICogQHBhcmFtIHtyZXBsYWNlVmFyaWFibGVzQ2FsbGJhY2t9IGNhbGxiYWNrXHJcbiAqL1xyXG5mdW5jdGlvbiB5c3RBamF4UmVwbGFjZVZhcmlhYmxlcyggcmVwbGFjZWFibGVWYXIsIGNhbGxiYWNrICkge1xyXG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0QWpheFJlcGxhY2VWYXJpYWJsZXMgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLlwiICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBVcGRhdGVzIHRoZSB0aXRsZSBpbiB0aGUgc25pcHBldCBwcmV2aWV3XHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2ZvcmNlID0gZmFsc2VdXHJcbiAqL1xyXG5mdW5jdGlvbiB5c3RVcGRhdGVUaXRsZSggZm9yY2UgKSB7XHJcblx0Y29uc29sZS5lcnJvciggXCJ5c3RVcGRhdGVUaXRsZSBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIENsZWFucyB0aGUgdGl0bGUgYmVmb3JlIHVzZVxyXG4gKlxyXG4gKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDMuMFxyXG4gKlxyXG4gKiBAcGFyYW0ge3N0cmluZ30gdGl0bGVcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIHlzdFNhbml0aXplVGl0bGUoIHRpdGxlICkge1xyXG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0U2FuaXRpemVUaXRsZSBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcclxuXHJcblx0cmV0dXJuIHRpdGxlO1xyXG59XHJcblxyXG4vKipcclxuICogVXBkYXRlcyB0aGUgbWV0YSBkZXNjcmlwdGlvbiBpbiB0aGUgc25pcHBldCBwcmV2aWV3XHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXHJcbiAqL1xyXG5mdW5jdGlvbiB5c3RVcGRhdGVEZXNjKCkge1xyXG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0VXBkYXRlRGVzYyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFNhbml0aXplZCB0aGUgZGVzY3JpcHRpb25cclxuICpcclxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IGRlc2NcclxuICogQHJldHVybnMge3N0cmluZ31cclxuICovXHJcbmZ1bmN0aW9uIHlzdFNhbml0aXplRGVzYyggZGVzYyApIHtcclxuXHRjb25zb2xlLmVycm9yKCBcInlzdFNhbml0aXplRGVzYyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcclxuXHJcblx0cmV0dXJuIGRlc2M7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUcmltcyB0aGUgZGVzY3JpcHRpb24gdG8gdGhlIGRlc2lyZWQgbGVuZ3RoXHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXHJcbiAqXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSBkZXNjXHJcbiAqIEByZXR1cm5zIHtzdHJpbmd9XHJcbiAqL1xyXG5mdW5jdGlvbiB5c3RUcmltRGVzYyggZGVzYyApIHtcclxuXHRjb25zb2xlLmVycm9yKCBcInlzdFRyaW1EZXNjIGlzIGRlcHJlY2F0ZWQgc2luY2UgWW9hc3QgU0VPIDMuMCwgdXNlIFlvYXN0U0VPLmpzIGZ1bmN0aW9uYWxpdHkgaW5zdGVhZC5cIiApO1xyXG5cclxuXHRyZXR1cm4gZGVzYztcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZXMgdGhlIFVSTCBpbiB0aGUgc25pcHBldCBwcmV2aWV3XHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIHNpbmNlIHZlcnNpb24gMy4wXHJcbiAqL1xyXG5mdW5jdGlvbiB5c3RVcGRhdGVVUkwoKSB7XHJcblx0Y29uc29sZS5lcnJvciggXCJ5c3RVcGRhdGVVUkwgaXMgZGVwcmVjYXRlZCBzaW5jZSBZb2FzdCBTRU8gMy4wLCB1c2UgWW9hc3RTRU8uanMgZnVuY3Rpb25hbGl0eSBpbnN0ZWFkLlwiICk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBCb2xkcyB0aGUga2V5d29yZHMgaW4gYSBzdHJpbmdcclxuICpcclxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKiBAcGFyYW0ge2Jvb2xlYW59IHVybFxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24geXN0Qm9sZEtleXdvcmRzKCBzdHIsIHVybCApIHtcclxuXHRjb25zb2xlLmVycm9yKCBcInlzdEJvbGRLZXl3b3JkcyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcclxuXHJcblx0cmV0dXJuIHN0cjtcclxufVxyXG5cclxuLyoqXHJcbiAqIFVwZGF0ZXMgdGhlIGVudGlyZSBzbmlwcGV0IHByZXZpZXdcclxuICpcclxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcclxuICovXHJcbmZ1bmN0aW9uIHlzdFVwZGF0ZVNuaXBwZXQoKSB7XHJcblx0Y29uc29sZS5lcnJvciggXCJ5c3RVcGRhdGVTbmlwcGV0IGlzIGRlcHJlY2F0ZWQgc2luY2UgWW9hc3QgU0VPIDMuMCwgdXNlIFlvYXN0U0VPLmpzIGZ1bmN0aW9uYWxpdHkgaW5zdGVhZC5cIiApO1xyXG59XHJcblxyXG4vKipcclxuICogRXNjYXByZXMgdGhlIGZvY3VzIGtleXdvcmRcclxuICpcclxuICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjBcclxuICpcclxuICogQHBhcmFtIHtzdHJpbmd9IHN0clxyXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxyXG4gKi9cclxuZnVuY3Rpb24geXN0RXNjYXBlRm9jdXNLdyggc3RyICkge1xyXG5cdGNvbnNvbGUuZXJyb3IoIFwieXN0RXNjYXBlRm9jdXNLdyBpcyBkZXByZWNhdGVkIHNpbmNlIFlvYXN0IFNFTyAzLjAsIHVzZSBZb2FzdFNFTy5qcyBmdW5jdGlvbmFsaXR5IGluc3RlYWQuXCIgKTtcclxuXHJcblx0cmV0dXJuIHN0cjtcclxufVxyXG5cclxud2luZG93LnlzdENsZWFuID0geXN0Q2xlYW47XHJcbndpbmRvdy55c3RGb2N1c0t3VGVzdCA9IHlzdEZvY3VzS3dUZXN0O1xyXG53aW5kb3cueXN0UmVtb3ZlTG93ZXJDYXNlRGlhY3JpdGljcyA9IHlzdFJlbW92ZUxvd2VyQ2FzZURpYWNyaXRpY3M7XHJcbndpbmRvdy55c3RUZXN0Rm9jdXNLdyA9IHlzdFRlc3RGb2N1c0t3O1xyXG53aW5kb3cueXN0UmVwbGFjZVZhcmlhYmxlcyA9IHlzdFJlcGxhY2VWYXJpYWJsZXM7XHJcbndpbmRvdy55c3RBamF4UmVwbGFjZVZhcmlhYmxlcyA9IHlzdEFqYXhSZXBsYWNlVmFyaWFibGVzO1xyXG53aW5kb3cueXN0VXBkYXRlVGl0bGUgPSB5c3RVcGRhdGVUaXRsZTtcclxud2luZG93LnlzdFNhbml0aXplVGl0bGUgPSB5c3RTYW5pdGl6ZVRpdGxlO1xyXG53aW5kb3cueXN0VXBkYXRlRGVzYyA9IHlzdFVwZGF0ZURlc2M7XHJcbndpbmRvdy55c3RTYW5pdGl6ZURlc2MgPSB5c3RTYW5pdGl6ZURlc2M7XHJcbndpbmRvdy55c3RUcmltRGVzYyA9IHlzdFRyaW1EZXNjO1xyXG53aW5kb3cueXN0VXBkYXRlVVJMID0geXN0VXBkYXRlVVJMO1xyXG53aW5kb3cueXN0Qm9sZEtleXdvcmRzID0geXN0Qm9sZEtleXdvcmRzO1xyXG53aW5kb3cueXN0VXBkYXRlU25pcHBldCA9IHlzdFVwZGF0ZVNuaXBwZXQ7XHJcbndpbmRvdy55c3RFc2NhcGVGb2N1c0t3ID0geXN0RXNjYXBlRm9jdXNLdztcclxuLyoganNoaW50IGlnbm9yZTplbmQgKi9cclxuLyogZXNsaW50LWVuYWJsZSAqL1xyXG4iXX0=
