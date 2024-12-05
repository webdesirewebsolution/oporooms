"use server";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Policy");
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
const UserColl = client.collection("Users");

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
    const session = await auth()
    const body = await req.json();
    const { contentType, ...rest } =
        body;

    const user = await UserColl.findOne({ _id: ObjectId.createFromHexString(session?.user._id as string) })

    if (session?.user?._id && user?.userRole !== 'SADMIN') {
        return NextResponse.json({
            msg: 'You are not admin',
        }, {
            status: 400
        });
    }


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
        const data = await myColl.deleteOne({ _id: new ObjectId(id) });
        return NextResponse.json({
            msg: data
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error
        }, { status: 400 });
    }
}
