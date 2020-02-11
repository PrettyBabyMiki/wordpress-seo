<?php
/**
 * Post Builder for the indexables.
 *
 * @package Yoast\YoastSEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

use Exception;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\SEO_Meta_Repository;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Formats the post meta to indexable format.
 */
class Indexable_Post_Builder {
	use Indexable_Social_Image_Trait;

	/**
	 * Yoast extension of the Model class.
	 *
	 * @var SEO_Meta_Repository
	 */
	protected $seo_meta_repository;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Indexable_Post_Builder constructor.
	 *
	 * @param SEO_Meta_Repository $seo_meta_repository The SEO Meta repository.
	 * @param Options_Helper      $options             The options helper.
	 */
	public function __construct(
		SEO_Meta_Repository $seo_meta_repository,
		Options_Helper $options
	) {
		$this->seo_meta_repository = $seo_meta_repository;
		$this->options             = $options;
	}

	/**
	 * @required
	 *
	 * Sets the indexable repository. Done to avoid circular dependencies.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function set_indexable_repository( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Formats the data.
	 *
	 * @param int       $post_id   The post ID to use.
	 * @param Indexable $indexable The indexable to format.
	 *
	 * @return Indexable The extended indexable.
	 */
	public function build( $post_id, $indexable ) {
		$post = \get_post( $post_id );

		$indexable->object_id       = $post_id;
		$indexable->object_type     = 'post';
		$indexable->object_sub_type = $post->post_type;
		$indexable->permalink       = \get_permalink( $post_id );

		$indexable->primary_focus_keyword_score = $this->get_keyword_score(
			$this->get_meta_value( $post_id, 'focuskw' ),
			(int) $this->get_meta_value( $post_id, 'linkdex' )
		);

		$indexable->readability_score = (int) $this->get_meta_value( $post_id, 'content_score' );

		$indexable->is_cornerstone    = ( $this->get_meta_value( $post_id, 'is_cornerstone' ) === '1' );
		$indexable->is_robots_noindex = $this->get_robots_noindex(
			$this->get_meta_value( $post_id, 'meta-robots-noindex' )
		);

		// Set additional meta-robots values.
		$indexable->is_robots_nofollow = ( $this->get_meta_value( $post_id, 'meta-robots-nofollow' ) === '1' );
		$noindex_advanced              = $this->get_meta_value( $post_id, 'meta-robots-adv' );
		$meta_robots                   = \explode( ',', $noindex_advanced );
		foreach ( $this->get_robots_options() as $meta_robots_option ) {
			$indexable->{'is_robots_' . $meta_robots_option} = \in_array( $meta_robots_option, $meta_robots, true ) ? 1 : null;
		}

		$this->reset_social_images( $indexable );

		foreach ( $this->get_indexable_lookup() as $meta_key => $indexable_key ) {
			$indexable->{$indexable_key} = $this->get_meta_value( $post_id, $meta_key );
		}

		if ( empty( $indexable->breadcrumb_title ) ) {
			$indexable->breadcrumb_title = \wp_strip_all_tags( \get_the_title( $post_id ), true );
		}

		$this->handle_social_images( $indexable );

		$indexable = $this->set_link_count( $post_id, $indexable );

		$indexable->number_of_pages = $this->get_number_of_pages_for_post( $post );
		$indexable->post_status     = $post->post_status;
		$indexable->is_protected    = $post->post_password !== '';
		$indexable->is_public       = $this->is_public( $indexable );
		$indexable->author_id       = $post->post_author;

		return $indexable;
	}

	/**
	 * Determines the value of is_public.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return bool Whether or not the post type is public.
	 */
	protected function is_public( $indexable ) {
		if ( $indexable->is_protected ) {
			return false;
		}

		if ( (int) $indexable->is_robots_noindex === 1 ) {
			return false;
		}

		if ( ! \in_array( $indexable->post_status, $this->is_public_post_status(), true ) ) {
			return false;
		}

		if ( $indexable->is_robots_noindex === null && ! \WPSEO_Post_Type::is_post_type_indexable( $indexable->object_sub_type ) ) {
			return false;
		}

		// Attachments behave differently than the other post types, since they inherit from their parent.
		if ( $indexable->object_sub_type === 'attachment' ) {
			return $this->is_public_attachment( $indexable );
		}

		return true;
	}

