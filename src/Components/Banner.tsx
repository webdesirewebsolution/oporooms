'use client'

import Image from 'next/image'
import React from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

type Props = {}

const Banner = (props: Props) => {
    return (
        <div className='relative w-screen'>
            <Swiper className='w-full h-full' slidesPerView={1} autoplay loop modules={[Autoplay]}>
                {Array(3).fill('')?.map((item, i) => (
                    <SwiperSlide key={i}>
                        <Image src={`/Images/banners/banner${i + 1}.jpg`} alt='' objectFit='cover'
                            width={0}
                            height={0}
                            sizes='100vw'
                            className='w-full h-full'
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className='lg:w-full lg:h-[15rem] lg:bg-[#f2f2f2] lg:z-10 lg:absolute lg:bottom-0'></div>
        </div>
    )
}

export default Banner