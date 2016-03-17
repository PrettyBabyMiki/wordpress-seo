<?php

class WPSEO_Taxonomy_Test extends \PHPUnit_Framework_TestCase {
	public function test_is_term_edit() {
		$this->assertTrue( WPSEO_Taxonomy::is_term_edit( 'term.php' ) );
		$this->assertTrue( WPSEO_Taxonomy::is_term_edit( 'edit-tags.php' ) );
		$this->assertFalse( WPSEO_Taxonomy::is_term_edit( '' ) );
		$this->assertFalse( WPSEO_Taxonomy::is_term_edit( 'random' ) );
	}

	public function test_is_term_overview() {
		$this->assertFalse( WPSEO_Taxonomy::is_term_overview( 'term.php' ) );
		$this->assertTrue( WPSEO_Taxonomy::is_term_overview( 'edit-tags.php' ) );
		$this->assertFalse( WPSEO_Taxonomy::is_term_overview( '' ) );
		$this->assertFalse( WPSEO_Taxonomy::is_term_overview( 'random' ) );
	}
}
