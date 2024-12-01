import { Container } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import AuthButtons from './AuthButtons'
import Menu from './Menu'
import { auth } from '@/auth'
import HeaderOption from './HeaderOption'
import { getUser } from '@/app/actions'
import { Session } from 'next-auth'

const Header = async ({ }) => {
    const session = await auth()
    const user = await getUser(session as Session)

    return (
        <div className='w-full bg-white'>
            <Container className='py-5 flex justify-between items-center'>
                <Image src='/Images/logo.png' alt='Logo' width={80} height={52} objectFit='contain' className='w-32' />
                <Menu />

                {session?.user?._id ? <HeaderOption user={user}/> : <AuthButtons />}
            </Container>
        </div >
    )
}

export default Header