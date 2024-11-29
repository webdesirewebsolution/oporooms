"use server";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Policy");
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
    const searchParams = <T>(p: string) => req.nextUrl.searchParams.get(p) as T
    const contentType: number = searchParams('contentType')

    try {
        const result = await myColl.findOne({ contentType })
        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 400, statusText: 'Something error' });
    }
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { contentType, ...rest } =
        body;


    try {
        await myColl.updateOne(
            { contentType },
            {
                $set: {
                    ...rest
                },
            }, {
            upsert: true
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
