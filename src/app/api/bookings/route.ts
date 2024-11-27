"use server";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Bookings");

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { ...rest } = body;

    try {

        const result = await myColl.insertOne({
            userId: ObjectId.createFromHexString(rest?.userId) as ObjectId,
            companyId: ObjectId.createFromHexString(rest?.companyId) as ObjectId,
            hotelOwnerId: ObjectId.createFromHexString(rest?.hotelOwnerId) as ObjectId,
            hotelId: ObjectId.createFromHexString(rest?.hotelId) as ObjectId,
            details: {
                _id: ObjectId.createFromHexString(rest?.details?._id),
                ...rest?.details
            },
            ...rest,
        });

        return NextResponse.json({ msg: result.insertedId });
    } catch (error) {
        return NextResponse.json({ status: 400, error });
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
        } else if (typeof values !== 'undefined' && values !== 'undefined' && values !== null && values !== 'null' && keys !== 'page' && keys !== 'pageSize') {
            searchKeys[keys] = values
        }
    }

    try {
        const list = await myColl.find(searchKeys).limit(Number(pageSize)).skip(Number(page)).toArray()
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
