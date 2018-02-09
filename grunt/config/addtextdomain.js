// See https://github.com/blazersix/grunt-wp-i18n for details.
module.exports = {
	options: {
		textdomain: "<%= pkg.plugin.textdomain %>",
	},
	plugin: {
		files: {
			src: [
				"<%= files.php %>",
				"!admin/license-manager/**",
				"!admin/i18n-module/**",
				"!premium/**",
			],
		},
	},
};
