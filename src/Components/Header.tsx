import { Button, Container } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import AuthButtons from './AuthButtons'
import Menu from './Menu'
import Link from 'next/link'
import { auth } from '@/auth'

const Header = async ({ }) => {
    const session = await auth()

    return (
        <div className='w-full bg-white'>
            <Container className='py-5 flex justify-between items-center'>
                <Image src='/Images/logo.png' alt='Logo' width={80} height={52} objectFit='contain' className='w-32' />
                <Menu />

                <div className='flex items-center gap-5'>
                    {session?.user._id &&
                        <Link href="/Bookings" passHref>
                            <Button className='bg-red-500 text-white font-bold'>
                                My bookings
                            </Button>
                        </Link>
                    }
                    <AuthButtons />
                </div>
            </Container>
        </div >
    )
}

export default Header