import { Container } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const Footer = () => {
    return (
        <div className='shadow-lg bg-white border-t mt-auto w-full'>
            <Container>
                <footer className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 py-10 md:py-20 gap-20'>
                    <div className='flex flex-col gap-5'>
                        <Image src='/Images/logo.png' alt='Logo' width={80} height={52} objectFit='contain' className='w-32' />
                        <p className='text-slate-600'>OPO Rooms Provide All Types of Travelling Bookings Bus, Train, Flight, Cabs etc.</p>
                    </div>

                    <div className='flex flex-col gap-5'>
                        <p className='font-semibold'>Company</p>
                        <ul>
                            <li>About</li>
                            <li>Services</li>
                            <li>Rooms</li>
                            <li>About Us</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>

                    <div className='flex flex-col gap-5'>
                        <p className='font-semibold'>Explore</p>
                        <ul>
                            <li>Mumbai</li>
                            <li>Delhi</li>
                            <li>Goa</li>
                            <li>Kashmir</li>
                            <li>Laddak</li>
                            <li>Kerla</li>
                        </ul>
                    </div>

                    <div className='flex flex-col gap-5'>
                        <p className='font-semibold'>Terms and Policies</p>
                        <ul>
                            <li>Privacy Policy</li>
                            <li>Terms of use</li>
                            <li>Accessbility</li>
                            <li>Reward system policy</li>
                        </ul>
                    </div>

                    <div className='flex flex-col gap-5'>
                        <p className='font-semibold'>Help</p>
                        <ul>
                            <li>Support</li>
                            <li>Cancel your bookings</li>
                            <li>Use Coupon</li>
                            <li>Refund Policies</li>
                            <li>International Travel Documents</li>
                        </ul>
                    </div>
                </footer>
            </Container>
        </div>
    )
}

export default Footer