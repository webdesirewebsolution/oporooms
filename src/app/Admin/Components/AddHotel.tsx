'use client'

import Input from '@/Components/Input'
import Upload from '@/Components/Upload'
import cloudinaryImageUploadMethod from '@/Functions/cloudinary'
import { AddressTypes, HotelTypes } from '@/Types/Hotels'
import { User } from '@/Types/Profile'
import { RoomsTypes, RoomVarietyTypes } from '@/Types/Rooms'
import { Button, CircularProgress, IconButton } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md'
import Select from 'react-select'
import { Swiper, SwiperSlide } from 'swiper/react';

type Props = {
    hotelOwnerData: {
        _id: string
    } | User,
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
    isEdit?: boolean,
    hotelData?: HotelTypes
}

interface HotelFormTypes {
    photos: FileList | string[],
    name: string,
    address: AddressTypes,
    rooms: RoomVarietyTypes[],
    status: string,
    amenities: string[]
}

const initialData: HotelFormTypes = {
    photos: [],
    name: '',
    address: {
        lat: '', lng: '', placeId: '', City: '', Locality: ''
    },
    rooms: [{
        id: 0,
        type: '',
        price: '',
        photos: [],
        fee: '',
        amenities: []
    }],
    status: 'pending',
    amenities: []
}

const AddHotel = ({ hotelOwnerData, setShowModal, isEdit, hotelData }: Props) => {
    const [value, setValue] = useState(initialData)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        if (isEdit) {
            setValue(hotelData as HotelTypes)
        }
    }, [isEdit, hotelData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (value?.name !== '') {
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

            let rooms = value?.rooms

            for (let f of value.rooms) {
                if (f?.photos !== undefined && f?.photos instanceof FileList) {
                    let pics = Array.from(f?.photos)
                    let newPics: string[] = []

                    if (pics?.length > 0) {
                        for (let file of pics) {
                            await cloudinaryImageUploadMethod(file).then(r => {
                                newPics.push(r?.secure_url)
                            })
                        }
                    }
                    rooms = rooms.map((i) => i.id == f.id ? ({ ...i, photos: newPics }) : i)
                }
            }

            try {
                if (isEdit) {
                    const formData: HotelTypes = {
                        ...value as HotelTypes,
                        photos: images,
                        rooms
                    }

                    await axios.put(`/api/Hotels`, formData).then(r => {
                        if (r.status == 200) {
                            setShowModal(false)
                        }
                    }).finally(() => setLoading(false))
                } else {

                    const formData: HotelTypes = {
                        ...value as HotelTypes,
                        photos: images,
                        hotelOwnerId: hotelOwnerData?._id,
                        rooms
                    }

                    await axios.post(`/api/Hotels`, formData).then(r => {
                        if (r.status == 200) {
                            setShowModal(false)
                        }
                    }).finally(() => setLoading(false))
                }
            } catch {
                setMsg('Something went wrong')
                setLoading(false)
            }

        }
    }

    const amenities = ["Free Wi-Fi",
        "Swimming Pool",
        "Fitness Center",
        "Restaurant",
        "Bar/Lounge",
        "Room Service",
        "Spa",
        "Parking",
        "Business Center",
        "Conference Rooms",
        "24-Hour Front Desk",
        "Concierge Service",
        "Laundry Service",
        "Air Conditioning",
        "Non-Smoking Rooms",
        "Pet-Friendly",
        "Airport Shuttle",
        "Breakfast Included",
        "Mini Bar",
        "In-Room Safe",
        "TV with Cable/Satellite",
        "Coffee/Tea Maker",
        "Hair Dryer",
        "Complimentary Toiletries",
        "Balcony/Patio",
        "Accessibility Features",
        "Childcare Services",
        "Car Rental Desk",
        "Gift Shop",
        "Dry Cleaning",
        "Luggage Storage",
        "Electric Vehicle Charging Station",
        "Sauna",
        "Hot Tub",
        "Golf Course",
        "Tennis Court",
        "Bicycle Rental",
        "Private Beach Access",
        "Fireplace",
        "BBQ Facilities",
        "Game Room",
        "Library"]

    console.log(value)

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

            <Input disabled={loading} label='Hotel Name' placeholder='Enter Hotel Name' value={value.name} setValue={txt => setValue(prev => ({ ...prev, name: txt }))} required />

            <div className='flex gap-5 flex-wrap items-end'>
                <Input label='Latitude' placeholder='Latitude' className='flex-1' disabled={loading} value={value.address.lat} setValue={(txt) => setValue(prev => ({ ...prev, address: { ...prev.address, lat: txt } }))} />

                <Input label='Latitude' placeholder='Longitude' className='flex-1' disabled={loading} value={value.address.lng} setValue={(txt) => setValue(prev => ({ ...prev, address: { ...prev.address, lng: txt } }))} />
            </div>

            <Select className='z-50'
                isMulti
                isSearchable
                placeholder="Select Hotel Amenities"
                menuPlacement='top'

                options={amenities?.map((item) => ({ label: item, value: item }))}
                value={value.amenities?.map((item) => ({ label: item, value: item }))}
                onChange={(e) => {
                    setValue(prev => ({ ...prev, amenities: e?.map(it => it.value) }))
                }} />

            {value?.rooms?.map((item) => <RoomType key={item.id} item={item} setValue={setValue} loading={loading} />)}

            <Button className='border-blue-400 w-fit' variant='outlined' size='large'
                onClick={() =>
                    setValue(prev => ({
                        ...prev,
                        rooms: [...prev.rooms, {
                            id: value?.rooms?.length, type: '',
                            price: '',
                            photos: [],
                            fee: '',
                            amenities: []
                        }]
                    })
                    )}
            > + Add More Room Types</Button>

            <Button type='submit' className='bg-blue-500 text-white' disabled={loading} size='large'>{loading ? <CircularProgress size={15} color='inherit' /> : 'Add Hotel'}</Button>
        </form>
    )
}

