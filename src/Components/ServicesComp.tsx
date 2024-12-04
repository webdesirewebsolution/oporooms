import Image from 'next/image'
import React from 'react'
import { MdBedroomParent } from 'react-icons/md'

const ServicesComp = () => {

    return (
        <div className='flex flex-col gap-14 items-center w-full'>
            <div className='flex items-center gap-4'>
                <div className='w-20 border border-black' />
                <p className='uppercase text-center font-semibold'>Our Services</p>
                <div className='w-20 border border-black' />
            </div>
            <div className='text-5xl font-bold'>Explore Our <span className='text-red-500 text-5xl font-bold'>Services</span></div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 w-full'>
                {Array(6).fill(2)?.map((item, i) => (
                    <div key={i} className={`shadow-lg border flex-1 p-10 flex flex-col gap-5 items-center justify-center bg-white`}>
                        <div className='w-24 aspect-video relative '>
                            <Image src='/Images/logo.png' alt='Logo' fill objectFit='contain' />
                        </div>
                        <p className='font-bold text-2xl'>Rooms & Appartment</p>
                        <p className='text-slate-600 text-lg text-center'>Figma ipsum component variant main layer. Auto boolean rectangle rectangle effect ...</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ServicesComp