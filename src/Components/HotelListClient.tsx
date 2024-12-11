/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { HotelTypes } from '@/Types/Hotels'
import { Button, CircularProgress, Container, Skeleton } from '@mui/material'
import axios from 'axios'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { geocodeByPlaceId } from 'react-google-places-autocomplete'
import { FaStar } from 'react-icons/fa6'
import { Swiper, SwiperSlide } from 'swiper/react'
import { CiImageOff } from "react-icons/ci";
import Link from 'next/link'
import moment from 'moment'
import { IoLocation } from 'react-icons/io5'
import BookRoom from './BookRoom'

declare global {
  interface Window {
    initMap: () => void;
  }
}

const HotelListClient = () => {
  const searchParams = useSearchParams()
  const [data, setData] = useState<HotelTypes[]>([])
  const [loading, setLoading] = useState(false)
  const [count, setCount] = useState(0)
  const [address, setAddress] = useState('')
  console.log(address)
  const [filter, setFilter] = useState<{
    page: number, pageSize: number, hotelName: string | undefined
  }>({
    page: 0,
    pageSize: 10,
    hotelName: undefined
  })

  const [isLoadMore, setIsLoadMore] = useState(false)

  useEffect(() => {
    (async () => {
      if(isLoadMore) setLoading(true)
      const params = new URLSearchParams()
      params.set('page', String(filter.page * 10))
      params.set('pageSize', String(filter.pageSize))

      if (filter.hotelName !== undefined) params.set('name', filter.hotelName)
      else if (filter.hotelName == '') params.delete('name')

      await axios.get(`/api/Hotels?${params.toString()}`).then(r => {
        if (r.status == 200) {
          if (isLoadMore) { setData(prev => [...prev, ...r.data?.list]) } else setData(r.data?.list)
          setCount(r.data?.count)
        }
      }).finally(() => { setLoading(false); setIsLoadMore(false) })
    })().finally(() => { setLoading(false); setIsLoadMore(false) })
  }, [filter, isLoadMore])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (searchParams.has('placeId')) {
        window.initMap = async () => {
          await geocodeByPlaceId(searchParams.get('placeId') as string).then(results => {
            setAddress(results?.[0]?.formatted_address)
          })
            .catch(error => console.error(error))
        }
      }
    }
  }, [searchParams, isLoadMore])

  const searchData: { [key: string]: string } = {}

  for (const i of searchParams.entries()) {
    searchData[i[0]] = i[1]
  }

  const rooms = Number(searchParams.get('rooms'))
  const checkIn = moment(Number(searchParams.get('checkIn')))
  const checkOut = moment(Number(searchParams.get('checkOut'))).add(1, 'day')
  const totalDays = moment(checkOut).diff(checkIn, 'days')

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFilter(prev => ({ ...prev, hotelName: e.target.value }))
  }

  return (
    <Container className='pb-20'>
      <div className='flex items-center justify-center'>
        <p className='text-center mb-20 text-4xl font-bold text-slate-700'>{loading ? <Skeleton width={200} variant='text' /> : `${count} search resuls found`}</p>
      </div>

      <div className='flex flex-col lg:flex-row gap-10'>

        <div>
          <div className='bg-red-500 p-5 rounded-lg flex flex-col gap-2'>
            <p className='text-xl text-white'>Search by hotel name</p>
            <input title='Search Hotel' placeholder='Search Hotel' value={filter.hotelName} onChange={handleChange} className='rounded-lg px-5 py-3' />
          </div>
        </div>

        <div className='flex flex-col gap-10 w-full'>
          {loading ? (
            <div className='relative w-full flex items-center justify-center h-96'>
              <Skeleton variant='rounded' className='absolute w-full h-full' />
            </div>
          ) : data?.map((item) => (
            <div key={item?._id as string} className='bg-white p-6 rounded-md flex flex-col lg:flex-row gap-10 justify-between'>
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

                <div className='flex flex-col lg:py-5 justify-between'>
                  <div className='flex flex-col gap-4'>
                    <p className='text-4xl font-semibold'>{item?.name}</p>
                    <div className='flex gap-2 items-center'>
                      {Array(5).fill(2)?.map((star, i) => (
                        <FaStar key={i} color="orange" />
                      ))}
                      <p className='text-slate-700 text-xl mt-1'>4.5 (1200 Reviews)</p>
                    </div>

                    <p className='text-xl text-slate-700 lg:w-[40rem]'>Live a little and celbrate with champagne. Reats include a glass of French champagne, parking and a late checkout. Gym included. Flexible cancellation applies</p>
                  </div>

                  <div className='flex gap-2 items-center'>
                    <IoLocation />
                    <p className='text-lg'>{item?.address?.City}</p>
                  </div>

                  <div className='flex gap-10'>
                    <Link href={{ pathname: `/Hotels/${item?._id}`, query: searchData }} >
                      <Button variant='outlined' className=' py-4 w-fit px-10 text-red-500 font-medium border-red-500 border-2 text-xl capitalize' size='large'>
                        View Details
                      </Button>
                    </Link>

                    <BookRoom hotelId={item._id as string} />
                  </div>
                </div>

              </div>

              <div className='flex flex-col items-end justify-between gap-5 lg:py-5'>
                <div></div>

                <div className='flex flex-col items-end gap-1'>
                  <div className='flex gap-2'>
                    {searchParams.has('rooms') && <span className='text-xl'>{rooms} room{rooms > 1 && 's'}</span>}
                    {searchParams.has('checkIn') && searchParams.has('checkOut') && <span className='text-xl'>{totalDays} day{totalDays > 1 && 's'}</span>}
                  </div>
                  <p className='text-4xl font-semibold'>&#8377;{Number(item?.rooms?.[0]?.price) * totalDays}</p>
                  <p className='text-slate-700 text-lg'>&#8377;{item?.rooms?.[0]?.fee} taxes and fees</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filter.pageSize < count && <div className='flex items-center justify-center my-10'>
        <Button disabled={loading} onClick={() => { setFilter(prev => ({ ...prev, page: Number(prev?.page) + 1, pageSize: Number(prev?.pageSize) + 1 })); setIsLoadMore(true) }}
          className='bg-[rgba(254,82,82,0.21)] text-red-500 font-bold px-10 py-5 text-xl' size='large'>
          {isLoadMore ? <CircularProgress size={20} color='error' /> : 'Load More Results'}
        </Button>
      </div>}
    </Container>
  )
}

export default HotelListClient