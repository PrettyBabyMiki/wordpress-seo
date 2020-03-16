<?php

use Brain\Monkey;
use Yoast\WP\SEO\Helpers\Primary_Term_Helper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Primary_Term_Helper_Test
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Primary_Term_Helper
 */
class Primary_Term_Helper_Test extends TestCase {

	/**
	 * @var Primary_Term_Helper
	 */
	private $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = \Mockery::mock( Primary_Term_Helper::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests the retrieval of the primary term taxonomies.
	 *
	 * @covers ::get_primary_term_taxonomies
	 */
	public function test_get_primary_term_taxonomies() {
		$taxonomies = [
			(object) [
				'name'         => 'category',
				'hierarchical' => true,
			],
		];

		Monkey\Functions\expect( 'get_object_taxonomies' )
			->once()
			->with( 'post', 'objects' )
			->andReturn( [
				(object) [
					'name'         => 'category',
					'hierarchical' => true,
				],
				(object) [
					'name'         => 'tag',
					'hierarchical' => false,
				],
			] );

		Monkey\Functions\expect( 'get_post_type' )
			->once()
			->with( 1 )
			->andReturn( 'post' );

		Monkey\Filters\expectApplied( 'wpseo_primary_term_taxonomies' )
			->with( $taxonomies, 'post', $taxonomies );

		$this->assertEquals( $taxonomies, $this->instance->get_primary_term_taxonomies( 1 ) );
	}
}
