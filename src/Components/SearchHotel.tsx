'use client'

import React, { useState } from 'react'
import Input from './Input'
import { Button, Container } from '@mui/material'
import Link from 'next/link'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import moment, { Moment } from 'moment'
import Modal from './Modal'
import { useSearchParams } from 'next/navigation'

type SearchProps = {
    city: string,
    lat: number,
    lng: number,
    checkIn: Moment,
    checkOut: Moment,
    rooms: number,
    guests: {
        adults: number,
        children: number
    }
}


const SearchHotel = ({ }) => {
    const searchParams = useSearchParams()
    const [placeId, setPlaceId] = useState('ChIJQbc2YxC6vzsRkkDzYv-H-Oo')
    const [value, setValue] = useState<SearchProps>({
        city: searchParams.get('city')?.split("%20").join(' ') ? searchParams.get('city') as string : 'Gurgaon, Haryana, India',
        lat: Number(searchParams.get('lat')),
        lng: Number(searchParams.get('lng')),
        checkIn: moment(new Date(Number(searchParams.get('checkIn')))),
        checkOut: moment(new Date(Number(searchParams.get('checkOut')))),
        rooms: Number(searchParams.get('rooms')) || 1,
        guests: {
            adults: Number(searchParams.get('adults')) || 2,
            children: Number(searchParams.get('childrens')) || 0
        }
    })
    const [selectRoom, setSelectRoom] = useState(false)


    return (
        <div className='py-20 px-10 md:px-0'>
            <Container className='flex flex-col md:flex-row gap-5 items-center w-full shadow-xl py-8 bg-white'>
                <div className='w-full'>
                    <GooglePlacesAutocomplete
                        selectProps={{
                            defaultValue: { label: value.city, value: value.city },
                            value: { label: value.city, value: value.city },
                            onChange: (e) => {
                                if (typeof window !== 'undefined') {
                                    const geocoder = new google.maps.Geocoder()

                                    geocoder.geocode({ 'placeId': e?.value?.place_id }, (results, status) => {
                                        if (status == google.maps.GeocoderStatus.OK) {
                                            const location = results?.[0]?.geometry?.location?.toJSON()

                                            setValue(prev => ({
                                                ...prev,
                                                lat: location?.lat as number,
                                                lng: location?.lng as number,
                                                city: e?.value?.description,
                                            }))
                                        }
                                    })
                                }
                                setPlaceId(e?.value?.place_id)
                            },
                            classNames: {
                                control: () => 'py-[0.7rem] mt-1 bg-gray-50 border-gray-100'
                            }
                        }}
                        apiOptions={{
                            id: 'GoogleMaps',
                            apiKey: 'AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U'
                        }}
                        apiKey="AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U"

                    />
                </div>

                <Input
                    placeholder="CHECK-IN"
                    type='date'
                    className='bg-gray-50 border-gray-100 rounded-lg'
                    value={moment(value.checkIn).format('YYYY-MM-DD')}
                    onChange={(e) => {
                        setValue(prev => ({ ...prev, checkIn: moment(e.target.value), checkOut: moment(value.checkOut) > moment(e.target.value) ? moment(value.checkOut) : moment(e.target.value).add(1, 'days') }))
                    }}
                />

                <Input
                    placeholder="CHECK-OUT"
                    type='date'
                    className='bg-gray-50 border-gray-100 rounded-lg'
                    min={moment(value.checkIn).add(1, 'day').format('YYYY-MM-DD')}
                    value={moment(value.checkOut).format('YYYY-MM-DD')}
                    onChange={e => setValue(prev => ({ ...prev, checkOut: moment(e.target.value) }))}
                />

                <div className='flex flex-col w-full'>
                    <button type='button' className='border-2 bg-gray-50 border-gray-100 rounded-lg px-5 h-20' onClick={() => setSelectRoom(true)}>
                        <p>{value.rooms} {value.guests.adults > 1 ? 'Rooms' : 'Room'}, {value.guests.adults} {value.guests.adults > 1 ? 'Adults' : 'Adult'}{value.guests.children > 0 && `, ${value.guests.children}`} {value.guests.children > 0 && (value.guests.children > 1 ? 'Childrens' : 'Children')}</p>
                    </button>
                </div>
                <Link href={{
                    pathname: '/Hotels',
                    query: {
                        placeId: placeId,
                        city: value.city,
                        lat: value.lat,
                        lng: value.lng,
                        checkIn: moment(value.checkIn).format('x'),
                        checkOut: moment(value.checkOut).add(1, 'day').format('x'),
                        rooms: value.rooms,
                        adults: value.guests.adults,
                        childrens: value.guests.children
                    }
                }} className='w-full'>
                    <Button className='bg-red-500 text-white w-full h-20' size='large'>Find Hotels</Button>
                </Link>

                <Modal open={selectRoom} setOpen={setSelectRoom} className='w-96'>
                    <SelectRooms value={value} setValue={setValue} setSelectRoom={setSelectRoom} />
                </Modal>
            </Container>
        </div>
    )
}

type SelectRoomsProps = {
    value: SearchProps,
    setValue: React.Dispatch<React.SetStateAction<SearchProps>>,
    setSelectRoom: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectRooms = ({ value, setValue, setSelectRoom }: SelectRoomsProps) => {
    const [val, setVal] = useState({
        rooms: value?.rooms,
        guests: value?.guests
    })

    const handleSubmit = () => {
        setValue(prev => ({ ...prev, ...val }))
        setSelectRoom(false)
    }


    return (
        <div>
            <ul className='w-full flex flex-col gap-5 mb-10'>
                <li className='flex justify-between items-center w-full gap-10'>
                    <p className='font-semibold text-slate-700'>Rooms</p>
                    <Input value={val.rooms} onChange={e => {
                        setVal(prev => ({ ...prev, rooms: Number(e.target.value), guests: { ...prev.guests, adults: Number(val.guests.adults) > Number(e.target.value) ? Number(val.guests.adults) : Number(e.target.value) } }))
                    }}
                        className='font-semibold' type='number' min={1} max={20} />
                </li>

                <li className='flex justify-between items-center w-full gap-10'>
                    <p className='font-semibold text-slate-700'>Adults</p>
                    <Input value={val.guests.adults} onChange={e => setVal(prev => ({ ...prev, guests: { ...prev.guests, adults: Number(e.target.value) } }))}
                        className='font-semibold' type='number' min={val.rooms} max={val.rooms * 3} />
                </li>

                <li className='flex justify-between items-center w-full gap-10'>
                    <p className='font-semibold text-slate-700'>Children</p>
                    <Input value={val.guests.children} onChange={e => setVal(prev => ({ ...prev, guests: { ...prev.guests, children: Number(e.target.value) } }))}
                        className='font-semibold' type='number' min={0} max={20} />
                </li>
            </ul>
            <Button className='bg-blue-500 text-white w-full py-5' onClick={handleSubmit} size='large'>
                Apply
            </Button>
        </div>
    )
}


export default SearchHotel