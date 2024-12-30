import Banner from '@/Components/Banner'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import HotelSlider from '@/Components/HotelSlider'
import SearchBox from '@/Components/SearchBox'
import ServicesComp from '@/Components/ServicesComp'
import TestimonialSlider from '@/Components/TestimonialSlider'
import { getHotels } from '@/server/db'
import { Button, Container } from '@mui/material'
import { Params } from 'next/dist/server/request/params'
import { SearchParams } from 'next/dist/server/request/search-params'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import dayjs from 'dayjs'

type Props = {
  params: Promise<Params>
  searchParams: Promise<SearchParams>
}

const Home = async ({ params, searchParams }: Props) => {
  const paramsRes = await params
  const searchParamsRes = await searchParams

  return (
    <>
      <Header />

      <Banner />
      <SearchBox />

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
        <Image src='/Images/banner2.jpg' alt='Banner' title='Banner' fill objectFit='cover' />
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
      <h2 className='text-slate-700 text-lg w-[45rem] max-w-full'>Plan and book our perfect trip with expert advice, travel tips, destination information and  inspiration from us</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
        {data?.map((item, i) => (
          <Link href={{
            pathname: '/Hotels',
            query: {
              placeId: item.placeId,
              city: item.title,
              checkIn: dayjs(Date.now()).valueOf(),
              checkOut: dayjs(Date.now()).add(1, 'day').valueOf(),
              rooms: 1,
              adults: 1,
              childrens: 0
            }
          }} key={i} className='w-full flex flex-col gap-3' title={item.title}>
            <div className='w-full aspect-video relative'>
              <Image src={item.image} alt={item.title} title={item.title} objectFit='cover' fill className='rounded-lg w-full' />
            </div>
            <p className='text-3xl font-semibold'>{item.title}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

const Rooms = async ({ searchParams }: { searchParams: any }) => {
  const { data } = await getHotels({ searchParams })
  const params = new URLSearchParams(searchParams)

  return (
    <div className='flex flex-col gap-14 items-center w-full'>
      <div className='flex items-center gap-4'>
        <div className='w-20 border border-black' />
        <p className='uppercase text-center font-semibold'>Our Rooms</p>
        <div className='w-20 border border-black' />
      </div>
      <h1 className='text-5xl font-bold'>Explore Our <span className='text-red-500 text-5xl font-bold uppercase'>Hotels</span></h1>

      {data?.length > 0 && <HotelSlider list={JSON.parse(JSON.stringify(data))} params={params.toString()} />}
    </div>
  )
}

const Testimonials = async () => {

  const list = [
    {
      "image": "",
      "title": "Priya Sharma",
      "desc": "I recently booked a weekend getaway to Jaipur through OpoRooms, and the experience was seamless! The hotel options were well-curated, and I found an amazing deal on a heritage property. Highly recommend OpoRooms for hassle-free hotel bookings!"
    },
    {
      "image": "",
      "title": "Ramesh Iyer",
      "desc": "Planning a family vacation to Kerala was a breeze with OpoRooms. From booking train tickets to finding perfect homestays, the platform had it all. The affordability and convenience they provided was exceptional!"
    },
    {
      "image": "",
      "title": "Anjali Menon",
      "desc": "I had to book a last-minute flight for a business trip to Hyderabad, and OpoRooms saved the day. The process was quick, and I managed to get a great discount. It's now my go-to app for travel needs!"
    },
    {
      "image": "",
      "title": "Amit Mishra",
      "desc": "OpoRooms made our group bus booking to Rishikesh extremely convenient. We could choose the perfect bus for our budget, and the booking confirmation was instant. Our trip was hassle-free. Will definitely use this again!"
    },
    {
      "image": "",
      "title": "Sneha Gupta",
      "desc": "My honeymoon trip to Goa was made extra special with OpoRooms. The hotel package included airport transfers and a candlelight dinner. It was unforgettable, and the prices were unbeatable. Thank you, OpoRooms!"
    },
    {
      "image": "",
      "title": "Rahul Verma",
      "desc": "OpoRooms exceeded my expectations when I booked my train tickets to Shimla. The interface was easy to navigate, and their updates were spot-on. Great job!"
    },
    {
      "image": "",
      "title": "Meera Nair",
      "desc": "I used OpoRooms to book a hotel for my parents in Varanasi. The process was smooth, and the hotel was exactly as described. My parents loved the experience, and I’ll definitely use this platform again."
    },
    {
      "image": "",
      "title": "Sanjay Kulkarni",
      "desc": "I recently booked a flight to Kolkata through OpoRooms and found an amazing deal. Adding travel insurance was easy, and the transparency in pricing impressed me. Highly recommended!"
    },
    {
      "image": "",
      "title": "Kavita Joshi",
      "desc": "OpoRooms made our college reunion trip to Manali super convenient. The luxury bus we booked was affordable and comfortable. I’ll definitely book again for future trips!"
    },
    {
      "image": "",
      "title": "Arjun Das",
      "desc": "I was looking for a budget-friendly hotel in Chennai for a short business trip, and OpoRooms had the perfect options. Booking was quick, and I loved the real reviews. My trip was stress-free thanks to them!"
    }
  ]

  return (
    <div className='flex flex-col gap-14 items-center w-full'>
      <div className='flex items-center gap-4'>
        <div className='w-20 border border-black' />
        <h3 className='uppercase text-center font-semibold'>Testimonials</h3>
        <div className='w-20 border border-black' />
      </div>
      <div className='text-5xl font-bold'>What <span className='text-red-500 text-5xl font-bold uppercase'>Users </span>
        {" "}say</div>

      <TestimonialSlider list={list} />
    </div>
  )
}

export default Home