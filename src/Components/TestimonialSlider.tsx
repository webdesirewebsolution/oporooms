'use client'

import Image from 'next/image'
import React from 'react'
import { CiImageOff } from 'react-icons/ci'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules';

type Props = {
    list: {
        image: string,
        title: string,
        desc: string,
    }[],
}

const TestimonialSlider = ({ list }: Props) => {
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
                            {item.image ? <Image src={item.image} alt={item.title} title={item.title} objectFit='cover' fill /> : (
                                <div className='w-full aspect-video flex items-center justify-center bg-slate-300'>
                                    <CiImageOff size={100} />
                                </div>
                            )}
                        </div>
                        <div className='p-5 flex flex-col gap-4 items-center'>
                            <p className='text-4xl font-semibold'>{item.title}</p>
                            <p className='text-[1.2rem] w-96 text-slate-700'>
                                {item.desc}
                            </p>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}

export default TestimonialSlider