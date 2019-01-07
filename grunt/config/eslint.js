// See https://github.com/sindresorhus/grunt-eslint
module.exports = function( grunt ) {
	const fix = grunt.option( "fix" ) || false;

	return {
		target: {
			src: [ "<%= files.js %>", "<%= files.jsDontLint %>" ],
			options: {
				maxWarnings: 84,
				fix: fix,
			},
		},
		tests: {
			src: [ "<%= files.jsTests %>" ],
			options: {
				configFile: ".eslintrc-tests",
				maxWarnings: 102,
				fix: fix,
			},
		},
	};
};
