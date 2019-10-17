<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Term_Archive_Presentation;

use Yoast\WP\Free\Tests\TestCase;
use Brain\Monkey;

/**
 * Class Twitter_Description_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Term_Archive_Presentation
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

		$this->setInstance();
	}

	/**
	 * Tests the situation where the twitter description is given.
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
	public function test_with_term_description() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturn( '' );

		Monkey\Functions\expect( 'term_description' )
			->once()
			->andReturn( 'Term description' );

		$this->assertEquals( 'Term description', $this->instance->generate_twitter_description() );
	}

	/**
	 * Tests the situation where the meta description is given.
	 *
	 * @covers ::generate_twitter_description
	 */
	public function test_with_no_term_description() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->andReturn( '' );

		Monkey\Functions\expect( 'term_description' )
			->once()
			->andReturn( '' );

		$this->assertEmpty( $this->instance->generate_twitter_description() );
	}

}
