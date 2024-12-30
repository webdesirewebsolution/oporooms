import Footer from '@/Components/Footer'
import Header from '@/Components/Header'
import { Container } from '@mui/material'
import Image from 'next/image'
import React from 'react'
import Enquiry from './Enquiry'

const features = [
    {
        title: "User Authentication and Authorization",
        details: [
            "Secure corporate login for employees using Single Sign-On (SSO).",
            "Role-based access (e.g., employees, managers, admin).",
        ],
    },
    {
        title: "Travel Booking Options",
        details: [
            "Flights: Integration with major airlines' APIs or global distribution systems (GDS).",
            "Hotels: hotel booking With (Opo Rooms Partner Hotels).",
            "Trains: Support for regional train services through APIs.",
            "Buses: Integration with local and international bus service providers.",
        ],
    },
    {
        title: "Expense Management",
        details: [
            "Automated invoicing and billing.",
            "Integration with corporate accounting systems for expense tracking.",
        ],
    },
    {
        title: "Customization",
        details: [
            "Corporate discounts and negotiated rates.",
            "Policy enforcement for budget and travel guidelines.",
        ],
    },
    {
        title: "Notifications",
        details: [
            "Real-time updates via email, SMS, or app notifications (e.g., booking confirmations, delays).",
        ],
    },
    {
        title: "Reports and Analytics",
        details: [
            "Travel trends and expense reports for management.",
            "Employee-specific travel history.",
        ],
    },
];

const OpoBusiness = () => {
    return (
        <>
            <Header />
            <div>
                <div className='w-screen aspect-video relative'>
                    <Image src='/Images/listPropertyBanner.jpg' alt='Banner' fill objectFit='cover' />

                    <div className='absolute size-full bg-gradient-to-r from-gray-800 to-transparent'>
                        <Container className='flex flex-col lg:flex-row justify-between items-center h-full'>

                            <div className='p-10 flex flex-col gap-10'>
                                <h1 className='text-white text-8xl font-extrabold'>OPO for business</h1>
                                <h2 className='text-white max-w-[50rem] w-full'>A single corporate portal that allows users to log in and book hotels, flights, trains, and buses is a practical solution for streamlining travel management for businesses. Here's a high-level overview of how such a portal could be designed and implemented:
                                </h2>
                            </div>

                            <div className='bg-white p-10 rounded-xl'>
                                <Enquiry />
                            </div>
                        </Container>
                    </div>
                </div>
                <div className='min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800'>
                    <Container className='py-10'>
                        {/* Features Section */}
                        <div className="container mx-auto my-12 px-4">
                            <div className="text-center mb-10">
                                <p className="text-3xl font-bold text-blue-600">
                                    Features of the Portal
                                </p>
                                <p className="text-gray-600 mt-2">
                                    Empower your corporate travel with cutting-edge features.
                                </p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="bg-white rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-t-4 border-blue-500 hover:border-blue-700"
                                    >
                                        <p className="text-xl font-semibold text-blue-600 mb-4">
                                            {feature.title}
                                        </p>
                                        <ul className="space-y-2 text-gray-700">
                                            {feature.details.map((item, idx) => (
                                                <li key={idx} className="flex items-start space-x-2">
                                                    <span className="text-blue-500">•</span>
                                                    <p>{item}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Implementation Steps */}
                        <div className="bg-blue-50 py-12">
                            <div className="container mx-auto text-center">
                                <p className="text-3xl font-bold text-blue-600">Implementation Steps</p>
                                <p className="text-gray-600 mt-2">
                                    Streamline the integration process step by step.
                                </p>
                                <div className="mt-8 bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
                                    <p className="text-xl font-semibold text-gray-800 mb-4">
                                        1. Requirements Analysis
                                    </p>
                                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                                        <li>Gather corporate needs and policies.</li>
                                        <li>Identify preferred travel service providers and integrations.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default OpoBusiness