import { createAnchorOpeningTag } from "../../../../src/helpers/shortlinker";
import ProductIdentifiersAssessment from "../../../../src/scoring/assessments/seo/ProductIdentifiersAssessment";
import Paper from "../../../../src/values/Paper";
import Factory from "../../../specHelpers/factory";
import ProductSKUAssessment from "../../../../src/scoring/assessments/seo/ProductSKUAssessment";

const paper = new Paper( "" );


describe( "a test for Product identifiers assessment for WooCommerce", function() {
	const assessment = new ProductIdentifiersAssessment( { assessVariants: true } );

	it( "returns the score 9 when a product has a global identifier and no variants", function() {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalIdentifier: true,
			hasVariants: false,
			doAllVariantsHaveIdentifier: false,
			productType: "simple",
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>: " +
			"Your product has an identifier. Good job!" );
	} );

	it( "returns the score 9 when a product has no global identifier, but has variants and all variants have an identifier", function() {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalIdentifier: false,
			hasVariants: true,
			doAllVariantsHaveIdentifier: true,
			productType: "variable",
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>: " +
			"All your product variants have an identifier. Good job!" );
	} );

	it( "returns the score 6 when a product has no global identifier and no variants", function() {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalIdentifier: false,
			hasVariants: false,
			doAllVariantsHaveIdentifier: false,
			productType: "simple",
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>:" +
			" Your product is missing an identifier (like a GTIN code). <a href='https://yoa.st/4lz' target='_blank'>Include" +
			" this if you can, as it will help search engines to better understand your content.</a>" );
	} );

	it( "returns the score 6 when a product has a global identifier and variants, but not all variants have an identifier", function() {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalIdentifier: true,
			hasVariants: true,
			doAllVariantsHaveIdentifier: false,
			productType: "variable",
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>:" +
			" Not all your product variants have an identifier. <a href='https://yoa.st/4lz' target='_blank'>Include" +
			" this if you can, as it will help search engines to better understand your content.</a>" );
	} );

	it( "returns the score 6 when a product has no global identifier, but has variants and not all variants have an identifier", function() {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalIdentifier: false,
			hasVariants: true,
			doAllVariantsHaveIdentifier: false,
			productType: "variable",
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>:" +
			" Not all your product variants have an identifier. <a href='https://yoa.st/4lz' target='_blank'>Include" +
			" this if you can, as it will help search engines to better understand your content.</a>" );
	} );


	it( "returns the score 9 with the feedback for a simple product when a variable product has no variants but has a global identifier", function() {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalIdentifier: true,
			hasVariants: false,
			doAllVariantsHaveIdentifier: false,
			productType: "variable",
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>: " +
			"Your product has an identifier. Good job!" );
	} );

	it( "returns the score 6 with the feedback for a simple product when a variable product has no variants and no global identifier", function() {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalIdentifier: false,
			hasVariants: false,
			doAllVariantsHaveIdentifier: false,
			productType: "variable",
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/4ly' target='_blank'>Product identifier</a>:" +
			" Your product is missing an identifier (like a GTIN code). <a href='https://yoa.st/4lz' target='_blank'>Include" +
			" this if you can, as it will help search engines to better understand your content.</a>" );
	} );
} );

describe( "a test for Product identifiers assessment for Shopify", () => {
	const assessment = new ProductIdentifiersAssessment( { urlTitle: createAnchorOpeningTag( "https://yoa.st/shopify81" ),
		urlCallToAction: createAnchorOpeningTag( "https://yoa.st/shopify82" ),
		assessVariants: false,
		productIdentifierOrBarcode: "Barcode" } );

	it( "returns with score 9 when the product has global identifier and no variants", () => {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalIdentifier: true,
			hasVariants: false,
			productType: "simple",
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 9 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/shopify81' target='_blank'>Barcode</a>: " +
			"Your product has a barcode. Good job!" );
	} );

	it( "returns with score 6 when the product doesn't have a global identifier nor variants", () => {
		const assessmentResult = assessment.getResult( paper, Factory.buildMockResearcher( {
			hasGlobalIdentifier: false,
			hasVariants: false,
			productType: "simple",
		} ) );

		expect( assessmentResult.getScore() ).toEqual( 6 );
		expect( assessmentResult.getText() ).toEqual( "<a href='https://yoa.st/shopify81' target='_blank'>Barcode</a>:" +
			" Your product is missing a barcode (like a GTIN code). <a href='https://yoa.st/shopify82' target='_blank'>Include" +
			" this if you can, as it will help search engines to better understand your content.</a>" );
	} );
} );

describe( "a test for the applicability of the assessment", function() {
	it( "is applicable when the assessVariants variable is set to true", function() {
		const assessment = new ProductIdentifiersAssessment();
		const isApplicable = assessment.isApplicable( paper );

		expect( isApplicable ).toBe( true );
	} );

	it( "is not applicable when the assessVariants variable is set to false and the product has variants", function() {
		const assessment = new ProductIdentifiersAssessment( { assessVariants: false } );
		const customData = {
			hasGlobalIdentifier: false,
			hasVariants: true,
			productType: "simple",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( false );
	} );

	it( "is applicable when the assessVariants variable is set to false and the product doesn't have variants", function() {
		const assessment = new ProductIdentifiersAssessment();
		const customData = {
			hasGlobalIdentifier: false,
			hasVariants: false,
			productType: "simple",
		};
		const paperWithCustomData = new Paper( "", { customData } );
		const isApplicable = assessment.isApplicable( paperWithCustomData );

		expect( isApplicable ).toBe( true );
	} );
} );
