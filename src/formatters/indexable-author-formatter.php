<?php
/**
 * Post Formatter for the indexables.
 *
 * @package Yoast\YoastSEO\Formatters
 */

namespace Yoast\WP\Free\Formatters;

/**
 * Formats the term meta to indexable format.
 */
class Indexable_Author_Formatter {

	/**
	 * Formats the data.
	 *
	 * @param int                             $user_id   The user to retrieve the indexable for.
	 * @param \Yoast\WP\Free\Models\Indexable $indexable The indexable to format.
	 *
	 * @return \Yoast\WP\Free\Models\Indexable The extended indexable.
	 */
	public function format( $user_id, $indexable ) {
		$meta_data = $this->get_meta_data( $user_id );

		$indexable->permalink              = \get_author_posts_url( $user_id );
		$indexable->title                  = $meta_data['wpseo_title'];
		$indexable->description            = $meta_data['wpseo_metadesc'];
		$indexable->is_cornerstone         = false;
		$indexable->is_robots_noindex      = $this->get_noindex_value( $meta_data['wpseo_noindex_author'] );
		$indexable->is_robots_nofollow     = null;
		$indexable->is_robots_noarchive    = null;
		$indexable->is_robots_noimageindex = null;
		$indexable->is_robots_nosnippet    = null;

		return $indexable;
	}

	/**
	 * Retrieves the meta data for this indexable.
	 *
	 * @return array List of meta entries.
	 */
	protected function get_meta_data( $user_id ) {
		$keys = array(
			'wpseo_title',
			'wpseo_metadesc',
			'wpseo_noindex_author',
		);

		$output = array();
		foreach ( $keys as $key ) {
			$output[ $key ] = $this->get_author_meta( $user_id, $key );
		}

		return $output;
	}

	/**
	 * Retrieves the value for noindex.
	 *
	 * @param string $noindex Current noindex value.
	 *
	 * @return bool True if noindex is selected, false if not.
	 */
	protected function get_noindex_value( $noindex ) {
		return $noindex === 'on';
	}

	/**
	 * Retrieves the author meta.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param int    $user_id The user to retrieve the indexable for.
	 * @param string $key     The meta entry to retrieve.
	 *
	 * @return string The value of the meta field.
	 */
	protected function get_author_meta( $user_id, $key ) {
		$value = \get_the_author_meta( $key, $user_id );
		if ( \is_string( $value ) && $value === '' ) {
			return null;
		}

		return $value;
	}
}
