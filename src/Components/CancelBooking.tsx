'use client'

import { Button, CircularProgress } from '@mui/material'
import React, { useState } from 'react'
import Modal from './Modal'
import axios from 'axios'
import { useRouter } from 'next/navigation'

type Props = {
    bookingId: string
}

const CancelBooking = ({ bookingId }: Props) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    const handleCancel = async () => {
        setLoading(true)
        await axios.put(`/api/bookings`, { _id: bookingId, status: 'cancel request' }).then((r) => {
            if (r.status == 200) {
                router.refresh()
                setShowModal(false)
            }
        }).finally(() => setLoading(false))
    }

    return (
        <>
            <Button disabled={loading} className='bg-red-500 text-white w-fit px-10 py-5' onClick={() => setShowModal(true)}>Cancel Booking</Button>
            <Modal open={showModal} setOpen={setShowModal}>
                <>
                    <p className='text-2xl font-semibold text-center'>Are you sure?</p>
                    <div className='flex items-center gap-3 mt-7'>
                        <Button disabled={loading} className='bg-slate-500 text-white' onClick={() => setShowModal(false)}>
                            No
                        </Button>

                        <Button disabled={loading} className='bg-red-500 text-white' onClick={handleCancel}>
                            {loading ? <CircularProgress size={15} color='inherit' /> : 'Yes'}
                        </Button>
                    </div>
                </>
            </Modal >
        </>
    )
}

export default CancelBooking