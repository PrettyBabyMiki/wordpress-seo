<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Post_Type_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class OG_Article_Author_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Post_Type_Presentation
 *
 * @group presentations
 * @group opengraph
 */
class OG_Article_Author_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
		$this->indexable->object_id = 1;
	}

	/**
	 * Tests the situation where the article author is given.
	 *
	 * @covers ::generate_open_graph_article_author
	 */
	public function test_generate_og_article_author() {
		$this->instance
			->expects( 'generate_source' )
			->once()
			->andReturn( (object) [ 'post_author' => 2 ] );

		$this->user
			->expects( 'get_the_author_meta' )
			->with( 'facebook', 2 )
			->once()
			->andReturn( 'http://facebook.com/author' );

		$this->assertEquals( 'http://facebook.com/author', $this->instance->generate_open_graph_article_author() );
	}

	/**
	 * Tests the situation where no article author is given.
	 *
	 * @covers ::generate_open_graph_article_author
	 */
	public function test_generate_og_article_author_no_author() {
		$this->instance
			->expects( 'generate_source' )
			->once()
			->andReturn( (object) [ 'post_author' => 2 ] );

		$this->user
			->expects( 'get_the_author_meta' )
			->with( 'facebook', 2 )
			->once()
			->andReturn( '' );

		$this->assertEmpty( $this->instance->generate_open_graph_article_author() );
	}
}
