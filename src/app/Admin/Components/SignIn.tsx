'use client'

import React, { useActionState } from 'react'
import Input from '@/Components/Input'
import Form from 'next/form'
import { loginUser } from '@/app/actions'
import { CircularProgress } from '@mui/material'

const initialState = {
    message: ''
}

const SignIn = () => {
    const [state, formAction, isPending] = useActionState(loginUser, initialState)

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center text-center gap-8 px-5">
            <Form action={formAction}
                className='flex flex-col gap-12 w-[50rem] max-w-full'>
                <Input
                    label='Email'
                    disabled={isPending}
                    name='email'
                    id='email'
                    placeholder="Email"
                    required
                />
                <Input
                    label='Password'
                    disabled={isPending}
                    name='password'
                    type='password'
                    id='password'
                    placeholder="Password"
                    required
                />
                <button type="submit" className='bg-red-500 w-full py-5 rounded-lg text-white'>{isPending ? <><CircularProgress size={15} color="inherit"/></> : 'Sign In'}</button>
            </Form>
        </div>
    )
}

export default SignIn