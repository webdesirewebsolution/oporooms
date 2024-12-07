'use client'

import { getUser } from "@/app/actions";
import { Bookings } from "@/Types/Booking";
import { ContextType } from "@/Types/context";
import { User } from "@/Types/Profile";
import { Session } from "next-auth";
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
    setBookingSubmitLoading: () => { },
    authModal: '',
    setAuthModal: () => {}
}

export const Context = createContext<ContextType>(initialData)

type Props = {
    children: ReactNode,
    session: Session
}

const ContextProvider = ({ children, session }: Props) => {
    // const { status, data: session } = useSession()
    const [user, setUser] = useState<User>(initialData.user)
    const [bookingData, setBookingData] = useState<Bookings>({} as Bookings)
    const [bookingSubmitLoading, setBookingSubmitLoading] = useState(false)
    const [authModal, setAuthModal] = useState<'SignIn' | 'Register' | ''>('')

    useEffect(() => {
        (async () => {
            if (session?.user) {
                await getUser(session as Session).then((r) => setUser(r))
            }
        }
        )()

    }, [session])

    return (
        <Context.Provider value={{ user, bookingData, setBookingData, bookingSubmitLoading, setBookingSubmitLoading, authModal, setAuthModal }}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider