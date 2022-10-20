<?php

namespace Yoast\WP\SEO\Tests\Unit\Builders;

use Brain\Monkey;
use Mockery;
use Yoast\WP\Lib\ORM;
use Yoast\WP\SEO\Builders\Indexable_Author_Builder;
use Yoast\WP\SEO\Exceptions\Indexable\Author_Not_Built_Exception;
use Yoast\WP\SEO\Helpers\Author_Archive_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Values\Indexables\Indexable_Builder_Versions;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Author_Builder
 * @covers \Yoast\WP\SEO\Builders\Indexable_Author_Builder
 */
class Indexable_Author_Builder_Test extends TestCase {

	/**
	 * The indexable mock.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Indexable
	 */
	protected $indexable_mock;

	/**
	 * The author archive.
	 *
	 * @var Author_Archive_Helper|Mockery\MockInterface
	 */
	protected $author_archive;

	/**
	 * The indexable builder versions
	 *
	 * @var Indexable_Builder_Versions|Mockery\MockInterface
	 */
	protected $versions;

	/**
	 * The post helper
	 *
	 * @var Post_Helper|Mockery\MockInterface
	 */
	protected $post_helper;

	/**
	 * The wpdb instance
	 *
	 * @var wpdb|Mockery\MockInterface
	 */
	protected $wpdb;

	/**
	 * The class under test.
	 *
	 * @var Indexable_Author_Builder
	 */
	protected $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->versions = Mockery::mock( Indexable_Builder_Versions::class );
		$this->versions
			->shouldReceive( 'get_latest_version_for_type' )
			->with( 'user' )
			->andReturn( 2 );

		$this->author_archive = Mockery::mock( Author_Archive_Helper::class );

		$this->post_helper = Mockery::mock( Post_Helper::class );
		$this->wpdb        = Mockery::mock( 'wpdb' );
		$this->wpdb->posts = 'wp_posts';

