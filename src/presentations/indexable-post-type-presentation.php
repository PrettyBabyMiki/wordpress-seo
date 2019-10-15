<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Post_Type_Helper;
use Yoast\WP\Free\Helpers\User_Helper;

/**
 * Class Indexable_Post_Type_Presentation
 */
class Indexable_Post_Type_Presentation extends Indexable_Presentation {

	/**
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * @var User_Helper
	 */
	protected $user;

	/**
	 * Indexable_Post_Type_Presentation constructor.
	 *
	 * @param Post_Type_Helper $post_type_helper The post type helper.
	 * @param User_Helper      $user             The user helper.
	 */
	public function __construct( Post_Type_Helper $post_type_helper, User_Helper $user ) {
		$this->post_type_helper = $post_type_helper;
		$this->user             = $user;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		return $this->options_helper->get( 'title-' . $this->model->object_sub_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		return $this->options_helper->get( 'metadesc-' . $this->model->object_sub_type );
	}

	/**
	 * Generates the open graph images.
	 *
	 * @return array The open graph images.
	 */
	public function generate_og_images() {
		if ( \post_password_required() ) {
			return [];
		}

		return parent::generate_og_images();
	}

	/**
	 * @inheritDoc
	 */
	public function generate_og_type() {
		return 'article';
	}

	/**
	 * Generates the open graph article author.
	 *
	 * @return string The open graph article author.
	 */
	public function generate_og_article_author() {
		$post = $this->replace_vars_object;

		$og_article_author = $this->user->get_the_author_meta( 'facebook', $post->post_author );

		if ( $og_article_author ) {
			return $og_article_author;
		}

		return '';
	}

	/**
	 * Generates the open graph article publisher.
	 *
	 * @return string The open graph article publisher.
	 */
	public function generate_og_article_publisher() {
		$og_article_publisher = $this->context->open_graph_publisher;

		if ( $og_article_publisher ) {
			return $og_article_publisher;
		}

		return '';
	}

	/**
	 * Generates the open graph article published time.
	 *
	 * @return string The open graph article published time.
	 */
	public function generate_og_article_published_time() {
		if ( $this->model->object_sub_type !== 'post' ) {
			/**
			 * Filter: 'wpseo_opengraph_show_publish_date' - Allow showing publication date for other post types.
			 *
			 * @api bool Whether or not to show publish date.
			 *
			 * @param string $post_type The current URL's post type.
			 */
			if ( ! apply_filters( 'wpseo_opengraph_show_publish_date', false, $this->post_type_helper->get_post_type( $this->context->post ) ) ) {
				return '';
			}
		}

		return mysql2date( DATE_W3C, $this->context->post->post_date_gmt, false );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_replace_vars_object() {
		return \get_post( $this->model->object_id );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_robots() {
		$robots = array_merge(
			$this->robots_helper->get_base_values( $this->model ),
			[
				'noimageindex' => ( $this->model->is_robots_noimageindex === true ) ? 'noimageindex' : null,
				'noarchive'    => ( $this->model->is_robots_noarchive === true ) ? 'noarchive' : null,
				'nosnippet'    => ( $this->model->is_robots_nosnippet === true ) ? 'nosnippet' : null,
			]
		);

		$private           = \get_post_status( $this->model->object_id ) === 'private';
		$post_type_noindex = ! $this->post_type_helper->is_indexable( $this->model->object_sub_type );

		if ( $private || $post_type_noindex ) {
			$robots['index'] = 'noindex';
		}

		return $this->robots_helper->after_generate( $robots );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_description() {
		$twitter_description = parent::generate_twitter_description();

		if ( $twitter_description ) {
			return $twitter_description;
		}

		$excerpt = \wp_strip_all_tags( \get_the_excerpt( $this->model->object_id ) );
		if ( $excerpt ) {
			return $excerpt;
		}

		return '';
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_image() {
		if ( \post_password_required() ) {
			return '';
		}

		return parent::generate_twitter_image();
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_creator() {
		$twitter_creator = \ltrim( \trim( \get_the_author_meta( 'twitter', $this->context->post->post_author ) ), '@' );

		/**
		 * Filter: 'wpseo_twitter_creator_account' - Allow changing the Twitter account as output in the Twitter card by Yoast SEO.
		 *
		 * @api string $twitter The twitter account name string.
		 */
		$twitter_creator = \apply_filters( 'wpseo_twitter_creator_account', $twitter_creator );

		if ( \is_string( $twitter_creator ) && $twitter_creator !== '' ) {
			return '@' . $twitter_creator;
		}

		$site_twitter = $this->options_helper->get( 'twitter_site', '' );
		if ( \is_string( $site_twitter ) && $site_twitter !== '' ) {
			return '@' . $site_twitter;
		}

		return '';
	}
}
