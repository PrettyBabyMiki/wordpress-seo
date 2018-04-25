<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\CLI
 */

/**
 * Implementation of the 'redirect delete' WP-CLI command.
 */
final class WPSEO_CLI_Redirect_Delete_Command extends WPSEO_CLI_Redirect_Base_Command {

	/**
	 * Deletes an existing Yoast SEO redirect.
	 *
	 * ## OPTIONS
	 *
	 * <origin>
	 * : Origin of the redirect.
	 */
	public function __invoke( $args, $assoc_args ) {
		list( $origin ) = $args;

		if ( ! $this->has_redirect( $origin ) ) {
			WP_CLI::error( "Redirect does not exist for '{$origin}'." );
		} else {
			$success = $this->delete_redirect( $origin );
		}

		if ( ! $success ) {
			WP_CLI::error( "Could not delete redirect: '{$origin}'." );
		}

		WP_CLI::success( "Redirect delete: '{$origin}'." );
	}
}
