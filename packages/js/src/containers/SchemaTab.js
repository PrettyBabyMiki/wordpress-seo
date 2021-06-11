import { compose } from "@wordpress/compose";
import { withDispatch, withSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import SchemaTab from "../components/SchemaTab";
import SchemaFields from "../helpers/fields/SchemaFields";
import withLocation from "../helpers/withLocation";
import { isFeatureEnabled } from "@yoast/feature-flag";

/**
 * Function to get props based on the location.
 *
 * @param {string} location The location in which the component is rendered.
 *
 * @returns {object} Props for this location.
 */
const getLocationBasedProps = ( location ) => {
	if ( location === "metabox" ) {
		return {
			helpTextLink: "https://yoa.st/400",
			additionalHelpTextLink: "https://yoa.st/402",
			isMetabox: true,
		};
	}

	return {
		helpTextLink: "https://yoa.st/401",
		additionalHelpTextLink: "https://yoa.st/403",
		isMetabox: false,
	};
};

/**
 * Renders the SchemaComponent.
 *
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} The SchemaTab.
 */
const SchemaTabContainer = ( props ) => {
	const showArticleTypeInput = SchemaFields.articleTypeInput !== null;

	useEffect( () => {
		props.loadSchemaPageData();
		if ( showArticleTypeInput ) {
			props.loadSchemaArticleData();
		}
	}, [] );

	const { pageTypeOptions, articleTypeOptions } = window.wpseoScriptData.metabox.schema;

	const baseProps = {
		articleTypeLabel: __( "Article type", "wordpress-seo" ),
		pageTypeLabel: __( "Page type", "wordpress-seo" ),
		postTypeName: window.wpseoAdminL10n.postTypeNamePlural,
		helpTextTitle: __( "Yoast SEO automatically describes your pages using schema.org", "wordpress-seo" ),
		helpTextDescription: __(
			"This helps search engines understand your website and your content. You can change some of your settings for this page below.",
			"wordpress-seo"
		),
		showArticleTypeInput,
		pageTypeOptions,
		articleTypeOptions,
	};

	const schemaTabProps = {
		...props,
		...baseProps,
		...getLocationBasedProps( props.location ),
	};

	return <SchemaTab { ...schemaTabProps } />;
};

SchemaTabContainer.propTypes = {
	displayFooter: PropTypes.bool.isRequired,
	schemaPageTypeSelected: PropTypes.string.isRequired,
	schemaArticleTypeSelected: PropTypes.string.isRequired,
	defaultArticleType: PropTypes.string.isRequired,
	defaultPageType: PropTypes.string.isRequired,
	loadSchemaPageData: PropTypes.func.isRequired,
	loadSchemaArticleData: PropTypes.func.isRequired,
	schemaPageTypeChange: PropTypes.func.isRequired,
	schemaArticleTypeChange: PropTypes.func.isRequired,
	location: PropTypes.string.isRequired,
};

export default compose( [
	withSelect( select => {
		const {
			getPreferences,
			getPageType,
			getDefaultPageType,
			getArticleType,
			getDefaultArticleType,
		} = select( "yoast-seo/editor" );

		let requiredBlockNames = [];
		let recommendedBlockNames = [];

		if ( isFeatureEnabled( "SCHEMA_BLOCKS" ) ) {
			const {
				getRequiredBlockNames,
				getRecommendedBlockNames,
			} = select( "yoast-seo/schema-blocks" );

			requiredBlockNames = getRequiredBlockNames();
			recommendedBlockNames = getRecommendedBlockNames();
		}

		return {
			displayFooter: getPreferences().displaySchemaSettingsFooter,
			schemaPageTypeSelected: getPageType(),
			schemaArticleTypeSelected: getArticleType(),
			defaultArticleType: getDefaultArticleType(),
			defaultPageType: getDefaultPageType(),
			requiredBlockNames: requiredBlockNames,
			recommendedBlockNames: recommendedBlockNames,
		};
	} ),
	withDispatch( ( dispatch ) => {
		const {
			setPageType,
			setArticleType,
			getSchemaPageData,
			getSchemaArticleData,
		} = dispatch( "yoast-seo/editor" );

		return {
			loadSchemaPageData: getSchemaPageData,
			loadSchemaArticleData: getSchemaArticleData,
			schemaPageTypeChange: setPageType,
			schemaArticleTypeChange: setArticleType,
		};
	} ),
	withLocation(),
] )( SchemaTabContainer );
