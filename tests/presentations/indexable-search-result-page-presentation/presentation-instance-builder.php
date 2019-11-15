<?php

namespace Yoast\WP\Free\Tests\Presentations\Indexable_Search_Result_Page_Presentation;

use Yoast\WP\Free\Presentations\Indexable_Search_Result_Page_Presentation;
use Yoast\WP\Free\Tests\Mocks\Indexable;
use Yoast\WP\Free\Tests\Presentations\Presentation_Instance_Dependencies;

/**
 * Trait Presentation_Instance_Builder
 */
trait Presentation_Instance_Builder {
	use Presentation_Instance_Dependencies;

	/**
	 * @var Indexable
	 */
	protected $indexable;

	/**
	 * @var Indexable_Search_Result_Page_Presentation
	 */
	protected $instance;

	/**
	 * Builds an instance of Indexable_Search_Result_Page_Presentation.
	 */
	protected function set_instance() {
		$this->indexable = new Indexable();

		$instance = new Indexable_Search_Result_Page_Presentation();

		$this->instance = $instance->of( [ 'model' => $this->indexable ] );

		$this->set_instance_dependencies( $this->instance );
	}
}
