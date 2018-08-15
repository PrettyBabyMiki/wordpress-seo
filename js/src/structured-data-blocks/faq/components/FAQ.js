import React from "react";
import PropTypes from "prop-types";
import Question from "./Question";
import { stripHTML } from "../../../helpers/stringHelpers";
import HowToStep from "../../how-to/components/HowToStep";

const { __ } = window.wp.i18n;
const { RichText, InspectorControls } = window.wp.editor;
const { IconButton } = window.wp.components;
// const { IconButton , PanelBody, TextControl, ToggleControl } = window.wp.components;
const { Component, renderToString } = window.wp.element;
const { Fragment } = window.wp.element;

/**
 * A FAQ block component.
 */
export default class FAQ extends Component {

	/**
	 * Constructs a FAQ editor component.
	 *
	 * @param {Object} props This component's properties.
	 *
	 * @returns {void}
	 */
	constructor( props ) {
		super( props );

		this.state = { focus: "" };

		this.changeQuestion = this.changeQuestion.bind( this );
		this.insertQuestion = this.insertQuestion.bind( this );
		this.removeQuestion = this.removeQuestion.bind( this );
		this.swapQuestions = this.swapQuestions.bind( this );

		this.setFocus = this.setFocus.bind( this );

		this.editorRefs = {};
	}

	/**
	 * Generates a pseudo-unique" id.
	 *
	 * @param {string} prefix an (optional) prefix to use.
	 *
	 * @returns {string} a pseudo-unique string, consisting of the optional prefix + the curent time in milliseconds.
	 */
	static generateId( prefix ) {
		return `${ prefix }-${ new Date().getTime() }`;
	}

	/**
	 * Replaces the FAQ Question with the given index.
	 *
	 * @param {array|string} newQuestion The new contents of the question.
	 * @param {array|string} newAnswer   The new contents of the answer to this question.
	 * @param {number}       index       The index of the Question that needs to be changed.
	 *
	 * @returns {void}
	 */
	changeQuestion( newQuestion, newAnswer, prevQuestion, prevAnswer, index ) {
		let questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];

		if ( index >= questions.length ) {
			return;
		}

		if ( questions[ index ].question !== prevQuestion || questions[ index ].answer !== prevAnswer ) {
			return;
		}

		questions[ index ] = {
			id: questions[ index ].id,
			question: newQuestion,
			answer: newAnswer,
			jsonQuestion: stripHTML( renderToString( newQuestion ) ),
			jsonAnswer: stripHTML( renderToString( newAnswer ) ),
		};

		let imageSrc = Question.getImageSrc( newAnswer );

		if ( imageSrc ) {
			questions[ index ].jsonImageSrc = imageSrc;
		}

