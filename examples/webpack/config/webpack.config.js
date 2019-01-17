

const fs = require( "fs" );
const path = require( "path" );
const webpack = require( "webpack" );
const resolve = require( "resolve" );
const PnpWebpackPlugin = require( "pnp-webpack-plugin" );
const HtmlWebpackPlugin = require( "html-webpack-plugin" );
const CaseSensitivePathsPlugin = require( "case-sensitive-paths-webpack-plugin" );
const InlineChunkHtmlPlugin = require( "react-dev-utils/InlineChunkHtmlPlugin" );
const TerserPlugin = require( "terser-webpack-plugin" );
const MiniCssExtractPlugin = require( "mini-css-extract-plugin" );
const OptimizeCSSAssetsPlugin = require( "optimize-css-assets-webpack-plugin" );
const safePostCssParser = require( "postcss-safe-parser" );
const ManifestPlugin = require( "webpack-manifest-plugin" );
const InterpolateHtmlPlugin = require( "react-dev-utils/InterpolateHtmlPlugin" );
const WorkboxWebpackPlugin = require( "workbox-webpack-plugin" );
const WatchMissingNodeModulesPlugin = require( "react-dev-utils/WatchMissingNodeModulesPlugin" );
const getCSSModuleLocalIdent = require( "react-dev-utils/getCSSModuleLocalIdent" );
const paths = require( "./paths" );
const getClientEnvironment = require( "./env" );
const ModuleNotFoundPlugin = require( "react-dev-utils/ModuleNotFoundPlugin" );
const ForkTsCheckerWebpackPlugin = require( "fork-ts-checker-webpack-plugin-alt" );
const typescriptFormatter = require( "react-dev-utils/typescriptFormatter" );


// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
// Some apps do not need the benefits of saving a web request, so not inlining the chunk
// Makes for a smoother build process.
const shouldInlineRuntimeChunk = process.env.INLINE_RUNTIME_CHUNK !== "false";

// Check if TypeScript is setup
const useTypeScript = fs.existsSync( paths.appTsConfig );

