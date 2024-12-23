'use client'

import { Bookings as BookingTypes } from '@/Types/Booking'
import { Container, Rating } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import CancelBooking from '@/Components/Bookings/CancelBooking'
import RatingComp from '@/Components/Bookings/RatingComp'
import { useSession } from 'next-auth/react'
import { Context } from '@/Context/context'

const BookingsDetails = () => {
    const { status } = useSession()
    const { user } = useContext(Context)
    const [data, setData] = useState<BookingTypes[]>([])

    useEffect(() => {
        (async () => await axios.get(`/api/bookings?userId=${user?._id}`).then(r => {
            if (r.status == 200) {
                setData(r.data?.list)
            }
        }))()
    }, [user?._id])

    if (data?.length == 0) {
        return (
            <>
                <div className='bg-[rgb(244,244,244,1)] h-full'>
                    <Container className='py-16 h-full'>
                        <h1 className='text-5xl font-semibold'>My Bookings</h1>
                        <div className='w-full flex items-center justify-center py-10'>
                            No bookings
                        </div>
                    </Container>
                </div>

            </>
        )
    }

    if (status == 'unauthenticated') {
        return (
            <>
                <div className='bg-[rgb(244,244,244,1)] h-full'>
                    <Container className='py-16 h-full'>
                        <h1 className='text-5xl font-semibold'>My Bookings</h1>
                        <div className='w-full flex items-center justify-center py-10'>
                            Please SignIn to view your bookings
                        </div>
                    </Container>
                </div>
            </>
        )
    }

    return (
        <>
            <div className='bg-[rgb(244,244,244,1)]'>
                <Container className='py-16'>
                    <h1 className='text-5xl font-semibold'>My Bookings</h1>
                    <div className='flex flex-col gap-10 mt-16'>
                        {data?.map((item) => {

                            const statusStyle = {
                                'pending': 'bg-yellow-500',
                                'booked': 'bg-green-500',
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
                                <div className='flex flex-col' key={item?._id}>
                                    <div className='bg-white p-6 rounded-md flex flex-col lg:flex-row gap-10 justify-between shadow-lg'>
                                        <div className='flex flex-col lg:flex-row gap-10'>
                                            <div className='w-full lg:w-[35rem] aspect-video max-w-full relative rounded-xl'>
                                                <Image src={item?.roomDetails?.roomData?.photos?.[0]} alt='' fill objectFit='cover' />
                                            </div>

                                            <div className='flex flex-col gap-5 lg:py-5 justify-between'>
                                                <p className='text-4xl font-semibold'>{item?.roomDetails?.roomData?.type}</p>
                                                <div className='flex gap-2 items-center'>
                                                    <Rating name="read-only" value={Number(item?.totalRating)} readOnly />
                                                    <p className='text-slate-700 text-xl mt-1'>4.5 (1200 Reviews)</p>
                                                </div>

                                                <p className='text-xl text-slate-700'>Live a little and celbrate with champagne</p>
                                                <p className='text-xl text-slate-700 lg:w-[40rem]'>
                                                    Reats include a glass of French champagne, parking and a late checkout. Gym included. Flexible cancellation applies
                                                </p>

                                                {(item?.status == 'cancel request' || item?.status == 'cancelled') ? <></> : <CancelBooking bookingId={item._id as string} bookingData={item}/>}
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
                                                <p className='text-4xl font-semibold'>&#8377;{item?.roomDetails?.roomData?.price}</p>
                                                <p className='text-slate-700 text-lg'>Included taxes and fees</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='w-full py-8 px-10 shadow bg-slate-100 rounded-bl-xl rounded-br-xl'>
                                        <RatingComp user={user} hotelId={item.hotelId as string} hotelOwnerId={item.hotelOwnerId as string} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Container>
            </div>
        </>
    )
}

export default BookingsDetails