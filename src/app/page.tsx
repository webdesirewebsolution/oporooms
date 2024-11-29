import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import SearchBox from '@/Components/SearchBox'
import ServicesComp from '@/Components/ServicesComp'
import { Button, Container } from '@mui/material'
import Image from 'next/image'
import React from 'react'

const Home = () => {
  return (
    <>
      <Header />
      <Banner />

      <Container className='relative -top-60 md:-top-52 -mb-40'>
        <SearchBox />
        <div className='mt-20 w-full'>
          <ServicesComp />
        </div>
        <div className='mt-28 w-full'>
          <DreamVacation />
        </div>
        <div className='mt-28 w-full'>
          <Rooms />
        </div>
        <div className='flex flex-col gap-5 mt-20 text-center items-center'>
          <p className='text-4xl font-semibold'>Explore the world with OPO ROOMS</p>
          <p className='text-lg text-blue-500'>Discover new places and experiences</p>
        </div>
      </Container>

      <Footer />
    </>
  )
}

const Banner = () => {
  return (
    <div>
      <div className='relative w-screen aspect-square md:aspect-video max-h-[578px] py-20 md:py-32 lg:px-36'>
        <Image src='/Images/banner.jpg' alt='' fill objectFit='cover' />
        <Container className='absolute flex flex-col gap-5 items-center md:items-start'>
          <h1 className='text-white text-wrap text-2xl font-[700] md:font-bold text-center md:text-left md:text-7xl md:w-[44rem]'>Make your travel whishlist, we’ll do the rest</h1>
          <h2 className='text-white text-wrap w-[24rem] md:w-[51rem] text-lg md:text-xl text-center md:text-left'>Plan and book our perfect trip with expert advice, travel tips, destination information and  inspiration from us</h2>
        </Container>
      </div>
    </div>
  )
}

const DreamVacation = () => {
  return (
    <div className='flex flex-col gap-5'>
      <p className='text-4xl text-red-500 font-bold'>Enjoy your dream vacation</p>
      <p className='text-slate-700 text-lg w-[45rem] max-w-full'>Plan and book our perfect trip with expert advice, travel tips, destination information and  inspiration from us</p>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {Array(4).fill(2)?.map((item, i) => (
          <div key={i} className='w-full flex flex-col gap-3'>
            <div className='w-full aspect-video relative'>
              <Image src='/Images/banner.jpg' alt='' objectFit='cover' fill className='rounded-lg w-full' />
            </div>
            <p className='text-3xl font-semibold'>Goa</p>
            <p className='text-lg'>23456 properties</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const Rooms = () => {
  return (
    <div className='flex flex-col gap-14 items-center w-full'>
      <div className='flex items-center gap-4'>
        <div className='w-20 border border-black' />
        <p className='uppercase text-center font-semibold'>Our Rooms</p>
        <div className='w-20 border border-black' />
      </div>
      <div className='text-5xl font-bold'>Explore Our <span className='text-red-500 text-5xl font-bold'>ROOMS</span></div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full'>
        {Array(3).fill(2)?.map((item, i) => (
          <div key={i} className='w-full flex flex-col gap-3 shadow-lg rounded-xl overflow-hidden'>
            <div className='w-full aspect-video relative'>
              <Image src='/Images/banner.jpg' alt='' objectFit='cover' fill />
            </div>
            <div className='p-5 flex flex-col gap-4'>
              <p className='text-4xl font-semibold'>Hotel Imperial</p>
              <p className='text-[1.2rem] w-96 text-slate-700'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s</p>
              <p className='font-semibold'>Rs. 1550 / Per Night</p>
              <Button className='bg-red-500 text-white py-5' size='large'>Book Now</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home