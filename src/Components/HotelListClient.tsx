'use client'

import { HotelTypes } from '@/Types/Hotels'
import { Button, Container } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { geocodeByPlaceId } from 'react-google-places-autocomplete'
import { FaStar } from 'react-icons/fa6'
import { Swiper, SwiperSlide } from 'swiper/react'
import { CiImageOff } from "react-icons/ci";
import Link from 'next/link'

declare global {
  interface Window {
    initMap: () => void;
  }
}

const HotelListClient = () => {
  const searchParams = useSearchParams()
  const [data, setData] = useState<HotelTypes[]>([])
  const [count, setCount] = useState(0)
  const [address, setAddress] = useState('')
  const [filter, setFilter] = useState({
    page: 0,
    pageSize: 10,
  })

  useEffect(() => {
    (async () => {
      await axios.get(`/api/Hotels?page=${filter.page}&pageSize=${filter.pageSize}`).then(r => {
        if (r.status == 200) {
          setData(r.data?.list)
          setCount(r.data?.count)
        }
      })
    })()
  }, [filter])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (searchParams.has('placeId')) {
        window.initMap = async () => {
          await geocodeByPlaceId(searchParams.get('placeId') as string).then(results => {
            console.log(results)
            setAddress(results?.[0]?.formatted_address)
          })
            .catch(error => console.error(error))
        }
      }
    }
  }, [searchParams])

  const searchData: { [key: string]: string } = {}

  for (const i of searchParams.entries()) {
    searchData[i[0]] = i[1]
  }

  return (
    <Container className='pb-20'>
      <p className='text-center mb-20 text-4xl font-bold text-slate-700'>{count} search resuls found</p>

      <div className='flex flex-col gap-10'>
        {data?.map((item) => (
          <div key={item?._id} className='bg-white p-6 rounded-md flex flex-col lg:flex-row gap-10 justify-between'>
            <div className='flex flex-col lg:flex-row gap-10'>
              {item?.photos?.length > 0 ? <Swiper slidesPerView={1} spaceBetween={10}>
                {item?.photos?.map(img => (
                  <SwiperSlide key={img} className='!w-fit'>
                    <Image src={img} alt='' width={300} height={300} quality={100} className='aspect-square w-96 rounded-lg object-cover max-w-full' objectFit='cover' />
                  </SwiperSlide>
                ))}
              </Swiper> : (
                <div className='max-w-full w-96 aspect-square flex items-center justify-center bg-slate-300 rounded-lg'>
                  <CiImageOff size={100} />
                </div>
              )}

              <div className='flex flex-col gap-5 lg:py-5 justify-between'>
                <p className='text-4xl font-semibold'>{item?.name}</p>
                <div className='flex gap-2 items-center'>
                  {Array(5).fill(2)?.map((star, i) => (
                    <FaStar key={i} color="orange" />
                  ))}
                  <p className='text-slate-700 text-xl mt-1'>4.5 (1200 Reviews)</p>
                </div>

                <p className='text-xl text-slate-700'>Live a little and celbrate with champagne</p>
                <p className='text-xl text-slate-700 lg:w-[40rem]'>
                  Reats include a glass of French champagne, parking and a late checkout. Gym included. Flexible cancellation applies
                </p>

                <Link href={{ pathname: `/Hotels/${item?._id}`, query: searchData }} >
                  <Button className='bg-red-500 py-5 w-fit px-10 text-white text-xl' size='large'>See availability</Button>
                </Link>
              </div>

            </div>

            <div className='flex flex-col items-end justify-between gap-5 lg:py-5'>
              <p className='bg-red-500 text-white px-8 py-3 rounded-lg text-lg'>Book now and receive 15% off</p>

              <div className='flex flex-col items-end'>
                <p className='text-4xl font-semibold'>Rs. {item?.rooms?.[0]?.price}</p>
                <p className='text-slate-700 text-lg'>Rs. {item?.rooms?.[0]?.fee} taxes and fees</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}

export default HotelListClient