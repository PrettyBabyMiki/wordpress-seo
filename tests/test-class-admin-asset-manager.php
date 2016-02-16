<?php

class WPSEO_Admin_Asset_Manager_Test extends WPSEO_UnitTestCase {
	/**
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	public function setUp() {
		$this->asset_manager = new WPSEO_Admin_Asset_Manager();
	}

	/**
	 * This is the only way to tests the protected methods. The should really be constants, but we can't because we have
	 * to support PHP5.5 and lower.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::scripts_to_be_registered
	 * @covers WPSEO_Admin_Asset_Manager::styles_to_be_registered
	 */
	public function test_DEFAULT_register() {
		$this->asset_manager->register_assets();
	}

	/**
	 * Tests whether the function enqueue_script() enqueues the included script.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_script
	 */
	public function test_enqueue_script() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_script( 'metabox' );
		$this->assertTrue( wp_script_is( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox', 'enqueued' ) );
	}

	/**
	 * Tests whether the function enqueue_style() enqueues the included style.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_style
	 */
	public function test_enqueue_style() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_style( 'metabox-css' );
		$this->assertTrue( wp_style_is( WPSEO_Admin_Asset_Manager::PREFIX . 'metabox-css', 'enqueued' ) );
	}

	/**
	 * Tests whether enqueue style doesn't enqueue when wrong data is fed.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::enqueue_style
	 */
	public function test_wrong_enqueue_style() {
		$class_instance = new WPSEO_Admin_Asset_Manager();
		$class_instance->register_assets();

		$class_instance->enqueue_style( 'nonexisting' );
		$this->assertFalse( wp_style_is( WPSEO_Admin_Asset_Manager::PREFIX . 'nonexisting', 'enqueued' ) );
	}

	/**
	 * @covers WPSEO_Admin_Asset_Manager::register_script
	 */
	public function test_register_script() {
		$this->asset_manager->register_script( 'handle', 'src', array( 'deps' ), 'version', 'in_footer' );

		// We really want to mock wp_enqueue_script here but we can't because of PHP 5.2
		// Use the WordPress internals to assert instead.
		global $wp_scripts;

		$this->assertTrue( isset( $wp_scripts->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle' ] ) );

		$result = $wp_scripts->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle' ];

		$this->assertEquals( WPSEO_Admin_Asset_Manager::PREFIX . 'handle', $result->handle );
		$this->assertEquals( 'http://example.org/wp-content/plugins/wordpress-seo/js/src.js', $result->src );
		$this->assertEquals( array( 'deps' ), $result->deps );
		$this->assertEquals( 'version', $result->ver );
		$this->assertEquals( array( 'group' => 1 ), $result->extra );
	}

	/**
	 * @covers WPSEO_Admin_Asset_Manager::register_style
	 */
	public function test_register_style() {
		$this->asset_manager->register_style( 'handle', 'src', array( 'deps' ), 'version', 'print' );

		// We really want to mock wp_enqueue_style here but we can't because of PHP 5.2
		// Use the WordPress internals to assert instead.
		global $wp_styles;

		$this->assertTrue( isset( $wp_styles->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle' ] ) );

		$result = $wp_styles->registered[ WPSEO_Admin_Asset_Manager::PREFIX . 'handle' ];

		$this->assertEquals( WPSEO_Admin_Asset_Manager::PREFIX . 'handle', $result->handle );
		$this->assertEquals( 'http://example.org/wp-content/plugins/wordpress-seo/css/src.css', $result->src );
		$this->assertEquals( array( 'deps' ), $result->deps );
		$this->assertEquals( 'version', $result->ver );
		$this->assertEquals( 'print', $result->args );
	}

	/**
	 * @covers WPSEO_Admin_Asset_Manager::register_scripts
	 */
	public function test_register_scripts() {
		$class_instance =
			$this
				->getMock( 'WPSEO_Admin_Asset_Manager', array( 'register_script' ) );

		$class_instance
			->expects( $this->exactly(2) )
			->method( 'register_script' )
			->withConsecutive(
				array( 'testfile', 'testfile', array(), WPSEO_VERSION, true ),
				array( 'testfile2', 'testfile2', array( 'dep1' ), 'version1', false )
			);

		$class_instance->register_scripts( array(
			array(
				'name' => 'testfile',
				'src'  => 'testfile',
			),
			array(
				'name'      => 'testfile2',
				'src'       => 'testfile2',
				'deps'      => array( 'dep1' ),
				'version'   => 'version1',
				'in_footer' => false,
			),
		) );
	}

	/**
	 * Tests whether register_style can actually register a style based on the required arguments.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_styles
	 */
	public function test_register_styles() {
		$class_instance =
			$this
				->getMock( 'WPSEO_Admin_Asset_Manager', array( 'register_style' ) );

		$class_instance
			->expects( $this->exactly(2) )
			->method( 'register_style' )
			->withConsecutive(
				array( 'testfile', 'testfile' ),
				array( 'testfile2', 'testfile2', array( 'dep1' ), 'version1' )
			);

		$class_instance->register_styles( array(
			array(
				'name' => 'testfile',
				'src'  => 'testfile',
			),
			array(
				'name'    => 'testfile2',
				'src'     => 'testfile2',
				'deps'    => array( 'dep1' ),
				'version' => 'version1',
			),
		) );
	}

	/**
	 * Tests whether register_assets calls the functions register_scripts and register_styles.
	 *
	 * @covers WPSEO_Admin_Asset_Manager::register_assets
	 */
	public function test_register_assets() {
		$class_instance =
			$this
				->getMock( 'WPSEO_Admin_Asset_Manager', array( 'register_scripts', 'register_styles' ) );

		$class_instance
			->expects( $this->once() )
			->method( 'register_scripts' );
		$class_instance
			->expects( $this->once() )
			->method( 'register_styles' );

		$class_instance->register_assets();
	}
}
