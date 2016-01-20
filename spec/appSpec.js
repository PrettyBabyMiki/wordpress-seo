require("./helpers/i18n.js");
require("../js/config/config.js");
require("../js/config/scoring.js");
require("../js/analyzer.js");
require("../js/app.js");
require("../js/browser.js");
require("../js/pluggable.js");
require("../js/preprocessor.js");
require("../js/scoreFormatter.js");
require("../js/stringHelper.js");
require("../js/templates.js");

var args = {};

describe( "Creating an app without any arguments", function(){
	it( "throws error for missing argument", function(){
		var app = new YoastSEO.App();
	} )
} );
