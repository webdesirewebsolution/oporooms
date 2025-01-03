import React from "react"
import { Bookings } from "./Booking"
import { User } from "./Profile"

export type ContextType = {
    user: User,
    bookingData: Bookings,
    setBookingData: React.Dispatch<React.SetStateAction<Bookings>>
    bookingSubmitLoading: boolean,
    setBookingSubmitLoading: React.Dispatch<React.SetStateAction<boolean>>,
    authModal: 'SignIn' | 'Register' | '',
    setAuthModal: React.Dispatch<React.SetStateAction<'SignIn' | 'Register' | ''>>,
    selectedFlight: {id: string},
    setSelectedFlight: React.Dispatch<React.SetStateAction<{id: string}>>
}