"use server"

import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
import { ObjectId } from "mongodb";
const hotelColl = client.collection('Hotels')

export async function GET(req: NextRequest) {
    const searchParams: { [key: string]: any } = {}

    for (const [key, value] of req.nextUrl.searchParams.entries()) {
        searchParams[key] = value
    }

    try {
        const data = await hotelColl.findOne({ _id: ObjectId.createFromHexString(searchParams._id as string) })
        return NextResponse.json({ data }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 })
    }
}