		this.props.setAttributes( { questions } );
	}

	/**
	 * Inserts an empty Question into a FAQ block at the given index.
	 *
	 * @param {number}       [index]      The index of the Question after which a new Question should be added.
	 * @param {array|string} [contents]   The contents of the new Question.
	 * @param {bool}         [focus=true] Whether or not to focus the new Question.
	 *
	 * @returns {void}
	 */
	insertQuestion( index, question = [], answer = [], focus = true ) {
		let questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];

		if ( ! index ) {
			index = questions.length - 1;
		}

		let lastIndex = questions.length - 1;
		while ( lastIndex > index ) {
			this.editorRefs[ `${ lastIndex + 1 }:question` ] = this.editorRefs[ `${ lastIndex }:question` ];
			this.editorRefs[ `${ lastIndex + 1}:answer` ]    = this.editorRefs[ `${ lastIndex }:answer` ];
			lastIndex--;
		}

		questions.splice( index + 1, 0, { id: FAQ.generateId( "faq-question" ), question, answer } );

		this.props.setAttributes( { questions } );

		if ( focus ) {
			setTimeout( this.setFocus.bind( this, `${ index + 1 }:question` ) );
		}
	}

	/**
	 * Swaps two questions in the FAQ block.
	 *
	 * @param {number} index1 The index of the first block.
	 * @param {number} index2 The index of the second block.
	 *
	 * @returns {void}
	 */
	swapQuestions( index1, index2 ) {
		console.log( ">>>>>>>>I AM IN SWAAAAAAP QUESTION!!!!!!<<<<<<<<<<<<<" );
		let questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];
		let question  = questions[ index1 ];

		questions[ index1 ] = questions[ index2 ];
		questions[ index2 ] = question;

		const QuestionEditorRef = this.editorRefs[ `${ index1 }:question` ];
		this.editorRefs[ `${ index1 }:question` ] = this.editorRefs[ `${ index2 }:question` ];
		this.editorRefs[ `${ index2 }:question` ] = QuestionEditorRef;
		const AnswerEditorRef = this.editorRefs[ `${ index1 }:answer` ];
		this.editorRefs[ `${ index1 }:answer` ] = this.editorRefs[ `${ index2 }:answer` ];
		this.editorRefs[ `${ index2 }:answer` ] = AnswerEditorRef;

		this.props.setAttributes( { questions } );

		let [ focusIndex, focusPart ] = this.state.focus.split( ":" );
		if ( focusIndex === `${ index1 }` ) {
			this.setFocus( `${ index2 }:${ focusPart }` );
		} else if ( focusIndex === `${ index2 }` ) {
			this.setFocus( `${ index1 }:${ focusPart }` );
		}
	}

	/**
	 * Removes a Question from a FAQ block.
	 *
	 * @param {number} index the index of the Question that needs to be removed.
	 *
	 * @returns {void}
	 */
	removeQuestion( index ) {
		let questions = this.props.attributes.questions ? this.props.attributes.questions.slice() : [];

		questions.splice( index, 1 );
		this.props.setAttributes( { questions } );

		delete this.editorRefs[ `${ index }:question` ];
		delete this.editorRefs[ `${ index }:answer` ];

		let nextIndex = index + 1;
		while ( this.editorRefs[ `${ nextIndex }:question`] || this.editorRefs[ `${ nextIndex }:answer`] ) {
			this.editorRefs[ `${ nextIndex - 1 }:question` ] = this.editorRefs[ `${ nextIndex }:question` ];
			this.editorRefs[ `${ nextIndex - 1 }:answer` ] = this.editorRefs[ `${ nextIndex }:answer` ];
			nextIndex++;
		}

		const deletedIndex = questions.length;
		delete this.editorRefs[ `${ deletedIndex }:question` ];
		delete this.editorRefs[ `${ deletedIndex }:answer` ];

		if ( this.editorRefs[ `${ index }:question` ] ) {
			this.setFocus( `${ index }:question` );
		} else if ( this.editorRefs[ `${ index - 1 }:answer` ] ) {
			this.setFocus( `${ index - 1 }:answer` );
		} else {
			this.setFocus( "title" );
		}
	}
	/**
	 * Sets the focus to a specific QA pair in the FAQ block.
	 *
	 * @param {number|string} focus the element to focus, either the index of the Question that should be in focus or name of the input.
	 *
	 * @returns {void}
	 */
	setFocus( focus ) {
		if( focus === this.state.focus ) {
			return;
		}

		this.setState( { focus } );

		if ( this.editorRefs[ focus ] ) {
			this.editorRefs[ focus ].focus();
		}
	}

	/**
	 * A button to add a step to the front of the list.
	 *
	 * @returns {Component} a button to add a step
	 */
	getAddQuestionButton() {
		return (
			<IconButton
				icon="insert"
				onClick={ () => this.insertQuestion() }
				className="editor-inserter__toggle"
			>
				{ __( "Add question", "wordpress-seo" ) }
			</IconButton>
		);
	}

	getQuestions() {
		let { attributes } = this.props;

		if ( ! attributes.questions ) {
			return null;
		}

		let [ focusIndex, focusPart ] = this.state.focus.split( ":" );
		console.log( "RENDER!!!! attributes.questions: ", attributes.questions );
		return(
			attributes.questions.map(
				( question, index ) => {
					return(
						<Question
							key={ question.id }
							attributes={ question }
							insertQuestion={ this.insertQuestion }
							removeQuestion={ () => this.removeQuestion( index ) }
							editorRef={ ( part, ref ) => {
								console.log( "Setting ref: " );
								this.editorRefs[ `${ index }:${ part }` ] = ref;
							} }
							index={ index }
							onChange={ ( question, answer, prevQuestion, prevAnswer ) => this.changeQuestion( question, answer, prevQuestion, prevAnswer, index ) }
							onFocus={ ( part ) => this.setFocus( `${ index }:${ part }` ) }
							isSelected={ focusIndex === `${ index }` }
							focusElement={ this.state.focus }
							focusPart={ focusPart }
							onMoveUp={ () => this.swapQuestions( index, index - 1 ) }
							onMoveDown={ () => this.swapQuestions( index, index + 1 ) }
							isFirst={ index === 0 }
							isLast={ index === attributes.questions.length-1 }
						/>
					);
				}
			)
		);
	}

	/**
	 * Returns the component to be used to render
	 * the FAQ block on Wordpress (e.g. not in the editor).
	 *
	 * @param {object} attributes the attributes of the FAQ block
	 * @param {string} className  the class to apply to the root component.
	 *
	 * @returns {Component} the component representing a FAQ block
	 */
	static Content( attributes ) {
		let { title, questions, additionalListCssClasses, className } = attributes;

		let questionList = questions ? questions.map( ( question ) =>
			Question.getContent( question )
		) : null;

		return (
			<div className={ `schema-faq ${ className }` }>
				<RichText.Content
					tagName="h2"
					className="schema-faq-title"
					value={ title }
					id={ stripHTML( renderToString( title ) ).toLowerCase().replace( /\s+/g, "-" ) }
				/>
				{ questionList }
			</div>
		);
	}

	/**
	 * Renders this component.
	 *
	 * @returns {Component} The FAQ block editor.
	 */
	render() {
		let { attributes, setAttributes, className } = this.props;
		console.log( "PARENT RENDER!!!!!" );
		return (
			<div className={ `schema-faq ${ className }` }>
				<RichText
					tagName="h2"
					className="schema-faq-title"
					value={ attributes.title }
					isSelected={ this.state.focus === "title" }
					setFocusedElement={ () => this.setFocus( "title" ) }
					onChange={ ( title ) => setAttributes( { title, jsonTitle: stripHTML( renderToString( title ) ) } ) }
					onSetup={ ( ref ) => {
						this.editorRefs.title = ref;
					} }
					placeholder={ __( "Enter a title for your FAQ section", "wordpress-seo" ) }
					keepPlaceholderOnFocus={ true }
				/>
				<div>
					{ this.getQuestions() }
				</div>
				<div className="schema-faq-buttons">{ this.getAddQuestionButton() }</div>
			</div>
		);
	}
}

FAQ.propTypes = {
	attributes: PropTypes.object.isRequired,
	setAttributes: PropTypes.func.isRequired,
	className: PropTypes.string,
};
