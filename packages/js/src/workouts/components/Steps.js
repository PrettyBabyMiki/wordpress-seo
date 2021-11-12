import { NewButton as Button } from "@yoast/components";
import { ReactComponent as ArrowDown } from "../../../images/icon-arrow-down.svg";

/**
 * The Steps component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Steps component.
 */
export function Steps( props ) {
	return (
		<ol className="workflow yoast">
			{ props.children }
		</ol>
	);
}

/**
 * The Step component
 *
 * @param {Object} props The props.
 *
 * @returns {WPElement} The Step component.
 */
export function Step( { title, subtitle, finishText, hasDownArrow, onFinishClick, isFinished, ImageComponent, children } ) {
	const finished = isFinished ? " finished" : "";
	return (
		<li className={ `step${finished}` }>
			<h4>{ title }</h4>
			<div style={ { display: "flex" } }>
				{ subtitle && <p>{ subtitle }</p> }
				{ ImageComponent && <ImageComponent style={ { height: "119px", width: "100px", "flex-shrink": 0 } } /> }
			</div>
			{ children }
			<hr />
			<Button variant="secondary" onClick={ onFinishClick }>
				{ finishText }
				{ hasDownArrow && <ArrowDown className="yoast-button--arrow-down" /> }
			</Button>
		</li>
	);
}
