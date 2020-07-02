<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Routes
 */

namespace Yoast\WP\SEO\Tests\Routes;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Semrush\SEMrush_Login_Action;
use Yoast\WP\SEO\Routes\SEMrush_Route;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class SEMrush_Route_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\SEMrush_Route
 *
 * @group routes
 * @group semrush
 */
class SEMrush_Route_Test extends TestCase {

	/**
	 * Represents the login action.
	 *
	 * @var Mockery\MockInterface|SEMrush_Login_Action
	 */
	protected $login_action;

	/**
	 * Represents the instance to test.
	 *
	 * @var SEMrush_Route
	 */
	protected $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->login_action = Mockery::mock( SEMrush_Login_Action::class );
		$this->instance     = new SEMrush_Route( $this->login_action );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeInstanceOf( SEMrush_Login_Action::class, 'login_action', $this->instance );
	}

	/**
	 * Tests the retrieval of the conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [], SEMrush_Route::get_conditionals() );
	}

	/**
	 * Tests the registration of the routes.
	 *
	 * @covers ::register_routes
	 */
	public function test_register_routes() {
		Monkey\Functions\expect( 'register_rest_route' )
			->with(
				'yoast/v1',
				'semrush/authenticate',
				[
					'methods'  => 'POST',
					'callback' => [ $this->instance, 'authenticate' ],
					'args'     => [
						'code' => [
							'validate_callback' => [ $this->instance, 'has_code' ],
							'required'          => true,
						],
					],
				]
			);

		$this->instance->register_routes();
	}

	/**
	 * Tests the code is a valid code, with invalid code given as input.
	 *
	 * @covers ::has_valid_code
	 */
	public function test_is_valid_code_with_invalid_code_given() {
		$this->assertFalse( $this->instance->has_valid_code( '' ) );
	}

	/**
	 * Tests the code is a valid code, with valid code given as input.
	 *
	 * @covers ::has_valid_code
	 */
	public function test_is_valid_code_with_valid_code_given() {
		$this->assertTrue( $this->instance->has_valid_code( '123456' ) );
	}

	/**
	 * Tests the authentication route.
	 *
	 * @covers ::authenticate
	 */
	public function test_authenticate() {
		$request = Mockery::mock( 'WP_REST_Request', 'ArrayAccess' );
		$request
			->expects( 'offsetGet' )
			->with( 'code' )
			->andReturn( '123456' );

		$this->login_action
			->expects( 'authenticate' )
			->with( '123456' )
			->andReturn( (object) [ 'status' => '200' ] );

		Mockery::mock( 'overload:WP_REST_Response' );

		$this->assertInstanceOf( 'WP_REST_Response', $this->instance->authenticate( $request ) );
	}
}
