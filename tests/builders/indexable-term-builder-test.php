<?php

namespace Yoast\WP\SEO\Tests\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Term_Builder;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\ORM\ORMWrapper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Term_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Term_Builder
 * @covers ::<!public>
 *
 * @package Yoast\Tests\Builders
 */
class Indexable_Term_Builder_Test extends TestCase {

	/**
	 * Options being mocked.
	 *
	 * @var array
	 */
	protected $mocked_options = [ 'wpseo', 'wpseo_titles', 'wpseo_social', 'wpseo_ms' ];

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::build
	 */
	public function test_build() {
		$term = (object) [ 'taxonomy' => 'category', 'term_id' => 1 ];

		Monkey\Functions\expect( 'get_term' )->once()->with( 1 )->andReturn( $term );
		Monkey\Functions\expect( 'get_term_link' )->once()->with( $term, 'category' )->andReturn( 'https://example.org/category/1' );
		Monkey\Functions\expect( 'is_wp_error' )->twice()->andReturn( false );

		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORMWrapper::class );
		$indexable_mock->orm->expects( 'set' )->with( 'object_id', 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'object_type', 'term' );
		$indexable_mock->orm->expects( 'set' )->with( 'object_sub_type', 'category' );
		$indexable_mock->orm->expects( 'set' )->with( 'permalink', 'https://example.org/category/1' );
		$indexable_mock->orm->expects( 'set' )->with( 'canonical', 'https://canonical-term' );
		$indexable_mock->orm->expects( 'set' )->with( 'title', 'title' );
		$indexable_mock->orm->expects( 'set' )->with( 'breadcrumb_title', 'breadcrumb_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'description', 'description' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_title', 'og_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image', 'og_image' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image', null );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image_id', 'og_image_id' );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image_id', null );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image_source', null );
		$indexable_mock->orm->expects( 'set' )->with( 'og_image_meta', null );
		$indexable_mock->orm->expects( 'set' )->with( 'og_description', 'og_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_title', 'twitter_title' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', 'twitter_image' );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', null );
		$indexable_mock->orm->expects( 'set' )->times( 2 )->with( 'twitter_image_id', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_description', 'twitter_description' );
		$indexable_mock->orm->expects( 'set' )->with( 'is_cornerstone', false );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', true );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nofollow', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noarchive', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noimageindex', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nosnippet', null );
		$indexable_mock->orm->expects( 'set' )->with( 'primary_focus_keyword', 'focuskeyword' );
		$indexable_mock->orm->expects( 'set' )->with( 'primary_focus_keyword_score', 75 );
		$indexable_mock->orm->expects( 'set' )->with( 'readability_score', 50 );

		$indexable_mock->orm->expects( 'get' )->once()->with( 'og_image' );
		$indexable_mock->orm->expects( 'get' )->once()->with( 'og_image_id' );
		$indexable_mock->orm->expects( 'get' )->once()->with( 'og_image_source' );
		$indexable_mock->orm->expects( 'get' )->once()->with( 'twitter_image' );
		$indexable_mock->orm->expects( 'get' )->twice()->with( 'twitter_image_id' );

		$indexable_mock->orm->expects( 'offsetExists' )->once()->with( 'breadcrumb_title' )->andReturnTrue();
		$indexable_mock->orm->expects( 'get' )->once()->with( 'breadcrumb_title' )->andReturnTrue();

		$indexable_mock->orm->expects( 'get' )->once()->with( 'object_sub_type' )->andReturn( 'category' );
		$indexable_mock->orm->expects( 'get' )->once()->with( 'is_robots_noindex' )->andReturn( true );
		$indexable_mock->orm->expects( 'set' )->once()->with( 'is_public', false );

		$image            = Mockery::mock( Image_Helper::class );
		$open_graph_image = Mockery::mock( \Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper::class );
		$twitter_image    = Mockery::mock( \Yoast\WP\SEO\Helpers\Twitter\Image_Helper::class );

		$taxonomy = Mockery::mock( Taxonomy_Helper::class );
		$taxonomy->expects( 'get_term_meta' )->once()->with( $term )->andReturn( [
			'wpseo_focuskw'               => 'focuskeyword',
			'wpseo_linkdex'               => '75',
			'wpseo_noindex'               => 'noindex',
			'wpseo_meta-robots-adv'       => '',
			'wpseo_content_score'         => '50',
			'wpseo_canonical'             => 'https://canonical-term',
			'wpseo_meta-robots-nofollow'  => '1',
			'wpseo_title'                 => 'title',
			'wpseo_desc'                  => 'description',
			'wpseo_bctitle'               => 'breadcrumb_title',
			'wpseo_opengraph-title'       => 'og_title',
			'wpseo_opengraph-image'       => 'og_image',
			'wpseo_opengraph-image-id'    => 'og_image_id',
			'wpseo_opengraph-description' => 'og_description',
			'wpseo_twitter-title'         => 'twitter_title',
			'wpseo_twitter-image'         => 'twitter_image',
			'wpseo_twitter-description'   => 'twitter_description',
		] );
		$taxonomy->expects( 'is_indexable' )->once()->with( 'category' )->andReturn( true );

		$builder = new Indexable_Term_Builder( $taxonomy );

		$builder->set_social_image_helpers(
			$image,
			$open_graph_image,
			$twitter_image
		);

		$builder->build( 1, $indexable_mock );
	}
}
