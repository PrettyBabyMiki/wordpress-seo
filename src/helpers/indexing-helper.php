<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for indexing.
 */
class Indexing_Helper {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Indexing_Helper constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Sets the indexing reason.
	 *
	 * @param string $reason The indexing reason.
	 *
	 * @return void
	 */
	public function set_reason( $reason ) {
		$this->options_helper->set( 'indexing_reason', $reason );
	}

	/**
	 * Gets the indexing reason.
	 *
	 * @return mixed Returns the reason if found, and an empty string otherwise.
	 */
	public function get_reason() {
		return $this->options_helper->get( 'indexing_reason', '' );
	}

	/**
	 * Sets the start time when the indexing process has started but not completed.
	 *
	 * @param int|bool $value The start time when the indexing process has started but not completed, false otherwise.
	 *
	 * @return void
	 */
	public function set_started( $value ) {
		$this->options_helper->set( 'indexation_started', $value );
	}

	/**
	 * Gets the start time when the indexing process has started but not completed.
	 *
	 * @return int|bool $start_time The start time when the indexing process has started but not completed, false otherwise.
	 */
	public function get_started() {
		return $this->options_helper->get( 'indexation_started' );
	}

	/**
	 * Sets a boolean that indicates whether or not a site still has to be indexed for the first time.
	 *
	 * @param bool $value Whether or not a site still has to be indexed for the first time.
	 *
	 * @return void
	 */
	public function set_first_time( $value ) {
		$this->options_helper->set( 'indexing_first_time', $value );
	}

	/**
	 * Gets a boolean that indicates whether or not a site still has to be indexed for the first time.
	 *
	 * @return void
	 */
	public function get_first_time() {
		return $this->options_helper->get( 'indexing_first_time', true );
	}
}
