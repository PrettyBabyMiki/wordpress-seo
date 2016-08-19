import React from "react";
import Input from '../../../forms/Input';
import Label from '../../../forms/Label';

/**
 * Represents a choice interface, like a group of radio buttons or a select button. Initially it should render a
 * group of radio buttons. We might add other representations later on.
 *
 * @param {Object} props The properties.
 * @returns {JSX} The choice component.
 * @constructor
 */
const Choice = ( props ) => {
	let choices = props.properties.choices;
	let fieldKeys = Object.keys( choices );
	let fieldName = props.name;

	return (
		<div>
			<p className="yoast-wizard-field-description">{props.properties.label}</p>
			<fieldset className={"yoast-wizard-input-" + fieldName}>
				{fieldKeys.map( ( choiceName, index ) => {
					let choice = choices[ choiceName ];
					let id = `${choiceName} - ${index}`;
					// If the value for the choice field equals the name for this choice, the choice is checked.
					let checked = (props.value === choiceName);

					return (
						<div key={index}>
							<Input name={fieldName} type="radio" label={choice.label} onChange={props.onChange}
							       value={choiceName} optionalAttributes={{
								id,
								checked
							}}/>
							<Label for={id}>{choice.label}</Label>
						</div>
					);
				} )}
			</fieldset>
		</div>
	);
};

Choice.propTypes = {
	component: React.PropTypes.string,
	value: React.PropTypes.string,
	properties: React.PropTypes.object,
	"default": React.PropTypes.string,
	name: React.PropTypes.string.isRequired,
	onChange: React.PropTypes.func,
};

Choice.defaultProps = {
	component: "",
	value: "",
	properties: {
		label: "",
		choices: {},
	},
	"default": "",
};

export default Choice;
