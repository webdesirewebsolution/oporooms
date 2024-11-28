'use client'

import { getUser } from "@/app/actions";
import { Bookings } from "@/Types/Booking";
import { ContextType } from "@/Types/context";
import { User } from "@/Types/Profile";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useState } from "react";

const initialData: ContextType = {
    user: {
        _id: '',
        username: '',
        userRole: '',
        email: '',
        photo: ''
    },
    bookingData: {} as Bookings,
    setBookingData: () => { },
    bookingSubmitLoading: false,
    setBookingSubmitLoading: () => { }
}

export const Context = createContext<ContextType>(initialData)

type Props = {
    children: ReactNode
}

const ContextProvider = ({ children }: Props) => {
    const { status, data: session } = useSession()
    const [user, setUser] = useState<User>(initialData.user)
    const [bookingData, setBookingData] = useState<Bookings>({} as Bookings)
    const [bookingSubmitLoading, setBookingSubmitLoading] = useState(false)

    useEffect(() => {
        (async () => {
            if (status == 'authenticated') {
                await getUser(session as Session).then((r) => setUser(r))
            }
        }
        )()

    }, [session, status])

    return (
        <Context.Provider value={{ user, bookingData, setBookingData, bookingSubmitLoading, setBookingSubmitLoading }}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider