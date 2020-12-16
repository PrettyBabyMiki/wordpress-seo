<?php

namespace Yoast\WP\SEO\Tests\Unit\Helpers\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

use Brain\Monkey;
use Mockery;

use Yoast\WP\SEO\Helpers\Schema\Replace_Vars_Helper;

use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;

/**
 * Class Replace_Vars_Helper_Test.
 *
 * @group helpers
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Helpers\Schema\Replace_Vars_Helper
 */
class Replace_Vars_Helper_Test extends TestCase {

	/**
	 * Meta_Tags_Context_Memoizer mock.
	 *
	 * @var Mockery\MockInterface|Meta_Tags_Context_Memoizer
	 */
	protected $meta_tags_context_memoizer;

	/**
	 * WPSEO_Replace_Vars mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Replace_Vars
	 */
	protected $replace_vars;

	/**
	 * ID_Helper mock.
	 *
	 * @var Mockery\MockInterface|ID_Helper
	 */
	protected $id_helper;

	/**
	 * The instance under test.
	 *
	 * @var Replace_Vars_Helper
	 */
	protected $instance;

	/**
	 * Sets up the class under test and mock objects.
	 */
	public function set_up() {
		parent::set_up();

		$this->meta_tags_context_memoizer = Mockery::mock( Meta_Tags_Context_Memoizer::class );
		$this->replace_vars               = Mockery::mock( WPSEO_Replace_Vars::class );
		$this->id_helper                  = Mockery::mock( ID_Helper::class );

		$this->instance = new Replace_Vars_Helper(
			$this->meta_tags_context_memoizer,
			$this->replace_vars,
			$this->id_helper
		);
	}

	/**
	 * Tests the registration of the Schema ID replace vars.
	 *
	 * @covers ::__construct
	 * @covers ::register_replace_vars
	 * @covers ::maybe_register_replacement
	 */
	public function test_register_replace_vars() {
		$replace_vars = [
			'main_schema_id',
			'author_id',
			'person_id',
			'primary_image_id',
			'webpage_id',
			'website_id',
		];

		foreach ( $replace_vars as $replace_var) {
			$this->replace_vars
				->expects( 'has_been_registered' )
				->with( $replace_var )
				->andReturnFalse();
		}

		/*
		 * Need to make a partial mock, since we are not able to mock
		 * the static WPSEO_Replace_Vars::register_replacement method.
		 */
		$instance = Mockery::mock(
			Replace_Vars_Helper::class,
			[
				$this->meta_tags_context_memoizer,
				$this->replace_vars,
				$this->id_helper,
			]
		)
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$instance->register_replace_vars();
	}

	/**
	 * Tests the replace method.
	 *
	 * @covers ::__construct
	 * @covers ::replace
	 */
	public function test_replace() {
		$schema_data = [
			'blockName' => 'FAQ Block',
			'attrs'     => [
				'questions' => [
					[
						'id'           => 'id-1',
						'jsonQuestion' => 'This is a question',
						'jsonAnswer'   => 'This is an answer',
					],
					[
						'id'           => 'id-2',
						'jsonQuestion' => 'This is a question with no answer',
					],
				],
			],
		];

		$presentation         = Mockery::mock( Indexable_Presentation::class );
		$presentation->source = [ 'post_content' => 'some text' ];

		$values = $this->array_values_recursively( $schema_data );

		// We expect all the schema values (the leafs) to be run through the replace vars.
		foreach ( $values as $value ) {
			$this->replace_vars
				->expects( 'replace' )
				->with( $value, $presentation->source );
		}

		$this->instance->replace( $schema_data, $presentation );
	}

	/**
	 * Returns all the values of the given nested array as one flat array.
	 *
	 * @param array $array A nested array of key-value pairs.
	 *
	 * @return array All of the values in the nested array.
	 */
	protected function array_values_recursively( $array ) {
		$merged = [];

		foreach ( $array as $value ) {
			if ( is_array( $value ) ) {
				$merged[] = $this->array_values_recursively( $value );
			}
			else {
				$merged[] = [ $value ];
			}
		}

		return \array_merge( ...$merged );
	}
}
