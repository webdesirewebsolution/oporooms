import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import { Container } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import Enquiry from './Enquiry'

const ListProperty = () => {
    return (
        <>
            <Header />
            <div>
                <div className='w-screen aspect-video relative'>
                    <Image src='/Images/listPropertyBanner.jpg' alt='Banner' fill objectFit='cover' />

                    <div className='absolute size-full bg-gradient-to-r from-gray-800 to-transparent'>
                        <Container className='flex flex-col lg:flex-row justify-between items-center h-full'>

                        <div className='p-10 flex flex-col gap-10'>
                            <h1 className='text-white text-8xl font-extrabold'>List your property</h1>
                            <h2 className='text-white w-[50rem] max-w-full'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vel egestas nisl. Sed maximus augue sed porttitor posuere. Nam magna tellus, hendrerit eu nisl aliquet, posuere interdum elit.</h2>
                        </div>

                        <div className='bg-white p-10 rounded-xl'>
                            <Enquiry />
                        </div>
                        </Container>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ListProperty