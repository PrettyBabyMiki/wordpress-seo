<?php
/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\Free\Tests\Presenters;

use Brain\Monkey;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Canonical_Presenter;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Canonical_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Canonical_Presenter
 *
 * @group presenters
 * @group canonical
 */
class Canonical_Presenter_Test extends TestCase {

	/**
	 * Tests the presenter of the canonical.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present() {
		$instance     = new Canonical_Presenter();
		$presentation = new Indexable_Presentation();

		$presentation->canonical = 'https://permalink';
		$presentation->robots    = [];

		$this->assertEquals(
			'<link rel="canonical" href="https://permalink" />',
			$instance->present( $presentation )
		);
	}

	/**
	 * Tests the presenter of the canonical when it's empty.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_empty() {
		$instance     = new Canonical_Presenter();
		$presentation = new Indexable_Presentation();

		$presentation->canonical = '';
		$presentation->robots    = [];

		$this->assertEmpty( $instance->present( $presentation ) );
	}

	/**
	 * Tests the presenter of the canonical with filter.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_with_filter() {
		$instance     = new Canonical_Presenter();
		$presentation = new Indexable_Presentation();

		$presentation->canonical = 'https://permalink';
		$presentation->robots    = [];

		Monkey\Filters\expectApplied( 'wpseo_canonical' )
			->once()
			->with( 'https://permalink', $presentation )
			->andReturn( 'https://filtered' );

		$this->assertEquals(
			'<link rel="canonical" href="https://filtered" />',
			$instance->present( $presentation )
		);
	}

	/**
	 * Tests the presenter of the canonical when robots is noindex.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_when_robots_is_noindex() {
		$instance     = new Canonical_Presenter();
		$presentation = new Indexable_Presentation();

		$presentation->canonical = 'https://permalink';
		$presentation->robots    = [ 'noindex' ];

		$this->assertEmpty( $instance->present( $presentation ) );
	}
}
