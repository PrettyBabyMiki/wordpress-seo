/* global jQuery, tb_show, tb_remove, TB_WIDTH, TB_HEIGHT, wpseoSetIgnore, ajaxurl */
import a11ySpeak from "a11y-speak";

import ProgressBar from "./ui/progressBar";

( ( $ ) => {
	let indexationInProgress = false;
	let stoppedIndexation = false;
	let processed = 0;
	const indexationActions = {};

	window.yoast = window.yoast || {};
	window.yoast.registerIndexationAction = ( endpoint, action ) => {
		indexationActions[ endpoint ] = action;
	};

	/**
	 * Does an indexation request.
	 *
	 * @param {string} url      The url of the indexation that should be done.
	 * @param {Object} settings The settings.
	 *
	 * @returns {Promise} The request promise.
	 */
	async function doIndexationRequest( url, settings ) {
		const response = await fetch( url, {
			method: "POST",
			headers: {
				"X-WP-Nonce": settings.restApi.nonce,
			},
		} );
		return response.json();
	}

	/**
	 * Does the indexation of a given endpoint.
	 *
	 * @param {string}      endpoint    The endpoint.
	 * @param {ProgressBar} progressBar The progress bar.
	 * @param {Object}      settings    The settings.
	 *
	 * @returns {Promise} The indexation promise.
	 */
	async function doIndexation( endpoint, progressBar, settings ) {
		let url = settings.restApi.root + settings.restApi.endpoints[ endpoint ];

		while ( ! stoppedIndexation && url !== false && processed <= settings.amount ) {
			const response = await doIndexationRequest( url, settings );
			if ( typeof indexationActions[ endpoint ] === "function" ) {
				await indexationActions[ endpoint ]( response.objects );
			}
			progressBar.update( response.objects.length );
			processed += response.objects.length;
			url = response.next_url;
		}
	}

	/**
	 * Starts the indexation.
	 *
	 * @param {ProgressBar} progressBar The progress bar.
	 * @param {Object}      settings    The settings.
	 *
	 * @returns {Promise} The indexation promise.
	 */
	async function startIndexation( progressBar, settings ) {
		processed = 0;
		for ( const endpoint of Object.keys( settings.restApi.endpoints ) ) {
			await doIndexation( endpoint, progressBar, settings );
		}
	}

	$( () => {
		$( ".yoast-open-indexation" ).on( "click", function() {
			const key      = $( this ).data( "settings" ) || "yoastIndexationData";
			const settings = window[ key ];
			let modalId    = settings.ids.modal || "yoast-indexation-wrapper";
			modalId = modalId.replace( /^#/, "" );

			/*
			 * WordPress overwrites the tb_position function if the media library is loaded to ignore custom height and width arguments.
			 * So we temporarily revert that change as we do want to have custom height and width.
			 * Eslint is disabled as these have to use the correct names.
			 * @see https://core.trac.wordpress.org/ticket/27473
			 */
			/* eslint-disable camelcase */
			const old_tb_position = window.tb_position;
			window.tb_position = () => {
				jQuery( "#TB_window" ).css( {
					marginLeft: "-" + parseInt( ( TB_WIDTH / 2 ), 10 ) + "px", width: TB_WIDTH + "px",
					marginTop: "-" + parseInt( ( TB_HEIGHT / 2 ), 10 ) + "px",
				} );
			};
			tb_show( $( this ).data( "title" ), "#TB_inline?width=600&height=175&inlineId=" + modalId, false );
			window.tb_position = old_tb_position;
			/* eslint-enable camelcase */

			if ( indexationInProgress === false ) {
				stoppedIndexation = false;
				indexationInProgress = true;

				a11ySpeak( settings.l10n.calculationInProgress );
				const progressBar    = new ProgressBar( settings.amount, settings.ids.count, settings.ids.progress );
				const notificationId = settings.ids.notification || "#yoast-indexation-warning";
				const toolId         = settings.ids.tool || "#yoast-indexation";

				startIndexation( progressBar, settings ).then( () => {
					if ( stoppedIndexation ) {
						return;
					}

					progressBar.complete();
					a11ySpeak( settings.l10n.calculationCompleted );
					$( notificationId )
						.html( "<p>" + settings.message.indexingCompleted + "</p>" )
						.addClass( "notice-success" )
						.removeClass( "notice-warning" );
					$( toolId ).html( settings.message.indexingCompleted );

					tb_remove();
					indexationInProgress = false;
				} ).catch( error => {
					if ( stoppedIndexation ) {
						return;
					}
					console.error( error );
					a11ySpeak( settings.l10n.calculationFailed );
					$( notificationId )
						.html( "<p>" + settings.message.indexingFailed + "</p>" )
						.addClass( "notice-error" )
						.removeClass( "notice-warning" );
					$( toolId ).html( settings.message.indexingFailed );

					tb_remove();
				} );
			}
		} );

		$( "#yoast-indexation-stop" ).on( "click", () => {
			stoppedIndexation = true;
			tb_remove();
			window.location.reload();
		} );

		$( "#yoast-indexation-dismiss-button" ).on( "click", function() {
			wpseoSetIgnore( "indexation_warning", "yoast-indexation-warning", jQuery( this ).data( "nonce" ) );
		} );

		$( "#yoast-indexation-remind-button" ).on( "click", function() {
			const nonce = jQuery( this ).data( "nonce" );

			jQuery.post(
				ajaxurl,
				{
					action: "wpseo_set_indexation_remind",
					_wpnonce: nonce,
				},
				function( data ) {
					if ( data ) {
						jQuery( "#yoast-indexation-warning" ).hide();
					}
				}
			);
		} );
	} );
} )( jQuery );
