import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import axios from 'axios'

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                _id: {
                    label: "_id"
                }
            },
            authorize: async (credentials): Promise<object> => {

                // logic to verify if the user exists
                const user = await axios.get(`${process.env.SERVERURL}/api/User?email=${credentials.email}`)

                if (!user.data) {
                    // No user found, so this is their first attempt to login
                    // Optionally, this is also the place you could do a user registration
                    throw new Error("Invalid credentials.")
                }

                // return user object with their profile data
                return credentials
            },
        }),
    ],

    callbacks: {
        session({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    _id: token.id as string
                }
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id
            }
            return token
        },
    },
})