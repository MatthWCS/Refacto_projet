import { useState } from "react"
import { Button } from "./Button"

export const Modal = ({
    children,
    openButtonText,
    closeButtonText = "[X]",
    isOpen: controlledIsOpen,
    onClose
}) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false)

    // Mode contrôlé si isOpen est fourni par le parent
    const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen

    const handleClose = () => {
        if (onClose) {
            onClose()
        } else {
            setInternalIsOpen(false)
        }
    }

    return (
        <>
            {openButtonText && (
                <Button text={openButtonText} onClick={() => setInternalIsOpen(true)} />
            )}
            {isOpen && (
                <div id="modal-overlay" className="flex justify-center items-center">
                    <div className="flex flex-col justify-center items-center gap-5" id="modal">
                        {children}
                        <Button id="btn-modal-closed" onClick={handleClose} text={closeButtonText} />
                    </div>
                </div>
            )}
        </>
    )
}
