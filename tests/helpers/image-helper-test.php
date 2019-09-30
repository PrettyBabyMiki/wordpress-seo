<?php

namespace Yoast\WP\Free\Tests\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Image_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Helpers\Image_Helper
 *
 * @group helpers
 *
 */
class Image_Helper_Test extends TestCase {

	/**
	 * @var Image_Helper|Mockery\Mock
	 */
	protected $instance;

	/**
	 * Setup.
	 */
	public function setUp() {
		$this->instance = Mockery::mock(  Image_Helper::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		parent::setUp();
	}

	/**
	 * Tests generating the Twitter image url by retrieving an attachment image.
	 *
	 * @covers ::get_attachment_image
	 */
	public function test_generate_retrieve_attachment() {
		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->with( 100 )
			->andReturn( 'attachment' );

		Monkey\Functions\expect( 'get_post_mime_type' )
			->once()
			->with( 100 )
			->andReturn( 'image/jpeg' );

		Monkey\Functions\expect( 'wp_get_attachment_url' )
			->once()
			->with( 100 )
			->andReturn( 'attachment.jpg' );

		$this->assertEquals( 'attachment.jpg', $this->instance->get_attachment_image( 100 ) );
	}

	/**
	 * Tests getting the attachment image for a non attachment.
	 *
	 * @covers ::get_attachment_image
	 */
	public function test_retrieve_attachment_post_type_mismatch() {
		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->with( 100 )
			->andReturn( 'post' );

		$this->assertEquals( '', $this->instance->get_attachment_image( 100 ) );
	}

	/**
	 * Tests getting the attachment image for an attachment with a wrong mimetype.
	 *
	 * @covers ::get_attachment_image
	 */
	public function test_retrieve_attachment_bad_mimetype() {
		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->with( 100 )
			->andReturn( 'attachment' );

		Monkey\Functions\expect( 'get_post_mime_type' )
			->once()
			->with( 100 )
			->andReturn( 'application/pdf' );

		$this->assertEquals( '', $this->instance->get_attachment_image( 100 ) );
	}

	/**
	 * Tests getting the featured image for a post without an image attached.
	 *
	 * @covers ::get_featured_image
	 */
	public function test_get_featured_image_no_post_thumbnail() {
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->with( 100 )
			->once()
			->andReturn( false );

		$this->assertEmpty( $this->instance->get_featured_image( 100 ) );
	}

	/**
	 * Tests getting the featured image for a post with an image attached.
	 *
	 * @covers ::get_featured_image
	 */
	public function test_get_featured_image_post_has_thumbnail_and_image_attached() {
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->with( 100 )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'get_post_thumbnail_id' )
			->with( 100 )
			->once()
			->andReturn( 11 );

		Monkey\Functions\expect( 'wp_get_attachment_image_src' )
			->with( 11, 'full' )
			->once()
			->andReturn(
				[
					'https://example.com/media/image.jpg',
					'100px',
					'200px',
					false,
				]
			);

		$this->assertEquals(
			'https://example.com/media/image.jpg',
			$this->instance->get_featured_image( 100 )
		);
	}

	/**
	 * Tests getting the featured image for a post with a thumbnail but no full image attached.
	 *
	 * @covers ::get_featured_image
	 */
	public function test_get_featured_image_post_has_thumbnail() {
		Monkey\Functions\expect( 'has_post_thumbnail' )
			->with( 100 )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'get_post_thumbnail_id' )
			->with( 100 )
			->once()
			->andReturn( 11 );

		Monkey\Functions\expect( 'wp_get_attachment_image_src' )
			->with( 11, 'full' )
			->once()
			->andReturn( false );

		$this->assertEmpty( $this->instance->get_featured_image( 100 ) );
	}

	/**
	 * Tests retrieving the first image url of a gallery when there is no gallery.
	 *
	 * @covers ::get_gallery_image
	 */
	public function test_get_gallery_image_when_gallery_is_absent() {
		Monkey\Functions\expect( 'get_post' )
			->with( 100 )
			->once()
			->andReturn( (object) [ 'post_content' => '' ]  );

		Monkey\Functions\expect( 'has_shortcode' )
			->with( '', 'gallery' )
			->once()
			->andReturn( false );

		Monkey\Functions\expect( 'get_post_gallery_images' )
			->never();

		$this->assertEmpty( $this->instance->get_gallery_image( 100 ) );
	}

	/**
	 * Tests retrieving the first image url of a gallery when there is an empty gallery.
	 *
	 * @covers ::get_gallery_image
	 */
	public function test_get_gallery_image_when_gallery_is_empty() {
		Monkey\Functions\expect( 'get_post' )
			->with( 100 )
			->once()
			->andReturn( (object) [ 'post_content' => '' ] );

		Monkey\Functions\expect( 'has_shortcode' )
			->with( '', 'gallery' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'get_post_gallery_images' )
			->once()
			->andReturn( [] );

		$this->assertEmpty( $this->instance->get_gallery_image( 100 ) );
	}

	/**
	 * Tests retrieving the first image url of a gallery when there is a gallery.
	 *
	 * @covers ::get_gallery_image
	 */
	public function test_get_gallery_image_when_gallery_is_present() {
		Monkey\Functions\expect( 'get_post' )
			->with( 100 )
			->once()
			->andReturn( (object) [ 'post_content' => '' ]  );

		Monkey\Functions\expect( 'has_shortcode' )
			->with( '', 'gallery' )
			->once()
			->andReturn( true );

		Monkey\Functions\expect( 'get_post_gallery_images' )
			->once()
			->andReturn(
				[
					'https://example.com/media/image.jpg',
					'https://example.com/media/image2.jpg'
				]
			);

		$this->assertEquals( 'https://example.com/media/image.jpg', $this->instance->get_gallery_image( 100 ) );
	}

	/**
	 * Tests getting the first image from the post content.
	 *
	 * @covers ::get_post_content_image
	 */
	public function test_get_post_content_image() {
		$expected = 'https://example.com/media/content_image.jpg';

		$this->instance
			->expects( 'get_first_usable_content_image_for_post' )
			->with( 100 )
			->once()
			->andReturn( 'https://example.com/media/content_image.jpg' );

		$this->assertEquals(
			'https://example.com/media/content_image.jpg',
			$this->instance->get_post_content_image( 100 )
		);
	}

	/**
	 * Tests whether an empty string is returned when the content contains no image.
	 *
	 * @covers ::get_post_content_image
	 */
	public function test_get_post_content_image_no_image_in_content() {
		$this->instance
			->expects( 'get_first_usable_content_image_for_post' )
			->with( 100 )
			->once()
			->andReturn( null );

		$this->assertEmpty( $this->instance->get_post_content_image( 100 ) );
	}


}
