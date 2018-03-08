<?php
/**
 * @package WPSEO\Tests\Inc\Options
 */

/**
 * Unit Test Class.
 */
class WPSEO_Options_Test extends WPSEO_UnitTestCase {
	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();
		WPSEO_Options::get_instance();
	}

	/**
	 * Tests if the get_all function returns an array with at least the indexses associated with the options: wpseo and wpseo_titles.
	 *
	 * @covers WPSEO_Options::get_all
	 */
	public function test_get_all_HAS_VALID_KEYS() {
		$result = WPSEO_Options::get_all();
		$this->assertArrayHasKey( 'website_name', $result );
		$this->assertArrayHasKey( 'rssbefore', $result );
		$this->assertArrayHasKey( 'breadcrumbs-prefix', $result );
	}

	/**
	 * Test if the get_options function returns an empty array if you pass an empty array.
	 *
	 * @covers WPSEO_Options::get_options
	 */
	public function test_get_options_IS_EMPTY_with_empty_array() {
		$result = WPSEO_Options::get_options( array() );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get_options function returns an empty array if you pass nonexistent options.
	 *
	 * @covers WPSEO_Options::get_options
	 */
	public function test_get_options_IS_EMPTY_with_invalid_option_names() {
		$result = WPSEO_Options::get_options( array( 'nonexistent_option_one', 'nonexistent_option_two' ) );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get_options function returns an array containing two of the correct keys when entering an array with two valid optionnames.
	 *
	 * @covers WPSEO_Options::get_options
	 */
	public function test_get_options_HAS_VALID_KEYS_with_valid_option_names() {
		$result = WPSEO_Options::get_options( array( 'wpseo_social', 'wpseo_titles' ) );
		$this->assertArrayHasKey( 'opengraph', $result );
	}

	/**
	 * Test if the get_option function returns an empty array if you pass null.
	 *
	 * @covers WPSEO_Options::get_option
	 */
	public function test_get_option_IS_EMPTY_with_null() {
		$result = WPSEO_Options::get_option( null );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get_option function returns an empty array if you pass an empty string.
	 *
	 * @covers WPSEO_Options::get_option
	 */
	public function test_get_option_IS_EMPTY_with_empty_string() {
		$result = WPSEO_Options::get_option( '' );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get_option function returns an empty array if you pass an nonexistent option.
	 *
	 * @covers WPSEO_Options::get_option
	 */
	public function test_get_option_IS_EMPTY_with_invalid_option_name() {
		$result = WPSEO_Options::get_option( 'nonexistent_option' );
		$this->assertEmpty( $result );
	}

	/**
	 * Test if the get_option function returns an array containing one of the correct keys when entering an array with a single valid optionname.
	 *
	 * @covers WPSEO_Options::get_option
	 */
	public function test_get_option_IS_VALID_with_valid_option_name() {
		$result = WPSEO_Options::get_option( 'wpseo_titles' );
		$this->assertArrayHasKey( 'website_name', $result );
	}

	/**
	 * Tests if the get_option_value function returns a valid result.
	 *
	 * @covers WPSEO_Options::get()
	 */
	public function test_get_returns_valid_result() {
		$option                            = WPSEO_Options::get_option( 'wpseo' );
		$option['keyword_analysis_active'] = true;
		$option['show_onboarding_notice']  = false;
		update_option( 'wpseo', $option );

		$result = WPSEO_Options::get( 'keyword_analysis_active' );
		$this->assertTrue( $result );

		$result = WPSEO_Options::get( 'show_onboarding_notice' );
		$this->assertFalse( $result );
	}

	/**
	 * Tests if the get_option_value function returns a valid result.
	 *
	 * @covers WPSEO_Options::get()
	 */
	public function test_get_returns_null_result() {
		$result = WPSEO_Options::get( 'non_existent_value' );
		$this->assertNull( $result );
	}

	/**
	 * Tests if the get_option_value function returns a valid result.
	 *
	 * @covers WPSEO_Options::get()
	 */
	public function test_get_returns_default_result() {
		$result = WPSEO_Options::get( 'non_existent_value', array() );
		$this->assertEquals( array(), $result );
	}

	/**
	 * Tests if the get_option_value function returns a valid result.
	 *
	 * @covers WPSEO_Options::get()
	 */
	public function test_set_works() {
		$option_before                            = WPSEO_Options::get_option( 'wpseo' );
		$option_before['keyword_analysis_active'] = true;
		$option_before['show_onboarding_notice']  = false;
		update_option( 'wpseo', $option_before );

		// Turn them around and see if they still return the correct value
		WPSEO_Options::set( 'keyword_analysis_active', false );
		WPSEO_Options::set( 'show_onboarding_notice', true );

		$result = WPSEO_Options::get( 'keyword_analysis_active' );
		$this->assertFalse( $result );

		$result = WPSEO_Options::get( 'show_onboarding_notice' );
		$this->assertTrue( $result );
	}

	/**
	 * Tests if unique keys are used in all options.
	 */
	public function test_make_sure_keys_are_unique_over_options() {
		$keys = array();

		// Make sure the backfilling is not being done when determining "real" unique option names.
		remove_all_actions( 'option_wpseo' );
		remove_all_actions( 'option_wpseo_titles' );

		foreach ( array_keys( WPSEO_Options::$options ) as $option_name ) {
			$option_keys = array_keys( WPSEO_Options::get_option( $option_name ) );
			$intersected = array_intersect( $option_keys, $keys );

			$this->assertEquals( array(), $intersected, 'Option keys must be unique (' . $option_name . ').' );

			$keys = array_merge( $keys, $option_keys );
		}
	}
}
