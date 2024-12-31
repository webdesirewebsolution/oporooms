import Header from '@/Components/Header'
import SearchHotel from '@/Components/SearchHotel'
import React from 'react'
import Footer from '@/Components/Footer';
import { SearchParams } from 'next/dist/server/request/search-params';
import { Container } from '@mui/material';
import { FaStar } from 'react-icons/fa6';
import { IoLocation } from 'react-icons/io5';
import Link from 'next/link';
import BookRoom from '@/Components/BookRoom';
import SliderImage from './SliderImage';
import SearchInput, { Filter } from './SearchInput';
import Description from '@/Components/Description';
import { getHotels } from '@/server/db';
import UserForm from '@/Components/UserForm';
import { Params } from 'next/dist/server/request/params';
import dayjs from 'dayjs';
import Button from '@/Components/Buttons'

type Props = {
    params: Promise<Params>
    searchParams: Promise<SearchParams>
}

const HotelList = async ({ params, searchParams }: Props) => {
    const paramsRes = await params
    const searchParamsRes = await searchParams
    return (
        <>
            <Header />
            <div className='bg-[rgb(244,244,244,1)]'>
                <SearchHotel />

                <HotelListClient searchParams={searchParamsRes} />
            </div>
            <Footer />
        </>
    )
}

const HotelListClient = async ({ searchParams }: { searchParams: SearchParams }) => {
    const { data, count } = await getHotels({ searchParams })

    const limit = searchParams?.limit ? Number(searchParams?.limit) : 0
    const rooms = searchParams?.rooms ? Number(searchParams?.rooms) : 0
    const checkIn = searchParams?.checkIn && Number(searchParams.checkIn)
    const checkOut = searchParams?.checkOut && Number(searchParams.checkOut)
    const totalDays = (checkIn && checkOut) ? dayjs(checkOut).diff(checkIn, 'days') : 0

    return (
        <Container className='pb-20'>
            <div className='flex items-center justify-center'>
                {count == 0 && <p className='text-center mb-20 text-4xl font-bold text-slate-700'>{count == 0 && 'No Hotels Found'}</p>}
            </div>

            <div className='flex flex-col lg:flex-row gap-10'>

                <div className='flex flex-col gap-10'>
                    <div className='bg-red-500 p-5 rounded-lg flex flex-col gap-2'>
                        <p className='text-xl text-white'>Search by hotel name</p>
                        <SearchInput searchParams={searchParams} />
                    </div>

                    <p>Filter results</p>

                    <div className='bg-red-500  rounded-lg flex flex-col gap-2'>
                        <p className='text-xl text-white p-5'>Price Range</p>
                        <Filter searchParams={searchParams} />
                    </div>
                </div>

                <div className='flex flex-col gap-10 w-full'>
                    {data?.length > 0 ? data?.map((item) => (
                        <div key={item?._id as string} className='bg-white p-6 rounded-md flex flex-col lg:flex-row gap-10 justify-between relative'>
                            <div className='flex flex-col lg:flex-row gap-10'>
                                {item?.photos && <SliderImage photos={item.photos} />}

                                <div className='flex flex-col lg:py-5 justify-between'>
                                    <div className='flex flex-col gap-4'>
                                        <p className='text-4xl font-semibold'>{item?.name}</p>
                                        <div className='flex gap-2 items-center'>
                                            {Array(5).fill(2)?.map((star, i) => (
                                                <FaStar key={i} color="orange" />
                                            ))}
                                            <p className='text-slate-700 text-xl mt-1'>4.5 (1200 Reviews)</p>
                                        </div>

                                        <Description text={item.desc} className='lg:w-[40rem]' />
                                    </div>

                                    <div className='flex gap-2 items-center my-5'>
                                        <IoLocation />
                                        <p className='text-lg w-[40rem]'>{item?.address?.Locality}, {item?.address?.City}</p>
                                    </div>

                                    <div className='flex gap-10'>
                                        <Link href={{ pathname: `/Hotels/${item?._id}`, query: searchParams }} >
                                            <Button variant='outlined' className=' py-4 w-fit px-10 text-red-500 font-medium border-red-500 border-2 text-xl capitalize' size='large'>
                                                View Details
                                            </Button>
                                        </Link>
                                        <BookRoom hotelId={JSON.parse(JSON.stringify(item))._id as string} />
                                    </div>
                                </div>

                            </div>
                            {/* <div className='absolute right-10 top-0'>
                                {item?.size?.totalSize[0]?.TotalSize == item?.size?.bookingSize?.[0]?.BookingSize &&
                                    <div>
                                        <Image src='/Images/soldout.png' alt=''
                                            width={0}
                                            height={0}
                                            sizes='100vw'
                                            className='w-28'
                                        />
                                    </div>}
                            </div> */}

                            <div className='flex flex-col items-end justify-between gap-5 lg:py-5'>
                                <div></div>

                                <div className='flex flex-col items-end gap-1'>
                                    <div className='flex gap-2'>
                                        {searchParams?.rooms && <span className='text-xl'>{rooms} room{rooms > 1 && 's'}</span>}
                                        {searchParams?.checkIn && searchParams?.checkOut && <span className='text-xl'>{totalDays} day{totalDays > 1 && 's'}</span>}
                                    </div>
                                    <p className='text-4xl font-semibold'>&#8377;{Number(item?.rooms?.[0]?.price) + (Number(item?.rooms?.[0]?.price) * 0.18)}</p>
                                    <p className='text-slate-700 text-lg'>Per Night</p>
                                    <p className='text-slate-700 text-lg'>Including taxes and fees</p>
                                </div>
                            </div>
                        </div>
                    ))
                        : (
                            <div className='flex flex-col w-full items-center'>
                                <UserForm />
                            </div>
                        )
                    }
                </div>
            </div>

            {count > 0 && (limit <= count) &&
                <div className='flex items-center justify-center my-10'>
                    <Link passHref replace scroll={false} href={{
                        query: {
                            ...searchParams,
                            limit: limit + 20,
                        },
                    }}>
                        <Button
                            className='bg-[rgba(254,82,82,0.21)] text-red-500 font-extrabold px-10 py-5 capitalize text-xl' size='large'>
                            Load more results
                        </Button>
                    </Link>
                </div>}
        </Container>
    )
}

export default HotelList