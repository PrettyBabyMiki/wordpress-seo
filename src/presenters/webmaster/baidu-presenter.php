<?php

namespace Yoast\WP\SEO\Presenters\Webmaster;

use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;

/**
 * Presenter class for the Baidu Webmaster Tools verification setting.
 */
class Baidu_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="baidu-site-verification" content="%s" />';

	/**
	 * Retrieves the webmaster tool site verification value from the settings.
	 *
	 * @return string The webmaster tool site verification value.
	 */
	public function get() {
		return $this->helpers->options->get( 'baiduverify', '' );
	}
}
