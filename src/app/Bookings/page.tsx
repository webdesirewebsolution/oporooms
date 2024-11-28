import { auth } from '@/auth'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import { Bookings as BookingTypes } from '@/Types/Booking'
import { Container } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import React from 'react'
import { FaStar } from 'react-icons/fa6'
import { getUser } from '../actions'
import { Session } from 'next-auth'
import CancelBooking from '@/Components/CancelBooking'

const Bookings = async () => {
    const session = await auth()
    const user = await getUser(session as Session)
    const data = session && (await axios.get(`${process.env.SERVERURL}/api/bookings?userId=${session?.user._id as string}`)).data?.list as BookingTypes[]

    return (
        <>
            <Header />
            <div className='bg-[rgb(244,244,244,1)]'>
                <Container className='py-16'>
                    <h1 className='text-5xl font-semibold'>My Bookings</h1>
                    <div className='flex flex-col gap-10 mt-16'>
                        {data?.map((item) => {

                            const statusStyle = {
                                'pending': 'bg-yellow-500',
                                'approved': 'bg-green-500',
                                'declined': 'bg-red-500',
                                'cancelled': 'bg-red-500',
                                'cancel request': 'bg-red-500'
                            }

                            const bookingStatusStyle = {
                                'pending': 'bg-yellow-500',
                                'approved': 'bg-green-500',
                                'declined': 'bg-red-500',
                                '': ''
                            }

                            return (
                                <div key={item?._id} className='bg-white p-6 rounded-md flex flex-col lg:flex-row gap-10 justify-between shadow-lg'>
                                    <div className='flex flex-col lg:flex-row gap-10'>
                                        <div className='w-full lg:w-[35rem] aspect-video max-w-full relative rounded-xl'>
                                            <Image src={item?.roomDetails?.roomData?.photos?.[0]} alt='' fill objectFit='cover' />
                                        </div>

                                        <div className='flex flex-col gap-5 lg:py-5 justify-between'>
                                            <p className='text-4xl font-semibold'>{item?.roomDetails?.roomData?.type}</p>
                                            <div className='flex gap-2 items-center'>
                                                {Array(5).fill(2)?.map((star, i) => (
                                                    <FaStar key={i} color="orange" />
                                                ))}
                                                <p className='text-slate-700 text-xl mt-1'>4.5 (1200 Reviews)</p>
                                            </div>

                                            <p className='text-xl text-slate-700'>Live a little and celbrate with champagne</p>
                                            <p className='text-xl text-slate-700 lg:w-[40rem]'>
                                                Reats include a glass of French champagne, parking and a late checkout. Gym included. Flexible cancellation applies
                                            </p>

                                            {(item?.status == 'cancel request' || item?.status == 'cancelled') ? <></> : <CancelBooking bookingId={item._id as string} />}
                                        </div>

                                    </div>

                                    <div className='flex flex-col items-end justify-between gap-5 lg:py-5'>
                                        <div className='flex gap-4'>
                                            {user?.userRole == 'EMPLOYEE' &&
                                                <div className={`${bookingStatusStyle[item?.bookingStatus]} px-5 py-2 text-white text-lg rounded-lg`}>
                                                    Status from company: {item?.bookingStatus}
                                                </div>}

                                            <div className={`${statusStyle[item?.status]} px-5 py-2 text-white text-lg rounded-lg`}>
                                                {item?.status}
                                            </div>
                                        </div>

                                        <div className='flex flex-col items-end'>
                                            <p className='text-4xl font-semibold'>Rs. {item?.roomDetails?.roomData?.price}</p>
                                            <p className='text-slate-700 text-lg'>Rs. {item?.roomDetails?.roomData?.fee} taxes and fees</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Container>
            </div>
            <Footer />
        </>
    )
}

export default Bookings