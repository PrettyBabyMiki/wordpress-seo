import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";

import { colors, utils } from "yoast-components";

const CardLinkButton = styled.a`
	align-items: center;
	justify-content: center;
	vertical-align: middle;
	cursor: pointer;
	color: ${ colors.$color_black };
	white-space: nowrap;
	display: inline-flex;
	border-radius: 4px;
	background-color: ${ colors.$color_button_upsell };
	padding: 12px 16px;
	box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.2);
	border: none;
	text-decoration: none;
	font-weight: bold;
	font-size: inherit;
	width: 85%;
	margin-top: 24px;


	&:hover,
	&:focus,
	&:active {
		color: ${ colors.$color_black };
		background: ${ colors.$color_button_upsell_hover };
	}

	:active {
		position: relative;
		top: 2px;
		background-color: ${ colors.$color_button_hover_upsell };
		box-shadow: none;
		filter: none;
	}
`;

const MoreInfoLink = styled.a`
	padding: 12px 16px;
	font-weight: bold;
	font-size: 0.9rem;
    line-height: 1.5;
`

const OutboundLinkButton = utils.makeOutboundLink( CardLinkButton );
const OutboundMoreInfoLink = utils.makeOutboundLink( MoreInfoLink );

const ActionBlock = styled.div`
	text-align: center;
`;

const Header = styled.a`
	padding: 0;
	margin: 0;
	margin-bottom: 15px;

	color: ${ colors.$color_pink_dark };
	font-weight: 300;
	font-size: 1.5em;
	text-decoration: none;
`;

const Details = styled.div`
	margin-bottom:24px;
	border-bottom: 1px ${ colors.$color_grey } solid;
	flex-grow: 1;
`;

class CourseDetails extends React.Component {
	/**
	 * Sets the CourseCard object.
	 *
	 * @returns {void}
	 */
	constructor() {
		super();
	}

	/**
	 * Renders the component.
	 *
	 * @returns {ReactElement} The rendered component.
	 */
	render() {
		return (
			<Fragment>
				<Details>
					<Header href={ this.props.courseUrl }>{ this.props.title }</Header>
					<p>{ this.props.description }</p>
				</Details>
				<ActionBlock>
					<OutboundMoreInfoLink href={ this.props.courseUrl }>
						{
							__( "Read more about this course", "wordpress-seo" )
						}
					</OutboundMoreInfoLink>
					<OutboundLinkButton href={ this.props.courseUrl }>
						{
							__( "Get the full course", "wordpress-seo" )
						}
					</OutboundLinkButton>
				</ActionBlock>
			</Fragment>
		);
	}
}

export default CourseDetails;