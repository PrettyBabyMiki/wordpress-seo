import { TrashIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";
import { __ } from "@wordpress/i18n";
import { PropTypes } from "prop-types";

/**
 * The FieldArray component.
 *
 * @param {array} data The array data.
 * @param {Node} addButtonChildren Children for the add item button.
 *
 * @returns {Component} The FieldArray component.
 */
const FieldArray = ( { items, onAddProfile, onRemoveProfile, onChangeProfile, addButtonChildren, fieldType: Component } ) => {
	
	return (
		<div>
			{ items.map( ( item, index ) => (
				<div key={ `url-${ index }` } className="yst-flex">
					<div className="yst-flex-grow">
						<Component
							label={ __( "Other URL", "wordpress-seo" ) }
							id={ `social-input-other-url-${index}` }
							value={ item }
							socialMedium="other"
							index={ index }
							onChange={ onChangeProfile }
						/>
					</div>
					<button
						onClick={ () => onRemoveProfile( index ) }
						className="yst-ml-2 yst-p-3 yst-text-gray-500 yst-rounded-md hover:yst-text-gray-600 focus:yst-text-gray-600 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-indigo-500"
					>
						<span className="yst-sr-only">{ __( "Delete item", "admin-ui" ) }</span>
						<TrashIcon className="yst-relative yst--top-0.5 yst-w-5 yst-h-5" />
					</button>
				</div>
			) ) }
			<button
				type="button"
				className="yst-button yst-button--secondary yst-items-center yst-mt-2"
				onClick={ onAddProfile }
			>
				<PlusIcon className="yst-w-5 yst-h-5 yst-mr-1 yst-text-gray-400" />
				{ addButtonChildren }
			</button>
		</div>
	);
};

FieldArray.propTypes = {
	fieldType: PropTypes.elementType.isRequired,
	items: PropTypes.array.isRequired,
	onAddProfile: PropTypes.func.isRequired,
	onRemoveProfile: PropTypes.func.isRequired,
	onChangeProfile: PropTypes.func.isRequired,
	addButtonChildren: PropTypes.node,
};

FieldArray.defaultProps = {
	addButtonChildren: __( "Add another URL", "wordpress-seo" ),
};

export default FieldArray;

