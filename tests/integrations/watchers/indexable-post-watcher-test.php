<?php

namespace Yoast\WP\SEO\Tests\Integrations\Watchers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Post_Test.
 *
 * @group indexables
 * @group integrations
 * @group watchers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Watchers
 */
class Indexable_Post_Watcher_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $repository_mock;

	/**
	 * @var Mockery\MockInterface|Indexable_Builder
	 */
	private $builder_mock;

	/**
	 * @var Mockery\MockInterface|Indexable_Hierarchy_Repository
	 */
	private $hierarchy_repository_mock;

	/**
	 * @var Indexable_Post_Watcher
	 */
	private $instance;

	public function setUp() {
		$this->repository_mock           = Mockery::mock( Indexable_Repository::class );
		$this->builder_mock              = Mockery::mock( Indexable_Builder::class );
		$this->hierarchy_repository_mock = Mockery::mock( Indexable_Hierarchy_Repository::class );
		$this->instance                  = Mockery::mock(
			Indexable_Post_Watcher::class,
			[
				$this->repository_mock,
				$this->builder_mock,
				$this->hierarchy_repository_mock
			]
		)
			->makePartial()
			->shouldAllowMockingProtectedMethods();

		return parent::setUp();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Migrations_Conditional::class ],
			Indexable_Post_Watcher::get_conditionals()
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

		$this->assertNotFalse( \has_action( 'wp_insert_post', [ $this->instance, 'build_indexable' ] ) );
		$this->assertNotFalse( \has_action( 'delete_post', [ $this->instance, 'delete_indexable' ] ) );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable() {
		$id   = 1;
		$post = (object) [
			'post_author' => 0,
			'post_type'   => 'post',
			'ID'          => 0
		];

		$indexable_mock = Mockery::mock();
		$indexable_mock->id = 1;
		$indexable_mock->is_public = true;
		$indexable_mock->expects( 'delete' )->once();

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( $indexable_mock );
		$this->hierarchy_repository_mock->expects( 'clear_ancestors' )->once()->with( $id )->andReturn( true );

		Monkey\Functions\expect( 'get_post' )->once()->with( $id )->andReturn( $post );

		$this->instance
			->expects( 'update_relations' )
			->with( $post )
			->once();

		$this->instance->delete_indexable( $id );
	}

	/**
	 * Tests if the indexable is being deleted.
	 *
	 * @covers ::delete_indexable
	 */
	public function test_delete_indexable_does_not_exist() {
		$id = 1;

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( false );

		$this->instance->delete_indexable( $id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers ::build_indexable
	 * @covers ::is_post_indexable
	 */
	public function test_build_indexable() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( false );
		Monkey\Functions\expect( 'wp_is_post_autosave' )->once()->with( $id )->andReturn( false );

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( $indexable_mock );
		$this->repository_mock->expects( 'create_for_id_and_type' )->never();
		$this->builder_mock->expects( 'build_for_id_and_type' )->once()->with( $id, 'post', $indexable_mock )->andReturn( $indexable_mock );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the early return for non-indexable post.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_is_post_revision() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( true );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the early return for non-indexable post.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_is_post_autosave() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( false );
		Monkey\Functions\expect( 'wp_is_post_autosave' )->once()->with( $id )->andReturn( true );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the save meta functionality.
	 *
	 * @covers ::build_indexable
	 */
	public function test_build_indexable_does_not_exist() {
		$id = 1;

		Monkey\Functions\expect( 'wp_is_post_revision' )->once()->with( $id )->andReturn( false );
		Monkey\Functions\expect( 'wp_is_post_autosave' )->once()->with( $id )->andReturn( false );

		$indexable_mock = Mockery::mock( Indexable::class );
		$indexable_mock->expects( 'save' )->once();

		$this->repository_mock->expects( 'find_by_id_and_type' )->once()->with( $id, 'post', false )->andReturn( false );
		$this->builder_mock->expects( 'build_for_id_and_type' )->once()->with( $id, 'post', false )->andReturn( $indexable_mock );

		$this->instance->build_indexable( $id );
	}

	/**
	 * Tests the updated where the indexable isn't for a post.
	 *
	 * @covers ::updated_indexable
	 */
	public function test_updated_indexable_non_post( ) {
		$this->instance
			->expects( 'update_relations' )
			->never();

		$old_indexable     = Mockery::mock();
		$updated_indexable = Mockery::mock();
		$updated_indexable->object_type = 'term';

		$this->instance->updated_indexable( $updated_indexable, $old_indexable );
	}

	/**
	 * Tests the updated indexable method with no transition in status.
	 *
	 * @covers ::updated_indexable
	 */
	public function test_updated_indexable_not_public_and_no_transition() {
		$this->instance
			->expects( 'update_relations' )
			->never();

		$old_indexable            = Mockery::mock();
		$old_indexable->is_public = false;

		$updated_indexable              = Mockery::mock();
		$updated_indexable->object_type = 'post';
		$updated_indexable->is_public   = false;

		$this->instance->updated_indexable( $updated_indexable, $old_indexable );
	}

	/**
	 * Tests the updated indexable method with a transition in status.
	 *
	 * @covers ::updated_indexable
	 */
	public function test_updated_indexable_public_transition() {
		$this->instance
			->expects( 'update_relations' )
			->with( [] )
			->once();

		$old_indexable            = Mockery::mock();
		$old_indexable->is_public = true;

		$updated_indexable              = Mockery::mock();
		$updated_indexable->object_type = 'post';
		$updated_indexable->is_public   = false;
		$updated_indexable->object_id   = 1;

		Monkey\Functions\expect( 'get_post' )
			->once()
			->with( 1 )->andReturn( [] );

		$this->instance->updated_indexable( $updated_indexable, $old_indexable );
	}
}
