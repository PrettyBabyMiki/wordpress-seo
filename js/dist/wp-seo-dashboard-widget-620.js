yoastWebpackJsonp([243],{

/***/ 1094:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _templateObject = _taggedTemplateLiteral([\"\\n\\tdisplay: table-row;\\n\\tfont-size: 14px;\\n\"], [\"\\n\\tdisplay: table-row;\\n\\tfont-size: 14px;\\n\"]),\n    _templateObject2 = _taggedTemplateLiteral([\"\\n\\tdisplay: table-cell;\\n\\tpadding: 2px;\\n\"], [\"\\n\\tdisplay: table-cell;\\n\\tpadding: 2px;\\n\"]),\n    _templateObject3 = _taggedTemplateLiteral([\"\\n\\tposition: relative;\\n\\ttop: 1px;\\n\\tdisplay: inline-block;\\n\\theight: 8px;\\n\\twidth: 8px;\\n\\tborder-radius: 50%;\\n\\tbackground-color: \", \";\\n\"], [\"\\n\\tposition: relative;\\n\\ttop: 1px;\\n\\tdisplay: inline-block;\\n\\theight: 8px;\\n\\twidth: 8px;\\n\\tborder-radius: 50%;\\n\\tbackground-color: \", \";\\n\"]),\n    _templateObject4 = _taggedTemplateLiteral([\"\\n\\tpadding-left: 8px;\\n\\twidth: 100%;\\n\"], [\"\\n\\tpadding-left: 8px;\\n\\twidth: 100%;\\n\"]),\n    _templateObject5 = _taggedTemplateLiteral([\"\\n\\tfont-weight: 600;\\n\\ttext-align: right;\\n\\tpadding-left: 16px;\\n\"], [\"\\n\\tfont-weight: 600;\\n\\ttext-align: right;\\n\\tpadding-left: 16px;\\n\"]),\n    _templateObject6 = _taggedTemplateLiteral([\"\\n\\tdisplay: table;\\n\\tbox-sizing: border-box;\\n\\tlist-style: none;\\n\\tmax-width: 100%;\\n\\tmin-width: 200px;\\n\\tmargin: 8px 0;\\n\\tpadding: 0 8px;\\n\"], [\"\\n\\tdisplay: table;\\n\\tbox-sizing: border-box;\\n\\tlist-style: none;\\n\\tmax-width: 100%;\\n\\tmin-width: 200px;\\n\\tmargin: 8px 0;\\n\\tpadding: 0 8px;\\n\"]);\n\nvar _react = __webpack_require__(0);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _propTypes = __webpack_require__(1);\n\nvar _propTypes2 = _interopRequireDefault(_propTypes);\n\nvar _styledComponents = __webpack_require__(7);\n\nvar _styledComponents2 = _interopRequireDefault(_styledComponents);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }\n\nvar ScoreAssessmentItem = _styledComponents2.default.li(_templateObject);\n\nvar ScoreAssessmentPart = _styledComponents2.default.span(_templateObject2);\n\nvar ScoreAssessmentBullet = (0, _styledComponents2.default)(ScoreAssessmentPart)(_templateObject3, function (props) {\n\treturn props.scoreColor;\n});\n\nScoreAssessmentBullet.propTypes = {\n\tscoreColor: _propTypes2.default.string.isRequired\n};\n\nvar ScoreAssessmentText = (0, _styledComponents2.default)(ScoreAssessmentPart)(_templateObject4);\n\nvar ScoreAssessmentScore = (0, _styledComponents2.default)(ScoreAssessmentPart)(_templateObject5);\n\nvar ScoreAssessment = function ScoreAssessment(props) {\n\treturn _react2.default.createElement(\n\t\tScoreAssessmentItem,\n\t\t{\n\t\t\tclassName: \"\" + props.className },\n\t\t_react2.default.createElement(ScoreAssessmentBullet, {\n\t\t\tclassName: props.className + \"-bullet\",\n\t\t\tscoreColor: props.scoreColor }),\n\t\t_react2.default.createElement(ScoreAssessmentText, {\n\t\t\tclassName: props.className + \"-text\",\n\t\t\tdangerouslySetInnerHTML: { __html: props.html } }),\n\t\tprops.value && _react2.default.createElement(\n\t\t\tScoreAssessmentScore,\n\t\t\t{\n\t\t\t\tclassName: props.className + \"-score\" },\n\t\t\tprops.value\n\t\t)\n\t);\n};\n\nScoreAssessment.propTypes = {\n\tclassName: _propTypes2.default.string.isRequired,\n\tscoreColor: _propTypes2.default.string.isRequired,\n\thtml: _propTypes2.default.string.isRequired,\n\tvalue: _propTypes2.default.number\n};\n\nvar ScoreAssessmentList = _styledComponents2.default.ul(_templateObject6);\n\nvar ScoreAssessments = function ScoreAssessments(props) {\n\treturn _react2.default.createElement(\n\t\tScoreAssessmentList,\n\t\t{\n\t\t\tclassName: props.className,\n\t\t\trole: \"list\" },\n\t\tprops.items.map(function (item, index) {\n\t\t\treturn _react2.default.createElement(ScoreAssessment, {\n\t\t\t\tclassName: props.className + \"__item\",\n\t\t\t\tkey: index,\n\t\t\t\tscoreColor: item.color,\n\t\t\t\thtml: item.html,\n\t\t\t\tvalue: item.value });\n\t\t})\n\t);\n};\n\nScoreAssessments.propTypes = {\n\tclassName: _propTypes2.default.string,\n\titems: _propTypes2.default.arrayOf(_propTypes2.default.shape({\n\t\tcolor: _propTypes2.default.string.isRequired,\n\t\thtml: _propTypes2.default.string.isRequired,\n\t\tvalue: _propTypes2.default.number\n\t}))\n};\n\nScoreAssessments.defaultProps = {\n\tclassName: \"score-assessments\"\n};\n\nexports.default = ScoreAssessments;\n\n//////////////////\n// WEBPACK FOOTER\n// /Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/yoast-components/composites/Plugin/Shared/components/ScoreAssessments.js\n// module id = 1094\n// module chunks = 243\n\n//# sourceURL=webpack:////Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/yoast-components/composites/Plugin/Shared/components/ScoreAssessments.js?");

/***/ }),

/***/ 12:
/***/ (function(module, exports) {

eval("module.exports = {\"$palette_white\":\"#fff\",\"$palette_grey_ultra_light\":\"#f7f7f7\",\"$palette_grey_light\":\"#f1f1f1\",\"$palette_grey\":\"#ddd\",\"$palette_grey_medium\":\"#ccc\",\"$palette_grey_disabled\":\"#a0a5aa\",\"$palette_grey_medium_dark\":\"#888\",\"$palette_grey_text\":\"#646464\",\"$palette_grey_dark\":\"#555\",\"$palette_black\":\"#000\",\"$palette_purple\":\"#5d237a\",\"$palette_purple_dark\":\"#6c2548\",\"$palette_pink\":\"#d73763\",\"$palette_pink_light\":\"#e1bee7\",\"$palette_pink_dark\":\"#a4286a\",\"$palette_blue\":\"#0066cd\",\"$palette_blue_light\":\"#a9a9ce\",\"$palette_blue_dark\":\"#084a67\",\"$palette_green\":\"#77b227\",\"$palette_green_light\":\"#7ad03a\",\"$palette_green_medium_light\":\"#64a60a\",\"$palette_green_medium\":\"#008a00\",\"$palette_green_blue\":\"#009288\",\"$palette_orange\":\"#dc5c04\",\"$palette_orange_light\":\"#ee7c1b\",\"$palette_red\":\"#dc3232\",\"$palette_red_light\":\"#f9bdbd\",\"$palette_yellow\":\"#ffeb3b\",\"$color_bad\":\"#dc3232\",\"$color_ok\":\"#ee7c1b\",\"$color_good\":\"#7ad03a\",\"$color_score_icon\":\"#888\",\"$color_white\":\"#fff\",\"$color_black\":\"#000\",\"$color_green\":\"#77b227\",\"$color_green_medium\":\"#008a00\",\"$color_green_blue\":\"#009288\",\"$color_grey\":\"#ddd\",\"$color_grey_dark\":\"#555\",\"$color_purple\":\"#5d237a\",\"$color_purple_dark\":\"#6c2548\",\"$color_pink\":\"#d73763\",\"$color_pink_light\":\"#e1bee7\",\"$color_pink_dark\":\"#a4286a\",\"$color_blue\":\"#0066cd\",\"$color_blue_light\":\"#a9a9ce\",\"$color_blue_dark\":\"#084a67\",\"$color_red\":\"#dc3232\",\"$color_border_light\":\"#f7f7f7\",\"$color_border\":\"#ccc\",\"$color_input_border\":\"#ddd\",\"$color_background_light\":\"#f7f7f7\",\"$color_button\":\"#f7f7f7\",\"$color_button_text\":\"#555\",\"$color_button_border\":\"#ccc\",\"$color_button_hover\":\"#fff\",\"$color_button_border_hover\":\"#888\",\"$color_button_text_hover\":\"#000\",\"$color_button_border_active\":\"#000\",\"$color_headings\":\"#555\",\"$color_marker_inactive\":\"#555\",\"$color_marker_active\":\"#fff\",\"$color_marker_disabled\":\"#a0a5aa\",\"$color_error\":\"#dc3232\",\"$color_orange\":\"#dc5c04\",\"$color_orange_hover\":\"#c35204\",\"$color_grey_hover\":\"#cecece\",\"$color_pink_hover\":\"#cc2956\",\"$color_grey_cta\":\"#ddd\",\"$color_grey_line\":\"#ddd\",\"$color_grey_quote\":\"#646464\",\"$color_grey_text\":\"#646464\",\"$color_grey_medium_dark\":\"#888\",\"$color_green_medium_light\":\"#64a60a\",\"$color_grey_disabled\":\"#a0a5aa\",\"$color_grey_medium\":\"#ccc\",\"$color_grey_light\":\"#f1f1f1\",\"$color_yellow\":\"#ffeb3b\",\"$color_error_message\":\"#f9bdbd\"}\n\n//////////////////\n// WEBPACK FOOTER\n// /Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/yoast-components/style-guide/colors.json\n// module id = 12\n// module chunks = 239 240 241 242 243\n\n//# sourceURL=webpack:////Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/yoast-components/style-guide/colors.json?");

/***/ }),

/***/ 1316:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nvar _react = __webpack_require__(0);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _reactDom = __webpack_require__(101);\n\nvar _reactDom2 = _interopRequireDefault(_reactDom);\n\nvar _SeoAssessment = __webpack_require__(1317);\n\nvar _SeoAssessment2 = _interopRequireDefault(_SeoAssessment);\n\nvar _ScoreAssessments = __webpack_require__(1094);\n\nvar _ScoreAssessments2 = _interopRequireDefault(_ScoreAssessments);\n\nvar _getFeed2 = __webpack_require__(1319);\n\nvar _getFeed3 = _interopRequireDefault(_getFeed2);\n\nvar _WordpressFeed = __webpack_require__(1320);\n\nvar _WordpressFeed2 = _interopRequireDefault(_WordpressFeed);\n\nvar _colors = __webpack_require__(12);\n\nvar _colors2 = _interopRequireDefault(_colors);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* global wpseoDashboardWidgetL10n, wpseoApi, jQuery */\n\nvar DashboardWidget = function (_React$Component) {\n\t_inherits(DashboardWidget, _React$Component);\n\n\t/**\n  * Creates the components and initializes its state.\n  */\n\tfunction DashboardWidget() {\n\t\t_classCallCheck(this, DashboardWidget);\n\n\t\tvar _this = _possibleConstructorReturn(this, (DashboardWidget.__proto__ || Object.getPrototypeOf(DashboardWidget)).call(this));\n\n\t\t_this.state = {\n\t\t\tstatistics: null,\n\t\t\tryte: null,\n\t\t\tfeed: null\n\t\t};\n\n\t\t_this.getStatistics();\n\t\t_this.getRyte();\n\t\t_this.getFeed();\n\t\treturn _this;\n\t}\n\n\t/**\n  * Returns a color to be used for a given score.\n  *\n  * @param {string} score The score, expected to be 'na', 'bad', 'ok', 'good'.\n  *\n  * @returns {string} The color to use for this score. Defaults to grey if no such color exists.\n  */\n\n\n\t_createClass(DashboardWidget, [{\n\t\tkey: \"getStatistics\",\n\n\n\t\t/**\n   * Fetches data from the statistics endpoint, parses it and sets it to the state.\n   *\n   * @returns {void}\n   */\n\t\tvalue: function getStatistics() {\n\t\t\tvar _this2 = this;\n\n\t\t\twpseoApi.get(\"statistics\", function (response) {\n\t\t\t\tvar statistics = {};\n\n\t\t\t\tstatistics.seoScores = response.seo_scores.map(function (score) {\n\t\t\t\t\treturn {\n\t\t\t\t\t\tvalue: parseInt(score.count, 10),\n\t\t\t\t\t\tcolor: DashboardWidget.getColorFromScore(score.seo_rank),\n\t\t\t\t\t\thtml: \"<a href=\\\"\" + score.link + \"\\\">\" + score.label + \"</a>\"\n\t\t\t\t\t};\n\t\t\t\t});\n\n\t\t\t\t// Wrap in a div and get the text to HTML decode.\n\t\t\t\tstatistics.header = jQuery(\"<div>\" + response.header + \"</div>\").text();\n\n\t\t\t\t_this2.setState({ statistics: statistics });\n\t\t\t});\n\t\t}\n\n\t\t/**\n   * Fetches data from the Ryte endpoint, parses it and sets it to the state.\n   *\n   * @returns {void}\n   */\n\n\t}, {\n\t\tkey: \"getRyte\",\n\t\tvalue: function getRyte() {\n\t\t\tvar _this3 = this;\n\n\t\t\twpseoApi.get(\"ryte\", function (response) {\n\t\t\t\tif (!response.ryte) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\n\t\t\t\tvar ryte = {\n\t\t\t\t\tscores: [{\n\t\t\t\t\t\tcolor: DashboardWidget.getColorFromScore(response.ryte.score),\n\t\t\t\t\t\thtml: response.ryte.label\n\t\t\t\t\t}],\n\t\t\t\t\tcanFetch: response.ryte.can_fetch\n\t\t\t\t};\n\n\t\t\t\t_this3.setState({ ryte: ryte });\n\t\t\t});\n\t\t}\n\n\t\t/**\n   * Fetches data from the yoast.com feed, parses it and sets it to the state.\n   *\n   * @returns {void}\n   */\n\n\t}, {\n\t\tkey: \"getFeed\",\n\t\tvalue: function getFeed() {\n\t\t\tvar _this4 = this;\n\n\t\t\t// Developer note: this link should -not- be converted to a shortlink.\n\t\t\t(0, _getFeed3.default)(\"https://yoast.com/feed/widget/\", 2).then(function (feed) {\n\t\t\t\tfeed.items = feed.items.map(function (item) {\n\t\t\t\t\titem.description = jQuery(\"<div>\" + item.description + \"</div>\").text();\n\t\t\t\t\titem.description = item.description.replace(\"The post \" + item.title + \" appeared first on Yoast.\", \"\").trim();\n\t\t\t\t\titem.content = jQuery(\"<div>\" + item.content + \"</div>\").text();\n\n\t\t\t\t\treturn item;\n\t\t\t\t});\n\n\t\t\t\t_this4.setState({ feed: feed });\n\t\t\t}).catch(function (error) {\n\t\t\t\treturn console.log(error);\n\t\t\t});\n\t\t}\n\n\t\t/**\n   * Returns the SEO Assessment sub-component.\n   *\n   * @returns {ReactElement} The SEO Assessment component.\n   */\n\n\t}, {\n\t\tkey: \"getSeoAssessment\",\n\t\tvalue: function getSeoAssessment() {\n\t\t\tif (this.state.statistics === null) {\n\t\t\t\treturn null;\n\t\t\t}\n\n\t\t\treturn _react2.default.createElement(_SeoAssessment2.default, { key: \"yoast-seo-posts-assessment\",\n\t\t\t\tseoAssessmentText: this.state.statistics.header,\n\t\t\t\tseoAssessmentItems: this.state.statistics.seoScores });\n\t\t}\n\n\t\t/**\n   * Returns the Ryte Assessment sub-component.\n   *\n   * @returns {ReactElement} The Ryte Assessment component.\n   */\n\n\t}, {\n\t\tkey: \"getRyteAssessment\",\n\t\tvalue: function getRyteAssessment() {\n\t\t\tif (this.state.ryte === null) {\n\t\t\t\treturn null;\n\t\t\t}\n\n\t\t\treturn _react2.default.createElement(\n\t\t\t\t\"div\",\n\t\t\t\t{ id: \"yoast-seo-ryte-assessment\", key: \"yoast-seo-ryte-assessment\" },\n\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\"h3\",\n\t\t\t\t\tnull,\n\t\t\t\t\twpseoDashboardWidgetL10n.ryte_header\n\t\t\t\t),\n\t\t\t\t_react2.default.createElement(_ScoreAssessments2.default, { items: this.state.ryte.scores }),\n\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\"div\",\n\t\t\t\t\tnull,\n\t\t\t\t\tthis.state.ryte.canFetch && _react2.default.createElement(\n\t\t\t\t\t\t\"a\",\n\t\t\t\t\t\t{ className: \"fetch-status button\", href: wpseoDashboardWidgetL10n.ryte_fetch_url },\n\t\t\t\t\t\twpseoDashboardWidgetL10n.ryte_fetch\n\t\t\t\t\t),\n\t\t\t\t\t_react2.default.createElement(\n\t\t\t\t\t\t\"a\",\n\t\t\t\t\t\t{ className: \"landing-page button\", href: wpseoDashboardWidgetL10n.ryte_landing_url, target: \"_blank\" },\n\t\t\t\t\t\twpseoDashboardWidgetL10n.ryte_analyze\n\t\t\t\t\t)\n\t\t\t\t)\n\t\t\t);\n\t\t}\n\n\t\t/**\n   * Returns the yoast.com feed sub-component.\n   *\n   * @returns {ReactElement} The yoast.com feed component.\n   */\n\n\t}, {\n\t\tkey: \"getYoastFeed\",\n\t\tvalue: function getYoastFeed() {\n\t\t\tif (this.state.feed === null) {\n\t\t\t\treturn null;\n\t\t\t}\n\n\t\t\treturn _react2.default.createElement(_WordpressFeed2.default, {\n\t\t\t\tkey: \"yoast-seo-blog-feed\",\n\t\t\t\ttitle: wpseoDashboardWidgetL10n.feed_header,\n\t\t\t\tfeed: this.state.feed,\n\t\t\t\tfooterHtml: wpseoDashboardWidgetL10n.feed_footer });\n\t\t}\n\n\t\t/**\n   * Renders the component.\n   *\n   * @returns {ReactElement} The component.\n   */\n\n\t}, {\n\t\tkey: \"render\",\n\t\tvalue: function render() {\n\t\t\tvar contents = [this.getSeoAssessment(), this.getRyteAssessment(), this.getYoastFeed()].filter(function (item) {\n\t\t\t\treturn item !== null;\n\t\t\t});\n\n\t\t\tif (contents.length === 0) {\n\t\t\t\treturn null;\n\t\t\t}\n\n\t\t\treturn _react2.default.createElement(\n\t\t\t\t\"div\",\n\t\t\t\tnull,\n\t\t\t\tcontents\n\t\t\t);\n\t\t}\n\t}], [{\n\t\tkey: \"getColorFromScore\",\n\t\tvalue: function getColorFromScore(score) {\n\t\t\treturn _colors2.default[\"$color_\" + score] || _colors2.default.$color_grey;\n\t\t}\n\t}]);\n\n\treturn DashboardWidget;\n}(_react2.default.Component);\n\nvar element = document.getElementById(\"yoast-seo-dashboard-widget\");\n\nif (element) {\n\t_reactDom2.default.render(_react2.default.createElement(DashboardWidget, null), element);\n}\n\n//////////////////\n// WEBPACK FOOTER\n// ./wp-seo-dashboard-widget.js\n// module id = 1316\n// module chunks = 243\n\n//# sourceURL=webpack:///./wp-seo-dashboard-widget.js?");

/***/ }),

/***/ 1317:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _templateObject = _taggedTemplateLiteral([\"\\n\"], [\"\\n\"]),\n    _templateObject2 = _taggedTemplateLiteral([\"\\n\\tfont-size: 14px;\\n\"], [\"\\n\\tfont-size: 14px;\\n\"]);\n\nvar _react = __webpack_require__(0);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _propTypes = __webpack_require__(1);\n\nvar _propTypes2 = _interopRequireDefault(_propTypes);\n\nvar _styledComponents = __webpack_require__(7);\n\nvar _styledComponents2 = _interopRequireDefault(_styledComponents);\n\nvar _StackedProgressBar = __webpack_require__(1318);\n\nvar _StackedProgressBar2 = _interopRequireDefault(_StackedProgressBar);\n\nvar _ScoreAssessments = __webpack_require__(1094);\n\nvar _ScoreAssessments2 = _interopRequireDefault(_ScoreAssessments);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }\n\n/**\n * SeoAssessment container.\n */\nvar SeoAssessmentContainer = _styledComponents2.default.div(_templateObject);\n\n/**\n * SeoAssessment top text.\n */\nvar SeoAssessmentText = _styledComponents2.default.p(_templateObject2);\n\n/**\n * The Dashboard Seo Assessment component.\n *\n * @param {object} props The component props.\n *\n * @returns {ReactElement} The react component.\n */\nvar SeoAssessment = function SeoAssessment(props) {\n\treturn _react2.default.createElement(\n\t\tSeoAssessmentContainer,\n\t\t{\n\t\t\tclassName: props.className },\n\t\t_react2.default.createElement(\n\t\t\tSeoAssessmentText,\n\t\t\t{\n\t\t\t\tclassName: props.className + \"__text\" },\n\t\t\tprops.seoAssessmentText\n\t\t),\n\t\t_react2.default.createElement(_StackedProgressBar2.default, {\n\t\t\tclassName: \"progress\",\n\t\t\titems: props.seoAssessmentItems,\n\t\t\tbarHeight: props.barHeight\n\t\t}),\n\t\t_react2.default.createElement(_ScoreAssessments2.default, {\n\t\t\tclassName: \"assessments\",\n\t\t\titems: props.seoAssessmentItems\n\t\t})\n\t);\n};\n\nSeoAssessment.propTypes = {\n\tclassName: _propTypes2.default.string,\n\tseoAssessmentText: _propTypes2.default.string,\n\tseoAssessmentItems: _propTypes2.default.arrayOf(_propTypes2.default.shape({\n\t\tvalue: _propTypes2.default.number.isRequired,\n\t\tcolor: _propTypes2.default.string.isRequired\n\t})),\n\tbarHeight: _propTypes2.default.string\n};\n\nSeoAssessment.defaultProps = {\n\tclassName: \"seo-assessment\"\n};\n\nexports.default = SeoAssessment;\n\n//////////////////\n// WEBPACK FOOTER\n// /Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/yoast-components/composites/Plugin/DashboardWidget/components/SeoAssessment.js\n// module id = 1317\n// module chunks = 243\n\n//# sourceURL=webpack:////Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/yoast-components/composites/Plugin/DashboardWidget/components/SeoAssessment.js?");

/***/ }),

/***/ 1318:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _templateObject = _taggedTemplateLiteral([\"\\n\\tmargin: 8px 0;\\n\\theight: \", \";\\n\\toverflow: hidden;\\n\"], [\"\\n\\tmargin: 8px 0;\\n\\theight: \", \";\\n\\toverflow: hidden;\\n\"]),\n    _templateObject2 = _taggedTemplateLiteral([\"\\n\\tdisplay: inline-block;\\n\\tvertical-align: top;\\n\\twidth: \", \";\\n\\tbackground-color: \", \";\\n\\theight: 100%;\\n\"], [\"\\n\\tdisplay: inline-block;\\n\\tvertical-align: top;\\n\\twidth: \", \";\\n\\tbackground-color: \", \";\\n\\theight: 100%;\\n\"]);\n\nvar _react = __webpack_require__(0);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _propTypes = __webpack_require__(1);\n\nvar _propTypes2 = _interopRequireDefault(_propTypes);\n\nvar _styledComponents = __webpack_require__(7);\n\nvar _styledComponents2 = _interopRequireDefault(_styledComponents);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }\n\nvar StackedProgressBarContainer = _styledComponents2.default.div(_templateObject, function (props) {\n\treturn props.barHeight;\n});\n\nvar StackedProgressBarProgress = _styledComponents2.default.span(_templateObject2, function (props) {\n\treturn props.progressWidth + \"%\";\n}, function (props) {\n\treturn props.progressColor;\n});\n\nStackedProgressBarProgress.propTypes = {\n\tprogressWidth: _propTypes2.default.number.isRequired,\n\tprogressColor: _propTypes2.default.string.isRequired\n};\n\nvar StackedProgressBar = function StackedProgressBar(props) {\n\tvar totalValue = 0;\n\tfor (var i = 0; i < props.items.length; i++) {\n\t\tprops.items[i].value = Math.max(props.items[i].value, 0);\n\t\ttotalValue += props.items[i].value;\n\t}\n\n\tif (totalValue <= 0) {\n\t\treturn null;\n\t}\n\n\treturn _react2.default.createElement(\n\t\tStackedProgressBarContainer,\n\t\t{\n\t\t\tclassName: props.className,\n\t\t\tbarHeight: props.barHeight },\n\t\tprops.items.map(function (item, index) {\n\t\t\treturn _react2.default.createElement(StackedProgressBarProgress, {\n\t\t\t\tclassName: props.className + \"__part\",\n\t\t\t\tkey: index,\n\t\t\t\tprogressColor: item.color,\n\t\t\t\tprogressWidth: item.value / totalValue * 100 });\n\t\t})\n\t);\n};\n\nStackedProgressBar.propTypes = {\n\tclassName: _propTypes2.default.string,\n\titems: _propTypes2.default.arrayOf(_propTypes2.default.shape({\n\t\tvalue: _propTypes2.default.number.isRequired,\n\t\tcolor: _propTypes2.default.string.isRequired\n\t})),\n\tbarHeight: _propTypes2.default.string\n};\n\nStackedProgressBar.defaultProps = {\n\tclassName: \"stacked-progress-bar\",\n\tbarHeight: \"24px\"\n};\n\nexports.default = StackedProgressBar;\n\n//////////////////\n// WEBPACK FOOTER\n// /Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/yoast-components/composites/Plugin/Shared/components/StackedProgressBar.js\n// module id = 1318\n// module chunks = 243\n\n//# sourceURL=webpack:////Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/yoast-components/composites/Plugin/Shared/components/StackedProgressBar.js?");

/***/ }),

