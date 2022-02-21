/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";
import { useCallback } from "@wordpress/element";

import Radio from "../../elements/radio";
import Label from "../../elements/label";

const classNameMap = {
	variant: {
		"default": "",
		"inline-block": "yst-radio-group--inline-block",
	},
};

/**
 * @param {JSX.node} children Children are rendered below the radio group.
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} value Value.
 * @param {JSX.node} [label] Label.
 * @param {{ value, label, checked }[]} options Options to choose from.
 * @param {Function} onChange Change handler.
 * @param {string} [variant] Variant.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} RadioGroup component.
 */
const RadioGroup = ( {
	children,
	id,
	name,
	value,
	label,
	options,
	onChange,
	variant,
	className,
	...props
} ) => {
	const handleChange = useCallback( ( { target } ) => target.checked && onChange( target.value ), [ onChange ] );

	return (
		<div
			className={ classNames(
				"yst-radio-group",
				classNameMap.variant[ variant ],
				className,
			) }
		>
			{ label && <Label className="yst-radio-group__label">{ label }</Label> }
			<div className="yst-radio-group__options">
				{ options.map( ( item, index ) => {
					const itemId = `${ id }-${ index }`;
					return <Radio
						key={ itemId }
						id={ itemId }
						name={ name }
						value={ item.value }
						variant={ variant }
						checked={ value === item.value }
						onChange={ handleChange }
						{ ...props }
					>
						{ item.label }
					</Radio>;
				} ) }
			</div>
			{ children && <div className="yst-radio-group__description">{ children }</div> }
		</div>
	);
};

RadioGroup.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.node,
	options: PropTypes.arrayOf( PropTypes.shape( {
		value: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		checked: PropTypes.bool,
	} ) ).isRequired,
	onChange: PropTypes.func.isRequired,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	className: PropTypes.string,
};

RadioGroup.defaultProps = {
	children: null,
	label: null,
	variant: "default",
	className: "",
};

export default RadioGroup;
