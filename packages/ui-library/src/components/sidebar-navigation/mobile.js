import { Dialog } from "@headlessui/react";
import { MenuAlt2Icon, XIcon } from "@heroicons/react/outline";
import { useCallback } from "@wordpress/element";
import PropTypes from "prop-types";
import { useNavigationContext } from "./index";

/**
 * @param {JSX.node} children The menu items.
 * @param {string} [openButtonScreenReaderText] The open button screen reader text.
 * @param {string} [closeButtonScreenReaderText] The close button screen reader text.
 * @returns {JSX.Element} The mobile element.
 */
const Mobile = ( { children, openButtonScreenReaderText, closeButtonScreenReaderText } ) => {
	const { isMobileMenuOpen, setMobileMenuOpen } = useNavigationContext();
	const openMobileMenu = useCallback( () => setMobileMenuOpen( true ), [ setMobileMenuOpen ] );
	const closeMobileMenu = useCallback( () => setMobileMenuOpen( false ), [ setMobileMenuOpen ] );

	return <>
		<Dialog className="yst-root" open={ isMobileMenuOpen } onClose={ closeMobileMenu }>
			<div className="yst-mobile-navigation__dialog">
				<div className="yst-fixed yst-inset-0 yst-bg-slate-600 yst-bg-opacity-75 yst-z-30" aria-hidden="true" />
				<Dialog.Panel className="yst-relative yst-flex yst-flex-1 yst-flex-col yst-max-w-xs yst-w-full yst-z-40 yst-bg-slate-100">
					<div className="yst-absolute yst-top-0 yst-right-0 yst--mr-14 yst-p-1">
						<button
							className="yst-flex yst-h-12 yst-w-12 yst-items-center yst-justify-center yst-rounded-full focus:yst-outline-none yst-bg-slate-600 focus:yst-ring-2 focus:yst-ring-inset focus:yst-ring-primary-500"
							onClick={ closeMobileMenu }
						>
							<span className="yst-sr-only">{ closeButtonScreenReaderText }</span>
							<XIcon className="yst-h-6 yst-w-6 yst-text-white" />
						</button>
					</div>
					<div className="yst-flex-1 yst-h-0 yst-overflow-y-auto">
						<nav className="yst-h-full yst-flex yst-flex-col yst-py-6 yst-px-2">
							{ children }
						</nav>
					</div>
				</Dialog.Panel>
			</div>
		</Dialog>
		<div className="yst-mobile-navigation__top">
			<div className="yst-flex yst-relative yst-flex-shrink-0 yst-h-16 yst-z-10 yst-bg-white yst-border-b yst-border-slate-200">
				<button
					className="yst-px-4 yst-border-r yst-border-slate-200 yst-text-slate-500 focus:yst-outline-none focus:yst-ring-2 focus:yst-ring-inset focus:yst-ring-primary-500"
					onClick={ openMobileMenu }
				>
					<span className="yst-sr-only">{ openButtonScreenReaderText }</span>
					<MenuAlt2Icon className="yst-w-6 yst-h-6" />
				</button>
			</div>
		</div>
	</>;
};

Mobile.propTypes = {
	children: PropTypes.node.isRequired,
	openButtonScreenReaderText: PropTypes.string.isRequired,
	closeButtonScreenReaderText: PropTypes.string.isRequired,
};

export default Mobile;
