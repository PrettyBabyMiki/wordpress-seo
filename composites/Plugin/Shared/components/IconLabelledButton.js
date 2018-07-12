import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import flow from "lodash/flow";
import omit from "lodash/omit";

import colors from "../../../../style-guide/colors.json";
import SvgIcon from "./SvgIcon";
// Note: the order of these imports matters for the styles order in the markup.
import { addActiveStyle, addFocusStyle, addHoverStyle } from "./Button";

/**
 * Returns a component with all button selector styles applied.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied styles.
 */
const addButtonStyles = flow( [
	/*
	 * Styled-components applies the generated CSS classes in a reversed order,
	 * but we want them in the order: base - hover - focus - active.
	 */
	addActiveStyle,
	addFocusStyle,
	addHoverStyle,
] );

/**
 * Returns a basic styled button.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
const IconLabelledBaseButton = addButtonStyles(
	styled.button`
		display: inline-flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		cursor: pointer;
		box-sizing: border-box;
		border: 1px solid transparent;
		margin: 0;
		padding: 8px;
		overflow: visible;
		font-family: inherit;
		font-weight: inherit;
		color: ${ props => props.textColor };
		background: ${ props => props.backgroundColor };
		font-size: ${ props => props.textFontSize };

		svg {
			margin: 0 0 8px;
			flex-shrink: 0;
			fill: currentColor;
			// Safari 10
			align-self: center;
		}

		&:active {
			box-shadow: none;
		}
	`
);

/**
 * Returns an icon button that can optionally contain text.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled icon button.
 */
const IconLabelledButton = ( props ) => {
	const { children, icon, textColor } = props;

	const newProps = omit( props, "icon" );

	return (
		<IconLabelledBaseButton { ...newProps }>
			<SvgIcon icon={ icon } color={ textColor } />
			{ children }
		</IconLabelledBaseButton>
	);
};

IconLabelledButton.propTypes = {
	type: PropTypes.string,
	icon: PropTypes.string.isRequired,
	textColor: PropTypes.string,
	textFontSize: PropTypes.string,
	backgroundColor: PropTypes.string,
	borderColor: PropTypes.string,
	hoverColor: PropTypes.string,
	hoverBackgroundColor: PropTypes.string,
	hoverBorderColor: PropTypes.string,
	activeColor: PropTypes.string,
	activeBackgroundColor: PropTypes.string,
	activeBorderColor: PropTypes.string,
	focusColor: PropTypes.string,
	focusBackgroundColor: PropTypes.string,
	focusBorderColor: PropTypes.string,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
		PropTypes.string,
	] ).isRequired,
};

IconLabelledButton.defaultProps = {
	type: "button",
	textColor: colors.$color_blue,
	textFontSize: "inherit",
	backgroundColor: "transparent",
	borderColor: "transparent",
	hoverColor: colors.$color_white,
	hoverBackgroundColor: colors.$color_blue,
	hoverBorderColor: null,
	activeColor: colors.$color_white,
	activeBackgroundColor: colors.$color_blue,
	activeBorderColor: null,
	focusColor: colors.$color_white,
	focusBackgroundColor: colors.$color_blue,
	focusBorderColor: colors.$color_blue,
};

export default IconLabelledButton;
