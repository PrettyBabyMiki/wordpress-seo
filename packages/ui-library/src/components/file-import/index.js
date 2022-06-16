import { useState, useCallback, useContext, createContext, useMemo } from "@wordpress/element";
import { values, includes, isEmpty, isNull, capitalize } from "lodash";
import { DocumentAddIcon, DocumentTextIcon, XIcon } from "@heroicons/react/outline";
import { CheckCircleIcon, ExclamationCircleIcon, StopIcon, InformationCircleIcon } from "@heroicons/react/solid";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Transition } from "@headlessui/react";

import Link from "../../elements/link";
import ProgressBar from "../../elements/progress-bar";
import { useRootContext } from "../../hooks";

export const FILE_IMPORT_STATUS = {
	idle: "idle",
	selected: "selected",
	loading: "loading",
	success: "success",
	aborted: "aborted",
	error: "error",
};

const FileImportContext = createContext( { status: FILE_IMPORT_STATUS.idle } );

/**
 * @returns {Object} The current file import context.
 */
const useFileImportContext = () => useContext( FileImportContext );

const statusIconTransitionProps = {
	enter: "yst-transition-opacity yst-ease-in-out yst-duration-1000 yst-delay-200",
	enterFrom: "yst-opacity-0",
	enterTo: "yst-opacity-100",
	leave: "yst-transition-opacity yst-ease-in-out yst-duration-200",
	leaveFrom: "yst-opacity-0",
	leaveTo: "yst-opacity-100",
	className: "yst-absolute",
};

/**
 * @param {string} status A valid file import status.
 * @returns {JSX.Element} Component that renders conditionally based on given file import status.
 */
const createStatusConditionalRender = ( status ) => {
	/**
	 * @param {JSX.node} children The React children.
	 * @returns {JSX.Element} Component that renders conditionally based on given file import status.
	 */
	const HOC = ( { children } ) => {
		const { status: currentStatus } = useFileImportContext();
		return (
			<Transition
				show={ currentStatus === status }
				enter="yst-transition-opacity yst-ease-in-out yst-duration-1000 yst-delay-200"
				enterFrom="yst-opacity-0"
				enterTo="yst-opacity-100"
				className="yst-mt-6"
			>
				{ children }
			</Transition>
		);
	};
	HOC.propTypes = { children: PropTypes.node };
	// Provide meaningful display name for React dev tools.
	HOC.displayName = `FileImport.${ capitalize( status ) }`;

	return HOC;
};

/**
 * The FileImport component.
 *
 * @param {JSX.node} children The React children.
 * @param {string} id The inputs id.
 * @param {string} name The inputs name.
 * @param {string} selectLabel The label for native select file functionality.
 * @param {string} dropLabel The label for custom drop file functionality.
 * @param {string} screenReaderLabel The screen reader label for the file select.
 * @param {string} abortScreenReaderLabel The screen reader label for the abort button.
 * @param {JSX.Node} selectDescription The selectDescription.
 * @param {"idle"|"loading"|"success"|"failure"} status The status the component should be in.
 * @param {Function} onChange The callback for when a file is imported.
 * @param {Function} onAbort The callback for when an file import is aborted.
 * @param {string} feedbackTitle The import feedback title.
 * @param {string} feedbackDescription The import feedback selectDescription.
 * @param {number} progressMin The import progress min value.
 * @param {number} progressMax The import progress max value.
 * @param {number} progress The import progress.
 * @returns {JSX.Element} The FileImport component.
 */
