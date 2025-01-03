import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import 'swiper/css';
import 'swiper/css/pagination';
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import ContextProvider from "@/Context/context";
import { Session } from "next-auth";
import Script from "next/script";
import { newDate } from "@/Functions";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Oporooms | Book Hotels, Flights, Buses & Trains Online",
  description: "Plan your journey effortlessly with Oporooms. Book hotels, flights, buses, and trains at the best prices. Enjoy secure payments, exclusive deals, and a seamless booking experience all in one place!",
  keywords: ["hotel booking, flight booking, bus booking, train booking, online travel, Oporooms, cheap hotels, travel deals, affordable flights, bus tickets, train tickets, online reservations, travel planning, vacation booking, travel discounts, secure bookings"],
  alternates: {
    canonical: {
      url: '/',
    }
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
    },
  },
  authors: [{ name: 'Webdesire Team', url: 'https://webdesire.in' }],
  creator: 'WebDesire',
  publisher: 'WebDesire',
  appleWebApp: {
    title: 'Oporooms',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()

  newDate(new Date())

  return (
    <html lang="en">

      <Script defer async id='GoogleMaps' strategy='lazyOnload'
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBOjiEhtSB9GwO0UJGqzlDkJvqm2iufO6U&loading=async&libraries=places&callback=initMap">
      </Script>

      {/* <Script async defer id='Travel' src='https://tp.media/content?currency=inr&trs=377316&shmarker=596056&show_hotels=false&powered_by=true&locale=en&searchUrl=www.aviasales.com%2Fsearch&primary_override=%23ee292c&color_button=%23ee292c&color_icons=%23ee292c&dark=%23262626&light=%23FFFFFF&secondary=%23FFFFFF&special=%23C4C4C4&color_focused=%23ee292c&border_radius=10&no_labels=&plain=true&promo_id=7879&campaign_id=100'></Script> */}

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
        suppressContentEditableWarning={true}
      >
        <SessionProvider session={session}>
          <ContextProvider session={session as Session}>
            <main className="min-h-screen flex flex-col">
              {children}
            </main>
          </ContextProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
