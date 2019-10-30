<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests
 */

/**
 * Unit Test Class.
 *
 * @group frontend
 */
class WPSEO_Frontend_Test extends WPSEO_UnitTestCase_Frontend {

	/**
	 * Setting up.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		self::$class_instance = WPSEO_Frontend_Double::get_instance();
	}

	/**
	 * Reset permalink structure.
	 *
	 * @return void
	 */
	public function setUp() {
		parent::setUp();
		$this->set_permalink_structure( '' );
		create_initial_taxonomies();
	}

	/**
	 * Reset after running a test.
	 */
	public function tearDown() {
		parent::tearDown();

		$this->reset_post_types();

		ob_clean();
		self::$class_instance->reset();
		update_option( 'posts_per_page', 10 );
	}



	/**
	 * Tests the situation for flush cache with output buffering not turned on.
	 *
	 * @covers WPSEO_Frontend::flush_cache
	 */
	public function test_flush_cache_with_output_buffering_not_turned_on() {
		// Should not run when output buffering is not turned on.
		$this->assertFalse( self::$class_instance->flush_cache() );
	}

	/**
	 * @covers WPSEO_Frontend::force_rewrite_output_buffer
	 */
	public function test_force_rewrite_output_buffer() {
		self::$class_instance->force_rewrite_output_buffer();
		$this->assertTrue( ( ob_get_level() > 0 ) );
		ob_get_clean();
	}

	/**
	 * Runs tests for consecutive pages.
	 *
	 * @param string $initial_url URL to start off from.
	 *
	 * @return void
	 */
	private function run_test_on_consecutive_pages( $initial_url ) {
		// Test page 1 of the post type archives, should have just a rel=next and a canonical.
		$this->go_to( $initial_url );

		$page_2_link = get_pagenum_link( 2, false );
		$page_3_link = get_pagenum_link( 3, false );

		$expected = '<link rel="next" href="' . esc_url( $page_2_link ) . '" />' . "\n";

		self::$class_instance->adjacent_rel_links();
		$this->assertEquals( $initial_url, self::$class_instance->canonical( false ) );
		$this->expectOutput( $expected );

		self::$class_instance->reset();

		// Test page 2 of the post type archives, should have a rel=next and rel=prev and a canonical.
		$this->go_to( $page_2_link );

		$expected = '<link rel="prev" href="' . esc_url( $initial_url ) . '" />' . "\n" . '<link rel="next" href="' . esc_url( $page_3_link ) . '" />' . "\n";

		self::$class_instance->adjacent_rel_links();
		$this->assertEquals( $page_2_link, self::$class_instance->canonical( false ), 'Testing the link for the next page' );
		$this->expectOutput( $expected, 'Expecting previous and next URLs to be set for the 2nd page.' );

		self::$class_instance->reset();

		// Test page 3 of the author archives, should have just a rel=prev and a canonical.
		$this->go_to( $page_3_link );

		$expected = '<link rel="prev" href="' . esc_url( $page_2_link ) . '" />' . "\n";
		self::$class_instance->adjacent_rel_links();
		$this->assertEquals( $page_3_link, self::$class_instance->canonical( false ), 'Testing the link for the previous page' );
		$this->expectOutput( $expected, 'Expecting previous URL to be set for the 3nd page.' );

		self::$class_instance->reset();
	}

