<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\SEO\ORM\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * Indexable migration.
 */
class WpYoastIndexable extends Ruckusing_Migration_Base {

	/**
	 * Migration up.
	 *
	 * @return void
	 */
	public function up()
	{
		$this->add_indexable_table();
		$this->add_indexable_hierarchy_table();
	}

	/**
	 * Migration down.
	 *
	 * @return void
	 */
	public function down()
	{
		$this->drop_table( $this->get_indexable_table_name() );
		$this->drop_table( $this->get_indexable_hierarchy_table_name() );
	}

	/**
	 * Creates the indexable table.
	 */
	private function add_indexable_table() {
		$table_name = $this->get_indexable_table_name();

		$indexable_table = $this->create_table( $table_name );

		$this->add_indexable_columns( $indexable_table );
		$indexable_table->finish();

		$this->add_indexable_indexes( $table_name );

		$this->add_timestamps( $table_name );
	}

	/**
	 * Creates the indexable hierarchy table.
	 */
	private function add_indexable_hierarchy_table() {
		$table_name = $this->get_indexable_hierarchy_table_name();

		$indexable_hierarchy_table = $this->create_table( $table_name );

		$this->add_indexable_hierarchy_columns( $indexable_hierarchy_table );
		$indexable_hierarchy_table->finish();

		$this->add_indexable_hierarchy_indexes( $table_name );
	}

	/**
	 * Creates the columns in the indexable table.
	 *
	 * @param YoastSEO_Vendor\Ruckusing_Adapter_MySQL_TableDefinition $indexable_table The indexable table.
	 */
	private function add_indexable_columns( $indexable_table ) {
		// Permalink.
		$indexable_table->column( 'permalink', 'mediumtext', [ 'null' => true ] );
		$indexable_table->column( 'permalink_hash', 'string', [ 'null' => true, 'limit' => 191 ] );

		// Object type and ID.
		$indexable_table->column( 'object_id', 'integer', [ 'unsigned' => true, 'null' => true, 'limit' => 11 ] );
		$indexable_table->column( 'object_type', 'string', [ 'null' => false, 'limit' => 191 ]);
		$indexable_table->column( 'object_sub_type', 'string', [ 'null' => true, 'limit' => 191 ]  );

		// Title and description.
		$indexable_table->column( 'title', 'string', [ 'null' => true, 'limit' => 191 ] );
		$indexable_table->column( 'description', 'text', [ 'null' => true ] );
		$indexable_table->column( 'breadcrumb_title', 'string', [ 'null' => true, 'limit' => 191 ] );

		// Post metadata (status, public, protected).
		$indexable_table->column( 'post_status', 'string', [ 'null' => true, 'limit' => 191 ] );
		$indexable_table->column( 'is_public', 'boolean', [ 'default' => true ] );
		$indexable_table->column( 'is_protected', 'boolean', [ 'default' => false ] );

		$indexable_table->column(
			'number_of_pages',
			'integer',
			[
				'unsigned' => true,
				'null'     => true,
				'default'  => null,
				'limit'    => 11,
			]
		);

		$indexable_table->column( 'canonical', 'mediumtext', [ 'null' => true ] );

		// SEO and readability analysis.
		$indexable_table->column( 'primary_focus_keyword', 'string', [ 'null' => true, 'limit' => 191 ] );
		$indexable_table->column( 'primary_focus_keyword_score', 'integer', [ 'null' => true, 'limit' => 3 ] );
		$indexable_table->column( 'readability_score', 'integer', [ 'null' => true, 'limit' => 3 ] );
		$indexable_table->column( 'is_cornerstone', 'boolean', [ 'default' => false ] );

		// Robots.
		$indexable_table->column( 'is_robots_noindex', 'boolean', [ 'null' => true, 'default' => false ] );
		$indexable_table->column( 'is_robots_nofollow', 'boolean', [ 'null' => true, 'default' => false ] );
		$indexable_table->column( 'is_robots_noarchive', 'boolean', [ 'null' => true, 'default' => false ] );
		$indexable_table->column( 'is_robots_noimageindex', 'boolean', [ 'null' => true, 'default' => false ] );
		$indexable_table->column( 'is_robots_nosnippet', 'boolean', [ 'null' => true, 'default' => false ] );

		// Twitter.
		$indexable_table->column( 'twitter_title', 'string', [ 'null' => true, 'limit' => 191 ] );
		$indexable_table->column( 'twitter_image', 'mediumtext', [ 'null' => true ] );
		$indexable_table->column( 'twitter_description', 'mediumtext', [ 'null' => true ] );
		$indexable_table->column( 'twitter_image_id', 'string', [ 'null' => true, 'limit' => 191 ] );
		$indexable_table->column( 'twitter_image_source', 'string', [ 'null' => true, 'limit' => 191 ] );

		// Open-Graph.
		$indexable_table->column( 'og_title', 'string', [ 'null' => true, 'limit' => 191 ] );
		$indexable_table->column( 'og_description', 'mediumtext', [ 'null' => true ] );
		$indexable_table->column( 'og_image',  'mediumtext', [ 'null' => true ] );
		$indexable_table->column( 'og_image_id', 'string', [ 'null' => true, 'limit' => 191 ] );
		$indexable_table->column( 'og_image_source', 'string', [ 'null' => true, 'limit' => 191 ] );
		$indexable_table->column( 'og_image_meta', 'text', [ 'null' => true ] );

		// Link count.
		$indexable_table->column( 'link_count', 'integer', [ 'null' => true, 'limit' => 11 ] );
		$indexable_table->column( 'incoming_link_count', 'integer', [ 'null' => true, 'limit' => 11 ] );

		// Prominent words.
		$indexable_table->column( 'prominent_words_version', 'integer', [
			'null'     => true,
			'limit'    => 11,
			'unsigned' => true,
			'default'  => null,
		] );
	}

