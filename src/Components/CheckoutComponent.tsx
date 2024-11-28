'use client'

import { Context } from '@/Context/context';
import { Bookings } from '@/Types/Booking';
import { Button, Checkbox, CircularProgress } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'
import { IoCard, IoShield } from "react-icons/io5";

type Props = {}

const CheckoutComponent = (props: Props) => {
    return (
        <div className='flex gap-10 my-10'>
            <FillingDetails />
            <Details />
        </div>
    )
}

const FillingDetails = () => {
    const { bookingData, setBookingData, bookingSubmitLoading } = useContext(Context)
    const modes: Bookings['paymentMode'][] = ['Pay at hotel', 'Pay by company', 'Online Pay']

    return (
        <div className='flex flex-col flex-1 gap-10'>
            <div className='bg-white rounded-lg overflow-hidden'>
                <div className='bg-red-500 p-5 text-white flex items-center gap-5'>
                    <IoShield />
                    <p>1 Room 2 adults</p>
                </div>

                <div className='p-10'></div>
            </div>

            {/* card */}
            <div className='bg-white rounded-lg overflow-hidden'>
                <div className='bg-red-500 p-5 text-white flex items-center gap-5'>
                    <IoCard />
                    <p>Payment options</p>
                </div>

                <div className='p-10 flex flex-col gap-5'>
                    {modes?.map((item) => (
                        <div className='flex items-center'>
                            <Checkbox size='large' disabled={bookingSubmitLoading} checked={bookingData?.paymentMode == item} value={item} onClick={() => setBookingData(prev => ({ ...prev, paymentMode: item }))} />
                            <p className='text-xl'>{item}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const Details = () => {
    return (
        <div></div>
    )
}

export const CompleteBooking = () => {
    const route = useRouter()
    const { bookingData, bookingSubmitLoading, setBookingSubmitLoading } = useContext(Context)

    const handleBooking = async () => {
        setBookingSubmitLoading(true)
        await axios.post(`/api/bookings`, bookingData).then(r => {
            console.log("redirecting")
            route.push('/Bookings')
        }).finally(() => setBookingSubmitLoading(false))
    }

    return (
        <Button className='bg-red-500 text-white w-fit py-5 px-10' size='large' onClick={() => handleBooking()}>
            {bookingSubmitLoading ? <CircularProgress size={15} color='inherit' /> : "Complete Booking"}
        </Button>
    )
}

export default CheckoutComponent