<?php
/**
 * Presenter class for the warning that is given when the Category URLs (stripcategorybase) option is touched.
 *
 * @package Yoast\YoastSEO\Presenters\Admin
 */

namespace Yoast\WP\SEO\Presenters\Admin;

use WPSEO_Shortlinker;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Presenters\Abstract_Presenter;

/**
 * Indexation_Permalink_Warning_Presenter class.
 */
class Indexation_Permalink_Warning_Presenter extends Indexation_Warning_Presenter {

	/**
	 * Represents the reason that the permalink settings are changed.
	 */
	const REASON_PERMALINK_SETTINGS   = 'permalink_settings_changed';

	/**
	 * Represents the reason that the category base is changed.
	 */
	const REASON_CATEGORY_BASE_PREFIX = 'category_base_changed';

	/**
	 * Presents the warning that your site's content is not fully indexed.
	 *
	 * @return string The warning HTML.
	 */
	public function present() {
		$output  = '<div id="yoast-indexation-warning" class="notice notice-success">';
		$output .= '<p>';
		$output .= $this->get_text_for_reason( $this->options_helper->get( 'indexables_indexation_reason' ) );
		$output .= '</p>';
		$output .= $this->get_estimate();
		$output .= \sprintf(
			'<button type="button" class="button yoast-open-indexation" data-title="<strong>%1$s</strong>" data-settings="yoastIndexationData">%2$s</button>',
			/* translators: 1: Expands to Yoast. */
			\sprintf( \esc_html__( '%1$s indexing status', 'wordpress-seo' ), 'Yoast' ),
			\esc_html__( 'Start processing and speed up your site now', 'wordpress-seo' )
		);
		$output .= '<hr />';
		$output .= '<p>';
		$output .= \sprintf(
			/* translators: 1: Button start tag to dismiss the warning, 2: Button closing tag. */
			\esc_html__( '%1$sHide this notice%2$s (everything will continue to function normally)', 'wordpress-seo' ),
			\sprintf(
				'<button type="button" id="yoast-indexation-dismiss-button" class="button-link hide-if-no-js" data-nonce="%s">',
				\esc_js( \wp_create_nonce( 'wpseo-ignore' ) )
			),
			'</button>'
		);
		$output .= '</p>';
		$output .= '</div>';

		return $output;
	}

	/**
	 * Determines which text to show as reason for the indexation.
	 *
	 * @param string $reason The saved reason.
	 *
	 * @return string The text to show as reason.
	 */
	protected function get_text_for_reason( $reason ) {
		$text = '';
		switch ( $reason ) {
			case static::REASON_CATEGORY_BASE_PREFIX :
				$text = \esc_html__( 'Because of a change in your category URL setting, some of your SEO data need to be reprocessed.', 'wordpress-seo' );
				break;

			case static::REASON_PERMALINK_SETTINGS :
				$text = \esc_html__( 'Because of a change in your permalink structure, some of your SEO data need to be reprocessed.', 'wordpress-seo' );
				break;
		}

		/**
		 * Filter: 'wpseo_indexables_indexation_alert' - Allow developers to filter the reason of the indexation
		 *
		 * @api string $text The text to show as reason.
		 *
		 * @param string $reason The reason value.
		 */
		return (string) \apply_filters( 'wpseo_indexables_indexation_alert', $text, $reason );
	}
}
