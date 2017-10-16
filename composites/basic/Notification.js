import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { injectIntl, intlShape, defineMessages } from "react-intl";

import Paper from "./Paper";
import colors from "../../style-guide/colors.json";
import { Icon } from "../../composites/Plugin/Shared/components/Icon";
import { times } from "../../style-guide/svg";
import breakpoints from "../../style-guide/responsive-breakpoints.json";

const messages = defineMessages( {
	buttonAriaLabel: {
		id: "notification.buttonAriaLabel",
		defaultMessage: "Dismiss this notice",
	},
} );

const NotificationContainer = styled.div`
	display: flex;
	align-items: center;
	padding: 20px;

	h1, h2, h3, h4, h5, h6 {
		font-size: 1.4em;
		line-height: 1;
		margin: 0 0 4px 0;

		@media screen and ( max-width: ${ breakpoints.mobile } ) {
			${ props => props.isDismissable ? "margin-right: 30px;" : "" }
		}
	}

	p:last-child {
		margin: 0;
	}

	@media screen and ( max-width: ${ breakpoints.mobile } ) {
		display: block;
		position: relative;
	}
`;

const NotificationImage = styled.img`
	flex: 0 0 ${ props => props.imageWidth ? props.imageWidth : "auto" };
	height: ${ props => props.imageHeight ? props.imageHeight : "auto" };
	margin-right: 18px;

	@media screen and ( max-width: ${ breakpoints.mobile } ) {
		display: none;
	}
`;

const NotificationContent = styled.div`
	flex: 1 1 auto;
`;

const DismissButton = styled.button`
	flex: 0 0 40px;
	height: 40px;
	border: 0;
	margin: 0 0 0 10px;
	padding: 0;
	background: transparent;
	cursor: pointer;

	@media screen and ( max-width: ${ breakpoints.mobile } ) {
		width: 40px;
		position: absolute;
		top: 10px;
		right: 10px;
		margin: 0;
	}
`;

const StyledIcon = styled( Icon )`
	vertical-align: middle;
`;

/**
 * Returns a Notification wrapped in a styled Paper.
 *
 * @param {object} props Component props.
 *
 * @returns {ReactElement} Styled notification.
 */
function Notification( props ) {
	const Heading = `${ props.headingLevel }`;

	return <Paper>
		<NotificationContainer isDismissable={ props.isDismissable }>
			{ props.imageSrc && <NotificationImage
				src={ props.imageSrc }
				imageWidth={ props.imageWidth }
				imageHeight={ props.imageHeight }
				alt=""
			/> }
			<NotificationContent>
				<Heading>{ props.title }</Heading>
				<p className="prova" dangerouslySetInnerHTML={ { __html: props.html } }/>
			</NotificationContent>
			{ props.isDismissable && <DismissButton
				onClick={ props.onClick }
				type="button"
				aria-label={ props.intl.formatMessage( messages.buttonAriaLabel ) }
			>
				<StyledIcon icon={ times } color={ colors.$color_grey_text } size="24px" />
			</DismissButton> }
		</NotificationContainer>
	</Paper>;
}

Notification.propTypes = {
	intl: intlShape.isRequired,
	imageSrc: PropTypes.string,
	imageWidth: PropTypes.string,
	imageHeight: PropTypes.string,
	title: PropTypes.string,
	html: PropTypes.string,
	isDismissable: PropTypes.bool,
	onClick: PropTypes.func,
	headingLevel: PropTypes.string,
};

Notification.defaultProps = {
	isDismissable: false,
	headingLevel: "h3",
};

export default injectIntl( Notification );
