<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Integrations\Third_Party
 */

namespace Yoast\WP\Free\Integrations\Third_Party;

use WPSEO_Replace_Vars;
use Yoast\WP\Free\Conditionals\Front_End_Conditional;
use Yoast\WP\Free\Conditionals\WooCommerce_Conditional;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Integrations\Integration_Interface;
use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Class WooCommerce
 */
class WooCommerce implements Integration_Interface {

	/**
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * @var WPSEO_Replace_Vars
	 */
	private $replace_vars;

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ WooCommerce_Conditional::class, Front_End_Conditional::class ];
	}

	/**
	 * WooCommerce constructor.
	 *
	 * @param Options_Helper     $options      The options helper.
	 * @param WPSEO_Replace_Vars $replace_vars The replace vars helper.
	 */
	public function __construct( Options_Helper $options, WPSEO_Replace_Vars $replace_vars ) {
		$this->options      = $options;
		$this->replace_vars = $replace_vars;
	}

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_frontend_page_type_simple_page_id', [ $this, 'get_page_id' ] );
		\add_filter( 'wpseo_title', [ $this, 'title' ], 10, 2 );
		\add_filter( 'wpseo_metadesc', [ $this, 'description' ], 10, 2 );
	}

	/**
	 * Returns the ID of the WooCommerce shop page when the currently opened page is the shop page.
	 *
	 * @param int $page_id The page id.
	 *
	 * @return int The Page ID of the shop.
	 */
	public function get_page_id( $page_id ) {
		if ( ! $this->is_shop_page() ) {
			return $page_id;
		}

		if ( ! function_exists( 'wc_get_page_id' ) ) {
			return -1;
		}

		return wc_get_page_id( 'shop' );
	}

	/**
	 * Handles the title.
	 *
	 * @param string                 $title        The title.
	 * @param Indexable_Presentation $presentation The indexable presentation.
	 *
	 * @return string The title to use.
	 */
	public function title( $title, Indexable_Presentation $presentation ) {
		if ( $presentation->model->title ) {
			return $title;
		}

		if ( ! $this->is_shop_page() ) {
			return $title;
		}

		$post_type_archive_title = $this->get_product_template( 'title-ptarchive-product' );
		if ( $post_type_archive_title ) {
			return $post_type_archive_title;
		}

		return $title;
	}

	/**
	 * Handles the meta description.
	 *
	 * @param string                 $description  The title.
	 * @param Indexable_Presentation $presentation The indexable presentation.
	 *
	 * @return string The description to use.
	 */
	public function description( $description, Indexable_Presentation $presentation ) {
		if ( $presentation->model->description ) {
			return $description;
		}

		if ( ! $this->is_shop_page() ) {
			return $description;
		}

		$post_type_archive_description = $this->get_product_template( 'metadesc-ptarchive-product' );
		if ( $post_type_archive_description ) {
			return $post_type_archive_description;
		}

		return $description;
	}

	/**
	 * Checks if the current page is a WooCommerce shop page.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool True when the page is a shop page.
	 */
	protected function is_shop_page() {
		return \is_shop() && ! \is_search();
	}

	/**
	 * Uses template for the given option name and replace the replacement variables on it.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $option_name The option name to get the template for.
	 *
	 * @return string The rendered value.
	 */
	protected function get_product_template( $option_name ) {
		$template          = $this->options->get( $option_name );
		$product_post_type = \get_post_type_object( 'product' );

		return $this->replace_vars->replace( $template, $product_post_type );
	}
}
