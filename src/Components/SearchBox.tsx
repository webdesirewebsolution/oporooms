'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import Modal from './Modal'
import { FaHotel, FaPlus, FaTrainSubway } from 'react-icons/fa6'
import { MdOutlineFlightTakeoff } from 'react-icons/md'
import { BiSolidBusSchool } from "react-icons/bi";
import { Container } from '@mui/material'
import { useMotionValueEvent, useScroll } from 'framer-motion'
import useWindowDimensions from '@/Hooks/useWindow'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FaMinus } from 'react-icons/fa'
import dayjs, { Dayjs } from 'dayjs'
import Button from './Buttons'
import IconButton from './IconButton'
import { newDate } from '@/Functions'
import Script from 'next/script'

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
                <Container maxWidth={isScrolledOnDesktop ? 'xl' : 'lg'} className={`relative top-5 lg:top-12 transition-all flex items-center justify-center`}>
                    <div className={`bg-white shadow rounded-xl p-8 w-fit flex flex-col gap-5`}>
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

                        <div className={`flex ${isScrolledOnDesktop ? 'flex-row items-center' : 'flex-col'} md:w-fit gap-5 items-end transition-all`}>
                            {activeTab == 'Hotels' && <HotelSearchBox />}
                            {activeTab == 'Flights' && <FlightSearchBox />}
                        </div>
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
    checkIn: Dayjs,
    checkOut: Dayjs,
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
    checkIn: dayjs(newDate(new Date())),
    checkOut: dayjs(newDate(new Date())).add(1, 'day'),
    rooms: 1,
    guests: {
        adults: 2,
        children: 0
    }
}

const HotelSearchBox = () => {
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
            params.set('checkIn', dayjs(value.checkIn).format('x'))
            params.set('checkOut', dayjs(value.checkOut).format('x'))
            params.set('rooms', value.rooms.toString())
            params.set('adults', value.guests.adults.toString())
            params.set('childrens', value.guests.children.toString())

            router.replace(`?${params.toString()}`)

        }
    }, [value, placeId, pathname, router])


    return (
        <>
            <div className='flex flex-col md:flex-row md:items-center w-full md:border-2 rounded-xl gap-4 md:gap-0 md:h-20'>
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
                                control: () => 'md:border-0'
                            }
                        }}
                        // apiOptions={{
                        //     id: 'GoogleMaps',
                        //     apiKey: 'AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U'
                        // }}
                        apiKey="AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U"

                    />
                </div>

                <div className='flex gap-3 md:gap-0'>
                    <input
                        placeholder="CHECK-IN"
                        type='date'
                        min={dayjs(newDate(new Date())).format('YYYY-MM-DD')}
                        className='bg-transparent md:h-full p-3 md:p-0 border-y-2 md:border-y-0 border-l-2 md:border-l-0 border-x-2 md:px-10'
                        value={dayjs(value.checkIn).format('YYYY-MM-DD')}
                        onChange={(e) => {
                            setValue(prev => ({ ...prev, checkIn: dayjs(e.target.value), checkOut: dayjs(value.checkOut) > dayjs(e.target.value) ? dayjs(value.checkOut) : dayjs(e.target.value).add(1, 'day') }))
                        }}
                    />

                    <input
                        placeholder="CHECK-OUT"
                        type='date'
                        className='bg-transparent md:h-full p-3 md:p-0 border-y-2 md:border-y-0 border-l-2 md:border-l-0 border-x-2 md:px-10'
                        min={dayjs(value.checkIn).add(1, 'day').format('YYYY-MM-DD')}
                        value={dayjs(value.checkOut).format('YYYY-MM-DD')}
                        onChange={e => setValue(prev => ({ ...prev, checkOut: dayjs(e.target.value) }))}
                    />
                </div>

                <button type='button' className='px-10 rounded-md h-full text-nowrap border-2 md:border-none py-4 md:py-0' onClick={() => setSelectRoom(true)}>
                    <p>{value.rooms} {value.guests.adults > 1 ? 'Rooms' : 'Room'}, {value.guests.adults} {value.guests.adults > 1 ? 'Adults' : 'Adult'}{value.guests.children > 0 && `, ${value.guests.children} `} {value.guests.children > 0 && (value.guests.children > 1 ? 'Childrens' : 'Children')}</p>
                </button>

                <Link href={{
                    pathname: '/Hotels',
                    query: {
                        placeId: placeId,
                        city: value.city,
                        lat: value.lat,
                        lng: value.lng,
                        checkIn: dayjs(value.checkIn).valueOf(),
                        checkOut: dayjs(value.checkOut).valueOf(),
                        rooms: value.rooms,
                        adults: value.guests.adults,
                        childrens: value.guests.children
                    }
                }} passHref legacyBehavior className='h-full'>
                    <Button className={'bg-red-500 text-white text-nowrap md:h-full rounded-xl md:rounded-l-none'} size='large'>
                        Find Hotels</Button>
                </Link>
            </div>


            <Modal open={selectRoom} setOpen={setSelectRoom} className='w-96'>
                <SelectRooms value={value} setValue={setValue} setSelectRoom={setSelectRoom} />
            </Modal>
        </>
    )
}

