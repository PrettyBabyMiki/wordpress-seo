import React from "react";
import PropTypes from "prop-types";

// Adding && for specificity, competing styles coming from blockeditor.
const StyledImage = styled.img`
	&& {
		max-width: ${ props => props.width }px;
		height: ${ props => props.height }px;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		max-width: none;
	}
`;

/**
 * Renders the SocialImage.
 *
 * @param {Object} props The component's props.
 *
 * @returns {SocialImage} The SocialImage component.
 */
export const SocialImage = ( props ) => {
	const { imageProps, width, height, imageMode } = props;

	if ( imageMode === "landscape" ) {
		return <div
			style={ {
				background: `url(${ imageProps.src }) center / cover no-repeat`,
				paddingBottom: `${ imageProps.aspectRatio }%`,
			} }
			role="img"
			aria-label={ imageProps.alt }
		/>;
	}

	return <StyledImage
		src={ imageProps.src }
		alt={ imageProps.alt }
		width={ width }
		height={ height }
		imageProperties={ imageProps }
	/>;
};

SocialImage.propTypes = {
	imageProps: PropTypes.shape( {
		src: PropTypes.string.isRequired,
		alt: PropTypes.string.isRequired,
		aspectRatio: PropTypes.number.isRequired,
	} ).isRequired,
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	imageMode: PropTypes.string,
};

SocialImage.defaultProps = {
	imageMode: "landscape",
};
