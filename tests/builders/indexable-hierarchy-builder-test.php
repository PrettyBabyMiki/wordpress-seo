<?php

namespace Yoast\WP\SEO\Tests\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\Mocks\Primary_Term;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Hierarchy_Builder
 * @covers ::<!public>
 * @covers ::__construct
 * @covers ::set_indexable_repository
 *
 * @package Yoast\Tests\Builders
 */
class Indexable_Hierarchy_Builder_Test extends TestCase {

	/**
	 * @var Mockery\MockInterface|Indexable_Hierarchy_Repository
	 */
	private $indexable_hierarchy_repository;

	/**
	 * @var Mockery\MockInterface|Primary_Term_Repository
	 */
	private $primary_term_repository;

	/**
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * @var Mockery\MockInterface|Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * @var Indexable_Hierarchy_Builder
	 */
	private $instance;

	public function setUp() {
		$this->indexable_hierarchy_repository = Mockery::mock( Indexable_Hierarchy_Repository::class );
		$this->primary_term_repository        = Mockery::mock( Primary_Term_Repository::class );
		$this->options_helper                 = Mockery::mock( Options_Helper::class );
		$this->indexable_repository           = Mockery::mock( Indexable_Repository::class );

		$this->instance = new Indexable_Hierarchy_Builder(
			$this->indexable_hierarchy_repository,
			$this->primary_term_repository,
			$this->options_helper
		);
		$this->instance->set_indexable_repository( $this->indexable_repository );

		return parent::setUp();
	}

	/**
	 * Tests building the hierarchy of a post with no parents.
	 *
	 * @covers ::build
	 */
	public function test_no_parents() {
		$indexable = new Indexable();
		$indexable->id          = 1;
		$indexable->object_type = 'post';
		$indexable->object_id   = 1;

		Monkey\Functions\expect( 'get_post' )->with( 1 )->andReturn( (object) [ 'post_parent' => 0, 'post_type' => 'post' ] );

		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturn( true );
		$this->options_helper->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( '0' );

		$this->instance->build( $indexable );
	}

	/**
	 * Tests building the hierarchy of a post with post parents.
	 *
	 * @covers ::build
	 */
	public function test_post_parents() {
		$indexable = new Indexable();
		$indexable->id          = 1;
		$indexable->object_type = 'post';
		$indexable->object_id   = 1;

		$parent_indexable = new Indexable();
		$parent_indexable->id          = 2;
		$parent_indexable->object_type = 'post';
		$parent_indexable->object_id   = 2;

		Monkey\Functions\expect( 'get_post' )->once()->with( 1 )->andReturn( (object) [ 'post_parent' => 2, 'post_type' => 'post' ] );
		Monkey\Functions\expect( 'get_post' )->once()->with( 2 )->andReturn( (object) [ 'post_parent' => 0, 'post_type' => 'post' ] );

		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturn( true );
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 2, 1 );

