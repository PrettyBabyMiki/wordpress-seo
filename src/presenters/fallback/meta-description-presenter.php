<?php
/**
 * Fallback presenter of the meta description.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters\Fallback;

use WPSEO_Replace_Vars;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Abstract_Meta_Description_Presenter;

class Meta_Description_Presenter extends Abstract_Meta_Description_Presenter {

	/**
	 * Generates the meta description for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The meta description.
	 */
	protected function generate( Indexable $indexable ) {
		if ( $indexable->description ) {
			return $indexable->description;
		}

		return '';
	}
}
