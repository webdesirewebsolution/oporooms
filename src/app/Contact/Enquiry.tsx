'use client'

// import Modal from '@/Components/Modal'
import { EnquiryTypes } from '@/Types/EnquiryType'
import {  CircularProgress, TextField } from '@mui/material'
import axios from 'axios'
import { MuiTelInput } from 'mui-tel-input'
import React, { useState } from 'react'
import Button from '@/Components/Buttons'

type Props = {}

const initialData: EnquiryTypes = {
    fullname: '',
    email: '',
    contact1: ''
}

const Enquiry = (props: Props) => {
    const [value, setValue] = useState(initialData)
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (value.email !== '' && value.fullname !== '' && value.contact1 !== '') {
            setLoading(true)
            await axios.post(`/api/enquiry`, {...value, userRole: 'USER'}).then(r => {
                if (r.status == 200) {
                    setValue(initialData)
                    setMsg('Success')
                }
            }).catch(err => {
                setMsg('Something wrong')
            }).finally(() => setLoading(false))
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className='flex flex-col gap-10 w-[30rem] max-w-full'>
                <h1 className='text-center font-semibold text-3xl'>Get connect with us</h1>
                <TextField
                    disabled={loading}
                    id="outlined-basic" label="Full Name" variant="outlined"
                    value={value.fullname}
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, fullname: e.target.value }))}
                    required
                />

                <TextField
                    disabled={loading}
                    id="outlined-basic" label="Email" variant="outlined"
                    value={value.email}
                    type='email'
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, email: e.target.value }))}
                    required
                />

                <MuiTelInput
                    disabled={loading}
                    label='Primary Contact'
                    defaultCountry='IN'
                    className='*:text-xl'
                    value={value.contact1} onChange={e => setValue(prev => ({ ...prev, contact1: e }))} />

                <Button
                    type='submit'
                    disabled={loading}
                    className={`${loading ? 'bg-blue-300' : 'bg-blue-500'} text-white py-5 text-2xl`} size='large'>
                    {loading ? <CircularProgress size={20} color='inherit' /> : 'Submit'}
                </Button>
            </form>

            {/* <Modal open={msg !== ''} setOpen={() => setMsg('')}>
                <div>

                </div>
            </Modal> */}
        </>
    )
}

export default Enquiry