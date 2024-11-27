'use server'

import { auth, signIn } from "@/auth";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { User } from "../Types/Profile";
import { Session } from "next-auth";

export async function loginUser(prevState: unknown, formData: FormData) {
    const email = formData.get('email');
    const password = formData.get('password');

    if (email !== "" && password !== "") {
        await axios.get(`${process.env.SERVERURL}/api/login?email=${email}&password=${password}`).then(async (r) => {

            console.log(r.data)

            if (r.status == 200) {
                await signIn('credentials', {
                    redirect: true,
                    email,
                    _id: r.data?.user?._id
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

export const getUser = async (session: Session): Promise<User> => {
    const user: User | null = session?.user._id ? (await axios.get(`${process.env.SERVERURL}/api/User?_id=${session.user._id}`)).data : null

    return user as User
}