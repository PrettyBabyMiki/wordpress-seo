<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package WPSEO\Migrations
 */

use Yoast\WP\Free\ORM\Yoast_Model;
use YoastSEO_Vendor\Ruckusing_Migration_Base;

/**
 * Class WpYoastIndexablesAddImageFields
 */
class WpYoastIndexablesAddImageFields extends Ruckusing_Migration_Base {
	/**
	 * Migration up.
	 */
	public function up() {
		$table_name = $this->get_table_name();
		$this->add_column( $table_name, 'og_image_source', 'string', [ 'null' => true, 'limit' => 191 ] );
		$this->add_column( $table_name, 'twitter_image_id', 'string', [ 'null' => true, 'limit' => 191 ] );
		$this->add_column( $table_name, 'twitter_image_source', 'string', [ 'null' => true, 'limit' => 191 ] );
	}

	/**
	 * Migration down.
	 */
	public function down() {
		$table_name = $this->get_table_name();
		$this->remove_column( $table_name, 'og_image_source' );
		$this->remove_column( $table_name, 'twitter_image_id' );
		$this->remove_column( $table_name, 'twitter_image_source' );
	}

	/**
	 * Retrieves the table name to use.
	 *
	 * @return string The table name to use.
	 */
	protected function get_table_name() {
		return Yoast_Model::get_table_name( 'Indexable' );
	}
}
