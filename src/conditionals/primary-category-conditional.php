<?php
/**
 * Yoast SEO plugin file.
 *
 * @package Yoast\YoastSEO\Conditionals
 */

namespace Yoast\WP\Free\Conditionals;

use Yoast\WP\Free\Helpers\Current_Page_Helper;

/**
 * Conditional that is only met when in frontend or page is a post overview or post add/edit form.
 */
class Primary_Category_Conditional implements Conditional {

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page;

	/**
	 * Primary_Category_Conditional constructor.
	 *
	 * @param Current_Page_Helper $current_page The current page helper.
	 */
	public function __construct( Current_Page_Helper $current_page ) {
		$this->current_page = $current_page;
	}

	/**
	 * @inheritdoc
	 */
	public function is_met() {
		if ( ! \is_admin() ) {
			return true;
		}

		return in_array( $this->current_page->get_current_admin_page(), [ 'edit.php', 'post.php', 'post-new.php' ], true );
	}
}
