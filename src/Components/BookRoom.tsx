'use client'

import { HotelTypes } from '@/Types/Hotels'
import { Button } from '@mui/material'
import React, { useContext } from 'react'
import { Context } from '@/Context/context'
import { useRouter, useSearchParams } from 'next/navigation'
import moment from 'moment'
import { RoomVarietyTypes } from '@/Types/Rooms'
import { Bookings } from '@/Types/Booking'

type Props = {
    hotelData: HotelTypes,
    roomData: RoomVarietyTypes,
}

const BookRoom = ({ hotelData, roomData }: Props) => {
    const { setBookingData } = useContext(Context)
    const route = useRouter()
    const searchParams = useSearchParams()
    const { user } = useContext(Context)

    const handleSubmit = async () => {
        const searchData: { [key: string]: string } = {}

        for (const i of searchParams.entries()) {
            searchData[i[0]] = i[1]
        }

        const totalNights = moment(Number(searchData?.checkOut)).diff(moment(Number(searchData?.checkIn)), 'days') + 1

        const transactionDetails = {
            cost: Number(roomData?.price) * totalNights * Number(searchData?.rooms),
            fee: Number(roomData?.fee),
        }

        const formData: Bookings = {
            userId: user?._id as string,
            bookingId: hotelData?._id as string,
            hotelId: hotelData?._id as string,
            bookingUid: "OPO555",
            bookingType: 'Hotel',
            status: user?.userRole == 'EMPLOYEE' ? 'pending' : 'approved',
            bookingStatus: user?.userRole == 'EMPLOYEE' ? 'pending' : '',
            bookingDate: new Date(),
            createdAt: new Date(),
            details: hotelData,
            userDetails: user,
            hotelOwnerId: hotelData?.hotelOwnerId as string,
            assignedRooms: [],
            roomDetails: { ...searchData, roomData: roomData },
            roomType: roomData?.type,
            paymentMode: 'Online Pay',
            transactionDetails
        }

        setBookingData(formData)
        route.push('/Checkout')
    }

    return (
        <div>
            <Button className='bg-red-500 text-white py-5 px-20' size='large' onClick={() => {
                handleSubmit()
            }}>Book Now</Button>
        </div>
    )
}

export default BookRoom