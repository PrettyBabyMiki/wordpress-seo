<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Author_Archive_Presentation;

use Mockery;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Robots_Test.
 *
 * @group presentations
 * @group robots
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Author_Archive_Presentation
 */
class Robots_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();

		$this->robots_helper
			->expects( 'get_base_values' )
			->once()
			->andReturn( [
				'index'  => 'index',
				'follow' => 'follow',
			] );
	}

	/**
	 * Tests the global don't index author archives option.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_global_dont_index_author_archives() {
		$this->mock_global_author_option( true );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests don't index without a current author (safety check).
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_global_dont_index_without_current_author() {
		$this->mock_global_author_option();
		$this->setup_wp_query_wrapper();

		// Should never get that far in the code.
		$this->options_helper
			->expects( 'get' )
			->with( 'noindex-author-noposts-wpseo', false )
			->never();

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the global don't index without posts.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_global_dont_index_without_posts() {
		$this->mock_global_author_option();
		$this->setup_wp_query_wrapper( (object) [ 'ID' => 1 ] );
		$this->mock_get_public_post_types();
		$this->mock_global_author_posts_count_option( true );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the global don't index without posts, but with posts.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_global_dont_index_without_posts_with_posts() {
		$this->mock_global_author_option();
		$this->setup_wp_query_wrapper( (object) [ 'ID' => 1 ] );
		$this->mock_get_public_post_types();
		$this->mock_global_author_posts_count_option( true, 16 );
		$this->mock_author_no_index_option();

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'index',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the user's don't index option.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_user_dont_index() {
		$this->mock_global_author_option();
		$this->setup_wp_query_wrapper( (object) [ 'ID' => 1 ] );
		$this->mock_get_public_post_types();
		$this->mock_global_author_posts_count_option();
		$this->mock_author_no_index_option( 'on' );

		$actual   = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Mocks option helper's get with `noindex-author-wpseo`.
	 *
	 * @param mixed $return_value Optional. What `get` should return.
	 */
	private function mock_global_author_option( $return_value = false ) {
		$this->options_helper
			->expects( 'get' )
			->with( 'noindex-author-wpseo', false )
			->once()
			->andReturn( $return_value );
	}

	/**
	 * Mocks Post_Type_Helper's `get_public_post_types`.
	 */
	private function mock_get_public_post_types() {
		$this->post_type_helper
			->expects( 'get_public_post_types' )
			->withAnyArgs()
			->once()
			->andReturn( [ 'post' ] );
	}

	/**
	 * Mocks user helper's `get_meta` with `wpseo_noindex_author`.
	 *
	 * @param mixed $return_value Optional. What `get` should return.
	 */
	private function mock_author_no_index_option( $return_value = 'off' ) {
		$this->user_helper
			->expects( 'get_meta' )
			->with( 1, 'wpseo_noindex_author', true )
			->once()
			->andReturn( $return_value );
	}

	/**
	 * Mocks the helpers needed for the global author posts count.
	 *
	 * @param mixed $options_get_return_value      Optional. What `get` should return.
	 * @param mixed $user_count_posts_return_value Optional. What `count_posts` should return.
	 */
	private function mock_global_author_posts_count_option( $options_get_return_value = false, $user_count_posts_return_value = 0 ) {
		$this->options_helper
			->expects( 'get' )
			->with( 'noindex-author-noposts-wpseo', false )
			->once()
			->andReturn( $options_get_return_value );

		$this->user_helper
			->expects( 'count_posts' )
			->with( 1, [ 'post' ] )
			->times( ( $options_get_return_value ) ? 1 : 0 )
			->andReturn( $user_count_posts_return_value );
	}

	/**
	 * Mocks WP_Query_Wrapper's `get_query`.
	 *
	 * @param mixed $return_value Optional. What `get_queried_object` should return.
	 */
	private function setup_wp_query_wrapper( $return_value = false ) {
		$wp_query = Mockery::mock( '\WP_Query' );
		$wp_query
			->expects( 'get_queried_object' )
			->once()
			->andReturn( $return_value );
		$this->wp_query_wrapper
			->expects( 'get_query' )
			->once()
			->andReturn( $wp_query );
	}
}
