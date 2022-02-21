/* eslint-disable no-undefined */
import { Switch } from "@headlessui/react";
import classNames from "classnames";
import PropTypes from "prop-types";
import Label from "../../elements/label";
import Toggle from "../../elements/toggle";

/**
 * @param {JSX.node} children Children are rendered below the checkbox group.
 * @param {JSX.node} label Label.
 * @param {boolean} [checked] Default state.
 * @param {Function} onChange Change callback.
 * @param {{ value, label }[]} options Options to choose from.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} ToggleField component.
 */
const ToggleField = ( {
	children,
	label,
	checked,
	onChange,
	className,
	...props
} ) => (
	<Switch.Group as="div" className={ classNames( "yst-toggle-field", className ) }>
		{ ( label || children ) && (
			<div className="yst-toggle-field__text">
				{ label && <Label as={ Switch.Label } className="yst-toggle-field__label">{ label }</Label> }
				{ children && <Switch.Description className="yst-toggle-field__description">{ children }</Switch.Description> }
			</div>
		) }
		<Toggle
			checked={ checked }
			onChange={ onChange }
			{ ...props }
		/>
	</Switch.Group>
);

ToggleField.propTypes = {
	children: PropTypes.node,
	label: PropTypes.node,
	checked: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
	className: PropTypes.string,
};

ToggleField.defaultProps = {
	children: null,
	label: null,
	className: "",
};

export default ToggleField;
