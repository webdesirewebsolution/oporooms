import BookRoom from '@/Components/BookRoom';
import Footer from '@/Components/Footer';
import Header from '@/Components/Header'
import { HotelTypes } from '@/Types/Hotels';
import { Container } from '@mui/material';
import axios from 'axios'
import { Params } from 'next/dist/server/request/params';
import Image from 'next/image';
import React from 'react'
import { FaStar } from 'react-icons/fa6';
import { IoLocationSharp } from "react-icons/io5";

type Props = {
    params: Promise<Params>,
}

const Hotel = async ({ params }: Props) => {
    const slug = await params
    const data = slug?.slug ? await axios.get(`${process.env.SERVERURL}/api/Hotels?_id=${slug?.slug}`) : { status: 0, data: [] }

    if (data.status == 200) {
        const item: HotelTypes = data?.data?.list?.[0]
        return (
            <>
                <Header />
                <div className='bg-[rgb(244,244,244,1)]'>

                    <div className='bg-gradient-to-t from-white to-[rgb(244,244,244,1)]'>
                        <Container className='py-10'>
                            <div className='flex flex-col lg:flex-row gap-5'>
                                <div className='relative w-[100%] aspect-video max-w-full'>
                                    <Image src={item.photos?.[0]} alt='' fill />
                                </div>
                                {item?.photos?.length > 0 &&
                                    <div className='flex flex-row lg:flex-col gap-5 w-full lg:w-[49%]'>
                                        <div className='relative w-[100%] aspect-video max-w-full'>
                                            <Image src={item.photos?.[0]} alt='' fill />
                                        </div>
                                        <div className='relative w-[100%] aspect-video max-w-full'>
                                            <Image src={item.photos?.[0]} alt='' fill />
                                        </div>
                                    </div>}
                            </div>
                        </Container>
                    </div>

                    <Container className='flex flex-col py-10 gap-5'>
                        <h1 className='text-3xl lg:text-6xl font-semibold'>{item?.name}</h1>
                        <div className='flex gap-2 items-center'>
                            {Array(5).fill(2)?.map((star, i) => (
                                <FaStar key={i} color="orange" />
                            ))}
                            <p className='text-slate-700 text-xl mt-1'>4.5 (1200 Reviews)</p>
                        </div>
                        <div className='text-slate-800 flex gap-1 items-center'><IoLocationSharp /> {item?.address?.City || 'Goa, India'}</div>

                        <div className='flex flex-col lg:flex-row gap-10 justify-between w-full my-10'>
                            <div className='flex flex-col lg:ml-5 lg:flex-[.6] gap-5'>
                                <h2 className='font-semibold'>Overview</h2>
                                <p>Radisson Collection is a unique collection of iconic properties. While the character of each hotel feels authentic to its locality, all offer the ultimate template for contemporary living; united by bespoke design and exceptional experiences across dining, fitness, wellness and sustainability.

                                    Radisson Collection is a unique collection of iconic properties. While the character of each hotel feels authentic to its locality, all offer the ultimate template for contemporary living; united by bespoke design and exceptional experiences across dining, fitness, wellness and sustainability.
                                </p>
                            </div>

                            <div className='flex flex-col flex-[.3] gap-5'>
                                <h2 className='font-semibold'>Top Facilities</h2>
                                <ul className='grid grid-cols-2 gap-5'>
                                    {item?.amenities?.map((am) => (
                                        <li key={am} className='text-slate-700'>
                                            {am}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>


                        {item?.rooms?.length > 0 && <Rooms hotelData={item} item={item?.rooms} />}
                    </Container>
                </div>
                <Footer />
            </>
        )
    }
}

const Rooms = ({ hotelData, item }: { hotelData: HotelTypes, item: HotelTypes['rooms'] }) => {
    return (
        <div className='flex flex-col gap-10 scroll-mt-10' id='rooms'>
            {item?.map((room) => {
                return (
                    <div key={room.type} className='border flex flex-col md:flex-row shadow-lg bg-white'>
                        <div className='flex flex-col gap-5 p-10'>
                            <div className='w-full lg:w-[35rem] aspect-video max-w-full relative rounded-xl'>
                                <Image src={room?.photos?.[0]} alt='' fill objectFit='cover' />
                            </div>
                            <p className='text-2xl font-semibold'>{room.type}</p>
                            <ul className='grid grid-cols-2 list-disc list-inside gap-x-10'>
                                {room?.amenities?.map((amenity) => (
                                    <li key={amenity} className='text-xl text-slate-600'>{amenity}</li>
                                ))}
                            </ul>
                        </div>

                        <div className='flex flex-col flex-1 border-t sm:border-l sm:border-t-0'>

                            <div className='flex flex-col sm:flex-row p-10 flex-1 justify-between'>
                                <div className='flex flex-col flex-1'>
                                    <p className='font-bold text-3xl'>Room Only</p>
                                </div>
                                <div className='flex flex-col flex-1 gap-2'>
                                    <p className='text-4xl font-bold'>Rs.{room?.price}</p>
                                    <p className='text-xl mb-10'>+ Rs.{room?.fee} taxes & fees</p>
                                    <BookRoom hotelData={hotelData} roomData={room} />
                                </div>
                            </div>

                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Hotel