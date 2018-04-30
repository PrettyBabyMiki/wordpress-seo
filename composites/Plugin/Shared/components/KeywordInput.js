import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import colors from "../../../../style-guide/colors.json";
import PropTypes from "prop-types";

let KeywordField = styled.input`
	margin-right: 0.5em;
	border-color: ${ props => props.borderColor };
`;

const ErrorText = styled.div`
	font-size: 1em;
	color: ${ colors.$color_red};
	margin: 1em 0;
	min-height: 1.8em;
`;

class KeywordInput extends React.Component {

	constructor( props ) {
		super( props );

		this.state = {
			showErrorMessage: false,
			keyword: props.keyword,
		};
	}

	checkKeywordInput( keywordText ) {
		let separatedWords = keywordText.split( "," );
		if ( separatedWords.length > 1 ) {
			this.setState( { showErrorMessage: true } );
		}
		else {
			this.setState( { showErrorMessage: false } );
		}

	}

	displayErrorMessage( input = "" ) {
		if ( this.state.showErrorMessage && input !== "" ) {
			return (
				<ErrorText>
					<FormattedMessage
						id="KeywordError"
						defaultMessage= "Are you trying to use multiple keywords? You should add them separately below."
						role="alert"
					/>
				</ErrorText>
			);
		}
		return (
			<ErrorText />
		);
	}

	handleChange( event ) {
		this.setState( { keyword: event.target.value } );
		this.checkKeywordInput( event.target.value );
	}

	render() {
		let color = this.state.showErrorMessage ? "red" : "white";
		KeywordField[ "border-color" ] = color;
		return(
			<React.Fragment>
				<label htmlFor={ this.props.id }>
					{ this.props.label }
				</label>
				<KeywordField type="text" id={ this.props.id }
							  onChange={ this.handleChange.bind( this ) }
							  borderColor={ color }
				/>
				{ this.displayErrorMessage( this.state.keyword ) }
			</React.Fragment>
		);
	}
}

KeywordInput.propTypes = {
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	label: PropTypes.oneOfType( [
		PropTypes.string,
		PropTypes.array,
	] ).isRequired,
	keyword: PropTypes.string,
};

KeywordInput.defaultProps = {
	keyword: "",
};

export default KeywordInput;

