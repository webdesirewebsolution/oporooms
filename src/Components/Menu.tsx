'use client'

import useWindowDimensions from '@/Hooks/useWindow'
import Link from 'next/link'
import React from 'react'

type Props = {}

const Menu = (props: Props) => {
    const { width } = useWindowDimensions()

    const pages = [
        {
            title: 'Home',
            link: '/',
        },
        {
            title: 'About Us',
            link: '/',
        },
        {
            title: 'Rooms',
            link: '/',
        },
        {
            title: 'Services',
            link: '/',
        },
        {
            title: 'Contact',
            link: '/',
        },
    ]


    return (
        <div>

            {width > 620 && <div className='flex items-center gap-10'>
                {pages?.map((item) => (
                    <Link key={item.title} href={item.link} className={``}>{item.title}</Link>
                ))}
            </div>
            }
        </div>
    )
}

export default Menu