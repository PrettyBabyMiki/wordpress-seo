<?php

namespace Yoast\WP\SEO\Integrations\Blocks;

use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Presenters\Breadcrumbs_Presenter;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;

/**
 * Siblings block class
 */
class Breadcrumbs_Block extends Dynamic_Block {

	/**
	 * The name of the block.
	 *
	 * @var string
	 */
	protected $block_name = 'breadcrumbs';

	/**
	 * The editor script for the block.
	 *
	 * @var string
	 */
	protected $script = 'yoast-seo-dynamic-blocks';

	/**
	 * The Meta_Tags_Context_Memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $context_memoizer;

	/**
	 * The Replace vars helper.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	private $replace_vars;

	/**
	 * The helpers surface.
	 *
	 * @var Helpers_Surface
	 */
	private $helpers;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Siblings_Block constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer $context_memoizer
	 * @param WPSEO_Replace_Vars $replace_vars
	 * @param Helpers_Surface $helpers
	 * @param Indexable_Repository $indexable_repository
	 */
	public function __construct(
		Meta_Tags_Context_Memoizer $context_memoizer,
		WPSEO_Replace_Vars $replace_vars,
		Helpers_Surface $helpers,
		Indexable_Repository $indexable_repository
	) {
		$this->context_memoizer = $context_memoizer;
		$this->replace_vars = $replace_vars;
		$this->helpers = $helpers;
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Presents the block output.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string The block output.
	 */
	public function present( $attributes ) {
		$presenter = new Breadcrumbs_Presenter();
		if ( defined( 'REST_REQUEST') && REST_REQUEST == true ) {
			$indexable = $this->indexable_repository->find_by_id_and_type( $_GET['post_id'], 'post' );
			$context = $this->context_memoizer->get( $indexable, 'Post_Type' );
		} else {
			$context   = $this->context_memoizer->for_current_page();
		}
		/** This filter is documented in src/integrations/front-end-integration.php */
		$presentation            = \apply_filters( 'wpseo_frontend_presentation', $context->presentation, $context );
		$presenter->presentation = $presentation;
		$presenter->replace_vars = $this->replace_vars;
		$presenter->helpers      = $this->helpers;
		$class_name = 'yoast-breadcrumbs';
		if ( ! empty( $attributes['className'] ) ) {
			$class_name .= ' ' . \esc_attr( $attributes['className'] );
		}
		return '<div class="' . $class_name . '">' . $presenter->present() . '</div>';
	}
}
