import Banner from '@/Components/Banner'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import HotelSlider from '@/Components/HotelSlider'
import SearchBox from '@/Components/SearchBox'
import ServicesComp from '@/Components/ServicesComp'
import TestimonialSlider from '@/Components/TestimonialSlider'
import { HotelTypes } from '@/Types/Hotels'
import { Button, Container } from '@mui/material'
import axios from 'axios'
import moment from 'moment'
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

      <SearchBox />
      <Banner />

      {/* <div className='block lg:hidden'>
        <SearchBox />
      </div> */}


      <Container className='transition-all relative z-20'>
        <div className='mt-20 w-full'>
          <Rooms searchParams={searchParamsRes} />
        </div>
        <div className='mt-28 w-full'>
          <DreamVacation />
        </div>
        <div className='mt-28 w-full'>
          <ServicesComp />
        </div>

        <div className='mt-28 w-full'>
          <Testimonials />
        </div>

      </Container>

      <div className='relative w-screen aspect-video max-h-[35.63rem] flex items-center px-14 lg:px-24 mt-28'>
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

// const Banner = () => {
//   return (
//     <div>
//       <div className='relative w-screen aspect-square md:aspect-video max-h-[578px] py-20 md:py-32 lg:px-36'>
//         <Image src='/Images/banner.jpg' alt='' fill objectFit='cover' />
//         <Container className='absolute flex flex-col gap-5 items-center md:items-start'>
//           <h1 className='text-white text-wrap text-2xl font-[700] md:font-bold text-center md:text-left md:text-7xl md:w-[44rem]'>Make your travel whishlist, we’ll do the rest</h1>
//           <h2 className='text-white text-wrap w-[24rem] md:w-[51rem] text-lg md:text-xl text-center md:text-left'>Plan and book our perfect trip with expert advice, travel tips, destination information and  inspiration from us</h2>
//         </Container>
//       </div>
//     </div>
//   )
// }

const DreamVacation = () => {

  const data = [
    {
      title: 'Kashmir',
      placeId: 'ChIJ_dw6eXsqGzkRXgM3DlD1ZV4',
      image: '/Images/trips/kashmir.jpg'
    },
    {
      title: 'Goa',
      placeId: 'ChIJQbc2YxC6vzsRkkDzYv-H-Oo',
      image: '/Images/trips/goa.webp'
    },
    {
      title: 'Manali',
      placeId: 'ChIJP9A_FgiHBDkRzXZQvg6oKYE',
      image: '/Images/trips/manali.webp'
    },
    {
      title: 'Shimla',
      placeId: 'ChIJZ25d4-N4BTkRt1Sf__Z_fh8',
      image: '/Images/trips/shimla.jpg'
    },
  ]

  return (
    <div className='flex flex-col gap-5'>
      <p className='text-4xl text-red-500 font-bold'>Enjoy your dream vacation</p>
      <p className='text-slate-700 text-lg w-[45rem] max-w-full'>Plan and book our perfect trip with expert advice, travel tips, destination information and  inspiration from us</p>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {data?.map((item, i) => (
          <Link href={{
            pathname: '/Hotel',
            query: {
              placeId: item.placeId,
              city: item.title,
              checkIn: moment(Date.now()).valueOf(),
              checkOut: moment(Date.now()).add(1 + 'days').valueOf(),
              rooms: 1,
              adults: 1,
              childrens: 0
            }
          }} key={i} className='w-full flex flex-col gap-3'>
            <div className='w-full aspect-video relative'>
              <Image src={item.image} alt='' objectFit='cover' fill className='rounded-lg w-full' />
            </div>
            <p className='text-3xl font-semibold'>{item.title}</p>
            {/* <p className='text-lg'>23456 properties</p> */}
          </Link>
        ))}
      </div>
    </div>
  )
}

const Rooms = async ({ searchParams }: { searchParams: any }) => {
  const data = await axios.get(`${process.env.SERVERURL}/api/Hotels?page=0&pageSize=10`)

  const list: HotelTypes[] = data.data?.list
  const params = new URLSearchParams(searchParams)

  return (
    <div className='flex flex-col gap-14 items-center w-full'>
      <div className='flex items-center gap-4'>
        <div className='w-20 border border-black' />
        <p className='uppercase text-center font-semibold'>Our Rooms</p>
        <div className='w-20 border border-black' />
      </div>
      <div className='text-5xl font-bold'>Explore Our <span className='text-red-500 text-5xl font-bold uppercase'>Hotels</span></div>

      {/* <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full'> */}
      <HotelSlider list={list} params={params.toString()} />
    </div>
  )
}

const Testimonials = async () => {

  const list = [
    {
      image: '',
      title: 'Rahul',
      desc: 'This is a fantastic hotel. Our rooms were very comfortable. The hotel is convenient to the central area of Helsinki as well as to the train station. I only wish we could have stayed longer than just one night before continuing on to other parts of Finland.'
    },
    {
      image: '',
      title: 'Rahul',
      desc: 'This is a fantastic hotel. Our rooms were very comfortable. The hotel is convenient to the central area of Helsinki as well as to the train station. I only wish we could have stayed longer than just one night before continuing on to other parts of Finland.'
    },
    {
      image: '',
      title: 'Rahul',
      desc: 'This is a fantastic hotel. Our rooms were very comfortable. The hotel is convenient to the central area of Helsinki as well as to the train station. I only wish we could have stayed longer than just one night before continuing on to other parts of Finland.'
    },
    {
      image: '',
      title: 'Rahul',
      desc: 'This is a fantastic hotel. Our rooms were very comfortable. The hotel is convenient to the central area of Helsinki as well as to the train station. I only wish we could have stayed longer than just one night before continuing on to other parts of Finland.'
    },
    {
      image: '',
      title: 'Rahul',
      desc: 'This is a fantastic hotel. Our rooms were very comfortable. The hotel is convenient to the central area of Helsinki as well as to the train station. I only wish we could have stayed longer than just one night before continuing on to other parts of Finland.'
    },
    {
      image: '',
      title: 'Rahul',
      desc: 'This is a fantastic hotel. Our rooms were very comfortable. The hotel is convenient to the central area of Helsinki as well as to the train station. I only wish we could have stayed longer than just one night before continuing on to other parts of Finland.'
    },
    {
      image: '',
      title: 'Rahul',
      desc: 'This is a fantastic hotel. Our rooms were very comfortable. The hotel is convenient to the central area of Helsinki as well as to the train station. I only wish we could have stayed longer than just one night before continuing on to other parts of Finland.'
    },
  ]

  return (
    <div className='flex flex-col gap-14 items-center w-full'>
      <div className='flex items-center gap-4'>
        <div className='w-20 border border-black' />
        <p className='uppercase text-center font-semibold'>Testimonials</p>
        <div className='w-20 border border-black' />
      </div>
      <div className='text-5xl font-bold'>What <span className='text-red-500 text-5xl font-bold uppercase'>Users </span>
        {" "}say</div>

      {/* <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full'> */}
      <TestimonialSlider list={list} />
    </div>
  )
}

export default Home