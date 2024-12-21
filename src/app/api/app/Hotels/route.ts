"use server"

import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
import { Collection } from "mongodb";
import { HotelTypes } from "@/Types/Hotels";

export async function GET(req: NextRequest) {
    const hotelColl: Collection<HotelTypes> = client.collection('Hotels')
    const body = <T>(p: string) => req.nextUrl.searchParams.get(p) as T

    console.log(body)

    try {
        const data = await hotelColl.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [Number(body('lng')), Number(body('lat'))] },
                    distanceField: "dist.calculated",
                    includeLocs: "location",
                    spherical: true,
                    minDistance: 0,
                    maxDistance: 10000,
                },
            },
        ])
        // .limit(Number(body('limit')) || 10)
        .skip(0).toArray()

        const counts = await hotelColl.aggregate([
            {
                $geoNear: {
                    near: { type: "Point", coordinates: [Number(body('lng')), Number(body('lat'))] },
                    distanceField: "dist.calculated",
                    includeLocs: "location",
                    spherical: true,
                    minDistance: 0,
                    maxDistance: 10000,
                },
            },
            {
                $count: 'count'
            }
        ])
        // .limit(Number(body('limit')) || 10)
        .skip(0).toArray()

        return NextResponse.json({ data, counts }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error }, { status: 500 })
    }
}