	/**
	 * Determines the value of is_public for attachments.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return bool Whether or not the attachment is public.
	 */
	protected function is_public_attachment( $indexable ) {
		// If attachments site-wide are set to noindex, they should not be public.
		$noindex_attachment = $this->options->get( 'noindex-attachment', false );
		if ( $noindex_attachment === true ) {
			return false;
		}

		// Else, follow the behaviour of the attachment's parent.
		$parent_id = (int) \get_post( $indexable->object_id )->post_parent;

		// If the attachment has no parent, it should not be public.
		if ( $parent_id === 0 ) {
			return false;
		}

		// Get the parent's value for is_public.
		$parent_indexable = $this->indexable_repository->find_by_id_and_type( $parent_id, 'post', false );
		return (int) $parent_indexable->is_public;
	}

	/**
	 * Retrieves the list of public posts statuses.
	 *
	 * @return array The public post statuses.
	 */
	protected function is_public_post_status() {
		/**
		 * Filter: 'wpseo_public_post_statuses' - List of public post statuses.
		 *
		 * @apo array $post_statuses Post status list, defaults to array( 'publish' ).
		 */
		return \apply_filters( 'wpseo_public_post_statuses', [ 'publish' ] );
	}

	/**
	 * Converts the meta robots noindex value to the indexable value.
	 *
	 * @param int $value Meta value to convert.
	 *
	 * @return bool|null True for noindex, false for index, null for default of parent/type.
	 */
	protected function get_robots_noindex( $value ) {
		$value = (int) $value;

		switch ( $value ) {
			case 1:
				return true;
			case 2:
				return false;
		}

		return null;
	}

	/**
	 * Retrieves the robot options to search for.
	 *
	 * @return array List of robots values.
	 */
	protected function get_robots_options() {
		return [ 'noimageindex', 'noarchive', 'nosnippet' ];
	}

	/**
	 * Determines the focus keyword score.
	 *
	 * @param string $keyword The focus keyword that is set.
	 * @param int    $score   The score saved on the meta data.
	 *
	 * @return null|int Score to use.
	 */
	protected function get_keyword_score( $keyword, $score ) {
		if ( empty( $keyword ) ) {
			return null;
		}

		return $score;
	}

	/**
	 * Retrieves the lookup table.
	 *
	 * @return array Lookup table for the indexable fields.
	 */
	protected function get_indexable_lookup() {
		return [
			'focuskw'               => 'primary_focus_keyword',
			'canonical'             => 'canonical',
			'title'                 => 'title',
			'metadesc'              => 'description',
			'bctitle'               => 'breadcrumb_title',
			'opengraph-title'       => 'og_title',
			'opengraph-image'       => 'og_image',
			'opengraph-image-id'    => 'og_image_id',
			'opengraph-description' => 'og_description',
			'twitter-title'         => 'twitter_title',
			'twitter-image'         => 'twitter_image',
			'twitter-image-id'      => 'twitter_image_id',
			'twitter-description'   => 'twitter_description',
		];
	}

	/**
	 * Updates the link count from existing data.
	 *
	 * @param int       $post_id   The post ID to use.
	 * @param Indexable $indexable The indexable to extend.
	 *
	 * @return Indexable The extended indexable.
	 */
	protected function set_link_count( $post_id, Indexable $indexable ) {
		try {
			$seo_meta = $this->seo_meta_repository->find_by_post_id( $post_id );

			if ( $seo_meta ) {
				$indexable->link_count          = $seo_meta->internal_link_count;
				$indexable->incoming_link_count = $seo_meta->incoming_link_count;
			}
			// @codingStandardsIgnoreLine Generic.CodeAnalysis.EmptyStatement.DetectedCATCH -- There is nothing to do.
		} catch ( Exception $exception ) {
			// Do nothing here...
		}

		return $indexable;
	}