// Style files regexes
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function( webpackEnv ) {
	const isEnvDevelopment = webpackEnv === "development";
	const isEnvProduction = webpackEnv === "production";

	// Webpack uses `publicPath` to determine where the app is being served from.
	// It requires a trailing slash, or the file assets will get an incorrect path.
	// In development, we always serve from the root. This makes config easier.
	const publicPath = isEnvProduction
		? paths.servedPath
		: isEnvDevelopment && "/";
	// Some apps do not use client-side routing with pushState.
	// For these, "homepage" can be set to "." to enable relative asset paths.
	const shouldUseRelativeAssetPaths = publicPath === "./";

	// `publicUrl` is just like `publicPath`, but we will provide it to our app
	// As %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
	// Omit trailing slash as %PUBLIC_URL%/xyz looks better than %PUBLIC_URL%xyz.
	const publicUrl = isEnvProduction
		? publicPath.slice( 0, -1 )
		: isEnvDevelopment && "";
	// Get environment variables to inject into our app.
	const env = getClientEnvironment( publicUrl );

	// Common function to get style loaders
	const getStyleLoaders = ( cssOptions, preProcessor ) => {
		const loaders = [
			isEnvDevelopment && require.resolve( "style-loader" ),
			isEnvProduction && {
				loader: MiniCssExtractPlugin.loader,
				options: Object.assign(
					{},
					shouldUseRelativeAssetPaths ? { publicPath: "../../" } : undefined
				),
			},
			{
				loader: require.resolve( "css-loader" ),
				options: cssOptions,
			},
			{
				// Options for PostCSS as we reference these options twice
				// Adds vendor prefixing based on your specified browser support in
				// Package.json
				loader: require.resolve( "postcss-loader" ),
				options: {
					// Necessary for external CSS imports to work
					// https://github.com/facebook/create-react-app/issues/2677
					ident: "postcss",
					plugins: () => [
						require( "postcss-flexbugs-fixes" ),
						require( "postcss-preset-env" )( {
							autoprefixer: {
								flexbox: "no-2009",
							},
							stage: 3,
						} ),
					],
					sourceMap: isEnvProduction && shouldUseSourceMap,
				},
			},
		].filter( Boolean );
		if ( preProcessor ) {
			loaders.push( {
				loader: require.resolve( preProcessor ),
				options: {
					sourceMap: isEnvProduction && shouldUseSourceMap,
				},
			} );
		}
		return loaders;
	};

	return {
		mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
		// Stop compilation early in production
		bail: isEnvProduction,
		devtool: isEnvProduction
			? shouldUseSourceMap
				? "source-map"
				: false
			: isEnvDevelopment && "cheap-module-source-map",
		// These are the "entry points" to our application.
		// This means they will be the "root" imports that are included in JS bundle.
		entry: [
			// Include an alternative client for WebpackDevServer. A client's job is to
			// Connect to WebpackDevServer by a socket and get notified about changes.
			// When you save a file, the client will either apply hot updates (in case
			// Of CSS changes), or refresh the page (in case of JS changes). When you
			// Make a syntax error, this client will display a syntax error overlay.
			// Note: instead of the default WebpackDevServer client, we use a custom one
			// To bring better experience for Create React App users. You can replace
			// The line below with these two lines if you prefer the stock client:
			// Require.resolve('webpack-dev-server/client') + '?/',
			// Require.resolve('webpack/hot/dev-server'),
			isEnvDevelopment &&
        require.resolve( "react-dev-utils/webpackHotDevClient" ),
			// Finally, this is your app's code:
			paths.appIndexJs,
			// We include the app code last so that if there is a runtime error during
			// Initialization, it doesn't blow up the WebpackDevServer client, and
			// Changing JS code would still trigger a refresh.
		].filter( Boolean ),
		output: {
			// The build folder.
			path: isEnvProduction ? paths.appBuild : undefined,
			// Add /* filename */ comments to generated require()s in the output.
			pathinfo: isEnvDevelopment,
			// There will be one main bundle, and one file per asynchronous chunk.
			// In development, it does not produce real files.
			filename: isEnvProduction
				? "static/js/[name].[chunkhash:8].js"
				: isEnvDevelopment && "static/js/bundle.js",
			// There are also additional JS chunk files if you use code splitting.
			chunkFilename: isEnvProduction
				? "static/js/[name].[chunkhash:8].chunk.js"
				: isEnvDevelopment && "static/js/[name].chunk.js",
			// We inferred the "public path" (such as / or /my-project) from homepage.
			// We use "/" in development.
			publicPath: publicPath,
			// Point sourcemap entries to original disk location (format as URL on Windows)
			devtoolModuleFilenameTemplate: isEnvProduction
				? info =>
					path
						.relative( paths.appSrc, info.absoluteResourcePath )
						.replace( /\\/g, "/" )
				: isEnvDevelopment &&
          ( info => path.resolve( info.absoluteResourcePath ).replace( /\\/g, "/" ) ),
		},
		optimization: {
			minimize: isEnvProduction,
			minimizer: [
				// This is only used in production mode
				new TerserPlugin( {
					terserOptions: {
						parse: {
							// We want terser to parse ecma 8 code. However, we don't want it
							// To apply any minfication steps that turns valid ecma 5 code
							// Into invalid ecma 5 code. This is why the 'compress' and 'output'
							// Sections only apply transformations that are ecma 5 safe
							// https://github.com/facebook/create-react-app/pull/4234
							ecma: 8,
						},
						compress: {
							ecma: 5,
							warnings: false,
							// Disabled because of an issue with Uglify breaking seemingly valid code:
							// https://github.com/facebook/create-react-app/issues/2376
							// Pending further investigation:
							// https://github.com/mishoo/UglifyJS2/issues/2011
							comparisons: false,
							// Disabled because of an issue with Terser breaking valid code:
							// https://github.com/facebook/create-react-app/issues/5250
							// Pending futher investigation:
							// https://github.com/terser-js/terser/issues/120
							inline: 2,
						},
						mangle: {
							safari10: true,
						},
						output: {
							ecma: 5,
							comments: false,
							// Turned on because emoji and regex is not minified properly using default
							// https://github.com/facebook/create-react-app/issues/2488
							ascii_only: true,
						},
					},
					// Use multi-process parallel running to improve the build speed
					// Default number of concurrent runs: os.cpus().length - 1
					parallel: true,
					// Enable file caching
					cache: true,
					sourceMap: shouldUseSourceMap,
				} ),
				// This is only used in production mode
				new OptimizeCSSAssetsPlugin( {
					cssProcessorOptions: {
						parser: safePostCssParser,
						map: shouldUseSourceMap
							? {
								// `inline: false` forces the sourcemap to be output into a
								// Separate file
								inline: false,
								// `annotation: true` appends the sourceMappingURL to the end of
								// The css file, helping the browser find the sourcemap
								annotation: true,
							}
							: false,
					},
				} ),
			],
			// Automatically split vendor and commons
			// https://twitter.com/wSokra/status/969633336732905474
			// https://medium.com/webpack/webpack-4-code-splitting-chunk-graph-and-the-splitchunks-optimization-be739a861366
			splitChunks: {
				chunks: "all",
				name: false,
			},
			// Keep the runtime chunk separated to enable long term caching
			// https://twitter.com/wSokra/status/969679223278505985
			runtimeChunk: true,
		},
		resolve: {
			// This allows you to set a fallback for where Webpack should look for modules.
			// We placed these paths second because we want `node_modules` to "win"
			// If there are any conflicts. This matches Node resolution mechanism.
			// https://github.com/facebook/create-react-app/issues/253
			modules: [ "node_modules" ].concat(
				// It is guaranteed to exist because we tweak it in `env.js`
				process.env.NODE_PATH.split( path.delimiter ).filter( Boolean )
			),
			// These are the reasonable defaults supported by the Node ecosystem.
			// We also include JSX as a common component filename extension to support
			// Some tools, although we do not recommend using it, see:
			// https://github.com/facebook/create-react-app/issues/290
			// `web` extension prefixes have been added for better support
			// For React Native Web.
			extensions: paths.moduleFileExtensions
				.map( ext => `.${ext}` )
				.filter( ext => useTypeScript || ! ext.includes( "ts" ) ),
			alias: {
				// Support React Native Web
				// https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
				"react-native": "react-native-web",
			},
			plugins: [
				// Adds support for installing with Plug'n'Play, leading to faster installs and adding
				// Guards against forgotten dependencies and such.
				PnpWebpackPlugin,
			],
		},
		resolveLoader: {
			plugins: [
				// Also related to Plug'n'Play, but this time it tells Webpack to load its loaders
				// From the current package.
				PnpWebpackPlugin.moduleLoader( module ),
			],
		},
		module: {
			strictExportPresence: true,
			rules: [
				// Disable require.ensure as it's not a standard language feature.
				{ parser: { requireEnsure: false } },

				// First, run the linter.
				// It's important to do this before Babel processes the JS.
				{
					test: /\.(js|mjs|jsx)$/,
					enforce: "pre",
					use: [
						{
							options: {
								formatter: require.resolve( "react-dev-utils/eslintFormatter" ),
								eslintPath: require.resolve( "eslint" ),

							},
							loader: require.resolve( "eslint-loader" ),
						},
					],
					include: paths.appSrc,
				},
				{
					// "oneOf" will traverse all following loaders until one will
					// Match the requirements. When no loader matches it will fall
					// Back to the "file" loader at the end of the loader list.
					oneOf: [
						// "url" loader works like "file" loader except that it embeds assets
						// Smaller than specified limit in bytes as data URLs to avoid requests.
						// A missing `test` is equivalent to a match.
						{
							test: [ /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/ ],
							loader: require.resolve( "url-loader" ),
							options: {
								limit: 10000,
								name: "static/media/[name].[hash:8].[ext]",
							},
						},
						// Process application JS with Babel.
						// The preset includes JSX, Flow, TypeScript, and some ESnext features.
						{
							test: /\.(js|mjs|jsx|ts|tsx)$/,
							include: paths.appSrc,
							loader: require.resolve( "babel-loader" ),
							options: {
								customize: require.resolve(
									"babel-preset-react-app/webpack-overrides"
								),

								plugins: [
									[
										require.resolve( "babel-plugin-named-asset-import" ),
										{
											loaderMap: {
												svg: {
													ReactComponent:
                            "@svgr/webpack?-prettier,-svgo![path]",
												},
											},
										},
									],
								],
								// This is a feature of `babel-loader` for webpack (not Babel itself).
								// It enables caching results in ./node_modules/.cache/babel-loader/
								// Directory for faster rebuilds.
								cacheDirectory: true,
								cacheCompression: isEnvProduction,
								compact: isEnvProduction,
							},
						},
						// Process any JS outside of the app with Babel.
						// Unlike the application JS, we only compile the standard ES features.
						{
							test: /\.(js|mjs)$/,
							exclude: /@babel(?:\/|\\{1,2})runtime/,
							loader: require.resolve( "babel-loader" ),
							options: {
								babelrc: false,
								configFile: false,
								compact: false,
								presets: [
									[
										require.resolve( "babel-preset-react-app/dependencies" ),
										{ helpers: true },
									],
								],
								cacheDirectory: true,
								cacheCompression: isEnvProduction,

								// If an error happens in a package, it's possible to be
								// Because it was compiled. Thus, we don't want the browser
								// Debugger to show the original code. Instead, the code
								// Being evaluated would be much more helpful.
								sourceMaps: false,
							},
						},
						// "postcss" loader applies autoprefixer to our CSS.
						// "css" loader resolves paths in CSS and adds assets as dependencies.
						// "style" loader turns CSS into JS modules that inject <style> tags.
						// In production, we use MiniCSSExtractPlugin to extract that CSS
						// To a file, but in development "style" loader enables hot editing
						// Of CSS.
						// By default we support CSS Modules with the extension .module.css
						{
							test: cssRegex,
							exclude: cssModuleRegex,
							use: getStyleLoaders( {
								importLoaders: 1,
								sourceMap: isEnvProduction && shouldUseSourceMap,
							} ),
							// Don't consider CSS imports dead code even if the
							// Containing package claims to have no side effects.
							// Remove this when webpack adds a warning or an error for this.
							// See https://github.com/webpack/webpack/issues/6571
							sideEffects: true,
						},
						// Adds support for CSS Modules (https://github.com/css-modules/css-modules)
						// Using the extension .module.css
						{
							test: cssModuleRegex,
							use: getStyleLoaders( {
								importLoaders: 1,
								sourceMap: isEnvProduction && shouldUseSourceMap,
								modules: true,
								getLocalIdent: getCSSModuleLocalIdent,
							} ),
						},
						// Opt-in support for SASS (using .scss or .sass extensions).
						// By default we support SASS Modules with the
						// Extensions .module.scss or .module.sass
						{
							test: sassRegex,
							exclude: sassModuleRegex,
							use: getStyleLoaders(
								{
									importLoaders: 2,
									sourceMap: isEnvProduction && shouldUseSourceMap,
								},
								"sass-loader"
							),
							// Don't consider CSS imports dead code even if the
							// Containing package claims to have no side effects.
							// Remove this when webpack adds a warning or an error for this.
							// See https://github.com/webpack/webpack/issues/6571
							sideEffects: true,
						},
						// Adds support for CSS Modules, but using SASS
						// Using the extension .module.scss or .module.sass
						{
							test: sassModuleRegex,
							use: getStyleLoaders(
								{
									importLoaders: 2,
									sourceMap: isEnvProduction && shouldUseSourceMap,
									modules: true,
									getLocalIdent: getCSSModuleLocalIdent,
								},
								"sass-loader"
							),
						},
						// "file" loader makes sure those assets get served by WebpackDevServer.
						// When you `import` an asset, you get its (virtual) filename.
						// In production, they would get copied to the `build` folder.
						// This loader doesn't use a "test" so it will catch all modules
						// That fall through the other loaders.
						{
							loader: require.resolve( "file-loader" ),
							// Exclude `js` files to keep "css" loader working as it injects
							// Its runtime that would otherwise be processed through "file" loader.
							// Also exclude `html` and `json` extensions so they get processed
							// By webpacks internal loaders.
							exclude: [ /\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/ ],
							options: {
								name: "static/media/[name].[hash:8].[ext]",
							},
						},
						// ** STOP ** Are you adding a new loader?
						// Make sure to add the new loader(s) before the "file" loader.
					],
				},
			],
		},
		plugins: [
			// Generates an `index.html` file with the <script> injected.
			new HtmlWebpackPlugin(
				Object.assign(
					{},
					{
						inject: true,
						template: paths.appHtml,
					},
					isEnvProduction
						? {
							minify: {
								removeComments: true,
								collapseWhitespace: true,
								removeRedundantAttributes: true,
								useShortDoctype: true,
								removeEmptyAttributes: true,
								removeStyleLinkTypeAttributes: true,
								keepClosingSlash: true,
								minifyJS: true,
								minifyCSS: true,
								minifyURLs: true,
							},
						}
						: undefined
				)
			),
			// Inlines the webpack runtime script. This script is too small to warrant
			// A network request.
			isEnvProduction &&
        shouldInlineRuntimeChunk &&
        new InlineChunkHtmlPlugin( HtmlWebpackPlugin, [ /runtime~.+[.]js/ ] ),
			// Makes some environment variables available in index.html.
			// The public URL is available as %PUBLIC_URL% in index.html, e.g.:
			// <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
			// In production, it will be an empty string unless you specify "homepage"
			// In `package.json`, in which case it will be the pathname of that URL.
			// In development, this will be an empty string.
			new InterpolateHtmlPlugin( HtmlWebpackPlugin, env.raw ),
			// This gives some necessary context to module not found errors, such as
			// The requesting resource.
			new ModuleNotFoundPlugin( paths.appPath ),
			// Makes some environment variables available to the JS code, for example:
			// If (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
			// It is absolutely essential that NODE_ENV is set to production
			// During a production build.
			// Otherwise React will be compiled in the very slow development mode.
			new webpack.DefinePlugin( env.stringified ),
			// This is necessary to emit hot updates (currently CSS only):
			isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
			// Watcher doesn't work well if you mistype casing in a path so we use
			// A plugin that prints an error when you attempt to do this.
			// See https://github.com/facebook/create-react-app/issues/240
			isEnvDevelopment && new CaseSensitivePathsPlugin(),
			// If you require a missing module and then `npm install` it, you still have
			// To restart the development server for Webpack to discover it. This plugin
			// Makes the discovery automatic so you don't have to restart.
			// See https://github.com/facebook/create-react-app/issues/186
			isEnvDevelopment &&
        new WatchMissingNodeModulesPlugin( paths.appNodeModules ),
			isEnvProduction &&
        new MiniCssExtractPlugin( {
        	// Options similar to the same options in webpackOptions.output
        	// Both options are optional
        	filename: "static/css/[name].[contenthash:8].css",
        	chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
        } ),
			// Generate a manifest file which contains a mapping of all asset filenames
			// To their corresponding output file so that tools can pick it up without
			// Having to parse `index.html`.
			new ManifestPlugin( {
				fileName: "asset-manifest.json",
				publicPath: publicPath,
			} ),
			// Moment.js is an extremely popular library that bundles large locale files
			// By default due to how Webpack interprets its code. This is a practical
			// Solution that requires the user to opt into importing specific locales.
			// https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
			// You can remove this if you don't use Moment.js:
			new webpack.IgnorePlugin( /^\.\/locale$/, /moment$/ ),
			// Generate a service worker script that will precache, and keep up to date,
			// The HTML & assets that are part of the Webpack build.
			isEnvProduction &&
        new WorkboxWebpackPlugin.GenerateSW( {
        	clientsClaim: true,
        	exclude: [ /\.map$/, /asset-manifest\.json$/ ],
        	importWorkboxFrom: "cdn",
        	navigateFallback: publicUrl + "/index.html",
        	navigateFallbackBlacklist: [
        		// Exclude URLs starting with /_, as they're likely an API call
        		new RegExp( "^/_" ),
        		// Exclude URLs containing a dot, as they're likely a resource in
        		// Public/ and not a SPA route
        		new RegExp( "/[^/]+\\.[^/]+$" ),
        	],
        } ),
			// TypeScript type checking
			useTypeScript &&
        new ForkTsCheckerWebpackPlugin( {
        	typescript: resolve.sync( "typescript", {
        		basedir: paths.appNodeModules,
        	} ),
        	async: false,
        	checkSyntacticErrors: true,
        	tsconfig: paths.appTsConfig,
        	compilerOptions: {
        		module: "esnext",
        		moduleResolution: "node",
        		resolveJsonModule: true,
        		isolatedModules: true,
        		noEmit: true,
        		jsx: "preserve",
        	},
        	reportFiles: [
        		"**",
        		"!**/*.json",
        		"!**/__tests__/**",
        		"!**/?(*.)(spec|test).*",
        		"!**/src/setupProxy.*",
        		"!**/src/setupTests.*",
        	],
        	watch: paths.appSrc,
        	silent: true,
        	formatter: typescriptFormatter,
        } ),
		].filter( Boolean ),
		// Some libraries import Node modules but don't use them in the browser.
		// Tell Webpack to provide empty mocks for them so importing them works.
		node: {
			dgram: "empty",
			fs: "empty",
			net: "empty",
			tls: "empty",
			child_process: "empty",
		},
		// Turn off performance processing because we utilize
		// Our own hints via the FileSizeReporter
		performance: false,
	};
};
