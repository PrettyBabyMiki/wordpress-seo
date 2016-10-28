<?php

class WPSEO_Admin_Banner_Sidebar_Renderer_Test extends WPSEO_UnitTestCase {

	/** @var  WPSEO_Admin_Banner_Sidebar */
	protected $sidebar;

	public function setUp(  ) {
		$this->sidebar = new WPSEO_Admin_Banner_Sidebar( 'test_title', new WPSEO_Admin_Banner_Renderer() );
		$this->sidebar->initialize( new WPSEO_Features() );
	}

	/**
	 *
	 */
	public function test_render() {

		$sidebar_renderer = new WPSEO_Admin_Banner_Sidebar_Renderer( new WPSEO_Admin_Banner_Spot_Renderer() );

		$output = $sidebar_renderer->render(  $this->sidebar );

		$this->stringContains(
			'<div class="wpseo_content_cell" id="sidebar-container">', $output
		);

		$this->stringContains(
			'<div class="wpseo_content_cell_title yoast-sidebar__title ">', $output
		);


		$this->stringContains( 'test_title', $output );
	}

	/**
	 * Makes sure the render_banner_posts has been execute.
	 *
	 * @covers WPSEO_Admin_Banner_Sidebar_Renderer::render_banner_spots()
	 */
	public function test_render_banner_spots() {
		$mock = $this->getMock(
			'WPSEO_Admin_Banner_Sidebar_Renderer',
			array( 'render_banner_spots' ),
			array( new WPSEO_Admin_Banner_Spot_Renderer() )
		);

		$mock
			->expects( $this->once() )
			->method( 'render_banner_spots' );

		$mock->render(  $this->sidebar );
	}



}