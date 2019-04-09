/* External dependencies */
import React, { Fragment } from "react";
import PropTypes from "prop-types";

/* Internal dependencies */
import TwitterTitle from "./TwitterTitle";
import TwitterDescription from "./TwitterDescription";
import TwitterSiteName from "./TwitterSiteName";
import TwitterImage from "../twitter/TwitterImage";

/**
 * Renders a TwitterPreview component.
 *
 * @param {object} props The props.
 *
 * @returns {React.Element} The rendered element.
 */
const TwitterPreview = ( props ) => {
	return (
		<Fragment>
			<TwitterImage src={ props.src } alt={ props.alt } />
			<TwitterTitle title={ props.title } />
			<TwitterDescription isLarge={ props.isLarge }>
				{ props.description }
			</TwitterDescription>
			<TwitterSiteName siteName={ props.siteName } />
		</Fragment>
	);
};

TwitterPreview.propTypes = {
	title: PropTypes.string.isRequired,
	description: PropTypes.string,
	isLarge: PropTypes.bool.isRequired,
	siteName: PropTypes.string.isRequired,
	src: PropTypes.string.isRequired,
	alt: PropTypes.string,
};

TwitterPreview.defaultProps = {
	alt: "",
};

TwitterPreview.defaultProps = {
	description: "",
};

export default TwitterPreview;
