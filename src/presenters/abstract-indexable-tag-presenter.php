<?php

namespace Yoast\WP\SEO\Presenters;

/**
 * Abstract presenter class for indexable tag presentations.
 */
abstract class Abstract_Indexable_Tag_Presenter extends Abstract_Indexable_Presenter {

	const NAME = 'unknown';

	/**
	 * The tag format including placeholders.
	 *
	 * @var string
	 */
	protected $tag_format = '<meta name="%$2s" value="%$1s" />';

	/**
	 * The method of escaping to use.
	 *
	 * @var string
	 */
	protected $escaping = 'attribute';

	/**
	 * Returns a tag in the head.
	 *
	 * @return string The tag.
	 */
	public function present() {
		$value = $this->get();

		if ( \is_string( $value ) && $value !== '' ) {
			return \sprintf( $this->tag_format, $this->escape( $value ), self::NAME );
		}

		return '';
	}

	/**
	 * Escaped the output.
	 *
	 * @param string $value The desired method of escaping; 'html', 'url' or 'attribute'.
	 *
	 * @return string The escaped value.
	 */
	protected function escape( $value ) {
		if ( $this->escaping === 'html' ) {
			return \esc_html( $value );
		}
		if ( $this->escaping === 'url' ) {
			return \esc_url( $value );
		}
		return \esc_attr( $value );
	}
}
