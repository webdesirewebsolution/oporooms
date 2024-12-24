'use client'

import { Button } from '@mui/material'
import React, { useContext } from 'react'
import { Context } from '@/Context/context'
import { useRouter, useSearchParams } from 'next/navigation'
import moment from 'moment'
import { Bookings } from '@/Types/Booking'
import { useSession } from 'next-auth/react'
import axios from 'axios'

type Props = {
    hotelId: string,
}

const BookRoom = ({ hotelId }: Props) => {
    const { status } = useSession()
    const { setBookingData, setAuthModal } = useContext(Context)
    const route = useRouter()
    const searchParams = useSearchParams()
    const { user } = useContext(Context)

    const handleSubmit = async () => {
        const hotelData = await axios.get(`/api/app/SingleHotel?_id=${hotelId}`).then(r => {
            if (r.status == 200) return r.data?.data
        })

        const roomData = hotelData?.rooms?.[0]

        const searchData: { [key: string]: string } = {}

        for (const i of searchParams.entries()) {
            searchData[i[0]] = i[1]
        }

        const totalNights = moment(Number(searchData?.checkOut)).diff(moment(Number(searchData?.checkIn)), 'days') + 1

        const transactionDetails = {
            cost: Number(roomData?.price) * totalNights * Number(searchData?.rooms),
            fee: 100,
        }

        const formData: Bookings = {
            userId: user?._id as string,
            bookingId: hotelData?._id as string,
            hotelId: hotelData?._id as string,
            bookingUid: "OPO555",
            bookingType: 'Hotel',
            status: 'pending',
            bookingStatus: user?.userRole == 'EMPLOYEE' ? 'pending' : 'approved',
            bookingDate: new Date(),
            createdAt: new Date(),
            details: hotelData,
            userDetails: user,
            hotelOwnerId: hotelData?.hotelOwnerId as string,
            assignedRooms: [],
            roomDetails: { ...searchData, roomData: roomData },
            roomType: roomData?.type,
            paymentMode: 'Online Pay',
            transactionDetails,
            paymentStatus: 'pending'
        }

        setBookingData(formData)
        route.push('/Checkout')
    }

    return (
        <div>
            <Button className='bg-[rgba(26,182,79,1)] text-white py-5 px-20' size='large' onClick={() => {
                if (status == 'authenticated') {
                    handleSubmit()
                } else {
                    setAuthModal('SignIn')
                }
            }}>Book Now</Button>
        </div>
    )
}

export default BookRoom