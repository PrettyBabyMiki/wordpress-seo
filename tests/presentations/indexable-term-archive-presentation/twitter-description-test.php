<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Term_Archive_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Twitter_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Term_Archive_Presentation
 *
 * @group presentations
 * @group twitter
 * @group twitter-description
 */
class Twitter_Description_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
		$this->indexable->object_id = 1;
	}

	/**
	 * Tests the situation where the Twitter description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_set_twitter_description() {
		$this->indexable->twitter_description = 'Twitter description';

		$this->assertEquals( 'Twitter description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_term_description_with_og_enabled() {
		$this->indexable->twitter_description = '';
		$this->instance->meta_description     = '';
		$this->context->open_graph_enabled    = true;

		$this->instance
			->expects( 'generate_og_description' )
			->once()
			->andReturn( '' );

		$this->taxonomy
			->expects( 'get_term_description' )
			->with( $this->indexable->object_id )
			->once()
			->andReturn( 'Term description' );

		$this->assertEquals( 'Term description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_term_description_with_og_enabled_and_have_og_description() {
		$this->indexable->twitter_description = '';
		$this->instance->meta_description     = '';
		$this->context->open_graph_enabled    = true;

		$this->instance
			->expects( 'generate_og_description' )
			->once()
			->andReturn( 'OG Description' );

		$this->assertEquals( '', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_term_description_with_og_disabled() {
		$this->indexable->twitter_description = '';
		$this->instance->meta_description     = '';
		$this->context->open_graph_enabled    = false;

		$this->instance
			->expects( 'generate_og_description' )
			->once()
			->andReturn( 'OG Description' );

		$this->taxonomy
			->expects( 'get_term_description' )
			->with( $this->indexable->object_id )
			->once()
			->andReturn( 'Term description' );

		$this->assertEquals( 'Term description', $this->instance->generate_twitter_description() );
	}
}
