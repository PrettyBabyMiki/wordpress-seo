<?php
/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\Free\Tests\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Free\Integrations\Front_End\Indexing_Controls;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\Free\Integrations\Front_End\Indexing_Controls
 * @covers ::<!public>
 *
 * @group integrations
 * @group front-end
 */
class Indexing_Controls_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Indexing_Controls|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = Mockery::mock( Indexing_Controls::class )->makePartial()->shouldAllowMockingProtectedMethods();
	}
	/**
	 * Tests the situation where the request is performed by a robot.
	 *
	 * @covers ::noindex_robots
	 */
	public function test_no_index_robots() {
		Monkey\Functions\expect( 'is_robots' )
			->once()
			->andReturn( true );

		$this->instance
			->shouldReceive( 'set_robots_header' )
			->once()
			->andReturnTrue();

		$this->assertTrue( $this->instance->noindex_robots() );
	}

	/**
	 * Tests the situation where the request isn't performed by a robot.
	 *
	 * @covers ::noindex_robots
	 */
	public function test_no_index_and_is_no_robots() {
		Monkey\Functions\expect( 'is_robots' )->once()->andReturn( false );

		$this->instance->shouldNotReceive( 'set_robots_header' );

		$this->assertFalse( $this->instance->noindex_robots() );
	}

	/**
	 * Tests if the link is converted to a no follow one.
	 *
	 * @covers ::nofollow_link
	 */
	public function test_nofollow_link() {
		$this->assertEquals(
			'<a rel="nofollow" href="#">A link</a>',
			$this->instance->nofollow_link( '<a href="#">A link</a>' )
		);
	}

}
