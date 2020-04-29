<?php
/**
 * Model for the Indexable table.
 *
 * @package Yoast\YoastSEO\Models
 */

namespace Yoast\WP\SEO\Models;

use Yoast\WP\Lib\Model;

/**
 * Indexable table definition.
 *
 * @property int     $id
 * @property int     $object_id
 * @property string  $object_type
 * @property string  $object_sub_type
 *
 * @property int     $author_id
 * @property int     $post_parent
 *
 * @property string  $created_at
 * @property string  $updated_at
 *
 * @property string  $permalink
 * @property string  $permalink_hash
 * @property string  $canonical
 * @property int     $content_score
 *
 * @property boolean $is_robots_noindex
 * @property boolean $is_robots_nofollow
 * @property boolean $is_robots_noarchive
 * @property boolean $is_robots_noimageindex
 * @property boolean $is_robots_nosnippet
 *
 * @property string  $title
 * @property string  $description
 * @property string  $breadcrumb_title
 *
 * @property boolean $is_cornerstone
 *
 * @property string  $primary_focus_keyword
 * @property int     $primary_focus_keyword_score
 *
 * @property int     $readability_score
 *
 * @property int     $link_count
 * @property int     $incoming_link_count
 * @property int     $number_of_pages
 *
 * @property string  $open_graph_title
 * @property string  $open_graph_description
 * @property string  $open_graph_image
 * @property string  $open_graph_image_id
 * @property string  $open_graph_image_source
 * @property string  $open_graph_image_meta
 *
 * @property string  $twitter_title
 * @property string  $twitter_description
 * @property string  $twitter_image
 * @property string  $twitter_image_id
 * @property string  $twitter_image_source
 * @property string  $twitter_card
 *
 * @property int     $prominent_words_version
 *
 * @property boolean $is_public
 * @property boolean $is_protected
 * @property string  $post_status
 * @property boolean $has_public_posts
 *
 * @property int     $blog_id
 *
 * @property string  $language
 * @property string  $region
 *
 * @property string  $schema_page_type
 * @property string  $schema_article_type
 */
class Indexable extends Model {

	/**
	 * Whether nor this model uses timestamps.
	 *
	 * @var bool
	 */
	protected $uses_timestamps = true;

	/**
	 * Which columns contain boolean values.
	 *
	 * @var array
	 */
	protected $boolean_columns = [
		'is_robots_noindex',
		'is_robots_nofollow',
		'is_robots_noarchive',
		'is_robots_noimageindex',
		'is_robots_nosnippet',
		'is_cornerstone',
		'is_public',
		'is_protected',
		'has_public_posts',
	];

	/**
	 * Which columns contain int values.
	 *
	 * @var array
	 */
	protected $int_columns = [
		'id',
		'object_id',
		'author_id',
		'post_parent',
		'content_score',
		'primary_focus_keyword_score',
		'readability_score',
		'link_count',
		'incoming_link_count',
		'number_of_pages',
		'prominent_words_version',
		'blog_id',
	];

	/**
	 * The loaded indexable extensions.
	 *
	 * @var \Yoast\WP\SEO\Models\Indexable_Extension[]
	 */
	protected $loaded_extensions = [];

	/**
	 * Returns an Indexable_Extension by its name.
	 *
	 * @param string $class_name The class name of the extension to load.
	 *
	 * @return \Yoast\WP\SEO\Models\Indexable_Extension|bool The extension.
	 */
	public function get_extension( $class_name ) {
		if ( ! $this->loaded_extensions[ $class_name ] ) {
			$this->loaded_extensions[ $class_name ] = $this->has_one( $class_name, 'indexable_id', 'id' )->find_one();
		}

		return $this->loaded_extensions[ $class_name ];
	}

	/**
	 * Enhances the save method.
	 *
	 * @return boolean True on succes.
	 */
	public function save() {
		if ( $this->permalink ) {
			$this->permalink      = \trailingslashit( $this->permalink );
			$this->permalink_hash = \strlen( $this->permalink ) . ':' . \md5( $this->permalink );
		}

		return parent::save();
	}
}
