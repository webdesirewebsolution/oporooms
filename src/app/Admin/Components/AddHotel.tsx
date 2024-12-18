'use client'

import Upload from '@/Components/Upload'
import cloudinaryImageUploadMethod from '@/Functions/cloudinary'
import { AddressTypes, HotelTypes } from '@/Types/Hotels'
import { User } from '@/Types/Profile'
import { RoomVarietyTypes } from '@/Types/Rooms'
import { Button, CircularProgress, IconButton, TextareaAutosize, TextField } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import { MdDelete } from 'react-icons/md'
import { Swiper, SwiperSlide } from 'swiper/react';
import { MultiSelect } from "react-multi-select-component";
import { useRouter } from 'next/navigation'

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
    customAddress: string,
    desc: string,
    rooms: RoomVarietyTypes[],
    status: string,
    amenities: string[]
}

const initialData: HotelFormTypes = {
    photos: [],
    name: '',
    address: {
        lat: 0, lng: 0, placeId: '', City: 'Goa, India', Locality: ''
    },
    customAddress: '',
    desc: '',
    rooms: [{
        id: 0,
        type: '',
        regularPrice: '',
        price: '',
        photos: [],
        fee: '',
        amenities: []
    }],
    status: 'pending',
    amenities: []
}


const AddHotel = ({ hotelOwnerData, setShowModal, isEdit, hotelData }: Props) => {
    const router = useRouter()
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

            for (const f of value.rooms) {
                if (f?.photos !== undefined && f?.photos instanceof FileList) {
                    const pics = Array.from(f?.photos)
                    const newPics: string[] = []

                    if (pics?.length > 0) {
                        for (const file of pics) {
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
                        status: 'pending',
                        rooms
                    }

                    await axios.put(`/api/Hotels`, formData).then(r => {
                        if (r.status == 200) {
                            setShowModal(false)
                            router.refresh()
                        }
                    }).finally(() => setLoading(false))
                } else {

                    const formData: HotelTypes = {
                        ...value as HotelTypes,
                        photos: images,
                        hotelOwnerId: hotelOwnerData?._id as string,
                        rooms
                    }

                    await axios.post(`/api/Hotels`, formData).then(r => {
                        if (r.status == 200) {
                            setShowModal(false)
                            router.refresh()
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


    return (
        <form onSubmit={handleSubmit} className='flex flex-col gap-10'>

            {msg !== '' && <p className='text-red-500 text-lg text-center'>{msg}</p>}

            <TextField id="outlined-basic" label="Hotel Name" variant="outlined"
                disabled={loading}
                value={value?.name}
                className='*:text-xl'
                onChange={e => setValue(prev => ({ ...prev, name: e.target.value }))}
                required
            />

            <GooglePlacesAutocomplete
                selectProps={{
                    placeholder: 'Select Address',
                    defaultValue: { label: value.address.City as string, value: value.address.City as string },
                    value: { label: value.address.City as string, value: value.address.City as string },
                    onChange: (e) => {

                        if (typeof window !== 'undefined') {
                            const geocoder = new google.maps.Geocoder()

                            geocoder.geocode({ 'placeId': e?.value?.place_id }, (results, status) => {
                                if (status == google.maps.GeocoderStatus.OK) {
                                    const location = results?.[0]?.geometry?.location?.toJSON()
                                    console.log(results?.[0])

                                    setValue(prev => ({
                                        ...prev,
                                        address: {
                                            ...prev.address,
                                            lat: location?.lat as number,
                                            lng: location?.lng as number,
                                            City: e?.value?.description,
                                            placeId: e?.value?.place_id
                                        }
                                    }))
                                }
                            })
                        }

                    },
                    classNames: {
                        control: () => 'py-[0.7rem] mt-1 bg-gray-50 border-gray-100'
                    },
                    // menuPlacement: 'top'
                }}

                apiOptions={{
                    id: 'GoogleMaps',
                    apiKey: 'AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U'
                }}
                apiKey="AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U"

            />

            <TextareaAutosize
                className="min-h-20 border-2 px-5 py-5 rounded-lg focus:outline-blue-500"
                aria-label="empty textarea"
                placeholder="Full Address"
                minRows={2}
                value={value?.customAddress}
                onChange={e => setValue(prev => ({ ...prev, customAddress: e.target.value }))}
            />

            <TextareaAutosize
                className="min-h-20 border-2 px-5 py-5 rounded-lg focus:outline-blue-500"
                aria-label="empty textarea"
                placeholder="Description"
                minRows={2}
                value={value?.desc}
                onChange={e => setValue(prev => ({ ...prev, desc: e.target.value }))}
            />

            <MultiSelect
                className='w-full'
                labelledBy="Select Hotel Amenities"

                options={amenities?.map((item) => ({ label: item, value: item }))}
                value={typeof value?.amenities !== 'undefined' ? value?.amenities?.map((item) => ({ label: item, value: item })): []}
                onChange={(e: { label: string, value: string }[]) => {
                    setValue(prev => ({ ...prev, amenities: e?.map(it => it.value) }))
                }} />

            <div className='shadow w-full border px-10 py-5 flex flex-col gap-5 rounded-lg'>
                <Upload id='UploadHotelImage' disabled={loading} label='Upload Hotel Image' className='bg-red-400' setValue={files => setValue(prev => ({ ...prev, photos: files }))} />

                {value?.photos?.length > 0 && <Swiper slidesPerView='auto' spaceBetween={10} className='w-full'>
                    {Array.from(value?.photos as FileList | [])?.map((item: File, i) => {
                        const url = item instanceof File ? URL.createObjectURL(item) : item
                        return (
                            <SwiperSlide key={i} className='!w-fit'>
                                <Image src={url} alt='' width={100} height={100} className='aspect-video rounded-lg' />
                            </SwiperSlide>
                        )
                    })}
                </Swiper>}
            </div>

            {value?.rooms?.map((item) => <RoomType key={item.id} item={item} setValue={setValue} loading={loading} />)}


            <Button className='border-red-400 w-fit text-red-500' variant='outlined' size='large'
                onClick={() =>
                    setValue(prev => ({
                        ...prev,
                        rooms: [...prev.rooms, {
                            id: value?.rooms?.length, type: '',
                            price: '',
                            regularPrice: '',
                            photos: [],
                            fee: '',
                            amenities: []
                        }]
                    })
                    )}
            > + Add More Room Types</Button>

            <Button type='submit' className='bg-red-400 text-white py-5' disabled={loading} size='large'>{loading ? <CircularProgress size={15} color='inherit' /> : (isEdit ? 'Edit Hotel' : 'Add Hotel')}</Button>
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
            ...prev, rooms: prev.rooms?.map((d) => {
                return (d.id == item.id ? ({
                    ...d, [key]: file
                }) : d)
            })
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
        <div className='relative flex flex-col gap-10 border-slate-200 p-10 border-2 shadow rounded-lg'>
            <p className='text-lg bg-red-400 w-fit px-5 text-white absolute -top-4 rounded-full'>Room Type -
                {item?.id && (item?.id + 1)}</p>
            <div className='grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 items-end'>

                <TextField id="room_type"
                    label="Room Type"
                    variant="outlined"
                    disabled={loading}
                    value={item?.type}
                    className='*:text-xl z-0'
                    onChange={e => onChange('type', e.target.value)}
                    required
                />

                <TextField id="room_regular_price"
                    label="Regular Price"
                    variant="outlined"
                    type='number'
                    disabled={loading}
                    value={item?.regularPrice}
                    className='*:text-xl z-0'
                    onChange={e => onChange('regularPrice', e.target.value)}
                    required
                />

                <TextField id="room_price"
                    label="Price"
                    variant="outlined"
                    type='number'
                    disabled={loading}
                    value={item?.price}
                    className='*:text-xl z-0'
                    onChange={e => onChange('price', e.target.value)}
                    required
                />

                {/* <TextField id="room_fee"
                    label="Tax & fee"
                    variant="outlined"
                    type='number'
                    disabled={loading}
                    value={item.fee}
                    className='*:text-xl'
                    onChange={e => onChange('fee', e.target.value)}
                    required
                /> */}

                <div>
                    <label className='text-lg text-slate-800'>Select Room Amenities</label>
                    <MultiSelect
                        className='w-96 max-w-full'
                        labelledBy="Select Room Amenities"

                        options={hotelRoomAmenities?.map((item) => ({ label: item, value: item }))}
                        value={item.amenities?.map((item) => ({ label: item, value: item }))}
                        onChange={(e: { label: string, value: string }[]) => {
                            setValue(prev => ({
                                ...prev, rooms: prev.rooms?.map((d) => d.id == item.id ? ({
                                    ...d, amenities: e?.map(it => it.value)
                                }) : d)
                            }))
                        }} />
                </div>

                <Upload label='Upload Room Image' id={String(item?.id) as string} className='w-full h-full bg-red-400' disabled={loading} setValue={file => onHandleImage('photos', file)} />

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
                        <SwiperSlide key={i} className='relative border w-52 rounded-lg overflow-hidden aspect-video flex items-center justify-center p-2 shadow'>
                            <Image src={typeof img == 'string' ? img : URL.createObjectURL(img)} alt='' fill objectFit='cover' />
                        </SwiperSlide>
                    )
                })}
            </Swiper>}
        </div>
    )
}

export default AddHotel