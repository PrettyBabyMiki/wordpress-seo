<?php
/**
 * Builder for the indexables hierarchy.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

use WP_Post;
use WP_Term;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Hierarchy_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;

/**
 * Builds the indexable hierarchy for indexables.
 */
class Indexable_Hierarchy_Builder {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The indexable hierarchy repository.
	 *
	 * @var Indexable_Hierarchy_Repository
	 */
	private $indexable_hierarchy_repository;

	/**
	 * The primary term repository.
	 *
	 * @var Primary_Term_Repository
	 */
	private $primary_term_repository;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Holds the Post_Helper instance.
	 *
	 * @var Post_Helper
	 */
	private $post;

	/**
	 * Indexable_Author_Builder constructor.
	 *
	 * @param Indexable_Hierarchy_Repository $indexable_hierarchy_repository The indexable hierarchy repository.
	 * @param Primary_Term_Repository        $primary_term_repository        The primary term repository.
	 * @param Options_Helper                 $options                        The options helper.
	 * @param Post_Helper                    $post                           The post helper.
	 */
	public function __construct(
		Indexable_Hierarchy_Repository $indexable_hierarchy_repository,
		Primary_Term_Repository $primary_term_repository,
		Options_Helper $options,
		Post_Helper $post
	) {
		$this->indexable_hierarchy_repository = $indexable_hierarchy_repository;
		$this->primary_term_repository        = $primary_term_repository;
		$this->options                        = $options;
		$this->post                           = $post;
	}

