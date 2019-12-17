<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\OnPage
 */

/**
 * Unit Test Class.
 */
class WPSEO_Ryte_Test extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Ryte
	 */
	protected $class_instance;

	/**
	 * Holds the instance of the option related to the class being tested.
	 *
	 * @var WPSEO_Ryte_Option
	 */
	private $option_instance;

	/**
	 * Setup the class instance.
	 */
	public function setUp() {
		parent::setUp();

		$this->option_instance = new WPSEO_Ryte_Option();
		$this->class_instance  = new WPSEO_Ryte_Double();
	}

	/**
	 * Test if the weekly schedule is added to wp_get_schedules.
	 *
	 * @covers WPSEO_Ryte::add_weekly_schedule
	 */
	public function test_add_weekly_schedule() {
		$this->class_instance->register_hooks();

		$schedules = $this->class_instance->add_weekly_schedule( [] );

		$this->assertTrue( array_key_exists( 'weekly', $schedules ) );
		$this->assertEquals( $schedules['weekly']['interval'], WEEK_IN_SECONDS );
		$this->assertEquals( $schedules['weekly']['display'], __( 'Once Weekly', 'wordpress-seo' ) );

		$schedules = wp_get_schedules();

		$this->assertTrue( array_key_exists( 'weekly', $schedules ) );
		$this->assertEquals( $schedules['weekly']['interval'], WEEK_IN_SECONDS );
		$this->assertEquals( $schedules['weekly']['display'], __( 'Once Weekly', 'wordpress-seo' ) );
	}

	/**
	 * Test if the weekly schedule is added to wp_get_schedules.
	 *
	 * @link https://github.com/Yoast/wordpress-seo/issues/9450
	 * @link https://github.com/Yoast/wordpress-seo/issues/9475
	 *
	 * @covers WPSEO_Ryte::add_weekly_schedule
	 */
	public function test_add_weekly_schedule_with_invalid_filter_input() {
		$this->class_instance->register_hooks();

		add_filter( 'cron_schedules', '__return_false', 1 );

		$schedules = wp_get_schedules();

		$this->assertTrue( array_key_exists( 'weekly', $schedules ) );
		$this->assertEquals( $schedules['weekly']['interval'], WEEK_IN_SECONDS );
		$this->assertEquals( $schedules['weekly']['display'], __( 'Once Weekly', 'wordpress-seo' ) );

		remove_filter( 'cron_schedules', '__return_false', 1 );
	}

	/**
	 * Test is the old status (null) is overwritten by the new status (1).
	 *
	 * @covers WPSEO_Ryte::fetch_from_ryte
	 */
	public function test_fetch_from_ryte() {
		update_option( 'home', 'http://example.org' );

		$this->assertEquals( $this->option_instance->get_status(), 99 );

		$this->assertTrue( $this->class_instance->fetch_from_ryte() );

		$option_instance = new WPSEO_Ryte_Option();
		$this->assertEquals( $option_instance->get_status(), 1 );
	}

	/**
	 * Test is the old status (null) is overwritten by the new status (0).
	 *
	 * @covers WPSEO_Ryte::fetch_from_ryte
	 */
	public function test_fetch_from_ryte_not_indexable() {
		update_option( 'home', 'https://example.org' );

		$this->assertEquals( $this->option_instance->get_status(), 99 );

		$this->assertTrue( $this->class_instance->fetch_from_ryte() );

		$option_instance = new WPSEO_Ryte_Option();
		$this->assertEquals( $option_instance->get_status(), 0 );
	}

	/**
	 * Test is the method can only be called once because of the fetch limit of 60 minutes.
	 *
	 * @covers WPSEO_Ryte::fetch_from_ryte
	 */
	public function test_fetch_from_ryte_call_twice() {
		update_option( 'home', 'http://example.org' );

		$this->assertTrue( $this->class_instance->fetch_from_ryte() );
		$this->assertFalse( $this->class_instance->fetch_from_ryte() );
	}

	/**
	 * Test is the old status (null) is overwritten by the new status (0).
	 *
	 * @covers WPSEO_Ryte::fetch_from_ryte
	 */
	public function test_notify_admins() {
		update_option( 'home', 'http://example.org' );

		$class_instance =
			$this
				->getMockBuilder('WPSEO_Ryte_Double')
				->setMethods( [ 'notify_admins' ] )
				->getMock();

		$class_instance
			->expects( $this->once() )
			->method( 'notify_admins' );

		$class_instance->fetch_from_ryte();
	}

	/**
	 * Tests whether Ryte is disable, the notice should not be shown.
	 *
	 * @covers WPSEO_Ryte::__construct
	 * @covers WPSEO_Ryte::should_show_notice
	 */
	public function test_show_notice_being_hooked() {
		$instance = new WPSEO_Ryte();
		$instance->register_hooks();

		$this->assertTrue( has_action( 'admin_init', [ $instance, 'show_notice' ] ) > 0 );
	}

	/**
	 * Tests whether Ryte is disable, the notice should not be shown.
	 *
	 * @covers WPSEO_Ryte::__construct
	 * @covers WPSEO_Ryte::should_show_notice
	 */
	public function test_should_show_notice_disabled() {
		$instance = new WPSEO_Ryte_Double();

		$this->assertFalse( $instance->should_show_notice() );
	}

	/**
	 * Tests whether Ryte is not indexable and enabled, the notice should be shown.
	 *
	 * @covers WPSEO_Ryte::__construct
	 * @covers WPSEO_Ryte::should_show_notice
	 */
	public function test_should_show_notice() {
		$option = new Ryte_Option_Mock( true, WPSEO_Ryte_Option::IS_NOT_INDEXABLE, true );
		update_option( 'blog_public', 1 );

		$instance = $this->getMockBuilder('WPSEO_Ryte_Double')
			->setMethods( [ 'get_option' ] )
			->getMock();

		$instance->expects( $this->atLeastOnce() )
			->method( 'get_option' )
			->will( $this->returnValue( $option ) );

		$this->assertTrue( $instance->should_show_notice() );
	}

	/**
	 * Tests whether Ryte is not indexable and enabled, the notice should be shown.
	 *
	 * @covers WPSEO_Ryte::__construct
	 * @covers WPSEO_Ryte::should_show_notice
	 */
	public function test_should_not_show_notice() {
		// Disable Ryte.
		$option = new Ryte_Option_Mock( false, WPSEO_Ryte_Option::IS_NOT_INDEXABLE, true );

		// Set blog to public.
		update_option( 'blog_public', 1 );

		$instance = $this->getMockBuilder('WPSEO_Ryte_Double')
			->setMethods( [ 'get_option' ] )
			->getMock();

		$instance->expects( $this->atLeastOnce() )
			->method( 'get_option' )
			->will( $this->returnValue( $option ) );

		$this->assertFalse( $instance->should_show_notice(), 'The notice should not be shown when disabled.' );
	}

	/**
	 * Tests if the notice control is hooked.
	 *
	 * @covers WPSEO_Ryte::register_hooks
	 */
	public function test_notification_hooks_should_be_hooked() {
		$ryte = new WPSEO_Ryte();
		$ryte->register_hooks();

		$this->assertNotFalse( has_action( 'admin_init', [ $ryte, 'show_notice' ] ) );
	}

	/**
	 * Tests if not active is based on the option.
	 *
	 * @covers WPSEO_Ryte::is_active
	 */
	public function test_is_not_active() {
		WPSEO_Options::set( 'onpage_indexability', false );

		$this->assertFalse( WPSEO_Ryte::is_active() );
	}

	/**
	 * Tests if active is based on the option.
	 *
	 * @covers WPSEO_Ryte::is_active
	 */
	public function test_is_active() {
		WPSEO_Options::set( 'onpage_indexability', true );

		$this->assertTrue( WPSEO_Ryte::is_active() );
	}

	/**
	 * Tests if the cronjob is scheduled when enabled.
	 *
	 * @covers WPSEO_Ryte::activate_hooks
	 * @covers WPSEO_Ryte::schedule_cron
	 * @covers WPSEO_Ryte::unschedule_cron
	 */
	public function test_cron_scheduling() {
		WPSEO_Options::set( 'onpage_indexability', true );

		$this->assertFalse( wp_next_scheduled( 'wpseo_ryte_fetch' ) );

		$instance = new WPSEO_Ryte();
		$instance->activate_hooks();

		$this->assertNotFalse( wp_next_scheduled( 'wpseo_ryte_fetch' ) );

		// Disable the option.
		WPSEO_Options::set( 'onpage_indexability', false );

		$instance->activate_hooks();

		// The cron should be removed.
		$this->assertFalse( wp_next_scheduled( 'wpseo_ryte_fetch' ) );
	}
}
