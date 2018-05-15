import forEach from "lodash/forEach";
import sortedIndexBy from "lodash/sortedIndexBy";
import trim from "lodash/trim";

const AFFIX = "%%";

/**
 * Serializes a tag into a string.
 *
 * @param {string} name The name of the tag.
 *
 * @returns {string} Serialized tag.
 */
export function serializeTag( name ) {
	return AFFIX + name + AFFIX;
}

/**
 * Serializes a DraftJS block into a string.
 *
 * @param {Object} entityMap Contains all the entities in the DraftJS editor.
 * @param {Object} block The block to serialize.
 *
 * @returns {string} The serialized block.
 */
export function serializeBlock( entityMap, block ) {
	const { text, entityRanges } = block;
	let previousEntityEnd = 0;
	let serialized = "";

	// Loop from high to low to ensure the index is still correct.
	for( let i = entityRanges.length - 1; i >= 0; i-- ) {
		const { key, length, offset } = entityRanges[ i ];
		const beforeEntityLength = offset - previousEntityEnd;

		const beforeEntity = text.substr( previousEntityEnd, beforeEntityLength );
		const serializedEntity = serializeTag( entityMap[ key ].data.mention.name );

		previousEntityEnd = offset + length;
		serialized += beforeEntity + serializedEntity;
	}

	serialized += text.substr( previousEntityEnd );

	return serialized;
}

/**
 * Serializes the content inside a DraftJS editor.
 *
 * @param {Object} rawContent The content as returned by convertToRaw.
 *
 * @returns {string} The serialized content.
 */
export function serializeEditor( rawContent ) {
	const { blocks, entityMap } = rawContent;

	return blocks.reduce( ( serialized, block ) => {
		return serialized + serializeBlock( entityMap, block );
	}, "" );
}

/**
 * Unserializes a tag into a string.
 *
 * @param {string} serializedTag The serialized tag.
 *
 * @returns {string} Unserialized tag.
 */
export function unserializeTag( serializedTag ) {
	return trim( serializedTag, AFFIX );
}

/**
 * Unserializes an entity to DraftJS data.
 *
 * @param {number} key The key the new entity should use.
 * @param {string} name The name of this entity.
 * @param {number} offset The offset where this entity starts in the text.
 *
 * @returns {Object} The serialized entity.
 */
export function unserializeEntity( key, name, offset ) {
	const entityRange = {
		key,
		offset,
		length: name.length,
	};

	const mappedEntity = {
		data: {
			mention: {
				name,
			},
		},
		mutability: "IMMUTABLE",
		type: "%mention",
	};

	return { entityRange, mappedEntity };
}

/**
 * Find all indices of a search term in a string.
 *
 * @param {string} searchTerm The term to search for.
 * @param {string} text       The text to search in.
 *
 * @returns {Array} Array of found indices.
 */
const getIndicesOf = ( searchTerm, text ) => {
	if ( searchTerm.length === 0 ) {
		return [];
	}

	let startIndex = 0;
	let index;
	const indices = [];

	while ( ( index = text.indexOf( searchTerm, startIndex ) ) > -1 ) {
		indices.push( index );
		startIndex = index + searchTerm.length;
	}

	return indices;
};

/**
 * Unserializes a piece of content into DraftJS data.
 *
 * @param {string} content The content to unserialize.
 * @param {Array} tags The tags for the DraftJS mention plugin.
 *
 * @returns {Object} The raw data ready for convertFromRaw.
 */
export function unserializeEditor( content, tags ) {
	const entityRanges = [];
	const entityMap = {};
	const replaceIndices = [];

	// Collect the replace indices for each tag.
	forEach( tags, tag => {
		const tagValue = serializeTag( tag.name );
		const indices = getIndicesOf( tagValue, content );

		forEach( indices, index => {
			const replaceIndex = {
				index,
				tag,
				tagValue,
			};

			// Add the replace index in order.
			const insertAt = sortedIndexBy( replaceIndices, replaceIndex, "index" );
			replaceIndices.splice( insertAt, 0, replaceIndex );
		} );
	} );

	// Loop from high to low to ensure the index is still correct.
	for( let i = replaceIndices.length - 1; i >= 0; i-- ) {
		const { index, tag, tagValue } = replaceIndices[ i ];

		// Replace the serialized tag with the unserialized tag.
		const before = content.substr( 0, index );
		const between = unserializeTag( content.substr( index, tagValue.length ) );
		const after = content.substr( index + tagValue.length );
		content = before + between + after;

		// Decrease the offset by twice the length of the affix for every index we replace.
		const offset = index - i * AFFIX.length * 2;
		const key = entityRanges.length;

		// Create the DraftJS data.
		const { entityRange, mappedEntity } = unserializeEntity( key, tag.name, offset );
		entityRanges.push( entityRange );
		entityMap[ key ] = mappedEntity;
	}

	const blocks = [ {
		entityRanges,
		text: content,
	} ];

	return {
		blocks,
		entityMap,
	};
}
