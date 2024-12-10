'use client'

import { SearchParams } from 'next/dist/server/request/search-params'
import Link from 'next/link'
import React, { useState } from 'react'

type Props = {
    searchParams: SearchParams
}

const SearchInput = ({ searchParams }: Props) => {
    const [value, setValue] = useState('')

    return (
        <div className='flex flex-col gap-3'>
            <input title='Search Hotel' placeholder='Search Hotel' className='rounded-lg px-5 py-3'
                value={value} onChange={e => setValue(e.target.value)}
            />
            <Link href={{
                query: {
                    ...searchParams,
                    name: value
                }
            }} className='bg-white px-8 py-3 w-fit text-lg rounded-lg'>
                Search
            </Link>
        </div>
    )
}

export const Filter = ({ searchParams }: Props) => {
    
    const prices = [
        {
            min: 0,
            max: 200,
        },
        {
            min: 200,
            max: 500,
        },
        {
            min: 500,
            max: 1000,
        },
        {
            min: 1000,
            max: 2000,
        },
        {
            min: 2000,
            max: 5000,
        },
        {
            min: 5000,
        },
    ]

    return (
        <ul className='flex flex-col bg-white p-5'>
            {prices?.map((price) => {
                return (
                    <li key={price.min} className={`flex py-3 gap-3 justify-between items-center text-lg text-slate-800 ${Number(searchParams.min) == price.min && 'bg-red-400 text-white rounded-full'}`}>
                        <Link href={{
                            query: {
                                ...searchParams,
                                min: price.min,
                                max: price.max
                            }
                        }} className='flex pl-10'>
                            <span>&#8377;{price.min}</span>

                            {price?.max ?
                                <>
                                    <span className='ml-2'>-</span>
                                    <span className='ml-2'>{" "}&#8377;{price.max}</span>
                                </>
                                : <>+</>}
                        </Link>
                        <span></span>
                    </li>
                )
            })}
        </ul>
    )
}

export default SearchInput