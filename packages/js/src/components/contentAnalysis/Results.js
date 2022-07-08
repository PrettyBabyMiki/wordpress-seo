import PropTypes from "prop-types";
import { ContentAnalysis } from "@yoast/analysis-report";
import { Component, Fragment } from "@wordpress/element";
import { Paper } from "yoastseo";

import mapResults from "./mapResults";

/**
 * Wrapper to provide functionality to the ContentAnalysis component.
 */
class Results extends Component {
	/**
	 * The component's constructor.
	 *
	 * @param {Object} props The component's props.
	 *
	 * @constructor
	 */
	constructor( props ) {
		super( props );

		const results = this.props.results;

		this.state = {
			mappedResults: {},
		};

		if ( results !== null ) {
			this.state = {
				mappedResults: mapResults( results, this.props.keywordKey ),
			};
		}

		this.handleMarkButtonClick = this.handleMarkButtonClick.bind( this );
		this.handleEditButtonClick = this.handleEditButtonClick.bind( this );
	}

	/**
	 * If there are new analysis results, map them to their corresponding collapsible
	 * (error, problem, consideration, improvement, good).
	 *
	 * If the results are null, we assume the analysis is still being performed.
	 *
	 * @param {object} prevProps The previous props.
	 *
	 * @returns {void}
	 */
	componentDidUpdate( prevProps ) {
		if ( this.props.results !== null && this.props.results !== prevProps.results ) {
			this.setState( {
				mappedResults: mapResults( this.props.results, this.props.keywordKey ),
			} );
		}
	}

	/**
	 * Handles a click on a marker button, to mark the text in the editor.
	 *
	 * @param {string}   id     Result id, empty if a marker is deselected.
	 * @param {Function} marker The marker function.
	 *
	 * @returns {void}
	 */
	handleMarkButtonClick( id, marker ) {
		// To see a difference between keyphrases: Prepend the keyword key when applicable.
		const markerId = this.props.keywordKey.length > 0 ? `${this.props.keywordKey}:${id}` : id;

		// If marker button is clicked while active, disable markers.
		if ( markerId === this.props.activeMarker ) {
			this.props.setActiveMarker( null );
			this.props.setMarkerPauseStatus( false );
			this.removeMarkers();
		} else {
			this.props.setActiveMarker( markerId );
			marker();
		}
	}

	/**
	 * Handles a click on an edit button to jump to a relevant edit field.
	 *
	 * @param {string}   id     Result id.
	 *
	 * @returns {void}
	 */
	handleEditButtonClick( id ) {
		// If the editor has a Yoast SEO metabox and the SEO tab is not open, click to open it.
		// This can be the case when the user is checking the analysis result from the sidebar.
		const SEOAnalysisMetaboxTab = document.getElementById( "wpseo-meta-tab-content" );
		if ( SEOAnalysisMetaboxTab ) {
			SEOAnalysisMetaboxTab.click();
		}

		if( id === "functionWordsInKeyphrase" || id === "keyphraseLength" ) {
			// If the editor has a metabox, we should jump to the field in the metabox.
			// If the editor only has a sidebar, we jump to the field in the sidebar.
			SEOAnalysisMetaboxTab ?
				document.getElementById( "focus-keyword-input-metabox" ).focus() :
				document.getElementById( "focus-keyword-input-sidebar" ).focus();
		}
		if ( id === "metaDescriptionKeyword" || id === "metaDescriptionLength" ) {
			console.log( "should jump to metadescription input field" );
		}
		if ( id === "titleWidth" ) {
			console.log( "should jump to title input field" );
		}
		if ( id === "slugKeyword" ) {
			console.log( "should jump to slug input field" );
		}
	}

	/**
	 * Removes all markers.
	 *
	 * @returns {void}
	 */
	removeMarkers() {
		window.YoastSEO.analysis.applyMarks( new Paper( "", {} ), [] );
	}

	/**
	 * Renders the Results component.
	 *
	 * @returns {wp.Element} The React element.
	 */
	render() {
		const { mappedResults } = this.state;
		const {
			errorsResults,
			improvementsResults,
			goodResults,
			considerationsResults,
			problemsResults,
		} = mappedResults;

		const { upsellResults } = this.props;

		return (
			<Fragment>
				<ContentAnalysis
					errorsResults={ errorsResults }
					problemsResults={ problemsResults }
					upsellResults={ upsellResults }
					improvementsResults={ improvementsResults }
					considerationsResults={ considerationsResults }
					goodResults={ goodResults }
					activeMarker={ this.props.activeMarker }
					onMarkButtonClick={ this.handleMarkButtonClick }
					onEditButtonClick={ this.handleEditButtonClick }
					marksButtonClassName={ this.props.marksButtonClassName }
					editButtonClassName={ this.props.editButtonClassName }
					marksButtonStatus={ this.props.marksButtonStatus }
					headingLevel={ 3 }
					keywordKey={ this.props.keywordKey }
				/>
			</Fragment>
		);
	}
}

Results.propTypes = {
	results: PropTypes.array,
	upsellResults: PropTypes.array,
	marksButtonClassName: PropTypes.string,
	editButtonClassName: PropTypes.string,
	marksButtonStatus: PropTypes.string,
	setActiveMarker: PropTypes.func.isRequired,
	setMarkerPauseStatus: PropTypes.func.isRequired,
	activeMarker: PropTypes.string,
	keywordKey: PropTypes.string,
};

Results.defaultProps = {
	results: null,
	upsellResults: [],
	marksButtonStatus: "enabled",
	marksButtonClassName: "",
	editButtonClassName: "",
	activeMarker: null,
	keywordKey: "",
};

export default Results;
