/* External dependencies */
import PropTypes from "prop-types";
import { useCallback, Fragment } from "@wordpress/element";
import { __, _n, sprintf } from "@wordpress/i18n";
import { isEmpty } from "lodash-es";

/* Yoast dependencies */
import { Toggle } from "@yoast/components";
import { makeOutboundLink } from "@yoast/helpers";

/* Internal dependencies */
import AreaChart from "./AreaChart";
import WincherSEOPerformanceLoading from "./modals/WincherSEOPerformanceLoading";

const ViewLink = makeOutboundLink();

/**
 * Transforms the Wincher Position data to x/y points for the SVG area chart.
 *
 * @param {Object} chartEntry List of position values for a single keyphrase.
 *
 * @returns {Array} An array of x/y coordinates objects.
 */
export function transformTrendDataToChartPoints( chartEntry ) {
	return chartEntry.position.history.map( ( entry, index ) => ( { x: index, y: 101 - entry.value } ) );
}

/**
 * Gets the labels for the data table headers.
 *
 * @param {Object} chartData The chart data to map.
 *
 * @returns {Array} The data table header labels.
 */
export function getAreaChartDataTableHeaderLabels( chartData ) {
	return Array.from( { length: chartData.position.history.length }, ( _, i ) => i + 1 ).map( ( i ) => {
		/* translators: %d expands to the amount of days */
		return sprintf( _n( "%d day", "%d days", i, "wordpress-seo" ), i );
	} );
}

/**
 * Adapts the chart y axis data to a more meaningful format for the alternative representation in the data table.
 *
 * @param {number} y The raw y axis data of the chart.
 *
 * @returns {number} The formatted y axis data.
 */
export function mapAreaChartDataToTableData( y ) {
	return Math.round( y * 100 );
}


/**
 *  Generates a chart based on the passed data.
 *
 * @param {Object} chartData The chart data entry.
 *
 * @returns {wp.Element|string} The chart containing the positions over time. If there is none, return "?".
 */
export function generatePositionOverTimeChart( chartData ) {
	if ( isEmpty( chartData ) || isEmpty( chartData.position ) ) {
		return "?";
	}

	const areaChartDataTableHeaderLabels = getAreaChartDataTableHeaderLabels( chartData );
	const chartPoints = transformTrendDataToChartPoints( chartData );

	return <AreaChart
		width={ 66 }
		height={ 24 }
		data={ chartPoints }
		strokeWidth={ 1.8 }
		strokeColor="#498afc"
		fillColor="#ade3fc"
		className="yoast-related-keyphrases-modal__chart"
		mapChartDataToTableData={ mapAreaChartDataToTableData }
		dataTableCaption={
			__( "Keyphrase position in the last 90 days on a scale from 0 to 100.", "wordpress-seo" )
		}
		dataTableHeaderLabels={ areaChartDataTableHeaderLabels }
	/>;
}


/**
 * Gets the toggles state of the keyphrase.
 *
 * @param {string}  keyphrase The toggle's associated keyphrase.
 * @param {boolean} isEnabled Whether or not the toggle is enabled.
 * @param {function} toggleAction The toggle action to call.
 *
 * @returns {wp.Element} The toggle component.
 */
export function renderToggleState( { keyphrase, isEnabled, toggleAction } ) {
	return (
		<Toggle
			id={ `toggle-keyphrase-tracking-${keyphrase}` }
			className="wincher-toggle"
			isEnabled={ isEnabled }
			onSetToggleState={ toggleAction }
			showToggleStateLabel={ false }
		/>
	);
}

/**
 * Gets the keyphrase position.
 *
 * @param {Object} chartData The chart data to extract the keyphrase position from.
 *
 * @returns {string} The keyphrase position. Returns a "?" if no data is present.
 */
export function getKeyphrasePosition( chartData ) {
	if ( isEmpty( chartData ) || isEmpty( chartData.position ) || chartData.position.value > 100 ) {
		return "?";
	}

	return chartData.position.value;
}

/**
 * Gets the positional data based on the current UI state and returns the appropiate UI element.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.Element} The rendered element.
 */
export function getPositionalDataByState( props ) {
	const { rowData, chartData, websiteId } = props;

	const isEnabled    = ! isEmpty( rowData );
	const hasChartData = ! isEmpty( chartData );
	const viewLinkURL  = ( rowData ) ? sprintf(
		"https://www.wincher.com/websites/%s/keywords?serp=%s?utm_medium=plugin&utm_source=yoast&referer=yoast&partner=yoast",
		websiteId,
		rowData.id
	) : null;

	if ( ! isEnabled ) {
		return (
			<Fragment>
				<td>?</td>
				<td className="yoast-table--nopadding">?</td>
				<td className="yoast-table--nobreak" />
			</Fragment>
		);
	}

	if ( ! hasChartData ) {
		return (
			<Fragment>
				<td className="yoast-table--nopadding" colSpan="3">
					<WincherSEOPerformanceLoading />
				</td>
			</Fragment>
		);
	}

	return (
		<Fragment>
			<td>{ getKeyphrasePosition( chartData ) }</td>
			<td className="yoast-table--nopadding">{ generatePositionOverTimeChart( chartData ) }</td>
			<td className="yoast-table--nobreak">
				{
					<ViewLink href={ viewLinkURL }>
						{ __( "View", "wordpress-seo" ) }
					</ViewLink>
				}
			</td>
		 </Fragment>
	);
}

/**
 * The WincherTableRow component.
 *
 * @param {Object} props The props to use.
 *
 * @returns {wp.element} The component.
 * @constructor
 */
export default function WincherTableRow( props ) {
	const {
		keyphrase,
		rowData,
		allowToggling,
		onTrackKeyphrase,
		onUntrackKeyphrase,
		isFocusKeyphrase,
	} = props;

	const isEnabled  = ! isEmpty( rowData );

	const toggleAction = useCallback(
		() => {
			if ( isEnabled ) {
				( async() => {
					await onUntrackKeyphrase( keyphrase, rowData.id );
				} )();
			} else {
				( async() => {
					await onTrackKeyphrase( keyphrase );
				} )();
			}
		},
		[ keyphrase, onTrackKeyphrase, onUntrackKeyphrase, isEnabled, rowData ]
	);

	return <tr>
		{ allowToggling && <td>{ renderToggleState( { keyphrase, isEnabled, toggleAction } ) }</td> }
		<td>{ keyphrase }{ isFocusKeyphrase && <span>*</span> }</td>

		{ getPositionalDataByState( props ) }
	</tr>;
}

WincherTableRow.propTypes = {
	allowToggling: PropTypes.bool,
	rowData: PropTypes.object,
	keyphrase: PropTypes.string.isRequired,
	onTrackKeyphrase: PropTypes.func,
	onUntrackKeyphrase: PropTypes.func,
	isFocusKeyphrase: PropTypes.bool,
};

WincherTableRow.defaultProps = {
	allowToggling: true,
	rowData: {},
	onTrackKeyphrase: () => {},
	onUntrackKeyphrase: () => {},
	isFocusKeyphrase: false,
};
