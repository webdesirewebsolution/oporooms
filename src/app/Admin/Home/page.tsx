'use client'

import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Home = () => {
    const [totalBookings, setTotalBookings] = useState(0)
    const [data, setData] = useState({})

    useEffect(() => {
        (async () => {
            await axios.get(`/api/bookings`).then(r => {
                if (r.status == 200) {
                    setTotalBookings(r.data?.count)
                }
            })
        })()
    }, [])

    return (
        <div>
            <div className='flex items-center w-full justify-center my-5'>
                <h1 className='text-align text-4xl text-red-500 font-semibold'>Dashboard</h1>
            </div>
            <div className='flex gap-10 flex-wrap'>
                <div className='shadow p-10 flex flex-col gap-5 items-center justify-center'>
                    <h2 className='text-slate-600'>Total Bookings</h2>
                    <p>{totalBookings}</p>
                </div>
                <div className='shadow p-10 flex flex-col gap-5 items-center justify-center'>
                    <h2 className='text-slate-600'>Today Bookings</h2>
                    <p>{totalBookings}</p>
                </div>
                <div className='shadow p-10 flex flex-col gap-5 items-center justify-center'>
                    <h2 className='text-slate-600'>Upcoming Bookings</h2>
                    <p>{totalBookings}</p>
                </div>
                <div className='shadow p-10 flex flex-col gap-5 items-center justify-center'>
                    <h2 className='text-slate-600'>Bookings Completed</h2>
                    <p>{totalBookings}</p>
                </div>
                <div className='shadow p-10 flex flex-col gap-5 items-center justify-center'>
                    <h2 className='text-slate-600'>Bookings Cancelled</h2>
                    <p>{totalBookings}</p>
                </div>
            </div>
        </div>
    )
}

export default Home