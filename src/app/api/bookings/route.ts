"use server";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Bookings");
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { newDate } from "@/Functions";
const UserColl = client.collection("Users");

export async function POST(req: NextRequest) {
    const body = await req.json();

    try {
        const result = await myColl.insertOne({
            ...body, roomDetails: {
                ...body.roomDetails,
                checkIn: newDate(body.roomDetails.checkIn as Date),
                checkOut: newDate(body.roomDetails.checkOut as Date),
            }
        });
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

    const searchKeys: { [key: string]: unknown } = {}

    // if (!session?.user?._id) {
    //     return NextResponse.json('User not loggedin', { status: 400 });
    // }

    const user = session?.user?._id ? await UserColl.findOne({ _id: ObjectId.createFromHexString(session?.user._id as string) }) : {
        userRole: null, _id: null, companyId: null
    }


    // switch (user?.userRole) {
    //     case 'CADMIN':
    //         searchKeys['userDetails.companyId'] = user?._id?.toString();
    //         break;

    //     case 'HR':
    //         searchKeys['userDetails.companyId'] = user?.companyId?.toString();
    //         break;

    //     case 'HotelOwner':
    //         searchKeys['hotelOwnerId'] = user?._id?.toString();
    //         searchKeys['status'] = 'booked';
    //         break;
    // }


    for (const [keys, values] of searchParamsKeys) {
        if (ObjectId.isValid(values) && keys !== 'page' && keys !== 'pageSize' && keys != 'userId' && keys != 'companyId' && keys !== 'hotelOwnerId' && keys !== 'userDetails.companyId') {
            searchKeys[keys] = ObjectId.createFromHexString(values)
        } else if (typeof values !== 'undefined' && values !== 'undefined' && values !== null && values !== 'null' && keys !== 'page' && keys !== 'pageSize') {
            searchKeys[keys] = values
        }
    }


    try {
        const list = await myColl.aggregate(
            [
                {
                    '$match': searchKeys
                },
                {
                    '$addFields': {
                        'hotelObjectId': {
                            '$toObjectId': '$hotelId'
                        }
                    }
                }, {
                    '$lookup': {
                        'from': 'Ratings',
                        'localField': 'hotelObjectId',
                        'foreignField': 'hotelId',
                        'as': 'Ratings'
                    }
                }, {
                    '$addFields': {
                        'totalRating': {
                            '$sum': '$Ratings.value'
                        }
                    }
                }, {
                    '$project': {
                        'hotelObjectId': 0,
                        'Ratings': 0
                    }
                }
            ]
        ).skip(Number(page) || 0).limit(Number(pageSize) || 10).toArray()

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
                    ...rest
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
