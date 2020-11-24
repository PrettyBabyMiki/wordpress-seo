import { BlockInstance } from "@wordpress/blocks";
import * as innerBlocksValid from "../../../src/functions/validators/innerBlocksValid";
import { InvalidBlock, RequiredBlock } from "../../../src/instructions/blocks/dto";
import { InvalidBlockReason, RequiredBlockOption } from "../../../src/instructions/blocks/enums";

const createInvalidBlockTestArrangement = [
    { name: "missingblock", reason: InvalidBlockReason.Missing } ,
    { name: "redundantblock", reason: InvalidBlockReason.TooMany },
    { name: "invalidblock", reason: InvalidBlockReason.Internal },
];

describe.each( createInvalidBlockTestArrangement )( "The createInvalidBlock function", input => {    
    it ( `creates an InvalidBlock instance with name '${input.name}' and reason '${input.reason}'.`, () => {
        var result = innerBlocksValid.createInvalidBlock( input.name, input.reason );
        expect( result.name ).toBe ( input.name );
        expect( result.reason ).toBe ( input.reason );
    });
});

describe("The findMissingBlocks function", () => {
    it ( "creates an InvalidBlock instance with name 'missingblock' and reason 'missing'.", () => {
        // Arrange.
        const requiredBlocks : RequiredBlock[] = [ 
            { 
                name: "existingblock",
                option : RequiredBlockOption.Multiple, 
            } as RequiredBlock, 
            {
                name: "missingblock",
                option : RequiredBlockOption.Multiple,
            } as RequiredBlock,
        ];
        const existingRequiredBlocks : BlockInstance[] = [ 
            {
                name: "existingblock",
            } as BlockInstance,
        ]; 

        // Act.
        const result: InvalidBlock[] = innerBlocksValid.findMissingBlocks( requiredBlocks, existingRequiredBlocks );

        // Assert.
        expect( result.length ).toBe( 1 );
        expect( result[0].name ).toBe( "missingblock" );
        expect( result[0].reason ).toBe( InvalidBlockReason.Missing );
    });

    it ( "creates no InvalidBlock instances when all required blocks are present.", () => {
        // Arrange.
        const requiredBlocks : RequiredBlock[] = [ 
            { 
                name: "existingblock",
                option : RequiredBlockOption.Multiple, 
            } as RequiredBlock,
        ];
        const existingRequiredBlocks : BlockInstance[] = [ 
            {
                name: "existingblock",
            } as BlockInstance,
        ]; 

        // Act.
        const result: InvalidBlock[] = innerBlocksValid.findMissingBlocks( requiredBlocks, existingRequiredBlocks );

        // Assert.
        expect( result.length ).toBe( 0 );
    });
});

describe("The findRedundantBlocks function", () => {    
    it ( "creates an InvalidBlock instance with name 'duplicateBlock' and reason 'toomany'.", () => {
        // Arrange.
        const requiredBlocks : RequiredBlock[] = [ 
            { 
                name: "duplicateBlock",
                option : RequiredBlockOption.One, 
            } as RequiredBlock,
        ];
        const existingRequiredBlocks : BlockInstance[] = [ 
            {
                name: "duplicateBlock",
            } as BlockInstance,
            {
                name: "duplicateBlock",
            } as BlockInstance,
        ]; 

        // Act.
        const result: InvalidBlock[] = innerBlocksValid.findRedundantBlocks( requiredBlocks, existingRequiredBlocks );

        // Assert.
        expect( result.length ).toBe( 1 );
        expect( result[0].name ).toBe( "duplicateBlock" );
        expect( result[0].reason ).toBe( InvalidBlockReason.TooMany );
    });

    it ( "creates no InvalidBlock instances when no redundant blocks are present.", () => {
        // Arrange.
        const requiredBlocks : RequiredBlock[] = [ 
            { 
                name: "duplicateBlock",
                option : RequiredBlockOption.One, 
            } as RequiredBlock,
        ];
        const existingRequiredBlocks : BlockInstance[] = [ 
            {
                name: "duplicateBlock",
            } as BlockInstance,
        ]; 

        // Act.
        const result: InvalidBlock[] = innerBlocksValid.findRedundantBlocks( requiredBlocks, existingRequiredBlocks );

        // Assert.
        expect( result.length ).toBe( 0 );
    });
});

