import React, { Fragment } from "react";
import ImageSelectButtons from "./ImageSelectButtons";
import PropTypes from "prop-types";
import FieldGroup from "../field-group/FieldGroup";
import TextInput from "../inputs/TextInput";

/**
 * Renders ImageSelect
 *
 * @returns {React.Component} The ImageSelect.
 */
class ImageSelect extends React.Component {
	/**
	 * Returns the rendered HTML.
	 *
	 * @returns {React.Component} The ImageSelect.
	 */
	render() {
		const imageSelectButtonsProps = this.props;
		const imageClassName = this.props.imageSelected
			? "yoast-image-select__preview" : "yoast-image-select__preview yoast-image-select__preview--no-preview";
		return (
			<div className="yoast-image-select">
				{ this.props.hasPreview
					? <FieldGroup
						label={ this.props.label }
						wrapperClassName={ "yoast-field-group__image-select" }
					>
						<button className={ imageClassName } onClick={ this.props.onClick } type="button">
							{ this.props.imageSelected &&
							<img src={ this.props.imageUrl } alt={ this.props.imageAltText } className="yoast-image-select__preview--image" /> }
						</button>
						<ImageSelectButtons { ...imageSelectButtonsProps } />
					</FieldGroup>
					: <Fragment>
						<TextInput
							wrapperClassName={ "yoast-field-group__image-select" }
							label={ this.props.label } type="url"
							value={ this.props.imageUrl } readOnly={ true }
						/>
						<ImageSelectButtons { ...imageSelectButtonsProps } />
					</Fragment>
				}
			</div>
		);
	}
}

export default ImageSelect;

ImageSelect.propTypes = {
	imageUrl: PropTypes.string,
	imageAltText: PropTypes.string,
	imageSelected: PropTypes.bool,
	hasPreview: PropTypes.bool.isRequired,
	label: PropTypes.string.isRequired,
	onClick: () => {},
};

ImageSelect.defaultProps = {
	imageUrl: "",
	imageAltText: "",
	imageSelected: false,
	onClick: () => {},
};
