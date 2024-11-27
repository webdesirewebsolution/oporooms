"use server";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Users");

export async function POST(req: NextRequest) {
    const { companyId, hrId, password, ...rest } = await req.json();
    const pass = await bcrypt.hash(password, 10)

    console.log(companyId, hrId, pass, rest)

    try {
        const user = await myColl.findOne({ email: rest?.email })

        if (user) {
            return NextResponse.json({ msg: 'User already Exist' }, { status: 400 });
        } else {

            await myColl.insertOne({
                companyId: ObjectId.isValid(companyId) ? ObjectId.createFromHexString(companyId) : null,
                hrId: ObjectId.isValid(hrId) ? ObjectId.createFromHexString(hrId) : null,
                password: pass,
                ...rest
            });

            return NextResponse.json({ msg: 'Success' }, { status: 200 });
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error }, { status: 400 });
    }
}


export async function GET(req: NextRequest) {
    const _id = req.nextUrl.searchParams.get("_id")
    const email = req.nextUrl.searchParams.get("email")

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