import CheckoutComponent, { CompleteBooking, Details, FillingDetails } from '@/Components/CheckoutComponent'
import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import { Container } from '@mui/material'
import Link from 'next/link'

const Checkout = () => {
    return (
        <>
            <Header />
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
            </Container>
            <Footer />
        </>
    )
}

export default Checkout