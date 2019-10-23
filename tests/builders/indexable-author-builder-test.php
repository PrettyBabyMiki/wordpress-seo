<?php

namespace Yoast\WP\Free\Tests\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Builders\Indexable_Author_Builder;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\ORM\ORMWrapper;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\Free\Builders\Indexable_Author_Builder
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Builders
 */
class Indexable_Author_Builder_Test extends TestCase {

	/**
	 * @covers ::build
	 */
	public function test_build() {
		Monkey\Functions\expect( 'get_author_posts_url' )->once()->with( 1 )->andReturn( 'https://permalink' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_title', 1 )->andReturn( 'title' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_metadesc', 1 )->andReturn( 'description' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_noindex_author', 1 )->andReturn( 'on' );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORMWrapper::class );
		$indexable_mock->orm->expects( 'set' )->with( 'object_id', 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'object_type', 'user' );
		$indexable_mock->orm->expects( 'set' )->with( 'permalink', 'https://permalink' );
		$indexable_mock->orm->expects( 'set' )->with( 'canonical', 'https://permalink' );
		$indexable_mock->orm->expects( 'set' )->with( 'title', 'title' );
		$indexable_mock->orm->expects( 'set' )->with( 'description', 'description' );
		$indexable_mock->orm->expects( 'set' )->with( 'is_cornerstone', false );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', true );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nofollow', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noarchive', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noimageindex', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nosnippet', null );

		$indexable_mock->orm->expects( 'get' )->once()->with( 'permalink' )->andReturn( 'https://permalink' );

		// Resetting the image.
		$indexable_mock->orm->expects( 'set' )->with( 'og_image', null );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image_id', null );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image_source', null );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image_meta', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image_id', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', null );

		$indexable_mock->orm->expects( 'get' )->once()->with( 'og_image' );
		$indexable_mock->orm->expects( 'get' )->times( 2 )->with( 'og_image_id' );
		$indexable_mock->orm->expects( 'get' )->twice()->with( 'og_image_source' );
		$indexable_mock->orm->expects( 'get' )->twice()->with( 'twitter_image' );
		$indexable_mock->orm->expects( 'get' )->times( 3 )->with( 'twitter_image_id' );
		$indexable_mock->orm->expects( 'get' )->with( 'object_id' );

		$indexable_mock->orm->expects( 'set' )->with( 'og_image', 'avatar_image.jpg' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image_source', 'gravatar-image' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', 'avatar_image.jpg' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', 'gravatar-image' );

		Monkey\Functions\expect( 'get_avatar_url' )
			->once()
			->andReturn( 'avatar_image.jpg' );

		$builder = new Indexable_Author_Builder();
		$builder->build( 1, $indexable_mock );
	}

	/**
	 * @covers ::build
	 */
	public function test_build_with_undefined() {
		Monkey\Functions\expect( 'get_author_posts_url' )->once()->with( 1 )->andReturn( 'https://permalink' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_title', 1 )->andReturn( '' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_metadesc', 1 )->andReturn( '' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_noindex_author', 1 )->andReturn( '' );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORMWrapper::class );
		$indexable_mock->orm->expects( 'set' )->with( 'object_id', 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'object_type', 'user' );
		$indexable_mock->orm->expects( 'set' )->with( 'permalink', 'https://permalink' );
		$indexable_mock->orm->expects( 'set' )->with( 'canonical', 'https://permalink' );
		$indexable_mock->orm->expects( 'set' )->with( 'title', null );
		$indexable_mock->orm->expects( 'set' )->with( 'description', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_cornerstone', false );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', false );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nofollow', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noarchive', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noimageindex', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nosnippet', null );

		$indexable_mock->orm->expects( 'get' )->once()->with( 'permalink' )->andReturn( 'https://permalink' );

		// Resetting the image.
		$indexable_mock->orm->expects( 'set' )->with( 'og_image', null );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image_id', null );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image_source', null );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image_meta', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image_id', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', null );

		$indexable_mock->orm->expects( 'get' )->once()->with( 'og_image' );
		$indexable_mock->orm->expects( 'get' )->times( 2 )->with( 'og_image_id' );
		$indexable_mock->orm->expects( 'get' )->twice()->with( 'og_image_source' );
		$indexable_mock->orm->expects( 'get' )->twice()->with( 'twitter_image' );
		$indexable_mock->orm->expects( 'get' )->times( 3 )->with( 'twitter_image_id' );
		$indexable_mock->orm->expects( 'get' )->with( 'object_id' );

		$indexable_mock->orm->expects( 'set' )->with( 'og_image', 'avatar_image.jpg' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image_source', 'gravatar-image' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', 'avatar_image.jpg' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', 'gravatar-image' );

		Monkey\Functions\expect( 'get_avatar_url' )
			->once()
			->andReturn( 'avatar_image.jpg' );

		$builder = new Indexable_Author_Builder();
		$builder->build( 1, $indexable_mock );
	}
}
