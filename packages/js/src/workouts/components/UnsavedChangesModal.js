import { ExclamationIcon } from "@heroicons/react/outline";
import { useCallback, useEffect, useState } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import PropTypes from "prop-types";
import Modal from "./modal";
import { useDispatch } from "@wordpress/data";

/* eslint-disable max-len */
/**
 * Prompt the user to save when changing route.
 *
 * Works per route, it saves the last location.
 *
 * @param {Object} props The props.
 *
 * @returns {JSX.Element} The UnsavedChangesModal.
 */
export default function UnsavedChangesModal({ hasUnsavedChanges }) {
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [targetUrl, setTargetUrl] = useState("empty");
	const [target, setTarget] = useState(null);
	const { clearActiveWorkout } = useDispatch("yoast-seo/workouts");

	const closeModal = useCallback(() => {
		setModalIsOpen(false);
	}, [setModalIsOpen]);

	const continueNavigation = useCallback(() => {
		if (targetUrl === "popped") {
			window.removeEventListener("popstate", popStateEventHandler);
			history.go(-1);
		} else if (targetUrl === "clear-active-workout") {
			console.log("are we here?")
			window.removeEventListener("popstate", popStateEventHandler);
			clearActiveWorkout();
		} else {
			window.location.replace(targetUrl);
		}
	}, [targetUrl]);

	const popStateEventHandler = useCallback((e) => {
		console.log("popstate");
		if (hasUnsavedChanges) {
			window.removeEventListener("beforeunload", beforeUnloadEventHandler);
			history.go(1);
			setTargetUrl("popped")
			setModalIsOpen(true);
		}
	}, [hasUnsavedChanges]);

	const beforeUnloadEventHandler = useCallback((e) => {
		console.log("beforeunload");
		if (hasUnsavedChanges) {
			e.preventDefault();
			e.returnValue = "this is a test!";
		}
	}, [hasUnsavedChanges]);

	// eslint-disable-next-line complexity
	const clickEventHandler = useCallback((e) => {

		if (hasUnsavedChanges) {
			setTargetUrl("Cleaned up");
			const adminBarTarget = e.target.closest(".ab-item");
			console.log(e.target)
			if (e.target.id === "yoast-workouts-back-to-workouts-button") {
				console.log(e.target)
				e.preventDefault();
				setTargetUrl("clear-active-workout");
				setModalIsOpen(true);
			}
			if (e.target.tagName === "A") {
				console.log(" a clicked")
				e.preventDefault();
				window.removeEventListener("beforeunload", beforeUnloadEventHandler);
				setTargetUrl(e.target.href);
				setModalIsOpen(true);
			} else if (adminBarTarget) {
				if (adminBarTarget.href && !adminBarTarget.href.endsWith("#qm-overview")) {
					console.log(adminBarTarget.href)
					console.log("ab-item clicked")
					console.log(e.target.href)
					e.preventDefault();
					window.removeEventListener("beforeunload", beforeUnloadEventHandler);
					setTargetUrl(adminBarTarget.href);
					setModalIsOpen(true);
				}
			} else if (e.target.className === "wp-menu-name") {
				e.preventDefault();
				window.removeEventListener("beforeunload", beforeUnloadEventHandler);
				setTargetUrl(e.target.parentElement.href);
				setModalIsOpen(true);
			}
		}
	}, [hasUnsavedChanges]);

	useEffect(() => {
		//window.addEventListener("popstate", popStateEventHandler);
		window.addEventListener("beforeunload", beforeUnloadEventHandler);
		window.addEventListener("click", clickEventHandler);

		return () => {
			//window.removeEventListener("popstate", popStateEventHandler);
			window.removeEventListener("beforeunload", beforeUnloadEventHandler);
			window.removeEventListener("click", clickEventHandler);
			setTargetUrl("Cleaned up");
		};
	}, [beforeUnloadEventHandler, popStateEventHandler, clickEventHandler]);

	return (
		<Modal isOpen={modalIsOpen} handleClose={closeModal}>
			<div className="sm:yst-flex sm:yst-items-start">
				<div
					className="yst-mx-auto yst-flex-shrink-0 yst-flex yst-items-center yst-justify-center yst-h-12 yst-w-12 yst-rounded-full yst-bg-red-100 sm:yst-mx-0 sm:yst-h-10 sm:yst-w-10"
				>
					<ExclamationIcon className="yst-h-6 yst-w-6 yst-text-red-600" aria-hidden="true" />
				</div>
				<div className="yst-mt-3 yst-text-center sm:yst-mt-0 sm:yst-ml-4 sm:yst-text-left">
					<Modal.Title as="h3" className="yst-text-lg yst-leading-6 yst-font-medium yst-text-gray-900">
						{__("Unsaved changes", "admin-ui")}
					</Modal.Title>
					<div className="yst-mt-2">
						<p className="yst-text-sm yst-text-gray-500">
							{__("There are unsaved changes on this page. Leaving means that those changes will be lost. Are you sure you want to leave this page?", "admin-ui")}
						</p>
						<p>{targetUrl}</p>
					</div>
				</div>
			</div>

			<div className="yst-mt-8 sm:yst-mt-6 sm:yst-flex sm:yst-flex-row-reverse">
				<button
					type="button"
					className="yst-button--danger yst-w-full yst-inline-flex sm:yst-w-auto sm:yst-ml-3"
					onClick={continueNavigation}
				>
					{__("Yes, leave page", "admin-ui")}
				</button>
				<button
					type="button"
					className="yst-button--secondary yst-w-full yst-inline-flex sm:yst-w-auto sm:yst-mt-0"
					onClick={closeModal}
				>
					{__("No, continue editing", "admin-ui")}
				</button>
			</div>
		</Modal>
	);
}

UnsavedChangesModal.propTypes = {
	hasUnsavedChanges: PropTypes.bool.isRequired,
}

/* eslint-enable max-len */