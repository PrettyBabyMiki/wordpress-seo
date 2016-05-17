<?php
/**
 * @package WPSEO\Admin\Metabox
 */

/**
 * Handles all things with the metabox in combination with the WordPress editor.
 */
class WPSEO_Metabox_Editor {

	/**
	 * Registers hooks to WordPress
	 */
	public function register_hooks() {
		add_filter( 'mce_css', array( $this, 'add_css_inside_editor' ) );
		add_filter( 'tiny_mce_before_init', array( $this, 'add_custom_element' ) );
	}

	/**
	 * Adds our inside the editor CSS file to the list of CSS files to be loaded inside the editor.
	 *
	 * @param string $css_files The CSS files that WordPress wants to load inside the editor.
	 * @return string The CSS files WordPress wants to load and our CSS file.
	 */
	public function add_css_inside_editor( $css_files ) {
		$add_file = plugins_url( 'css/inside-editor-330.css', WPSEO_FILE );

		if ( '' === $css_files ) {
			$css_files = $add_file;
		}
		else {
			$css_files .= ',' . plugins_url( 'css/inside-editor-330.css', WPSEO_FILE );
		}

		return $css_files;
	}

	/**
	 * Adds a custom element to the tinyMCE editor that we need for marking the content.
	 *
	 * @param array $tinymce_config The tinyMCE config as configured by WordPress.
	 *
	 * @return array The new tinyMCE config with our added custom elements.
	 */
	public function add_custom_element( $tinymce_config ) {
		if ( ! empty( $tinymce_config['custom_elements'] ) ) {
			$custom_elements = $tinymce_config['custom_elements'];

			$custom_elements .= ',' . '~yoastmark';
		}
		else {
			$custom_elements = '~yoastmark';
		}

		$tinymce_config['custom_elements'] = $custom_elements;

		return $tinymce_config;
	}
}
