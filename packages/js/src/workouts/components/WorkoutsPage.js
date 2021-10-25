import PropTypes from "prop-types";
import { __ } from "@wordpress/i18n";
import { Slot } from "@wordpress/components";
import { useEffect, useMemo } from "@wordpress/element";
import { Button, NewBadge } from "@yoast/components";
import { sortBy } from "lodash";
import SlotWithDefault from "../../components/slots/SlotWithDefault";
import CornerstoneWorkoutCard from "./CornerstoneWorkoutCard";
import OrphanedWorkoutCard from "./OphanedWorkoutCard";
import { WORKOUTS } from "../config";

const {
	workouts: workoutsSetting,
} = window.wpseoWorkoutsData;

const CornerstoneCard = () => {
	return <CornerstoneWorkoutCard />;
};
const OrphanedCard = () => {
	return <OrphanedWorkoutCard
		badges={ [ <NewBadge key={ "new-badge-orphaned-workout" } /> ] }
	/>;
};

const upsellWorkouts = {
	[ WORKOUTS.cornerstone ]: CornerstoneCard,
	[ WORKOUTS.orphaned ]: OrphanedCard,
};

/**
 * Renders the workouts page.
 *
 * @param {object} props The props.
 * @returns {wp.Element} The workouts page.
 * @constructor
 */
export default function WorkoutsPage( props ) {
	const {
		activeWorkout,
		clearActiveWorkout,
		openWorkout,
		workouts,
		loading,
		initWorkouts,
		saveWorkouts,
	} = props;

	useEffect( () => {
		// Loads the workouts on first render.
		if ( loading === true ) {
			initWorkouts( workoutsSetting );
			if ( window.location.hash && window.location.hash.length > 1 ) {
				openWorkout( window.location.hash.substr( 1 ) );
			}
			return;
		}

		// Saves the workouts on change.
		saveWorkouts( workouts );
	}, [ workouts, loading ] );

	/**
	 * Generate slots based on the workout key, and sort by priority.
	 */
	 const slots = useMemo( () => {
		const slotIds = Object.keys( workouts );
		const sortedWorkouts = sortBy( slotIds.map( id => {
			return { ...workouts[ id ], id };
		} ), "priority" );

		return sortedWorkouts.map( workout => {
			if ( upsellWorkouts[ workout.id ] ) {
				const DefaultCard = upsellWorkouts[ workout.id ];
				return <SlotWithDefault key={ workout.id } name={ `${ workout.id }` }>
					<DefaultCard />
				</SlotWithDefault>;
			}
			return <Slot key={ workout.id } name={ `${ workout.id }` } />;
		} );
	}, [ workouts ] );

	return (
		<div>
			<h1>
				{ __( "SEO workouts", "wordpress-seo-premium" ) }
			</h1>
			<p>
				{ __(
					// eslint-disable-next-line max-len
					"Getting your site in shape and keeping it SEO fit can be challenging. Let us help you get started by taking on the most common SEO challenges, with these step by step SEO workouts.",
					"wordpress-seo"
				) }
			</p>
			{ activeWorkout && <Button onClick={ clearActiveWorkout }>{ __( "← Back to all workouts", "worpdress-seo" ) }</Button> }
			 <div className="workflows__index__grid">
				{ slots }
			</div>
		</div>
	);
}

WorkoutsPage.propTypes = {
	activeWorkout: PropTypes.string.isRequired,
	clearActiveWorkout: PropTypes.func.isRequired,
	openWorkout: PropTypes.func.isRequired,
	workouts: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	initWorkouts: PropTypes.func.isRequired,
	saveWorkouts: PropTypes.func.isRequired,
};
