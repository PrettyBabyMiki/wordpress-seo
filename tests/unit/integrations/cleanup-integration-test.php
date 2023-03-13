<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations;

use Brain\Monkey;
use Mockery;
use stdClass;
use wpdb;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Integrations\Cleanup_Integration;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Cleanup_Integration_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Cleanup_Integration
 *
 * @group integrations
 */
class Cleanup_Integration_Test extends TestCase {

	/**
	 * Represents the instance we are testing.
	 *
	 * @var Cleanup_Integration
	 */
	private $instance;

	/**
	 * A helper for taxonomies.
	 *
	 * @var Mockery\MockInterface|Taxonomy_Helper
	 */
	private $taxonomy;

	/**
	 * A helper for post types.
	 *
	 * @var Mockery\MockInterface|Post_Type_Helper
	 */
	private $post_type;

	/**
	 * A helper for author archives.
	 *
	 * @var Mockery\MockInterface|Author_Archive_Helper
	 */
	private $author_archive;

	/**
	 * The indexables repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * The WPDB mock.
	 *
	 * @var Mockery\MockInterface|wpdb
	 */
	private $wpdb;

	/**
	 * Sets an instance for test purposes.
	 */
	protected function set_up() {
		parent::set_up();

		$this->taxonomy             = Mockery::mock( Taxonomy_Helper::class );
		$this->post_type            = Mockery::mock( Post_Type_Helper::class );
		$this->author_archive       = Mockery::mock( Author_Archive_Helper::class );
		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );

		$this->instance = new Cleanup_Integration(
			$this->taxonomy,
			$this->post_type,
			$this->author_archive,
			$this->indexable_repository
		);

		global $wpdb;

		$wpdb         = Mockery::mock( wpdb::class );
		$wpdb->prefix = 'wp_';

