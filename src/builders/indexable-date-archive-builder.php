<?php
/**
 * Date Archive Builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Formats the date archive meta to indexable format.
 */
class Indexable_Date_Archive_Builder {

	/**
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Indexable_Date_Archive_Builder constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct(
		Options_Helper $options
	) {
		$this->options = $options;
	}

	/**
	 * Formats the data.
	 *
	 * @param \Yoast\WP\SEO\Models\Indexable $indexable The indexable to format.
	 *
	 * @return \Yoast\WP\SEO\Models\Indexable The extended indexable.
	 */
	public function build( $indexable ) {
		$indexable->object_type       = 'date-archive';
		$indexable->title             = $this->options->get( 'title-archive-wpseo' );
		$indexable->breadcrumb_title  = $this->options->get( 'breadcrumbs-archiveprefix' );
		$indexable->description       = $this->options->get( 'metadesc-archive-wpseo' );
		$indexable->is_robots_noindex = $this->options->get( 'noindex-archive-wpseo' );

		return $indexable;
	}
}
