<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * Class Primary_Term_Helper
 */
class Primary_Term_Helper {

	/**
	 * Returns all the taxonomies for which the primary term selection is enabled.
	 *
	 * @param int $post_id Default current post ID.
	 *
	 * @return array The taxonomies.
	 */
	public function get_primary_term_taxonomies( $post_id = null ) {
		if ( $post_id === null ) {
			$post_id = \get_the_ID();
		}

		return $this->generate_primary_term_taxonomies( $post_id );
	}

	/**
	 * Generate the primary term taxonomies.
	 *
	 * @param int $post_id ID of the post.
	 *
	 * @return array The taxonomies.
	 */
	protected function generate_primary_term_taxonomies( $post_id ) {
		$post_type      = \get_post_type( $post_id );
		$all_taxonomies = \get_object_taxonomies( $post_type, 'objects' );
		$all_taxonomies = \array_filter( $all_taxonomies, [ $this, 'filter_hierarchical_taxonomies' ] );

		/**
		 * Filters which taxonomies for which the user can choose the primary term.
		 *
		 * @api array    $taxonomies An array of taxonomy objects that are primary_term enabled.
		 *
		 * @param string $post_type      The post type for which to filter the taxonomies.
		 * @param array  $all_taxonomies All taxonomies for this post types, even ones that don't have primary term
		 *                               enabled.
		 */
		$taxonomies = (array) \apply_filters( 'wpseo_primary_term_taxonomies', $all_taxonomies, $post_type, $all_taxonomies );

		return $taxonomies;
	}

	/**
	 * Returns whether or not a taxonomy is hierarchical.
	 *
	 * @param \stdClass $taxonomy Taxonomy object.
	 *
	 * @return bool True for hierarchical taxonomy.
	 */
	protected function filter_hierarchical_taxonomies( $taxonomy ) {
		return (bool) $taxonomy->hierarchical;
	}
}
