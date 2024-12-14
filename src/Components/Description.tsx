'use client'

import { HTMLAttributes, useState } from "react"

const Description = ({ text, className }: { text: string, className?: HTMLAttributes<HTMLParagraphElement>["className"] }) => {
    const [clamp, setClamp] = useState(true)

    return (
        <>
            <p className={`transition-all text-[1.2rem] w-96 text-slate-700 ${clamp ? 'line-clamp-2' : 'line-clamp-none'} ${className}`}>{text}</p>
            <button className='text-left text-lg tetx-slate-700' onClick={() => setClamp(prev => !prev)}>{clamp ? 'show less...' : 'show more...'}</button>
        </>
    )
}

export default Description