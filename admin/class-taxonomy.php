<?php
/**
 * @package Admin
 */

if ( ! defined( 'WPSEO_VERSION' ) ) {
	header( 'HTTP/1.0 403 Forbidden' );
	die;
}


if ( ! class_exists( 'WPSEO_Taxonomy' ) ) {
	/**
	 * Class that handles the edit boxes on taxonomy edit pages.
	 */
	class WPSEO_Taxonomy {
		
		public $no_index_options  = array();

		public $sitemap_include_options = array();
	
		/**
		 * Class constructor
		 */
		function __construct() {
			$options = WPSEO_Options::get_all();
	
			if ( is_admin() && ( isset( $_GET['taxonomy'] ) && $_GET['taxonomy'] !== '' ) &&
				( ! isset( $options['hideeditbox-tax-' . $_GET['taxonomy']] ) || $options['hideeditbox-tax-' . $_GET['taxonomy']] === false )
			)
				add_action( sanitize_text_field( $_GET['taxonomy'] ) . '_edit_form', array( $this, 'term_seo_form' ), 10, 1 );
	
			add_action( 'edit_term', array( $this, 'update_term' ), 99, 3 );
	
			add_action( 'init', array( $this, 'custom_category_descriptions_allow_html' ) );
			add_filter( 'category_description', array( $this, 'custom_category_descriptions_add_shortcode_support' ) );
			add_action( 'admin_init', array( $this, 'translate_meta_options' ) );
		}


		/**
		 * Translate options text strings for use in the select fields
		 *
		 * @internal IMPORTANT: if you want to add a new string (option) somewhere, make sure you add
		 * that array key to the main options definition array in the class WPSEO_Taxonomy_Meta() as well!!!!
		 */
		public function translate_meta_options() {
			$this->no_index_options        = WPSEO_Taxonomy_Meta::$no_index_options;
			$this->sitemap_include_options = WPSEO_Taxonomy_Meta::$sitemap_include_options;
	
			$this->no_index_options['default']  = __( 'Use %s default (Currently: %s)', 'wordpress-seo' );
			$this->no_index_options['index']    = __( 'Always index', 'wordpress-seo' );
			$this->no_index_options['noindex']  = __( 'Always noindex', 'wordpress-seo' );
	
			$this->sitemap_include_options['-']      = __( 'Auto detect', 'wordpress-seo' );
			$this->sitemap_include_options['always'] = __( 'Always include', 'wordpress-seo' );
			$this->sitemap_include_options['never']  = __( 'Never include', 'wordpress-seo' );
		}




		
		/**
		 * Test whether we are on a public taxonomy - no metabox actions needed if we are not
		 * Unfortunately we have to hook most everything in before the point where all taxonomies are registered and
		 * we know which taxonomy is being requested, so we need to use this check in nearly every hooked in function.
		 *
		 * @since 1.5.0
		 */
		function tax_is_public() {
			// Don't make static as taxonomies may still be added during the run
			$taxonomies = get_taxonomies( array( 'public' => true ), 'names' );
	
			return ( isset( $_GET['taxonomy'] ) && in_array( $_GET['taxonomy'], $taxonomies ) );
		}
	
		/**
		 * Create a row in the form table.
		 *
		 * @param string $var      Variable the row controls.
		 * @param string $label    Label for the variable.
		 * @param string $desc     Description of the use of the variable.
		 * @param array  $tax_meta Taxonomy meta value.
		 * @param string $type     Type of form row to create.
		 * @param array  $options  Options to use when form row is a select box.
		 */
		function form_row( $var, $label, $desc, $tax_meta, $type = 'text', $options = array() ) {
			$val = '';
			if ( isset( $tax_meta[$var] ) && $tax_meta[$var] !== '' ) {
				// @todo is stripslashes really needed here ?
				// might be left over from wrongly encoded saved canonical
				$val = stripslashes( $tax_meta[$var] );
			}
				
			$var = esc_attr( $var );
	
			echo '<tr class="form-field">' . "\n";
			echo "\t" . '<th scope="row" valign="top"><label for="' . $var . '">' . $label . ':</label></th>' . "\n";
			echo "\t" . '<td>' . "\n";
			if ( $type == 'text' ) {
				?>
	        <input name="<?php echo $var; ?>" id="<?php echo $var; ?>" type="text" value="<?php echo esc_attr( $val ); ?>" size="40"/>
	        <p class="description"><?php echo $desc; ?></p>
			<?php
			}
			else if ( $type == 'checkbox' ) {
				?>
	        <input name="<?php echo $var; ?>" id="<?php echo $var; ?>" type="checkbox" <?php checked( $val ); ?>/>
			<?php
			}
			else if ( $type == 'select' ) {
				?>
	        <select name="<?php echo $var; ?>" id="<?php echo $var; ?>">
				<?php
				foreach ( $options as $option => $label ) {
					$sel = selected( $option, $val, false );
					echo '<option ' . $sel . ' value="' . esc_attr( $option ) . '">' . esc_html( $label ) . '</option>';
				}?>
	        </select>
			<?php
			}
			echo "\t" . '</td>' . "\n";
			echo '</tr>' . "\n";
	
		}
	
		/**
		 * Show the SEO inputs for term.
		 *
		 * @param object $term Term to show the edit boxes for.
		 */
		function term_seo_form( $term ) {
			if ( $this->tax_is_public() === false )
				return;
	
			$tax_meta = WPSEO_Taxonomy_Meta::get_term_meta( (int) $term->term_id, $term->taxonomy );
			$options  = WPSEO_Options::get_all();


			echo '<h2>' . __( 'Yoast WordPress SEO Settings', 'wordpress-seo' ) . '</h2>';
			echo '<table class="form-table">';
	
			$this->form_row( 'wpseo_title', __( 'SEO Title', 'wordpress-seo' ), __( 'The SEO title is used on the archive page for this term.', 'wordpress-seo' ), $tax_meta );
			$this->form_row( 'wpseo_desc', __( 'SEO Description', 'wordpress-seo' ), __( 'The SEO description is used for the meta description on the archive page for this term.', 'wordpress-seo' ), $tax_meta );
			
			if ( $options['usemetakeywords'] === true ) {
				$this->form_row( 'wpseo_metakey', __( 'Meta Keywords', 'wordpress-seo' ), __( 'Meta keywords used on the archive page for this term.', 'wordpress-seo' ), $tax_meta );
			}
			
			$this->form_row( 'wpseo_canonical', __( 'Canonical', 'wordpress-seo' ), __( 'The canonical link is shown on the archive page for this term.', 'wordpress-seo' ), $tax_meta );

			if ( $options['breadcrumbs-enable'] === true ) {
				$this->form_row( 'wpseo_bctitle', __( 'Breadcrumbs Title', 'wordpress-seo' ), sprintf( __( 'The Breadcrumbs title is used in the breadcrumbs where this %s appears.', 'wordpress-seo' ), $term->taxonomy ), $tax_meta );
			}


			$current = 'index';
			if ( isset( $options['noindex-tax-' . $term->taxonomy] ) && $options['noindex-tax-' . $term->taxonomy] === true ) {
				$current = 'noindex';
			}
			$noindex_options            = $this->no_index_options;
			$noindex_options['default'] = sprintf( $noindex_options['default'], $term->taxonomy, $current );

			$this->form_row( 'wpseo_noindex', sprintf( __( 'Noindex this %s', 'wordpress-seo' ), $term->taxonomy ), sprintf( __( 'This %s follows the indexation rules set under Metas and Titles, you can override it here.', 'wordpress-seo' ), $term->taxonomy ), $tax_meta, 'select', $noindex_options );


			$this->form_row( 'wpseo_sitemap_include', __( 'Include in sitemap?', 'wordpress-seo' ), '', $tax_meta, 'select', $this->sitemap_include_options );

			echo '</table>';
		}
	
		/**
		 * Update the taxonomy meta data on save.
		 *
		 * @param int    $term_id  ID of the term to save data for
		 * @param int    $tt_id    The taxonomy_term_id for the term.
		 * @param string $taxonomy The taxonomy the term belongs to.
		 */
		function update_term( $term_id, $tt_id, $taxonomy ) {
			$tax_meta = get_option( 'wpseo_taxonomy_meta' );

			/* Create post array with only our values */
			$new_meta_data = array();
			foreach ( WPSEO_Taxonomy_Meta::$defaults_per_term as $key => $default ) {
				if ( isset( $_POST[$key] ) ) {
					$new_meta_data[$key] = $_POST[$key];
				}
			}

			/* Validate the post values */
			$clean = WPSEO_Taxonomy_Meta::validate_term_meta_data( $new_meta_data );

			/* Add/remove the result to/from the original option value */
			if ( $clean !== array() ) {
				$tax_meta[$taxonomy][$term_id] = $clean;
			}
			else {
				unset( $tax_meta[$taxonomy][$term_id] );
				if ( $tax_meta[$taxonomy] === array() ) {
					unset( $tax_meta[$taxonomy] );
				}
			}

			// Prevent complete array validation
			$tax_meta['wpseo_already_validated'] = true;

			update_option( 'wpseo_taxonomy_meta', $tax_meta );
		}


		/**
		 * Allows HTML in descriptions
		 */
		function custom_category_descriptions_allow_html() {
			$filters = array(
				'pre_term_description',
				'pre_link_description',
				'pre_link_notes',
				'pre_user_description',
			);
	
			foreach ( $filters as $filter ) {
				remove_filter( $filter, 'wp_filter_kses' );
			}
			remove_filter( 'term_description', 'wp_kses_data' );
		}
	
		/**
		 * Adds shortcode support to category descriptions.
		 *
		 * @param string $desc String to add shortcodes in.
		 * @return string
		 */
		function custom_category_descriptions_add_shortcode_support( $desc ) {
			// Wrap in output buffering to prevent shortcodes that echo stuff instead of return from breaking things.
			ob_start();
			$desc = do_shortcode( $desc );
			ob_end_clean();
	
			return $desc;
		}
	} /* End of class */

} /* End of class-exists wrapper */