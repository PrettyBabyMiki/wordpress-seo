<?php
/**
 * A helper object for images.
 *
 * @package Yoast\WP\SEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

use WPSEO_Image_Utils;

/**
 * Class Image_Helper
 */
class Image_Helper {

	/**
	 * Image types that are supported by OpenGraph.
	 *
	 * @var array
	 */
	protected static $valid_image_types = [ 'image/jpeg', 'image/gif', 'image/png' ];

	/**
	 * Image extensions that are supported by OpenGraph.
	 *
	 * @var array
	 */
	protected static $valid_image_extensions = [ 'jpeg', 'jpg', 'gif', 'png' ];

	/**
	 * Determines whether or not the wanted attachment is considered valid.
	 *
	 * @param int $attachment_id The attachment ID to get the attachment by.
	 *
	 * @return bool Whether or not the attachment is valid.
	 */
	public function is_valid_attachment( $attachment_id ) {
		if ( ! \wp_attachment_is_image( $attachment_id ) ) {
			return false;
		}

		$post_mime_type = \get_post_mime_type( $attachment_id );
		if ( $post_mime_type === false ) {
			return false;
		}

		return $this->is_valid_image_type( $post_mime_type );
	}

	/**
	 * Checks if the given extension is a valid extension
	 *
	 * @param string $image_extension The image extension.
	 *
	 * @return bool True when valid.
	 */
	public function is_extension_valid( $image_extension ) {
		return \in_array( $image_extension, static::$valid_image_extensions, true );
	}

	/**
	 * Determines whether the passed mime type is a valid image type.
	 *
	 * @param string $mime_type The detected mime type.
	 *
	 * @return bool Whether or not the attachment is a valid image type.
	 */
	public function is_valid_image_type( $mime_type ) {
		return \in_array( $mime_type, static::$valid_image_types, true );
	}

	/**
	 * Retrieves the image source for an attachment.
	 *
	 * @param int    $attachment_id The attachment.
	 * @param string $image_size    The image size to retrieve.
	 *
	 * @return string The image url or an empty string when not found.
	 */
	public function get_attachment_image_source( $attachment_id, $image_size = 'full' ) {
		$attachment = \wp_get_attachment_image_src( $attachment_id, $image_size );

		if ( ! $attachment ) {
			return '';
		}

		return $attachment[0];
	}

	/**
	 * Retrieves the ID of the featured image.
	 *
	 * @param int $post_id The post id to get featured image id for.
	 *
	 * @return int|bool ID when found, false when not.
	 */
	public function get_featured_image_id( $post_id ) {
		if ( ! \has_post_thumbnail( $post_id ) ) {
			return false;
		}

		return \get_post_thumbnail_id( $post_id );
	}

	/**
	 * Find the right version of an image based on size.*
	 *
	 * @codeCoverageIgnore - We have to write test when this method contains own code.
	 *
	 * @param int    $attachment_id Attachment ID.
	 * @param string $size          Size name.
	 *
	 * @return array|false Returns an array with image data on success, false on failure.
	 */
	public function get_image( $attachment_id, $size ) {
		return \WPSEO_Image_Utils::get_image( $attachment_id, $size );
	}

	/**
	 * Retrieves the best attachment variation for the given attachment.
	 *
	 * @codeCoverageIgnore - We have to write test when this method contains own code.
	 *
	 * @param int   $attachment_id The attachment id.
	 * @param array $image_params  The image parameters to get dimensions for.
	 *
	 * @return bool|string The attachment url or false when no variations found.
	 */
	public function get_best_attachment_variation( $attachment_id, $image_params = [] ) {
		$variations = \WPSEO_Image_Utils::get_variations( $attachment_id );
		$variations = \WPSEO_Image_Utils::filter_usable_dimensions( $image_params, $variations );
		$variations = \WPSEO_Image_Utils::filter_usable_file_size( $variations );

		// If we are left without variations, there is no valid variation for this attachment.
		if ( empty( $variations ) ) {
			return false;
		}

		// The variations are ordered so the first variations is by definition the best one.
		return \reset( $variations );
	}

	/**
	 * Find an attachment ID for a given URL.
	 *
	 * @codeCoverageIgnore - We have to write test when this method contains own code.
	 *
	 * @param string $url The URL to find the attachment for.
	 *
	 * @return int The found attachment ID, or 0 if none was found.
	 */
	public function get_attachment_by_url( $url ) {
		return WPSEO_Image_Utils::get_attachment_by_url( $url );
	}

	/**
	 * Retrieves an attachment ID for an image uploaded in the settings.
	 *
	 * Due to self::get_attachment_by_url returning 0 instead of false.
	 * 0 is also a possibility when no ID is available.
	 *
	 * @codeCoverageIgnore - We have to write test when this method contains own code.
	 *
	 * @param string $setting The setting the image is stored in.
	 *
	 * @return int|bool The attachment id, or false or 0 if no ID is available.
	 */
	public function get_attachment_id_from_settings( $setting ) {
		return WPSEO_Image_Utils::get_attachment_id_from_settings( $setting );
	}
}
