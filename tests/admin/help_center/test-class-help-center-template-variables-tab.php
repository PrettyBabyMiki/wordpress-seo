<?php

/**
 * Class WPSEO_Help_Center_Template_Variables_Tab_Test
 *
 * @group help-center
 */
class WPSEO_Help_Center_Template_Variables_Tab_Test extends WPSEO_UnitTestCase {

	/**
	 * Tests expected hooks and filters being added.
	 */
	public function test_register_hooks() {
		$instance = new WPSEO_Help_Center_Template_Variables_Tab();
		$instance->register_hooks();

		$this->assertEquals( 10, has_filter( 'wpseo_help_center_items', array(
			$instance,
			'add_meta_options_help_center_tabs'
		) ) );
		$this->assertEquals( 10, has_action( 'admin_enqueue_scripts', array( $instance, 'enqueue' ) ) );
	}

	/**
	 * Tests priority application on filter.
	 */
	public function test_register_hooks_priority() {
		$instance = new WPSEO_Help_Center_Template_Variables_Tab( 20 );
		$instance->register_hooks();

		$this->assertEquals( 20, has_filter( 'wpseo_help_center_items', array(
			$instance,
			'add_meta_options_help_center_tabs'
		) ) );
	}

	/**
	 * Tests the addition of the tab to the list.
	 */
	public function test_add_meta_options_help_center_tabs() {
		$instance = new WPSEO_Help_Center_Template_Variables_Tab();
		$tabs     = $instance->add_meta_options_help_center_tabs( array() );

		$this->assertInstanceOf( 'WPSEO_Help_Center_Item', $tabs[0] );
		$this->assertEquals( 'template-variables', $tabs[0]->get_identifier() );
	}
}
