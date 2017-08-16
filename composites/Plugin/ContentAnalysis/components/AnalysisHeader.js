import PropTypes from "prop-types";
import React from "react";
import styled from "styled-components";
import { angleUp, angledown } from "../../../../style-guide/svg";
import colors from "../../../../style-guide/colors.json";
import defaults from "../../../../config/defaults.json";
import { Icon } from "../../Shared/components/Icon";

const AnalysisHeaderContainer = styled.div`
	margin-top: 20px;
	background-color: ${ colors.$color_white };
`;

const AnalysisHeader = styled.button`
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	background-color: ${ colors.$color_white };
	padding: 0;
	border: none;
	text-align: left;
	font-weight: 300;
	cursor: pointer;
	// When clicking, the button text disappears in Safari 10 because of color: activebuttontext.
	color: ${ colors.$color_blue };
	@media screen and ( max-width: ${ defaults.css.breakpoint.tablet }px ) {
		padding: 16px 24px;
	}
	@media screen and ( max-width: ${ defaults.css.breakpoint.mobile }px ) {
		padding: 16px;
	}
	svg {
		flex: 0 0 40px;
		// Compensate the SVGIcon width-viewbox size.
		margin-right: -10px;
		// Add some spacing between icon and text.
		margin-left: 10px;
		// Compensate the height difference with a line of text (32px).
		margin-top: -4px;
		margin-bottom: -4px;
		// Looks like Safari 10 doesn't like align-items: center for SVGs and needs some help.
		align-self: flex-start;
		
		@media screen and ( max-width: ${ defaults.css.breakpoint.tablet }px ) {
		margin-top: 4px;
		margin-bottom: 4px;
		margin-right: -2px;
		}
	}
`;

const AnalysisTitle = styled.span`
	flex: 1 1 auto;
	font-size: 1.5em;
	// Chrome needs 8 decimals to make this 32px without roundings.
	line-height: 1.33333333;
	// Looks like Safari 10 doesn't like align-items: center for SVGs and needs some help.
	align-self: center;
`;

export default class ListToggle extends React.Component {
	/**
	 * The constructor.
	 *
	 * @constructor
	 *
	 * @param {Object} props The props to use.
	 */
	constructor( props ) {
		super( props );

		this.state = {
			isOpen: this.props.isOpen,
		};

		//this.toggleOpen = this.toggleOpen.bind( this );
	}

	/**
	 * Returns whether the list is collapsed.
	 *
	 * @returns {Boolean} True when the list is collapsed.
	 */
	isOpen() {
		return this.state.isOpen;
	}

	/**
	 * Toggles whether the list is collapsed.
	 *
	 * @returns {void}
	 */
	toggleOpen() {
		this.setState( {
			isOpen: ! this.state.isOpen,
		} );
	}

	/**
	 * Gets the correct arrow based on whether the list is collapsed or not.
	 *
	 * @returns {ReactElement} The upArrow when the header is collapsed, otherwise the downArrow.
	 */
	getArrow() {
		let upArrow = <Icon icon={ angleUp } iconColor= { colors.$color_grey_dark } iconSize="20px" />;
		let downArrow = <Icon icon={ angledown } iconColor= { colors.$color_grey_dark } iconSize="20px" />;

		return this.isOpen() ? upArrow : downArrow;
	}

	/**
	 * Returns the rendered ListToggle element.
	 *
	 * @returns {ReactElement} The rendered ListToggle element.
	 */
	render() {
		let children = null;

		if ( this.state.isOpen ) {
			children = this.props.children;
		}

		return (
			<AnalysisHeaderContainer>
				<div id="accordionGroup" role="presentation" className="Accordion">
					<h3 role="heading" aria-level="3">
						<AnalysisHeader aria-expanded={ this.isOpen() } className="Accordion-trigger"
										aria-controls="sect1" id="accordion1id" onClick={ () => { this.toggleOpen() } } >
							{ this.getArrow() }
							<AnalysisTitle className="Accordion-title">{ this.props.title }</AnalysisTitle>
						</AnalysisHeader>
					</h3>
				</div>
				{ children }
			</AnalysisHeaderContainer>
		);
	}
}

ListToggle.propTypes = {
	title: PropTypes.string.isRequired,
	isOpen: PropTypes.bool,
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ),
};

ListToggle.defaultProps = {
	isOpen: false,
};