/***/ 1319:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.parseFeed = parseFeed;\nexports.default = getFeed;\n/**\n * @typedef  {Object}     Feed\n * @property {string}     title       The title of the website.\n * @property {string}     description A description of the website.\n * @property {string}     link        A link to the website.\n * @property {FeedItem[]} items     The items in the feed.\n */\n\n/**\n * @typedef  {Object} FeedItem\n * @property {string} title       The title of the item.\n * @property {string} content     The content of the item, will be HTML encoded.\n * @property {string} description A summary of the content, will be HTML encoded.\n * @property {string} link        A link to the item.\n * @property {string} creator     The creator of the item.\n * @property {string} date        The publication date of the item.\n */\n\n/**\n * Parses a RSS Feed.\n *\n * @param {string} raw      The raw XML of the feed.\n * @param {number} maxItems The maximum amount of items to parse, 0 for all items.\n *\n * @returns {Promise.<Feed>} A promise which resolves with the parsed Feed.\n */\nfunction parseFeed(raw) {\n  var maxItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n\n  return new Promise(function (resolve, reject) {\n    try {\n      var parser = new DOMParser();\n      var parsed = parser.parseFromString(raw, 'application/xml');\n      var nsResolver = parsed.createNSResolver(parsed.documentElement);\n\n      var result = getFeedMeta(parsed);\n      result.items = getFeedItems(parsed, nsResolver, maxItems);\n\n      resolve(result);\n    } catch (error) {\n      reject(error);\n    }\n  });\n}\n\n/**\n * Returns the feed meta from a parsed Feed.\n *\n * @param {Document} parsed A parsed XML document.\n *\n * @returns {Feed} A Feed object containing only the meta attributes.\n */\nfunction getFeedMeta(parsed) {\n  var result = {};\n\n  result.title = getXPathText('/rss/channel/title', parsed);\n  result.description = getXPathText('/rss/channel/description', parsed);\n  result.link = getXPathText('/rss/channel/link', parsed);\n\n  return result;\n}\n\n/**\n * Returns the feed items from a parsed Feed.\n *\n * @param {Document}        parsed     A parsed XML document.\n * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.\n * @param {number}          maxItems   The maximum amount of items to return, 0 for all items.\n *\n * @returns {FeedItem[]} An array of FeedItem objects.\n */\nfunction getFeedItems(parsed, nsResolver, maxItems) {\n  var snapshots = getXPathSnapshots('/rss/channel/item', parsed);\n  var count = snapshots.snapshotLength;\n  var items = [];\n\n  if (maxItems !== 0) {\n    count = Math.min(count, maxItems);\n  }\n\n  for (var i = 0; i < count; i++) {\n    var snapshot = snapshots.snapshotItem(i);\n    items.push(getFeedItem(parsed, snapshot, nsResolver));\n  }\n\n  return items;\n}\n\n/**\n * Returns a single feed item from a snapshot.\n *\n * @param {Document}        parsed     A parsed XML document.\n * @param {Node}            snapshot   A snapshot returned from the snapshotItem method of a XPathResult.\n * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.\n *\n * @returns {FeedItem} The FeedItem representing the provided snapshot.\n */\nfunction getFeedItem(parsed, snapshot, nsResolver) {\n  var item = {};\n\n  item.title = getXPathText('child::title', parsed, snapshot);\n  item.link = getXPathText('child::link', parsed, snapshot);\n  item.content = getXPathText('child::content:encoded', parsed, snapshot, nsResolver);\n  item.description = getXPathText('child::description', parsed, snapshot);\n  item.creator = getXPathText('child::dc:creator', parsed, snapshot, nsResolver);\n  item.date = getXPathText('child::pubDate', parsed, snapshot);\n\n  return item;\n}\n\n/**\n * Returns the string contents of the given xpath query on the provided document.\n *\n * @param {string}          xpath      The xpath query to run.\n * @param {Document}        document   A parsed XML document.\n * @param {Node}            context    A Node in the document to use as context for the query.\n * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.\n *\n * @returns {string|undefined} The string result of the xpath query.\n */\nfunction getXPathText(xpath, document) {\n  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;\n  var nsResolver = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;\n\n  var result = document.evaluate(xpath, context || document, nsResolver, XPathResult.STRING_TYPE, null);\n\n  if (result.stringValue) {\n    return result.stringValue;\n  }\n\n  return undefined;\n}\n\n/**\n * Returns a ORDERED_NODE_SNAPSHOT_TYPE XpathResult for the given xpath query on the provided document.\n *\n * @param {string}          xpath      The xpath query to run.\n * @param {Document}        document   A parsed XML document.\n * @param {Node}            context    A Node in the document to use as context for the query.\n * @param {XPathNSResolver} nsResolver A namespace resolver for the parsed document.\n *\n * @returns {XPathResult} The result of the xpath query.\n */\nfunction getXPathSnapshots(xpath, document) {\n  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;\n  var nsResolver = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;\n\n  return document.evaluate(xpath, context || document, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);\n}\n\n/**\n * Grabs an RSS feed from the requested URL and parses it.\n *\n * @param {string} url      The URL the feed is located at.\n * @param {int}    maxItems The amount of items you wish returned, 0 for all items.\n *\n * @returns {Promise.<Feed>} The retrieved feed.\n */\nfunction getFeed(url) {\n  var maxItems = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;\n\n  return fetch(url).then(function (response) {\n    return response.text();\n  }).then(function (raw) {\n    return parseFeed(raw, maxItems);\n  });\n}\n\n//////////////////\n// WEBPACK FOOTER\n// /Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/yoast-components/utils/getFeed.js\n// module id = 1319\n// module chunks = 243\n\n//# sourceURL=webpack:////Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/yoast-components/utils/getFeed.js?");

