[![Build Status](https://travis-ci.org/Yoast/YoastSEO.js.svg?branch=master)](https://travis-ci.org/Yoast/js-text-analysis)
[![Code Climate](https://codeclimate.com/repos/5524f75d69568028f6000fda/badges/f503961401819f93c64c/gpa.svg)](https://codeclimate.com/repos/5524f75d69568028f6000fda/feed)
[![Test Coverage](https://codeclimate.com/repos/5524f75d69568028f6000fda/badges/f503961401819f93c64c/coverage.svg)](https://codeclimate.com/repos/5524f75d69568028f6000fda/coverage)
[![Inline docs](http://inch-ci.org/github/yoast/yoastseo.js.svg?branch=master)](http://inch-ci.org/github/yoast/yoastseo.js)

# YoastSEO.js

Text analysis and assessment library in JavaScript. This library can generate interesting metrics about a text and assess these metrics to give you an assessment which can be used to improve the text.

![Screenshot of the assessment of the given text](/images/assessment.png?raw=true)

Also included is a preview of the Google search results which can be assessed using the library.

## Installation

You can install YoastSEO.js using npm:

```bash
npm install yoastseo
```

Or using yarn:

```bash
yarn add yoastseo
```

## Usage

You can either use YoastSEO.js using the web worker API or use the internal components directly.

Because a web worker must be a separate script in the browser you first need to create a script for inside the web worker:

```js
import { AnalysisWebWorker } from "yoastseo";

const worker = new AnalysisWebWorker( self );
worker.register();
``` 

Then in a different script you have the following code:

```js
import { AnalysisWorkerWrapper, createWorker, Paper } from "yoastseo";

// `url` needs to be the full URL to the script for the browser to know where to load the worker script from.
// This should be the script created by the previous code-snippet.
const url = "https://my-site-url.com/"

const worker = new AnalysisWorkerWrapper( createWorker( url ) );

worker.initialize( {
    locale: "en_US",
    contentAnalysisActive: true,
    keywordAnalysisActive: true,
    logLevel: "ERROR",
} ).then( () => {
    // The worker has been configured, we can now analyze a Paper.
    const paper = new Paper( "Text to analyze", {
        keyword: "analyze",
    } );
    
    return worker.analyze( paper );
} ).then( ( results ) => {
    console.log( 'Analysis results:' );
    console.log( results );
} ).catch( ( error ) => {
    console.error( 'An error occured while analyzing the text:' );
    console.error( error );
} );
```

### Usage of internal components

If you want to have a more barebones API, or are in an environment without access to Web Worker you can use the internal objects:

```js
import { Researcher, Paper } from "yoastseo";

const paper = new Paper( "Text to analyze", {
    keyword: "analyze",
} );
const researcher = new Researcher( paper );

console.log( researcher.getResearch( "wordCountInText" ) );
```

**Note: This is currently a synchronous API, but will become an asynchronous API in the future.**

## Supported languages
| Language   	| Transition words 	| Flesch reading ease 	| Passive voice 	| Sentence beginnings 	| Sentence length<sup>1</sup> 	| Function words<sup>2</sup> 	|
|------------	|------------------	|---------------------	|---------------	|---------------------	|-----------------------------	|----------------------------	|
| English    	| ✅                	| ✅                   	| ✅             	| ✅                   	| ✅                           	| ✅                          	|
| German     	| ✅                	| ✅                   	| ✅             	| ✅                   	| ✅                           	| ✅                          	|
| Dutch      	| ✅                	| ✅                   	| ✅             	| ✅                   	| ✅                           	| ✅                          	|
| French     	| ✅                	| ✅                   	| ✅             	| ✅                   	| ✅                           	| ✅                          	|
| Spanish    	| ✅                	| ✅                   	| ✅             	| ✅                   	| ✅                           	| ✅                          	|
| Italian    	| ✅                	| ✅                   	| ✅             	| ✅                   	| ✅                           	| ✅                          	|
| Japanese   	|                  	| ❌<sup>3</sup>       	| ❌<sup>3</sup> 	| ❌<sup>3</sup>       	|                             	|                            	|
| Portuguese 	| ✅                	|                     	|               	|                     	|                             	| ✅                          	|
| Russian    	| ✅                	| ✅                   	| ✅             	| ✅                   	| ✅                           	| ✅                          	|
| Catalan    	| ✅                	|                     	|               	|                     	|                             	|                            	|
| Polish     	| ✅                	| ❌<sup>4</sup>       	| ✅             	| ✅                   	| ✅                           	| ✅                          	|
| Swedish    	| ✅                	| ❌<sup>4</sup>       	| ✅             	| ✅                   	| ✅                           	| ✅                          	|

<sup>1</sup> This means the default upper limit of 20 words has been verified for this language, or the upper limit has been changed.

<sup>2</sup> These are used for internal linking, insights and keyphrase-related analyses.

<sup>3</sup> This means that this feature doesn't make sense for the specific language.

<sup>4</sup> There is no existing Flesch reading ease formula for these languages.


The following readability assessments are available for all languages: 
- sentence length (with a default upper limit of 20 words, see<sup>1</sup> above )
- paragraph length
- subheading distribution

## Change log

Please see [CHANGELOG](CHANGELOG.md) for more information what has changed recently.

## Documentation

The data that will be analyzed by YoastSEO.js can be modified by plugins. Plugins can also add new research and assessments. To find out how to do this, checkout out the [customization documentation](./docs/Customization.md).

## Testing

```bash
npm test
```

Generate coverage using the `--coverage` flag.

## Code style

To test your code style:

```bash
grunt check
```

## Testing with Yoast SEO

In the YoastSEO.js directory, run:

```bash
npm link
```

Then, in the [Yoast SEO](https://github.com/Yoast/wordpress-seo) directory, assuming you have a complete development version, run:

```bash
npm link yoastseo
grunt build:js && grunt build:css
```

From that point on you need to re-do `grunt build:js && grunt build:css` when you make changes to YoastSEO.js. If you want to unlink, simply do:

```bash
npm unlink yoastseo
```

## Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## Security

If you discover any security related issues, please email security [at] yoast.com instead of using the issue tracker.

## Credits

- [Team Yoast](https://github.com/orgs/Yoast/people)
- [All Contributors](https://github.com/Yoast/YoastSEO.js/graphs/contributors)

## License

We follow the GPL. Please see [License](LICENSE) file for more information.
