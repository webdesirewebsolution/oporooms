import { CompleteBooking, Details, FillingDetails } from '@/Components/CheckoutComponent'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import { MuiPhone } from '@/Components/MuiPhone'
import { Container } from '@mui/material'
import dayjs from 'dayjs'
import { SearchParams } from 'next/dist/server/request/search-params'
import Link from 'next/link'
import { IoAirplane } from 'react-icons/io5'
import { LuDot } from "react-icons/lu";
import FlightFillingDetails, { FlightDetails } from './FlightFillingDetails'
import Button from '@/Components/Buttons'

type Props = {
    searchParams: Promise<SearchParams>
}

const Checkout = async ({ searchParams }: Props) => {
    const sParams = await searchParams

    return (
        <>
            <Header />
            {sParams?.type == 'flight' ? (
                <FlightCheckOut />
            ) : (
                <Container className='py-10'>
                    <h1 className='font-semibold text-3xl'>Secure your reservation</h1>
                    <div className='flex flex-col-reverse lg:flex-row gap-10 my-10'>
                        <div className='flex flex-col gap-10'>
                            <FillingDetails />
                            <div className='bg-white rounded-lg overflow-hidden'>
                                <div className='bg-yellow-500 p-5 text-black flex items-center gap-5'>
                                    Important information about your booking
                                </div>

                                <div className='p-10 flex flex-col gap-10'>
                                    <ol className='list-inside list-decimal flex flex-col gap-2'>
                                        <li className='text-xl text-slate-800'>This rate is non-refundable. If you change or cancel your booking you will not get a refund or credit to use for a future stay.</li>
                                        <li className='text-xl text-slate-800'>Stay extensions will require a new reservation.</li>
                                        <li className='text-xl text-slate-800'>Front desk staff will greet guests on arrival</li>
                                        <li className='text-xl text-slate-800'>No refunds will be issued for late check-in or early check-out.</li>
                                    </ol>

                                    <div className='text-xl text-slate-800 [&>a]:text-xl [&>a]:text-blue-500'>
                                        By clicking the button below, I acknowledge that I have reviewed the {" "}
                                        <Link href='PrivacyPolicy'>Privacy Statement</Link>  {" "}
                                        and have reviewed and accept the {" "}
                                        <Link href='Rules'>Rules and Restrictions</Link> {" "}
                                        and <Link href='Terms'>Terms of Use</Link> {" "}
                                    </div>

                                    <CompleteBooking />
                                </div>
                            </div>
                        </div>
                        <Details />
                    </div>
                </Container>)}
            <Footer />
        </>
    )
}

