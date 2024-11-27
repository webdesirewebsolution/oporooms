"use server";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Users");

export async function GET(req: NextRequest) {
    const _id = req.nextUrl.searchParams.get("_id")
    const email = req.nextUrl.searchParams.get("email")

    console.log(_id, email)

    try {
        let filter = {}
        if (_id) filter = { _id: ObjectId.createFromHexString(_id) }
        else if (email) filter = { email }

        const user = await myColl.findOne(filter)
        if (user) return NextResponse.json(user, { status: 200 })
        else return NextResponse.json({ msg: 'Not exist' }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 400, statusText: 'Something error' });
    }
}