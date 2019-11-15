<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Twitter_Card_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group twitter
 * @group twitter-card
 */
class Twitter_Card_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests whether an empty string is returned.
	 *
	 * @covers ::generate_twitter_card
	 */
	public function test_generate_twitter_card() {
		$this->context->twitter_card = 'summary';

		$this->assertEquals( 'summary', $this->instance->generate_twitter_card() );
	}
}
