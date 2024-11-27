'use client'

import { getUser } from "@/app/actions";
import { ContextType } from "@/Types/context";
import { User } from "@/Types/Profile";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useState } from "react";

const initialData: ContextType = {
    user: {
        _id: '',
        username: '',
        userRole: 'SADMIN',
        email: '',
        photo: ''
    }
}

export const Context = createContext<ContextType>(initialData)

type Props = {
    children: ReactNode
}

const ContextProvider = ({ children }: Props) => {
    const { status, data: session } = useSession()
    const [user, setUser] = useState<User>(initialData.user)

    useEffect(() => {
        (async () => {
            if (status == 'authenticated') {
                await getUser(session as Session).then((r) => setUser(r))
            }
        }
        )()

    }, [session, status])

    return (
        <Context.Provider value={{ user }}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider