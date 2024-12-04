"use server";
import { NextRequest, NextResponse } from "next/server";
import client from "@/Lib/mongo";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
const myColl = client.collection("Users");

export async function GET(req: NextRequest) {
    const session = await auth()

    const searchParams = <T>(p: string) => req.nextUrl.searchParams.get(p) as T
    const searchParamsKeys = req.nextUrl.searchParams.entries()
    const page: number = searchParams('page')
    const pageSize: number = searchParams('pageSize')

    const searchKeys: { [key: string]: unknown } = {}

    if (!session?.user?._id) {
        return NextResponse.json('User not loggedin', { status: 400 });
    }

    const user = await myColl.findOne({ _id: ObjectId.createFromHexString(session?.user._id as string) })

    switch (user?.userRole) {
        case 'CADMIN':
            searchKeys['companyId'] = user._id
            break;

        case 'HR':
            searchKeys['companyId'] = user.companyId
            break;

        default:
            break;
    }

    for (const [keys, values] of searchParamsKeys) {
        if (ObjectId.isValid(values) && keys !== 'page' && keys !== 'pageSize') {
            searchKeys[keys] = ObjectId.createFromHexString(values)
        } else if (typeof values !== 'undefined' && values !== 'undefined' && values !== null && values !== 'null' && keys !== 'page' && keys !== 'pageSize') {
            searchKeys[keys] = values
        }
    }

    try {
        const user = await myColl.find(searchKeys).limit(Number(pageSize)).skip(Number(page)).toArray()
        const count = await myColl.countDocuments(searchKeys)

        if (user) return NextResponse.json({ list: user, count }, { status: 200 })
        else return NextResponse.json({ msg: 'Not exist' }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ error }, { status: 400, statusText: 'Something error' });
    }
}