import React, { Fragment } from "react";
import ImageSelect from "./ImageSelect";
import PropTypes from "prop-types";
import { ReplacementVariableEditor, replacementVariablesShape } from "@yoast/replacement-variable-editor";
import { __, sprintf } from "@wordpress/i18n";
import styled from "styled-components";
import { getDirectionalStyle } from "@yoast/helpers";
import { angleLeft, angleRight, colors } from "@yoast/style-guide";

const Caret = styled.div`
	position: absolute;

	::before {
		display: block;
		position: absolute;
		top: 0;
		${ getDirectionalStyle( "left", "right" ) === "left" ? "left: 5px" : "right: 5px" };
		width: 22px;
		height: 22px;
		background-image: url( ${ getDirectionalStyle( angleRight( colors.$color_black ), angleLeft( colors.$color_black ) ) } );
		background-size: 24px;
		background-repeat: no-repeat;
		background-position: center;
		content: "";
	}
`;

/**
 * Adds caret styles to a component.
 *
 * @param {ReactComponent} WithoutCaret The component without caret styles.
 * @param {string} color The color to render the caret in.
 * @param {string} mode The mode the snippet preview is in.
 *
 * @returns {ReactComponent} The component with caret styles.
 */
function addCaretStyle( WithoutCaret ) {
	return (
		<Fragment>
			<Caret />
			<WithoutCaret />
		</Fragment>
	);
}

const CaretContainer = addCaretStyle( styled.div`` );

/**
 * A form with an image selection button, a title input field and a description field.
 *
 * @param {object} props The props for this component.
 *
 * @returns {React.Component} Returns a Fragment that contains all input fields.
 */
const SocialMetadataPreviewForm = ( props ) => {
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	const imageSelectTitle = sprintf( __( "%s image", "yoast-components" ), props.socialMediumName );
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	const titleEditorTitle = sprintf( __( "%s title", "yoast-components" ), props.socialMediumName );
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	const descEditorTitle = sprintf( __( "%s desciption", "yoast-components" ), props.socialMediumName );
	/* Translators: %s expands to the social medium name, i.e. Faceboook. */
	const descEditorPlaceholder  = sprintf(
		/* Translators: %s expands to the social medium name, i.e. Faceboook. */
		__( "Modify your %s description by editing it right here...", "yoast-components" ),
		props.socialMediumName
	);

	return (
		<Fragment>
			<ImageSelect
				title={ imageSelectTitle }
				onClick={ props.onSelectImageClick }
				onRemoveImageClick={ props.onRemoveImageClick }
				warnings={ props.imageWarnings }
				imageSelected={ props.imageSelected }
			/>
			<div>
				<Caret />
				<ReplacementVariableEditor
					onChange={ props.onTitleChange }
					content={ props.title }
					replacementVariables={ props.replacementVariables }
					recommendedReplacementVariables={ props.recommendedReplacementVariables }
					type="title"
					label={ titleEditorTitle }
				/>
			</div>
			<Caret />
			<ReplacementVariableEditor
				onChange={ props.onDescriptionChange }
				content={ props.description }
				placeholder={ descEditorPlaceholder }
				replacementVariables={ props.replacementVariables }
				recommendedReplacementVariables={ props.recommendedReplacementVariables }
				type="description"
				label={ descEditorTitle }
			/>
		</Fragment>
	);
}
;

SocialMetadataPreviewForm.propTypes = {
	socialMediumName: PropTypes.oneOf( [ "Twitter", "Facebook" ] ).isRequired,
	replacementVariables: PropTypes.arrayOf( replacementVariablesShape ),
	recommendedReplacementVariables: PropTypes.arrayOf( PropTypes.string ),
	onSelectImageClick: PropTypes.func.isRequired,
	onRemoveImageClick: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	description: PropTypes.string.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	imageWarnings: PropTypes.array,
	imageSelected: PropTypes.bool.isRequired,
};

SocialMetadataPreviewForm.defaultProps = {
	replacementVariables: [],
	recommendedReplacementVariables: [],
	imageWarnings: [],
};

export default SocialMetadataPreviewForm;
