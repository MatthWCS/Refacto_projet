import { useState } from "react"
import { Button } from "../Button"
import './Modal.scss'

export const Modal = ({ children, openButtonText }) => {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <div>
                <Button
                    text='Open Modal'
                    onClick={() => setIsOpen(true)}
                />
                {isOpen && (
                    <div id='modal-overlay' className='flex justify-center items-center'>
                        <div className='flex flex-col justify-center items-center gap-5' id='modal'>
                            {children}
                            <Button id={'btn-modal-closed'}
                                onClick={() => setIsOpen(false)}
                                text='[X]'
                            >{openButtonText}</Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}