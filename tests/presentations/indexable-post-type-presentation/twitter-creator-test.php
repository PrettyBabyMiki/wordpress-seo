<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\SEO\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Twitter_Creator_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group twitter
 * @group twitter-creator
 */
class Twitter_Creator_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		$this->set_instance();

		$this->context->post = (object) [ 'post_author' => 1337 ];

		parent::setUp();
	}

	/**
	 * Tests that the author's twitter handle is correctly output.
	 *
	 * @covers ::generate_twitter_creator
	 */
	public function test_author_meta_twitter() {
		Monkey\Functions\expect( 'get_the_author_meta' )
			->once()
			->with( 'twitter', 1337 )
			->andReturn( '@TwitterHandle' );

		Monkey\Filters\expectApplied( 'wpseo_twitter_creator_account' )
			->with( 'TwitterHandle' )
			->once();

		$this->options_helper
			->expects( 'get' )
			->never();

		$expected = '@TwitterHandle';
		$actual   = $this->instance->generate_twitter_creator();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that the twitter handle falls back to the site twitter option, when no author twitter
	 * handle is available.
	 *
	 * @covers ::generate_twitter_creator
	 */
	public function test_fallback_to_twitter_site() {
		Monkey\Functions\expect( 'get_the_author_meta' )
			->once()
			->with( 'twitter', 1337 )
			->andReturn( '' );

		Monkey\Filters\expectApplied( 'wpseo_twitter_creator_account' )
			->with( '' )
			->once();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'twitter_site', '' )
			->andReturn( 'SiteTwitterHandle' );

		$expected = '@SiteTwitterHandle';
		$actual   = $this->instance->generate_twitter_creator();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that the twitter handle is empty when no author or site twitter handle are available.
	 *
	 * @covers ::generate_twitter_creator
	 */
	public function test_empty_no_author_twitter_no_site_twitter() {
		Monkey\Functions\expect( 'get_the_author_meta' )
			->once()
			->with( 'twitter', 1337 )
			->andReturn( '' );

		Monkey\Filters\expectApplied( 'wpseo_twitter_creator_account' )
			->with( '' )
			->once();

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'twitter_site', '' )
			->andReturn( '' );

		$expected = '';
		$actual   = $this->instance->generate_twitter_creator();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests that the `wpseo_twitter_creator_account` is properly applied.
	 *
	 * @covers ::generate_twitter_creator
	 */
	public function test_filter() {
		Monkey\Functions\expect( 'get_the_author_meta' )
			->once()
			->with( 'twitter', 1337 )
			->andReturn( '@TwitterHandle' );

		Monkey\Filters\expectApplied( 'wpseo_twitter_creator_account' )
			->with( 'TwitterHandle' )
			->once()
			->andReturn( 'yoast' );

		$this->options_helper
			->expects( 'get' )
			->never();

		$expected = '@yoast';
		$actual   = $this->instance->generate_twitter_creator();

		$this->assertEquals( $expected, $actual );
	}
}
