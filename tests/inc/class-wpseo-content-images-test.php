<?php

namespace Yoast\WP\Free\Tests\Inc;

use WPSEO_Content_Images;
use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;
use Mockery;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass WPSEO_Content_Images
 * @group ContentImages
 */
class Content_Images_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Content_Images
	 */
	private $instance;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new WPSEO_Content_Images();
	}

	/**
	 * Test getting images from the post content.
	 * Duplicates should be filtered out.
	 *
	 * @covers WPSEO_Content_Images::get_images_from_content
	 */

	public function test_get_images_from_content() {

		$external_image1      = 'https://example.com/media/first_image.jpg';
		$external_image2      = 'https://example.com/media/second_image.jpg';

		$post_content =
			'<p>This is a post. It has several images:</p>
			<img src="' . $external_image1 . '"/>
			<img src="' . $external_image2 . '"/>
			<img src="' . $external_image2 . '"/>
			<img src=""/>
			<p> That were all the images. Done! </p>
			<p>End of post</p>';

		$images_array = $this->instance->get_images_from_content( $post_content );

		$expected = array( $external_image1, $external_image2 );

		$this->assertEquals( $expected, $images_array );
	}

	/**
	 * Test what happens when the post content isn't a string.
	 *
	 * @covers WPSEO_Content_Images::get_images_from_content
	 */

	public function test_content_is_not_a_string() {

		$post_content = 123;

		$images_array = $this->instance->get_images_from_content( $post_content );

		$expected = array();

		$this->assertEquals( $expected, $images_array );
	}
}

