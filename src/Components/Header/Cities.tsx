import Link from 'next/link'
import React from 'react'

type Props = {
    item: {
        title: string,
        subCities: string[]
    },
    children: React.ReactNode
}

const Cities = ({ item, children }: Props) => {

    return (
        <div className='relative'>
            <Link href='/' className='text-[rgba(0,0,0,.7)] text-center'>
                {children}
            </Link>
            {item?.subCities?.length > 0 && <ul className='absolute bg-white px-14 left-0 py-10 hidden flex-col group-hover:flex top-[3.31rem] gap-7'>
                <p className='font-semibold'>Popular Localities</p>
                {item?.subCities?.map((subItem) => (
                    <Link href='/' key={subItem} className='text-nowrap'>
                        {subItem}
                    </Link>
                ))}
            </ul>}
        </div>
    )
}

export default Cities