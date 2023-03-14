<?php

namespace Yoast\WP\SEO\Tests\Unit\Initializers;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Initializers\Crawl_Cleanup_Permalinks;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Redirect_Helper;


/**
 * Class Crawl_Cleanup_Permalinks_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Initializers\Crawl_Cleanup_Permalinks
 *
 * @group integrations
 */
class Crawl_Cleanup_Permalinks_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Crawl_Cleanup_Permalinks
	 */
	private $instance;

	/**
	 * The current page helper
	 *
	 * @var Mockery\MockInterface
	 */
	private $current_page_helper;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface
	 */
	private $options_helper;

	/**
	 * The URL helper.
	 *
	 * @var Mockery\MockInterface
	 */
	private $url_helper;

	/**
	 * The Redirect helper.
	 *
	 * @var Mockery\MockInterface
	 */
	private $redirect_helper;

	/**
	 * Sets up the tests.
	 *
	 * @covers ::__construct
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();
		$this->stubTranslationFunctions();

		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );
		$this->options_helper      = Mockery::mock( Options_Helper::class );
		$this->url_helper          = Mockery::mock( Url_Helper::class );
		$this->redirect_helper     = Mockery::mock( Redirect_Helper::class );

		$this->instance = new Crawl_Cleanup_Permalinks(
			$this->current_page_helper,
			$this->options_helper,
			$this->url_helper,
			$this->redirect_helper
		);
	}

	/**
	 * Tests the initialization.
	 *
	 * @covers ::initialize
	 */
	public function test_initialize() {
		Monkey\Actions\expectAdded( 'plugins_loaded' )
				->with( [ $this->instance, 'register_hooks' ] )
				->times( 1 );
		$this->instance->initialize();
	}

	/**
	 * Tests register_hooks.
	 *
	 * @covers ::register_hooks
	 *
	 * @dataProvider register_hooks_provider
	 *
	 * @param string $permalink_structure permalink_structure value returned from get_option.
	 * @param string $campaign_tracking_urls Returned value from option_helper.
	 * @param string $clean_permalinks Returned value from option_helper.
	 * @param int    $expected_utm_redirect Is action fired.
	 * @param int    $expected_clean_permalinks Is action fired.
	 */
	public function test_register_hooks( $permalink_structure, $campaign_tracking_urls, $clean_permalinks, $expected_utm_redirect, $expected_clean_permalinks ) {

		Monkey\Functions\expect( 'get_option' )
			->with( 'permalink_structure' )
			->andReturn( $permalink_structure );

		$this->options_helper
			->expects( 'get' )
			->with( 'clean_campaign_tracking_urls' )
			->once()
			->andReturns( $campaign_tracking_urls );

		$this->options_helper
			->expects( 'get' )
			->with( 'clean_permalinks' )
			->once()
			->andReturns( $clean_permalinks );

		Monkey\Actions\expectAdded( 'template_redirect' )
			->with( [ $this->instance, 'utm_redirect' ] )
			->times( $expected_utm_redirect );

			Monkey\Actions\expectAdded( 'template_redirect' )
				->with( [ $this->instance, 'clean_permalinks' ] )
				->times( $expected_clean_permalinks );


		$this->instance->register_hooks();
	}

	/**
	 * Data provider for test_register_hooks.
	 *
	 * @return array
	 */
	public function register_hooks_provider() {
		return [
			[ null, 'returned_value_campaign_tracking_urls', 'returned_value_clean_permalinks', 0, 0 ],
			[ null, 'returned_value_campaign_tracking_urls', null, 0, 0 ],
			[ null, null, 'returned_value_clean_permalinks', 0, 0 ],
			[ null, null, null, 0, 0 ],
			[ 'permalink_structure_option', 'returned_value_clean_campaign_tracking_urls', 'returned_value_clean_permalinks', 1, 1 ],
			[ 'permalink_structure_option', null, 'returned_value_clean_permalinks', 0, 1 ],
			[ 'permalink_structure_option', 'returned_value_clean_campaign_tracking_urls', null, 1, 0 ],
		];
	}

	/**
	 * Tests get_conditionals.
	 *
	 * @covers ::get_conditionals
	 **/
	public function test_get_conditionals() {
		$this->assertEquals( [ Front_End_Conditional::class ], $this->instance->get_conditionals() );
	}

	/**
	 * Tests utm_redirect.
	 *
	 * @covers ::utm_redirect
	 *
	 * @dataProvider utm_redirect_provider
	 *
	 * @param string $request_uri $_SERVER['REQUEST_URI'].
	 * @param array  $wp_parse_url wp_parse_url return value.
	 * @param int    $is_wp_safe_redirect Is wp_safe_redirect called.
	 */
	public function test_utm_redirect( $request_uri, $wp_parse_url, $is_wp_safe_redirect ) {
		$_SERVER['REQUEST_URI'] = $request_uri;

		Monkey\Functions\expect( 'wp_parse_url' )
			->with( $request_uri )
			->andReturn( $wp_parse_url );

		Monkey\Functions\expect( 'trailingslashit' )
			->times( $is_wp_safe_redirect );

		$this->url_helper
			 ->expects( 'recreate_current_url' )
			 ->with( false )
			->times( $is_wp_safe_redirect )
			->andReturn( 'www.example.com/' );

		$this->redirect_helper
			->expects( 'do_safe_redirect' )
			->times( $is_wp_safe_redirect );

		$this->instance->utm_redirect();
	}

	/**
	 * Data provider for utm_redirect.
	 *
	 * @return array $_SERVER['REQUEST_URI'], wp_parse_url return value, is wp_safe_redirect.
	 */
	public function utm_redirect_provider() {
		return [
			[ null, null, 0 ],
			[ 'random_post_slug', null, 0 ],
			[ '/?page=1234', null, 0 ],
			[
				'/?page=4&testing=123utm_',
				[
					'path'  => '/',
					'query' => 'page=4&testing=123utm_',
				],
				0,
			],
			[
				'/?utm_medium=organic',
				[
					'path'  => '/',
					'query' => 'utm_medium=organic',
				],
				1,
			],
		];
	}

	/**
	 * Tests get_allowed_extravars.
	 *
	 * @covers ::get_allowed_extravars
	 *
	 * @dataProvider get_allowed_extravars_provider
	 *
	 * @param string $clean_permalinks_extra_variables return value.
	 * @param array  $permalink_vars.
	 * @param array  $expeted.
	 */
	public function test_get_allowed_extravars( $clean_permalinks_extra_variables, $permalink_vars, $expeted ) {

		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->with( 'Yoast\WP\SEO\allowlist_permalink_vars', [] )
			->andReturn( $permalink_vars );

		$this->options_helper
			->expects( 'get' )
			->with( 'clean_permalinks_extra_variables' )
			->once()
			->andReturn( $clean_permalinks_extra_variables );

		$this->assertSame( $expeted, $this->instance->get_allowed_extravars() );
	}

	/**
	 *
	 * Data provider for test_clean_permalinks.
	 *
	 * @return array avoid_redirect, expected.
	 */
	function get_allowed_extravars_provider() {
		return [
			[ 'variable1,variable2,variable3', [], [ 'variable1', 'variable2', 'variable3' ] ],
			[ '', [], [] ],
			[ 'variable1,variable2,variable3', [ 'variable4', 'variable5' ], [ 'variable4', 'variable5', 'variable1', 'variable2', 'variable3' ] ],
		];
	}

	/**
	 * Tests clean_permalinks_avoid_redirect.
	 *
	 * @covers ::clean_permalinks_avoid_redirect
	 *
	 * @dataProvider clean_permalinks_avoid_redirect_provider
	 *
	 * @param boolean $is_robots is_robots return value.
	 * @param string  $sitemap get_query_var return value.
	 * @param array   $get_response get_response value.
	 * @param boolean $is_user_logged_in is_user_logged_in return value.
	 * @param int     $expeted.
	 */
	public function test_clean_permalinks_avoid_redirect( $is_robots, $sitemap, $get_response, $is_user_logged_in, $expeted ) {

		$_GET = $get_response;

		Monkey\Functions\expect( 'is_robots' )
		->andReturn( $is_robots );

		Monkey\Functions\expect( 'get_query_var' )
			->with( 'sitemap' )
			->andReturn( $sitemap );

		Monkey\Functions\expect( 'is_user_logged_in' )
		->andReturn( $is_user_logged_in );

		$this->assertSame( $expeted, $this->instance->clean_permalinks_avoid_redirect() );
	}

	/**
	 *
	 * Data provider for test_clean_permalinks_avoid_redirect.
	 *
	 * @return array is_roboto, get_query_var( 'sitemap' ), $_GET, is_user_logged_in(), expected.
	 */
	public function clean_permalinks_avoid_redirect_provider() {
		return [
			[ true, false, null, false, true ],
			[ false, true, null, false, true ],
			[ false, false, null, true, true ],
			[ false, false, null, false, true ],
			[
				false,
				false,
				[
					'preview'       => 'random preview',
					'preview_nonce' => '1234',
				],
				false,
				false,
			],
		];
	}

	/**
	 * Tests front_page_url.
	 *
	 * @covers ::front_page_url
	 *
	 * @dataProvider front_page_url_provider
	 *
	 * @param boolean                                           $is_home_posts_page is_home_posts_page return value.
	 * @param boolean                                           $is_home_static_page is_home_static_page return value.
	 * @param int static_times is_home_static_page times called.
	 * @param int home_url_times home_url times called.
	 * @param int permalink_times get_permalink times called.
	 * @param string                                            $expected expected return value.
	 */
	public function test_front_page_url( $is_home_posts_page, $is_home_static_page, $static_times, $home_url_times, $permalink_times, $expected ) {

		$GLOBALS['post'] = (object) [ 'ID' => 5 ];

		$this->current_page_helper
			->expects( 'is_home_posts_page' )
			->once()
			->andReturn( $is_home_posts_page );

		Monkey\Functions\expect( 'home_url' )
			->with( '/' )
			->times( $home_url_times )
			->andReturn( 'http://basic.wordpress.test/' );

		$this->current_page_helper
			->expects( 'is_home_static_page' )
			->times( $static_times )
			->andReturn( $is_home_static_page );

		Monkey\Functions\expect( 'get_permalink' )
			->with( 5 )
			->times( $permalink_times )
			->andReturn( 'http://basic.wordpress.test/permalink' );

		$this->assertSame( $expected, $this->instance->front_page_url() );
	}

	/**
	 * Provider for test_front_page_url.
	 *
	 * @return array is_home_posts_page, is_home_static_page, static_times, home_url_times,permalink_times, expected.
	 */
	public function front_page_url_provider() {
		return [
			[ true, false, 0, 1, 0, 'http://basic.wordpress.test/' ],
			[ false, true, 1, 0, 1, 'http://basic.wordpress.test/permalink' ],
			[ false, false, 1, 0, 0, '' ],
		];
	}

	/**
	 * Tests clean_permalinks.
	 *
	 * @covers ::clean_permalinks
	 *
	 * @dataProvider clean_permalinks_provider
	 * @param bool $clean_permalinks_avoid_redirect
	 * @param int $expected
	 */
	// public function test_clean_permalinks( $clean_permalinks_avoid_redirect, $expected ){

	// $crawl_cleanup_permalinks = Mockery::mock( Crawl_Cleanup_Permalinks::class );
	// $crawl_cleanup_permalinks
	// ->expects( 'clean_permalinks_avoid_redirect' )
	// ->once()
	// ->andReturn( $clean_permalinks_avoid_redirect );

	// $this->redirect_helper
	// ->expects( 'do_safe_redirect' )
	// ->times( $expected );

	// $this->instance->clean_permalinks();
	// }

	/**
	 * Data provider for test_clean_permalinks.
	 *
	 * @return array clean_permalinks_avoid_redirect, expected.
	 */

	// public function clean_permalinks_provider(){
	// return [
	// [ true ,0 ],
	// ];
	// }
}
