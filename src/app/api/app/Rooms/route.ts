"use server"

import { NextRequest, NextResponse } from "next/server";
import {  getRooms } from "@/server/db";

export async function GET(req: NextRequest) {
    const searchParams: { [key: string]: any } = {}

    for (const [key, value] of req.nextUrl.searchParams.entries()) {
        searchParams[key] = value
    }

    try {
        const { totalSize, bookingSize } = await getRooms({ type: searchParams.type, hotelId: searchParams.hotelId })
        return NextResponse.json({ totalSize, bookingSize }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}