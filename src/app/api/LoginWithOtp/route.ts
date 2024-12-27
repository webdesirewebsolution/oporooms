"use server";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import client from "@/Lib/mongo";
const myColl = client.collection("Users");
const myOtpColl = client.collection("Otp");

const KEY = process.env.JWT_KEY as string;

export async function GET(req: NextRequest) {
    const contact1 = req.nextUrl.searchParams.get("contact1")
    const otp = req.nextUrl.searchParams.get("otp")

    try {
        const findResult = await myColl.findOne({ contact1: contact1 }, { projection: { password: 0 } })
        const findOtp = await myOtpColl.findOne({ contact1: contact1 })


        if (findOtp?.randomCode == otp) {

            /* Create JWT Payload */
            const payload = {
                id: findResult?._id.toString(),
                contact1: findResult?.newContact,
            };

            /* Sign token */
            const token = jwt.sign(
                payload,
                KEY,
            );

            return NextResponse.json({
                token,
                user: findResult
            }, { status: 200 });
        } else {
            return NextResponse.json({
                error: 'Otp is incorrect'
            }, { status: 400, statusText: 'Otp is incorrect' });
        }

    } catch (error) {
        return NextResponse.json({
            error
        }, { status: 400 });
    }
}
