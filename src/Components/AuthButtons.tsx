'use client'

import { Button, Skeleton } from '@mui/material'
import React, { FormEvent, useContext, useState } from 'react'
import Modal from '@/Components/Modal'
import Input from './Input'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Context } from '@/Context/context'
import axios from 'axios'
import AddUser from './AddUser'

const AuthButtons = () => {
    const { status } = useSession()
    const { user } = useContext(Context)
    const [modal, setModal] = useState<'SignIn' | 'Register' | ''>('')


    if (status == 'loading') {
        return (
            <div className='flex gap-5'>
                <Skeleton variant='rounded' width={78} height={28} />
                <Skeleton variant='rounded' width={65} height={28} />
            </div>
        )
    }

    if (status == 'authenticated' && (user.userRole == 'USER' || user.userRole == 'EMPLOYEE')) {
        return (
            <div>
                <Button className='bg-red-500 text-white font-bold' onClick={async () => await signOut()}>
                    Sign Out
                </Button>
            </div>
        )
    } else if (status == 'authenticated') {
        return (
            <div className='flex gap-5 items-center'>
                <p className='text-lg'>Your are logged in as Admin</p>
                <Button className='bg-red-500 text-white font-bold' onClick={async () => await signOut()}>
                    Sign Out
                </Button>
            </div>
        )
    } else if (status == 'unauthenticated') {
        return (
            <>
                <div className='flex gap-5'>
                    <Button className='text-red-500 font-bold border-red-500' variant='outlined' onClick={() => setModal('Register')}>Register</Button>
                    <Button className='bg-red-500 text-white font-bold' onClick={() => setModal('SignIn')}>
                        Sign In
                    </Button>
                </div>

                <Modal open={modal !== ''} setOpen={() => setModal('')} className='w-[50rem] max-w-full'>
                    <div>
                        {modal == 'SignIn' && <SignIn />}
                        {modal == 'Register' && <AddUser setShowModal={() => setModal('')}/>}
                    </div>
                </Modal>
            </>
        )
    } else {
        return (
            <div className='flex gap-5'>
                <Skeleton variant='rounded' width={78} height={28} />
                <Skeleton variant='rounded' width={65} height={28} />
            </div>
        )
    }
}

const initialState = {
    email: '',
    password: ''
}

const SignIn = () => {
    const [value, setValue] = useState(initialState)
    const [message, setMessage] = useState('')
    console.log(message)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (value.email !== "" && value.password !== "") {
            await axios.get(`/api/login?email=${value.email}&password=${value.password}`).then(async (r) => {
                if (r.status == 200) {
                    await signIn('credentials', {
                        redirect: true,
                        email: value.email,
                        _id: r.data?.user?._id
                    })

                    setMessage('Logged In Successfully')
                } else {
                    setMessage('Network Error')
                }
            })
        } else {
            setMessage('Please provide email and password')
        }
    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <p className='text-3xl'>Sign In</p>
            <div className='flex flex-col gap-5'>
                <Input value={value.email} setValue={txt => setValue(prev => ({ ...prev, email: txt }))} label='Email' name='email' placeholder='Enter your email' />
                <Input value={value.password} setValue={txt => setValue(prev => ({ ...prev, password: txt }))} label='Passsword' name='password' placeholder='Enter your password' type='password' />
            </div>
            <Button className='bg-blue-500 text-white py-5 text-xl' size='large' type='submit'>Sign In</Button>
        </form>
    )
}

export default AuthButtons