import { Container } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {

    const cities = ["Hotels near me", "Hotels in Goa", "Hotels in Puri", "Hotels in Mahabaleshwar", "Hotels in Jaipur", "Hotels in Shimla", "Hotels in Manali", "Hotels in Udaipur", "Hotels in Mussoorie", "Hotels in Pondicherry", "Hotels in Delhi", "Hotels in Mumbai", "Hotels in Nainital", "Hotels in Lonavala", "Hotels in Bangalore", "Hotels in Mysore", "Hotels in Darjeeling", "Hotels in Mount Abu", "Hotels in Kodaikanal", "Hotels in Hyderabad", "Hotels in Pune", "Hotels in Chandigarh", "Hotels in Shirdi", "Hotels in Agra", "Hotels in Gangtok", "Hotels in Chennai", "Hotels in Tirupati", "Hotels in Dalhousie", "Hotels in Haridwar", "Hotels in Kolkata", "Hotels in Ahmedabad", "Hotels in Shillong", "Hotels in Rishikesh", "Hotels in Varanasi", "Hotels in Gurgaon", "Hotels in Mandarmoni", "Hotels in Daman", "Hotels in Amritsar", "Hotels in Madurai", "Hotels in Coimbatore", "Hotels in Kasauli", "Hotels in Dehradun"]

    return (
        <footer className='shadow-lg bg-white border-t mt-auto w-full py-10 md:py-20'>
            <Container>
                <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-20'>
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
                            <li>
                                <Link href='PrivacyPolicy'>Privacy Policy</Link>
                            </li>
                            <li>
                                <Link href='TermsConditions'>Terms of use</Link>
                            </li>
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
                </div>

                <div className='w-full shadow bg-white p-10 border mt-10 hidden lg:block'>
                    <p className='text-3xl mb-5 font-semibold'>OPO Hotels</p>
                    <ul className='grid grid-cols-6 w-full gap-5'>
                        {cities?.map((item) => (
                            <li key={item}>
                                <Link href='/'>
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </footer>
    )
}

export default Footer