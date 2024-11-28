'use client'

import Input from '@/Components/Input'
import Upload from '@/Components/Upload'
import cloudinaryImageUploadMethod from '@/Functions/cloudinary'
import { HotelTypes } from '@/Types/Hotels'
import { User } from '@/Types/Profile'
import { RoomsTypes } from '@/Types/Rooms'
import { Button, CircularProgress } from '@mui/material'
import axios from 'axios'
import moment, { Moment } from 'moment'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { Swiper, SwiperSlide } from 'swiper/react';

type Props = {
    userData?: User,
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

                    const formData: User = {
                        ...value,
                        photo: image,
                        userRole: 'USER',
                        companyId,
                        hrId,
                        createdBy: undefined
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

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

            {msg !== '' && <p className='text-red-500 text-lg text-center'>{msg}</p>}

            <Upload disabled={loading} multiple={false} label='Upload File' setValue={files => {
                console.log({ files })
                setValue(prev => ({ ...prev, photo: files?.[0] }))
            }
            } />

            {value.photo instanceof File &&
                <Image src={url as string} alt='' width={100} height={100} className='aspect-square rounded-lg w-52' />}

            <Input disabled={loading} label='Full Name' placeholder='Enter Full Number' value={value.fullname} setValue={e => setValue(prev => ({ ...prev, fullname: e }))} required />

            <Input type='email' disabled={loading} label='Email' placeholder='Enter Email' value={value.email} setValue={e => setValue(prev => ({ ...prev, email: e }))} required />

            <Input disabled={loading} label='Username' placeholder='Enter Username' value={value.username} setValue={e => setValue(prev => ({ ...prev, username: e }))} required />

            <Input disabled={loading} label='Password' placeholder='Enter Password' value={value.password} setValue={e => setValue(prev => ({ ...prev, password: e }))} type='password' required />

            <Input disabled={loading} type='number' maxLength={13} minLength={10} label='CountryCode' placeholder='Enter Country Code' value={value.countryCode} setValue={e => setValue(prev => ({ ...prev, countryCode: e }))} required />

            <Input disabled={loading} type='number' maxLength={13} minLength={10} label='Primary Contact' placeholder='Enter Primary Contact' value={value.contact1} setValue={e => setValue(prev => ({ ...prev, contact1: e }))} required />

            <Input disabled={loading} type='number' maxLength={13} minLength={10} label='Alternative Contact' placeholder='Enter Alternative Contact' value={value.contact2} setValue={e => setValue(prev => ({ ...prev, contact2: e }))} />

            <Input disabled={loading} type='date' label='Dob' placeholder='Enter Date of birth' value={moment(value.dob).format('YYYY-MM-DD')} setValue={e => setValue(prev => ({ ...prev, dob: moment(e) }))} required />

            <Input disabled={loading} label='Address' placeholder='Enter Address' value={value.address} setValue={e => setValue(prev => ({ ...prev, address: e }))} required />

            <div className='flex flex-col gap-2'>
                <p className='text-xl'>Select Gender</p>
                <Select
                    isDisabled={loading}
                    defaultValue={{ label: 'Select Gender', value: 'Select Gender' }}
                    options={['Male', 'Female', 'Others']?.map((item) => ({ label: item, value: item }))}
                    value={{ label: value.gender, value: value.gender }}
                    onChange={(e) => e && setValue(prev => ({ ...prev, gender: e?.value as User['gender'] }))}
                    required />
            </div>

            <Button type='submit' className='bg-blue-500 text-white' disabled={loading} size='large'>{loading ? <CircularProgress size={15} color='inherit' /> : 'Register'}</Button>
        </form>
    )
}

export default AddUser