	/**
	 * Sets the indexable repository. Done to avoid circular dependencies.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 *
	 * @required
	 */
	public function set_indexable_repository( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Builds the ancestor hierarchy for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return Indexable The indexable.
	 */
	public function build( Indexable $indexable ) {
		$this->indexable_hierarchy_repository->clear_ancestors( $indexable->id );

		if ( $indexable->object_type === 'post' ) {
			$this->add_ancestors_for_post( $indexable->id, $indexable->object_id );
		}

		if ( $indexable->object_type === 'term' ) {
			$this->add_ancestors_for_term( $indexable->id, $indexable->object_id );
		}

		return $indexable;
	}

	/**
	 * Adds ancestors for a post.
	 *
	 * @param int   $indexable_id The indexable id, this is the id of the original indexable.
	 * @param int   $post_id      The post id, this is the id of the post currently being evaluated.
	 * @param int   $depth        The current depth.
	 * @param int[] $parents      The indexable IDs of all parents.
	 *
	 * @return void
	 */
	private function add_ancestors_for_post( $indexable_id, $post_id, $depth = 1, $parents = [] ) {
		$post = $this->post->get_post( $post_id );

		if ( ! isset( $post->post_parent ) ) {
			return;
		}

		if ( $post->post_parent !== 0 && $this->post->get_post( $post->post_parent ) !== null ) {
			$ancestor = $this->indexable_repository->find_by_id_and_type( $post->post_parent, 'post' );
			if ( $this->is_invalid_ancestor( $ancestor, $indexable_id, $parents ) ) {
				return;
			}

			$ancestor_hierarchy = $this->indexable_hierarchy_repository->add_ancestor( $indexable_id, $ancestor->id, $depth );
			if ( $ancestor_hierarchy === false ) {
				return;
			}
			$parents[] = $ancestor->id;
			$this->add_ancestors_for_post( $indexable_id, $ancestor->object_id, ( $depth + 1 ), $parents );
			return;
		}

		$primary_term_id = $this->find_primary_term_id_for_post( $post );

		if ( $primary_term_id === 0 ) {
			return;
		}

		$ancestor = $this->indexable_repository->find_by_id_and_type( $primary_term_id, 'term' );
		if ( $this->is_invalid_ancestor( $ancestor, $indexable_id, $parents ) ) {
			return;
		}

		$ancestor_hierarchy = $this->indexable_hierarchy_repository->add_ancestor( $indexable_id, $ancestor->id, $depth );
		if ( $ancestor_hierarchy === false ) {
			return;
		}
		$parents[] = $ancestor->id;
		$this->add_ancestors_for_term( $indexable_id, $ancestor->object_id, ( $depth + 1 ), $parents );
	}

	/**
	 * Adds ancestors for a term.
	 *
	 * @param int   $indexable_id The indexable id, this is the id of the original indexable.
	 * @param int   $term_id      The term id, this is the id of the term currently being evaluated.
	 * @param int   $depth        The current depth.
	 * @param int[] $parents      The indexable IDs of all parents.
	 *
	 * @return void
	 */
	private function add_ancestors_for_term( $indexable_id, $term_id, $depth = 1, $parents = [] ) {
		$term         = \get_term( $term_id );
		$term_parents = $this->get_term_parents( $term );

		foreach ( $term_parents as $parent ) {
			$ancestor = $this->indexable_repository->find_by_id_and_type( $parent->term_id, 'term' );
			if ( $this->is_invalid_ancestor( $ancestor, $indexable_id, $parents ) ) {
				continue;
			}
			$ancestor_hierarchy = $this->indexable_hierarchy_repository->add_ancestor( $indexable_id, $ancestor->id, $depth );
			if ( $ancestor_hierarchy === false ) {
				return;
			}
			$parents[] = $ancestor->id;
			++$depth;
		}
	}

	/**
	 * Gets the primary term ID for a post.
	 *
	 * @param WP_Post $post The post.
	 *
	 * @return int The primary term ID. 0 if none exists.
	 */
	private function find_primary_term_id_for_post( $post ) {
		$main_taxonomy = $this->options->get( 'post_types-' . $post->post_type . '-maintax' );

		if ( ! $main_taxonomy || $main_taxonomy === '0' ) {
			return 0;
		}

		$primary_term = $this->primary_term_repository->find_by_post_id_and_taxonomy( $post->ID, $main_taxonomy, false );

		if ( $primary_term ) {
			$term = \get_term( $primary_term->term_id );
			if ( $term !== null && ! \is_wp_error( $term ) ) {
				return $primary_term->term_id;
			}
		}

		$terms = \get_the_terms( $post->ID, $main_taxonomy );

		if ( ! is_array( $terms ) || empty( $terms ) ) {
			return 0;
		}

		return $this->find_deepest_term_id( $terms );
	}

	/**
	 * Find the deepest term in an array of term objects.
	 *
	 * @param array $terms Terms set.
	 *
	 * @return int The deepest term ID.
	 */
	private function find_deepest_term_id( $terms ) {
		/*
		 * Let's find the deepest term in this array, by looping through and then
		 * unsetting every term that is used as a parent by another one in the array.
		 */
		$terms_by_id = [];
		foreach ( $terms as $term ) {
			$terms_by_id[ $term->term_id ] = $term;
		}
		foreach ( $terms as $term ) {
			unset( $terms_by_id[ $term->parent ] );
		}

		/*
		 * As we could still have two subcategories, from different parent categories,
		 * let's pick the one with the lowest ordered ancestor.
		 */
		$parents_count = -1;
		$term_order    = 9999; // Because ASC.
		$deepest_term  = reset( $terms_by_id );
		foreach ( $terms_by_id as $term ) {
			$parents = $this->get_term_parents( $term );

			$new_parents_count = count( $parents );

			if ( $new_parents_count < $parents_count ) {
				continue;
			}

			$parent_order = 9999; // Set default order.
			foreach ( $parents as $parent ) {
				if ( $parent->parent === 0 && isset( $parent->term_order ) ) {
					$parent_order = $parent->term_order;
				}
			}

			// Check if parent has lowest order.
			if ( $new_parents_count > $parents_count || $parent_order < $term_order ) {
				$term_order   = $parent_order;
				$deepest_term = $term;
			}

			$parents_count = $new_parents_count;
		}

		return $deepest_term->term_id;
	}

	/**
	 * Get a term's parents.
	 *
	 * @param WP_Term $term Term to get the parents for.
	 *
	 * @return WP_Term[] An array of all this term's parents.
	 */
	private function get_term_parents( $term ) {
		$tax     = $term->taxonomy;
		$parents = [];
		while ( (int) $term->parent !== 0 ) {
			$term      = \get_term( $term->parent, $tax );
			$parents[] = $term;
		}

		return $parents;
	}

	/**
	 * Checks if an ancestor is valid to add.
	 *
	 * @param Indexable $ancestor     The ancestor to check.
	 * @param int       $indexable_id The indexable id we're adding ancestors for.
	 * @param int[]     $parents      The indexable ids of the parents already added.
	 *
	 * @return boolean
	 */
	private function is_invalid_ancestor( Indexable $ancestor, $indexable_id, $parents ) {
		// Don't add ancestors if they're unindexed, already added or the same as the main object.
		if ( $ancestor->post_status === 'unindexed' ) {
			return true;
		}

		if ( \in_array( $ancestor->id, $parents, true ) ) {
			return true;
		}

		if ( $ancestor->id === $indexable_id ) {
			return true;
		}

		return false;
	}
}
