<?php

namespace Yoast\WP\SEO\Presenters\Twitter;

use Yoast\WP\SEO\Presenters\Abstract_Cached_Indexable_Tag_Presenter;

/**
 * Presenter class for the Twitter creator.
 */
class Creator_Presenter extends Abstract_Cached_Indexable_Tag_Presenter {

	/**
	 * The tag key name.
	 *
	 * @var string
	 */
	protected $key = 'twitter:creator';

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return string The raw value.
	 */
	public function refresh() {
		return $this->presentation->twitter_creator;
	}
}
