<?php
/**
 * A helper object for WordPress posts.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Class Current_Post_Helper
 */
class Current_Page_Helper {

	/**
	 * @var WP_Query_Wrapper
	 */
	private $wp_query_wrapper;

	/**
	 * Current_Page_Helper constructor.
	 *
	 * @param WP_Query_Wrapper $wp_query_wrapper The wrapper for WP_Query.
	 */
	public function __construct(
		WP_Query_Wrapper $wp_query_wrapper
	) {
		$this->wp_query_wrapper = $wp_query_wrapper;
	}

	/**
	 * Returns the page type for the current request.
	 *
	 * @return string Page type.
	 */
	public function get_page_type() {
		switch ( true ) {
			case $this->is_search_result():
				return 'Search_Result_Page';
			case $this->is_static_posts_page():
				return 'Static_Posts_Page';
			case $this->is_home_static_page():
				return 'Static_Home_Page';
			case $this->is_home_posts_page():
				return 'Home_Page';
			case $this->is_simple_page():
				return 'Post_Type';
			case $this->is_post_type_archive():
				return 'Post_Type_Archive';
			case $this->is_term_archive():
				return 'Term_Archive';
			case $this->is_author_archive():
				return 'Author_Archive';
			case $this->is_date_archive():
				return 'Date_Archive';
			case $this->is_404():
				return 'Error_Page';
		}

		return 'Fallback';
	}

	/**
	 * Checks if the currently opened page is a simple page.
	 *
	 * @return bool Whether the currently opened page is a simple page.
	 */
	public function is_simple_page() {
		return $this->get_simple_page_id() > 0;
	}

	/**
	 * Returns the id of the currently opened page.
	 *
	 * @return int The id of the currently opened page.
	 */
	public function get_simple_page_id() {
		if ( \is_singular() ) {
			return \get_the_ID();
		}

		if ( $this->is_posts_page() ) {
			return \get_option( 'page_for_posts' );
		}

		/**
		 * Filter: Allow changing the default page id.
		 *
		 * @api int $page_id The default page id.
		 */
		return \apply_filters( 'wpseo_frontend_page_type_simple_page_id', 0 );
	}

