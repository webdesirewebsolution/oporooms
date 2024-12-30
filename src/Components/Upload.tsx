import React, { InputHTMLAttributes } from 'react'
import { GoUpload } from "react-icons/go";
import Button from './Buttons';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    setValue?: (e: FileList) => void;
    label: string;
}

const Upload = ({ label, setValue, className, ...props }: InputProps) => {
    return (
        <Button className={`w-fit bg-red-500 text-white flex items-center justify-center ${className}`}>
            <label htmlFor={props?.id} className={`flex gap-3 text-lg items-center text-center justify-center cursor-pointer w-full h-full`}>
                <GoUpload color='#fff' /> {label ?? props?.placeholder}</label>
            <input multiple id={props?.id} name={label} type='file' accept='image/*' hidden onChange={e => {
                if ((e.target?.files && e.target.files instanceof FileList) && setValue) { setValue(e.target.files) }
            }} {...props} />
        </Button>
    )
}

export default Upload