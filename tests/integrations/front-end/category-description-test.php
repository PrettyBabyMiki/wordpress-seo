<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Integrations\Front_End
 */

namespace Yoast\WP\SEO\Tests\Integrations\Front_End;

use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Integrations\Front_End\Category_Description;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Category_Description
 * @covers ::<!public>
 *
 * @group integrations
 * @group front-end
 */
class Category_Description_Test extends TestCase {

	/**
	 * The test instance.
	 *
	 * @var Category_Description
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Category_Description();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			Category_Description::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertTrue( Monkey\Filters\has( 'category_description', [ $this->instance, 'add_shortcode_support' ] ) );
	}

	/**
	 * Tests the add shortcode support functionality.
	 *
	 * @covers ::add_shortcode_support
	 */
	public function test_add_shortcode_support() {
		Monkey\Functions\when( 'do_shortcode' )
			->returnArg( 1 );

		$this->assertEquals(
			'This is a category text',
			$this->instance->add_shortcode_support( 'This is a category text' )
		);
	}
}
