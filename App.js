import React from "react";
import SearchResultsEditor from "./composites/SearchResultEditor/SearchResultEditor";
import SnippetPreview from "./composites/Plugin/SnippetPreview/components/SnippetPreview";
import ContentAnalysis from "./composites/Plugin/ContentAnalysis/components/ContentAnalysis";
import Wizard from "./app/WizardWrapper";
import DashboardWidget from "./app/DashboardWidgetWrapper";
import Loader from "./composites/basic/Loader";

// Required to make Material UI work with touch screens.
import injectTapEventPlugin from "react-tap-event-plugin";

const components = [
	{
		id: "search-results-editor",
		name: "Search results editor",
		component: <SearchResultsEditor />,
	},
	{
		id: "snippet-preview",
		name: "Snippet preview",
		component: <SnippetPreview />,
	},
	{
		id: "wizard",
		name: "Wizard",
		component: <Wizard />,
	},
	{
		id: "loader",
		name: "Loader",
		component: <Loader />,
	},
	{
		id: "content-analysis",
		name: "Content analysis",
		component: <ContentAnalysis />,
	},
	{
		id: "dashboard-widget",
		name: "Dashboard Widget",
		component: <DashboardWidget />,
	}
];

class App extends React.Component {

	constructor() {
		super();

		injectTapEventPlugin();

		this.state = {
			activeComponent: "content-analysis",
		};
	}

	getContent() {
		const activeComponent = this.state.activeComponent;
		for( var i = 0; i < components.length; i++ )  {
			if( activeComponent === components[ i ].id ) {
				return components[ i ].component;
			}
		}
	}

	navigate( activeComponent, event ) {
		this.setState( {
			activeComponent: activeComponent,
		} );
	}

	renderButton( id, title ) {
		const isActive = this.state.activeComponent === id;
		const style = {};
		if( isActive ) {
			style.backgroundColor = "#006671";
			style.color = "#FFF";
			style.borderRadius = "5px";
			style.border = "1px solid white";
			style.outline = "none";
		}
		return (
			<button style={ style } key={ id } type="button" onClick={ this.navigate.bind( this, id ) }>
				{ title }
			</button>
		);
	}

	getMenu() {

		return (
			<nav style={ { textAlign: "center" } }>
				{
					components.map( config => {
						return this.renderButton( config.id, config.name );
					} )
				}
				<p style={ { fontSize: "0.8em", margin: "5px 0" } }>
					For redux devtools press <strong>Ctrl + H</strong>,
					to change position press <strong>Ctrl + Q</strong>.
				</p>
			</nav>
		);
	}

	render() {
		return (
			<div>
				{ this.getMenu() }
				{ this.getContent() }
			</div>
		);
	}
}

export default App;
