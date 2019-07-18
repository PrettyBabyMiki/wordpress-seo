<?php
/**
 * Yoast extension of the ORM class.
 *
 * @package Yoast\YoastSEO
 */

namespace Yoast\WP\Free\ORM;

use YoastSEO_Vendor\ORM;

/**
 * Subclass of Idiorm's ORM class that supports
 * returning instances of a specified class rather
 * than raw instances of the ORM class.
 *
 * You shouldn't need to interact with this class
 * directly. It is used internally by the Model base
 * class.
 *
 * The methods documented below are magic methods that conform to PSR-1.
 * This documentation exposes these methods to doc generators and IDEs.
 *
 * @link http://www.php-fig.org/psr/psr-1/
 *
 * @method void setClassName($class_name)
 * @method static \Yoast\WP\Free\ORM\ORMWrapper forTable($table_name, $connection_name = parent::DEFAULT_CONNECTION)
 * @method \Yoast\WP\Free\ORM\\Model findOne($id=null)
 * @method Array|\IdiormResultSet findMany()
 */
class ORMWrapper extends ORM {

	/**
	 * @var array
	 */
	public static $repositories = [];

	/**
	 * The wrapped find_one and find_many classes will return an instance or
	 * instances of this class.
	 *
	 * @var string
	 */
	protected $class_name;

	/**
	 * Set the name of the class which the wrapped methods should return
	 * instances of.
	 *
	 * @param string $class_name The classname to set.
	 *
	 * @return void
	 */
	public function set_class_name( $class_name ) {
		$this->class_name = $class_name;
	}

	/**
	 * Add a custom filter to the method chain specified on the model class.
	 * This allows custom queries to be added to models. The filter should take
	 * an instance of the ORM wrapper as its first argument and return an
	 * instance of the ORM wrapper. Any arguments passed to this method after
	 * the name of the filter will be passed to the called filter function as
	 * arguments after the ORM class.
	 *
	 * @return \Yoast\WP\Free\ORM\ORMWrapper Instance of the ORM wrapper.
	 */
	public function filter() {
		$args            = \func_get_args();
		$filter_function = \array_shift( $args );
		\array_unshift( $args, $this );
		if ( \method_exists( $this->class_name, $filter_function ) ) {
			return \call_user_func_array( [ $this->class_name, $filter_function ], $args );
		}

		return null;
	}

	/**
	 * Factory method intended for use only by repository classes.
	 *
	 * @param string $class_name The class name to get the instance for, defaults to self::class.
	 *
	 * @return self
	 */
	public static function get_instance_for_repository( $class_name ) {
		if ( preg_match( '@\\\\([\w]+)_Repository$@', $class_name, $matches ) ) {
			$model_name = $matches[1];

			// This ensures that the object returned by Yoast_Model::of_type is an actual instance of the repository class.
			self::$repositories[ Yoast_Model::get_table_name( $model_name ) ] = $class_name;

			return Yoast_Model::of_type( $model_name );
		}

		return null;
	}

	/**
	 * Factory method, return an instance of this class bound to the supplied
	 * table name.
	 *
	 * A repeat of content in parent::for_table, so that created class is
	 * ORMWrapper, not ORM.
	 *
	 * @param string $table_name      The table to create instance for.
	 * @param string $connection_name The connection name.
	 *
	 * @return \Yoast\WP\Free\ORM\ORMWrapper Instance of the ORM wrapper.
	 */
	public static function for_table( $table_name, $connection_name = parent::DEFAULT_CONNECTION ) {
		static::_setup_db( $connection_name );

		if ( self::$repositories[ $table_name ] ) {
			return new self::$repositories[ $table_name ]( $table_name, [], $connection_name );
		}

		return new static( $table_name, [], $connection_name );
	}

	/**
	 * Method to create an instance of the model class associated with this
	 * wrapper and populate it with the supplied Idiorm instance.
	 *
	 * @param \Yoast\WP\Free\ORM\ORMWrapper|\YoastSEO_Vendor\ORM $orm The ORM used by model.
	 *
	 * @return bool|\Yoast\WP\Free\ORM\Yoast_Model Instance of the model class.
	 */
	protected function create_model_instance( $orm ) {
		if ( $orm === false ) {
			return false;
		}

		/** @var \Yoast\WP\Free\ORM\Yoast_Model $model */
		$model = new $this->class_name();
		$model->set_orm( $orm );

		return $model;
	}

	/**
	 * Wrap Idiorm's find_one method to return an instance of the class
	 * associated with this wrapper instead of the raw ORM class.
	 *
	 * @param null|integer $id The ID to lookup.
	 *
	 * @return \Yoast\WP\Free\ORM\Yoast_Model Instance of the model.
	 */
	public function find_one( $id = null ) {
		return $this->create_model_instance( parent::find_one( $id ) );
	}

	/**
	 * Wrap Idiorm's find_many method to return an array of instances of the
	 * class associated with this wrapper instead of the raw ORM class.
	 *
	 * @return array The found results.
	 */
	public function find_many() {
		$results = parent::find_many();
		foreach ( $results as $key => $result ) {
			$results[ $key ] = $this->create_model_instance( $result );
		}

		return $results;
	}

	/**
	 * Wrap Idiorm's create method to return an empty instance of the class
	 * associated with this wrapper instead of the raw ORM class.
	 *
	 * @param null|mixed $data The data to pass.
	 *
	 * @return \Yoast\WP\Free\ORM\Yoast_Model|bool Instance of the ORM.
	 */
	public function create( $data = null ) {
		return $this->create_model_instance( parent::create( $data ) );
	}
}
