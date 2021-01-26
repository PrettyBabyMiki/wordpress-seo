<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc;

use Brain\Monkey;
use Mockery;
use WPSEO_Health_Check_Curl_Version;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group health-check
 */
class Health_Check_Curl_Version_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Mockery\Mock|WPSEO_Health_Check_Curl_Version
	 */
	private $instance;

	/**
	 * Set up the class which will be tested.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->instance = Mockery::mock( WPSEO_Health_Check_Curl_Version::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();
	}

	/**
	 * Tests the run method returns early when no premium plugins are installed.
	 *
	 * @covers WPSEO_Health_Check_Curl_Version::run
	 */
	public function test_run_with_no_premium_plugins() {
		$this->instance
			->expects( 'has_premium_plugins_installed' )
			->once()
			->andReturnFalse();

		$this->instance->run();

		// We just want to verify that the label is empty because the health check test didn't run.
		$this->assertEquals( '', $this->getPropertyValue( $this->instance, 'label' ) );
	}

	/**
	 * Tests the run method when the MyYoast API is not reachable and the cURL version is up-to-date.
	 *
	 * @covers WPSEO_Health_Check_Curl_Version::run
	 * @covers WPSEO_Health_Check_Curl_Version::is_recent_curl_version
	 */
	public function test_run_with_myyoast_api_not_reachable_and_updated_curl_version() {
		$this->instance
			->expects( 'has_premium_plugins_installed' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'is_my_yoast_api_reachable' )
			->once()
			->andReturnFalse();

		// Note: as of January 2020, the most recent cURL version is 7.67.0.
		$this->instance
			->expects( 'get_curl_version' )
			->once()
			->andReturn( '7.60.0' );

		Monkey\Functions\expect( 'add_query_arg' )->andReturn( '' );

		$this->instance->run();

		// We want to verify that the label attribute is the "not passed" message.
		$this->assertEquals(
			'Yoast premium plugins cannot update',
			$this->getPropertyValue( $this->instance, 'label' )
		);

		// We want to verify that the status attribute is "critical".
		$this->assertEquals( 'critical', $this->getPropertyValue( $this->instance, 'status' ) );
	}

	/**
	 * Tests the run method when the MyYoast API is not reachable and the cURL version is outdated.
	 *
	 * @covers WPSEO_Health_Check_Curl_Version::run
	 * @covers WPSEO_Health_Check_Curl_Version::is_recent_curl_version
	 */
	public function test_run_with_myyoast_api_not_reachable_and_outdated_curl_version() {
		$this->instance
			->expects( 'has_premium_plugins_installed' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'is_my_yoast_api_reachable' )
			->twice()
			->andReturnFalse();

		// Note: as of January 2020, the most recent cURL version is 7.67.0.
		$this->instance
			->expects( 'get_curl_version' )
			->twice()
			->andReturn( '7.10.0' );

		Monkey\Functions\expect( 'add_query_arg' )->andReturn( '' );

		$this->instance->run();

		// We want to verify that the label attribute is the "not passed" message.
		$this->assertEquals(
			'Yoast premium plugins cannot update',
			$this->getPropertyValue( $this->instance, 'label' )
		);

		// We want to verify that the status attribute is "critical".
		$this->assertEquals( 'critical', $this->getPropertyValue( $this->instance, 'status' ) );
	}

	/**
	 * Tests the run method when the MyYoast API is reachable.
	 *
	 * @covers WPSEO_Health_Check_Curl_Version::run
	 */
	public function test_run_with_myyoast_api_reachable() {
		$this->instance
			->expects( 'has_premium_plugins_installed' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'is_my_yoast_api_reachable' )
			->twice()
			->andReturnTrue();

		$this->instance->run();

		// We just want to verify that the label attribute is the "passed" message.
		$this->assertEquals(
			'Yoast premium plugin updates work fine',
			$this->getPropertyValue( $this->instance, 'label' )
		);
	}
}
