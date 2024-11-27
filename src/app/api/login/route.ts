"use server";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import client from "@/Lib/mongo";
const myColl = client.collection("Users");

const KEY = process.env.JWT_KEY as string;

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email")
    const password = req.nextUrl.searchParams.get("password") as string

    try {
        const findResult = await myColl.findOne({ email }, { projection: { password: 0 } })
        const findPassword = await myColl.findOne({ email }, { projection: { password: 1 } })

        if (findResult?.userRole == 'SADMIN' && findPassword?.password == password) {
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

        } else if (findResult) {
            const isMatch = await bcrypt.compare(password, findPassword?.password)
            if (isMatch) {
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
                    error: 'Credentials are not correct'
                }, { status: 400, statusText: 'Credentials are not correct' });
            }
        } else {
            return NextResponse.json({
                error: 'Credentials are not correct'
            }, { status: 400, statusText: 'Credentials are not correct' });
        }

    } catch (error) {
        return NextResponse.json({
            error
        }, { status: 400 });
    }
}
