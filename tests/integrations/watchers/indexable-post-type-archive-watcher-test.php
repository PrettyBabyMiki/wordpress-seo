<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Watchers
 */

namespace Yoast\WP\SEO\Tests\Integrations\Watchers;

use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Type_Archive_Watcher;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Post_Type_Archive_Watcher_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Type_Archive_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Type_Archive_Watcher_Test extends TestCase {

	/**
	 * Represents the indexable repository.
	 *
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository;

	/**
	 * Represents the indexable builder.
	 *
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $builder;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Post_Type_Archive_Watcher
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->repository = Mockery::mock( Indexable_Repository::class );
		$this->builder    = Mockery::mock( Indexable_Builder::class );
		$this->instance   = new Indexable_Post_Type_Archive_Watcher( $this->repository, $this->builder );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Indexable_Post_Type_Archive_Watcher::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::__construct
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertNotFalse( \has_action( 'update_option_wpseo_titles', [ $this->instance, 'check_option' ] ) );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository
			->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'my-post-type', false )
			->andReturn( $indexable_mock );

		$this->builder
			->expects( 'build_for_post_type_archive' )
			->once()
			->with( 'my-post-type', $indexable_mock )
			->andReturn( $indexable_mock );

		$this->instance->check_option( [ 'title-ptarchive-my-post-type' => 'bar' ], [ 'title-ptarchive-my-post-type' => 'baz' ] );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value_new() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository
			->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'my-post-type', false )
			->andReturn( $indexable_mock );

		$this->builder
			->expects( 'build_for_post_type_archive' )
			->once()
			->with( 'my-post-type', $indexable_mock )
			->andReturn( $indexable_mock );

		$this->instance->check_option( [], [ 'title-ptarchive-my-post-type' => 'baz' ] );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value_switched() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$other_indexable_mock = Mockery::mock( Indexable::class );
		$other_indexable_mock->expects( 'save' )->once();

		$this->repository
			->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'my-post-type', false )
			->andReturn( $indexable_mock );

		$this->repository
			->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'other-post-type', false )
			->andReturn( $other_indexable_mock );

		$this->builder
			->expects( 'build_for_post_type_archive' )
			->once()
			->with( 'my-post-type', $indexable_mock )
			->andReturn( $indexable_mock );

		$this->builder
			->expects( 'build_for_post_type_archive' )
			->once()
			->with( 'other-post-type', $other_indexable_mock )
			->andReturn( $other_indexable_mock );

		$this->instance->check_option( [ 'title-ptarchive-my-post-type' => 'baz' ], [ 'title-ptarchive-other-post-type' => 'baz' ] );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value_same_value() {
		// No assertions made so this will fail if any method is called on our mocks.
		$this->instance->check_option( [ 'title-ptarchive-my-post-type' => 'bar' ], [ 'title-ptarchive-my-post-type' => 'bar' ] );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::check_option
	 * @covers ::build_indexable
	 */
	public function test_update_wpseo_titles_value_without_change() {
		// No assertions made so this will fail if any method is called on our mocks.
		$this->instance->check_option( [ 'other_key' => 'bar' ], [ 'other_key' => 'baz' ] );
	}

	/**
	 * Tests if updating titles works as expected.
	 *
	 * @covers ::__construct
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_without_indexable() {
		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository
			->expects( 'find_for_post_type_archive' )
			->once()
			->with( 'my-post-type', false )
			->andReturn( false );

		$this->builder
			->expects( 'build_for_post_type_archive' )
			->once()
			->with( 'my-post-type', false )
			->andReturn( $indexable_mock );

		$this->instance->build_indexable( 'my-post-type' );
	}
}
