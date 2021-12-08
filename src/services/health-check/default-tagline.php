<?php

namespace Yoast\WP\SEO\Services\Health_Check;

/**
 * Passes when the tagline is set to something other than the WordPress default tagline.
 */
class Default_Tagline extends Health_Check {

	/**
	 * Runs the health check.
	 *
	 * @var Default_Tagline_Runner
	 */
	private $runner;

	/**
	 * Generates WordPress-friendly health check results.
	 *
	 * @var Default_Tagline_Presenter
	 */
	private $presenter;

	/**
	 * Constructor.
	 *
	 * @param  Default_Tagline_Runner    $runner The object that implements the actual health check.
	 * @param  Default_Tagline_Presenter $presenter The object that generates WordPress-friendly results.
	 * @return void
	 */
	public function __construct( Default_Tagline_Runner $runner, Default_Tagline_Presenter $presenter ) {
		$this->runner    = $runner;
		$this->presenter = $presenter;
		$this->presenter->set_test_identifier( $this->get_test_identifier() );

		$this->set_runner( $this->runner );
	}

	/**
	 * Returns a human-readable label for this health check.
	 *
	 * @return string
	 */
	public function get_test_label() {
		return 'Default tagline';
	}

	/**
	 * Returns the WordPress-friendly health check result.
	 *
	 * @return string[]
	 */
	protected function get_result() {
		if ( $this->runner->is_successful() ) {
			return $this->presenter->get_success_result();
		}

		return $this->presenter->get_has_default_tagline_result();
	}
}
