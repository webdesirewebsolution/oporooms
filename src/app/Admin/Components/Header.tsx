import React from 'react'
import { getUser } from '@/app/actions'
import Menu from './Menu'
import { auth } from '@/auth'
import { Session } from 'next-auth'
import HeaderOption from './HeaderOption'

type Props = {
    children: React.ReactNode
}

const Header = async ({ children }: Props) => {
    const session = await auth()
    const user = await getUser(session as Session)

    return (
        <>
            <div className='flex items-center w-full p-5 z-50 shadow-md justify-between'>

                <div className='flex gap-8 items-center'>
                    <Menu user={user} />
                    <h1 className='text-red-500 text-3xl font-bold'>Opo Rooms</h1>
                </div>

                <div className='flex gap-8 items-center'>
                    <p className='border-2 border-slate-300 px-3 py-2 rounded-xl text-lg text-slate-600'>
                        {user?.userRole}
                    </p>

                    <HeaderOption user={user}/>
                </div>
            </div>

            <div className='sm:ml-[265px] p-5'>
                {children}
            </div>
        </>
    )
}

export default Header