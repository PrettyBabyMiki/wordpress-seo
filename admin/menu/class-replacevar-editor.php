<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Menu
 */

/**
 * Renders a replacement variable editor.
 */
class WPSEO_Replacevar_Editor {
	/**
	 * @var Yoast_Form Yoast Forms instance.
	 */
	private $yform;

	/**
	 * @var string The id for the hidden title field.
	 */
	private $title;

	/**
	 * @var string The id for the hidden description field.
	 */
	private $description;

	/**
	 * @var string The post type for context.
	 */
	private $post_type;

	/**
	 * Constructs the object.
	 *
	 * @param Yoast_Form $yform       Yoast forms.
	 * @param string     $title       The title field id.
	 * @param string     $description The description field id.
	 * @param string     $post_type   The post type for context.
	 */
	public function __construct( Yoast_Form $yform, $title, $description, $post_type ) {
		$this->yform       = $yform;
		$this->title       = $title;
		$this->description = $description;
		$this->post_type   = $post_type;
	}

	/**
	 * Renders a div for the react application to mount to, and hidden inputs where
	 * the app should store it's value so they will be properly saved when the form
	 * is submitted.
	 *
	 * @return void
	 */
	public function render() {
		$this->yform->hidden( $this->title, $this->title );
		$this->yform->hidden( $this->description, $this->description );

		printf( '<div
				data-react-replacevar-editor
				data-react-replacevar-title-field-id="%1$s"
				data-react-replacevar-metadesc-field-id="%2$s"
				data-react-replacevar-post-type="%3$s"></div>',
			esc_attr( $this->title ),
			esc_attr( $this->description ),
			esc_attr( $this->post_type )
		);
	}
}
