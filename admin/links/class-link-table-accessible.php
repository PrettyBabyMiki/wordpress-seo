<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the state of the table being accessible.
 */
class WPSEO_Link_Table_Accessible {

	/**
	 * Checks if the given table name exists.
	 *
	 * @return bool True when table is accessible.
	 */
	public static function is_accessible() {
		$value = get_transient( self::transient_name() );

		// If the value is not set, check the table.
		if ( null === $value ) {
			return self::check_table();
		}

		return $value === 0;
	}

	/**
	 * Sets the transient value to 1, to indicate the table is not accessible.
	 */
	public static function set_inaccessible() {
		set_transient( self::transient_name(), 1, HOUR_IN_SECONDS );
	}

	/**
	 * Sets the transient value to 0, to indicate the table is accessbile.
	 */
	protected static function set_accessible() {
		set_transient( self::transient_name(), 0 );
	}

	/**
	 * Checks if the table exists if not, set the transient to indicate the inaccessible table.
	 *
	 * @deprecated 6.0
	 *
	 * @return bool True if table is accessible.
	 */
	public static function check_table_is_accessible() {
		_deprecated_function( __FUNCTION__, '6.0', __CLASS__ . '::is_accessible' );
		return self::is_accessible();
	}

	/**
	 * Checks if the table exists if not, set the transient to indicate the inaccessible table.
	 *
	 * @return bool
	 */
	protected static function check_table() {
		global $wpdb;

		$storage = new WPSEO_Link_Storage();
		if ( $wpdb->get_var( 'SHOW TABLES LIKE "' . $storage->get_table_name() . '"' ) !== $storage->get_table_name() ) {
			self::set_inaccessible();
			return false;
		}

		self::set_accessible();
		return true;
	}

	/**
	 * Removes the transient.
	 *
	 * @return void
	 */
	public static function cleanup() {
		delete_transient( self::transient_name() );
	}

	/**
	 * Returns the name of the transient.
	 *
	 * @return string The name of the transient to use.
	 */
	protected static function transient_name() {
		return 'wpseo_link_table_inaccessible';
	}
}
