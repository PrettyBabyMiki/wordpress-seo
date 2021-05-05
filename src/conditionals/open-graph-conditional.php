<?php

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Conditional that is only met when the Open Graph feature is enabled.
 */
class Open_Graph_Conditional implements Conditional {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Open_Graph_Conditional constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * Returns `true` when the Open Graph feature is enabled.
	 *
	 * @return boolean `true` when the Open Graph feature is enabled.
	 */
	public function is_met() {
		return $this->options->get( 'opengraph' ) === true;
	}
}
