// External dependencies.
import PropTypes from "prop-types";
import { __, sprintf } from "@wordpress/i18n";
import { useCallback, useState, useMemo, useEffect } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
// Internal dependencies.
import { NewButton as Button, ProgressBar } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";

/* eslint-disable complexity */
/**
 * The WorkoutCard component
 *
 * @param {Object} props The props object.
 *
 * @returns {WPElement} The WorkoutCard component
 */
export default function WorkoutCard( {
	name,
	title,
	subtitle,
	usps,
	image,
	finishableSteps,
	finishedSteps,
	upsellLink,
	workout,
	badges,
} ) {
	const { openWorkout, toggleWorkout } = useDispatch( "yoast-seo/workouts" );
	const activeWorkout = useSelect( ( select ) => {
		return select( "yoast-seo/workouts" ).getActiveWorkout();
	}, [] );

	const [ isToggle, setToggle ] = useState( false );

	const WorkoutComponent = workout;
	const ImageComponent = image;

	useEffect( () => {
		if ( finishableSteps && finishedSteps && finishedSteps.length === finishableSteps.length ) {
			setToggle( true );
		} else {
			setToggle( false );
		}
	}, [ finishedSteps, finishableSteps ] );

	const buttonText = useMemo( () => {
		if ( ! finishedSteps || finishedSteps.length === 0 ) {
			return __( "Start workout!", "wordpress-seo" );
		} else if ( finishedSteps.length < finishableSteps.length ) {
			return __( "Continue workout!", "wordpress-seo" );
		}
		return __( "Do workout again", "wordpress-seo" );
	},
	  [ finishedSteps, finishableSteps ]
	);

	const onClick = useCallback(
		() => {
			openWorkout( name );
			if ( isToggle ) {
				toggleWorkout( name );
			}
		},
		[ workout, isToggle, openWorkout, toggleWorkout ]
	);

	const UpsellButton = makeOutboundLink();
	const disabled = workout ? "" : " card-disabled";

	return ( <>
		{ ! activeWorkout && <div className={ `card card-small${ disabled }` }>
			<h2>{ title } { badges }</h2>
			<h3>{ subtitle }</h3>
			<div className="workout-card-content-flex">
				<ul className="yoast-list--usp">
					{
						usps.map( ( usp, index ) => <li key={ `${ title }-${ index }` }>{ usp }</li> )
					}
				</ul>
				<ImageComponent />
			</div>
			<span>
				{ workout && <Button onClick={ onClick }>{ buttonText }</Button> }
				{ ! workout &&
					<UpsellButton href={ upsellLink } className="yoast-button yoast-button-upsell">
						{
							sprintf(
							/* translators: %s : Expands to the add-on name. */
								__( "Unlock with %s!", "wordpress-seo" ),
								"Premium"
							)
						}
						<span aria-hidden="true" className="yoast-button-upsell__caret" />
					</UpsellButton>
				}
				{ finishableSteps && finishedSteps &&
				<div className="workout-card-progress">
					<ProgressBar
						id={ `${title}-workout-progress` }
						max={ finishableSteps.length }
						value={ finishedSteps.length }
					/>
					<label htmlFor={ `${title}-workout-progress` }><em>
						{
							sprintf(
								// translators: %1$s: number of finished steps, %2$s: number of finishable steps
								__(
									"%1$s/%2$s steps completed",
									"wordpress-seo"
								),
								finishedSteps.length,
								finishableSteps.length
							)
						}
					</em></label>
				</div> }
			</span>
		</div> }
		{ workout && activeWorkout === name && <WorkoutComponent /> }
	</>	);
}

WorkoutCard.propTypes = {
	name: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	subtitle: PropTypes.string.isRequired,
	usps: PropTypes.arrayOf( PropTypes.string ).isRequired,
	finishableSteps: PropTypes.arrayOf( PropTypes.string ),
	finishedSteps: PropTypes.arrayOf( PropTypes.string ),
	image: PropTypes.string,
	upsellLink: PropTypes.string,
	workout: PropTypes.func,
	badges: PropTypes.arrayOf( PropTypes.element ),
};

WorkoutCard.defaultProps = {
	image: null,
	upsellLink: null,
	workout: null,
	badges: [],
	finishableSteps: null,
	finishedSteps: null,
};
/* eslint-enable complexity */
