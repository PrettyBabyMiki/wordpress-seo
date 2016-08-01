import React from 'react';
import Step from './step';
import $ from "jquery";

import Components from './components';

/**
 * The onboarding Wizard class.
 */
class Wizard extends React.Component {

	/**
	 * Initialize the steps and set the current stepId to the first step in the array
	 *
	 * @param {Object} props The values to work with.
	 */
	constructor( props ) {
		super();

		this.props = props;

		this.state = {
			steps: this.parseSteps( props.steps ),
			currentStepId: this.getFirstStep( props.steps )
		};

		Object.assign( this.props.components, Components );
		Object.assign( this.props.components, props.customComponents);
	}

	/**
	 * Sets the previous and next stepId for each step.
	 *
	 * @param {Object} steps The object containing the steps.
	 *
	 * @return {Object} The steps with added previous and next step.
	 */
	parseSteps( steps ) {

		/**
		 * We are using this var because we need to set a next step for each step. We are adding the value at the
		 * beginning of the array. Results in an array like [ step 3, step 2, step 1 ].
		 *
		 * The next step will be set by popping the last value of the array and set it as the next one for the step
		 * we are looping through.
		 *
		 * @type {Array}
		 */
		var stepsReversed = [];

		var previous = null;

		// Loop through the steps to set each previous step.
		for ( let step in steps ) {
			if ( ! steps.hasOwnProperty( step ) ) {
				continue;
			}

			steps[ step ]['fields'] = this.parseFields( steps[ step ]['fields'] );

			steps[step].previous = previous;

			// Sets the previous var with current step.
			previous = step;

			// Adds the step to the reversed array.
			stepsReversed.unshift( step );
		}

		// We don't need 'first step'.
		stepsReversed.pop();

		// Loop through the steps to set each next step.
		for ( let step in steps ) {
			if ( ! steps.hasOwnProperty( step ) ) {
				continue;
			}

			steps[step].next = stepsReversed.pop();
		}

		return steps;
	}

	/**
	 * Gets the fields from the props.
	 *
	 * @param {Array} fieldsToGet
	 *
	 * @returns {Object}
	 */
	parseFields( fieldsToGet ) {
		let fields = {};

		fieldsToGet.forEach(
			function( fieldName ) {
				if( this.props.fields[fieldName]  ) {
					fields[ fieldName ] =  this.props.fields[fieldName];
				}
			}
			.bind( this )
		);

		return fields;
	}

	saveOptions() {
		let curStep = this.getCurrentStep( this.props.steps );
		console.log( curStep.fields );

		let jsonFields = JSON.stringify( curStep.fields );

		$.post( "http://0.0.0.0:8882/onboarding", { jsonFields } )
		 .done( function ( data ) {
			 alert( "Data Loaded: " + data );
		 } );

	}

	/**
	 * Gets the first step from the step object.
	 *
	 * @param {Object} steps The object containing the steps.
	 *
	 * @return {Object}  The first step object
	 */
	getFirstStep( steps ) {
		return Object.getOwnPropertyNames( steps )[0];
	}

	/**
	 * Updates the state to the next stepId in the wizard.
	 */
	setNextStep() {
		let nextStep = this.getCurrentStep().next;

		if ( !nextStep ) {
			return;
		}
		this.saveOptions();

		this.setState( {
			currentStepId: nextStep
		} );
	}

	/**
	 * Updates the state to the previous stepId in the wizard.
	 */
	setPreviousStep() {
		let previousStep = this.getCurrentStep().previous;

		if ( !previousStep ) {
			return;
		}

		this.saveOptions();

		this.setState( {
			currentStepId: previousStep
		} );
	}

	/**
	 * Gets the current stepId from the steps
	 */
	getCurrentStep() {
		return this.state.steps[ this.state.currentStepId ];
	}

	/**
	 * Renders the wizard.
	 *
	 * @return {JSX} The rendered step in the wizard.
	 */
	render() {
		let step = this.getCurrentStep();
		let hideNextButton = !step.next;
		let hidePreviousButton = !step.previous;

		return (
			<div>
				<button hidden={(
					hidePreviousButton
				) ? "hidden" : ""} onClick={this.setPreviousStep.bind( this )}>Previous
				</button>
				<Step components={this.props.components} id={step.id} title={step.title} fields={step.fields}/>
				<button hidden={(
					hideNextButton
				) ? "hidden" : ""} onClick={this.setNextStep.bind( this )}>Next
				</button>
			</div>
		);
	}
}

Wizard.propTypes = {
	steps: React.PropTypes.object,
	currentStepId: React.PropTypes.string,
	components: React.PropTypes.object,
	customComponents: React.PropTypes.object,
	fields: React.PropTypes.object
};

Wizard.defaultProps = {
	steps           : [],
	customComponents: {},
	components: {},
	fields: React.PropTypes.object
};

export default Wizard
