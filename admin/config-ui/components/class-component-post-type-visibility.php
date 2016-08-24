<?php
/**
 * @package WPSEO\Admin\ConfigurationUI
 */

/**
 * Class WPSEO_Config_Component_Post_Type_Visibility
 */
class WPSEO_Config_Component_Post_Type_Visibility implements WPSEO_Config_Component {

	private $option;

	/**
	 * @return string
	 */
	public function get_identifier() {
		return 'postTypeVisibility';
	}

	/**
	 * @return WPSEO_Config_Field
	 */
	public function get_field() {
		return new WPSEO_Config_Field_Post_Type_Visibility();
	}

	/**
	 * Fetch the data
	 *
	 * @return mixed
	 */
	public function get_data() {

		$this->option = WPSEO_Options::get_option( 'wpseo_xml' );

		$post_types = get_post_types( array( 'public' => true ), 'names' );
		array_walk( $post_types, array( $this, 'get_option_value' ) );

		return $post_types;
	}

	/**
	 * Save the data provided
	 *
	 * @param $input
	 *
	 * @return mixed
	 */
	public function set_data( $input ) {

		$field = $this->get_field();
		$data  = $input[ $field->get_identifier() ]['data'];

		$option = WPSEO_Options::get_option( 'wpseo_xml' );

		foreach ( $data as $post_type => $in_sitemap ) {
			if ( $in_sitemap ) {
				unset( $option[ 'post_types-' . $post_type . '-not_in_sitemap' ] );
			}

			if ( ! $in_sitemap ) {
				$option[ 'post_types-' . $post_type . '-not_in_sitemap' ] = true;
			}
		}

		update_option( 'wpseo_xml', $option );

		$saved_option = WPSEO_Options::get_option( 'wpseo_xml' );

		$output = array();
		foreach ( $data as $post_type => $in_sitemap ) {
			$output[ $post_type ] = ( ! $in_sitemap && $saved_option[ 'post_types-' . $post_type . '-not_in_sitemap' ] === true );
		}

		return $output;
	}

	/**
	 * Array helper function to get visibility as boolean
	 *
	 * @param bool   $value     Array element.
	 * @param string $post_type Post type to check.
	 */
	protected function get_option_value( & $value, $post_type ) {
		$key   = 'post_types-' . $post_type . '-not_in_sitemap';
		$value = ( ! isset( $this->option[ $key ] ) || false === $this->option[ $key ] );
	}
}
