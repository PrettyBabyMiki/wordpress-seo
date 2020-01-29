<?php

namespace Yoast\WP\SEO\Tests\Generators;

use Mockery;
use Yoast\WP\SEO\Generators\OG_Image_Generator;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;
use Yoast\WP\SEO\Values\Open_Graph\Images;

/**
 * Class OG_Image_Generator_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\OG_Image_Generator
 *
 * @group generators
 * @group opengraph
 * @group opengraph-image
 */
class OG_Image_Generator_Test extends TestCase {

	/**
	 * @var Open_Graph_Image_Helper|Mockery\MockInterface
	 */
	protected $open_graph_image_helper;

	/**
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image_helper;

	/**
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options;

	/**
	 * @var OG_Image_Generator|Mockery\MockInterface
	 */
	protected $instance;

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Mockery\MockInterface|Images
	 */
	protected $image_container;

	/**
	 * @var Mockery\MockInterface|Meta_Tags_Context
	 */
	protected $context;

	/**
	 * @var Mockery\MockInterface|Url_Helper
	 */
	protected $url_helper;

	/**
	 * Setup the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->image            = Mockery::mock( Image_Helper::class );
		$this->url_helper              = Mockery::mock( Url_Helper::class );
		$this->options          = Mockery::mock( Options_Helper::class );
		$this->open_graph_image_helper = Mockery::mock(
			Open_Graph_Image_Helper::class,
			[ $this->url_helper, $this->image ]
		);
		$this->image_container        = Mockery::mock( Images::class, [ $this->image, $this->url_helper ] )->makePartial();

		$this->instance = Mockery::mock(
			OG_Image_Generator::class,
			[ $this->open_graph_image_helper, $this->image, $this->options, $this->url_helper ]
		)->shouldAllowMockingProtectedMethods()->makePartial();

		$this->instance
			->expects( 'get_image_container' )
			->once()
			->andReturn( $this->image_container );

		$this->indexable          = new Indexable();
		$this->context            = Mockery::mock( Meta_Tags_Context::class );
		$this->context->indexable = $this->indexable;
	}

	/**
	 * Tests the og_image_id set for an indexable.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 */
	public function test_generate_with_image_id_from_indexable() {
		$this->indexable->og_image_id = 1337;

		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'add_image_by_id' )
			->once()
			->with( 1337 );

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the og_image set for an indexable.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 */
	public function test_generate_with_image_url_from_indexable() {
		$this->indexable->og_image = 'image.jpg';

		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'add_image' )
			->once()
			->with( [ 'url' => 'image.jpg' ] );

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the og_image set for an indexable.
	 *
	 * @covers ::generate
	 * @covers ::add_from_indexable
	 */
	public function test_generate_with_image_url_from_indexable_with_og_image_meta() {
		$this->indexable->og_image      = 'image.jpg';
		$this->indexable->og_image_meta = json_encode( [
			'height' => 1024,
			'width'  => 2048,
		] );

		$this->instance->expects( 'add_from_default' )->andReturnNull();

		$this->image_container
			->expects( 'add_image' )
			->once()
			->with(
				[
					'height' => 1024,
					'width'  => 2048,
					'url'    => 'image.jpg',
				]
			);

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the situation where the default og image id is given.
	 *
	 * @covers ::generate
	 * @covers ::add_from_default
	 */
	public function test_with_add_from_default_with_image_id() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnFalse();

		$this->options
			->expects( 'get' )
			->once()
			->with( 'og_default_image_id', '' )
			->andReturn( 1 );

		$this->image_container
			->expects( 'add_image_by_id' )
			->with( 1 )
			->andReturnNull();

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the situation where the default og image is given.
	 *
	 * @covers ::generate
	 * @covers ::add_from_default
	 */
	public function test_with_add_from_default_with_image_url() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnFalse();

		$this->options
			->expects( 'get' )
			->once()
			->with( 'og_default_image_id', '' )
			->andReturnFalse();

		$this->options
			->expects( 'get' )
			->once()
			->with( 'og_default_image', '' )
			->andReturn( 'image.jpg' );

		$this->image_container
			->expects( 'add_image_by_url' )
			->with( 'image.jpg' )
			->andReturnNull();

		$this->instance->generate( $this->context );
	}

	/**
	 * Tests the situation where we rely on the default but there are images set already.
	 *
	 * @covers ::generate
	 * @covers ::add_from_default
	 */
	public function test_with_add_from_default_when_having_images_already() {
		$this->instance->expects( 'add_from_indexable' )->andReturnNull();

		$this->image_container
			->expects( 'has_images' )
			->once()
			->andReturnTrue();

		$this->instance->generate( $this->context );
	}
}
