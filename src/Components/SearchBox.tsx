'use client'

import React, { useEffect, useState } from 'react'
import Input from './Input'
import Button from '@mui/material/Button'
import Link from 'next/link'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import moment, { Moment } from 'moment'
import Modal from './Modal'
import { FaHotel, FaTrainSubway } from 'react-icons/fa6'
import { MdOutlineFlightTakeoff } from 'react-icons/md'
import { BiSolidBusSchool } from "react-icons/bi";
import { Container } from '@mui/material'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import useWindowDimensions from '@/Hooks/useWindow'
import { usePathname, useRouter } from 'next/navigation'

type tabsTypes = {
    icon: string,
    title: 'Hotels' | 'Flights' | 'Train' | 'Bus'
}

const SearchBox = ({ }) => {
    const { scrollY } = useScroll()
    const { width } = useWindowDimensions()
    const [scrolled, setScrolled] = useState(false)
    const [activeTab, setActiveTab] = useState<tabsTypes['title']>('Hotels')

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest >= 180.8) {
            setScrolled(true)
        } else {
            setScrolled(false)
        }
    })

    const tabs = [
        {
            icon: FaHotel,
            title: 'Hotels',
        },
        {
            icon: MdOutlineFlightTakeoff,
            title: 'Flights',
        },
        {
            icon: FaTrainSubway,
            title: 'Train',
        },
        {
            icon: BiSolidBusSchool,
            title: 'Bus',
        },
    ]

    const isScrolledOnDesktop = (width > 720 && scrolled)

    return (
        <>
            <div className={
                // `lg:sticky lg:-top-[2rem] z-50`
                `${(scrolled ? 'lg:fixed -top-[2rem]' : 'lg:fixed top-[12rem]')} w-full z-50`
            }>
                <Container maxWidth={isScrolledOnDesktop ? 'xl' : 'lg'} className={`relative top-5 lg:top-12 transition-all`}>
                    <div className={`bg-white shadow rounded-xl p-10 w-full flex flex-col gap-5`}>
                        <div className='flex'>
                            {tabs?.map((tab) => (
                                <div key={tab.title} className={`border-r-2 px-5 cursor-pointer w-full md:w-fit`} onClick={() => setActiveTab(tab.title as tabsTypes['title'])}>

                                    <div className={`${activeTab == tab.title ? 'border-[rgba(17,34,17,1)]' : 'border-white'} border-b-2 flex items-center gap-2 pb-2 px-5 justify-center`}>
                                        {tab.icon && <tab.icon size={isScrolledOnDesktop ? 12 : 15} />}
                                        <p className={`hidden md:block text-[rgba(17,34,17,1)] font-bold ${isScrolledOnDesktop ? 'text-xl' : 'text-2xl'} transition-all`}>
                                            {tab.title}
                                        </p>
                                    </div>

                                </div>
                            ))}
                        </div>

                        {activeTab == 'Hotels' && <HotelSearchBox isScrolledOnDesktop={isScrolledOnDesktop} />}
                    </div>
                </Container>
            </div>
            <div className={isScrolledOnDesktop ? 'lg:-mb-[15rem]' : 'lg:-mb-[15rem]'} />
        </>
    )
}

type SearchProps = {
    city: string,
    lat: number,
    lng: number
    checkIn: Moment,
    checkOut: Moment,
    rooms: number,
    guests: {
        adults: number,
        children: number
    }
}

const initialData: SearchProps = {
    city: 'Gurgaon, Haryana, India',
    lat: 28.4594965,
    lng: 77.0266383,
    checkIn: moment(new Date()),
    checkOut: moment(new Date()).add(1, 'day'),
    rooms: 1,
    guests: {
        adults: 2,
        children: 0
    }
}

const HotelSearchBox = ({ isScrolledOnDesktop }: { isScrolledOnDesktop: boolean }) => {
    const pathname = usePathname()
    const router = useRouter()
    const [placeId, setPlaceId] = useState('ChIJWYjjgtUZDTkRHkvG5ehfzwI')
    const [value, setValue] = useState(initialData)
    const [selectRoom, setSelectRoom] = useState(false)

    useEffect(() => {
        if (pathname == '/') {
            const params = new URLSearchParams()
            params.set('placeId', placeId)
            params.set('city', value.city)
            params.set('lat', value.lat.toString())
            params.set('lng', value.lng.toString())
            params.set('checkIn', moment(value.checkIn).format('x'))
            params.set('checkOut', moment(value.checkOut).format('x'))
            params.set('rooms', value.rooms.toString())
            params.set('adults', value.guests.adults.toString())
            params.set('childrens', value.guests.children.toString())

            router.replace(`?${params.toString()}`)

        }
    }, [value, placeId, pathname])

    console.log(moment(value.checkOut).diff(value.checkIn, 'days'))

    return (
        <div className={`flex ${isScrolledOnDesktop ? 'flex-row items-center' : 'flex-col'} w-full gap-5 items-end transition-all`}>
            <div className='flex flex-col md:flex-row gap-5 items-center w-full'>
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
                                            console.log(results?.[0])

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
                                control: () => 'py-[0.5rem] mt-1'
                            }
                        }}
                        // apiOptions={{
                        //     id: 'GoogleMaps',
                        //     apiKey: 'AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U'
                        // }}
                        apiKey="AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U"

                    />
                </div>

                <Input
                    placeholder="CHECK-IN"
                    type='date'
                    className='bg-transparent h-20'
                    value={moment(value.checkIn).format('YYYY-MM-DD')}
                    onChange={(e) => {
                        setValue(prev => ({ ...prev, checkIn: moment(e.target.value), checkOut: moment(value.checkOut) > moment(e.target.value) ? moment(value.checkOut) : moment(e.target.value).add(1, 'days') }))
                    }}
                />

                <Input
                    placeholder="CHECK-OUT"
                    type='date'
                    className='bg-transparent h-20'
                    min={moment(value.checkIn).add(1, 'days').format('YYYY-MM-DD')}
                    value={moment(value.checkOut).format('YYYY-MM-DD')}
                    onChange={e => setValue(prev => ({ ...prev, checkOut: moment(e.target.value) }))}
                />

                <div className='flex flex-col w-full h-20'>
                    <button type='button' className='border-2 border-slate-400 px-5 rounded-md h-full' onClick={() => setSelectRoom(true)}>
                        <p>{value.rooms} {value.guests.adults > 1 ? 'Rooms' : 'Room'}, {value.guests.adults} {value.guests.adults > 1 ? 'Adults' : 'Adult'}{value.guests.children > 0 && `, ${value.guests.children} `} {value.guests.children > 0 && (value.guests.children > 1 ? 'Childrens' : 'Children')}</p>
                    </button>
                </div>
            </div>

            <Link href={{
                pathname: '/Hotels',
                query: {
                    placeId: placeId,
                    city: value.city,
                    lat: value.lat,
                    lng: value.lng,
                    checkIn: moment(value.checkIn).format('x'),
                    checkOut: moment(value.checkOut).format('x'),
                    rooms: value.rooms,
                    adults: value.guests.adults,
                    childrens: value.guests.children
                }
            }} passHref legacyBehavior>
                <Button className={'bg-red-500 text-white text-nowrap'} size='large'>
                    Find Hotels</Button>
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
                        className='font-semibold' type='number' min={val.rooms} max={val.rooms * 2} />
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

export default SearchBox