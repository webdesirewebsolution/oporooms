import React from 'react'
import { FaPhoneAlt } from 'react-icons/fa'
import { FaBuilding } from 'react-icons/fa6'
import { MdOutlineBusinessCenter } from 'react-icons/md'

const DesktopHeader = () => {
    return (
        <div className='hidden lg:flex'>
            <div className='flex gap-5 px-8 h-full items-center border-r'>
                    <MdOutlineBusinessCenter size={30}/>
                <div className='flex flex-col items-center'>
                    <p className='text-[#212121] font-medium'>OPO for Business</p>
                    <p className='text-[rgba(0,0,0,0.54)] text-lg'>Trusted by 5000 Corporates</p>
                </div>
            </div>

            <div className='flex gap-5 px-5 h-full items-center border-r'>
                    <FaBuilding size={23}/>
                <div className='flex flex-col items-center'>
                    <p className='text-[#212121] font-medium'>List Your Property</p>
                    <p className='text-[rgba(0,0,0,0.54)] text-lg'>Start earning on 30 mins</p>
                </div>
            </div>

            <div className='flex gap-5 px-5 h-full items-center'>
                    <FaPhoneAlt size={22}/>
                <div className='flex flex-col items-center'>
                    <p className='text-[#212121] font-medium'>7007498505</p>
                    <p className='text-[rgba(0,0,0,0.54)] text-lg'>Call us to Book now</p>
                </div>
            </div>

        </div>
    )
}

export default DesktopHeader