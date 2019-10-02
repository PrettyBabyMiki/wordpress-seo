<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Post_Type_Presentation;

use Brain\Monkey;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Robots_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Post_Type_Presentation
 *
 * @group robots
 */
class Robots_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();

		$this->robots_helper->expects( 'get_base_values' )
			->andReturn( [
				'index'  => 'index',
				'follow' => 'follow',
			] );

		$this->robots_helper
			->expects( 'after_generate' )
			->once()
			->andReturnUsing( function( $robots ) {
				return array_filter( $robots );
			} );
	}

	/**
	 * Tests whether generate_robots calls the right functions of the robot helper.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_extra_directives() {
		$this->indexable->is_robots_nosnippet    = true;
		$this->indexable->is_robots_noarchive    = true;
		$this->indexable->is_robots_noimageindex = true;
		$this->indexable->object_id              = 1337;

		Monkey\Functions\expect( 'get_post_status' )
			->once()
			->with( 1337 )
			->andReturn( 'published' );

		$this->post_type_helper->expects( 'is_indexable' )
			->once()
			->with( 1337 )
			->andReturn( true );

		$actual = $this->instance->generate_robots();
		$expected = [
			'index'        => 'index',
			'follow'       => 'follow',
			'nosnippet'    => 'nosnippet',
			'noarchive'    => 'noarchive',
			'noimageindex' => 'noimageindex',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether index is set to noindex when a post's status is private.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_private_post() {
		$this->indexable->object_id = 1337;

		Monkey\Functions\expect( 'get_post_status' )
			->once()
			->with( 1337 )
			->andReturn( 'private' );

		$this->post_type_helper->expects( 'is_indexable' )
			->once()
			->with( 1337 )
			->andReturn( true );

		$actual = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether index is set to noindex when a post type is set to not be indexed.
	 *
	 * @covers ::generate_robots
	 */
	public function test_generate_robots_post_type_not_indexable() {
		$this->indexable->object_id = 1337;

		Monkey\Functions\expect( 'get_post_status' )
			->once()
			->with( 1337 )
			->andReturn( 'published' );

		$this->post_type_helper->expects( 'is_indexable' )
			->once()
			->with( 1337 )
			->andReturn( false );

		$actual = $this->instance->generate_robots();
		$expected = [
			'index'  => 'noindex',
			'follow' => 'follow',
		];

		$this->assertEquals( $expected, $actual );
	}
}
