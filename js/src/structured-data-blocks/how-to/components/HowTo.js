import React from "react";
import PropTypes from "prop-types";

import HowToStep from "./HowToStep";

const { __ } = window.wp.i18n;
const { RichText, InspectorControls } = window.wp.editor;
const { IconButton, PanelBody, TextControl, ToggleControl } = window.wp.components;
const { Component, renderToString } = window.wp.element;
const { Fragment } = window.wp.element;

/**
 * A How-to block component.
 */
export default class HowTo extends Component {

	constructor( props ) {
		super( props );

		this.state = { focus: null };

		this.changeStep = this.changeStep.bind( this );
		this.addStep = this.addStep.bind( this );
		this.insertStep = this.insertStep.bind( this );
		this.removeStep = this.removeStep.bind( this );
		this.swapSteps = this.swapSteps.bind( this );
		this.setFocus = this.setFocus.bind( this );
		this.addCSSClasses = this.addCSSClasses.bind( this );
		this.getListTypeHelp = this.getListTypeHelp.bind( this );
		this.toggleListType = this.toggleListType.bind( this );

		this.stepEditorRefs = {};

		if ( ! props.attributes.steps || props.attributes.steps.length === 0 ) {
			props.setAttributes( {
				steps: [ { id: HowTo.generateId( "how-to-step" ), contents: [] } ],
			} );
		}
	}

	/**
	 * Generates a pseudo-unique" id.
	 * @param {string} prefix an (optional) prefix to use.
	 * @returns {string} a pseudo-unique string, consisting of the optional prefix + the curent time in milliseconds.
	 */
	static generateId( prefix ) {
		return `${ prefix }-${ new Date().getTime() }`;
	}