	/**
	 * Returns the id of the currently opened author archive.
	 *
	 * @return int The id of the currently opened author archive.
	 */
	public function get_author_id() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return $wp_query->get( 'author' );
	}

	/**
	 * Returns the id of the front page.
	 *
	 * @return int The id of the front page. 0 if the front page is not a static page.
	 */
	public function get_front_page_id() {
		if ( \get_option( 'show_on_front' ) !== 'page' ) {
			return 0;
		}

		return (int) \get_option( 'page_on_front' );
	}

	/**
	 * Returns the id of the currently opened term archive.
	 *
	 * @return int The id of the currently opened term archive.
	 */
	public function get_term_id() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		if ( $wp_query->is_category() ) {
			return $wp_query->get( 'cat' );
		}
		if ( $wp_query->is_tag() ) {
			return $wp_query->get( 'tag_id' );
		}
		if ( $wp_query->is_tax() ) {
			$queried_object = $wp_query->get_queried_object();
			if ( $queried_object && ! \is_wp_error( $queried_object ) ) {
				return $queried_object->term_id;
			}
		}

		return 0;
	}

	/**
	 * Returns the post type of the main query.
	 *
	 * @return string The post type of the main query.
	 */
	public function get_queried_post_type() {
		$post_type = $this->wp_query_wrapper->get_main_query()->get( 'post_type' );
		if ( \is_array( $post_type ) ) {
			$post_type = \reset( $post_type );
		}

		return $post_type;
	}

	/**
	 * Returns the permalink of the currently opened date archive.
	 * If the permalink was cached, it returns this permalink.
	 * If not, we call another function to get the permalink through wp_query.
	 *
	 * @return string The permalink of the currently opened date archive.
	 */
	public function get_date_archive_permalink() {
		static $date_archive_permalink;

		if ( isset( $date_archive_permalink ) ) {
			return $date_archive_permalink;
		}

		$date_archive_permalink = $this->get_non_cached_date_archive_permalink();

		return $date_archive_permalink;
	}

	/**
	 * Determine whether this is the homepage and shows posts.
	 *
	 * @return bool Whether or not the current page is the homepage that displays posts.
	 */
	public function is_home_posts_page() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		if ( ! $wp_query->is_home() ) {
			return false;
		}

		/*
		 * Whether the static page's `Homepage` option is actually not set to a page.
		 * Otherwise WordPress proceeds to handle the homepage as a `Your latest posts` page.
		 */
		if ( \get_option( 'page_on_front' ) === '0' ) {
			return true;
		}

		return \get_option( 'show_on_front' ) === 'posts';
	}

	/**
	 * Determine whether this is the static frontpage.
	 *
	 * @return bool Whether or not the current page is a static frontpage.
	 */
	public function is_home_static_page() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return ( $wp_query->is_front_page() && \get_option( 'show_on_front' ) === 'page' && \is_page( \get_option( 'page_on_front' ) ) );
	}

	/**
	 * Determine whether this is the static posts page.
	 *
	 * @return bool Whether or not the current page is a static posts page.
	 */
	public function is_static_posts_page() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		$page_for_posts = (int) \get_option( 'page_for_posts' );

		return ( $page_for_posts > 0 && $page_for_posts === $wp_query->get_queried_object_id() );
	}

	/**
	 * Determine whether this is the statically set posts page, when it's not the frontpage.
	 *
	 * @return bool Whether or not it's a non-frontpage, statically set posts page.
	 */
	public function is_posts_page() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return ( $wp_query->is_home && \get_option( 'show_on_front' ) === 'page' );
	}

	/**
	 * Determine whether this is a post type archive.
	 *
	 * @return bool Whether nor not the current page is a post type archive.
	 */
	public function is_post_type_archive() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return $wp_query->is_post_type_archive();
	}

	/**
	 * Determine whether this is a term archive.
	 *
	 * @return bool Whether nor not the current page is a term archive.
	 */
	public function is_term_archive() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return $wp_query->is_tax || $wp_query->is_tag || $wp_query->is_category;
	}

	/**
	 * Determine whether this is an attachment page.
	 *
	 * @return bool Whether nor not the current page is an attachment page.
	 */
	public function is_attachment() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return $wp_query->is_attachment;
	}

	/**
	 * Determine whether this is an author archive.
	 *
	 * @return bool Whether nor not the current page is an author archive.
	 */
	public function is_author_archive() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return $wp_query->is_author();
	}

	/**
	 * Determine whether this is an date archive.
	 *
	 * @return bool Whether nor not the current page is an date archive.
	 */
	public function is_date_archive() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return $wp_query->is_date();
	}

	/**
	 * Determine whether this is a search result.
	 *
	 * @return bool Whether nor not the current page is a search result.
	 */
	public function is_search_result() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return $wp_query->is_search();
	}

	/**
	 * Determine whether this is a 404 page.
	 *
	 * @return bool Whether nor not the current page is a 404 page.
	 */
	public function is_404() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return $wp_query->is_404();
	}

	/**
	 * Checks if the current page is the post format archive.
	 *
	 * @return bool Whether or not the current page is the post format archive.
	 */
	public function is_post_format_archive() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return $wp_query->is_tax( 'post_format' );
	}

	/**
	 * Determine whether this page is an taxonomy archive page for multiple terms (url: /term-1,term2/).
	 *
	 * @return bool Whether or not the current page is an archive page for multiple terms.
	 */
	public function is_multiple_terms_page() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		if ( ! $this->is_term_archive() ) {
			return false;
		}

		$term          = $wp_query->get_queried_object();
		$queried_terms = $wp_query->tax_query->queried_terms;

		if ( empty( $queried_terms[ $term->taxonomy ]['terms'] ) ) {
			return false;
		}

		return \count( $queried_terms[ $term->taxonomy ]['terms'] ) > 1;
	}

	/**
	 * Checks if the current page is the front page.
	 *
	 * @return bool Whether or not the current page is the front page.
	 */
	public function is_front_page() {
		$wp_query = $this->wp_query_wrapper->get_main_query();

		return $wp_query->is_front_page();
	}

	/**
	 * Retrieves the current admin page.
	 *
	 * @return string The current page.
	 */
	public function get_current_admin_page() {
		global $pagenow;

		return $pagenow;
	}

	/**
	 * Returns the permalink of the currently opened date archive.
	 *
	 * @return string The permalink of the currently opened date archive.
	 */
	protected function get_non_cached_date_archive_permalink() {
		$date_archive_permalink = '';
		$wp_query               = $this->wp_query_wrapper->get_main_query();

		if ( $wp_query->is_day() ) {
			$date_archive_permalink = \get_day_link( $wp_query->get( 'year' ), $wp_query->get( 'monthnum' ), $wp_query->get( 'day' ) );
		}
		if ( $wp_query->is_month() ) {
			$date_archive_permalink = \get_month_link( $wp_query->get( 'year' ), $wp_query->get( 'monthnum' ) );
		}
		if ( $wp_query->is_year() ) {
			$date_archive_permalink = \get_year_link( $wp_query->get( 'year' ) );
		}

		return $date_archive_permalink;
	}
}
