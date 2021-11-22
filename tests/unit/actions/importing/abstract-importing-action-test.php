<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Importing;

use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Indexable_To_Postmeta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Wpdb_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing\Abstract_Importing_Action_Double;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract_Importing_Action_Test class
 *
 * @group actions
 * @group indexing
 *
 * @coversDefaultClass \Yoast\WP\SEO\Actions\Importing\Abstract_Importing_Action
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
class Abstract_Importing_Action_Test extends TestCase {

	/**
	 * Represents the mock instance to test.
	 *
	 * @var Abstract_Importing_Action_Double
	 */
	protected $mock_instance;

	/**
	 * The mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options       = Mockery::mock( Options_Helper::class );
		$this->mock_instance = Mockery::mock(
			Abstract_Importing_Action_Double::class,
			[ $this->options ]
		)->makePartial()->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests the getting of the stored state of completedness.
	 *
	 * @covers ::get_completed
	 */
	public function test_get_completed() {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'aioseo_posts' );

		$expected_option = [
			'aioseo_posts' => true,
		];

		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( $expected_option );

		$completed = $this->mock_instance->get_completed();
		$this->assertEquals( true, $completed );
	}

	/**
	 * Tests the getting of the stored state of completedness when not completed.
	 *
	 * @covers ::get_completed
	 */
	public function test_get_not_completed() {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'aioseo_posts' );

		$expected_option = [
			'aioseo_posts' => false,
		];

		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( $expected_option );

		$completed = $this->mock_instance->get_completed();
		$this->assertEquals( false, $completed );
	}

	/**
	 * Tests the setting of the stored state of completedness.
	 *
	 * @covers ::get_completed
	 */
	public function test_set_completed() {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'aioseo_posts' );

		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( [] );

		$expected_arg = [
			'aioseo_posts' => false,
		];
		$this->options->expects( 'set' )
			->once()
			->with( 'importing_completed', $expected_arg );

		$completed = $this->mock_instance->set_completed( false );
	}

	/**
	 * Tests the setting of the stored state of completedness when not completed.
	 *
	 * @covers ::get_completed
	 */
	public function test_set_not_completed() {
		$this->mock_instance->expects( 'get_cursor_id' )
			->once()
			->andReturn( 'aioseo_posts' );

		$this->options->expects( 'get' )
			->once()
			->with( 'importing_completed', [] )
			->andReturn( [] );

		$expected_arg = [
			'aioseo_posts' => true,
		];
		$this->options->expects( 'set' )
			->once()
			->with( 'importing_completed', $expected_arg );

		$completed = $this->mock_instance->set_completed( true );
	}
}
