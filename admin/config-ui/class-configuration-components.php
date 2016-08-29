<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Configuration_Components
 */
class WPSEO_Configuration_Components {

	/** @var array [WPSEO_Config_Component] List of registered components */
	protected $components = array();

	/** @var WPSEO_Configuration_Options_Adapter Adapter */
	protected $adapter;

	/**
	 * WPSEO_Configuration_Components constructor.
	 */
	public function __construct() {
		$this->add_component( new WPSEO_Config_Component_Publishing_Entity() );
		$this->add_component( new WPSEO_Config_Component_Connect_Google_Search_Console() );
		$this->add_component( new WPSEO_Config_Component_Post_Type_Visibility() );
	}

	/**
	 * Add a component
	 *
	 * @param WPSEO_Config_Component $component Component to add.
	 */
	public function add_component( WPSEO_Config_Component $component ) {
		$this->components[] = $component;
	}

	/**
	 * @param WPSEO_Configuration_Storage $storage Storage to use.
	 */
	public function set_storage( WPSEO_Configuration_Storage $storage ) {
		$this->set_adapter( $storage->get_adapter() );

		foreach ( $this->components as $component ) {
			$storage->add_field( $component->get_field() );
		}
	}

	/**
	 * @param WPSEO_Configuration_Options_Adapter $adapter Adapter to use.
	 */
	public function set_adapter( WPSEO_Configuration_Options_Adapter $adapter ) {
		$this->adapter = $adapter;

		foreach ( $this->components as $component ) {
			$adapter->add_custom_lookup(
				get_class( $component->get_field() ),
				array(
					$component,
					'get_data',
				),
				array(
					$component,
					'set_data',
				)
			);
		}
	}
}
