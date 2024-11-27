import React, { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    setValue?: (e: string) => void;
    label?: string;
}

const Input = ({ label, value, setValue, className, ...props }: InputProps) => {
    return (
        <div className={`w-full flex flex-col gap-2`}>
            <label className='flex text-xl'>{label}</label>
            <input className={`border-2 border-slate-400 p-5 rounded-md ${className}`} value={value} onChange={e => setValue && setValue(e.target.value)} {...props} />
        </div>
    )
}

export default Input