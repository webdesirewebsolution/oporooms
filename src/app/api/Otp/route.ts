"use server";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
const myColl = client.collection("Otp");
const IpColl = client.collection("Ip");
const UserColl = client.collection("Users");
import { ObjectId } from "mongodb";
import generateCode from "@/Functions/generateCode";
import axios from "axios";
import ip from 'ip'
import moment from "moment";

export async function POST(req: NextRequest) {
    const { contact1, code } = await req.json();

    const newContact = contact1?.split(' ').join('').split('+')[1]

    try {
        const otp = await myColl.findOne({ contact1: newContact })

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
    const { contact1, type } = body;
    const newContact = contact1?.split(' ').join('').split('+')[1]

    const findUser = await UserColl.findOne({ contact1: newContact })
    const userIp = ip.address()
    const maxCount = await IpColl.findOne({ contact1: newContact, userIp })
    const diffInMs = maxCount?.date && moment().diff(new Date(maxCount.date))

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
    } else if (type !== 'register' && maxCount?.otpCount >= 3 && maxCount?.date && (diffInMs / (1000 * 60 * 60)) <= 1) {
        return NextResponse.json({
            error: 'Maximum attempt reached.'
        }, {
            status: 400,
        });
    }

    await IpColl.updateOne(
        { contact1: newContact, userIp: userIp },
        {
            $set: {
                contact1: newContact,
                userIp,
                date: new Date(),
            },
            $inc: {
                otpCount: Number(maxCount?.otpCount) == 3 ? -2 : 1
            },
        }, {
        upsert: true
    }
    );

    const randomCode = generateCode()

    const data = await axios.get(`http://136.243.171.112/api/sendhttp.php?authkey=37336b756d617232383803&mobiles=${newContact}&message=Dear User, Your OTP for Login is ${randomCode}. Please do not share it. With Regards LOOMSTAY.&sender=LMSTAY&route=2&country=91&DLT_TE_ID=1707169925261685090`)

    try {
        await myColl.updateOne(
            { contact1: newContact },
            {
                $set: {
                    contact1: newContact,
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
