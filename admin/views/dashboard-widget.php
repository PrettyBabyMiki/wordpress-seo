<?php
/**
 * @package WPSEO\Admin
 *
 * @var array $statistics {
 *      An array of statistics to display
 *
 *      @type string $seo_rank The SEO rank that this item represents
 *      @type string $title The title for this statistic
 *      @type string $class The class for the link
 *      @type int $count The amount of posts that meets the statistic requirements
 * }
 */

?>
<p><?php _e( 'Below are your current posts&#8217; SEO scores. Now is as good a time as any to start improving some of your posts!', 'wordpress-seo' ); ?></p>
<ul>
<?php foreach ( $statistics as $statistic ) : ?>
	<li>
		<div title="" class="wpseo-score-icon <?php echo esc_attr( $statistic['seo_rank'] ); ?>"></div>
		<a href="<?php echo esc_attr( admin_url( 'edit.php?post_status=all&post_type=post&seo_filter=' . $statistic['seo_rank'] ) ); ?>"
			class="wpseo-glance <?php echo esc_attr( $statistic['class'] ); ?>">
			<?php printf( $statistic['title'], intval( $statistic['count'] ) ); ?>
		</a>
	</li>
<?php endforeach; ?>
</ul>
