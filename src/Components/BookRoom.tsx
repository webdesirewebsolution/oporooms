'use client'

import { HotelTypes } from '@/Types/Hotels'
import { Button, CircularProgress, Radio } from '@mui/material'
import React, { useContext, useState } from 'react'
import Modal from './Modal'
import { Context } from '@/Context/context'
import axios from 'axios'
// import { v4 as uuidv4 } from 'uuid';
// import sha256 from "crypto-js/sha256";
import { useRouter, useSearchParams } from 'next/navigation'
import moment from 'moment'
import { RoomVarietyTypes } from '@/Types/Rooms'
import { Bookings } from '@/Types/Booking'

type Props = {
    hotelData: HotelTypes,
    roomData: RoomVarietyTypes,
}

const BookRoom = ({ hotelData, roomData }: Props) => {
    const route = useRouter()
    const searchParams = useSearchParams()
    const { user } = useContext(Context)
    const [openModal, setOpenModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [paymentMode, setPaymentMode] = useState<Bookings['paymentMode']>('Online Pay')


    const handleSubmit = async () => {
        setLoading(true)

        const searchData: { [key: string]: string } = {}

        for (const i of searchParams.entries()) {
            searchData[i[0]] = i[1]
        }

        const rooms = searchParams.get('rooms')
        const checkIn = searchParams.get('checkIn')
        const checkOut = searchParams.get('checkOut')

        const totalNights = moment(Number(checkOut)).diff(moment(Number(checkIn)), 'days') + 1

        const transactionDetails = {
            cost: Number(roomData?.price) * totalNights * Number(rooms),
            fee: Number(roomData?.fee),
        }


        const formData: Bookings = {
            userId: user?._id,
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
            paymentMode: paymentMode,
            transactionDetails
        }

        await axios.post(`/api/bookings`, formData).then(r => {
            console.log("redirecting")
                route.push('/Bookings')
                // console.log(route)
        }).finally(() => setLoading(false))

    }

    const makePayment = async () => {
        // setLoading(true)

        // const transactionid = "Tr-" + uuidv4().toString(36).slice(-6);
        // const data = await axios.post("/api/pay", {
        //     amount: data?.rooms?.[0]?.price + data?.rooms?.[0]?.fee
        // })

        // const payload = {
        //     merchantId: process.env.NEXT_PUBLIC_MERCHANT_ID,
        //     merchantTransactionId: transactionid,
        //     merchantUserId: 'MUID-' + uuidv4().toString(36).slice(-6),
        //     amount: data.data.amount,
        //     redirectUrl: `/Bookings`,
        //     redirectMode: "POST",
        //     callbackUrl: `/api/status/${transactionid}`,
        //     mobileNumber: '',
        //     paymentInstrument: {
        //         type: "PAY_PAGE",
        //     },
        // };

        // const dataPayload = JSON.stringify(payload);
        // const dataBase64 = Buffer.from(dataPayload).toString("base64");
        // const fullURL =
        //     dataBase64 + "/pg/v1/pay" + process.env.NEXT_PUBLIC_SALT_KEY;
        // const dataSha256 = sha256(fullURL);
        // const checksum = dataSha256 + "###" + process.env.NEXT_PUBLIC_SALT_INDEX;

        // await axios.post('/api/Phonepe', { checksum, dataBase64 }).then(
        //     async (response) => {
        //         await handleSubmit({ mode: 'Online Pay' })

        //         console.log("response", response)
        //         const redirect = response.data.data;
        //         route.push(redirect)
        //     }
        // ).finally(() => setLoading(false))

    }


    return (
        <div>
            <Button className='bg-red-500 text-white py-5 px-20' size='large' onClick={() => {
                setOpenModal(true)
            }}>Book Now</Button>

            <Modal open={openModal} setOpen={setOpenModal}>
                <div>
                    <p className="text-2xl">Payment Mode</p>
                    <div>
                        {user?.userRole == 'EMPLOYEE' && <div className="flex items-center"> <Radio disabled={loading} checked={paymentMode == 'Pay by company'} value='Company Pay' onChange={() => setPaymentMode('Pay by company')} /> Company Pay </div>}

                        <div className="flex items-center"> <Radio disabled={loading} checked={paymentMode == 'Pay at hotel'} value='Pay at hotel' onChange={() => setPaymentMode('Pay at hotel')} /> Pay at hotel </div>

                        <div className="flex items-center">
                            <Radio disabled={loading} checked={paymentMode == 'Online Pay'} value='Online Pay' onChange={() => setPaymentMode('Online Pay')} /> Online Pay </div>
                    </div>
                    <Button disabled={loading} className='bg-blue-500 text-white mt-5' onClick={() => paymentMode == 'Online Pay' ? makePayment() : handleSubmit()}>
                        {loading ? <CircularProgress size={25} color="inherit" /> :
                            <>
                                {paymentMode == 'Online Pay' && 'Pay Now'}
                                {paymentMode == 'Pay at hotel' && 'Book Now'}
                                {paymentMode == 'Pay by company' && 'Book Now'}
                            </>}
                    </Button>
                </div>
            </Modal>
        </div>
    )
}

export default BookRoom