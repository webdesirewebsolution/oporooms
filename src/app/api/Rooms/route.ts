"use server";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Rooms");
const myBookings = client.collection("Bookings");

export async function POST(req: NextRequest) {
    const { hotelOwnerId, hotelId, ...rest } = await req.json();

    try {
        const isRoomExist = await myColl.countDocuments({ hotelId: ObjectId.createFromHexString(hotelId), number: rest.number })

        if (isRoomExist > 0) return NextResponse.json({ msg: 'Room Already Exist' }, { status: 400 });
        else {
            await myColl.insertOne({
                hotelOwnerId: ObjectId.createFromHexString(hotelOwnerId),
                hotelId: ObjectId.createFromHexString(hotelId),
                ...rest
            });

            return NextResponse.json({ msg: 'Success' }, { status: 200 });
        }

    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}


export async function GET(req: NextRequest) {
    const searchParams = <T>(p: string) => req.nextUrl.searchParams.get(p) as T
    const searchParamsKeys = req.nextUrl.searchParams.entries()
    const page: number = searchParams('page')
    const pageSize: number = searchParams('pageSize')

    const searchKeys: { [key: string]: unknown } = {}

    for (const [keys, values] of searchParamsKeys) {
        if (ObjectId.isValid(values) && keys !== 'page' && keys !== 'pageSize') {
            searchKeys[keys] = ObjectId.createFromHexString(values)
        } else
            if (typeof values !== 'undefined' && values !== 'undefined' && values !== null && values !== 'null' && keys !== 'page' && keys !== 'pageSize' && keys !== 'checkExist') {
                searchKeys[keys] = values
            }
    }


    try {
        const list = await myColl.aggregate([
            {
                $match: searchKeys
            },
            {
                '$addFields': {
                    'id': {
                        '$toString': '$_id'
                    }
                }
            }, {
                '$lookup': {
                    'from': 'Bookings',
                    'localField': 'id',
                    'foreignField': 'assignedRooms._id',
                    'as': 'BookingsData'
                }
            }, {
                '$lookup': {
                    'from': 'Hotels',
                    'localField': 'hotelId',
                    'foreignField': '_id',
                    'as': 'HotelData'
                }
            }
        ]).limit(Number(pageSize)).skip(Number(page)).toArray()

        const count = await myColl.countDocuments(searchKeys)
        return NextResponse.json({ list, count }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 400, statusText: 'Something error' });
    }
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { _id, ...rest } =
        body;

    const data: { [key: string]: unknown } = {}

    Object.entries(rest).forEach(item => {
        if (ObjectId.isValid(item?.[1] as ObjectId) && String(item[1])?.length == 24 && typeof item[1] == 'string') {
            data[item?.[0]] = ObjectId.createFromHexString(item?.[1] as string)
        } else {
            data[item?.[0]] = item?.[1]
        }
    })

    try {
        await myColl.updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    ...data
                },
            }
        );

        return NextResponse.json({
            msg: 'Success',
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error
        }, { status: 400 });
    }
}

export async function DELETE(req: NextRequest) {
    const body = req.url;
    const id = body?.split("?")[1]?.split("=")[1];

    try {
       
            await myColl.deleteOne({ _id: ObjectId.createFromHexString(id) });
        return NextResponse.json({
            status: 200,
            msg: 'Success'
        });
    } catch (error) {
        return NextResponse.json({
            status: 400,
            error
        });
    }
}