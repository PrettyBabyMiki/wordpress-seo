/* External dependencies */
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
/* Internal dependencies */
import TwitterTitle from "./TwitterTitle";
import TwitterDescription from "./TwitterDescription";
import TwitterSiteName from "./TwitterSiteName";
import TwitterImage from "../twitter/TwitterImage";
import TwitterTextWrapper from "./TwitterTextWrapper";

const TwitterPreviewWrapper = styled.div`
	font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    width: 506px;
    min-height: 125px;
    border-radius: 12px;
    border: 1px solid #E1E8ED;
    box-sizing: border-box;
    color: #292F33;
    background: #FFFFFF;
    &:hover {
        background: #f5f8fa;
        border: 1px solid rgba(136,153,166,.5);
    }
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
`;

/**
 * Renders TwitterPreview component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const TwitterPreview = ( props ) => {
	return (
		<TwitterPreviewWrapper>
			<TwitterImage src={ props.image } alt={ props.alt } />
			<TwitterTextWrapper>
				<TwitterTitle title={ props.title } />
				<TwitterDescription isLarge={ props.isLarge }>
					{ props.description }
				</TwitterDescription>
				<TwitterSiteName siteName={ props.siteName } />
			</TwitterTextWrapper>
		</TwitterPreviewWrapper>
	);
};

TwitterPreview.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	isLarge: PropTypes.bool.isRequired,
	siteName: PropTypes.string.isRequired,
	image: PropTypes.string.isRequired,
	alt: PropTypes.string,
};

TwitterPreview.defaultProps = {
	alt: "",
};

TwitterPreview.defaultProps = {
	description: "",
};

export default TwitterPreview;
