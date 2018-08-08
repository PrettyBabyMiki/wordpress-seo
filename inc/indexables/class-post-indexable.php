<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Indexables
 */

/**
 * Class WPSEO_Post_Indexable
 */
class WPSEO_Post_Indexable extends WPSEO_Indexable {

	/**
	 * @var array The updateable fields.
	 */
	protected $updateable_fields = array(
		'canonical',
		'title',
		'description',
		'breadcrumb_title',
		'og_title',
		'og_description',
		'og_image',
		'twitter_title',
		'twitter_description',
		'twitter_image',
		'is_robots_noindex',
		'is_robots_nofollow',
		'is_robots_noarchive',
		'is_robots_noimageindex',
		'is_robots_nosnippet',
		'primary_focus_keyword',
		'primary_focus_keyword',
		'primary_focus_keyword_score',
		'readability_score',
		'is_cornerstone',
	);

	/**
	 * Creates a new Indexable from a passed object.
	 *
	 * @param int $object_id The object id to create the object for.
	 *
	 * @return WPSEO_Indexable The indexable.
	 *
	 * @throws WPSEO_Invalid_Argument_Exception The invalid argument exception.
	 */
	public static function from_object( $object_id ) {
		if ( get_post( $object_id ) === null ) {
			throw WPSEO_Invalid_Argument_Exception::invalid_type( 'object id' );
		}

		$link_count = new WPSEO_Link_Column_Count();
		$link_count->set( array( $object_id ) );

		return new self(
			array(
				'object_id'                   => (int) $object_id,
				'object_type'                 => 'post',
				'object_subtype'              => get_post_type( $object_id ),
				'permalink'                   => get_permalink( $object_id ),
				'canonical'                   => WPSEO_Meta::get_value( 'canonical', $object_id ),
				'title'                       => WPSEO_Meta::get_value( 'title', $object_id ),
				'description'                 => WPSEO_Meta::get_value( 'metadesc', $object_id ),
				'breadcrumb_title'            => WPSEO_Meta::get_value( 'bctitle', $object_id ),
				'og_title'                    => WPSEO_Meta::get_value( 'opengraph-title', $object_id ),
				'og_description'              => WPSEO_Meta::get_value( 'opengraph-description', $object_id ),
				'og_image'                    => WPSEO_Meta::get_value( 'opengraph-image', $object_id ),
				'twitter_title'               => WPSEO_Meta::get_value( 'twitter-title', $object_id ),
				'twitter_description'         => WPSEO_Meta::get_value( 'twitter-description', $object_id ),
				'twitter_image'               => WPSEO_Meta::get_value( 'twitter-image', $object_id ),
				'is_robots_noindex'           => self::get_robots_noindex_value( WPSEO_Meta::get_value( 'meta-robots-noindex', $object_id ) ),
				'is_robots_nofollow'          => WPSEO_Meta::get_value( 'meta-robots-nofollow', $object_id ) === '1',
				'is_robots_noarchive'         => self::has_advanced_meta_value( $object_id, 'noarchive' ),
				'is_robots_noimageindex'      => self::has_advanced_meta_value( $object_id, 'noimageindex' ),
				'is_robots_nosnippet'         => self::has_advanced_meta_value( $object_id, 'nosnippet' ),
				'primary_focus_keyword'       => WPSEO_Meta::get_value( 'focuskw', $object_id ),
				'primary_focus_keyword_score' => (int) WPSEO_Meta::get_value( 'linkdex', $object_id ),
				'readability_score'           => (int) WPSEO_Meta::get_value( 'content_score', $object_id ),
				'is_cornerstone'              => WPSEO_Meta::get_value( 'is_cornerstone', $object_id ) === '1',
				'link_count'                  => (int) $link_count->get( $object_id ),
				'incoming_link_count'         => (int) $link_count->get( $object_id, 'incoming_link_count' ),
				'created_at'                  => null,
				'updated_at'                  => null,
			)
		);
	}

	/**
	 * Updates the data and returns a new instance.
	 *
	 * @param array $data The data to update into a new instance.
	 *
	 * @return WPSEO_Indexable A new instance with the updated data.
	 */
	public function update( $data ) {
		$data = array_merge( $this->data, $this->filter_updateable_data( $data ) );

		return new self( $data );
	}
}
