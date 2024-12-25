'use client'

import { handleUserEnquiry } from '@/app/actions'
import { Alert, Button, CircularProgress, Snackbar, TextField } from '@mui/material'
import Form from 'next/form'
import React, { useActionState, useEffect, useState } from 'react'
import { MuiPhone } from './MuiPhone'
import { useSearchParams } from 'next/navigation'

const initialState = {
    message: '',
    status: 200
}

interface State {
    message: string;
    status: number;
}

type Payload = FormData
const UserForm = () => {
    const [msg, setMsg] = useState(initialState)
    const searchParams = useSearchParams()
    const checkIn = searchParams.has('checkIn') ? new Date(Number(searchParams.get('checkIn')) as number) : new Date()
    const checkOut = searchParams.has('checkOut') ? new Date(Number(searchParams.get('checkOut')) as number) : new Date()

    const [state, formAction, isPending] = useActionState(handleUserEnquiry, initialState);

    // useEffect(() => {
    //     if (state.message !== msg.message) {
    //         setMsg(state)
    //     } else if (state.message == msg.message) {
    //         setTimeout(() => {
    //             setMsg(initialState)
    //         }, 2000)
    //     }
    // }, [state, initialState])

    return (
        <>
            <Form action={formAction} className='flex flex-col items-center bg-white p-8 shadow w-[40rem] max-w-full gap-10 rounded-lg'>
                <label className='text-2xl font-semibold'>Contact Us</label>
                <TextField label="Name" placeholder='Name' name='name' disabled={isPending} className='w-full' required />
                <TextField label="Email" placeholder='Email' name='email' disabled={isPending} className='w-full' required />
                <MuiPhone disabled={isPending} placeholder='Phone' name='phone' className='w-full' required />

                <TextField label='CheckIn' placeholder='CheckIn' name='checkin' value={checkIn.toISOString()} disabled className='w-full' />
                <TextField label='CheckOut' placeholder='CheckOut' name='checkout' value={checkOut.toISOString()} disabled className='w-full' />

                <Button type='submit' disabled={isPending} className='bg-red-400 text-white transition-all' size='large'>{isPending ? <CircularProgress size={15} color='inherit' /> : "Contact Us"}</Button>
            </Form>

            <Snackbar
                open={state?.message == 'Submitted'}
                autoHideDuration={6000}
                message="Note archived"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    Form Submitted Succeffully
                </Alert>
            </Snackbar>
        </>
    )
}

export default UserForm