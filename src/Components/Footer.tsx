import { auth } from '@/auth'
import { Container } from '@mui/material'
import moment from 'moment'
import { Params } from 'next/dist/server/request/params'
import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { FaBookmark, FaRegBookmark, FaRegUser, FaUser } from 'react-icons/fa6'

const Footer = async () => {
    const session = await auth()
    const headerslist = await headers()
    const pathname = headerslist.get('x-pathname')

    const hotels = [
        { title: "Hotels near me", placeId: "", lat: "", lng: "" },
        { title: "Hotels in Goa", placeId: "ChIJv90m7-u4jzsR37q8v8h5q0", lat: 15.299326, lng: 73.854945 },
        { title: "Hotels in Puri", placeId: "ChIJt2o5fYz4jzsR468w0r699o", lat: 19.814997, lng: 85.743392 },
        { title: "Hotels in Mahabaleshwar", placeId: "ChIJy9x6c1v4jzsR4993aY4v8E", lat: 17.935277, lng: 73.719167 },
        { title: "Hotels in Jaipur", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 26.912434, lng: 75.857728 },
        { title: "Hotels in Shimla", placeId: "ChIJo80l8Yz4jzsR47l8w96q5o", lat: 31.104811, lng: 77.173412 },
        { title: "Hotels in Manali", placeId: "ChIJp968bYz4jzsR468w0r699o", lat: 32.137805, lng: 77.173412 },
        { title: "Hotels in Udaipur", placeId: "ChIJy1x6c1v4jzsR4993aY4v8E", lat: 24.596667, lng: 73.681236 },
        { title: "Hotels in Mussoorie", placeId: "ChIJ79x6c1v4jzsR4993aY4v8E", lat: 30.433333, lng: 78.066667 },
        { title: "Hotels in Pondicherry", placeId: "ChIJy9x6c1v4jzsR4993aY4v8E", lat: 11.941667, lng: 79.808333 },
        { title: "Hotels in Delhi", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 28.613889, lng: 77.209006 },
        { title: "Hotels in Mumbai", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 18.9750, lng: 72.8258 },
        { title: "Hotels in Nainital", placeId: "ChIJ79x6c1v4jzsR4993aY4v8E", lat: 29.382438, lng: 79.453007 },
        { title: "Hotels in Lonavala", placeId: "ChIJy9x6c1v4jzsR4993aY4v8E", lat: 18.748333, lng: 73.458333 },
        { title: "Hotels in Bangalore", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 12.9716, lng: 77.5946 },
        { title: "Hotels in Mysore", placeId: "ChIJy1x6c1v4jzsR4993aY4v8E", lat: 12.3000, lng: 76.6500 },
        { title: "Hotels in Darjeeling", placeId: "ChIJ79x6c1v4jzsR4993aY4v8E", lat: 27.042438, lng: 88.277389 },
        { title: "Hotels in Mount Abu", placeId: "ChIJy9x6c1v4jzsR4993aY4v8E", lat: 24.5881, lng: 72.7128 },
        { title: "Hotels in Kodaikanal", placeId: "ChIJy9x6c1v4jzsR4993aY4v8E", lat: 10.2333, lng: 77.7833 },
        { title: "Hotels in Hyderabad", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 17.3850, lng: 78.4867 },
        { title: "Hotels in Pune", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 18.5204, lng: 73.8567 },
        { title: "Hotels in Chandigarh", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 30.7333, lng: 76.7794 },
        { title: "Hotels in Shirdi", placeId: "ChIJy9x6c1v4jzsR4993aY4v8E", lat: 19.5917, lng: 74.8125 },
        { title: "Hotels in Agra", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 27.1767, lng: 78.0081 },
        { title: "Hotels in Gangtok", placeId: "ChIJ79x6c1v4jzsR4993aY4v8E", lat: 27.3333, lng: 88.6167 },
        { title: "Hotels in Chennai", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 13.0827, lng: 80.2778 },
        { title: "Hotels in Tirupati", placeId: "ChIJy9x6c1v4jzsR4993aY4v8E", lat: 13.6344, lng: 79.4192 },
        { title: "Hotels in Dalhousie", placeId: "ChIJ79x6c1v4jzsR4993aY4v8E", lat: 32.1200, lng: 76.0500 },
        { title: "Hotels in Haridwar", placeId: "ChIJ79x6c1v4jzsR4993aY4v8E", lat: 29.9100, lng: 78.1200 },
        { title: "Hotels in Kolkata", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 22.5726, lng: 88.3639 },
        { title: "Hotels in Ahmedabad", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 23.0222, lng: 72.5714 },
        { title: "Hotels in Shillong", placeId: "ChIJ79x6c1v4jzsR4993aY4v8E", lat: 25.5700, lng: 91.8800 },
        { title: "Hotels in Rishikesh", placeId: "ChIJ79x6c1v4jzsR4993aY4v8E", lat: 30.0833, lng: 78.2833 },
        { title: "Hotels in Varanasi", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 25.3176, lng: 82.9739 },
        { title: "Hotels in Gurgaon", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 28.4595, lng: 77.0264 },
        { title: "Hotels in Mandarmoni", placeId: "ChIJy9x6c1v4jzsR4993aY4v8E", lat: 21.7833, lng: 88.3167 },
        { title: "Hotels in Daman", placeId: "ChIJy9x6c1v4jzsR4993aY4v8E", lat: 20.2333, lng: 72.8167 },
        { title: "Hotels in Amritsar", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 31.6139, lng: 74.8560 },
        { title: "Hotels in Madurai", placeId: "ChIJy9x6c1v4jzsR4993aY4v8E", lat: 9.9252, lng: 78.1198 },
        { title: "Hotels in Coimbatore", placeId: "ChIJy9x6c1v4jzsR4993aY4v8E", lat: 11.0167, lng: 76.9500 },
        { title: "Hotels in Kasauli", placeId: "ChIJ79x6c1v4jzsR4993aY4v8E", lat: 31.0667, lng: 77.0333 },
        { title: "Hotels in Dehradun", placeId: "ChIJ79x6c1v4jzsR4993aY4v8E", lat: 30.3167, lng: 78.0333 },
        { title: "Hotels in Jodhpur", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 26.2921, lng: 73.0280 },
        { title: "Hotels in Bhubaneswar", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 20.2961, lng: 85.8245 },
        { title: "Hotels in Kochi", placeId: "ChIJy9x6c1v4jzsR4993aY4v8E", lat: 9.9312, lng: 76.2673 },
        { title: "Hotels in Vizag", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 17.7000, lng: 83.2167 },
        { title: "Hotels in Lucknow", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 26.8467, lng: 80.9462 },
        { title: "Hotels in Bhopal", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 23.2599, lng: 77.4126 },
        { title: "Hotels in Indore", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 22.7196, lng: 75.8577 },
        { title: "Hotels in Patna", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 25.5941, lng: 85.1376 },
        { title: "Hotels in Surat", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 21.1702, lng: 72.8311 },
        { title: "Hotels in Nagpur", placeId: "ChIJd6h5_u-4jzsR3w1Y7o6690", lat: 21.1458, lng: 79.0882 }
    ];

    const menu = [
        {
            icon: <AiOutlineHome size={22} />,
            pathIcon: <AiFillHome size={22} />,
            title: 'Home',
            path: '/',
        },
        {
            icon: <FaRegUser size={20} />,
            pathIcon: <FaUser size={20} />,
            title: 'Profile',
            path: '/Profile',
        },
        {
            icon: <FaRegBookmark size={20} />,
            pathIcon: <FaBookmark size={20} />,
            title: 'Bookings',
            path: '/Bookings',
        },
    ]

    return (
        <>
            <footer className='shadow-lg bg-[#6d787d] border-t mt-auto w-full py-10 md:py-20 pb-25 lg:pb-0'>
                <Container className=''>
                    <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-20'>
                        <div className='flex flex-col gap-5'>
                            <Image src='/Images/logo.png' alt='Logo' title='Oporooms' width={80} height={52} objectFit='contain' className='w-32' />
                            <p>OPO Rooms Provide All Types of Travelling Bookings Bus, Train, Flight, Cabs etc.</p>
                        </div>

                        <div className='flex flex-col gap-5'>
                            <p className='font-semibold'>Company</p>
                            <ul>
                                <li>About</li>
                                <li>Services</li>
                                <li>Rooms</li>
                                <li>About Us</li>
                                <li>
                                    <Link href='/Contact' title='Contact'>
                                        Contact Us
                                    </Link>
                                </li>
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
                                    <Link href='PrivacyPolicy' title="Privacy Policy">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link href='TermsConditions' title="Terms of use">Terms of use</Link>
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

                    <div className='w-full mt-10 hidden lg:block'>
                        <p className='text-3xl mb-5 font-semibold'>OPO Hotels</p>
                        <ul className='grid grid-cols-6 w-full gap-5'>
                            {hotels?.map((item) => (
                                <li key={item.title}>
                                    <Link href={{
                                        pathname: 'Hotels',
                                        query: {
                                            placeId: item.placeId,
                                            city: item.title,
                                            lat: item.lat,
                                            lng: item.lng,
                                            checkIn: moment(Date.now()).valueOf(),
                                            checkOut: moment(Date.now()).add(1 + 'days').valueOf(),
                                            rooms: 1,
                                            adults: 1,
                                            childrens: 0
                                        }
                                    }} title={item.title}>
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Container>
            </footer>

            {session?.user?._id && <div className='lg:hidden flex bg-white p-5 fixed bottom-0 w-full z-50 shadow-[0_-.5rem_1rem_rgba(0,0,0,0.2)]'>
                <ul className='flex items-center justify-around w-full'>
                    {menu?.map((item) => {
                        return (
                            <li key={item.title}>
                                <Link href={{
                                    pathname: item.path,
                                    query: {
                                        placeId: 'ChIJWYjjgtUZDTkRHkvG5ehfzwI',
                                        city: 'Gurgaon, Haryana, India',
                                        lat: 28.4594965,
                                        lng: 77.0266383,
                                        checkIn: moment(new Date()).valueOf(),
                                        checkOut: moment(new Date()).add(1, 'day').valueOf(),
                                        rooms: 1,
                                        adults: 1,
                                        childrens: 0
                                    }
                                }} className='flex flex-col items-center justify-between gap-2'>
                                    {pathname == item.path ? item.pathIcon : item.icon}
                                    <span className='text-lg text-center'>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </div>}
        </>
    )
}

export default Footer