import Collapsible from "./SidebarCollapsible";
import { __, sprintf } from "@wordpress/i18n";
import { MultiSelect, Select } from "@yoast/components/src/select/Select";
import RadioButtonGroup from "@yoast/components/src/radiobutton/RadioButtonGroup";
import TextInput from "@yoast/components/src/inputs/TextInput";
import { curryUpdateToHiddenInput, getValueFromHiddenInput } from "@yoast/helpers";
import { Component } from "@wordpress/element";
import { Fragment } from "react";
import { Alert } from "@yoast/components";

/**
 * Boolean to check whether the current object refers to a post or a taxonomy.
 */
const isPost = window.wpseoAdminL10n.postType === "post";

/**
 * The values that are used for the noIndex field differ for posts and taxonomies. This function returns an array of
 * options that can be used to populate a select field.
 *
 * @returns {void} Array Returns an array of options for the noIndex setting.
 */
const getNoIndexOptions = () => {
	const noIndex = window.wpseoAdminL10n.noIndex ? "No" : "Yes";
	if ( isPost ) {
		return [
			{
				name: sprintf(
					__( "Default for %s, currently: %s", "wordpress-seo" ),
					window.wpseoAdminL10n.label,
					noIndex,
				),
				value: "0",
			},
			{ name: __( "No", "wordpress-seo" ), value: "1" },
			{ name: __( "Yes", "wordpress-seo" ), value: "2" },
		];
	}
	return [
		{
			/* Translator: %s translates to the Post Label, %s translates to the indexOption */
			name: sprintf(
				__( "Default for %s, currently: %s", "wordpress-seo" ),
				window.wpseoAdminL10n.label,
				noIndex,
			),
			value: "default",
		},
		{ name: __( "Yes", "wordpress-seo" ), value: "index" },
		{ name: __( "No", "wordpress-seo" ), value: "noindex" },
	];
};

/**
 * Functional component for the Meta Robots No-Index option.
 *
 * @returns {Component} The Meta Robots No-Index component.
 */
const MetaRobotsNoIndex = () => {
	const hiddenInputId = isPost ? "#yoast_wpseo_meta-robots-noindex" : "#hidden_wpseo_noindex";
	const value = getValueFromHiddenInput( hiddenInputId );
	return <Fragment>
		{
			window.wpseoAdminL10n.privateBlog &&
			<Alert type="warning">
				{ __(
					"Even though you can set the meta robots setting here, the entire site is set to noindex in the sitewide privacy settings," +
					"so these settings won't have an effect.",
					"wordpress-seo"
				) }
			</Alert>
		}
		<Select
			label={
				sprintf(
					__( "Allow search engines to show this %s in search results?", "wordpress-seo" ),
					window.wpseoAdminL10n.labelSingular,
				) }
			onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
			name={ "yoast_wpseo_meta-robots-noindex-react" }
			id={ "yoast_wpseo_meta-robots-noindex-react" }
			options={ getNoIndexOptions() }
			selected={ value }
		/>
	</Fragment>;
};

/**
 * Functional component for the Meta Robots No-Follow option.
 *
 * @returns {Component} The Meta Robots No-Follow option.
 */
const MetaRobotsNoFollow = () => {
	const hiddenInputId = "#yoast_wpseo_meta-robots-nofollow";
	const value = getValueFromHiddenInput( hiddenInputId );

	return <RadioButtonGroup
		options={ [ { value: "0", label: "Yes" }, { value: "1", label: "No" } ] }
		label={ sprintf(
			__( "Should search engines follow links on this %s", "wordpress-seo" ),
			window.wpseoAdminL10n.labelSingular,
		) }
		groupName="yoast_wpseo_meta-robots-nofollow-react"
		onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
		selected={ value }
	/>;
};

/**
 * Functional component for the Meta Robots Advanced field.
 *
 * @returns {Component} The Meta Robots advanced field component.
 */
const MetaRobotsAdvanced = () => {
	const hiddenInputId = "#yoast_wpseo_meta-robots-adv";
	const value = getValueFromHiddenInput( hiddenInputId );

	return <MultiSelect
		label={ __( "Meta robots advanced", "wordpress-seo" ) }
		onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
		name="yoast_wpseo_meta-robots-adv-react"
		id="yoast_wpseo_meta-robots-adv-react"
		options={ [
			{ name: __( "No Image Index", "wordpress-seo" ), value: "noimageindex" },
			{ name: __( "No Archive", "wordpress-seo" ), value: "noarchive" },
			{ name: __( "No Snippet", "wordpress-seo" ), value: "nosnippet" },
		] }
		selected={ value.split( "," ) }
	/>;
};

/**
 * Functional component for the Breadcrumbs Title.
 *
 * @returns {Component} The Breadcrumbs title component.
 */
const BreadCrumbsTitle = () => {
	const hiddenInputId = isPost ? "#yoast_wpseo_bctitle" : "#hidden_wpseo_bctitle";
	const value = getValueFromHiddenInput( hiddenInputId );

	return <TextInput
		label={ __( "Breadcrumbs Title", "wordpress-seo" ) }
		id="yoast_wpseo_bctitle-react"
		name="yoast_wpseo_bctitle-react"
		onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
		value={ value }
	/>;
};

/**
 * Functional component for the Canonical URL.
 *
 * @returns {Component} The canonical URL component.
 */
const CanonicalURL = () => {
	const hiddenInputId = isPost ? "#yoast_wpseo_canonical" : "#hidden_wpseo_canonical";
	const value = getValueFromHiddenInput( hiddenInputId );

	return <TextInput
		label={ __( "Canonical URL", "wordpress-seo" ) }
		id="yoast_wpseo_canonical-react"
		name="yoast_wpseo_canonical-react"
		onChange={ curryUpdateToHiddenInput( hiddenInputId ) }
		value={ value }
	/>;
};


/**
 * Class that renders the Advanced Settings tab.
 */
class AdvancedSettings extends Component {
	/**
	 * Returns all the fields that should be in the Advanced Settings tab based on global settings.
	 *
	 * @returns {Component} The Advanced settings tab.
	 */
	render() {
		return (
			<Collapsible id={ "yoast-cornerstone-collapsible" } title={ __( "Advanced", "wordpress-seo" ) }>
				<MetaRobotsNoIndex />
				{ isPost && <MetaRobotsNoFollow /> }
				{ isPost && <MetaRobotsAdvanced /> }
				{
					! window.wpseoAdminL10n.breadcrumbsDisabled && <BreadCrumbsTitle />
				}
				<CanonicalURL />
			</Collapsible>
		);
	}
}

export default AdvancedSettings;