type SelectRoomsProps = {
    value: SearchProps,
    setValue: React.Dispatch<React.SetStateAction<SearchProps>>,
    setSelectRoom: React.Dispatch<React.SetStateAction<boolean>>
}

const SelectRooms = ({ value, setValue, setSelectRoom }: SelectRoomsProps) => {
    const [val, setVal] = useState({
        rooms: value?.rooms || 1,
        guests: value?.guests || {
            adults: 2,
            children: 0
        }
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
                    <div className='flex items-center gap-5'>
                        <IconButton
                            disabled={val.rooms <= 1}
                            onClick={() => {
                                setVal(prev => ({ ...prev, rooms: Number(prev.rooms) - 1, guests: { ...prev.guests, adults: Number(val.guests.adults) > Number(prev.rooms) ? Number(val.guests.adults) : Number(prev.rooms) - 1 } }))
                            }} className={`${val.rooms <= 1 ? '!bg-blue-300' : '!bg-blue-500'} !text-white`}>
                            <FaMinus size={10} />
                        </IconButton>
                        <span>{val.rooms}</span>
                        <IconButton
                            disabled={val.rooms >= 40}
                            onClick={() => {
                                setVal(prev => ({ ...prev, rooms: Number(prev.rooms) + 1, guests: { ...prev.guests, adults: Number(val.guests.adults) > Number(prev.rooms) ? Number(val.guests.adults) : Number(prev.rooms) + 1 } }))
                            }} className={`${val.rooms >= 40 ? 'bg-blue-300' : 'bg-blue-500'} text-white`}>
                            <FaPlus size={10} />
                        </IconButton>
                    </div>
                    {/* <Input value={val.rooms} onChange={e => {
                        setVal(prev => ({ ...prev, rooms: Number(e.target.value), guests: { ...prev.guests, adults: Number(val.guests.adults) > Number(e.target.value) ? Number(val.guests.adults) : Number(e.target.value) } }))
                    }}
                        className='font-semibold' type='number' min={1} max={20} /> */}
                </li>

                <li className='flex justify-between items-center w-full gap-10'>
                    <p className='font-semibold text-slate-700'>Adults</p>
                    <div className='flex items-center gap-5'>
                        <IconButton
                            disabled={val.guests.adults <= 1}
                            onClick={() => {
                                setVal(prev => ({ ...prev, rooms: val.rooms < val.guests.adults ? val.rooms : val.rooms - 1, guests: { ...prev.guests, adults: Number(val.guests.adults) - 1 } }))
                            }} className={`${val.guests.adults <= 1 ? 'bg-blue-300' : 'bg-blue-500'} text-white`}>
                            <FaMinus size={10} />
                        </IconButton>

                        <span>{val.guests.adults}</span>

                        <IconButton
                            disabled={val.guests.adults >= 40 || val.guests.adults >= val.rooms * 2}
                            onClick={() => {
                                setVal(prev => ({ ...prev, guests: { ...prev.guests, adults: Number(val.guests.adults) + 1 } }))
                            }} className={`${(val.guests.adults >= 40 || val.guests.adults >= val.rooms * 2) ? 'bg-blue-300' : 'bg-blue-500'} text-white`}>
                            <FaPlus size={10} />
                        </IconButton>
                    </div>

                    {/* <Input value={val.guests.adults} onChange={e => setVal(prev => ({ ...prev, guests: { ...prev.guests, adults: Number(e.target.value) } }))}
                        className='font-semibold' type='number' min={val.rooms} max={val.rooms * 2} /> */}
                </li>

                <li className='flex justify-between items-center w-full gap-10'>
                    <p className='font-semibold text-slate-700'>Children</p>
                    <div className='flex items-center gap-5'>
                        <IconButton
                            disabled={val.guests.children < 1}
                            onClick={() => {
                                setVal(prev => ({ ...prev, guests: { ...prev.guests, children: Number(val.guests.children) - 1 } }))
                            }} className={`${val.guests.children < 1 ? 'bg-blue-300' : 'bg-blue-500'} text-white`}>
                            <FaMinus size={10} />
                        </IconButton>

                        <span>{val.guests.children}</span>

                        <IconButton
                            disabled={val.guests.children >= val.guests.adults}
                            onClick={() => {
                                setVal(prev => ({ ...prev, guests: { ...prev.guests, children: Number(val.guests.children) + 1 } }))
                            }} className={`${(val.guests.children >= val.guests.adults) ? 'bg-blue-300' : 'bg-blue-500'} text-white`}>
                            <FaPlus size={10} />
                        </IconButton>
                    </div>

                    {/* <Input value={val.guests.children} onChange={e => setVal(prev => ({ ...prev, guests: { ...prev.guests, children: Number(e.target.value) } }))}
                        className='font-semibold' type='number' min={0} max={20} /> */}
                </li>
            </ul>
            <Button className='bg-blue-500 text-white w-full py-5' onClick={handleSubmit} size='large'>
                Apply
            </Button>
        </div>
    )
}

type FlightSearchProps = {
    departureCity: string,
    arrivalCity: string,
    departureLat: number,
    departureLng: number
    departureDate: Dayjs,
    returnDate: Dayjs,
    rooms: number,
    passengers: {
        adults: number,
        children: number
    }
}


export const FlightSearchBox = () => {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {

            // const script = document.createElement("script");
            // script.src = "https://tp.media/content?currency=inr&trs=377316&shmarker=596056&show_hotels=false&powered_by=true&locale=en&searchUrl=www.aviasales.com%2Fsearch&primary_override=%23ee292c&color_button=%23ee292c&color_icons=%23ee292c&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%23ee292c&border_radius=10&no_labels=&plain=true&promo_id=7879&campaign_id=100";
            // script.async = true;
            // document.body.appendChild(script);

            console.log({ w: window })

            // return () => {
            //     document.body.removeChild(script);
            // };
        }
    }, []);

    const initialFlightData: FlightSearchProps = {
        departureCity: searchParams.get('from')?.split("%20").join(' ') ? searchParams.get('from') as string : 'Gurgaon, Haryana, India',
        arrivalCity: searchParams.get('to')?.split("%20").join(' ') ? searchParams.get('to') as string : 'Gurgaon, Haryana, India',
        departureLat: 28.4594965,
        departureLng: 77.0266383,
        departureDate: dayjs(newDate(new Date())),
        returnDate: dayjs(newDate(new Date())).add(1, 'day'),
        rooms: 1,
        passengers: {
            adults: 2,
            children: 0
        }
    }
    const [departurePlaceId, setDeparturePlaceId] = useState('ChIJWYjjgtUZDTkRHkvG5ehfzwI')
    const [arrivalPlaceId, setArrivalPlaceId] = useState('ChIJWYjjgtUZDTkRHkvG5ehfzwI')
    const [value, setValue] = useState(initialFlightData)
    const [passengersModal, setPassengersModal] = useState(false)


    return (
        <div className='w-full'>
            <script async defer id='Travel' src='https://tp.media/content?currency=inr&trs=377316&shmarker=596056&show_hotels=false&powered_by=true&locale=en&searchUrl=www.aviasales.com%2Fsearch&primary_override=%23ee292c&color_button=%23ee292c&color_icons=%23ee292c&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%23ee292c&border_radius=10&no_labels=&plain=true&promo_id=7879&campaign_id=100'></script>

            {/* <div id="Travel">
                <p>Loading travel deals...</p>
            </div> */}

            <div className='flex flex-col md:flex-row md:items-center w-full md:border-2 rounded-xl gap-4 md:gap-0 md:h-32 relative bg-white p-5 md:p-0'>
                <div className='w-full md:h-full flex flex-col justify-center md:border-r-2 relative'>
                    <label className='text-lg md:absolute top-2 ml-2 text-slate-600'>From</label>
                    <GooglePlacesAutocomplete
                        selectProps={{
                            defaultValue: { label: value.departureCity, value: value.departureCity },
                            value: { label: value.departureCity, value: value.departureCity },
                            onChange: (e) => {
                                if (typeof window !== 'undefined') {
                                    const geocoder = new google.maps.Geocoder();

                                    geocoder.geocode({ 'placeId': e?.value?.place_id }, (results, status) => {
                                        if (status === google.maps.GeocoderStatus.OK) {
                                            const location = results?.[0]?.geometry?.location?.toJSON();

                                            setValue(prev => ({
                                                ...prev,
                                                departureLat: location?.lat as number,
                                                departureLng: location?.lng as number,
                                                departureCity: e?.value?.description,
                                            }));
                                        }
                                    });
                                }

                                setDeparturePlaceId(e?.value?.place_id);
                            },
                            classNames: {
                                control: () => 'md:border-0'
                            }
                        }}
                        apiKey="AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U"
                    />
                </div>

                <div className='w-full md:h-full flex flex-col justify-center md:border-r-2 relative'>
                    <label className='text-lg md:absolute top-2 ml-2 text-slate-600'>To</label>
                    <GooglePlacesAutocomplete
                        selectProps={{
                            defaultValue: { label: value.arrivalCity, value: value.arrivalCity },
                            value: { label: value.arrivalCity, value: value.arrivalCity },
                            onChange: (e) => {
                                if (typeof window !== 'undefined') {
                                    const geocoder = new google.maps.Geocoder();

                                    geocoder.geocode({ 'placeId': e?.value?.place_id }, (results, status) => {
                                        if (status === google.maps.GeocoderStatus.OK) {
                                            const location = results?.[0]?.geometry?.location?.toJSON();

                                            setValue(prev => ({
                                                ...prev,
                                                arrivalLat: location?.lat as number,
                                                arrivalLng: location?.lng as number,
                                                arrivalCity: e?.value?.description,
                                            }));
                                        }
                                    });
                                }

                                setArrivalPlaceId(e?.value?.place_id);
                            },
                            classNames: {
                                control: () => 'md:border-0'
                            }
                        }}
                        apiKey="AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U"
                    />
                </div>

                <div className='flex flex-col relative h-full'>
                    <label className='text-lg md:absolute top-2 ml-2 text-slate-600'>Departure</label>
                    <input
                        placeholder="DEPARTURE DATE"
                        type='date'
                        min={dayjs(newDate(new Date())).format('YYYY-MM-DD')}
                        className='bg-transparent md:h-full p-3 md:p-0 border-y-2 md:border-y-0 border-l-2 md:border-l-0 border-x-2 md:px-10'
                        value={dayjs(value.departureDate).format('YYYY-MM-DD')}
                        onChange={(e) => {
                            setValue(prev => ({ ...prev, departureDate: dayjs(e.target.value) }));
                        }}
                    />
                </div>

                <div className='flex flex-col relative h-full'>
                    <label className='text-lg md:absolute top-2 ml-2 text-slate-600'>Return</label>
                    <input
                        placeholder="RETURN DATE"
                        type='date'
                        className='bg-transparent md:h-full p-3 md:p-0 border-y-2 md:border-y-0 border-l-2 md:border-l-0 border-x-2 md:px-10'
                        min={dayjs(value.departureDate).add(1, 'day').format('YYYY-MM-DD')}
                        value={dayjs(value.returnDate).format('YYYY-MM-DD')}
                        onChange={(e) => setValue(prev => ({ ...prev, returnDate: dayjs(e.target.value) }))}
                    />
                </div>

                <button
                    type='button'
                    className='px-10 rounded-md h-full text-nowrap border-2 md:border-none py-4 md:py-0'
                    onClick={() => setPassengersModal(true)}
                >
                    <p>{value.passengers.adults} {value.passengers.adults > 1 ? 'Adults' : 'Adult'}, {value.passengers.children > 0 && `${value.passengers.children} `}{value.passengers.children > 0 && (value.passengers.children > 1 ? 'Children' : 'Child')}</p>
                </button>

                <Link href={{
                    pathname: '/Flights',
                    query: {
                        from: value.departureCity,
                        to: value.arrivalCity,
                        fromDate: dayjs(value.departureDate).valueOf(),
                        toDate: dayjs(value.returnDate).valueOf(),
                        adults: value.passengers.adults,
                        children: value.passengers.children
                    }
                }} passHref legacyBehavior className='h-full'>
                    <Button className={'bg-blue-500 text-white text-nowrap md:h-full rounded-xl md:rounded-l-none py-5'} size='large'>
                        Find Flights</Button>
                </Link>
            </div>

        </div>
    )
}

export default SearchBox