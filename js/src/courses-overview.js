import styled from "styled-components";
import { CardDetails, FullHeightCard, utils } from "yoast-components";
import React from "react";
import ReactDOM from "react-dom";
const { getCourseFeed } = utils;

const OuterContainer = styled.ul`
	display: grid;
	grid-template-columns: repeat(auto-fill, 288px);
	grid-column-gap: 16px;
	grid-row-gap: 16px;
	align-items: flex-start;
	padding: 0;
`;

const CourseListItem = styled.li`
	list-style-type: none;
	height: 100%;
	width: 100%;
`;

/**
 * @summary CoursesOverview component.
 */
class CoursesOverview extends React.Component {
	/**
	 * Creates the components and initializes its state.
	 */
	constructor() {
		super();

		this.state = {
			courses: null,
		};

		this.getFeed();
	}

	/**
	 * Fetches data from the yoast.com feed, parses it and sets it to the state.
	 *
	 * @returns {void}
	 */
	getFeed() {
		// Developer note: this link should -not- be converted to a shortlink.
		getCourseFeed( "https://yoast.com/?feed=courses" )
			.then( ( feed ) => {
				feed.items = feed.items.map( ( item ) => {
					return item;
				} );
				this.setState( { courses: feed.items } );
			} )
			/* eslint-disable-next-line no-console */
			.catch( error => console.log( error ) );
	}

	/**
	 * Converts the relevant data in a course to a header object.
	 *
	 * @param {string} course to create a header for.
	 *
	 * @returns {Object} the header object.
	 */
	getHeaderData( course ) {
		return {
			image: course.image,
			title: course.title,
			link: course.link,
		};
	}

	/**
	 * Render the component.
	 *
	 * @returns {ReactElement} The OuterContainer component which contains all the courses cards.
	 */
	render() {
		const courses = this.state.courses;

		if ( courses === null ) {
			return null;
		}

		return (
			<OuterContainer>
				{ courses.map( course =>
					<CourseListItem key={ course.id }>
						<FullHeightCard
							className={ "CourseCard" }
							id={ course.id }
							header={ this.getHeaderData( course ) }
							banner={ course.bannertext ? { text: course.bannertext } : null }
						>
							<CardDetails
								title={ course.title }
								description={ course.content }
								courseUrl={ course.link }
								shopUrl={ course.shopUrl }
							/>
						</FullHeightCard>
					</CourseListItem>
				) }
			</OuterContainer>
		);
	}
}

const element = document.getElementById( "yoast-courses-overview" );

if ( element ) {
	ReactDOM.render( <CoursesOverview />, element );
}
