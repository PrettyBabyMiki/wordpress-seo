<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Class WPSEO_Premium_popup
 */
class WPSEO_Premium_Popup {
	/**
	 * An unique identifier for the popup
	 *
	 * @var string
	 */
	private $identifier = '';

	/**
	 * The title of the popup
	 *
	 * @var String
	 */
	private $title = '';

	/**
	 * The content of the popup
	 *
	 * @var String
	 */
	private $content = '';

	/**
	 * Wpseo_Premium_Popup constructor.
	 *
	 * @param String $identifier An unique identifier for the popup.
	 * @param String $title      The title of the popup.
	 * @param String $content    The content of the popup.
	 */
	function __construct( $identifier, $title, $content ) {
		$this->identifier = $identifier;
		$this->title      = $title;
		$this->content    = $content;
	}

	/**
	 * Returns the premium popup as an HTML string.
	 *
	 * @return string
	 */
	public function get_premium_popup() {
		// Don't show in Premium.
		if ( defined( 'WPSEO_PREMIUM_FILE' ) ) {
			return '';
		}

		$assets_uri = trailingslashit( plugin_dir_url( WPSEO_FILE ) );
		$premium_uri = 'https://yoast.com/wordpress/plugins/seo-premium/#utm_source=wordpress-seo-metabox&amp;utm_medium=popup&amp;utm_campaign=help-center-contact-support';

		/* translators: %s expands to Yoast SEO Premium */
		$cta_text = sprintf( __( 'Buy %s', 'wordpress-seo' ), 'Yoast SEO Premium' );

		ob_start();
		?>
        <div id="<?php echo 'wpseo-' . $this->identifier . '-popup' ?>" class="wpseo-premium-popup" style="display: none;">
            <img class="alignright" style="margin: 10px;" src="<?php echo $assets_uri?>images/Yoast_SEO_Icon.svg" width="150" alt="Yoast SEO"/>
                <h1 id="wpseo-contact-support-popup-title" class="wpseo-premium-popup-title"><?php echo $this->title ?></h1>
                <p><?php echo $this->content ?></p>

                <a id="wpseo-<?php echo $this->identifier ?>-popup-button" class="button-primary" href="<?php echo $premium_uri?>"><?php echo $cta_text ?></a>
            </div>
        <?php

		return ob_get_clean();
	}
}
