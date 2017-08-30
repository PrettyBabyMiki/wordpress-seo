<?php
/** @package WPSEO\Admin\Watchers */

/**
 * Class WPSEO_Slug_Change_Watcher
 */
class WPSEO_Slug_Change_Watcher implements WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks() {

		// When plugin is premium, just do nothing.
		if ( WPSEO_Utils::is_yoast_seo_premium() ) {
			return;
		}

		// Detect a post slug change.
		add_action( 'post_updated', array( $this, 'detect_slug_change' ), 12, 3 );
	}

	/**
	 * Detect if the slug changed, hooked into 'post_updated'
	 *
	 * @param integer $post_id     The ID of the post. Unused.
	 * @param WP_Post $post        The post with the new values.
	 * @param WP_Post $post_before The post with the previous values.
	 *
	 * @return void
	 */
	public function detect_slug_change( $post_id, $post, $post_before ) {
		// If post is a revision do not create redirect.
		if ( wp_is_post_revision( $post_before ) && wp_is_post_revision( $post ) ) {
			return;
		}

		// There is no slug change.
		if ( $post->post_name === $post_before->post_name ) {
			return;
		}

		// If the post URL wasn't visible before, or isn't visible now, don't even check if we have to redirect.
		if ( ! $this->check_visible_post_status( get_post_status( $post_before->ID ) ) || ! $this->check_visible_post_status( get_post_status( $post->ID ) ) ) {
			return;
		}

		$this->add_notification();
	}

	/**
	 * Checks whether the given post status is visible or not
	 *
	 * @param string $post_status The post status to check.
	 *
	 * @return bool
	 */
	protected function check_visible_post_status( $post_status ) {
		$visible_post_statuses = array(
			'publish',
			'static',
			'private',
		);

		return in_array( $post_status, $visible_post_statuses, true );
	}

	/**
	 * Adds a notification to be shown on the next page request since posts are updated in an ajax request.
	 */
	protected function add_notification() {
		$notification = new Yoast_Notification(
			sprintf(
			/* translators: %1$s expands to the anchor opening tag, %2$s to the anchor closing tag. */
				__(
					'You just changed the URL of a post. To ensure your visitors do not see a 404, you should create a redirect. %1$sLearn how to create redirects here.%2$s',
					'wordpress-seo'
				),
				'<a href="https://yoast.com/which-redirect/">',
				'</a>'
			), array( 'type' => 'notice-info' )
		);

		$notification_center = Yoast_Notification_Center::get();
		$notification_center->add_notification( $notification );
	}
}