		$this->instance = new Indexable_Author_Builder( $this->author_archive, $this->versions, $this->post_helper, $this->wpdb );
	}

	/**
	 * Mocks an indexable.
	 *
	 * @return Indexable|Mockery\MockInterface
	 */
	protected function mock_indexable() {
		$indexable_mock      = Mockery::mock( Indexable::class );
		$indexable_mock->orm = Mockery::mock( ORM::class );

		Monkey\Functions\expect( 'get_author_posts_url' )->once()->with( 1 )->andReturn( 'https://permalink' );

		$indexable_mock->orm->expects( 'set' )->with( 'object_id', 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'object_type', 'user' );
		$indexable_mock->orm->expects( 'set' )->with( 'permalink', 'https://permalink' );
		$indexable_mock->orm->expects( 'set' )->with( 'is_cornerstone', false );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nofollow', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noarchive', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_noimageindex', null );
		$indexable_mock->orm->expects( 'set' )->with( 'is_robots_nosnippet', null );

		// Resetting the image.
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image', null );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_id', null );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_source', null );
		$indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_meta', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image_id', null );
		$indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', null );

		$indexable_mock->orm->expects( 'set' )->with( 'is_public', null );
		$indexable_mock->orm->expects( 'set' )->with( 'has_public_posts', true );

		$indexable_mock->orm->expects( 'get' )->with( 'is_robots_noindex' )->andReturn( 0 );

		Monkey\Functions\expect( 'get_current_blog_id' )->once()->andReturn( 1 );
		$indexable_mock->orm->expects( 'set' )->with( 'blog_id', 1 );

		return $indexable_mock;
	}

	/**
	 * Tests the formatting of the indexable data.
	 *
	 * @covers ::__construct
	 * @covers ::build
	 */
	public function test_build() {
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_title', 1 )->andReturn( 'title' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_metadesc', 1 )->andReturn( 'description' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_noindex_author', 1 )->andReturn( 'on' );

		$this->indexable_mock = $this->mock_indexable();

		$this->indexable_mock->orm->expects( 'set' )->with( 'title', 'title' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'description', 'description' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', true );
		$this->indexable_mock->orm->expects( 'set' )->with( 'version', 2 );

		$this->indexable_mock->orm->expects( 'get' )->once()->with( 'open_graph_image' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'open_graph_image_id' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'open_graph_image_source' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'twitter_image' );
		$this->indexable_mock->orm->expects( 'get' )->times( 3 )->with( 'twitter_image_id' );
		$this->indexable_mock->orm->expects( 'get' )->with( 'object_id' );

		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image', 'avatar_image.jpg' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_source', 'gravatar-image' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'twitter_image', 'avatar_image.jpg' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', 'gravatar-image' );

		$this->post_helper->expects( 'get_public_post_statuses' )->once()->andReturn( [ 'publish' ] );

		$this->author_archive
			->expects( 'author_has_public_posts' )
			->with( 1 )
			->andReturn( true );
		$this->author_archive
			->expects( 'is_disabled_for_user' )
			->with( 1 )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_disabled' )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_not_indexed' )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_not_indexed_for_users_without_posts' )
			->andReturn( false );

		$this->wpdb->expects( 'prepare' )->once()->with(
			"
			SELECT MAX(p.post_modified_gmt) AS last_modified, MIN(p.post_date_gmt) AS published_at
			FROM {$this->wpdb->posts} AS p
			WHERE p.post_status IN (%s)
				AND p.post_password = ''
				AND p.post_author = %d
		",
			[ 'publish', 1 ]
		)->andReturn( 'PREPARED_QUERY' );
		$this->wpdb->expects( 'get_row' )->once()->with( 'PREPARED_QUERY' )->andReturn(
			(object) [
				'last_modified' => '1234-12-12 00:00:00',
				'published_at'  => '1234-12-12 00:00:00',
			]
		);

		$this->indexable_mock->orm->expects( 'set' )->with( 'object_published_at', '1234-12-12 00:00:00' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 00:00:00' );

		Monkey\Functions\expect( 'get_avatar_url' )
			->once()
			->andReturn( 'avatar_image.jpg' );

		$this->instance->build( 1, $this->indexable_mock );
	}

	/**
	 * Tests the formatting of the indexable data when there is no alternative image for the social image.
	 *
	 * @covers ::__construct
	 * @covers ::build
	 */
	public function test_build_without_alternative_image() {
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_title', 1 )->andReturn( 'title' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_metadesc', 1 )->andReturn( 'description' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_noindex_author', 1 )->andReturn( 'on' );

		$this->indexable_mock = $this->mock_indexable();

		$this->indexable_mock->orm->expects( 'set' )->with( 'title', 'title' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'description', 'description' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', true );
		$this->indexable_mock->orm->expects( 'set' )->with( 'version', 2 );

		$this->indexable_mock->orm->expects( 'get' )->once()->with( 'open_graph_image' );
		$this->indexable_mock->orm->expects( 'get' )->once()->with( 'open_graph_image_id' );
		$this->indexable_mock->orm->expects( 'get' )->once()->with( 'open_graph_image_source' );
		$this->indexable_mock->orm->expects( 'get' )->once()->with( 'twitter_image' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'twitter_image_id' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'object_id' );

		$this->post_helper->expects( 'get_public_post_statuses' )->once()->andReturn( [ 'publish' ] );

		$this->author_archive
			->expects( 'author_has_public_posts' )
			->with( 1 )
			->andReturn( true );
		$this->author_archive
			->expects( 'is_disabled_for_user' )
			->with( 1 )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_disabled' )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_not_indexed' )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_not_indexed_for_users_without_posts' )
			->andReturn( false );

		$this->wpdb->expects( 'prepare' )->once()->with(
			"
			SELECT MAX(p.post_modified_gmt) AS last_modified, MIN(p.post_date_gmt) AS published_at
			FROM {$this->wpdb->posts} AS p
			WHERE p.post_status IN (%s)
				AND p.post_password = ''
				AND p.post_author = %d
		",
			[ 'publish', 1 ]
		)->andReturn( 'PREPARED_QUERY' );
		$this->wpdb->expects( 'get_row' )->once()->with( 'PREPARED_QUERY' )->andReturn(
			(object) [
				'last_modified' => '1234-12-12 00:00:00',
				'published_at'  => '1234-12-12 00:00:00',
			]
		);

		$this->indexable_mock->orm->expects( 'set' )->with( 'object_published_at', '1234-12-12 00:00:00' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 00:00:00' );

		Monkey\Functions\expect( 'get_avatar_url' )
			->once()
			->with(
				$this->indexable_mock->object_id,
				[
					'size'   => 500,
					'scheme' => 'https',
				]
			)
			->andReturn( '' );

		$this->instance->build( 1, $this->indexable_mock );
	}

	/**
	 * Tests the formatting of the indexable data with undefined author meta data.
	 *
	 * @covers ::__construct
	 * @covers ::build
	 */
	public function test_build_with_undefined_author_meta() {
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_title', 1 )->andReturn( '' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_metadesc', 1 )->andReturn( '' );
		Monkey\Functions\expect( 'get_the_author_meta' )->once()->with( 'wpseo_noindex_author', 1 )->andReturn( '' );

		$this->indexable_mock = $this->mock_indexable();

		$this->indexable_mock->orm->expects( 'set' )->with( 'title', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'description', null );
		$this->indexable_mock->orm->expects( 'set' )->with( 'is_robots_noindex', false );
		$this->indexable_mock->orm->expects( 'set' )->with( 'version', 2 );

		$this->indexable_mock->orm->expects( 'get' )->once()->with( 'open_graph_image' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'open_graph_image_id' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'open_graph_image_source' );
		$this->indexable_mock->orm->expects( 'get' )->twice()->with( 'twitter_image' );
		$this->indexable_mock->orm->expects( 'get' )->times( 3 )->with( 'twitter_image_id' );
		$this->indexable_mock->orm->expects( 'get' )->with( 'object_id' );

		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image', 'avatar_image.jpg' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'open_graph_image_source', 'gravatar-image' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'twitter_image', 'avatar_image.jpg' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'twitter_image_source', 'gravatar-image' );

		$this->post_helper->expects( 'get_public_post_statuses' )->once()->andReturn( [ 'publish' ] );

		$this->author_archive
			->expects( 'author_has_public_posts' )
			->with( 1 )
			->andReturn( true );
		$this->author_archive
			->expects( 'is_disabled_for_user' )
			->with( 1 )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_not_indexed' )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_disabled' )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_not_indexed_for_users_without_posts' )
			->andReturn( false );

		$this->wpdb->expects( 'prepare' )->once()->with(
			"
			SELECT MAX(p.post_modified_gmt) AS last_modified, MIN(p.post_date_gmt) AS published_at
			FROM {$this->wpdb->posts} AS p
			WHERE p.post_status IN (%s)
				AND p.post_password = ''
				AND p.post_author = %d
		",
			[ 'publish', 1 ]
		)->andReturn( 'PREPARED_QUERY' );
		$this->wpdb->expects( 'get_row' )->once()->with( 'PREPARED_QUERY' )->andReturn(
			(object) [
				'last_modified' => '1234-12-12 00:00:00',
				'published_at'  => '1234-12-12 00:00:00',
			]
		);

		$this->indexable_mock->orm->expects( 'set' )->with( 'object_published_at', '1234-12-12 00:00:00' );
		$this->indexable_mock->orm->expects( 'set' )->with( 'object_last_modified', '1234-12-12 00:00:00' );

		Monkey\Functions\expect( 'get_avatar_url' )
			->once()
			->andReturn( 'avatar_image.jpg' );

		$this->instance->build( 1, $this->indexable_mock );
	}

	/**
	 * Tests that the building an author throws an exception when author archives
	 * are disabled in general.
	 *
	 * @covers ::build
	 */
	public function test_throws_exception_when_author_archives_are_disabled() {
		$this->author_archive
			->expects( 'are_disabled' )
			->andReturn( true );

		$this->expectException( Author_Not_Built_Exception::class );

		$indexable_mock = Mockery::mock( Indexable::class );

		$this->instance->build( 1, $indexable_mock );
	}

	/**
	 * Tests that the building an author throws an exception when author archives
	 * are not indexed in general.
	 *
	 * @covers ::build
	 */
	public function test_throws_exception_when_author_archives_are_not_indexed() {
		$this->author_archive
			->expects( 'are_disabled' )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_not_indexed' )
			->andReturn( true );

		$this->expectException( Author_Not_Built_Exception::class );

		$indexable_mock = Mockery::mock( Indexable::class );

		$this->instance->build( 1, $indexable_mock );
	}

	/**
	 * Tests that the building an author throws an exception when author archives
	 * are disabled for the given user.
	 *
	 * @covers ::build
	 */
	public function test_throws_exception_when_author_archives_are_disabled_for_a_user() {
		$user_id = 1;

		$this->author_archive
			->expects( 'are_disabled' )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_not_indexed' )
			->andReturn( false );
		$this->author_archive
			->expects( 'is_disabled_for_user' )
			->with( $user_id )
			->andReturn( true );

		$this->expectException( Author_Not_Built_Exception::class );

		$indexable_mock = Mockery::mock( Indexable::class );

		$this->instance->build( $user_id, $indexable_mock );
	}

	/**
	 * Tests that the building an author throws an exception when author archives
	 * are disabled for users without posts and the user does not have posts.
	 *
	 * @covers ::build
	 */
	public function test_throws_exception_when_author_archives_are_not_indexed_for_users_without_posts_and_user_has_no_posts() {
		$user_id = 1;

		$this->author_archive
			->expects( 'are_disabled' )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_not_indexed' )
			->andReturn( false );
		$this->author_archive
			->expects( 'is_disabled_for_user' )
			->with( $user_id )
			->andReturn( false );
		$this->author_archive
			->expects( 'author_has_public_posts' )
			->with( $user_id )
			->andReturn( false );
		$this->author_archive
			->expects( 'are_not_indexed_for_users_without_posts' )
			->andReturn( true );

		$this->expectException( Author_Not_Built_Exception::class );

		$indexable_mock = Mockery::mock( Indexable::class );

		$this->instance->build( $user_id, $indexable_mock );
	}
}
