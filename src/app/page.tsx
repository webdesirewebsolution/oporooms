import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import SearchBox from '@/Components/SearchBox'
import ServicesComp from '@/Components/ServicesComp'
import { HotelTypes } from '@/Types/Hotels'
import { Button, Container } from '@mui/material'
import axios from 'axios'
import { SearchParams } from 'next/dist/server/request/search-params'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { CiImageOff } from 'react-icons/ci'

type Props = {
  searchParams: Promise<SearchParams>
}

const Home = async ({ searchParams }: Props) => {
  const searchParamsRes = await searchParams

  return (
    <>
      <Header />
      <Banner />

      <SearchBox />
      <Container className='transition-all relative -top-60 md:-top-[20rem] -mb-40'>
        <div className='mt-20 w-full'>
          <Rooms searchParams={searchParamsRes} />
        </div>
        <div className='mt-28 w-full'>
          <DreamVacation />

        </div>
        <div className='mt-28 w-full'>
          <ServicesComp />

        </div>

      </Container>

      <div className='relative w-screen aspect-video max-h-[35.63rem] flex items-center px-14 lg:px-24'>
        <Image src='/Images/banner2.jpg' alt='' fill objectFit='cover' />
        <div className='absolute z-10 flex flex-col gap-10'>
          <p className='text-white text-2xl lg:text-5xl text-bold w-[20rem] lg:w-[58rem]'>Download the mobile application for bonus coupons and travel <br /> codes</p>
          <Button className='bg-red-500 text-white w-fit px-10 py-5' size='large'>Download Now</Button>
        </div>
      </div>

      <Container>
        <div className='flex flex-col gap-5 my-20 text-center items-center'>
          <p className='text-4xl font-semibold'>Explore the India with OPO ROOMS</p>
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

  const data = [
    {
      title: 'Kashmir',
      image: '/Images/trips/kashmir.jpg'
    },
    {
      title: 'Goa',
      image: '/Images/trips/goa.webp'
    },
    {
      title: 'Manali',
      image: '/Images/trips/manali.webp'
    },
    {
      title: 'Shimla',
      image: '/Images/trips/shimla.jpg'
    },
  ]

  return (
    <div className='flex flex-col gap-5'>
      <p className='text-4xl text-red-500 font-bold'>Enjoy your dream vacation</p>
      <p className='text-slate-700 text-lg w-[45rem] max-w-full'>Plan and book our perfect trip with expert advice, travel tips, destination information and  inspiration from us</p>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {data?.map((item, i) => (
          <div key={i} className='w-full flex flex-col gap-3'>
            <div className='w-full aspect-video relative'>
              <Image src={item.image} alt='' objectFit='cover' fill className='rounded-lg w-full' />
            </div>
            <p className='text-3xl font-semibold'>{item.title}</p>
            {/* <p className='text-lg'>23456 properties</p> */}
          </div>
        ))}
      </div>
    </div>
  )
}

const Rooms = async ({ searchParams } : {searchParams : any}) => {
  const data = await axios.get(`${process.env.SERVERURL}/api/Hotels?page=0&pageSize=3`)

  const list: HotelTypes[] = data.data?.list
  const params = new URLSearchParams(searchParams)

  console.log(params.toString())

  return (
    <div className='flex flex-col gap-14 items-center w-full'>
      <div className='flex items-center gap-4'>
        <div className='w-20 border border-black' />
        <p className='uppercase text-center font-semibold'>Our Rooms</p>
        <div className='w-20 border border-black' />
      </div>
      <div className='text-5xl font-bold'>Explore Our <span className='text-red-500 text-5xl font-bold uppercase'>Hotels</span></div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full'>
        {list?.map((item, i) => (
          <div key={i} className='w-full flex flex-col gap-3 shadow-lg rounded-xl overflow-hidden bg-white'>
            <div className='w-full aspect-video relative'>
              {item.photos?.[0] ? <Image src={item.photos?.[0]} alt='' objectFit='cover' fill /> : (
                <div className='w-full aspect-video flex items-center justify-center bg-slate-300'>
                  <CiImageOff size={100} />
                </div>
              )}
            </div>
            <div className='p-5 flex flex-col gap-4'>
              <p className='text-4xl font-semibold'>{item.name}</p>
              <p className='text-[1.2rem] w-96 text-slate-700'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since the 1500s</p>
              <p className='font-semibold'>
                &#8377;{item.rooms?.[0]?.price} Per Night</p>
              <Link href={`/Hotels/${item._id}?${params.toString()}`}>
                <Button className='bg-red-500 text-white py-5 w-full' size='large'>Book Now</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home