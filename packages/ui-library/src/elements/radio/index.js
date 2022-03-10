/* eslint-disable no-undefined */
import classNames from "classnames";
import PropTypes from "prop-types";
import { CheckCircleIcon } from "@heroicons/react/solid";

import Label from "../label";

const classNameMap = {
	variant: {
		"default": "",
		"inline-block": "yst-radio--inline-block",
	},
};

/**
 * @param {string} id Identifier.
 * @param {string} name Name.
 * @param {string} value Value.
 * @param {JSX.node} label Label.
 * @param {string} [variant] Variant.
 * @param {string} [className] CSS class.
 * @returns {JSX.Element} Radio component.
 */
const Radio = ( {
	id,
	name,
	value,
	label,
	variant,
	className,
	...props
} ) => {
	if ( variant === "inline-block" ) {
		return (
			<div
				className={ classNames(
					"yst-radio",
					"yst-radio--inline-block",
					className,
				 ) }
			>
				<input
					type="radio"
					id={ id }
					name={ name }
					value={ value }
					className="yst-radio__input"
					{ ...props }
				/>
				<label htmlFor={ id } className="yst-radio__label">
					{ label }
					<CheckCircleIcon className="yst-radio__check" role="img" aria-hidden="true" />
				</label>
			</div>
		);
	}

	return (
		<div
			className={ classNames(
				"yst-radio",
				className,
			) }
		>
			<input
				type="radio"
				id={ id }
				name={ name }
				value={ value }
				className="yst-radio__input"
				{ ...props }
			/>
			{ label && <Label htmlFor={ id } className="yst-radio__label">{ label }</Label> }
		</div>
	);
};

Radio.propTypes = {
	name: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	label: PropTypes.node,
	variant: PropTypes.oneOf( Object.keys( classNameMap.variant ) ),
	className: PropTypes.string,
};

Radio.defaultProps = {
	label: null,
	variant: "default",
	className: "",
};

export default Radio;
