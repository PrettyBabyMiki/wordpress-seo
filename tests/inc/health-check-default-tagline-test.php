<?php

namespace Yoast\WP\Free\Tests\Inc;

use Brain\Monkey;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group health-check
 */
class WPSEO_Health_Check_Default_Tagline_Test extends TestCase {

	/**
	 * Tests the run method when the WordPress tagline is the default one.
	 *
	 * @covers WPSEO_Health_Check_Default_Tagline::run
	 * @covers WPSEO_Health_Check_Default_Tagline::has_default_tagline
	 */
	public function test_run_with_default_tagline() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blogdescription' )
			->andReturn( 'Just another WordPress site' );

		$health_check = new \WPSEO_Health_Check_Default_Tagline();
		$health_check->run();

		// We just want to verify that the label attribute is the "not passed" message.
		$this->assertAttributeEquals( 'You should change the default WordPress tagline', 'label', $health_check );
	}

	/**
	 * Tests the run method when the WordPress tagline is empty.
	 *
	 * @covers WPSEO_Health_Check_Default_Tagline::run
	 * @covers WPSEO_Health_Check_Default_Tagline::has_default_tagline
	 */
	public function test_run_with_empty_tagline() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blogdescription' )
			->andReturn( '' );

		$health_check = new \WPSEO_Health_Check_Default_Tagline();
		$health_check->run();

		// We just want to verify that the label attribute is the "passed" message.
		$this->assertAttributeEquals( 'You changed the default WordPress tagline', 'label', $health_check );
	}

	/**
	 * Tests the run method when the WordPress tagline is a custom one.
	 *
	 * @covers WPSEO_Health_Check_Default_Tagline::run
	 * @covers WPSEO_Health_Check_Default_Tagline::has_default_tagline
	 */
	public function test_run_with_custom_tagline() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blogdescription' )
			->andReturn( 'My custom site tagline' );

		$health_check = new \WPSEO_Health_Check_Default_Tagline();
		$health_check->run();

		// We just want to verify that the label attribute is the "passed" message.
		$this->assertAttributeEquals( 'You changed the default WordPress tagline', 'label', $health_check );
	}
}
