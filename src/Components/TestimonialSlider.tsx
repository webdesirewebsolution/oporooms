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
        <Swiper slidesPerView="auto"
            loop
            autoplay
            // speed={5000}
            modules={[Autoplay]}
            spaceBetween={20}
            className='w-full'>
            {list?.map((item, i) => (
                <SwiperSlide key={i} className='h-auto w-[35rem] pb-10'>
                    <div className='w-full h-full flex flex-col gap-3 shadow-lg rounded-xl overflow-hidden bg-white'>
                        <div className='w-full flex items-center justify-center relative pt-10 pb-5'>
                            {item.image ? <Image src={`/Images/testimonials/${item.image}.jpg`} alt={item.title} title={item.title} objectFit='contain' fill className='size-40 rounded-full overflow-hidden relative bg-slate-200'/> : (
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