/***/ }),

/***/ 1320:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n\tvalue: true\n});\n\nvar _templateObject = _taggedTemplateLiteral([\"\\n\\tbox-sizing: border-box;\\n\\n\\tp, a {\\n\\t\\tfont-size: 14px;\\n\\t\\tmargin: 0;\\n\\t}\\n\"], [\"\\n\\tbox-sizing: border-box;\\n\\n\\tp, a {\\n\\t\\tfont-size: 14px;\\n\\t\\tmargin: 0;\\n\\t}\\n\"]),\n    _templateObject2 = _taggedTemplateLiteral([\"\\n\\tmargin: 8px 0;\\n\\tfont-size: 1em;\\n\"], [\"\\n\\tmargin: 8px 0;\\n\\tfont-size: 1em;\\n\"]),\n    _templateObject3 = _taggedTemplateLiteral([\"\\n\\tmargin: 0;\\n\\tlist-style: none;\\n\\tpadding: 0;\\n\"], [\"\\n\\tmargin: 0;\\n\\tlist-style: none;\\n\\tpadding: 0;\\n\"]),\n    _templateObject4 = _taggedTemplateLiteral([\"\\n\\tdisplay: inline-block;\\n\\tpadding-bottom: 4px;\\n\"], [\"\\n\\tdisplay: inline-block;\\n\\tpadding-bottom: 4px;\\n\"]),\n    _templateObject5 = _taggedTemplateLiteral([\"\\n\\tborder: 0;\\n\\tclip: rect(1px, 1px, 1px, 1px);\\n\\tclip-path: inset(50%);\\n\\theight: 1px;\\n\\tmargin: -1px;\\n\\toverflow: hidden;\\n\\tpadding: 0;\\n\\tposition: absolute !important;\\n\\twidth: 1px;\\n\\tword-wrap: normal !important;\\n\"], [\"\\n\\tborder: 0;\\n\\tclip: rect(1px, 1px, 1px, 1px);\\n\\tclip-path: inset(50%);\\n\\theight: 1px;\\n\\tmargin: -1px;\\n\\toverflow: hidden;\\n\\tpadding: 0;\\n\\tposition: absolute !important;\\n\\twidth: 1px;\\n\\tword-wrap: normal !important;\\n\"]),\n    _templateObject6 = _taggedTemplateLiteral([\"\\n\\tmargin: 8px 0;\\n\\toverflow: hidden;\\n\"], [\"\\n\\tmargin: 8px 0;\\n\\toverflow: hidden;\\n\"]),\n    _templateObject7 = _taggedTemplateLiteral([\"\\n\\ta {\\n\\t\\tmargin: 8px 0 0;\\n\\t}\\n\"], [\"\\n\\ta {\\n\\t\\tmargin: 8px 0 0;\\n\\t}\\n\"]);\n\nvar _react = __webpack_require__(0);\n\nvar _react2 = _interopRequireDefault(_react);\n\nvar _propTypes = __webpack_require__(1);\n\nvar _propTypes2 = _interopRequireDefault(_propTypes);\n\nvar _styledComponents = __webpack_require__(7);\n\nvar _styledComponents2 = _interopRequireDefault(_styledComponents);\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nfunction _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }\n\n/**\n * @typedef  {Object}     Feed\n * @property {string}     title       The title of the website.\n * @property {string}     description A description of the website.\n * @property {string}     link        A link to the website.\n * @property {FeedItem[]} items       The items in the feed.\n */\n\n/**\n * @typedef  {Object} FeedItem\n * @property {string} title       The title of the item.\n * @property {string} content     The content of the item, will be HTML encoded.\n * @property {string} description A summary of the content, will be HTML encoded.\n * @property {string} link        A link to the item.\n * @property {string} creator     The creator of the item.\n * @property {string} date        The publication date of the item.\n */\n\nvar WordpressFeedContainer = _styledComponents2.default.div(_templateObject);\n\nvar WordpressFeedHeader = _styledComponents2.default.h3(_templateObject2);\n\nvar WordpressFeedList = _styledComponents2.default.ul(_templateObject3);\n\nvar WordpressFeedLink = _styledComponents2.default.a(_templateObject4);\n\nvar A11yNotice = _styledComponents2.default.span(_templateObject5);\n\nvar WordpressFeedListItemContainer = _styledComponents2.default.li(_templateObject6);\n\nvar WordpressFeedFooter = _styledComponents2.default.div(_templateObject7);\n\nvar WordpressFeedListItem = function WordpressFeedListItem(props) {\n\treturn _react2.default.createElement(\n\t\tWordpressFeedListItemContainer,\n\t\t{\n\t\t\tclassName: props.className },\n\t\t_react2.default.createElement(\n\t\t\tWordpressFeedLink,\n\t\t\t{\n\t\t\t\tclassName: props.className + \"-link\",\n\t\t\t\thref: props.link,\n\t\t\t\ttarget: \"_blank\",\n\t\t\t\trel: \"noopener noreferrer\" },\n\t\t\tprops.title,\n\t\t\t_react2.default.createElement(\n\t\t\t\tA11yNotice,\n\t\t\t\tnull,\n\t\t\t\t\"( Opens in a new browser tab )\"\n\t\t\t)\n\t\t),\n\t\t_react2.default.createElement(\n\t\t\t\"p\",\n\t\t\t{ className: props.className + \"-description\" },\n\t\t\tprops.description\n\t\t)\n\t);\n};\n\nWordpressFeedListItem.propTypes = {\n\tclassName: _propTypes2.default.string.isRequired,\n\ttitle: _propTypes2.default.string.isRequired,\n\tlink: _propTypes2.default.string.isRequired,\n\tdescription: _propTypes2.default.string.isRequired\n};\n\n/**\n * Displays a parsed wordpress feed.\n *\n * @param {Object} props            The component props.\n * @param {Feed} props.feed         The feed object.\n * @param {string} props.title      The title. Defaults to feed title.\n * @param {string} props.footerHtml The footer HTML contents.\n * @param {string} props.feedLink   The footer link. Defaults to feed link.\n *\n * @returns {ReactElement} The WordpressFeed component.\n */\nvar WordpressFeed = function WordpressFeed(props) {\n\treturn _react2.default.createElement(\n\t\tWordpressFeedContainer,\n\t\t{\n\t\t\tclassName: props.className },\n\t\t_react2.default.createElement(\n\t\t\tWordpressFeedHeader,\n\t\t\t{\n\t\t\t\tclassName: props.className + \"__header\" },\n\t\t\tprops.title ? props.title : props.feed.title\n\t\t),\n\t\t_react2.default.createElement(\n\t\t\tWordpressFeedList,\n\t\t\t{\n\t\t\t\tclassName: props.className + \"__posts\",\n\t\t\t\trole: \"list\" },\n\t\t\tprops.feed.items.map(function (item) {\n\t\t\t\treturn _react2.default.createElement(WordpressFeedListItem, {\n\t\t\t\t\tclassName: props.className + \"__post\",\n\t\t\t\t\tkey: item.link,\n\t\t\t\t\ttitle: item.title,\n\t\t\t\t\tlink: item.link,\n\t\t\t\t\tdescription: item.description });\n\t\t\t})\n\t\t),\n\t\tprops.footerHtml && _react2.default.createElement(\n\t\t\tWordpressFeedFooter,\n\t\t\t{\n\t\t\t\tclassName: props.className + \"__footer\" },\n\t\t\t_react2.default.createElement(WordpressFeedLink, {\n\t\t\t\tclassName: props.className + \"__footer-link\",\n\t\t\t\thref: props.feedLink ? props.feedLink : props.feed.link,\n\t\t\t\ttarget: \"_blank\",\n\t\t\t\trel: \"noopener noreferrer\",\n\t\t\t\tdangerouslySetInnerHTML: { __html: props.footerHtml } })\n\t\t)\n\t);\n};\n\nWordpressFeed.propTypes = {\n\tclassName: _propTypes2.default.string,\n\tfeed: _propTypes2.default.object.isRequired,\n\ttitle: _propTypes2.default.string,\n\tfooterHtml: _propTypes2.default.string,\n\tfeedLink: _propTypes2.default.string\n};\n\nWordpressFeed.defaultProps = {\n\tclassName: \"wordpress-feed\"\n};\n\nexports.default = WordpressFeed;\n\n//////////////////\n// WEBPACK FOOTER\n// /Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/yoast-components/composites/Plugin/DashboardWidget/components/WordpressFeed.js\n// module id = 1320\n// module chunks = 243\n\n//# sourceURL=webpack:////Users/jip/Yoast/wp-content/plugins/wordpress-seo/node_modules/yoast-components/composites/Plugin/DashboardWidget/components/WordpressFeed.js?");

/***/ })

},[1316]);