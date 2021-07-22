import ImageCountAssessment from "../../../../src/scoring/assessments/seo/ImageCountAssessment";
import Paper from "../../../../src/values/Paper.js";
import Factory from "../../../specHelpers/factory.js";
const i18n = Factory.buildJed();

const imageCountAssessment = new ImageCountAssessment();

describe( "An image count assessment", function() {
	it( "assesses no images", function() {
		const mockPaper = new Paper( "sample" );

		const assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 0,
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 3 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Images</a>: " +
			"No images appear on this page. <a href='https://yoa.st/33d' target='_blank'>Add some</a>!" );
	} );

	it( "assesses a text with one image", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />" );

		const assessment = imageCountAssessment.getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Images</a>: Good job!" );
	} );

	it( "assesses a text with one image with an additional configuration for orange bullet", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " );

		const config = {
			scores: {
				okay: 6,
			},
			recommendedCount: 4,
		};
		const assessment = new ImageCountAssessment( config ).getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 1,
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Images</a>: Only 1 image " +
			"appears on this page. We recommend at least 4. <a href='https://yoa.st/33d' target='_blank'>Add more relevant images</a>!" );
	} );

	it( "assesses a text with two images with an additional configuration for orange bullet", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " +
			"But you need more than five words to describe the beauty of a cat <img src='image.jpg' />." );

		const config = {
			scores: {
				okay: 6,
			},
			recommendedCount: 4,
		};
		const assessment = new ImageCountAssessment( config ).getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 2,
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 6 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Images</a>: Only 2 images " +
			"appear on this page. We recommend at least 4. <a href='https://yoa.st/33d' target='_blank'>Add more relevant images</a>!" );
	} );

	it( "assesses a text with 5 images with an additional configuration for orange bullet", function() {
		const mockPaper = new Paper( "These are just five words <img src='image.jpg' />. " +
			"But you need more than five words to describe the beauty of a cat <img src='image.jpg' />." +
			"These are just five words <img src='image.jpg' />. " +
			"But you need more than five words to describe the beauty of a cat <img src='image.jpg' />." +
			"These are just five words <img src='image.jpg' />. " );

		const config = {
			scores: {
				okay: 6,
			},
			recommendedCount: 4,
		};
		const assessment = new ImageCountAssessment( config ).getResult( mockPaper, Factory.buildMockResearcher( {
			imageCount: 5,
		}, true ), i18n );

		expect( assessment.getScore() ).toEqual( 9 );
		expect( assessment.getText() ).toEqual( "<a href='https://yoa.st/33c' target='_blank'>Images</a>: Good job!" );
	} );
} );

describe( "tests for the assessment applicability.", function() {
	it( "returns false when the paper is empty.", function() {
		const paper = new Paper( "" );
		expect( imageCountAssessment.isApplicable( paper ) ).toBe( false );
	} );

	it( "returns true when the paper is not empty.", function() {
		const paper = new Paper( "sample keyword", {
			url: "sample-with-keyword",
			keyword: "kéyword",
		} );
		expect( imageCountAssessment.isApplicable( paper ) ).toBe( true );
	} );
} );
