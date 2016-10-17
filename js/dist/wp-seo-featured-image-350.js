(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* global wp */
/* global wpseoFeaturedImageL10n */
/* global YoastSEO */
/* jshint -W097 */
/* jshint -W003 */

(function ($) {
	"use strict";

	var featuredImagePlugin;
	var featuredImageElement;

	var FeaturedImagePlugin = function FeaturedImagePlugin(app) {
		this._app = app;

		this.featuredImage = null;
		this.pluginName = "addFeaturedImagePlugin";

		this.registerPlugin();
		this.registerModifications();
	};

	/**
  * Set's the featured image to use in the analysis
  *
  * @param {String} featuredImage
  *
  * @returns {void}
  */
	FeaturedImagePlugin.prototype.setFeaturedImage = function (featuredImage) {
		this.featuredImage = featuredImage;

		this._app.pluginReloaded(this.pluginName);
	};

	/**
  * Removes featured image and reloads analyzer
  *
  * @returns {void}
  */
	FeaturedImagePlugin.prototype.removeFeaturedImage = function () {
		this.setFeaturedImage(null);
	};

	/**
  * Registers this plugin to YoastSEO
  *
  * @returns {void}
  */
	FeaturedImagePlugin.prototype.registerPlugin = function () {
		this._app.registerPlugin(this.pluginName, { status: "ready" });
	};

	/**
  * Registers modifications to YoastSEO
  *
  * @returns {void}
  */
	FeaturedImagePlugin.prototype.registerModifications = function () {
		this._app.registerModification("content", this.addImageToContent.bind(this), this.pluginName, 10);
	};

	/**
  * Adds featured image to sort so it can be analyzed
  *
  * @param {String} content
  * @returns {String}
  */
	FeaturedImagePlugin.prototype.addImageToContent = function (content) {
		if (null !== this.featuredImage) {
			content += this.featuredImage;
		}

		return content;
	};

	/**
  * Remove opengraph warning frame and borders
  *
  * @returns {void}
  */
	function removeOpengraphWarning() {
		$("#yst_opengraph_image_warning").remove();
		$("#postimagediv").css("border", "none");
	}

	/**
  * Check if image is smaller than 200x200 pixels. If this is the case, show a warning
  * @param {object} featuredImage
  *
  * @returns {void}
  */
	function checkFeaturedImage(featuredImage) {
		var attachment = featuredImage.state().get("selection").first().toJSON();

		if (attachment.width < 200 || attachment.height < 200) {
			// Show warning to user and do not add image to OG
			if (0 === $("#yst_opengraph_image_warning").length) {
				var $postImageDiv = $("#postimagediv");
				$('<div id="yst_opengraph_image_warning"><p>' + wpseoFeaturedImageL10n.featured_image_notice + "</p></div>").insertBefore($postImageDiv);
				$postImageDiv.css({
					border: "solid #dd3d36",
					borderWidth: "3px 4px 4px 4px"
				});
			}
		} else {
			// Force reset warning
			removeOpengraphWarning();
		}
	}

	$(document).ready(function () {
		var featuredImage = wp.media.featuredImage.frame();

		featuredImagePlugin = new FeaturedImagePlugin(YoastSEO.app);

		featuredImage.on("select", function () {
			var selectedImageHTML, selectedImage, alt;

			checkFeaturedImage(featuredImage);

			selectedImage = featuredImage.state().get("selection").first();

			// WordPress falls back to the title for the alt attribute if no alt is present.
			alt = selectedImage.get("alt");

			if ("" === alt) {
				alt = selectedImage.get("title");
			}

			selectedImageHTML = "<img" + ' src="' + selectedImage.get("url") + '"' + ' width="' + selectedImage.get("width") + '"' + ' height="' + selectedImage.get("height") + '"' + ' alt="' + alt + '"/>';

			featuredImagePlugin.setFeaturedImage(selectedImageHTML);
		});

		$("#postimagediv").on("click", "#remove-post-thumbnail", function () {
			featuredImagePlugin.removeFeaturedImage();
			removeOpengraphWarning();
		});

		featuredImageElement = $("#set-post-thumbnail > img");
		if ("undefined" !== typeof featuredImageElement.prop("src")) {
			featuredImagePlugin.setFeaturedImage($("#set-post-thumbnail ").html());
		}
	});
})(jQuery);

/* eslint-disable */
/* jshint ignore:start */
/**
 * Check if image is smaller than 200x200 pixels. If this is the case, show a warning
 * @param {object} featuredImage
 *
 * @deprecated since 3.1
 */
function yst_checkFeaturedImage(featuredImage) {
	return;
}

/**
 * Counter to make sure we do not end up in an endless loop if there' no remove-post-thumbnail id
 * @type {number}
 *
 * @deprecated since 3.1
 */
var thumbIdCounter = 0;

/**
 * Variable to hold the onclick function for remove-post-thumbnail.
 * @type {function}
 *
 * @deprecated since 3.1
 */
var removeThumb;

/**
 * If there's a remove-post-thumbnail id, add an onclick. When this id is clicked, call yst_removeOpengraphWarning
 * If not, check again after 100ms. Do not do this for more than 10 times so we do not end up in an endless loop
 *
 * @deprecated since 3.1
 */
function yst_overrideElemFunction() {
	return;
}

/**
 * Remove error message
 */
function yst_removeOpengraphWarning() {
	return;
}

window.yst_checkFeaturedImage = yst_checkFeaturedImage;
window.thumbIdCounter = thumbIdCounter;
window.removeThumb = removeThumb;
window.yst_overrideElemFunction = yst_overrideElemFunction;
window.yst_removeOpengraphWarning = yst_removeOpengraphWarning;
/* jshint ignore:end */
/* eslint-enable */

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9ncnVudC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqc1xcc3JjXFx3cC1zZW8tZmVhdHVyZWQtaW1hZ2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUUsV0FBVSxDQUFWLEVBQWM7QUFDZjs7QUFDQSxLQUFJLG1CQUFKO0FBQ0EsS0FBSSxvQkFBSjs7QUFFQSxLQUFJLHNCQUFzQixTQUF0QixtQkFBc0IsQ0FBVSxHQUFWLEVBQWdCO0FBQ3pDLE9BQUssSUFBTCxHQUFZLEdBQVo7O0FBRUEsT0FBSyxhQUFMLEdBQXFCLElBQXJCO0FBQ0EsT0FBSyxVQUFMLEdBQWtCLHdCQUFsQjs7QUFFQSxPQUFLLGNBQUw7QUFDQSxPQUFLLHFCQUFMO0FBQ0EsRUFSRDs7QUFVQTs7Ozs7OztBQU9BLHFCQUFvQixTQUFwQixDQUE4QixnQkFBOUIsR0FBaUQsVUFBVSxhQUFWLEVBQTBCO0FBQzFFLE9BQUssYUFBTCxHQUFxQixhQUFyQjs7QUFFQSxPQUFLLElBQUwsQ0FBVSxjQUFWLENBQTBCLEtBQUssVUFBL0I7QUFDQSxFQUpEOztBQU1BOzs7OztBQUtBLHFCQUFvQixTQUFwQixDQUE4QixtQkFBOUIsR0FBb0QsWUFBVztBQUM5RCxPQUFLLGdCQUFMLENBQXVCLElBQXZCO0FBQ0EsRUFGRDs7QUFJQTs7Ozs7QUFLQSxxQkFBb0IsU0FBcEIsQ0FBOEIsY0FBOUIsR0FBK0MsWUFBVztBQUN6RCxPQUFLLElBQUwsQ0FBVSxjQUFWLENBQTBCLEtBQUssVUFBL0IsRUFBMkMsRUFBRSxRQUFRLE9BQVYsRUFBM0M7QUFDQSxFQUZEOztBQUlBOzs7OztBQUtBLHFCQUFvQixTQUFwQixDQUE4QixxQkFBOUIsR0FBc0QsWUFBVztBQUNoRSxPQUFLLElBQUwsQ0FBVSxvQkFBVixDQUFnQyxTQUFoQyxF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QUFpQyxhQUFqQyxFQUFpRDtBQUNoRDtBQUNBOztBQUVEOzs7Ozs7QUFNQSxJQUFJLGlCQUFpQixDQUFyQjs7QUFFQTs7Ozs7O0FBTUEsSUFBSSxXQUFKOztBQUVBOzs7Ozs7QUFNQSxTQUFTLHdCQUFULEdBQW9DO0FBQ25DO0FBQ0E7O0FBRUQ7OztBQUdBLFNBQVMsMEJBQVQsR0FBc0M7QUFDckM7QUFDQTs7QUFFRCxPQUFPLHNCQUFQLEdBQWdDLHNCQUFoQztBQUNBLE9BQU8sY0FBUCxHQUF3QixjQUF4QjtBQUNBLE9BQU8sV0FBUCxHQUFxQixXQUFyQjtBQUNBLE9BQU8sd0JBQVAsR0FBa0Msd0JBQWxDO0FBQ0EsT0FBTywwQkFBUCxHQUFvQywwQkFBcEM7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGdsb2JhbCB3cCAqL1xyXG4vKiBnbG9iYWwgd3BzZW9GZWF0dXJlZEltYWdlTDEwbiAqL1xyXG4vKiBnbG9iYWwgWW9hc3RTRU8gKi9cclxuLyoganNoaW50IC1XMDk3ICovXHJcbi8qIGpzaGludCAtVzAwMyAqL1xyXG5cclxuKCBmdW5jdGlvbiggJCApIHtcclxuXHRcInVzZSBzdHJpY3RcIjtcclxuXHR2YXIgZmVhdHVyZWRJbWFnZVBsdWdpbjtcclxuXHR2YXIgZmVhdHVyZWRJbWFnZUVsZW1lbnQ7XHJcblxyXG5cdHZhciBGZWF0dXJlZEltYWdlUGx1Z2luID0gZnVuY3Rpb24oIGFwcCApIHtcclxuXHRcdHRoaXMuX2FwcCA9IGFwcDtcclxuXHJcblx0XHR0aGlzLmZlYXR1cmVkSW1hZ2UgPSBudWxsO1xyXG5cdFx0dGhpcy5wbHVnaW5OYW1lID0gXCJhZGRGZWF0dXJlZEltYWdlUGx1Z2luXCI7XHJcblxyXG5cdFx0dGhpcy5yZWdpc3RlclBsdWdpbigpO1xyXG5cdFx0dGhpcy5yZWdpc3Rlck1vZGlmaWNhdGlvbnMoKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBTZXQncyB0aGUgZmVhdHVyZWQgaW1hZ2UgdG8gdXNlIGluIHRoZSBhbmFseXNpc1xyXG5cdCAqXHJcblx0ICogQHBhcmFtIHtTdHJpbmd9IGZlYXR1cmVkSW1hZ2VcclxuXHQgKlxyXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdCAqL1xyXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnNldEZlYXR1cmVkSW1hZ2UgPSBmdW5jdGlvbiggZmVhdHVyZWRJbWFnZSApIHtcclxuXHRcdHRoaXMuZmVhdHVyZWRJbWFnZSA9IGZlYXR1cmVkSW1hZ2U7XHJcblxyXG5cdFx0dGhpcy5fYXBwLnBsdWdpblJlbG9hZGVkKCB0aGlzLnBsdWdpbk5hbWUgKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBSZW1vdmVzIGZlYXR1cmVkIGltYWdlIGFuZCByZWxvYWRzIGFuYWx5emVyXHJcblx0ICpcclxuXHQgKiBAcmV0dXJucyB7dm9pZH1cclxuXHQgKi9cclxuXHRGZWF0dXJlZEltYWdlUGx1Z2luLnByb3RvdHlwZS5yZW1vdmVGZWF0dXJlZEltYWdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnNldEZlYXR1cmVkSW1hZ2UoIG51bGwgKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBSZWdpc3RlcnMgdGhpcyBwbHVnaW4gdG8gWW9hc3RTRU9cclxuXHQgKlxyXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdCAqL1xyXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnJlZ2lzdGVyUGx1Z2luID0gZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLl9hcHAucmVnaXN0ZXJQbHVnaW4oIHRoaXMucGx1Z2luTmFtZSwgeyBzdGF0dXM6IFwicmVhZHlcIiB9ICk7XHJcblx0fTtcclxuXHJcblx0LyoqXHJcblx0ICogUmVnaXN0ZXJzIG1vZGlmaWNhdGlvbnMgdG8gWW9hc3RTRU9cclxuXHQgKlxyXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdCAqL1xyXG5cdEZlYXR1cmVkSW1hZ2VQbHVnaW4ucHJvdG90eXBlLnJlZ2lzdGVyTW9kaWZpY2F0aW9ucyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5fYXBwLnJlZ2lzdGVyTW9kaWZpY2F0aW9uKCBcImNvbnRlbnRcIiwgdGhpcy5hZGRJbWFnZVRvQ29udGVudC5iaW5kKCB0aGlzICksIHRoaXMucGx1Z2luTmFtZSwgMTAgKTtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBBZGRzIGZlYXR1cmVkIGltYWdlIHRvIHNvcnQgc28gaXQgY2FuIGJlIGFuYWx5emVkXHJcblx0ICpcclxuXHQgKiBAcGFyYW0ge1N0cmluZ30gY29udGVudFxyXG5cdCAqIEByZXR1cm5zIHtTdHJpbmd9XHJcblx0ICovXHJcblx0RmVhdHVyZWRJbWFnZVBsdWdpbi5wcm90b3R5cGUuYWRkSW1hZ2VUb0NvbnRlbnQgPSBmdW5jdGlvbiggY29udGVudCApIHtcclxuXHRcdGlmICggbnVsbCAhPT0gdGhpcy5mZWF0dXJlZEltYWdlICkge1xyXG5cdFx0XHRjb250ZW50ICs9IHRoaXMuZmVhdHVyZWRJbWFnZTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gY29udGVudDtcclxuXHR9O1xyXG5cclxuXHQvKipcclxuXHQgKiBSZW1vdmUgb3BlbmdyYXBoIHdhcm5pbmcgZnJhbWUgYW5kIGJvcmRlcnNcclxuXHQgKlxyXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIHJlbW92ZU9wZW5ncmFwaFdhcm5pbmcoKSB7XHJcblx0XHQkKCBcIiN5c3Rfb3BlbmdyYXBoX2ltYWdlX3dhcm5pbmdcIiApLnJlbW92ZSgpO1xyXG5cdFx0JCggXCIjcG9zdGltYWdlZGl2XCIgKS5jc3MoIFwiYm9yZGVyXCIsIFwibm9uZVwiICk7XHJcblx0fVxyXG5cclxuXHQvKipcclxuXHQgKiBDaGVjayBpZiBpbWFnZSBpcyBzbWFsbGVyIHRoYW4gMjAweDIwMCBwaXhlbHMuIElmIHRoaXMgaXMgdGhlIGNhc2UsIHNob3cgYSB3YXJuaW5nXHJcblx0ICogQHBhcmFtIHtvYmplY3R9IGZlYXR1cmVkSW1hZ2VcclxuXHQgKlxyXG5cdCAqIEByZXR1cm5zIHt2b2lkfVxyXG5cdCAqL1xyXG5cdGZ1bmN0aW9uIGNoZWNrRmVhdHVyZWRJbWFnZSggZmVhdHVyZWRJbWFnZSApIHtcclxuXHRcdHZhciBhdHRhY2htZW50ID0gZmVhdHVyZWRJbWFnZS5zdGF0ZSgpLmdldCggXCJzZWxlY3Rpb25cIiApLmZpcnN0KCkudG9KU09OKCk7XHJcblxyXG5cdFx0aWYgKCBhdHRhY2htZW50LndpZHRoIDwgMjAwIHx8IGF0dGFjaG1lbnQuaGVpZ2h0IDwgMjAwICkge1xyXG5cdFx0XHQvLyBTaG93IHdhcm5pbmcgdG8gdXNlciBhbmQgZG8gbm90IGFkZCBpbWFnZSB0byBPR1xyXG5cdFx0XHRpZiAoIDAgPT09ICQoIFwiI3lzdF9vcGVuZ3JhcGhfaW1hZ2Vfd2FybmluZ1wiICkubGVuZ3RoICkge1xyXG5cdFx0XHRcdHZhciAkcG9zdEltYWdlRGl2ID0gJCggXCIjcG9zdGltYWdlZGl2XCIgKTtcclxuXHRcdFx0XHQkKCAnPGRpdiBpZD1cInlzdF9vcGVuZ3JhcGhfaW1hZ2Vfd2FybmluZ1wiPjxwPicgKyB3cHNlb0ZlYXR1cmVkSW1hZ2VMMTBuLmZlYXR1cmVkX2ltYWdlX25vdGljZSArIFwiPC9wPjwvZGl2PlwiICkuaW5zZXJ0QmVmb3JlKCAkcG9zdEltYWdlRGl2ICk7XHJcblx0XHRcdFx0JHBvc3RJbWFnZURpdi5jc3MoIHtcclxuXHRcdFx0XHRcdGJvcmRlcjogXCJzb2xpZCAjZGQzZDM2XCIsXHJcblx0XHRcdFx0XHRib3JkZXJXaWR0aDogXCIzcHggNHB4IDRweCA0cHhcIixcclxuXHRcdFx0XHR9ICk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIEZvcmNlIHJlc2V0IHdhcm5pbmdcclxuXHRcdFx0cmVtb3ZlT3BlbmdyYXBoV2FybmluZygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0JCggZG9jdW1lbnQgKS5yZWFkeSggZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZmVhdHVyZWRJbWFnZSA9IHdwLm1lZGlhLmZlYXR1cmVkSW1hZ2UuZnJhbWUoKTtcclxuXHJcblx0XHRmZWF0dXJlZEltYWdlUGx1Z2luID0gbmV3IEZlYXR1cmVkSW1hZ2VQbHVnaW4oIFlvYXN0U0VPLmFwcCApO1xyXG5cclxuXHRcdGZlYXR1cmVkSW1hZ2Uub24oIFwic2VsZWN0XCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc2VsZWN0ZWRJbWFnZUhUTUwsIHNlbGVjdGVkSW1hZ2UsIGFsdDtcclxuXHJcblx0XHRcdGNoZWNrRmVhdHVyZWRJbWFnZSggZmVhdHVyZWRJbWFnZSApO1xyXG5cclxuXHRcdFx0c2VsZWN0ZWRJbWFnZSA9IGZlYXR1cmVkSW1hZ2Uuc3RhdGUoKS5nZXQoIFwic2VsZWN0aW9uXCIgKS5maXJzdCgpO1xyXG5cclxuXHRcdFx0Ly8gV29yZFByZXNzIGZhbGxzIGJhY2sgdG8gdGhlIHRpdGxlIGZvciB0aGUgYWx0IGF0dHJpYnV0ZSBpZiBubyBhbHQgaXMgcHJlc2VudC5cclxuXHRcdFx0YWx0ID0gc2VsZWN0ZWRJbWFnZS5nZXQoIFwiYWx0XCIgKTtcclxuXHJcblx0XHRcdGlmICggXCJcIiA9PT0gYWx0ICkge1xyXG5cdFx0XHRcdGFsdCA9IHNlbGVjdGVkSW1hZ2UuZ2V0KCBcInRpdGxlXCIgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2VsZWN0ZWRJbWFnZUhUTUwgPSBcIjxpbWdcIiArXHJcblx0XHRcdFx0JyBzcmM9XCInICsgc2VsZWN0ZWRJbWFnZS5nZXQoIFwidXJsXCIgKSArICdcIicgK1xyXG5cdFx0XHRcdCcgd2lkdGg9XCInICsgc2VsZWN0ZWRJbWFnZS5nZXQoIFwid2lkdGhcIiApICsgJ1wiJyArXHJcblx0XHRcdFx0JyBoZWlnaHQ9XCInICsgc2VsZWN0ZWRJbWFnZS5nZXQoIFwiaGVpZ2h0XCIgKSArICdcIicgK1xyXG5cdFx0XHRcdCcgYWx0PVwiJyArIGFsdCArXHJcblx0XHRcdFx0J1wiLz4nO1xyXG5cclxuXHRcdFx0ZmVhdHVyZWRJbWFnZVBsdWdpbi5zZXRGZWF0dXJlZEltYWdlKCBzZWxlY3RlZEltYWdlSFRNTCApO1xyXG5cdFx0fSApO1xyXG5cclxuXHRcdCQoIFwiI3Bvc3RpbWFnZWRpdlwiICkub24oIFwiY2xpY2tcIiwgXCIjcmVtb3ZlLXBvc3QtdGh1bWJuYWlsXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRmZWF0dXJlZEltYWdlUGx1Z2luLnJlbW92ZUZlYXR1cmVkSW1hZ2UoKTtcclxuXHRcdFx0cmVtb3ZlT3BlbmdyYXBoV2FybmluZygpO1xyXG5cdFx0fSApO1xyXG5cclxuXHRcdGZlYXR1cmVkSW1hZ2VFbGVtZW50ID0gJCggXCIjc2V0LXBvc3QtdGh1bWJuYWlsID4gaW1nXCIgKTtcclxuXHRcdGlmICggXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIGZlYXR1cmVkSW1hZ2VFbGVtZW50LnByb3AoIFwic3JjXCIgKSApIHtcclxuXHRcdFx0ZmVhdHVyZWRJbWFnZVBsdWdpbi5zZXRGZWF0dXJlZEltYWdlKCAkKCBcIiNzZXQtcG9zdC10aHVtYm5haWwgXCIgKS5odG1sKCkgKTtcclxuXHRcdH1cclxuXHR9ICk7XHJcbn0oIGpRdWVyeSApICk7XHJcblxyXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4vKiBqc2hpbnQgaWdub3JlOnN0YXJ0ICovXHJcbi8qKlxyXG4gKiBDaGVjayBpZiBpbWFnZSBpcyBzbWFsbGVyIHRoYW4gMjAweDIwMCBwaXhlbHMuIElmIHRoaXMgaXMgdGhlIGNhc2UsIHNob3cgYSB3YXJuaW5nXHJcbiAqIEBwYXJhbSB7b2JqZWN0fSBmZWF0dXJlZEltYWdlXHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIHNpbmNlIDMuMVxyXG4gKi9cclxuZnVuY3Rpb24geXN0X2NoZWNrRmVhdHVyZWRJbWFnZSggZmVhdHVyZWRJbWFnZSApIHtcclxuXHRyZXR1cm47XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBDb3VudGVyIHRvIG1ha2Ugc3VyZSB3ZSBkbyBub3QgZW5kIHVwIGluIGFuIGVuZGxlc3MgbG9vcCBpZiB0aGVyZScgbm8gcmVtb3ZlLXBvc3QtdGh1bWJuYWlsIGlkXHJcbiAqIEB0eXBlIHtudW1iZXJ9XHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIHNpbmNlIDMuMVxyXG4gKi9cclxudmFyIHRodW1iSWRDb3VudGVyID0gMDtcclxuXHJcbi8qKlxyXG4gKiBWYXJpYWJsZSB0byBob2xkIHRoZSBvbmNsaWNrIGZ1bmN0aW9uIGZvciByZW1vdmUtcG9zdC10aHVtYm5haWwuXHJcbiAqIEB0eXBlIHtmdW5jdGlvbn1cclxuICpcclxuICogQGRlcHJlY2F0ZWQgc2luY2UgMy4xXHJcbiAqL1xyXG52YXIgcmVtb3ZlVGh1bWI7XHJcblxyXG4vKipcclxuICogSWYgdGhlcmUncyBhIHJlbW92ZS1wb3N0LXRodW1ibmFpbCBpZCwgYWRkIGFuIG9uY2xpY2suIFdoZW4gdGhpcyBpZCBpcyBjbGlja2VkLCBjYWxsIHlzdF9yZW1vdmVPcGVuZ3JhcGhXYXJuaW5nXHJcbiAqIElmIG5vdCwgY2hlY2sgYWdhaW4gYWZ0ZXIgMTAwbXMuIERvIG5vdCBkbyB0aGlzIGZvciBtb3JlIHRoYW4gMTAgdGltZXMgc28gd2UgZG8gbm90IGVuZCB1cCBpbiBhbiBlbmRsZXNzIGxvb3BcclxuICpcclxuICogQGRlcHJlY2F0ZWQgc2luY2UgMy4xXHJcbiAqL1xyXG5mdW5jdGlvbiB5c3Rfb3ZlcnJpZGVFbGVtRnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuO1xyXG59XHJcblxyXG4vKipcclxuICogUmVtb3ZlIGVycm9yIG1lc3NhZ2VcclxuICovXHJcbmZ1bmN0aW9uIHlzdF9yZW1vdmVPcGVuZ3JhcGhXYXJuaW5nKCkge1xyXG5cdHJldHVybjtcclxufVxyXG5cclxud2luZG93LnlzdF9jaGVja0ZlYXR1cmVkSW1hZ2UgPSB5c3RfY2hlY2tGZWF0dXJlZEltYWdlO1xyXG53aW5kb3cudGh1bWJJZENvdW50ZXIgPSB0aHVtYklkQ291bnRlcjtcclxud2luZG93LnJlbW92ZVRodW1iID0gcmVtb3ZlVGh1bWI7XHJcbndpbmRvdy55c3Rfb3ZlcnJpZGVFbGVtRnVuY3Rpb24gPSB5c3Rfb3ZlcnJpZGVFbGVtRnVuY3Rpb247XHJcbndpbmRvdy55c3RfcmVtb3ZlT3BlbmdyYXBoV2FybmluZyA9IHlzdF9yZW1vdmVPcGVuZ3JhcGhXYXJuaW5nO1xyXG4vKiBqc2hpbnQgaWdub3JlOmVuZCAqL1xyXG4vKiBlc2xpbnQtZW5hYmxlICovXHJcbiJdfQ==
