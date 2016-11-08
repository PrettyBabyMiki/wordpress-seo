let gettextParser = require( "gettext-parser" );
let _forEach = require( "lodash/foreach" );
let _isEmpty = require( "lodash/isempty" );

let TAB = "\t";
let NEWLINE = "\n";

let fileHeader = [
	"<?php",
	"/* THIS IS A GENERATED FILE. DO NOT EDIT DIRECTLY. */",
	"$generated_i18n_strings = array(",
].join( NEWLINE ) + NEWLINE;

let fileFooter = NEWLINE + [
	");",
	"/* THIS IS THE END OF THE GENERATED FILE */",
].join( NEWLINE ) + NEWLINE;

/**
 * Escapes double quotes
 *
 * @param {string} input The string to be escaped.
 * @returns {string} The escaped string.
 */
function escapeDoubleQuotes( input ) {
	return input.replace( /"/g, '\\"' );
}

/**
 * Converts a translation parsed from the POT file to lines of WP PHP
 *
 * @param {Object} translation The translation to convert.
 * @param {string} textdomain The text domain to use in the WordPress translation function call.
 * @returns {string} Lines of PHP that match the translation.
 */
function convertTranslationToPHP( translation, textdomain ) {
	let php = "";

	// The format of gettext-js matches the terminology in gettext itself.
	let original = translation.msgid;
	let comments = translation.comments;

	if ( ! _isEmpty( comments ) ) {
		if ( ! _isEmpty( comments.reference ) ) {
			// All references are split by newlines, add a // Reference prefix to make them tidy.
			php += TAB + "// Reference: " +
				comments.reference
					.split( NEWLINE )
					.join( NEWLINE + TAB + "// Reference: " ) +
				NEWLINE;
		}

		if ( ! _isEmpty( comments.extracted ) ) {
			// All extracted comments are split by newlines, add a tab to line them up nicely.
			let extracted = comments.extracted
				.split( NEWLINE )
				.join( NEWLINE + TAB + "   " );

			php += TAB + `/* ${extracted} */${NEWLINE}`;
		}
	}

	if ( "" !== original ) {
		original = escapeDoubleQuotes( original );

		if ( _isEmpty( translation.msgid_plural ) ) {
			php += TAB + `__( "${original}", "${textdomain}" )`;
		} else {
			let plural = escapeDoubleQuotes( translation.msgid_plural );

			php += TAB + `_n( "${original}", "${plural}", 1, "${textdomain}" )`;
		}
	}

	return php;
}

module.exports = function( grunt ) {
	grunt.registerMultiTask( "convert-pot-to-wp", "Make a PHP file for wordpress.org so the strings end up in the translation project", function() {
		let options = this.options( {
			textdomain: "textdomain",
		} );

		this.files.forEach( ( file ) => {
			let output = [];

			file.src.forEach( ( srcPath ) => {
				let poContents = grunt.file.read( srcPath );
				let parsedPO = gettextParser.po.parse( poContents );

				let translations = parsedPO.translations[ "" ];

				_forEach( translations, ( translation ) => {
					output.push( convertTranslationToPHP( translation, options.textdomain ) );
				} );

				output = output.filter( ( php ) => {
					return "" !== php;
				} );
			} );

			let fileOutput = fileHeader + output.join( "," + NEWLINE + NEWLINE ) + fileFooter;

			// Write the PHP output to the file.
			grunt.file.write( file.dest, fileOutput );
		} );
	} );
};
