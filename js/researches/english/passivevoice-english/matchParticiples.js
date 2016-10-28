var find = require ( "lodash/find" );

var irregulars = require( "./irregulars" )();

/**
 * Returns words that have been determined to be a regular participle.
 * @param {string} word The word to check
 * 
 * @returns {Array} A list with the matches.
 */
var regularParticiples = function( word ) {

	// Matches all words ending in ed.
	var regularParticiplesRegex = /\w+ed($|[ \n\r\t\.,'\(\)\"\+\-;!?:\/»«‹›<>])/ig;

	return word.match( regularParticiplesRegex ) || [];
};

/**
 * Returns the matches for a word in the list of irregulars.
 * 
 * @param {string} word The word to match in the list.
 *
 * @returns {Array} A list with the matches.
 */
var irregularParticiples = function( word ) {
	var matches = [];
	find( irregulars, function( currentWord ) {
		if( currentWord === word ) {
			matches.push( currentWord );
		}
	} );
	return matches;
};

module.exports = function() {
	return {
		regularParticiples: regularParticiples,
		irregularParticiples: irregularParticiples,
	};
};
