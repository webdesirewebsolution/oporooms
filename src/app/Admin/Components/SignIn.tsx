'use client'

import React, { useActionState } from 'react'
import Input from '@/Components/Input'
import Form from 'next/form'
import { useFormStatus } from 'react-dom'
import { loginUser } from '@/app/actions'

const initialState = {
    message: ''
}

const SignIn = () => {
    const [state, formAction] = useActionState(loginUser, initialState)
    const { pending } = useFormStatus()
    console.log(state)

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center text-center gap-8 px-5">
            <Form action={formAction}
                className='flex flex-col gap-12 w-full'>
                <Input
                    label='Email'
                    disabled={pending}
                    name='email'
                    id='email'
                    placeholder="Email"
                    required
                />
                <Input
                    label='Password'
                    disabled={pending}
                    name='password'
                    id='password'
                    placeholder="Password"
                    required
                />
                <button type="submit" className='bg-red-500 w-full py-5 rounded-lg text-white'>{pending ? <>loading</> : 'Sign In'}</button>
            </Form>
        </div>
    )
}

export default SignIn