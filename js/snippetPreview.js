/* jshint browser: true */
/* global YoastSEO: true */
YoastSEO = ( "undefined" === typeof YoastSEO ) ? {} : YoastSEO;

/**
 * snippetpreview
 */

/**
 * defines the config and outputTarget for the YoastSEO.SnippetPreview
 *
 * @param {YoastSEO.App} refObj
 *
 * @constructor
 */
YoastSEO.SnippetPreview = function( refObj ) {
	this.refObj = refObj;
	this.init();
};

/**
 *  checks if title and url are set so they can be rendered in the snippetPreview
 */
YoastSEO.SnippetPreview.prototype.init = function() {
	if (
		this.refObj.formattedData.pageTitle !== null &&
		this.refObj.formattedData.cite !== null
	) {
		this.output = this.htmlOutput();
		this.renderOutput();
	}
};

/**
 * creates html object to contain the strings for the snippetpreview
 * @returns {html object with html-strings}
 */
YoastSEO.SnippetPreview.prototype.htmlOutput = function() {
	var html = {};
	html.title = this.formatTitle();
	html.cite = this.formatCite();
	html.meta = this.formatMeta();
	html.url = this.formatUrl();
	return html;
};

/**
 * formats the title for the snippet preview. If title and pageTitle are empty, sampletext is used
 * @returns {formatted page title}
 */
YoastSEO.SnippetPreview.prototype.formatTitle = function() {
	var title = this.refObj.formattedData.snippetTitle;
	if ( title === "" ) {
		title = this.refObj.formattedData.pageTitle;
	}
	if ( title === "" ) {
		title = this.refObj.config.sampleText.title;
	}
	title = this.refObj.stringHelper.stripAllTags( title );
	if ( this.refObj.formattedData.keyword !== "" ) {
		return this.formatKeyword( title );
	}
	return title;
};

/**
 * removes the protocol name from the urlstring.
 * @returns formatted url
 */
