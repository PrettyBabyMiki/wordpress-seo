<?php
/**
 * Presenter class for the Twitter site.
 *
 * @package Yoast\YoastSEO\Presenters\Twitter
 */

namespace Yoast\WP\SEO\Presenters\Twitter;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Abstract_Indexable_Presenter;

/**
 * Class Site_Presenter
 */
class Site_Presenter extends Abstract_Indexable_Presenter {

	/**
	 * Returns the Twitter site.
	 *
<<<<<<< HEAD
	 * @param Indexable_Presentation $presentation The presentation of an indexable.
	 * @param bool                   $output_tag   Optional. Whether or not to output the HTML tag. Defaults to true.
	 *
	 * @return string The Twitter site tag.
	 */
	public function present( Indexable_Presentation $presentation, $output_tag = true ) {
		$twitter_site = $this->filter( $presentation->twitter_site, $presentation );
=======
	 * @return string The Twitter site tag.
	 */
	public function present() {
		$twitter_site = $this->filter();
>>>>>>> e2e9a4b81435c68471e9fd6075fb2ae7ffa3a8b1
		$twitter_site = $this->get_twitter_id( $twitter_site );

		if ( \is_string( $twitter_site ) && $twitter_site !== '' ) {
			if ( ! $output_tag ) {
				return $twitter_site;
			}

			return \sprintf( '<meta name="twitter:site" content="%s" />', \esc_attr( '@' . $twitter_site ) );
		}

		return '';
	}

	/**
	 * Run the Twitter site through the `wpseo_twitter_site` filter.
	 *
	 * @return string The filtered Twitter site.
	 */
	private function filter() {
		/**
		 * Filter: 'wpseo_twitter_site' - Allow changing the Twitter site account as output in the Twitter card by Yoast SEO.
		 *
		 * @api string $twitter_site Twitter site account string.
		 *
		 * @param Indexable_Presentation $presentation The presentation of an indexable.
		 */
		return \apply_filters( 'wpseo_twitter_site', $this->presentation->twitter_site, $this->presentation );
	}

	/**
	 * Checks if the given id is actually an id or a url and if url, distills the id from it.
	 *
	 * Solves issues with filters returning urls and theme's/other plugins also adding a user meta
	 * twitter field which expects url rather than an id (which is what we expect).
	 *
	 * @param string $id Twitter ID or url.
	 *
	 * @return string|bool Twitter ID or false if it failed to get a valid Twitter ID.
	 */
	private function get_twitter_id( $id ) {
		if ( \preg_match( '`([A-Za-z0-9_]{1,25})$`', $id, $match ) ) {
			return $match[1];
		}

		return false;
	}
}
