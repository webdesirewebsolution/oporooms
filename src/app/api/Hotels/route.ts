"use server";
import { Collection, ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
import { auth } from "@/auth";
import { HotelTypes } from "@/Types/Hotels";
const myColl: Collection<HotelTypes> = client.collection("Hotels");
const UserColl = client.collection("Users");

export async function POST(req: NextRequest) {
    const body: HotelTypes = await req.json();
    const { hotelOwnerId, ...rest } = body;

    try {
        const count = await myColl.countDocuments();
        const hotelUId = `OPO${10000 + Number(count)}`

        await myColl.insertOne({
            hotelOwnerId: ObjectId.createFromHexString(hotelOwnerId as string),
            hotelUId,
            location: {
                type: 'Point',
                coordinates: [rest.address.lat, rest.address.lng]
            },
            ...rest
        });

        return NextResponse.json({ msg: 'Success' }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 400 });
    }
}


export async function GET(req: NextRequest) {
    const session = await auth()

    const searchParams = <T>(p: string) => req.nextUrl.searchParams.get(p) as T
    const searchParamsKeys = req.nextUrl.searchParams.entries()
    const page: number = searchParams('page')
    const pageSize: number = searchParams('pageSize')

    const searchKeys: { [key: string]: unknown } = {}

    if(!session?.user._id){
        return NextResponse.json("User must be signed in", { status: 400, statusText: 'User must be signed in' });
    }

    const user = session?.user?._id ? await UserColl.findOne({ _id: ObjectId.createFromHexString(session?.user?._id as string) }) : { _id: null, userRole: null }

    switch (user?.userRole) {
        case 'HotelOwner':
            searchKeys['hotelOwnerId'] = user?._id
            break;
        default:
            break;
    }

    for (const [keys, values] of searchParamsKeys) {
        if (ObjectId.isValid(values) && keys !== 'page' && keys !== 'pageSize') {
            searchKeys[keys] = ObjectId.createFromHexString(values)
        } else
            if (typeof values !== 'undefined' && values !== 'undefined' && values !== null && values !== 'null' && keys !== 'page' && keys !== 'pageSize') {
                searchKeys[keys] = new RegExp(values, 'i')
            }
    }

    try {
        const list = await myColl.find(searchKeys).limit(Number(pageSize) || 10).skip(Number(page) || 0).toArray()
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
        const data = await myColl.deleteOne({ _id: ObjectId.createFromHexString(id) });
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