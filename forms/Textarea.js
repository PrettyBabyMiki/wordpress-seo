import React from "react";

/**
 * Represents the textarea HTML element.
 *
 * @param {Object} props The properties to use.
 * @returns {JSX} A representation of the textarea HTML element based on the passed props.
 * @constructor
 */
class Textarea extends React.Component {
	render() {
		return (
			<textarea ref={this.setReference.bind( this )}
			          name={this.props.name}
			          value={this.props.value}
			          onChange={this.props.onChange}
			          {...this.props.optionalAttributes}></textarea>
		);
	}

	/**
	 * Sets a reference to the current component.
	 *
	 * @param {Object} ref The reference to set.
	 * @returns {void}
	 */
	setReference( ref ) {
		this.ref = ref;
	}

	/**
	 * Determines whether or not the component updated and sets its focus accordingly.
	 *
	 * @returns {void}
	 */
	componentDidUpdate() {
		if ( this.props.hasFocus ) {
			this.ref.focus();
		}
	}
}

/**
 * Adds validation for the properties.
 *
 * @type {{name: string, value: string, onChange:function, optionalAttributes: object}}
 */
Textarea.propTypes = {
	name: React.PropTypes.string.isRequired,

	value: React.PropTypes.string,
	onChange: React.PropTypes.func,
	optionalAttributes: React.PropTypes.object,
	hasFocus: React.PropTypes.bool,
};

/**
 * Defines the default values for the properties.
 *
 * @type {{name: string, value: string, optionalAttributes: object}}
 */
Textarea.defaultProps = {
	name: "textarea",
	value: "",
	hasFocus: false,
};

export default Textarea;
