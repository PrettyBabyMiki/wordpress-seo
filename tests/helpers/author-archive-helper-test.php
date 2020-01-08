<?php

namespace Yoast\WP\SEO\Tests\Helpers;

use Brain\Monkey;
use Mockery;
use WPSEO_Language_Utils;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Tests\Doubles\Shortlinker;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @group helpers
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Author_Archive_Helper
 */
class Author_Archive_Helper_Test extends TestCase {

	/**
	 * @var Author_Archive_Helper
	 */
	private $instance;

	public function setUp() {
		parent::setUp();

		$this->instance = new Author_Archive_Helper();
	}

	/**
	 * Tests whether the wpseo_author_archive_post_types filter is applied properly.
	 *
	 * @covers ::get_author_archive_post_types
	 */
	public function test_get_author_archive_post_types_apply_filter() {
		Monkey\Filters\expectApplied( 'wpseo_author_archive_post_types' )
			->once();

		$expected = [ 'post' ];

		$this->assertEquals( $expected, $this->instance->get_author_archive_post_types() );
	}
}
