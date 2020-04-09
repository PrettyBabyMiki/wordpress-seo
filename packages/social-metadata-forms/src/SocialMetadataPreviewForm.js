import React, { Fragment, Component } from "react";
import ImageSelect from "./ImageSelect";
import PropTypes from "prop-types";
import { ReplacementVariableEditor, replacementVariablesShape } from "@yoast/replacement-variable-editor";
import { __, sprintf } from "@wordpress/i18n";
import styled from "styled-components";
import { getDirectionalStyle } from "@yoast/helpers";
import { angleLeft, angleRight, colors } from "@yoast/style-guide";

/**
 * Sets the color based on whether the caret is active or not (usually hovered).
 * Display css prop sets the visibility, so this only needs to switch color.
 *
 * @param {*} active Whether to show the active color or the hover color.
 *
 * @returns {string} The color of the caret. Black if active, grey otherwise.
 */
const getCaretColor = ( active ) => {
	return active ? colors.$color_snippet_focus : colors.$color_snippet_hover;
};

const CaretContainer = styled.div`position: relative`;

const Caret = styled.div`
	display: ${ props => ( props.isActive || props.isHovered ) ? "block" : "none" };

	::before {
		position: absolute;
		top: -2px;
		${ getDirectionalStyle( "left", "right" ) }: -25px;
		width: 24px;
		height: 24px;
		background-image: url(
		${ props => getDirectionalStyle(
		angleRight( getCaretColor( props.isActive ) ),
		angleLeft( getCaretColor( props.isActive ) )
	) }
		);
		color: ${ props => getCaretColor( props.isActive ) };
		background-size: 24px;
		background-repeat: no-repeat;
		background-position: center;
		content: "";
	}
`;

Caret.propTypes = {
	isActive: PropTypes.bool,
	isHovered: PropTypes.bool,
};

Caret.defaultProps = {
	isActive: false,
	isHovered: false,
};

/**
 * Adds Caret to a component.
 * @param {React.Element} WithoutCaretComponent The component to add a Caret to.
 *
 * @returns {React.Element} A component with added Caret.
 */
export const withCaretStyle = ( WithoutCaretComponent ) => {
	return function ComponentWithCaret( props ) {
		return (
			<CaretContainer>
				{ /* eslint-disable-next-line react/prop-types */ }
				<Caret isActive={ props.isActive } isHovered={ props.isHovered } />
				<WithoutCaretComponent { ...props } />
			</CaretContainer>
		);
	};
};

const ImageSelectWithCaret = withCaretStyle( ImageSelect );

/**
 * A form with an image selection button, a title input field and a description field.
 *
 * @param {object} props The props for this component.
 *
 * @returns {React.Component} Returns a Fragment that contains all input fields.
 */
class SocialMetadataPreviewForm extends Component {
	/**
	 * Constructs the component.
	 *
	 * @param {Object} props The component's props.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		// Binding fields to onMouseHover to prevent arrow functions in JSX props.
		this.onImageEnter = props.onMouseHover.bind( this, "image" );
		this.onTitleEnter = props.onMouseHover.bind( this, "title" );
		this.onDescriptionEnter = props.onMouseHover.bind( this, "description" );
		this.onLeave = props.onMouseHover.bind( this, "" );
		this.onImageSelectBlur = props.onSelect.bind( this, "" );

		this.onSelectTitleEditor = this.onSelectEditor.bind( this, "title" );
		this.onSelectDescriptionEditor = this.onSelectEditor.bind( this, "description" );
		this.onDeselectEditor = this.onSelectEditor.bind( this, "" );

		this.onTitleEditorRef = this.onSetEditorRef.bind( this, "title" );
		this.onDescriptionEditorRef = this.onSetEditorRef.bind( this, "description" );
	}

	/**
	 * Handles the onSelect function for the editors.
	 *
	 * @param {String} field The field name of the editor to focus.
	 *
	 * @returns {void}
	 */
	onSelectEditor( field ) {
		this.props.onSelect( field );
	}

	/**
	 * Handles the onSelect function for the editors.
	 *
	 * @param {String} field The field name of the editor to focus.
	 * @param {String} ref The field name of the editor to focus.
	 *
	 * @returns {void}
	 */
	onSetEditorRef( field, ref ) {
		this.props.setEditorRef( field, ref );
	}

