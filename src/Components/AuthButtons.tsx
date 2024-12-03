'use client'

import { Button, CircularProgress, Skeleton, TextField } from '@mui/material'
import React, { FormEvent, useState } from 'react'
import Modal from '@/Components/Modal'
import { signIn, useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import AddUser from './AddUser'
import OTPInput from 'react-otp-input'

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
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [code, setCode] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (code !== '') {

            setIsLoading(true)
            await axios.get(`/api/LoginWithOtp?email=${value.email}&otp=${code}`).then(async (r) => {
                console.log(r.data)
                if (r.status == 200) {
                    await signIn('credentials', {
                        redirect: true,
                        email: value.email,
                        _id: r.data?.user?._id
                    })

                }
            }).catch((err) => {
                const errorData = err.response?.data as { error: string }

                setMessage(errorData.error)
            }).finally(() => setIsLoading(false))
        }
    }

    const handleOtp = async (e: React.FormEvent) => {
        e.preventDefault()
        if (value.email !== '') {
            setIsLoading(true)

            await axios.put(`/api/Otp`, { email: value.email })
                .then(() => {
                    setIsOtpSent(true)
                }).catch((err: AxiosError) => {
                    const errorData = err.response?.data as { error: string }

                    setMessage(errorData.error)
                }).finally(() => setIsLoading(false))
        } else {
            setMessage('Please provide email')
        }
    }

    return (
        <>{isOtpSent ?
            <form onSubmit={handleSubmit} className='flex flex-col gap-10'>
                {message !== '' && <p className='text-red-500 text-lg text-center'>{message}</p>}
                <OTPInput
                    value={code}
                    onChange={setCode}
                    numInputs={5}
                    renderSeparator={<span></span>}
                    containerStyle='flex gap-2'
                    placeholder='*****'
                    renderInput={(props) => <input {...props} className='border-2 h-16 w-14 border-slate-600' />}
                />

                <Button type='submit' className='bg-blue-500 text-white py-5' disabled={isLoading} size='large'>{isLoading ? <CircularProgress size={15} color='inherit' /> : 'SignIn'}</Button>
            </form> :

            <form onSubmit={handleOtp} className='flex flex-col gap-5'>
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

                    {/* <TextField id="outlined-basic" label="Password" variant="outlined"
                    value={value.password}
                    type='password'
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, password: e.target.value }))}
                    required
                    disabled={isLoading}

                /> */}
                </div>

                <Button disabled={isLoading} className={`${isLoading ? 'bg-blue-300' : 'bg-blue-500'} text-white py-5 text-xl`} size='large' type='submit'>{isLoading ? <CircularProgress size={15} color='inherit' /> : 'Sign In'}</Button>
            </form>
        }
        </>
    )
}

export default AuthButtons