import React from "react";

/**
 * Represents the progress HTML tag.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the progress HTML element based on the passed this.props.
 * @constructor
 */
class Progressbar extends React.Component {
	constructor( props ) {
		super( props );
	}

	/**
	 * Creates a fallback progress bar based on a div.
	 *
	 * @param {number} value The current value to be displayed.
	 * @param {number} max The maximum value allowed to be reached.
	 * @returns {JSX.Element} The rendered fallback progress bar.
	 */
	fallback( value, max ) {
		let progress = ( value / max ) * 100;

		this.props.optionalAttributes.className = this.props.optionalAttributes.className + "--fallback";

		return (
			<div {...this.props.optionalAttributes} style={ { width: progress + "%" } }></div>
		);
	}

	/**
	 * Renders the progress bar component.
	 * Has a fallback for browersers that don't support the <progress> element.
	 *
	 * @returns {JSX.Element} The rendered progress bar.
	 */
	render() {
		if ( typeof document.createElement( "progress" ) === "undefined" || this.props.forceFallback ) {
			return this.fallback( this.props.value, this.props.max );
		}

		return (
			<progress name={this.props.name}
					  value={this.props.value}
					  min={this.props.min}
					  max={this.props.max}
					  {...this.props.optionalAttributes}
			/>
		);
	}
}

/**
 * Adds validation for the properties.
 *
 * @type {{min: number, max: number, value: number, optionalAttributes:object}}
 */
Progressbar.propTypes = {
	value: React.PropTypes.number.isRequired,

	name: React.PropTypes.string,
	onChange: React.PropTypes.func,
	min: React.PropTypes.number,
	max: React.PropTypes.number,
	forceFallback: React.PropTypes.bool,
	optionalAttributes: React.PropTypes.shape( {
		className: React.PropTypes.string,
	} ),
};

/**
 * Defines the default values for the properties.
 *
 * @type {{min: number, max: number, value: number}}
 */
Progressbar.defaultProps = {
	min: 0,
	max: 1,
	className: "",
	optionalAttributes: {
		className: "",
	},
};

export default Progressbar;
