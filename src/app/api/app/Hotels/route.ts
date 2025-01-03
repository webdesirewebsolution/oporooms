"use server"

import { NextRequest, NextResponse } from "next/server";
import { getHotels } from "@/server/db";

export async function GET(req: NextRequest) {
    const searchParams: { [key: string]: any } = {}

    for (const [key, value] of req.nextUrl.searchParams.entries()) {
        searchParams[key] = value
    }

    try {
        const { data, count, roomData } = await getHotels({ searchParams })
        return NextResponse.json({ data, count, roomData }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}