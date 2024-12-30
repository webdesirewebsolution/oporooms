'use client'

import { HotelTypes } from '@/Types/Hotels'
import Image from 'next/image'
import React from 'react'
import { CiImageOff } from 'react-icons/ci'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperProps, SwiperSlide } from 'swiper/react'

type Props = {
    photos: HotelTypes['photos'],
} & SwiperProps

const SliderImage = ({ photos, ...props }: Props) => {
    return (
        <>
            {photos?.length > 0 ? <Swiper slidesPerView={1} spaceBetween={10} className={`!w-[28.5rem] ${props.className}`} {...props} modules={[Autoplay]}>
                {photos?.map((img) => (
                    <SwiperSlide key={img} className='!w-fit'>
                        <div className='w-[28.5rem] h-[20rem] relative rounded-lg overflow-hidden'>
                            <Image src={img} alt='' fill objectFit='cover' />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
                : (
                    <div className='w-[28.5rem] h-[20rem] flex items-center justify-center bg-slate-300 rounded-lg'>
                        <CiImageOff size={100} />
                    </div>
                )}

        </>
    )
}

export default SliderImage