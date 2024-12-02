'use client'

import { Button, CircularProgress, Skeleton, TextField } from '@mui/material'
import React, { FormEvent, useState } from 'react'
import Modal from '@/Components/Modal'
import Input from './Input'
import { signIn, useSession } from 'next-auth/react'
import axios from 'axios'
import AddUser from './AddUser'
import debounce from 'lodash.debounce'

const AuthButtons = () => {
    const { status } = useSession()
    const [modal, setModal] = useState<'SignIn' | 'Register' | ''>('')


    if (status == 'loading') {
        return (
            <div className='flex gap-5'>
                <Skeleton variant='rounded' width={78} height={28} />
                <Skeleton variant='rounded' width={65} height={28} />
            </div>
        )
    }
    else if (status == 'unauthenticated') {
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
                        {modal == 'Register' && <AddUser setShowModal={() => setModal('')} />}
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
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (value.email !== "" && value.password !== "") {
            setIsLoading(true)
            await axios.get(`/api/login?email=${value.email}&password=${value.password}`).then(async (r) => {
                console.log(r.data)
                if (r.status == 200) {
                    await signIn('credentials', {
                        redirect: true,
                        email: value.email,
                        _id: r.data?.user?._id
                    })

                    setMessage('Logged In Successfully')
                } else {
                    setMessage('Email or password are incorrect')
                }
            }).catch(err => {
                setMessage('Email or password are incorrect')
            }).finally(() => setIsLoading(false))
        } else {
            setMessage('Please provide email and password')
        }
    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <p className='text-3xl'>Sign In</p>
            {message !== '' && <p className='text-red-500 text-lg'>{message}</p>}
            <div className='flex flex-col gap-5'>
                <div className='w-full flex flex-col'>
                    <TextField id="outlined-basic" label="Email" variant="outlined"
                        value={value.email}
                        type='email'
                        className='*:text-xl'
                        onChange={e => setValue(prev => ({ ...prev, email: e.target.value }))}
                        required
                        disabled={isLoading}
                    />
                </div>

                <TextField id="outlined-basic" label="Password" variant="outlined"
                    value={value.password}
                    type='password'
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={isLoading}

                />
            </div>

            <Button disabled={isLoading} className={`${isLoading ? 'bg-blue-300' : 'bg-blue-500'} text-white py-5 text-xl`} size='large' type='submit'>{isLoading ? <CircularProgress size={15} color='inherit' /> : 'Sign In'}</Button>
        </form>
    )
}

export default AuthButtons