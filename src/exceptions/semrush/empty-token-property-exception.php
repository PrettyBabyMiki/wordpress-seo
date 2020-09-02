<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\WP\SEO\Exceptions\SEMrush
 */

namespace Yoast\WP\SEO\Exceptions\SEMrush;

/**
 * Class Empty_Token_Property_Exception
 */
class Empty_Token_Property_Exception extends \Exception {

	/**
	 * Empty_Token_Property_Exception constructor.
	 *
	 * @param string $property The property that is empty.
	 */
	public function __construct( $property ) {
		parent::__construct( sprintf( 'Token creation failed. Property `%s` cannot be empty.', $property ), 400 );
	}
}
