import React from "react";
import styled from "styled-components";
import _flow from "lodash/flow";
import PropTypes from "prop-types";

import { rgba } from "../../../style-guide/helpers";
import colors from "../../../style-guide/colors.json";
import { Icon } from "./Icon";

/**
 * Returns a component with applied focus styles.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied focus styles.
 */
export function addFocusStyle( component ) {
	return styled( component )`
		&::-moz-focus-inner {
			border-width: 0;
		}

		&:focus {
			outline: none;
			border-color: ${ colors.$color_blue };
			background-color: ${ colors.$color_white };
			box-shadow: 0 0 3px ${ rgba( colors.$color_blue_dark, .8 ) };
		}
	`;
}

/**
 * Returns a component with applied hover styles.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied hover styles.
 */
export function addHoverStyle( component ) {
	return styled( component )`
		&:hover {
			background: ${ colors.$color_button_hover };
			border-color: ${ colors.$color_button_border_hover };
			color: ${ colors.$color_button_text_hover };
		}
	`;
}

/**
 * Returns a component with applied active styles.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied active styles.
 */
export function addActiveStyle( component ) {
	return styled( component )`
		&:active {
			background: ${ colors.$color_button };
			border-color: ${ colors.$color_button_border_hover };
			box-shadow: inset 0 2px 5px -3px ${ rgba( colors.$color_button_border_active, 0.5 ) };
		}
	`;
}

/**
 * Returns a component with all button selector styles applied.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied styles.
 */
export const addButtonStyles = _flow( [ addFocusStyle, addHoverStyle, addActiveStyle ] );

/**
 * Returns a basic styled button.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const BaseButton = addButtonStyles(
	styled.button`
		color: ${ colors.$color_button_text };
		border: 1px solid ${ colors.$color_button_border };
		background: ${ colors.$color_button };
		box-shadow: 0 1px 0 ${ rgba( colors.$color_button_border, 1 ) };
		vertical-align: top;
		float: left;
		display: inline-block;
		text-decoration: none;
		padding: 6px 10px 5px;
		border-radius: 3px;
		cursor: pointer;
		box-sizing: border-box;
		font-size: inherit;
		font-family: inherit;
		font-weight: inherit;
		outline: none;
		min-height: 33px;
	`
);

BaseButton.defaultProps = {
	type: "button",
};

/**
 * Returns a button styled for the SnippetPreview.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const SnippetPreviewButton = styled( BaseButton )`
	line-height: 15px;
	font-size: 0.8rem;
	
	> span {
		margin-left: 8px;
	}
`;

/**
 * Returns an icon button that can optionally contain text.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled icon button.
 */
export const IconButton = ( props ) => {
	const { children, icon, iconColor } = props;
	return (
		<SnippetPreviewButton { ...props } >
			<Icon icon={ icon } color={ iconColor } />
			{ children ? <span>{ children }</span> : null }
		</SnippetPreviewButton>
	);
};

IconButton.propTypes = {
	icon: PropTypes.string,
	iconColor: PropTypes.string,
	children: PropTypes.string,
};

IconButton.defaultProps = {
	icon: "edit",
};
