<?php
/**
 * Generator object for the Open Graph image.
 *
 * @package Yoast\YoastSEO\Generators
 */

namespace Yoast\WP\Free\Generators;

use Yoast\WP\Free\Context\Meta_Tags_Context;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Open_Graph\Image_Helper as Open_Graph_Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Models\Indexable;
use Yoast\WP\Free\Presentations\Generators\Generator_Interface;
use Yoast\WP\Free\Values\Open_Graph\Images;

/**
 * Represents the generator class for the Open Graph images.
 */
class OG_Image_Generator implements Generator_Interface {

	/**
	 * @var Open_Graph_Image_Helper
	 */
	protected $open_graph_image;

	/**
	 * @var Image_Helper
	 */
	protected $image;

	/**
	 * @var Url_Helper
	 */
	protected $url;

	/**
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Images constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Open_Graph_Image_Helper $open_graph_image Image helper for OpenGraph.
	 * @param Image_Helper            $image            The image helper.
	 * @param Options_Helper          $options          The options helper.
	 * @param Url_Helper              $url              The url helper.
	 */
	public function __construct(
		Open_Graph_Image_Helper $open_graph_image,
		Image_Helper $image,
		Options_Helper $options,
		Url_Helper $url
	) {
		$this->open_graph_image = $open_graph_image;
		$this->image            = $image;
		$this->options          = $options;
		$this->url              = $url;
	}

	/**
	 * Retrieves the images for an indexable.
	 *
	 * @param Meta_Tags_Context $context The context.
	 *
	 * @return array The images.
	 */
	public function generate( Meta_Tags_Context $context ) {
		$image_container = $this->get_image_container();

		/**
		 * Filter: wpseo_add_opengraph_images - Allow developers to add images to the OpenGraph tags.
		 *
		 * @api Yoast\WP\Free\Values\Open_Graph\Images The current object.
		 */
		do_action( 'wpseo_add_opengraph_images', $image_container );

		$this->add_from_indexable( $context->indexable, $image_container );

		/**
		 * Filter: wpseo_add_opengraph_additional_images - Allows to add additional images to the OpenGraph tags.
		 *
		 * @api Yoast\WP\Free\Values\Open_Graph\Images The current object.
		 */
		do_action( 'wpseo_add_opengraph_additional_images', $image_container );

		$this->add_from_default( $image_container );

		return $image_container->get_images();
	}

	/**
	 * Adds an image based on the given indexable.
	 *
	 * @param Indexable $indexable       The indexable.
	 * @param Images    $image_container The image container.
	 */
	protected function add_from_indexable( Indexable $indexable, Images $image_container ) {
		if ( $indexable->og_image_id ) {
			$image_container->add_image_by_id( $indexable->og_image_id );

			return;
		}

		if ( $indexable->og_image ) {
			$image_container->add_image_by_url( $indexable->og_image );
		}
	}

	/**
	 * Retrieves the default OpenGraph image.
	 *
	 * @param Images $image_container The image container.
	 */
	protected function add_from_default( Images $image_container ) {
		if ( $image_container->has_images() ) {
			return;
		}

		$default_image_id = $this->options->get( 'og_default_image_id', '' );
		if ( $default_image_id ) {
			$image_container->add_image_by_id( $default_image_id );

			return;
		}

		$default_image_url = $this->options->get( 'og_default_image', '' );
		if ( $default_image_url ) {
			$image_container->add_image_by_url( $default_image_url );
		}
	}

	/**
	 * Retrieves an instance of the image container.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return Images The image container.
	 */
	protected function get_image_container() {
		$image_container = new Images( $this->image, $this->url );
		$image_container->set_helpers( $this->open_graph_image );

		return $image_container;
	}
}
