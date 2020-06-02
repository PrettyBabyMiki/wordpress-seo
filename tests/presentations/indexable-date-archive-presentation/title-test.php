<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Date_Archive_Presentation;

use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Title_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Date_Archive_Presentation
 *
 * @group presentations
 * @group title
 */
class Title_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests whether the title is returned when it is set.
	 *
	 * @covers ::generate_title
	 */
	public function test_title() {
		$this->indexable->title = 'Title';

		$this->assertEquals( 'Title', $this->instance->generate_title() );
	}

	/**
	 * Tests whether the default title is returned when no title is set.
	 *
	 * @covers ::generate_title
	 */
	public function test_title_without_set_title() {
		$this->options
			->expects( 'get_title_default' )
			->once()
			->with( 'title-archive-wpseo' )
			->andReturn( 'Default title' );

		$this->assertEquals( 'Default title', $this->instance->generate_title() );
	}
}
