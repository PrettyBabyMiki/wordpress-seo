/**
 * Checks if the input character is a Hungarian vowel.
 *
 * @param {Object} morphologyData   The Hungarian morphology data.
 * @param {string} word The word to check
 * @returns {boolean} Whether the input character is a Hungarian vowel.
 */

const isVowel = function( morphologyData, word ) {
	const vowels = morphologyData.externalStemmer.vowels 
	const regex = new RegExp( vowels )
	return regex.test( word );
};
/**
 * Checks if the input character is a Hungarian double consonant.
 *
 * @param {string} char             The character to be checked.
 * @param {Object} morphologyData   The Hungarian morphology data.
 * @param {string} word The word to check
 * @returns {boolean} Whether the input character is a Hungarian vowel.
 */
const isDoubleConsonant = function( morphologyData, word ) {
	const regex = new RegExp( morphologyData.externalStemmer.doubleConsonants )
	return regex.test( word );
};

/**
 * Checks if the word begins with a vowel: defines R1 as the region after the first consonant or diagraph
 * Checks if the word begsin with a consonant: defines R1 as the region after the first vowel
 *
 * @param {Object} morphologyData Morphology data file
 * @param {string} word the word to check
 * @returns {number} the position of the digraph or consonant
 */
const consonantOrDigraphPosition = function( morphologyData, word ) {
	const digraphRegex = new RegExp( morphologyData.externalStemmer.digraphs )
	const consonantRegex = new RegExp( morphologyData.externalStemmer.consonants )
	const digraphPosition = digraphRegex.test( word );
	const consonantPosition = consonantRegex.test( word );
	if ( digraphPosition < consonantPosition ) {
		return digraphPosition ;
	}
	return consonantPosition ;
}

/**
 * Defines the R1 region
 * @param {Object} morphologyData Morphology data file
 * @param {string} word The word to stem
 * @returns {number} The R1 region
 */
const findR1Position = function( morphologyData, word ) {
	const vowelPosition = isVowel( morphologyData, word );
	console.log( morphologyData )
	if (vowelPosition === 0) {
		const consonantOrDigraphPosition = consonantOrDigraphPosition(morphologyData, word );
		return ( consonantOrDigraphPosition + 1 );
	}
	return ( vowelPosition + 1 );
}

/**
 * Searches on of the following noun case suffixes: al, el and stems the suffix if found in R1 and preceded by a double consonant
 * and removes one of the double consonants
 * @param {Object} morphologyData Morpology data file with suffix list
 * @param {string} word The word to stem
 * @param {number} r1Position The R1 region
 *
*/
const stemSuffixes1 = function( word, r1Position, suffixes1 ){
	const doubleConsonant = morphologyData.doubleConsonants

	if ( word.test( suffixes1 ) && r1Position ) {
		let wordAfterStemming = word.slice( -2 );
		const checkIfWordEndsOnDoubleConsonant = doubleConsonant.map( consonants => wordAfterStemming.endsWith( consonants ) );
		if( checkIfWordEndsOnDoubleConsonant ){
			wordAfterStemming = wordAfterStemming.slice( -1 );
		}
		return wordAfterStemming;
	}
	return word;
}

/**
 * Searches for the longer of the following suffixes: ban   ben   ba   be   ra   re   nak   nek   val   vel   tól   tõl
 * ról   rõl   ból   bõl   hoz   hez   höz   nál   nél   ig   at   et   ot   öt   ért   képp   képpen   kor   ul   ül
 * vá   vé   onként   enként   anként   ként   en   on   an   ön   n   t and stems the suffix if found in R1
 * If the suffix is preceded by á replaces with a. If the suffix is preceded by é replaces with e
 *
 * @param {Object} morphologyData Morphology data file with suffix list
 * @param {string} word The word to stem
 * @param {number} r1Position The R1 region
 */
const stemSuffixes2 = function( word, r1Position, suffixes2 ) {
	if ( word.test( suffixes2 ) && r1Position ) {
		let wordAfterStemming = word.slice( 0, -suffixes2.length );
		const checkIfWordEndsOnÉorÁ = wordAfterStemming.endsWith(["á", "é"]);
		if ( checkIfWordEndsOnÉorÁ ) {
			wordAfterStemming = wordAfterStemming.replace(/^á/i, "a" | /^é/i, "e");
		}
		return wordAfterStemming;
	}
	return word;
};

