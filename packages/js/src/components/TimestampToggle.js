import {Component} from '@wordpress/element';
import PropTypes from "prop-types";
import styled from "styled-components";
import {Toggle, SvgIcon, SimulatedLabel} from '@yoast/components';
import { __ } from "@wordpress/i18n";
import popupWindow from '../helpers/popupWindow';
import {AuthenticationModal} from './modals/wordproof/AuthenticationModal';


const Timestamp = styled.div`
	display: flex;
	margin-top: 8px;
`;

function HelpIcon(props) {
	return (
		<span className={'yoast-help'} onClick={ props.openAuthentication }>
			<span className={'yoast-help__icon'}>
				<SvgIcon className={'yoast-help'}
						 icon={'question-circle'}/>
			</span>
		</span>
	);
}

function SettingsLink(props) {
	const data = window.wpseoWordProof.data || {};

	if (!props.isAuthenticated)
		return( "" );

	return (
		<a href={data.popup_redirect_settings_url} onClick={ (e) => { e.preventDefault() && props.openSettings()} }
		>{__( "Manage WordProof settings", "wordpress-seo" )}</a>
	);

}

function ToggleWrapper(props) {
	return(
		<div onClick={ () => { (!props.isAuthenticated) ? props.openAuthentication() : '' }}>
			{ props.children }
		</div>
	);
}

/**
 * The TimestampToggle Component.
 */
class TimestampToggle extends Component {
	constructor(props) {
		super(props);

		this.setIsOpen = this.setIsOpen.bind(this);
		this.setIsAuthenticated = this.setIsAuthenticated.bind(this);
		this.openSettings = this.openSettings.bind(this);
		this.openAuthentication = this.openAuthentication.bind(this);

		const data = window.wpseoWordProof.data || {};

		this.state = {
			isOpen: false,
			isAuthenticated: data.is_authenticated
		};
	}

	setIsOpen(bool) {
		this.setState({isOpen: bool})
	}

	setIsAuthenticated(bool) {
		this.setState({isAuthenticated: bool})
	}

	openSettings() {
		const data = window.wpseoWordProof.data || {};

		popupWindow( window, data.popup_redirect_settings_url )
	}

	openAuthentication() {
		const data = window.wpseoWordProof.data || {};

		if (this.state.isAuthenticated)
			this.openSettings();

		this.setIsOpen(true);
		popupWindow(window, data.popup_redirect_authentication_url);
	}

	/**
	 * Renders the TimestampToggle component.
	 *
	 * @returns {wp.Element} the CornerstoneToggle component.
	 */
	render() {
		return (
			<Timestamp>
				<div className={"yoast-field-group"}>
					<div className={"yoast-field-group__title"}>
						<SimulatedLabel
							htmlFor={ this.props.id }>
							{__( "Timestamp with WordProof", "wordpress-seo" )}
						</SimulatedLabel>
						<HelpIcon openAuthentication={ this.openAuthentication } />
					</div>
					<ToggleWrapper isAuthenticated={ this.state.isAuthenticated } openAuthentication={ this.openAuthentication }>
						<Toggle className={"yoast-field-group__radiobutton"}
							id={ this.props.id }
							labelText={ __( "Timestamp this page", "wordpress-seo" ) }
							isEnabled={ this.props.isEnabled }
							onSetToggleState={ this.props.onToggle }
						/>
					</ToggleWrapper>
					<SettingsLink isAuthenticated={ this.state.isAuthenticated } openSettings={ this.openSettings }/>
				</div>

				<AuthenticationModal isOpen={ this.state.isOpen } setIsOpen={ this.setIsOpen }
									 isAuthenticated={ this.state.isAuthenticated } setIsAuthenticated={ this.setIsAuthenticated }/>
			</Timestamp>
		);
	}
}

TimestampToggle.propTypes = {
	id: PropTypes.string,
	isEnabled: PropTypes.bool,
	onToggle: PropTypes.func
};

TimestampToggle.defaultProps = {
	id: "timestamp-toggle",
	isEnabled: true,
	onToggle: () => {}
};

export default TimestampToggle;
