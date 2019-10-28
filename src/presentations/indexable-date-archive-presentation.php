<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Pagination_Helper;

/**
 * Class Indexable_Date_Archive_Presentation
 */
class Indexable_Date_Archive_Presentation extends Indexable_Presentation {

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper
	 */
	protected $pagination;

	/**
	 * Indexable_Date_Archive_Presentation constructor.
	 *
	 * @param Pagination_Helper $pagination The pagination helper.
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct(
		Pagination_Helper $pagination
	) {
		$this->pagination = $pagination;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_canonical() {
		$canonical = $this->current_page->get_date_archive_permalink();

		$current_page = $this->current_page->get_current_archive_page();
		if ( $current_page > 1 ) {
			return $this->pagination->get_paginated_url( $canonical, $current_page );
		}

		return $canonical;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_robots() {
		$robots = $this->robots_helper->get_base_values( $this->model );

		if ( $this->options_helper->get( 'noindex-archive-wpseo', false ) ) {
			$robots['index'] = 'noindex';
		}

		return $this->robots_helper->after_generate( $robots );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		return $this->options_helper->get_title_default( 'title-archive-wpseo' );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_title() {
		return $this->title;
	}
}
