import React from 'react'

type Props = {}

const Services = (props: Props) => {

    return (
        <div className='flex flex-col gap-14 items-center w-full'>
            <p className='uppercase text-center'>Our Services</p>
            <div className='text-5xl font-bold'>Explore Our <span className='text-red-500 text-5xl font-bold'>Services</span></div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 w-full'>
                {Array(6).fill(2)?.map((item, i) => (
                    <div key={i} className={`shadow-lg border flex-1 p-10 flex flex-col gap-5 items-center justify-center ${i == 1 ? 'bg-red-500 text-white' : 'bg-white'}`}>
                        <div>Icon</div>
                        <p className='font-bold text-2xl'>Rooms & Appartment</p>
                        <p className={`${i == 1 ? 'text-white' : 'text-slate-600'} text-lg text-center`}>Figma ipsum component variant main layer. Auto boolean rectangle rectangle effect ...</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Services