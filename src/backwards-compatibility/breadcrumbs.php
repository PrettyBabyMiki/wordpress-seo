<?php
/**
 * Backwards compatibility class for breadcrumbs.
 *
 * @package Yoast\YoastSEO\Backwards_Compatibility
 */

use Yoast\WP\Free\Conditionals\Front_End_Conditional;
use Yoast\WP\Free\Initializers\Initializer_Interface;
use Yoast\WP\Free\Memoizer\Meta_Tags_Context_Memoizer;
use Yoast\WP\Free\Presenters\Breadcrumbs_Presenter;

/**
 * Class WPSEO_Breadcrumbs
 */
class WPSEO_Breadcrumbs implements Initializer_Interface {

	/**
	 * Instance of this class.
	 *
	 * @var WPSEO_Breadcrumbs
	 */
	public static $instance;

	/**
	 * Last used 'before' string.
	 *
	 * @var string
	 */
	public static $before = '';

	/**
	 * Last used 'after' string.
	 *
	 * @var string
	 */
	public static $after = '';

	/**
	 * The memoizer for the meta tags context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $context_memoizer;

	/**
	 * Breadcrumbs presenter.
	 *
	 * @var Breadcrumbs_Presenter
	 */
	private $presenter;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * WPSEO_Breadcrumbs constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer $context_memoizer The context memoizer.
	 * @param Breadcrumbs_Presenter      $presenter        The breadcrumbs presenter.
	 */
	public function __construct(
		Meta_Tags_Context_Memoizer $context_memoizer,
		Breadcrumbs_Presenter $presenter
	) {
		$this->context_memoizer = $context_memoizer;
		$this->presenter        = $presenter;
	}

	/**
	 * We use an initializer so the static functions will work right as our plugin is loaded just as they normally would.
	 */
	public function initialize() {
		self::$instance = $this;
	}

	/**
	 * Get breadcrumb string using the singleton instance of this class.
	 *
	 * @param string $before  Optional string to prepend.
	 * @param string $after   Optional string to append.
	 * @param bool   $display Echo or return flag.
	 *
	 * @return string Returns the breadcrumbs as a string.
	 */
	public static function breadcrumb( $before = '', $after = '', $display = true ) {
		// Remember the last used before/after for use in case the object goes __toString().
		self::$before = $before;
		self::$after  = $after;
		$output       = $before . self::$instance->render() . $after;

		if ( $display === true ) {
			echo $output;

			return '';
		}

		return $output;
	}

	/**
	 * Magic method to use in case the class would be send to string.
	 *
	 * @return string The rendered breadcrumbs.
	 */
	public function __toString() {
		return self::$before . $this->render() . self::$after;
	}

	/**
	 * Retrieves an instance of the class.
	 *
	 * @return WPSEO_Breadcrumbs The instance.
	 */
	public static function get_instance() {
		return self::$instance;
	}

	/**
	 * Returns the collected links for the breadcrumbs.
	 *
	 * @return array The collected links.
	 */
	public function get_links() {
		$context = $this->context_memoizer->for_current_page();

		return $context->presentation->breadcrumbs;
	}

	/**
	 * Renders the breadcrumbs.
	 *
	 * @return string The rendered breadcrumbs.
	 */
	private function render() {
		$context = $this->context_memoizer->for_current_page();

		return $this->presenter->present( $context->presentation );
	}
}
