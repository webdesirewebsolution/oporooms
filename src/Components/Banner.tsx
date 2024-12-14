'use client'

import Image from 'next/image'
import React from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

type Props = {}

const Banner = (props: Props) => {
    return (
        <div className='relative w-screen -mb-[15rem]'>
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
            <div className='w-full h-[15rem] bg-[#f2f2f2] z-10 absolute bottom-0'></div>
        </div>
    )
}

export default Banner