import Header from '@/Components/Header'
import HotelListClient from '@/Components/HotelListClient'
import SearchHotel from '@/Components/SearchHotel'
import React from 'react'
import Footer from '@/Components/Footer';

const HotelList = () => {
    return (
        <>
            <Header />
            <div className='bg-[rgb(244,244,244,1)]'>
                <SearchHotel />

                <HotelListClient />
            </div>
            <Footer />
        </>
    )
}

export default HotelList