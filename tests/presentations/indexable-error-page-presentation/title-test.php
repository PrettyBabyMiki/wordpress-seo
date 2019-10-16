<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Error_Page_Presentation;

use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Title_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presentations\Indexable_Error_Page_Presentation
 *
 * @group presentations
 * @group title
 *
 * @package Yoast\Tests\Presentations\Indexable_Error_Page_Presentation
 */
class Title_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->setInstance();
	}

	/**
	 * Tests whether the title is returned when it is set.
	 *
	 * @covers ::generate_title
	 */
	public function test_title() {
		$this->indexable->title = 'Error page title';

		$this->assertEquals( 'Error page title', $this->instance->generate_title() );
	}

	/**
	 * Tests whether the default title is returned when no title is set.
	 *
	 * @covers ::generate_title
	 */
	public function test_title_without_set_title() {
		$this->options_helper
			->expects( 'get_title_default' )
			->once()
			->with( 'title-404-wpseo' )
			->andReturn( 'Default error page title' );

		$this->assertEquals( 'Default error page title', $this->instance->generate_title() );
	}
}
