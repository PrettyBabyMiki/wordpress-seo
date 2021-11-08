<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Yoast\WP\SEO\Actions\Importing\Deactivate_Conflicting_Plugins_Action;
use Yoast\WP\SEO\Services\Importing\Conflicting_Plugins_Service;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Aioseo_Posts_Importing_Action_Test class
 *
 * @group actions
 * @group importing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Deactivate_Conflicting_Plugins_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Deactivate_Conflicting_Plugins_Action_Test extends TestCase {
	/**
	 * The class under test.
	 * @var Deactivate_Conflicting_Plugins_Action
	 */
	protected $deactivate_conflicting_plugins_action;

	/**
	 * The service responsible for detecting conflicting plugins
	 *
	 * @var Mockery\MockInterface|Conflicting_Plugins_Service
	 */
	protected $conflicting_plugins_service;

	public function set_up()
	{
		$this->conflicting_plugins_service = Mockery::mock( Conflicting_Plugins_Service::class );

		$this->deactivate_conflicting_plugins_action = new Deactivate_Conflicting_Plugins_Action(
			$this->conflicting_plugins_service
		);
	}

	/**
	 * Tests wether the tested class can import all data it should be able to handle
	 *
	 * @dataProvider can_import_testdata
	 *
	 * @covers ::can_import
	 * @covers ::__construct
	 */
	public function test_can_import( $plugin, $type ) {
		// Arrange.

		// Act.
		$result = $this->deactivate_conflicting_plugins_action->can_import( $plugin, $type );

		// Assert.
		$this->assertTrue( $result );
	}

	/**
	 * Testdata for test_can_import.
	 *
	 * @return array
	 */
	public function can_import_testdata() {
		return [
			[
				null,
				null,
			],

			[
				null,
				'type'
			],

			[
				'plugin',
				null
			],

			[
				'plugin',
				'type'
			],

			[
				1,
				-1
			]
		];
	}

	/**
	 * Test the query, and that the query result is cached
	 *
	 * @covers ::query
	 */
	public function test_query_is_cached() {
		// Arrange.
		$data = [ 'a', 'b', 'c', 'd' ];
		$this->conflicting_plugins_service
			->expects( 'detect_conflicting_plugins' )
			->once()
			->andReturn( $data );

		// Act.
		$result  = $this->deactivate_conflicting_plugins_action->query();
		$result2 = $this->deactivate_conflicting_plugins_action->query();

		// Assert.
		$this->assertEquals( $data, $result );
		$this->assertEquals( $data, $result2 );
	}

	/**
	 * Test the get_total_unindexed method
	 *
	 * @covers ::query
	 * @covers ::get_total_unindexed
	 */
	public function test_get_total_unindexed() {
		// Arrange.
		$data = [ 'a', 'b', 'c', 'd' ];
		$this->conflicting_plugins_service
			->expects( 'detect_conflicting_plugins' )
			->once()
			->andReturn( $data );

		// Act.
		$result = $this->deactivate_conflicting_plugins_action->get_total_unindexed();

		// Assert.
		$this->assertEquals( 4, $result );
	}

	/**
	 * Test the index method
	 *
	 * @covers ::query
	 * @covers ::index
	 */
	public function test_index() {
		// Arrange.
		$data = [ 'a', 'b', 'c', 'd' ];
		$this->conflicting_plugins_service
			->expects( 'detect_conflicting_plugins' )
			->once()
			->andReturn( $data );
		$this->conflicting_plugins_service
			->expects( 'deactivate_conflicting_plugins' )
			->with ( $data )
			->once()
			->andReturn( [] );

		// Act.
		$result = $this->deactivate_conflicting_plugins_action->index();

		// Assert.
		$this->assertEquals( [], $result );
	}

	/**
	 * Tests the get_limit method.
	 *
	 * @covers ::get_limit
	 */
	public function test_get_limit() {
		// Act.
		$result = $this->deactivate_conflicting_plugins_action->get_limit();

		// Assert.
		$this->assertEquals( 1, $result );
	}

	/**
	 * Tests the get_limit method.
	 *
	 * @dataProvider get_limited_data
	 *
	 * @param int $limit    The requested maximum.
	 * @param int $expected The expected result.
	 *
	 * @covers ::get_limited_unindexed_count
	 * @covers ::query
	 */
	public function test_get_limited_unindexed_count( $limit, $expected ) {
		// Arrange.
		$data = [ 'a', 'b', 'c', 'd' ];
		$this->conflicting_plugins_service
			->expects( 'detect_conflicting_plugins' )
			->once()
			->andReturn( $data );

		// Act.
		$result = $this->deactivate_conflicting_plugins_action->get_limited_unindexed_count( $limit );

		// Assert.
		$this->assertEquals( $expected, $result );
	}

	/**
	 * Provides the testcases for test_get_limited_unindexed_count
	 *
	 * @return array
	 */
	public function get_limited_data() {
		return [
			[ 5, 4 ],
			[ 4, 4 ],
			[ 3, 3 ],
			[ -1, -1 ]
		];
	}
}
