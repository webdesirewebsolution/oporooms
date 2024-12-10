'use client'

import { Context } from '@/Context/context';
import { Bookings } from '@/Types/Booking';
import { Button, Checkbox, CircularProgress } from '@mui/material';
import axios from 'axios';
import React, { useContext, useState } from 'react'
import { IoCard, IoLocationSharp } from "react-icons/io5";
import Modal from './Modal';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa6';
import moment from 'moment';
import { IoMdClose } from 'react-icons/io';

const CheckoutComponent = () => {
    return (
        <div className='flex gap-10 my-10'>
            <FillingDetails />
            <Details />
        </div>
    )
}

export const FillingDetails = () => {
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
        <div className='bg-white rounded-lg overflow-hidden' >
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
    )
}

export const Details = () => {
    const { bookingData } = useContext(Context)

    const rooms = bookingData ? Number(bookingData?.roomDetails?.rooms) : 0
    const adults = bookingData ? Number(bookingData?.roomDetails?.adults) : 0
    const childrens = bookingData ? Number(bookingData?.roomDetails?.childrens) : 0
    const checkIn = bookingData ? Number(bookingData?.roomDetails?.checkIn) : 0
    const checkOut = bookingData ? Number(bookingData?.roomDetails?.checkOut) : 0
    const price = bookingData ? Number(bookingData?.transactionDetails?.cost) : 0
    const fee = bookingData ? Number(bookingData?.transactionDetails?.fee) : 0

    const totalDays = (checkIn && checkOut) ? moment(checkOut).diff(checkIn, 'days') : 0

    return (
        <div className='flex flex-col gap-10'>
            <div className='shadow overflow-hidden rounded-lg'>
                <div className='w-[30rem] min-w-full aspect-video relative'>
                    <Image src={bookingData?.details?.photos?.[0]} alt='Hotel Image' fill />
                </div>
                <div className='p-10 bg-white flex flex-col justify-between gap-5'>
                    <div className='flex flex-col'>
                        <h1 className='font-semibold'>{bookingData?.details?.name}</h1>
                        <div className='flex gap-2 my-1'>
                            {Array(5).fill(0)?.map((star, i) => (
                                <FaStar key={i} size={10} color='orange' />
                            ))}
                        </div>
                        <div className='flex gap-2 items-center text-lg text-slate-700'>
                            <IoLocationSharp size={12} />
                            {bookingData?.details?.address?.City}
                        </div>
                    </div>

                    <div className='flex flex-wrap gap-5'>
                        {bookingData?.details?.amenities?.map((am) => (
                            <div key={am} className='text-lg'>
                                {am}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* booking details */}
            <div className='shadow bg-white p-10 flex flex-col gap-4'>
                <p className='font-semibold'>Your booking details</p>
                <div className='flex'>
                    <div className='pr-10 border-r-2'>
                        <p className='text-lg'>Check-in</p>
                        <p className='text-xl font-semibold'>
                            {checkIn && moment(checkIn)?.format('ddd, Do MMM YYYY')}
                        </p>
                    </div>
                    <div className='pl-10'>
                        <p className='text-lg'>Check-out</p>
                        <p className='text-xl font-semibold'>
                            {checkOut && moment(checkOut)?.format('ddd, Do MMM YYYY')}
                        </p>
                    </div>
                </div>
                <p className='text-lg'>
                    {totalDays} day{totalDays > 1 && 's'}, {rooms} room{rooms > 1 && 's'}, {adults} adult{adults > 1 && 's'} {childrens > 0 && `, ${childrens} children${childrens > 1 && 's'}`}
                </p>
            </div>

            <div className='shadow bg-white flex flex-col'>
                <div className='flex flex-col px-10 py-5'>
                    <p className='font-semibold'>Pricing Summary</p>
                    <div className='flex justify-between items-center'>
                        <div className='flex text-lg text-slate-800 items-center gap-2'>
                            {rooms} room{rooms > 1 && 's'} <IoMdClose size={10} /> {totalDays} day{totalDays > 1 && 's'}
                        </div>
                        <p className='text-lg text-slate-800'>
                            &#8377;{rooms * totalDays * price}
                        </p>
                    </div>

                    <div className='flex justify-between items-center'>
                        <p className='text-lg text-slate-800'>Tax & fee</p>
                        <p className='text-lg text-slate-800'>&#8377;{fee}</p>
                    </div>
                </div>
                <div className='flex justify-between items-center border-t-2 px-10 py-5'>
                    <p className='text-2xl text-slate-800'>Total</p>
                    <p className='text-2xl text-slate-800'>&#8377;{(rooms * totalDays * price) + fee}</p>
                </div>
            </div>
        </div>
    )
}

export const CompleteBooking = () => {
    const [showModal, setShowModal] = useState(false)
    const { bookingData, bookingSubmitLoading, setBookingSubmitLoading } = useContext(Context)

    const handleBooking = async () => {
        if (bookingData.paymentMode != 'Online Pay') {
            setBookingSubmitLoading(true)
            await axios.post(`/api/bookings`, {...bookingData, status: (bookingData.paymentMode== 'Pay at hotel') ? 'booked' : 'pending'}).then(() => {
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
                <div className='mt-14'>
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