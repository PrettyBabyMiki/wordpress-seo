<?php
/**
 * Abstract presenter class for the OpenGraph title.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use WPSEO_Replace_Vars;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presenters\Post_Type\Title_Presenter;

/**
 * Class Abstract_Title_Presenter
 */
abstract class Abstract_Open_Graph_Title_Presenter implements Presenter_Interface {
	/**
	 * @var Title_Presenter
	 */
	protected $title_presenter;

	/**
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars_helper;

	/**
	 * @required
	 *
	 * @param Title_Presenter $title_presenter Title presenter.
	 */
	public function set_title_presenter( Title_Presenter $title_presenter ) {
		$this->title_presenter = $title_presenter;
	}

	/**
	 * @required
	 *
	 * Sets the replace vars helper, used by DI.
	 *
	 * @param \WPSEO_Replace_Vars $replace_vars_helper The replace vars helper.
	 */
	public function set_replace_vars_helper( WPSEO_Replace_Vars $replace_vars_helper ) {
		$this->replace_vars_helper = $replace_vars_helper;
	}

	/**
	 * Returns the title for a post.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The title tag.
	 */
	public function present( Indexable $indexable ) {
		$title = $this->filter( $this->replace_vars( $this->generate( $indexable ), $indexable ) );

		if ( is_string( $title ) && $title !== '' ) {
			return '<meta property="og:title" value="' . \esc_attr( \wp_strip_all_tags( \stripslashes( $title ) ) ) . '"/>';
		}

		return '';
	}

	/**
	 * Run the title content through the `wpseo_title` filter.
	 *
	 * @param string $title The title to filter.
	 *
	 * @return string $title The filtered title.
	 */
	private function filter( $title ) {
		/**
		 * Filter: 'wpseo_og_title' - Allow changing the Yoast SEO generated title.
		 *
		 * @api string $title The title.
		 */
		return (string) trim( \apply_filters( 'wpseo_title', $title ) );
	}

	/**
	 * Replace replacement variables in the title.
	 *
	 * @param string    $title     The title.
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The title with replacement variables replaced.
	 */
	private function replace_vars( $title, Indexable $indexable ) {
		return $this->replace_vars_helper->replace( $title, $this->get_replace_vars_object( $indexable ) );
	}

	/**
	 * Generates the title for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string The title.
	 */
	protected abstract function generate( Indexable $indexable );

	/**
	 * Gets an object to be used as a source of replacement variables.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return array A key => value array of variables that may be replaced.
	 */
	protected function get_replace_vars_object( Indexable $indexable ) {
		return [];
	}
}
