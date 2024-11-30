'use client'

import Upload from '@/Components/Upload'
import cloudinaryImageUploadMethod from '@/Functions/cloudinary'
import { User } from '@/Types/Profile'
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import axios from 'axios'
import moment from 'moment'
import { MuiTelInput } from 'mui-tel-input'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {
    userData: User,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    isEdit?: boolean,
}

const initialData: User = {
    fullname: '',
    email: '',
    password: '',
    photo: '',
    username: '',
    userRole: 'EMPLOYEE',
    countryCode: '91',
    contact1: '',
    contact2: '',
    address: '',
    dob: moment(new Date()),
    gender: 'Male',
    createdBy: '',
    profileStatus: '',
    companyId: '',
    hrId: '',
}

const AddUser = ({ userData, setShowModal, isEdit }: Props) => {
    const [value, setValue] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (isEdit) {
            setValue(userData as User)
        }
    }, [isEdit, userData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (value?.email !== '') {
            setLoading(true)

            let image: string = ''

            if ((value.photo as File) instanceof File) {
                await cloudinaryImageUploadMethod(value.photo as File).then(r => {
                    image = r?.secure_url
                })
            } else {
                image = value.photo as string
            }

            try {
                if (isEdit) {

                    const formData: User = {
                        ...value,
                        photo: image,

                    }

                    await axios.put(`/api/User`, formData).then(r => {
                        if (r.status == 200) {
                            setShowModal(false)
                        }
                    }).finally(() => setLoading(false))
                } else {

                    let companyId = null
                    let hrId = null

                    switch (userData.userRole) {
                        case 'CADMIN':
                            companyId = userData._id
                            break;

                        case 'HR':
                            companyId = userData.companyId
                            hrId = userData._id
                            break;

                        default:
                            break;
                    }

                    console.log(companyId)

                    const formData: User = {
                        ...value,
                        photo: image,
                        companyId,
                        hrId,
                        createdBy: userData.userRole
                    }

                    await axios.post(`/api/User`, formData).then(r => {
                        if (r.status == 200) {
                            setShowModal(false)
                        }
                    }).finally(() => setLoading(false))
                }
            } catch {
                setLoading(false)
                setMsg('User Already Exist')
            }

        }
    }

    const url = value?.photo instanceof File ? URL.createObjectURL(value?.photo) : value?.photo
    const userRole: User['userRole'][] = []

    switch (userData?.userRole) {
        case 'CADMIN':
            userRole.push('EMPLOYEE', 'HR')
            break;

        case 'HR':
            userRole.push('EMPLOYEE')
            break;

        default:
            userRole.push('CADMIN', 'HotelOwner', /* 'EMPLOYEE', 'HR',  */)
            break;
    }

    return (
        <>

            <form onSubmit={handleSubmit} className='flex flex-col gap-10'>

                {msg !== '' && <p className='text-red-500 text-lg text-center'>{msg}</p>}

                <Upload disabled={loading} multiple={false} label='Upload File' setValue={files => {
                    setValue(prev => ({ ...prev, photo: files?.[0] }))
                }} />

                {value.photo instanceof File &&
                    <Image src={url as string} alt='' width={100} height={100} className='aspect-square rounded-lg w-52' />}

                <TextField id="outlined-basic" label="Full Name" variant="outlined"
                    value={value.fullname}
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, fullname: e.target.value }))}
                    required
                />

                <TextField id="outlined-basic" label="Email" variant="outlined"
                    value={value.email}
                    type='email'
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, email: e.target.value }))}
                    required
                />

                {!isEdit && <TextField id="outlined-basic" label="Password" variant="outlined"
                    value={value.password}
                    type='password'
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, password: e.target.value }))}
                    required
                />}

                <MuiTelInput
                    label='Primary Contact'
                    defaultCountry='IN'
                    className='*:text-xl'
                    value={value.contact1} onChange={e => setValue(prev => ({ ...prev, contact1: e }))} />

                <TextField id="outlined-basic" label="DOB" variant="outlined"
                    value={moment(value.dob).format('YYYY-MM-DD')}
                    type='date'
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, dob: moment(e.target.value) }))}
                    required
                />

                <TextField id="outlined-basic" label="Address" variant="outlined"
                    value={value.address}
                    multiline
                    className='*:text-xl'
                    onChange={e => setValue(prev => ({ ...prev, address: e.target.value }))}
                    required
                />

                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label" className='text-2xl'>Select Gender</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        disabled={loading}
                        className='*:text-xl'
                        label='Select Gender'
                        value={value.gender}
                        onChange={(e) => e && setValue(prev => ({ ...prev, gender: e.target.value as User['gender'] }))}
                        required >
                        <MenuItem value='Male' className='text-xl'>Male</MenuItem>
                        <MenuItem value='Female' className='text-xl'>Female</MenuItem>
                        <MenuItem value='Others' className='text-xl'>Others</MenuItem>
                    </Select>
                </FormControl>

                {!isEdit && <FormControl fullWidth>
                    <InputLabel id="user-role-label" className='text-2xl'>Select User Role</InputLabel>
                    <Select
                        labelId="user-role-label"
                        id="user-role-input"
                        disabled={loading}
                        className='*:text-xl'
                        label='Select User Role'
                        value={value.userRole}
                        onChange={(e) => e && setValue(prev => ({ ...prev, userRole: e.target.value as User['userRole'] }))}
                        required >
                        {userRole?.map((item) => (
                            <MenuItem key={item} value={item} className='text-xl'>{item}</MenuItem>
                        ))}
                    </Select>
                </FormControl>}

                <Button type='submit' className='bg-blue-500 text-white py-5' disabled={loading} size='large'>{loading ? <CircularProgress size={15} color='inherit' /> : (isEdit ? 'Edit User' : 'Add User')}</Button>

            </form>

        </>
    )
}

export default AddUser