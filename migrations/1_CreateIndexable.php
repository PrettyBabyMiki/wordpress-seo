<?php

use Phpmig\Migration\Migration;

class CreateIndexable extends Migration {
	protected $table;

	protected function get_table() {
		global $wpdb;
		return $wpdb->prefix . 'yoast_indexable';
	}

	/**
	 * Do the migration
	 */
	public function up() {
		$container = $this->getContainer();

		$sql = sprintf(
			'
CREATE TABLE IF NOT EXISTS %1$s (
	id int(11) unsigned NOT NULL AUTO_INCREMENT,
	object_id int(11) unsigned DEFAULT NULL,
	object_type varchar(16) NOT NULL DEFAULT \'\',
	object_sub_type varchar(16) DEFAULT NULL,
	modified_date_gmt datetime DEFAULT NULL,
	permalink varchar(255) DEFAULT NULL,
	canonical varchar(255) DEFAULT NULL,
	title varchar(255) NOT NULL DEFAULT \'\',
	description text NOT NULL,
	breadcrumb_title varchar(255) NOT NULL DEFAULT \'\',
	og_title varchar(255) NOT NULL DEFAULT \'\',
	og_description text NOT NULL,
	og_image_url varchar(255) NOT NULL DEFAULT \'\',
	og_image_id int(11) DEFAULT NULL,
	twitter_title varchar(255) NOT NULL DEFAULT \'\',
	twitter_description text NOT NULL,
	twitter_image_url varchar(255) NOT NULL DEFAULT \'\',
	twitter_image_id int(11) DEFAULT NULL,
	robots_noindex tinyint(1) unsigned NOT NULL DEFAULT \'0\',
	robots_nofollow tinyint(1) unsigned NOT NULL DEFAULT \'0\',
	robots_advanced varchar(32) NOT NULL,
	content_score int(5) DEFAULT NULL,
	cornerstone tinyint(1) NOT NULL DEFAULT \'0\',
	sitemap_exclude tinyint(1) unsigned DEFAULT NULL,
	internal_link_count int(11) unsigned DEFAULT NULL,
	incoming_link_count int(11) unsigned DEFAULT NULL,
	PRIMARY KEY (id),
	KEY object (object_id,object_type,object_sub_type),
	KEY modified (modified_date_gmt),
	KEY score (content_score,object_sub_type,object_type),
	KEY cornerstone (cornerstone,object_type,object_sub_type),
	KEY orphaned (internal_link_count,object_type,object_sub_type),
	KEY sitemap (object_id,object_type,object_sub_type,sitemap_exclude)
	) %2$s;
);',
			$this->get_table(),
			$container['db.charset']
		);

		$container['db']->query( $sql );
	}

	/**
	 * Undo the migration
	 */
	public function down() {
		$sql = sprintf( 'DROP TABLE %1$s', $this->get_table() );

		$container = $this->getContainer();
		$container['db']->query( $sql );
	}
}
