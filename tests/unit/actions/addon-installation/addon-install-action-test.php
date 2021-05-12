<?php

namespace Yoast\WP\SEO\Tests\Unit\Actions\Addon_Installation;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Actions\Addon_Installation\Addon_Install_Action;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Exceptions\Addon_Installation\User_Cannot_Install_Plugins;
use Yoast\WP\SEO\Exceptions\Addon_Installation\Addon_Already_Installed_Exception;
use Yoast\WP\SEO\Exceptions\Addon_Installation\Addon_Installation_Error_Exception;
use Yoast\WP\SEO\Helpers\Require_File_Helper;

class Addon_Install_Action_Test extends TestCase {

	/**
	 * The wpseo addon manager.
	 *
	 * @var Mockery\MockInterface|\WPSEO_Addon_Manager
	 */
	protected $wpseo_addon_manager;

	/**
	 * The require file helper.
	 *
	 * @var Mockery\MockInterface|Require_File_Helper;
	 */
	protected $require_file_helper;

	/**
	 * The instance to test.
	 *
	 * @var Addon_Install_Action
	 */
	protected $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->wpseo_addon_manager = Mockery::mock( \WPSEO_Addon_Manager::class );
		$this->require_file_helper = Mockery::mock( Require_File_Helper::class );
		$this->instance            = new Addon_Install_Action( $this->wpseo_addon_manager, $this->require_file_helper );
	}

	public function test_install_addon_user_has_no_install_permissions() {

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'install_plugins' )
			->andReturn( false );

		$this->expectException( User_Cannot_Install_Plugins::class );

		$this->instance->install_addon( 'plugin_slug', 'download.test' );
	}

	public function test_install_addon_is_already_installed() {

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'install_plugins' )
			->andReturn( true );

		$this->wpseo_addon_manager
			->shouldReceive( 'get_plugin_file' )
			->once()
			->with( 'plugin_slug' )
			->andReturn( true );


		$this->expectException( Addon_Already_Installed_Exception::class );

		$this->instance->install_addon( 'plugin_slug', 'download.test' );
	}

	public function test_install_addon_thows_when_install_fails() {

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'install_plugins' )
			->andReturn( true );

		$this->wpseo_addon_manager
			->expects( 'get_plugin_file' )
			->once()
			->with( 'plugin_slug' )
			->andReturn( false );

		$this->require_file_helper
			->expects( 'require_file_once' )
			->once()
			->with( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );

		$this->require_file_helper
			->expects( 'require_file_once' )
			->never()
			->with( ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php' );

		$this->require_file_helper
			->expects( 'require_file_once' )
			->once()
			->with( ABSPATH . 'wp-admin/includes/class-wp-upgrader-skin.php' );

		$this->require_file_helper
			->expects( 'require_file_once' )
			->once()
			->with( ABSPATH . 'wp-admin/includes/plugin.php' );

		$this->require_file_helper
			->expects( 'require_file_once' )
			->once()
			->with( ABSPATH . 'wp-admin/includes/file.php' );

		$wp_error = Mockery::mock( \WP_Error::class );

		$wp_error
			->expects( 'get_error_message' )
			->once();

		$plugin_upgrader = Mockery::mock( 'overload:' . \Plugin_Upgrader::class );

		$plugin_upgrader
			->expects( 'install' )
			->once()
			->with( 'download.test' )
			->andReturn( $wp_error );

		$this->expectException( Addon_Installation_Error_Exception::class );

		$this->instance->install_addon( 'plugin_slug', 'download.test' );
	}

	public function test_install_addon() {

		Monkey\Functions\expect( 'current_user_can' )
			->once()
			->with( 'install_plugins' )
			->andReturn( true );

		$this->wpseo_addon_manager
			->expects( 'get_plugin_file' )
			->once()
			->with( 'plugin_slug' )
			->andReturn( false );

		$this->require_file_helper
			->expects( 'require_file_once' )
			->once()
			->with( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );

		$this->require_file_helper
			->expects( 'require_file_once' )
			->never()
			->with( ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php' );

		$this->require_file_helper
			->expects( 'require_file_once' )
			->once()
			->with( ABSPATH . 'wp-admin/includes/class-wp-upgrader-skin.php' );

		$this->require_file_helper
			->expects( 'require_file_once' )
			->once()
			->with( ABSPATH . 'wp-admin/includes/plugin.php' );

		$this->require_file_helper
			->expects( 'require_file_once' )
			->once()
			->with( ABSPATH . 'wp-admin/includes/file.php' );

		$plugin_upgrader = Mockery::mock( 'overload:' . \Plugin_Upgrader::class );

		$plugin_upgrader
			->expects( 'install' )
			->once()
			->with( 'download.test' )
			->andReturn( true );

		$actual = $this->instance->install_addon( 'plugin_slug', 'download.test' );

		$this->assertTrue( $actual );
	}
}
