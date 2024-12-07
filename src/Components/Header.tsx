import Image from 'next/image'
import React from 'react'
import AuthButtons from './AuthButtons'
import { auth } from '@/auth'
import HeaderOption from './HeaderOption'
import { getUser } from '@/app/actions'
import { Session } from 'next-auth'
import DesktopHeader from './Header/DesktopHeader'
import Cities from './Header/Cities'
import Link from 'next/link'

const Header = async ({ }) => {
    const session = await auth()
    const user = await getUser(session as Session)

    const cities = [
        {
            title: 'Bangalore',
            subCities: ["Koramangala", "Mg Road", "Rajaji Nagar", "Indiranagar", "Jayanagar", "Madiwala", "Majestic", "Yesvantpur Railway Station", "Marathahalli", "Hsr Layout", "All of Bangalore"]
        },
        {
            title: 'Chennai',
            subCities: ["Chennai Central Railway Station", "T Nagar", "Ecr East Coast Road", "Koyambedu", "Mount Road", "Ramapuram", "Porur", "Chennai Egmore Railway Station", "Anna Nagar", "Velachery", "All of Chennai"],
        },
        {
            title: 'Delhi',
            subCities: ["Paharganj", "Karol Bagh", "Janakpuri", "Dwarka, New Delhi", "Mahipalpur", "Indira Gandhi International Airport", "Saket", "Lajpat Nagar", "New Delhi Railway Station", "Rohini", "All of Delhi"],
        },
        {
            title: 'Gurgaon',
            subCities: ["Sector 14", "Medanta Hospital", "Sector 38", "Huda City Center Metro", "Golf Course Road", "Sikanderpur", "Guru Dronacharya Metro", "Gurgaon Bus Stand", "Iffco Chowk", "Sector 83", "All of Gurgaon"],
        },
        {
            title: 'Hyderabad',
            subCities: ["Secunderabad  Railway Station", "Gachibowli", "Ameerpet", "Kukatpally", "Rajiv Gandhi International Airport", "Begumpet", "Madhapur", "Chanda Nagar", "LB Nagar", "Abids", "All of Hyderabad"],
        },
        {
            title: 'Kolkata',
            subCities: ["Howrah Railway Station", "Kolkata International Airport", "Chinar Park", "Park Street", "Near Acropolis Mall", "Esplanade Metro Station", "Dum Dum Airport 1 No. Gate", "Barasat", "New Town", "Salt Lake City", "All of Kolkata"],
        },
        {
            title: 'Mumbai',
            subCities: ["Andheri East", "Andheri West", "Thane", "Chhatrapati Shivaji International Airport", "Saki Naka", "Bandra", "Colaba", "Bandra Kurla Complex", "Mumbai Cst Railway Station", "Navi Mumbai", "All of Mumbai"],
        },
        {
            title: 'Noida',
            subCities: ["Sector 62", "Pari Chowk", "Sector 18", "Greater Noida", "Khora Colony", "Noida City Centre", "Sector 58", "Sector 55", "Sector 15 Noida", "Sec 62 Fortis Hospital", "All of Noida"],
        },
        {
            title: 'Pune',
            subCities: ["Baner", "Hadapsar", "Viman Nagar", "Pimpri Chinchwad", "Shivaji Nagar", "Wakad", "Chandan Nagar", "Swargate", "Kharadi", "Koregaon Park", "All of Pune"]
        },
        {
            title: 'All Cities',
            subCities: []
        },
    ]

    return (
        <>
            <div className='w-full bg-white shadow border-b-2 border-slate-200'>
                <div className='py-5 flex justify-between items-center px-8'>
                    <Link href='/' className='w-[140px] h-[53px] relative'>
                        <Image src='/Images/logo.png' alt='Logo' fill objectFit='contain' />
                    </Link>
                    <DesktopHeader />
                    {/* <Menu /> */}

                    {session?.user?._id ? <HeaderOption user={user} /> : <AuthButtons />}
                </div>
            </div>
            <div className='w-full bg-[#f3f5f7] px-5 hidden lg:block z-[999]'>
                <ul className='flex w-full'>
                    {cities?.map((item) => (
                        <li key={item?.title} className='flex-1 flex items-center justify-center group py-4'>
                            <Cities item={item}>
                                {item?.title}
                            </Cities>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default Header