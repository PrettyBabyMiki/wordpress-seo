<?php

/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Inc
 */

/**
 * Unit Test Class.
 *
 * @group test
 */
class WPSEO_Addon_Manager_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests retrieval of site information that will return the defaults.
	 *
	 * @covers WPSEO_Addon_Manager::get_site_information
	 */
	public function test_get_site_information_return_defaults() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'request_current_sites' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'request_current_sites' )
			->will( $this->returnValue( false ) );

		$this->assertEquals(
			(object) array(
				'url'           => WPSEO_Utils::get_home_url(),
				'subscriptions' => array(),
			),
			$instance->get_site_information()
		);
	}

	/**
	 * Tests retrieval of the site information that will return the api request value.
	 *
	 * @covers WPSEO_Addon_Manager::get_site_information
	 */
	public function test_get_site_information_return_api_request_value() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'request_current_sites' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'request_current_sites' )
			->will( $this->returnValue(
				(object) array(
					'url'           => 'https://example.org',
					'subscriptions' => array( 'subscription' ),
				)
			) );

		$this->assertEquals(
			(object) array(
				'url'           => 'https://example.org',
				'subscriptions' => array( 'subscription' ),
			),
			$instance->get_site_information()
		);
	}

	/**
	 * Tests retrieval of site information that will return the transient value.
	 *
	 * @covers WPSEO_Addon_Manager::get_site_information
	 */
	public function test_get_site_information_return_transient_value() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_site_information_transient' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_site_information_transient' )
			->will( $this->returnValue(
				(object) array(
					'url'           => 'https://example.org',
					'subscriptions' => array( 'subscription' ),
				)
			) );

		$this->assertEquals(
			(object) array(
				'url'           => 'https://example.org',
				'subscriptions' => array( 'subscription' ),
			),
			$instance->get_site_information()
		);
	}

	/**
	 * Tests retrieval of the subscriptions.
	 *
	 * @covers WPSEO_Addon_Manager::get_subscriptions
	 */
	public function test_get_subscriptions() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_site_information' ) )
			->getMock();

		$instance
			->expects( $this->once() )
			->method( 'get_site_information' )
			->will( $this->returnValue(
				(object) array(
					'url'           => 'https://example.org',
					'subscriptions' => array( 'subscription' ),
				)
			) );

		$this->assertEquals(
			array( 'subscription' ),
			$instance->get_subscriptions()
		);
	}

	/**
	 * Tests retrieval of a specific subscription.
	 *
	 * @covers WPSEO_Addon_Manager::get_subscription
	 */
	public function test_get_subscription() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions' ) )
			->getMock();

		$subscription = (object) array(
			'product' => (object) array(
				'slug' => 'wordpress-seo',
			),
		);

		$instance
			->expects( $this->once() )
			->method( 'get_subscriptions' )
			->will( $this->returnValue(
				(object) array(
					'wordpress-seo' => $subscription,
				)
			) );

		$this->assertEquals(
			$subscription,
			$instance->get_subscription( 'wordpress-seo' )
		);
	}

	/**
	 * Tests retrieval of an unexisting subscription.
	 *
	 * @covers WPSEO_Addon_Manager::get_subscription
	 */
	public function test_get_subscription_not_found() {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions' ) )
			->getMock();

		$subscription = (object) array(
			'product' => (object) array(
				'slug' => 'wordpress-seo',
			),
		);

		$instance
			->expects( $this->once() )
			->method( 'get_subscriptions' )
			->will( $this->returnValue(
				(object) array(
					'wordpress-seo' => $subscription,
				)
			) );

		$this->assertFalse( $instance->get_subscription( 'wordpress-seo-extra' ) );
	}

	/**
	 * Tests retrieval of the plugin information.
	 *
	 * @dataProvider get_plugin_information_provider
	 *
	 * @covers WPSEO_Addon_Manager::get_plugin_information
	 *
	 * @param string $action   The action to use.
	 * @param array  $args     The arguments to pass to the method.
	 * @param mixed  $expected Expected value.
	 * @param string $message  The message when test fails.
	 */
	public function test_get_plugin_information( $action, $args, $expected, $message ) {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_subscriptions' ) )
			->getMock();

		$instance
			->expects( $this->any() )
			->method( 'get_subscriptions' )
			->will( $this->returnValue( $this->get_subscriptions() ) );

		$this->assertEquals(
			$expected,
			$instance->get_plugin_information( false, $action, ( object ) $args ),
			$message
		);
	}

	/**
	 * Tests the check for updates when no data has been given.
	 *
	 * @dataProvider check_for_updates_provider
	 *
	 * @covers       WPSEO_Addon_Manager::check_for_updates
	 *
	 * @param array  $addons   The 'installed' addons.
	 * @param array  $data     Data being send to the method.
	 * @param mixed  $expected The expecte value.
	 * @param string $message  Message to show when test fails.
	 */
	public function test_check_for_updates( $addons, $data, $expected, $message ) {
		$instance = $this
			->getMockBuilder( 'WPSEO_Addon_Manager' )
			->setMethods( array( 'get_installed_addons', 'get_subscriptions' ) )
			->getMock();

		$instance
			->expects( $this->any() )
			->method( 'get_installed_addons' )
			->will( $this->returnValue( $addons ) );

		$instance
			->expects( $this->any() )
			->method( 'get_subscriptions' )
			->will( $this->returnValue( $this->get_subscriptions() ) );

		$this->assertEquals( $expected, $instance->check_for_updates( $data ), $message );
	}

	/**
	 * Tests checking if given value is a Yoast addon.
	 *
	 * @covers WPSEO_Addon_Manager::is_yoast_addon
	 */
	public function test_is_yoast_addon() {
		$instance = new WPSEO_Addon_Manager_Double();

		$this->assertTrue( $instance->is_yoast_addon( 'wp-seo-premium.php' ) );
		$this->assertFalse( $instance->is_yoast_addon( 'non-wp-seo-addon.php' ) );
	}

	/**
	 * Tests retrieval of slug for given plugin file.
	 *
	 * @covers WPSEO_Addon_Manager::get_slug_by_plugin_file
	 */
	public function test_get_slug_by_plugin_file() {
		$instance = new WPSEO_Addon_Manager_Double();

		$this->assertEquals( 'yoast-seo-wordpress-premium', $instance->get_slug_by_plugin_file( 'wp-seo-premium.php' ) );
		$this->assertEquals( '', $instance->get_slug_by_plugin_file( 'non-wp-seo-addon.php' ) );
	}

	/**
	 * Tests the conversion from a subscription to a plugin array.
	 *
	 * @covers WPSEO_Addon_Manager::convert_subscription_to_plugin
	 */
	public function test_convert_subscription_to_plugin() {
		$instance = new WPSEO_Addon_Manager_Double();

		$this->assertEquals(
			(object) array(
				'new_version'   => '10.0',
				'name'          => 'Extension',
				'slug'          => 'yoast-seo-wordpress-premium',
				'url'           => 'https://example.org/extension',
				'last_update'   => 'yesterday',
				'homepage'      => 'https://example.org/store',
				'download_link' => 'https://example.org/extension.zip',
				'sections'      => 	array(
					'changelog' => 'changelog',
				),
			),
			$instance->convert_subscription_to_plugin(
				(object) array(
					'product' => (object) array(
						'version'     => '10.0',
						'name'        => 'Extension',
						'slug'        => 'yoast-seo-wordpress-premium',
						'url'         => 'https://example.org/extension',
						'lastUpdated' => 'yesterday',
						'storeUrl'    => 'https://example.org/store',
						'download'    => 'https://example.org/extension.zip',
						'changelog'   => 'changelog',
					),
				)
			)
		);

	}

	/**
	 * Provides data to the check_for_updates test.
	 *
	 * @return array Values for the test.
	 */
	public function check_for_updates_provider() {
		return array(
			array(
				'addons'   => array(),
				'data'     => false,
				'expected' => false,
				'message'  => 'Tests with false given as data',
			),
			array(
				'addons'   => array(),
				'data'     => array(),
				'expected' => array(),
				'message'  => 'Tests with empty array given as data',
			),
			array(
				'addons'   => array(),
				'data'     => null,
				'expected' => null,
				'message'  => 'Tests with null given as data',
			),
			array(
				'addons'   => array(),
				'data'     => (object) array( 'response' => array() ),
				'expected' => (object) array( 'response' => array() ),
				'message'  => 'Tests with no installed addons',
			),
			array(
				'addons'   => array(
					array(
						'wpseo-news.php' => array(
							'Version' => '9.5'
						),
					),

				),
				'data'     => (object) array( 'response' => array() ),
				'expected' => (object) array( 'response' => array() ),
				'message'  => 'Tests an addon without a subscription',
			),
			array(
				'addons'   => array(
					array(
						'wps-seo-premium.php' => array(
							'Version' => '10.0'
						),
					),
				),
				'data'     => (object) array( 'response' => array() ),
				'expected' => (object) array( 'response' => array() ),
				'message'  => 'Tests an addon with a subscription and no updates available',
			),
			array(
				'addons'   => array(
					'wp-seo-premium.php' => array(
						'Version' => '9.0'
					),
				),
				'data'     => (object) array( 'response' => array() ),
				'expected' => (object) array(
					'response' => array(
						'wp-seo-premium.php' => (object) array(
							'new_version'   => '10.0',
							'name'          => 'Extension',
							'slug'          => 'yoast-seo-wordpress-premium',
							'url'           => 'https://example.org/extension',
							'last_update'   => 'yesterday',
							'homepage'      => 'https://example.org/store',
							'download_link' => 'https://example.org/extension.zip',
							'sections'      => 	array(
									'changelog' => 'changelog',
							),
						)
					)
				),
				'message'  => 'Tests an addon with a subscription and an update available',
			),
		);
	}

	/**
	 * Provides data to the get_plugin_information test.
	 *
	 * @return array Values for the test.
	 */
	public function get_plugin_information_provider() {
		return array(
			array(
				'action'   => 'wrong_action',
				'args'     => array(),
				'expected' => false,
				'message'  => 'Tests with an unexpected action.',
			),
			array(
				'action'   => 'plugin_information',
				'args'     => array(),
				'expected' => false,
				'message'  => 'Tests with slug missing in the arguments.',
			),
			array(
				'action'   => 'plugin_information',
				'args'     => array( 'slug' => 'unkown_slug' ),
				'expected' => false,
				'message'  => 'Tests with a non yoast addon slug given as argument.',
			),
			array(
				'action'   => 'plugin_information',
				'args'     => array( 'slug' => 'yoast-seo-wordpress-premium' ),
				'expected' => (object) array(
					'new_version'   => '10.0',
					'name'          => 'Extension',
					'slug'          => 'yoast-seo-wordpress-premium',
					'url'           => 'https://example.org/extension',
					'last_update'   => 'yesterday',
					'homepage'      => 'https://example.org/store',
					'download_link' => 'https://example.org/extension.zip',
					'sections'      => 	array(
						'changelog' => 'changelog',
					),
				),
				'message'  => 'Tests with a yoast addon slug given as argument.',
			),
		);
	}

	/**
	 * Returns a list of 'subscription'.
	 *
	 * Created this method to keep a good readability.
	 *
	 * @return stdClass Subscriptions.
	 */
	protected function get_subscriptions() {
		return json_decode(
			json_encode(
				array(
					'wp-seo-premium.php' => array(
						'product' => array(
							'version'     => '10.0',
							'name'        => 'Extension',
							'slug'        => 'yoast-seo-wordpress-premium',
							'url'         => 'https://example.org/extension',
							'lastUpdated' => 'yesterday',
							'storeUrl'    => 'https://example.org/store',
							'download'    => 'https://example.org/extension.zip',
							'changelog'   => 'changelog',
						),
					),
				)
			)
		);
	}

}