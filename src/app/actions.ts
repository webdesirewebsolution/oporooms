'use server'

import { signIn } from "@/auth";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { User } from "../Types/Profile";
import { Session } from "next-auth";
import client from '@/Lib/mongo'

export async function loginUser(prevState: unknown, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (email !== "" && password !== "") {
        await axios.get(`${process.env.SERVERURL}/api/login?email=${email}&password=${password}`).then(async (r) => {
            if (r.status == 200) {
                const newContact = r.data?.user?.contact1

                await signIn('credentials', {
                    contact1: newContact,
                    _id: r.data?.user?._id,
                })

                return { message: 'Logged In Successfully' }
            } else {
                return { message: 'Network Error' }
            }
        })
    } else {
        return { message: 'Please provide email and password' }
    }

    revalidatePath('/Admin', 'layout')

}

export async function handleUserEnquiry(prevState: { message: string, status: number }, formData: FormData): Promise<{ message: string, status: number }> {
    const userEnquiryColl = client.collection('UserEnquiry')

    const email = formData.get('email');
    const name = formData.get('name');
    const phone = formData.get('phone') as string;
    const checkin = formData.get('checkin');
    const checkout = formData.get('checkout');

    if (email !== '' && name !== '' && phone?.length >= 10) {
        try {
            await userEnquiryColl.insertOne({ email, name, phone, checkin, checkout })
            revalidatePath('/', 'layout')
            return { message: 'Submitted', status: 200 }
        } catch {
            return { message: 'Something error2', status: 400 }
        }
    }

    return { message: 'Something error', status: 400 }

}

export const getUser = async (session: Session): Promise<User> => {
    const user: User | null = session?.user._id ? (await axios.get(`${process.env.SERVERURL}/api/User?_id=${session.user._id}`)).data : null

    return user as User
}