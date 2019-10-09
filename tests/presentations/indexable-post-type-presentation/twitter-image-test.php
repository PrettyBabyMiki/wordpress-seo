<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Twitter_Image_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 */
class Twitter_Image_Test extends TestCase {

	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests the situation where the post is password protected.
	 *
	 * @covers ::generate_og_images
	 */
	public function test_for_password_protected_post() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( true );

		$this->assertEmpty( $this->instance->generate_og_images() );
	}

	/**
	 * Tests the situation where the Twitter image is given.
	 *
	 * ::covers generate_twitter_image
	 */
	public function test_generate_twitter_image() {
		Monkey\Functions\expect( 'post_password_required' )
			->once()
			->andReturn( false );

		$this->indexable->twitter_image = 'twitter_image.jpg';

		$this->twitter_image_generator
			->expects( 'generate' )
			->once()
			->with( $this->context )
			->andReturn(
				[
					'twitter_image.jpg' => [
						'url' => 'twitter_image.jpg',
					],
				]
			);

		$this->assertEquals( 'twitter_image.jpg', $this->instance->generate_twitter_image() );
	}
}
