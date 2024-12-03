"use server";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import client from "@/Lib/mongo";
const myColl = client.collection("Users");
const myOtpColl = client.collection("Otp");

const KEY = process.env.JWT_KEY as string;

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email")
    const otp = req.nextUrl.searchParams.get("otp")

    try {
        const findResult = await myColl.findOne({ email }, { projection: { password: 0 } })

        const findOtp = await myOtpColl.findOne({ email })

        if (findOtp?.randomCode == otp) {

            /* Create JWT Payload */
            const payload = {
                id: findResult?._id.toString(),
                email: findResult?.email,
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
