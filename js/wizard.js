import React from 'react';

import Step from './step';
/**
 * The onboarding Wizard class.
 */
class Wizard extends React.Component {

	constructor() {
		super();

		this.state = {
			steps: {},
			currentStepId: ''
		};
	}

	/**
	 * Initialize the steps and set the current stepId to the first step in the array
	 */
	componentWillMount() {
		this.setState( {
			steps: this.parseSteps( this.props.steps ),
			// Set the current step to the first step in the array.
			currentStepId: this.getFirstStep( this.props.steps )
		} );
	}

	/**
	 * Sets the previous and next stepId for each step.
	 * @param steps {Object} The object containing the steps.
	 * @return {Object} The steps with added previous and next step.
	 */
	parseSteps( steps ) {

		var previous = null;
		var stepsReversed = [];
		for ( let step in steps ) {
			if ( !steps.hasOwnProperty( step ) ) {
				continue;
			}

			steps[step].previous = previous;
			previous = step;
			stepsReversed.unshift( step );
		}

		stepsReversed.pop();

		for ( let step in steps ) {
			if ( !steps.hasOwnProperty( step ) ) {
				continue;
			}

			steps[step].next = stepsReversed.pop();
		}

		return steps;

	}

	/**
	 * Gets the first step from the step object.
	 * @param steps {Object} The object containing the steps.
	 * @return {Object}  The first step object
	 */
	getFirstStep( steps ) {
		return Object.getOwnPropertyNames( steps )[0];
	}

	/**
	 * Updates the state to the next stepId in the wizard.
	 */
	next() {
		let nextStep = this.getCurrentStep( this.state.steps ).next;

		if ( !nextStep ) {
			return;
		}

		this.setState( {
			currentStepId: nextStep
		} );
	}

	/**
	 * Updates the state to the previous stepId in the wizard.
	 */
	previous() {
		let previousStep = this.getCurrentStep( this.state.steps ).previous;

		if ( !previousStep ) {
			return;
		}
		this.setState( {
			currentStepId: previousStep
		} );
	}

	/**
	 * Gets the current stepId from the steps
	 */
	getCurrentStep( steps ) {
		return steps[this.state.currentStepId];
	}

	/**
	 * Renders the wizard.
	 * @return {XML} The rendered step in the wizard.
	 */
	render() {
		let step = this.getCurrentStep( this.state.steps );
		let hideNextButton = !step.next;
		let hidePreviousButton = !step.previous;

		return (
			<div>
				<button hidden={(
					hidePreviousButton
				) ? "hidden" : ""} onClick={this.previous.bind( this )}>Previous
				</button>
				<Step id={step.id} title={step.title}/>
				<button hidden={(
					hideNextButton
				) ? "hidden" : ""} onClick={this.next.bind( this )}>Next
				</button>
			</div>
		);
	}
}

Wizard.propTypes = {
	steps: React.PropTypes.object,
	currentStepId: React.PropTypes.string
}

Wizard.defaultProps = {
	steps: new Map()
};

Wizard.defaultProps.steps.values();


export default Wizard

