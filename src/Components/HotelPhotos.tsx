'use client'

import useWindowDimensions from '@/Hooks/useWindow'
import Image from 'next/image'
import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'

const HotelPhotos = ({ photos }: { photos: string[] }) => {
    const { width } = useWindowDimensions()
    return (
        <div className='w-full lg:w-[49%]'>
            <Swiper direction={width > 1080 ? 'vertical' : 'horizontal'} slidesPerView='auto' spaceBetween={10} className='lg:h-[45rem]'>
                {photos?.map((item, i) => (
                    <SwiperSlide key={i} className='!h-fit w-[96] lg:w-full'>
                        <div className='relative w-[100%] aspect-video max-w-full'>
                            <Image src={item} alt='' fill />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default HotelPhotos