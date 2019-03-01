// External dependencies.
import { setLocaleData } from "@wordpress/i18n";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import testPapers from "yoastspec/fullTextTests/testTexts";
import Paper from "yoastsrc/values/Paper";
import getMorphologyData from "yoastspec/specHelpers/getMorphologyData";
import getLanguage from "yoastsrc/helpers/getLanguage";

// Internal dependencies.
import Collapsible from "./components/Collapsible";
import { ColumnLeft, ColumnRight, Columns } from "./components/Columns";
import { Container } from "./components/Container";
import Controls from "./components/Controls";
import Inputs from "./components/Inputs";
import Markings from "./components/Markings";
import RelevantWords from "./components/RelevantWords";
import Results from "./components/Results";
import TreeView from "./components/TreeView";
import WorkerStatus from "./components/WorkerStatus";
import { setResults } from "./redux/actions/results";
import { setStatus } from "./redux/actions/worker";
import formatAnalyzeResult from "./utils/formatAnalyzeResult";

class App extends React.Component {
	/**
	 * Initializes the App component.
	 *
	 * @param {Object} props               The props.
	 * @param {Object} props.configuration The store configuration.
	 * @param {Object} props.paper         The store paper.
	 * @param {Object} props.results       The store analyses results.
	 * @param {Object} props.actions       The dispatch actions.
	 *
	 * @constructor
	 */
	constructor( props ) {
		super( props );

		this.initialize = this.initialize.bind( this );
		this.analyze = this.analyze.bind( this );
		this.analyzeSpam = this.analyzeSpam.bind( this );

		this.initialize();

		// Prevent yoast-component i18n console error by initializing as an empty domain.
		setLocaleData( { "": {} }, "yoast-components" );
	}

	/**
	 * Initialize the analysis worker.
	 *
	 * @returns {void}
	 */
	initialize() {
		const { configuration, worker, useMorphology, paper } = this.props;
		const config = {
			...configuration,
			researchData: {
				morphology: useMorphology ? getMorphologyData( getLanguage( paper.locale ) ) : {},
			},
		};

		worker.initialize( config )
			.then( () => this.analyze() );
	}

	/**
	 * Requests the analyses results from the worker.
	 *
	 * @param {Object} paper The paper to analyze.
	 *
	 * @returns {void}
	 */
	analyze( paper = this.props.paper ) {
		const { setWorkerStatus, setAnalyzeResults, worker, isRelatedKeyphrase } = this.props;
		const paperToAnalyze = Paper.parse( paper );

		setWorkerStatus( "analyzing" );

		if ( isRelatedKeyphrase ) {
			worker.analyzeRelatedKeywords( Paper.parse( paper ), {
				relatedKeyphrase: {
					keyword: paperToAnalyze.getKeyword(),
					synonyms: paperToAnalyze.getSynonyms(),
				},
			} )
				.then( ( { result } ) => {
					setWorkerStatus( "idling" );
					setAnalyzeResults( formatAnalyzeResult( result, "relatedKeyphrase" ) );
				} );
		} else {
			worker.analyze( paperToAnalyze )
				.then( ( { result } ) => {
					setWorkerStatus( "idling" );
					setAnalyzeResults( formatAnalyzeResult( result, "" ) );
				} );
		}
	}

	/**
	 * Runs analysis on the full-text test papers.
	 *
	 * @returns {void}
	 */
	analyzeSpam() {
		for ( let i = 0; i < 10; i++ ) {
			testPapers.forEach( ( { paper } ) => {
				this.analyze( {
					text: paper._text,
					...paper._attributes,
				} );
			} );
		}
	}

	/**
	 * Renders the app.
	 *
	 * @returns {React.Element} The app.
	 */
	render() {
		return <Fragment>
			<Columns minWidth="768px">
				<ColumnLeft minWidth="768px">
					<Collapsible title="Input">
						<Inputs />
					</Collapsible>
				</ColumnLeft>

				<ColumnRight minWidth="768px">
					<Collapsible title="Results">
						<Results />
					</Collapsible>
				</ColumnRight>
			</Columns>

			<Container>
				<Collapsible title="Markings">
					<Markings />
				</Collapsible>
			</Container>

			<Container>
				<Collapsible title="Worker status">
					<WorkerStatus />
				</Collapsible>
			</Container>

			<Container>
				<Collapsible title="Controls">
					<Controls
						onInitialize={ this.initialize }
						onAnalyze={ this.analyze }
						onAnalyzeSpam={ this.analyzeSpam }
					/>
				</Collapsible>
			</Container>

			<Container>
				<Collapsible title="Tree" initialIsOpen={ false }>
					<TreeView />
				</Collapsible>
			</Container>

			<Container>
				<Collapsible title="Relevant words" initialIsOpen={ false }>
					<RelevantWords />
				</Collapsible>
			</Container>

			<ul>
				<li>Debugging information</li>
				<li>Worker communication</li>
				<li>Buttons for standard texts in different languages (English only at the moment)</li>
				<li>Language switcher</li>

				<li>All research data</li>
				<li>Relevant words</li>

				<li>Performance information</li>
				<li>Add button to trigger a ton of analyses continuously. This can be used to check for performance & memory leaks.</li>
			</ul>
		</Fragment>;
	}
}

export default connect(
	( state ) => {
		return {
			paper: state.paper,
			useKeywordDistribution: state.configuration.useKeywordDistribution,
			isRelatedKeyphrase: state.options.isRelatedKeyphrase,
			useMorphology: state.options.useMorphology,
		};
	},
	( dispatch ) => {
		return {
			setAnalyzeResults: results  => dispatch( setResults( results ) ),
			setWorkerStatus: status => dispatch( setStatus( status ) ),
		};
	},
)( App );