type RoomTypeProps = {
    item: RoomVarietyTypes,
    setValue: React.Dispatch<React.SetStateAction<HotelFormTypes>>,
    loading: boolean
}

const RoomType = ({ item, setValue, loading }: RoomTypeProps) => {

    const onChange = (key: keyof RoomVarietyTypes, val: string | number) => {
        setValue(prev => ({ ...prev, rooms: prev.rooms?.map((d) => d.id == item.id ? ({ ...d, [key]: val }) : d) }))
    }

    const onHandleImage = (key: keyof RoomVarietyTypes, file: FileList) => {
        setValue(prev => ({
            ...prev, rooms: prev.rooms?.map((d) => d.id == item.id ? ({
                ...d, [key]: file
            }) : d)
        }))
    }

    const photos = item?.photos == undefined ? [] : Array.from(item?.photos)

    const hotelRoomAmenities = [
        "Free Wi-Fi",
        "Air Conditioning",
        "Flat-Screen TV",
        "Cable/Satellite Channels",
        "Mini Bar",
        "Coffee/Tea Maker",
        "In-Room Safe",
        "Desk/Workspace",
        "Hair Dryer",
        "Iron and Ironing Board",
        "Telephone",
        "Alarm Clock",
        "Blackout Curtains",
        "Room Service",
        "Private Bathroom",
        "Complimentary Toiletries",
        "Bathrobe and Slippers",
        "Closet/Wardrobe",
        "Refrigerator",
        "Microwave",
        "Kitchenette",
        "Balcony/Patio",
        "Seating Area",
        "Sofa Bed",
        "Crib/Infant Bed (on request)",
        "Daily Housekeeping",
        "Pillow Menu",
        "Hypoallergenic Bedding",
        "Soundproof Rooms",
        "Luxury Bedding",
        "Fireplace",
        "Smart Home Controls",
        "USB Charging Ports",
        "Wake-Up Service",
        "Safe for Laptops",
        "Toaster",
        "Dishwasher",
        "Jacuzzi Tub"
    ];

    return (
        <div key={item.id} className='relative flex flex-col gap-10 border-slate-300 p-10 border-2'>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 items-end'>

                <Upload label='Upload Room Type Photo' className='flex-1' disabled={loading} setValue={file => onHandleImage('photos', file)} />

                <Input label='Room Type' className='flex-1' placeholder='Room Type' disabled={loading} value={item?.type} setValue={txt => onChange('type', txt)} />

                <Input label='Price' className='flex-1' type='number' placeholder='Price' disabled={loading} value={item?.price} setValue={txt => onChange('price', txt)} />

                <Input label='Tax & fees' className='flex-1' type='number' placeholder='Tax & fees' disabled={loading} value={item?.fee} setValue={txt => onChange('fee', txt)} />

                <Select className='z-50'
                    styles={{
                        container: (provided) => ({
                            ...provided,
                            height: '5rem',
                        }),
                        control: (provided) => ({
                            ...provided,
                            overflow: 'auto',
                            height: '100%',
                        }),
                    }}
                    isMulti
                    isSearchable
                    menuPlacement='top'
                    placeholder="Select Hotel Amenities"
                    options={hotelRoomAmenities?.map((item) => ({ label: item, value: item }))}
                    value={item?.amenities?.map((item) => ({ label: item, value: item }))}
                    onChange={(e) => {
                        setValue(prev => ({
                            ...prev, rooms: prev.rooms?.map((d) => d.id == item.id ? ({
                                ...d, amenities: e?.map(it => it.value)
                            }) : d)
                        }))
                    }} />


                <IconButton disabled={loading} className='bg-red-500 absolute bottom-4 right-4' onClick={() => {
                    setValue(prev => ({ ...prev, rooms: prev?.rooms?.filter(it => it.id !== item.id) }))
                }}>
                    <MdDelete size={28} color='#fff' />
                </IconButton>
            </div>

            {photos?.length > 0 && <Swiper
                className='w-full'
                spaceBetween={5}
                slidesPerView='auto'
            >
                {photos?.map((img, i) => {
                    return (
                        <SwiperSlide key={i} className='relative border-2 size-32 flex items-center justify-center p-2'>
                            <Image src={typeof img == 'string' ? img : URL.createObjectURL(img)} alt='' width={100} height={100} />
                        </SwiperSlide>
                    )
                })}
            </Swiper>}
        </div>
    )
}

export default AddHotel