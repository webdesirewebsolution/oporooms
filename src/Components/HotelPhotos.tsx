'use client'

import useWindowDimensions from '@/Hooks/useWindow'
import Image from 'next/image'
import React from 'react'
// import { Swiper, SwiperSlide } from 'swiper/react'
import Modal from './Modal'
import { BiChevronLeft } from 'react-icons/bi'

const HotelPhotos = ({ photos }: { photos: string[] }) => {
    const [showAll, setShowAll] = React.useState<string | boolean>(false)
    const { width } = useWindowDimensions()

    return (
        <>
            {/* <div className='w-full lg:w-[49%]'>
                <Swiper direction={width > 1080 ? 'vertical' : 'horizontal'} slidesPerView='auto' spaceBetween={10} className='lg:h-[45rem]'>
                    {photos?.map((item, i) => (
                        <SwiperSlide key={i} className='!h-fit w-[96] lg:w-full'>
                            <div className='relative w-[100%] aspect-video max-w-full'>
                                <Image src={item} alt='' fill />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div> */}
            {photos?.length > 1 &&
                <div className='flex flex-row lg:flex-col gap-5 w-full lg:w-[49%]'>
                    <div className='relative w-[100%] aspect-video max-w-full'>
                        <Image src={photos?.[1]} alt='' fill />
                    </div>
                    <div className='relative w-[100%] aspect-video max-w-full'>
                        <Image src={photos?.[2]} alt='' fill />
                        <div className='absolute bg-black inset-0 opacity-60 text-white flex items-center justify-center text-2xl cursor-pointer' onClick={() => setShowAll(true)}>
                            View all
                        </div>
                    </div>
                </div>}

            <Modal open={showAll !== Boolean(false)} setOpen={setShowAll} className='w-[90%] h-full'>
                <>
                    <div className="container mx-auto p-4 w-full h-full">
                        {/* <h2 className="text-2xl font-bold text-center mb-6">Photo Gallery</h2> */}
                        {showAll == Boolean(true) ? <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {photos.map((photo, index) => (
                                <div
                                    key={index}
                                    className="relative w-full h-80 bg-gray-100 overflow-hidden rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
                                    onClick={() => setShowAll(photo)}
                                >
                                    <Image
                                        src={photo}
                                        alt={photo || `Photo ${index + 1}`}
                                        layout="fill"
                                        objectFit="cover" // Ensures the entire image is visible without cropping
                                        className="rounded-lg"
                                        priority={index < 4} // Prioritize first few images
                                    />
                                </div>
                            ))}
                        </div> : (
                            <div className='relative w-full h-[80vh]'>
                                <button onClick={() => setShowAll(true)} className='z-50 absolute top-5 left-5'>
                                    <BiChevronLeft size={30} />
                                </button>

                                <Image src={showAll as string} alt={showAll as string} fill className='object-cover rounded-2xl'/>
                            </div>
                        )}
                    </div>
                </>
            </Modal>
        </>
    )
}

export default HotelPhotos