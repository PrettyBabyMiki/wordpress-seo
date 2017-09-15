import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";
import { rgba } from "../../../../style-guide/helpers";

/**
 * Returns a component with a Yoast button-like style.
 *
 * The styles provided here are meant to be applied to both button and link
 * elements that need to look like styled buttons.
 *
 * @param {ReactElement} component The original component.
 *
 * @returns {ReactElement} Component with applied button styles.
 */
export function addButtonStyles( component ) {
	return styled( component )`
		display: inline-flex;
		align-items: center;
		justify-content: center;
		vertical-align: middle;
		height: 48px;
		margin: 0;
		padding: 0 16px;
		border: 0;
		border-radius: 4px;
		box-sizing: border-box;
		font: 400 14px/24px "Open Sans", sans-serif;
		text-transform: uppercase;
		box-shadow: 0 2px 8px 0 ${ rgba( colors.$color_black, 0.3 ) };
		transition: box-shadow 150ms ease-out;

		&:hover,
		&:focus {
			box-shadow:
				0 4px 10px 0 ${ rgba( colors.$color_black, 0.2 ) },
				inset 0 0 0 100px ${ rgba( colors.$color_black, 0.1 ) };
		}

		&:active {
			transform: translateY( 1px );
			box-shadow: none;
		}

		// Only needed for Safari 10.
		span {
			display: inherit;
			align-items: inherit;
			justify-content: inherit;
			width: 100%;
		}
	`;
}

/**
 * Returns a component with a button and an inner span element.
 *
 * The inner span is only needed to fix a Safari 10 bug with flexbox and button
 * elements. This bug is fixed in Safari Technology Previs and in the future it
 * will be possible to remove this component and directly style a button element.
 * See https://github.com/philipwalton/flexbugs#9-some-html-elements-cant-be-flex-containers
 *
 * @returns {ReactElement} The button with inner span.
 */
const YoastButtonBase = ( { className, onClick, type, children } ) => (
	<button className={ className } onClick={ onClick } type={ type }>
		<span>
			{ children }
		</span>
	</button>
);

YoastButtonBase.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	type: PropTypes.string,
	children: PropTypes.string,
};

YoastButtonBase.defaultProps = {
	type: "button",
};

/**
 * Returns a Button with the Yoast button style.
 *
 * We're styling the YoastButtonBase component just because of the Safari 10 bug.
 * In the future, it will be possible to directly style a button element.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled button.
 */
export const YoastButton = addButtonStyles(
	styled( YoastButtonBase )`
		color: ${ props => props.textColor };
		background: ${ props => props.backgroundColor };
		min-width: 152px;
		${ props => props.withTextShadow ? `text-shadow: 0 0 2px ${ colors.$color_black }` : "" };
		overflow: visible;
		cursor: pointer;

		&::-moz-focus-inner {
			border-width: 0;
		}
	`
);

YoastButton.propTypes = {
	backgroundColor: PropTypes.string,
	textColor: PropTypes.string,
	withTextShadow: PropTypes.bool,
};

YoastButton.defaultProps = {
	backgroundColor: colors.$color_green_medium_light,
	textColor: colors.$color_white,
	withTextShadow: true,
};
