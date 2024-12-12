"use server";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Transactions");
import { Collection, ObjectId } from "mongodb";
import { auth } from "@/auth";
import { User } from "@/Types/Profile";
const UserColl: Collection<User> = client.collection("Users");

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { ...rest } = body;

    try {
        const result = await myColl.insertOne({ ...rest, createdAt: new Date() });
        return NextResponse.json({ msg: result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ status: 400, error });
    }
}

export async function GET(req: NextRequest) {
    const session = await auth()
    const searchParams = <T>(p: string) => req.nextUrl.searchParams.get(p) as T
    const searchParamsKeys = req.nextUrl.searchParams.entries()
    const page: number = searchParams('page')
    const pageSize: number = searchParams('pageSize')

    const searchKeys: { [key: string]: unknown | object } = {}

    if (!session?.user._id) {
        return NextResponse.json("User must be signed in", { status: 400, statusText: 'User must be signed in' });
    }

    const user = session?.user?._id ? await UserColl.findOne({ _id: ObjectId.createFromHexString(session?.user?._id as string) }) : { _id: null, userRole: null }

    if (user?.userRole != 'SADMIN' 
        // && user?.userRole != 'HR' && user?.userRole != 'HotelOwner' && user?.userRole != 'CADMIN'
    ) {
        return NextResponse.json("User must be signed in as admin", { status: 400, statusText: 'User must be signed in as admin' });
    }

    switch (user?.userRole) {
        case 'HotelOwner' as string:
            break;
        default:
            break;
    }

    for (const [keys, values] of searchParamsKeys) {
        if (keys == 'from') {
            searchKeys['created_at'] = {
                ...searchKeys['created_at'] as object,
                "$gte": new Date(Number(values))
            }
        } else if (keys == 'to') {
            searchKeys['created_at'] = {
                ...searchKeys['created_at'] as object,
                "$lte": new Date(Number(values))
            }
        } else if (typeof values !== 'undefined' && values !== 'undefined' && values !== null && values !== 'null' && keys !== 'page' && keys !== 'pageSize') {
            searchKeys[keys] = new RegExp(values, 'i')
        }
    }

    console.log(searchKeys)

    try {
        const list = await myColl.aggregate([
            {
                '$addFields': {
                    'booking_id': {
                        '$toObjectId': '$booking_id'
                    },
                    'payer_id': {
                        '$toObjectId': '$payer_id'
                    },
                    'receiver_id': {
                        '$toObjectId': '$receiver_id'
                    }
                }
            }, {
                '$lookup': {
                    'from': 'Bookings',
                    'localField': 'booking_id',
                    'foreignField': '_id',
                    'as': 'bookings'
                }
            }, {
                '$lookup': {
                    'from': 'Users',
                    'localField': 'payer_id',
                    'foreignField': '_id',
                    'as': 'payer'
                }
            }, {
                '$lookup': {
                    'from': 'Users',
                    'localField': 'receiver_id',
                    'foreignField': '_id',
                    'as': 'receiver'
                }
            }, {
                '$unwind': {
                    'path': '$payer'
                }
            }, {
                '$unwind': {
                    'path': '$receiver'
                }
            }, {
                '$unwind': {
                    'path': '$bookings'
                }
            }, {
                '$project': {
                    'payer.password': 0,
                    'receiver.password': 0
                }
            },
            {
                '$addFields': {
                    'bookings.userId': {
                        '$toObjectId': '$bookings.userId'
                    },
                    'bookings.hotelId': {
                        '$toObjectId': '$bookings.hotelId'
                    },
                    'bookings.hotelOwnerId': {
                        '$toObjectId': '$bookings.hotelOwnerId'
                    }
                }
            }, {
                '$lookup': {
                    'from': 'Users',
                    'localField': 'bookings.userId',
                    'foreignField': '_id',
                    'as': 'bookings.userDetails'
                }
            }, {
                '$unwind': {
                    'path': '$bookings.userDetails'
                }
            }, {
                '$lookup': {
                    'from': 'Hotels',
                    'localField': 'bookings.hotelId',
                    'foreignField': '_id',
                    'as': 'bookings.hotelDetails'
                }
            }, {
                '$unwind': {
                    'path': '$bookings.hotelDetails'
                }
            },
            {
                $match: searchKeys
            },
        ]).skip(Number(page) || 0).limit(Number(pageSize) || 10).toArray()
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


    try {
        await myColl.updateOne(
            { _id: new ObjectId(_id) },
            {
                $set: {
                    ...rest,
                },
            }
        );

        return NextResponse.json({
            status: 200,
            msg: 'Success',
        });
    } catch (error) {
        return NextResponse.json({
            status: 400,
            error
        });
    }
}

export async function DELETE(req: NextRequest) {
    const body = req.url;
    const id = body?.split("?")[1]?.split("=")[1];

    try {
        const data = await myColl.deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({
            status: 200,
            msg: data
        });
    } catch (error) {
        return NextResponse.json({
            status: 400,
            error
        });
    }
}