/*Search for the longest among the following suffixes in R1: án   ánként and replace by a
 *Search for én in R1 and replace with e
 *
 * @param {string} word             The word to check for the suffix.
 * @param  {string} r1Position      The R1 region of the word to stem.
 * @param {Object} regions          The object that contains the string within the R1 region and the rest string of the word.
 * @param {Object} morphologyData   The morphology data for Hungarian.
 *
 * @returns {string} The word without the suffix.
 */
	const stemSuffixes3 = function( word, r1Position, suffixes3 ) {
		if( word.test( suffixes3a ) && r1Position ) {
			return( word.slice(0, -stemSuffixes3a.length) + "a" ) ;
		}
		if( word.test( suffixes3.suffixes3b ) && r1Position ) {
			return( word.slice(-stemSuffixes3b.length) + "e" );
		}
	return word;
	};

/*Search for the longest among following suffixes astul   estül   stul   stül in R1 and delete
 */

		const stemSuffixes4 = function( word, r1Position, suffixes4 ) {
			if ( word.test(suffixes4) && r1 ) {
				return ( word.slice(-stemSuffixes4.length ));
			}
			return word;
		};


/*Searh for one of the suffixes ástul éstül, and replace ástul with a and éstül with e
 */
const stemSuffixes5 = function( word, r1Position, suffixes5 ) {
	if (word.test(suffixes5.suffix5a) && r1Position) {
		return (word.slice(-5) + "a"); // check if this can be a number for the minus 5
	}
	if (word.test(suffixes5.suffix5b) && r1Position) {
		return (word.slice(-5) + "e"); // or like this? (minus -5 )
	}
	return word;
};

// Search for one of the suffixes Search for one of the following suffixes: á   é and delete. If preceded by double
// consonant, remove one of the double consonants.
	const stemSuffixes6 = function ( r1Position, word, suffixes6 ) {
		const doubleConsonant = morphologyData.doubleConsonants

		if ( word.test( suffixes6 ) && r1) {
			let wordAfterStemming = word.slice(-1);
			const checkIfWordEndsOnDoubleConsonant = doubleConsonant.map(consonants => wordAfterStemming.endsWith(consonants));
			if ( checkIfWordEndsOnDoubleConsonant ) {
				wordAfterStemming = wordAfterStemming.slice(-1);
			}
			return wordAfterStemming;
		}
		return word;
	}

// Search for one of the suffixes in R1 and delete oké   öké   aké   eké   ké   éi   é
	const stemSuffixes7 = function ( word, r1Position, suffixes7 ) {
		if ( word.test( suffixes7 ) && r1Position ) {
			return( word.slice(0, -stemSuffixes7.length) );
		}
	return word;
};

// Search for one of the suffixes if R1 : áké   áéi and replace with a, or éké   ééi   éé and replace with e
const stemSuffixes8 = function( word, r1Position, suffixes8 ) {
	if (word.test( suffixes8.suffixes8a ) && r1 ) {
		return( word.slice(0, -3) + "a" );
	}
	if (word.test( suffixes8.suffixes8b ) && r1 ) {
		return( word.slice(-stemSuffixes9b.length) + "e" );
	}
return word;
}

// Search for the longest one of the suffixes in R1 and delete: ünk   unk   nk   juk   jük   uk   ük   em   om   am   m   od   ed
// ad   öd   d   ja   je   a   e o
const stemSuffixes9 = function( word, r1Position, suffixes9 ) {
	if (word.test( suffixes9 ) && r1) {
		return( word.slice( 0, -stemSuffixes9.length ) )
	}
return word;
}

// Search for the longest one of these suffixes in R1 ánk ájuk ám ád á and replace  with a
// Search the longest one of the suffixes in R1 énk éjük ém éd é and replace with e
const stemSuffixes10 = function( word, r1Position, suffixes10 ) {
	if( word.test( suffixes10.suffixes10a ) && r1 ) {
		return( word.slice( -stemSuffixes11a.length ) + "a" );
	}
	if( word.test( suffixes10.suffixes10b ) && r1 ) {
		return( word.slice( -stemSuffixes11b.length ) + "e" );
	}
return word;
}

