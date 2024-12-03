"use server";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Otp");
const UserColl = client.collection("Users");
import { ObjectId } from "mongodb";
import generateCode from "@/Functions/generateCode";
import handleMail from "../mail";

export async function POST(req: NextRequest) {
    const { email, code } = await req.json();

    try {
        const otp = await myColl.findOne({ email })

        if (otp?.randomCode == code) {
            return NextResponse.json({}, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Otp is not correct' }, { status: 400 });
        }

    } catch {
        return NextResponse.json({ error: 'Otp is not correct' }, { status: 400 });
    }
}


export async function GET(req: NextRequest) {
    const searchParams = <T>(p: string) => req.nextUrl.searchParams.get(p) as T
    const email: number = searchParams('email')

    try {
        const result = await myColl.findOne({ email })
        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 400, statusText: 'Something error' });
    }
}

export async function PUT(req: NextRequest) {
    const body = await req.json();
    const { email, type } = body;

    const findUser = await UserColl.findOne({ email })

    console.log(findUser)

    if (type == 'register' && findUser) {
        return NextResponse.json({
            error: 'User already exist'
        }, {
            status: 400,
        });
    } else if (!findUser && type !== 'register') {
        return NextResponse.json({
            error: 'User not exist'
        }, {
            status: 400,
        });
    }

    const randomCode = generateCode()
    await handleMail({
        html: `Otp: ${randomCode}`,
        sub: 'Otp for signin',
        email: email
    })

    try {
        await myColl.updateOne(
            { email },
            {
                $set: {
                    email,
                    randomCode
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
