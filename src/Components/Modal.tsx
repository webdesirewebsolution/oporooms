import { ModalProps, Modal as MuiModal } from '@mui/material'
import React from 'react'
import { IoMdClose } from 'react-icons/io'

type Props = ModalProps & {
    children?: React.ReactNode,
    open: boolean,
    setOpen: (arg0: boolean) => void,
}

const Modal = ({ children, className, open, setOpen, ...otherProps }: Props) => {
    return (
        <MuiModal open={open} onClose={() => setOpen && setOpen(false)} className={`p-20 flex items-center justify-center`} {...otherProps}>
            <div className={`bg-white z-10 rounded pt-28 p-10 relative overflow-y-auto ${className} max-h-screen`}>
                <button type='button' title='Close' className='absolute right-10 top-10' onClick={() => setOpen(false)}>
                    <IoMdClose size={25} />
                </button>
                {children}
            </div>
        </MuiModal >
    )
}

export default Modal