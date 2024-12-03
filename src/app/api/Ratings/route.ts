"use server";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Ratings");


export async function GET(req: NextRequest) {
    const searchParamsKeys = req.nextUrl.searchParams.entries()

    const searchKeys: { [key: string]: unknown } = {}

    for (const [keys, values] of searchParamsKeys) {
        if (ObjectId.isValid(values) && keys !== 'user._id') {
            searchKeys[keys] = ObjectId.createFromHexString(values)
        } else if (typeof values !== 'undefined' && values !== 'undefined' && values !== null && values !== 'null') {
            searchKeys[keys] = values
        }
    }

    try {
        const list = await myColl.find(searchKeys).toArray()
        return NextResponse.json(list, { status: 200 });

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
            { _id: _id ? ObjectId.createFromHexString(_id): new ObjectId() },
            {
                $set: {
                    ...data
                },
            },
            {
                upsert: true
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