const FlightCheckOut = () => {
    return (
        <Container className='py-10'>
            <div className='flex gap-5 items-center'>
                <IoAirplane size={50} />
                <div className='flex flex-col gap-3'>
                    <p className='text-2xl md:text-4xl font-semibold'>New Delhi (NDL) -{">"} Mumbai(BOX)</p>
                    <div className='*:text-lg flex gap-1 items-center'>
                        <p>{dayjs(new Date()).format('dddd, D MMM')}</p>
                        <LuDot />
                        <p>Non stop</p>
                        <LuDot />
                        <p>9hr 50min</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col-reverse md:flex-row gap-10 my-10'>
                <div className='flex flex-col gap-10'>
                    <div className='bg-white rounded-lg overflow-hidden p-5'>
                        <p className='font-medium'>Flight Summary</p>
                        <div className='flex items-center justify-between my-4'>
                            <p className='text-lg md:text-xl font-semibold'>ABC Airline</p>
                            <p className='text-lg md:text-xl text-red-500 font-light'>Non-refundable</p>
                            <p className='text-lg md:text-xl'>Travel Class: <span className='font-semibold text-lg md:text-xl'>Economy</span></p>
                        </div>

                        <div className='p-5 bg-[#FFF1E4] rounded-lg flex flex-col md:flex-row gap-8 justify-between'>
                            <div>
                                <p className='text-xl font-semibold'>NDL</p>
                                <p className='text-lg font-semibold'>14:50</p>
                                <p className='text-lg'>{dayjs(new Date()).format('ddd, D MMM YYYY')}</p>
                                <p className='text-lg text-wrap md:max-w-52'>New Delhi Airport, Terminal - 2 Gate-25</p>
                            </div>
                            <div className='hidden md:flex flex-col items-center justify-center flex-1'>
                                <p className='text-lg'>9hr 50min</p>
                                <div className='flex items-center gap-1 w-full'>
                                    <div className='w-full border' />
                                    <IoAirplane size={25} color='#ccc' />
                                    <div className='w-full border' />
                                </div>
                            </div>
                            <div>
                                <p className='text-xl font-semibold'>BOX</p>
                                <p className='text-lg font-semibold'>14:50</p>
                                <p className='text-lg'>{dayjs(new Date()).format('ddd, D MMM YYYY')}</p>
                                <p className='text-lg text-wrap md:max-w-52'>Chhatrapati Shivaji Airport, Terminal - 2 Gate-25</p>
                            </div>

                            <div className='flex flex-col md:flex-row gap-5 md:items-center'>
                                <div>
                                    <p className='text-lg'>Buggage</p>
                                    <p className='text-lg font-semibold'>ADULT</p>
                                </div>
                                <div>
                                    <p className='text-lg'>Check-in</p>
                                    <p className='text-lg font-semibold'>13kgs (1 Piece * 23kgs)</p>
                                </div>
                                <div>
                                    <p className='text-lg'>Cabin</p>
                                    <p className='text-lg font-semibold'>7kgs (1 Piece * 7kgs)</p>
                                </div>
                            </div>
                        </div>

                        <div className='flex flex-col md:flex-row md:items-center gap-5 my-4'>
                            <div className='flex items-center gap-2'>
                                <p className='text-lg'>Separate tickets booked together for cheaper price</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <p className='text-lg'>Change of Terminal</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <p className='text-lg'>Self Transfer</p>
                            </div>
                            <div className='flex items-center gap-2'>
                                <p className='text-lg'>7kg</p>
                            </div>
                        </div>

                        <div className='p-3 bg-slate-200 rounded-lg'>
                            <p className='text-lg'>Sorry, extra check-in baggage allowance details are not available currently from airline.</p>
                        </div>
                    </div>

                    <FlightFillingDetails />

                    <div className='bg-white rounded-lg overflow-hidden p-5 flex flex-col gap-10'>
                        <p>Important information about your booking</p>

                        <p className='text-xl text-slate-800'>
                            When booking a flight, it is important for passengers to follow certain guidelines to ensure a smooth and stress-free experience. Here are some important guidelines for passengers to observe when booking a flight:
                        </p>

                        <ol className='list-inside list-decimal flex flex-col gap-2'>
                            <li className='text-xl text-slate-800'>
                                Double-Check Travel Details: Before confirming your booking, carefully review all travel details, including dates, destinations, and passenger information. Ensure that the information entered is accurate to avoid any complications later on.

                            </li>
                        </ol>

                        <div className='text-xl text-slate-800 [&>a]:text-xl [&>a]:text-blue-500'>
                            By clicking the button below, I acknowledge that I have reviewed the {" "}
                            <Link href='PrivacyPolicy'>Privacy Statement</Link>  {" "}
                            and have reviewed and accept the {" "}
                            <Link href='Rules'>Rules and Restrictions</Link> {" "}
                            and <Link href='Terms'>Terms of Use</Link> {" "}
                        </div>
                    </div>

                    <div className='bg-white rounded-lg overflow-hidden p-5 flex flex-col gap-10'>
                        <p>Cancellation/Refund Policy</p>

                        <p className='text-xl text-slate-800'>
                            At GlobGoer, we understand that plans can change unexpectedly. We strive to provide a flexible and customer-friendly cancellation and refund policy for flight bookings. Please review the following policy details:
                        </p>

                        <ol className='list-inside list-decimal flex flex-col gap-2'>
                            <li className='text-xl text-slate-800'>
                                Cancellation Requests:
                                All cancellation requests must be submitted through our website or by contacting our customer support team.
                                Cancellation requests made through our website should be done by accessing your booking and following the cancellation process.
                            </li>
                        </ol>
                    </div>

                    <div className='flex items-center justify-between'>
                        <Button className='border border-red-500 py-5 !px-16 text-red-500' variant='outlined'>Cancel</Button>
                        <Button className='border bg-red-500 py-5 !px-16 text-white' variant='contained'>Proceed to Payment</Button>
                        {/* <CompleteBooking /> */}
                    </div>
                </div>
                <FlightDetails />
            </div>
        </Container>
    )
}

export default Checkout