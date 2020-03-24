<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Generators\Schema
 */

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Yoast\WP\SEO\Generators\Schema\Person;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Schema\Image_Helper as Schema_Image_Helper;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Person_Test
 *
 * @group generators
 * @group schema
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\Person
 */
class Person_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Person
	 */
	protected $instance;

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	protected $context;

	/**
	 * The ID helper.
	 *
	 * @var ID_Helper|Mockery\MockInterface
	 */
	protected $id;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image;

	/**
	 * The schema image helper.
	 *
	 * @var Schema_Image_Helper|Mockery\MockInterface
	 */
	protected $schema_image;

	/**
	 * @var HTML_Helper
	 */
	protected $html;

	/**
	 * Initializes the test environment.
	 */
	public function setUp() {
		parent::setUp();

		$this->image        = Mockery::mock( Image_Helper::class );
		$this->schema_image = Mockery::mock( Schema_Image_Helper::class );
		$this->html         = Mockery::mock( HTML_Helper::class );
		$this->id           = Mockery::mock( ID_Helper::class );

		$this->instance = new Person( $this->image, $this->schema_image, $this->html );

		$this->instance->set_id_helper( $this->id );

		$this->context            = new Meta_Tags_Context();
		$this->context->indexable = new Indexable();
	}

	/**
	 * Tests whether generate returns the expected schema.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::determine_user_id
	 * @covers ::build_person_data
	 * @covers ::add_image
	 * @covers ::set_image_from_options
	 * @covers ::set_image_from_avatar
	 * @covers ::get_social_profiles
	 * @covers ::url_social_site
	 */
	public function test_generate_happy_path() {
		$this->context->site_user_id    = 1337;
		$this->context->site_url        = 'https://example.com/';
		$this->context->site_represents = 'person';

		$user_data             = (object) [
			'display_name' => 'John',
			'description'  => 'Description',
		];
		$person_logo_id        = 42;
		$person_schema_logo_id = $this->context->site_url . $this->id->person_logo_hash;
		$image_schema          = [
			'@type'      => 'ImageObject',
			'@id'        => $person_schema_logo_id,
			'inLanguage' => 'en-US',
			'url'        => 'https://example.com/image.png',
			'width'      => 64,
			'height'     => 128,
			'caption'    => 'Person image',
		];

		$expected = [
			'@type'       => [ 'Person', 'Organization' ],
			'@id'         => 'person_id',
			'name'        => 'John',
			'logo'        => [ '@id' => 'https://example.com/#personlogo' ],
			'description' => 'Description',
			'sameAs'      => [
				'https://example.com/social/facebook',
				'https://example.com/social/instagram',
				'https://example.com/social/linkedin',
				'https://example.com/social/pinterest',
				'https://twitter.com/https://example.com/social/twitter',
				'https://example.com/social/myspace',
				'https://example.com/social/youtube',
				'https://example.com/social/soundcloud',
				'https://example.com/social/tumblr',
				'https://example.com/social/wikipedia',
			],
			'image'       => $image_schema,
		];

		$this->expects_for_determine_user_id();
		$this->expects_for_get_userdata( $user_data );

		// Tests for the method `set_image_from_options`.
		$this->image->expects( 'get_attachment_id_from_settings' )
			->once()
			->with( 'person_logo' )
			->andReturn( $person_logo_id );
		$this->schema_image->expects( 'generate_from_attachment_id' )
			->once()
			->with( $person_schema_logo_id, $person_logo_id, $user_data->display_name )
			->andReturn( $image_schema );

		$this->expects_for_social_profiles();

		$this->assertEquals( $expected, $this->instance->generate( $this->context ) );
	}

	/**
	 * Tests whether generate returns false when no user id could be determined.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::determine_user_id
	 */
	public function test_generate_no_user_id() {
		$this->context->site_user_id = 1337;

		$this->expects_for_determine_user_id( 'false' );

		$this->assertFalse( $this->instance->generate( $this->context ) );
	}

	/**
	 * Tests whether generate returns false when no user id 0 was determined.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::determine_user_id
	 */
	public function test_generate_user_id_zero() {
		$this->context->site_user_id = 1337;

		$this->expects_for_determine_user_id( 'zero' );

		$this->assertFalse( $this->instance->generate( $this->context ) );
	}

	/**
	 * Tests whether generate returns the expected schema without userdata.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::determine_user_id
	 * @covers ::build_person_data
	 */
	public function test_generate_without_userdata() {
		$this->context->site_user_id = 1337;

		$expected = [
			'@type' => [ 'Person', 'Organization' ],
			'@id'   => 'person_id',
		];

		$this->expects_for_determine_user_id();
		$this->expects_for_get_userdata( false );

		$this->assertEquals( $expected, $this->instance->generate( $this->context ) );
	}

	/**
	 * Tests whether generate returns the expected schema without a user description or social profiles.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::determine_user_id
	 * @covers ::build_person_data
	 * @covers ::add_image
	 * @covers ::set_image_from_options
	 * @covers ::set_image_from_avatar
	 * @covers ::get_social_profiles
	 */
	public function test_generate_without_user_description_or_social_profiles() {
		$this->context->site_user_id    = 1337;
		$this->context->site_url        = 'https://example.com/';
		$this->context->site_represents = false;

		$user_data = (object) [
			'display_name' => 'John',
			'description'  => '',
		];

		$expected = [
			'@type' => [ 'Person', 'Organization' ],
			'@id'   => 'person_id',
			'name'  => 'John',
			'logo'  => [ '@id' => 'https://example.com/#personlogo' ],
		];

		$this->expects_for_determine_user_id();
		$this->expects_for_get_userdata( $user_data );
		$this->expects_for_social_profiles( [] );

		$this->assertEquals( $expected, $this->instance->generate( $this->context ) );
	}

	/**
	 * Tests whether the person Schema piece is shown when the site represents a person.
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_shown_when_site_represents_person() {
		$this->context->site_represents = 'person';

		$this->assertTrue( $this->instance->is_needed( $this->context ) );
	}

	/**
	 * Tests whether the person Schema piece is shown on author archive pages.
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_shown_on_author_archive_pages() {
		$this->context->indexable = (Object) [
			'object_type' => 'user',
		];

		$this->assertTrue( $this->instance->is_needed( $this->context ) );
	}

	/**
	 * Tests is not needed.
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_not_needed() {
		$this->context->site_represents        = 'organization';
		$this->context->indexable->object_type = 'post';

		$this->assertFalse( $this->instance->is_needed( $this->context ) );
	}

	/**
	 * Sets the tests for determine_user_id.
	 *
	 * @param string $scenario The scenario to set.
	 */
	protected function expects_for_determine_user_id( $scenario = 'default' ) {
		$user_id = $this->context->site_user_id;

		switch ( $scenario ) {
			case 'false':
				$user_id = false;
				break;
			case 'zero':
				$user_id = 0;
				break;
		}

		Filters\expectApplied( 'wpseo_schema_person_user_id' )
			->once()
			->with( $this->context->site_user_id )
			->andReturn( $user_id );
	}

	/**
	 * Sets the tests for get_userdata inside build_person_data.
	 *
	 * @param object|false $user_data The user data get_userdata returns. An object representing WP_User or false.
	 */
	protected function expects_for_get_userdata( $user_data ) {
		Functions\expect( 'get_userdata' )
			->once()
			->with( $this->context->site_user_id )
			->andReturn( $user_data );
		$this->id->expects( 'get_user_schema_id' )
			->once()
			->with( $this->context->site_user_id, $this->context )
			->andReturn( 'person_id' );

		// No more tests needed when there is no user data.
		if ( $user_data === false ) {
			return;
		}

		$this->html->expects( 'smart_strip_tags' )
			->once()
			->with( $user_data->display_name )
			->andReturn( $user_data->display_name );

		if ( empty( $user_data->description ) ) {
			$this->html->expects( 'smart_strip_tags' )
				->never()
				->with( $user_data->description );
			return;
		}

		$this->html->expects( 'smart_strip_tags' )
			->once()
			->with( $user_data->description )
			->andReturn( $user_data->description );
	}

	/**
	 * Sets the tests for get_social_profiles.
	 *
	 * @param string[]|null $social_profiles The social profiles after the `wpseo_schema_person_social_profiles`
	 *                                       filter. Use null to return the same as the input.
	 */
	protected function expects_for_social_profiles( $social_profiles = null ) {
		// These should be a copy of the private variable $social_profiles in Person.
		$social_profiles_input = [
			'facebook',
			'instagram',
			'linkedin',
			'pinterest',
			'twitter',
			'myspace',
			'youtube',
			'soundcloud',
			'tumblr',
			'wikipedia',
		];

		// Hacky way to have access to the private class variable as hardcoded above.
		if ( $social_profiles === null ) {
			$social_profiles = $social_profiles_input;
		}

		Filters\expectApplied( 'wpseo_schema_person_social_profiles' )
			->once()
			->with( $social_profiles_input, $this->context->site_user_id )
			->andReturn( $social_profiles );

		if ( empty( $social_profiles ) ) {
			Functions\expect( 'get_the_author_meta' )
				->never();

			return;
		}

		// Tests for the method `url_social_site`.
		foreach ( $social_profiles as $social_profile ) {
			Functions\expect( 'get_the_author_meta' )
				->once()
				->with( $social_profile, $this->context->site_user_id )
				->andReturn( 'https://example.com/social/' . $social_profile );
		}
	}
}
