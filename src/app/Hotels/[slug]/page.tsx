import BookRoom from '@/Components/BookRoom';
import Footer from '@/Components/Footer';
import Header from '@/Components/Header'
import { HotelTypes } from '@/Types/Hotels';
import { RoomVarietyTypes } from '@/Types/Rooms';
import { Container } from '@mui/material';
import { Params } from 'next/dist/server/request/params';
import { SearchParams } from 'next/dist/server/request/search-params';
import Image from 'next/image';
import React from 'react'
import { FaStar } from 'react-icons/fa6';
import { IoLocationSharp } from "react-icons/io5";
import client from "@/Lib/mongo";
import { Collection, ObjectId } from 'mongodb';
import Description from '@/Components/Description';
import Expandable from '@/Components/Expandable';
import { getRooms } from '@/server/db';
import HotelPhotos from '@/Components/HotelPhotos';
import dayjs from 'dayjs';
import SliderImage from '../SliderImage';

type Props = {
    params: Promise<Params>,
    searchParams: Promise<SearchParams>
}

const Hotel = async ({ params, searchParams }: Props) => {
    const hotelColl: Collection<HotelTypes> = client.collection('Hotels')
    const slug = await params
    const query = await searchParams

    const item = await hotelColl.findOne({
        _id: ObjectId.createFromHexString(slug?.slug as string)
    })

    const rooms = query?.rooms ? Number(query?.rooms) : 0
    const adults = query?.adults ? Number(query?.adults) : 0
    const childrens = query?.childrens ? Number(query?.childrens) : 0
    const checkIn = query?.checkIn && Number(query.checkIn)
    const checkOut = query?.checkOut && Number(query.checkOut)
    const totalDays = (checkIn && checkOut) ? dayjs(checkOut).diff(checkIn, 'days') : 0

    if (!item) {
        return (<></>)
    }


    return (
        <>
            <Header />
            <div className='bg-[rgb(244,244,244,1)]'>

                <div className='bg-gradient-to-t from-white to-[rgb(244,244,244,1)]'>
                    <Container className='py-10'>
                        <div className='flex flex-col lg:flex-row gap-5'>
                            <div className='relative w-[100%] aspect-video max-w-full'>
                                <Image src={item.photos?.[0]} alt='' fill className='object-' quality={100} />
                            </div>
                            <HotelPhotos photos={item.photos} />
                            {/* {item?.photos?.length > 1 &&
                                <div className='flex flex-row lg:flex-col gap-5 w-full lg:w-[49%]'>
                                    <div className='relative w-[100%] aspect-video max-w-full'>
                                        <Image src={item.photos?.[1]} alt='' fill />
                                    </div>
                                    <div className='relative w-[100%] aspect-video max-w-full'>
                                        <Image src={item.photos?.[2]} alt='' fill />
                                    </div>
                                </div>} */}
                        </div>
                    </Container>
                </div>

                <Container className='flex flex-col py-10 gap-5'>

                    <div className='flex flex-col lg:flex-row gap-10 justify-between w-full'>
                        <div className='flex flex-col lg:ml-5 lg:flex-[.6] gap-5'>
                            <h1 className='text-3xl lg:text-6xl font-semibold'>{item?.name}</h1>
                            <div className='flex gap-2 items-center'>
                                {Array(5).fill(2)?.map((star, i) => (
                                    <FaStar key={i} color="orange" />
                                ))}
                                <p className='text-slate-700 text-xl mt-1'>4.5 (1200 Reviews)</p>
                            </div>
                            <div className='text-slate-800 flex gap-1 items-center'>
                                <IoLocationSharp /> {item?.address?.City}
                            </div>
                            <h2 className='font-semibold'>Overview</h2>
                            <Description text={item.desc} className='w-full' />
                        </div>

                        <div className='flex flex-col flex-[.3] gap-5'>
                            <div className='shadow bg-white p-10 flex flex-col gap-4'>
                                <p className='font-semibold'>Your booking details</p>
                                <div className='flex'>
                                    <div className='pr-10 border-r-2'>
                                        <p className='text-lg'>Check-in</p>
                                        <p className='text-xl font-semibold'>
                                            {checkIn && dayjs(checkIn)?.format('ddd, Do MMM YYYY')}
                                        </p>
                                    </div>
                                    <div className='pl-10'>
                                        <p className='text-lg'>Check-out</p>
                                        <p className='text-xl font-semibold'>
                                            {checkOut && dayjs(checkOut)?.format('ddd, Do MMM YYYY')}
                                        </p>
                                    </div>
                                </div>
                                <p className='text-lg'>
                                    {totalDays} day{totalDays > 1 && 's'}, {rooms} room{rooms > 1 && 's'}, {adults} adult{adults > 1 && 's'} {childrens > 0 && `, ${childrens} children${childrens > 1 && 's'}`}
                                </p>
                            </div>
                        </div>
                    </div>

                    {item?.amenities?.length > 0 &&
                        <>
                            <h2 className='text-4xl font-semibold'>Amenities</h2>
                            <Expandable>
                                <div className='flex flex-wrap gap-10'>
                                    {item?.amenities?.map((am) => (
                                        <div key={am} className='bg-white px-10 py-4 text-lg rounded-lg'>
                                            {am}
                                        </div>
                                    ))}
                                </div>
                            </Expandable>
                        </>}


                    {item?.rooms && item?.rooms?.length > 0 && (
                        <div className='mt-10'>
                            <h2 className='text-4xl font-semibold mb-5'>Rooms</h2>
                            <div className='flex flex-col gap-10' id='rooms'>
                                {item?.rooms?.map((room) => {
                                    return (
                                        <Rooms key={room.id} hotelData={item} room={room} />
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </Container>
            </div>
            <Footer />
        </>
    )
}

const Rooms = async ({ hotelData, room }: { hotelData: HotelTypes, room: RoomVarietyTypes }) => {
    console.log(room)
    const { totalSize, bookingSize } = await getRooms({ type: room.type, hotelId: hotelData._id as ObjectId })

    if (totalSize.length == 0) {
        return (<></>)
    }

    return (
        <div key={room.type} className='border flex flex-col md:flex-row shadow-lg bg-white overflow-hidden rounded-lg'>
            <div className='rounded-xl'>
                {/* <Image src={room?.photos?.[0]} alt='' fill objectFit='cover' /> */}
                <SliderImage photos={room?.photos} loop autoplay/>
            </div>


            <div className='flex flex-col lg:flex-row p-10 flex-1 justify-between'>
                <div className='flex flex-col flex-1 gap-3'>
                    <p className='font-bold text-3xl'>{room?.type}</p>
                    <p className='text-lg'>Radisson Collection is a unique collection of iconic properties. While the character of each hotel feels authentic to its locality, all offer the ultimate template for contemporary living; united by bespoke design and exceptional experiences across dining, fitness, wellness and sustainability.</p>
                    <ul className='flex gap-x-3'>
                        {room?.amenities?.slice(0, 3)?.map((amenity) => (
                            <li key={amenity} className='text-[1rem] text-slate-600 shadow bg-white px-4 py-1'>{amenity}</li>
                        ))}
                    </ul>
                </div>
                <div className='flex flex-col-reverse lg:flex-col flex-1 gap-5 md:gap-0 lg:items-end justify-between mt-10 lg:mt-0'>
                    <div>
                        {totalSize[0]?.TotalSize == bookingSize?.[0]?.BookingSize ?
                            <div>
                                {/* <p className='text-3xl text-red-500 font-semibold'>Sold Out</p> */}
                                <Image src='/Images/soldout.png' alt=''
                                    width={0}
                                    height={0}
                                    sizes='100vw'
                                    className='w-28'
                                />
                            </div>
                            : <BookRoom hotelId={JSON.parse(JSON.stringify(hotelData))?._id as string} />}
                    </div>
                    <div className='flex flex-col lg:items-end'>
                        <p className='text-4xl font-bold text-green-400'>&#8377;{room?.price}</p>
                        <p className='text-xl'>Included taxes & fees</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Hotel