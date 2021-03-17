import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { StarRating } from "@yoast/components";
import "./product-data.css";
import { __ } from "@wordpress/i18n";

/**
 * Renders ProductData component.
 *
 * @param {Object} props The props.
 *
 * @returns {React.Component} The StarRating Component.
 */
function ProductDataDesktop( props ) {
	const { shoppingData } = props;

	return (
		<Fragment>
			<StarRating rating={ shoppingData.rating } />
			<span>{ __( "Rating: ", "yoast-components" ) + shoppingData.rating * 2 }/10</span> · ‎
			<span>{ shoppingData.reviewCount + __( "Rating: ", "yoast-components" ) } reviews</span> · ‎
			<span dangerouslySetInnerHTML={ { __html: shoppingData.price } } /> · ‎
			<span>{ shoppingData.availability }</span>
		</Fragment>
	);
}

export default ProductDataDesktop;

ProductDataDesktop.propTypes = {
	shoppingData: PropTypes.object.isRequired,
};
