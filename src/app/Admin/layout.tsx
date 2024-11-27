import type { Metadata } from "next";
import "./global.css";
import { auth } from "@/auth";
import SignIn from "./Components/SignIn";
import Header from "./Components/Header";
import ContextProvider from "@/Context/context";

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

  return (
    <Header>
      {children}
    </Header>
  );
}
