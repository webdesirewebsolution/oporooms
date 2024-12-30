'use client'

import Button from '@/Components/Buttons'
import Modal from '@/Components/Modal'
import { EnquiryTypes } from '@/Types/EnquiryType'
import { CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import axios from 'axios'
import { MuiTelInput } from 'mui-tel-input'
import React, { useState } from 'react'

const initialData: EnquiryTypes = {
    fullname: '',
    email: '',
    contact1: '',
    companyName: '',
    employeesNo: ''
}

const Enquiry = () => {
    const [value, setValue] = useState(initialData)
    const [msg, setMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (value.email !== '' && value.fullname !== '' && value.contact1 !== '') {
            setLoading(true)
            await axios.post(`/api/enquiry`, { ...value, userRole: 'CADMIN' }).then(r => {
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

                <TextField
                    disabled={loading}
                    id="outlined-basic" label="Company Name" variant="outlined"
                    value={value.companyName}
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, companyName: e.target.value }))}
                    required
                />

                <MuiTelInput
                    disabled={loading}
                    label='Primary Contact'
                    defaultCountry='IN'
                    className='*:text-xl'
                    value={value.contact1} onChange={e => setValue(prev => ({ ...prev, contact1: e }))} 
                    required/>


                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label" className='text-2xl'>No. of employees</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        disabled={loading}
                        className='*:text-xl'
                        label='No. of employees'
                        value={value.employeesNo}
                        onChange={(e) => e && setValue(prev => ({ ...prev, employeesNo: e.target.value }))}
                        required >
                        <MenuItem value='0 to 10' className='text-xl'>0 to 10</MenuItem>
                        <MenuItem value='10 to 100' className='text-xl'>10 to 100</MenuItem>
                        <MenuItem value='100+' className='text-xl'>100+</MenuItem>
                    </Select>
                </FormControl>

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