		$this->wpdb = $wpdb;
	}

	/**
	 * Tests the registration of the hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();
		$this->assertNotFalse( Monkey\Actions\has( 'wpseo_start_cleanup_indexables', [ $this->instance, 'run_cleanup' ] ), 'Does not have expected wpseo_cleanup filter' );
		$this->assertNotFalse( Monkey\Actions\has( 'wpseo_cleanup_cron', [ $this->instance, 'run_cleanup_cron' ] ), 'Does not have expected run_cleanup_cron filter' );
		$this->assertNotFalse( Monkey\Actions\has( 'wpseo_deactivate', [ $this->instance, 'reset_cleanup' ] ), 'Does not have expected reset_cleanup filter' );
	}

	/**
	 * Tests that the class uses the right conditionals.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		static::assertEquals( [], Cleanup_Integration::get_conditionals() );
	}

	/**
	 * Tests calling test_run_cleanup.
	 *
	 * @covers ::run_cleanup
	 * @covers ::get_cleanup_tasks
	 * @covers ::clean_indexables_with_object_type_and_object_sub_type
	 * @covers ::clean_indexables_with_post_status
	 * @covers ::cleanup_orphaned_from_table
	 * @covers ::get_limit
	 * @covers ::reset_cleanup
	 */
	public function test_run_cleanup() {
		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( Cleanup_Integration::CRON_HOOK );

		$query_limit = 1000;
		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		/* Clean up of indexables with object_sub_type shop-order */
		$this->setup_clean_indexables_with_object_type_and_object_sub_type_mocks( 50, 'post', 'shop_order', $query_limit );

		/* Clean up of indexables with post_status auto-draft */
		$this->setup_clean_indexables_with_post_status_mocks( 50, 'auto-draft', $query_limit );

		/* Clean up of indexables where post type is not publicly viewable */
		$this->setup_clean_indexables_for_non_publicly_viewable_post( 50, $query_limit );

		/* Clean up of indexables where taxonomy is not publicly viewable */
		$this->setup_clean_indexables_for_non_publicly_viewable_taxonomies( 50, $query_limit );

		/* Clean up of indexables that belong to users while the author archives are disabled */
		$this->setup_clean_indexables_for_authors_archive_disabled( 50, $query_limit );

		/* Clean up of indexables of users without an author archive */
		$this->setup_clean_indexables_for_authors_without_archive( 50, $query_limit );

		$query_return              = new stdClass();
		$query_return->object_id   = 10;
		$query_return->author_id   = 1;
		$query_return->post_author = 2;

		/* Update indexables that has been reassigned to another user */
		$this->setup_update_indexables_author_to_reassigned( [ $query_return ], $query_limit );

		/* Clean up of indexable hierarchy for deleted indexables */
		$this->setup_cleanup_orphaned_from_table_mocks( 50, 'Indexable_Hierarchy', 'indexable_id', $query_limit );

		/* Clean up of seo links ids for deleted indexables */
		$this->setup_cleanup_orphaned_from_table_mocks( 50, 'SEO_Links', 'indexable_id', $query_limit );

		/* Clean up of seo links target ids for deleted indexables */
		$this->setup_cleanup_orphaned_from_table_mocks( 50, 'SEO_Links', 'target_indexable_id', $query_limit );


		$this->instance->run_cleanup();
	}

	/**
	 * Tests calling test_run_cleanup.
	 *
	 * @covers ::run_cleanup
	 * @covers ::get_cleanup_tasks
	 * @covers ::clean_indexables_with_object_type_and_object_sub_type
	 * @covers ::clean_indexables_with_post_status
	 * @covers ::cleanup_orphaned_from_table
	 * @covers ::get_limit
	 * @covers ::reset_cleanup
	 */
	public function test_run_cleanup_db_query_failed() {
		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( Cleanup_Integration::CRON_HOOK );

		$query_limit = 1000;
		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		/* Clean up of indexables with object_sub_type shop-order */
		$this->setup_clean_indexables_with_object_type_and_object_sub_type_mocks( false, 'post', 'shop_order', $query_limit );

		$this->instance->run_cleanup();
	}

	/**
	 * Tests whether run_cleanup starts the cron-job.
	 *
	 * @covers ::run_cleanup
	 * @covers ::get_cleanup_tasks
	 * @covers ::get_limit
	 * @covers ::reset_cleanup
	 * @covers ::clean_indexables_with_object_type_and_object_sub_type
	 * @covers ::start_cron_job
	 */
	public function test_run_cleanup_starts_cron_job() {
		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( 'wpseo_cleanup_cron' );

		$query_limit = 1000;

		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		$this->setup_clean_indexables_with_object_type_and_object_sub_type_mocks( 1000, 'post', 'shop_order', $query_limit );

		Monkey\Functions\expect( 'update_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION, 'clean_indexables_with_object_type_and_object_sub_type_shop_order' );

		Monkey\Functions\expect( 'wp_schedule_event' )
			->once()
			->with( Mockery::type( 'int' ), 'hourly', Cleanup_Integration::CRON_HOOK );

		$this->instance->run_cleanup();
	}

	/**
	 * Tests the run_cleanup_cron function.
	 *
	 * Specifically tests whether the option is set to the next task when the current task is finished.
	 *
	 * @covers ::run_cleanup_cron
	 * @covers ::get_cleanup_tasks
	 * @covers ::get_limit
	 * @covers ::start_cron_job
	 */
	public function test_run_cleanup_cron_next_task() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION )
			->andReturn( 'clean_indexables_with_object_type_and_object_sub_type_shop_order' );

		$query_limit = 1000;

		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		$this->setup_clean_indexables_with_object_type_and_object_sub_type_mocks( 0, 'post', 'shop_order', $query_limit );

		Monkey\Functions\expect( 'update_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION, 'clean_indexables_by_post_status_auto-draft' );

		$this->instance->run_cleanup_cron();
	}

	/**
	 * Tests the run_cleanup_cron function.
	 *
	 * Specifically tests whether everything is cleaned up after the last task is finished.
	 *
	 * @covers ::run_cleanup_cron
	 * @covers ::get_cleanup_tasks
	 * @covers ::get_limit
	 * @covers ::cleanup_orphaned_from_table
	 * @covers ::start_cron_job
	 */
	public function test_run_cleanup_cron_last_task() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION )
			->andReturn( 'clean_orphaned_content_seo_links_target_indexable_id' );

		$query_limit = 1000;
		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		$this->setup_cleanup_orphaned_from_table_mocks( 0, 'SEO_Links', 'target_indexable_id', $query_limit );

		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( 'wpseo_cleanup_cron' );

		$this->instance->run_cleanup_cron();
	}

	/**
	 * Tests the run_cleanup_cron function.
	 *
	 * Specifically tests whether everything is cleaned up when no tasks are left.
	 *
	 * @covers ::run_cleanup_cron
	 * @covers ::get_cleanup_tasks
	 */
	public function test_run_cleanup_cron_no_tasks_left() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION )
			->andReturn( false );

		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( 'wpseo_cleanup_cron' );

		$this->instance->run_cleanup_cron();
	}

	/**
	 * Tests the run_cleanup_cron function.
	 *
	 * Specifically tests whether everything is cleaned up when no tasks are left.
	 *
	 * @covers ::run_cleanup_cron
	 * @covers ::get_limit
	 * @covers ::get_cleanup_tasks
	 */
	public function test_run_cleanup_cron_db_query_failed() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION )
			->andReturn( 'clean_indexables_by_post_status_auto-draft' );

		$query_limit = 1000;
		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		$this->setup_clean_indexables_with_post_status_mocks( false, 'auto-draft', 1000 );

		Monkey\Functions\expect( 'delete_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION );

		Monkey\Functions\expect( 'wp_unschedule_hook' )
			->once()
			->with( 'wpseo_cleanup_cron' );

		$this->instance->run_cleanup_cron();
	}

	/**
	 * Tests the run_cleanup_cron function.
	 *
	 * Specifically tests whether everything is not cleaned up when there are still items left.
	 *
	 * @covers ::run_cleanup_cron
	 * @covers ::get_limit
	 * @covers ::get_cleanup_tasks
	 */
	public function test_run_cleanup_cron_items_left() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION )
			->andReturn( 'clean_indexables_by_post_status_auto-draft' );

		$query_limit = 1000;
		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( $query_limit );

		$this->setup_clean_indexables_with_post_status_mocks( 50, 'auto-draft', 1000 );

		$this->instance->run_cleanup_cron();
	}

	/**
	 * Tests the run_cleanup_cron function.
	 *
	 * Specifically tests whether the query limit is
	 *
	 * @covers ::run_cleanup_cron
	 * @covers ::get_limit
	 * @covers ::get_cleanup_tasks
	 */
	public function test_run_cleanup_invalid_query_limit_from_filter() {
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( Cleanup_Integration::CURRENT_TASK_OPTION )
			->andReturn( 'clean_indexables_by_post_status_auto-draft' );

		Monkey\Filters\expectApplied( 'wpseo_cron_query_limit_size' )
			->once()
			->andReturn( null );

		$this->setup_clean_indexables_with_post_status_mocks( 50, 'auto-draft', 1000 );

		$this->instance->run_cleanup_cron();
	}

	/**
	 * Sets up expectations for the clean_indexables_with_object_type_and_object_sub_type cleanup task.
	 *
	 * @param int    $return_value    The number of deleted items to return.
	 * @param string $object_type     The object type.
	 * @param string $object_sub_type The object sub type.
	 * @param int    $limit           The query limit.
	 *
	 * @return void
	 */
	private function setup_clean_indexables_with_object_type_and_object_sub_type_mocks( $return_value, $object_type, $object_sub_type, $limit ) {
		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'DELETE FROM wp_yoast_indexable WHERE object_type = %s AND object_sub_type = %s ORDER BY id LIMIT %d',
				$object_type,
				$object_sub_type,
				$limit
			)
			->andReturn( 'prepared_shop_order_delete_query' );

		$this->wpdb->shouldReceive( 'query' )
			->once()
			->with( 'prepared_shop_order_delete_query' )
			->andReturn( $return_value );
	}

	/**
	 * Sets up expectations for the clean_indexables_with_post_status cleanup task.
	 *
	 * @param int    $return_value The number of deleted items to return.
	 * @param string $post_status  The post status.
	 * @param int    $limit        The query limit.
	 *
	 * @return void
	 */
	private function setup_clean_indexables_with_post_status_mocks( $return_value, $post_status, $limit ) {
		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'DELETE FROM wp_yoast_indexable WHERE object_type = \'post\' AND post_status = %s ORDER BY id LIMIT %d',
				$post_status,
				$limit
			)
			->andReturn( 'prepared_auto_draft_delete_query' );

		$this->wpdb->shouldReceive( 'query' )
			->once()
			->with( 'prepared_auto_draft_delete_query' )
			->andReturn( $return_value );
	}

	/**
	 * Sets up expectations for the cleanup_orphaned_from_table cleanup task.
	 *
	 * @param int    $return_value The number of deleted items to return.
	 * @param string $model_name   The human-readable model name.
	 * @param string $column       The column.
	 * @param int    $limit        The query limit.
	 *
	 * @return void
	 */
	private function setup_cleanup_orphaned_from_table_mocks( $return_value, $model_name, $column, $limit ) {
		$table = Model::get_table_name( $model_name );

		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				"
			SELECT table_to_clean.{$column}
			FROM {$table} table_to_clean
			LEFT JOIN wp_yoast_indexable AS indexable_table
			ON table_to_clean.{$column} = indexable_table.id
			WHERE indexable_table.id IS NULL
			AND table_to_clean.{$column} IS NOT NULL
			LIMIT %d",
				$limit
			)
			->andReturn( 'prepared_indexable_hierarchy_select_query' );

		$ids = \array_fill( 0, $return_value, 1 );

		$this->wpdb->shouldReceive( 'get_col' )
			->once()
			->with( 'prepared_indexable_hierarchy_select_query' )
			->andReturn( $ids );

		if ( $return_value === 0 ) {
			return;
		}

		$this->wpdb->shouldReceive( 'query' )
			->once()
			->with( "DELETE FROM {$table} WHERE {$column} IN( " . \implode( ',', $ids ) . ' )' )
			->andReturn( 50 );
	}

	/**
	 * Sets up expectations for the clean_indexables_for_non_publicly_viewable_post cleanup task.
	 *
	 * @param int $return_value The number of deleted items to return.
	 * @param int $limit        The query limit.
	 *
	 * @return void
	 */
	private function setup_clean_indexables_for_non_publicly_viewable_post( $return_value, $limit ) {
		$this->post_type->expects( 'get_indexable_post_types' )->once()->andReturns( [ 'my_cpt', 'post', 'attachment' ] );
		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'DELETE FROM wp_yoast_indexable
				WHERE object_type = \'post\'
				AND object_sub_type IS NOT NULL
				AND object_sub_type NOT IN ( %s, %s, %s )
				LIMIT %d',
				[ 'my_cpt', 'post', 'attachment', $limit ]
			)
			->andReturn( 'prepared_clean_query' );

		$this->wpdb->expects( 'query' )
			->once()
			->with( 'prepared_clean_query' )
			->andReturn( $return_value );
	}

	/**
	 * Sets up expectations for the clean_indexables_for_non_publicly_viewable_taxonomies cleanup task.
	 *
	 * @param int $return_value The number of deleted items to return.
	 * @param int $limit        The query limit.
	 *
	 * @return void
	 */
	private function setup_clean_indexables_for_non_publicly_viewable_taxonomies( $return_value, $limit ) {
		$this->taxonomy->expects( 'get_indexable_taxonomies' )->once()->andReturns( [ 'category', 'post_tag', 'my_custom_tax' ] );

		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'DELETE FROM wp_yoast_indexable
				WHERE object_type = \'term\'
				AND object_sub_type IS NOT NULL
				AND object_sub_type NOT IN ( %s, %s, %s )
				LIMIT %d',
				[ 'category', 'post_tag', 'my_custom_tax', $limit ]
			)
			->andReturn( 'prepared_clean_query' );

		$this->wpdb->expects( 'query' )
			->once()
			->with( 'prepared_clean_query' )
			->andReturn( $return_value );
	}

	/**
	 * Sets up expectations for the clean_indexables_for_authors_archive_disabled cleanup task.
	 *
	 * @param int $return_value The number of deleted items to return.
	 * @param int $limit        The query limit.
	 *
	 * @return void
	 */
	private function setup_clean_indexables_for_authors_archive_disabled( $return_value, $limit ) {
		$this->author_archive->expects( 'are_disabled' )->once()->andReturnTrue();

		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with( 'DELETE FROM wp_yoast_indexable WHERE object_type = \'user\' LIMIT %d', $limit )
			->andReturn( 'prepared_clean_query' );

		$this->wpdb->expects( 'query' )
			->once()
			->with( 'prepared_clean_query' )
			->andReturn( $return_value );
	}

	/**
	 * Sets up expectations for the clean_indexables_for_authors_without_archive cleanup task.
	 *
	 * @param int $return_value The number of deleted items to return.
	 * @param int $limit        The query limit.
	 *
	 * @return void
	 */
	private function setup_clean_indexables_for_authors_without_archive( $return_value, $limit ) {
		$this->author_archive->expects( 'get_author_archive_post_types' )->once()->andReturns( [ 'post' ] );

		Monkey\Functions\expect( 'get_post_stati' )->once()->andReturns( [ 'publish', 'draft' ] );
		Monkey\Functions\expect( 'is_post_status_viewable' )->twice()->andReturnUsing(
			static function ( $value ) {
				return $value === 'publish';
			}
		);
		$this->wpdb->posts = 'wp_posts';

		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				'DELETE FROM wp_yoast_indexable
				WHERE object_type = \'user\'
				AND object_id NOT IN (
					SELECT DISTINCT post_author
					FROM wp_posts
					WHERE post_type IN ( %s )
					AND post_status IN ( %s )
				) LIMIT %d',
				[ 'post', 'publish', $limit ]
			)
			->andReturn( 'prepared_clean_query' );

		$this->wpdb->expects( 'query' )
			->once()
			->with( 'prepared_clean_query' )
			->andReturn( $return_value );
	}

		/**
		 * Sets up expectations for the clean_indexables_for_authors_without_archive cleanup task.
		 *
		 * @param int $return_value The number of deleted items to return.
		 * @param int $limit        The query limit.
		 *
		 * @return void
		 */
	private function setup_update_indexables_author_to_reassigned( $return_value, $limit ) {
		$this->wpdb->posts = 'wp_posts';
		$this->wpdb->users = 'wp_users';

		$indexable      = Mockery::mock( Indexable::class );
		$indexable->orm = Mockery::mock( ORM::class );

		$this->wpdb->shouldReceive( 'prepare' )
			->once()
			->with(
				"
			SELECT wp_yoast_indexable.object_id, wp_yoast_indexable.author_id, wp_posts.post_author
			FROM wp_yoast_indexable JOIN wp_posts on wp_yoast_indexable.object_id = wp_posts.id
			WHERE object_type='post'
			AND author_id NOT IN(SELECT id from wp_users)
			ORDER BY wp_yoast_indexable.author_id
			LIMIT %d",
				$limit
			)
			->andReturn( 'prepared_query' );

			$this->wpdb->shouldReceive( 'get_results' )
				->once()
				->with( 'prepared_query' )
				->andReturn( $return_value );

			$this->indexable_repository->expects( 'find_by_id_and_type' )
				->once()
				->with( $return_value[0]->object_id, 'post' )
				->andReturn( $indexable );

			$indexable->expects( 'save' );
	}
}
