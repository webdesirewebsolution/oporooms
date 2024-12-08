"use server";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Transactions");
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { ...rest } = body;

    try {
        const result = await myColl.insertOne({...rest, createdAt: new Date()});
        return NextResponse.json({ msg: result }, { status: 200 });
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
        if (typeof values !== 'undefined' && values !== 'undefined' && values !== null && values !== 'null' && keys !== 'page' && keys !== 'pageSize') {
            searchKeys[keys] = values
        }
    }

    try {
        const list = await myColl.find(searchKeys).skip(Number(page) || 0).limit(Number(pageSize) || 10).toArray()
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
