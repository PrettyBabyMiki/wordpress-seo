import apiFetch from "@wordpress/api-fetch";
import { __ } from "@wordpress/i18n";
import { useEffect, useState, useCallback } from "@wordpress/element";
import { makeOutboundLink } from "@yoast/helpers";
import { Button, Alert, Modal } from "@yoast/ui-library";
import IndexablesTable from "./components/indexables-table";
import SvgIcon from "../../../components/src/SvgIcon";
/* eslint-disable camelcase */
/**
 * A table.
 *
 * @returns {WPElement} A table.
 */
function IndexablesPage() {
	const [ listedIndexables, setlistedIndexables ] = useState(
		{
			least_readability: [],
			least_seo_score: [],
			most_linked: [],
			least_linked: [],
		}
	);
	const [ ignoreIndexable, setIgnoreIndexable ] = useState( null );
	const [ isModalOpen, setIsModalOpen ] = useState( false );
	const [ suggestedLinksList, setSuggestedLinksList ] = useState( [] );

	/**
	 * Fetches a list of indexables.
	 *
	 * @param {string} listName The name of the list to fetch.
	 * @param {function} setList The list setter.
	 *
	 * @returns {boolean} True if the request was successful.
	 */
	const fetchList = async( listName ) => {
		try {
			const response = await apiFetch( {
				path: `yoast/v1/${ listName }`,
				method: "GET",
			} );

			const parsedResponse = await response.json;
			setlistedIndexables( prevState => {
				return {
					...prevState,
					[ listName ]: parsedResponse.list,
				};
			  } );
			return true;
		} catch ( e ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( e.message );
			return false;
		}
	};

	/**
	 * Fetches a list of indexables.
	 *
	 * @param {string} listName The name of the list to fetch.
	 *
	 * @returns {void}
	 */
	const renderList = ( listName ) => {
		if ( ignoreIndexable === null ) {
			return;
		}

		setlistedIndexables( prevState => {
			return {
				...prevState,
				[ listName ]: prevState[ listName ].filter( indexable => {
					return indexable.id !== ignoreIndexable.indexable.id;
				} ),
			};
		} );
	};

	/* eslint-disable  complexity */
	/**
	 * Updates the content of a list of indexables.
	 *
	 * @param {string} listName The name of the list to fetch.
	 * @param {array} indexables The name of the list to fetch.
	 *
	 * @returns {boolean} True if the update was successful.
	 */
	const updateList = ( listName, indexables ) => {
		return ( indexables.length < 7 ) ? fetchList( listName ) : renderList( listName );
	};

	const handleOpenModal = useCallback( async( indexableId ) => {
		setIsModalOpen( true );
		try {
			const response = await apiFetch( {
				path: "yoast/v1/workouts/link_suggestions?indexableId=" + indexableId,
				method: "GET",
			} );

			const parsedResponse = await response.json;

			if ( parsedResponse.length > 0 ) {
				setSuggestedLinksList( parsedResponse );
				console.log(parsedResponse);
				return true;
			}
			return false;
		} catch ( error ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( error.message );
			return false;
		}
	}, [ setSuggestedLinksList, setIsModalOpen ] );

	const handleCloseModal = useCallback( () => {
		setIsModalOpen( false );
		setSuggestedLinksList( [] );
	}, [] );

	const handleUndo = useCallback( async( ignored ) => {
		const id = ignored.indexable.id;
		const type = ignored.type;
		const indexable = ignored.indexable;
		const position = ignored.position;

		try {
			const response = await apiFetch( {
				path: "yoast/v1/restore_indexable",
				method: "POST",
				data: { id: id, type: type },
			} );

			const parsedResponse = await response.json;
			if ( parsedResponse.success ) {
				setlistedIndexables( prevState => {
					const newData = prevState[ type ].slice( 0 );

					newData.splice( position, 0, indexable );
					return {
						...prevState,
						[ type ]: newData,
					};
				} );
				setIgnoreIndexable( null );
				return true;
			}
			return false;
		} catch ( error ) {
			// URL() constructor throws a TypeError exception if url is malformed.
			console.error( error.message );
			return false;
		}
	}, [ apiFetch, setlistedIndexables, listedIndexables, setIgnoreIndexable ] );

	const onClickUndo = useCallback( ( ignored ) => {
		return () => handleUndo( ignored );
	}, [ handleUndo ] );

	useEffect( async() => {
		updateList( "least_readability", listedIndexables.least_readability );
	}, [] );

	useEffect( async() => {
		updateList( "least_seo_score", listedIndexables.least_seo_score );
	}, [] );

	useEffect( async() => {
		updateList( "most_linked", listedIndexables.most_linked );
	}, [] );

	useEffect( async() => {
		updateList( "least_linked", listedIndexables.least_linked );
	}, [] );

	useEffect( async() => {
		if ( ignoreIndexable !== null ) {
			return updateList( ignoreIndexable.type, listedIndexables[ ignoreIndexable.type ] );
		}
	}, [ ignoreIndexable ] );

	return <div
		className="yst-bg-white yst-rounded-lg yst-p-6 yst-shadow-md yst-max-w-full yst-mt-6"
	>
		<Modal
			onClose={ handleCloseModal }
			isOpen={ isModalOpen }
		>
			{ suggestedLinksList.length === 0 ? <SvgIcon icon="loading-spinner" /> : <ul>
				{
					suggestedLinksList.map( ( link, idx ) => {
						return <li key={ idx }>
							{ link.breadcrumb_title }
						</li>;
					}
					)
				}
			</ul> }
		</Modal>

		{ ignoreIndexable && <Alert><Button onClick={ onClickUndo( ignoreIndexable ) }>{ `Ignore ${ignoreIndexable.indexable.id}` }</Button></Alert> }
		<header className="yst-border-b yst-border-gray-200"><div className="yst-max-w-screen-sm yst-p-8"><h2 className="yst-text-2xl yst-font-bold">{ __( "Indexables page", "wordpress-seo" ) }</h2></div></header>
		<h3 className="yst-my-4 yst-text-xl">{ __( "Least Readability Score", "wordpress-seo" ) }</h3>
		<IndexablesTable
			indexables={ listedIndexables.least_readability }
			keyHeaderMap={
				{
					/* eslint-disable camelcase */
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					readability_score: __( "Readability Score", "wordpress-seo" ),
					edit: __( "Edit", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
					links: __( "Find posts to link to", "wordpress-seo" ),
					/* eslint-enable camelcase */
				}
			}
			type="least_readability"
			addToIgnoreList={ setIgnoreIndexable }
			handleOpenModal={ handleOpenModal }
		/>
		<h3 className="yst-my-4 yst-text-xl">{ __( "Least SEO Score", "wordpress-seo" ) }</h3>
		<IndexablesTable
			indexables={ listedIndexables.least_seo_score }
			keyHeaderMap={
				{
					/* eslint-disable camelcase */
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					primary_focus_keyword_score: __( "SEO Score", "wordpress-seo" ),
					edit: __( "Edit", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
					links: __( "Find posts to link to", "wordpress-seo" ),
					/* eslint-enable camelcase */
				}
			}
			type="least_seo_score"
			addToIgnoreList={ setIgnoreIndexable }
			handleOpenModal={ handleOpenModal }
		/>
		<h3 className="yst-my-4 yst-text-xl">{ __( "Least Linked", "wordpress-seo" ) }</h3>
		<IndexablesTable
			indexables={ listedIndexables.least_linked }
			keyHeaderMap={
				{
					/* eslint-disable camelcase */
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					incoming_link_count: __( "Incoming links", "wordpress-seo" ),
					edit: __( "Edit", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
					links: __( "Find posts to link to", "wordpress-seo" ),
					/* eslint-enable camelcase */
				}
			}
			type="least_linked"
			addToIgnoreList={ setIgnoreIndexable }
			handleOpenModal={ handleOpenModal }
		/>
		<h3 className="yst-my-4 yst-text-xl">{ __( "Most Linked", "wordpress-seo" ) }</h3>
		<IndexablesTable
			indexables={ listedIndexables.most_linked }
			keyHeaderMap={
				{
					/* eslint-disable camelcase */
					breadcrumb_title: __( "Title", "wordpress-seo" ),
					incoming_link_count: __( "Incoming links", "wordpress-seo" ),
					edit: __( "Edit", "wordpress-seo" ),
					ignore: __( "Ignore", "wordpress-seo" ),
					links: __( "Find posts to link to", "wordpress-seo" ),
					/* eslint-enable camelcase */
				}
			}
			type="most_linked"
			addToIgnoreList={ setIgnoreIndexable }
			handleOpenModal={ handleOpenModal }
		/>

	</div>;
}

export default IndexablesPage;
