<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Watches an Author to save the meta information to an Indexable when updated.
 */
class Indexable_Author_Watcher implements Integration_Interface {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The indexable builder.
	 *
	 * @var Indexable_Builder
	 */
	protected $builder;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Indexable_Author_Watcher constructor.
	 *
	 * @param Indexable_Repository $repository The repository to use.
	 * @param Indexable_Builder    $builder    The builder to use.
	 */
	public function __construct( Indexable_Repository $repository, Indexable_Builder $builder ) {
		$this->repository = $repository;
		$this->builder    = $builder;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 */
	public function register_hooks() {
		\add_action( 'user_register', [ $this, 'build_indexable' ], \PHP_INT_MAX );
		\add_action( 'profile_update', [ $this, 'build_indexable' ], \PHP_INT_MAX );
		\add_action( 'deleted_user', [ $this, 'handle_user_delete' ], 10, 2 );
	}

	/**
	 * Deletes user meta.
	 *
	 * @param int $user_id User ID to delete the metadata of.
	 *
	 * @return void
	 */
	public function delete_indexable( $user_id ) {
		$indexable = $this->repository->find_by_id_and_type( $user_id, 'user', false );

		if ( ! $indexable ) {
			return;
		}

		$indexable->delete();
		\do_action( 'wpseo_indexable_deleted', $indexable );
	}

	/**
	 * Saves user meta.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return void
	 */
	public function build_indexable( $user_id ) {
		$indexable = $this->repository->find_by_id_and_type( $user_id, 'user', false );
		$indexable = $this->builder->build_for_id_and_type( $user_id, 'user', $indexable );

		if ( $indexable ) {
			$indexable->object_last_modified = \max( $indexable->object_last_modified, \current_time( 'mysql' ) );
			$indexable->save();
		}
	}

	/**
	 * Handles the case in which an author is deleted.
	 *
	 * @param int      $user_id  User ID.
	 * @param int|null $reassign The ID of the user the old author's posts are reassigned to.
	 *
	 * @return void
	 */
	public function handle_user_delete( $user_id, $reassign ) {
		if ( $reassign !== null ) {
			$this->maybe_reassign_user_indexables( $user_id, $reassign );
		}

		$this->delete_indexable( $user_id );
	}

	/**
	 * Reassigns the indexables of a user to another user.
	 *
	 * @param int $user_id  The user ID.
	 * @param int $reassign The user ID to reassign the indexables to.
	 *
	 * @return void
	 */
	public function maybe_reassign_user_indexables( $user_id, $reassign ) {
		$this->repository->query()
			->set( 'author_id', $reassign )
			->where( 'author_id', $user_id )
			->update_many();
	}
}