const FileImport = ( {
	children = "",
	id,
	name,
	selectLabel,
	dropLabel,
	screenReaderLabel,
	abortScreenReaderLabel,
	selectDescription,
	status = FILE_IMPORT_STATUS.idle,
	onChange,
	onAbort,
	feedbackTitle,
	feedbackDescription = "",
	progressMin = null,
	progressMax = null,
	progress = null,
	...props
} ) => {
	const [ isDragOver, setIsDragOver ] = useState( false );
	const { isRtl } = useRootContext();

	const isSelected = useMemo( () => status === FILE_IMPORT_STATUS.selected, [ status ] );
	const isLoading = useMemo( () => status === FILE_IMPORT_STATUS.loading, [ status ] );
	const isSuccess = useMemo( () => status === FILE_IMPORT_STATUS.success, [ status ] );
	const isAborted = useMemo( () => status === FILE_IMPORT_STATUS.aborted, [ status ] );
	const isError = useMemo( () => status === FILE_IMPORT_STATUS.error, [ status ] );

	const hasFeedback = useMemo( () => includes(
		[ FILE_IMPORT_STATUS.selected, FILE_IMPORT_STATUS.loading, FILE_IMPORT_STATUS.success, FILE_IMPORT_STATUS.aborted, FILE_IMPORT_STATUS.error ],
		status,
	), [ status ] );

	const handleChange = useCallback( ( event ) => {
		if ( ! isEmpty( event.target.files ) ) {
			onChange( event.target.files[ 0 ] );
		}
	}, [ onChange ] );

	const handleDragEnter = useCallback( ( event ) => {
		event.preventDefault();
		if ( ! isEmpty( event.dataTransfer.items ) ) {
			setIsDragOver( true );
		}
	}, [] );

	const handleDragLeave = useCallback( ( event ) => {
		event.preventDefault();
		setIsDragOver( false );
	}, [] );

	const handleDragOver = useCallback( ( event ) => {
		event.preventDefault();
	}, [] );

	const handleDrop = useCallback( ( event ) => {
		event.preventDefault();
		setIsDragOver( false );
		if ( ! isEmpty( event.dataTransfer.files ) ) {
			onChange( event.dataTransfer.files[ 0 ] );
		}
	}, [ setIsDragOver, onChange ] );

	return (
		<FileImportContext.Provider value={ { status } }>
			<div className="yst-file-import">
				<div
					onDragEnter={ handleDragEnter }
					onDragLeave={ handleDragLeave }
					onDragOver={ handleDragOver }
					onDrop={ handleDrop }
					className={ classNames( "yst-file-import__select", {
						"yst-is-drag-over": isDragOver,
						"yst-is-disabled": isLoading,
					} ) }
				>
					<div className="yst-file-import__select-content">
						<DocumentAddIcon className="yst-file-import__select-icon" />
						<div
							className={ classNames(
								"yst-file-import__select-labels", {
									"yst-flex-row-reverse": isRtl,
								} ) }
						>
							<input
								type="file"
								id={ id }
								name={ name }
								onChange={ handleChange }
								className="yst-file-import__input"
								aria-labelledby={ screenReaderLabel }
								disabled={ isLoading }
								// Don't control value here to allow consecutive imports of the same file.
								value=""
								{ ...props }
							/>
							<Link as="label" htmlFor={ id } className="yst-file-import__select-label">{ selectLabel }</Link>
							<span>&nbsp;</span>
							{ dropLabel }
						</div>
						{ selectDescription && <span>{ selectDescription }</span> }
					</div>
				</div>
				<Transition
					show={ hasFeedback }
					enter="yst-transition-opacity yst-ease-in-out yst-duration-1000 yst-delay-200"
					enterFrom="yst-opacity-0"
					enterTo="yst-opacity-100"
				>
					<div className="yst-file-import__feedback">
						<header className="yst-file-import__feedback-header">
							<div className="yst-file-import__feedback-figure"><DocumentTextIcon /></div>
							<div className="yst-flex-1">
								<span className="yst-file-import__feedback-title">{ feedbackTitle }</span>
								<p className="yst-file-import__feedback-description">{ feedbackDescription }</p>
								{ ! isNull( progress ) && (
									<ProgressBar min={ progressMin } max={ progressMax } progress={ progress } className="yst-mt-1.5" />
								) }
							</div>
							<div className="yst-relative yst-h-5 yst-w-5">
								<Transition show={ isSelected } { ...statusIconTransitionProps }>
									<InformationCircleIcon className="yst-file-import__status-icon yst-text-blue-500" />
								</Transition>
								<Transition show={ isLoading } { ...statusIconTransitionProps }>
									<button onClick={ onAbort } className="yst-file-import__abort-button">
										<span className="yst-sr-only">{ abortScreenReaderLabel }</span>
										<XIcon />
									</button>
								</Transition>
								<Transition show={ isSuccess } { ...statusIconTransitionProps }>
									<CheckCircleIcon className="yst-file-import__status-icon yst-text-green-500" />
								</Transition>
								<Transition show={ isAborted } { ...statusIconTransitionProps }>
									<StopIcon className="yst-file-import__status-icon yst-text-gray-500" />
								</Transition>
								<Transition show={ isError } { ...statusIconTransitionProps }>
									<ExclamationCircleIcon className="yst-file-import__status-icon yst-text-red-500" />
								</Transition>
							</div>
						</header>
						{ children }
					</div>
				</Transition>
			</div>
		</FileImportContext.Provider>
	);
};

FileImport.propTypes = {
	children: PropTypes.node,
	id: PropTypes.string.isRequired,
	name: PropTypes.string.isRequired,
	selectLabel: PropTypes.string.isRequired,
	dropLabel: PropTypes.string.isRequired,
	screenReaderLabel: PropTypes.string.isRequired,
	abortScreenReaderLabel: PropTypes.string.isRequired,
	selectDescription: PropTypes.string,
	feedbackTitle: PropTypes.string.isRequired,
	feedbackDescription: PropTypes.string,
	progressMin: PropTypes.number,
	progressMax: PropTypes.number,
	progress: PropTypes.number,
	status: PropTypes.oneOf( values( FILE_IMPORT_STATUS ) ),
	onChange: PropTypes.func.isRequired,
	onAbort: PropTypes.func.isRequired,
};

FileImport.Selected = createStatusConditionalRender( FILE_IMPORT_STATUS.selected );
FileImport.Loading = createStatusConditionalRender( FILE_IMPORT_STATUS.loading );
FileImport.Success = createStatusConditionalRender( FILE_IMPORT_STATUS.success );
FileImport.Aborted = createStatusConditionalRender( FILE_IMPORT_STATUS.aborted );
FileImport.Error = createStatusConditionalRender( FILE_IMPORT_STATUS.error );

export default FileImport;
