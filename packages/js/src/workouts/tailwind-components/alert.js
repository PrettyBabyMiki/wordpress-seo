// Duplicated from: admin-ui/packages/toolkit/components/alert.js

import { InformationCircleIcon, ExclamationIcon, XCircleIcon } from "@heroicons/react/solid";
import { PropTypes } from "prop-types";
import classNames from "classnames";

/**
 * Renders the alert component.
 *
 * @param {String} type The type of the alert.
 * @param {*} children The content of the alert.
 *
 * @returns {React.Component} The Alert.
 */
export default function Alert( { type, children, className } ) {
	let icon;
	let color;

	switch ( type ) {
		case "info":
			icon = <InformationCircleIcon aria-hidden="true" className="yst-flex-shrink-0 yst-w-5 yst-h-5 yst-text-blue-500" />;
			color = "yst-bg-blue-100 yst-text-blue-800";
			break;
		case "warning":
			icon = <ExclamationIcon aria-hidden="true" className="yst-flex-shrink-0 yst-w-5 yst-h-5 yst-text-yellow-500" />;
			color = "yst-bg-yellow-100 yst-text-yellow-800";
			break;
		case "error":
			icon = <XCircleIcon aria-hidden="true" className="yst-flex-shrink-0 yst-w-5 yst-h-5 yst-text-red-500" />;
			color = "yst-bg-red-100 yst-text-red-800";
	}

	const marginBottom = className.indexOf( "yst-mb-" ) === -1 ? "yst-mb-8" : "";

	return (
		<div className={ classNames( "yst-flex yst-p-4 yst-rounded-md last:yst-mb-0", marginBottom, color, className ) }>
			{ icon }
			<div className="yst-flex-1 yst-ml-3 md:yst-flex md:yst-justify-between yst-text-sm">
				{ children }
			</div>
		</div>
	);
}

Alert.propTypes = {
	type: PropTypes.oneOf( [ "info", "warning", "error" ] ),
	children: PropTypes.oneOfType( [
		PropTypes.arrayOf( PropTypes.node ),
		PropTypes.node,
	] ).isRequired,
	className: PropTypes.string,
};

Alert.defaultProps = {
	type: "info",
	className: "",
};
