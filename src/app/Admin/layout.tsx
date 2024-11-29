import type { Metadata } from "next";
import "./global.css";
import { auth } from "@/auth";
import SignIn from "./Components/SignIn";
import Header from "./Components/Header";

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
    <main className="bg-white">
      <Header>
        {children}
      </Header>
    </main>
  );
}