YoastSEO.SnippetPreview.prototype.formatUrl = function() {
	var url = this.refObj.formattedData.url;

	//removes the http(s) part of the url
	url.replace( /https?:\/\//ig, "" );
	return url;
};

/**
 * formats the url for the snippet preview
 * @returns formatted url
 */
YoastSEO.SnippetPreview.prototype.formatCite = function() {
	var cite = this.refObj.formattedData.snippetCite;
	cite = this.refObj.stringHelper.stripAllTags( cite );
	if ( cite === "" ) {
		cite = this.refObj.config.sampleText.url;
		return cite;
	} else {
		return this.formatKeywordUrl( cite );
	}
};

/**
 * formats the metatext for the snippet preview, if empty runs getMetaText
 * @returns formatted metatext
 */
YoastSEO.SnippetPreview.prototype.formatMeta = function() {
	var meta = this.refObj.formattedData.snippetMeta;
	if ( meta === "" ) {
		meta = this.getMetaText();
	}
	meta = this.refObj.stringHelper.stripAllTags( meta );
	meta = meta.substring( 0, YoastSEO.analyzerConfig.maxMeta );
	if ( this.refObj.formattedData.keyword !== "" && meta !== "" ) {
		return this.formatKeyword( meta );
	}
	return meta;
};

/**
 * formats the metatext, based on the keyword to select a part of the text.
 * If no keyword matches, takes the first 156chars (depending on the config).
 * If keyword and/or text is empty, it uses the sampletext.
 * @returns metatext
 */
YoastSEO.SnippetPreview.prototype.getMetaText = function() {
	var metaText;
	if ( typeof this.refObj.formattedData.excerpt !== "undefined" ) {
		metaText = this.refObj.formattedData.excerpt.substring(
			0,
			YoastSEO.analyzerConfig.maxMeta
		);
	}
	if ( metaText === "" ) {
		metaText = this.refObj.config.sampleText.meta;
		if (
			this.refObj.formattedData.keyword !== "" &&
			this.refObj.formattedData.text !== ""
		) {
			var indexMatches = this.getIndexMatches();
			var periodMatches = this.getPeriodMatches();
			metaText = this.refObj.formattedData.text.substring(
				0,
				YoastSEO.analyzerConfig.maxMeta
			);
			var curStart = 0;
			if ( indexMatches.length > 0 ) {
				for ( var j = 0; j < periodMatches.length; ) {
					if ( periodMatches[ 0 ] < indexMatches[ 0 ] ) {
						curStart = periodMatches.shift();
					} else {
						if ( curStart > 0 ) {
							curStart += 2;
						}
						break;
					}
				}
				metaText = this.refObj.stringHelper.stripAllTags(
					this.refObj.formattedData.text.substring(
						curStart,
						curStart + YoastSEO.analyzerConfig.maxMeta
					)
				);
			}
		}
	}
	if ( this.refObj.stringHelper.stripAllTags( metaText ) === "" ) {
		return this.refObj.config.sampleText.meta;
	}
	return metaText;
};

/**
 * Builds an array with all indexes of the keyword
 * @returns Array with matches
 */
YoastSEO.SnippetPreview.prototype.getIndexMatches = function() {
	var indexMatches = [];
	var i = 0;

	//starts at 0, locates first match of the keyword.
	var match = this.refObj.formattedData.text.indexOf(
		this.refObj.formattedData.keyword,
		i
	);

	//runs the loop untill no more indexes are found, and match returns -1.
	while ( match > -1 ) {
		indexMatches.push( match );

		//pushes location to indexMatches and increase i with the length of keyword.
		i = match + this.refObj.formattedData.keyword.length;
		match = this.refObj.formattedData.text.indexOf(
			this.refObj.formattedData.keyword,
			i
		);
	}
	return indexMatches;
};

/**
 * Builds an array with indexes of all sentence ends (select on .)
 * @returns array with sentences
 */
YoastSEO.SnippetPreview.prototype.getPeriodMatches = function() {
	var periodMatches = [ 0 ];
	var match;
	var i = 0;
	while ( ( match = this.refObj.formattedData.text.indexOf( ".", i ) ) > -1 ) {
		periodMatches.push( match );
		i = match + 1;
	}
	return periodMatches;
};

/**
 * formats the keyword for use in the snippetPreview by adding <strong>-tags
 * @param textString
 * @returns textString
 */
YoastSEO.SnippetPreview.prototype.formatKeyword = function( textString ) {

	//matches case insensitive and global
	var replacer = new RegExp( this.refObj.formattedData.keyword, "ig" );
	return textString.replace( replacer, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * formats the keyword for use in the URL by accepting - and _ in stead of space and by adding
 * <strong>-tags
 *
 * @param textString
 * @returns {XML|string|void}
 */
YoastSEO.SnippetPreview.prototype.formatKeywordUrl = function( textString ) {
	var replacer = this.refObj.formattedData.keyword.replace( " ", "[-_]" );

	//matches case insensitive and global
	replacer = new RegExp( replacer, "ig" );
	return textString.replace( replacer, function( str ) {
		return "<strong>" + str + "</strong>";
	} );
};

/**
 * Renders the outputs to the elements on the page.
 */
YoastSEO.SnippetPreview.prototype.renderOutput = function() {
	document.getElementById( "snippet_title" ).innerHTML = this.output.title;
	document.getElementById( "snippet_cite" ).innerHTML = this.output.cite;
	document.getElementById( "snippet_citeBase" ).innerHTML = this.output.url;
	document.getElementById( "snippet_meta" ).innerHTML = this.output.meta;
};

/**
 * function to call init, to rerender the snippetpreview
 */
YoastSEO.SnippetPreview.prototype.reRender = function() {
	this.init();
};

/**
 * used to disable enter as input. Returns false to prevent enter, and preventDefault and
 * cancelBubble to prevent
 * other elements from capturing this event.
 * @param event
 */
YoastSEO.SnippetPreview.prototype.disableEnter = function( ev ) {
	if ( ev.keyCode === 13 ) {
		ev.returnValue = false;
		ev.cancelBubble = true;
		ev.preventDefault();
	}
};

/**
 * checks text length of the snippetmeta and snippettitle, shortens it if it is too long.
 * @param event
 */
YoastSEO.SnippetPreview.prototype.checkTextLength = function( ev ) {
	var text = ev.currentTarget.textContent;
	switch ( ev.currentTarget.id ) {
		case "snippet_meta":
			if ( text.length > YoastSEO.analyzerConfig.maxMeta ) {
				ev.currentTarget.__unformattedText = ev.currentTarget.textContent;
				ev.currentTarget.textContent = text.substring(
					0,
					YoastSEO.analyzerConfig.maxMeta
				);
				ev.currentTarget.className = "desc";
			}
			break;
		case "snippet_title":
			if ( text.length > 40 ) {
				ev.currentTarget.__unformattedText = ev.currentTarget.textContent;
				ev.currentTarget.textContent = text.substring( 0, 40 );
				ev.currentTarget.className = "title";
			}
			break;
		default:
			break;
	}
};

/**
 * adds and remove the tooLong class when a text is too long.
 * @param ev
 */
YoastSEO.SnippetPreview.prototype.textFeedback = function( ev ) {
	var text = ev.currentTarget.textContent;
	switch ( ev.currentTarget.id ) {
		case "snippet_meta":
			if ( text.length > YoastSEO.analyzerConfig.maxMeta ) {
				ev.currentTarget.className = "desc tooLong";
			} else {
				ev.currentTarget.className = "desc";
			}
			break;
		case "snippet_title":
			if ( text.length > 40 ) {
				ev.currentTarget.className = "title tooLong";
			} else {
				ev.currentTarget.className = "title";
			}
			break;
		default:
			break;
	}
};

/**
 * shows the edit icon corresponding to the hovered element
 * @param ev
 */
YoastSEO.SnippetPreview.prototype.showEditIcon = function( ev ) {
	ev.currentTarget.parentElement.className = "editIcon snippet_container";
};

/**
 * removes all editIcon-classes, sets to snippet_container
 */
YoastSEO.SnippetPreview.prototype.hideEditIcon = function() {
	var elems = document.getElementsByClassName( "editIcon " );
	for ( var i = 0; i < elems.length; i++ ) {
		elems[ i ].className = "snippet_container";
	}
};

/**
 * sets focus on child element of the snippet_container that is clicked. Hides the editicon.
 * @param ev
 */
YoastSEO.SnippetPreview.prototype.setFocus = function( ev ) {
	var targetElem = ev.currentTarget.firstChild;
	while ( targetElem !== null ) {
		if ( targetElem.contentEditable === "true" ) {
			targetElem.focus();
			targetElem.refObj.snippetPreview.hideEditIcon();
			break;
		} else {
			targetElem = targetElem.nextSibling;
		}
	}
	targetElem.refObj.snippetPreview.setFocusToEnd( targetElem );
};

/**
 * this function is needed for placing the caret at the end of the input when the text is changed
 * at focus.
 * Otherwise the cursor could end at the beginning of the text.
 * @param elem
 */
YoastSEO.SnippetPreview.prototype.setFocusToEnd = function( elem ) {
	if (
		typeof window.getSelection !== "undefined" &&
		typeof document.createRange !== "undefined"
	) {
		var range = document.createRange();
		range.selectNodeContents( elem );
		range.collapse( false );
		var selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange( range );
	} else if ( typeof document.body.createTextRange !== "undefined" ) {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText( elem );
		textRange.collapse( false );
		textRange.select();
	}
};
