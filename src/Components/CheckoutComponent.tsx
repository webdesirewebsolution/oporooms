'use client'

import { Context } from '@/Context/context';
import { Bookings } from '@/Types/Booking';
import { Button, Checkbox, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useContext, useState } from 'react'
import { IoCard, IoShield } from "react-icons/io5";
import Modal from './Modal';
import Link from 'next/link';

const CheckoutComponent = () => {
    return (
        <div className='flex gap-10 my-10'>
            <FillingDetails />
            <Details />
        </div>
    )
}

const FillingDetails = () => {
    const { user, bookingData, setBookingData, bookingSubmitLoading } = useContext(Context)
    const modes: Bookings['paymentMode'][] = []

    switch (user.userRole) {
        case 'USER':
            modes.push('Pay at hotel', 'Online Pay')
            break;

        default:
            modes.push('Pay at hotel', 'Pay by company', 'Online Pay')
            break;
    }

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
                        <div className='flex items-center' key={item}>
                            <Checkbox size='large' disabled={bookingSubmitLoading || item == 'Online Pay'} checked={bookingData?.paymentMode == item} value={item} onClick={() => setBookingData(prev => ({ ...prev, paymentMode: item }))} />
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
    const [showModal, setShowModal] = useState(false)
    const { bookingData, bookingSubmitLoading, setBookingSubmitLoading } = useContext(Context)

    const handleBooking = async () => {
        if (bookingData.paymentMode != 'Online Pay') {
            setBookingSubmitLoading(true)
            await axios.post(`/api/bookings`, bookingData).then(() => {
                setShowModal(true)
            }).finally(() => setBookingSubmitLoading(false))
        }
    }

    return (
        <>
            <Button disabled={bookingSubmitLoading || bookingData?.paymentMode == 'Online Pay'} 
            className={`${(bookingSubmitLoading || bookingData?.paymentMode == 'Online Pay') ? 'bg-red-300' : 'bg-red-500'} text-white w-fit py-5 px-10`} size='large' onClick={() => handleBooking()}>
                {bookingSubmitLoading ? <CircularProgress size={15} color='inherit' /> : "Complete Booking"}
            </Button>
            <Modal open={showModal}>
                <div>
                    <p className='text-2xl font-semibold'>Thank you for booking</p>
                    <div className='flex flex-col items-center gap-3 mt-7'>
                        <Link href='/' className='text-blue-500'>
                            Go to Home
                        </Link>

                        <Link href='/Bookings' className='text-blue-500'>
                            View your bookings
                        </Link>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default CheckoutComponent