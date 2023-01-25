<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class User_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\User_Helper
 */
class User_Helper_Test extends TestCase {

	/**
	 * Represents the instance to test.
	 *
	 * @var User_Helper
	 */
	private $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new User_Helper();
	}

	/**
	 * Tests that get_meta calls the global get_user_meta.
	 *
	 * And returns the return value of it.
	 *
	 * @covers ::get_meta
	 */
	public function test_get_meta() {
		Functions\expect( 'get_user_meta' )
			->with( 1, 'key', true )
			->once()
			->andReturn( 'value' );

		$this->assertSame( 'value', $this->instance->get_meta( 1, 'key', true ) );
	}

	/**
	 * Tests that `count_posts` converts a string to an integer.
	 *
	 * @covers ::count_posts
	 */
	public function test_count_user_posts() {
		Functions\expect( 'count_user_posts' )
			->with( 1, 'post', true )
			->once()
			->andReturn( '0' );

		$actual = $this->instance->count_posts( 1, 'post' );

		$this->assertSame( 0, $actual );
	}

	/**
	 * Tests that get_the_author_meta calls the global get_the_author_meta.
	 *
	 * And returns the return value of it.
	 *
	 * @covers ::get_the_author_meta
	 */
	public function test_get_the_author_meta() {
		Functions\expect( 'get_the_author_meta' )
			->with( 'field', 1 )
			->once()
			->andReturn( 'author meta' );

		$this->assertSame( 'author meta', $this->instance->get_the_author_meta( 'field', 1 ) );
	}

	/**
	 * Tests that get_current_user_id calls the global get_current_user_id.
	 *
	 * And returns the return value of it.
	 *
	 * @covers ::get_current_user_id
	 */
	public function test_get_current_user_id() {
		Functions\expect( 'get_current_user_id' )
			->once()
			->andReturn( 1 );

		$this->assertSame( 1, $this->instance->get_current_user_id() );
	}

	/**
	 * Tests that update_meta calls the global update_user_meta.
	 *
	 * And returns the return value of it.
	 *
	 * @covers ::update_meta
	 */
	public function test_update_meta() {
		Functions\expect( 'update_user_meta' )
			->with( 1, 'key', 'value', 'previous' )
			->once()
			->andReturn( true );

		$this->assertTrue( $this->instance->update_meta( 1, 'key', 'value', 'previous' ) );
	}

	/**
	 * Tests that delete_meta calls the global delete_user_meta.
	 *
	 * And returns the return value of it.
	 *
	 * @covers ::delete_meta
	 */
	public function test_delete_meta() {
		Functions\expect( 'delete_user_meta' )
			->with( 1, 'key', 'value' )
			->once()
			->andReturn( true );

		$this->assertTrue( $this->instance->delete_meta( 1, 'key', 'value' ) );
	}
}
