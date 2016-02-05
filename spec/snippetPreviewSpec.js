var SnippetPreview = require("../js/snippetPreview.js");
require("../js/app.js");

describe("The snippet preview constructor", function() {
	it("accepts an App object as an opts property", function() {
		var mockApp = {
			rawData: {
				snippetTitle: "",
				snippetCite: "",
				snippetMeta: ""
			}
		};
		// Makes lodash think this is a valid HTML element
		var mockElement = [];
		mockElement.nodeType = 1;

		var snippetPreview = new SnippetPreview({
			analyzerApp: mockApp,
			targetElement: mockElement
		});

		expect(snippetPreview.refObj).toBe(mockApp);
	})
});

describe( "The SnippetPreview format functions", function(){
	it( "formats texts to use in the SnippetPreview", function(){
		// Makes lodash think this is a valid HTML element
		var mockElement = [];
		mockElement.nodeType = 1;

		var mockApp = {
			rawData: {
				snippetTitle: "<span>snippetTitle</span>",
				snippetCite: "homeurl",
				snippetMeta: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ultricies placerat nisl, in tempor ligula. Pellentesque in risus non quam maximus maximus sed a dui. In sed.",
				keyword: "keyword"
			},
			pluggable: {
				loaded: true,
				_applyModifications: function(name, text){return text}
			}
		};

		var snippetPreview = new SnippetPreview({
			analyzerApp: mockApp,
			targetElement: mockElement
		});

		expect( snippetPreview.formatTitle() ).toBe( "snippetTitle" );
		expect( snippetPreview.formatMeta() ).toBe( "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc ultricies placerat nisl, in tempor ligula. Pellentesque in risus non quam maximus maximus sed " );
		expect( snippetPreview.formatCite() ).toBe( "homeurl/" );
		expect( snippetPreview.formatKeyword( "a string with keyword" ) ).toBe( "a string with<strong> keyword</strong>" );

		mockApp = {
			rawData: {
				snippetCite: "key-word",
				keyword: "key word"
			},
			pluggable: {
				loaded: true,
				_applyModifications: function(name, text){return text}
			}
		};

		snippetPreview = new SnippetPreview({
			analyzerApp: mockApp,
			targetElement: mockElement
		});

		expect( snippetPreview.formatCite() ).toBe ("<strong>key-word</strong>/" );

	});
} );
