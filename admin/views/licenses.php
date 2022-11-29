<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 * @since   5.1
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'Status: 403 Forbidden' );
	header( 'HTTP/1.1 403 Forbidden' );
	exit();
}

do_action( 'wpseo_install_and_activate_addons' );

$premium_extension = [
	'buyUrl'   => WPSEO_Shortlinker::get( 'https://yoa.st/zz' ),
	'infoUrl'  => WPSEO_Shortlinker::get( 'https://yoa.st/zy' ),
	'title'    => 'Yoast SEO Premium',
	/* translators: %1$s expands to Yoast SEO */
	'desc'     => sprintf( __( 'The premium version of %1$s with more features & support.', 'wordpress-seo' ), 'Yoast SEO' ),
	'benefits' => [],
];

$extensions = [
	WPSEO_Addon_Manager::LOCAL_SLUG => [
		'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/zt' ),
		'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/zs' ),
		'title'         => 'Local SEO',
		'display_title' => __( 'Reach customers that live near your business', 'wordpress-seo' ),
		'desc'          => __( 'Rank better locally and in Google Maps, without breaking a sweat!', 'wordpress-seo' ),
		'image'         => plugins_url( 'images/local_plugin_assistant.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
		'benefits'      => [
			__( 'Rank higher with your physical business, office, or store', 'wordpress-seo' ),
			__( 'Make an optimized contact page in minutes', 'wordpress-seo' ),
			__( 'Allow customers to pick up their orders locally', 'wordpress-seo' ),
			__( 'Easily define your organization type to search engines', 'wordpress-seo' ),
		],
	],
	WPSEO_Addon_Manager::VIDEO_SLUG => [
		'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/zx/' ),
		'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/zw/' ),
		'title'         => 'Video SEO',
		'display_title' => __( 'Drive more traffic to your videos', 'wordpress-seo' ),
		'desc'          => __( 'Optimize your videos to show them off in search results and get more clicks!', 'wordpress-seo' ),
		'image'         => plugins_url( 'images/video_plugin_assistant.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
		'benefits'      => [
			__( 'Know that Google discovers your videos', 'wordpress-seo' ),
			__( 'Load pages faster that include videos', 'wordpress-seo' ),
			__( 'Make your videos responsive for all screen sizes', 'wordpress-seo' ),
			__( 'Get XML video sitemaps', 'wordpress-seo' ),
		],
	],
	WPSEO_Addon_Manager::NEWS_SLUG  => [
		'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/zv/' ),
		'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/zu/' ),
		'title'         => 'News SEO',
		'display_title' => __( 'Rank higher in Google\'s news carousel', 'wordpress-seo' ),
		'desc'          => __( 'Are you in Google News? Increase your traffic from Google News by optimizing for it!', 'wordpress-seo' ),
		'image'         => plugins_url( 'images/news_plugin_assistant.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
		'benefits'      => [
			__( 'Optimize your site for Google News', 'wordpress-seo' ),
			__( 'Ping Google on the publication of a new post', 'wordpress-seo' ),
			__( 'Add all necessary schema.org markup', 'wordpress-seo' ),
			__( 'Get XML news sitemaps', 'wordpress-seo' ),
		],
	],
];

// Add Yoast WooCommerce SEO when WooCommerce is active.
if ( YoastSEO()->helpers->woocommerce->is_active() ) {
	$extensions[ WPSEO_Addon_Manager::WOOCOMMERCE_SLUG ] = [
		'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/zr' ),
		'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/zq' ),
		'title'         => 'Yoast WooCommerce SEO',
		'display_title' => __( 'Drive more traffic to your online store', 'wordpress-seo' ),
		/* translators: %1$s expands to Yoast SEO */
		'desc'          => sprintf( __( 'Seamlessly integrate WooCommerce with %1$s and get extra features!', 'wordpress-seo' ), 'Yoast SEO' ),
		'image'         => plugins_url( 'images/woo_plugin_assistant.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
		'benefits'      => [
			__( 'Write product pages that rank with the enhanced SEO analysis', 'wordpress-seo' ),
			__( 'Increase clicks of Google search with rich results', 'wordpress-seo' ),
			__( 'Add global identifiers for variable products', 'wordpress-seo' ),
			/* translators: %1$s expands to Yoast SEO, %2$s expands to WooCommerce */
			sprintf( __( 'Seamless integration between %1$s and %2$s', 'wordpress-seo' ), 'Yoast SEO', 'WooCommerce' ),
		],
		'buy_button'    => 'WooCommerce SEO',
	];
}

