'use client'

import React, { HTMLAttributes, useState } from "react"

const Expandable = ({ children, className }: { children: React.ReactNode, className?: HTMLAttributes<HTMLDivElement>["className"] }) => {
    const [clamp, setClamp] = useState(true)

    return (
        <>
            <div className={`transition-all overflow-hidden ${clamp ? 'h-20' : 'h-full'} ${className}`}>
                {children}
            </div>
            <button className='text-left text-lg tetx-slate-700' onClick={() => setClamp(prev => !prev)}>{clamp ? 'show more...' : 'show less...'}</button>
        </>
    )
}

export default Expandable