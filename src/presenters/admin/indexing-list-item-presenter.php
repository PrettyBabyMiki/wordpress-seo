<?php

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

class Indexing_List_Item_Presenter extends Abstract_Presenter {

	/**
	 * Presents the list item for the tools menu.
	 *
	 * @return string The list item HTML.
	 */
	public function present() {
		$output  = \sprintf( '<li><strong>%s</strong><br/>', \esc_html__( 'Optimize SEO Data', 'wordpress-seo' ) );
		$output .= \sprintf(
			'%1$s <a href="%2$s" target="_blank">%3$s</a>',
			\esc_html__( 'You can speed up your site and get insight into your internal linking structure by letting us perform a few optimizations to the way SEO data is stored. If you have a lot of content it might take a while, but trust us, it\'s worth it.', 'wordpress-seo' ),
			\esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3-z' ) ),
			\esc_html__( 'Learn more about the benefits of optimized SEO data.', 'wordpress-seo' )
		);

		$output .= '</li>';
		$output .= '<div id="yoast-seo-indexation-action"></div>';

		return $output;
	}
}
