'use client'

import Button from '@/Components/Buttons'
import { MuiPhone } from '@/Components/MuiPhone'
import React from 'react'

const FlightFillingDetails = () => {
    return (
        <>
            <div className='bg-white rounded-lg overflow-hidden p-5'>
                <p className='font-medium'>Contact Details (Booking details will be sent to)</p>
                <div className='mt-5 flex items-end gap-5'>
                    <MuiPhone />
                    <div className='flex flex-col gap-1 flex-1'>
                        <label className='text-lg'>Email</label>
                        <input placeholder='Email' className='text-lg border rounded-lg py-5 px-3' />
                    </div>
                </div>
            </div>

            <div className='bg-white rounded-lg overflow-hidden p-5'>
                <p className='font-medium'>Passenger Details</p>
                <p className='font-medium text-lg py-3 border-b'>Primary Passenger</p>

                <div className='bg-[#E7F5FF] p-4'>
                    <p className='text-lg font-light'>Use all given names and surnames exactly as they appear in your passport/ID to avoid boarding complications.</p>
                </div>

                <div className='mt-5 gap-5 grid grid-cols-1 md:grid-cols-2'>
                    <div className='flex flex-col gap-1 flex-1'>
                        <label className='text-lg'>First Name</label>
                        <input placeholder='First Name' className='text-lg border rounded-lg py-5 px-3' />
                    </div>
                    <div className='flex flex-col gap-1 flex-1'>
                        <label className='text-lg'>Last Name</label>
                        <input placeholder='Last Name' className='text-lg border rounded-lg py-5 px-3' />
                    </div>
                    <div className='flex flex-col md:flex-row gap-5 flex-1'>
                        <div className='flex flex-col gap-1 flex-1'>
                            <label className='text-lg'>Nationality</label>
                            <input placeholder='Nationality' className='text-lg border rounded-lg py-5 px-3' />
                        </div>
                        <div className='flex flex-col gap-1 flex-1'>
                            <label className='text-lg'>Gender</label>
                            <input placeholder='Gender' className='text-lg border rounded-lg py-5 px-3' />
                        </div>
                    </div>
                    <div className='flex flex-col gap-1 flex-1'>
                        <label className='text-lg'>Date of brith</label>
                        <input placeholder='DOB' type='date' className='text-lg border rounded-lg py-5 px-3' />
                    </div>
                    <div className='flex flex-col gap-1 flex-1'>
                        <label className='text-lg'>Passport number</label>
                        <input placeholder='Passport number' className='text-lg border rounded-lg py-5 px-3' />
                    </div>
                    <div className='flex flex-col gap-1 flex-1'>
                        <label className='text-lg'>Passport expiration date</label>
                        <input placeholder='Passport expiration date' type='date' className='text-lg border rounded-lg py-5 px-3' />
                        <div className='flex gap-1 items-center'>
                            <input placeholder='No expiration' type='checkbox' />
                            <label className='text-lg'>No expiration</label>
                        </div>
                    </div>
                </div>
                <div className='bg-[#E9ECEF] p-4 rounded-lg my-5'>
                    <div className='flex flex-col gap-1'>
                        <p className='text-lg font-semibold'>Cabin or carry-on baggage information</p>
                        <p className='text-lg'>1 cabin baggage that you can take for your whole trip.</p>
                    </div>
                </div>

                <div className='flex items-end w-full'>
                    <Button className='bg-red-500 text-white py-5 px-10' size="large">Add Passenger</Button>
                </div>
            </div>
        </>
    )
}

export const FlightDetails = () => {
    return (
        <div className='flex'>
            <div className='shadow bg-white flex flex-col h-fit *:text-nowrap w-full md:w-fit'>
                <div className='flex flex-col px-10 py-5'>
                    <p className='font-semibold'>Fare Summary</p>
                    <div className='flex justify-between items-center'>
                        <div className='flex text-lg text-slate-800 items-center gap-2'>
                            Adult(s) (1 * $110)
                        </div>
                        <p className='text-lg text-slate-800'>
                            &#8377;12,150
                        </p>
                    </div>

                    <div className='flex justify-between items-center gap-10'>
                        <p className='text-lg text-slate-800'>Taxes, Fee and Surcharges</p>
                        <p className='text-lg text-slate-800'>&#8377;2,650</p>
                    </div>
                    <div className='flex justify-between items-center gap-10'>
                        <p className='text-lg text-slate-800'>Airline Taxes and Surcharges</p>
                        <p className='text-lg text-slate-800'>&#8377;1730</p>
                    </div>
                    <div className='flex justify-between items-center gap-10'>
                        <p className='text-lg text-slate-800'>Service Fee</p>
                        <p className='text-lg text-slate-800'>&#8377;920</p>
                    </div>
                </div>
                <div className='flex justify-between items-center border-t-2 px-10 py-5'>
                    <p className='text-2xl text-slate-800 font-semibold'>Total</p>
                    <p className='text-2xl text-slate-800 font-semibold'>&#8377;14,800</p>
                </div>
            </div>
        </div>
    )
}

export default FlightFillingDetails