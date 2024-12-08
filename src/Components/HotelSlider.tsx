'use client'

import { HotelTypes } from '@/Types/Hotels'
import { Button } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { CiImageOff } from 'react-icons/ci'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules';

type Props = {
    list: HotelTypes[],
    params: string
}

const HotelSlider = ({ list, params }: Props) => {
    return (
        <Swiper slidesPerView={3}
            loop
            autoplay
            // speed={5000}
            modules={[Autoplay]} 
            spaceBetween={20} 
            className='w-full'>
            {list?.map((item, i) => (
                <SwiperSlide key={i} className='h-full'>
                    <div className='w-full flex flex-col gap-3 shadow-lg rounded-xl overflow-hidden bg-white'>
                        <div className='w-full aspect-video relative'>
                            {item.photos?.[0] ? <Image src={item.photos?.[0]} alt='' objectFit='cover' fill /> : (
                                <div className='w-full aspect-video flex items-center justify-center bg-slate-300'>
                                    <CiImageOff size={100} />
                                </div>
                            )}
                        </div>
                        <div className='p-5 flex flex-col gap-4'>
                            <p className='text-4xl font-semibold'>{item.name}</p>
                            <p className='text-[1.2rem] w-96 text-slate-700'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s</p>
                            <p className='font-semibold'>
                                &#8377;{item.rooms?.[0]?.price} Per Night</p>
                            <Link href={`/Hotels/${item._id}?${params}`}>
                                <Button className='bg-red-500 text-white py-5 w-full' size='large'>Book Now</Button>
                            </Link>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default HotelSlider