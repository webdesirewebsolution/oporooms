'use client'

import { Button, CircularProgress, Skeleton, TextField } from '@mui/material'
import React, { FormEvent, useContext, useState } from 'react'
import Modal from '@/Components/Modal'
import { signIn, useSession } from 'next-auth/react'
import axios, { AxiosError } from 'axios'
import AddUser from './AddUser'
import OTPInput from 'react-otp-input'
import { MuiTelInput } from 'mui-tel-input'
import { Context } from '@/Context/context'

const AuthButtons = () => {
    const { status } = useSession()
    const {authModal, setAuthModal} = useContext(Context)

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
                    <Button className='text-red-500 font-bold border-red-500' variant='outlined' onClick={() => setAuthModal('Register')}>Register</Button>
                    <Button className='bg-red-500 text-white font-bold' onClick={() => setAuthModal('SignIn')}>
                        Sign In
                    </Button>
                </div>

                <Modal open={authModal !== ''} setOpen={() => setAuthModal('')} className='w-[50rem] max-w-full' isLogo={true}>
                    <div>
                        {authModal == 'SignIn' && <SignIn setModal={setAuthModal} />}
                        {authModal == 'Register' && <>
                            <p className='uppercase text-red-500 text-center mb-10'>Register</p>

                            <AddUser setShowModal={setAuthModal as React.Dispatch<React.SetStateAction<boolean | "SignIn" | ''>>} isSignIn={true} />
                        </>}
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
    contact1: '',
}

export const SignIn = ({ setModal }: { setModal: React.Dispatch<React.SetStateAction<"" | "SignIn" | "Register">> }) => {
    const [value, setValue] = useState(initialState)
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOtpSent, setIsOtpSent] = useState(false)
    const [code, setCode] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const newContact = value.contact1?.split(' ').join('').split('+')[1]

        if (code !== '') {

            setIsLoading(true)
            await axios.get(`/api/LoginWithOtp?contact1=${newContact}&otp=${code}`).then(async (r) => {
                console.log(r.data)
                if (r.status == 200) {
                    await signIn('credentials', {
                        redirectTo: r.data?.user?.userRole == 'HotelOwner' ? '/Admin': '/',
                        contact1: newContact,
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

        if (value.contact1 !== '') {
            setIsLoading(true)

            await axios.put(`/api/Otp`, { contact1: value.contact1 }).then(() => {
                setMessage('')
                setIsOtpSent(true)
            }).catch((err: AxiosError) => {
                const errorData = err.response?.data as { error: string }

                setMessage(errorData.error)
            }).finally(() => setIsLoading(false))
        } else {
            setMessage('Please provide mobile number')
        }
    }

    return (
        <>{isOtpSent ?
            <form onSubmit={handleSubmit} className='flex flex-col gap-10 items-center'>
                <p className='uppercase text-red-500'>Enter OTP</p>

                <div>
                    <OTPInput
                        value={code}
                        onChange={setCode}
                        numInputs={6}
                        renderSeparator={<span></span>}
                        containerStyle='flex gap-2'
                        placeholder='******'
                        renderInput={(props) => <input {...props} className={`border-2 h-16 w-14 ${message != '' ? 'border-red-300' : 'border-slate-400'} rounded-lg`} />}
                    />
                    {message !== '' && <p className='text-red-500 text-lg mt-3 uppercase'>{message}</p>}
                </div>


                <Button type='submit' className='bg-red-400 text-white py-5 w-full text-2xl' disabled={isLoading} size='large'>{isLoading ? <CircularProgress size={15} color='inherit' /> : 'Sign In'}</Button>
            </form> :

            <form onSubmit={handleOtp} className='flex flex-col gap-5 items-center'>
                <p className='uppercase text-red-500'>Sign In</p>
                {message !== '' && <p className='text-red-500 text-lg'>{message}</p>}
                <div className='flex flex-col gap-5 w-full'>
                    <div className='w-full flex flex-col'>
                        {/* <TextField id="outlined-basic" label="Email" variant="outlined"
                            value={value.email}
                            type='email'
                            className='*:text-xl'
                            onChange={e => setValue(prev => ({ ...prev, email: e.target.value }))}
                            required
                            disabled={isLoading}
                        /> */}
                        <MuiTelInput
                            label='Primary Contact'
                            defaultCountry='IN'
                            className='*:text-xl'
                            value={value.contact1} onChange={e => setValue(prev => ({ ...prev, contact1: e }))}
                            required
                        />

                    </div>
                </div>

                <Button disabled={isLoading} className={`${isLoading ? 'bg-red-300' : 'bg-red-400'} text-white py-5 text-2xl w-full`} size='large' type='submit'>{isLoading ? <CircularProgress size={15} color='inherit' /> : 'Sign In'}</Button>
            </form>
        }

            <div className='w-full mt-5'>
                <Button className='border-2 border-red-400 text-red-500 w-full text-2xl py-5' size='large' variant='outlined' onClick={() => setModal('Register')}>Register</Button>
            </div>
        </>
    )
}

export default AuthButtons