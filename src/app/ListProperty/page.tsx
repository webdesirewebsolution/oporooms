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
                                <h2 className='text-white max-w-[50rem] w-full text-wrap'>Are you ready to take your hotel business to the next level? It’s easier than ever to start earning more revenue with minimal effort! By listing your hotel with us, you can begin attracting guests from all around the India  in just 10 minutes.
                                </h2>
                            </div>

                            <div className='bg-white p-10 rounded-xl'>
                                <Enquiry />
                            </div>
                        </Container>
                    </div>
                </div>

                <div className='bg-gradient-to-r from-gray-50 to-gray-100 p-8'>
                    <Container>
                        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
                            {/* Header Section */}
                            <div className="text-center mb-6">
                                <p className="text-3xl font-bold text-blue-600">Here's How It Works</p>
                                <p className="text-gray-600 mt-2">
                                    A quick guide to listing your property and maximizing your revenue.
                                </p>
                            </div>

                            {/* Content Section */}
                            <div className="space-y-6">
                                {/* Simple Listing Process */}
                                <div className="flex items-start space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                        <span className="text-blue-600 text-xl font-bold size-12 flex items-center justify-center">1</span>
                                    </div>
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800">
                                            Simple Listing Process
                                        </p>
                                        <p className="text-gray-600 mt-2">
                                            In just a few steps, you can create your hotel's profile on our platform. Add essential details such as location, amenities, photos, and pricing.
                                        </p>
                                    </div>
                                </div>

                                {/* Global Exposure */}
                                <div className="flex items-start space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                        <span className="text-blue-600 text-xl font-bold size-12 flex items-center justify-center">2</span>
                                    </div>
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800">Global Exposure</p>
                                        <p className="text-gray-600 mt-2">
                                            Our platform attracts millions of travelers, ensuring your hotel gets maximum visibility.
                                        </p>
                                    </div>
                                </div>

                                {/* Easy-to-Use Interface */}
                                <div className="flex items-start space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                        <span className="text-blue-600 text-xl font-bold size-12 flex items-center justify-center">3</span>
                                    </div>
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800">
                                            Easy-to-Use Interface
                                        </p>
                                        <p className="text-gray-600 mt-2">
                                            Our intuitive dashboard allows you to manage bookings, availability, and pricing effortlessly.
                                        </p>
                                    </div>
                                </div>

                                {/* No Hidden Fees */}
                                <div className="flex items-start space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                        <span className="text-blue-600 text-xl font-bold size-12 flex items-center justify-center">4</span>
                                    </div>
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800">No Hidden Fees</p>
                                        <p className="text-gray-600 mt-2">
                                            We offer competitive commission rates with transparent terms, so you can keep more of your earnings.
                                        </p>
                                    </div>
                                </div>

                                {/* 24/7 Support */}
                                <div className="flex items-start space-x-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                                        <span className="text-blue-600 text-xl font-bold size-12 flex items-center justify-center">5</span>
                                    </div>
                                    <div>
                                        <p className="text-xl font-semibold text-gray-800">24/7 Support</p>
                                        <p className="text-gray-600 mt-2">
                                            Our dedicated customer support team is always available to assist you.
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </Container>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ListProperty