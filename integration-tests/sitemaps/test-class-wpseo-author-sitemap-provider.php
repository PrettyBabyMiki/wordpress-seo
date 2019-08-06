<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Sitemaps
 */

/**
 * Class Test_WPSEO_Author_Sitemap_Provider.
 *
 * @group sitemaps
 */
class Test_WPSEO_Author_Sitemap_Provider extends WPSEO_UnitTestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var WPSEO_Author_Sitemap_Provider
	 */
	private static $class_instance;

	/**
	 * Sets up our double class.
	 */
	public static function setUpBeforeClass() {
		parent::setUpBeforeClass();

		// Makes sure the author archives are enabled.
		WPSEO_Options::set( 'disable-author', false );

		self::$class_instance = new WPSEO_Author_Sitemap_Provider();
	}

    /**
     * Tests whether the author sitemap is empty, when there are no users.
     *
     * Checks if an OutOfBoundsException is thrown, when there are no users in the sitemap.
     *
     * @expectedException OutOfBoundsException
     * @expectedExceptionMessage Invalid sitemap page requested
     *
     * @covers WPSEO_Author_Sitemap_Provider::get_index_links
     */
    public function test_get_index_links_sitemap() {
        // Checks which users are in the sitemap, there should be none.
        self::$class_instance->get_sitemap_links( 'author', 10, 1 );
    }

	/**
	 * Tests if a user is excluded from the sitemap when there are no posts.
     *
     * Checks if an OutOfBoundsException is thrown, when there are no users in the sitemap.
     *
     * @expectedException OutOfBoundsException
     * @expectedExceptionMessage Invalid sitemap page requested
	 */
	public function test_author_excluded_from_sitemap_by_zero_posts() {
		// Removes authors with no posts.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', true );

		// Creates a user, without any posts.
		$this->factory->user->create( array( 'role' => 'author' ) );

        // Checks which users are in the sitemap, there should be none.
        self::$class_instance->get_sitemap_links( 'author', 10, 1 );
	}

	/**
	 * Tests if a user is NOT excluded from the sitemap when there are posts.
	 */
	public function test_author_not_excluded_from_sitemap_non_zero_posts() {
		// Removes authors with no posts.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', true );

		// Creates a user, without any posts.
		$user_id = $this->factory->user->create( array( 'role' => 'author' ) );

		// Creates posts.
		$this->factory->post->create_many( 3, array( 'post_author' => $user_id ) );

        // Checks which users are in the sitemap.
		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// User should now be in the XML sitemap as user now has 3 posts.
		$this->assertCount( 1, $sitemap_links );

		// Makes sure it's the user we expected.
		$this->assertContains( get_author_posts_url( $user_id ), wp_list_pluck( $sitemap_links, 'loc' ) );
	}

	/**
	 * Tests if a user is NOT excluded from the sitemap when there are no posts.
	 */
	public function test_author_not_excluded_from_sitemap_by_zero_posts() {
		// Doesn't remove authors with no posts.
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', false );

		// Adds three more users (of different types) without posts.
		$author_id = $this->factory->user->create( array( 'role' => 'author' ) );
		$admin_id  = $this->factory->user->create( array( 'role' => 'administrator' ) );
		$editor_id = $this->factory->user->create( array( 'role' => 'editor' ) );

        // Checks which users are in the sitemap.
		$sitemap_links = self::$class_instance->get_sitemap_links( 'author', 10, 1 );

		// There should be 3 users in the sitemap.
		$this->assertCount( 3, $sitemap_links );

        // Makes sure it are the users we expected.
		$sitemap_urls = wp_list_pluck( $sitemap_links, 'loc' );
		$this->assertContains( get_author_posts_url( $author_id ), $sitemap_urls );
		$this->assertContains( get_author_posts_url( $admin_id ), $sitemap_urls );
		$this->assertContains( get_author_posts_url( $editor_id ), $sitemap_urls );
	}

	/**
	 * Tests whether setting a user to not be visible in search results excludes user from XML sitemap.
     *
     * Checks if an OutOfBoundsException is thrown, when there are no users in the sitemap.
     *
     * @expectedException OutOfBoundsException
     * @expectedExceptionMessage Invalid sitemap page requested
	 */
	public function test_author_exclusion() {
		// Creates a user with 3 posts.
		$user_id = $this->factory->user->create( array( 'role' => 'author' ) );
		$this->factory->post->create_many( 3, array( 'post_author' => $user_id ) );

		// Excludes the user from the sitemaps.
		update_user_meta( $user_id, 'wpseo_noindex_author', 'on' );

        // Checks which authors are in the sitemap, there should be none.
        self::$class_instance->get_sitemap_links( 'author', 10, 1 );
	}

	/**
	 * Makes sure the filtered out entries do not cause a sitemap index link to return a 404.
	 *
	 * @covers WPSEO_Post_Type_Sitemap_Provider::get_index_links
	 */
	public function test_get_index_links_empty_sitemap() {
		WPSEO_Options::set( 'noindex-author-noposts-wpseo', false );
		WPSEO_Options::set( 'disable-author', false );

		// Fetches the global sitemap.
		set_query_var( 'sitemap', 'author' );

		// Sets the page to the second one, which should not contain an entry, and should not exist.
		set_query_var( 'sitemap_n', '2' );

		// Loads the sitemap.
		$sitemaps = new WPSEO_Sitemaps_Double();
		$sitemaps->redirect( $GLOBALS['wp_the_query'] );

		// Expects an empty page (404) to be returned.
		$this->expectOutput( '' );
	}

	/**
	 * Makes sure there is no sitemap when the author archives have been disabled.
	 *
	 * @covers WPSEO_Author_Sitemap_Provider::get_index_links
	 */
	public function test_get_index_links_disabled_archive() {
		WPSEO_Options::set( 'disable-author', true );

		// Fetches the global sitemap.
		set_query_var( 'sitemap', 'author' );

		// Sets the page to the second one, which should not contain an entry, and should not exist.
		set_query_var( 'sitemap_n', '1' );

		// Loads the sitemap.
		$sitemaps = new WPSEO_Sitemaps_Double();
		$sitemaps->redirect( $GLOBALS['wp_the_query'] );

		// Expects an empty page (404) to be returned.
		$this->expectOutput( '' );
	}

    /**
     * Tests if there is no exception thrown on the second sitemap, when the amount of entries (users) exceeds
     * the max entries limit (thus a second sitemap is created).
     */
    public function test_throw_no_exception_on_second_sitemap() {
        // Creates two users, without any posts.
        $author_id = $this->factory->user->create( array( 'role' => 'author' ) );
        $second_author_id  = $this->factory->user->create( array( 'role' => 'author' ) );

        // Creates posts.
        $this->factory->post->create_many( 3, array( 'post_author' => $author_id ) );
        $this->factory->post->create_many( 3, array( 'post_author' => $second_author_id ) );

        // Checks which users are in the second sitemap.
        $second_sitemap_links = self::$class_instance->get_sitemap_links( 'author', 1, 2 );

        // Second user should now be in the second sitemap, as the max_entries limit is 1 user.
        $this->assertCount( 1, $second_sitemap_links );
    }
}
