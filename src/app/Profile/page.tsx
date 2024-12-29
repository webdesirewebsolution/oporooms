import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import { Avatar, Container } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import { getUser } from '../actions'
import { auth } from '@/auth'
import { Session } from 'next-auth'
import EditProfile from '@/Components/Profile/EditProfile'
import dayjs from 'dayjs'

const Profile = async () => {
    const session = await auth()
    const user = await getUser(session as Session)

    if (!session?.user?._id) {
        return (
            <>
                <Header />
                <Footer />
            </>
        )
    }

    return (
        <>
            <Header />
            <Container className='my-10 flex items-center justify-center'>
                <div className='shadow p-10 bg-white rounded-lg'>
                    <div className='flex gap-24'>
                        <div className='flex flex-col md:flex-row gap-8'>
                            <Avatar className='size-52 max-w-full aspect-square'>
                                {user?.photo && <Image src={user.photo as string} alt='User' fill objectFit='cover'/>}
                            </Avatar>
                            <div className='pt-7 flex flex-col gap-2'>
                                <h1 className='text-4xl font-semibold capitalize'>{user.fullname}</h1>
                                <h2 className='font-light text-xl'>{user.email}</h2>
                                <h3 className='font-light text-xl'>{user?.username}</h3>
                                <h4 className='font-light text-xl'>{user?.gender}</h4>
                            </div>
                        </div>

                        <div>
                            <EditProfile user={user} />
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 px-5 mt-10'>
                        {user?.address && <p className='capitalize'>{user?.address}</p>}
                        {user?.contact1 && <p className='capitalize text-xl'>{user?.contact1}</p>}
                        {user?.contact2 && <p className='capitalize text-xl'>{user?.contact2}</p>}
                        {user?.dob && <p className='capitalize text-xl'>{dayjs(new Date(user?.dob as Date)).format('Do MMM YYYY')}</p>}
                    </div>
                </div>
            </Container>
            <Footer />
        </>
    )
}

export default Profile