$extensions['yoast-seo-plugin-subscription'] = [
	'buyUrl'        => WPSEO_Shortlinker::get( 'https://yoa.st/premium-page-bundle-buy' ),
	'infoUrl'       => WPSEO_Shortlinker::get( 'https://yoa.st/premium-page-bundle-info' ),
	'title'         => 'all Yoast plugins',
	'display_title' => __( 'Cover all your SEO bases', 'wordpress-seo' ),
	'desc'          => '',
	'image'         => plugins_url( 'images/plugin_subscription.svg?v=' . WPSEO_VERSION, WPSEO_FILE ),
	'benefits'      => [
		__( 'Get all 5 Yoast plugins for WordPress with a big discount', 'wordpress-seo' ),
		__( 'Reach new customers that live near your business', 'wordpress-seo' ),
		__( 'Drive more traffic with your videos', 'wordpress-seo' ),
		__( 'Rank higher in Google\'s news carousel', 'wordpress-seo' ),
		__( 'Drive more traffic to your online store', 'wordpress-seo' ),

	],
	'buy_button'    => 'all Yoast plugins',
];

$addon_manager                  = new WPSEO_Addon_Manager();
$has_valid_premium_subscription = YoastSEO()->helpers->product->is_premium() && $addon_manager->has_valid_subscription( WPSEO_Addon_Manager::PREMIUM_SLUG );

/* translators: %1$s expands to Yoast SEO. */
$wpseo_extensions_header = sprintf( __( '%1$s Extensions', 'wordpress-seo' ), 'Yoast SEO' );
$new_tab_message         = sprintf(
	'<span class="screen-reader-text">%1$s</span>',
	esc_html__( '(Opens in a new browser tab)', 'wordpress-seo' )
);

?>

