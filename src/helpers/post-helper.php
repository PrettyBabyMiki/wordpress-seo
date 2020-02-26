<?php
/**
 * A helper object for post related things.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\ORM\Yoast_Model;

/**
 * Class Redirect_Helper
 */
class Post_Helper {

	/**
	 * Holds the String_Helper instance.
	 *
	 * @var String_Helper
	 */
	private $string;

	/**
	 * Post_Helper constructor.
	 *
	 * @param String_Helper $string The string helper.
	 */
	public function __construct( String_Helper $string ) {
		$this->string = $string;
	}

	/**
	 * Removes all shortcode tags from the given content.
	 *
	 * @param string $content Content to remove all the shortcode tags from.
	 *
	 * @return string Content without shortcode tags.
	 */
	public function strip_shortcodes( $content ) {
		return \strip_shortcodes( $content );
	}

	/**
	 * Retrieves the post excerpt (without tags).
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return string Post excerpt (without tags).
	 */
	public function get_the_excerpt( $post_id ) {
		return $this->string->strip_all_tags( \get_the_excerpt( $post_id ) );
	}

	/**
	 * Retrieves the post type of the current post.
	 *
	 * @param \WP_Post $post The post.
	 *
	 * @return string|false          Post type on success, false on failure.
	 */
	public function get_post_type( $post = null ) {
		return \get_post_type( $post );
	}

	/**
	 * Retrieves post data given a post ID.
	 *
	 * @param int $post_id Post ID.
	 *
	 * @return \WP_Post|null The post.
	 */
	public function get_post( $post_id ) {
		return \get_post( $post_id );
	}

	/**
	 * Updates the has_public_posts field on attachments for a post_parent.
	 *
	 * An attachment is represented by their post parent when:
	 * - The attachment has a post parent.
	 * - The attachment inherits the post status.
	 *
	 * @param int $post_parent      Post ID.
	 * @param int $has_public_posts Whether the parent is public.
	 *
	 * @return bool Whether the update was successful.
	 */
	public function update_has_public_posts_on_attachments( $post_parent, $has_public_posts ) {
		$orm_wrapper = Yoast_Model::of_type( 'Indexable' );

		// Debatable way to get the table name in an update format.
		$query = $orm_wrapper->set( 'has_public_posts', $has_public_posts )->get_update_sql();
		$query = str_replace( 'WHERE `id` = ?', '', $query );

		// Execute a raw query here to be able to find & set in one, i.e. more performant.
		return $orm_wrapper
			->raw_execute(
				$query . 'WHERE `object_type` = \'post\' AND `object_sub_type` = \'attachment\' AND `post_status` = \'inherit\' AND `post_parent` = ?',
				[ $has_public_posts, $post_parent ]
			);
	}
}
