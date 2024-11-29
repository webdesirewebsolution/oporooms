import React from 'react'
import axios from 'axios'
import Header from '@/Components/Header'
import Footer from '@/Components/Footer'
import { Container } from '@mui/material'

const PrivacyPolicy = async () => {
    const data = await (await axios.get(`${process.env.SERVERURL}/api/Policy?contentType=PrivacyPolicy`)).data

    return (
        <>
            <Header />
            <Container className='py-10'>
                <h1 className='font-semibold text-3xl my-5'>Privacy Policy</h1>
                {data?.content && <div dangerouslySetInnerHTML={{ __html: data?.content }} />}
            </Container>
            <Footer />
        </>
    )
}

export default PrivacyPolicy