import { BlockValidation } from ".";
import { BlockInstance } from "@wordpress/blocks";

export enum BlockPresence {
	Required = "required",
	Recommended = "recommended",
	Optional = "optional",
	Unknown = "unknown"
}

/**
 * Contains the result of a block validation.
 */
export class BlockValidationResult {
	/**
	 * The name of the validated block.
	 */
	public name: string;

	/**
	 * The clientId of the validated block.
	 */
	public clientId: string;

	/**
	 * The validation result.
	 */
	public result: BlockValidation;

	/**
	 * The block presence.
	 */
	public blockPresence: BlockPresence;

	/**
	 * The validation issues for this block's innerblocks or attributes, if any.
	 */
	public issues: BlockValidationResult[]

	/**
	 * @param clientId  The clientId of the validated block.
	 * @param name      The name of the validated block.
	 * @param result    The validation result.
	 * @param blockPresence The block type.
	 */
	constructor( clientId: string, name: string, result: BlockValidation, blockPresence: BlockPresence ) {
		this.clientId = clientId;
		this.name = name;
		this.result = result;
		this.blockPresence = blockPresence;
		this.issues = [];
	}

	/**
	 * Named constructor for a 'missing attribute' validation result.
	 *
	 * @param blockInstance The block instance.
	 * @param [name] Optional name.
	 *
	 * @constructor
	 */
	static MissingAttribute( blockInstance: BlockInstance, name?: string ) {
		return new BlockValidationResult(
			blockInstance.clientId,
			name || blockInstance.name,
			BlockValidation.MissingAttribute,
			BlockPresence.Unknown,
		);
	}

	/**
	 * Named constructor for a 'valid' validation result.
	 *
	 * @param blockInstance The block instance.
	 * @param [name] Optional name.
	 *
	 * @constructor
	 */
	static Valid( blockInstance: BlockInstance, name?: string ) {
		return new BlockValidationResult(
			blockInstance.clientId,
			name || blockInstance.name,
			BlockValidation.Valid,
			BlockPresence.Unknown,
		);
	}
}