// Search for the longets one of these suffixes in R1 and delete jaim   jeim   aim   eim   im   jaid   jeid   aid   eid
// id   jai   jei   ai   ei   i   jaink   jeink   eink   aink   ink   jaitok   jeitek   aitok   eitek   itek   jeik
// jaik   aik   eik   ik
const stemSuffixes11 = function( word, r1Position, suffixes11 ) {
	if (word.test( suffixes11 ) && r1) {
		return( word.slice( 0, -stemSuffixes11.length ) )
	}
return word;
}

// Search for the longest one of these suffixes in R1 áim   áid   ái   áink   áitok   áik and replace with a
// Search for the longest one of the suffixes in R1 éim   éid     éi   éink   éitek   éik and replace with e
const stemSuffixes12 = function( word, r1Position, suffixes12 ) {
	if( word.test( suffixes12.suffixes12a ) && r1 ) {
		return( word.slice(-stemSuffixes12a.length) + "a" );
	}
	if( word.test( suffixes12.suffixes12b ) && r1 ) {
		return( word.slice( -stemSuffixes12b.length ) + "e" );
	}
return word;
}

// Search for suffix ák in R1 and replace with a // check if we can unite this step and step above
// Search for suffix ék in R1 and replace with e
const stemSuffixes13 = function( word, r1Position, suffixes13 ) {
	if( word.test( suffixes12.suffixes12a ) && r1 ) {
		return( word.slice(-stemSuffixes13a.length) + "a" );
	}
	if( word.test( suffixes12.suffixes12b ) && r1 ) {
		return( word.slice( -stemSuffixes13b.length ) + "e" );
	}
return word;
}

//Search for the longest of these suffixes ök ok ek ak k in R1 and delte
const stemSuffixes14 = function( word, r1Position, suffixes14 ) {
	if (word.test( suffixes14 ) && r1) {
		return( word.slice( 0, -stemSuffixes14.length ) );
	}
return word;
}

/**
 * Stems Hungarian words.
 *
 * @param {string} word            The word to stem.
 * @param {Object} morphologyData  The Spanish morphology data.
 *
 * @returns {string} The stemmed word.
 */
export default function stem( word, morphologyData ) {
	const r1Position = findR1Position(word, morphologyData);
	const wordAfterSuffixes1 = stemSuffixes1(word, r1Position, morphologyData.suffixes1);
	const wordAfterSuffixes2 = stemSuffixes2(wordAfterSuffixes1,r1Position, morphologyData.externalStemmer.suffixes2);
	const wordAfterSuffixes3 = stemSuffixes3(wordAfterSuffixes2, r1Position, morphologyData.externalStemmer.suffixes3);
	const wordAfterSuffixes4 = stemSuffixes4(wordAfterSuffixes3, r1Position, morphologyData.externalStemmer.suffixes4);
	const wordAfterSuffixes5 = stemSuffixes5(wordAfterSuffixes4, r1Position, morphologyData.externalStemmer.suffixes5);
	const wordAfterSuffixes6 = stemSuffixes6(wordAfterSuffixes5, r1Position, morphologyData.externalStemmer.suffixes6);
	const wordAfterSuffixes7 = stemSuffixes6(wordAfterSuffixes6, r1Position, morphologyData.externalStemmer.suffixes7);
	const wordAfterSuffixes8 = stemSuffixes8(wordAfterSuffixes7, r1Position, morphologyData.externalStemmer.suffixes8);
	const wordAfterSuffixes9 = stemSuffixes9(wordAfterSuffixes8, r1Position, morphologyData.externalStemmer.suffixes9);
	const wordAfterSuffixes10 = stemSuffixes10(wordAfterSuffixes9, r1Position, morphologyData.externalStemmer.suffixes10);
	const wordAfterSuffixes11 = stemSuffixes11(wordAfterSuffixes10, r1Position, morphologyData.externalStemmer.suffixes11);
	const wordAfterSuffixes12 = stemSuffixes12(wordAfterSuffixes11, r1Position, morphologyData.externalStemmer.suffixes12);
	return( stemSuffixes13(wordAfterSuffixes12,r1Position, morphologyData.externalStemmer.suffixes13) );
}