<div class="wrap yoast wpseo_table_page">

	<h1 id="wpseo-title" class="yoast-h1"><?php echo esc_html( $wpseo_extensions_header ); ?></h1>

	<div id="extensions">
		<section class="yoast-seo-premium-extension">
			<h2>
				<?php
				printf(
					/* translators: 1: expands to a opening span tag, 2: expands to a closing span tag, 3: expands to Yoast SEO Premium */
					esc_html__( '%1$sDrive more traffic to your site%2$s with %3$s', 'wordpress-seo' ),
					'<span class="yoast-heading-highlight">',
					'</span>',
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
					$premium_extension['title']
				);
				?>
			</h2>

			<?php
			if ( ! $has_valid_premium_subscription ) :
				?>
				<ul class="yoast-seo-premium-benefits yoast-list--usp">
					<li class="yoast-seo-premium-benefits__item">
						<span class="yoast-seo-premium-benefits__title"><?php esc_html_e( 'Reach bigger audiences', 'wordpress-seo' ); ?></span>
						<span class="yoast-seo-premium-benefits__description"><?php esc_html_e( 'Optimize a single post for synonyms and related keyphrases and get extra checks with the Premium SEO analysis', 'wordpress-seo' ); ?></span>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<span class="yoast-seo-premium-benefits__title"><?php esc_html_e( 'Save time on doing SEO', 'wordpress-seo' ); ?></span>
						<span class="yoast-seo-premium-benefits__description"><?php esc_html_e( 'The Yoast SEO workouts guide you through important routine SEO tasks', 'wordpress-seo' ); ?></span>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<span class="yoast-seo-premium-benefits__title"><?php esc_html_e( 'Improve your internal linking structure', 'wordpress-seo' ); ?></span>
						<span class="yoast-seo-premium-benefits__description"><?php esc_html_e( 'Get tools that tell you where and how to improve internal linking', 'wordpress-seo' ); ?></span>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<span class="yoast-seo-premium-benefits__title"><?php esc_html_e( 'Reduce your site\'s carbon footprint', 'wordpress-seo' ); ?></span>
						<span class="yoast-seo-premium-benefits__description"><?php esc_html_e( 'Save energy by reducing the crawlability of your site without hurting your rankings!', 'wordpress-seo' ); ?></span>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<span class="yoast-seo-premium-benefits__title"><?php esc_html_e( 'Prevents 404s', 'wordpress-seo' ); ?></span>
						<span class="yoast-seo-premium-benefits__description"><?php esc_html_e( 'Easily create and manage redirects when you move or delete content', 'wordpress-seo' ); ?></span>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<span class="yoast-seo-premium-benefits__title"><?php esc_html_e( 'Stand out on social media', 'wordpress-seo' ); ?></span>
						<span class="yoast-seo-premium-benefits__description"><?php esc_html_e( 'Check what your Facebook or Twitter post will look like before posting them', 'wordpress-seo' ); ?></span>
					</li>
					<li class="yoast-seo-premium-benefits__item">
						<span class="yoast-seo-premium-benefits__title"><?php esc_html_e( 'Premium support', 'wordpress-seo' ); ?></span>
						<span class="yoast-seo-premium-benefits__description"><?php esc_html_e( 'Gain access to our 24/7 support team', 'wordpress-seo' ); ?></span>
					</li>
				</ul>
			<?php endif; ?>
			<?php if ( $addon_manager->is_installed( WPSEO_Addon_Manager::PREMIUM_SLUG ) ) : ?>
				<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-installed"><?php esc_html_e( 'Installed', 'wordpress-seo' ); ?></div>

				<?php if ( $has_valid_premium_subscription ) : ?>
					<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-activated"><?php esc_html_e( 'Activated', 'wordpress-seo' ); ?></div>
					<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/13k' ); ?>" class="yoast-link--license">
						<?php
						printf(
							/* translators: %s expands to the extension title */
							esc_html__( 'Manage your %s subscription on MyYoast', 'wordpress-seo' ),
							esc_html( $premium_extension['title'] )
						);
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
						echo $new_tab_message;
						?>
					</a>
				<?php else : ?>
					<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-not-activated"><?php esc_html_e( 'Not activated', 'wordpress-seo' ); ?></div>
					<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/13i' ); ?>" class="yoast-link--license">
						<?php
						printf(
							/* translators: %s expands to the extension title */
							esc_html__( 'Activate %s for your site on MyYoast', 'wordpress-seo' ),
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
							esc_html( $premium_extension['title'] )
						);
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
						echo $new_tab_message;
						?>
					</a>
				<?php endif; ?>

			<?php else : ?>

				<a target="_blank" data-action="load-nfd-ctb" data-ctb-id="57d6a568-783c-45e2-a388-847cff155897" href="<?php echo esc_url( $premium_extension['buyUrl'] ); ?>" class="yoast-button-upsell">
					<?php
					printf(
						/* translators: $s expands to Yoast SEO Premium */
						esc_html__( 'Buy %s', 'wordpress-seo' ),
						esc_html( $premium_extension['title'] )
					);
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
					echo $new_tab_message;
					echo '<span aria-hidden="true" class="yoast-button-upsell__caret"></span>';
					?>
				</a>

				<a target="_blank"  href="<?php echo esc_url( $premium_extension['infoUrl'] ); ?>" class="yoast-link--more-info">
					<?php
					printf(
						/* translators: Text between 1: and 2: will only be shown to screen readers. 3: expands to the product name. */
						esc_html__( 'More information %1$sabout %3$s%2$s', 'wordpress-seo' ),
						'<span class="screen-reader-text">',
						'</span>',
						// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
						$premium_extension['title']
					);
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
					echo $new_tab_message;
					?>
				</a>
			<?php endif; ?>
			<?php if ( ! $has_valid_premium_subscription ) { ?>
				<p>
					<small class="yoast-money-back-guarantee"><?php esc_html_e( 'With 30-day money-back guarantee. No questions asked.', 'wordpress-seo' ); ?></small>
				</p>
			<?php } ?>
		</section>

		<hr class="yoast-hr" aria-hidden="true"/>

		<section class="yoast-promo-extensions">
			<h2>
				<?php
				$yoast_outrank_copy = sprintf( esc_html__( 'Outrank your competitors even further', 'wordpress-seo' ) );
				$yoast_outrank_copy = '<span class="yoast-heading-highlight">' . $yoast_outrank_copy . '</span>';

				printf(
					/* translators: 1: expands to Outrank your competitors even further, 2: expands to Yoast SEO */
					esc_html__( '%1$s with %2$s extensions', 'wordpress-seo' ),
					// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $yoast_seo_extensions is properly escaped.
					$yoast_outrank_copy,
					'Yoast SEO'
				);
				?>
			</h2>

			<?php
			foreach ( $extensions as $slug => $extension ) :
				?>
				<section class="yoast-promoblock secondary yoast-promo-extension">
					<h3>
						<img alt="" width="100" height="100" src="<?php echo esc_url( $extension['image'] ); ?>"/>
						<?php echo esc_html( $extension['display_title'] ); ?>
					</h3>
					<ul class="yoast-list--usp">
						<?php foreach ( $extension['benefits'] as $benefit ) : ?>
							<li><?php echo esc_html( $benefit ); ?></li>
						<?php endforeach; ?>
					</ul>

					<div class="yoast-button-container">
						<?php if ( $addon_manager->is_installed( $slug ) ) : ?>
							<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-installed"><?php esc_html_e( 'Installed', 'wordpress-seo' ); ?></div>

							<?php if ( $addon_manager->has_valid_subscription( $slug ) ) : ?>
								<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-activated"><?php esc_html_e( 'Activated', 'wordpress-seo' ); ?></div>
								<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/13k' ); ?>" class="yoast-link--license">
									<?php
									printf(
										/* translators: %s expands to the extension title */
										esc_html__( 'Manage your %s subscription on MyYoast', 'wordpress-seo' ),
										// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
										$extension['title']
									);
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
									echo $new_tab_message;
									?>
								</a>
							<?php else : ?>
								<div class="yoast-button yoast-button--noarrow yoast-button--extension yoast-button--extension-not-activated"><?php esc_html_e( 'Not activated', 'wordpress-seo' ); ?></div>
								<a target="_blank" href="<?php WPSEO_Shortlinker::show( 'https://yoa.st/13i' ); ?>" class="yoast-link--license">
									<?php
									printf(
										/* translators: %s expands to the extension title */
										esc_html__( 'Activate %s for your site on MyYoast', 'wordpress-seo' ),
										// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
										$extension['title']
									);
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
									echo $new_tab_message;
									?>
								</a>
							<?php endif; ?>
						<?php else : ?>
							<a target="_blank" class="yoast-button-upsell" href="<?php echo esc_url( $extension['buyUrl'] ); ?>">
								<?php
								printf(
									/* translators: %s expands to the product name, e.g. "News SEO" or "all Yoast Plugins" */
									esc_html__( 'Buy %s', 'wordpress-seo' ),
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The possible `get_buy_button` values are hardcoded (buy_button or title); only passed through the WPSEO_Extensions class.
									( isset( $extension['buy_button'] ) ) ? $extension['buy_button'] : $extension['title']
								);
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
								echo $new_tab_message;
								echo '<span aria-hidden="true" class="yoast-button-upsell__caret"></span>';
								?>
							</a>

							<a target="_blank" class="yoast-link--more-info" href="<?php echo esc_url( $extension['infoUrl'] ); ?>">
								<?php
								printf(
									/* translators: Text between 1: and 2: will only be shown to screen readers. 3: expands to the product name, e.g. "News SEO" or "all Yoast Plugins" */
									esc_html__( 'More information %1$sabout %3$s%2$s', 'wordpress-seo' ),
									'<span class="screen-reader-text">',
									'</span>',
									// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: The `get_title` value is hardcoded; only passed through the WPSEO_Extensions class.
									$extension['title']
								);
								// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Reason: $new_tab_message is properly escaped.
								echo $new_tab_message;
								?>
							</a>
						<?php endif; ?>
					</div>
				</section>
			<?php endforeach; ?>
		</section>
	</div>

</div>
