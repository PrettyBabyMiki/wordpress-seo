<?php
/**
 * @package WPSEO\Admin\Customizer
 */

/**
 * Class with functionality to support WP SEO settings in WordPress Customizer.
 */
class WPSEO_Customizer {

	/**
	 * Construct Method.
	 */
	public function __construct() {
		add_action( 'customize_register', array( $this, 'wpseo_customize_register' ) );
	}

	/**
	 * Function to support WordPress Customizer
	 *
	 * @param WP_Customize_Manager $wp_customize
	 */
	public function wpseo_customize_register( $wp_customize ) {
		$this->breadcrumbs_section( $wp_customize );
		$this->breadcrumbs_enable_setting( $wp_customize );
		$this->breadcrumbs_enable_setting( $wp_customize );
		$this->breadcrumbs_boldlast_setting( $wp_customize );
		$this->breadcrumbs_blog_remove_setting( $wp_customize );
		$this->breadcrumbs_separator_setting( $wp_customize );
		$this->breadcrumbs_home_setting( $wp_customize );
		$this->breadcrumbs_prefix_setting( $wp_customize );
		$this->breadcrumbs_archiveprefix_setting( $wp_customize );
		$this->breadcrumbs_searchprefix_setting( $wp_customize );
		$this->breadcrumbs_404_setting( $wp_customize );
	}

	/**
	 * Add the breadcrumbs section to the customizer
	 *
	 * @param WP_Customize_Manager $wp_customize
	 */
	private function breadcrumbs_section( $wp_customize ) {

		$wp_customize->add_section(
			'wpseo_breadcrumbs_customizer_section', array(
				/* translators: %s is the name of the plugin */
				'title'          => sprintf( __( '%s Breadcrumbs', 'wordpress-seo' ), 'Yoast SEO' ),
				'priority'       => 999,
				'description'    => sprintf( __( 'Usage of this breadcrumbs feature is explained in %1$sour knowledge-base article on breadcrumbs implementation%2$s.', 'wordpress-seo' ), '<a href="http://yoa.st/breadcrumbs" target="_blank">', '</a>' ),
			)
		);

	}

	/**
	 * Adds the enable breadcrumbs checkbox
	 *
	 * @param WP_Customize_Manager $wp_customize
	 */
	private function breadcrumbs_enable_setting( $wp_customize ) {

		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-enable]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-enable', array(
					'label'       => __( 'Enable Breadcrumbs', 'wordpress-seo' ),
					'description' => __( 'Check this to enable breadcrumbs for your site.', 'wordpress-seo' ),
					'type'        => 'checkbox',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-enable]',
					'context'     => '',
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs bold last checkbox
	 *
	 * @param WP_Customize_Manager $wp_customize
	 */
	private function breadcrumbs_boldlast_setting( $wp_customize ) {

		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-boldlast]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-boldlast', array(
					'label'       => __( 'Bold the last page in the breadcrumb', 'wordpress-seo' ),
					'description' => __( 'Check this to bold the last breadcrumb.', 'wordpress-seo' ),
					'type'        => 'checkbox',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-boldlast]',
					'context'     => '',
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs remove blog checkbox
	 *
	 * @param WP_Customize_Manager $wp_customize
	 */
	private function breadcrumbs_blog_remove_setting( $wp_customize ) {

		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-blog-remove]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-blog-remove', array(
					'label'       => __( 'Remove Blog page from Breadcrumbs', 'wordpress-seo' ),
					'description' => __( 'Check this to remove blog from breadcrumbs.', 'wordpress-seo' ),
					'type'        => 'checkbox',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-blog-remove]',
					'context'     => '',
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs separator text field
	 *
	 * @param WP_Customize_Manager $wp_customize
	 */
	private function breadcrumbs_separator_setting( $wp_customize ) {

		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-sep]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-separator', array(
					'label'       => __( 'Breadcrumbs Separator:', 'wordpress-seo' ),
					'description' => __( 'Set the separator between breadcrumb links.', 'wordpress-seo' ),
					'type'        => 'text',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-sep]',
					'context'     => '',
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs home anchor text field
	 *
	 * @param WP_Customize_Manager $wp_customize
	 */
	private function breadcrumbs_home_setting( $wp_customize ) {

		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-home]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-home', array(
					'label'       => __( 'Anchor Text for Homepage:', 'wordpress-seo' ),
					'description' => __( 'Set the anchor text to represent your homepage.', 'wordpress-seo' ),
					'type'        => 'text',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-home]',
					'context'     => '',
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs prefix text field
	 *
	 * @param WP_Customize_Manager $wp_customize
	 */
	private function breadcrumbs_prefix_setting( $wp_customize ) {

		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-prefix]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-prefix', array(
					'label'       => __( 'Prefix for the breadcrumb path:', 'wordpress-seo' ),
					'description' => __( 'Set the prefix to be displayed before breadcrumbs.', 'wordpress-seo' ),
					'type'        => 'text',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-prefix]',
					'context'     => '',
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs archive prefix text field
	 *
	 * @param WP_Customize_Manager $wp_customize
	 */
	private function breadcrumbs_archiveprefix_setting( $wp_customize ) {

		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-archiveprefix]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-archiveprefix', array(
					'label'       => __( 'Prefix for Archive breadcrumbs:', 'wordpress-seo' ),
					'description' => __( 'Set the prefix text to be used for archives.', 'wordpress-seo' ),
					'type'        => 'text',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-archiveprefix]',
					'context'     => '',
				)
			)
		);
	}

	/**
	 * Adds the breadcrumbs search prefix text field
	 *
	 * @param WP_Customize_Manager $wp_customize
	 */
	private function breadcrumbs_searchprefix_setting( $wp_customize ) {

		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-searchprefix]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-searchprefix', array(
					'label'       => __( 'Prefix for Search Page breadcrumbs:', 'wordpress-seo' ),
					'description' => __( 'Set the prefix text to be used for your search page.', 'wordpress-seo' ),
					'type'        => 'text',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-searchprefix]',
					'context'     => '',
				)
			)
		);

	}

	/**
	 * Adds the breadcrumb 404 prefix text field
	 *
	 * @param WP_Customize_Manager $wp_customize
	 */
	private function breadcrumbs_404_setting( $wp_customize ) {

		$wp_customize->add_setting(
			'wpseo_internallinks[breadcrumbs-404crumb]', array(
				'default'   => '',
				'type'      => 'option',
				'transport' => 'refresh',
			)
		);

		$wp_customize->add_control(
			new WP_Customize_Control(
				$wp_customize, 'wpseo-breadcrumbs-404crumb', array(
					'label'       => __( 'Breadcrumb for 404 Page:', 'wordpress-seo' ),
					'description' => __( 'Set the breadcrumbs for the 404 page.', 'wordpress-seo' ),
					'type'        => 'text',
					'section'     => 'wpseo_breadcrumbs_customizer_section',
					'settings'    => 'wpseo_internallinks[breadcrumbs-404crumb]',
					'context'     => '',
				)
			)
		);

	}

}
