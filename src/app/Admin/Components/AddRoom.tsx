'use client'

import Input from '@/Components/Input'
import Upload from '@/Components/Upload'
import cloudinaryImageUploadMethod from '@/Functions/cloudinary'
import { HotelTypes } from '@/Types/Hotels'
import { RoomsTypes } from '@/Types/Rooms'
import { Button, CircularProgress } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { Swiper, SwiperSlide } from 'swiper/react';

type Props = {
    hotelData: HotelTypes,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    isEdit?: boolean,
    roomData?: RoomsTypes
}

const initialData: {
    type: string, number: number, photos: FileList | string[]
} = {
    number: 0,
    type: 'Select Room Type',
    photos: []
}

const AddRoom = ({ hotelData, setShowModal, isEdit, roomData }: Props) => {
    const [value, setValue] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (isEdit) {
            setValue(roomData as RoomsTypes)
        }
    }, [isEdit, roomData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (value?.type !== 'Select Room Type' && value?.number !== Number(0)) {
            setLoading(true)

            let images: string[] = []

            if (value.photos instanceof FileList) {
                for (const file of value.photos) {
                    await cloudinaryImageUploadMethod(file).then(r => {
                        images.push(r?.secure_url)
                    })
                }
            } else {
                images = value.photos
            }

            try {
                if (isEdit) {

                    const formData: RoomsTypes = {
                        ...value,
                        photos: images,
                    }

                    await axios.put(`/api/Rooms`, formData).then(r => {
                        if (r.status == 200) {
                            setShowModal(false)
                        }
                    }).finally(() => setLoading(false))
                } else {

                    const formData: RoomsTypes = {
                        ...value,
                        photos: images,
                        hotelId: hotelData?._id,
                        hotelOwnerId: hotelData?.hotelOwnerId
                    }

                    await axios.post(`/api/Rooms`, formData).then(r => {
                        if (r.status == 200) {
                            setShowModal(false)
                        }
                    }).finally(() => setLoading(false))
                }
            } catch {
                setMsg('Room Already Exist')
            }

        }
    }

    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>

            {msg !== '' && <p className='text-red-500 text-lg text-center'>{msg}</p>}

            <Upload disabled={loading} label='Upload File' setValue={files => setValue(prev => ({ ...prev, photos: files }))} />

            {value?.photos?.length > 0 && <Swiper slidesPerView='auto' spaceBetween={10} className='w-96'>
                {Array.from(value?.photos as FileList | [])?.map((item: File, i) => {
                    const url = item instanceof File ? URL.createObjectURL(item) : item
                    return (
                        <SwiperSlide key={i} className='!w-fit'>
                            <Image src={url} alt='' width={100} height={100} className='aspect-video rounded-lg' />
                        </SwiperSlide>
                    )
                })}
            </Swiper>}

            <Input min={0} disabled={loading} label='Room Number' placeholder='Enter Rooom Number' type='number' value={value.number} setValue={e => setValue(prev => ({ ...prev, number: Number(e) }))} />

            <div className='flex flex-col gap-2'>
                <p className='text-xl'>Select Room Type</p>
                <Select
                    isDisabled={loading}
                    defaultValue={{ label: 'Select Room Type', value: 'Select Room Type' }}
                    options={hotelData?.rooms?.map((item) => ({ label: item.type, value: item?.type }))}
                    value={{ label: value.type, value: value.type }}
                    onChange={(e) => e && setValue(prev => ({ ...prev, type: e?.value }))}
                />
            </div>

            <Button type='submit' className='bg-blue-500 text-white' disabled={loading} size='large'>{loading ? <CircularProgress size={15} color='inherit' /> : (isEdit ? 'Edit Room' : 'Add Room')}</Button>
        </form>
    )
}

export default AddRoom