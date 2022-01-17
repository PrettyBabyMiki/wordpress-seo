import { CheckIcon } from "@heroicons/react/solid";
import { Fragment, useCallback } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";

/**
 * The StepButtons component.
 *
 * @param {Object}   props               The props object.
 * @param {number}   props.stepIdx       The index of the current step.
 * @param {number}   props.lastIndex     The index of the last step.
 * @param {function} props.setActiveStep A function to set a new active step.
 * @param {function} props.saveStep      A function to save the current step.
 * @param {function} props.finishStepper A function to finish the last step (entire stepper).
 *
 * @returns {WPElement} The StepButtons component.
 */
function StepButtons( { stepIdx, lastIndex, saveStep, setActiveStep, finishStepper } ) {
	const handlePrimaryClick = useCallback(
		() => {
			const currentStep = stepIdx;
			const nextStep = stepIdx + 1;
			if ( currentStep === lastIndex ) {
				finishStepper();
			} else {
				saveStep( currentStep );
				setActiveStep( nextStep );
			}
		},
		[ setActiveStep, saveStep, finishStepper, stepIdx, lastIndex ]
	);

	const goBack = useCallback( () => {
		setActiveStep( stepIdx - 1 );
	}, [ stepIdx, setActiveStep ] );

	return <Fragment>
		<button
			onClick={ handlePrimaryClick }
			className="yst-button--primary"
		>
			{ stepIdx < lastIndex
				? __( "Save and continue", "wordpress-seo" )
				: __( "Finish this workout", "wordpress-seo" ) }
		</button>
		{ stepIdx > 0 && <button
			onClick={ goBack }
			className="yst-button--secondary yst-ml-3"
		>
			{ __( "Go back", "wordpress-seo" ) }
		</button>
		}
	</Fragment>;
}

StepButtons.propTypes = {
	stepIdx: PropTypes.number.isRequired,
	lastIndex: PropTypes.number.isRequired,
	setActiveStep: PropTypes.func.isRequired,
	saveStep: PropTypes.func,
	finishStepper: PropTypes.func,
};

StepButtons.defaultProps = {
	saveStep: () => {},
	finishStepper: () => {},
};

const classnames = {
	complete: {
		line: "yst-top-4 yst-bg-primary-500",
		bullet: {
			border: "yst-bg-primary-500 yst-group-hover:bg-primary-700",
			content: "",
		},
		name: "",
	},
	current: {
		line: "yst-top-8 yst-bg-gray-300",
		bullet: {
			border: "yst-bg-white yst-border-2 yst-border-primary-500",
			content: "yst-bg-primary-500",
		},
		name: "yst-text-primary-500",
	},
	upcoming: {
		line: "yst-top-4 yst-bg-gray-300",
		bullet: {
			border: "yst-bg-white yst-border-2 yst-border-gray-300 yst-group-hover:border-gray-400",
			content: "yst-bg-transparent yst-group-hover:bg-gray-300",
		},
		name: "yst-text-gray-500",
	},
};
/**
 * Example stepper.
 *
 * @returns {WPElement} The example stepper.
 */
export default function Stepper( { steps, setActiveStep, saveStep, finishStepper } ) {
	return (
		<ol className="yst-overflow-hidden">
			{ /* eslint-disable-next-line complexity */ }
			{ steps.map( ( step, stepIdx ) => (
				 <li key={ step.name } className={ ( stepIdx === steps.length - 1 ? "" : "yst-pb-10" ) + " yst-relative" }>
					 <Fragment>
						 <div
							 className={ ( stepIdx === steps.length - 1 ? "hidden " : "" ) +
							 "yst--ml-px yst-absolute yst-mt-0.5 yst-left-4 yst-w-0.5 yst-h-full " + classnames[ step.status ].line }
							 aria-hidden="true"
						 />
						 <div className="yst-relative yst-flex yst-items-start yst-group" aria-current={ step.status === "current" ? "step" : null }>
							 <span className="yst-h-9 yst-flex yst-items-center" aria-hidden={ step.status === "current" ? "true" : null }>
								 { /* eslint-disable-next-line max-len */ }
								 <span className={ "yst-relative yst-z-10 yst-w-8 yst-h-8 yst-flex yst-items-center yst-justify-center yst-rounded-full " + classnames[ step.status ].bullet.border }>
									{ ( step.status === "complete" )
										? <CheckIcon className="yst-w-5 yst-h-5 yst-text-white" aria-hidden="true" />
										: <span className={ "yst-h-2.5 yst-w-2.5 yst-rounded-full " + classnames[ step.status ].bullet.content } />
									}
								</span>
							 </span>
							 <span className="yst-ml-4 yst-min-w-0 yst-flex yst-flex-col yst-self-center">
								<span className={ "yst-text-xs yst-font-semibold yst-tracking-wide yst-uppercase " + classnames[ step.status ].name }>
									{ step.name }
								</span>
								{ step.description && <span className="yst-text-sm yst-text-gray-500">{ step.description }</span> }
							</span>
						 </div>
						<div className={ ( step.status === "current" ? "" : "hidden " ) + "yst-ml-12 yst-mb-8 yst-mt-4" }>
							{ step.component }
							<StepButtons
								stepIdx={ stepIdx }
								lastIndex={ steps.length - 1 }
								setActiveStep={ setActiveStep }
								finishStepper={ finishStepper }
								saveStep={ saveStep }
							/>
						</div>
					</Fragment>
				</li>
			) ) }
		</ol>
	);
}

Stepper.propTypes = {
	steps: PropTypes.arrayOf( PropTypes.shape( {
		name: PropTypes.string.isRequired,
		description: PropTypes.string,
		component: PropTypes.element.isRequired,
		status: PropTypes.oneOf( [ "complete", "current", "upcoming" ] ).isRequired,
	} ) ).isRequired,
	setActiveStep: PropTypes.func.isRequired,
	saveStep: PropTypes.func,
	finishStepper: PropTypes.func,
};

Stepper.defaultProps = {
	saveStep: () => {},
	finishStepper: () => {},
};
