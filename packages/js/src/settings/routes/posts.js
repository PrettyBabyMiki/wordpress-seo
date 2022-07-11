import { createInterpolateElement, useMemo } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { SelectField } from "@yoast/ui-library";
import { get, map } from "lodash";
import {
	FieldsetLayout,
	FormikFlippedToggleField,
	FormikMediaSelectField,
	FormikReplacementVariableEditorField,
	FormikValueChangeField,
	FormLayout,
} from "../components";
import { useSelectSettings } from "../store";

/**
 * @param {{name: string, value: string|number|bool}[]} types Schema types.
 * @returns {{label: string, value: string|number|bool}[]} Options.
 */
const transformSchemaTypesToOptions = types => map( types, ( { name, value } ) => ( { label: name, value } ) );

/**
 * @returns {JSX.Element} The homepage route.
 */
const Posts = () => {
	const postType = "post";
	const postTypePlural = "Posts";
	const postTypeSingular = "Post";
	const replacementVariables = useSelectSettings( "selectReplacementVariablesFor", [], postType );
	const recommendedReplacementVariables = useSelectSettings( "selectRecommendedReplacementVariablesFor", [], postType );
	const recommendedSize = useMemo( () => createInterpolateElement(
		sprintf(
			/**
			 * translators: %1$s expands to an opening strong tag.
			 * %2$s expands to a closing strong tag.
			 * %3$s expands to the recommended image size.
			 */
			__( "Recommended size for this image is %1$s%3$s%2$s", "wordpress-seo" ),
			"<strong>",
			"</strong>",
			"1200x675",
		),
		{
			strong: <strong className="yst-font-semibold" />,
		},
	) );
	const pageTypes = useMemo( () => transformSchemaTypesToOptions( get( window, "wpseoScriptData.schema.pageTypeOptions", [] ) ), [] );
	const articleTypes = useMemo( () => transformSchemaTypesToOptions( get( window, "wpseoScriptData.schema.articleTypeOptions", [] ) ), [] );

	return (
		<FormLayout title={ postTypePlural }>
			<FieldsetLayout
				title={ __( "Search appearance", "wordpress-seo" ) }
				description={ sprintf(
					// translators: %1$s expands to the post type plural, e.g. Posts.
					__( "Choose how your %1$s should look in search engines.", "wordpress-seo" ),
					postTypePlural,
				) }
			>
				<FormikFlippedToggleField
					name={ `wpseo_titles.noindex-${ postType }` }
					data-id={ `input:wpseo_titles.noindex-${ postType }` }
					label={ sprintf(
						// translators: %1$s expands to the post type plural, e.g. Posts.
						__( "Show %1$s in search results", "wordpress-seo" ),
						postTypePlural,
					) }
					description={ sprintf(
						// translators: %1$s expands to the post type plural, e.g. Posts.
						__( "Disabling this means that %1$s will not be indexed by search engines and will be excluded from XML sitemaps.", "wordpress-seo" ),
						postTypePlural,
					) }
				/>
				<FormikReplacementVariableEditorField
					type="title"
					name={ `wpseo_titles.title-${ postType }` }
					fieldId={ `input:wpseo_titles.title-${ postType }` }
					label={ __( "SEO title", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
				/>
				<FormikReplacementVariableEditorField
					type="description"
					name={ `wpseo_titles.metadesc-${ postType }` }
					fieldId={ `input:wpseo_titles.metadesc-${ postType }` }
					label={ __( "Meta description", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					className="yst-replacevar--description"
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Social appearance", "wordpress-seo" ) }
				description={ sprintf(
					// translators: %1$s expands to the post type plural, e.g. Posts. %2$s expands to the post type singular, e.g. Post.
					__( "Choose how your %1$s should look on social media by default. You can always customize this per individual %2$s.", "wordpress-seo" ),
					postTypePlural,
					postTypeSingular,
				) }
			>
				<FormikMediaSelectField
					id={ `wpseo_titles.social-image-url-${ postType }` }
					label={ __( "Social image", "wordpress-seo" ) }
					previewLabel={ recommendedSize }
					mediaUrlName={ `wpseo_titles.social-image-url-${ postType }` }
					mediaIdName={ `wpseo_titles.social-image-id-${ postType }` }
				/>
				<FormikReplacementVariableEditorField
					type="title"
					name={ `wpseo_titles.social-title-${ postType }` }
					fieldId={ `input:wpseo_titles.social-title-${ postType }` }
					label={ __( "Social title", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
				/>
				<FormikReplacementVariableEditorField
					type="description"
					name={ `wpseo_titles.social-description-${ postType }` }
					fieldId={ `input:wpseo_titles.social-description-${ postType }` }
					label={ __( "Social description", "wordpress-seo" ) }
					replacementVariables={ replacementVariables }
					recommendedReplacementVariables={ recommendedReplacementVariables }
					className="yst-replacevar--description"
				/>
			</FieldsetLayout>
			<hr className="yst-my-8" />
			<FieldsetLayout
				title={ __( "Schema", "wordpress-seo" ) }
				description={ sprintf(
					// translators: %1$s expands to the post type plural, e.g. Posts. %2$s expands to the post type singular, e.g. Post.
					__( "Choose how your %1$s should be described by default in your site's Schema.org markup. You can change these setting per individual %2$s.", "wordpress-seo" ),
					postTypePlural,
					postTypeSingular,
				) }
			>
				<FormikValueChangeField
					as={ SelectField }
					type="select"
					name={ `wpseo_titles.schema-page-type-${ postType }` }
					id={ `input:wpseo_titles.schema-page-type-${ postType }` }
					label={ __( "Page type", "wordpress-seo" ) }
					options={ pageTypes }
				/>
				<FormikValueChangeField
					as={ SelectField }
					type="select"
					name={ `wpseo_titles.schema-article-type-${ postType }` }
					id={ `input:wpseo_titles.schema-article-type-${ postType }` }
					label={ __( "Article type", "wordpress-seo" ) }
					options={ articleTypes }
				/>
			</FieldsetLayout>
		</FormLayout>
	);
};

export default Posts;
