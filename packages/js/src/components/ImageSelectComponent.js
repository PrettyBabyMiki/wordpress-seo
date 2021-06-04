/* External dependencies */
import PropTypes from "prop-types";
import { Component } from "@wordpress/element";

/* Yoast dependencies */
import { ImageSelect } from "@yoast/components";
import { validateFacebookImage } from "@yoast/helpers";

/* Internal dependencies */
import { openMedia } from "../helpers/selectMedia";


/**
 * Renders the ImageSelect.
 */
class ImageSelectComponent extends Component {
	/**
	 * The ImageSelectComponent constructor.
	 *
	 * @param {Object} props The components props.
	 */
	constructor( props ) {
		super( props );

		this.hiddenField = document.getElementById( this.props.hiddenField );
		this.hiddenFieldImageId = document.getElementById( this.props.hiddenFieldImageId );
		this.state = {
			imageUrl: this.getInitialValue(),
			imageId: this.getInitialId(),
			warnings: [],
		};

		this.setMyImageUrl = this.setMyImageUrl.bind( this );
		this.setMyImageId = this.setMyImageId.bind( this );
		this.onClick = this.onClick.bind( this );
		this.removeImage = this.removeImage.bind( this );
		this.setWarnings = this.setWarnings.bind( this );
	}

	/**
	 * Gets the initial value from the hidden input field.
	 *
	 * @returns {string} The image url.
	 */
	getInitialValue() {
		return this.hiddenField.value;
	}

	/**
	 * Gets the initial value from the hidden input field for the image id, if it exists.
	 *
	 * @returns {string} The image id.
	 */
	getInitialId() {
		if ( this.hiddenFieldImageId !== null ) {
			return this.hiddenFieldImageId.value;
		}
	}

	/**
	 * Handles change event for the image select.
	 *
	 * First updates its internal state and then updates the hidden input for the image.
	 *
	 * @param {string} imageUrl The image url.
	 *
	 * @returns {void}
	 */
	setMyImageUrl( imageUrl ) {
		this.setState( { imageUrl }, () => {
			this.hiddenField.value = imageUrl;
		} );
	}

	/**
	 * Handles change event for the image select.
	 *
	 * First updates its internal state and then updates the hidden input for the image id.
	 *
	 * @param {string} imageId The image id.
	 *
	 * @returns {void}
	 */
	setMyImageId( imageId ) {
		this.setState( { imageId }, () => {
			this.hiddenFieldImageId.value = imageId;
		} );
	}

	/**
	 * Function called when ImageSelect component button is clicked.
	 *
	 * @returns {void}
	 */
	onClick() {
		/**
		 * Callback function for selectMedia. Performs actions with the 'image' Object that it gets as an argument.
		 *
		 * @param {Object} image Object containing data about the selected image.
		 *
		 * @param {Function} onSelect Callback function received from openMedia. Gets object image' as an argument.
		 *
		 * @returns {void}
		 */
		const imageCallback = ( image ) => {
			if ( this.props.hasImageValidation ) {
				this.setWarnings( validateFacebookImage( image ) );
			}

			this.setMyImageUrl( image.url );
			if ( this.hiddenFieldImageId !== null ) {
				this.setMyImageId( image.id );
			}
		};
		openMedia( imageCallback );
	}

	/**
	 * Function called when 'remove image' button of ImageSelect component is clicked.
	 *
	 * @returns {void}
	 */
	removeImage() {
		const imageUrl = "";
		const imageId = "";
		this.setMyImageUrl( imageUrl );
		if ( this.hiddenFieldImageId !== null ) {
			this.setMyImageId( imageId );
		}
	}

	/**
	 * Sets the image warnings.
	 *
	 * @param {array} warnings The validation warnings.
	 *
	 * @returns {void} Void.
	 */
	setWarnings( warnings ) {
		this.setState( { warnings: warnings } );
	}

	/**
	 * Renders the ImageSelect component.
	 *
	 * @returns {wp.Element} The rendered component.
	 */
	render() {
		return (
			<ImageSelect
				label={ this.props.label }
				hasPreview={ this.props.hasPreview }
				imageUrl={ this.state.imageUrl }
				imageId={ this.state.imageId }
				onClick={ this.onClick }
				onRemoveImageClick={ this.removeImage }
				selectImageButtonId={ this.props.selectImageButtonId }
				replaceImageButtonId={ this.props.replaceImageButtonId }
				removeImageButtonId={ this.props.removeImageButtonId }
				hasNewBadge={ this.props.hasNewBadge }
				isDisabled={ this.props.isDisabled }
				hasPremiumBadge={ this.props.hasPremiumBadge }
				warnings={ this.state.warnings }
			/>
		);
	}
}

ImageSelectComponent.propTypes = {
	hiddenField: PropTypes.string.isRequired,
	hiddenFieldImageId: PropTypes.string,
	label: PropTypes.string,
	hasPreview: PropTypes.bool,
	selectImageButtonId: PropTypes.string,
	replaceImageButtonId: PropTypes.string,
	removeImageButtonId: PropTypes.string,
	hasNewBadge: PropTypes.bool,
	isDisabled: PropTypes.bool,
	hasPremiumBadge: PropTypes.bool,
	hasImageValidation: PropTypes.bool,
};

ImageSelectComponent.defaultProps = {
	hiddenFieldImageId: "",
	label: "",
	hasPreview: true,
	selectImageButtonId: "",
	replaceImageButtonId: "",
	removeImageButtonId: "",
	hasNewBadge: false,
	isDisabled: false,
	hasPremiumBadge: false,
	hasImageValidation: false,
};

export default ImageSelectComponent;
