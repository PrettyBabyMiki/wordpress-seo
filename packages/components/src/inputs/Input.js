import React from "react";
import PropTypes from "prop-types";
import FieldGroup, { FieldGroupDefaultProps, FieldGroupProps } from "../field-group/FieldGroup";

// Import the required CSS.
import "./input.css";

/**
 * Renders a input field of type text for use in our forms.
 *
 * @param props The props required for rendering the component.
 *
 * @return {React.Component} Component that can be used inside a form.
 */
export const TextInput = ( props ) => {
	return (
		<FieldGroup { ...props } >
			<input
				type="text"
				value={ props.value }
				className="yoast-field-group__inputfield"
				name={ props.name }
				id={ props.id }
				aria-describedby={ props.ariaDescribedBy }
				placeholder={ props.placeholder }
			/>
		</FieldGroup>
	);
};

TextInput.propTypes = {
	id: PropTypes.string,
	name: PropTypes.name,
	value: PropTypes.string,
	ariaDescribedBy: PropTypes.string,
	placeholder: PropTypes.string,
	...FieldGroupProps,
};

TextInput.defaultProps = {
	// Generate a unique string of length 8.
	id: ( +new Date ).toString( 36 ).slice( -8 ),
	name: "",
	value: "",
	ariaDescribedBy: "",
	placeholder: "",
	...FieldGroupDefaultProps,
};
