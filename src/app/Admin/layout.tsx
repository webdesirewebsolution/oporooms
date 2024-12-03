import type { Metadata } from "next";
import "./global.css";
import { auth } from "@/auth";
import SignIn from "./Components/SignIn";
import Header from "./Components/Header";
import { getUser } from "../actions";
import { Session } from "next-auth";

export const metadata: Metadata = {
  title: "Oporooms Admin",
  description: "Admin panel for oporooms",
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await auth()
  if (!session?.user) return <SignIn />
  const user = await getUser(session as Session)

  if (user?.userRole == 'CADMIN' || user?.userRole == 'SADMIN' || user?.userRole == 'HR' || user?.userRole == 'HotelOwner' || user?.email == 'oporooms@gmail.com') {
    return (
      <main className="bg-white">
        <Header>
          {children}
        </Header>
      </main>
    );
  } else return (
    <>
      You are not signin as admin
    </>
  )
}