	/**
	 * Retrieves the current value for the meta field.
	 *
	 * @param int    $post_id  The post ID to use.
	 * @param string $meta_key Meta key to fetch.
	 *
	 * @return mixed The value of the indexable entry to use.
	 */
	protected function get_meta_value( $post_id, $meta_key ) {
		$value = \WPSEO_Meta::get_value( $meta_key, $post_id );
		if ( \is_string( $value ) && $value === '' ) {
			return null;
		}

		return $value;
	}

	/**
	 * Finds an alternative image for the social image.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return array|bool False when not found, array with data when found.
	 */
	protected function find_alternative_image( Indexable $indexable ) {
		if (
			$indexable->object_sub_type === 'attachment' &&
			$this->image->is_valid_attachment( $indexable->object_id )
		) {
			return [
				'image_id' => $indexable->object_id,
				'source'   => 'attachment-image',
			];
		}

		$featured_image_id = $this->image->get_featured_image_id( $indexable->object_id );
		if ( $featured_image_id ) {
			return [
				'image_id' => $featured_image_id,
				'source'   => 'featured-image',
			];
		}

		$gallery_image = $this->image->get_gallery_image( $indexable->object_id );
		if ( $gallery_image ) {
			return [
				'image'  => $gallery_image,
				'source' => 'gallery-image',
			];
		}

		$content_image = $this->image->get_post_content_image( $indexable->object_id );
		if ( $content_image ) {
			return [
				'image'  => $content_image,
				'source' => 'first-content-image',
			];
		}

		return false;
	}

	/**
	 * Sets the alternative on an indexable.
	 *
	 * @param array     $alternative_image The alternative image to set.
	 * @param Indexable $indexable         The indexable to set image for.
	 */
	protected function set_alternative_image( array $alternative_image, Indexable $indexable ) {

		if ( ! empty( $alternative_image['image_id'] ) ) {
			if ( ! $indexable->og_image_source && ! $indexable->og_image_id ) {
				$indexable->og_image_id     = $alternative_image['image_id'];
				$indexable->og_image_source = $alternative_image['source'];

				$this->set_og_image_meta_data( $indexable );
			}

			if ( ! $indexable->twitter_image && ! $indexable->twitter_image_id ) {
				$indexable->twitter_image        = $this->twitter_image->get_by_id( $alternative_image['image_id'] );
				$indexable->twitter_image_id     = $alternative_image['image_id'];
				$indexable->twitter_image_source = $alternative_image['source'];
			}
		}

		if ( ! empty( $alternative_image['image'] ) ) {
			if ( ! $indexable->og_image_source && ! $indexable->og_image_id ) {
				$indexable->og_image        = $alternative_image['image'];
				$indexable->og_image_source = $alternative_image['source'];
			}

			if ( ! $indexable->twitter_image && ! $indexable->twitter_image_id ) {
				$indexable->twitter_image        = $alternative_image['image'];
				$indexable->twitter_image_source = $alternative_image['source'];
			}
		}
	}

	/**
	 * Gets the number of pages for a post.
	 *
	 * @param object $post The post object.
	 *
	 * @return int|null The number of pages or null if the post isn't paginated.
	 */
	protected function get_number_of_pages_for_post( $post ) {
		$number_of_pages = ( \substr_count( $post->post_content, '<!--nextpage-->' ) + 1 );

		if ( $number_of_pages <= 1 ) {
			return null;
		}

		return $number_of_pages;
	}

	/**
	 * Sets the OG image meta data for an og image
	 *
	 * @param Indexable $indexable The indexable.
	 */
	protected function set_og_image_meta_data( Indexable $indexable ) {
		if ( ! $indexable->og_image_id ) {
			return;
		}

		$image = $this->open_graph_image->get_image_url_by_id( $indexable->og_image_id );

		if ( ! empty( $image ) ) {
			$indexable->og_image      = $image['url'];
			$indexable->og_image_meta = wp_json_encode( $image );
		}
	}
}
