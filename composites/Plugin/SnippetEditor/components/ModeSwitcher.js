// External dependencies.
import React from "react";
import styled from "styled-components";

// Internal dependencies.
import { Button } from "../../Shared/components/Button";
import colors from "../../../../style-guide/colors";
import { MODE_DESKTOP, MODE_MOBILE, MODES } from "../../SnippetPreview/constants";
import FormattedScreenReaderMessage from "../../../../a11y/FormattedScreenReaderMessage";
import SvgIcon from "../../Shared/components/SvgIcon";
import PropTypes from "prop-types";

const SwitcherButton = Button.extend`
	border: none;
	border-bottom: 4px solid transparent;
	
	width: 31px;
	height: 31px;
	
	border-color: ${ ( props ) => props.isActive ? colors.$color_snippet_active : "transparent" };
	color: ${ colors.$color_snippet_active };
	
	transition: 0.15s color ease-in-out,0.15s background-color ease-in-out,0.15s border-color ease-in-out;
	transition-property: border-color;
	
	&:hover, &:focus {
		border: none;
		border-bottom: 4px solid transparent;
		border-color: ${ colors.$color_snippet_focus };
		color: ${ colors.$color_snippet_focus };
	}
`;

const MobileButton = SwitcherButton.extend`
	border-radius: 3px 0 0 3px;
`;

const DesktopButton = SwitcherButton.extend`
	border-radius: 0 3px 3px 0;
`;

const Switcher = styled.div`
	display: inline-block;
	margin-top: 10px;
	margin-left: 20px;
	border: 1px solid #dbdbdb;
	border-radius: 4px;
	background-color: #f7f7f7;
	vertical-align: top;
`;

const ModeSwitcher = ( props ) => {
	const { onChange, active } = props;

	return <Switcher>
		<MobileButton onClick={ () => onChange( MODE_MOBILE ) } isActive={ active === MODE_MOBILE }>
			<SvgIcon icon="mobile" size="22px" color="currentColor" />
			<FormattedScreenReaderMessage
				id="snippetEditor.desktopPreview"
				defaultMessage="Mobile preview"
			/>
		</MobileButton>

		<DesktopButton onClick={ () => onChange( MODE_DESKTOP ) } isActive={ active === MODE_DESKTOP }>
			<SvgIcon icon="desktop" size="18px" color="currentColor" />
			<FormattedScreenReaderMessage
				id="snippetEditor.desktopPreview"
				defaultMessage="Desktop preview"
			/>
		</DesktopButton>
	</Switcher>;
};

ModeSwitcher.propTypes = {
	onChange: PropTypes.func.isRequired,
	active: PropTypes.oneOf( MODES ),
};

export default ModeSwitcher;
