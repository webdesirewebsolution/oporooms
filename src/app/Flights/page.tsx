import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import { FlightSearchBox } from '@/Components/SearchBox'
import { Container } from '@mui/material'
import React from 'react'
import { SearchParams } from 'next/dist/server/request/search-params'
import SelectFlight from './SelectFlight'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/Components/Buttons'

type Props = {
  searchParams: Promise<SearchParams>
}

const Flights = async ({ searchParams }: Props) => {
  const sParams = await searchParams
  return (
    <>
      <Header />
      <div className='bg-[rgb(244,244,244,1)]'>
        <Container className='py-10'>
          <FlightSearchBox />

          <FlightList searchParams={sParams} />
        </Container>

      </div>
      <Footer />
    </>
  )
}

type ListProps = {
  searchParams: SearchParams
}

const FlightList = ({ searchParams }: ListProps) => {
  return (
    <div className='flex flex-col lg:flex-row gap-10 w-full mt-10'>

      <div className='flex flex-col gap-10'>
        <div className='bg-white p-5 rounded-lg flex flex-col gap-2'>
          <p className='text-xl text-nowrap'>Price</p>
          <input type='range'/>
        </div>
      </div>

      <div className='flex flex-col gap-10 w-full'>
        <FlightCard data={{
          id: '1',
          logo: 'https://logos-world.net/wp-content/uploads/2020/12/Air-India-Logo.png',
          airline: 'Air India',
          departureTime: '10:00 AM',
          departureCity: 'Delhi',
          duration: '2h 30m',
          stops: 'Non-stop',
          arrivalTime: '12:30 PM',
          arrivalCity: 'Mumbai',
          price: '₹ 5000'
        }} searchParams={searchParams} />

        <FlightCard data={{
          id: '2',
          logo: 'https://logos-world.net/wp-content/uploads/2020/12/Air-India-Logo.png',
          airline: 'Air India',
          departureTime: '10:00 AM',
          departureCity: 'Delhi',
          duration: '2h 30m',
          stops: 'Non-stop',
          arrivalTime: '12:30 PM',
          arrivalCity: 'Mumbai',
          price: '₹ 5000'
        }} searchParams={searchParams} />
      </div>
    </div>
  )
}

interface FlightData {
  id: string,
  airline: string;
  logo: string;
  departureTime: string;
  departureCity: string;
  duration: string;
  stops: string;
  arrivalTime: string;
  arrivalCity: string;
  price: string;
}


const FlightCard: React.FC<{ data: FlightData, searchParams: SearchParams }> = ({ data, searchParams }) => {
  return (
    <div className='bg-white rounded-md shadow-md p-10 flex flex-col md:flex-row gap-10'>

      <div className='aspect-square relative self-center w-48'>
        <Image src="/Images/samples/flightlogo1.png" alt='Emirates' fill className='object-contain' />
      </div>

      <div className='flex flex-col flex-1 gap-5'>
        <div className='flex gap-5 flex-col md:flex-row justify-between'>
          <div className='flex flex-col justify-between gap-5'>
            <div className='flex gap-5 items-center'>
              <p className='border-2 border-green-400 p-2 rounded-lg text-lg'>4.2</p>
              <p className='text-lg'>Very Good <span className='text-lg'>54 reveiws</span></p>
            </div>

            <div className='flex flex-col items-center md:flex-row gap-5 md:gap-10 md:items-start'>
              <div className='flex gap-5 items-start'>
                <input type='checkbox' className='size-6' />
                <div>
                  <p className='text-2xl font-medium'>12:00pm</p>
                  <p className='text-lg text-slate-500 font-light'>Emirates</p>
                </div>
                <p>-</p>
                <p className='text-2xl font-medium'>01:28pm</p>
              </div>

              <p className='text-slate-700 text-xl'>non stop</p>

              <div>
                <p className='text-2xl font-medium'>2h 28m</p>
                <p className='text-lg text-slate-500 font-light'>EWR-BNA</p>
              </div>
            </div>

            <div className='flex flex-col items-center md:flex-row gap-5 md:gap-10 md:items-start'>
              <div className='flex gap-5 items-start'>
                <input type='checkbox' className='size-6' />
                <div>
                  <p className='text-2xl font-medium'>12:00pm</p>
                  <p className='text-lg text-slate-500 font-light'>Emirates</p>
                </div>
                <p>-</p>
                <p className='text-2xl font-medium'>01:28pm</p>
              </div>

              <p className='text-slate-700 text-xl'>non stop</p>

              <div>
                <p className='text-2xl font-medium'>2h 28m</p>
                <p className='text-lg text-slate-500 font-light'>EWR-BNA</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col md:items-end'>
            <p className='text-lg text-slate-400'>starting from</p>
            <p className='text-red-500 text-3xl font-semibold'>Rs 25,000/-</p>
          </div>
        </div>

        <div className='mt-5 border-t-2 w-full flex gap-5 pt-5'>
          <div></div>
          <Link href='/Checkout?type=flight' passHref legacyBehavior>
            <Button variant='contained' className='w-full py-4 bg-red-500 text-xl'>View Deals</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Flights