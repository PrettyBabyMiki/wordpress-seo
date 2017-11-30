<?php

namespace Yoast\YoastSEO;

use Yoast\WordPress\Integration;
use Yoast\WordPress\Integration_Group;

class Bootstrap extends Integration_Group {

	/**
	 * @return Integration[] List of registered services.
	 */
	protected function get_integrations() {
		return array(
			new Database\Bootstrap(),
			new Indexable\Bootstrap()
		);
	}
}
