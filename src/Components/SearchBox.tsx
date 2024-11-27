'use client'

import React, { useState } from 'react'
import Input from './Input'
import { Button } from '@mui/material'
import Link from 'next/link'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import moment, { Moment } from 'moment'
import Modal from './Modal'

type tabsTypes = {
    icon: string,
    title: 'Hotels' | 'Flights' | 'Train' | 'Bus'
}

const SearchBox = ({ }) => {
    const [activeTab, setActiveTab] = useState<tabsTypes['title']>('Hotels')

    const tabs = [
        {
            icon: '',
            title: 'Hotels',
        },
        {
            icon: '',
            title: 'Flights',
        },
        {
            icon: '',
            title: 'Train',
        },
        {
            icon: '',
            title: 'Bus',
        },
    ]

    return (
        <div className='bg-white shadow rounded-xl p-10 w-full flex flex-col gap-5'>
            <div className='flex'>
                {tabs?.map((tab) => (
                    <div key={tab.title} className='border-r-2 px-10 cursor-pointer' onClick={() => setActiveTab(tab.title as tabsTypes['title'])}>
                        <div className={`${activeTab == tab.title ? 'border-[rgba(17,34,17,1)]' : 'border-white'} border-b-2 text-[rgba(17,34,17,1)] font-bold`}>
                            {tab.title}
                        </div>
                    </div>
                ))}
            </div>

            {activeTab == 'Hotels' && <HotelSearchBox />}
        </div>
    )
}

type SearchProps = {
    city: string,
    checkIn: Moment,
    checkOut: Moment,
    rooms: number,
    guests: {
        adults: number,
        children: number
    }
}

const initialData: SearchProps = {
    city: 'Goa, India',
    checkIn: moment(new Date()),
    checkOut: moment(new Date()),
    rooms: 1,
    guests: {
        adults: 2,
        children: 0
    }
}

const HotelSearchBox = ({ }) => {
    const [placeId, setPlaceId] = useState('ChIJQbc2YxC6vzsRkkDzYv-H-Oo')
    const [value, setValue] = useState(initialData)
    const [selectRoom, setSelectRoom] = useState(false)

    return (
        <div className='flex flex-col w-full gap-5 items-end'>
            <div className='flex gap-5 items-center w-full'>
                {/* <Input placeholder='Goa, India' /> */}
                <div className='w-full'>
                    <GooglePlacesAutocomplete
                        selectProps={{
                            defaultValue: { label: value.city, value: value.city },
                            value: { label: value.city, value: value.city },
                            onChange: (e) => {
                                setValue(prev => ({ ...prev, city: e?.value?.description }))
                                setPlaceId(e?.value?.place_id)
                            },
                            classNames: {
                                control: () => 'py-[0.7rem] mt-1'
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
                    className='bg-transparent'
                    value={moment(value.checkIn).format('YYYY-MM-DD')}
                    onChange={(e) => {
                        setValue(prev => ({ ...prev, checkIn: moment(e.target.value), checkOut: moment(value.checkOut) > moment(e.target.value) ? moment(value.checkOut) : moment(e.target.value) }))
                    }}
                />

                <Input
                    placeholder="CHECK-OUT"
                    type='date'
                    className='bg-transparent'
                    min={moment(value.checkIn).format('YYYY-MM-DD')}
                    value={moment(value.checkOut).format('YYYY-MM-DD')}
                    onChange={e => setValue(prev => ({ ...prev, checkOut: moment(e.target.value) }))}
                />

                <div className='flex flex-col w-full'>
                    <button type='button' className='border-2 border-slate-400 px-5 rounded-md h-20' onClick={() => setSelectRoom(true)}>
                        <p>{value.rooms} {value.guests.adults > 1 ? 'Rooms' : 'Room'}, {value.guests.adults} {value.guests.adults > 1 ? 'Adults' : 'Adult'}{value.guests.children > 0 && `, ${value.guests.children}`} {value.guests.children > 0 && (value.guests.children > 1 ? 'Childrens' : 'Children')}</p>
                    </button>
                </div>
            </div>

            <Link href={{
                pathname: '/Hotels',
                query: {
                    placeId: placeId,
                    city: value.city,
                    checkIn: moment(value.checkIn).valueOf(),
                    checkOut: moment(value.checkOut).valueOf(),
                    rooms: value.rooms,
                    adults: value.guests.adults,
                    childrens: value.guests.children
                }
            }}>
                <Button className='bg-red-500 text-white' size='large'>Find Hotels</Button>
            </Link>

            <Modal open={selectRoom} setOpen={setSelectRoom} className='w-96'>
                <SelectRooms value={value} setValue={setValue} setSelectRoom={setSelectRoom} />
            </Modal>
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
                        className='font-semibold' type='number' min={val.rooms} max={40} />
                </li>

                <li className='flex justify-between items-center w-full gap-10'>
                    <p className='font-semibold text-slate-700'>Children</p>
                    <Input value={val.guests.children} onChange={e => setVal(prev => ({ ...prev, guests: { ...prev.guests, children: Number(e.target.value) } }))}
                        className='font-semibold' type='number' min={0} max={40} />
                </li>
            </ul>
            <Button className='bg-blue-500 text-white w-full py-5' onClick={handleSubmit} size='large'>
                Apply
            </Button>
        </div>
    )
}

export default SearchBox