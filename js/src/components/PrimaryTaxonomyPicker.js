/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import {
	withSelect,
	withDispatch,
} from "@wordpress/data";
import { compose } from "@wordpress/compose";
import { sprintf } from "@wordpress/i18n";

/* Internal dependencies */
import TaxonomyPicker from "./TaxonomyPicker";

class PrimaryTaxonomyPicker extends React.Component {
	constructor( props ) {
		super( props );

		this.onChange = this.onChange.bind( this );
		this.updateReplacementVariable = this.updateReplacementVariable.bind( this );

		const { field_id: fieldId, name } = props.taxonomy;
		this.input = document.getElementById( fieldId );
		props.setPrimaryTaxonomy( name, parseInt( this.input.value, 10 ) );
	}

	componentDidUpdate( prevProps ) {
		// Update replacement variable when taxonomy has not yet been retrieved on mount.
		if ( prevProps.terms.length === 0 && this.props.terms.length > 0 ) {
			this.updateReplacementVariable( this.props.primaryTaxonomy );
		}
	}

	onChange( termId ) {
		const { name } = this.props.taxonomy;

		this.updateReplacementVariable( termId );

		this.props.setPrimaryTaxonomy( name, termId );

		this.input.value = termId;
	}

	updateReplacementVariable( termId ) {
		if ( this.props.taxonomy.name === "category" ) {
			const primaryTerm = this.props.terms.find( term => term.id === termId );
			if ( primaryTerm ) {
				this.props.updateReplacementVariable( `primary_${ this.props.taxonomy.name }`, primaryTerm.name );
			}
		}
	}

	render() {
		const {
			primaryTaxonomy,
		} = this.props;

		return (
			<div className="components-base-control__field">
				<label
					htmlFor="yoast-primary-category-picker"
					className="components-base-control__label">
					{ sprintf( "Select the primary %s", this.props.taxonomy.singular_label.toLowerCase() ) }
				</label>
				<TaxonomyPicker
					value={ primaryTaxonomy }
					onChange={ this.onChange }
					id="yoast-primary-category-picker"
					terms={ this.props.terms }/>
			</div>
		);
	}
}

PrimaryTaxonomyPicker.propTypes = {
	terms: PropTypes.array,
	primaryTaxonomy: PropTypes.string,
	setPrimaryTaxonomy: PropTypes.func,
	updateReplacementVariable: PropTypes.func,
	taxonomy: PropTypes.shape( {
		name: PropTypes.string,
		// eslint-disable-next-line
		field_id: PropTypes.string,
	} ),
};

export default compose( [
	withSelect( ( select, props ) => {
		const editorData = select( "core/editor" );
		const coreData = select( "core" );
		const yoastData = select( "yoast-seo/editor" );

		const { taxonomy } = props;

		const postTermIds = editorData.getEditedPostAttribute( taxonomy[ "rest_base" ] ) || [];
		const terms = ( coreData.getEntityRecords( "taxonomy", taxonomy.name ) || [] ).filter( term => {
			return postTermIds.includes( term.id );
		} );

		return {
			terms,
			primaryTaxonomy: yoastData.getPrimaryTaxonomy( taxonomy.name ),
		};
	} ),
	withDispatch( dispatch => {
		const {
			setPrimaryTaxonomy,
			updateReplacementVariable,
		} = dispatch( "yoast-seo/editor" );

		return {
			setPrimaryTaxonomy,
			updateReplacementVariable,
		};
	} ),
] )( PrimaryTaxonomyPicker );
