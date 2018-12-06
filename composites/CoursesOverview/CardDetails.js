import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { __ } from "@wordpress/i18n";
import colors from "../../style-guide/colors.json";
import { makeOutboundLink } from "../../utils/makeOutboundLink";

const CardLinkButton = styled.a`
	align-items: center;
	justify-content: center;
	vertical-align: middle;
	cursor: pointer;
	color: ${ colors.$color_black };
	white-space: nowrap;
	display: block;
	border-radius: 4px;
	background-color: ${ colors.$color_button_upsell };
	padding: 12px 16px;
	box-shadow: inset 0 -4px 0 rgba(0, 0, 0, 0.2);
	border: none;
	text-decoration: none;
	font-weight: bold;
	font-size: inherit;
	margin-top: 0px;
	margin-bottom: 8px;

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

const CardInfoLink = styled.a`
	margin-top: 18px;
	padding: 12px 16px;
	font-weight: bold;
`;

const OutboundLinkButton = makeOutboundLink( CardLinkButton );
const OutboundInfoLink = makeOutboundLink( CardInfoLink );

const ActionBlock = styled.div`
	text-align: center;
`;

const Header = styled.a`
	padding: 0;
	margin: 0;
	margin-bottom: 15px;

	color: ${ colors.$color_pink_dark };
	font-weight: 400;
	font-size: 1.5em;
	text-decoration: none;
`;

const Details = styled.div`
	margin-top: 4px;
	margin-bottom: 12px;
	border-bottom: 1px ${ colors.$color_grey } solid;
	flex-grow: 1;
`;

const CourseFeatureList = styled.div`
	li{
		&:before {
			content: " x ";
			background-repeat: no-repeat;

			background-size: contain;
			width: 1em;
			height: 100%;
			background-position: left 0.4em;
		}
	}
`;

/**
 * @summary CardDetails component.
 *
 * @returns {Component} The rendered CardDetails component.
 */
class CardDetails extends React.Component {
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
					<p></p>
					<CourseFeatureList
						dangerouslySetInnerHTML={{ __html: this.props.description } }
					>
					</CourseFeatureList>
				</Details>
				<ActionBlock>
					<OutboundLinkButton href={ this.props.shopUrl }>
						{
							__( "Get the full course", "wordpress-seo" )
						}
					</OutboundLinkButton>
					<OutboundInfoLink href={ this.props.courseUrl }>
						{
							__( "Read more about this course", "wordpress-seo" )
						}
					</OutboundInfoLink>

				</ActionBlock>
			</Fragment>
		);
	}
}

export default CardDetails;

CardDetails.propTypes = {
	title: PropTypes.string,
	description: PropTypes.string,
	courseUrl: PropTypes.string,
	shopUrl: PropTypes.string,
};

CardDetails.defaultProps = {
	title: null,
	description: null,
	courseUrl: null,
	shopUrl: null,
};
