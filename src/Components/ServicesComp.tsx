import Image from 'next/image'
import React from 'react'
import { MdBedroomParent } from 'react-icons/md'

const ServicesComp = () => {

    const data = [
        {
            title: 'Best prices',
            desc: 'Our prices are under close control as we work with thousands of hotels and do opo of providers directly. This also means that we always have great offers for most destinations.'
        },
        {
            title: 'Hotels across the India',
            desc: 'We have over 5000 options of accommodation around the India. This includes hotels, hostels, apartments, villas, and even campgrounds. Find suitable accommodation at any time of the year.'
        },
        {
            title: 'Flexible payment',
            desc: 'You can choose a payment method. We accept all major credit cards for online payment as well as PayPal. You can also pay upon arrival at the hotel.'
        },
        {
            title: '24/7 Customer Care',
            desc: 'Our support specialists will help you to choose a hotel and book it. If you have a problem during your trip, our specialist will be online and find a solution in no time.'
        },
        {
            title: 'Reliable reviews',
            desc: 'We collect and publish travelers reviews and add the ones from TripAdvisor. This way, you get even more information about hotels.'
        },
        {
            title: 'Free app',
            desc: 'The most important thing about our app is that it shows secret offers. Plus, it is extremely handy—book hotels on the subway, at work, or even at the airport.'
        }
    ]

    return (
        <div className='flex flex-col gap-14 items-center w-full'>
            <div className='flex items-center gap-4'>
                <div className='w-20 border border-black' />
                <p className='uppercase text-center font-semibold'>Our Services</p>
                <div className='w-20 border border-black' />
            </div>
            <div className='text-5xl font-bold'>Explore Our <span className='text-red-500 text-5xl font-bold'>Services</span></div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-10 w-full'>
                {data?.map((item, i) => (
                    <div key={i} className={`shadow-lg border flex-1 p-10 flex flex-col gap-5 items-center justify-center bg-white`}>
                        <div className='w-36 aspect-video relative '>
                            <Image src='/Images/logo.png' alt='Logo' title='Oporooms' fill objectFit='contain' />
                        </div>
                        <p className='font-bold text-2xl'>{item.title}</p>
                        <p className='text-slate-600 text-lg text-center'>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ServicesComp