		$this->options_helper->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( '0' );

		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 2, 'post' )->andReturn( $parent_indexable );

		$this->instance->build( $indexable );
	}

	/**
	 * Tests building the hierarchy of a post with term parents.
	 *
	 * @covers ::build
	 */
	public function test_primary_term_parents() {
		$indexable = new Indexable();
		$indexable->id          = 1;
		$indexable->object_type = 'post';
		$indexable->object_id   = 1;

		$primary_term = new Primary_Term();
		$primary_term->term_id = 2;

		$parent_indexable = new Indexable();
		$parent_indexable->id          = 2;
		$parent_indexable->object_type = 'term';
		$parent_indexable->object_id   = 2;

		Monkey\Functions\expect( 'get_post' )->once()->with( 1 )->andReturn( (object) [ 'ID' => 1, 'post_parent' => 0, 'post_type' => 'post' ] );
		Monkey\Functions\expect( 'get_term' )->once()->with( 2 )->andReturn( (object) [ 'term_id' => 2, 'taxonomy' => 'tag', 'parent' => 0 ] );

		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturn( true );
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 2, 1 );

		$this->primary_term_repository->expects( 'find_by_post_id_and_taxonomy' )->with( 1, 'tag', false )->andReturn( $primary_term );

		$this->options_helper->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( 'tag' );

		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 2, 'term' )->andReturn( $parent_indexable );

		$this->instance->build( $indexable );
	}

	/**
	 * Tests building the hierarchy of a post with many term parents.
	 *
	 * @covers ::build
	 */
	public function test_many_primary_term_parents() {
		$indexable = new Indexable();
		$indexable->id          = 1;
		$indexable->object_type = 'post';
		$indexable->object_id   = 1;

		$primary_term = new Primary_Term();
		$primary_term->term_id = 2;

		$parent_indexable = new Indexable();
		$parent_indexable->id          = 2;
		$parent_indexable->object_type = 'term';
		$parent_indexable->object_id   = 2;

		$grand_parent_indexable = new Indexable();
		$grand_parent_indexable->id          = 3;
		$grand_parent_indexable->object_type = 'term';
		$grand_parent_indexable->object_id   = 3;

		Monkey\Functions\expect( 'get_post' )->once()->with( 1 )->andReturn( (object) [ 'ID' => 1, 'post_parent' => 0, 'post_type' => 'post' ] );
		Monkey\Functions\expect( 'get_term' )->once()->with( 2 )->andReturn( (object) [ 'term_id' => 2, 'taxonomy' => 'tag', 'parent' => 3 ] );
		Monkey\Functions\expect( 'get_term' )->once()->with( 3, 'tag' )->andReturn( (object) [ 'term_id' => 3, 'taxonomy' => 'tag', 'parent' => 0 ] );

		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturn( true );
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 2, 1 );
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 3, 2 );

		$this->primary_term_repository->expects( 'find_by_post_id_and_taxonomy' )->with( 1, 'tag', false )->andReturn( $primary_term );

		$this->options_helper->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( 'tag' );

		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 2, 'term' )->andReturn( $parent_indexable );
		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 3, 'term' )->andReturn( $grand_parent_indexable );

		$this->instance->build( $indexable );
	}

	/**
	 * Tests building the hierarchy of a post with term parents.
	 *
	 * @covers ::build
	 */
	public function test_term_parent() {
		$indexable = new Indexable();
		$indexable->id          = 1;
		$indexable->object_type = 'post';
		$indexable->object_id   = 1;

		$parent_indexable = new Indexable();
		$parent_indexable->id          = 2;
		$parent_indexable->object_type = 'term';
		$parent_indexable->object_id   = 2;

		Monkey\Functions\expect( 'get_post' )->with( 1 )->andReturn( (object) [ 'ID' => 1,'post_parent' => 0, 'post_type' => 'post' ] );
		Monkey\Functions\expect( 'get_the_terms' )->with( 1, 'tag' )->andReturn( [ (object) [ 'term_id' => 2, 'taxonomy' => 'tag', 'parent' => 0 ] ] );
		Monkey\Functions\expect( 'get_term' )->with( 2 )->andReturn( (object) [ 'term_id' => 2, 'taxonomy' => 'tag', 'parent' => 0 ] );

		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturn( true );
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 2, 1 );

		$this->primary_term_repository->expects( 'find_by_post_id_and_taxonomy' )->with( 1, 'tag', false )->andReturn( false );

		$this->options_helper->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( 'tag' );

		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 2, 'term' )->andReturn( $parent_indexable );

		$this->instance->build( $indexable );
	}

	/**
	 * Tests building the hierarchy of a post with term parents.
	 *
	 * @covers ::build
	 */
	public function test_deepest_term_parent() {
		$indexable = new Indexable();
		$indexable->id          = 1;
		$indexable->object_type = 'post';
		$indexable->object_id   = 1;

		$parent_indexable = new Indexable();
		$parent_indexable->id          = 3;
		$parent_indexable->object_type = 'term';
		$parent_indexable->object_id   = 3;

		$grand_parent_indexable = new Indexable();
		$grand_parent_indexable->id          = 4;
		$grand_parent_indexable->object_type = 'term';
		$grand_parent_indexable->object_id   = 4;

		Monkey\Functions\expect( 'get_post' )->once()->with( 1 )->andReturn( (object) [ 'ID' => 1, 'post_parent' => 0, 'post_type' => 'post' ] );
		Monkey\Functions\expect( 'get_the_terms' )->once()->with( 1, 'tag' )->andReturn( [
			(object) [ 'term_id' => 2, 'taxonomy' => 'tag', 'parent' => 0 ],
			(object) [ 'term_id' => 3, 'taxonomy' => 'tag', 'parent' => 4 ],
		] );
		Monkey\Functions\expect( 'get_term' )->once()->with( 3 )->andReturn( (object) [ 'term_id' => 3, 'taxonomy' => 'tag', 'parent' => 4 ] );
		Monkey\Functions\expect( 'get_term' )->twice()->with( 4, 'tag' )->andReturn( (object) [ 'term_id' => 4, 'taxonomy' => 'tag', 'parent' => 0 ] );

		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturn( true );
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 3, 1 );
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 4, 2 );

		$this->primary_term_repository->expects( 'find_by_post_id_and_taxonomy' )->with( 1, 'tag', false )->andReturn( false );

		$this->options_helper->expects( 'get' )->with( 'post_types-post-maintax' )->andReturn( 'tag' );

		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 3, 'term' )->andReturn( $parent_indexable );
		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 4, 'term' )->andReturn( $grand_parent_indexable );

		$this->instance->build( $indexable );
	}

	/**
	 * Tests building the hierarchy of a term with term parents.
	 *
	 * @covers ::build
	 */
	public function test_term() {
		$indexable = new Indexable();
		$indexable->id          = 1;
		$indexable->object_type = 'term';
		$indexable->object_id   = 1;

		$parent_indexable = new Indexable();
		$parent_indexable->id          = 2;
		$parent_indexable->object_type = 'term';
		$parent_indexable->object_id   = 2;

		Monkey\Functions\expect( 'get_term' )->once()->with( 1 )->andReturn( (object) [ 'term_id' => 1, 'taxonomy' => 'tag', 'parent' => 2 ] );
		Monkey\Functions\expect( 'get_term' )->once()->with( 2, 'tag' )->andReturn( (object) [ 'term_id' => 2, 'taxonomy' => 'tag', 'parent' => 0 ] );

		$this->indexable_hierarchy_repository->expects( 'clear_ancestors' )->with( 1 )->andReturn( true );
		$this->indexable_hierarchy_repository->expects( 'add_ancestor' )->with( 1, 2, 1 );

		$this->indexable_repository->expects( 'find_by_id_and_type' )->with( 2, 'term' )->andReturn( $parent_indexable );

		$this->instance->build( $indexable );
	}
}
