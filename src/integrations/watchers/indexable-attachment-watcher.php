<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast_Notification_Center;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Config\Indexing_Reasons;
use Yoast\WP\SEO\Helpers\Indexing_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Watches the disable-attachment key in wpseo_titles, in order to clear the permalink of the category indexables.
 */
class Indexable_Attachment_Watcher implements Integration_Interface {

	/**
	 * The indexing helper.
	 *
	 * @var Indexing_Helper
	 */
	protected $indexing_helper;

	/**
	 * The notifications center.
	 *
	 * @var Yoast_Notification_Center
	 */
	private $notification_center;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Indexable_Attachment_Watcher constructor.
	 *
	 * @param Indexing_Helper           $indexing_helper     The indexing helper.
	 * @param Yoast_Notification_Center $notification_center The notification center.
	 */
	public function __construct(
		Indexing_Helper $indexing_helper,
		Yoast_Notification_Center $notification_center
	) {
		$this->indexing_helper     = $indexing_helper;
		$this->notification_center = $notification_center;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'update_option_wpseo_titles', [ $this, 'check_option' ], 20, 2 );
	}

	/**
	 * Checks if the disable-attachment key in wpseo_titles has a change in value, and if so,
	 * either it cleans up attachment indexables when it has been toggled to true,
	 * or it starts displaying a notification for the user to start a new SEO optimization.
	 *
	 * @param array $old_value The old value of the wpseo_titles option.
	 * @param array $new_value The new value of the wpseo_titles option.
	 *
	 * @return void
	 */
	public function check_option( $old_value, $new_value ) {
		// If this is the first time saving the option, in which case its value would be false.
		if ( $old_value === false ) {
			$old_value = [];
		}

		// If either value is not an array, return.
		if ( ! \is_array( $old_value ) || ! \is_array( $new_value ) ) {
			return;
		}

		// If both values aren't set, they haven't changed.
		if ( ! isset( $old_value['disable-attachment'] ) && ! isset( $new_value['disable-attachment'] ) ) {
			return;
		}

		// If a new value has been set for 'disable-attachment', clear the category permalinks.
		if ( $old_value['disable-attachment'] !== $new_value['disable-attachment'] ) {
			// Delete cache because we now might have new stuff to index or old unindexed stuff don't need indexing anymore.
			\delete_transient( Indexable_Post_Indexation_Action::UNINDEXED_COUNT_TRANSIENT );
			\delete_transient( Indexable_Post_Indexation_Action::UNINDEXED_LIMITED_COUNT_TRANSIENT );

			switch ( $new_value['disable-attachment'] ) {
				case false:
					// @TODO: Figure out what to do with new settings, because they don't reload the page anymore.
					$this->indexing_helper->set_reason( Indexing_Reasons::REASON_ATTACHMENTS_MADE_ENABLED );
					return;
				case true:
				default:
					// @TODO: Clean up attachment indexables
					return;
			}
		}
	}
}
