<?php

namespace Yoast\WP\SEO\Integrations;

use Closure;
use Yoast\WP\Lib\Model;
/**
 * Adds cleanup hooks.
 */
class Cleanup_Integration implements Integration_Interface {

	/**
	 * Identifier used to determine the current task.
	 *
	 * @var string
	 */
	const CURRENT_TASK_OPTION = "wpseo-cleanup-current-task";

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wpseo_cleanup_cron', [ $this, '_run_cleanup_cron' ] );
		\add_action( 'wpseo_deactivate', [ $this, 'reset_cleanup' ] );
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array The array of conditionals.
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * Returns an array of cleanup tasks.
	 *
	 * @return Closure[] The cleanup tasks.
	 */
	private function get_cleanup_tasks() {
		return [
			"clean_indexables_by_object_sub_type_shop-order" => function( $limit ) {
				return $this->clean_indexables_with_object_type( "post", "shop-order", $limit );
			},
			"clean_indexables_by_post_status_auto-draft" => function( $limit ) {
				return $this->clean_indexables_with_post_status( "auto-draft", $limit );
			},
			/* These should always be the last one to be called */
			"clean_orphaned_content_indexable_hierarchy" => function( $limit ) {
				return $this->cleanup_orphaned_from_table( 'Indexable_Hierarchy', 'indexable_id', $limit );
			},
			"clean_orphaned_content_seo_links_indexable_id" => function( $limit ) {
				return $this->cleanup_orphaned_from_table( 'SEO_Links', 'indexable_id', $limit );
			},
			"clean_orphaned_content_seo_links_target_indexable_id" => function( $limit ) {
				return $this->cleanup_orphaned_from_table( 'SEO_Links', 'target_indexable_id', $limit );
			},
		];
	}

	/**
	 * Starts the indexables cleanup.
	 *
	 * @return void
	 */
	public function run_cleanup() {
		$this->reset_cleanup();

		$cleanups = $this->get_cleanup_tasks();

		foreach ( $cleanups as $name => $action ) {
			$limit = $this->get_limit();

			$items_cleaned = $action( $limit );
			if ( $items_cleaned < $limit ) {
				continue;
			}

			// There are more items to delete for the current cleanup job, start a cronjob at the specified job.
			$this->start_cron_job( $name );
			return;
		}
	}

	/**
	 * Gets the deletion limit for cleanups.
	 *
	 * @return int The limit for the amount of entities to be cleaned.
	 */
	private function get_limit() {
		$limit = \apply_filters( 'wpseo_cron_query_limit_size', 1000 );

		if ( ! \is_int( $limit ) ) {
			$limit = 1000;
		}

		return $limit;
	}

	/**
	 * Resets and stops the cleanup integration.
	 *
	 * @return void 
	 */
	private function reset_cleanup() {
		\delete_option( self::CURRENT_TASK_OPTION );
		\wp_unschedule_hook( 'wpseo_cleanup_cron' );
	}

	/**
	 * Starts the cleanup cron job.
	 *
	 * @return void 
	 */
	private function start_cron_job( $job_name ) {
		\update_option( self::CURRENT_TASK_OPTION, $job_name );
		\wp_schedule_event(
			time(),
			'hourly',
			'wpseo_cleanup_cron',
		);
	}

	/**
	 * The callback that is called for the cleanup cron job.
	 *
	 * @return void 
	 */
	public function _run_cleanup_cron() {
		$current_task_name = \get_option( self::CURRENT_TASK_OPTION, '' );

		if ( $current_task_name === false ) {
			$this->reset_cleanup();
			return;
		}

		$limit = $this->get_limit();
		$tasks = $this->get_cleanup_tasks();
		
		while ( $current_task = \current( $tasks ) ) {
			// Skip the tasks that have already been done.
			if ( \key( $tasks ) !== $current_task_name ) {
				\next( $tasks );
				continue;
			}

			$items_cleaned = $current_task( $limit );

			if( $items_cleaned === 0 ) {
				// Check if we are finshed with all tasks.
				if ( \next( $tasks ) === false ) {
					$this->reset_cleanup();
					return;
				}

				// Continue with the next task next time.
				\update_option( self::CURRENT_TASK_OPTION, \key( $tasks ) );
				return;
			}
		}
	}

	/**
	 * Cleans orphaned rows from a yoast table.
	 *
	 * @param string $table  The table to cleanup.
	 * @param string $column The table column the cleanup will rely on.
	 * @param int    $limit  The limit we'll apply to the queries.
	 *
	 * @return int The number of deleted rows.
	 */
	protected function cleanup_orphaned_from_table( $table, $column, $limit = 1000 ) {
		global $wpdb;

		$table           = Model::get_table_name( $table );
		$indexable_table = Model::get_table_name( 'Indexable' );
		$limit           = \apply_filters( 'wpseo_cron_query_limit_size', $limit );

		// Sanitize the $limit.
		$limit = ! is_int( $limit ) ? 1000 : $limit;
		$limit = ( $limit > 5000 ) ? 5000 : ( ( $limit <= 0 ) ? 1000 : $limit );

		// Warning: If this query is changed, make sure to update the query in cleanup_orphaned_from_table in Premium as well.
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		$query = $wpdb->prepare(
			"
			SELECT table_to_clean.{$column}
			FROM {$table} table_to_clean
			LEFT JOIN {$indexable_table} AS indexable_table
			ON table_to_clean.{$column} = indexable_table.id
			WHERE indexable_table.id IS NULL
			AND table_to_clean.{$column} IS NOT NULL
			LIMIT %d",
			$limit
		);
		// phpcs:enable

		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: Already prepared.
		$orphans = $wpdb->get_col( $query );

		if ( empty( $orphans ) ) {
			return 0;
		}

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: Already prepared.
		return intval( $wpdb->query( "DELETE FROM $table WHERE {$column} IN( " . implode( ',', $orphans ) . ' ) ' ) );
	}

	/**
	 * Deletes rows from the indexable table depending on the object_type and object_sub_type.
	 *
	 * @param string $object_type     The object type to query.
	 * @param string $object_sub_type The object subtype to query.
	 * @param int    $limit           The limit we'll apply to the delete query.
	 *
	 * @return int|bool The number of rows that was deleted or false if the query failed.
	 */
	protected function clean_indexables_with_object_type( $object_type, $object_sub_type, $limit ) {
		global $wpdb;

		$indexable_table = Model::get_table_name( 'Indexable' );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		$sql = $wpdb->prepare( "DELETE FROM $indexable_table WHERE object_type = %s AND object_sub_type = %s ORDER BY id LIMIT %d", $object_type, $object_sub_type, $limit );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: Already prepared.
		return $wpdb->query( $sql );
	}

	/**
	 * Deletes rows from the indexable table depending on the post_status.
	 *
	 * @param string $post_status     The post status to query.
	 * @param int    $limit           The limit we'll apply to the delete query.
	 *
	 * @return int|bool The number of rows that was deleted or false if the query failed.
	 */
	protected function clean_indexables_with_post_status( $post_status, $limit ) {
		global $wpdb;

		$indexable_table = Model::get_table_name( 'Indexable' );

		// phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Reason: There is no unescaped user input.
		$sql = $wpdb->prepare( "DELETE FROM $indexable_table WHERE post_status = %s ORDER BY id LIMIT %d", $post_status, $limit );
		// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared, WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching -- Reason: Already prepared.
		return $wpdb->query( $sql );
	}
}
