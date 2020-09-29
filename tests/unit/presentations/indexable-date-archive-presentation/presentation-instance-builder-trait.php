<?php

namespace Yoast\WP\SEO\Tests\Unit\Presentations\Indexable_Date_Archive_Presentation;

use Mockery;
use Yoast\WP\SEO\Helpers\Pagination_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Date_Archive_Presentation;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Presentations\Presentation_Instance_Dependencies;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {
	use Presentation_Instance_Dependencies;

	/**
	 * Represents the indexable mock.
	 *
	 * @var Indexable_Mock
	 */
	protected $indexable;

	/**
	 * Represents the instance to test.
	 *
	 * @var Indexable_Date_Archive_Presentation
	 */
	protected $instance;

	/**
	 * Builds an instance of Indexable_Post_Type_Presentation.
	 */
	protected function set_instance() {
		$this->indexable = new Indexable_Mock();

		$this->pagination = Mockery::mock( Pagination_Helper::class );

		$instance = new Indexable_Date_Archive_Presentation( $this->pagination );

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
	}
}