	/**
	 * Renders the component.
	 *
	 * @returns {React.Element} The rend
	 */
	render() {
		const {
			socialMediumName,
			onSelectImageClick,
			onRemoveImageClick,
			title,
			description,
			onTitleChange,
			onDescriptionChange,
			imageSelected,
			hoveredField,
			activeField,
			isPremium,
			replacementVariables,
			recommendedReplacementVariables,
			imageWarnings,
			imageUrl,
		} = this.props;

		/* Translators: %s expands to the social medium name, i.e. Faceboook. */
		const imageSelectTitle = sprintf( __( "%s image", "yoast-components" ), socialMediumName );
		/* Translators: %s expands to the social medium name, i.e. Faceboook. */
		const titleEditorTitle = sprintf( __( "%s title", "yoast-components" ), socialMediumName );
		/* Translators: %s expands to the social medium name, i.e. Faceboook. */
		const descEditorTitle = sprintf( __( "%s desciption", "yoast-components" ), socialMediumName );
		/* Translators: %s expands to the social medium name, i.e. Faceboook. */
		const descEditorPlaceholder  = sprintf(
			/* Translators: %s expands to the social medium name, i.e. Faceboook. */
			__( "Modify your %s description by editing it right here...", "yoast-components" ),
			socialMediumName
		);


		return (
			<Fragment>
				<ImageSelectWithCaret
					title={ imageSelectTitle }
					onClick={ onSelectImageClick }
					onRemoveImageClick={ onRemoveImageClick }
					warnings={ imageWarnings }
					imageSelected={ imageSelected }
					onMouseEnter={ this.onImageEnter }
					onMouseLeave={ this.onLeave }
					isActive={ activeField === "image" }
					isHovered={ hoveredField === "image" }
					imageUrl={ imageUrl }
					isPremium={ isPremium }
				/>
				<ReplacementVariableEditor
					onChange={ onTitleChange }
					content={ title }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					type="title"
					label={ titleEditorTitle }
					onMouseEnter={ this.onTitleEnter }
					onMouseLeave={ this.onLeave }
					isActive={ activeField === "title" }
					isHovered={ hoveredField === "title" }
					withCaret={ true }
					onFocus={ this.onSelectTitleEditor }
					onBlur={ this.onDeselectEditor }
					editorRef={ this.onTitleEditorRef }
				/>
				<ReplacementVariableEditor
					onChange={ onDescriptionChange }
					content={ description }
					placeholder={ descEditorPlaceholder }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					type="description"
					label={ descEditorTitle }
					onMouseEnter={ this.onDescriptionEnter }
					onMouseLeave={ this.onLeave }
					isActive={ activeField === "description" }
					isHovered={ hoveredField === "description" }
					withCaret={ true }
					onFocus={ this.onSelectDescriptionEditor }
					onBlur={ this.onDeselectEditor }
					editorRef={ this.onDescriptionEditorRef }
				/>
			</Fragment>
		);
	}
}


SocialMetadataPreviewForm.propTypes = {
	socialMediumName: PropTypes.oneOf( [ "Twitter", "Facebook" ] ).isRequired,
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	imageSelected: PropTypes.bool.isRequired,
	hoveredField: PropTypes.string,
	activeField: PropTypes.string,
	onSelect: PropTypes.func,
	isPremium: PropTypes.bool,
	replacementVariables: replacementVariablesShape,
	recommendedReplacementVariables: PropTypes.arrayOf( PropTypes.string ),
	imageWarnings: PropTypes.array,
	imageUrl: PropTypes.string,
	setEditorRef: PropTypes.func,
	onMouseHover: PropTypes.func,
};

SocialMetadataPreviewForm.defaultProps = {
	replacementVariables: [],
	recommendedReplacementVariables: [],
	imageWarnings: [],
	hoveredField: "",
	activeField: "",
	onSelect: () => {},
	imageUrl: "",
	isPremium: false,
	setEditorRef: () => {},
	onMouseHover: () => {},
};

export default SocialMetadataPreviewForm;
