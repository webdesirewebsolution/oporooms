'use client'

import { HotelTypes } from '@/Types/Hotels'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { CiImageOff } from 'react-icons/ci'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules';
import Description from './Description'
import Button from './Buttons'

type Props = {
    list: HotelTypes[],
    params: string
}

const HotelSlider = ({ list, params }: Props) => {
    return (
        <Swiper slidesPerView="auto"
            // breakpoints={{
            //     '320': {
            //         slidesPerView: 2
            //     },
            //     '640': {
            //         slidesPerView: 3
            //     }
            // }}
            loop
            autoplay
            modules={[Autoplay]}
            spaceBetween={20}
            className='w-full'>
            {list?.map((item, i) => (
                <SwiperSlide key={i} className='h-auto flex w-[35rem]'>
                    <div className='w-full flex flex-col gap-3 shadow-lg rounded-xl overflow-hidden bg-white'>
                        <div className='w-full aspect-video relative'>
                            {item.photos?.[0] ? <Image src={item.photos?.[0]} alt={item.name} title={item.name} objectFit='cover' fill /> : (
                                <div className='w-full aspect-video flex items-center justify-center bg-slate-300'>
                                    <CiImageOff size={100} />
                                </div>
                            )}
                        </div>
                        <div className='p-5 flex flex-col gap-4 flex-1 justify-between'>
                            <div className='flex flex-col gap-3'>
                                <p className='text-4xl font-semibold'>{item.name}</p>
                                <Description text={item.desc} />

                                <p className='font-semibold'>
                                    &#8377;{item.rooms?.[0]?.price} Per Night</p>
                            </div>
                            <Link href={`/Hotels/${item._id}?${params}`} title={item.name}>
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