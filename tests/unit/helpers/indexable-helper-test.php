<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Permalink_Warning_Presenter;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Indexable_Helper_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Indexable_Helper
 *
 * @group helpers
 */
class Indexable_Helper_Test extends TestCase {

	/**
	 * Represents the class to test.
	 *
	 * @var Indexable_Helper
	 */
	protected $instance;

	/**
	 * Represents the options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->options  = Mockery::mock( Options_Helper::class );
		$this->instance = new Indexable_Helper( $this->options );
	}

	/**
	 * Tests the get_page_type_for_indexable_provider function.
	 *
	 * @param int    $object_type        The object type.
	 * @param int    $object_sub_type    The object sub type.
	 * @param bool   $is_front_page      Whether or not the indexable is the front page.
	 * @param bool   $is_posts_page      Whether or not the indexable is the posts page.
	 * @param string $expected_page_type The expected page type.
	 *
	 * @covers ::get_page_type_for_indexable
	 * @dataProvider get_page_type_for_indexable_provider
	 */
	public function test_get_page_type_for_indexable( $object_type, $object_sub_type, $is_front_page, $is_posts_page, $expected_page_type ) {
		if ( $object_type === 'post' ) {
			Monkey\Functions\expect( 'get_option' )
				->once()
				->with( 'page_on_front' )
				->andReturn( ( $is_front_page ) ? 1 : 0 );

			if ( ! $is_front_page ) {
				Monkey\Functions\expect( 'get_option' )
					->once()
					->with( 'page_for_posts' )
					->andReturn( ( $is_posts_page ) ? 1 : 0 );
			}
		}

		$indexable                  = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id       = 1;
		$indexable->object_type     = $object_type;
		$indexable->object_sub_type = $object_sub_type;

		$this->assertEquals( $expected_page_type, $this->instance->get_page_type_for_indexable( $indexable ) );
	}

	/**
	 * Data provider for the test_get_page_type_for_indexable_provider function.
	 *
	 * @return array The test data.
	 */
	public function get_page_type_for_indexable_provider() {
		return [
			[ 'post', 'page', true, false, 'Static_Home_Page' ],
			[ 'post', 'page', false, true, 'Static_Posts_Page' ],
			[ 'post', 'post', false, false, 'Post_Type' ],
			[ 'term', 'tag', false, false, 'Term_Archive' ],
			[ 'user', null, false, false, 'Author_Archive' ],
			[ 'home-page', null, false, false, 'Home_Page' ],
			[ 'post-type-archive', 'post', false, false, 'Post_Type_Archive' ],
			[ 'system-page', 'search-result', false, false, 'Search_Result_Page' ],
			[ 'system-page', '404', false, false, 'Error_Page' ],
		];
	}

	/**
	 * Test resetting the permalinks for categories.
	 *
	 * @covers ::reset_permalink_indexables
	 */
	public function test_reset_permalink_indexables() {
		global $wpdb;

		$wpdb         = Mockery::mock();
		$wpdb->prefix = 'wp_';

		$wpdb
			->expects( 'update' )
			->once()
			->with(
				'wp_yoast_indexable',
				[
					'permalink'      => null,
					'permalink_hash' => null,
				],
				[
					'object_type'     => 'term',
					'object_sub_type' => 'category',
				]
			)
			->andReturn( 1 );

		$this->options
			->expects( 'set' )
			->with( 'indexables_indexation_reason', Indexation_Permalink_Warning_Presenter::REASON_CATEGORY_BASE_PREFIX )
			->once();

		$this->options
			->expects( 'set' )
			->with( 'ignore_indexation_warning', false )
			->once();

		$this->options
			->expects( 'set' )
			->with( 'indexation_warning_hide_until', false )
			->once();

		Monkey\Functions\expect( 'delete_transient' )->with( Indexable_Post_Indexation_Action::TRANSIENT_CACHE_KEY );
		Monkey\Functions\expect( 'delete_transient' )->with( Indexable_Post_Type_Archive_Indexation_Action::TRANSIENT_CACHE_KEY );
		Monkey\Functions\expect( 'delete_transient' )->with( Indexable_Term_Indexation_Action::TRANSIENT_CACHE_KEY );

		$this->instance->reset_permalink_indexables( 'term', 'category', Indexation_Permalink_Warning_Presenter::REASON_CATEGORY_BASE_PREFIX );
	}
}