	/**
	 * Adds an empty How-to step to this How-to block.
	 * @returns {void}
	 */
	addStep() {
		let steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];
		steps.push( { id: HowTo.generateId( "how-to-step" ), contents: [] } );
		this.props.setAttributes( { steps } );
	}

	/**
	 * Replaces the How-to step with the given index.
	 * @param {string} newContents the new contents of the step
	 * @param {number} index the index of the step that needs to be replaced
	 * @returns {void}
	 */
	changeStep( newContents, index ) {
		let steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

		if ( index >= steps.length ) {
			return;
		}

		steps[ index ].contents = newContents;
		this.props.setAttributes( { steps } );
	}

	/**
	 * Inserts an empty step into a how-to block at the given index.
	 * @param {number}       [index]    the index of the step after which a new step should be added
	 * @param {array|string} [contents] the contents of the new step.
	 * @returns {void}
	 */
	insertStep( index, contents = "" ) {
		let steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];

		if ( ! index ) {
			index = steps.length;
		}

		steps.splice( index + 1, 0, { id: HowTo.generateId( "how-to-step" ), contents } );
		this.props.setAttributes( { steps } );
		if ( this.stepEditorRefs[ index + 1 ] ) {
			this.stepEditorRefs[ index + 1 ].focus();
		}
	}

	/**
	 * Swaps two steps in the how-to block.
	 * @param {number} index1 The index of the first block.
	 * @param {number} index2 The index of the second block.
	 * @returns {void}
	 */
	swapSteps( index1, index2 ) {
		let steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];
		let step  = steps[ index1 ];

		steps[ index1 ] = steps[ index2 ];
		steps[ index2 ] = step;

		let stepEditorRef = this.stepEditorRefs[ index1 ];
		this.stepEditorRefs[ index1 ] = this.stepEditorRefs[ index2 ];
		this.stepEditorRefs[ index2 ] = stepEditorRef;

		this.props.setAttributes( { steps } );

		if ( this.state.focus === index1 ) {
			this.setFocus( index2 );
		} else if ( this.state.focus === index2 ) {
			this.setFocus( index1 );
		}
	}

	/**
	 * Removes a step from a how-to block
	 * @param {number} index the index of the step that needs to be removed
	 * @returns {void}
	 */
	removeStep( index ) {
		let steps = this.props.attributes.steps ? this.props.attributes.steps.slice() : [];
		steps.splice( index, 1 );
		this.props.setAttributes( { steps } );
	}

	/**
	 * Sets the focus to a specific step in the How-to block.
	 * @param {number|string} focus the element to focus, either the index of the step that should be in focus or name of the input.
	 * @returns {void}
	 */
	setFocus( focus ) {
		this.setState( { focus } );
	}

	/**
	 * Returns an array of How-to step components, to be rendered on screen.
	 * @returns {Component[]} The step components.
	 */
	getSteps() {
		return this.props.attributes.steps ? this.props.attributes.steps.map( ( step, index ) =>
			<HowToStep
				key={ step.id }
				step={ step }
				index={ index }
				editorRef={ ( ref ) => {
					this.stepEditorRefs[ index ] = ref;
				} }
				onChange={ ( newStepContents ) => this.changeStep( newStepContents, index ) }
				insertStep={ ( contents ) => this.insertStep( index, contents ) }
				removeStep={ () => this.removeStep( index ) }
				onFocus={ () => this.setFocus( index ) }
				onMoveUp={ () => this.swapSteps( index, index - 1 ) }
				onMoveDown={ () => this.swapSteps( index, index + 1 ) }
				isFirst={ index === 0 }
				isLast={ index === this.props.attributes.steps.length - 1 }
				isSelected={ this.state.focus === index }
			/>
		) : [];
	}

	/**
	 * Returns a component to manage this how-to block"s duration.
	 * @returns {Component} The duration editor component.
	 */
	getDuration() {
		const { attributes, setAttributes } = this.props;

		if (
			( typeof attributes.hours === "undefined" || attributes.hours === false ) &&
			( typeof attributes.minutes === "undefined" || attributes.minutes === false )
		) {
			return (
				<IconButton
					icon="insert"
					onClick={ () => setAttributes( { hours: null, minutes: null } ) }
					className="schema-how-to-duration-button editor-inserter__toggle"
				>
					{ __( "Add total time" ) }
				</IconButton>
			);
		}

		return <div className="schema-how-to-duration">
			<span>{ __( "Total time:", "structured-data-block/how-to-block" ) }&nbsp;</span>
			<input
				className="schema-how-to-duration-input"
				type="number"
				value={ attributes.hours }
				min="0"
				onFocus={ () => this.setFocus( "hours" ) }
				onChange={ ( event ) => setAttributes( { hours: event.target.value } ) }
				placeholder="HH"/>
			<span>:</span>
			<input
				className="schema-how-to-duration-input"
				type="number"
				min="0"
				max="59"
				value={ attributes.minutes }
				onFocus={ () => this.setFocus( "minutes" ) }
				onChange={ ( event ) => setAttributes( { minutes: event.target.value } ) }
				placeholder="MM" />
			<IconButton
				className="schema-how-to-duration-button editor-inserter__toggle"
				icon="trash"
				label={ __( "Delete total time" ) }
				onClick={ () => setAttributes( { hours: false, minutes: false } ) }
			/>
		</div>;
	}

	/**
	 * Strips html from a string
	 * @param {string} html the html string
	 * @returns {string} the html string, with all the html elements stripped from it.
	 */
	static stripHTML( html ) {
		let tmp = document.createElement( "DIV" );
		tmp.innerHTML = html;
		return tmp.textContent || tmp.innerText || "";
	}

	/**
	 * Serializes a How-to block into a JSON-LD representation.
	 * @param {object} attributes the attributes of the How-to block
	 * @returns {object} the JSON-LD representation of this How-to block
	 */
	static toJSONLD( attributes ) {
		let jsonLD = {
			"@context": "http://schema.org",
			"@type": "HowTo",
			name: this.stripHTML( renderToString( attributes.title ) ),
		};

		if( attributes.hours && attributes.minutes ) {
			jsonLD.totalTime = `PT${ attributes.hours }H${ attributes.minutes }M`;
		}
		if( attributes.description && attributes.description.length > 0 ) {
			jsonLD.description = this.stripHTML( renderToString( attributes.description ) );
		}
		if( attributes.steps && attributes.steps.length > 0 ) {
			jsonLD.step = attributes.steps.map( ( step, index ) => HowToStep.toJSONLD( step, index ) );
		}

		return jsonLD;
	}

	/**
	 * Renders a JSON-LD representation of this How-to block.
	 * @param {object} attributes the attributes of the How-to block
	 * @returns {Component} the JSON-LD representation, wrapped in a script tag of type "application/ld+json"
	 */
	static renderJSONLD( attributes ) {
		let stringified = JSON.stringify( this.toJSONLD( attributes ), null, 3 );

		// Gutenberg uses a slightly different JSON stringifier,
		// Combined with the fact that Gutenberg compares the stringified JSONs
		// By replacing all subsequent whitespaces with one space means that
		// Everything breaks when encountering "[ {" instead of "[{" etc.
		stringified = stringified.replace( /\[[\s]+\{/g, "[{" );

		return <script type="application/ld+json">{ stringified }</script>;
	}


	/**
	 * Returns the component to be used to render
	 * the How-to block on Wordpress (e.g. not in the editor).
	 * @param {object} attributes the attributes of the How-to block
	 * @param {string} className  the class to apply to the root component.
	 * @returns {Component} the component representing a How-to block
	 */
	static getContent( attributes, className ) {
		let { steps, title, hours, minutes, description, unorderedList, additionalListCssClasses } = attributes;

		steps = steps ? steps.map( ( step ) =>
			HowToStep.getContent( step )
		) : null;

		return (
			<Fragment>
				{ this.renderJSONLD( attributes ) }
				<div className={ `schema-how-to ${ className }` }>
					<RichText.Content
						tagName="h2"
						className="schema-how-to-title"
						value={ title }
						id={ this.stripHTML( renderToString( title ) ).toLowerCase().replace( /\s+/g, "-" ) }
					/>
					{ attributes.hours && attributes.minutes &&
					<p className="schema-how-to-total-time">
						{ __( "Total time:", "structured-data-block/how-to-block" ) }
						&nbsp;
						{ hours || 0 }:{ ( "00" + ( minutes || 0 ) ).slice( -2 ) }
					</p>
					}
					<RichText.Content
						tagName="p"
						className="schema-how-to-description"
						value={ description }
					/>
					{ unorderedList
						? <ul className={ `schema-how-to-steps ${ additionalListCssClasses }` }>{ steps }</ul>
						: <ol className={ `schema-how-to-steps ${ additionalListCssClasses }` }>{ steps }</ol>
					}
				</div>
			</Fragment>
		);
	}

	/**
	 * A button to add a step to the front of the list.
	 * @returns {Component} a button to add a step
	 */
	getAddStepButton() {
		return (
			<IconButton
				icon="insert"
				onClick={ () => this.insertStep() }
				className="editor-inserter__toggle"
			>
				{ __( "Add step" ) }
			</IconButton>
		);
	}

	/**
	 * Adds CSS classes to this how-to block"s list.
	 * @param {string} value The additional css classes.
	 * @returns {void}
	 */
	addCSSClasses( value ) {
		this.props.setAttributes( { additionalListCssClasses: value } );
	}

	/**
	 * Toggles the list type of this how-to block.
	 * @param {boolean} checked Whether or not the list is unordered.
	 * @returns {void}
	 */
	toggleListType( checked ) {
		this.props.setAttributes( { unorderedList: checked } );
	}

	/**
	 * Returns the help text for this how-to block"s list type.
	 * @param  {boolean} checked Whether or not the list is unordered.
	 * @returns {string} The list type help string.
	 */
	getListTypeHelp( checked ) {
		return checked ? __( "Showing step items as an unordered list" ) : __( "Showing step items as an ordered list." );
	}

	/**
	 * Adds controls to the editor sidebar to control the given parameters.
	 * @param {boolean} unorderedList whether to show the list as an unordered list.
	 * @param {string} additionalClasses the additional CSS classes to add to the list.
	 * @returns {Component} the controls to add to the sidebar.
	 */
	getSidebar( unorderedList, additionalClasses ) {
		return <InspectorControls>
			<PanelBody title={ __( "Settings" ) } className="blocks-font-size">
				<TextControl
					label={ __( "Additional CSS Classes for list" ) }
					value={ additionalClasses }
					onChange={ this.addCSSClasses }
					help={ __( "CSS classes to add to the list of steps (excluding the how-to header)" ) }
				/>
				<ToggleControl
					label={ __( "Unordered list" ) }
					checked={ unorderedList }
					onChange={ this.toggleListType }
					help={ this.getListTypeHelp }
				/>
			</PanelBody>
		</InspectorControls>;
	}

	/**
	 * Renders this component.
	 * @returns {Component} The how-to block editor.
	 */
	render() {
		let { attributes, setAttributes, className } = this.props;

		return (
			<div className={ `schema-how-to ${ className }` }>
				<RichText
					tagName="h2"
					className="schema-how-to-title"
					value={ attributes.title }
					isSelected={ this.state.focus === "title" }
					setFocusedElement={ () => this.setFocus( "title" ) }
					onChange={ ( title ) => setAttributes( { title } ) }
					placeholder={ __( "Enter a title for your instructions", "structured-data-block/how-to-block" ) }
					keepPlaceholderOnFocus={ true }
				/>
				{ this.getDuration() }
				<RichText
					tagName="p"
					className="schema-how-to-description"
					value={ attributes.description }
					isSelected={ this.state.focus === "description" }
					setFocusedElement={ () => this.setFocus( "description" ) }
					onChange={ ( description ) => setAttributes( { description } ) }
					placeholder={ __( "Enter description", "structured-data-block/how-to-block" ) }
					keepPlaceholderOnFocus={ true }
				/>
				<ul className={ `schema-how-to-steps ${ attributes.additionalListCssClasses }` }>
					{ this.getSteps() }
				</ul>
				<div className="schema-how-to-buttons">{ this.getAddStepButton() }</div>
				{ this.getSidebar( attributes.unorderedList, attributes.additionalListCssClasses ) }
			</div>
		);
	}
}

HowTo.propTypes = {
	attributes: PropTypes.object.isRequired,
	setAttributes: PropTypes.func.isRequired,
	className: PropTypes.string,
};
