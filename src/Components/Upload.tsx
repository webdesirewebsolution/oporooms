import React, { InputHTMLAttributes } from 'react'
import { GoUpload } from "react-icons/go";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    setValue?: (e: FileList) => void;
    label: string;
}

const Upload = ({ label, setValue, className, ...props }: InputProps) => {
    return (
        <div>
            <label htmlFor={label} className={`w-fit flex gap-3 items-center border-2 rounded-lg px-5 py-3 text-slate-700 cursor-pointer ${className}`}>
                <GoUpload color='#000' /> {label ?? props?.placeholder}</label>
            <input multiple id={label} name={label} type='file' accept='image/*' hidden onChange={e => {
                if (e.target.files instanceof FileList && setValue) { setValue(e.target.files) }
            }} {...props} />
        </div>
    )
}

export default Upload