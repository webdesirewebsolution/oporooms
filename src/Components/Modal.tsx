import { ModalProps, Modal as MuiModal } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { IoMdClose } from 'react-icons/io'

type Props = ModalProps & {
    children?: React.ReactNode,
    open: boolean,
    setOpen?: (arg0: boolean) => void,
    isLogo?: boolean
}

const Modal = ({ children, className, open, setOpen, isLogo, ...otherProps }: Props) => {
    return (
        <MuiModal open={open} onClose={() => setOpen && setOpen(false)} className={` flex items-center justify-center`} {...otherProps}>
            <div className={`bg-white z-10 rounded ${setOpen && 'pt-16'} relative overflow-y-auto ${className} max-h-[90%] rounded-xl modal`}>
                <div className='absolute flex items-center justify-between top-0 w-full px-5'>
                    <div className='relative size-24 aspect-video'>
                        <Image src='/Images/logo.png' alt='Logo' fill objectFit='contain' />
                    </div>
                    {setOpen && <button type='button' title='Close' onClick={() => setOpen(false)}>
                        <IoMdClose size={25} />
                    </button>}
                </div>
                <div className='p-10'>
                {children}
                </div>
            </div>
        </MuiModal >
    )
}

export default Modal