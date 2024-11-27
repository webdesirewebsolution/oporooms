import { Container } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import AuthButtons from './AuthButtons'
import Menu from './Menu'

const Header = async ({ }) => {

    return (
        <div className='w-full bg-white'>
            <Container className='py-5 flex justify-between items-center'>
                <Image src='/Images/logo.png' alt='Logo' width={80} height={52} objectFit='contain' className='w-32' />
                <Menu />

                <AuthButtons />
            </Container>
        </div>
    )
}

export default Header