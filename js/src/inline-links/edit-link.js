import { map } from "lodash";
import PropTypes from "prop-types";
import { BlockControls, RichTextToolbarButton, RichTextShortcut } from "@wordpress/block-editor";
import { Toolbar, withSpokenMessages } from "@wordpress/components";
import { compose, ifCondition } from "@wordpress/compose";
import { select, withSelect, dispatch } from "@wordpress/data";
import { Component, Fragment } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import {
	getTextContent,
	applyFormat,
	removeFormat,
	slice,
	getActiveFormat } from "@wordpress/rich-text";
import { isURL } from "@wordpress/url";

/**
 * Internal dependencies
 */
import InlineLinkUI from "./inline";

const name = "yoast-seo/link";
const title = __( "Add Link", "wordpress-seo" );
const EMAIL_REGEXP = /^(mailto:)?[a-z0-9._%+-]+@[a-z0-9][a-z0-9.-]*\.[a-z]{2,63}$/i;

/**
 * The EditLink component.
 */
class EditLink extends Component {
	/**
	 * The constructor.
	 */
	constructor() {
		super( ...arguments );

		this.isEmail = this.isEmail.bind( this );
		this.addLink = this.addLink.bind( this );
		this.stopAddingLink = this.stopAddingLink.bind( this );
		this.onRemoveFormat = this.onRemoveFormat.bind( this );
		this.state = {
			addingLink: false,
		};
	}

	/**
	 * Hook to run when the component mounted.
	 *
	 * @returns {void}
	 */
	componentDidMount() {
		const oldFormat = select( "core/rich-text" ).getFormatType( "core/link" );
		if ( oldFormat ) {
			oldFormat.edit = null;
			dispatch( "core/rich-text" ).addFormatTypes( oldFormat );
		}
	}

	/**
	 * Checks if a string is a valid emailaddress.
	 *
	 * @param {string} email the emailstring.
	 * @returns {boolean} A truthy value.
	 */
	isEmail( email ) {
		return EMAIL_REGEXP.test( email );
	}

	/**
	 * Updates the state to reflect we're currently adding a link.
	 *
	 * @returns {void}
	 */
	addLink() {
		const { value, onChange } = this.props;
		const text = getTextContent( slice( value ) );

		if ( text && isURL( text ) ) {
			onChange( applyFormat( value, { type: name, attributes: { url: text } } ) );
		} else if ( text && this.isEmail( text ) ) {
			onChange( applyFormat( value, { type: name, attributes: { url: `mailto:${ text }` } } ) );
		} else {
			this.setState( { addingLink: true } );
		}
	}

	/**
	 * Updates the state to reflect we're no longer adding a link.
	 *
	 * @returns {void}
	 */
	stopAddingLink() {
		this.setState( { addingLink: false } );
	}

	/**
	 * Hook triggered when the format is removed.
	 *
	 * @returns {void}
	 */
	onRemoveFormat() {
		const { value, onChange, speak } = this.props;

		let newValue = value;

		map( [ "core/link", "yoast-seo/link" ], ( linkFormat ) => {
			newValue = removeFormat( newValue, linkFormat );
		} );

		onChange( { ...newValue } );
		speak( __( "Link removed.", "wordpress-seo" ), "assertive" );
	}

	/**
	 * Renders the block controls.
	 *
	 * @returns {wp.Element} The block controls component.
	 */
	render() {
		const { activeAttributes, onChange } = this.props;
		let { isActive, value } = this.props;

		const activeFormat = getActiveFormat( value, "core/link" );

		if ( activeFormat ) {
			activeFormat.type = name;

			let newValue = value;
			newValue = applyFormat( newValue, activeFormat );
			newValue = removeFormat( newValue, "core/link" );
			onChange( { ...newValue } );

			value = newValue;

			isActive = true;
		}

		return (
			<Fragment>
				<BlockControls>
					<Toolbar className="editorskit-components-toolbar">
						<RichTextShortcut
							type="primary"
							character="k"
							onUse={ this.addLink }
						/>
						<RichTextShortcut
							type="primaryShift"
							character="k"
							onUse={ this.onRemoveFormat }
						/>

						{ isActive && <RichTextToolbarButton
							name="link"
							icon="editor-unlink"
							title={ __( "Unlink", "wordpress-seo" ) }
							onClick={ this.onRemoveFormat }
							isActive={ isActive }
							shortcutType="primaryShift"
							shortcutCharacter="k"
						/> }
						{ ! isActive && <RichTextToolbarButton
							name="link"
							icon="admin-links"
							title={ title }
							onClick={ this.addLink }
							isActive={ isActive }
							shortcutType="primary"
							shortcutCharacter="k"
						/> }

						<InlineLinkUI
							addingLink={ this.state.addingLink }
							stopAddingLink={ this.stopAddingLink }
							isActive={ isActive }
							activeAttributes={ activeAttributes }
							value={ value }
							onChange={ onChange }
						/>

					</Toolbar>
				</BlockControls>
			</Fragment>
		);
	}
}

EditLink.propTypes = {
	value: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.object,
	] ).isRequired,
	onChange: PropTypes.func.isRequired,
	speak: PropTypes.func.isRequired,
	activeAttributes: PropTypes.object.isRequired,
	isActive: PropTypes.bool.isRequired,
};

export default compose(
	withSelect( () => {
		return {
			isDisabled: select( "core/edit-post" ).isFeatureActive( "disableEditorsKitLinkFormats" ),
		};
	} ),
	ifCondition( ( props ) => ! props.isDisabled ),
	withSpokenMessages,
)( EditLink );
