// External dependencies
import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { CSSTransition } from "react-transition-group";

// Internal dependencies
import { getHeight } from "./dom";

const YoastSlideToggleContainer = styled.div`
	& > :first-child {
		overflow: hidden;
	}

	& .slide-enter-active,
	& .slide-exit-active {
		transition: height ${ props => `${ props.timeout }ms` } ease-out;
	}
`;

/**
 * Returns the YoastSlideToggle component.
 *
 * This component wraps a single React child and adds a "slideToggle" animation.
 * It uses http://reactcommunity.org/react-transition-group/css-transition which
 * already provides the callbacks we need. For more details, see
 * https://reactjs.org/docs/animation.html
 *
 * @param {Object} props Component props.
 *
 * @returns {ReactElement} YoastSlideToggle component.
 */
export class YoastSlideToggle extends React.Component {
	/**
	 * Sets the animated element height to 0.
	 *
	 * We need to set the element height to 0 when it's first rendered and at the
	 * next tick after the closing animation has started, .i.e. onEnter and onExiting.
	 *
	 * @param {HTMLElement} element The element to set the height to.
	 * @returns {void}
	 */
	resetHeight( element ) {
		element.style.height = "0";
	}

	/**
	 * Sets the animated element height to its actual height in pixels.
	 *
	 * We need to set the height in pixels at the next animation tick after the
	 * element is initially rendered and again when the closing animation begins,
	 * i.e. onEntering and onExit.
	 *
	 * @param {HTMLElement} element The element to set the height to.
	 * @returns {void}
	 */
	setHeight( element ) {
		const height = getHeight( element );
		element.style.height = height + "px";
	}

	/**
	 * Removes the animated element height.
	 *
	 * This step occurs at the end of the expanding animation, i.e. onEntered.
	 *
	 * @param {HTMLElement} element The element to set the height to.
	 * @returns {void}
	 */
	removeHeight( element ) {
		element.style.height = null;
	}

	/**
	 * Renders the YoastSlideToggle wrapper.
	 *
	 * @returns {ReactElement} The rendered YoastSlideToggle wrapper.
	 */
	render() {
		return (
			<YoastSlideToggleContainer timeout={ this.props.timeout }>
				<CSSTransition
					in={ this.props.toggleFlag }
					timeout={ this.props.timeout }
					classNames="slide"
					unmountOnExit
					onEnter={ this.resetHeight }
					onEntering={ this.setHeight }
					onEntered={ this.removeHeight }
					onExit={ this.setHeight }
					onExiting={ this.resetHeight }
				>
					{ this.props.children }
				</CSSTransition>
			</YoastSlideToggleContainer>
		);
	}
}

YoastSlideToggle.propTypes = {
	toggleFlag: PropTypes.bool.isRequired,
	timeout: PropTypes.number.isRequired,
	children: PropTypes.node,
};

YoastSlideToggle.defaultProps = {
	timeout: 300,
};
