<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\SEO\Conditionals;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Conditional that is only met when sitemaps are enabled.
 */
class Sitemaps_Enabled_Conditional implements Conditional {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Sitemaps_Enabled_Conditional constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * @inheritDoc
	 */
	public function is_met() {
		return $this->options->get( 'enable_xml_sitemap' );
	}
}
