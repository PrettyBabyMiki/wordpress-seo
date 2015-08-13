/* global wpseoAdminL10n */
/* global ajaxurl */
/* global setWPOption */
/* global tb_remove */
/* global YoastSEO_Analyzer */
/* jshint -W097 */
/* jshint -W003 */
/* jshint unused:false */
'use strict';
jQuery( document ).ready( function() {
		/* Fix banner images overlapping help texts */
		jQuery( '.screen-meta-toggle a' ).click( function() {
				jQuery( '#sidebar-container' ).toggle();
			}
		);

		// events
		jQuery( '#enablexmlsitemap' ).change( function() {
				jQuery( '#sitemapinfo' ).toggle( jQuery( this ).is( ':checked' ) );
			}
		).change();

		jQuery( '#breadcrumbs-enable' ).change( function() {
				jQuery( '#breadcrumbsinfo' ).toggle( jQuery( this ).is( ':checked' ) );
			}
		).change();

		jQuery( '#disable_author_sitemap' ).change( function() {
				jQuery( '#xml_user_block' ).toggle( !jQuery( this ).is( ':checked' ) );
			}
		).change();

		jQuery( '#cleanpermalinks' ).change( function() {
				jQuery( '#cleanpermalinksdiv' ).toggle( jQuery( this ).is( ':checked' ) );
			}
		).change();

		jQuery( '#wpseo-tabs' ).find( 'a' ).click( function() {
				jQuery( '#wpseo-tabs' ).find( 'a' ).removeClass( 'nav-tab-active' );
				jQuery( '.wpseotab' ).removeClass( 'active' );

				var id = jQuery( this ).attr( 'id' ).replace( '-tab', '' );
				jQuery( '#' + id ).addClass( 'active' );
				jQuery( this ).addClass( 'nav-tab-active' );
			}
		);

		jQuery( '#company_or_person' ).change( function() {
				var companyOrPerson = jQuery( this ).val();
				if ( 'company' === companyOrPerson ) {
					jQuery( '#knowledge-graph-company' ).show();
					jQuery( '#knowledge-graph-person' ).hide();
				}
				else if ( 'person' === companyOrPerson ) {
					jQuery( '#knowledge-graph-company' ).hide();
					jQuery( '#knowledge-graph-person' ).show();
				}
				else {
					jQuery( '#knowledge-graph-company' ).hide();
					jQuery( '#knowledge-graph-person' ).hide();
				}
			}
		).change();

		jQuery( '.template' ).change( function() {
				wpseoDetectWrongVariables( jQuery( this ) );
			}
		).change();

		// init
		var activeTab = window.location.hash.replace( '#top#', '' );

		// default to first tab
		if ( activeTab === '' || activeTab === '#_=_' ) {
			activeTab = jQuery( '.wpseotab' ).attr( 'id' );
		}

		jQuery( '#' + activeTab ).addClass( 'active' );
		jQuery( '#' + activeTab + '-tab' ).addClass( 'nav-tab-active' );

		jQuery( '.nav-tab-active' ).click();
	}
);

/**
 * Detects the wrong use of variables in title and description templates
 *
 * @param {element} e
 */
function wpseoDetectWrongVariables( e ) {
	var warn = false;
	var error_id = '';
	var wrongVariables = [];
	var authorVariables = [ 'userid', 'name', 'user_description' ];
	var dateVariables = [ 'date' ];
	var postVariables = [ 'title', 'parent_title', 'excerpt', 'excerpt_only', 'caption', 'focuskw', 'pt_single', 'pt_plural', 'modified', 'id' ];
	var specialVariables = [ 'term404', 'searchphrase' ];
	var taxonomyVariables = [ 'term_title', 'term_description' ];
	var taxonomyPostVariables = [ 'category', 'category_description', 'tag', 'tag_description' ];
	if ( e.hasClass( 'posttype-template' ) ) {
		wrongVariables = wrongVariables.concat( specialVariables, taxonomyVariables );
	}
	else if ( e.hasClass( 'homepage-template' ) ) {
		wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, specialVariables, taxonomyVariables, taxonomyPostVariables );
	}
	else if ( e.hasClass( 'taxonomy-template' ) ) {
		wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, specialVariables );
	}
	else if ( e.hasClass( 'author-template' ) ) {
		wrongVariables = wrongVariables.concat( postVariables, dateVariables, specialVariables, taxonomyVariables, taxonomyPostVariables );
	}
	else if ( e.hasClass( 'date-template' ) ) {
		wrongVariables = wrongVariables.concat( authorVariables, postVariables, specialVariables, taxonomyVariables, taxonomyPostVariables );
	}
	else if ( e.hasClass( 'search-template' ) ) {
		wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, taxonomyVariables, taxonomyPostVariables, [ 'term404' ] );
	}
	else if ( e.hasClass( 'error404-template' ) ) {
		wrongVariables = wrongVariables.concat( authorVariables, dateVariables, postVariables, taxonomyVariables, taxonomyPostVariables, [ 'searchphrase' ] );
	}
	jQuery.each( wrongVariables, function( index, variable ) {
			error_id = e.attr( 'id' ) + '-' + variable + '-warning';
			if ( e.val().search( '%%' + variable + '%%' ) !== -1 ) {
				e.addClass( 'wpseo_variable_warning' );
				var msg = wpseoAdminL10n.variable_warning.replace( '%s', '%%' + variable + '%%' );
				if ( jQuery( '#' + error_id ).length ) {
					jQuery( '#' + error_id ).html( msg );
				}
				else {
					e.after( ' <div id="' + error_id + '" class="wpseo_variable_warning"><div class="clear"></div>' + msg + '</div>' );
				}
				warn = true;
			}
			else {
				if ( jQuery( '#' + error_id ).length ) {
					jQuery( '#' + error_id ).remove();
				}
			}
		}
	);
	if ( warn === false ) {
		e.removeClass( 'wpseo_variable_warning' );
	}
}

