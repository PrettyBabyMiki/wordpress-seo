// External dependencies.
import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
// Internal dependencies.
import WorkoutCard from "./WorkoutCard";
import { WORKOUTS, FINISHABLE_STEPS } from "../config";

/**
 * The CornerstoneWorkoutCard component.
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The CornerstoneWorkoutCard component.
 */
export default function CornerstoneWorkoutCard( {
	workout,
	badges,
} ) {
	const finishedSteps = useSelect( "yoast-seo/workouts" ).getFinishedSteps( WORKOUTS.cornerstone );
	return <WorkoutCard
		name={ WORKOUTS.cornerstone }
		title={ __( "The cornerstone approach", "wordpress-seo" ) }
		subtitle={ __( "Rank with articles you want to rank with", "wordpress-seo" ) }
		usps={ [
			__( "Make your important articles rank higher", "wordpress-seo" ),
			__( "Bring more visitors to your articles", "wordpress-seo" ),
		] }
		image={ "mirrored_fit_bubble_man_1_optim.svg" }
		finishableSteps={ FINISHABLE_STEPS.cornerstone }
		finishedSteps={ finishedSteps }
		workout={ workout }
		badges={ badges }
	/>;
}

CornerstoneWorkoutCard.propTypes = {
	workout: PropTypes.func,
	badges: PropTypes.arrayOf( PropTypes.element ),
};

CornerstoneWorkoutCard.defaultProps = {
	workout: null,
	badges: [],
};