	/**
	 * Returns tests for consecutive post pages (paginated post/page).
	 *
	 * @param string $initial_url URL to start off from.
	 *
	 * @return void
	 */
	private function run_test_on_consecutive_post_parts( $initial_url ) {
		/** @var WP_Rewrite $wp_rewrite */
		global $wp_rewrite;

		// Test page 1 of the post type archives, should have just a rel=next and a canonical.
		$this->go_to( $initial_url );

		/*
		 * As WordPress core is internally completely broken on this functionality, adding logic here
		 * is the only way to test for the different situations.
		 */
		if ( ! $wp_rewrite->using_permalinks() ) {
			$page_2_link = get_pagenum_link( 2, false );
			$page_3_link = get_pagenum_link( 3, false );

			// Prepare for is_single usage.
			$page_2_link = str_replace( 'paged=', 'page=', $page_2_link );
			$page_3_link = str_replace( 'paged=', 'page=', $page_3_link );
		}
		else {
			$page_2_link = user_trailingslashit( rtrim( $initial_url, '/' ) . '/2' );
			$page_3_link = user_trailingslashit( rtrim( $initial_url, '/' ) . '/3' );
		}

		self::$class_instance->adjacent_rel_links();
		$this->expectOutput(
			'<link rel="next" href="' . esc_url( $page_2_link ) . '" />' . "\n",
			'Expect next link to be present in the output.'
		);

		$this->assertEquals( $initial_url, self::$class_instance->canonical( false ) );

		self::$class_instance->reset();

		// Test page 2 of the post type archives, should have a rel=next and rel=prev and a canonical.
		$this->go_to( $page_2_link );

		self::$class_instance->adjacent_rel_links();
		$this->expectOutput(
			'<link rel="prev" href="' . esc_url( $initial_url ) . '" />' . "\n" .
			'<link rel="next" href="' . esc_url( $page_3_link ) . '" />' . "\n",
			'Expecting previous and next URLs to be set for the 2nd page.'
		);

		$this->assertEquals( $page_2_link, self::$class_instance->canonical( false ), 'Testing the link for the next page' );

		self::$class_instance->reset();

		// Test page 3 of the author archives, should have just a rel=prev and a canonical.
		$this->go_to( $page_3_link );

		$expected = '<link rel="prev" href="' . esc_url( $page_2_link ) . '" />' . "\n";
		self::$class_instance->adjacent_rel_links();
		$this->assertEquals( $page_3_link, self::$class_instance->canonical( false ), 'Testing the link for the previous page' );
		$this->expectOutput( $expected, 'Expecting previous URL to be set for the 3nd page.' );
	}

	/**
	 * Tests the output for webmaster tools authentication.
	 *
	 * @param string $option_name Option name.
	 * @param string $test_value  Test value to use.
	 * @param string $expected    Expected output.
	 *
	 * @return void
	 */
	private function run_webmaster_tools_authentication_option_test( $option_name, $test_value, $expected ) {
		WPSEO_Options::set( $option_name, $test_value );

		self::$class_instance->webmaster_tools_authentication();
		$this->expectOutput( $expected );

		WPSEO_Options::set( $option_name, '' );
	}

	/**
	 * Tests if the queried post type is fetched properly.
	 *
	 * @covers WPSEO_Frontend::get_queried_post_type
	 *
	 * @return void
	 */
	public function test_get_queried_post_type() {
		$wp_query = $this
			->getMockBuilder( 'WP_Query' )
			->setMethods( array( 'get' ) )
			->getMock();

		$wp_query
			->expects( $this->once() )
			->method( 'get' )
			->with( 'post_type' )
			->will( $this->returnValue( 'my_post_type' ) );

		$GLOBALS['wp_query'] = $wp_query;

		$this->assertEquals( 'my_post_type', self::$class_instance->get_queried_post_type() );
	}

	/**
	 * Tests for post type when given as multiple items.
	 *
	 * @covers WPSEO_Frontend::get_queried_post_type
	 *
	 * @return void
	 */
	public function test_get_queried_post_type_array() {
		$wp_query = $this
			->getMockBuilder( 'WP_Query' )
			->setMethods( array( 'get' ) )
			->getMock();

		$wp_query
			->expects( $this->once() )
			->method( 'get' )
			->with( 'post_type' )
			->will( $this->returnValue( array( 'my_post_type', 'your_post_type' ) ) );

		$GLOBALS['wp_query'] = $wp_query;

		$this->assertEquals( 'my_post_type', self::$class_instance->get_queried_post_type() );
	}
}
