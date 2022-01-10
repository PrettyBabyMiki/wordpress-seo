<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Actions\Importing;

use Yoast\WP\SEO\Actions\Importing\Abstract_Importing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Services\Importing\Aioseo_Replacevar_Handler;
use Yoast\WP\SEO\Services\Importing\Aioseo_Robots_Service;

/**
 * Class Abstract_Importing_Action_Double
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Importing_Action_Double extends Abstract_Importing_Action {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * The replacevar handler.
	 *
	 * @var Aioseo_Replacevar_Handler
	 */
	protected $replacevar_handler;

	/**
	 * The robots service.
	 *
	 * @var Aioseo_Robots_Service
	 */
	protected $robots;

	/**
	 * Abstract_Importing_Action_Double constructor.
	 *
	 * @param Options_Helper            $options            The options helper.
	 * @param Aioseo_Replacevar_Handler $replacevar_handler The replacevar handler.
	 * @param Aioseo_Robots_Service     $robots             The robots service.
	 *
	 * @return string The completed id.
	 */
	public function __construct(
		Options_Helper $options,
		Aioseo_Replacevar_Handler $replacevar_handler,
		Aioseo_Robots_Service $robots
	) {
		return parent::__construct( $options, $replacevar_handler, $robots );
	}

	/**
	 * Gets the completed id (to be used as a key for the importing_completed option).
	 *
	 * @return string The completed id.
	 */
	public function get_completed_id() {
		return parent::get_completed_id();
	}

	/**
	 * Returns the stored state of completedness.
	 *
	 * @return int The stored state of completedness.
	 */
	public function get_completed() {
		return parent::get_completed();
	}

	/**
	 * Stores the current state of completedness.
	 *
	 * @param bool $completed Whether the importer is completed.
	 *
	 * @return void.
	 */
	public function set_completed( $completed ) {
		parent::set_completed( $completed );
	}
}
