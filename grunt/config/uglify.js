// https://github.com/gruntjs/grunt-contrib-uglify
module.exports = {
	"js-text-analysis": {
		options: {
			preserveComments: "some",
			report: "gzip"
		},
		files: {
			"<%= paths.js %>/dist/yoast-seo-content-analysis.min.js": [
				"dist/yoast-seo-content-analysis.min.js"
			],
			"<%= paths.js %>/dist/yoast-seo-content-analyzer.min.js": [
				"<%= files.jed %>",
				"<%= paths.js %>/analyzer.js",
				"<%= paths.js %>/config/scoring.js"
			]
		}
	}
};
