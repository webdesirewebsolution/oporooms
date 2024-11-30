import { Button } from '@mui/material';
import React, { InputHTMLAttributes } from 'react'
import { GoUpload } from "react-icons/go";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    setValue?: (e: FileList) => void;
    label: string;
}

const Upload = ({ label, setValue, className, ...props }: InputProps) => {
    return (
        <Button className='w-fit bg-blue-500 text-white'>
            <label htmlFor={label} className={`flex gap-3 text-lg items-center cursor-pointer ${className}`}>
                <GoUpload color='#fff' /> {label ?? props?.placeholder}</label>
            <input multiple id={label} name={label} type='file' accept='image/*' hidden onChange={e => {
                if ((e.target?.files && e.target.files instanceof FileList) && setValue) { setValue(e.target.files) }
            }} {...props} />
        </Button>
    )
}

export default Upload