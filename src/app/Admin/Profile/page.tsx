import { getUser } from '@/app/actions'
import { auth } from '@/auth'
import moment from 'moment'
import { Session } from 'next-auth'
import React from 'react'

const Profile = async () => {
    const session = await auth()
    const user = session && await getUser(session as Session)

    console.log(user)

    return (
        <div className='p-10'>
            <ul className='shadow p-10 flex flex-col'>
                <li className='w-full flex justify-between items-center'>
                    <span className='font-semibold'>Name:</span>
                    <span>{user?.fullname}</span>
                </li>
                <li className='w-full flex justify-between items-center'>
                    <span className='font-semibold'>Email:</span>
                    <span>{user?.email}</span>
                </li>
                <li className='w-full flex justify-between items-center'>
                    <span className='font-semibold'>Username:</span>
                    <span>{user?.username}</span>
                </li>
                <li className='w-full flex justify-between items-center'>
                    <span className='font-semibold'>Primary Contact:</span>
                    <span>{user?.contact1}</span>
                </li>
                <li className='w-full flex justify-between items-center'>
                    <span className='font-semibold'>Alternative Contact:</span>
                    <span>{user?.contact2}</span>
                </li>
                <li className='w-full flex justify-between items-center'>
                    <span className='font-semibold'>Gender:</span>
                    <span>{user?.gender}</span>
                </li>
                <li className='w-full flex justify-between items-center'>
                    <span className='font-semibold'>Address:</span>
                    <span>{user?.address}</span>
                </li>
                <li className='w-full flex justify-between items-center'>
                    <span className='font-semibold'>DOB:</span>
                    <span>{moment(user?.dob).format('Do MMM YYYY')}</span>
                </li>
                <li className='w-full flex justify-between items-center'>
                    <span className='font-semibold'>User Role:</span>
                    <span>{moment(user?.userRole).format('Do MMM YYYY')}</span>
                </li>
            </ul>
        </div>
    )
}

export default Profile