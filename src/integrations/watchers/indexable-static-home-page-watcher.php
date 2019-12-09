<?php
/**
 * Watcher that checks for changes in the page used as homepage.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\Free\Integrations\Watchers;

use Yoast\WP\Free\Conditionals\Admin_Conditional;
use Yoast\WP\Free\Helpers\Url_Helper;
use Yoast\WP\Free\Integrations\Integration_Interface;
use Yoast\WP\Free\Repositories\Indexable_Repository;

/**
 * Watches the static homepage option and updates the permalinks accordingly.
 */
class Indexable_Static_Home_Page_Watcher implements Integration_Interface {

	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * @var \Yoast\WP\Free\Repositories\Indexable_Repository
	 */
	protected $repository;

	/**
	 * Indexable_Static_Home_Page_Watcher constructor.
	 *
	 * @param \Yoast\WP\Free\Repositories\Indexable_Repository $repository The repository to use.
	 * @codeCoverageIgnore
	 */
	public function __construct( Indexable_Repository $repository ) {
		$this->repository = $repository;
	}

	/**
	 * @inheritdoc
	 */
	public function register_hooks() {
		\add_action( 'update_option_page_on_front', [ $this, 'update_static_homepage_permalink' ], 10, 2 );
	}

	/**
	 * Updates the new and previous homepage's permalink when the static home page is updated.
	 *
	 * @param string $old_value The previous homepage's ID.
	 * @param int    $value     The new homepage's ID.
	 */
	public function update_static_homepage_permalink( $old_value, $value ) {
		if ( \is_string( $old_value ) ) {
			$old_value = (int) $old_value;
		}

		$this->update_permalink_for_page( $old_value );
		$this->update_permalink_for_page( $value );
	}

	/**
	 * Updates the permalink based on the selected homepage settings.
	 *
	 * @param int $page_id The page's id.
	 */
	private function update_permalink_for_page( $page_id ) {
		if ( $page_id === 0 ) {
			return;
		}

		$indexable = $this->repository->find_by_id_and_type( $page_id, 'post', false );

		if ( $indexable === false ) {
			return;
		}

		$indexable->permalink = \get_permalink( $page_id );

		$indexable->save();
	}
}
