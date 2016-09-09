(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* jshint unused:false */
/* global ajaxurl */
/* global tb_click */
/* global tb_remove */
jQuery(function () {
	"use strict";

	// Store the control that opened the modal dialog for later use.

	var $gscModalFocusedBefore;

	jQuery("#gsc_auth_code").click(function () {
		var auth_url = jQuery("#gsc_auth_url").val(),
		    w = 600,
		    h = 500,
		    left = screen.width / 2 - w / 2,
		    top = screen.height / 2 - h / 2;
		return window.open(auth_url, "wpseogscauthcode", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width=" + w + ", height=" + h + ", top=" + top + ", left=" + left);
	});

	// Accessibility improvements for the Create Redirect modal dialog.
	jQuery(".wpseo-open-gsc-redirect-modal").click(function (event) {
		var $modal;
		var $modalTitle;
		var $closeButtonTop;
		var $closeButtonBottom;

		// Get the link text to be used as the modal title.
		var title = jQuery(this).text();

		// Prevent default action.
		event.preventDefault();
		// Prevent triggering Thickbox original click.
		event.stopPropagation();
		// Get the control that opened the modal dialog.
		$gscModalFocusedBefore = jQuery(this);
		// Call Thickbox now and bind `this`. The Thickbox UI is now available.
		tb_click.call(this);

		// Get the Thickbox modal elements.
		$modal = jQuery("#TB_window");
		$modalTitle = jQuery("#TB_ajaxWindowTitle");
		$closeButtonTop = jQuery("#TB_closeWindowButton");
		$closeButtonBottom = jQuery(".wpseo-redirect-close", $modal);

		// Set the modal title.
		$modalTitle.text(title);

		// Set ARIA role and ARIA attributes.
		$modal.attr({
			role: "dialog",
			"aria-labelledby": "TB_ajaxWindowTitle",
			"aria-describedby": "TB_ajaxContent"
		}).on("keydown", function (event) {
			var id;

			// Constrain tabbing within the modal.
			if (9 === event.which) {
				id = event.target.id;

				if (jQuery(event.target).hasClass("wpseo-redirect-close") && !event.shiftKey) {
					$closeButtonTop.focus();
					event.preventDefault();
				} else if (id === "TB_closeWindowButton" && event.shiftKey) {
					$closeButtonBottom.focus();
					event.preventDefault();
				}
			}
		});
	});

	jQuery(document.body).on("click", ".wpseo-redirect-close", function () {
		// Close the Thickbox modal when clicking on the bottom button.
		jQuery(this).closest("#TB_window").find("#TB_closeWindowButton").trigger("click");
	}).on("thickbox:removed", function () {
		// Move focus back to the element that opened the modal.
		$gscModalFocusedBefore.focus();
	});
});

/**
 * Adds a redirect from the google search console overview.
 *
 * @returns {boolean} Always returns false to cancel the default event handler.
 */
function wpseo_gsc_post_redirect() {
	"use strict";

	var target_form = jQuery("#TB_ajaxContent");
	var old_url = jQuery(target_form).find("input[name=current_url]").val();
	var is_checked = jQuery(target_form).find("input[name=mark_as_fixed]").prop("checked");

	jQuery.post(ajaxurl, {
		action: "wpseo_gsc_create_redirect_url",
		ajax_nonce: jQuery(".wpseo-gsc-ajax-security").val(),
		old_url: old_url,
		new_url: jQuery(target_form).find("input[name=new_url]").val(),
		mark_as_fixed: is_checked,
		platform: jQuery("#field_platform").val(),
		category: jQuery("#field_category").val(),
		type: "301"
	}, function () {
		if (is_checked === true) {
			// Remove the row with old url
			jQuery('span:contains("' + old_url + '")').closest("tr").remove();
		}

		// Remove the thickbox
		tb_remove();
	});

	return false;
}

/**
 * Decrement current category count by one.
 *
 * @param {string} category The category count to update.
 */
function wpseo_update_category_count(category) {
	"use strict";

	var count_element = jQuery("#gsc_count_" + category + "");
	var new_count = parseInt(count_element.text(), 10) - 1;
	if (new_count < 0) {
		new_count = 0;
	}

	count_element.text(new_count);
}

/**
 * Marks a search console crawl issue as fixed.
 *
 * @param {string} url The URL that has been fixed.
 */
function wpseo_mark_as_fixed(url) {
	"use strict";

	jQuery.post(ajaxurl, {
		action: "wpseo_mark_fixed_crawl_issue",
		ajax_nonce: jQuery(".wpseo-gsc-ajax-security").val(),
		platform: jQuery("#field_platform").val(),
		category: jQuery("#field_category").val(),
		url: url
	}, function (response) {
		if ("true" === response) {
			wpseo_update_category_count(jQuery("#field_category").val());
			jQuery('span:contains("' + url + '")').closest("tr").remove();
		}
	});
}

window.wpseo_gsc_post_redirect = wpseo_gsc_post_redirect;
window.wpseo_update_category_count = wpseo_update_category_count;
window.wpseo_mark_as_fixed = wpseo_mark_as_fixed;

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvd3Atc2VvLWFkbWluLWdzYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7OztBQ0lBLE9BQVEsWUFBVztBQUNsQjs7OztBQUdBLEtBQUksc0JBQUo7O0FBRUEsUUFBUSxnQkFBUixFQUEyQixLQUEzQixDQUNDLFlBQVc7QUFDVixNQUFJLFdBQVcsT0FBUSxlQUFSLEVBQTBCLEdBQTFCLEVBQWY7TUFDQyxJQUFJLEdBREw7TUFFQyxJQUFJLEdBRkw7TUFHQyxPQUFTLE9BQU8sS0FBUCxHQUFlLENBQWpCLEdBQXlCLElBQUksQ0FIckM7TUFJQyxNQUFRLE9BQU8sTUFBUCxHQUFnQixDQUFsQixHQUEwQixJQUFJLENBSnJDO0FBS0EsU0FBTyxPQUFPLElBQVAsQ0FBYSxRQUFiLEVBQXVCLGtCQUF2QixFQUEyQyx5SEFBeUgsQ0FBekgsR0FBNkgsV0FBN0gsR0FBMkksQ0FBM0ksR0FBK0ksUUFBL0ksR0FBMEosR0FBMUosR0FBZ0ssU0FBaEssR0FBNEssSUFBdk4sQ0FBUDtBQUNBLEVBUkY7OztBQVlBLFFBQVEsZ0NBQVIsRUFBMkMsS0FBM0MsQ0FDQyxVQUFVLEtBQVYsRUFBa0I7QUFDakIsTUFBSSxNQUFKO0FBQ0EsTUFBSSxXQUFKO0FBQ0EsTUFBSSxlQUFKO0FBQ0EsTUFBSSxrQkFBSjs7O0FBR0EsTUFBSSxRQUFRLE9BQVEsSUFBUixFQUFlLElBQWYsRUFBWjs7O0FBR0EsUUFBTSxjQUFOOztBQUVBLFFBQU0sZUFBTjs7QUFFQSwyQkFBeUIsT0FBUSxJQUFSLENBQXpCOztBQUVBLFdBQVMsSUFBVCxDQUFlLElBQWY7OztBQUdBLFdBQVMsT0FBUSxZQUFSLENBQVQ7QUFDQSxnQkFBYyxPQUFRLHFCQUFSLENBQWQ7QUFDQSxvQkFBa0IsT0FBUSx1QkFBUixDQUFsQjtBQUNBLHVCQUFxQixPQUFRLHVCQUFSLEVBQWlDLE1BQWpDLENBQXJCOzs7QUFHQSxj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SztBQUxOLEVBRkQsRUFTQyxVQUFVLFFBQVYsRUFBcUI7QUFDcEIsTUFBSyxXQUFXLFFBQWhCLEVBQTJCO0FBQzFCLCtCQUE2QixPQUFRLGlCQUFSLEVBQTRCLEdBQTVCLEVBQTdCO0FBQ0EsVUFBUSxvQkFBb0IsR0FBcEIsR0FBMEIsSUFBbEMsRUFBeUMsT0FBekMsQ0FBa0QsSUFBbEQsRUFBeUQsTUFBekQ7QUFDQTtBQUNELEVBZEY7QUFnQkE7O0FBRUQsT0FBTyx1QkFBUCxHQUFpQyx1QkFBakM7QUFDQSxPQUFPLDJCQUFQLEdBQXFDLDJCQUFyQztBQUNBLE9BQU8sbUJBQVAsR0FBNkIsbUJBQTdCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGpzaGludCB1bnVzZWQ6ZmFsc2UgKi9cbi8qIGdsb2JhbCBhamF4dXJsICovXG4vKiBnbG9iYWwgdGJfY2xpY2sgKi9cbi8qIGdsb2JhbCB0Yl9yZW1vdmUgKi9cbmpRdWVyeSggZnVuY3Rpb24oKSB7XG5cdFwidXNlIHN0cmljdFwiO1xuXG5cdC8vIFN0b3JlIHRoZSBjb250cm9sIHRoYXQgb3BlbmVkIHRoZSBtb2RhbCBkaWFsb2cgZm9yIGxhdGVyIHVzZS5cblx0dmFyICRnc2NNb2RhbEZvY3VzZWRCZWZvcmU7XG5cblx0alF1ZXJ5KCBcIiNnc2NfYXV0aF9jb2RlXCIgKS5jbGljayhcblx0XHRmdW5jdGlvbigpIHtcblx0XHRcdHZhciBhdXRoX3VybCA9IGpRdWVyeSggXCIjZ3NjX2F1dGhfdXJsXCIgKS52YWwoKSxcblx0XHRcdFx0dyA9IDYwMCxcblx0XHRcdFx0aCA9IDUwMCxcblx0XHRcdFx0bGVmdCA9ICggc2NyZWVuLndpZHRoIC8gMiApIC0gKCB3IC8gMiApLFxuXHRcdFx0XHR0b3AgPSAoIHNjcmVlbi5oZWlnaHQgLyAyICkgLSAoIGggLyAyICk7XG5cdFx0XHRyZXR1cm4gd2luZG93Lm9wZW4oIGF1dGhfdXJsLCBcIndwc2VvZ3NjYXV0aGNvZGVcIiwgXCJ0b29sYmFyPW5vLCBsb2NhdGlvbj1ubywgZGlyZWN0b3JpZXM9bm8sIHN0YXR1cz1ubywgbWVudWJhcj1ubywgc2Nyb2xsYmFycz15ZXMsIHJlc2l6YWJsZT1ubywgY29weWhpc3Rvcnk9bm8sIHdpZHRoPVwiICsgdyArIFwiLCBoZWlnaHQ9XCIgKyBoICsgXCIsIHRvcD1cIiArIHRvcCArIFwiLCBsZWZ0PVwiICsgbGVmdCApO1xuXHRcdH1cblx0KTtcblxuXHQvLyBBY2Nlc3NpYmlsaXR5IGltcHJvdmVtZW50cyBmb3IgdGhlIENyZWF0ZSBSZWRpcmVjdCBtb2RhbCBkaWFsb2cuXG5cdGpRdWVyeSggXCIud3BzZW8tb3Blbi1nc2MtcmVkaXJlY3QtbW9kYWxcIiApLmNsaWNrKFxuXHRcdGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdHZhciAkbW9kYWw7XG5cdFx0XHR2YXIgJG1vZGFsVGl0bGU7XG5cdFx0XHR2YXIgJGNsb3NlQnV0dG9uVG9wO1xuXHRcdFx0dmFyICRjbG9zZUJ1dHRvbkJvdHRvbTtcblxuXHRcdFx0Ly8gR2V0IHRoZSBsaW5rIHRleHQgdG8gYmUgdXNlZCBhcyB0aGUgbW9kYWwgdGl0bGUuXG5cdFx0XHR2YXIgdGl0bGUgPSBqUXVlcnkoIHRoaXMgKS50ZXh0KCk7XG5cblx0XHRcdC8vIFByZXZlbnQgZGVmYXVsdCBhY3Rpb24uXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0Ly8gUHJldmVudCB0cmlnZ2VyaW5nIFRoaWNrYm94IG9yaWdpbmFsIGNsaWNrLlxuXHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cdFx0XHQvLyBHZXQgdGhlIGNvbnRyb2wgdGhhdCBvcGVuZWQgdGhlIG1vZGFsIGRpYWxvZy5cblx0XHRcdCRnc2NNb2RhbEZvY3VzZWRCZWZvcmUgPSBqUXVlcnkoIHRoaXMgKTtcblx0XHRcdC8vIENhbGwgVGhpY2tib3ggbm93IGFuZCBiaW5kIGB0aGlzYC4gVGhlIFRoaWNrYm94IFVJIGlzIG5vdyBhdmFpbGFibGUuXG5cdFx0XHR0Yl9jbGljay5jYWxsKCB0aGlzICk7XG5cblx0XHRcdC8vIEdldCB0aGUgVGhpY2tib3ggbW9kYWwgZWxlbWVudHMuXG5cdFx0XHQkbW9kYWwgPSBqUXVlcnkoIFwiI1RCX3dpbmRvd1wiICk7XG5cdFx0XHQkbW9kYWxUaXRsZSA9IGpRdWVyeSggXCIjVEJfYWpheFdpbmRvd1RpdGxlXCIgKTtcblx0XHRcdCRjbG9zZUJ1dHRvblRvcCA9IGpRdWVyeSggXCIjVEJfY2xvc2VXaW5kb3dCdXR0b25cIiApO1xuXHRcdFx0JGNsb3NlQnV0dG9uQm90dG9tID0galF1ZXJ5KCBcIi53cHNlby1yZWRpcmVjdC1jbG9zZVwiLCAkbW9kYWwgKTtcblxuXHRcdFx0Ly8gU2V0IHRoZSBtb2RhbCB0aXRsZS5cblx0XHRcdCRtb2RhbFRpdGxlLnRleHQoIHRpdGxlICk7XG5cblx0XHRcdC8vIFNldCBBUklBIHJvbGUgYW5kIEFSSUEgYXR0cmlidXRlcy5cblx0XHRcdCRtb2RhbC5hdHRyKCB7XG5cdFx0XHRcdHJvbGU6IFwiZGlhbG9nXCIsXG5cdFx0XHRcdFwiYXJpYS1sYWJlbGxlZGJ5XCI6IFwiVEJfYWpheFdpbmRvd1RpdGxlXCIsXG5cdFx0XHRcdFwiYXJpYS1kZXNjcmliZWRieVwiOiBcIlRCX2FqYXhDb250ZW50XCIsXG5cdFx0XHR9IClcblx0XHRcdC5vbiggXCJrZXlkb3duXCIsIGZ1bmN0aW9uKCBldmVudCApIHtcblx0XHRcdFx0dmFyIGlkO1xuXG5cdFx0XHRcdC8vIENvbnN0cmFpbiB0YWJiaW5nIHdpdGhpbiB0aGUgbW9kYWwuXG5cdFx0XHRcdGlmICggOSA9PT0gZXZlbnQud2hpY2ggKSB7XG5cdFx0XHRcdFx0aWQgPSBldmVudC50YXJnZXQuaWQ7XG5cblx0XHRcdFx0XHRpZiAoIGpRdWVyeSggZXZlbnQudGFyZ2V0ICkuaGFzQ2xhc3MoIFwid3BzZW8tcmVkaXJlY3QtY2xvc2VcIiApICYmICEgZXZlbnQuc2hpZnRLZXkgKSB7XG5cdFx0XHRcdFx0XHQkY2xvc2VCdXR0b25Ub3AuZm9jdXMoKTtcblx0XHRcdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdFx0fSBlbHNlIGlmICggaWQgPT09IFwiVEJfY2xvc2VXaW5kb3dCdXR0b25cIiAmJiBldmVudC5zaGlmdEtleSApIHtcblx0XHRcdFx0XHRcdCRjbG9zZUJ1dHRvbkJvdHRvbS5mb2N1cygpO1xuXHRcdFx0XHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gKTtcblx0XHR9XG5cdCk7XG5cblx0alF1ZXJ5KCBkb2N1bWVudC5ib2R5ICkub24oIFwiY2xpY2tcIiwgXCIud3BzZW8tcmVkaXJlY3QtY2xvc2VcIiwgZnVuY3Rpb24oKSB7XG5cdFx0Ly8gQ2xvc2UgdGhlIFRoaWNrYm94IG1vZGFsIHdoZW4gY2xpY2tpbmcgb24gdGhlIGJvdHRvbSBidXR0b24uXG5cdFx0alF1ZXJ5KCB0aGlzICkuY2xvc2VzdCggXCIjVEJfd2luZG93XCIgKS5maW5kKCBcIiNUQl9jbG9zZVdpbmRvd0J1dHRvblwiICkudHJpZ2dlciggXCJjbGlja1wiICk7XG5cdH0gKS5vbiggXCJ0aGlja2JveDpyZW1vdmVkXCIsIGZ1bmN0aW9uKCkge1xuXHRcdC8vIE1vdmUgZm9jdXMgYmFjayB0byB0aGUgZWxlbWVudCB0aGF0IG9wZW5lZCB0aGUgbW9kYWwuXG5cdFx0JGdzY01vZGFsRm9jdXNlZEJlZm9yZS5mb2N1cygpO1xuXHR9ICk7XG59ICk7XG5cbi8qKlxuICogQWRkcyBhIHJlZGlyZWN0IGZyb20gdGhlIGdvb2dsZSBzZWFyY2ggY29uc29sZSBvdmVydmlldy5cbiAqXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gQWx3YXlzIHJldHVybnMgZmFsc2UgdG8gY2FuY2VsIHRoZSBkZWZhdWx0IGV2ZW50IGhhbmRsZXIuXG4gKi9cbmZ1bmN0aW9uIHdwc2VvX2dzY19wb3N0X3JlZGlyZWN0KCkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgdGFyZ2V0X2Zvcm0gPSBqUXVlcnkoIFwiI1RCX2FqYXhDb250ZW50XCIgKTtcblx0dmFyIG9sZF91cmwgICAgID0galF1ZXJ5KCB0YXJnZXRfZm9ybSApLmZpbmQoIFwiaW5wdXRbbmFtZT1jdXJyZW50X3VybF1cIiApLnZhbCgpO1xuXHR2YXIgaXNfY2hlY2tlZCAgPSBqUXVlcnkoIHRhcmdldF9mb3JtICkuZmluZCggXCJpbnB1dFtuYW1lPW1hcmtfYXNfZml4ZWRdXCIgKS5wcm9wKCBcImNoZWNrZWRcIiApO1xuXG5cdGpRdWVyeS5wb3N0KFxuXHRcdGFqYXh1cmwsXG5cdFx0e1xuXHRcdFx0YWN0aW9uOiBcIndwc2VvX2dzY19jcmVhdGVfcmVkaXJlY3RfdXJsXCIsXG5cdFx0XHRhamF4X25vbmNlOiBqUXVlcnkoIFwiLndwc2VvLWdzYy1hamF4LXNlY3VyaXR5XCIgKS52YWwoKSxcblx0XHRcdG9sZF91cmw6IG9sZF91cmwsXG5cdFx0XHRuZXdfdXJsOiBqUXVlcnkoIHRhcmdldF9mb3JtICkuZmluZCggXCJpbnB1dFtuYW1lPW5ld191cmxdXCIgKS52YWwoKSxcblx0XHRcdG1hcmtfYXNfZml4ZWQ6IGlzX2NoZWNrZWQsXG5cdFx0XHRwbGF0Zm9ybTogalF1ZXJ5KCBcIiNmaWVsZF9wbGF0Zm9ybVwiICkudmFsKCksXG5cdFx0XHRjYXRlZ29yeTogalF1ZXJ5KCBcIiNmaWVsZF9jYXRlZ29yeVwiICkudmFsKCksXG5cdFx0XHR0eXBlOiBcIjMwMVwiLFxuXHRcdH0sXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiggaXNfY2hlY2tlZCA9PT0gdHJ1ZSApIHtcblx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSByb3cgd2l0aCBvbGQgdXJsXG5cdFx0XHRcdGpRdWVyeSggJ3NwYW46Y29udGFpbnMoXCInICsgb2xkX3VybCArICdcIiknICkuY2xvc2VzdCggXCJ0clwiICkucmVtb3ZlKCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlbW92ZSB0aGUgdGhpY2tib3hcblx0XHRcdHRiX3JlbW92ZSgpO1xuXHRcdH1cblx0KTtcblxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogRGVjcmVtZW50IGN1cnJlbnQgY2F0ZWdvcnkgY291bnQgYnkgb25lLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBjYXRlZ29yeSBUaGUgY2F0ZWdvcnkgY291bnQgdG8gdXBkYXRlLlxuICovXG5mdW5jdGlvbiB3cHNlb191cGRhdGVfY2F0ZWdvcnlfY291bnQoIGNhdGVnb3J5ICkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHR2YXIgY291bnRfZWxlbWVudCA9IGpRdWVyeSggXCIjZ3NjX2NvdW50X1wiICsgY2F0ZWdvcnkgKyBcIlwiICk7XG5cdHZhciBuZXdfY291bnQgICAgID0gcGFyc2VJbnQoIGNvdW50X2VsZW1lbnQudGV4dCgpLCAxMCApIC0gMTtcblx0aWYoIG5ld19jb3VudCA8IDAgKSB7XG5cdFx0bmV3X2NvdW50ID0gMDtcblx0fVxuXG5cdGNvdW50X2VsZW1lbnQudGV4dCggbmV3X2NvdW50ICk7XG59XG5cbi8qKlxuICogTWFya3MgYSBzZWFyY2ggY29uc29sZSBjcmF3bCBpc3N1ZSBhcyBmaXhlZC5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdXJsIFRoZSBVUkwgdGhhdCBoYXMgYmVlbiBmaXhlZC5cbiAqL1xuZnVuY3Rpb24gd3BzZW9fbWFya19hc19maXhlZCggdXJsICkge1xuXHRcInVzZSBzdHJpY3RcIjtcblxuXHRqUXVlcnkucG9zdChcblx0XHRhamF4dXJsLFxuXHRcdHtcblx0XHRcdGFjdGlvbjogXCJ3cHNlb19tYXJrX2ZpeGVkX2NyYXdsX2lzc3VlXCIsXG5cdFx0XHRhamF4X25vbmNlOiBqUXVlcnkoIFwiLndwc2VvLWdzYy1hamF4LXNlY3VyaXR5XCIgKS52YWwoKSxcblx0XHRcdHBsYXRmb3JtOiBqUXVlcnkoIFwiI2ZpZWxkX3BsYXRmb3JtXCIgKS52YWwoKSxcblx0XHRcdGNhdGVnb3J5OiBqUXVlcnkoIFwiI2ZpZWxkX2NhdGVnb3J5XCIgKS52YWwoKSxcblx0XHRcdHVybDogdXJsLFxuXHRcdH0sXG5cdFx0ZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFx0aWYgKCBcInRydWVcIiA9PT0gcmVzcG9uc2UgKSB7XG5cdFx0XHRcdHdwc2VvX3VwZGF0ZV9jYXRlZ29yeV9jb3VudCggalF1ZXJ5KCBcIiNmaWVsZF9jYXRlZ29yeVwiICkudmFsKCkgKTtcblx0XHRcdFx0alF1ZXJ5KCAnc3Bhbjpjb250YWlucyhcIicgKyB1cmwgKyAnXCIpJyApLmNsb3Nlc3QoIFwidHJcIiApLnJlbW92ZSgpO1xuXHRcdFx0fVxuXHRcdH1cblx0KTtcbn1cblxud2luZG93Lndwc2VvX2dzY19wb3N0X3JlZGlyZWN0ID0gd3BzZW9fZ3NjX3Bvc3RfcmVkaXJlY3Q7XG53aW5kb3cud3BzZW9fdXBkYXRlX2NhdGVnb3J5X2NvdW50ID0gd3BzZW9fdXBkYXRlX2NhdGVnb3J5X2NvdW50O1xud2luZG93Lndwc2VvX21hcmtfYXNfZml4ZWQgPSB3cHNlb19tYXJrX2FzX2ZpeGVkO1xuIl19
