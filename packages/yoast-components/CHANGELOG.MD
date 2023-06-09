# Change Log

All notable changes to this project will be documented in this file.
We follow [Semantic Versioning](http://semver.org/).

## 5.24.1 March 2nd, 2023
### Bugfixes
* Fixes a security issue.

## 5.12.1 November 2nd, 2020
### Bugfixes
* Deprecates `OnboardingWizard`, `MessageBox`, `LoadingIndicator`. Use the `@yoast/configuration-wizard` instead.

## 5.12.0 October 13th, 2020
### Enhancements
* Changes the look of the KeyphraseInput component's errors.
* Improves accessibility of the KeyphraseInput component's errors list.
* Adds a `hasError` prop to the KeywordInput component.

### Bugfixes
* Fixes a bug where the YoastReactSelect component would not show the border and inner shadow correctly.
* Fixes a bug where the font size and weight for the KeywordInput label would not be set correctly.

## 5.8.0 August 3rd, 2020
### Enhancements
* Adds a label to the internal linking suggestions, indicating the post type or taxonomy name of the suggested post or term.
* Changes the message the user receives in the internal linking suggestions container. The message now includes a notification to add a title and/or a metadescription (if those are missing) to improve the quality of internal linking suggestions.

## 5.7.0 July 6th, 2020
### Enhancements
* Changes the message the user receives in the internal linking suggestions container. The message now includes a notification to add a title and/or a metadescription (if those are missing) to improve the quality of internal linking suggestions.

## 5.2.0 April 23rd, 2020
### Added
* Adds a CSS test stub.

## 4.39.0 January 6th, 2019
### Other
* Drops IE11 support through configuring Babel to use the preset environment with the own list of supported browsers specified.

## 4.38.0 November 26th, 2019
### Other
* Removed the components related to the Help Center and the AlgoliaSearcher package

## 4.36.0 November 11th, 2019
### Enhancements
* Improves the `KeywordInput` and `SynonymsInput` styling for consistency with the new WordPress 5.3 admin styles.

## 4.34.0 October 14th, 2019
### Fixed
* Fixes a bug where internal linking suggestions were not aligned correctly, but were indented instead.

## 4.30.0 July 22nd, 2019
### Added
* In the internal linking suggestions component, adds a check for the presence of the prominent words to determine which of the feedback strings should be rendered. If no prominent words are determined for a text (and hence no suggestions), the old message "Once you add a bit more copy..." is rendered. If prominent words are determined, but still no suggestions could be found, a new message is rendered: "We could not find any relevant articles on your website that you could link your post to.".

### Other
* Replaced babel-preset-es2015 with babel-preset-env, as babel-preset-es2015 is deprecated.

## 4.28.0 June 24th, 2019
### Changed
* Updates the CSS autoprefixer configuration to drop support for old Internet Explorer versions.

## 4.27.0 June 11th, 2019
### Changed
* Removes the margin from the `KeywordInput` component.

## 4.26.0 May 27th, 2019
### Changed
* Changes `KeywordInput`'s `id` prop to be required

## 4.25.0 May 14th, 2019
### Fixed
* Improved handling of the `rel` attribute for links that open in a new browser's tab.

## 4.24.0 April 29th, 2019
* The following packages have been split out from `@yoast/yoast-components`. Please use these packages in the future:
  * `@yoast/algolia-search-box`
  * `@yoast/components`
  * `@yoast/configuration-wizard`
  * `@yoast/eslint`
  * `@yoast/helpers`
  * `@yoast/search-metadata-previews`
  * `@yoast/social-metadata-previews`
  * `@yoast/style-guide`
  * `@yoast/social-previews`

## 4.23.1 April 15th, 2019
### Other
* Updated the `styled-components` package to v4+.

## 4.23.0 April 1st, 2019
### Added
* Adds an autocomplete prop to the following components: `Step`, `Textfield`, and `Input`.

### Fixed
* Restores the focus indication on the title separators in the onboarding wizard.

### Other
* Makes the previous and next buttons in the `OnboardingWizard` component look like links.

## 4.22.0 March 11th, 2019
### Added
* Adds `keywordForms` field to the `SnippetPreview` and `SnippetEditor` components to be able to highlight word forms of the keyphrase in the preview.
* Adds step-specific hashes to the URL in the `OnboardingWizard` component to make navigation easier.

### Fixed
* Fixes a bug where the standalone would not load in IE11.

## 4.21.0 February 25th, 2019
### Other
* Changed the AnalysisList pressed status check to listen to `result.markerId` instead of `result.id`.
* Upgrades webpack-dev-server to 3.1.14.
* Bumps YoastSEO.js version to 1.48.0.

## 4.20.0 February 11th, 2019
### Other
* Changed the default icon for the `Collapsible` component to chevrons.
* Bumps YoastSEO.js version to 1.47.0.

## 4.19.0 January 21st, 2019
### Added
* Adds a card component.

### Removed
* Removes autocomplete functionality from the Keyphrase and Synonyms input fields.

### Other
* Bumps YoastSEO.js version to 1.46.0.

## 4.18.1 January 7th, 2019
### Other
* Change eslint config to make sure tag build passes.

## 4.18.0 January 7th, 2019
### Other
* Bumps YoastSEO.js version to 1.45.0.

## 4.17.0 December 17th, 2018
### Added
* Adds onBlur and onFocus prop to SynonymsInput component.
* Adds buildStructuredUrl function.
* Adds an exclamation triangle to the SvgIcon component.
* Adds a YoastWarning component that consists of an exclamation triangle followed by a message on a yellow background.

## 4.16.0 November 19th, 2018
### Added
* Adds an Id prop to the Collapsible and ButtonSection component.

### Removed
* Removes logic that remembers what marker button is active from the `ContentAnalysis` components.

## 4.15.0 November 5th, 2018
### Added
* Adds a fieldId prop in the `ReplacementVariableEditorStandalone` component, that gets added as an id attribute to the DraftJS editor element with the contenteditable attribute.

### Other
* Changes `$palette_grey_text` from #646464 to #616161 to have a sufficient color contrast ratio on #dddddd backgrounds.

## 4.14.1 October 29th, 2018
### Other
* Bumps YoastSEO.js to 1.41.1.

## 4.14.0 October 22nd, 2018
### Added
* Adds an `UpsellButton` component.
* Adds an `UpsellLinkButton` component.
* Adds `label` and `ariaLabel` props to the `KeywordInput` component.
* Adds an id to the `ReplacementVariableEditorStandalone` component.

### Other
* Replaces the help text in the `SynonymsInput` by a help link icon.

## 4.13.0 October 8th, 2018
### Other
* Compatibility with Yoast SEO 8.4.

## 4.12.1 September 24th, 2018
### Other
* Compatibility with Yoast SEO 8.3.

## 4.12.0 September 24th, 2018
### Other
* Compatibility with Yoast SEO 8.3.

## 4.11.0 September 10th, 2018
### Fixed
* Fixes a bug where the placeholder "Modify your meta description by editing it right here" wasn't translatable.

### Added
* Exposes `AnalysisList` to render a plain list of content analysis results.
* Exposes `renderRatingToColor` which renders a rating received from YoastSEO.js to a color that can be used in CSS.

## 4.10.1 August 28th, 2018
### Fixed
* Fixes an incorrect import of `YoastButton` in `index.js`.

## 4.10.0 August 27th, 2018
### Added
* Adds a `ButtonSection` component.
* Adds a `loadingSpinner` svg icon.

### Fixed
* Fixes a bug where an invalid icon warning was thrown because no icon was provided to the `IconsButton`.
* Fixes a bug where only the header of the `ButtonSection` component was clickable, instead of the entire component.

### Other
* Improves the keyword input field focus style and contrast ratio.

## 4.9.0 August 13th, 2018
### Added
* Adds a standalone `LanguageNotice` component. Before, this component was part of the `ContentAnalysis` component.
* Adds a `HelpText` component.
* Adds a label to the `KeywordInput` component.
* Adds an `onBlur` event to the `KeywordInput` component.
* Adds a button to the `KeywordInput` component that allows removal of that keyword section.
* Adds a `ContentOptimizationContainer` component.
* Adds a `SynonymsInput` component.
* Adds a `CornerstoneToggle` component.
* Adds a demo page for the SVG icons rendered by the SvgIcon component to the App.
* Adds a subtitle to the `CollapsibleHeader` component.

### Removed
* Removes the `helpTextButton` from the `SnippetPreview` component as it has been replaced by a description that is always present.

### Fixed
* Fixes the styling of the `Collapsible` component for right-to-left languages.
* Fixes a bug where the `Collapsible` component would show scrollbars in Internet Explorer 11.

### Other
* Increases the font size of the synonyms help text and changes its color.
* Makes it possible to render multi-shape SVG icons.
* Adds clipboard and a11y-speak to the package.json.

## 4.8.0 July 25th, 2018
### Added
* Add setOverallSeoScore and setOverallReadabilityScore reducer.
* Add help text to the content analysis in the standalone.
* Add a IconLabeledButton component to render a button with visible textual label.

### Fixed
* Fix alignment of video in help center when no ads are present.

## 4.7.0 July 3rd, 2018
### Added
* Adds synonyms components.

### Fixes
* Fixes the CSS media query to target IE11 used for the buttons min-height.

### Removed
* Removes the unused replaceKeyword action.

## 4.6.2 July 2nd, 2018
### Fixes
* Fixes a bug where console errors would be thrown because `ref` instead of `innerRef` was used in the `ReplacementVariableEditor`.

## 4.6.0 July 2nd, 2018
### Added
* Adds Styled Component's `withTheme` to the `ReplacementVariableEditorStandalone` component in order to set the `textDirectionality ` of the `Editor` based on the language direction that is passed to the theme.

## 4.5.0 June 29nd, 2018
### Fixes
* Fixes the styling of the `ModeSwitcher`, `SnippetEditor`, `HelpTextWrapper`, `SnippetPreview` and `StyledSection` for right-to-left languages. [#629](https://github.com/Yoast/yoast-components/pull/629/files)
* Fixes a bug where the snippet variable suggestions would disappear behind the admin menu bar when using a right-to-left language. [#628](https://github.com/Yoast/yoast-components/pull/628/files)
* Fixes the 'insert snippet variable' button alignment by using only CSS and removing the JS widths calculations. [#618](https://github.com/Yoast/yoast-components/pull/618/files)

## 4.4.0 June 22nd, 2018

### Changes
* `ReplacementVariableEditor` adds a space after replacement variable when there is no space yet. [#616](https://github.com/Yoast/yoast-components/pull/616)
* Entities in `ReplacementVariableEditor` can no longer be partially selected. [#607](https://github.com/Yoast/yoast-components/pull/607)

### Fixes
* Improved change detection of replacement variables in `SnippetEditor`. [#610](https://github.com/Yoast/yoast-components/pull/610/files)

## 4.3.0 June 22nd, 2018

### Added
* Added `ErrorBoundary` component to be used in the `SnippetEditor`. [#605](https://github.com/Yoast/yoast-components/pull/605)

### Changes
* Let the padding on the `StyledSection` depend on the title. [#606](https://github.com/Yoast/yoast-components/pull/606)
* Implements an option for the paper style in the styled section component. [#612](https://github.com/Yoast/yoast-components/pull/612)
* Moves the margin bottom from the FormSections to the CloseSnippetEditor button. [#615](https://github.com/Yoast/yoast-components/pull/615)

### Fixes
* Clicking the entire meta description field in `SnippetEditor` will now focus the input. [#600](https://github.com/Yoast/yoast-components/pull/600)
* Improved snippet editor placeholder contrast. [#603](https://github.com/Yoast/yoast-components/pull/603)
* Fixes an issue where in cases with a lot of snippet variables it would sometimes be partially hidden behind the WordPress toolbar. [#604](https://github.com/Yoast/yoast-components/pull/604)
* Handle cut and paste behaviour in the `ReplacementVariableEditor`. [#611](https://github.com/Yoast/yoast-components/pull/611)

## 4.2.0 June 12nd, 2018

### Added
- Implements the draft-js-single-line-plugin in order to keep the Draft-js Editor from creating new blocks on enter presses and pasting newlines.
- Adds a meta description placeholder text.
- Adds a SettingsSnippetEditor component.
- Adds a button to the snippet editor to improve discoverability of the snippet variables.

### Removed
- Removes logic for decoding separators. This logic has been moved to wordpress-seo.

### Fixed
- Fixes a bug where the snippet editor fields would stay in an isActive state when blurred.
- Fixes a bug where the progress bars for the snippet title and description wouldn't respond correctly to the content of the input fields.
- Fixes a bug where multiple spaces and spaces at the beginning and end of the snippet description were taken into account for the description length progress calculation.
- Fixes a bug where the snippet variable suggestions would be sometimes positioned outside of the viewport.

### Other
- Changes the replacement variable editor to automatically replace snippet variables with entities.
- Improves the Help text accessibility and introduces a SlideToggle component based on react-transition-group.

## 4.1.0 May 23rd, 2018

### Changes
* Maximum meta description length now retrieved from `yoastseo`.
* Improve the Snippet Preview rendering with long text.
* Better encode SVG images used as CSS background.
* Snippet editor no longer manages the slug in local state.
* Entire meta description field can now be clicked to focus the editor.
* Removed `react-intl` remnants, which was removed in `v4.0.0`.
* Snippet preview now decodes the separator replacement variable before it is passed along to the renderer.

## 4.0.2 May 17th, 2018

### Added

* Added metadescription placeholder to `SnippetEditor`.
* Replace the replace vars before measuring the title and description length to get the correct length.

### Fixes

* Fixes a problem with the Snippet Editor where it would crash when receiving new content.

## 4.0.1 May 17th, 2018

### Fixes

* Fixes progress bars in `SnippetEditor`.

## 4.0.0 May 16th, 2018

### Breaking changes

* Changed library used for translation from `react-intl` to `@wordpress/i18n`. [#494](https://github.com/Yoast/yoast-components/pull/494), [#469](https://github.com/Yoast/yoast-components/pull/496), [#497](https://github.com/Yoast/yoast-components/pull/497), [#498](https://github.com/Yoast/yoast-components/pull/498), [#500](https://github.com/Yoast/yoast-components/pull/500), [#505](https://github.com/Yoast/yoast-components/pull/505), [#506](https://github.com/Yoast/yoast-components/pull/506), [#507](https://github.com/Yoast/yoast-components/pull/507), [#508](https://github.com/Yoast/yoast-components/pull/508)

### Added

* Added `HelpText` component. [#480](https://github.com/Yoast/yoast-components/pull/480)
* Added `KeywordInput` component. [#482](https://github.com/Yoast/yoast-components/pull/482)
* Added help text drop down to `SnippetEditor`. [#517](https://github.com/Yoast/yoast-components/pull/517)

### Changed

* Added trailing slashes to `SnippetPreview` url desktop preview. [#526](https://github.com/Yoast/yoast-components/pull/526)
* Improved `SnippetEditor` mentions suggestions accessibility. [#525](https://github.com/Yoast/yoast-components/pull/525)
* URL safe characters are preserved in the `SnippetPreview`. [#520](https://github.com/Yoast/yoast-components/pull/520)
* Transliterated keywords are highlighted in title and description in `SnippetPreview`. [#519](https://github.com/Yoast/yoast-components/pull/519), [#521](https://github.com/Yoast/yoast-components/pull/521), [#522](https://github.com/Yoast/yoast-components/pull/522)
* The `SnippetEditor` slug input field has been changed from a `DraftJS` editor to a regular input field. [#515](https://github.com/Yoast/yoast-components/pull/515)
* Dashes and question marks get stripped from the `SnippetEditor` url preview. [#495](https://github.com/Yoast/yoast-components/pull/495)
* Allow optional help text to be passed to the `ContentAnalysis` component. [#480](https://github.com/Yoast/yoast-components/pull/480)
* Upgraded webpack to version `4.7` in the development environment. [#501](https://github.com/Yoast/yoast-components/pull/501)

### Fixed

* Replace vars in description and title are converted to mentions on load. [#529](https://github.com/Yoast/yoast-components/pull/529)
* Implemented various styling fixes for the `SnippetEditor` component. [#491](https://github.com/Yoast/yoast-components/pull/491), [#513](https://github.com/Yoast/yoast-components/pull/513), [#513](https://github.com/Yoast/yoast-components/pull/513)

## 3.5.1 April 25th, 2018

### Fixed

* Removed import reference to a file that no longer exists.

## 3.5.0 April 24th, 2018

### Added

* Added the jsx-a11y ESLint plugin. [#468](https://github.com/Yoast/yoast-components/pull/468)
* [Collapsible] Added an optional ScreenReaderText after the Collapsible title. [#450](https://github.com/Yoast/yoast-components/pull/464)
* Added a SnippetEditor component. Renders the SnippetPreview component with editor fields to change the data. [#460](https://github.com/Yoast/yoast-components/pull/460)
* Added a ReplacementVariable component. Renders a DraftJS editor with replacement variables as entities. [#460](https://github.com/Yoast/yoast-components/pull/460)
* Added a FormattedScreenReaderMessage component Renders a message translated, but also as screen reader text. Ensures that ScreenReaderText can remain pure and only accept a string. [#460](https://github.com/Yoast/yoast-components/pull/460)

### Changed

* Changed the collapsible panel to use up/down arrows instead of the right/down arrows it used. The direction of the arrow now also matches Gutenberg. [#463](https://github.com/Yoast/yoast-components/pull/465)
* [AnalysisCollapsible] Center SVG angles in AnalysisCollapsible. [#462](https://github.com/Yoast/yoast-components/pull/462)

### Other

* Updated all dependencies that only had a minor or patch update. [#453](https://github.com/Yoast/yoast-components/pull/453)

## 3.4.0 April 9th, 2018

### Added

* Added "$color_noindex":"#1e8cbe" to colors.json.
* Added Collapsible and CollapsibleStateless components.
* Added IconsButton component.
* Added YoastModal component based on react-modal to handle all the modal dialogs.

### Other

* Refactored AnalysisCollapsible and AnalysisCollapsibleStateless to use the new collapsible.

## 3.3.0 March 19th, 2018

### Added

* Implements `SnippetPreview` component. This component will show a representation of how Google will show a certain page.

## 3.2.1 March 16th, 2018

### Bugfix
* Fixed the PropType to `func` for the dynamically supplied icon.

## 3.2.0 March 14th, 2018

### Added
* Made it possible to dynamically pass an icon to the Onboarding Wizard component.

### Other
* Fixed a typo in the readme.

## 3.1.0 March 1st, 2018

### Other
* `react-intl` is now a peer dependency of `yoast-component`. Updated documentation in regards to to using `react-intl`.
* `AnalysisHeaderCollapsible` is now open by default. This means all headers in `ContentAnalysis` are now open by default.

## 3.0.2 February 22nd, 2018

### Other
* Changed `SvgIcon`'s default prop `size` from `16` to `16px` and correctly implemented default props.

## 3.0.1 February 20th, 2018

### Other
* Adds css styles to `SvgIcon` component to fix irregular sizing in `wordpress-seo`.

## 3.0.0 February 8th, 2018

### Breaking changes
* Upgraded peer dependency of React to `16.2`.
* Removed `.svg` files in favour of `SvgIcon` component, as a result `svg-react-loader` is no longer required.
* Removed `composites/SnippetPreview/components/SnippetPreview.js` that ensured backwards compatability to the new `SnippetPreview` component.
* Changed `StyledSection` props.

### Added
* Added `jest-styled-components` for better testing of `styled-components`.
* Added `SvgIcon` component.

### Other
* Upgraded peer dependency of React to `16.2`.
* Changed default translation `Good` to `Good results` in `Content Analysis`.
* Refactored `StyledSection` to use `styled-components`.
* Removed `.svg` files. Use `SvgIcon` instead.
* Removed `composites/SnippetPreview/components/SnippetPreview.js` that ensured backwards compatability to the new `SnippetPreview` component.

## 2.11.7 December 15th, 2017

### Added
* Adds a `marksButtonStatus` prop to the `ContentAnalysis` to disable or hide the eye buttons. #409
* Adds a `marksButtonClassName` prop to the `ContentAnalysis` to use for the tooltips in `wordpress-seo`. #409

## 2.11.6 December 4th, 2017

### Other
* Expands the `AnalysisCollapsible` that is currently the most urgent in the `ContentAnalysis`. #391

## 2.11.5 November 30th, 2017

### Other
* Expands all `AnalysisCollapsibles` in the `ContentAnalysis` by default. #393

## 2.11.4: November 27th, 2017

### Added
* Made it possible to pass the heading level of the `analysisCollapsible`s as a prop to the `ContentAnalysis`. #388
* Added a language notice in the content analysis for non-admin users that cannot change the language. #389

### Fixed
- Avoid to fully re-render the `AnalyisisCollapsible` component to improve accessibility #386
- Fixed alignment of icons and text in the `ContentAnalysis` component. #390

## 2.11.3: November 20th, 2017

### Added
* Added flag to run tests sequentially. #376
* Added `type="button"` attribute to `IconButtonToggle`. #378

### Other
* Changed `StackedProgressBar` height to `24px`. #367
* Changed `onMarkButtonClick` callback in `ContentAnalysis` to return empty string when marker is deselected. #375
* Made Onboarding Wizard's `previousButton` and `nextButton` focusable. #369
* Replaced old react string refs with callbacks. #365
* Remove unnecessary whitespace between `AnalysisResult`s and between `AnalysisCollapsible`s. #382

## 2.11.2: November 7th, 2017

### Added
* Adds a callback to the mark button in the `ContentAnalysis` component. #372

### Other
* Removes min height from the `ContentAnalysis` component. #373

## 2.11.1: October 30th, 2017

* Allows `AnalysisResult` text to be HTML. #366

## 2.11: October 27th, 2017

### Added

#### Components
* `Notification` component. #348
* `AnalysisResult` component. #352
* `ContentAnalysis` component. #359

#### Other additions
* Added callbacks to notify tab switch in `YoastTabs`. #346
* `setSeoResultsForKeyword` action and reducer implementation. #355
* Added default `className` to `VideoDescriptionItem` component. #358

## 2.10.3: October 17th, 2017

### Added
* `IconButtonToggle` component

### Other
* Added class names to VideoTutorial component.

## 2.10.2: October 16th, 2017

### Other
* Improved AlgoliaSearcher focus management between search and detail view.
* Help center CSS tweaks.

## 2.10.1: October 4th, 2017

### Added

#### Other
* Improved the `HelpCenterButton` and the `HelpCenterContainer` styling. #337

### Other
* Added class names to the `HelpCenterContainer` and `HelpCenterButton`. #337

## 2.10.0: October 3rd, 2017

### Added

#### Components
* `Table` component. #219
* `SearchResultDetail` component. #243
* `SearchResults` component. #243
* `YoastLinkButton` component. #284
* `VideoTutorial` component. #291
* `YouTubeVideo` component. #291
* `YoastTabs` component. #303
* `AllyNotice` component. #306
* `HelpCenter` component. #310
* `HelpCenterButton` component. #318

#### Other
* Added translatable label to `SearchBar` component. #243
* Added `makeOutboundLink` util function. #308
* Added a prop to the `AlgoliaSearcher` component that can be used to enable live search. #323
* Added a search button and placeholder text to the `SearchBar` component. #323

### Other
* Improved styling and accessibility of the `SearchBar` component. #243
* Styling improvements for the Onboarding Wizard. #290
* Fixed two prop warnings that appeared when switching pages in the Onboarding wizard. #293 and #295
* Improved YoastButton hover and active style. #332

## 2.9.3: September 26th, 2017

### Other
* Fixed the loading of AMP articles in the Algolia article iFrame.


## 2.9.2: September 25th, 2017

### Other
* Added trailing slash to knowledge base URL in help center

## 2.9.1: September 19th, 2017

### Added

#### Other
* Added dashboard widget to development environment.
* Added class names to `WordpressFeed` and `SeoAssessment` components, and also to their children.

## 2.9.0: September 11th, 2017

### Added

#### Components
* `Icon` component (using `svg-react-loader`, see `README.md`). #218
* `Button`(#173), `IconButton`(##232), `LinkButton`(#262), `YoastButton`(#257) components.
* `InputField` component (using `DraftJS` ). #204
* `ListTable`, `Row` and `Cell` component. #219
* `ProgressBar`component. #172
* `IFrame` and `ArticleContent` components. #242
* `StackedProgressBar` component. #270
* `SeoScoreAssessment(s)` components. #272
* `WordpressFeed` component. #273
* `SeoAssessment` component. #281

##### Other
* Added `getFeed` RSS reader utility function. #267
* Added `ContentAnalysis` reducer and actions. #224
* Added `striptags` utility library. #276
* Added various documentation. #239

### Other
* Improved development environment. (#238, #174 )

#### Onboarding wizard
* Added max width for content in Onboarding wizard (#250), and `fullWidth` property for full screen support (#269).
* Changed Onboarding wizard header. #256
* Added paragraph for additional information to Onboard wizard `Choice component`. #254

## 2.8.0: August 8th, 2017

### Added

* Adds aria-current to the onboarding wizard active step.

### Fixed

* Removes console errors caused by using React.PropTypes and React.createClass.

## 2.7.1: July 25th, 2017

### Changed

* Improved README.md to instruct on using yarn instead of npm.

## 2.7.0: July 6th, 2017

### Added

* [AlgoliaSearch] Added Algolia Search as a new component.
* Adds additional colors

## 2.6.0:

### Changed

* Changes the color blue from #0075b3 to #0066cd.

## 2.5.0:

### Added

* [ConfigurationWizard] Adds possibility to disable navigation on a step page
* [ConfigurationWizard] Adds icons to next, previous and close buttons
* [ConfigurationWizard] Pass `nextStep` and `previousStep` functions to Steps
* Adds Colors for use in my.yoast

## 2.4.0: February 14th, 2016

### Added

* [Choice] Adds a radio button option to the Choice components.

### Removed

* [StyledSection] Removes width from StyledSection to be usable in different contexts.

## 2.3.0: January 17th, 2016

### Changed

* Removes width from StyledSection.

## 2.2.0: December 13th, 2016

### Added

* [Loader] Adds Loader component to be used when something is occurring in the background.

## 2.1.0: November 29th, 2016

### Added

* Adds Sass and JSON colors palette.
* Adds `grunt-scss-to-json` package to generate the JSON colors file.

### Changed

* Splits color schemes in a separate Sass file.
* Splits snippet preview colors in a separate Sass file.
* Removes, updates, and adds colors. See the related issue for a [list of colors changes](https://github.com/Yoast/yoast-components/issues/106).
* Adds 2.0.0 as a possibility for react-tap-plugin as a peer dependency.

## 2.0.0: October 20th, 2016

### Breaking changes

* Changed default server request from a PUT to a POST request.

## 1.1.0: October 11th, 2016

### Added

* [StyledSection] Adds a StyledSection component. This component is used to render a HTML section including a heading with an icon.
* [CSS] Adds the `file-text-o` font awesome icon.
* [utils] Exports flat `translate` function in the i18n util.

### Fixed

* [Label] Adds an `aria-label` attribute.
* [Choice] Passes the screenReaderText to the label as `aria-label`.

## 1.0.0: September 27th, 2016

### Added

* Implements HTML component. This component is used to render HTML.
* Implements Choice component. This component is used for a choice, like a group of radio buttons or a select box.
* Implements Input component. This component is used to render a text input.
* Implements Wizard component. This component is used to make a wizard from steps that include fields.
* Implements ScreenReaderText component. This component is used to create a text for use with screen readers.
* Implements ScreenReaderShortcut component. This component is used for skipping navigation to screen reader texts.
* Implements Stepper component. This component is used to create step navigation in the wizard.
* Implements StepButton component. This component is used to access a Step in the wizard.
