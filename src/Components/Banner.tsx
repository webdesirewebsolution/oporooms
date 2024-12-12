'use client'

import Image from 'next/image'
import React from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

type Props = {}

const Banner = (props: Props) => {
    return (
        <div className='relative w-screen aspect-square md:aspect-video max-h-[578px]'>
            <Swiper className='w-full h-full' slidesPerView={1} autoplay loop modules={[Autoplay]}>
                {Array(3).fill('')?.map((item, i) => (
                    <SwiperSlide key={i}>
                        <Image src={`/Images/banners/banner${i + 1}.jpg`} alt='' fill objectFit='cover' />
                    </SwiperSlide>
                ))}
            </Swiper>
            {/* <Image src='/Images/banner.jpg' alt='' fill objectFit='cover' />
    <Container className='absolute flex flex-col gap-5 items-center md:items-start'>
      <h1 className='text-white text-wrap text-2xl font-[700] md:font-bold text-center md:text-left md:text-7xl md:w-[44rem]'>Make your travel whishlist, we’ll do the rest</h1>
      <h2 className='text-white text-wrap w-[24rem] md:w-[51rem] text-lg md:text-xl text-center md:text-left'>Plan and book our perfect trip with expert advice, travel tips, destination information and  inspiration from us</h2>
    </Container> */}
        </div>
    )
}

export default Banner