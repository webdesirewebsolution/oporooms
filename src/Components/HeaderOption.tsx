'use client'

import { User } from '@/Types/Profile'
import { Avatar, Button } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { IoChevronUp } from "react-icons/io5";
import { signOut } from 'next-auth/react'

type Props = {
    user: User
}

const HeaderOption = ({ user }: Props) => {
    const [show, setShow] = useState(false)

    return (
        <div className='relative'>
            <Button className='bg-slate-200 text-black gap-2 rounded-xl text-[1.2rem] font-semibold capitalize' size='large' onClick={() => setShow(prev => !prev)}>
                <Avatar className='size-10'>
                    {user.photo && <Image src={user.photo as string} alt='User' fill />}
                </Avatar>
                {user.fullname}
                <div className={`${show ? 'rotate-180' : 'rotate-0'} transition-transform`}>
                    <IoChevronUp />
                </div>
            </Button>

            <div className={`${show ? 'flex' : 'hidden'} absolute flex-col shadow bg-white z-50 top-28 rounded-lg overflow-hidden`}>
                <div className='flex p-5 gap-3 border-b-2'>
                    <Avatar className='size-14'>
                        {user.photo && <Image src={user.photo as string} alt='User' fill />}
                    </Avatar>
                    <div className='flex flex-col'>
                        <p className='text-xl font-semibold capitalize'>{user.fullname}</p>
                        <p className='text-lg text-slate-700'>{user.email}</p>
                    </div>
                </div>
                <Link href="/Profile" passHref>
                    <Button className='w-full py-5'>Profile</Button>
                </Link>
                <Link href="/Bookings" passHref>
                    <Button className='w-full py-5'>My Bookings</Button>
                </Link>
                <Button className='w-full py-5' onClick={() => signOut()}>Sign Out</Button>
            </div>
        </div>
    )
}

export default HeaderOption