	/**
	 * Adds indexes to the indexable table.
	 *
	 * @param string $indexable_table_name The name of the indexable table.
	 */
	private function add_indexable_indexes( $indexable_table_name ) {
		$this->add_index(
			$indexable_table_name,
			[
				'permalink',
			],
			[
				'name'   => 'unique_permalink',
				'unique' => true,
			]
		);

		$this->add_index( $indexable_table_name, 'permalink_hash' );

		$this->add_index(
			$indexable_table_name,
			[
				'object_type',
				'object_sub_type',
			],
			[
				'name' => 'indexable',
			]
		);

		$this->add_index(
			$indexable_table_name,
			[
				'primary_focus_keyword_score',
				'object_type',
				'object_sub_type',
			],
			[
				'name' => 'primary_focus_keyword_score',
			]
		);

		$this->add_index(
			$indexable_table_name,
			[
				'is_cornerstone',
				'object_type',
				'object_sub_type',
			],
			[
				'name' => 'cornerstones',
			]
		);

		$this->add_index(
			$indexable_table_name,
			[
				'incoming_link_count',
				'object_type',
				'object_sub_type',
			],
			[
				'name' => 'orphaned_content',
			]
		);

		$this->add_index(
			$indexable_table_name,
			[
				'is_robots_noindex',
				'object_id',
				'object_type',
				'object_sub_type',
			],
			[
				'name' => 'robots_noindex',
			]
		);

		$this->add_index(
			$indexable_table_name,
			'prominent_words_version',
			[
				'name' => 'prominent_words_version',
			]
		);
	}

	/**
	 * Adds the columns to the indexable hierarchy table.
	 *
	 * @param YoastSEO_Vendor\Ruckusing_Adapter_MySQL_TableDefinition $indexable_hierarchy_table The indexable hierarchy table.
	 */
	private function add_indexable_hierarchy_columns( $indexable_hierarchy_table ) {
		$indexable_hierarchy_table->column( 'indexable_id', 'integer', [
			'primary_key' => true,
			'unsigned'    => true,
			'null'        => true,
			'limit'       => 11,
		] );

		$indexable_hierarchy_table->column( 'ancestor_id', 'integer', [
			'primary_key' => true,
			'unsigned'    => true,
			'null'        => true,
			'limit'       => 11,
		] );

		$indexable_hierarchy_table->column( 'depth', 'integer', [
			'unsigned' => true,
			'null' => true,
			'limit' => 11
		] );
	}

	/**
	 * Adds indexes to the indexable hierarchy table.
	 *
	 * @param string $indexable_hierarchy_table_name The name of the indexable hierarchy table.
	 */
	private function add_indexable_hierarchy_indexes( $indexable_hierarchy_table_name ) {
		$this->add_index( $indexable_hierarchy_table_name, 'indexable_id', [ 'name' => 'indexable_id' ] );
		$this->add_index( $indexable_hierarchy_table_name, 'ancestor_id', [ 'name' => 'ancestor_id' ] );
		$this->add_index( $indexable_hierarchy_table_name, 'depth', [ 'name' => 'depth' ] );
	}

	/**
	 * Retrieves the table name to use for storing indexables.
	 *
	 * @return string The table name to use.
	 */
	protected function get_indexable_table_name() {
		return Yoast_Model::get_table_name( 'Indexable' );
	}

	protected function get_indexable_hierarchy_table_name() {
		return Yoast_Model::get_table_name( 'Indexable_Hierarchy' );
	}
}
