<?php
/**
 * System page builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Formats system pages ( search and error ) meta to indexable format.
 */
class Indexable_System_Page_Builder {

	/**
	 * Mapping of object type to title option keys.
	 */
	const OPTION_MAPPING = [
		'search-result' => 'title-search-wpseo',
		'404'           => 'title-404-wpseo',
	];

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Indexable_System_Page_Builder constructor.
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
	 * @param string    $object_sub_type The object sub type of the system page.
	 * @param Indexable $indexable       The indexable to format.
	 *
	 * @return Indexable The extended indexable.
	 */
	public function build( $object_sub_type, Indexable $indexable ) {
		$indexable->object_type       = 'system-page';
		$indexable->object_sub_type   = $object_sub_type;
		$indexable->title             = $this->options->get( static::OPTION_MAPPING[ $object_sub_type ] );
		$indexable->is_robots_noindex = true;

		return $indexable;
	}
}
