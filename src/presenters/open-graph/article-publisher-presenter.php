<?php
/**
 * Presenter class for the Open Graph article publisher.
 *
 * @package Yoast\YoastSEO\Presenters\Open_Graph
 */

namespace Yoast\WP\SEO\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Tag_Presenter;

/**
 * Class Article_Publisher_Presenter
 */
class Article_Publisher_Presenter extends Abstract_Indexable_Tag_Presenter {

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta property="article:publisher" content="%s" />';

	/**
	 * Run the article publisher's Facebook URL through the `wpseo_og_article_publisher` filter.
	 *
	 * @return string The filtered article publisher's Facebook URL.
	 */
	public function get() {
		/**
		 * Filter: 'wpseo_og_article_publisher' - Allow developers to filter the article publisher's Facebook URL.
		 *
		 * @api bool|string $article_publisher The article publisher's Facebook URL, return false to disable.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \trim( \apply_filters( 'wpseo_og_article_publisher', $this->presentation->open_graph_article_publisher, $this->presentation ) );
	}
}
