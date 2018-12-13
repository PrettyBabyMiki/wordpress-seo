import ListItem from "../../../../src/tree/values/nodes/ListItem";

describe( "ListItem", () => {
	it( "can make a ListItem node", () => {
		const listItemNode = new ListItem();
		expect( listItemNode.type ).toEqual( "ListItem" );
		expect( listItemNode.startIndex ).toEqual( 0 );
		expect( listItemNode.endIndex ).toEqual( 0 );
		expect( listItemNode.children ).toEqual( [] );
	} );
} );