/**
 * Sets a specific WP option
 *
 * @param {string} option The option to update
 * @param {string} newval The new value for the option
 * @param {string} hide The ID of the element to hide on success
 * @param {string} nonce The nonce for the action
 */
function setWPOption( option, newval, hide, nonce ) {
	jQuery.post( ajaxurl, {
			action: 'wpseo_set_option',
			option: option,
			newval: newval,
			_wpnonce: nonce
		}, function( data ) {
			if ( data ) {
				jQuery( '#' + hide ).hide();
			}
		}
	);
}

/**
 * Do the kill blocking files action
 *
 * @param {string} nonce
 */
function wpseoKillBlockingFiles( nonce ) {
	jQuery.post( ajaxurl, {
			action: 'wpseo_kill_blocking_files',
			_ajax_nonce: nonce
		}, function( data ) {
			if ( data === 'success' ) {
				jQuery( '#blocking_files' ).hide();
			}
			else {
				jQuery( '#block_files' ).html( data );
			}
		}
	);
}

/**
 * Copies the meta description for the homepage
 */
function wpseoCopyHomeMeta() {
	jQuery( '#og_frontpage_desc' ).val( jQuery( '#meta_description' ).val() );
}

/**
 * Makes sure we store the action hash so we can return to the right hash
 */
function wpseoSetTabHash() {
	var conf = jQuery( '#wpseo-conf' );
	if ( conf.length ) {
		var currentUrl = conf.attr( 'action' ).split( '#' )[ 0 ];
		conf.attr( 'action', currentUrl + window.location.hash );
	}
}

/**
 * When the hash changes, get the base url from the action and then add the current hash
 */
jQuery( window ).on( 'hashchange', wpseoSetTabHash );

/**
 * When the hash changes, get the base url from the action and then add the current hash
 */
jQuery( document ).on( 'ready', wpseoSetTabHash );

function wpseo_add_fb_admin() {
	var target_form = jQuery( '#TB_ajaxContent' );

	jQuery.post(
		ajaxurl,
		{
			_wpnonce: target_form.find( 'input[name=fb_admin_nonce]' ).val(),
			admin_name: target_form.find( 'input[name=fb_admin_name]' ).val(),
			admin_id: target_form.find( 'input[name=fb_admin_id]' ).val(),
			action: 'wpseo_add_fb_admin'
		},
		function( response ) {
			var resp = jQuery.parseJSON( response );

			target_form.find( 'p.notice' ).remove();

			switch ( resp.success ) {
				case 1:

					target_form.find( 'input[type=text]' ).val( '' );

					jQuery( '#user_admin' ).append( resp.html );
					jQuery( '#connected_fb_admins' ).show();
					tb_remove();
					break;
				case 0 :
					jQuery( resp.html ).insertAfter( target_form.find( 'h3' ) );
					break;
			}
		}
	);
}

function wpseo_recalculate_scores( current_page ) {
	var total_count = parseInt( jQuery( '#wpseo_count_total' ).text(), 10 );
	var count_element = jQuery( '#wpseo_count' );
	var progress_bar = jQuery( '#wpseo_progressbar' );

	// Reset the count element and the progressbar
	count_element.text( 0 );
	progress_bar.progressbar( { value: 0 } );

	/**
	 * Objects to do the recalculate stuff
	 * @type {{update_progressbar: Function, calculate_score: Function, parse_response: Function, get_posts_to_recalculate: Function}}
	 */
	var wpseo_recalculate = {

		/**
		 * Updates the progressbar and the sum of the posts below it.
		 *
		 * @param {int} total_posts
		 */
		update_progressbar: function( total_posts ) {
			var current_value = count_element.text();
			var new_value = parseInt( current_value, 10 ) + total_posts;
			var new_width = new_value * (100 / total_count);

			progress_bar.progressbar( 'value', new_width );

			count_element.html( new_value );
		},

		/**
		 * Passing the post to the analyzer to calculates it's core
		 *
		 * @param {Object} post
		 */
		calculate_score: function( post ) {
			var tmpAnalyzer = new YoastSEO_Analyzer( post );
			tmpAnalyzer.runQueue();
			var score = tmpAnalyzer.analyzeScorer.__totalScore;

			// Doing request to update the score
			jQuery.post(
				ajaxurl,
				{
					action: 'wpseo_update_score',
					nonce: jQuery( '#wpseo_recalculate_nonce' ).val(),
					post_id: post.post_id,
					score: score
				}
			);
		},

		/**
		 * Parse the response given by request in get_posts_to_recalculate.
		 *
		 * @param {Object} response
		 */
		parse_response: function( response ) {
			if ( response !== '' && response !== null ) {
				if ( response.total_posts !== undefined ) {
					for ( var i = 0; i < response.total_posts; i++ ) {
						wpseo_recalculate.calculate_score( response.posts[ i ] );
					}

					wpseo_recalculate.update_progressbar( response.total_posts );
				}

				if ( response.next_page !== undefined ) {
					wpseo_recalculate.get_posts_to_recalculate( response.next_page );
				}
			}
		},

		/**
		 * Getting the posts which have to be recalculated.
		 *
		 * @param {int} current_page
		 */
		get_posts_to_recalculate: function( current_page ) {
			jQuery.post(
				ajaxurl,
				{
					action: 'wpseo_recalculate_scores',
					nonce: jQuery( '#wpseo_recalculate_nonce' ).val(),
					paged: current_page
				},
				wpseo_recalculate.parse_response,
				'json'
			);
		}
	};

	wpseo_recalculate.get_posts_to_recalculate( current_page );
}
