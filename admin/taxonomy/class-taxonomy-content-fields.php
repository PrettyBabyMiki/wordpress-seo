<?php
/**
 * @package WPSEO\Admin
 */

/**
 * This class parses all the values for the general tab in the Yoast SEO settings metabox
 */
class WPSEO_Taxonomy_Content_Fields extends WPSEO_Taxonomy_Fields {

	/**
	 * Returns array with the fields for the general tab
	 *
	 * @return array
	 */
	public function get() {
		$fields = array(
			'snippet' => $this->get_field_config(
				__( 'Snippet editor', 'wordpress-seo' ),
				'',
				'snippetpreview',
				array(
					'help-button' => __( 'Snippet Editor Help', 'wordpress-seo' ),
					'help'        => sprintf( __( 'This is a rendering of what this post might look like in Google\'s search results. %sLearn more about the Snippet Preview%s.', 'wordpress-seo' ), '<a target="_blank" href="https://yoa.st/snippet-preview">', '</a>' ),
				)
			),
			'focuskw' => $this->get_field_config(
				__( 'Focus keyword', 'wordpress-seo' ),
				'',
				'focuskeyword',
				array(
					'help-button' => __( 'Focus Keyword Help', 'wordpress-seo' ),
					'help'        => sprintf( __( 'Pick the main keyword or keyphrase that this post/page is about. %sLearn more about the Focus Keyword%s.', 'wordpress-seo' ), '<a target="_blank" href="https://yoa.st/focus-keyword">', '</a>' ),
				)
			),
			'analysis' => $this->get_field_config(
				__( 'Analysis', 'wordpress-seo' ),
				'',
				'pageanalysis',
				array(
					'help-button' => __( 'Content Analysis Help', 'wordpress-seo' ),
					'help'        => sprintf( __( 'This is the content analysis, a collection of content checks that analyze the content of your page. %sLearn more about the Content Analysis Tool%s.', 'wordpress-seo' ), '<a target="_blank" href="https://yoa.st/content-analysis">', '</a>' ),
				)
			),
			'title' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
			'desc' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
			'linkdex' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
			'content_score' => $this->get_field_config(
				'',
				'',
				'hidden',
				''
			),
		);

		return $this->filter_hidden_fields( $fields );
	}
}
