"use server";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Users");

export async function POST(req: NextRequest) {
    const { companyId, hrId, ...rest } = await req.json();
    // const pass = await bcrypt.hash(password, 10)

    try {
        const user = await myColl.findOne({ contact1: rest.contact1 })

        if (user) {
            return NextResponse.json({ msg: 'User already Exist' }, { status: 400 });
        } else {

            const data = await myColl.insertOne({
                companyId: ObjectId.isValid(companyId) ? ObjectId.createFromHexString(companyId) : null,
                hrId: ObjectId.isValid(hrId) ? ObjectId.createFromHexString(hrId) : null,
                ...rest
            });

            return NextResponse.json({ msg: data.insertedId }, { status: 200 });
        }

    } catch (error) {
        console.log(error)
        return NextResponse.json({ error }, { status: 400 });
    }
}


export async function GET(req: NextRequest) {
    const _id = req.nextUrl.searchParams.get("_id")
    const email = req.nextUrl.searchParams.get("email")
    const contact1 = req.nextUrl.searchParams.get("contact1")

    try {
        let filter = {}
        if (_id) filter = { _id: ObjectId.createFromHexString(_id) }
        else if (email) filter = { email }
        else if (contact1) filter = { contact1 }

        const user = await myColl.findOne(filter, {
            projection: { 'password': 0 }
        })
        if (user) return NextResponse.json(user, { status: 200 })
        else return NextResponse.json({ msg: 'Not exist' }, { status: 400 });

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
            { _id: ObjectId.createFromHexString(_id) },
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