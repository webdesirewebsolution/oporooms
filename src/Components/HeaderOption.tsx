'use client'

import { User } from '@/Types/Profile'
import { Avatar } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { IoChevronUp } from "react-icons/io5";
import { signOut } from 'next-auth/react'
import Button from './Buttons'

type Props = {
    user: User
}

const HeaderOption = ({ user }: Props) => {
    const [show, setShow] = useState(false)

    return (
        <div className='relative'>
            <Button className='bg-slate-200 text-black gap-2 rounded-xl text-[1.2rem] font-semibold capitalize' size='large' onClick={() => setShow(prev => !prev)}>
                    <Avatar className='size-10'>
                        {user.photo && <Image src={user.photo as string} alt={user.fullname as string} title={user.fullname} fill objectFit='cover' />}
                    </Avatar>
                    {user.fullname}
                    <div className={`${show ? 'rotate-180' : 'rotate-0'} transition-transform`}>
                        <IoChevronUp />
                    </div>
            </Button>

            <div className={`${show ? 'flex' : 'hidden'} absolute flex-col shadow bg-white z-[9999] top-28 rounded-lg overflow-hidden right-0`}>
                <div className='flex p-5 gap-3 border-b-2'>
                    <Avatar className='size-14'>
                        {user.photo && <Image src={user.photo as string} alt={user.fullname as string} title={user.fullname} fill objectFit='cover' />}
                    </Avatar>
                    <div className='flex flex-col'>
                        <p className='text-xl font-semibold capitalize'>{user.fullname}</p>
                        <p className='text-lg text-slate-700'>{user.email}</p>
                    </div>
                </div>
                {(user.userRole == 'CADMIN' || user.userRole == 'SADMIN' || user.userRole == 'HR' || user.userRole == 'HotelOwner') && <Link href="/Admin" passHref className='border-b' title='Admin'>
                    <Button className='w-full py-5 text-red-500'>Dashboard</Button>
                </Link>}
                <Link href="/Profile" passHref className='border-b' title='Profile'>
                    <Button className='w-full py-5 text-red-500'>Profile</Button>
                </Link>
                <Link href="/Bookings" passHref className='border-b' title='Bookings'>
                    <Button className='w-full py-5 text-red-500'>My Bookings</Button>
                </Link>
                <Button className='w-full py-5 text-red-500' onClick={() => signOut()}>Sign Out</Button>
            </div>
        </div>
    )
}

export default HeaderOption