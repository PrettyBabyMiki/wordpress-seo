import Headings from "../../../../src/parsedPaper/research/researches/Headings";
import TreeResearcher from "../../../../src/parsedPaper/research/TreeResearcher";
import Heading from "../../../../src/parsedPaper/structure/tree/nodes/Heading";
import buildTreeFromYaml from "../../../specHelpers/buildTreeFromYaml";

describe( "Headings", () => {
	let tree;
	beforeEach( () => {
		tree = buildTreeFromYaml`
Structured:
  tag: root
  sourceStartIndex: 23
  sourceEndIndex: 50
  children:
    - Heading:
        level: 1
        sourceStartIndex: 25
        sourceEndIndex: 30
        text: This is a heading level 1.
    - Paragraph:
        tag: p
        sourceStartIndex: 23
        sourceEndIndex: 50
        text: This is a paragraph.
    - Structured:
        tag: section
        sourceStartIndex: 23
        sourceEndIndex: 50
        children:
          - Heading:
              level: 2
              sourceStartIndex: 23
              sourceEndIndex: 50
              text: This is a heading level 2.
          - Paragraph:
              tag: p
              sourceStartIndex: 23
              sourceEndIndex: 50
              text: This is another paragraph.
`;
	} );

	it( "gives back a list of headings when applying the research to a text with the researcher.", done => {
		const researcher = new TreeResearcher();
		const headings = new Headings();

		const heading1 = new Heading( 1 );
		heading1.text = "This is a heading level 1.";
		heading1.sourceStartIndex = 25;
		heading1.sourceEndIndex = 30;
		heading1.setResearchResult( "headings", [ heading1 ] );

		const heading2 = new Heading( 2 );
		heading2.text = "This is a heading level 2.";
		heading2.sourceStartIndex = 23;
		heading2.sourceEndIndex = 50;
		heading2.setResearchResult( "headings", [ heading2 ] );

		const expected = [ heading1, heading2 ];

		researcher.addResearch( "headings", headings );
		researcher.doResearch( "headings", tree ).then(
			results => {
				expect( results ).toEqual( expected );
				done();
			}
		);
	} );

	it( "gives back an empty list of when applying the research to a text with no headings.", done => {
		const researcher = new TreeResearcher();
		const headings = new Headings();

		const treeNoHeadings = buildTreeFromYaml`
Structured:
  tag: root
  sourceStartIndex: 23
  sourceEndIndex: 50
  children:
    - Paragraph:
        tag: p
        sourceStartIndex: 23
        sourceEndIndex: 50
        text: This is a paragraph.
    - Structured:
        tag: section
        sourceStartIndex: 23
        sourceEndIndex: 50
        children:
          - Paragraph:
              tag: p
              sourceStartIndex: 23
              sourceEndIndex: 50
              text: This is another paragraph.
`;

		const expected = [];

		researcher.addResearch( "headings", headings );
		researcher.doResearch( "headings", treeNoHeadings ).then(
			results => {
				expect( results ).toEqual( expected );
				done();
			}
		);
	} );
} );
